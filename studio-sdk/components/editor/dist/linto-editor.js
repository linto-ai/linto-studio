// @__NO_SIDE_EFFECTS__
function Ws(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const me = {}, zn = [], Mt = () => {
}, Qa = () => !1, wr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Us = (t) => t.startsWith("onUpdate:"), Te = Object.assign, Ks = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Iu = Object.prototype.hasOwnProperty, ge = (t, e) => Iu.call(t, e), ee = Array.isArray, Nn = (t) => Pi(t) === "[object Map]", el = (t) => Pi(t) === "[object Set]", ko = (t) => Pi(t) === "[object Date]", le = (t) => typeof t == "function", ke = (t) => typeof t == "string", yt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", tl = (t) => (be(t) || le(t)) && le(t.then) && le(t.catch), nl = Object.prototype.toString, Pi = (t) => nl.call(t), Mu = (t) => Pi(t).slice(8, -1), _r = (t) => Pi(t) === "[object Object]", xr = (t) => ke(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, li = /* @__PURE__ */ Ws(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Sr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Ru = /-\w/g, Fe = Sr(
  (t) => t.replace(Ru, (e) => e.slice(1).toUpperCase())
), Lu = /\B([A-Z])/g, nt = Sr(
  (t) => t.replace(Lu, "-$1").toLowerCase()
), Cr = Sr((t) => t.charAt(0).toUpperCase() + t.slice(1)), Ui = Sr(
  (t) => t ? `on${Cr(t)}` : ""
), Ke = (t, e) => !Object.is(t, e), Xr = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, il = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, Du = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, _s = (t) => {
  const e = ke(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let To;
const Er = () => To || (To = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function St(t) {
  if (ee(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = ke(i) ? zu(i) : St(i);
      if (r)
        for (const s in r)
          e[s] = r[s];
    }
    return e;
  } else if (ke(t) || be(t))
    return t;
}
const $u = /;(?![^(]*\))/g, Bu = /:([^]+)/, Fu = /\/\*[^]*?\*\//g;
function zu(t) {
  const e = {};
  return t.replace(Fu, "").split($u).forEach((n) => {
    if (n) {
      const i = n.split(Bu);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function $t(t) {
  let e = "";
  if (ke(t))
    e = t;
  else if (ee(t))
    for (let n = 0; n < t.length; n++) {
      const i = $t(t[n]);
      i && (e += i + " ");
    }
  else if (be(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Gs(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !ke(e) && (t.class = $t(e)), n && (t.style = St(n)), t;
}
const Nu = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", qu = /* @__PURE__ */ Ws(Nu);
function rl(t) {
  return !!t || t === "";
}
function Hu(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = Xs(t[i], e[i]);
  return n;
}
function Xs(t, e) {
  if (t === e) return !0;
  let n = ko(t), i = ko(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = yt(t), i = yt(e), n || i)
    return t === e;
  if (n = ee(t), i = ee(e), n || i)
    return n && i ? Hu(t, e) : !1;
  if (n = be(t), i = be(e), n || i) {
    if (!n || !i)
      return !1;
    const r = Object.keys(t).length, s = Object.keys(e).length;
    if (r !== s)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Xs(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const sl = (t) => !!(t && t.__v_isRef === !0), fe = (t) => ke(t) ? t : t == null ? "" : ee(t) || be(t) && (t.toString === nl || !le(t.toString)) ? sl(t) ? fe(t.value) : JSON.stringify(t, ol, 2) : String(t), ol = (t, e) => sl(e) ? ol(t, e.value) : Nn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, r], s) => (n[Yr(i, s) + " =>"] = r, n),
    {}
  )
} : el(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Yr(n))
} : yt(e) ? Yr(e) : be(e) && !ee(e) && !_r(e) ? String(e) : e, Yr = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    yt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let Ve;
class al {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = Ve, !e && Ve && (this.index = (Ve.scopes || (Ve.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let e, n;
      if (this.scopes)
        for (e = 0, n = this.scopes.length; e < n; e++)
          this.scopes[e].pause();
      for (e = 0, n = this.effects.length; e < n; e++)
        this.effects[e].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let e, n;
      if (this.scopes)
        for (e = 0, n = this.scopes.length; e < n; e++)
          this.scopes[e].resume();
      for (e = 0, n = this.effects.length; e < n; e++)
        this.effects[e].resume();
    }
  }
  run(e) {
    if (this._active) {
      const n = Ve;
      try {
        return Ve = this, e();
      } finally {
        Ve = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ve, Ve = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Ve = this.prevScope, this.prevScope = void 0);
  }
  stop(e) {
    if (this._active) {
      this._active = !1;
      let n, i;
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, i = this.scopes.length; n < i; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !e) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function ll(t) {
  return new al(t);
}
function Ys() {
  return Ve;
}
function cl(t, e = !1) {
  Ve && Ve.cleanups.push(t);
}
let Ce;
const Jr = /* @__PURE__ */ new WeakSet();
class ul {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ve && Ve.active && Ve.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Jr.has(this) && (Jr.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || fl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ao(this), pl(this);
    const e = Ce, n = gt;
    Ce = this, gt = !0;
    try {
      return this.fn();
    } finally {
      hl(this), Ce = e, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Qs(e);
      this.deps = this.depsTail = void 0, Ao(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Jr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    xs(this) && this.run();
  }
  get dirty() {
    return xs(this);
  }
}
let dl = 0, ci, ui;
function fl(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = ui, ui = t;
    return;
  }
  t.next = ci, ci = t;
}
function Js() {
  dl++;
}
function Zs() {
  if (--dl > 0)
    return;
  if (ui) {
    let e = ui;
    for (ui = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; ci; ) {
    let e = ci;
    for (ci = void 0; e; ) {
      const n = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (i) {
          t || (t = i);
        }
      e = n;
    }
  }
  if (t) throw t;
}
function pl(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function hl(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const r = i.prevDep;
    i.version === -1 ? (i === n && (n = r), Qs(i), Vu(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  t.deps = e, t.depsTail = n;
}
function xs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (vl(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function vl(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === gi) || (t.globalVersion = gi, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !xs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Ce, i = gt;
  Ce = t, gt = !0;
  try {
    pl(t);
    const r = t.fn(t._value);
    (e.version === 0 || Ke(r, t._value)) && (t.flags |= 128, t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    Ce = n, gt = i, hl(t), t.flags &= -3;
  }
}
function Qs(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: r } = t;
  if (i && (i.nextSub = r, t.prevSub = void 0), r && (r.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Qs(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Vu(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let gt = !0;
const ml = [];
function Yt() {
  ml.push(gt), gt = !1;
}
function Jt() {
  const t = ml.pop();
  gt = t === void 0 ? !0 : t;
}
function Ao(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = Ce;
    Ce = void 0;
    try {
      e();
    } finally {
      Ce = n;
    }
  }
}
let gi = 0;
class ju {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class kr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!Ce || !gt || Ce === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Ce)
      n = this.activeLink = new ju(Ce, this), Ce.deps ? (n.prevDep = Ce.depsTail, Ce.depsTail.nextDep = n, Ce.depsTail = n) : Ce.deps = Ce.depsTail = n, gl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = Ce.depsTail, n.nextDep = void 0, Ce.depsTail.nextDep = n, Ce.depsTail = n, Ce.deps === n && (Ce.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, gi++, this.notify(e);
  }
  notify(e) {
    Js();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Zs();
    }
  }
}
function gl(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        gl(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const ir = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ Symbol(
  ""
), Ss = /* @__PURE__ */ Symbol(
  ""
), yi = /* @__PURE__ */ Symbol(
  ""
);
function je(t, e, n) {
  if (gt && Ce) {
    let i = ir.get(t);
    i || ir.set(t, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new kr()), r.map = i, r.key = n), r.track();
  }
}
function Kt(t, e, n, i, r, s) {
  const o = ir.get(t);
  if (!o) {
    gi++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (Js(), e === "clear")
    o.forEach(a);
  else {
    const l = ee(t), c = l && xr(n);
    if (l && n === "length") {
      const u = Number(i);
      o.forEach((d, p) => {
        (p === "length" || p === yi || !yt(p) && p >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), c && a(o.get(yi)), e) {
        case "add":
          l ? c && a(o.get("length")) : (a(o.get(En)), Nn(t) && a(o.get(Ss)));
          break;
        case "delete":
          l || (a(o.get(En)), Nn(t) && a(o.get(Ss)));
          break;
        case "set":
          Nn(t) && a(o.get(En));
          break;
      }
  }
  Zs();
}
function Wu(t, e) {
  const n = ir.get(t);
  return n && n.get(e);
}
function Rn(t) {
  const e = /* @__PURE__ */ ve(t);
  return e === t ? e : (je(e, "iterate", yi), /* @__PURE__ */ ot(t) ? e : e.map(bt));
}
function Tr(t) {
  return je(t = /* @__PURE__ */ ve(t), "iterate", yi), t;
}
function ln(t, e) {
  return /* @__PURE__ */ Zt(t) ? Wn(/* @__PURE__ */ kn(t) ? bt(e) : e) : bt(e);
}
const Uu = {
  __proto__: null,
  [Symbol.iterator]() {
    return Zr(this, Symbol.iterator, (t) => ln(this, t));
  },
  concat(...t) {
    return Rn(this).concat(
      ...t.map((e) => ee(e) ? Rn(e) : e)
    );
  },
  entries() {
    return Zr(this, "entries", (t) => (t[1] = ln(this, t[1]), t));
  },
  every(t, e) {
    return Vt(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return Vt(
      this,
      "filter",
      t,
      e,
      (n) => n.map((i) => ln(this, i)),
      arguments
    );
  },
  find(t, e) {
    return Vt(
      this,
      "find",
      t,
      e,
      (n) => ln(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return Vt(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return Vt(
      this,
      "findLast",
      t,
      e,
      (n) => ln(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return Vt(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return Vt(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Qr(this, "includes", t);
  },
  indexOf(...t) {
    return Qr(this, "indexOf", t);
  },
  join(t) {
    return Rn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Qr(this, "lastIndexOf", t);
  },
  map(t, e) {
    return Vt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return ti(this, "pop");
  },
  push(...t) {
    return ti(this, "push", t);
  },
  reduce(t, ...e) {
    return Po(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Po(this, "reduceRight", t, e);
  },
  shift() {
    return ti(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return Vt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return ti(this, "splice", t);
  },
  toReversed() {
    return Rn(this).toReversed();
  },
  toSorted(t) {
    return Rn(this).toSorted(t);
  },
  toSpliced(...t) {
    return Rn(this).toSpliced(...t);
  },
  unshift(...t) {
    return ti(this, "unshift", t);
  },
  values() {
    return Zr(this, "values", (t) => ln(this, t));
  }
};
function Zr(t, e, n) {
  const i = Tr(t), r = i[e]();
  return i !== t && !/* @__PURE__ */ ot(t) && (r._next = r.next, r.next = () => {
    const s = r._next();
    return s.done || (s.value = n(s.value)), s;
  }), r;
}
const Ku = Array.prototype;
function Vt(t, e, n, i, r, s) {
  const o = Tr(t), a = o !== t && !/* @__PURE__ */ ot(t), l = o[e];
  if (l !== Ku[e]) {
    const d = l.apply(t, s);
    return a ? bt(d) : d;
  }
  let c = n;
  o !== t && (a ? c = function(d, p) {
    return n.call(this, ln(t, d), p, t);
  } : n.length > 2 && (c = function(d, p) {
    return n.call(this, d, p, t);
  }));
  const u = l.call(o, c, i);
  return a && r ? r(u) : u;
}
function Po(t, e, n, i) {
  const r = Tr(t);
  let s = n;
  return r !== t && (/* @__PURE__ */ ot(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, ln(t, a), l, t);
  }), r[e](s, ...i);
}
function Qr(t, e, n) {
  const i = /* @__PURE__ */ ve(t);
  je(i, "iterate", yi);
  const r = i[e](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ Or(n[0]) ? (n[0] = /* @__PURE__ */ ve(n[0]), i[e](...n)) : r;
}
function ti(t, e, n = []) {
  Yt(), Js();
  const i = (/* @__PURE__ */ ve(t))[e].apply(t, n);
  return Zs(), Jt(), i;
}
const Gu = /* @__PURE__ */ Ws("__proto__,__v_isRef,__isVue"), yl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(yt)
);
function Xu(t) {
  yt(t) || (t = String(t));
  const e = /* @__PURE__ */ ve(this);
  return je(e, "has", t), e.hasOwnProperty(t);
}
class bl {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, i) {
    if (n === "__v_skip") return e.__v_skip;
    const r = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return i === (r ? s ? El : Cl : s ? Sl : xl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = ee(e);
    if (!r) {
      let l;
      if (o && (l = Uu[n]))
        return l;
      if (n === "hasOwnProperty")
        return Xu;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Be(e) ? e : i
    );
    if ((yt(n) ? yl.has(n) : Gu(n)) || (r || je(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ Be(a)) {
      const l = o && xr(n) ? a : a.value;
      return r && be(l) ? /* @__PURE__ */ rr(l) : l;
    }
    return be(a) ? r ? /* @__PURE__ */ rr(a) : /* @__PURE__ */ Oi(a) : a;
  }
}
class wl extends bl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, r) {
    let s = e[n];
    const o = ee(e) && xr(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Zt(s);
      if (!/* @__PURE__ */ ot(i) && !/* @__PURE__ */ Zt(i) && (s = /* @__PURE__ */ ve(s), i = /* @__PURE__ */ ve(i)), !o && /* @__PURE__ */ Be(s) && !/* @__PURE__ */ Be(i))
        return c || (s.value = i), !0;
    }
    const a = o ? Number(n) < e.length : ge(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Be(e) ? e : r
    );
    return e === /* @__PURE__ */ ve(r) && (a ? Ke(i, s) && Kt(e, "set", n, i) : Kt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = ge(e, n);
    e[n];
    const r = Reflect.deleteProperty(e, n);
    return r && i && Kt(e, "delete", n, void 0), r;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!yt(n) || !yl.has(n)) && je(e, "has", n), i;
  }
  ownKeys(e) {
    return je(
      e,
      "iterate",
      ee(e) ? "length" : En
    ), Reflect.ownKeys(e);
  }
}
class _l extends bl {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, n) {
    return !0;
  }
  deleteProperty(e, n) {
    return !0;
  }
}
const Yu = /* @__PURE__ */ new wl(), Ju = /* @__PURE__ */ new _l(), Zu = /* @__PURE__ */ new wl(!0), Qu = /* @__PURE__ */ new _l(!0), Cs = (t) => t, Bi = (t) => Reflect.getPrototypeOf(t);
function ed(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = /* @__PURE__ */ ve(r), o = Nn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? Cs : e ? Wn : bt;
    return !e && je(
      s,
      "iterate",
      l ? Ss : En
    ), Te(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: d, done: p } = c.next();
          return p ? { value: d, done: p } : {
            value: a ? [u(d[0]), u(d[1])] : u(d),
            done: p
          };
        }
      }
    );
  };
}
function Fi(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function td(t, e) {
  const n = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(r);
      t || (Ke(r, a) && je(o, "get", r), je(o, "get", a));
      const { has: l } = Bi(o), c = e ? Cs : t ? Wn : bt;
      if (l.call(o, r))
        return c(s.get(r));
      if (l.call(o, a))
        return c(s.get(a));
      s !== o && s.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !t && je(/* @__PURE__ */ ve(r), "iterate", En), r.size;
    },
    has(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(r);
      return t || (Ke(r, a) && je(o, "has", r), je(o, "has", a)), r === a ? s.has(r) : s.has(r) || s.has(a);
    },
    forEach(r, s) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ ve(a), c = e ? Cs : t ? Wn : bt;
      return !t && je(l, "iterate", En), a.forEach((u, d) => r.call(s, c(u), c(d), o));
    }
  };
  return Te(
    n,
    t ? {
      add: Fi("add"),
      set: Fi("set"),
      delete: Fi("delete"),
      clear: Fi("clear")
    } : {
      add(r) {
        !e && !/* @__PURE__ */ ot(r) && !/* @__PURE__ */ Zt(r) && (r = /* @__PURE__ */ ve(r));
        const s = /* @__PURE__ */ ve(this);
        return Bi(s).has.call(s, r) || (s.add(r), Kt(s, "add", r, r)), this;
      },
      set(r, s) {
        !e && !/* @__PURE__ */ ot(s) && !/* @__PURE__ */ Zt(s) && (s = /* @__PURE__ */ ve(s));
        const o = /* @__PURE__ */ ve(this), { has: a, get: l } = Bi(o);
        let c = a.call(o, r);
        c || (r = /* @__PURE__ */ ve(r), c = a.call(o, r));
        const u = l.call(o, r);
        return o.set(r, s), c ? Ke(s, u) && Kt(o, "set", r, s) : Kt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ ve(this), { has: o, get: a } = Bi(s);
        let l = o.call(s, r);
        l || (r = /* @__PURE__ */ ve(r), l = o.call(s, r)), a && a.call(s, r);
        const c = s.delete(r);
        return l && Kt(s, "delete", r, void 0), c;
      },
      clear() {
        const r = /* @__PURE__ */ ve(this), s = r.size !== 0, o = r.clear();
        return s && Kt(
          r,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = ed(r, t, e);
  }), n;
}
function Ar(t, e) {
  const n = td(t, e);
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(
    ge(n, r) && r in i ? n : i,
    r,
    s
  );
}
const nd = {
  get: /* @__PURE__ */ Ar(!1, !1)
}, id = {
  get: /* @__PURE__ */ Ar(!1, !0)
}, rd = {
  get: /* @__PURE__ */ Ar(!0, !1)
}, sd = {
  get: /* @__PURE__ */ Ar(!0, !0)
}, xl = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap(), Cl = /* @__PURE__ */ new WeakMap(), El = /* @__PURE__ */ new WeakMap();
function od(t) {
  switch (t) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function ad(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : od(Mu(t));
}
// @__NO_SIDE_EFFECTS__
function Oi(t) {
  return /* @__PURE__ */ Zt(t) ? t : Pr(
    t,
    !1,
    Yu,
    nd,
    xl
  );
}
// @__NO_SIDE_EFFECTS__
function Ii(t) {
  return Pr(
    t,
    !1,
    Zu,
    id,
    Sl
  );
}
// @__NO_SIDE_EFFECTS__
function rr(t) {
  return Pr(
    t,
    !0,
    Ju,
    rd,
    Cl
  );
}
// @__NO_SIDE_EFFECTS__
function Ln(t) {
  return Pr(
    t,
    !0,
    Qu,
    sd,
    El
  );
}
function Pr(t, e, n, i, r) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = ad(t);
  if (s === 0)
    return t;
  const o = r.get(t);
  if (o)
    return o;
  const a = new Proxy(
    t,
    s === 2 ? i : n
  );
  return r.set(t, a), a;
}
// @__NO_SIDE_EFFECTS__
function kn(t) {
  return /* @__PURE__ */ Zt(t) ? /* @__PURE__ */ kn(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Zt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function ot(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Or(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ve(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ ve(e) : t;
}
function kl(t) {
  return !ge(t, "__v_skip") && Object.isExtensible(t) && il(t, "__v_skip", !0), t;
}
const bt = (t) => be(t) ? /* @__PURE__ */ Oi(t) : t, Wn = (t) => be(t) ? /* @__PURE__ */ rr(t) : t;
// @__NO_SIDE_EFFECTS__
function Be(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(t) {
  return Tl(t, !1);
}
// @__NO_SIDE_EFFECTS__
function dn(t) {
  return Tl(t, !0);
}
function Tl(t, e) {
  return /* @__PURE__ */ Be(t) ? t : new ld(t, e);
}
class ld {
  constructor(e, n) {
    this.dep = new kr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ve(e), this._value = n ? e : bt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ ot(e) || /* @__PURE__ */ Zt(e);
    e = i ? e : /* @__PURE__ */ ve(e), Ke(e, n) && (this._rawValue = e, this._value = i ? e : bt(e), this.dep.trigger());
  }
}
function v(t) {
  return /* @__PURE__ */ Be(t) ? t.value : t;
}
function Je(t) {
  return le(t) ? t() : v(t);
}
const cd = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const r = t[e];
    return /* @__PURE__ */ Be(r) && !/* @__PURE__ */ Be(n) ? (r.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function Al(t) {
  return /* @__PURE__ */ kn(t) ? t : new Proxy(t, cd);
}
class ud {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new kr(), { get: i, set: r } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = r;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function Pl(t) {
  return new ud(t);
}
// @__NO_SIDE_EFFECTS__
function Yn(t) {
  const e = ee(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = Ol(t, n);
  return e;
}
class dd {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ve(e);
    let r = !0, s = e;
    if (!ee(e) || !xr(String(n)))
      do
        r = !/* @__PURE__ */ Or(s) || /* @__PURE__ */ ot(s);
      while (r && (s = s.__v_raw));
    this._shallow = r;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = v(e)), this._value = e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    if (this._shallow && /* @__PURE__ */ Be(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ Be(n)) {
        n.value = e;
        return;
      }
    }
    this._object[this._key] = e;
  }
  get dep() {
    return Wu(this._raw, this._key);
  }
}
class fd {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Ki(t, e, n) {
  return /* @__PURE__ */ Be(t) ? t : le(t) ? new fd(t) : be(t) && arguments.length > 1 ? Ol(t, e, n) : /* @__PURE__ */ z(t);
}
function Ol(t, e, n) {
  return new dd(t, e, n);
}
class pd {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new kr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = gi - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Ce !== this)
      return fl(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return vl(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function hd(t, e, n = !1) {
  let i, r;
  return le(t) ? i = t : (i = t.get, r = t.set), new pd(i, r, n);
}
const zi = {}, sr = /* @__PURE__ */ new WeakMap();
let _n;
function vd(t, e = !1, n = _n) {
  if (n) {
    let i = sr.get(n);
    i || sr.set(n, i = []), i.push(t);
  }
}
function md(t, e, n = me) {
  const { immediate: i, deep: r, once: s, scheduler: o, augmentJob: a, call: l } = n, c = (g) => r ? g : /* @__PURE__ */ ot(g) || r === !1 || r === 0 ? Gt(g, 1) : Gt(g);
  let u, d, p, f, h = !1, m = !1;
  if (/* @__PURE__ */ Be(t) ? (d = () => t.value, h = /* @__PURE__ */ ot(t)) : /* @__PURE__ */ kn(t) ? (d = () => c(t), h = !0) : ee(t) ? (m = !0, h = t.some((g) => /* @__PURE__ */ kn(g) || /* @__PURE__ */ ot(g)), d = () => t.map((g) => {
    if (/* @__PURE__ */ Be(g))
      return g.value;
    if (/* @__PURE__ */ kn(g))
      return c(g);
    if (le(g))
      return l ? l(g, 2) : g();
  })) : le(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (p) {
      Yt();
      try {
        p();
      } finally {
        Jt();
      }
    }
    const g = _n;
    _n = u;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      _n = g;
    }
  } : d = Mt, e && r) {
    const g = d, E = r === !0 ? 1 / 0 : r;
    d = () => Gt(g(), E);
  }
  const y = Ys(), C = () => {
    u.stop(), y && y.active && Ks(y.effects, u);
  };
  if (s && e) {
    const g = e;
    e = (...E) => {
      g(...E), C();
    };
  }
  let _ = m ? new Array(t.length).fill(zi) : zi;
  const b = (g) => {
    if (!(!(u.flags & 1) || !u.dirty && !g))
      if (e) {
        const E = u.run();
        if (r || h || (m ? E.some((k, x) => Ke(k, _[x])) : Ke(E, _))) {
          p && p();
          const k = _n;
          _n = u;
          try {
            const x = [
              E,
              // pass undefined as the old value when it's changed for the first time
              _ === zi ? void 0 : m && _[0] === zi ? [] : _,
              f
            ];
            _ = E, l ? l(e, 3, x) : (
              // @ts-expect-error
              e(...x)
            );
          } finally {
            _n = k;
          }
        }
      } else
        u.run();
  };
  return a && a(b), u = new ul(d), u.scheduler = o ? () => o(b, !1) : b, f = (g) => vd(g, !1, u), p = u.onStop = () => {
    const g = sr.get(u);
    if (g) {
      if (l)
        l(g, 4);
      else
        for (const E of g) E();
      sr.delete(u);
    }
  }, e ? i ? b(!0) : _ = u.run() : o ? o(b.bind(null, !0), !0) : u.run(), C.pause = u.pause.bind(u), C.resume = u.resume.bind(u), C.stop = C, C;
}
function Gt(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Be(t))
    Gt(t.value, e, n);
  else if (ee(t))
    for (let i = 0; i < t.length; i++)
      Gt(t[i], e, n);
  else if (el(t) || Nn(t))
    t.forEach((i) => {
      Gt(i, e, n);
    });
  else if (_r(t)) {
    for (const i in t)
      Gt(t[i], e, n);
    for (const i of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, i) && Gt(t[i], e, n);
  }
  return t;
}
function Mi(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (r) {
    Ir(r, e, n);
  }
}
function wt(t, e, n, i) {
  if (le(t)) {
    const r = Mi(t, e, n, i);
    return r && tl(r) && r.catch((s) => {
      Ir(s, e, n);
    }), r;
  }
  if (ee(t)) {
    const r = [];
    for (let s = 0; s < t.length; s++)
      r.push(wt(t[s], e, n, i));
    return r;
  }
}
function Ir(t, e, n, i = !0) {
  const r = e ? e.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: o } = e && e.appContext.config || me;
  if (e) {
    let a = e.parent;
    const l = e.proxy, c = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const u = a.ec;
      if (u) {
        for (let d = 0; d < u.length; d++)
          if (u[d](t, l, c) === !1)
            return;
      }
      a = a.parent;
    }
    if (s) {
      Yt(), Mi(s, null, 10, [
        t,
        l,
        c
      ]), Jt();
      return;
    }
  }
  gd(t, n, r, i, o);
}
function gd(t, e, n, i = !0, r = !1) {
  if (r)
    throw t;
  console.error(t);
}
const Ge = [];
let At = -1;
const qn = [];
let cn = null, Bn = 0;
const Il = /* @__PURE__ */ Promise.resolve();
let or = null;
function Me(t) {
  const e = or || Il;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function yd(t) {
  let e = At + 1, n = Ge.length;
  for (; e < n; ) {
    const i = e + n >>> 1, r = Ge[i], s = bi(r);
    s < t || s === t && r.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function eo(t) {
  if (!(t.flags & 1)) {
    const e = bi(t), n = Ge[Ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= bi(n) ? Ge.push(t) : Ge.splice(yd(e), 0, t), t.flags |= 1, Ml();
  }
}
function Ml() {
  or || (or = Il.then(Ll));
}
function bd(t) {
  ee(t) ? qn.push(...t) : cn && t.id === -1 ? cn.splice(Bn + 1, 0, t) : t.flags & 1 || (qn.push(t), t.flags |= 1), Ml();
}
function Oo(t, e, n = At + 1) {
  for (; n < Ge.length; n++) {
    const i = Ge[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      Ge.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function Rl(t) {
  if (qn.length) {
    const e = [...new Set(qn)].sort(
      (n, i) => bi(n) - bi(i)
    );
    if (qn.length = 0, cn) {
      cn.push(...e);
      return;
    }
    for (cn = e, Bn = 0; Bn < cn.length; Bn++) {
      const n = cn[Bn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    cn = null, Bn = 0;
  }
}
const bi = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function Ll(t) {
  try {
    for (At = 0; At < Ge.length; At++) {
      const e = Ge[At];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Mi(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; At < Ge.length; At++) {
      const e = Ge[At];
      e && (e.flags &= -2);
    }
    At = -1, Ge.length = 0, Rl(), or = null, (Ge.length || qn.length) && Ll();
  }
}
let Ne = null, Dl = null;
function ar(t) {
  const e = Ne;
  return Ne = t, Dl = t && t.type.__scopeId || null, e;
}
function q(t, e = Ne, n) {
  if (!e || t._n)
    return t;
  const i = (...r) => {
    i._d && ur(-1);
    const s = ar(e);
    let o;
    try {
      o = t(...r);
    } finally {
      ar(s), i._d && ur(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function wd(t, e) {
  if (Ne === null)
    return t;
  const n = Br(Ne), i = t.dirs || (t.dirs = []);
  for (let r = 0; r < e.length; r++) {
    let [s, o, a, l = me] = e[r];
    s && (le(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && Gt(o), i.push({
      dir: s,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: a,
      modifiers: l
    }));
  }
  return t;
}
function gn(t, e, n, i) {
  const r = t.dirs, s = e && e.dirs;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s && (a.oldValue = s[o].value);
    let l = a.dir[i];
    l && (Yt(), wt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Jt());
  }
}
function Jn(t, e) {
  if (We) {
    let n = We.provides;
    const i = We.parent && We.parent.provides;
    i === n && (n = We.provides = Object.create(i)), n[t] = e;
  }
}
function Xt(t, e, n = !1) {
  const i = lt();
  if (i || Vn) {
    let r = Vn ? Vn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (r && t in r)
      return r[t];
    if (arguments.length > 1)
      return n && le(e) ? e.call(i && i.proxy) : e;
  }
}
const _d = /* @__PURE__ */ Symbol.for("v-scx"), xd = () => Xt(_d);
function pt(t, e) {
  return Ri(t, null, e);
}
function $l(t, e) {
  return Ri(
    t,
    null,
    { flush: "post" }
  );
}
function Sd(t, e) {
  return Ri(
    t,
    null,
    { flush: "sync" }
  );
}
function ye(t, e, n) {
  return Ri(t, e, n);
}
function Ri(t, e, n = me) {
  const { immediate: i, deep: r, flush: s, once: o } = n, a = Te({}, n), l = e && i || !e && s !== "post";
  let c;
  if (Si) {
    if (s === "sync") {
      const f = xd();
      c = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = Mt, f.resume = Mt, f.pause = Mt, f;
    }
  }
  const u = We;
  a.call = (f, h, m) => wt(f, u, h, m);
  let d = !1;
  s === "post" ? a.scheduler = (f) => {
    He(f, u && u.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (f, h) => {
    h ? f() : eo(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, u && (f.id = u.uid, f.i = u));
  };
  const p = md(t, e, a);
  return Si && (c ? c.push(p) : l && p()), p;
}
function Cd(t, e, n) {
  const i = this.proxy, r = ke(t) ? t.includes(".") ? Bl(i, t) : () => i[t] : t.bind(i, i);
  let s;
  le(e) ? s = e : (s = e.handler, n = e);
  const o = Li(this), a = Ri(r, s.bind(i), n);
  return o(), a;
}
function Bl(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const Fl = /* @__PURE__ */ Symbol("_vte"), zl = (t) => t.__isTeleport, di = (t) => t && (t.disabled || t.disabled === ""), Io = (t) => t && (t.defer || t.defer === ""), Mo = (t) => typeof SVGElement < "u" && t instanceof SVGElement, Ro = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, Es = (t, e) => {
  const n = t && t.to;
  return ke(n) ? e ? e(n) : null : n;
}, Nl = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, r, s, o, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: p,
      o: { insert: f, querySelector: h, createText: m, createComment: y }
    } = c, C = di(e.props);
    let { shapeFlag: _, children: b, dynamicChildren: g } = e;
    if (t == null) {
      const E = e.el = m(""), k = e.anchor = m("");
      f(E, n, i), f(k, n, i);
      const x = (T, A) => {
        _ & 16 && u(
          b,
          T,
          A,
          r,
          s,
          o,
          a,
          l
        );
      }, M = () => {
        const T = e.target = Es(e.props, h), A = ks(T, e, m, f);
        T && (o !== "svg" && Mo(T) ? o = "svg" : o !== "mathml" && Ro(T) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(T), C || (x(T, A), Gi(e, !1)));
      };
      C && (x(n, k), Gi(e, !0)), Io(e.props) ? (e.el.__isMounted = !1, He(() => {
        M(), delete e.el.__isMounted;
      }, s)) : M();
    } else {
      if (Io(e.props) && t.el.__isMounted === !1) {
        He(() => {
          Nl.process(
            t,
            e,
            n,
            i,
            r,
            s,
            o,
            a,
            l,
            c
          );
        }, s);
        return;
      }
      e.el = t.el, e.targetStart = t.targetStart;
      const E = e.anchor = t.anchor, k = e.target = t.target, x = e.targetAnchor = t.targetAnchor, M = di(t.props), T = M ? n : k, A = M ? E : x;
      if (o === "svg" || Mo(k) ? o = "svg" : (o === "mathml" || Ro(k)) && (o = "mathml"), g ? (p(
        t.dynamicChildren,
        g,
        T,
        r,
        s,
        o,
        a
      ), ro(t, e, !0)) : l || d(
        t,
        e,
        T,
        A,
        r,
        s,
        o,
        a,
        !1
      ), C)
        M ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : Ni(
          e,
          n,
          E,
          c,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const L = e.target = Es(
          e.props,
          h
        );
        L && Ni(
          e,
          L,
          null,
          c,
          0
        );
      } else M && Ni(
        e,
        k,
        x,
        c,
        1
      );
      Gi(e, C);
    }
  },
  remove(t, e, n, { um: i, o: { remove: r } }, s) {
    const {
      shapeFlag: o,
      children: a,
      anchor: l,
      targetStart: c,
      targetAnchor: u,
      target: d,
      props: p
    } = t;
    if (d && (r(c), r(u)), s && r(l), o & 16) {
      const f = s || !di(p);
      for (let h = 0; h < a.length; h++) {
        const m = a[h];
        i(
          m,
          e,
          n,
          f,
          !!m.dynamicChildren
        );
      }
    }
  },
  move: Ni,
  hydrate: Ed
};
function Ni(t, e, n, { o: { insert: i }, m: r }, s = 2) {
  s === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: c, props: u } = t, d = s === 2;
  if (d && i(o, e, n), (!d || di(u)) && l & 16)
    for (let p = 0; p < c.length; p++)
      r(
        c[p],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function Ed(t, e, n, i, r, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function p(y, C) {
    let _ = C;
    for (; _; ) {
      if (_ && _.nodeType === 8) {
        if (_.data === "teleport start anchor")
          e.targetStart = _;
        else if (_.data === "teleport anchor") {
          e.targetAnchor = _, y._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      _ = o(_);
    }
  }
  function f(y, C) {
    C.anchor = d(
      o(y),
      C,
      a(y),
      n,
      i,
      r,
      s
    );
  }
  const h = e.target = Es(
    e.props,
    l
  ), m = di(e.props);
  if (h) {
    const y = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (m ? (f(t, e), p(h, y), e.targetAnchor || ks(
      h,
      e,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = o(t), p(h, y), e.targetAnchor || ks(h, e, u, c), d(
      y && o(y),
      e,
      h,
      n,
      i,
      r,
      s
    ))), Gi(e, m);
  } else m && e.shapeFlag & 16 && (f(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const ql = Nl;
function Gi(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, r;
    for (e ? (i = t.el, r = t.anchor) : (i = t.targetStart, r = t.targetAnchor); i && i !== r; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function ks(t, e, n, i, r = null) {
  const s = e.targetStart = n(""), o = e.targetAnchor = n("");
  return s[Fl] = o, t && (i(s, t, r), i(o, t, r)), o;
}
const Pt = /* @__PURE__ */ Symbol("_leaveCb"), ni = /* @__PURE__ */ Symbol("_enterCb");
function kd() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return De(() => {
    t.isMounted = !0;
  }), hn(() => {
    t.isUnmounting = !0;
  }), t;
}
const ut = [Function, Array], Hl = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: ut,
  onEnter: ut,
  onAfterEnter: ut,
  onEnterCancelled: ut,
  // leave
  onBeforeLeave: ut,
  onLeave: ut,
  onAfterLeave: ut,
  onLeaveCancelled: ut,
  // appear
  onBeforeAppear: ut,
  onAppear: ut,
  onAfterAppear: ut,
  onAppearCancelled: ut
}, Vl = (t) => {
  const e = t.subTree;
  return e.component ? Vl(e.component) : e;
}, Td = {
  name: "BaseTransition",
  props: Hl,
  setup(t, { slots: e }) {
    const n = lt(), i = kd();
    return () => {
      const r = e.default && Ul(e.default(), !0);
      if (!r || !r.length)
        return;
      const s = jl(r), o = /* @__PURE__ */ ve(t), { mode: a } = o;
      if (i.isLeaving)
        return es(s);
      const l = Lo(s);
      if (!l)
        return es(s);
      let c = Ts(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      l.type !== ze && wi(l, c);
      let u = n.subTree && Lo(n.subTree);
      if (u && u.type !== ze && !Sn(u, l) && Vl(n).type !== ze) {
        let d = Ts(
          u,
          o,
          i,
          n
        );
        if (wi(u, d), a === "out-in" && l.type !== ze)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, es(s);
        a === "in-out" && l.type !== ze ? d.delayLeave = (p, f, h) => {
          const m = Wl(
            i,
            u
          );
          m[String(u.key)] = u, p[Pt] = () => {
            f(), p[Pt] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return s;
    };
  }
};
function jl(t) {
  let e = t[0];
  if (t.length > 1) {
    for (const n of t)
      if (n.type !== ze) {
        e = n;
        break;
      }
  }
  return e;
}
const Ad = Td;
function Wl(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function Ts(t, e, n, i, r) {
  const {
    appear: s,
    mode: o,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: c,
    onAfterEnter: u,
    onEnterCancelled: d,
    onBeforeLeave: p,
    onLeave: f,
    onAfterLeave: h,
    onLeaveCancelled: m,
    onBeforeAppear: y,
    onAppear: C,
    onAfterAppear: _,
    onAppearCancelled: b
  } = e, g = String(t.key), E = Wl(n, t), k = (T, A) => {
    T && wt(
      T,
      i,
      9,
      A
    );
  }, x = (T, A) => {
    const L = A[1];
    k(T, A), ee(T) ? T.every((P) => P.length <= 1) && L() : T.length <= 1 && L();
  }, M = {
    mode: o,
    persisted: a,
    beforeEnter(T) {
      let A = l;
      if (!n.isMounted)
        if (s)
          A = y || l;
        else
          return;
      T[Pt] && T[Pt](
        !0
        /* cancelled */
      );
      const L = E[g];
      L && Sn(t, L) && L.el[Pt] && L.el[Pt](), k(A, [T]);
    },
    enter(T) {
      let A = c, L = u, P = d;
      if (!n.isMounted)
        if (s)
          A = C || c, L = _ || u, P = b || d;
        else
          return;
      let V = !1;
      T[ni] = (K) => {
        V || (V = !0, K ? k(P, [T]) : k(L, [T]), M.delayedLeave && M.delayedLeave(), T[ni] = void 0);
      };
      const D = T[ni].bind(null, !1);
      A ? x(A, [T, D]) : D();
    },
    leave(T, A) {
      const L = String(t.key);
      if (T[ni] && T[ni](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return A();
      k(p, [T]);
      let P = !1;
      T[Pt] = (D) => {
        P || (P = !0, A(), D ? k(m, [T]) : k(h, [T]), T[Pt] = void 0, E[L] === t && delete E[L]);
      };
      const V = T[Pt].bind(null, !1);
      E[L] = t, f ? x(f, [T, V]) : V();
    },
    clone(T) {
      const A = Ts(
        T,
        e,
        n,
        i,
        r
      );
      return r && r(A), A;
    }
  };
  return M;
}
function es(t) {
  if (Mr(t))
    return t = Qt(t), t.children = null, t;
}
function Lo(t) {
  if (!Mr(t))
    return zl(t.type) && t.children ? jl(t.children) : t;
  if (t.component)
    return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (e & 16)
      return n[0];
    if (e & 32 && le(n.default))
      return n.default();
  }
}
function wi(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, wi(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Ul(t, e = !1, n) {
  let i = [], r = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Ee ? (o.patchFlag & 128 && r++, i = i.concat(
      Ul(o.children, e, a)
    )) : (e || o.type !== ze) && i.push(a != null ? Qt(o, { key: a }) : o);
  }
  if (r > 1)
    for (let s = 0; s < i.length; s++)
      i[s].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function X(t, e) {
  return le(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Te({ name: t.name }, e, { setup: t })
  ) : t;
}
function Kl() {
  const t = lt();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function Gl(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function _i(t) {
  const e = lt(), n = /* @__PURE__ */ dn(null);
  if (e) {
    const r = e.refs === me ? e.refs = {} : e.refs;
    Object.defineProperty(r, t, {
      enumerable: !0,
      get: () => n.value,
      set: (s) => n.value = s
    });
  }
  return n;
}
function Do(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const lr = /* @__PURE__ */ new WeakMap();
function fi(t, e, n, i, r = !1) {
  if (ee(t)) {
    t.forEach(
      (m, y) => fi(
        m,
        e && (ee(e) ? e[y] : e),
        n,
        i,
        r
      )
    );
    return;
  }
  if (Hn(i) && !r) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && fi(t, e, n, i.component.subTree);
    return;
  }
  const s = i.shapeFlag & 4 ? Br(i.component) : i.el, o = r ? null : s, { i: a, r: l } = t, c = e && e.r, u = a.refs === me ? a.refs = {} : a.refs, d = a.setupState, p = /* @__PURE__ */ ve(d), f = d === me ? Qa : (m) => Do(u, m) ? !1 : ge(p, m), h = (m, y) => !(y && Do(u, y));
  if (c != null && c !== l) {
    if ($o(e), ke(c))
      u[c] = null, f(c) && (d[c] = null);
    else if (/* @__PURE__ */ Be(c)) {
      const m = e;
      h(c, m.k) && (c.value = null), m.k && (u[m.k] = null);
    }
  }
  if (le(l))
    Mi(l, a, 12, [o, u]);
  else {
    const m = ke(l), y = /* @__PURE__ */ Be(l);
    if (m || y) {
      const C = () => {
        if (t.f) {
          const _ = m ? f(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (r)
            ee(_) && Ks(_, s);
          else if (ee(_))
            _.includes(s) || _.push(s);
          else if (m)
            u[l] = [s], f(l) && (d[l] = u[l]);
          else {
            const b = [s];
            h(l, t.k) && (l.value = b), t.k && (u[t.k] = b);
          }
        } else m ? (u[l] = o, f(l) && (d[l] = o)) : y && (h(l, t.k) && (l.value = o), t.k && (u[t.k] = o));
      };
      if (o) {
        const _ = () => {
          C(), lr.delete(t);
        };
        _.id = -1, lr.set(t, _), He(_, n);
      } else
        $o(t), C();
    }
  }
}
function $o(t) {
  const e = lr.get(t);
  e && (e.flags |= 8, lr.delete(t));
}
Er().requestIdleCallback;
Er().cancelIdleCallback;
const Hn = (t) => !!t.type.__asyncLoader, Mr = (t) => t.type.__isKeepAlive;
function Pd(t, e) {
  Xl(t, "a", e);
}
function Od(t, e) {
  Xl(t, "da", e);
}
function Xl(t, e, n = We) {
  const i = t.__wdc || (t.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return t();
  });
  if (Rr(e, i, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Mr(r.parent.vnode) && Id(i, e, n, r), r = r.parent;
  }
}
function Id(t, e, n, i) {
  const r = Rr(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  vn(() => {
    Ks(i[e], r);
  }, n);
}
function Rr(t, e, n = We, i = !1) {
  if (n) {
    const r = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Yt();
      const a = Li(n), l = wt(e, n, t, o);
      return a(), Jt(), l;
    });
    return i ? r.unshift(s) : r.push(s), s;
  }
}
const nn = (t) => (e, n = We) => {
  (!Si || t === "sp") && Rr(t, (...i) => e(...i), n);
}, Md = nn("bm"), De = nn("m"), Rd = nn(
  "bu"
), Ld = nn("u"), hn = nn(
  "bum"
), vn = nn("um"), Dd = nn(
  "sp"
), $d = nn("rtg"), Bd = nn("rtc");
function Fd(t, e = We) {
  Rr("ec", t, e);
}
const zd = "components", Yl = /* @__PURE__ */ Symbol.for("v-ndc");
function to(t) {
  return ke(t) ? Nd(zd, t, !1) || t : t || Yl;
}
function Nd(t, e, n = !0, i = !1) {
  const r = Ne || We;
  if (r) {
    const s = r.type;
    {
      const a = kf(
        s,
        !1
      );
      if (a && (a === e || a === Fe(e) || a === Cr(Fe(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Bo(r[t] || s[t], e) || // global registration
      Bo(r.appContext[t], e)
    );
    return !o && i ? s : o;
  }
}
function Bo(t, e) {
  return t && (t[e] || t[Fe(e)] || t[Cr(Fe(e))]);
}
function Pn(t, e, n, i) {
  let r;
  const s = n && n[i], o = ee(t);
  if (o || ke(t)) {
    const a = o && /* @__PURE__ */ kn(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ ot(t), c = /* @__PURE__ */ Zt(t), t = Tr(t)), r = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      r[u] = e(
        l ? c ? Wn(bt(t[u])) : bt(t[u]) : t[u],
        u,
        void 0,
        s && s[u]
      );
  } else if (typeof t == "number") {
    r = new Array(t);
    for (let a = 0; a < t; a++)
      r[a] = e(a + 1, a, void 0, s && s[a]);
  } else if (be(t))
    if (t[Symbol.iterator])
      r = Array.from(
        t,
        (a, l) => e(a, l, void 0, s && s[l])
      );
    else {
      const a = Object.keys(t);
      r = new Array(a.length);
      for (let l = 0, c = a.length; l < c; l++) {
        const u = a[l];
        r[l] = e(t[u], u, l, s && s[l]);
      }
    }
  else
    r = [];
  return n && (n[i] = r), r;
}
function Fo(t, e) {
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    if (ee(i))
      for (let r = 0; r < i.length; r++)
        t[i[r].name] = i[r].fn;
    else i && (t[i.name] = i.key ? (...r) => {
      const s = i.fn(...r);
      return s && (s.key = i.key), s;
    } : i.fn);
  }
  return t;
}
function te(t, e, n = {}, i, r) {
  if (Ne.ce || Ne.parent && Hn(Ne.parent) && Ne.parent.ce) {
    const c = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), O(), U(
      Ee,
      null,
      [H("slot", n, i && i())],
      c ? -2 : 64
    );
  }
  let s = t[e];
  s && s._c && (s._d = !1), O();
  const o = s && Jl(s(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = U(
    Ee,
    {
      key: (a && !yt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && i ? "_fb" : "")
    },
    o || (i ? i() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), s && s._c && (s._d = !0), l;
}
function Jl(t) {
  return t.some((e) => xi(e) ? !(e.type === ze || e.type === Ee && !Jl(e.children)) : !0) ? t : null;
}
const As = (t) => t ? gc(t) ? Br(t) : As(t.parent) : null, pi = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Te(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => As(t.parent),
    $root: (t) => As(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => Ql(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      eo(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Me.bind(t.proxy)),
    $watch: (t) => Cd.bind(t)
  })
), ts = (t, e) => t !== me && !t.__isScriptSetup && ge(t, e), qd = {
  get({ _: t }, e) {
    if (e === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: r, props: s, accessCache: o, type: a, appContext: l } = t;
    if (e[0] !== "$") {
      const p = o[e];
      if (p !== void 0)
        switch (p) {
          case 1:
            return i[e];
          case 2:
            return r[e];
          case 4:
            return n[e];
          case 3:
            return s[e];
        }
      else {
        if (ts(i, e))
          return o[e] = 1, i[e];
        if (r !== me && ge(r, e))
          return o[e] = 2, r[e];
        if (ge(s, e))
          return o[e] = 3, s[e];
        if (n !== me && ge(n, e))
          return o[e] = 4, n[e];
        Os && (o[e] = 0);
      }
    }
    const c = pi[e];
    let u, d;
    if (c)
      return e === "$attrs" && je(t.attrs, "get", ""), c(t);
    if (
      // css module (injected by vue-loader)
      (u = a.__cssModules) && (u = u[e])
    )
      return u;
    if (n !== me && ge(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ge(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: r, ctx: s } = t;
    return ts(r, e) ? (r[e] = n, !0) : i !== me && ge(i, e) ? (i[e] = n, !0) : ge(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: r, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== me && a[0] !== "$" && ge(t, a) || ts(e, a) || ge(s, a) || ge(i, a) || ge(pi, a) || ge(r.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ge(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Hd() {
  return Vd().slots;
}
function Vd(t) {
  const e = lt();
  return e.setupContext || (e.setupContext = bc(e));
}
function Ps(t) {
  return ee(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function jd(t, e) {
  const n = Ps(t);
  for (const i in e) {
    if (i.startsWith("__skip")) continue;
    let r = n[i];
    r ? ee(r) || le(r) ? r = n[i] = { type: r, default: e[i] } : r.default = e[i] : r === null && (r = n[i] = { default: e[i] }), r && e[`__skip_${i}`] && (r.skipFactory = !0);
  }
  return n;
}
let Os = !0;
function Wd(t) {
  const e = Ql(t), n = t.proxy, i = t.ctx;
  Os = !1, e.beforeCreate && zo(e.beforeCreate, t, "bc");
  const {
    // state
    data: r,
    computed: s,
    methods: o,
    watch: a,
    provide: l,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: d,
    mounted: p,
    beforeUpdate: f,
    updated: h,
    activated: m,
    deactivated: y,
    beforeDestroy: C,
    beforeUnmount: _,
    destroyed: b,
    unmounted: g,
    render: E,
    renderTracked: k,
    renderTriggered: x,
    errorCaptured: M,
    serverPrefetch: T,
    // public API
    expose: A,
    inheritAttrs: L,
    // assets
    components: P,
    directives: V,
    filters: D
  } = e;
  if (c && Ud(c, i, null), o)
    for (const Z in o) {
      const Q = o[Z];
      le(Q) && (i[Z] = Q.bind(n));
    }
  if (r) {
    const Z = r.call(n, n);
    be(Z) && (t.data = /* @__PURE__ */ Oi(Z));
  }
  if (Os = !0, s)
    for (const Z in s) {
      const Q = s[Z], we = le(Q) ? Q.bind(n, n) : le(Q.get) ? Q.get.bind(n, n) : Mt, $e = !le(Q) && le(Q.set) ? Q.set.bind(n) : Mt, Ze = R({
        get: we,
        set: $e
      });
      Object.defineProperty(i, Z, {
        enumerable: !0,
        configurable: !0,
        get: () => Ze.value,
        set: (Pe) => Ze.value = Pe
      });
    }
  if (a)
    for (const Z in a)
      Zl(a[Z], i, n, Z);
  if (l) {
    const Z = le(l) ? l.call(n) : l;
    Reflect.ownKeys(Z).forEach((Q) => {
      Jn(Q, Z[Q]);
    });
  }
  u && zo(u, t, "c");
  function re(Z, Q) {
    ee(Q) ? Q.forEach((we) => Z(we.bind(n))) : Q && Z(Q.bind(n));
  }
  if (re(Md, d), re(De, p), re(Rd, f), re(Ld, h), re(Pd, m), re(Od, y), re(Fd, M), re(Bd, k), re($d, x), re(hn, _), re(vn, g), re(Dd, T), ee(A))
    if (A.length) {
      const Z = t.exposed || (t.exposed = {});
      A.forEach((Q) => {
        Object.defineProperty(Z, Q, {
          get: () => n[Q],
          set: (we) => n[Q] = we,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  E && t.render === Mt && (t.render = E), L != null && (t.inheritAttrs = L), P && (t.components = P), V && (t.directives = V), T && Gl(t);
}
function Ud(t, e, n = Mt) {
  ee(t) && (t = Is(t));
  for (const i in t) {
    const r = t[i];
    let s;
    be(r) ? "default" in r ? s = Xt(
      r.from || i,
      r.default,
      !0
    ) : s = Xt(r.from || i) : s = Xt(r), /* @__PURE__ */ Be(s) ? Object.defineProperty(e, i, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[i] = s;
  }
}
function zo(t, e, n) {
  wt(
    ee(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Zl(t, e, n, i) {
  let r = i.includes(".") ? Bl(n, i) : () => n[i];
  if (ke(t)) {
    const s = e[t];
    le(s) && ye(r, s);
  } else if (le(t))
    ye(r, t.bind(n));
  else if (be(t))
    if (ee(t))
      t.forEach((s) => Zl(s, e, n, i));
    else {
      const s = le(t.handler) ? t.handler.bind(n) : e[t.handler];
      le(s) && ye(r, s, t);
    }
}
function Ql(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !r.length && !n && !i ? l = e : (l = {}, r.length && r.forEach(
    (c) => cr(l, c, o, !0)
  ), cr(l, e, o)), be(e) && s.set(e, l), l;
}
function cr(t, e, n, i = !1) {
  const { mixins: r, extends: s } = e;
  s && cr(t, s, n, !0), r && r.forEach(
    (o) => cr(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = Kd[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Kd = {
  data: No,
  props: qo,
  emits: qo,
  // objects
  methods: oi,
  computed: oi,
  // lifecycle
  beforeCreate: Ue,
  created: Ue,
  beforeMount: Ue,
  mounted: Ue,
  beforeUpdate: Ue,
  updated: Ue,
  beforeDestroy: Ue,
  beforeUnmount: Ue,
  destroyed: Ue,
  unmounted: Ue,
  activated: Ue,
  deactivated: Ue,
  errorCaptured: Ue,
  serverPrefetch: Ue,
  // assets
  components: oi,
  directives: oi,
  // watch
  watch: Xd,
  // provide / inject
  provide: No,
  inject: Gd
};
function No(t, e) {
  return e ? t ? function() {
    return Te(
      le(t) ? t.call(this, this) : t,
      le(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Gd(t, e) {
  return oi(Is(t), Is(e));
}
function Is(t) {
  if (ee(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function Ue(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function oi(t, e) {
  return t ? Te(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function qo(t, e) {
  return t ? ee(t) && ee(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Te(
    /* @__PURE__ */ Object.create(null),
    Ps(t),
    Ps(e ?? {})
  ) : e;
}
function Xd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = Te(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Ue(t[i], e[i]);
  return n;
}
function ec() {
  return {
    app: null,
    config: {
      isNativeTag: Qa,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Yd = 0;
function Jd(t, e) {
  return function(i, r = null) {
    le(i) || (i = Te({}, i)), r != null && !be(r) && (r = null);
    const s = ec(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = s.app = {
      _uid: Yd++,
      _component: i,
      _props: r,
      _container: null,
      _context: s,
      _instance: null,
      version: Pf,
      get config() {
        return s.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return o.has(u) || (u && le(u.install) ? (o.add(u), u.install(c, ...d)) : le(u) && (o.add(u), u(c, ...d))), c;
      },
      mixin(u) {
        return s.mixins.includes(u) || s.mixins.push(u), c;
      },
      component(u, d) {
        return d ? (s.components[u] = d, c) : s.components[u];
      },
      directive(u, d) {
        return d ? (s.directives[u] = d, c) : s.directives[u];
      },
      mount(u, d, p) {
        if (!l) {
          const f = c._ceVNode || H(i, r);
          return f.appContext = s, p === !0 ? p = "svg" : p === !1 && (p = void 0), t(f, u, p), l = !0, c._container = u, u.__vue_app__ = c, Br(f.component);
        }
      },
      onUnmount(u) {
        a.push(u);
      },
      unmount() {
        l && (wt(
          a,
          c._instance,
          16
        ), t(null, c._container), delete c._container.__vue_app__);
      },
      provide(u, d) {
        return s.provides[u] = d, c;
      },
      runWithContext(u) {
        const d = Vn;
        Vn = c;
        try {
          return u();
        } finally {
          Vn = d;
        }
      }
    };
    return c;
  };
}
let Vn = null;
function Zd(t, e, n = me) {
  const i = lt(), r = Fe(e), s = nt(e), o = tc(t, r), a = Pl((l, c) => {
    let u, d = me, p;
    return Sd(() => {
      const f = t[r];
      Ke(u, f) && (u = f, c());
    }), {
      get() {
        return l(), n.get ? n.get(u) : u;
      },
      set(f) {
        const h = n.set ? n.set(f) : f;
        if (!Ke(h, u) && !(d !== me && Ke(f, d)))
          return;
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || r in m || s in m) && (`onUpdate:${e}` in m || `onUpdate:${r}` in m || `onUpdate:${s}` in m) || (u = f, c()), i.emit(`update:${e}`, h), Ke(f, h) && Ke(f, d) && !Ke(h, p) && c(), d = f, p = h;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? o || me : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const tc = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${Fe(e)}Modifiers`] || t[`${nt(e)}Modifiers`];
function Qd(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || me;
  let r = n;
  const s = e.startsWith("update:"), o = s && tc(i, e.slice(7));
  o && (o.trim && (r = n.map((u) => ke(u) ? u.trim() : u)), o.number && (r = n.map(Du)));
  let a, l = i[a = Ui(e)] || // also try camelCase event handler (#2249)
  i[a = Ui(Fe(e))];
  !l && s && (l = i[a = Ui(nt(e))]), l && wt(
    l,
    t,
    6,
    r
  );
  const c = i[a + "Once"];
  if (c) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[a])
      return;
    t.emitted[a] = !0, wt(
      c,
      t,
      6,
      r
    );
  }
}
const ef = /* @__PURE__ */ new WeakMap();
function nc(t, e, n = !1) {
  const i = n ? ef : e.emitsCache, r = i.get(t);
  if (r !== void 0)
    return r;
  const s = t.emits;
  let o = {}, a = !1;
  if (!le(t)) {
    const l = (c) => {
      const u = nc(c, e, !0);
      u && (a = !0, Te(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (be(t) && i.set(t, null), null) : (ee(s) ? s.forEach((l) => o[l] = null) : Te(o, s), be(t) && i.set(t, o), o);
}
function Lr(t, e) {
  return !t || !wr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ge(t, e[0].toLowerCase() + e.slice(1)) || ge(t, nt(e)) || ge(t, e));
}
function Ho(t) {
  const {
    type: e,
    vnode: n,
    proxy: i,
    withProxy: r,
    propsOptions: [s],
    slots: o,
    attrs: a,
    emit: l,
    render: c,
    renderCache: u,
    props: d,
    data: p,
    setupState: f,
    ctx: h,
    inheritAttrs: m
  } = t, y = ar(t);
  let C, _;
  try {
    if (n.shapeFlag & 4) {
      const g = r || i, E = g;
      C = Ot(
        c.call(
          E,
          g,
          u,
          d,
          f,
          p,
          h
        )
      ), _ = a;
    } else {
      const g = e;
      C = Ot(
        g.length > 1 ? g(
          d,
          { attrs: a, slots: o, emit: l }
        ) : g(
          d,
          null
        )
      ), _ = e.props ? a : tf(a);
    }
  } catch (g) {
    hi.length = 0, Ir(g, t, 1), C = H(ze);
  }
  let b = C;
  if (_ && m !== !1) {
    const g = Object.keys(_), { shapeFlag: E } = b;
    g.length && E & 7 && (s && g.some(Us) && (_ = nf(
      _,
      s
    )), b = Qt(b, _, !1, !0));
  }
  return n.dirs && (b = Qt(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && wi(b, n.transition), C = b, ar(y), C;
}
const tf = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || wr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, nf = (t, e) => {
  const n = {};
  for (const i in t)
    (!Us(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function rf(t, e, n) {
  const { props: i, children: r, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Vo(i, o, c) : !!o;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const p = u[d];
        if (ic(o, i, p) && !Lr(c, p))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Vo(i, o, c) : !0 : !!o;
  return !1;
}
function Vo(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    if (ic(e, t, s) && !Lr(n, s))
      return !0;
  }
  return !1;
}
function ic(t, e, n) {
  const i = t[n], r = e[n];
  return n === "style" && be(i) && be(r) ? !Xs(i, r) : i !== r;
}
function sf({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const rc = {}, sc = () => Object.create(rc), oc = (t) => Object.getPrototypeOf(t) === rc;
function of(t, e, n, i = !1) {
  const r = {}, s = sc();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), ac(t, e, r, s);
  for (const o in t.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? t.props = i ? r : /* @__PURE__ */ Ii(r) : t.type.props ? t.props = r : t.props = s, t.attrs = s;
}
function af(t, e, n, i) {
  const {
    props: r,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ ve(r), [l] = t.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const u = t.vnode.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        let p = u[d];
        if (Lr(t.emitsOptions, p))
          continue;
        const f = e[p];
        if (l)
          if (ge(s, p))
            f !== s[p] && (s[p] = f, c = !0);
          else {
            const h = Fe(p);
            r[h] = Ms(
              l,
              a,
              h,
              f,
              t,
              !1
            );
          }
        else
          f !== s[p] && (s[p] = f, c = !0);
      }
    }
  } else {
    ac(t, e, r, s) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ge(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = nt(d)) === d || !ge(e, u))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[u] !== void 0) && (r[d] = Ms(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete r[d]);
    if (s !== a)
      for (const d in s)
        (!e || !ge(e, d)) && (delete s[d], c = !0);
  }
  c && Kt(t.attrs, "set", "");
}
function ac(t, e, n, i) {
  const [r, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (li(l))
        continue;
      const c = e[l];
      let u;
      r && ge(r, u = Fe(l)) ? !s || !s.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Lr(t.emitsOptions, l) || (!(l in i) || c !== i[l]) && (i[l] = c, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ ve(n), c = a || me;
    for (let u = 0; u < s.length; u++) {
      const d = s[u];
      n[d] = Ms(
        r,
        l,
        d,
        c[d],
        t,
        !ge(c, d)
      );
    }
  }
  return o;
}
function Ms(t, e, n, i, r, s) {
  const o = t[n];
  if (o != null) {
    const a = ge(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && le(l)) {
        const { propsDefaults: c } = r;
        if (n in c)
          i = c[n];
        else {
          const u = Li(r);
          i = c[n] = l.call(
            null,
            e
          ), u();
        }
      } else
        i = l;
      r.ce && r.ce._setProp(n, i);
    }
    o[
      0
      /* shouldCast */
    ] && (s && !a ? i = !1 : o[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === nt(n)) && (i = !0));
  }
  return i;
}
const lf = /* @__PURE__ */ new WeakMap();
function lc(t, e, n = !1) {
  const i = n ? lf : e.propsCache, r = i.get(t);
  if (r)
    return r;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!le(t)) {
    const u = (d) => {
      l = !0;
      const [p, f] = lc(d, e, !0);
      Te(o, p), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!s && !l)
    return be(t) && i.set(t, zn), zn;
  if (ee(s))
    for (let u = 0; u < s.length; u++) {
      const d = Fe(s[u]);
      jo(d) && (o[d] = me);
    }
  else if (s)
    for (const u in s) {
      const d = Fe(u);
      if (jo(d)) {
        const p = s[u], f = o[d] = ee(p) || le(p) ? { type: p } : Te({}, p), h = f.type;
        let m = !1, y = !0;
        if (ee(h))
          for (let C = 0; C < h.length; ++C) {
            const _ = h[C], b = le(_) && _.name;
            if (b === "Boolean") {
              m = !0;
              break;
            } else b === "String" && (y = !1);
          }
        else
          m = le(h) && h.name === "Boolean";
        f[
          0
          /* shouldCast */
        ] = m, f[
          1
          /* shouldCastTrue */
        ] = y, (m || ge(f, "default")) && a.push(d);
      }
    }
  const c = [o, a];
  return be(t) && i.set(t, c), c;
}
function jo(t) {
  return t[0] !== "$" && !li(t);
}
const no = (t) => t === "_" || t === "_ctx" || t === "$stable", io = (t) => ee(t) ? t.map(Ot) : [Ot(t)], cf = (t, e, n) => {
  if (e._n)
    return e;
  const i = q((...r) => io(e(...r)), n);
  return i._c = !1, i;
}, cc = (t, e, n) => {
  const i = t._ctx;
  for (const r in t) {
    if (no(r)) continue;
    const s = t[r];
    if (le(s))
      e[r] = cf(r, s, i);
    else if (s != null) {
      const o = io(s);
      e[r] = () => o;
    }
  }
}, uc = (t, e) => {
  const n = io(e);
  t.slots.default = () => n;
}, dc = (t, e, n) => {
  for (const i in e)
    (n || !no(i)) && (t[i] = e[i]);
}, uf = (t, e, n) => {
  const i = t.slots = sc();
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (dc(i, e, n), n && il(i, "_", r, !0)) : cc(e, i);
  } else e && uc(t, e);
}, df = (t, e, n) => {
  const { vnode: i, slots: r } = t;
  let s = !0, o = me;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : dc(r, e, n) : (s = !e.$stable, cc(e, r)), o = e;
  } else e && (uc(t, e), o = { default: 1 });
  if (s)
    for (const a in r)
      !no(a) && o[a] == null && delete r[a];
}, He = mf;
function ff(t) {
  return pf(t);
}
function pf(t, e) {
  const n = Er();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: r,
    patchProp: s,
    createElement: o,
    createText: a,
    createComment: l,
    setText: c,
    setElementText: u,
    parentNode: d,
    nextSibling: p,
    setScopeId: f = Mt,
    insertStaticContent: h
  } = t, m = (w, S, I, N = null, $ = null, B = null, G = void 0, W = null, j = !!S.dynamicChildren) => {
    if (w === S)
      return;
    w && !Sn(w, S) && (N = Y(w), Pe(w, $, B, !0), w = null), S.patchFlag === -2 && (j = !1, S.dynamicChildren = null);
    const { type: F, ref: se, shapeFlag: J } = S;
    switch (F) {
      case Dr:
        y(w, S, I, N);
        break;
      case ze:
        C(w, S, I, N);
        break;
      case Xi:
        w == null && _(S, I, N, G);
        break;
      case Ee:
        P(
          w,
          S,
          I,
          N,
          $,
          B,
          G,
          W,
          j
        );
        break;
      default:
        J & 1 ? E(
          w,
          S,
          I,
          N,
          $,
          B,
          G,
          W,
          j
        ) : J & 6 ? V(
          w,
          S,
          I,
          N,
          $,
          B,
          G,
          W,
          j
        ) : (J & 64 || J & 128) && F.process(
          w,
          S,
          I,
          N,
          $,
          B,
          G,
          W,
          j,
          he
        );
    }
    se != null && $ ? fi(se, w && w.ref, B, S || w, !S) : se == null && w && w.ref != null && fi(w.ref, null, B, w, !0);
  }, y = (w, S, I, N) => {
    if (w == null)
      i(
        S.el = a(S.children),
        I,
        N
      );
    else {
      const $ = S.el = w.el;
      S.children !== w.children && c($, S.children);
    }
  }, C = (w, S, I, N) => {
    w == null ? i(
      S.el = l(S.children || ""),
      I,
      N
    ) : S.el = w.el;
  }, _ = (w, S, I, N) => {
    [w.el, w.anchor] = h(
      w.children,
      S,
      I,
      N,
      w.el,
      w.anchor
    );
  }, b = ({ el: w, anchor: S }, I, N) => {
    let $;
    for (; w && w !== S; )
      $ = p(w), i(w, I, N), w = $;
    i(S, I, N);
  }, g = ({ el: w, anchor: S }) => {
    let I;
    for (; w && w !== S; )
      I = p(w), r(w), w = I;
    r(S);
  }, E = (w, S, I, N, $, B, G, W, j) => {
    if (S.type === "svg" ? G = "svg" : S.type === "math" && (G = "mathml"), w == null)
      k(
        S,
        I,
        N,
        $,
        B,
        G,
        W,
        j
      );
    else {
      const F = w.el && w.el._isVueCE ? w.el : null;
      try {
        F && F._beginPatch(), T(
          w,
          S,
          $,
          B,
          G,
          W,
          j
        );
      } finally {
        F && F._endPatch();
      }
    }
  }, k = (w, S, I, N, $, B, G, W) => {
    let j, F;
    const { props: se, shapeFlag: J, transition: ne, dirs: ce } = w;
    if (j = w.el = o(
      w.type,
      B,
      se && se.is,
      se
    ), J & 8 ? u(j, w.children) : J & 16 && M(
      w.children,
      j,
      null,
      N,
      $,
      ns(w, B),
      G,
      W
    ), ce && gn(w, null, N, "created"), x(j, w, w.scopeId, G, N), se) {
      for (const Se in se)
        Se !== "value" && !li(Se) && s(j, Se, null, se[Se], B, N);
      "value" in se && s(j, "value", null, se.value, B), (F = se.onVnodeBeforeMount) && Tt(F, N, w);
    }
    ce && gn(w, null, N, "beforeMount");
    const pe = hf($, ne);
    pe && ne.beforeEnter(j), i(j, S, I), ((F = se && se.onVnodeMounted) || pe || ce) && He(() => {
      F && Tt(F, N, w), pe && ne.enter(j), ce && gn(w, null, N, "mounted");
    }, $);
  }, x = (w, S, I, N, $) => {
    if (I && f(w, I), N)
      for (let B = 0; B < N.length; B++)
        f(w, N[B]);
    if ($) {
      let B = $.subTree;
      if (S === B || hc(B.type) && (B.ssContent === S || B.ssFallback === S)) {
        const G = $.vnode;
        x(
          w,
          G,
          G.scopeId,
          G.slotScopeIds,
          $.parent
        );
      }
    }
  }, M = (w, S, I, N, $, B, G, W, j = 0) => {
    for (let F = j; F < w.length; F++) {
      const se = w[F] = W ? Ut(w[F]) : Ot(w[F]);
      m(
        null,
        se,
        S,
        I,
        N,
        $,
        B,
        G,
        W
      );
    }
  }, T = (w, S, I, N, $, B, G) => {
    const W = S.el = w.el;
    let { patchFlag: j, dynamicChildren: F, dirs: se } = S;
    j |= w.patchFlag & 16;
    const J = w.props || me, ne = S.props || me;
    let ce;
    if (I && yn(I, !1), (ce = ne.onVnodeBeforeUpdate) && Tt(ce, I, S, w), se && gn(S, w, I, "beforeUpdate"), I && yn(I, !0), (J.innerHTML && ne.innerHTML == null || J.textContent && ne.textContent == null) && u(W, ""), F ? A(
      w.dynamicChildren,
      F,
      W,
      I,
      N,
      ns(S, $),
      B
    ) : G || Q(
      w,
      S,
      W,
      null,
      I,
      N,
      ns(S, $),
      B,
      !1
    ), j > 0) {
      if (j & 16)
        L(W, J, ne, I, $);
      else if (j & 2 && J.class !== ne.class && s(W, "class", null, ne.class, $), j & 4 && s(W, "style", J.style, ne.style, $), j & 8) {
        const pe = S.dynamicProps;
        for (let Se = 0; Se < pe.length; Se++) {
          const _e = pe[Se], Qe = J[_e], et = ne[_e];
          (et !== Qe || _e === "value") && s(W, _e, Qe, et, $, I);
        }
      }
      j & 1 && w.children !== S.children && u(W, S.children);
    } else !G && F == null && L(W, J, ne, I, $);
    ((ce = ne.onVnodeUpdated) || se) && He(() => {
      ce && Tt(ce, I, S, w), se && gn(S, w, I, "updated");
    }, N);
  }, A = (w, S, I, N, $, B, G) => {
    for (let W = 0; W < S.length; W++) {
      const j = w[W], F = S[W], se = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        j.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (j.type === Ee || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Sn(j, F) || // - In the case of a component, it could contain anything.
        j.shapeFlag & 198) ? d(j.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          I
        )
      );
      m(
        j,
        F,
        se,
        null,
        N,
        $,
        B,
        G,
        !0
      );
    }
  }, L = (w, S, I, N, $) => {
    if (S !== I) {
      if (S !== me)
        for (const B in S)
          !li(B) && !(B in I) && s(
            w,
            B,
            S[B],
            null,
            $,
            N
          );
      for (const B in I) {
        if (li(B)) continue;
        const G = I[B], W = S[B];
        G !== W && B !== "value" && s(w, B, W, G, $, N);
      }
      "value" in I && s(w, "value", S.value, I.value, $);
    }
  }, P = (w, S, I, N, $, B, G, W, j) => {
    const F = S.el = w ? w.el : a(""), se = S.anchor = w ? w.anchor : a("");
    let { patchFlag: J, dynamicChildren: ne, slotScopeIds: ce } = S;
    ce && (W = W ? W.concat(ce) : ce), w == null ? (i(F, I, N), i(se, I, N), M(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      S.children || [],
      I,
      se,
      $,
      B,
      G,
      W,
      j
    )) : J > 0 && J & 64 && ne && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    w.dynamicChildren && w.dynamicChildren.length === ne.length ? (A(
      w.dynamicChildren,
      ne,
      I,
      $,
      B,
      G,
      W
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (S.key != null || $ && S === $.subTree) && ro(
      w,
      S,
      !0
      /* shallow */
    )) : Q(
      w,
      S,
      I,
      se,
      $,
      B,
      G,
      W,
      j
    );
  }, V = (w, S, I, N, $, B, G, W, j) => {
    S.slotScopeIds = W, w == null ? S.shapeFlag & 512 ? $.ctx.activate(
      S,
      I,
      N,
      G,
      j
    ) : D(
      S,
      I,
      N,
      $,
      B,
      G,
      j
    ) : K(w, S, j);
  }, D = (w, S, I, N, $, B, G) => {
    const W = w.component = xf(
      w,
      N,
      $
    );
    if (Mr(w) && (W.ctx.renderer = he), Sf(W, !1, G), W.asyncDep) {
      if ($ && $.registerDep(W, re, G), !w.el) {
        const j = W.subTree = H(ze);
        C(null, j, S, I), w.placeholder = j.el;
      }
    } else
      re(
        W,
        w,
        S,
        I,
        $,
        B,
        G
      );
  }, K = (w, S, I) => {
    const N = S.component = w.component;
    if (rf(w, S, I))
      if (N.asyncDep && !N.asyncResolved) {
        Z(N, S, I);
        return;
      } else
        N.next = S, N.update();
    else
      S.el = w.el, N.vnode = S;
  }, re = (w, S, I, N, $, B, G) => {
    const W = () => {
      if (w.isMounted) {
        let { next: J, bu: ne, u: ce, parent: pe, vnode: Se } = w;
        {
          const Et = fc(w);
          if (Et) {
            J && (J.el = Se.el, Z(w, J, G)), Et.asyncDep.then(() => {
              He(() => {
                w.isUnmounted || F();
              }, $);
            });
            return;
          }
        }
        let _e = J, Qe;
        yn(w, !1), J ? (J.el = Se.el, Z(w, J, G)) : J = Se, ne && Xr(ne), (Qe = J.props && J.props.onVnodeBeforeUpdate) && Tt(Qe, pe, J, Se), yn(w, !0);
        const et = Ho(w), Ct = w.subTree;
        w.subTree = et, m(
          Ct,
          et,
          // parent may have changed if it's in a teleport
          d(Ct.el),
          // anchor may have changed if it's in a fragment
          Y(Ct),
          w,
          $,
          B
        ), J.el = et.el, _e === null && sf(w, et.el), ce && He(ce, $), (Qe = J.props && J.props.onVnodeUpdated) && He(
          () => Tt(Qe, pe, J, Se),
          $
        );
      } else {
        let J;
        const { el: ne, props: ce } = S, { bm: pe, m: Se, parent: _e, root: Qe, type: et } = w, Ct = Hn(S);
        yn(w, !1), pe && Xr(pe), !Ct && (J = ce && ce.onVnodeBeforeMount) && Tt(J, _e, S), yn(w, !0);
        {
          Qe.ce && Qe.ce._hasShadowRoot() && Qe.ce._injectChildStyle(et);
          const Et = w.subTree = Ho(w);
          m(
            null,
            Et,
            I,
            N,
            w,
            $,
            B
          ), S.el = Et.el;
        }
        if (Se && He(Se, $), !Ct && (J = ce && ce.onVnodeMounted)) {
          const Et = S;
          He(
            () => Tt(J, _e, Et),
            $
          );
        }
        (S.shapeFlag & 256 || _e && Hn(_e.vnode) && _e.vnode.shapeFlag & 256) && w.a && He(w.a, $), w.isMounted = !0, S = I = N = null;
      }
    };
    w.scope.on();
    const j = w.effect = new ul(W);
    w.scope.off();
    const F = w.update = j.run.bind(j), se = w.job = j.runIfDirty.bind(j);
    se.i = w, se.id = w.uid, j.scheduler = () => eo(se), yn(w, !0), F();
  }, Z = (w, S, I) => {
    S.component = w;
    const N = w.vnode.props;
    w.vnode = S, w.next = null, af(w, S.props, N, I), df(w, S.children, I), Yt(), Oo(w), Jt();
  }, Q = (w, S, I, N, $, B, G, W, j = !1) => {
    const F = w && w.children, se = w ? w.shapeFlag : 0, J = S.children, { patchFlag: ne, shapeFlag: ce } = S;
    if (ne > 0) {
      if (ne & 128) {
        $e(
          F,
          J,
          I,
          N,
          $,
          B,
          G,
          W,
          j
        );
        return;
      } else if (ne & 256) {
        we(
          F,
          J,
          I,
          N,
          $,
          B,
          G,
          W,
          j
        );
        return;
      }
    }
    ce & 8 ? (se & 16 && Ht(F, $, B), J !== F && u(I, J)) : se & 16 ? ce & 16 ? $e(
      F,
      J,
      I,
      N,
      $,
      B,
      G,
      W,
      j
    ) : Ht(F, $, B, !0) : (se & 8 && u(I, ""), ce & 16 && M(
      J,
      I,
      N,
      $,
      B,
      G,
      W,
      j
    ));
  }, we = (w, S, I, N, $, B, G, W, j) => {
    w = w || zn, S = S || zn;
    const F = w.length, se = S.length, J = Math.min(F, se);
    let ne;
    for (ne = 0; ne < J; ne++) {
      const ce = S[ne] = j ? Ut(S[ne]) : Ot(S[ne]);
      m(
        w[ne],
        ce,
        I,
        null,
        $,
        B,
        G,
        W,
        j
      );
    }
    F > se ? Ht(
      w,
      $,
      B,
      !0,
      !1,
      J
    ) : M(
      S,
      I,
      N,
      $,
      B,
      G,
      W,
      j,
      J
    );
  }, $e = (w, S, I, N, $, B, G, W, j) => {
    let F = 0;
    const se = S.length;
    let J = w.length - 1, ne = se - 1;
    for (; F <= J && F <= ne; ) {
      const ce = w[F], pe = S[F] = j ? Ut(S[F]) : Ot(S[F]);
      if (Sn(ce, pe))
        m(
          ce,
          pe,
          I,
          null,
          $,
          B,
          G,
          W,
          j
        );
      else
        break;
      F++;
    }
    for (; F <= J && F <= ne; ) {
      const ce = w[J], pe = S[ne] = j ? Ut(S[ne]) : Ot(S[ne]);
      if (Sn(ce, pe))
        m(
          ce,
          pe,
          I,
          null,
          $,
          B,
          G,
          W,
          j
        );
      else
        break;
      J--, ne--;
    }
    if (F > J) {
      if (F <= ne) {
        const ce = ne + 1, pe = ce < se ? S[ce].el : N;
        for (; F <= ne; )
          m(
            null,
            S[F] = j ? Ut(S[F]) : Ot(S[F]),
            I,
            pe,
            $,
            B,
            G,
            W,
            j
          ), F++;
      }
    } else if (F > ne)
      for (; F <= J; )
        Pe(w[F], $, B, !0), F++;
    else {
      const ce = F, pe = F, Se = /* @__PURE__ */ new Map();
      for (F = pe; F <= ne; F++) {
        const rt = S[F] = j ? Ut(S[F]) : Ot(S[F]);
        rt.key != null && Se.set(rt.key, F);
      }
      let _e, Qe = 0;
      const et = ne - pe + 1;
      let Ct = !1, Et = 0;
      const ei = new Array(et);
      for (F = 0; F < et; F++) ei[F] = 0;
      for (F = ce; F <= J; F++) {
        const rt = w[F];
        if (Qe >= et) {
          Pe(rt, $, B, !0);
          continue;
        }
        let kt;
        if (rt.key != null)
          kt = Se.get(rt.key);
        else
          for (_e = pe; _e <= ne; _e++)
            if (ei[_e - pe] === 0 && Sn(rt, S[_e])) {
              kt = _e;
              break;
            }
        kt === void 0 ? Pe(rt, $, B, !0) : (ei[kt - pe] = F + 1, kt >= Et ? Et = kt : Ct = !0, m(
          rt,
          S[kt],
          I,
          null,
          $,
          B,
          G,
          W,
          j
        ), Qe++);
      }
      const So = Ct ? vf(ei) : zn;
      for (_e = So.length - 1, F = et - 1; F >= 0; F--) {
        const rt = pe + F, kt = S[rt], Co = S[rt + 1], Eo = rt + 1 < se ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Co.el || pc(Co)
        ) : N;
        ei[F] === 0 ? m(
          null,
          kt,
          I,
          Eo,
          $,
          B,
          G,
          W,
          j
        ) : Ct && (_e < 0 || F !== So[_e] ? Ze(kt, I, Eo, 2) : _e--);
      }
    }
  }, Ze = (w, S, I, N, $ = null) => {
    const { el: B, type: G, transition: W, children: j, shapeFlag: F } = w;
    if (F & 6) {
      Ze(w.component.subTree, S, I, N);
      return;
    }
    if (F & 128) {
      w.suspense.move(S, I, N);
      return;
    }
    if (F & 64) {
      G.move(w, S, I, he);
      return;
    }
    if (G === Ee) {
      i(B, S, I);
      for (let J = 0; J < j.length; J++)
        Ze(j[J], S, I, N);
      i(w.anchor, S, I);
      return;
    }
    if (G === Xi) {
      b(w, S, I);
      return;
    }
    if (N !== 2 && F & 1 && W)
      if (N === 0)
        W.beforeEnter(B), i(B, S, I), He(() => W.enter(B), $);
      else {
        const { leave: J, delayLeave: ne, afterLeave: ce } = W, pe = () => {
          w.ctx.isUnmounted ? r(B) : i(B, S, I);
        }, Se = () => {
          B._isLeaving && B[Pt](
            !0
            /* cancelled */
          ), J(B, () => {
            pe(), ce && ce();
          });
        };
        ne ? ne(B, pe, Se) : Se();
      }
    else
      i(B, S, I);
  }, Pe = (w, S, I, N = !1, $ = !1) => {
    const {
      type: B,
      props: G,
      ref: W,
      children: j,
      dynamicChildren: F,
      shapeFlag: se,
      patchFlag: J,
      dirs: ne,
      cacheIndex: ce
    } = w;
    if (J === -2 && ($ = !1), W != null && (Yt(), fi(W, null, I, w, !0), Jt()), ce != null && (S.renderCache[ce] = void 0), se & 256) {
      S.ctx.deactivate(w);
      return;
    }
    const pe = se & 1 && ne, Se = !Hn(w);
    let _e;
    if (Se && (_e = G && G.onVnodeBeforeUnmount) && Tt(_e, S, w), se & 6)
      Qn(w.component, I, N);
    else {
      if (se & 128) {
        w.suspense.unmount(I, N);
        return;
      }
      pe && gn(w, null, S, "beforeUnmount"), se & 64 ? w.type.remove(
        w,
        S,
        I,
        he,
        N
      ) : F && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !F.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (B !== Ee || J > 0 && J & 64) ? Ht(
        F,
        S,
        I,
        !1,
        !0
      ) : (B === Ee && J & 384 || !$ && se & 16) && Ht(j, S, I), N && Nt(w);
    }
    (Se && (_e = G && G.onVnodeUnmounted) || pe) && He(() => {
      _e && Tt(_e, S, w), pe && gn(w, null, S, "unmounted");
    }, I);
  }, Nt = (w) => {
    const { type: S, el: I, anchor: N, transition: $ } = w;
    if (S === Ee) {
      qt(I, N);
      return;
    }
    if (S === Xi) {
      g(w);
      return;
    }
    const B = () => {
      r(I), $ && !$.persisted && $.afterLeave && $.afterLeave();
    };
    if (w.shapeFlag & 1 && $ && !$.persisted) {
      const { leave: G, delayLeave: W } = $, j = () => G(I, B);
      W ? W(w.el, B, j) : j();
    } else
      B();
  }, qt = (w, S) => {
    let I;
    for (; w !== S; )
      I = p(w), r(w), w = I;
    r(S);
  }, Qn = (w, S, I) => {
    const { bum: N, scope: $, job: B, subTree: G, um: W, m: j, a: F } = w;
    Wo(j), Wo(F), N && Xr(N), $.stop(), B && (B.flags |= 8, Pe(G, w, S, I)), W && He(W, S), He(() => {
      w.isUnmounted = !0;
    }, S);
  }, Ht = (w, S, I, N = !1, $ = !1, B = 0) => {
    for (let G = B; G < w.length; G++)
      Pe(w[G], S, I, N, $);
  }, Y = (w) => {
    if (w.shapeFlag & 6)
      return Y(w.component.subTree);
    if (w.shapeFlag & 128)
      return w.suspense.next();
    const S = p(w.anchor || w.el), I = S && S[Fl];
    return I ? p(I) : S;
  };
  let ae = !1;
  const ue = (w, S, I) => {
    let N;
    w == null ? S._vnode && (Pe(S._vnode, null, null, !0), N = S._vnode.component) : m(
      S._vnode || null,
      w,
      S,
      null,
      null,
      null,
      I
    ), S._vnode = w, ae || (ae = !0, Oo(N), Rl(), ae = !1);
  }, he = {
    p: m,
    um: Pe,
    m: Ze,
    r: Nt,
    mt: D,
    mc: M,
    pc: Q,
    pbc: A,
    n: Y,
    o: t
  };
  return {
    render: ue,
    hydrate: void 0,
    createApp: Jd(ue)
  };
}
function ns({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function yn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function hf(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function ro(t, e, n = !1) {
  const i = t.children, r = e.children;
  if (ee(i) && ee(r))
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let a = r[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[s] = Ut(r[s]), a.el = o.el), !n && a.patchFlag !== -2 && ro(o, a)), a.type === Dr && (a.patchFlag === -1 && (a = r[s] = Ut(a)), a.el = o.el), a.type === ze && !a.el && (a.el = o.el);
    }
}
function vf(t) {
  const e = t.slice(), n = [0];
  let i, r, s, o, a;
  const l = t.length;
  for (i = 0; i < l; i++) {
    const c = t[i];
    if (c !== 0) {
      if (r = n[n.length - 1], t[r] < c) {
        e[i] = r, n.push(i);
        continue;
      }
      for (s = 0, o = n.length - 1; s < o; )
        a = s + o >> 1, t[n[a]] < c ? s = a + 1 : o = a;
      c < t[n[s]] && (s > 0 && (e[i] = n[s - 1]), n[s] = i);
    }
  }
  for (s = n.length, o = n[s - 1]; s-- > 0; )
    n[s] = o, o = e[o];
  return n;
}
function fc(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : fc(e);
}
function Wo(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function pc(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? pc(e.subTree) : null;
}
const hc = (t) => t.__isSuspense;
function mf(t, e) {
  e && e.pendingBranch ? ee(t) ? e.effects.push(...t) : e.effects.push(t) : bd(t);
}
const Ee = /* @__PURE__ */ Symbol.for("v-fgt"), Dr = /* @__PURE__ */ Symbol.for("v-txt"), ze = /* @__PURE__ */ Symbol.for("v-cmt"), Xi = /* @__PURE__ */ Symbol.for("v-stc"), hi = [];
let Ye = null;
function O(t = !1) {
  hi.push(Ye = t ? null : []);
}
function gf() {
  hi.pop(), Ye = hi[hi.length - 1] || null;
}
let Un = 1;
function ur(t, e = !1) {
  Un += t, t < 0 && Ye && e && (Ye.hasOnce = !0);
}
function vc(t) {
  return t.dynamicChildren = Un > 0 ? Ye || zn : null, gf(), Un > 0 && Ye && Ye.push(t), t;
}
function oe(t, e, n, i, r, s) {
  return vc(
    ie(
      t,
      e,
      n,
      i,
      r,
      s,
      !0
    )
  );
}
function U(t, e, n, i, r) {
  return vc(
    H(
      t,
      e,
      n,
      i,
      r,
      !0
    )
  );
}
function xi(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Sn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const mc = ({ key: t }) => t ?? null, Yi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? ke(t) || /* @__PURE__ */ Be(t) || le(t) ? { i: Ne, r: t, k: e, f: !!n } : t : null);
function ie(t, e = null, n = null, i = 0, r = null, s = t === Ee ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && mc(e),
    ref: e && Yi(e),
    scopeId: Dl,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: s,
    patchFlag: i,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Ne
  };
  return a ? (so(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= ke(n) ? 8 : 16), Un > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ye && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ye.push(l), l;
}
const H = yf;
function yf(t, e = null, n = null, i = 0, r = null, s = !1) {
  if ((!t || t === Yl) && (t = ze), xi(t)) {
    const a = Qt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && so(a, n), Un > 0 && !s && Ye && (a.shapeFlag & 6 ? Ye[Ye.indexOf(t)] = a : Ye.push(a)), a.patchFlag = -2, a;
  }
  if (Tf(t) && (t = t.__vccOpts), e) {
    e = $r(e);
    let { class: a, style: l } = e;
    a && !ke(a) && (e.class = $t(a)), be(l) && (/* @__PURE__ */ Or(l) && !ee(l) && (l = Te({}, l)), e.style = St(l));
  }
  const o = ke(t) ? 1 : hc(t) ? 128 : zl(t) ? 64 : be(t) ? 4 : le(t) ? 2 : 0;
  return ie(
    t,
    e,
    n,
    i,
    r,
    o,
    s,
    !0
  );
}
function $r(t) {
  return t ? /* @__PURE__ */ Or(t) || oc(t) ? Te({}, t) : t : null;
}
function Qt(t, e, n = !1, i = !1) {
  const { props: r, ref: s, patchFlag: o, children: a, transition: l } = t, c = e ? xe(r || {}, e) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && mc(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? ee(s) ? s.concat(Yi(e)) : [s, Yi(e)] : Yi(e)
    ) : s,
    scopeId: t.scopeId,
    slotScopeIds: t.slotScopeIds,
    children: a,
    target: t.target,
    targetStart: t.targetStart,
    targetAnchor: t.targetAnchor,
    staticCount: t.staticCount,
    shapeFlag: t.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: e && t.type !== Ee ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: t.dynamicProps,
    dynamicChildren: t.dynamicChildren,
    appContext: t.appContext,
    dirs: t.dirs,
    transition: l,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: t.component,
    suspense: t.suspense,
    ssContent: t.ssContent && Qt(t.ssContent),
    ssFallback: t.ssFallback && Qt(t.ssFallback),
    placeholder: t.placeholder,
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
  return l && i && wi(
    u,
    l.clone(u)
  ), u;
}
function Le(t = " ", e = 0) {
  return H(Dr, null, t, e);
}
function bf(t, e) {
  const n = H(Xi, null, t);
  return n.staticCount = e, n;
}
function de(t = "", e = !1) {
  return e ? (O(), U(ze, null, t)) : H(ze, null, t);
}
function Ot(t) {
  return t == null || typeof t == "boolean" ? H(ze) : ee(t) ? H(
    Ee,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : xi(t) ? Ut(t) : H(Dr, null, String(t));
}
function Ut(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Qt(t);
}
function so(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (ee(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const r = e.default;
      r && (r._c && (r._d = !1), so(t, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = e._;
      !r && !oc(e) ? e._ctx = Ne : r === 3 && Ne && (Ne.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else le(e) ? (e = { default: e, _ctx: Ne }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Le(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function xe(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const r in i)
      if (r === "class")
        e.class !== i.class && (e.class = $t([e.class, i.class]));
      else if (r === "style")
        e.style = St([e.style, i.style]);
      else if (wr(r)) {
        const s = e[r], o = i[r];
        o && s !== o && !(ee(s) && s.includes(o)) && (e[r] = s ? [].concat(s, o) : o);
      } else r !== "" && (e[r] = i[r]);
  }
  return e;
}
function Tt(t, e, n, i = null) {
  wt(t, e, 7, [
    n,
    i
  ]);
}
const wf = ec();
let _f = 0;
function xf(t, e, n) {
  const i = t.type, r = (e ? e.appContext : t.appContext) || wf, s = {
    uid: _f++,
    vnode: t,
    type: i,
    parent: e,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new al(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(r.provides),
    ids: e ? e.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: lc(i, r),
    emitsOptions: nc(i, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: me,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: me,
    data: me,
    props: me,
    attrs: me,
    slots: me,
    refs: me,
    setupState: me,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Qd.bind(null, s), t.ce && t.ce(s), s;
}
let We = null;
const lt = () => We || Ne;
let dr, Rs;
{
  const t = Er(), e = (n, i) => {
    let r;
    return (r = t[n]) || (r = t[n] = []), r.push(i), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  dr = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => We = n
  ), Rs = e(
    "__VUE_SSR_SETTERS__",
    (n) => Si = n
  );
}
const Li = (t) => {
  const e = We;
  return dr(t), t.scope.on(), () => {
    t.scope.off(), dr(e);
  };
}, Uo = () => {
  We && We.scope.off(), dr(null);
};
function gc(t) {
  return t.vnode.shapeFlag & 4;
}
let Si = !1;
function Sf(t, e = !1, n = !1) {
  e && Rs(e);
  const { props: i, children: r } = t.vnode, s = gc(t);
  of(t, i, s, e), uf(t, r, n || e);
  const o = s ? Cf(t, e) : void 0;
  return e && Rs(!1), o;
}
function Cf(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, qd);
  const { setup: i } = n;
  if (i) {
    Yt();
    const r = t.setupContext = i.length > 1 ? bc(t) : null, s = Li(t), o = Mi(
      i,
      t,
      0,
      [
        t.props,
        r
      ]
    ), a = tl(o);
    if (Jt(), s(), (a || t.sp) && !Hn(t) && Gl(t), a) {
      if (o.then(Uo, Uo), e)
        return o.then((l) => {
          Ko(t, l);
        }).catch((l) => {
          Ir(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Ko(t, o);
  } else
    yc(t);
}
function Ko(t, e, n) {
  le(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = Al(e)), yc(t);
}
function yc(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || Mt);
  {
    const r = Li(t);
    Yt();
    try {
      Wd(t);
    } finally {
      Jt(), r();
    }
  }
}
const Ef = {
  get(t, e) {
    return je(t, "get", ""), t[e];
  }
};
function bc(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, Ef),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Br(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(Al(kl(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in pi)
        return pi[n](t);
    },
    has(e, n) {
      return n in e || n in pi;
    }
  })) : t.proxy;
}
function kf(t, e = !0) {
  return le(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Tf(t) {
  return le(t) && "__vccOpts" in t;
}
const R = (t, e) => /* @__PURE__ */ hd(t, e, Si);
function Rt(t, e, n) {
  try {
    ur(-1);
    const i = arguments.length;
    return i === 2 ? be(e) && !ee(e) ? xi(e) ? H(t, null, [e]) : H(t, e) : H(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && xi(n) && (n = [n]), H(t, e, n));
  } finally {
    ur(1);
  }
}
function Af(t, e, n, i) {
  const r = n[i];
  if (r && wc(r, t))
    return r;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = i, n[i] = s;
}
function wc(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Ke(n[i], e[i]))
      return !1;
  return Un > 0 && Ye && Ye.push(t), !0;
}
const Pf = "3.5.28";
let Ls;
const Go = typeof window < "u" && window.trustedTypes;
if (Go)
  try {
    Ls = /* @__PURE__ */ Go.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const _c = Ls ? (t) => Ls.createHTML(t) : (t) => t, Of = "http://www.w3.org/2000/svg", If = "http://www.w3.org/1998/Math/MathML", Wt = typeof document < "u" ? document : null, Xo = Wt && /* @__PURE__ */ Wt.createElement("template"), Mf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const r = e === "svg" ? Wt.createElementNS(Of, t) : e === "mathml" ? Wt.createElementNS(If, t) : n ? Wt.createElement(t, { is: n }) : Wt.createElement(t);
    return t === "select" && i && i.multiple != null && r.setAttribute("multiple", i.multiple), r;
  },
  createText: (t) => Wt.createTextNode(t),
  createComment: (t) => Wt.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => Wt.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, i, r, s) {
    const o = n ? n.previousSibling : e.lastChild;
    if (r && (r === s || r.nextSibling))
      for (; e.insertBefore(r.cloneNode(!0), n), !(r === s || !(r = r.nextSibling)); )
        ;
    else {
      Xo.innerHTML = _c(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Xo.content;
      if (i === "svg" || i === "mathml") {
        const l = a.firstChild;
        for (; l.firstChild; )
          a.appendChild(l.firstChild);
        a.removeChild(l);
      }
      e.insertBefore(a, n);
    }
    return [
      // first
      o ? o.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
}, on = "transition", ii = "animation", Ci = /* @__PURE__ */ Symbol("_vtc"), xc = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, Rf = /* @__PURE__ */ Te(
  {},
  Hl,
  xc
), Lf = (t) => (t.displayName = "Transition", t.props = Rf, t), Sc = /* @__PURE__ */ Lf(
  (t, { slots: e }) => Rt(Ad, Df(t), e)
), bn = (t, e = []) => {
  ee(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Yo = (t) => t ? ee(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Df(t) {
  const e = {};
  for (const P in t)
    P in xc || (e[P] = t[P]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: i,
    duration: r,
    enterFromClass: s = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = s,
    appearActiveClass: c = o,
    appearToClass: u = a,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: p = `${n}-leave-active`,
    leaveToClass: f = `${n}-leave-to`
  } = t, h = $f(r), m = h && h[0], y = h && h[1], {
    onBeforeEnter: C,
    onEnter: _,
    onEnterCancelled: b,
    onLeave: g,
    onLeaveCancelled: E,
    onBeforeAppear: k = C,
    onAppear: x = _,
    onAppearCancelled: M = b
  } = e, T = (P, V, D, K) => {
    P._enterCancelled = K, wn(P, V ? u : a), wn(P, V ? c : o), D && D();
  }, A = (P, V) => {
    P._isLeaving = !1, wn(P, d), wn(P, f), wn(P, p), V && V();
  }, L = (P) => (V, D) => {
    const K = P ? x : _, re = () => T(V, P, D);
    bn(K, [V, re]), Jo(() => {
      wn(V, P ? l : s), jt(V, P ? u : a), Yo(K) || Zo(V, i, m, re);
    });
  };
  return Te(e, {
    onBeforeEnter(P) {
      bn(C, [P]), jt(P, s), jt(P, o);
    },
    onBeforeAppear(P) {
      bn(k, [P]), jt(P, l), jt(P, c);
    },
    onEnter: L(!1),
    onAppear: L(!0),
    onLeave(P, V) {
      P._isLeaving = !0;
      const D = () => A(P, V);
      jt(P, d), P._enterCancelled ? (jt(P, p), ta(P)) : (ta(P), jt(P, p)), Jo(() => {
        P._isLeaving && (wn(P, d), jt(P, f), Yo(g) || Zo(P, i, y, D));
      }), bn(g, [P, D]);
    },
    onEnterCancelled(P) {
      T(P, !1, void 0, !0), bn(b, [P]);
    },
    onAppearCancelled(P) {
      T(P, !0, void 0, !0), bn(M, [P]);
    },
    onLeaveCancelled(P) {
      A(P), bn(E, [P]);
    }
  });
}
function $f(t) {
  if (t == null)
    return null;
  if (be(t))
    return [is(t.enter), is(t.leave)];
  {
    const e = is(t);
    return [e, e];
  }
}
function is(t) {
  return _s(t);
}
function jt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[Ci] || (t[Ci] = /* @__PURE__ */ new Set())).add(e);
}
function wn(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[Ci];
  n && (n.delete(e), n.size || (t[Ci] = void 0));
}
function Jo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Bf = 0;
function Zo(t, e, n, i) {
  const r = t._endId = ++Bf, s = () => {
    r === t._endId && i();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Ff(t, e);
  if (!o)
    return i();
  const c = o + "end";
  let u = 0;
  const d = () => {
    t.removeEventListener(c, p), s();
  }, p = (f) => {
    f.target === t && ++u >= l && d();
  };
  setTimeout(() => {
    u < l && d();
  }, a + 1), t.addEventListener(c, p);
}
function Ff(t, e) {
  const n = window.getComputedStyle(t), i = (h) => (n[h] || "").split(", "), r = i(`${on}Delay`), s = i(`${on}Duration`), o = Qo(r, s), a = i(`${ii}Delay`), l = i(`${ii}Duration`), c = Qo(a, l);
  let u = null, d = 0, p = 0;
  e === on ? o > 0 && (u = on, d = o, p = s.length) : e === ii ? c > 0 && (u = ii, d = c, p = l.length) : (d = Math.max(o, c), u = d > 0 ? o > c ? on : ii : null, p = u ? u === on ? s.length : l.length : 0);
  const f = u === on && /\b(?:transform|all)(?:,|$)/.test(
    i(`${on}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: p,
    hasTransform: f
  };
}
function Qo(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => ea(n) + ea(t[i])));
}
function ea(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function ta(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function zf(t, e, n) {
  const i = t[Ci];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const fr = /* @__PURE__ */ Symbol("_vod"), Cc = /* @__PURE__ */ Symbol("_vsh"), Nf = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[fr] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : ri(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: i }) {
    !e != !n && (i ? e ? (i.beforeEnter(t), ri(t, !0), i.enter(t)) : i.leave(t, () => {
      ri(t, !1);
    }) : ri(t, e));
  },
  beforeUnmount(t, { value: e }) {
    ri(t, e);
  }
};
function ri(t, e) {
  t.style.display = e ? t[fr] : "none", t[Cc] = !e;
}
const qf = /* @__PURE__ */ Symbol(""), Hf = /(?:^|;)\s*display\s*:/;
function Vf(t, e, n) {
  const i = t.style, r = ke(n);
  let s = !1;
  if (n && !r) {
    if (e)
      if (ke(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && Ji(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && Ji(i, o, "");
    for (const o in n)
      o === "display" && (s = !0), Ji(i, o, n[o]);
  } else if (r) {
    if (e !== n) {
      const o = i[qf];
      o && (n += ";" + o), i.cssText = n, s = Hf.test(n);
    }
  } else e && t.removeAttribute("style");
  fr in t && (t[fr] = s ? i.display : "", t[Cc] && (i.display = "none"));
}
const na = /\s*!important$/;
function Ji(t, e, n) {
  if (ee(n))
    n.forEach((i) => Ji(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = jf(t, e);
    na.test(n) ? t.setProperty(
      nt(i),
      n.replace(na, ""),
      "important"
    ) : t[i] = n;
  }
}
const ia = ["Webkit", "Moz", "ms"], rs = {};
function jf(t, e) {
  const n = rs[e];
  if (n)
    return n;
  let i = Fe(e);
  if (i !== "filter" && i in t)
    return rs[e] = i;
  i = Cr(i);
  for (let r = 0; r < ia.length; r++) {
    const s = ia[r] + i;
    if (s in t)
      return rs[e] = s;
  }
  return e;
}
const ra = "http://www.w3.org/1999/xlink";
function sa(t, e, n, i, r, s = qu(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(ra, e.slice(6, e.length)) : t.setAttributeNS(ra, e, n) : n == null || s && !rl(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : yt(n) ? String(n) : n
  );
}
function oa(t, e, n, i, r) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? _c(n) : n);
    return;
  }
  const s = t.tagName;
  if (e === "value" && s !== "PROGRESS" && // custom elements may use _value internally
  !s.includes("-")) {
    const a = s === "OPTION" ? t.getAttribute("value") || "" : t.value, l = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      t.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== l || !("_value" in t)) && (t.value = l), n == null && t.removeAttribute(e), t._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const a = typeof t[e];
    a === "boolean" ? n = rl(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(r || e);
}
function Wf(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Uf(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const aa = /* @__PURE__ */ Symbol("_vei");
function Kf(t, e, n, i, r = null) {
  const s = t[aa] || (t[aa] = {}), o = s[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Gf(e);
    if (i) {
      const c = s[e] = Jf(
        i,
        r
      );
      Wf(t, a, c, l);
    } else o && (Uf(t, a, o, l), s[e] = void 0);
  }
}
const la = /(?:Once|Passive|Capture)$/;
function Gf(t) {
  let e;
  if (la.test(t)) {
    e = {};
    let i;
    for (; i = t.match(la); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : nt(t.slice(2)), e];
}
let ss = 0;
const Xf = /* @__PURE__ */ Promise.resolve(), Yf = () => ss || (Xf.then(() => ss = 0), ss = Date.now());
function Jf(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    wt(
      Zf(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Yf(), n;
}
function Zf(t, e) {
  if (ee(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (i) => (r) => !r._stopped && i && i(r)
    );
  } else
    return e;
}
const ca = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, Qf = (t, e, n, i, r, s) => {
  const o = r === "svg";
  e === "class" ? zf(t, i, o) : e === "style" ? Vf(t, n, i) : wr(e) ? Us(e) || Kf(t, e, n, i, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : ep(t, e, i, o)) ? (oa(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && sa(t, e, i, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !ke(i)) ? oa(t, Fe(e), i, s, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), sa(t, e, i, o));
};
function ep(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && ca(e) && le(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const r = t.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ca(e) && ke(n) ? !1 : e in t;
}
const ua = {};
// @__NO_SIDE_EFFECTS__
function tp(t, e, n) {
  let i = /* @__PURE__ */ X(t, e);
  _r(i) && (i = Te({}, i, e));
  class r extends oo {
    constructor(o) {
      super(i, o, n);
    }
  }
  return r.def = i, r;
}
const np = typeof HTMLElement < "u" ? HTMLElement : class {
};
class oo extends np {
  constructor(e, n = {}, i = fa) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== fa ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
      Te({}, e.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this;
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let e = this;
    for (; e = e && (e.parentNode || e.host); )
      if (e instanceof oo) {
        this._parent = e;
        break;
      }
    this._instance || (this._resolved ? this._mount(this._def) : e && e._pendingResolve ? this._pendingResolve = e._pendingResolve.then(() => {
      this._pendingResolve = void 0, this._resolveDef();
    }) : this._resolveDef());
  }
  _setParent(e = this._parent) {
    e && (this._instance.parent = e._instance, this._inheritParentContext(e));
  }
  _inheritParentContext(e = this._parent) {
    e && this._app && Object.setPrototypeOf(
      this._app._context.provides,
      e._instance.provides
    );
  }
  disconnectedCallback() {
    this._connected = !1, Me(() => {
      this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets && (this._teleportTargets.clear(), this._teleportTargets = void 0));
    });
  }
  _processMutations(e) {
    for (const n of e)
      this._setAttr(n.attributeName);
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve)
      return;
    for (let i = 0; i < this.attributes.length; i++)
      this._setAttr(this.attributes[i].name);
    this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
    const e = (i, r = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: s, styles: o } = i;
      let a;
      if (s && !ee(s))
        for (const l in s) {
          const c = s[l];
          (c === Number || c && c.type === Number) && (l in this._props && (this._props[l] = _s(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[Fe(l)] = !0);
        }
      this._numberProps = a, this._resolveProps(i), this.shadowRoot && this._applyStyles(o), this._mount(i);
    }, n = this._def.__asyncLoader;
    n ? this._pendingResolve = n().then((i) => {
      i.configureApp = this._def.configureApp, e(this._def = i, !0);
    }) : e(this._def);
  }
  _mount(e) {
    this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const n = this._instance && this._instance.exposed;
    if (n)
      for (const i in n)
        ge(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => v(n[i])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, i = ee(n) ? n : Object.keys(n || {});
    for (const r of Object.keys(this))
      r[0] !== "_" && i.includes(r) && this._setProp(r, this[r]);
    for (const r of i.map(Fe))
      Object.defineProperty(this, r, {
        get() {
          return this._getProp(r);
        },
        set(s) {
          this._setProp(r, s, !0, !this._patching);
        }
      });
  }
  _setAttr(e) {
    if (e.startsWith("data-v-")) return;
    const n = this.hasAttribute(e);
    let i = n ? this.getAttribute(e) : ua;
    const r = Fe(e);
    n && this._numberProps && this._numberProps[r] && (i = _s(i)), this._setProp(r, i, !1, !0);
  }
  /**
   * @internal
   */
  _getProp(e) {
    return this._props[e];
  }
  /**
   * @internal
   */
  _setProp(e, n, i = !0, r = !1) {
    if (n !== this._props[e] && (this._dirty = !0, n === ua ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), i)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(nt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(nt(e), n + "") : n || this.removeAttribute(nt(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), ap(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = H(this._def, Te(e, this._props));
    return this._instance || (n.ce = (i) => {
      this._instance = i, i.ce = this, i.isCE = !0;
      const r = (s, o) => {
        this.dispatchEvent(
          new CustomEvent(
            s,
            _r(o[0]) ? Te({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      i.emit = (s, ...o) => {
        r(s, o), nt(s) !== s && r(nt(s), o);
      }, this._setParent();
    }), n;
  }
  _applyStyles(e, n) {
    if (!e) return;
    if (n) {
      if (n === this._def || this._styleChildren.has(n))
        return;
      this._styleChildren.add(n);
    }
    const i = this._nonce;
    for (let r = e.length - 1; r >= 0; r--) {
      const s = document.createElement("style");
      i && s.setAttribute("nonce", i), s.textContent = e[r], this.shadowRoot.prepend(s);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const e = this._slots = {};
    let n;
    for (; n = this.firstChild; ) {
      const i = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (e[i] || (e[i] = [])).push(n), this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const e = this._getSlots(), n = this._instance.type.__scopeId;
    for (let i = 0; i < e.length; i++) {
      const r = e[i], s = r.getAttribute("name") || "default", o = this._slots[s], a = r.parentNode;
      if (o)
        for (const l of o) {
          if (n && l.nodeType === 1) {
            const c = n + "-s", u = document.createTreeWalker(l, 1);
            l.setAttribute(c, "");
            let d;
            for (; d = u.nextNode(); )
              d.setAttribute(c, "");
          }
          a.insertBefore(l, r);
        }
      else
        for (; r.firstChild; ) a.insertBefore(r.firstChild, r);
      a.removeChild(r);
    }
  }
  /**
   * @internal
   */
  _getSlots() {
    const e = [this];
    this._teleportTargets && e.push(...this._teleportTargets);
    const n = /* @__PURE__ */ new Set();
    for (const i of e) {
      const r = i.querySelectorAll("slot");
      for (let s = 0; s < r.length; s++)
        n.add(r[s]);
    }
    return Array.from(n);
  }
  /**
   * @internal
   */
  _injectChildStyle(e) {
    this._applyStyles(e.styles, e);
  }
  /**
   * @internal
   */
  _beginPatch() {
    this._patching = !0, this._dirty = !1;
  }
  /**
   * @internal
   */
  _endPatch() {
    this._patching = !1, this._dirty && this._instance && this._update();
  }
  /**
   * @internal
   */
  _hasShadowRoot() {
    return this._def.shadowRoot !== !1;
  }
  /**
   * @internal
   */
  _removeChildStyle(e) {
  }
}
const ip = ["ctrl", "shift", "alt", "meta"], rp = {
  stop: (t) => t.stopPropagation(),
  prevent: (t) => t.preventDefault(),
  self: (t) => t.target !== t.currentTarget,
  ctrl: (t) => !t.ctrlKey,
  shift: (t) => !t.shiftKey,
  alt: (t) => !t.altKey,
  meta: (t) => !t.metaKey,
  left: (t) => "button" in t && t.button !== 0,
  middle: (t) => "button" in t && t.button !== 1,
  right: (t) => "button" in t && t.button !== 2,
  exact: (t, e) => ip.some((n) => t[`${n}Key`] && !e.includes(n))
}, Lt = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((r, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = rp[e[o]];
      if (a && a(r, e)) return;
    }
    return t(r, ...s);
  }));
}, sp = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, pr = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((r) => {
    if (!("key" in r))
      return;
    const s = nt(r.key);
    if (e.some(
      (o) => o === s || sp[o] === s
    ))
      return t(r);
  }));
}, op = /* @__PURE__ */ Te({ patchProp: Qf }, Mf);
let da;
function Ec() {
  return da || (da = ff(op));
}
const ap = ((...t) => {
  Ec().render(...t);
}), fa = ((...t) => {
  const e = Ec().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const r = cp(i);
    if (!r) return;
    const s = e._component;
    !le(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, lp(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, e;
});
function lp(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function cp(t) {
  return ke(t) ? document.querySelector(t) : t;
}
const up = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', dp = ["aria-label"], fp = /* @__PURE__ */ X({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (O(), oe("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      te(e.$slots, "default", {}, void 0, !0)
    ], 8, dp));
  }
}), pp = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", Oe = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, r] of e)
    n[i] = r;
  return n;
}, pa = /* @__PURE__ */ Oe(fp, [["styles", [pp]], ["__scopeId", "data-v-3d3f8eba"]]);
const hp = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ha = (t) => t === "";
const vp = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const va = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mp = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const gp = (t) => {
  const e = mp(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var si = {
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
const yp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": s,
  size: o = si.width,
  color: a = si.stroke,
  ...l
}, { slots: c }) => Rt(
  "svg",
  {
    ...si,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": ha(n) || ha(i) || n === !0 || i === !0 ? Number(r || s || si["stroke-width"]) * 24 / Number(o) : r || s || si["stroke-width"],
    class: vp(
      "lucide",
      l.class,
      ...t ? [`lucide-${va(gp(t))}-icon`, `lucide-${va(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !hp(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => Rt(...u)), ...c.default ? [c.default()] : []]
);
const qe = (t, e) => (n, { slots: i, attrs: r }) => Rt(
  yp,
  {
    ...r,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const bp = qe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Fr = qe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const kc = qe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const wp = qe("clipboard-list", [
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
const _p = qe("clipboard-type", [
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
const xp = qe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Sp = qe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const ma = qe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Cp = qe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Ep = qe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const kp = qe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Tp = qe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Ap = qe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Pp = qe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Op = qe("volume-2", [
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
const Ip = qe("volume-x", [
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
const ao = qe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Mp = {
  "arrow-down": bp,
  check: Fr,
  "chevron-down": kc,
  "clipboard-list": wp,
  "clipboard-type": _p,
  copy: xp,
  download: Sp,
  pause: Cp,
  play: Ep,
  settings: kp,
  "skip-back": Tp,
  "skip-forward": Ap,
  users: Pp,
  volume: Op,
  "volume-mute": Ip,
  x: ao,
  "circle-notch": ma,
  spinner: ma
};
function Ds(t) {
  if (t)
    return Mp[t];
}
const Tc = {
  sm: 16,
  md: 20,
  lg: 24
}, Rp = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Lp = /* @__PURE__ */ X({
  __name: "EditorIcon",
  props: {
    name: { type: String },
    size: { type: Number },
    spin: { type: Boolean }
  },
  setup(t) {
    const e = t, n = R(() => Ds(e.name)), i = R(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (r, s) => n.value ? (O(), U(to(n.value), {
      key: 0,
      style: St(i.value),
      class: $t(["editor-icon", { "editor-icon--spin": t.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (O(), oe("span", Rp, "?"));
  }
}), Dp = ".editor-icon[data-v-210c7f09]{flex-shrink:0}.editor-icon--missing[data-v-210c7f09]{display:inline-flex;align-items:center;justify-content:center;opacity:.5;font-size:1em;line-height:1}.editor-icon--spin[data-v-210c7f09]{animation:editor-icon-spin-210c7f09 1s linear infinite}@keyframes editor-icon-spin-210c7f09{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.editor-icon--spin[data-v-210c7f09]{animation:none}}", Zi = /* @__PURE__ */ Oe(Lp, [["styles", [Dp]], ["__scopeId", "data-v-210c7f09"]]), $p = ["type", "disabled", "aria-disabled", "aria-label"], Bp = {
  key: 3,
  class: "editor-btn__label"
}, Fp = /* @__PURE__ */ X({
  __name: "EditorButton",
  props: {
    label: { type: String },
    icon: { type: String },
    iconRight: { type: String },
    variant: { default: "tertiary", type: String },
    intent: { default: "default", type: String },
    size: { default: "sm", type: String },
    disabled: { type: Boolean, default: !1 },
    loading: { type: Boolean, default: !1 },
    block: { type: Boolean, default: !1 },
    type: { default: "button", type: String },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = Hd(), i = R(() => !!Ds(e.icon)), r = R(() => !!Ds(e.iconRight)), s = R(() => Tc[e.size]), o = R(() => e.disabled || e.loading), a = R(() => !!e.label || !!n.default), l = R(
      () => e.loading || i.value || !!n.icon
    ), c = R(() => l.value && !a.value), u = R(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      c.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, p) => (O(), oe("button", {
      type: t.type,
      class: $t(u.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": t.ariaLabel
    }, [
      t.loading ? (O(), U(Zi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : i.value ? (O(), U(Zi, {
        key: 1,
        name: t.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? te(d.$slots, "icon", { key: 2 }, void 0, !0) : de("", !0),
      a.value ? (O(), oe("span", Bp, [
        te(d.$slots, "default", {}, () => [
          Le(fe(t.label), 1)
        ], !0)
      ])) : de("", !0),
      r.value ? (O(), U(Zi, {
        key: 4,
        name: t.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? te(d.$slots, "icon-right", { key: 5 }, void 0, !0) : de("", !0)
    ], 10, $p));
  }
}), zp = ".editor-btn[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary);--btn-padding-y: 0;--btn-padding-x: var(--spacing-sm);--btn-font-size: var(--font-size-xs);--btn-height: 32px;--btn-gap: var(--spacing-xs);display:inline-flex;align-items:center;justify-content:center;gap:var(--btn-gap);box-sizing:border-box;height:var(--btn-height);padding:var(--btn-padding-y) var(--btn-padding-x);font-family:var(--font-family);font-size:var(--btn-font-size);font-weight:500;line-height:1;color:var(--btn-text);background-color:var(--btn-bg);border:1px solid var(--btn-border-color);border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap;transition:background-color var(--transition-duration),color var(--transition-duration),border-color var(--transition-duration)}.editor-btn[data-v-88f77497]:hover:not(:disabled){background-color:var(--btn-hover-bg);color:var(--btn-hover-text)}.editor-btn[data-v-88f77497]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-88f77497]:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.editor-btn__label[data-v-88f77497]{text-overflow:ellipsis;text-box:cap alphabetic}.editor-btn--md[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-sm);--btn-height: 40px}.editor-btn--lg[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-base);--btn-height: 44px}.editor-btn--icon-only[data-v-88f77497]{width:var(--btn-height);padding:0}.editor-btn--block[data-v-88f77497]{display:flex;width:100%}.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-primary);--btn-text: var(--color-white);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary-hover);--btn-hover-text: var(--color-white)}.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-primary);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary);--btn-hover-text: var(--color-white)}.editor-btn--tertiary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-primary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--transparent[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: transparent;--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--destructive.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-danger);--btn-text: var(--color-white);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger-hover);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-danger);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--tertiary[data-v-88f77497],.editor-btn--destructive.editor-btn--transparent[data-v-88f77497]{--btn-text: var(--color-danger);--btn-hover-bg: var(--color-danger-soft);--btn-hover-text: var(--color-danger)}", ft = /* @__PURE__ */ Oe(Fp, [["styles", [zp]], ["__scopeId", "data-v-88f77497"]]), Ac = {
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
  "selection.copyWithMetadata": "Copier avec les timestamps",
  "selection.cancel": "Annuler",
  "selection.select": "Sélectionner {name}",
  "selection.deselect": "Désélectionner {name}"
}, Np = {
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
  "selection.copyWithMetadata": "Copy with timestamps",
  "selection.cancel": "Cancel",
  "selection.select": "Select {name}",
  "selection.deselect": "Deselect {name}"
}, ga = { fr: Ac, en: Np }, Pc = /* @__PURE__ */ Symbol("i18n");
function qp(t) {
  const e = R(() => {
    const i = ga[t.value] ?? ga.fr;
    return (r) => i[r] ?? r;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return Jn(Pc, n), n;
}
function ht() {
  const t = Xt(Pc);
  if (t) return t;
  const e = R(() => "fr");
  return {
    t: (n) => Ac[n] ?? n,
    locale: e
  };
}
function Hp(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), r = parseInt(n.substring(2, 4), 16), s = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${s}, ${e})`;
}
function vi(t, e, n = "*") {
  if (t === "*") return n;
  const i = t.split("-")[0] ?? t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(i) ?? i;
  } catch {
    return t;
  }
}
function Vp(t, e, n, i = "*") {
  return [...t].sort((r, s) => {
    if (r.isSource) return -1;
    if (s.isSource) return 1;
    const o = vi(
      r.languages[0] ?? "",
      e,
      i
    ), a = vi(
      s.languages[0] ?? "",
      e,
      i
    );
    return o.localeCompare(a, e);
  }).map((r) => ({
    value: r.id,
    label: r.languages.map((s) => vi(s, e, i)).join(", "),
    ...r.isSource && { originalLabel: n }
  }));
}
function jp(t, e = 250) {
  let n = !1, i = null;
  return (...r) => {
    if (n) {
      i = r;
      return;
    }
    n = !0, t(...r), setTimeout(() => {
      if (n = !1, i !== null) {
        const s = i;
        i = null, t(...s);
      }
    }, e);
  };
}
function Ei(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, s = String(i).padStart(2, "0"), o = String(r).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class tt extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Wp(t) {
  if (t == null || typeof t != "object")
    throw new tt("document", "must be a non-null object");
  const e = t;
  if (typeof e.title != "string")
    throw new tt("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new tt("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new tt("document.channels", "must be an array");
  for (let n = 0; n < e.channels.length; n++) {
    const i = e.channels[n], r = `channels[${n}]`;
    if (i == null || typeof i != "object")
      throw new tt(r, "must be a non-null object");
    if (typeof i.id != "string")
      throw new tt(`${r}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new tt(`${r}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new tt(`${r}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new tt(`${r}.translations`, "must be an array");
    for (let s = 0; s < i.translations.length; s++) {
      const o = i.translations[s], a = `${r}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new tt(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new tt(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new tt(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new tt(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new tt(`${a}.turns`, "must be an array");
    }
  }
}
function Up(t, e) {
  const { width: n, height: i } = e.canvas, r = t[0], s = r.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(r[l] ?? 0);
    let u = a, d = c * (i / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function Oc(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Kp(t, e) {
  if (!Oc(t)) return null;
  let n = 0, i = t.length - 1;
  for (; n <= i; ) {
    const r = n + i >>> 1, s = t[r];
    if (e < s.startTime)
      i = r - 1;
    else if (e > s.endTime)
      n = r + 1;
    else
      return s.id;
  }
  return null;
}
const Gp = { class: "editor-header" }, Xp = { class: "header-left" }, Yp = { class: "document-title" }, Jp = { class: "badges" }, Zp = ["datetime"], Qp = { class: "header-right" }, eh = /* @__PURE__ */ X({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = ht(), r = R(() => vi(e.language, i.value, n("language.wildcard"))), s = R(() => Ei(e.duration)), o = R(() => e.title.replace(/-/g, " "));
    return (a, l) => (O(), oe("header", Gp, [
      ie("div", Xp, [
        ie("h1", Yp, fe(o.value), 1),
        ie("div", Jp, [
          H(pa, null, {
            default: q(() => [
              Le(fe(r.value), 1)
            ]),
            _: 1
          }),
          H(pa, null, {
            default: q(() => [
              ie("time", {
                datetime: `PT${t.duration}S`
              }, fe(s.value), 9, Zp)
            ]),
            _: 1
          })
        ])
      ]),
      ie("div", Qp, [
        t.isMobile ? (O(), U(ft, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : de("", !0),
        t.isMobile ? (O(), U(ft, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, null, 8, ["aria-label"])) : (O(), U(ft, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: q(() => [
            Le(fe(v(n)("header.export")), 1)
          ]),
          _: 1
        })),
        H(ft, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": v(n)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), th = ".editor-header[data-v-c5fd975f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-c5fd975f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-c5fd975f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-c5fd975f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-c5fd975f]{display:none}.document-title[data-v-c5fd975f]{font-size:var(--font-size-base)}}", nh = /* @__PURE__ */ Oe(eh, [["styles", [th]], ["__scopeId", "data-v-c5fd975f"]]), os = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, ih = 70, rh = 1e3 / 60, sh = 350;
let Qi = !1, ya = !1;
function oh() {
  ya || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Qi = !0;
  }), document.addEventListener("mouseup", () => {
    Qi = !1;
  }), document.addEventListener("click", () => {
    Qi = !1;
  }), ya = !0);
}
const as = /* @__PURE__ */ new Map();
function ls(...t) {
  const e = {
    damping: os.damping,
    stiffness: os.stiffness,
    mass: os.mass
  };
  let n = !1;
  for (const r of t) {
    if (r === "instant") {
      n = !0;
      continue;
    }
    typeof r != "object" || !r || (n = !1, e.damping = r.damping ?? e.damping, e.stiffness = r.stiffness ?? e.stiffness, e.mass = r.mass ?? e.mass);
  }
  const i = JSON.stringify(e);
  return as.has(i) || as.set(i, Object.freeze({ ...e })), n ? "instant" : as.get(i);
}
function ah(t = {}) {
  oh();
  let e = { ...t };
  const n = /* @__PURE__ */ new Set(), i = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function r() {
    const A = s();
    for (const L of n) L(A);
  }
  function s() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function o() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(A) {
    i.scrollElement && (i.scrollElement.scrollTop = A, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const A = i.scrollElement, L = i.contentElement;
    return !A || !L ? 0 : A.scrollHeight - 1 - A.clientHeight;
  }
  let c;
  function u() {
    const A = i.scrollElement, L = i.contentElement;
    if (!A || !L)
      return 0;
    const P = l();
    if (!e.targetScrollTop)
      return P;
    if (c?.targetScrollTop === P)
      return c.calculatedScrollTop;
    const V = Math.max(
      Math.min(
        e.targetScrollTop(P, {
          scrollElement: A,
          contentElement: L
        }),
        P
      ),
      0
    );
    return c = { targetScrollTop: P, calculatedScrollTop: V }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), V;
  }
  function d() {
    return u() - o();
  }
  function p() {
    return d() <= ih;
  }
  function f(A) {
    i.isAtBottom = A, r();
  }
  function h(A) {
    i.escapedFromLock = A, r();
  }
  function m(A) {
    i.isNearBottom = A, r();
  }
  function y() {
    if (!Qi || typeof window > "u")
      return !1;
    const A = window.getSelection?.();
    if (!A || !A.rangeCount)
      return !1;
    const L = A.getRangeAt(0), P = i.scrollElement;
    if (!P)
      return !1;
    const V = L.commonAncestorContainer;
    return !!(V && (P.contains(V) || V.contains(P)));
  }
  const C = (A) => {
    if (A.target !== i.scrollElement)
      return;
    const L = o(), P = i.ignoreScrollToTop;
    let V = i.lastScrollTop ?? L;
    i.lastScrollTop = L, i.ignoreScrollToTop = void 0, P && P > L && (V = P), m(p()), setTimeout(() => {
      if (i.resizeDifference || L === P)
        return;
      if (y()) {
        h(!0), f(!1);
        return;
      }
      const D = L > V, K = L < V;
      if (i.animation?.ignoreEscapes) {
        a(V);
        return;
      }
      K && (h(!0), f(!1)), D && h(!1), !i.escapedFromLock && p() && f(!0);
    }, 1);
  }, _ = (A) => {
    const L = i.scrollElement;
    if (!L)
      return;
    let P = A.target;
    for (; P && !["scroll", "auto"].includes(getComputedStyle(P).overflow); ) {
      if (!P.parentElement)
        return;
      P = P.parentElement;
    }
    P === L && A.deltaY < 0 && L.scrollHeight > L.clientHeight && !i.animation?.ignoreEscapes && (h(!0), f(!1));
  };
  function b(A, L) {
    g(), i.scrollElement = A, i.contentElement = L, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", C, { passive: !0 }), A.addEventListener("wheel", _, { passive: !0 });
    let P;
    i.resizeObserver = new ResizeObserver((V) => {
      const D = V[0];
      if (!D)
        return;
      const { height: K } = D.contentRect, re = K - (P ?? K);
      if (i.resizeDifference = re, o() > l() && a(l()), m(p()), re >= 0) {
        const Z = ls(
          e,
          P ? e.resize : e.initial
        );
        x({
          animation: Z,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Z === "instant" ? void 0 : sh
        });
      } else
        p() && (h(!1), f(!0));
      P = K, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === re && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(L);
  }
  function g() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", C), i.scrollElement.removeEventListener("wheel", _)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function E() {
    g(), n.clear();
  }
  function k(A) {
    e = { ...e, ...A };
  }
  function x(A = {}) {
    const L = typeof A == "string" ? { animation: A } : A;
    L.preserveScrollPosition || f(!0);
    const P = Date.now() + (Number(L.wait) || 0), V = ls(e, L.animation), { ignoreEscapes: D = !1 } = L;
    let K, re = u();
    L.duration instanceof Promise ? L.duration.finally(() => {
      K = Date.now();
    }) : K = P + (L.duration ?? 0);
    const Z = async () => {
      const Q = new Promise((we) => {
        if (typeof requestAnimationFrame > "u") {
          we(!1);
          return;
        }
        requestAnimationFrame(() => we(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const we = o(), $e = typeof performance < "u" ? performance.now() : Date.now(), Ze = ($e - (i.lastTick ?? $e)) / rh;
        if (i.animation ||= { behavior: V, promise: Q, ignoreEscapes: D }, i.animation.behavior === V && (i.lastTick = $e), y() || P > Date.now())
          return Z();
        if (we < Math.min(re, u())) {
          if (i.animation?.behavior === V) {
            if (V === "instant")
              return a(u()), Z();
            const Pe = V;
            i.velocity = (Pe.damping * i.velocity + Pe.stiffness * d()) / Pe.mass, i.accumulated += i.velocity * Ze;
            const Nt = o();
            a(Nt + i.accumulated), o() !== Nt && (i.accumulated = 0);
          }
          return Z();
        }
        return K > Date.now() ? (re = u(), Z()) : (i.animation = void 0, o() < u() ? x({
          animation: ls(e, e.resize),
          ignoreEscapes: D,
          duration: Math.max(0, K - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return Q.then((we) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), we));
    };
    return L.wait !== !0 && (i.animation = void 0), i.animation?.behavior === V ? i.animation.promise : Z();
  }
  const M = () => {
    h(!0), f(!1);
  };
  function T(A) {
    return n.add(A), () => n.delete(A);
  }
  return {
    attach: b,
    detach: g,
    destroy: E,
    setOptions: k,
    getState: s,
    onChange: T,
    scrollToBottom: x,
    stopScroll: M
  };
}
function lh(t = {}) {
  const e = /* @__PURE__ */ z(null), n = /* @__PURE__ */ z(null), i = /* @__PURE__ */ z(t.initial !== !1), r = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), o = ah(t);
  let a = null;
  return pt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((c) => {
      i.value = c.isAtBottom, r.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), hn(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: n,
    isAtBottom: i,
    isNearBottom: r,
    escapedFromLock: s,
    scrollToBottom: (l) => o.scrollToBottom(l),
    stopScroll: () => o.stopScroll(),
    setOptions: (l) => o.setOptions(l)
  };
}
const ch = /* @__PURE__ */ X({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (O(), oe("span", {
      class: "speaker-indicator",
      style: St({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), uh = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", Ic = /* @__PURE__ */ Oe(ch, [["styles", [uh]], ["__scopeId", "data-v-9bffeda8"]]), dh = { class: "speaker-label" }, fh = {
  key: 1,
  class: "speaker-name"
}, ph = ["datetime"], hh = { class: "lang" }, vh = /* @__PURE__ */ X({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = ht(), r = R(
      () => vi(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), s = R(
      () => e.startTime != null ? Ei(e.startTime) : null
    ), o = R(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = R(() => e.speaker?.color ?? "transparent");
    return (l, c) => (O(), oe("div", dh, [
      t.speaker ? (O(), U(Ic, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : de("", !0),
      t.speaker ? (O(), oe("span", fh, fe(t.speaker.name), 1)) : de("", !0),
      s.value ? (O(), oe("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, fe(s.value), 9, ph)) : de("", !0),
      ie("span", hh, fe(r.value), 1)
    ]));
  }
}), mh = ".speaker-label[data-v-64a75575]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-64a75575]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-64a75575]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);text-box:trim-both cap alphabetic}.lang[data-v-64a75575]{font-size:var(--font-size-xs);font-weight:400;text-box:trim-both cap alphabetic}", gh = /* @__PURE__ */ Oe(vh, [["styles", [mh]], ["__scopeId", "data-v-64a75575"]]);
function ba(t) {
  return typeof t == "string" ? `'${t}'` : new yh().serialize(t);
}
const yh = /* @__PURE__ */ (function() {
  class t {
    #e = /* @__PURE__ */ new Map();
    compare(n, i) {
      const r = typeof n, s = typeof i;
      return r === "string" && s === "string" ? n.localeCompare(i) : r === "number" && s === "number" ? n - i : String.prototype.localeCompare.call(this.serialize(n, !0), this.serialize(i, !0));
    }
    serialize(n, i) {
      if (n === null) return "null";
      switch (typeof n) {
        case "string":
          return i ? n : `'${n}'`;
        case "bigint":
          return `${n}n`;
        case "object":
          return this.$object(n);
        case "function":
          return this.$function(n);
      }
      return String(n);
    }
    serializeObject(n) {
      const i = Object.prototype.toString.call(n);
      if (i !== "[object Object]") return this.serializeBuiltInType(i.length < 10 ? `unknown:${i}` : i.slice(8, -1), n);
      const r = n.constructor, s = r === Object || r === void 0 ? "" : r.name;
      if (s !== "" && globalThis[s] === r) return this.serializeBuiltInType(s, n);
      if (typeof n.toJSON == "function") {
        const o = n.toJSON();
        return s + (o !== null && typeof o == "object" ? this.$object(o) : `(${this.serialize(o)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(n));
    }
    serializeBuiltInType(n, i) {
      const r = this["$" + n];
      if (r) return r.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(n, i.entries());
      throw new Error(`Cannot serialize ${n}`);
    }
    serializeObjectEntries(n, i) {
      const r = Array.from(i).sort((o, a) => this.compare(o[0], a[0]));
      let s = `${n}{`;
      for (let o = 0; o < r.length; o++) {
        const [a, l] = r[o];
        s += `${this.serialize(a, !0)}:${this.serialize(l)}`, o < r.length - 1 && (s += ",");
      }
      return s + "}";
    }
    $object(n) {
      let i = this.#e.get(n);
      return i === void 0 && (this.#e.set(n, `#${this.#e.size}`), i = this.serializeObject(n), this.#e.set(n, i)), i;
    }
    $function(n) {
      const i = Function.prototype.toString.call(n);
      return i.slice(-15) === "[native code] }" ? `${n.name || ""}()[native]` : `${n.name}(${n.length})${i.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(n) {
      let i = "[";
      for (let r = 0; r < n.length; r++) i += this.serialize(n[r]), r < n.length - 1 && (i += ",");
      return i + "]";
    }
    $Date(n) {
      try {
        return `Date(${n.toISOString()})`;
      } catch {
        return "Date(null)";
      }
    }
    $ArrayBuffer(n) {
      return `ArrayBuffer[${new Uint8Array(n).join(",")}]`;
    }
    $Set(n) {
      return `Set${this.$Array(Array.from(n).sort((i, r) => this.compare(i, r)))}`;
    }
    $Map(n) {
      return this.serializeObjectEntries("Map", n.entries());
    }
  }
  for (const e of ["Error", "RegExp", "URL"]) t.prototype["$" + e] = function(n) {
    return `${e}(${n})`;
  };
  for (const e of ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]) t.prototype["$" + e] = function(n) {
    return `${e}[${n.join(",")}]`;
  };
  for (const e of ["BigInt64Array", "BigUint64Array"]) t.prototype["$" + e] = function(n) {
    return `${e}[${n.join("n,")}${n.length > 0 ? "n" : ""}]`;
  };
  return t;
})();
function Tn(t, e) {
  return t === e || ba(t) === ba(e);
}
function bh(t, e, n) {
  const i = t.findIndex((a) => Tn(a, e)), r = t.findIndex((a) => Tn(a, n));
  if (i === -1 || r === -1) return [];
  const [s, o] = [i, r].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function wa(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function ct(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = Xt(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (Jn(i, o), o)];
}
function it() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function zr(t, e, n) {
  const i = n.originalEvent.target, r = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(r);
}
function Kn(t) {
  return t == null;
}
function _a(t, e) {
  return Kn(t) ? !1 : Array.isArray(t) ? t.some((n) => Tn(n, e)) : Tn(t, e);
}
function lo(t) {
  return t ? t.flatMap((e) => e.type === Ee ? lo(e.children) : [e]) : [];
}
const [co] = ct("ConfigProvider");
function wh(t, e) {
  var n;
  const i = /* @__PURE__ */ dn();
  return pt(() => {
    i.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ rr(i);
}
function Nr(t, e) {
  return Ys() ? (cl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function cs() {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    t.delete(s);
  };
  return {
    on: (s) => {
      t.add(s);
      const o = () => e(s);
      return Nr(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(t).map((o) => o(...s))),
    clear: () => {
      t.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function _h(t) {
  let e = !1, n;
  const i = ll(!0);
  return ((...r) => (e || (n = i.run(() => t(...r)), e = !0), n));
}
const rn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const xh = (t) => typeof t < "u", Sh = Object.prototype.toString, Ch = (t) => Sh.call(t) === "[object Object]", xa = /* @__PURE__ */ Eh();
function Eh() {
  var t, e, n;
  return rn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function us(t) {
  return Array.isArray(t) ? t : [t];
}
function kh(t) {
  return lt();
}
// @__NO_SIDE_EFFECTS__
function Th(t) {
  if (!rn) return t;
  let e = 0, n, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = ll(!0), n = i.run(() => t(...s))), Nr(r), n));
}
function Mc(t, e = 1e4) {
  return Pl((n, i) => {
    let r = Je(t), s;
    const o = () => setTimeout(() => {
      r = Je(t), i();
    }, Je(e));
    return Nr(() => {
      clearTimeout(s);
    }), {
      get() {
        return n(), r;
      },
      set(a) {
        r = a, i(), clearTimeout(s), s = o();
      }
    };
  });
}
function Ah(t, e) {
  kh() && hn(t, e);
}
function Ph(t, e, n) {
  return ye(t, e, {
    ...n,
    immediate: !0
  });
}
const qr = rn ? window : void 0;
function Bt(t) {
  var e;
  const n = Je(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Rc(...t) {
  const e = (i, r, s, o) => (i.addEventListener(r, s, o), () => i.removeEventListener(r, s, o)), n = R(() => {
    const i = us(Je(t[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return Ph(() => {
    var i, r;
    return [
      (i = (r = n.value) === null || r === void 0 ? void 0 : r.map((s) => Bt(s))) !== null && i !== void 0 ? i : [qr].filter((s) => s != null),
      us(Je(n.value ? t[1] : t[0])),
      us(v(n.value ? t[2] : t[1])),
      Je(n.value ? t[3] : t[2])
    ];
  }, ([i, r, s, o], a, l) => {
    if (!i?.length || !r?.length || !s?.length) return;
    const c = Ch(o) ? { ...o } : o, u = i.flatMap((d) => r.flatMap((p) => s.map((f) => e(d, p, f, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Lc() {
  const t = /* @__PURE__ */ dn(!1), e = lt();
  return e && De(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function Oh(t) {
  const e = /* @__PURE__ */ Lc();
  return R(() => (e.value, !!t()));
}
function Ih(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function Mh(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: r = qr, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = Ih(e);
  return Rc(r, s, (u) => {
    u.repeat && Je(a) || l(u) && n(u);
  }, o);
}
function Rh(t) {
  return JSON.parse(JSON.stringify(t));
}
function Lh(t, e, n = {}) {
  const { window: i = qr, ...r } = n;
  let s;
  const o = /* @__PURE__ */ Oh(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = ye(R(() => {
    const u = Je(t);
    return Array.isArray(u) ? u.map((d) => Bt(d)) : [Bt(u)];
  }), (u) => {
    if (a(), o.value && i) {
      s = new ResizeObserver(e);
      for (const d of u) d && s.observe(d, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    a(), l();
  };
  return Nr(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ki(t, e, n, i = {}) {
  var r, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = i, p = lt(), f = n || p?.emit || (p == null || (r = p.$emit) === null || r === void 0 ? void 0 : r.bind(p)) || (p == null || (s = p.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(p?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const m = (_) => o ? typeof o == "function" ? o(_) : Rh(_) : _, y = () => xh(t[e]) ? m(t[e]) : u, C = (_) => {
    d ? d(_) && f(h, _) : f(h, _);
  };
  if (a) {
    const _ = /* @__PURE__ */ z(y());
    let b = !1;
    return ye(() => t[e], (g) => {
      b || (b = !0, _.value = m(g), Me(() => b = !1));
    }), ye(_, (g) => {
      !b && (g !== t[e] || c) && C(g);
    }, { deep: c }), _;
  } else return R({
    get() {
      return y();
    },
    set(_) {
      C(_);
    }
  });
}
function ds(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function $s(t, e, n = ".", i) {
  if (!ds(e))
    return $s(t, {}, n, i);
  const r = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (i && i(r, s, o, n) || (Array.isArray(o) && Array.isArray(r[s]) ? r[s] = [...o, ...r[s]] : ds(o) && ds(r[s]) ? r[s] = $s(
      o,
      r[s],
      (n ? `${n}.` : "") + s.toString(),
      i
    ) : r[s] = o));
  }
  return r;
}
function Dh(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => $s(n, i, "", t), {})
  );
}
const $h = Dh(), Bh = /* @__PURE__ */ Th(() => {
  const t = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ z(), n = R(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = co({ scrollBody: /* @__PURE__ */ z(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", xa && r?.(), e.value = void 0;
  };
  return ye(n, (o, a) => {
    if (!rn) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? $h({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), xa && (r = Rc(document, "touchmove", (d) => Fh(d), { passive: !1 })), Me(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Dc(t) {
  const e = Math.random().toString(36).substring(2, 7), n = Bh();
  n.value.set(e, t ?? !1);
  const i = R({
    get: () => n.value.get(e) ?? !1,
    set: (r) => n.value.set(e, r)
  });
  return Ah(() => {
    n.value.delete(e);
  }), i;
}
function $c(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : $c(n);
  }
}
function Fh(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && $c(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Bc(t) {
  const e = co({ dir: /* @__PURE__ */ z("ltr") });
  return R(() => t?.value || e.dir?.value || "ltr");
}
function Hr(t) {
  const e = lt(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((r) => {
    i[Ui(Fe(r))] = (...s) => t(r, ...s);
  }), i;
}
let fs = 0;
function zh() {
  pt((t) => {
    if (!rn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Sa()), document.body.insertAdjacentElement("beforeend", e[1] ?? Sa()), fs++, t(() => {
      fs === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), fs--;
    });
  });
}
function Sa() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function uo(t) {
  return R(() => Je(t) ? !!Bt(t)?.closest("form") : !0);
}
function Re() {
  const t = lt(), e = /* @__PURE__ */ z(), n = R(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Bt(e)), i = Object.assign({}, t.exposed), r = {};
  for (const o in t.props) Object.defineProperty(r, o, {
    enumerable: !0,
    configurable: !0,
    get: () => t.props[o]
  });
  if (Object.keys(i).length > 0) for (const o in i) Object.defineProperty(r, o, {
    enumerable: !0,
    configurable: !0,
    get: () => i[o]
  });
  Object.defineProperty(r, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => t.vnode.el
  }), t.exposed = r;
  function s(o) {
    if (e.value = o, !!o && (Object.defineProperty(r, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => o instanceof Element ? o : o.$el
    }), !(o instanceof Element) && !Object.hasOwn(o, "$el"))) {
      const a = o.$.exposed, l = Object.assign({}, r);
      for (const c in a) Object.defineProperty(l, c, {
        enumerable: !0,
        configurable: !0,
        get: () => a[c]
      });
      t.exposed = l;
    }
  }
  return {
    forwardRef: s,
    currentRef: e,
    currentElement: n
  };
}
function fo(t) {
  const e = lt(), n = Object.keys(e?.type.props ?? {}).reduce((r, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (r[s] = o), r;
  }, {}), i = /* @__PURE__ */ Ki(t);
  return R(() => {
    const r = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      r[Fe(o)] = s[o];
    }), Object.keys({
      ...n,
      ...r
    }).reduce((o, a) => (i.value[a] !== void 0 && (o[a] = i.value[a]), o), {});
  });
}
function Nh(t, e) {
  const n = fo(t), i = e ? Hr(e) : {};
  return R(() => ({
    ...n.value,
    ...i
  }));
}
var qh = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Dn = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Hi = {}, ps = 0, Fc = function(t) {
  return t && (t.host || Fc(t.parentNode));
}, Hh = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = Fc(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Vh = function(t, e, n, i) {
  var r = Hh(e, Array.isArray(t) ? t : [t]);
  Hi[n] || (Hi[n] = /* @__PURE__ */ new WeakMap());
  var s = Hi[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(r), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  r.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (a.has(p))
        u(p);
      else
        try {
          var f = p.getAttribute(i), h = f !== null && f !== "false", m = (Dn.get(p) || 0) + 1, y = (s.get(p) || 0) + 1;
          Dn.set(p, m), s.set(p, y), o.push(p), m === 1 && h && qi.set(p, !0), y === 1 && p.setAttribute(n, "true"), h || p.setAttribute(i, "true");
        } catch (C) {
          console.error("aria-hidden: cannot operate on ", p, C);
        }
    });
  };
  return u(e), a.clear(), ps++, function() {
    o.forEach(function(d) {
      var p = Dn.get(d) - 1, f = s.get(d) - 1;
      Dn.set(d, p), s.set(d, f), p || (qi.has(d) || d.removeAttribute(i), qi.delete(d)), f || d.removeAttribute(n);
    }), ps--, ps || (Dn = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Hi = {});
  };
}, jh = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), r = qh(t);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), Vh(i, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function zc(t) {
  let e;
  ye(() => Bt(t), (n) => {
    n ? e = jh(n) : e && e();
  }), vn(() => {
    e && e();
  });
}
function Gn(t, e = "reka") {
  return `${e}-${Kl?.()}`;
}
function Wh() {
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
function Uh(t) {
  const e = /* @__PURE__ */ z(), n = R(() => e.value?.width ?? 0), i = R(() => e.value?.height ?? 0);
  return De(() => {
    const r = Bt(t);
    if (r) {
      e.value = {
        width: r.offsetWidth,
        height: r.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
        let l, c;
        if ("borderBoxSize" in a) {
          const u = a.borderBoxSize, d = Array.isArray(u) ? u[0] : u;
          l = d.inlineSize, c = d.blockSize;
        } else
          l = r.offsetWidth, c = r.offsetHeight;
        e.value = {
          width: l,
          height: c
        };
      });
      return s.observe(r, { box: "border-box" }), () => s.unobserve(r);
    } else e.value = void 0;
  }), {
    width: n,
    height: i
  };
}
function Kh(t, e) {
  const n = /* @__PURE__ */ z(t);
  function i(s) {
    return e[n.value][s] ?? n.value;
  }
  return {
    state: n,
    dispatch: (s) => {
      n.value = i(s);
    }
  };
}
function po(t) {
  const e = Mc("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, s) => {
      e.value = e.value + r;
      {
        const o = it(), a = s.map((p) => ({
          ...p,
          textValue: p.value?.textValue ?? p.ref.textContent?.trim() ?? ""
        })), l = a.find((p) => p.ref === o), c = a.map((p) => p.textValue), u = Xh(c, e.value, l?.textValue), d = a.find((p) => p.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Gh(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
function Xh(t, e, n) {
  const r = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = Gh(t, Math.max(s, 0));
  r.length === 1 && (o = o.filter((c) => c !== n));
  const l = o.find((c) => c.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function Yh(t, e) {
  const n = /* @__PURE__ */ z({}), i = /* @__PURE__ */ z("none"), r = /* @__PURE__ */ z(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? qr, { state: l, dispatch: c } = Kh(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), u = (y) => {
    if (rn) {
      const C = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(C);
    }
  };
  ye(t, async (y, C) => {
    const _ = C !== y;
    if (await Me(), _) {
      const b = i.value, g = Vi(e.value);
      y ? (c("MOUNT"), u("enter"), g === "none" && u("after-enter")) : g === "none" || g === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : C && b !== g ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const C = Vi(e.value), _ = C.includes(CSS.escape(y.animationName)), b = l.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && _ && (u(`after-${b}`), c("ANIMATION_END"), !r.value)) {
      const g = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = g);
      });
    }
    y.target === e.value && C === "none" && c("ANIMATION_END");
  }, p = (y) => {
    y.target === e.value && (i.value = Vi(e.value));
  }, f = ye(e, (y, C) => {
    y ? (n.value = getComputedStyle(y), y.addEventListener("animationstart", p), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), C?.removeEventListener("animationstart", p), C?.removeEventListener("animationcancel", d), C?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = ye(l, () => {
    const y = Vi(e.value);
    i.value = l.value === "mounted" ? y : "none";
  });
  return vn(() => {
    f(), h();
  }), { isPresent: R(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Vi(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var Vr = /* @__PURE__ */ X({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: !0
    },
    forceMount: { type: Boolean }
  },
  slots: {},
  setup(t, { slots: e, expose: n }) {
    const { present: i, forceMount: r } = /* @__PURE__ */ Yn(t), s = /* @__PURE__ */ z(), { isPresent: o } = Yh(i, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = lo(a || []);
    const l = lt();
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
    return () => r.value || i.value || o.value ? Rt(e.default({ present: o.value })[0], { ref: (c) => {
      const u = Bt(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const Bs = /* @__PURE__ */ X({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = lo(n.default()), r = i.findIndex((l) => l.type !== ze);
      if (r === -1) return i;
      const s = i[r];
      delete s.props?.ref;
      const o = s.props ? xe(e, s.props) : e, a = Qt({
        ...s,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[r] = a, i);
    };
  }
}), Jh = [
  "area",
  "img",
  "input"
], Ae = /* @__PURE__ */ X({
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
  setup(t, { attrs: e, slots: n }) {
    const i = t.asChild ? "template" : t.as;
    return typeof i == "string" && Jh.includes(i) ? () => Rt(i, e) : i !== "template" ? () => Rt(t.as, e, { default: n.default }) : () => Rt(Bs, e, { default: n.default });
  }
});
function hr() {
  const t = /* @__PURE__ */ z(), e = R(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : Bt(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [mn, Zh] = ct("DialogRoot");
var Qh = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, r = /* @__PURE__ */ ki(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), s = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(), { modal: a } = /* @__PURE__ */ Yn(n);
    return Zh({
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
      triggerElement: s,
      contentElement: o
    }), (l, c) => te(l.$slots, "default", {
      open: v(r),
      close: () => r.value = !1
    });
  }
}), Nc = Qh, ev = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t;
    Re();
    const n = mn();
    return (i, r) => (O(), U(v(Ae), xe(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => v(n).onOpenChange(!1))
    }), {
      default: q(() => [te(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), tv = ev;
const nv = "dismissableLayer.pointerDownOutside", iv = "dismissableLayer.focusOutside";
function qc(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), r = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || r.indexOf(i) < r.indexOf(n)));
}
function rv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(() => {
  });
  return pt((o) => {
    if (!rn || !Je(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (qc(e.value, u)) {
          r.value = !1;
          return;
        }
        if (c.target && !r.value) {
          let p = function() {
            zr(nv, t, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (i.removeEventListener("click", s.value), s.value = p, i.addEventListener("click", s.value, { once: !0 })) : p();
        } else i.removeEventListener("click", s.value);
        r.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    Je(n) && (r.value = !0);
  } };
}
function sv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ z(!1);
  return pt((s) => {
    if (!rn || !Je(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Me(), await Me();
      const l = a.target;
      !e.value || !l || qc(e.value, l) || a.target && !r.value && zr(iv, t, { originalEvent: a });
    };
    i.addEventListener("focusin", o), s(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Je(n) && (r.value = !0);
    },
    onBlurCapture: () => {
      Je(n) && (r.value = !1);
    }
  };
}
const dt = /* @__PURE__ */ Oi({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ov = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { forwardRef: r, currentElement: s } = Re(), o = R(() => s.value?.ownerDocument ?? globalThis.document), a = R(() => dt.layersRoot), l = R(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = R(() => dt.layersWithOutsidePointerEventsDisabled.size > 0), u = R(() => {
      const f = Array.from(a.value), [h] = [...dt.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(h);
      return l.value >= m;
    }), d = rv(async (f) => {
      const h = [...dt.branches].some((m) => m?.contains(f.target));
      !u.value || h || (i("pointerDownOutside", f), i("interactOutside", f), await Me(), f.defaultPrevented || i("dismiss"));
    }, s), p = sv((f) => {
      [...dt.branches].some((m) => m?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, s);
    return Mh("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), pt((f) => {
      s.value && (n.disableOutsidePointerEvents && (dt.layersWithOutsidePointerEventsDisabled.size === 0 && (dt.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), dt.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), f(() => {
        n.disableOutsidePointerEvents && dt.layersWithOutsidePointerEventsDisabled.size === 1 && !Kn(dt.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = dt.originalBodyPointerEvents);
      }));
    }), pt((f) => {
      f(() => {
        s.value && (a.value.delete(s.value), dt.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (f, h) => (O(), U(v(Ae), {
      ref: v(r),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: St({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(p).onFocusCapture,
      onBlurCapture: v(p).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: q(() => [te(f.$slots, "default")]),
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
}), Hc = ov;
const av = /* @__PURE__ */ _h(() => /* @__PURE__ */ z([]));
function lv() {
  const t = av();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = Ca(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = Ca(t.value, e), t.value[0]?.resume();
    }
  };
}
function Ca(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const hs = "focusScope.autoFocusOnMount", vs = "focusScope.autoFocusOnUnmount", Ea = {
  bubbles: !1,
  cancelable: !0
};
function cv(t, { select: e = !1 } = {}) {
  const n = it();
  for (const i of t)
    if (an(i, { select: e }), it() !== n) return !0;
}
function uv(t) {
  const e = Vc(t), n = ka(e, t), i = ka(e.reverse(), t);
  return [n, i];
}
function Vc(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function ka(t, e) {
  for (const n of t) if (!dv(n, { upTo: e })) return n;
}
function dv(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function fv(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function an(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = it();
    t.focus({ preventScroll: !0 }), t !== n && fv(t) && e && t.select();
  }
}
var pv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { currentRef: r, currentElement: s } = Re(), o = /* @__PURE__ */ z(null), a = lv(), l = /* @__PURE__ */ Oi({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    pt((u) => {
      if (!rn) return;
      const d = s.value;
      if (!n.trapped) return;
      function p(y) {
        if (l.paused || !d) return;
        const C = y.target;
        d.contains(C) ? o.value = C : an(o.value, { select: !0 });
      }
      function f(y) {
        if (l.paused || !d) return;
        const C = y.relatedTarget;
        C !== null && (d.contains(C) || an(o.value, { select: !0 }));
      }
      function h(y) {
        d.contains(o.value) || an(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", f);
      const m = new MutationObserver(h);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", f), m.disconnect();
      });
    }), pt(async (u) => {
      const d = s.value;
      if (await Me(), !d) return;
      a.add(l);
      const p = it();
      if (!d.contains(p)) {
        const h = new CustomEvent(hs, Ea);
        d.addEventListener(hs, (m) => i("mountAutoFocus", m)), d.dispatchEvent(h), h.defaultPrevented || (cv(Vc(d), { select: !0 }), it() === p && an(d));
      }
      u(() => {
        d.removeEventListener(hs, (y) => i("mountAutoFocus", y));
        const h = new CustomEvent(vs, Ea), m = (y) => {
          i("unmountAutoFocus", y);
        };
        d.addEventListener(vs, m), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || an(p ?? document.body, { select: !0 }), d.removeEventListener(vs, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, p = it();
      if (d && p) {
        const f = u.currentTarget, [h, m] = uv(f);
        h && m ? !u.shiftKey && p === m ? (u.preventDefault(), n.loop && an(h, { select: !0 })) : u.shiftKey && p === h && (u.preventDefault(), n.loop && an(m, { select: !0 })) : p === f && u.preventDefault();
      }
    }
    return (u, d) => (O(), U(v(Ae), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: q(() => [te(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), jc = pv;
function hv(t) {
  return t ? "open" : "closed";
}
function Ta(t) {
  const e = it();
  for (const n of t)
    if (n === e || (n.focus(), it() !== e)) return;
}
var vv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, r = mn(), { forwardRef: s, currentElement: o } = Re();
    return r.titleId ||= Gn(void 0, "reka-dialog-title"), r.descriptionId ||= Gn(void 0, "reka-dialog-description"), De(() => {
      r.contentElement = o, it() !== document.body && (r.triggerElement.value = it());
    }), (a, l) => (O(), U(v(jc), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => i("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => i("closeAutoFocus", c))
    }, {
      default: q(() => [H(v(Hc), xe({
        id: v(r).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(r).descriptionId,
        "aria-labelledby": v(r).titleId,
        "data-state": v(hv)(v(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => v(r).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => i("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => i("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => i("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => i("pointerDownOutside", c))
      }), {
        default: q(() => [te(a.$slots, "default")]),
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
}), Wc = vv, mv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, r = mn(), s = Hr(i), { forwardRef: o, currentElement: a } = Re();
    return zc(a), (l, c) => (O(), U(Wc, xe({
      ...n,
      ...v(s)
    }, {
      ref: v(o),
      "trap-focus": v(r).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (u.preventDefault(), v(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, p = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || p) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: q(() => [te(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), gv = mv, yv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, r = Hr(e);
    Re();
    const s = mn(), o = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z(!1);
    return (l, c) => (O(), U(Wc, xe({
      ...n,
      ...v(r)
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
      default: q(() => [te(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), bv = yv, wv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, r = mn(), s = Hr(i), { forwardRef: o } = Re();
    return (a, l) => (O(), U(v(Vr), { present: a.forceMount || v(r).open.value }, {
      default: q(() => [v(r).modal.value ? (O(), U(gv, xe({
        key: 0,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: q(() => [te(a.$slots, "default")]),
        _: 3
      }, 16)) : (O(), U(bv, xe({
        key: 1,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: q(() => [te(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Uc = wv, _v = /* @__PURE__ */ X({
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
  setup(t) {
    const e = mn();
    return Dc(!0), Re(), (n, i) => (O(), U(v(Ae), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: q(() => [te(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), xv = _v, Sv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = mn(), { forwardRef: n } = Re();
    return (i, r) => v(e)?.modal.value ? (O(), U(v(Vr), {
      key: 0,
      present: i.forceMount || v(e).open.value
    }, {
      default: q(() => [H(xv, xe(i.$attrs, {
        ref: v(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: q(() => [te(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : de("v-if", !0);
  }
}), Kc = Sv, Cv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = /* @__PURE__ */ Lc();
    return (n, i) => v(e) || n.forceMount ? (O(), U(ql, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [te(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : de("v-if", !0);
  }
}), Gc = Cv, Ev = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t;
    return (n, i) => (O(), U(v(Gc), Gs($r(e)), {
      default: q(() => [te(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Xc = Ev, kv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = mn();
    return Re(), (i, r) => (O(), U(v(Ae), xe(e, { id: v(n).titleId }), {
      default: q(() => [te(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Yc = kv;
const Aa = "data-reka-collection-item";
function sn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let r;
  n ? (r = {
    collectionRef: /* @__PURE__ */ z(),
    itemMap: /* @__PURE__ */ z(/* @__PURE__ */ new Map())
  }, Jn(i, r)) : r = Xt(i);
  const s = (u = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const p = Array.from(d.querySelectorAll(`[${Aa}]`)), h = Array.from(r.itemMap.value.values()).sort((m, y) => p.indexOf(m.ref) - p.indexOf(y.ref));
    return u ? h : h.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ X({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = hr();
      return ye(h, () => {
        r.collectionRef.value = h.value;
      }), () => Rt(Bs, {
        ref: f,
        ...p
      }, d);
    }
  }), a = /* @__PURE__ */ X({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = hr();
      return pt((m) => {
        if (h.value) {
          const y = kl(h.value);
          r.itemMap.value.set(y, {
            ref: h.value,
            value: u.value
          }), m(() => r.itemMap.value.delete(y));
        }
      }), () => Rt(Bs, {
        ...p,
        [Aa]: "",
        ref: f
      }, d);
    }
  }), l = R(() => Array.from(r.itemMap.value.values())), c = R(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const Tv = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Av(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Jc(t, e, n) {
  const i = Av(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Tv[i];
}
function Pv(t, e = !1) {
  const n = it();
  for (const i of t)
    if (i === n || (i.focus({ preventScroll: e }), it() !== n)) return;
}
function Ov(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
const [Iv] = ct("RovingFocusGroup");
var Mv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = Iv(), i = Gn(), r = R(() => e.tabStopId || i), s = R(() => n.currentTabStopId.value === r.value), { getItems: o, CollectionItem: a } = sn();
    De(() => {
      e.focusable && n.onFocusableItemAdd();
    }), vn(() => {
      e.focusable && n.onFocusableItemRemove();
    });
    function l(c) {
      if (c.key === "Tab" && c.shiftKey) {
        n.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const u = Jc(c, n.orientation.value, n.dir.value);
      if (u !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !e.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let d = [...o().map((p) => p.ref).filter((p) => p.dataset.disabled !== "")];
        if (u === "last") d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const p = d.indexOf(c.currentTarget);
          d = n.loop.value ? Ov(d, p + 1) : d.slice(p + 1);
        }
        Me(() => Pv(d));
      }
    }
    return (c, u) => (O(), U(v(a), null, {
      default: q(() => [H(v(Ae), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": v(n).orientation.value,
        "data-active": c.active ? "" : void 0,
        "data-disabled": c.focusable ? void 0 : "",
        as: c.as,
        "as-child": c.asChild,
        onMousedown: u[0] || (u[0] = (d) => {
          c.focusable ? v(n).onItemFocus(r.value) : d.preventDefault();
        }),
        onFocus: u[1] || (u[1] = (d) => v(n).onItemFocus(r.value)),
        onKeydown: l
      }, {
        default: q(() => [te(c.$slots, "default")]),
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
}), Rv = Mv, Lv = /* @__PURE__ */ X({
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
  setup(t) {
    return (e, n) => (O(), U(v(Ae), {
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
      default: q(() => [te(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Zc = Lv, Dv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, { primitiveElement: n, currentElement: i } = hr(), r = R(() => e.checked ?? e.value);
    return ye(r, (s, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), p = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(p);
      }
    }), (s, o) => (O(), U(Zc, xe({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Pa = Dv, $v = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = R(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = R(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((r, s) => typeof r == "object" ? Object.entries(r).map(([o, a]) => ({
      name: `${e.name}[${s}][${o}]`,
      value: a
    })) : {
      name: `${e.name}[${s}]`,
      value: r
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([r, s]) => ({
      name: `${e.name}[${r}]`,
      value: s
    })) : []);
    return (r, s) => (O(), oe(Ee, null, [de(" We render single input if it's required "), n.value ? (O(), U(Pa, xe({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (O(!0), oe(Ee, { key: 1 }, Pn(i.value, (o) => (O(), U(Pa, xe({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Qc = $v;
const [Bv] = ct("CheckboxGroupRoot");
function vr(t) {
  return t === "indeterminate";
}
function eu(t) {
  return vr(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
const [Fv, zv] = ct("CheckboxRoot");
var Nv = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { forwardRef: r, currentElement: s } = Re(), o = Bv(null), a = /* @__PURE__ */ ki(n, "modelValue", i, {
      defaultValue: n.defaultValue,
      passive: n.modelValue === void 0
    }), l = R(() => o?.disabled.value || n.disabled), c = R(() => Kn(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : _a(o.modelValue.value, n.value));
    function u() {
      if (Kn(o?.modelValue.value))
        a.value = vr(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (_a(f, n.value)) {
          const h = f.findIndex((m) => Tn(m, n.value));
          f.splice(h, 1);
        } else f.push(n.value);
        o.modelValue.value = f;
      }
    }
    const d = uo(s), p = R(() => n.id && s.value ? document.querySelector(`[for="${n.id}"]`)?.innerText : void 0);
    return zv({
      disabled: l,
      state: c
    }), (f, h) => (O(), U(to(v(o)?.rovingFocus.value ? v(Rv) : v(Ae)), xe(f.$attrs, {
      id: f.id,
      ref: v(r),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": v(vr)(c.value) ? "mixed" : c.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || p.value,
      "data-state": v(eu)(c.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: v(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: pr(Lt(() => {
      }, ["prevent"]), ["enter"]),
      onClick: u
    }), {
      default: q(() => [te(f.$slots, "default", {
        modelValue: v(a),
        state: c.value
      }), v(d) && f.name && !v(o) ? (O(), U(v(Qc), {
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
      ])) : de("v-if", !0)]),
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
}), qv = Nv, Hv = /* @__PURE__ */ X({
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
  setup(t) {
    const { forwardRef: e } = Re(), n = Fv();
    return (i, r) => (O(), U(v(Vr), { present: i.forceMount || v(vr)(v(n).state.value) || v(n).state.value === !0 }, {
      default: q(() => [H(v(Ae), xe({
        ref: v(e),
        "data-state": v(eu)(v(n).state.value),
        "data-disabled": v(n).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": i.asChild,
        as: i.as
      }, i.$attrs), {
        default: q(() => [te(i.$slots, "default")]),
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
}), Vv = Hv;
const [tu, jv] = ct("PopperRoot");
var Wv = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ z();
    return jv({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, i) => te(n.$slots, "default");
  }
}), Uv = Wv, Kv = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, { forwardRef: n, currentElement: i } = Re(), r = tu();
    return $l(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (s, o) => (O(), U(v(Ae), {
      ref: v(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: q(() => [te(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Gv = Kv;
function Xv(t) {
  return t !== null;
}
function Yv(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: i, middlewareData: r } = e, o = r.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [c, u] = Fs(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], p = (r.arrow?.x ?? 0) + a / 2, f = (r.arrow?.y ?? 0) + l / 2;
      let h = "", m = "";
      return c === "bottom" ? (h = o ? d : `${p}px`, m = `${-l}px`) : c === "top" ? (h = o ? d : `${p}px`, m = `${i.floating.height + l}px`) : c === "right" ? (h = `${-l}px`, m = o ? d : `${f}px`) : c === "left" && (h = `${i.floating.width + l}px`, m = o ? d : `${f}px`), { data: {
        x: h,
        y: m
      } };
    }
  };
}
function Fs(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const Jv = ["top", "right", "bottom", "left"], fn = Math.min, st = Math.max, mr = Math.round, ji = Math.floor, Dt = (t) => ({
  x: t,
  y: t
}), Zv = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Qv = {
  start: "end",
  end: "start"
};
function zs(t, e, n) {
  return st(t, fn(e, n));
}
function en(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function tn(t) {
  return t.split("-")[0];
}
function Zn(t) {
  return t.split("-")[1];
}
function ho(t) {
  return t === "x" ? "y" : "x";
}
function vo(t) {
  return t === "y" ? "height" : "width";
}
const em = /* @__PURE__ */ new Set(["top", "bottom"]);
function It(t) {
  return em.has(tn(t)) ? "y" : "x";
}
function mo(t) {
  return ho(It(t));
}
function tm(t, e, n) {
  n === void 0 && (n = !1);
  const i = Zn(t), r = mo(t), s = vo(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = gr(o)), [o, gr(o)];
}
function nm(t) {
  const e = gr(t);
  return [Ns(t), e, Ns(e)];
}
function Ns(t) {
  return t.replace(/start|end/g, (e) => Qv[e]);
}
const Oa = ["left", "right"], Ia = ["right", "left"], im = ["top", "bottom"], rm = ["bottom", "top"];
function sm(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Ia : Oa : e ? Oa : Ia;
    case "left":
    case "right":
      return e ? im : rm;
    default:
      return [];
  }
}
function om(t, e, n, i) {
  const r = Zn(t);
  let s = sm(tn(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(Ns)))), s;
}
function gr(t) {
  return t.replace(/left|right|bottom|top/g, (e) => Zv[e]);
}
function am(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function nu(t) {
  return typeof t != "number" ? am(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function yr(t) {
  const {
    x: e,
    y: n,
    width: i,
    height: r
  } = t;
  return {
    width: i,
    height: r,
    top: n,
    left: e,
    right: e + i,
    bottom: n + r,
    x: e,
    y: n
  };
}
function Ma(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = It(e), o = mo(e), a = vo(o), l = tn(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      f = {
        x: u,
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
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      f = {
        x: i.x,
        y: i.y
      };
  }
  switch (Zn(e)) {
    case "start":
      f[o] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      f[o] += p * (n && c ? -1 : 1);
      break;
  }
  return f;
}
async function lm(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: i,
    y: r,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = t, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: p = !1,
    padding: f = 0
  } = en(e, t), h = nu(f), y = a[p ? d === "floating" ? "reference" : "floating" : d], C = yr(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(y))) == null || n ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), _ = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, b = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), g = await (s.isElement == null ? void 0 : s.isElement(b)) ? await (s.getScale == null ? void 0 : s.getScale(b)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, E = yr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: _,
    offsetParent: b,
    strategy: l
  }) : _);
  return {
    top: (C.top - E.top + h.top) / g.y,
    bottom: (E.bottom - C.bottom + h.bottom) / g.y,
    left: (C.left - E.left + h.left) / g.x,
    right: (E.right - C.right + h.right) / g.x
  };
}
const cm = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: r
  }), {
    x: u,
    y: d
  } = Ma(c, i, l), p = i, f = {}, h = 0;
  for (let y = 0; y < a.length; y++) {
    var m;
    const {
      name: C,
      fn: _
    } = a[y], {
      x: b,
      y: g,
      data: E,
      reset: k
    } = await _({
      x: u,
      y: d,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: f,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : lm
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = b ?? u, d = g ?? d, f = {
      ...f,
      [C]: {
        ...f[C],
        ...E
      }
    }, k && h <= 50 && (h++, typeof k == "object" && (k.placement && (p = k.placement), k.rects && (c = k.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : k.rects), {
      x: u,
      y: d
    } = Ma(c, p, l)), y = -1);
  }
  return {
    x: u,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: f
  };
}, um = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: i,
      placement: r,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = en(t, e) || {};
    if (c == null)
      return {};
    const d = nu(u), p = {
      x: n,
      y: i
    }, f = mo(r), h = vo(f), m = await o.getDimensions(c), y = f === "y", C = y ? "top" : "left", _ = y ? "bottom" : "right", b = y ? "clientHeight" : "clientWidth", g = s.reference[h] + s.reference[f] - p[f] - s.floating[h], E = p[f] - s.reference[f], k = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let x = k ? k[b] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(k))) && (x = a.floating[b] || s.floating[h]);
    const M = g / 2 - E / 2, T = x / 2 - m[h] / 2 - 1, A = fn(d[C], T), L = fn(d[_], T), P = A, V = x - m[h] - L, D = x / 2 - m[h] / 2 + M, K = zs(P, D, V), re = !l.arrow && Zn(r) != null && D !== K && s.reference[h] / 2 - (D < P ? A : L) - m[h] / 2 < 0, Z = re ? D < P ? D - P : D - V : 0;
    return {
      [f]: p[f] + Z,
      data: {
        [f]: K,
        centerOffset: D - K - Z,
        ...re && {
          alignmentOffset: Z
        }
      },
      reset: re
    };
  }
}), dm = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: r,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: p,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: m = !0,
        ...y
      } = en(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const C = tn(r), _ = It(a), b = tn(a) === a, g = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), E = p || (b || !m ? [gr(a)] : nm(a)), k = h !== "none";
      !p && k && E.push(...om(a, m, h, g));
      const x = [a, ...E], M = await l.detectOverflow(e, y), T = [];
      let A = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && T.push(M[C]), d) {
        const D = tm(r, o, g);
        T.push(M[D[0]], M[D[1]]);
      }
      if (A = [...A, {
        placement: r,
        overflows: T
      }], !T.every((D) => D <= 0)) {
        var L, P;
        const D = (((L = s.flip) == null ? void 0 : L.index) || 0) + 1, K = x[D];
        if (K && (!(d === "alignment" ? _ !== It(K) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((Q) => It(Q.placement) === _ ? Q.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: A
            },
            reset: {
              placement: K
            }
          };
        let re = (P = A.filter((Z) => Z.overflows[0] <= 0).sort((Z, Q) => Z.overflows[1] - Q.overflows[1])[0]) == null ? void 0 : P.placement;
        if (!re)
          switch (f) {
            case "bestFit": {
              var V;
              const Z = (V = A.filter((Q) => {
                if (k) {
                  const we = It(Q.placement);
                  return we === _ || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  we === "y";
                }
                return !0;
              }).map((Q) => [Q.placement, Q.overflows.filter((we) => we > 0).reduce((we, $e) => we + $e, 0)]).sort((Q, we) => Q[1] - we[1])[0]) == null ? void 0 : V[0];
              Z && (re = Z);
              break;
            }
            case "initialPlacement":
              re = a;
              break;
          }
        if (r !== re)
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
function Ra(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function La(t) {
  return Jv.some((e) => t[e] >= 0);
}
const fm = function(t) {
  return t === void 0 && (t = {}), {
    name: "hide",
    options: t,
    async fn(e) {
      const {
        rects: n,
        platform: i
      } = e, {
        strategy: r = "referenceHidden",
        ...s
      } = en(t, e);
      switch (r) {
        case "referenceHidden": {
          const o = await i.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Ra(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: La(a)
            }
          };
        }
        case "escaped": {
          const o = await i.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Ra(o, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: La(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, iu = /* @__PURE__ */ new Set(["left", "top"]);
async function pm(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = tn(n), a = Zn(n), l = It(n) === "y", c = iu.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = en(e, t);
  let {
    mainAxis: p,
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
    x: f * u,
    y: p * c
  } : {
    x: p * c,
    y: f * u
  };
}
const hm = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, i;
      const {
        x: r,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await pm(e, t);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: r + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, vm = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i,
        placement: r,
        platform: s
      } = e, {
        mainAxis: o = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (C) => {
            let {
              x: _,
              y: b
            } = C;
            return {
              x: _,
              y: b
            };
          }
        },
        ...c
      } = en(t, e), u = {
        x: n,
        y: i
      }, d = await s.detectOverflow(e, c), p = It(tn(r)), f = ho(p);
      let h = u[f], m = u[p];
      if (o) {
        const C = f === "y" ? "top" : "left", _ = f === "y" ? "bottom" : "right", b = h + d[C], g = h - d[_];
        h = zs(b, h, g);
      }
      if (a) {
        const C = p === "y" ? "top" : "left", _ = p === "y" ? "bottom" : "right", b = m + d[C], g = m - d[_];
        m = zs(b, m, g);
      }
      const y = l.fn({
        ...e,
        [f]: h,
        [p]: m
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - i,
          enabled: {
            [f]: o,
            [p]: a
          }
        }
      };
    }
  };
}, mm = function(t) {
  return t === void 0 && (t = {}), {
    options: t,
    fn(e) {
      const {
        x: n,
        y: i,
        placement: r,
        rects: s,
        middlewareData: o
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = en(t, e), u = {
        x: n,
        y: i
      }, d = It(r), p = ho(d);
      let f = u[p], h = u[d];
      const m = en(a, e), y = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const b = p === "y" ? "height" : "width", g = s.reference[p] - s.floating[b] + y.mainAxis, E = s.reference[p] + s.reference[b] - y.mainAxis;
        f < g ? f = g : f > E && (f = E);
      }
      if (c) {
        var C, _;
        const b = p === "y" ? "width" : "height", g = iu.has(tn(r)), E = s.reference[d] - s.floating[b] + (g && ((C = o.offset) == null ? void 0 : C[d]) || 0) + (g ? 0 : y.crossAxis), k = s.reference[d] + s.reference[b] + (g ? 0 : ((_ = o.offset) == null ? void 0 : _[d]) || 0) - (g ? y.crossAxis : 0);
        h < E ? h = E : h > k && (h = k);
      }
      return {
        [p]: f,
        [d]: h
      };
    }
  };
}, gm = function(t) {
  return t === void 0 && (t = {}), {
    name: "size",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: r,
        rects: s,
        platform: o,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...c
      } = en(t, e), u = await o.detectOverflow(e, c), d = tn(r), p = Zn(r), f = It(r) === "y", {
        width: h,
        height: m
      } = s.floating;
      let y, C;
      d === "top" || d === "bottom" ? (y = d, C = p === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (C = d, y = p === "end" ? "top" : "bottom");
      const _ = m - u.top - u.bottom, b = h - u.left - u.right, g = fn(m - u[y], _), E = fn(h - u[C], b), k = !e.middlewareData.shift;
      let x = g, M = E;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (M = b), (i = e.middlewareData.shift) != null && i.enabled.y && (x = _), k && !p) {
        const A = st(u.left, 0), L = st(u.right, 0), P = st(u.top, 0), V = st(u.bottom, 0);
        f ? M = h - 2 * (A !== 0 || L !== 0 ? A + L : st(u.left, u.right)) : x = m - 2 * (P !== 0 || V !== 0 ? P + V : st(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: M,
        availableHeight: x
      });
      const T = await o.getDimensions(a.floating);
      return h !== T.width || m !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function jr() {
  return typeof window < "u";
}
function On(t) {
  return go(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function at(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function zt(t) {
  var e;
  return (e = (go(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function go(t) {
  return jr() ? t instanceof Node || t instanceof at(t).Node : !1;
}
function _t(t) {
  return jr() ? t instanceof Element || t instanceof at(t).Element : !1;
}
function Ft(t) {
  return jr() ? t instanceof HTMLElement || t instanceof at(t).HTMLElement : !1;
}
function Da(t) {
  return !jr() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof at(t).ShadowRoot;
}
const ym = /* @__PURE__ */ new Set(["inline", "contents"]);
function Di(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = xt(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !ym.has(r);
}
const bm = /* @__PURE__ */ new Set(["table", "td", "th"]);
function wm(t) {
  return bm.has(On(t));
}
const _m = [":popover-open", ":modal"];
function Wr(t) {
  return _m.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const xm = ["transform", "translate", "scale", "rotate", "perspective"], Sm = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Cm = ["paint", "layout", "strict", "content"];
function yo(t) {
  const e = bo(), n = _t(t) ? xt(t) : t;
  return xm.some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Sm.some((i) => (n.willChange || "").includes(i)) || Cm.some((i) => (n.contain || "").includes(i));
}
function Em(t) {
  let e = pn(t);
  for (; Ft(e) && !Xn(e); ) {
    if (yo(e))
      return e;
    if (Wr(e))
      return null;
    e = pn(e);
  }
  return null;
}
function bo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const km = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Xn(t) {
  return km.has(On(t));
}
function xt(t) {
  return at(t).getComputedStyle(t);
}
function Ur(t) {
  return _t(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function pn(t) {
  if (On(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Da(t) && t.host || // Fallback.
    zt(t)
  );
  return Da(e) ? e.host : e;
}
function ru(t) {
  const e = pn(t);
  return Xn(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Ft(e) && Di(e) ? e : ru(e);
}
function Ti(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = ru(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = at(r);
  if (s) {
    const a = qs(o);
    return e.concat(o, o.visualViewport || [], Di(r) ? r : [], a && n ? Ti(a) : []);
  }
  return e.concat(r, Ti(r, [], n));
}
function qs(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function su(t) {
  const e = xt(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Ft(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = mr(n) !== s || mr(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function wo(t) {
  return _t(t) ? t : t.contextElement;
}
function jn(t) {
  const e = wo(t);
  if (!Ft(e))
    return Dt(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = su(e);
  let o = (s ? mr(n.width) : n.width) / i, a = (s ? mr(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Tm = /* @__PURE__ */ Dt(0);
function ou(t) {
  const e = at(t);
  return !bo() || !e.visualViewport ? Tm : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Am(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== at(t) ? !1 : e;
}
function An(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = wo(t);
  let o = Dt(1);
  e && (i ? _t(i) && (o = jn(i)) : o = jn(t));
  const a = Am(s, n, i) ? ou(s) : Dt(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const p = at(s), f = i && _t(i) ? at(i) : i;
    let h = p, m = qs(h);
    for (; m && i && f !== h; ) {
      const y = jn(m), C = m.getBoundingClientRect(), _ = xt(m), b = C.left + (m.clientLeft + parseFloat(_.paddingLeft)) * y.x, g = C.top + (m.clientTop + parseFloat(_.paddingTop)) * y.y;
      l *= y.x, c *= y.y, u *= y.x, d *= y.y, l += b, c += g, h = at(m), m = qs(h);
    }
  }
  return yr({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Kr(t, e) {
  const n = Ur(t).scrollLeft;
  return e ? e.left + n : An(zt(t)).left + n;
}
function au(t, e) {
  const n = t.getBoundingClientRect(), i = n.left + e.scrollLeft - Kr(t, n), r = n.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function Pm(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = zt(i), a = e ? Wr(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Dt(1);
  const u = Dt(0), d = Ft(i);
  if ((d || !d && !s) && ((On(i) !== "body" || Di(o)) && (l = Ur(i)), Ft(i))) {
    const f = An(i);
    c = jn(i), u.x = f.x + i.clientLeft, u.y = f.y + i.clientTop;
  }
  const p = o && !d && !s ? au(o, l) : Dt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + p.y
  };
}
function Om(t) {
  return Array.from(t.getClientRects());
}
function Im(t) {
  const e = zt(t), n = Ur(t), i = t.ownerDocument.body, r = st(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = st(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Kr(t);
  const a = -n.scrollTop;
  return xt(i).direction === "rtl" && (o += st(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const $a = 25;
function Mm(t, e) {
  const n = at(t), i = zt(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const u = bo();
    (!u || u && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const c = Kr(i);
  if (c <= 0) {
    const u = i.ownerDocument, d = u.body, p = getComputedStyle(d), f = u.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, h = Math.abs(i.clientWidth - d.clientWidth - f);
    h <= $a && (s -= h);
  } else c <= $a && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Rm = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Lm(t, e) {
  const n = An(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = Ft(t) ? jn(t) : Dt(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Ba(t, e, n) {
  let i;
  if (e === "viewport")
    i = Mm(t, n);
  else if (e === "document")
    i = Im(zt(t));
  else if (_t(e))
    i = Lm(e, n);
  else {
    const r = ou(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return yr(i);
}
function lu(t, e) {
  const n = pn(t);
  return n === e || !_t(n) || Xn(n) ? !1 : xt(n).position === "fixed" || lu(n, e);
}
function Dm(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Ti(t, [], !1).filter((a) => _t(a) && On(a) !== "body"), r = null;
  const s = xt(t).position === "fixed";
  let o = s ? pn(t) : t;
  for (; _t(o) && !Xn(o); ) {
    const a = xt(o), l = yo(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && Rm.has(r.position) || Di(o) && !l && lu(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = pn(o);
  }
  return e.set(t, i), i;
}
function $m(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Wr(e) ? [] : Dm(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = Ba(e, u, r);
    return c.top = st(d.top, c.top), c.right = fn(d.right, c.right), c.bottom = fn(d.bottom, c.bottom), c.left = st(d.left, c.left), c;
  }, Ba(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Bm(t) {
  const {
    width: e,
    height: n
  } = su(t);
  return {
    width: e,
    height: n
  };
}
function Fm(t, e, n) {
  const i = Ft(e), r = zt(e), s = n === "fixed", o = An(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Dt(0);
  function c() {
    l.x = Kr(r);
  }
  if (i || !i && !s)
    if ((On(e) !== "body" || Di(r)) && (a = Ur(e)), i) {
      const f = An(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? au(r, a) : Dt(0), d = o.left + a.scrollLeft - l.x - u.x, p = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: p,
    width: o.width,
    height: o.height
  };
}
function ms(t) {
  return xt(t).position === "static";
}
function Fa(t, e) {
  if (!Ft(t) || xt(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return zt(t) === n && (n = n.ownerDocument.body), n;
}
function cu(t, e) {
  const n = at(t);
  if (Wr(t))
    return n;
  if (!Ft(t)) {
    let r = pn(t);
    for (; r && !Xn(r); ) {
      if (_t(r) && !ms(r))
        return r;
      r = pn(r);
    }
    return n;
  }
  let i = Fa(t, e);
  for (; i && wm(i) && ms(i); )
    i = Fa(i, e);
  return i && Xn(i) && ms(i) && !yo(i) ? n : i || Em(t) || n;
}
const zm = async function(t) {
  const e = this.getOffsetParent || cu, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Fm(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Nm(t) {
  return xt(t).direction === "rtl";
}
const qm = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Pm,
  getDocumentElement: zt,
  getClippingRect: $m,
  getOffsetParent: cu,
  getElementRects: zm,
  getClientRects: Om,
  getDimensions: Bm,
  getScale: jn,
  isElement: _t,
  isRTL: Nm
};
function uu(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Hm(t, e) {
  let n = null, i;
  const r = zt(t);
  function s() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = t.getBoundingClientRect(), {
      left: u,
      top: d,
      width: p,
      height: f
    } = c;
    if (a || e(), !p || !f)
      return;
    const h = ji(d), m = ji(r.clientWidth - (u + p)), y = ji(r.clientHeight - (d + f)), C = ji(u), b = {
      rootMargin: -h + "px " + -m + "px " + -y + "px " + -C + "px",
      threshold: st(0, fn(1, l)) || 1
    };
    let g = !0;
    function E(k) {
      const x = k[0].intersectionRatio;
      if (x !== l) {
        if (!g)
          return o();
        x ? o(!1, x) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !uu(c, t.getBoundingClientRect()) && o(), g = !1;
    }
    try {
      n = new IntersectionObserver(E, {
        ...b,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(E, b);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function Vm(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = wo(t), u = r || s ? [...c ? Ti(c) : [], ...Ti(e)] : [];
  u.forEach((C) => {
    r && C.addEventListener("scroll", n, {
      passive: !0
    }), s && C.addEventListener("resize", n);
  });
  const d = c && a ? Hm(c, n) : null;
  let p = -1, f = null;
  o && (f = new ResizeObserver((C) => {
    let [_] = C;
    _ && _.target === c && f && (f.unobserve(e), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var b;
      (b = f) == null || b.observe(e);
    })), n();
  }), c && !l && f.observe(c), f.observe(e));
  let h, m = l ? An(t) : null;
  l && y();
  function y() {
    const C = An(t);
    m && !uu(m, C) && n(), m = C, h = requestAnimationFrame(y);
  }
  return n(), () => {
    var C;
    u.forEach((_) => {
      r && _.removeEventListener("scroll", n), s && _.removeEventListener("resize", n);
    }), d?.(), (C = f) == null || C.disconnect(), f = null, l && cancelAnimationFrame(h);
  };
}
const jm = hm, Wm = vm, za = dm, Um = gm, Km = fm, Gm = um, Xm = mm, Ym = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: qm,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return cm(t, e, {
    ...r,
    platform: s
  });
};
function Jm(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function Hs(t) {
  if (Jm(t)) {
    const e = t.$el;
    return go(e) && On(e) === "#comment" ? null : e;
  }
  return t;
}
function Fn(t) {
  return typeof t == "function" ? t() : v(t);
}
function Zm(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = Hs(Fn(t.element));
      return n == null ? {} : Gm({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function du(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Na(t, e) {
  const n = du(t);
  return Math.round(e * n) / n;
}
function Qm(t, e, n) {
  n === void 0 && (n = {});
  const i = n.whileElementsMounted, r = R(() => {
    var x;
    return (x = Fn(n.open)) != null ? x : !0;
  }), s = R(() => Fn(n.middleware)), o = R(() => {
    var x;
    return (x = Fn(n.placement)) != null ? x : "bottom";
  }), a = R(() => {
    var x;
    return (x = Fn(n.strategy)) != null ? x : "absolute";
  }), l = R(() => {
    var x;
    return (x = Fn(n.transform)) != null ? x : !0;
  }), c = R(() => Hs(t.value)), u = R(() => Hs(e.value)), d = /* @__PURE__ */ z(0), p = /* @__PURE__ */ z(0), f = /* @__PURE__ */ z(a.value), h = /* @__PURE__ */ z(o.value), m = /* @__PURE__ */ dn({}), y = /* @__PURE__ */ z(!1), C = R(() => {
    const x = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return x;
    const M = Na(u.value, d.value), T = Na(u.value, p.value);
    return l.value ? {
      ...x,
      transform: "translate(" + M + "px, " + T + "px)",
      ...du(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: M + "px",
      top: T + "px"
    };
  });
  let _;
  function b() {
    if (c.value == null || u.value == null)
      return;
    const x = r.value;
    Ym(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((M) => {
      d.value = M.x, p.value = M.y, f.value = M.strategy, h.value = M.placement, m.value = M.middlewareData, y.value = x !== !1;
    });
  }
  function g() {
    typeof _ == "function" && (_(), _ = void 0);
  }
  function E() {
    if (g(), i === void 0) {
      b();
      return;
    }
    if (c.value != null && u.value != null) {
      _ = i(c.value, u.value, b);
      return;
    }
  }
  function k() {
    r.value || (y.value = !1);
  }
  return ye([s, o, a, r], b, {
    flush: "sync"
  }), ye([c, u], E, {
    flush: "sync"
  }), ye(r, k, {
    flush: "sync"
  }), Ys() && cl(g), {
    x: /* @__PURE__ */ Ln(d),
    y: /* @__PURE__ */ Ln(p),
    strategy: /* @__PURE__ */ Ln(f),
    placement: /* @__PURE__ */ Ln(h),
    middlewareData: /* @__PURE__ */ Ln(m),
    isPositioned: /* @__PURE__ */ Ln(y),
    floatingStyles: C,
    update: b
  };
}
const eg = {
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
}, [R0, tg] = ct("PopperContent");
var ng = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ jd({
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
  }, { ...eg }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = tu(), { forwardRef: s, currentElement: o } = Re(), a = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(), { width: c, height: u } = Uh(l), d = R(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), p = R(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), f = R(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = R(() => ({
      padding: p.value,
      boundary: f.value.filter(Xv),
      altBoundary: f.value.length > 0
    })), m = R(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), y = wh(() => [
      jm({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && za({
        ...h.value,
        ...m.value
      }),
      n.avoidCollisions && Wm({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? Xm() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && za({
        ...h.value,
        ...m.value
      }),
      Um({
        ...h.value,
        apply: ({ elements: P, rects: V, availableWidth: D, availableHeight: K }) => {
          const { width: re, height: Z } = V.reference, Q = P.floating.style;
          Q.setProperty("--reka-popper-available-width", `${D}px`), Q.setProperty("--reka-popper-available-height", `${K}px`), Q.setProperty("--reka-popper-anchor-width", `${re}px`), Q.setProperty("--reka-popper-anchor-height", `${Z}px`);
        }
      }),
      l.value && Zm({
        element: l.value,
        padding: n.arrowPadding
      }),
      Yv({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && Km({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), C = R(() => n.reference ?? r.anchor.value), { floatingStyles: _, placement: b, isPositioned: g, middlewareData: E } = Qm(C, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...P) => Vm(...P, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: y
    }), k = R(() => Fs(b.value)[0]), x = R(() => Fs(b.value)[1]);
    $l(() => {
      g.value && i("placed");
    });
    const M = R(() => {
      const P = E.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && P;
    }), T = /* @__PURE__ */ z("");
    pt(() => {
      o.value && (T.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = R(() => E.value.arrow?.x ?? 0), L = R(() => E.value.arrow?.y ?? 0);
    return tg({
      placedSide: k,
      onArrowChange: (P) => l.value = P,
      arrowX: A,
      arrowY: L,
      shouldHideArrow: M
    }), (P, V) => (O(), oe("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: St({
        ...v(_),
        transform: v(g) ? v(_).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: T.value,
        "--reka-popper-transform-origin": [v(E).transformOrigin?.x, v(E).transformOrigin?.y].join(" "),
        ...v(E).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [H(v(Ae), xe({ ref: v(s) }, P.$attrs, {
      "as-child": n.asChild,
      as: P.as,
      "data-side": k.value,
      "data-align": x.value,
      style: { animation: v(g) ? void 0 : "none" }
    }), {
      default: q(() => [te(P.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), ig = ng;
function rg(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => mi(i, e, n)) : mi(t, e, n);
}
function mi(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : Tn(t, e);
}
const [fu, sg] = ct("ListboxRoot");
var og = /* @__PURE__ */ X({
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
  setup(t, { expose: e, emit: n }) {
    const i = t, r = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ Yn(i), { getItems: d } = sn({ isProvider: !0 }), { handleTypeaheadSearch: p } = po(), { primitiveElement: f, currentElement: h } = hr(), m = Wh(), y = Bc(u), C = uo(h), _ = /* @__PURE__ */ z(), b = /* @__PURE__ */ z(!1), g = /* @__PURE__ */ z(!0), E = /* @__PURE__ */ ki(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function k(Y) {
      if (b.value = !0, i.multiple) {
        const ae = Array.isArray(E.value) ? [...E.value] : [], ue = ae.findIndex((he) => mi(he, Y, i.by));
        i.selectionBehavior === "toggle" ? (ue === -1 ? ae.push(Y) : ae.splice(ue, 1), E.value = ae) : (E.value = [Y], _.value = Y);
      } else i.selectionBehavior === "toggle" && mi(E.value, Y, i.by) ? E.value = void 0 : E.value = Y;
      setTimeout(() => {
        b.value = !1;
      }, 1);
    }
    const x = /* @__PURE__ */ z(null), M = /* @__PURE__ */ z(null), T = /* @__PURE__ */ z(!1), A = /* @__PURE__ */ z(!1), L = /* @__PURE__ */ cs(), P = /* @__PURE__ */ cs(), V = /* @__PURE__ */ cs();
    function D() {
      return d().map((Y) => Y.ref).filter((Y) => Y.dataset.disabled !== "");
    }
    function K(Y, ae = !0) {
      if (!Y) return;
      x.value = Y, g.value && x.value.focus(), ae && x.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((he) => he.ref === Y);
      r("highlight", ue);
    }
    function re(Y) {
      if (T.value) V.trigger(Y);
      else {
        const ae = d().find((ue) => mi(ue.value, Y, i.by));
        ae && (x.value = ae.ref, K(ae.ref));
      }
    }
    function Z(Y) {
      x.value && x.value.isConnected && (Y.preventDefault(), Y.stopPropagation(), A.value || x.value.click());
    }
    function Q(Y) {
      if (g.value) {
        if (b.value = !0, T.value) P.trigger(Y);
        else {
          const ae = Y.altKey || Y.ctrlKey || Y.metaKey;
          if (ae && Y.key === "a" && s.value) {
            const ue = d(), he = ue.map((vt) => vt.value);
            E.value = [...he], Y.preventDefault(), K(ue[ue.length - 1].ref);
          } else if (!ae) {
            const ue = p(Y.key, d());
            ue && K(ue);
          }
        }
        setTimeout(() => {
          b.value = !1;
        }, 1);
      }
    }
    function we() {
      A.value = !0;
    }
    function $e() {
      Me(() => {
        A.value = !1;
      });
    }
    function Ze() {
      Me(() => {
        const Y = new KeyboardEvent("keydown", { key: "PageUp" });
        qt(Y);
      });
    }
    function Pe(Y) {
      const ae = x.value;
      ae?.isConnected && (M.value = ae), x.value = null, r("leave", Y);
    }
    function Nt(Y) {
      const ae = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (Y.currentTarget?.dispatchEvent(ae), r("entryFocus", ae), !ae.defaultPrevented)
        if (M.value) K(M.value);
        else {
          const ue = D()?.[0];
          K(ue);
        }
    }
    function qt(Y) {
      const ae = Jc(Y, a.value, y.value);
      if (!ae) return;
      let ue = D();
      if (x.value) {
        if (ae === "last") ue.reverse();
        else if (ae === "prev" || ae === "next") {
          ae === "prev" && ue.reverse();
          const he = ue.indexOf(x.value);
          ue = ue.slice(he + 1);
        }
        Qn(Y, ue[0]);
      }
      if (ue.length) {
        const he = !x.value && ae === "prev" ? ue.length - 1 : 0;
        K(ue[he]);
      }
      if (T.value) return P.trigger(Y);
    }
    function Qn(Y, ae) {
      if (!(T.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(E.value) || (Y.altKey || Y.ctrlKey || Y.metaKey) && !Y.shiftKey) && Y.shiftKey) {
        const he = d().filter((S) => S.ref.dataset.disabled !== "");
        let vt = he.find((S) => S.ref === ae)?.value;
        if (Y.key === m.END ? vt = he[he.length - 1].value : Y.key === m.HOME && (vt = he[0].value), !vt || !_.value) return;
        const w = bh(he.map((S) => S.value), _.value, vt);
        E.value = w;
      }
    }
    async function Ht(Y) {
      if (await Me(), T.value) L.trigger(Y);
      else {
        const ae = D(), ue = ae.find((he) => he.dataset.state === "checked");
        ue ? K(ue) : ae.length && K(ae[0]);
      }
    }
    return ye(E, () => {
      b.value || Me(() => {
        Ht();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: x,
      highlightItem: re,
      highlightFirstItem: Ze,
      highlightSelected: Ht,
      getItems: d
    }), sg({
      modelValue: E,
      onValueChange: k,
      multiple: s,
      orientation: a,
      dir: y,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: x,
      isVirtual: T,
      virtualFocusHook: L,
      virtualKeydownHook: P,
      virtualHighlightHook: V,
      by: i.by,
      firstValue: _,
      selectionBehavior: c,
      focusable: g,
      onLeave: Pe,
      onEnter: Nt,
      changeHighlight: K,
      onKeydownEnter: Z,
      onKeydownNavigation: qt,
      onKeydownTypeAhead: Q,
      onCompositionStart: we,
      onCompositionEnd: $e,
      highlightFirstItem: Ze
    }), (Y, ae) => (O(), U(v(Ae), {
      ref_key: "primitiveElement",
      ref: f,
      as: Y.as,
      "as-child": Y.asChild,
      dir: v(y),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Pe,
      onFocusout: ae[0] || (ae[0] = async (ue) => {
        const he = ue.relatedTarget || ue.target;
        await Me(), x.value && v(h) && !v(h).contains(he) && Pe(ue);
      })
    }, {
      default: q(() => [te(Y.$slots, "default", { modelValue: v(E) }), v(C) && Y.name ? (O(), U(v(Qc), {
        key: 0,
        name: Y.name,
        value: v(E),
        disabled: v(l),
        required: Y.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : de("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), ag = og, lg = /* @__PURE__ */ X({
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
  setup(t) {
    const { CollectionSlot: e } = sn(), n = fu(), i = Mc(!1, 10);
    return (r, s) => (O(), U(v(e), null, {
      default: q(() => [H(v(Ae), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: s[0] || (s[0] = Lt((o) => i.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          v(i) || v(n).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = pr((o) => {
            v(n).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || v(n).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), v(n).focusable.value && v(n).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          pr(v(n).onKeydownEnter, ["enter"]),
          v(n).onKeydownTypeAhead
        ]
      }, {
        default: q(() => [te(r.$slots, "default")]),
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
}), cg = lg;
const ug = "listbox.select", [dg, fg] = ct("ListboxItem");
var pg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, r = Gn(void 0, "reka-listbox-item"), { CollectionItem: s } = sn(), { forwardRef: o, currentElement: a } = Re(), l = fu(), c = R(() => a.value === l.highlightedElement.value), u = R(() => rg(l.modelValue.value, n.value, l.by)), d = R(() => l.disabled.value || n.disabled);
    async function p(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function f(h) {
      const m = {
        originalEvent: h,
        value: n.value
      };
      zr(ug, p, m);
    }
    return fg({ isSelected: u }), (h, m) => (O(), U(v(s), { value: h.value }, {
      default: q(() => [Af([c.value, u.value], () => H(v(Ae), xe({ id: v(r) }, h.$attrs, {
        ref: v(o),
        role: "option",
        tabindex: v(l).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: h.as,
        "as-child": h.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: f,
        onKeydown: pr(Lt(f, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
        })
      }), {
        default: q(() => [te(h.$slots, "default")]),
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
}), hg = pg, vg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t;
    Re();
    const n = dg();
    return (i, r) => v(n).isSelected.value ? (O(), U(v(Ae), xe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [te(i.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), mg = vg;
function gg(t) {
  const e = co({ nonce: /* @__PURE__ */ z() });
  return R(() => t?.value || e.nonce?.value);
}
const yg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], bg = [" ", "Enter"], mt = 10;
function br(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => Vs(i, e, n)) : Vs(t, e, n);
}
function Vs(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : Tn(t, e);
}
function wg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const _g = {
  key: 0,
  value: ""
}, [In, pu] = ct("SelectRoot");
var xg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { required: r, disabled: s, multiple: o, dir: a } = /* @__PURE__ */ Yn(n), l = /* @__PURE__ */ ki(n, "modelValue", i, {
      defaultValue: n.defaultValue ?? (o.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ ki(n, "open", i, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = /* @__PURE__ */ z(), d = /* @__PURE__ */ z(), p = /* @__PURE__ */ z({
      x: 0,
      y: 0
    }), f = R(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Kn(l.value));
    sn({ isProvider: !0 });
    const h = Bc(a), m = uo(u), y = /* @__PURE__ */ z(/* @__PURE__ */ new Set()), C = R(() => Array.from(y.value).map((g) => g.value).join(";"));
    function _(g) {
      if (o.value) {
        const E = Array.isArray(l.value) ? [...l.value] : [], k = E.findIndex((x) => Vs(x, g, n.by));
        k === -1 ? E.push(g) : E.splice(k, 1), l.value = [...E];
      } else l.value = g;
    }
    function b(g) {
      return Array.from(y.value).find((E) => br(g, E.value, n.by));
    }
    return pu({
      triggerElement: u,
      onTriggerChange: (g) => {
        u.value = g;
      },
      valueElement: d,
      onValueElementChange: (g) => {
        d.value = g;
      },
      contentId: "",
      modelValue: l,
      onValueChange: _,
      by: n.by,
      open: c,
      multiple: o,
      required: r,
      onOpenChange: (g) => {
        c.value = g;
      },
      dir: h,
      triggerPointerDownPosRef: p,
      disabled: s,
      isEmptyModelValue: f,
      optionsSet: y,
      onOptionAdd: (g) => {
        const E = b(g.value);
        E && y.value.delete(E), y.value.add(g);
      },
      onOptionRemove: (g) => {
        const E = b(g.value);
        E && y.value.delete(E);
      }
    }), (g, E) => (O(), U(v(Uv), null, {
      default: q(() => [te(g.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(m) ? (O(), U(Eg, {
        key: C.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(r),
        name: g.name,
        autocomplete: g.autocomplete,
        disabled: v(s),
        value: v(l)
      }, {
        default: q(() => [v(Kn)(v(l)) ? (O(), oe("option", _g)) : de("v-if", !0), (O(!0), oe(Ee, null, Pn(Array.from(y.value), (k) => (O(), oe("option", xe({ key: k.value ?? "" }, { ref_for: !0 }, k), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : de("v-if", !0)]),
      _: 3
    }));
  }
}), Sg = xg, Cg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = /* @__PURE__ */ z(), i = In();
    ye(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && n.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(n.value, s), n.value.dispatchEvent(u);
      }
    });
    function r(s) {
      i.onValueChange(s.target.value);
    }
    return (s, o) => (O(), U(v(Zc), { "as-child": "" }, {
      default: q(() => [ie("select", xe({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: r }), [te(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Eg = Cg, kg = /* @__PURE__ */ X({
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
      default: mt
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
  setup(t) {
    const n = fo(t);
    return (i, r) => (O(), U(v(ig), xe(v(n), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: q(() => [te(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Tg = kg;
const Ag = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Gr, hu] = ct("SelectContent");
var Pg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, r = In();
    zh(), Dc(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = sn(), a = /* @__PURE__ */ z();
    zc(a);
    const { search: l, handleTypeaheadSearch: c } = po(), u = /* @__PURE__ */ z(), d = /* @__PURE__ */ z(), p = /* @__PURE__ */ z(), f = /* @__PURE__ */ z(!1), h = /* @__PURE__ */ z(!1), m = /* @__PURE__ */ z(!1);
    function y() {
      d.value && a.value && Ta([d.value, a.value]);
    }
    ye(f, () => {
      y();
    });
    const { onOpenChange: C, triggerPointerDownPosRef: _ } = r;
    pt((k) => {
      if (!a.value) return;
      let x = {
        x: 0,
        y: 0
      };
      const M = (A) => {
        x = {
          x: Math.abs(Math.round(A.pageX) - (_.value?.x ?? 0)),
          y: Math.abs(Math.round(A.pageY) - (_.value?.y ?? 0))
        };
      }, T = (A) => {
        A.pointerType !== "touch" && (x.x <= 10 && x.y <= 10 ? A.preventDefault() : a.value?.contains(A.target) || C(!1), document.removeEventListener("pointermove", M), _.value = null);
      };
      _.value !== null && (document.addEventListener("pointermove", M), document.addEventListener("pointerup", T, {
        capture: !0,
        once: !0
      })), k(() => {
        document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function b(k) {
      const x = k.ctrlKey || k.altKey || k.metaKey;
      if (k.key === "Tab" && k.preventDefault(), !x && k.key.length === 1 && c(k.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(k.key)) {
        let T = [...o().map((A) => A.ref)];
        if (["ArrowUp", "End"].includes(k.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(k.key)) {
          const A = k.target, L = T.indexOf(A);
          T = T.slice(L + 1);
        }
        setTimeout(() => Ta(T)), k.preventDefault();
      }
    }
    const g = R(() => n.position === "popper" ? n : {}), E = fo(g.value);
    return hu({
      content: a,
      viewport: u,
      onViewportChange: (k) => {
        u.value = k;
      },
      itemRefCallback: (k, x, M) => {
        const T = !h.value && !M, A = br(r.modelValue.value, x, r.by);
        if (r.multiple.value) {
          if (m.value) return;
          (A || T) && (d.value = k, A && (m.value = !0));
        } else (A || T) && (d.value = k);
        T && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: p,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (k, x, M) => {
        const T = !h.value && !M;
        (br(r.modelValue.value, x, r.by) || T) && (p.value = k);
      },
      focusSelectedItem: y,
      position: n.position,
      isPositioned: f,
      searchRef: l
    }), (k, x) => (O(), U(v(s), null, {
      default: q(() => [H(v(jc), {
        "as-child": "",
        onMountAutoFocus: x[6] || (x[6] = Lt(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: x[7] || (x[7] = (M) => {
          i("closeAutoFocus", M), !M.defaultPrevented && (v(r).triggerElement.value?.focus({ preventScroll: !0 }), M.preventDefault());
        })
      }, {
        default: q(() => [H(v(Hc), {
          "as-child": "",
          "disable-outside-pointer-events": k.disableOutsidePointerEvents,
          onFocusOutside: x[2] || (x[2] = Lt(() => {
          }, ["prevent"])),
          onDismiss: x[3] || (x[3] = (M) => v(r).onOpenChange(!1)),
          onEscapeKeyDown: x[4] || (x[4] = (M) => i("escapeKeyDown", M)),
          onPointerDownOutside: x[5] || (x[5] = (M) => i("pointerDownOutside", M))
        }, {
          default: q(() => [(O(), U(to(k.position === "popper" ? Tg : Lg), xe({
            ...k.$attrs,
            ...v(E)
          }, {
            id: v(r).contentId,
            ref: (M) => {
              const T = v(Bt)(M);
              T?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = T.firstElementChild : a.value = T;
            },
            role: "listbox",
            "data-state": v(r).open.value ? "open" : "closed",
            dir: v(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: x[0] || (x[0] = Lt(() => {
            }, ["prevent"])),
            onPlaced: x[1] || (x[1] = (M) => f.value = !0),
            onKeydown: b
          }), {
            default: q(() => [te(k.$slots, "default")]),
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
}), Og = Pg;
const [Ig, Mg] = ct("SelectItemAlignedPosition");
var Rg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { getItems: r } = sn(), s = In(), o = Gr(), a = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!0), c = /* @__PURE__ */ z(), { forwardRef: u, currentElement: d } = Re(), { viewport: p, selectedItem: f, selectedItemText: h, focusSelectedItem: m } = o;
    function y() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && p?.value && f?.value && h?.value) {
        const b = s.triggerElement.value.getBoundingClientRect(), g = d.value.getBoundingClientRect(), E = s.valueElement.value.getBoundingClientRect(), k = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const Y = k.left - g.left, ae = E.left - Y, ue = b.left - ae, he = b.width + ue, vt = Math.max(he, g.width), w = window.innerWidth - mt, S = wa(ae, mt, Math.max(mt, w - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.left = `${S}px`;
        } else {
          const Y = g.right - k.right, ae = window.innerWidth - E.right - Y, ue = window.innerWidth - b.right - ae, he = b.width + ue, vt = Math.max(he, g.width), w = window.innerWidth - mt, S = wa(ae, mt, Math.max(mt, w - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.right = `${S}px`;
        }
        const x = r().map((Y) => Y.ref), M = window.innerHeight - mt * 2, T = p.value.scrollHeight, A = window.getComputedStyle(d.value), L = Number.parseInt(A.borderTopWidth, 10), P = Number.parseInt(A.paddingTop, 10), V = Number.parseInt(A.borderBottomWidth, 10), D = Number.parseInt(A.paddingBottom, 10), K = L + P + T + D + V, re = Math.min(f.value.offsetHeight * 5, K), Z = window.getComputedStyle(p.value), Q = Number.parseInt(Z.paddingTop, 10), we = Number.parseInt(Z.paddingBottom, 10), $e = b.top + b.height / 2 - mt, Ze = M - $e, Pe = f.value.offsetHeight / 2, Nt = f.value.offsetTop + Pe, qt = L + P + Nt, Qn = K - qt;
        if (qt <= $e) {
          const Y = f.value === x[x.length - 1];
          c.value.style.bottom = "0px";
          const ae = d.value.clientHeight - p.value.offsetTop - p.value.offsetHeight, ue = Math.max(Ze, Pe + (Y ? we : 0) + ae + V), he = qt + ue;
          c.value.style.height = `${he}px`;
        } else {
          const Y = f.value === x[0];
          c.value.style.top = "0px";
          const ue = Math.max($e, L + p.value.offsetTop + (Y ? Q : 0) + Pe) + Qn;
          c.value.style.height = `${ue}px`, p.value.scrollTop = qt - $e + p.value.offsetTop;
        }
        c.value.style.margin = `${mt}px 0`, c.value.style.minHeight = `${re}px`, c.value.style.maxHeight = `${M}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const C = /* @__PURE__ */ z("");
    De(async () => {
      await Me(), y(), d.value && (C.value = window.getComputedStyle(d.value).zIndex);
    });
    function _(b) {
      b && l.value === !0 && (y(), m?.(), l.value = !1);
    }
    return Lh(s.triggerElement, () => {
      y();
    }), Mg({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: _
    }), (b, g) => (O(), oe("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: St({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: C.value
      })
    }, [H(v(Ae), xe({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...b.$attrs,
      ...n
    }), {
      default: q(() => [te(b.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Lg = Rg, Dg = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return pu(t.context), hu(Ag), (n, i) => te(n.$slots, "default");
  }
}), $g = Dg;
const Bg = { key: 1 };
var Fg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, r = Nh(n, e), s = In(), o = /* @__PURE__ */ z();
    De(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ z(), l = R(() => n.forceMount || s.open.value), c = /* @__PURE__ */ z(l.value);
    return ye(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (O(), U(v(Vr), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: q(() => [H(Og, Gs($r({
        ...v(r),
        ...u.$attrs
      })), {
        default: q(() => [te(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (O(), oe("div", Bg, [(O(), U(ql, { to: o.value }, [H($g, { context: v(s) }, {
      default: q(() => [te(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : de("v-if", !0);
  }
}), zg = Fg, Ng = /* @__PURE__ */ X({
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
  setup(t) {
    return (e, n) => (O(), U(v(Ae), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: q(() => [te(e.$slots, "default", {}, () => [n[0] || (n[0] = Le("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), qg = Ng;
const [vu, Hg] = ct("SelectItem");
var Vg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = e, { disabled: r } = /* @__PURE__ */ Yn(n), s = In(), o = Gr(), { forwardRef: a, currentElement: l } = Re(), { CollectionItem: c } = sn(), u = R(() => br(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ z(!1), p = /* @__PURE__ */ z(n.textValue ?? ""), f = Gn(void 0, "reka-select-item-text"), h = "select.select";
    async function m(g) {
      if (g.defaultPrevented) return;
      const E = {
        originalEvent: g,
        value: n.value
      };
      zr(h, y, E);
    }
    async function y(g) {
      await Me(), i("select", g), !g.defaultPrevented && (r.value || (s.onValueChange(n.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function C(g) {
      await Me(), !g.defaultPrevented && (r.value ? o.onItemLeave?.() : g.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function _(g) {
      await Me(), !g.defaultPrevented && g.currentTarget === it() && o.onItemLeave?.();
    }
    async function b(g) {
      await Me(), !(g.defaultPrevented || o.searchRef?.value !== "" && g.key === " ") && (bg.includes(g.key) && m(g), g.key === " " && g.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return De(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), Hg({
      value: n.value,
      disabled: r,
      textId: f,
      isSelected: u,
      onItemTextChange: (g) => {
        p.value = ((p.value || g?.textContent) ?? "").trim();
      }
    }), (g, E) => (O(), U(v(c), { value: { textValue: p.value } }, {
      default: q(() => [H(v(Ae), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(r) || void 0,
        "data-disabled": v(r) ? "" : void 0,
        tabindex: v(r) ? void 0 : -1,
        as: g.as,
        "as-child": g.asChild,
        onFocus: E[0] || (E[0] = (k) => d.value = !0),
        onBlur: E[1] || (E[1] = (k) => d.value = !1),
        onPointerup: m,
        onPointerdown: E[2] || (E[2] = (k) => {
          k.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: E[3] || (E[3] = Lt(() => {
        }, ["prevent", "stop"])),
        onPointermove: C,
        onPointerleave: _,
        onKeydown: b
      }, {
        default: q(() => [te(g.$slots, "default")]),
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
}), jg = Vg, Wg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = vu();
    return (i, r) => v(n).isSelected.value ? (O(), U(v(Ae), xe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [te(i.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), Ug = Wg, Kg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = In(), i = Gr(), r = vu(), { forwardRef: s, currentElement: o } = Re(), a = R(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: o.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return De(() => {
      o.value && (r.onItemTextChange(o.value), i.itemTextRefCallback(o.value, r.value, r.disabled.value), n.onOptionAdd(a.value));
    }), vn(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (O(), U(v(Ae), xe({
      id: v(r).textId,
      ref: v(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: q(() => [te(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Gg = Kg, Xg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t;
    return (n, i) => (O(), U(v(Gc), Gs($r(e)), {
      default: q(() => [te(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Yg = Xg, Jg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = In(), { forwardRef: i, currentElement: r } = Re(), s = R(() => n.disabled?.value || e.disabled);
    n.contentId ||= Gn(void 0, "reka-select-content"), De(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: o } = sn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = po();
    function u() {
      s.value || (n.onOpenChange(!0), c());
    }
    function d(p) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      };
    }
    return (p, f) => (O(), U(v(Gv), {
      "as-child": "",
      reference: p.reference
    }, {
      default: q(() => [H(v(Ae), {
        ref: v(i),
        role: "combobox",
        type: p.as === "button" ? "button" : void 0,
        "aria-controls": v(n).contentId,
        "aria-expanded": v(n).open.value || !1,
        "aria-required": v(n).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: v(n)?.dir.value,
        "data-state": v(n)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": v(wg)(v(n).modelValue?.value) ? "" : void 0,
        "as-child": p.asChild,
        as: p.as,
        onClick: f[0] || (f[0] = (h) => {
          h?.currentTarget?.focus();
        }),
        onPointerdown: f[1] || (f[1] = (h) => {
          if (h.pointerType === "touch") return h.preventDefault();
          const m = h.target;
          m.hasPointerCapture(h.pointerId) && m.releasePointerCapture(h.pointerId), h.button === 0 && h.ctrlKey === !1 && (d(h), h.preventDefault());
        }),
        onPointerup: f[2] || (f[2] = Lt((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (h) => {
          const m = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && m && h.key === " " || (v(l)(h.key, v(o)()), v(yg).includes(h.key) && (u(), h.preventDefault()));
        })
      }, {
        default: q(() => [te(p.$slots, "default")]),
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
}), Zg = Jg, Qg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, { nonce: n } = /* @__PURE__ */ Yn(e), i = gg(n), r = Gr(), s = r.position === "item-aligned" ? Ig() : void 0, { forwardRef: o, currentElement: a } = Re();
    De(() => {
      r?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ z(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: p, contentWrapper: f } = s ?? {};
      if (p?.value && f?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const m = window.innerHeight - mt * 2, y = Number.parseFloat(f.value.style.minHeight), C = Number.parseFloat(f.value.style.height), _ = Math.max(y, C);
          if (_ < m) {
            const b = _ + h, g = Math.min(m, b), E = b - g;
            f.value.style.height = `${g}px`, f.value.style.bottom === "0px" && (d.scrollTop = E > 0 ? E : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (O(), oe(Ee, null, [H(v(Ae), xe({
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
      default: q(() => [te(u.$slots, "default")]),
      _: 3
    }, 16), H(v(Ae), {
      as: "style",
      nonce: v(i)
    }, {
      default: q(() => d[0] || (d[0] = [Le(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), ey = Qg;
const ty = /* @__PURE__ */ X({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: { type: String }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (e, n) => (O(), U(v(qv), {
      "model-value": t.modelValue,
      "aria-label": t.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": n[0] || (n[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: n[1] || (n[1] = Lt(() => {
      }, ["stop"]))
    }, {
      default: q(() => [
        H(v(Vv), { class: "checkbox-indicator" }, {
          default: q(() => [
            H(v(Fr), {
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
}), ny = ".checkbox[data-v-024ee78b]{all:unset;width:16px;height:16px;flex-shrink:0;border:1.5px solid var(--color-border);border-radius:var(--radius-sm);background-color:var(--color-surface);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color var(--transition-duration),border-color var(--transition-duration)}.checkbox[data-v-024ee78b]:hover{border-color:var(--color-primary)}.checkbox[data-v-024ee78b]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.checkbox[data-state=checked][data-v-024ee78b]{background-color:var(--color-primary);border-color:var(--color-primary)}.checkbox-indicator[data-v-024ee78b]{color:var(--color-white, #fff);display:inline-flex;align-items:center;justify-content:center}", iy = /* @__PURE__ */ Oe(ty, [["styles", [ny]], ["__scopeId", "data-v-024ee78b"]]);
function ry() {
  const t = /* @__PURE__ */ new Map();
  function e(s, o) {
    let a = t.get(s);
    return a || (a = /* @__PURE__ */ new Set(), t.set(s, a)), a.add(o), () => n(s, o);
  }
  function n(s, o) {
    t.get(s)?.delete(o);
  }
  function i(s, o) {
    t.get(s)?.forEach(
      (a) => a(o)
    );
  }
  function r() {
    t.clear();
  }
  return { on: e, off: n, emit: i, clear: r };
}
const qa = [
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
function sy(t, e, n) {
  const i = qa[t.size % qa.length];
  return { id: e, name: n, color: i };
}
function oy(t, e, n) {
  return !e || t.has(e) ? null : sy(t, e, n ?? e);
}
function ay(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function ly(t) {
  const e = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = oy(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(s, o) {
    const a = ay(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: r };
}
function cy(t, e) {
  return [...t, e];
}
function uy(t, e) {
  return [...e, ...t];
}
function _o(t, e) {
  return t.findIndex((n) => n.id === e);
}
function dy(t, e, n) {
  const i = _o(t, e);
  if (i === -1) return null;
  const r = { ...t[i], ...n, id: e }, s = t.slice();
  return s[i] = r, { turns: s, updated: r };
}
function fy(t, e) {
  const n = _o(t, e);
  return n === -1 ? null : t.filter((i, r) => r !== n);
}
function py(t, e, n) {
  const i = _o(t, e);
  if (i === -1) return null;
  const r = t[i], s = {
    ...r,
    words: n,
    text: null,
    startTime: n[0]?.startTime ?? r.startTime,
    endTime: n[n.length - 1]?.endTime ?? r.endTime
  }, o = t.slice();
  return o[i] = s, { turns: o, updated: s };
}
function js(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function hy(t, e, n) {
  const { id: i, languages: r, isSource: s, audio: o } = t, a = /* @__PURE__ */ dn(t.turns), l = /* @__PURE__ */ new Map();
  function c() {
    l.clear();
    const b = a.value;
    for (let g = 0; g < b.length; g++)
      l.set(b[g].id, g);
  }
  c();
  function u(b) {
    n(b.speakerId), l.set(b.id, a.value.length), a.value = cy(a.value, b), e("turn:add", { turn: b, translationId: i });
  }
  function d(b, g) {
    const E = dy(a.value, b, g);
    E && (a.value = E.turns, e("turn:update", { turn: E.updated, translationId: i }));
  }
  function p(b) {
    const g = fy(a.value, b);
    g && (a.value = g, c(), e("turn:remove", { turnId: b, translationId: i }));
  }
  function f(b, g) {
    const E = py(a.value, b, g);
    E && (a.value = E.turns, e("turn:update", { turn: E.updated, translationId: i }));
  }
  function h(b) {
    js(b, n), a.value = uy(a.value, b), c();
  }
  function m(b) {
    js(b, n), a.value = b, c(), e("translation:sync", { translationId: i });
  }
  function y(b) {
    a.value = b, c();
  }
  function C(b) {
    const g = l.get(b.id);
    g !== void 0 ? a.value[g] = b : (l.set(b.id, a.value.length), a.value.push(b));
  }
  function _(b) {
    return l.has(b);
  }
  return { id: i, languages: r, isSource: s, audio: o, turns: a, addTurn: u, prependTurns: h, updateTurn: d, removeTurn: p, updateWords: f, setTurns: m, replaceTurns: y, updateOrCreateTurnSilent: C, hasTurn: _ };
}
function Ha(t, e, n) {
  const { id: i, name: r, description: s, duration: o } = t, a = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  let l;
  for (const m of t.translations) {
    const y = hy(m, e, n);
    a.set(m.id, y), m.isSource && !l && (l = y);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ z(null), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(!0), p = R(() => c.value ? a.get(c.value) ?? l : l);
  function f(m) {
    const y = m === l.id ? null : m;
    y !== c.value && (c.value = y, e("translation:change", { translationId: p.value.id }));
  }
  function h() {
    for (const m of a.values())
      m.setTurns([]);
    u.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: r,
    description: s,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: p,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: h
  };
}
function vy(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, r] of t.speakers)
    e.add(i), n.push({ id: i, name: r.name });
  for (const i of t.channels)
    for (const r of i.translations)
      for (const s of r.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), n.push({ id: s.speakerId, name: s.speakerId }));
  return n;
}
function my(t = {}) {
  const e = /* @__PURE__ */ z(""), n = /* @__PURE__ */ z(t.activeChannelId ?? ""), i = /* @__PURE__ */ z(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: s, emit: o, clear: a } = ry(), l = ly(o), c = l, u = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map()), d = R(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function p(k, x) {
    return r(k, (M) => {
      M.translationId === d.value.activeTranslation.value.id && x(M);
    });
  }
  function f(k) {
    e.value = k.title, l.clear(), u.clear();
    for (const x of vy(k))
      c.ensure(x.id, x.name);
    for (const x of k.channels)
      u.set(x.id, Ha(x, o, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(k) {
    Wp(k), f(k);
  }
  function m(k) {
    k !== n.value && (n.value = k, o("channel:change", { channelId: k }));
  }
  function y(k, x) {
    if (u.has(k)) {
      for (const M of x.translations)
        js(M.turns, c.ensure);
      u.set(k, Ha(x, o, c.ensure)), o("channel:sync", { channelId: k });
    }
  }
  const C = [], _ = [];
  function b(k) {
    k.tiptapExtensions && _.push(...k.tiptapExtensions);
    const x = k.install(E);
    x && C.push(x);
  }
  function g() {
    o("destroy", void 0), C.forEach((k) => k()), C.length = 0, a();
  }
  t.document && f(t.document);
  const E = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: _,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: p,
    setDocument: h,
    setActiveChannel: m,
    setChannel: y,
    on: r,
    off: s,
    emit: o,
    use: b,
    destroy: g
  };
  return E;
}
const mu = /* @__PURE__ */ Symbol("editorStore");
function gy(t) {
  Jn(mu, t);
}
function Mn() {
  const t = Xt(mu);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const gu = /* @__PURE__ */ Symbol("turnSelection");
function Va(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function yy(t, e, n) {
  const i = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  let r = null;
  const s = R(() => i.size), o = R(() => i.size > 0);
  function a(C) {
    return i.has(C);
  }
  function l(C) {
    i.has(C) ? i.delete(C) : i.set(C, !0), r = C;
  }
  function c(C) {
    if (r === null) {
      l(C);
      return;
    }
    const _ = t.value.map((x) => x.id), b = _.indexOf(r), g = _.indexOf(C);
    if (b === -1 || g === -1) {
      l(C);
      return;
    }
    const E = Math.min(b, g), k = Math.max(b, g);
    for (let x = E; x <= k; x++) {
      const M = _[x];
      M != null && i.set(M, !0);
    }
  }
  function u() {
    i.clear(), r = null;
  }
  async function d() {
    const _ = t.value.filter((b) => i.has(b.id)).map(Va).join(`

`);
    await navigator.clipboard.writeText(_);
  }
  async function p() {
    const _ = t.value.filter((b) => i.has(b.id)).map((b) => {
      const E = (b.speakerId ? e.get(b.speakerId) : void 0)?.name ?? "", k = b.startTime != null ? Ei(b.startTime) : "", x = [E, k].filter(Boolean).join(" (") + (k ? ")" : ""), M = Va(b);
      return x ? `${x}
${M}` : M;
    });
    await navigator.clipboard.writeText(_.join(`

`));
  }
  ye(
    () => t.value,
    (C) => {
      if (i.size === 0) return;
      const _ = new Set(C.map((b) => b.id));
      for (const b of [...i.keys()])
        _.has(b) || i.delete(b);
    }
  );
  const f = n.on("channel:change", u), h = n.on("translation:change", u);
  function m(C) {
    C.key === "Escape" && i.size > 0 && u();
  }
  De(() => {
    document.addEventListener("keydown", m);
  }), hn(() => {
    document.removeEventListener("keydown", m), f(), h();
  });
  const y = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: c,
    clear: u,
    copyText: d,
    copyWithMetadata: p
  };
  return Jn(gu, y), y;
}
function yu() {
  const t = Xt(gu);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const by = ["data-turn-active", "aria-selected"], wy = { class: "turn-text" }, _y = ["data-word-active"], xy = /* @__PURE__ */ X({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Mn(), i = yu(), { t: r } = ht(), s = R(() => e.turn.words.length > 0), o = R(() => {
      if (!n.audio?.src.value || !s.value) return null;
      const f = n.audio.currentTime.value, { startTime: h, endTime: m, words: y } = e.turn;
      return h == null || m == null || f < h || f > m ? null : Kp(y, f);
    }), a = R(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Oc(e.turn.words)) return !1;
      const f = n.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = R(() => e.speaker?.color ?? "transparent"), c = R(() => i.isSelected(e.turn.id)), u = R(() => {
      const f = e.speaker?.name ?? "", h = c.value ? "selection.deselect" : "selection.select";
      return r(h).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function p(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, h) => (O(), oe("section", {
      class: $t(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: St({ "--speaker-color": l.value }),
      "aria-selected": v(i).hasSelection.value ? c.value : void 0
    }, [
      t.partial ? de("", !0) : (O(), oe("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        v(i).hasSelection.value ? (O(), U(iy, {
          key: 0,
          "model-value": c.value,
          "aria-label": u.value,
          onClick: Lt(p, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : de("", !0),
        H(gh, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      ie("p", wy, [
        s.value ? (O(!0), oe(Ee, { key: 0 }, Pn(t.turn.words, (m, y) => (O(), oe(Ee, {
          key: m.id
        }, [
          ie("span", {
            class: $t({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, fe(m.text), 11, _y),
          Le(fe(y < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (O(), oe(Ee, { key: 1 }, [
          Le(fe(t.turn.text), 1)
        ], 64)) : de("", !0)
      ])
    ], 14, by));
  }
}), Sy = ".turn[data-v-a69afe32]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-a69afe32]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn[data-v-a69afe32]:has(.turn-header:hover){background-color:var(--color-surface-hover)}.turn-text[data-v-a69afe32]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-a69afe32]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-a69afe32]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-a69afe32]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-a69afe32]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-a69afe32 .2s ease}@keyframes partial-fade-in-a69afe32{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-a69afe32]{animation:none}}@media(max-width:767px){.turn[data-v-a69afe32]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-a69afe32],.turn--active[data-v-a69afe32]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", ja = /* @__PURE__ */ Oe(xy, [["styles", [Sy]], ["__scopeId", "data-v-a69afe32"]]), Cy = {}, Ey = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function ky(t, e) {
  return O(), oe("svg", Ey, [...e[0] || (e[0] = [
    bf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Ty = /* @__PURE__ */ Oe(Cy, [["render", ky]]), Ay = { class: "transcription-empty" }, Py = { class: "message" }, Oy = /* @__PURE__ */ X({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = ht();
    return (n, i) => (O(), oe("div", Ay, [
      H(Ty, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      ie("p", Py, fe(v(e)("transcription.empty")), 1)
    ]));
  }
}), Iy = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", My = /* @__PURE__ */ Oe(Oy, [["styles", [Iy]], ["__scopeId", "data-v-f82737e5"]]), Ry = { class: "transcription-panel" }, Ly = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Dy = { class: "turns-container" }, $y = {
  key: 0,
  class: "history-loading",
  role: "status"
}, By = {
  key: 1,
  class: "history-start"
}, Fy = /* @__PURE__ */ X({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = ht(), i = Mn(), r = _i("scrollContainer"), s = R(() => {
      const _ = i.live?.partial.value ?? null;
      return _ === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: _,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = R(() => i.live?.hasLiveUpdate.value ?? !1), a = R(() => i.audio?.isPlaying.value ?? !1), l = R(
      () => i.activeChannel.value.activeTranslation.value
    ), c = R(() => i.activeChannel.value), u = R(
      () => c.value.isLoadingHistory.value
    ), d = R(() => c.value.hasMoreHistory.value), { scrollRef: p, contentRef: f, isAtBottom: h, scrollToBottom: m } = lh();
    De(() => {
      p.value = r.value, f.value = r.value?.querySelector(".turns-container") ?? null;
    });
    const y = jp(() => {
      const _ = c.value;
      _.hasMoreHistory.value && (_.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function C() {
      const _ = r.value;
      _ && _.scrollTop < 100 && y();
    }
    return ye(
      () => e.turns,
      (_, b) => {
        const g = _.length, E = b.length;
        if (g > E && !h.value && _[0]?.id != b[0]?.id) {
          const k = g - E, x = e.turns[k]?.id;
          if (!x || !p.value) return;
          Me(() => {
            p.value?.querySelector(
              `[data-turn-id="${x}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), De(() => {
      r.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), hn(() => {
      r.value?.removeEventListener("scroll", C);
    }), (_, b) => (O(), oe("article", Ry, [
      ie("div", Ly, [
        ie("div", Dy, [
          u.value ? (O(), oe("div", $y, [...b[3] || (b[3] = [
            ie("progress", null, null, -1)
          ])])) : de("", !0),
          !d.value && t.turns.length > 0 ? (O(), oe("div", By, fe(v(n)("transcription.historyStart")), 1)) : de("", !0),
          t.turns.length === 0 && !u.value && !s.value ? (O(), U(My, {
            key: 2,
            class: "transcription-empty"
          })) : de("", !0),
          (O(!0), oe(Ee, null, Pn(t.turns, (g, E, k, x) => {
            const M = [g, t.speakers.get(g.speakerId ?? ""), o.value && !s.value && E === t.turns.length - 1];
            if (x && x.key === g.id && wc(x, M)) return x;
            const T = (O(), U(ja, {
              "data-turn-id": g.id,
              key: g.id,
              turn: g,
              speaker: g.speakerId ? t.speakers.get(g.speakerId) : void 0,
              live: o.value && !s.value && E === t.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return T.memo = M, T;
          }, b, 0), 128)),
          s.value ? (O(), U(ja, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : de("", !0)
        ]),
        H(Sc, { name: "fade-slide" }, {
          default: q(() => [
            !v(h) && (a.value || o.value) ? (O(), U(ft, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": v(n)("transcription.resumeScroll"),
              onClick: b[2] || (b[2] = (g) => v(m)())
            }, {
              default: q(() => [
                Le(fe(v(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : de("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), zy = ".transcription-panel[data-v-49c5b0cc]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-49c5b0cc]{height:100%;overflow:auto;position:relative}.turns-container[data-v-49c5b0cc]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-49c5b0cc]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-49c5b0cc]{width:120px}.history-start[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-49c5b0cc]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-49c5b0cc],.fade-slide-leave-to[data-v-49c5b0cc]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:none}}@media(max-width:767px){.turns-container[data-v-49c5b0cc]{padding:var(--spacing-md)}}", Ny = /* @__PURE__ */ Oe(Fy, [["styles", [zy]], ["__scopeId", "data-v-49c5b0cc"]]), qy = { class: "switch" }, Hy = ["id", "checked"], Vy = ["for"], jy = /* @__PURE__ */ X({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = n.id ?? Kl();
    return (s, o) => (O(), oe("div", qy, [
      ie("input", {
        type: "checkbox",
        id: v(r),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Hy),
      ie("label", { for: v(r) }, [...o[1] || (o[1] = [
        ie("div", { class: "switch-slider" }, null, -1)
      ])], 8, Vy)
    ]));
  }
}), Wy = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", Uy = /* @__PURE__ */ Oe(jy, [["styles", [Wy]], ["__scopeId", "data-v-2aa0332f"]]), Ky = "(max-width: 767px)";
function bu() {
  const t = /* @__PURE__ */ z(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return De(() => {
    e = window.matchMedia(Ky), t.value = e.matches, e.addEventListener("change", n);
  }), hn(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Gy = { class: "sidebar-select-trigger-label" }, Xy = /* @__PURE__ */ X({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = R(
      () => n.items.find((a) => a.value === n.selectedValue)
    ), s = /* @__PURE__ */ z(), o = /* @__PURE__ */ z([]);
    return De(() => {
      const a = s.value?.closest(".speaker-sidebar");
      a && (o.value = [a]);
    }), (a, l) => (O(), oe("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: s
    }, [
      H(v(Sg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": l[0] || (l[0] = (c) => i("update:selectedValue", c))
      }, {
        default: q(() => [
          H(v(Zg), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: q(() => [
              ie("span", Gy, [
                te(a.$slots, "trigger", { item: r.value }, () => [
                  Le(fe(r.value?.label ?? ""), 1)
                ])
              ]),
              H(v(qg), null, {
                default: q(() => [
                  H(v(kc), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 3
          }, 8, ["aria-label"]),
          H(v(Yg), { disabled: "" }, {
            default: q(() => [
              H(v(zg), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": o.value
              }, {
                default: q(() => [
                  H(v(ey), null, {
                    default: q(() => [
                      (O(!0), oe(Ee, null, Pn(t.items, (c) => (O(), U(v(jg), {
                        key: c.value,
                        value: c.value,
                        class: "sidebar-select-item"
                      }, {
                        default: q(() => [
                          H(v(Ug), { class: "sidebar-select-item-indicator" }, {
                            default: q(() => [
                              H(v(Fr), { size: 14 })
                            ]),
                            _: 1
                          }),
                          H(v(Gg), null, {
                            default: q(() => [
                              te(a.$slots, "item", { item: c }, () => [
                                Le(fe(c.label), 1)
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
}), Yy = { class: "sidebar-select" }, Jy = ["aria-label"], Zy = { class: "sidebar-select-trigger-label" }, Qy = /* @__PURE__ */ X({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = /* @__PURE__ */ z(!1), s = R(
      () => n.items.find((a) => a.value === n.selectedValue)
    );
    function o(a) {
      i("update:selectedValue", a), r.value = !1;
    }
    return (a, l) => (O(), oe("div", Yy, [
      ie("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: l[0] || (l[0] = (c) => r.value = !0)
      }, [
        ie("span", Zy, [
          te(a.$slots, "trigger", { item: s.value }, () => [
            Le(fe(s.value?.label ?? ""), 1)
          ])
        ])
      ], 8, Jy),
      H(v(Nc), {
        open: r.value,
        "onUpdate:open": l[2] || (l[2] = (c) => r.value = c)
      }, {
        default: q(() => [
          H(v(Xc), { disabled: "" }, {
            default: q(() => [
              H(v(Kc), { class: "editor-overlay" }),
              H(v(Uc), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: q(() => [
                  H(v(Yc), { class: "sr-only" }, {
                    default: q(() => [
                      Le(fe(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = ie("div", { class: "sheet-handle" }, null, -1)),
                  H(v(ag), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: q(() => [
                      H(v(cg), { class: "sheet-list" }, {
                        default: q(() => [
                          (O(!0), oe(Ee, null, Pn(t.items, (c) => (O(), U(v(hg), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: q(() => [
                              H(v(mg), { class: "sheet-item-indicator" }, {
                                default: q(() => [
                                  H(v(Fr), { size: 16 })
                                ]),
                                _: 1
                              }),
                              te(a.$slots, "item", { item: c }, () => [
                                Le(fe(c.label), 1)
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
}), wu = /* @__PURE__ */ X({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: i } = bu();
    return (r, s) => v(i) ? (O(), U(Qy, xe({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), Fo({ _: 2 }, [
      r.$slots.item ? {
        name: "item",
        fn: q(({ item: o }) => [
          te(r.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      r.$slots.trigger ? {
        name: "trigger",
        fn: q(({ item: o }) => [
          te(r.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040)) : (O(), U(Xy, xe({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => n("update:selectedValue", o))
    }), Fo({ _: 2 }, [
      r.$slots.item ? {
        name: "item",
        fn: q(({ item: o }) => [
          te(r.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      r.$slots.trigger ? {
        name: "trigger",
        fn: q(({ item: o }) => [
          te(r.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040));
  }
}), _u = /* @__PURE__ */ X({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r } = ht(), s = R(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (O(), U(wu, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), eb = { class: "translation-row" }, tb = {
  key: 0,
  class: "translation-row-badge"
}, nb = {
  key: 0,
  class: "translation-trigger-badge"
}, ib = /* @__PURE__ */ X({
  __name: "TranslationSelector",
  props: {
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedTranslationId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r, locale: s } = ht(), o = R(
      () => Vp(
        n.translations,
        s.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    return (a, l) => (O(), U(wu, {
      items: o.value,
      "selected-value": t.selectedTranslationId,
      ariaLabel: v(r)("sidebar.translationLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (c) => i("update:selectedTranslationId", c))
    }, {
      item: q(({ item: c }) => [
        ie("span", eb, [
          c.originalLabel ? (O(), oe("strong", tb, fe(c.originalLabel), 1)) : de("", !0),
          ie("span", null, fe(c.label), 1)
        ])
      ]),
      trigger: q(({ item: c }) => [
        c?.originalLabel ? (O(), oe("span", nb, fe(c.originalLabel), 1)) : de("", !0),
        ie("span", null, fe(c?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), rb = ".translation-row[data-v-77b61b2c]{display:flex;flex-direction:column;gap:2px}.translation-row-badge[data-v-77b61b2c]{font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}.translation-trigger-badge[data-v-77b61b2c]{font-variant-caps:all-small-caps;color:var(--color-text-muted);margin-right:var(--spacing-xs);letter-spacing:.05em}", xu = /* @__PURE__ */ Oe(ib, [["styles", [rb]], ["__scopeId", "data-v-77b61b2c"]]), sb = { class: "speaker-sidebar" }, ob = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, ab = { class: "sidebar-title" }, lb = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, cb = { class: "sidebar-title" }, ub = {
  key: 2,
  class: "sidebar-section"
}, db = { class: "sidebar-title" }, fb = { class: "subtitle-toggle" }, pb = { class: "subtitle-toggle-label" }, hb = { class: "subtitle-slider" }, vb = { class: "subtitle-slider-label" }, mb = { class: "subtitle-slider-value" }, gb = ["value", "disabled"], yb = {
  key: 3,
  class: "sidebar-section"
}, bb = { class: "sidebar-title" }, wb = { class: "speaker-list" }, _b = { class: "speaker-name" }, xb = /* @__PURE__ */ X({
  __name: "SpeakerSidebar",
  props: {
    speakers: { type: Array },
    channels: { type: Array },
    selectedChannelId: { type: String },
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedChannelId", "update:selectedTranslationId"],
  setup(t) {
    const e = Mn(), { t: n } = ht();
    return (i, r) => (O(), oe("aside", sb, [
      t.channels.length > 1 ? (O(), oe("section", ob, [
        ie("h2", ab, fe(v(n)("sidebar.channel")), 1),
        H(_u, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": r[0] || (r[0] = (s) => i.$emit("update:selectedChannelId", s))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : de("", !0),
      t.translations.length > 1 ? (O(), oe("section", lb, [
        ie("h2", cb, fe(v(n)("sidebar.translation")), 1),
        H(xu, {
          translations: t.translations,
          "selected-translation-id": t.selectedTranslationId,
          "onUpdate:selectedTranslationId": r[1] || (r[1] = (s) => i.$emit("update:selectedTranslationId", s))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : de("", !0),
      v(e).subtitle ? (O(), oe("section", ub, [
        ie("h2", db, fe(v(n)("sidebar.subtitle")), 1),
        ie("div", fb, [
          ie("span", pb, fe(v(n)("subtitle.show")), 1),
          H(Uy, {
            modelValue: v(e).subtitle.isVisible.value,
            "onUpdate:modelValue": r[2] || (r[2] = (s) => v(e).subtitle.isVisible.value = s)
          }, null, 8, ["modelValue"])
        ]),
        ie("label", hb, [
          ie("span", vb, [
            Le(fe(v(n)("subtitle.fontSize")) + " ", 1),
            ie("span", mb, fe(v(e).subtitle.fontSize.value) + "px", 1)
          ]),
          ie("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(e).subtitle.fontSize.value,
            disabled: !v(e).subtitle.isVisible.value,
            onInput: r[3] || (r[3] = (s) => v(e).subtitle.fontSize.value = Number(s.target.value))
          }, null, 40, gb)
        ])
      ])) : de("", !0),
      t.speakers.length ? (O(), oe("section", yb, [
        ie("h2", bb, fe(v(n)("sidebar.speakers")), 1),
        ie("ul", wb, [
          (O(!0), oe(Ee, null, Pn(t.speakers, (s) => (O(), oe("li", {
            key: s.id,
            class: "speaker-item"
          }, [
            H(Ic, {
              color: s.color
            }, null, 8, ["color"]),
            ie("span", _b, fe(s.name), 1)
          ]))), 128))
        ])
      ])) : de("", !0)
    ]));
  }
}), Sb = ".speaker-sidebar[data-v-8d9f6756]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-8d9f6756]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-8d9f6756]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-8d9f6756]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-8d9f6756]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-8d9f6756]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-8d9f6756]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-8d9f6756]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-8d9f6756]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-8d9f6756]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-8d9f6756]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-8d9f6756]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-8d9f6756]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-8d9f6756]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-8d9f6756]{border-left:none}.sidebar-section--selector[data-v-8d9f6756]{display:none}}", Wa = /* @__PURE__ */ Oe(xb, [["styles", [Sb]], ["__scopeId", "data-v-8d9f6756"]]), Cb = /* @__PURE__ */ X({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = Zd(t, "open"), { t: n } = ht();
    return (i, r) => (O(), U(v(Nc), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (s) => e.value = s)
    }, {
      default: q(() => [
        H(v(Xc), { disabled: "" }, {
          default: q(() => [
            H(v(Kc), { class: "editor-overlay" }),
            H(v(Uc), { class: "sidebar-drawer" }, {
              default: q(() => [
                H(v(Yc), { class: "sr-only" }, {
                  default: q(() => [
                    Le(fe(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                H(v(tv), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: q(() => [
                    H(v(ao), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                te(i.$slots, "default")
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
}), Eb = { class: "player-controls" }, kb = { class: "controls-left" }, Tb = { class: "controls-time" }, Ab = { class: "time-display" }, Pb = { class: "time-display" }, Ob = { class: "controls-right" }, Ib = ["value", "aria-label", "disabled"], Mb = /* @__PURE__ */ X({
  __name: "AudioPlayerControls",
  props: {
    isPlaying: { type: Boolean },
    currentTime: { type: String },
    duration: { type: String },
    volume: { type: Number },
    playbackRate: { type: Number },
    isMuted: { type: Boolean },
    isReady: { type: Boolean }
  },
  emits: ["togglePlay", "skipBack", "skipForward", "update:volume", "toggleMute", "cyclePlaybackRate"],
  setup(t, { emit: e }) {
    const n = e, { t: i } = ht(), r = /* @__PURE__ */ z(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (O(), oe("div", Eb, [
      ie("div", kb, [
        H(ft, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": v(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        H(ft, {
          variant: "transparent",
          icon: t.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": t.isPlaying ? v(i)("player.pause") : v(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        H(ft, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": v(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      ie("div", Tb, [
        ie("time", Ab, fe(t.currentTime), 1),
        a[7] || (a[7] = ie("span", { class: "time-separator" }, "/", -1)),
        ie("time", Pb, fe(t.duration), 1)
      ]),
      ie("div", Ob, [
        ie("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          H(ft, {
            variant: "transparent",
            icon: t.isMuted ? "volume-mute" : "volume",
            "aria-label": t.isMuted ? v(i)("player.unmute") : v(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          wd(ie("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": v(i)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, Ib), [
            [Nf, r.value]
          ])
        ], 32),
        H(ft, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": v(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: q(() => [
            Le(fe(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Rb = ".player-controls[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-2dcb93b1]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-2dcb93b1]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-2dcb93b1]:disabled{opacity:.5;cursor:default}.play-button[data-v-2dcb93b1]{--btn-height: 40px;--btn-icon-size: 20px}.speed-button[data-v-2dcb93b1]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-2dcb93b1],.volume-slider[data-v-2dcb93b1]{display:none}.player-controls[data-v-2dcb93b1]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Lb = /* @__PURE__ */ Oe(Mb, [["styles", [Rb]], ["__scopeId", "data-v-2dcb93b1"]]);
function Xe(t, e, n, i) {
  return new (n || (n = Promise))((function(r, s) {
    function o(c) {
      try {
        l(i.next(c));
      } catch (u) {
        s(u);
      }
    }
    function a(c) {
      try {
        l(i.throw(c));
      } catch (u) {
        s(u);
      }
    }
    function l(c) {
      var u;
      c.done ? r(c.value) : (u = c.value, u instanceof n ? u : new n((function(d) {
        d(u);
      }))).then(o, a);
    }
    l((i = i.apply(t, e || [])).next());
  }));
}
let $i = class {
  constructor() {
    this.listeners = {};
  }
  on(e, n, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...s) => {
        this.un(e, r), n(...s);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
    }
    return this.listeners[e].add(n), () => this.un(e, n);
  }
  un(e, n) {
    var i;
    (i = this.listeners[e]) === null || i === void 0 || i.delete(n);
  }
  once(e, n) {
    return this.on(e, n, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...n) {
    this.listeners[e] && this.listeners[e].forEach(((i) => i(...n)));
  }
};
const Wi = { decode: function(t, e) {
  return Xe(this, void 0, void 0, (function* () {
    const n = new AudioContext({ sampleRate: e });
    try {
      return yield n.decodeAudioData(t);
    } finally {
      n.close();
    }
  }));
}, createBuffer: function(t, e) {
  if (!t || t.length === 0) throw new Error("channelData must be a non-empty array");
  if (e <= 0) throw new Error("duration must be greater than 0");
  if (typeof t[0] == "number" && (t = [t]), !t[0] || t[0].length === 0) throw new Error("channelData must contain non-empty channel arrays");
  (function(i) {
    const r = i[0];
    if (r.some(((s) => s > 1 || s < -1))) {
      const s = r.length;
      let o = 0;
      for (let a = 0; a < s; a++) {
        const l = Math.abs(r[a]);
        l > o && (o = l);
      }
      for (const a of i) for (let l = 0; l < s; l++) a[l] /= o;
    }
  })(t);
  const n = t.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: n[0].length, sampleRate: n[0].length / e, numberOfChannels: n.length, getChannelData: (i) => {
    const r = n[i];
    if (!r) throw new Error(`Channel ${i} not found`);
    return r;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Su(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Su(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function Ua(t, e, n) {
  const i = Su(t, e || {});
  return n?.appendChild(i), i;
}
var Db = Object.freeze({ __proto__: null, createElement: Ua, default: Ua });
const $b = { fetchBlob: function(t, e, n) {
  return Xe(this, void 0, void 0, (function* () {
    const i = yield fetch(t, n);
    if (i.status >= 400) throw new Error(`Failed to fetch ${t}: ${i.status} (${i.statusText})`);
    return (function(r, s) {
      Xe(this, void 0, void 0, (function* () {
        if (!r.body || !r.headers) return;
        const o = r.body.getReader(), a = Number(r.headers.get("Content-Length")) || 0;
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
    })(i.clone(), e), i.blob();
  }));
} };
function Ie(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, n.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (n.add(i), () => n.delete(i)) };
}
function Cn(t, e) {
  const n = Ie(t());
  return e.forEach(((i) => i.subscribe((() => {
    const r = t();
    Object.is(n.value, r) || n.set(r);
  })))), { get value() {
    return n.value;
  }, subscribe: (i) => n.subscribe(i) };
}
function un(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
class Bb extends $i {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Ie(!1), this._currentTime = Ie(0), this._duration = Ie(0), this._volume = Ie(this.media.volume), this._muted = Ie(this.media.muted), this._playbackRate = Ie(this.media.playbackRate || 1), this._seeking = Ie(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
  onMediaEvent(e, n, i) {
    return this.media.addEventListener(e, n, i), () => this.media.removeEventListener(e, n, i);
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
  setSrc(e, n) {
    const i = this.getSrc();
    if (e && i === e) return;
    this.revokeSrc();
    const r = n instanceof Blob && (this.canPlayType(n.type) || !e) ? URL.createObjectURL(n) : e;
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
    this.reactiveMediaEventCleanups.forEach(((n) => n())), this.reactiveMediaEventCleanups = [], this.media = e, this.setupReactiveMediaEvents();
  }
  play() {
    return Xe(this, void 0, void 0, (function* () {
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
  setPlaybackRate(e, n) {
    n != null && (this.media.preservesPitch = n), this.media.playbackRate = e;
  }
  getMediaElement() {
    return this.media;
  }
  setSinkId(e) {
    return this.media.setSinkId(e);
  }
}
function Fb({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: r = 0, barAlign: s }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < r && (a = r, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function zb({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: r }) {
  return t === "top" ? 0 : t === "bottom" ? r - i : e - n;
}
function Ka(t, e, n) {
  const i = e - t.left, r = n - t.top;
  return [i / t.width, r / t.height];
}
function Cu(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Ga(t, e) {
  if (!Cu(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function Xa({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, r = Math.floor(i * n);
  return [r - 1, r, r + 1];
}
function Eu(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Nb(t) {
  const e = Ie({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Cn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), i = Cn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), r = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", r, { passive: !0 }), { scrollData: e, percentages: n, bounds: i, cleanup: () => {
    t.removeEventListener("scroll", r), Eu(e);
  } };
}
class qb extends $i {
  constructor(e, n) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [r, s] = this.initHtml();
    i.appendChild(r), this.container = r, this.scrollContainer = s.querySelector(".scroll"), this.wrapper = s.querySelector(".wrapper"), this.canvasWrapper = s.querySelector(".canvases"), this.progressWrapper = s.querySelector(".progress"), this.cursor = s.querySelector(".cursor"), n && s.appendChild(n), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let n;
    if (typeof e == "string" ? n = document.querySelector(e) : e instanceof HTMLElement && (n = e), !n) throw new Error("Container not found");
    return n;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Ka(i, n.clientX, n.clientY);
      this.emit("click", r, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Ka(i, n.clientX, n.clientY);
      this.emit("dblclick", r, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Nb(this.scrollContainer);
    const e = un((() => {
      const { startX: n, endX: i } = this.scrollStream.percentages.value, { left: r, right: s } = this.scrollStream.bounds.value;
      this.emit("scroll", n, i, r, s);
    }), [this.scrollStream.percentages, this.scrollStream.bounds]);
    if (this.subscriptions.push(e), typeof ResizeObserver == "function") {
      const n = this.createDelay(100);
      this.resizeObserver = new ResizeObserver((() => {
        n().then((() => this.onContainerResize())).catch((() => {
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
    this.dragStream = (function(n, i = {}) {
      const { threshold: r = 3, mouseButton: s = 0, touchDelay: o = 100 } = i, a = Ie(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (p) => {
        if (p.button !== s || (l.set(p.pointerId, p), l.size > 1)) return;
        let f = p.clientX, h = p.clientY, m = !1;
        const y = Date.now(), C = n.getBoundingClientRect(), { left: _, top: b } = C, g = (T) => {
          if (T.defaultPrevented || l.size > 1 || c && Date.now() - y < o) return;
          const A = T.clientX, L = T.clientY, P = A - f, V = L - h;
          (m || Math.abs(P) > r || Math.abs(V) > r) && (T.preventDefault(), T.stopPropagation(), m || (a.set({ type: "start", x: f - _, y: h - b }), m = !0), a.set({ type: "move", x: A - _, y: L - b, deltaX: P, deltaY: V }), f = A, h = L);
        }, E = (T) => {
          if (l.delete(T.pointerId), m) {
            const A = T.clientX, L = T.clientY;
            a.set({ type: "end", x: A - _, y: L - b });
          }
          u();
        }, k = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || E(T);
        }, x = (T) => {
          m && (T.stopPropagation(), T.preventDefault());
        }, M = (T) => {
          T.defaultPrevented || l.size > 1 || m && T.preventDefault();
        };
        document.addEventListener("pointermove", g), document.addEventListener("pointerup", E), document.addEventListener("pointerout", k), document.addEventListener("pointercancel", k), document.addEventListener("touchmove", M, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", g), document.removeEventListener("pointerup", E), document.removeEventListener("pointerout", k), document.removeEventListener("pointercancel", k), document.removeEventListener("touchmove", M), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), Eu(a);
      } };
    })(this.wrapper);
    const e = un((() => {
      const n = this.dragStream.signal.value;
      if (!n) return;
      const i = this.wrapper.getBoundingClientRect().width, r = (s = n.x / i) < 0 ? 0 : s > 1 ? 1 : s;
      var s;
      n.type === "start" ? (this.isDragging = !0, this.emit("dragstart", r)) : n.type === "move" ? this.emit("drag", r) : n.type === "end" && (this.isDragging = !1, this.emit("dragend", r));
    }), [this.dragStream.signal]);
    this.subscriptions.push(e);
  }
  initHtml() {
    const e = document.createElement("div"), n = e.attachShadow({ mode: "open" }), i = this.options.cspNonce && typeof this.options.cspNonce == "string" ? this.options.cspNonce.replace(/"/g, "") : "";
    return n.innerHTML = `
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
    `, [e, n];
  }
  setOptions(e) {
    if (this.options.container !== e.container) {
      const n = this.parentFromOptionsContainer(e.container);
      n.appendChild(this.container), this.parent = n;
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
    const { scrollWidth: n } = this.scrollContainer, i = n * e;
    this.setScroll(i);
  }
  destroy() {
    var e;
    this.subscriptions.forEach(((n) => n())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), (e = this.unsubscribeOnScroll) === null || e === void 0 || e.forEach(((n) => n())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(e = 10) {
    let n, i;
    const r = () => {
      n && (clearTimeout(n), n = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(r), () => new Promise(((s, o) => {
      r(), i = o, n = setTimeout((() => {
        n = void 0, i = void 0, s();
      }), e);
    }));
  }
  getHeight(e, n) {
    var i;
    const r = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: c = 128 }) {
      if (s == null) return c;
      const u = Number(s);
      if (!isNaN(u)) return u;
      if (s === "auto") {
        const d = a || c;
        return o?.every(((p) => !p.overlay)) ? d / l : d;
      }
      return c;
    })({ optionsHeight: e, optionsSplitChannels: n, parentHeight: this.parent.clientHeight, numberOfChannels: r, defaultHeight: 128 });
  }
  convertColorValues(e, n) {
    return (function(i, r, s) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = s ?? o.height * r, c = a.createLinearGradient(0, 0, 0, l || r), u = 1 / (i.length - 1);
      return i.forEach(((d, p) => {
        c.addColorStop(p * u, d);
      })), c;
    })(e, this.getPixelRatio(), n?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: p } = (function({ width: h, height: m, length: y, options: C, pixelRatio: _ }) {
      const b = m / 2, g = C.barWidth ? C.barWidth * _ : 1, E = C.barGap ? C.barGap * _ : C.barWidth ? g / 2 : 0, k = g + E || 1;
      return { halfHeight: b, barWidth: g, barGap: E, barRadius: C.barRadius || 0, barMinHeight: C.barMinHeight ? C.barMinHeight * _ : 0, barIndexScale: y > 0 ? h / k / y : 0, barSpacing: k };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: h, barIndexScale: m, barSpacing: y, barWidth: C, halfHeight: _, vScale: b, canvasHeight: g, barAlign: E, barMinHeight: k }) {
      const x = h[0] || [], M = h[1] || x, T = x.length, A = [];
      let L = 0, P = 0, V = 0;
      for (let D = 0; D <= T; D++) {
        const K = Math.round(D * m);
        if (K > L) {
          const { topHeight: Q, totalHeight: we } = Fb({ maxTop: P, maxBottom: V, halfHeight: _, vScale: b, barMinHeight: k, barAlign: E }), $e = zb({ barAlign: E, halfHeight: _, topHeight: Q, totalHeight: we, canvasHeight: g });
          A.push({ x: L * y, y: $e, width: C, height: we }), L = K, P = 0, V = 0;
        }
        const re = Math.abs(x[D] || 0), Z = Math.abs(M[D] || 0);
        re > P && (P = re), Z > V && (V = Z);
      }
      return A;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: r, canvasHeight: o, barAlign: n.barAlign, barMinHeight: p });
    i.beginPath();
    for (const h of f) c && "roundRect" in i ? i.roundRect(h.x, h.y, h.width, h.height, c) : i.rect(h.x, h.y, h.width, h.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const p = u / 2, f = l[0] || [];
      return [f, l[1] || f].map(((h, m) => {
        const y = h.length, C = y ? c / y : 0, _ = p, b = m === 0 ? -1 : 1, g = [{ x: 0, y: _ }];
        let E = 0, k = 0;
        for (let x = 0; x <= y; x++) {
          const M = Math.round(x * C);
          if (M > E) {
            const A = _ + (Math.round(k * p * d) || 1) * b;
            g.push({ x: E, y: A }), E = M, k = 0;
          }
          const T = Math.abs(h[x] || 0);
          T > k && (k = T);
        }
        return g.push({ x: E, y: _ }), g;
      }));
    })({ channelData: e, width: s, height: o, vScale: r });
    i.beginPath();
    for (const l of a) if (l.length) {
      i.moveTo(l[0].x, l[0].y);
      for (let c = 1; c < l.length; c++) {
        const u = l[c];
        i.lineTo(u.x, u.y);
      }
    }
    i.fill(), i.closePath();
  }
  renderWaveform(e, n, i) {
    if (i.fillStyle = this.convertColorValues(n.waveColor, i), n.renderFunction) return void n.renderFunction(e, i);
    const r = (function({ channelData: s, barHeight: o, normalize: a, maxPeak: l }) {
      var c;
      const u = o || 1;
      if (!a) return u;
      const d = s[0];
      if (!d || d.length === 0) return u;
      let p = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const h = (c = d[f]) !== null && c !== void 0 ? c : 0, m = Math.abs(h);
        m > p && (p = m);
      }
      return p ? u / p : u;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    Cu(n) ? this.renderBarWaveform(e, n, i, r) : this.renderLineWaveform(e, n, i, r);
  }
  renderSingleCanvas(e, n, i, r, s, o, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(i * l), c.height = Math.round(r * l), c.style.width = `${i}px`, c.style.height = `${r}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (n.renderFunction ? (u.fillStyle = this.convertColorValues(n.waveColor, u), n.renderFunction(e, u)) : this.renderWaveform(e, n, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), p = d.getContext("2d");
      p.drawImage(c, 0, 0), p.globalCompositeOperation = "source-in", p.fillStyle = this.convertColorValues(n.progressColor, p), p.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, i, r, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = i / a, u = (function({ clientWidth: h, totalWidth: m, options: y }) {
      return Ga(Math.min(8e3, h, m), y);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const p = (h) => {
      if (h < 0 || h >= f || d[h]) return;
      d[h] = !0;
      const m = h * u;
      let y = Math.min(c - m, u);
      if (y = Ga(y, n), y <= 0) return;
      const C = (function({ channelData: _, offset: b, clampedWidth: g, totalWidth: E }) {
        return _.map(((k) => {
          const x = Math.floor(b / E * k.length), M = Math.floor((b + g) / E * k.length);
          return k.slice(x, M);
        }));
      })({ channelData: e, offset: m, clampedWidth: y, totalWidth: c });
      this.renderSingleCanvas(C, n, y, r, m, s, o);
    }, f = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < f; h++) p(h);
      return;
    }
    if (Xa({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: f }).forEach(((h) => p(h))), f > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Xa({ scrollLeft: m, totalWidth: c, numCanvases: f }).forEach(((y) => p(y)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, n, i, r) {
    var { overlay: s } = n, o = (function(u, d) {
      var p = {};
      for (var f in u) Object.prototype.hasOwnProperty.call(u, f) && d.indexOf(f) < 0 && (p[f] = u[f]);
      if (u != null && typeof Object.getOwnPropertySymbols == "function") {
        var h = 0;
        for (f = Object.getOwnPropertySymbols(u); h < f.length; h++) d.indexOf(f[h]) < 0 && Object.prototype.propertyIsEnumerable.call(u, f[h]) && (p[f[h]] = u[f[h]]);
      }
      return p;
    })(n, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, s && r > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, i, l, a, c);
  }
  render(e) {
    return Xe(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), r = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: p, pixelRatio: f }) {
        const h = Math.ceil(c * u), m = h > d, y = !!(p && !m);
        return { scrollWidth: h, isScrollable: m, useParentWidth: y, width: (y ? d : h) * f };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: r, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let c = 0; c < e.numberOfChannels; c++) {
        const u = Object.assign(Object.assign({}, this.options), (n = this.options.splitChannels) === null || n === void 0 ? void 0 : n[c]);
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
    if (this.unsubscribeOnScroll.forEach(((i) => i())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: n } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: i } = this.progressWrapper.getBoundingClientRect(), r = (function(s) {
        const o = 2 * s;
        return (o < 0 ? Math.floor(o) : Math.ceil(o)) / 2;
      })(i - n);
      this.scrollContainer.scrollLeft += r;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, n = !1) {
    const { scrollLeft: i, scrollWidth: r, clientWidth: s } = this.scrollContainer, o = e * r, a = i, l = i + s, c = s / 2;
    if (this.isDragging)
      o + 30 > l ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > l) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? c : 0));
      const u = o - i - c;
      n && this.options.autoCenter && u > 0 && (this.scrollContainer.scrollLeft += u);
    }
  }
  renderProgress(e, n) {
    if (isNaN(e)) return;
    const i = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${i}% 0%, 100% 0%, 100% 100%, ${i}% 100%)`, this.progressWrapper.style.width = `${i}%`, this.cursor.style.left = `${i}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, n);
  }
  exportImage(e, n, i) {
    return Xe(this, void 0, void 0, (function* () {
      const r = this.canvasWrapper.querySelectorAll("canvas");
      if (!r.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const s = Array.from(r).map(((o) => o.toDataURL(e, n)));
        return Promise.resolve(s);
      }
      return Promise.all(Array.from(r).map(((s) => new Promise(((o, a) => {
        s.toBlob(((l) => {
          l ? o(l) : a(new Error("Could not export image"));
        }), e, n);
      })))));
    }));
  }
}
class Hb extends $i {
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
class gs extends $i {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Xe(this, void 0, void 0, (function* () {
    }));
  }
  get src() {
    return this.currentSrc;
  }
  set src(e) {
    if (this.currentSrc = e, this._duration = void 0, !e) return this.buffer = null, void this.emit("emptied");
    fetch(e).then(((n) => {
      if (n.status >= 400) throw new Error(`Failed to fetch ${e}: ${n.status} (${n.statusText})`);
      return n.arrayBuffer();
    })).then(((n) => this.currentSrc !== e ? null : this.audioContext.decodeAudioData(n))).then(((n) => {
      this.currentSrc === e && (this.buffer = n, this.emit("loadedmetadata"), this.emit("canplay"), this.autoplay && this.play());
    })).catch(((n) => {
      console.error("WebAudioPlayer load error:", n);
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
    return Xe(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(e) {
    const n = e - this.currentTime, i = this.bufferNode;
    i?.stop(this.audioContext.currentTime + n), i?.addEventListener("ended", (() => {
      i === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: !0 });
  }
  setSinkId(e) {
    return Xe(this, void 0, void 0, (function* () {
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
    const n = !this.paused;
    n && this._pause(), this.playedDuration = e / this._playbackRate, n && this._play(), this.emit("seeking"), this.emit("timeupdate");
  }
  get duration() {
    var e, n;
    return (e = this._duration) !== null && e !== void 0 ? e : ((n = this.buffer) === null || n === void 0 ? void 0 : n.duration) || 0;
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
    const n = this.buffer.numberOfChannels;
    for (let i = 0; i < n; i++) e.push(this.buffer.getChannelData(i));
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
const Vb = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ai extends Bb {
  static create(e) {
    return new Ai(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new gs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Vb, e);
    const { state: i, actions: r } = (function(a) {
      var l, c, u, d, p, f;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Ie(0), m = (c = a?.duration) !== null && c !== void 0 ? c : Ie(0), y = (u = a?.isPlaying) !== null && u !== void 0 ? u : Ie(!1), C = (d = a?.isSeeking) !== null && d !== void 0 ? d : Ie(!1), _ = (p = a?.volume) !== null && p !== void 0 ? p : Ie(1), b = (f = a?.playbackRate) !== null && f !== void 0 ? f : Ie(1), g = Ie(null), E = Ie(null), k = Ie(""), x = Ie(0), M = Ie(0), T = Cn((() => !y.value), [y]), A = Cn((() => g.value !== null), [g]), L = Cn((() => A.value && m.value > 0), [A, m]), P = Cn((() => h.value), [h]), V = Cn((() => m.value > 0 ? h.value / m.value : 0), [h, m]);
      return { state: { currentTime: h, duration: m, isPlaying: y, isPaused: T, isSeeking: C, volume: _, playbackRate: b, audioBuffer: g, peaks: E, url: k, zoom: x, scrollPosition: M, canPlay: A, isReady: L, progress: P, progressPercent: V }, actions: { setCurrentTime: (D) => {
        const K = Math.max(0, Math.min(m.value || 1 / 0, D));
        h.set(K);
      }, setDuration: (D) => {
        m.set(Math.max(0, D));
      }, setPlaying: (D) => {
        y.set(D);
      }, setSeeking: (D) => {
        C.set(D);
      }, setVolume: (D) => {
        const K = Math.max(0, Math.min(1, D));
        _.set(K);
      }, setPlaybackRate: (D) => {
        const K = Math.max(0.1, Math.min(16, D));
        b.set(K);
      }, setAudioBuffer: (D) => {
        g.set(D), D && m.set(D.duration);
      }, setPeaks: (D) => {
        E.set(D);
      }, setUrl: (D) => {
        k.set(D);
      }, setZoom: (D) => {
        x.set(Math.max(0, D));
      }, setScrollPosition: (D) => {
        M.set(Math.max(0, D));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new Hb();
    const s = n ? void 0 : this.getMediaElement();
    this.renderer = new qb(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
    this.reactiveCleanups.push((function(e, n) {
      const i = [];
      i.push(un((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(un((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(un((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(un((() => {
        e.isReady.value && !r && (r = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(un((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && n.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(un((() => {
        const o = e.zoom.value;
        o > 0 && n.emit("zoom", o);
      }), [e.zoom])), () => {
        i.forEach(((o) => o()));
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
    this.subscriptions.push(this.renderer.on("click", ((e, n) => {
      this.options.interact && (this.seekTo(e), this.emit("interaction", e * this.getDuration()), this.emit("click", e, n));
    })), this.renderer.on("dblclick", ((e, n) => {
      this.emit("dblclick", e, n);
    })), this.renderer.on("scroll", ((e, n, i, r) => {
      const s = this.getDuration();
      this.emit("scroll", e * s, n * s, i, r);
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
      const n = this.renderer.on("drag", ((i) => {
        var r;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let s = 0;
        const o = this.options.dragToSeek;
        this.isPlaying() ? s = 0 : o === !0 ? s = 200 : o && typeof o == "object" && (s = (r = o.debounceTime) !== null && r !== void 0 ? r : 200), e = setTimeout((() => {
          this.seekTo(i);
        }), s), this.emit("interaction", i * this.getDuration()), this.emit("drag", i);
      }));
      this.subscriptions.push((() => {
        clearTimeout(e), n();
      }));
    }
  }
  initPlugins() {
    var e;
    !((e = this.options.plugins) === null || e === void 0) && e.length && this.options.plugins.forEach(((n) => {
      this.registerPlugin(n);
    }));
  }
  unsubscribePlayerEvents() {
    this.mediaSubscriptions.forEach(((e) => e())), this.mediaSubscriptions = [];
  }
  setOptions(e) {
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Wi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Wi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
  }
  registerPlugin(e) {
    if (this.plugins.includes(e)) return e;
    e._init(this), this.plugins.push(e);
    const n = e.once("destroy", (() => {
      this.plugins = this.plugins.filter(((i) => i !== e)), this.subscriptions = this.subscriptions.filter(((i) => i !== n));
    }));
    return this.subscriptions.push(n), e;
  }
  unregisterPlugin(e) {
    this.plugins = this.plugins.filter(((n) => n !== e)), e.destroy();
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
    const n = e / this.getDuration();
    this.renderer.setScrollPercentage(n);
  }
  getActivePlugins() {
    return this.plugins;
  }
  loadAudio(e, n, i, r) {
    return Xe(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !n && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        n = yield $b.fetchBlob(e, l, a);
        const c = this.options.blobMimeType;
        c && (n = new Blob([n], { type: c }));
      }
      this.setSrc(e, n);
      const o = yield new Promise(((a) => {
        const l = r || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !n) {
        const a = this.getMediaElement();
        a instanceof gs && (a.duration = o);
      }
      if (i) this.decodedData = Wi.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield Wi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, n, i) {
    return Xe(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, n, i);
      } catch (r) {
        throw this.emit("error", r), r;
      }
    }));
  }
  loadBlob(e, n, i) {
    return Xe(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, n, i);
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
  exportPeaks({ channels: e = 2, maxLength: n = 8e3, precision: i = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const r = Math.min(e, this.decodedData.numberOfChannels), s = [];
    for (let o = 0; o < r; o++) {
      const a = this.decodedData.getChannelData(o), l = [], c = a.length / n;
      for (let u = 0; u < n; u++) {
        const d = a.slice(Math.floor(u * c), Math.ceil((u + 1) * c));
        let p = 0;
        for (let f = 0; f < d.length; f++) {
          const h = d[f];
          Math.abs(h) > Math.abs(p) && (p = h);
        }
        l.push(Math.round(p * i) / i);
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
    const n = this.getDuration() * e;
    this.setTime(n);
  }
  play(e, n) {
    const i = Object.create(null, { play: { get: () => super.play } });
    return Xe(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const r = yield i.play.call(this);
      return n != null && (this.media instanceof gs ? this.media.stopAt(n) : this.stopAtPosition = n), r;
    }));
  }
  playPause() {
    return Xe(this, void 0, void 0, (function* () {
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
    return Xe(this, arguments, void 0, (function* (e = "image/png", n = 1, i = "dataURL") {
      return this.renderer.exportImage(e, n, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((n) => n.destroy())), this.subscriptions.forEach(((n) => n())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((n) => n())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Ai.BasePlugin = class extends $i {
  constructor(t) {
    super(), this.subscriptions = [], this.isDestroyed = !1, this.options = t;
  }
  onInit() {
  }
  _init(t) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = !1), this.wavesurfer = t, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((t) => t())), this.subscriptions = [], this.isDestroyed = !0, this.wavesurfer = void 0;
  }
}, Ai.dom = Db;
class ku {
  constructor() {
    this.listeners = {};
  }
  on(e, n, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...s) => {
        this.un(e, r), n(...s);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
    }
    return this.listeners[e].add(n), () => this.un(e, n);
  }
  un(e, n) {
    var i;
    (i = this.listeners[e]) === null || i === void 0 || i.delete(n);
  }
  once(e, n) {
    return this.on(e, n, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...n) {
    this.listeners[e] && this.listeners[e].forEach(((i) => i(...n)));
  }
}
class jb extends ku {
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
function Tu(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Tu(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function ai(t, e, n) {
  const i = Tu(t, e || {});
  return n?.appendChild(i), i;
}
function Au(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, n.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (n.add(i), () => n.delete(i)) };
}
function er(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
function $n(t, e) {
  const n = Au(null), i = (r) => {
    n.set(r);
  };
  return t.addEventListener(e, i), n._cleanup = () => {
    t.removeEventListener(e, i);
  }, n;
}
function xn(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function tr(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, s = Au(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== i || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, p = u.clientY, f = !1;
    const h = Date.now(), m = t.getBoundingClientRect(), { left: y, top: C } = m, _ = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - h < r) return;
      const M = x.clientX, T = x.clientY, A = M - d, L = T - p;
      (f || Math.abs(A) > n || Math.abs(L) > n) && (x.preventDefault(), x.stopPropagation(), f || (s.set({ type: "start", x: d - y, y: p - C }), f = !0), s.set({ type: "move", x: M - y, y: T - C, deltaX: A, deltaY: L }), d = M, p = T);
    }, b = (x) => {
      if (o.delete(x.pointerId), f) {
        const M = x.clientX, T = x.clientY;
        s.set({ type: "end", x: M - y, y: T - C });
      }
      l();
    }, g = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || b(x);
    }, E = (x) => {
      f && (x.stopPropagation(), x.preventDefault());
    }, k = (x) => {
      x.defaultPrevented || o.size > 1 || f && x.preventDefault();
    };
    document.addEventListener("pointermove", _), document.addEventListener("pointerup", b), document.addEventListener("pointerout", g), document.addEventListener("pointercancel", g), document.addEventListener("touchmove", k, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", b), document.removeEventListener("pointerout", g), document.removeEventListener("pointercancel", g), document.removeEventListener("touchmove", k), setTimeout((() => {
        document.removeEventListener("click", E, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), o.clear(), xn(s);
  } };
}
class Ya extends ku {
  constructor(e, n, i = 0) {
    var r, s, o, a, l, c, u, d, p, f;
    super(), this.totalDuration = n, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (p = e.channelIdx) !== null && p !== void 0 ? p : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
  }
  clampPosition(e) {
    return Math.max(0, Math.min(this.totalDuration, e));
  }
  setPart() {
    var e;
    const n = this.start === this.end;
    (e = this.element) === null || e === void 0 || e.setAttribute("part", `${n ? "marker" : "region"} ${this.id}`);
  }
  addResizeHandles(e) {
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ai("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = ai("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = tr(i, { threshold: 1 }), o = tr(r, { threshold: 1 }), a = er((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = er((() => {
      const c = o.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "end") : c.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), l(), s.cleanup(), o.cleanup();
    }));
  }
  removeResizeHandles(e) {
    const n = e.querySelector('[part*="region-handle-left"]'), i = e.querySelector('[part*="region-handle-right"]');
    n && e.removeChild(n), i && e.removeChild(i);
  }
  initElement() {
    if (this.isRemoved) return null;
    const e = this.start === this.end;
    let n = 0, i = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (i = 100 / this.numberOfChannels, n = i * this.channelIdx);
    const r = ai("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(r), r;
  }
  renderPosition() {
    if (!this.element) return;
    const e = this.start / this.totalDuration, n = (this.totalDuration - this.end) / this.totalDuration;
    this.element.style.left = 100 * e + "%", this.element.style.right = 100 * n + "%";
  }
  toggleCursor(e) {
    var n;
    this.drag && (!((n = this.element) === null || n === void 0) && n.style) && (this.element.style.cursor = e ? "grabbing" : "grab");
  }
  initMouseEvents() {
    const { element: e } = this;
    if (!e) return;
    const n = $n(e, "click"), i = $n(e, "mouseenter"), r = $n(e, "mouseleave"), s = $n(e, "dblclick"), o = $n(e, "pointerdown"), a = $n(e, "pointerup"), l = n.subscribe(((y) => y && this.emit("click", y))), c = i.subscribe(((y) => y && this.emit("over", y))), u = r.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), p = o.subscribe(((y) => y && this.toggleCursor(!0))), f = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), p(), f(), xn(n), xn(i), xn(r), xn(s), xn(o), xn(a);
    }));
    const h = tr(e), m = er((() => {
      const y = h.signal.value;
      y && (y.type === "start" ? this.toggleCursor(!0) : y.type === "move" && y.deltaX !== void 0 ? this.onMove(y.deltaX) : y.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      m(), h.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (y) => this.onContentClick(y), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, n, i) {
    var r;
    if (!(!((r = this.element) === null || r === void 0) && r.parentElement)) return;
    const { width: s } = this.element.parentElement.getBoundingClientRect(), o = e / s * this.totalDuration;
    let a = n && n !== "start" ? this.start : this.start + o, l = n && n !== "end" ? this.end : this.end + o;
    const c = i !== void 0;
    c && this.updatingSide && this.updatingSide !== n && (this.updatingSide === "start" ? a = i : l = i), a = Math.max(0, a), l = Math.min(this.totalDuration, l);
    const u = l - a;
    this.updatingSide = n;
    const d = u >= this.minLength && u <= this.maxLength;
    a <= l && (d || c) && (this.start = a, this.end = l, this.renderPosition(), this.emit("update", n));
  }
  onMove(e) {
    this.drag && this._onUpdate(e);
  }
  onResize(e, n) {
    this.resize && (this.resizeStart || n !== "start") && (this.resizeEnd || n !== "end") && this._onUpdate(e, n);
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
    var n;
    return e ? this.content || void 0 : this.element instanceof HTMLElement ? ((n = this.content) === null || n === void 0 ? void 0 : n.innerHTML) || void 0 : "";
  }
  setContent(e) {
    var n;
    if (this.element) if (this.content && this.contentEditable && (this.contentClickListener && this.content.removeEventListener("click", this.contentClickListener), this.contentBlurListener && this.content.removeEventListener("blur", this.contentBlurListener)), (n = this.content) === null || n === void 0 || n.remove(), e) {
      if (typeof e == "string") {
        const i = this.start === this.end;
        this.content = ai("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (i) => this.onContentClick(i), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var n, i;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const r = this.start === this.end;
        this.start = this.clampPosition((n = e.start) !== null && n !== void 0 ? n : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : r ? this.start : this.end), this.renderPosition(), this.setPart();
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
class xo extends jb {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new xo(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((n) => {
      this.regions.forEach(((i) => i._setTotalDuration(n)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((n) => {
      const i = this.regions.filter(((r) => r.start <= n && (r.end === r.start ? r.start + 0.05 : r.end) >= n));
      i.forEach(((r) => {
        e.includes(r) || this.emit("region-in", r);
      })), e.forEach(((r) => {
        i.includes(r) || this.emit("region-out", r);
      })), e = i;
    })));
  }
  initRegionsContainer() {
    return ai("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const n = e.content, i = n.getBoundingClientRect(), r = this.regions.map(((s) => {
        if (s === e || !s.content) return 0;
        const o = s.content.getBoundingClientRect();
        return i.left < o.left + o.width && o.left < i.left + i.width ? o.height : 0;
      })).reduce(((s, o) => s + o), 0);
      n.style.marginTop = `${r}px`;
    }), 10);
  }
  adjustScroll(e) {
    var n, i;
    if (!e.element) return;
    const r = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!r) return;
    const { clientWidth: s, scrollWidth: o } = r;
    if (o <= s) return;
    const a = r.getBoundingClientRect(), l = e.element.getBoundingClientRect(), c = l.left - a.left, u = l.right - a.left;
    c < 0 ? r.scrollLeft += c : u > s && (r.scrollLeft += u - s);
  }
  virtualAppend(e, n, i) {
    const r = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = n.clientWidth, l = this.wavesurfer.getDuration(), c = Math.round(e.start / l * a), u = c + (Math.round((e.end - e.start) / l * a) || 1) > o && c < o + s;
      u && !i.parentElement ? n.appendChild(i) : !u && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      r();
      const s = this.wavesurfer.on("scroll", r), o = this.wavesurfer.on("zoom", r), a = this.wavesurfer.on("resize", r);
      this.subscriptions.push(s, o, a), e.once("remove", (() => {
        s(), o(), a();
      }));
    }), 0);
  }
  saveRegion(e) {
    if (!e.element) return;
    this.virtualAppend(e, this.regionsContainer, e.element), this.avoidOverlapping(e), this.regions.push(e);
    const n = [e.on("update", ((i) => {
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
      n.forEach(((i) => i())), this.regions = this.regions.filter(((i) => i !== e)), this.emit("region-removed", e);
    }))];
    this.subscriptions.push(...n), this.emit("region-created", e);
  }
  addRegion(e) {
    var n, i;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const r = this.wavesurfer.getDuration(), s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Ya(e, r, s);
    return this.emit("region-initialized", o), r ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      o._setTotalDuration(a), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, n = 3) {
    var i;
    const r = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(r && r instanceof HTMLElement)) return () => {
    };
    let s = null, o = 0, a = 0;
    const l = tr(r, { threshold: n }), c = er((() => {
      var u, d;
      const p = l.signal.value;
      if (p) if (p.type === "start") {
        if (o = p.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const y = p.x / m * f, C = (p.x + 5) / m * f;
        s = new Ya(Object.assign(Object.assign({}, e), { start: y, end: C }), f, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else p.type === "move" && p.deltaX !== void 0 ? s && s._onUpdate(p.deltaX, p.x > o ? "end" : "start", a) : p.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
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
const ys = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Wb(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: r } = t, s = /* @__PURE__ */ dn(null), o = /* @__PURE__ */ dn(null), a = /* @__PURE__ */ z(0), l = /* @__PURE__ */ z(0), c = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(!1), p = /* @__PURE__ */ z(1), f = /* @__PURE__ */ z(1), h = /* @__PURE__ */ z(!1), m = R(() => Ei(a.value)), y = R(() => Ei(l.value));
  function C(D, K) {
    P(), d.value = !0, u.value = !1;
    const re = xo.create();
    o.value = re;
    const Z = Ai.create({
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
      renderFunction: Up,
      url: K,
      plugins: [re]
    });
    Z.on("ready", () => {
      u.value = !0, d.value = !1, l.value = Z.getDuration(), _();
    }), Z.on("timeupdate", (Q) => {
      a.value = Q;
    }), Z.on("play", () => {
      c.value = !0;
    }), Z.on("pause", () => {
      c.value = !1;
    }), Z.on("finish", () => {
      c.value = !1;
    }), s.value = Z;
  }
  function _() {
    const D = o.value;
    if (D) {
      D.clearRegions();
      for (const K of i.value) {
        const re = K.speakerId ? r.value.get(K.speakerId) : void 0;
        if (!re || K.startTime == null || K.endTime == null) continue;
        const Z = re.color;
        D.addRegion({
          start: K.startTime,
          end: K.endTime,
          color: Hp(Z, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Z);
      }
    }
  }
  function b() {
    s.value?.play();
  }
  function g() {
    s.value?.pause();
  }
  function E() {
    s.value?.playPause();
  }
  function k(D) {
    const K = s.value;
    !K || l.value === 0 || K.setTime(D);
  }
  function x(D) {
    k(Math.max(0, Math.min(a.value + D, l.value)));
  }
  function M(D) {
    const K = s.value;
    K && (p.value = D, K.setVolume(D), D > 0 && h.value && (h.value = !1, K.setMuted(!1)));
  }
  function T() {
    const D = s.value;
    D && (h.value = !h.value, D.setMuted(h.value));
  }
  function A(D) {
    const K = s.value;
    K && (f.value = D, K.setPlaybackRate(D));
  }
  function L() {
    const K = (ys.indexOf(
      f.value
    ) + 1) % ys.length;
    A(ys[K] ?? 1);
  }
  function P() {
    V !== null && (clearTimeout(V), V = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  ye(
    [e, n],
    ([D, K]) => {
      D && K && C(D, K);
    },
    { immediate: !0 }
  );
  let V = null;
  return ye([i, r], () => {
    u.value && (V !== null && clearTimeout(V), V = setTimeout(() => {
      V = null, _();
    }, 150));
  }), hn(() => {
    P();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: p,
    playbackRate: f,
    isMuted: h,
    formattedCurrentTime: m,
    formattedDuration: y,
    play: b,
    pause: g,
    togglePlay: E,
    seekTo: k,
    skip: x,
    setVolume: M,
    setPlaybackRate: A,
    cyclePlaybackRate: L,
    toggleMute: T
  };
}
const Ub = { class: "audio-player" }, Kb = /* @__PURE__ */ X({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, r = n, s = /* @__PURE__ */ z(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: p,
      formattedCurrentTime: f,
      formattedDuration: h,
      togglePlay: m,
      seekTo: y,
      pause: C,
      skip: _,
      setVolume: b,
      cyclePlaybackRate: g,
      toggleMute: E
    } = Wb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ Ki(() => i.audioSrc),
      turns: /* @__PURE__ */ Ki(() => i.turns),
      speakers: /* @__PURE__ */ Ki(() => i.speakers)
    });
    return ye(p, (k) => r("timeupdate", k)), ye(o, (k) => r("playStateChange", k)), e({ seekTo: y, pause: C }), (k, x) => (O(), oe("footer", Ub, [
      ie("div", {
        ref_key: "waveformRef",
        ref: s,
        class: $t(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      H(Lb, {
        "is-playing": v(o),
        "current-time": v(f),
        duration: v(h),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: x[0] || (x[0] = (M) => v(_)(-10)),
        onSkipForward: x[1] || (x[1] = (M) => v(_)(10)),
        "onUpdate:volume": v(b),
        onToggleMute: v(E),
        onCyclePlaybackRate: v(g)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Gb = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", Xb = /* @__PURE__ */ Oe(Kb, [["styles", [Gb]], ["__scopeId", "data-v-9248e45e"]]);
class Yb {
  diff(e, n, i = {}) {
    let r;
    typeof i == "function" ? (r = i, i = {}) : "callback" in i && (r = i.callback);
    const s = this.castInput(e, i), o = this.castInput(n, i), a = this.removeEmpty(this.tokenize(s, i)), l = this.removeEmpty(this.tokenize(o, i));
    return this.diffWithOptionsObj(a, l, i, r);
  }
  diffWithOptionsObj(e, n, i, r) {
    var s;
    const o = (_) => {
      if (_ = this.postProcess(_, i), r) {
        setTimeout(function() {
          r(_);
        }, 0);
        return;
      } else
        return _;
    }, a = n.length, l = e.length;
    let c = 1, u = a + l;
    i.maxEditLength != null && (u = Math.min(u, i.maxEditLength));
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, p = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(f[0], n, e, 0, i);
    if (f[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, n, e));
    let m = -1 / 0, y = 1 / 0;
    const C = () => {
      for (let _ = Math.max(m, -c); _ <= Math.min(y, c); _ += 2) {
        let b;
        const g = f[_ - 1], E = f[_ + 1];
        g && (f[_ - 1] = void 0);
        let k = !1;
        if (E) {
          const M = E.oldPos - _;
          k = E && 0 <= M && M < a;
        }
        const x = g && g.oldPos + 1 < l;
        if (!k && !x) {
          f[_] = void 0;
          continue;
        }
        if (!x || k && g.oldPos < E.oldPos ? b = this.addToPath(E, !0, !1, 0, i) : b = this.addToPath(g, !1, !0, 1, i), h = this.extractCommon(b, n, e, _, i), b.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(b.lastComponent, n, e)) || !0;
        f[_] = b, b.oldPos + 1 >= l && (y = Math.min(y, _ - 1)), h + 1 >= a && (m = Math.max(m, _ + 1));
      }
      c++;
    };
    if (r)
      (function _() {
        setTimeout(function() {
          if (c > u || Date.now() > p)
            return r(void 0);
          C() || _();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= p; ) {
        const _ = C();
        if (_)
          return _;
      }
  }
  addToPath(e, n, i, r, s) {
    const o = e.lastComponent;
    return o && !s.oneChangePerToken && o.added === n && o.removed === i ? {
      oldPos: e.oldPos + r,
      lastComponent: { count: o.count + 1, added: n, removed: i, previousComponent: o.previousComponent }
    } : {
      oldPos: e.oldPos + r,
      lastComponent: { count: 1, added: n, removed: i, previousComponent: o }
    };
  }
  extractCommon(e, n, i, r, s) {
    const o = n.length, a = i.length;
    let l = e.oldPos, c = l - r, u = 0;
    for (; c + 1 < o && l + 1 < a && this.equals(i[l + 1], n[c + 1], s); )
      c++, l++, u++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return u && !s.oneChangePerToken && (e.lastComponent = { count: u, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, c;
  }
  equals(e, n, i) {
    return i.comparator ? i.comparator(e, n) : e === n || !!i.ignoreCase && e.toLowerCase() === n.toLowerCase();
  }
  removeEmpty(e) {
    const n = [];
    for (let i = 0; i < e.length; i++)
      e[i] && n.push(e[i]);
    return n;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(e, n) {
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(e, n) {
    return Array.from(e);
  }
  join(e) {
    return e.join("");
  }
  postProcess(e, n) {
    return e;
  }
  get useLongestToken() {
    return !1;
  }
  buildValues(e, n, i) {
    const r = [];
    let s;
    for (; e; )
      r.push(e), s = e.previousComponent, delete e.previousComponent, e = s;
    r.reverse();
    const o = r.length;
    let a = 0, l = 0, c = 0;
    for (; a < o; a++) {
      const u = r[a];
      if (u.removed)
        u.value = this.join(i.slice(c, c + u.count)), c += u.count;
      else {
        if (!u.added && this.useLongestToken) {
          let d = n.slice(l, l + u.count);
          d = d.map(function(p, f) {
            const h = i[c + f];
            return h.length > p.length ? h : p;
          }), u.value = this.join(d);
        } else
          u.value = this.join(n.slice(l, l + u.count));
        l += u.count, u.added || (c += u.count);
      }
    }
    return r;
  }
}
class Jb extends Yb {
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
const Zb = new Jb();
function Qb(t, e, n) {
  return Zb.diff(t, e, n);
}
function bs({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const r = t.split(" "), s = n.split(" "), o = Qb(r, s, {
    comparator: t0
  }), a = e0(o), l = [...e];
  let c = [...e], u = 0;
  for (const f of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      c = nr(
        c,
        l[0],
        f.countAdded - f.countRemoved
      ), u += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const h = f;
      u += h.count, c = nr(
        c,
        l[0],
        -h.count
      );
    } else if ("added" in f && f.added) {
      const h = f;
      c = nr(
        c,
        l[0],
        h.count
      );
    } else
      u += f.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, p = s.slice(d).join(" ");
  if (i(p)) {
    const h = Pu(
      p,
      i
    ).map(
      (m) => m + d
    );
    c = c.concat(h);
  }
  return {
    previousIndexes: c,
    previousText: n
  };
}
function e0(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (n + 1 < t.length) {
      const r = t[n + 1];
      if (r.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: r.added ?? !1,
          countRemoved: i.count,
          countAdded: r.count
        }), n++;
        continue;
      }
    }
    e.push(i);
  }
  return e;
}
function nr(t, e, n) {
  return t.map((i) => i >= e ? i + n : i);
}
function Pu(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let i;
  for (i = 0; i < n.length; i++) {
    const r = n.slice(0, i).join(" ");
    if (e(r)) break;
  }
  return [i - 1].concat(
    nr(
      Pu(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function t0(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(n.length, i.length);
  let s = 0;
  for (let a = 0; a < r; a++)
    n[a] === i[a] && s++;
  return s / n.length > 0.8;
}
class n0 {
  canvas;
  fontSize;
  lineHeight;
  color;
  font;
  paddingInline;
  isResizing = !1;
  resizeObserver;
  constructor(e, {
    fontSize: n = 40,
    lineHeight: i = 50,
    color: r = "white",
    font: s = "Arial",
    paddingInline: o = 100
  } = {}) {
    this.canvas = e, this.fontSize = n, this.lineHeight = i, this.color = r, this.font = s, this.paddingInline = o, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  setFontSize(e, n) {
    this.fontSize = e, this.lineHeight = n, this.resetDrawing(), this.onResize();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, n, i) {
    const r = this.canvas.getContext("2d");
    r.font = `${this.fontSize}px ${this.font}`, r.fillStyle = this.color, r.fillText(e, n + this.paddingInline, i);
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
class i0 extends n0 {
  currentState = { previousText: "", previousIndexes: [] };
  previousState = { previousText: "", previousIndexes: [] };
  constructor(e, n) {
    super(e, n);
  }
  resetAll() {
    this.currentState = { previousText: "", previousIndexes: [] }, this.previousState = { previousText: "", previousIndexes: [] };
  }
  onResize() {
    const e = this.currentState.previousText;
    this.resetAll(), this.currentState = bs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = bs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = bs(
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
    let e = "", n = "";
    this.currentState.previousIndexes.length === 0 ? (e = this.getLastLineOfState(this.previousState), n = this.currentState.previousText) : (e = this.getSecondLastLineOfState(this.currentState), n = this.getLastLineOfState(this.currentState)), this.drawFirstLine(e), this.drawSecondLine(n);
  }
  getLastLineOfState(e) {
    if (e.previousIndexes.length === 0) return e.previousText;
    const n = e.previousIndexes[e.previousIndexes.length - 1];
    return e.previousText.split(" ").slice(n).join(" ");
  }
  getSecondLastLineOfState(e) {
    if (e.previousIndexes.length === 0) return "";
    const n = e.previousIndexes[e.previousIndexes.length - 1];
    let i = 0;
    return e.previousIndexes.length > 1 && (i = e.previousIndexes[e.previousIndexes.length - 2]), e.previousText.split(" ").slice(i, n).join(" ");
  }
  computeIfTextIsTooLong(e) {
    const n = this.canvas.getContext("2d");
    n.font = `${this.fontSize}px ${this.font}`;
    const i = this.canvas.width - 2 * this.paddingInline;
    return n.measureText(e).width > i;
  }
}
function Ou(t) {
  const e = Mn();
  let n = null;
  De(() => {
    t.canvasRef.value && (n = new i0(t.canvasRef.value, {
      fontSize: t.fontSize.value,
      lineHeight: t.lineHeight.value
    }));
  }), ye([t.fontSize, t.lineHeight], ([l, c]) => {
    n && n.setFontSize(l, c);
  }), ye(
    () => e.live?.partial.value,
    (l) => {
      l && n && n.newPartial(l);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: l }) => {
    if (!n) return;
    const c = l.words.length > 0 ? l.words.map((u) => u.text).join(" ") : l.text ?? "";
    c && n.newFinal(c);
  });
  function r() {
    n && (n.resetDrawing(), n.resetAll());
  }
  const s = e.on("translation:change", r), o = e.on("translation:sync", r), a = e.on("channel:sync", r);
  vn(() => {
    i(), s(), o(), a(), n?.dispose(), n = null;
  });
}
const r0 = ["height"], s0 = /* @__PURE__ */ X({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Mn(), n = _i("canvas"), i = R(() => e.subtitle?.fontSize.value ?? 40), r = R(() => 1.2 * i.value), s = R(() => 2.4 * i.value);
    return Ou({
      canvasRef: n,
      fontSize: i,
      lineHeight: r
    }), (o, a) => (O(), oe("div", {
      class: "subtitle-banner",
      style: St({ height: s.value + "px" })
    }, [
      ie("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, r0)
    ], 4));
  }
}), o0 = ".subtitle-banner[data-v-30da75ad]{flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-30da75ad]{display:block;width:100%;height:100%}", a0 = /* @__PURE__ */ Oe(s0, [["styles", [o0]], ["__scopeId", "data-v-30da75ad"]]), l0 = {
  ref: "container",
  class: "subtitle-fullscreen"
}, c0 = ["aria-label"], u0 = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, d0 = /* @__PURE__ */ X({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Mn(), { t: n } = ht(), i = _i("container"), r = _i("canvas"), s = R(() => e.subtitle?.fontSize.value ?? 48), o = R(() => 1.2 * s.value);
    Ou({
      canvasRef: r,
      fontSize: s,
      lineHeight: o
    }), De(async () => {
      const c = i.value;
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
    De(() => {
      document.addEventListener("fullscreenchange", a);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return vn(() => {
      document.removeEventListener("fullscreenchange", a);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, u) => (O(), oe("div", l0, [
      ie("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        H(v(ao), { size: 24 })
      ], 8, c0),
      ie("canvas", u0, null, 512)
    ], 512));
  }
}), f0 = ".subtitle-fullscreen[data-v-442e31fd]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-442e31fd]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-442e31fd]:hover,.subtitle-fullscreen__close[data-v-442e31fd]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-442e31fd]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-442e31fd]{transition:none}}", p0 = /* @__PURE__ */ Oe(d0, [["styles", [f0]], ["__scopeId", "data-v-442e31fd"]]), h0 = /* @__PURE__ */ X({
  __name: "CopyButton",
  props: {
    icon: { default: "copy", type: String },
    copyFn: { type: Function },
    variant: { type: String },
    size: { type: String },
    disabled: { type: Boolean },
    block: { type: Boolean },
    ariaLabel: { type: String }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ z(!1);
    let r;
    async function s() {
      if (!i.value)
        try {
          await n.copyFn(), i.value = !0, r = setTimeout(() => {
            i.value = !1;
          }, 2e3);
        } catch (l) {
          console.error(l);
        }
    }
    e({
      reset: () => {
        i.value = !1, clearTimeout(r);
      }
    });
    const o = R(() => i.value ? "check" : n.icon), a = R(() => Tc[n.size ?? "sm"]);
    return (l, c) => (O(), U(ft, {
      variant: t.variant,
      size: t.size,
      disabled: t.disabled,
      block: t.block,
      "aria-label": t.ariaLabel,
      class: $t({ "copy-btn--copied": i.value }),
      onClick: s
    }, {
      icon: q(() => [
        H(Sc, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: q(() => [
            (O(), U(Zi, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: q(() => [
        te(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), v0 = ".copy-btn--copied[data-v-eed7503d]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-eed7503d],.copy-icon-leave-to[data-v-eed7503d]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:none}}", Ja = /* @__PURE__ */ Oe(h0, [["styles", [v0]], ["__scopeId", "data-v-eed7503d"]]), m0 = ["aria-label"], g0 = { class: "selection-count" }, y0 = { class: "selection-actions" }, b0 = /* @__PURE__ */ X({
  __name: "SelectionActionBar",
  setup(t) {
    const e = yu(), { t: n } = ht();
    return (i, r) => v(e).hasSelection.value ? (O(), oe("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": v(n)("selection.count")
    }, [
      ie("span", g0, fe(v(e).count.value) + " " + fe(v(n)("selection.count")), 1),
      ie("div", y0, [
        H(Ja, {
          icon: "clipboard-type",
          "copy-fn": v(e).copyText,
          variant: "secondary"
        }, {
          default: q(() => [
            Le(fe(v(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(Ja, {
          icon: "clipboard-list",
          "copy-fn": v(e).copyWithMetadata
        }, {
          default: q(() => [
            Le(fe(v(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(ft, {
          variant: "transparent",
          icon: "x",
          onClick: r[0] || (r[0] = (s) => v(e).clear())
        }, {
          default: q(() => [
            Le(fe(v(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, m0)) : de("", !0);
  }
}), w0 = ".selection-bar[data-v-7569d6ad]{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-7569d6ad var(--transition-duration) ease}.selection-count[data-v-7569d6ad]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-7569d6ad]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-7569d6ad{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-7569d6ad]{animation:none}}@media(max-width:767px){.selection-bar[data-v-7569d6ad]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", _0 = /* @__PURE__ */ Oe(b0, [["styles", [w0]], ["__scopeId", "data-v-7569d6ad"]]), x0 = { class: "editor-layout" }, S0 = { class: "editor-body" }, C0 = {
  key: 4,
  class: "mobile-selectors"
}, E0 = /* @__PURE__ */ X({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Mn(), { isMobile: i } = bu(), r = /* @__PURE__ */ z(!1), s = R(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), o = n.speakers.all;
    yy(s, o, n);
    const a = R(() => [...n.channels.values()]), l = R(() => [
      ...n.activeChannel.value.translations.values()
    ]), c = R(
      () => n.activeChannel.value.activeTranslation.value.id
    ), u = R(() => Array.from(o.values())), d = _i("audioPlayer");
    function p(m) {
      n.audio && (n.audio.currentTime.value = m);
    }
    ye(
      () => n.activeChannelId.value,
      () => {
        d.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), r.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((m) => d.value?.seekTo(m));
    function f(m) {
      n.setActiveChannel(m);
    }
    function h(m) {
      n.activeChannel.value.setActiveTranslation(m);
    }
    return (m, y) => (O(), oe("div", x0, [
      e.showHeader ? (O(), U(nh, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value.duration,
        language: c.value,
        "is-mobile": v(i),
        onToggleSidebar: y[0] || (y[0] = (C) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : de("", !0),
      H(_0),
      ie("main", S0, [
        H(Ny, {
          turns: s.value,
          speakers: v(o)
        }, null, 8, ["turns", "speakers"]),
        v(i) ? de("", !0) : (O(), U(Wa, {
          key: 0,
          speakers: u.value,
          channels: a.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": h
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(i) ? (O(), U(Cb, {
          key: 1,
          open: r.value,
          "onUpdate:open": y[1] || (y[1] = (C) => r.value = C)
        }, {
          default: q(() => [
            H(Wa, {
              speakers: u.value,
              channels: a.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": c.value,
              "onUpdate:selectedChannelId": f,
              "onUpdate:selectedTranslationId": h
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : de("", !0)
      ]),
      v(n).audio?.src.value ? (O(), U(Xb, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: s.value,
        speakers: v(o),
        onTimeupdate: p,
        onPlayStateChange: y[2] || (y[2] = (C) => {
          v(n).audio && (v(n).audio.isPlaying.value = C);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : de("", !0),
      v(n).subtitle?.isVisible.value && !v(i) && !v(n).subtitle.isFullscreen.value ? (O(), U(a0, { key: 2 })) : de("", !0),
      v(n).subtitle?.isFullscreen.value ? (O(), U(p0, { key: 3 })) : de("", !0),
      v(i) && (a.value.length > 1 || l.value.length > 1) ? (O(), oe("div", C0, [
        a.value.length > 1 ? (O(), U(_u, {
          key: 0,
          channels: a.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : de("", !0),
        l.value.length > 1 ? (O(), U(xu, {
          key: 1,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedTranslationId": h
        }, null, 8, ["translations", "selected-translation-id"])) : de("", !0)
      ])) : de("", !0)
    ]));
  }
}), k0 = ".editor-layout[data-v-a7c5f0fd]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-a7c5f0fd]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-a7c5f0fd]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-a7c5f0fd]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-a7c5f0fd]{grid-template-columns:1fr}}", T0 = /* @__PURE__ */ Oe(E0, [["styles", [k0]], ["__scopeId", "data-v-a7c5f0fd"]]), A0 = /* @__PURE__ */ X({
  __name: "WebComponent",
  props: {
    locale: { default: "fr", type: String },
    noHeader: { type: Boolean, default: !1 }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ z(n.locale);
    qp(i), ye(
      () => n.locale,
      (s) => {
        i.value = s;
      }
    );
    const r = my();
    return gy(r), e({ editor: r }), (s, o) => v(r)?.channels?.size ? (O(), U(T0, {
      key: 0,
      "show-header": !n.noHeader
    }, null, 8, ["show-header"])) : de("", !0);
  }
}), P0 = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--color-danger: #e53935;--color-danger-hover: #c62828;--color-danger-soft: #fdecea;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}.sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow-y:auto;max-height:var(--reka-select-content-available-height);padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}', O0 = /* @__PURE__ */ Oe(A0, [["styles", [P0]]]);
function Za(t) {
  const e = t.words.length > 0;
  return {
    id: t.turnId,
    speakerId: t.speakerId,
    text: e ? null : t.text ?? null,
    words: t.words,
    startTime: t.startTime,
    endTime: t.endTime,
    language: t.language
  };
}
function ws(t, e) {
  return {
    id: t.turnId,
    speakerId: t.speakerId,
    text: e.text,
    words: [],
    startTime: t.startTime,
    endTime: t.endTime,
    language: e.language
  };
}
function D0() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ dn(null), n = /* @__PURE__ */ z(!1);
      n.value = !0;
      function i() {
        e.value = null;
      }
      function r(b, g) {
        if (t.activeChannelId.value !== g) return;
        const E = t.activeChannel.value.activeTranslation.value;
        if (E.isSource) {
          if (b.text == null) return;
          e.value = b.text;
        } else if (b.translations) {
          const k = b.translations.find(
            (x) => x.translationId === E.id
          );
          e.value = k?.text ?? null;
        } else
          return;
      }
      let s = null;
      function o() {
        s === null && (s = setTimeout(() => {
          s = null, i();
        }, 150));
      }
      function a() {
        s !== null && (clearTimeout(s), s = null);
      }
      function l(b, g) {
        b.hasTurn(g.id) ? b.updateTurn(g.id, g) : b.addTurn(g);
      }
      function c(b, g) {
        b.speakerId && t.speakers.ensure(b.speakerId);
        const E = t.channels.get(g);
        if (!E) {
          p();
          return;
        }
        if (b.text != null && l(
          E.sourceTranslation,
          Za(b)
        ), b.translations)
          for (const x of b.translations) {
            const M = E.translations.get(x.translationId);
            M && l(
              M,
              ws(b, x)
            );
          }
        t.activeChannel.value.activeTranslation.value.isSource && p();
      }
      function u(b, g) {
        d([b], g);
      }
      function d(b, g) {
        const E = t.channels.get(g);
        if (!E) return;
        const k = /* @__PURE__ */ new Set();
        for (const T of b)
          T.speakerId && !k.has(T.speakerId) && (k.add(T.speakerId), t.speakers.ensure(T.speakerId));
        const x = [];
        for (const T of b)
          T.text != null && x.push(Za(T));
        x.length > 0 && E.sourceTranslation.prependTurns(x);
        const M = /* @__PURE__ */ new Map();
        for (const T of b)
          if (T.translations)
            for (const A of T.translations) {
              let L = M.get(A.translationId);
              L || (L = [], M.set(A.translationId, L)), L.push(ws(T, A));
            }
        for (const [T, A] of M) {
          const L = E.translations.get(T);
          L && L.prependTurns(A);
        }
      }
      function p() {
        a(), i();
      }
      function f(b) {
        const g = t.activeChannel.value.activeTranslation.value, E = t.activeChannel.value;
        if (!b.final && g.languages.includes(b.language))
          e.value = b.text;
        else if (b.final) {
          const k = E.translations.get(b.language);
          if (k) {
            const x = ws(
              { ...b },
              b
            );
            k === g ? l(k, x) : k.updateOrCreateTurnSilent(x);
          }
          g.languages.includes(b.language) && p();
        }
      }
      const h = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: r,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: f
      }, m = t.on(
        "channel:change",
        p
      ), y = t.on(
        "translation:change",
        p
      ), C = t.on(
        "translation:sync",
        o
      ), _ = t.on("channel:sync", o);
      return t.live = h, () => {
        p(), m(), y(), C(), _(), t.live = void 0;
      };
    }
  };
}
function $0() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ z(0), n = /* @__PURE__ */ z(!1);
      let i = null;
      const r = R(
        () => t.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function s(l) {
        i?.(l);
      }
      function o(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: n,
        src: r,
        seekTo: s,
        setSeekHandler: o
      };
      return t.audio = a, () => {
        t.audio = void 0;
      };
    }
  };
}
function B0(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ z(t.fontSize ?? 40), i = /* @__PURE__ */ z(!0), r = /* @__PURE__ */ z(!1), s = {
        fontSize: n,
        isVisible: i,
        isFullscreen: r,
        enterFullscreen() {
          r.value = !0;
        },
        exitFullscreen() {
          r.value = !1;
        }
      };
      return e.subtitle = s, () => {
        i.value = !1, r.value = !1, e.subtitle = void 0;
      };
    }
  };
}
const I0 = /* @__PURE__ */ tp(O0);
function M0() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = up, document.head.appendChild(e);
}
function F0(t = "linto-editor") {
  M0(), customElements.define(t, I0);
}
export {
  I0 as LintoEditor,
  $0 as createAudioPlugin,
  D0 as createLivePlugin,
  B0 as createSubtitlePlugin,
  F0 as register
};
