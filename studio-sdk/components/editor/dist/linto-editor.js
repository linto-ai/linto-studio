// @__NO_SIDE_EFFECTS__
function Xo(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const me = {}, qn = [], Mt = () => {
}, ol = () => !1, bi = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Yo = (t) => t.startsWith("onUpdate:"), Oe = Object.assign, Go = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Ic = Object.prototype.hasOwnProperty, ye = (t, e) => Ic.call(t, e), ne = Array.isArray, Hn = (t) => Or(t) === "[object Map]", sl = (t) => Or(t) === "[object Set]", Ls = (t) => Or(t) === "[object Date]", se = (t) => typeof t == "function", Pe = (t) => typeof t == "string", bt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", al = (t) => (be(t) || se(t)) && se(t.then) && se(t.catch), ll = Object.prototype.toString, Or = (t) => ll.call(t), Mc = (t) => Or(t).slice(8, -1), _i = (t) => Or(t) === "[object Object]", wi = (t) => Pe(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, sr = /* @__PURE__ */ Xo(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), xi = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Dc = /-\w/g, $e = xi(
  (t) => t.replace(Dc, (e) => e.slice(1).toUpperCase())
), $c = /\B([A-Z])/g, tt = xi(
  (t) => t.replace($c, "-$1").toLowerCase()
), Si = xi((t) => t.charAt(0).toUpperCase() + t.slice(1)), Yr = xi(
  (t) => t ? `on${Si(t)}` : ""
), Ke = (t, e) => !Object.is(t, e), Yi = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, ul = (t, e, n, r = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
}, Bc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, xo = (t) => {
  const e = Pe(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let Is;
const Ci = () => Is || (Is = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function nt(t) {
  if (ne(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = Pe(r) ? qc(r) : nt(r);
      if (i)
        for (const o in i)
          e[o] = i[o];
    }
    return e;
  } else if (Pe(t) || be(t))
    return t;
}
const Fc = /;(?![^(]*\))/g, Nc = /:([^]+)/, zc = /\/\*[^]*?\*\//g;
function qc(t) {
  const e = {};
  return t.replace(zc, "").split(Fc).forEach((n) => {
    if (n) {
      const r = n.split(Nc);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function fn(t) {
  let e = "";
  if (Pe(t))
    e = t;
  else if (ne(t))
    for (let n = 0; n < t.length; n++) {
      const r = fn(t[n]);
      r && (e += r + " ");
    }
  else if (be(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Jo(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !Pe(e) && (t.class = fn(e)), n && (t.style = nt(n)), t;
}
const Hc = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Vc = /* @__PURE__ */ Xo(Hc);
function cl(t) {
  return !!t || t === "";
}
function Wc(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let r = 0; n && r < t.length; r++)
    n = Zo(t[r], e[r]);
  return n;
}
function Zo(t, e) {
  if (t === e) return !0;
  let n = Ls(t), r = Ls(e);
  if (n || r)
    return n && r ? t.getTime() === e.getTime() : !1;
  if (n = bt(t), r = bt(e), n || r)
    return t === e;
  if (n = ne(t), r = ne(e), n || r)
    return n && r ? Wc(t, e) : !1;
  if (n = be(t), r = be(e), n || r) {
    if (!n || !r)
      return !1;
    const i = Object.keys(t).length, o = Object.keys(e).length;
    if (i !== o)
      return !1;
    for (const s in t) {
      const a = t.hasOwnProperty(s), l = e.hasOwnProperty(s);
      if (a && !l || !a && l || !Zo(t[s], e[s]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const dl = (t) => !!(t && t.__v_isRef === !0), we = (t) => Pe(t) ? t : t == null ? "" : ne(t) || be(t) && (t.toString === ll || !se(t.toString)) ? dl(t) ? we(t.value) : JSON.stringify(t, fl, 2) : String(t), fl = (t, e) => dl(e) ? fl(t, e.value) : Hn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [r, i], o) => (n[Gi(r, o) + " =>"] = i, n),
    {}
  )
} : sl(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Gi(n))
} : bt(e) ? Gi(e) : be(e) && !ne(e) && !_i(e) ? String(e) : e, Gi = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    bt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let He;
class pl {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = He, !e && He && (this.index = (He.scopes || (He.scopes = [])).push(
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
      const n = He;
      try {
        return He = this, e();
      } finally {
        He = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = He, He = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (He = this.prevScope, this.prevScope = void 0);
  }
  stop(e) {
    if (this._active) {
      this._active = !1;
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !e) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function hl(t) {
  return new pl(t);
}
function Qo() {
  return He;
}
function vl(t, e = !1) {
  He && He.cleanups.push(t);
}
let Te;
const Ji = /* @__PURE__ */ new WeakSet();
class ml {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, He && He.active && He.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Ji.has(this) && (Ji.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || yl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ms(this), bl(this);
    const e = Te, n = gt;
    Te = this, gt = !0;
    try {
      return this.fn();
    } finally {
      _l(this), Te = e, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        ns(e);
      this.deps = this.depsTail = void 0, Ms(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Ji.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    So(this) && this.run();
  }
  get dirty() {
    return So(this);
  }
}
let gl = 0, ar, lr;
function yl(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = lr, lr = t;
    return;
  }
  t.next = ar, ar = t;
}
function es() {
  gl++;
}
function ts() {
  if (--gl > 0)
    return;
  if (lr) {
    let e = lr;
    for (lr = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; ar; ) {
    let e = ar;
    for (ar = void 0; e; ) {
      const n = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (r) {
          t || (t = r);
        }
      e = n;
    }
  }
  if (t) throw t;
}
function bl(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function _l(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), ns(r), jc(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function So(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (wl(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function wl(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === hr) || (t.globalVersion = hr, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !So(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Te, r = gt;
  Te = t, gt = !0;
  try {
    bl(t);
    const i = t.fn(t._value);
    (e.version === 0 || Ke(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    Te = n, gt = r, _l(t), t.flags &= -3;
  }
}
function ns(t, e = !1) {
  const { dep: n, prevSub: r, nextSub: i } = t;
  if (r && (r.nextSub = i, t.prevSub = void 0), i && (i.prevSub = r, t.nextSub = void 0), n.subs === t && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let o = n.computed.deps; o; o = o.nextDep)
      ns(o, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function jc(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let gt = !0;
const xl = [];
function Yt() {
  xl.push(gt), gt = !1;
}
function Gt() {
  const t = xl.pop();
  gt = t === void 0 ? !0 : t;
}
function Ms(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = Te;
    Te = void 0;
    try {
      e();
    } finally {
      Te = n;
    }
  }
}
let hr = 0;
class Uc {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ei {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!Te || !gt || Te === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Te)
      n = this.activeLink = new Uc(Te, this), Te.deps ? (n.prevDep = Te.depsTail, Te.depsTail.nextDep = n, Te.depsTail = n) : Te.deps = Te.depsTail = n, Sl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = Te.depsTail, n.nextDep = void 0, Te.depsTail.nextDep = n, Te.depsTail = n, Te.deps === n && (Te.deps = r);
    }
    return n;
  }
  trigger(e) {
    this.version++, hr++, this.notify(e);
  }
  notify(e) {
    es();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ts();
    }
  }
}
function Sl(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        Sl(r);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const ii = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ Symbol(
  ""
), Co = /* @__PURE__ */ Symbol(
  ""
), vr = /* @__PURE__ */ Symbol(
  ""
);
function Ve(t, e, n) {
  if (gt && Te) {
    let r = ii.get(t);
    r || ii.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ei()), i.map = r, i.key = n), i.track();
  }
}
function Kt(t, e, n, r, i, o) {
  const s = ii.get(t);
  if (!s) {
    hr++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (es(), e === "clear")
    s.forEach(a);
  else {
    const l = ne(t), c = l && wi(n);
    if (l && n === "length") {
      const u = Number(r);
      s.forEach((d, f) => {
        (f === "length" || f === vr || !bt(f) && f >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && a(s.get(n)), c && a(s.get(vr)), e) {
        case "add":
          l ? c && a(s.get("length")) : (a(s.get(Tn)), Hn(t) && a(s.get(Co)));
          break;
        case "delete":
          l || (a(s.get(Tn)), Hn(t) && a(s.get(Co)));
          break;
        case "set":
          Hn(t) && a(s.get(Tn));
          break;
      }
  }
  ts();
}
function Kc(t, e) {
  const n = ii.get(t);
  return n && n.get(e);
}
function Dn(t) {
  const e = /* @__PURE__ */ ve(t);
  return e === t ? e : (Ve(e, "iterate", vr), /* @__PURE__ */ st(t) ? e : e.map(_t));
}
function Ti(t) {
  return Ve(t = /* @__PURE__ */ ve(t), "iterate", vr), t;
}
function an(t, e) {
  return /* @__PURE__ */ Jt(t) ? Kn(/* @__PURE__ */ An(t) ? _t(e) : e) : _t(e);
}
const Xc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Zi(this, Symbol.iterator, (t) => an(this, t));
  },
  concat(...t) {
    return Dn(this).concat(
      ...t.map((e) => ne(e) ? Dn(e) : e)
    );
  },
  entries() {
    return Zi(this, "entries", (t) => (t[1] = an(this, t[1]), t));
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
      (n) => n.map((r) => an(this, r)),
      arguments
    );
  },
  find(t, e) {
    return Vt(
      this,
      "find",
      t,
      e,
      (n) => an(this, n),
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
      (n) => an(this, n),
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
    return Qi(this, "includes", t);
  },
  indexOf(...t) {
    return Qi(this, "indexOf", t);
  },
  join(t) {
    return Dn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Qi(this, "lastIndexOf", t);
  },
  map(t, e) {
    return Vt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return Qn(this, "pop");
  },
  push(...t) {
    return Qn(this, "push", t);
  },
  reduce(t, ...e) {
    return Ds(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Ds(this, "reduceRight", t, e);
  },
  shift() {
    return Qn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return Vt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return Qn(this, "splice", t);
  },
  toReversed() {
    return Dn(this).toReversed();
  },
  toSorted(t) {
    return Dn(this).toSorted(t);
  },
  toSpliced(...t) {
    return Dn(this).toSpliced(...t);
  },
  unshift(...t) {
    return Qn(this, "unshift", t);
  },
  values() {
    return Zi(this, "values", (t) => an(this, t));
  }
};
function Zi(t, e, n) {
  const r = Ti(t), i = r[e]();
  return r !== t && !/* @__PURE__ */ st(t) && (i._next = i.next, i.next = () => {
    const o = i._next();
    return o.done || (o.value = n(o.value)), o;
  }), i;
}
const Yc = Array.prototype;
function Vt(t, e, n, r, i, o) {
  const s = Ti(t), a = s !== t && !/* @__PURE__ */ st(t), l = s[e];
  if (l !== Yc[e]) {
    const d = l.apply(t, o);
    return a ? _t(d) : d;
  }
  let c = n;
  s !== t && (a ? c = function(d, f) {
    return n.call(this, an(t, d), f, t);
  } : n.length > 2 && (c = function(d, f) {
    return n.call(this, d, f, t);
  }));
  const u = l.call(s, c, r);
  return a && i ? i(u) : u;
}
function Ds(t, e, n, r) {
  const i = Ti(t);
  let o = n;
  return i !== t && (/* @__PURE__ */ st(t) ? n.length > 3 && (o = function(s, a, l) {
    return n.call(this, s, a, l, t);
  }) : o = function(s, a, l) {
    return n.call(this, s, an(t, a), l, t);
  }), i[e](o, ...r);
}
function Qi(t, e, n) {
  const r = /* @__PURE__ */ ve(t);
  Ve(r, "iterate", vr);
  const i = r[e](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Oi(n[0]) ? (n[0] = /* @__PURE__ */ ve(n[0]), r[e](...n)) : i;
}
function Qn(t, e, n = []) {
  Yt(), es();
  const r = (/* @__PURE__ */ ve(t))[e].apply(t, n);
  return ts(), Gt(), r;
}
const Gc = /* @__PURE__ */ Xo("__proto__,__v_isRef,__isVue"), Cl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(bt)
);
function Jc(t) {
  bt(t) || (t = String(t));
  const e = /* @__PURE__ */ ve(this);
  return Ve(e, "has", t), e.hasOwnProperty(t);
}
class El {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, r) {
    if (n === "__v_skip") return e.__v_skip;
    const i = this._isReadonly, o = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return o;
    if (n === "__v_raw")
      return r === (i ? o ? Rl : Ol : o ? Pl : kl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(r) ? e : void 0;
    const s = ne(e);
    if (!i) {
      let l;
      if (s && (l = Xc[n]))
        return l;
      if (n === "hasOwnProperty")
        return Jc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ De(e) ? e : r
    );
    if ((bt(n) ? Cl.has(n) : Gc(n)) || (i || Ve(e, "get", n), o))
      return a;
    if (/* @__PURE__ */ De(a)) {
      const l = s && wi(n) ? a : a.value;
      return i && be(l) ? /* @__PURE__ */ oi(l) : l;
    }
    return be(a) ? i ? /* @__PURE__ */ oi(a) : /* @__PURE__ */ Rr(a) : a;
  }
}
class Tl extends El {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, r, i) {
    let o = e[n];
    const s = ne(e) && wi(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Jt(o);
      if (!/* @__PURE__ */ st(r) && !/* @__PURE__ */ Jt(r) && (o = /* @__PURE__ */ ve(o), r = /* @__PURE__ */ ve(r)), !s && /* @__PURE__ */ De(o) && !/* @__PURE__ */ De(r))
        return c || (o.value = r), !0;
    }
    const a = s ? Number(n) < e.length : ye(e, n), l = Reflect.set(
      e,
      n,
      r,
      /* @__PURE__ */ De(e) ? e : i
    );
    return e === /* @__PURE__ */ ve(i) && (a ? Ke(r, o) && Kt(e, "set", n, r) : Kt(e, "add", n, r)), l;
  }
  deleteProperty(e, n) {
    const r = ye(e, n);
    e[n];
    const i = Reflect.deleteProperty(e, n);
    return i && r && Kt(e, "delete", n, void 0), i;
  }
  has(e, n) {
    const r = Reflect.has(e, n);
    return (!bt(n) || !Cl.has(n)) && Ve(e, "has", n), r;
  }
  ownKeys(e) {
    return Ve(
      e,
      "iterate",
      ne(e) ? "length" : Tn
    ), Reflect.ownKeys(e);
  }
}
class Al extends El {
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
const Zc = /* @__PURE__ */ new Tl(), Qc = /* @__PURE__ */ new Al(), ed = /* @__PURE__ */ new Tl(!0), td = /* @__PURE__ */ new Al(!0), Eo = (t) => t, Nr = (t) => Reflect.getPrototypeOf(t);
function nd(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, o = /* @__PURE__ */ ve(i), s = Hn(o), a = t === "entries" || t === Symbol.iterator && s, l = t === "keys" && s, c = i[t](...r), u = n ? Eo : e ? Kn : _t;
    return !e && Ve(
      o,
      "iterate",
      l ? Co : Tn
    ), Oe(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: d, done: f } = c.next();
          return f ? { value: d, done: f } : {
            value: a ? [u(d[0]), u(d[1])] : u(d),
            done: f
          };
        }
      }
    );
  };
}
function zr(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function rd(t, e) {
  const n = {
    get(i) {
      const o = this.__v_raw, s = /* @__PURE__ */ ve(o), a = /* @__PURE__ */ ve(i);
      t || (Ke(i, a) && Ve(s, "get", i), Ve(s, "get", a));
      const { has: l } = Nr(s), c = e ? Eo : t ? Kn : _t;
      if (l.call(s, i))
        return c(o.get(i));
      if (l.call(s, a))
        return c(o.get(a));
      o !== s && o.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && Ve(/* @__PURE__ */ ve(i), "iterate", Tn), i.size;
    },
    has(i) {
      const o = this.__v_raw, s = /* @__PURE__ */ ve(o), a = /* @__PURE__ */ ve(i);
      return t || (Ke(i, a) && Ve(s, "has", i), Ve(s, "has", a)), i === a ? o.has(i) : o.has(i) || o.has(a);
    },
    forEach(i, o) {
      const s = this, a = s.__v_raw, l = /* @__PURE__ */ ve(a), c = e ? Eo : t ? Kn : _t;
      return !t && Ve(l, "iterate", Tn), a.forEach((u, d) => i.call(o, c(u), c(d), s));
    }
  };
  return Oe(
    n,
    t ? {
      add: zr("add"),
      set: zr("set"),
      delete: zr("delete"),
      clear: zr("clear")
    } : {
      add(i) {
        !e && !/* @__PURE__ */ st(i) && !/* @__PURE__ */ Jt(i) && (i = /* @__PURE__ */ ve(i));
        const o = /* @__PURE__ */ ve(this);
        return Nr(o).has.call(o, i) || (o.add(i), Kt(o, "add", i, i)), this;
      },
      set(i, o) {
        !e && !/* @__PURE__ */ st(o) && !/* @__PURE__ */ Jt(o) && (o = /* @__PURE__ */ ve(o));
        const s = /* @__PURE__ */ ve(this), { has: a, get: l } = Nr(s);
        let c = a.call(s, i);
        c || (i = /* @__PURE__ */ ve(i), c = a.call(s, i));
        const u = l.call(s, i);
        return s.set(i, o), c ? Ke(o, u) && Kt(s, "set", i, o) : Kt(s, "add", i, o), this;
      },
      delete(i) {
        const o = /* @__PURE__ */ ve(this), { has: s, get: a } = Nr(o);
        let l = s.call(o, i);
        l || (i = /* @__PURE__ */ ve(i), l = s.call(o, i)), a && a.call(o, i);
        const c = o.delete(i);
        return l && Kt(o, "delete", i, void 0), c;
      },
      clear() {
        const i = /* @__PURE__ */ ve(this), o = i.size !== 0, s = i.clear();
        return o && Kt(
          i,
          "clear",
          void 0,
          void 0
        ), s;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = nd(i, t, e);
  }), n;
}
function Ai(t, e) {
  const n = rd(t, e);
  return (r, i, o) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    ye(n, i) && i in r ? n : r,
    i,
    o
  );
}
const id = {
  get: /* @__PURE__ */ Ai(!1, !1)
}, od = {
  get: /* @__PURE__ */ Ai(!1, !0)
}, sd = {
  get: /* @__PURE__ */ Ai(!0, !1)
}, ad = {
  get: /* @__PURE__ */ Ai(!0, !0)
}, kl = /* @__PURE__ */ new WeakMap(), Pl = /* @__PURE__ */ new WeakMap(), Ol = /* @__PURE__ */ new WeakMap(), Rl = /* @__PURE__ */ new WeakMap();
function ld(t) {
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
function ud(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : ld(Mc(t));
}
// @__NO_SIDE_EFFECTS__
function Rr(t) {
  return /* @__PURE__ */ Jt(t) ? t : Pi(
    t,
    !1,
    Zc,
    id,
    kl
  );
}
// @__NO_SIDE_EFFECTS__
function ki(t) {
  return Pi(
    t,
    !1,
    ed,
    od,
    Pl
  );
}
// @__NO_SIDE_EFFECTS__
function oi(t) {
  return Pi(
    t,
    !0,
    Qc,
    sd,
    Ol
  );
}
// @__NO_SIDE_EFFECTS__
function $n(t) {
  return Pi(
    t,
    !0,
    td,
    ad,
    Rl
  );
}
function Pi(t, e, n, r, i) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const o = ud(t);
  if (o === 0)
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const a = new Proxy(
    t,
    o === 2 ? r : n
  );
  return i.set(t, a), a;
}
// @__NO_SIDE_EFFECTS__
function An(t) {
  return /* @__PURE__ */ Jt(t) ? /* @__PURE__ */ An(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Jt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function st(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Oi(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ve(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ ve(e) : t;
}
function Ll(t) {
  return !ye(t, "__v_skip") && Object.isExtensible(t) && ul(t, "__v_skip", !0), t;
}
const _t = (t) => be(t) ? /* @__PURE__ */ Rr(t) : t, Kn = (t) => be(t) ? /* @__PURE__ */ oi(t) : t;
// @__NO_SIDE_EFFECTS__
function De(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function L(t) {
  return Il(t, !1);
}
// @__NO_SIDE_EFFECTS__
function kn(t) {
  return Il(t, !0);
}
function Il(t, e) {
  return /* @__PURE__ */ De(t) ? t : new cd(t, e);
}
class cd {
  constructor(e, n) {
    this.dep = new Ei(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ve(e), this._value = n ? e : _t(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, r = this.__v_isShallow || /* @__PURE__ */ st(e) || /* @__PURE__ */ Jt(e);
    e = r ? e : /* @__PURE__ */ ve(e), Ke(e, n) && (this._rawValue = e, this._value = r ? e : _t(e), this.dep.trigger());
  }
}
function $s(t) {
  t.dep && t.dep.trigger();
}
function v(t) {
  return /* @__PURE__ */ De(t) ? t.value : t;
}
function Ne(t) {
  return se(t) ? t() : v(t);
}
const dd = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const i = t[e];
    return /* @__PURE__ */ De(i) && !/* @__PURE__ */ De(n) ? (i.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function Ml(t) {
  return /* @__PURE__ */ An(t) ? t : new Proxy(t, dd);
}
class fd {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Ei(), { get: r, set: i } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function Dl(t) {
  return new fd(t);
}
// @__NO_SIDE_EFFECTS__
function tn(t) {
  const e = ne(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = $l(t, n);
  return e;
}
class pd {
  constructor(e, n, r) {
    this._object = e, this._key = n, this._defaultValue = r, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ve(e);
    let i = !0, o = e;
    if (!ne(e) || !wi(String(n)))
      do
        i = !/* @__PURE__ */ Oi(o) || /* @__PURE__ */ st(o);
      while (i && (o = o.__v_raw));
    this._shallow = i;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = v(e)), this._value = e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    if (this._shallow && /* @__PURE__ */ De(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ De(n)) {
        n.value = e;
        return;
      }
    }
    this._object[this._key] = e;
  }
  get dep() {
    return Kc(this._raw, this._key);
  }
}
class hd {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Gr(t, e, n) {
  return /* @__PURE__ */ De(t) ? t : se(t) ? new hd(t) : be(t) && arguments.length > 1 ? $l(t, e, n) : /* @__PURE__ */ L(t);
}
function $l(t, e, n) {
  return new pd(t, e, n);
}
class vd {
  constructor(e, n, r) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new Ei(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = hr - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Te !== this)
      return yl(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return wl(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function md(t, e, n = !1) {
  let r, i;
  return se(t) ? r = t : (r = t.get, i = t.set), new vd(r, i, n);
}
const qr = {}, si = /* @__PURE__ */ new WeakMap();
let xn;
function gd(t, e = !1, n = xn) {
  if (n) {
    let r = si.get(n);
    r || si.set(n, r = []), r.push(t);
  }
}
function yd(t, e, n = me) {
  const { immediate: r, deep: i, once: o, scheduler: s, augmentJob: a, call: l } = n, c = (y) => i ? y : /* @__PURE__ */ st(y) || i === !1 || i === 0 ? Xt(y, 1) : Xt(y);
  let u, d, f, p, h = !1, m = !1;
  if (/* @__PURE__ */ De(t) ? (d = () => t.value, h = /* @__PURE__ */ st(t)) : /* @__PURE__ */ An(t) ? (d = () => c(t), h = !0) : ne(t) ? (m = !0, h = t.some((y) => /* @__PURE__ */ An(y) || /* @__PURE__ */ st(y)), d = () => t.map((y) => {
    if (/* @__PURE__ */ De(y))
      return y.value;
    if (/* @__PURE__ */ An(y))
      return c(y);
    if (se(y))
      return l ? l(y, 2) : y();
  })) : se(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (f) {
      Yt();
      try {
        f();
      } finally {
        Gt();
      }
    }
    const y = xn;
    xn = u;
    try {
      return l ? l(t, 3, [p]) : t(p);
    } finally {
      xn = y;
    }
  } : d = Mt, e && i) {
    const y = d, S = i === !0 ? 1 / 0 : i;
    d = () => Xt(y(), S);
  }
  const g = Qo(), x = () => {
    u.stop(), g && g.active && Go(g.effects, u);
  };
  if (o && e) {
    const y = e;
    e = (...S) => {
      y(...S), x();
    };
  }
  let _ = m ? new Array(t.length).fill(qr) : qr;
  const w = (y) => {
    if (!(!(u.flags & 1) || !u.dirty && !y))
      if (e) {
        const S = u.run();
        if (i || h || (m ? S.some((T, E) => Ke(T, _[E])) : Ke(S, _))) {
          f && f();
          const T = xn;
          xn = u;
          try {
            const E = [
              S,
              // pass undefined as the old value when it's changed for the first time
              _ === qr ? void 0 : m && _[0] === qr ? [] : _,
              p
            ];
            _ = S, l ? l(e, 3, E) : (
              // @ts-expect-error
              e(...E)
            );
          } finally {
            xn = T;
          }
        }
      } else
        u.run();
  };
  return a && a(w), u = new ml(d), u.scheduler = s ? () => s(w, !1) : w, p = (y) => gd(y, !1, u), f = u.onStop = () => {
    const y = si.get(u);
    if (y) {
      if (l)
        l(y, 4);
      else
        for (const S of y) S();
      si.delete(u);
    }
  }, e ? r ? w(!0) : _ = u.run() : s ? s(w.bind(null, !0), !0) : u.run(), x.pause = u.pause.bind(u), x.resume = u.resume.bind(u), x.stop = x, x;
}
function Xt(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ De(t))
    Xt(t.value, e, n);
  else if (ne(t))
    for (let r = 0; r < t.length; r++)
      Xt(t[r], e, n);
  else if (sl(t) || Hn(t))
    t.forEach((r) => {
      Xt(r, e, n);
    });
  else if (_i(t)) {
    for (const r in t)
      Xt(t[r], e, n);
    for (const r of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, r) && Xt(t[r], e, n);
  }
  return t;
}
function Lr(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (i) {
    Ri(i, e, n);
  }
}
function wt(t, e, n, r) {
  if (se(t)) {
    const i = Lr(t, e, n, r);
    return i && al(i) && i.catch((o) => {
      Ri(o, e, n);
    }), i;
  }
  if (ne(t)) {
    const i = [];
    for (let o = 0; o < t.length; o++)
      i.push(wt(t[o], e, n, r));
    return i;
  }
}
function Ri(t, e, n, r = !0) {
  const i = e ? e.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = e && e.appContext.config || me;
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
    if (o) {
      Yt(), Lr(o, null, 10, [
        t,
        l,
        c
      ]), Gt();
      return;
    }
  }
  bd(t, n, i, r, s);
}
function bd(t, e, n, r = !0, i = !1) {
  if (i)
    throw t;
  console.error(t);
}
const Xe = [];
let Pt = -1;
const Vn = [];
let ln = null, Nn = 0;
const Bl = /* @__PURE__ */ Promise.resolve();
let ai = null;
function Ie(t) {
  const e = ai || Bl;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function _d(t) {
  let e = Pt + 1, n = Xe.length;
  for (; e < n; ) {
    const r = e + n >>> 1, i = Xe[r], o = mr(i);
    o < t || o === t && i.flags & 2 ? e = r + 1 : n = r;
  }
  return e;
}
function rs(t) {
  if (!(t.flags & 1)) {
    const e = mr(t), n = Xe[Xe.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= mr(n) ? Xe.push(t) : Xe.splice(_d(e), 0, t), t.flags |= 1, Fl();
  }
}
function Fl() {
  ai || (ai = Bl.then(zl));
}
function wd(t) {
  ne(t) ? Vn.push(...t) : ln && t.id === -1 ? ln.splice(Nn + 1, 0, t) : t.flags & 1 || (Vn.push(t), t.flags |= 1), Fl();
}
function Bs(t, e, n = Pt + 1) {
  for (; n < Xe.length; n++) {
    const r = Xe[n];
    if (r && r.flags & 2) {
      if (t && r.id !== t.uid)
        continue;
      Xe.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function Nl(t) {
  if (Vn.length) {
    const e = [...new Set(Vn)].sort(
      (n, r) => mr(n) - mr(r)
    );
    if (Vn.length = 0, ln) {
      ln.push(...e);
      return;
    }
    for (ln = e, Nn = 0; Nn < ln.length; Nn++) {
      const n = ln[Nn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    ln = null, Nn = 0;
  }
}
const mr = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function zl(t) {
  try {
    for (Pt = 0; Pt < Xe.length; Pt++) {
      const e = Xe[Pt];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Lr(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; Pt < Xe.length; Pt++) {
      const e = Xe[Pt];
      e && (e.flags &= -2);
    }
    Pt = -1, Xe.length = 0, Nl(), ai = null, (Xe.length || Vn.length) && zl();
  }
}
let Fe = null, ql = null;
function li(t) {
  const e = Fe;
  return Fe = t, ql = t && t.type.__scopeId || null, e;
}
function I(t, e = Fe, n) {
  if (!e || t._n)
    return t;
  const r = (...i) => {
    r._d && di(-1);
    const o = li(e);
    let s;
    try {
      s = t(...i);
    } finally {
      li(o), r._d && di(1);
    }
    return s;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function xd(t, e) {
  if (Fe === null)
    return t;
  const n = Bi(Fe), r = t.dirs || (t.dirs = []);
  for (let i = 0; i < e.length; i++) {
    let [o, s, a, l = me] = e[i];
    o && (se(o) && (o = {
      mounted: o,
      updated: o
    }), o.deep && Xt(s), r.push({
      dir: o,
      instance: n,
      value: s,
      oldValue: void 0,
      arg: a,
      modifiers: l
    }));
  }
  return t;
}
function yn(t, e, n, r) {
  const i = t.dirs, o = e && e.dirs;
  for (let s = 0; s < i.length; s++) {
    const a = i[s];
    o && (a.oldValue = o[s].value);
    let l = a.dir[r];
    l && (Yt(), wt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Gt());
  }
}
function Ir(t, e) {
  if (We) {
    let n = We.provides;
    const r = We.parent && We.parent.provides;
    r === n && (n = We.provides = Object.create(r)), n[t] = e;
  }
}
function cn(t, e, n = !1) {
  const r = ut();
  if (r || jn) {
    let i = jn ? jn._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (i && t in i)
      return i[t];
    if (arguments.length > 1)
      return n && se(e) ? e.call(r && r.proxy) : e;
  }
}
const Sd = /* @__PURE__ */ Symbol.for("v-scx"), Cd = () => cn(Sd);
function ze(t, e) {
  return Mr(t, null, e);
}
function Hl(t, e) {
  return Mr(
    t,
    null,
    { flush: "post" }
  );
}
function Vl(t, e) {
  return Mr(
    t,
    null,
    { flush: "sync" }
  );
}
function xe(t, e, n) {
  return Mr(t, e, n);
}
function Mr(t, e, n = me) {
  const { immediate: r, deep: i, flush: o, once: s } = n, a = Oe({}, n), l = e && r || !e && o !== "post";
  let c;
  if (_r) {
    if (o === "sync") {
      const p = Cd();
      c = p.__watcherHandles || (p.__watcherHandles = []);
    } else if (!l) {
      const p = () => {
      };
      return p.stop = Mt, p.resume = Mt, p.pause = Mt, p;
    }
  }
  const u = We;
  a.call = (p, h, m) => wt(p, u, h, m);
  let d = !1;
  o === "post" ? a.scheduler = (p) => {
    qe(p, u && u.suspense);
  } : o !== "sync" && (d = !0, a.scheduler = (p, h) => {
    h ? p() : rs(p);
  }), a.augmentJob = (p) => {
    e && (p.flags |= 4), d && (p.flags |= 2, u && (p.id = u.uid, p.i = u));
  };
  const f = yd(t, e, a);
  return _r && (c ? c.push(f) : l && f()), f;
}
function Ed(t, e, n) {
  const r = this.proxy, i = Pe(t) ? t.includes(".") ? Wl(r, t) : () => r[t] : t.bind(r, r);
  let o;
  se(e) ? o = e : (o = e.handler, n = e);
  const s = Dr(this), a = Mr(i, o.bind(r), n);
  return s(), a;
}
function Wl(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let i = 0; i < n.length && r; i++)
      r = r[n[i]];
    return r;
  };
}
const jl = /* @__PURE__ */ Symbol("_vte"), Ul = (t) => t.__isTeleport, ur = (t) => t && (t.disabled || t.disabled === ""), Fs = (t) => t && (t.defer || t.defer === ""), Ns = (t) => typeof SVGElement < "u" && t instanceof SVGElement, zs = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, To = (t, e) => {
  const n = t && t.to;
  return Pe(n) ? e ? e(n) : null : n;
}, Kl = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, r, i, o, s, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: f,
      o: { insert: p, querySelector: h, createText: m, createComment: g }
    } = c, x = ur(e.props);
    let { shapeFlag: _, children: w, dynamicChildren: y } = e;
    if (t == null) {
      const S = e.el = m(""), T = e.anchor = m("");
      p(S, n, r), p(T, n, r);
      const E = (A, k) => {
        _ & 16 && u(
          w,
          A,
          k,
          i,
          o,
          s,
          a,
          l
        );
      }, D = () => {
        const A = e.target = To(e.props, h), k = Ao(A, e, m, p);
        A && (s !== "svg" && Ns(A) ? s = "svg" : s !== "mathml" && zs(A) && (s = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(A), x || (E(A, k), Jr(e, !1)));
      };
      x && (E(n, T), Jr(e, !0)), Fs(e.props) ? (e.el.__isMounted = !1, qe(() => {
        D(), delete e.el.__isMounted;
      }, o)) : D();
    } else {
      if (Fs(e.props) && t.el.__isMounted === !1) {
        qe(() => {
          Kl.process(
            t,
            e,
            n,
            r,
            i,
            o,
            s,
            a,
            l,
            c
          );
        }, o);
        return;
      }
      e.el = t.el, e.targetStart = t.targetStart;
      const S = e.anchor = t.anchor, T = e.target = t.target, E = e.targetAnchor = t.targetAnchor, D = ur(t.props), A = D ? n : T, k = D ? S : E;
      if (s === "svg" || Ns(T) ? s = "svg" : (s === "mathml" || zs(T)) && (s = "mathml"), y ? (f(
        t.dynamicChildren,
        y,
        A,
        i,
        o,
        s,
        a
      ), ss(t, e, !0)) : l || d(
        t,
        e,
        A,
        k,
        i,
        o,
        s,
        a,
        !1
      ), x)
        D ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : Hr(
          e,
          n,
          S,
          c,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const $ = e.target = To(
          e.props,
          h
        );
        $ && Hr(
          e,
          $,
          null,
          c,
          0
        );
      } else D && Hr(
        e,
        T,
        E,
        c,
        1
      );
      Jr(e, x);
    }
  },
  remove(t, e, n, { um: r, o: { remove: i } }, o) {
    const {
      shapeFlag: s,
      children: a,
      anchor: l,
      targetStart: c,
      targetAnchor: u,
      target: d,
      props: f
    } = t;
    if (d && (i(c), i(u)), o && i(l), s & 16) {
      const p = o || !ur(f);
      for (let h = 0; h < a.length; h++) {
        const m = a[h];
        r(
          m,
          e,
          n,
          p,
          !!m.dynamicChildren
        );
      }
    }
  },
  move: Hr,
  hydrate: Td
};
function Hr(t, e, n, { o: { insert: r }, m: i }, o = 2) {
  o === 0 && r(t.targetAnchor, e, n);
  const { el: s, anchor: a, shapeFlag: l, children: c, props: u } = t, d = o === 2;
  if (d && r(s, e, n), (!d || ur(u)) && l & 16)
    for (let f = 0; f < c.length; f++)
      i(
        c[f],
        e,
        n,
        2
      );
  d && r(a, e, n);
}
function Td(t, e, n, r, i, o, {
  o: { nextSibling: s, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function f(g, x) {
    let _ = x;
    for (; _; ) {
      if (_ && _.nodeType === 8) {
        if (_.data === "teleport start anchor")
          e.targetStart = _;
        else if (_.data === "teleport anchor") {
          e.targetAnchor = _, g._lpa = e.targetAnchor && s(e.targetAnchor);
          break;
        }
      }
      _ = s(_);
    }
  }
  function p(g, x) {
    x.anchor = d(
      s(g),
      x,
      a(g),
      n,
      r,
      i,
      o
    );
  }
  const h = e.target = To(
    e.props,
    l
  ), m = ur(e.props);
  if (h) {
    const g = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (m ? (p(t, e), f(h, g), e.targetAnchor || Ao(
      h,
      e,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = s(t), f(h, g), e.targetAnchor || Ao(h, e, u, c), d(
      g && s(g),
      e,
      h,
      n,
      r,
      i,
      o
    ))), Jr(e, m);
  } else m && e.shapeFlag & 16 && (p(t, e), e.targetStart = t, e.targetAnchor = s(t));
  return e.anchor && s(e.anchor);
}
const Xl = Kl;
function Jr(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let r, i;
    for (e ? (r = t.el, i = t.anchor) : (r = t.targetStart, i = t.targetAnchor); r && r !== i; )
      r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
    n.ut();
  }
}
function Ao(t, e, n, r, i = null) {
  const o = e.targetStart = n(""), s = e.targetAnchor = n("");
  return o[jl] = s, t && (r(o, t, i), r(s, t, i)), s;
}
const Ot = /* @__PURE__ */ Symbol("_leaveCb"), er = /* @__PURE__ */ Symbol("_enterCb");
function Ad() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return ke(() => {
    t.isMounted = !0;
  }), On(() => {
    t.isUnmounting = !0;
  }), t;
}
const ft = [Function, Array], Yl = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: ft,
  onEnter: ft,
  onAfterEnter: ft,
  onEnterCancelled: ft,
  // leave
  onBeforeLeave: ft,
  onLeave: ft,
  onAfterLeave: ft,
  onLeaveCancelled: ft,
  // appear
  onBeforeAppear: ft,
  onAppear: ft,
  onAfterAppear: ft,
  onAppearCancelled: ft
}, Gl = (t) => {
  const e = t.subTree;
  return e.component ? Gl(e.component) : e;
}, kd = {
  name: "BaseTransition",
  props: Yl,
  setup(t, { slots: e }) {
    const n = ut(), r = Ad();
    return () => {
      const i = e.default && Ql(e.default(), !0);
      if (!i || !i.length)
        return;
      const o = Jl(i), s = /* @__PURE__ */ ve(t), { mode: a } = s;
      if (r.isLeaving)
        return eo(o);
      const l = qs(o);
      if (!l)
        return eo(o);
      let c = ko(
        l,
        s,
        r,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      l.type !== Be && gr(l, c);
      let u = n.subTree && qs(n.subTree);
      if (u && u.type !== Be && !Cn(u, l) && Gl(n).type !== Be) {
        let d = ko(
          u,
          s,
          r,
          n
        );
        if (gr(u, d), a === "out-in" && l.type !== Be)
          return r.isLeaving = !0, d.afterLeave = () => {
            r.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, eo(o);
        a === "in-out" && l.type !== Be ? d.delayLeave = (f, p, h) => {
          const m = Zl(
            r,
            u
          );
          m[String(u.key)] = u, f[Ot] = () => {
            p(), f[Ot] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return o;
    };
  }
};
function Jl(t) {
  let e = t[0];
  if (t.length > 1) {
    for (const n of t)
      if (n.type !== Be) {
        e = n;
        break;
      }
  }
  return e;
}
const Pd = kd;
function Zl(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function ko(t, e, n, r, i) {
  const {
    appear: o,
    mode: s,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: c,
    onAfterEnter: u,
    onEnterCancelled: d,
    onBeforeLeave: f,
    onLeave: p,
    onAfterLeave: h,
    onLeaveCancelled: m,
    onBeforeAppear: g,
    onAppear: x,
    onAfterAppear: _,
    onAppearCancelled: w
  } = e, y = String(t.key), S = Zl(n, t), T = (A, k) => {
    A && wt(
      A,
      r,
      9,
      k
    );
  }, E = (A, k) => {
    const $ = k[1];
    T(A, k), ne(A) ? A.every((P) => P.length <= 1) && $() : A.length <= 1 && $();
  }, D = {
    mode: s,
    persisted: a,
    beforeEnter(A) {
      let k = l;
      if (!n.isMounted)
        if (o)
          k = g || l;
        else
          return;
      A[Ot] && A[Ot](
        !0
        /* cancelled */
      );
      const $ = S[y];
      $ && Cn(t, $) && $.el[Ot] && $.el[Ot](), T(k, [A]);
    },
    enter(A) {
      let k = c, $ = u, P = d;
      if (!n.isMounted)
        if (o)
          k = x || c, $ = _ || u, P = w || d;
        else
          return;
      let W = !1;
      A[er] = (K) => {
        W || (W = !0, K ? T(P, [A]) : T($, [A]), D.delayedLeave && D.delayedLeave(), A[er] = void 0);
      };
      const B = A[er].bind(null, !1);
      k ? E(k, [A, B]) : B();
    },
    leave(A, k) {
      const $ = String(t.key);
      if (A[er] && A[er](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return k();
      T(f, [A]);
      let P = !1;
      A[Ot] = (B) => {
        P || (P = !0, k(), B ? T(m, [A]) : T(h, [A]), A[Ot] = void 0, S[$] === t && delete S[$]);
      };
      const W = A[Ot].bind(null, !1);
      S[$] = t, p ? E(p, [A, W]) : W();
    },
    clone(A) {
      const k = ko(
        A,
        e,
        n,
        r,
        i
      );
      return i && i(k), k;
    }
  };
  return D;
}
function eo(t) {
  if (Li(t))
    return t = Zt(t), t.children = null, t;
}
function qs(t) {
  if (!Li(t))
    return Ul(t.type) && t.children ? Jl(t.children) : t;
  if (t.component)
    return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (e & 16)
      return n[0];
    if (e & 32 && se(n.default))
      return n.default();
  }
}
function gr(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, gr(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Ql(t, e = !1, n) {
  let r = [], i = 0;
  for (let o = 0; o < t.length; o++) {
    let s = t[o];
    const a = n == null ? s.key : String(n) + String(s.key != null ? s.key : o);
    s.type === Ae ? (s.patchFlag & 128 && i++, r = r.concat(
      Ql(s.children, e, a)
    )) : (e || s.type !== Be) && r.push(a != null ? Zt(s, { key: a }) : s);
  }
  if (i > 1)
    for (let o = 0; o < r.length; o++)
      r[o].patchFlag = -2;
  return r;
}
// @__NO_SIDE_EFFECTS__
function X(t, e) {
  return se(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Oe({ name: t.name }, e, { setup: t })
  ) : t;
}
function eu() {
  const t = ut();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function tu(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function yr(t) {
  const e = ut(), n = /* @__PURE__ */ kn(null);
  if (e) {
    const i = e.refs === me ? e.refs = {} : e.refs;
    Object.defineProperty(i, t, {
      enumerable: !0,
      get: () => n.value,
      set: (o) => n.value = o
    });
  }
  return n;
}
function Hs(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const ui = /* @__PURE__ */ new WeakMap();
function cr(t, e, n, r, i = !1) {
  if (ne(t)) {
    t.forEach(
      (m, g) => cr(
        m,
        e && (ne(e) ? e[g] : e),
        n,
        r,
        i
      )
    );
    return;
  }
  if (Wn(r) && !i) {
    r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && cr(t, e, n, r.component.subTree);
    return;
  }
  const o = r.shapeFlag & 4 ? Bi(r.component) : r.el, s = i ? null : o, { i: a, r: l } = t, c = e && e.r, u = a.refs === me ? a.refs = {} : a.refs, d = a.setupState, f = /* @__PURE__ */ ve(d), p = d === me ? ol : (m) => Hs(u, m) ? !1 : ye(f, m), h = (m, g) => !(g && Hs(u, g));
  if (c != null && c !== l) {
    if (Vs(e), Pe(c))
      u[c] = null, p(c) && (d[c] = null);
    else if (/* @__PURE__ */ De(c)) {
      const m = e;
      h(c, m.k) && (c.value = null), m.k && (u[m.k] = null);
    }
  }
  if (se(l))
    Lr(l, a, 12, [s, u]);
  else {
    const m = Pe(l), g = /* @__PURE__ */ De(l);
    if (m || g) {
      const x = () => {
        if (t.f) {
          const _ = m ? p(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (i)
            ne(_) && Go(_, o);
          else if (ne(_))
            _.includes(o) || _.push(o);
          else if (m)
            u[l] = [o], p(l) && (d[l] = u[l]);
          else {
            const w = [o];
            h(l, t.k) && (l.value = w), t.k && (u[t.k] = w);
          }
        } else m ? (u[l] = s, p(l) && (d[l] = s)) : g && (h(l, t.k) && (l.value = s), t.k && (u[t.k] = s));
      };
      if (s) {
        const _ = () => {
          x(), ui.delete(t);
        };
        _.id = -1, ui.set(t, _), qe(_, n);
      } else
        Vs(t), x();
    }
  }
}
function Vs(t) {
  const e = ui.get(t);
  e && (e.flags |= 8, ui.delete(t));
}
Ci().requestIdleCallback;
Ci().cancelIdleCallback;
const Wn = (t) => !!t.type.__asyncLoader, Li = (t) => t.type.__isKeepAlive;
function Od(t, e) {
  nu(t, "a", e);
}
function Rd(t, e) {
  nu(t, "da", e);
}
function nu(t, e, n = We) {
  const r = t.__wdc || (t.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return t();
  });
  if (Ii(e, r, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Li(i.parent.vnode) && Ld(r, e, n, i), i = i.parent;
  }
}
function Ld(t, e, n, r) {
  const i = Ii(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  lt(() => {
    Go(r[e], i);
  }, n);
}
function Ii(t, e, n = We, r = !1) {
  if (n) {
    const i = n[t] || (n[t] = []), o = e.__weh || (e.__weh = (...s) => {
      Yt();
      const a = Dr(n), l = wt(e, n, t, s);
      return a(), Gt(), l;
    });
    return r ? i.unshift(o) : i.push(o), o;
  }
}
const nn = (t) => (e, n = We) => {
  (!_r || t === "sp") && Ii(t, (...r) => e(...r), n);
}, Id = nn("bm"), ke = nn("m"), Md = nn(
  "bu"
), Dd = nn("u"), On = nn(
  "bum"
), lt = nn("um"), $d = nn(
  "sp"
), Bd = nn("rtg"), Fd = nn("rtc");
function Nd(t, e = We) {
  Ii("ec", t, e);
}
const zd = "components", ru = /* @__PURE__ */ Symbol.for("v-ndc");
function qd(t) {
  return Pe(t) ? Hd(zd, t, !1) || t : t || ru;
}
function Hd(t, e, n = !0, r = !1) {
  const i = Fe || We;
  if (i) {
    const o = i.type;
    {
      const a = Af(
        o,
        !1
      );
      if (a && (a === e || a === $e(e) || a === Si($e(e))))
        return o;
    }
    const s = (
      // local registration
      // check instance[type] first which is resolved for options API
      Ws(i[t] || o[t], e) || // global registration
      Ws(i.appContext[t], e)
    );
    return !s && r ? o : s;
  }
}
function Ws(t, e) {
  return t && (t[e] || t[$e(e)] || t[Si($e(e))]);
}
function Rn(t, e, n, r) {
  let i;
  const o = n, s = ne(t);
  if (s || Pe(t)) {
    const a = s && /* @__PURE__ */ An(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ st(t), c = /* @__PURE__ */ Jt(t), t = Ti(t)), i = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      i[u] = e(
        l ? c ? Kn(_t(t[u])) : _t(t[u]) : t[u],
        u,
        void 0,
        o
      );
  } else if (typeof t == "number") {
    i = new Array(t);
    for (let a = 0; a < t; a++)
      i[a] = e(a + 1, a, void 0, o);
  } else if (be(t))
    if (t[Symbol.iterator])
      i = Array.from(
        t,
        (a, l) => e(a, l, void 0, o)
      );
    else {
      const a = Object.keys(t);
      i = new Array(a.length);
      for (let l = 0, c = a.length; l < c; l++) {
        const u = a[l];
        i[l] = e(t[u], u, l, o);
      }
    }
  else
    i = [];
  return i;
}
function Q(t, e, n = {}, r, i) {
  if (Fe.ce || Fe.parent && Wn(Fe.parent) && Fe.parent.ce) {
    const c = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), O(), V(
      Ae,
      null,
      [H("slot", n, r && r())],
      c ? -2 : 64
    );
  }
  let o = t[e];
  o && o._c && (o._d = !1), O();
  const s = o && iu(o(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  s && s.key, l = V(
    Ae,
    {
      key: (a && !bt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!s && r ? "_fb" : "")
    },
    s || (r ? r() : []),
    s && t._ === 1 ? 64 : -2
  );
  return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), o && o._c && (o._d = !0), l;
}
function iu(t) {
  return t.some((e) => br(e) ? !(e.type === Be || e.type === Ae && !iu(e.children)) : !0) ? t : null;
}
const Po = (t) => t ? Cu(t) ? Bi(t) : Po(t.parent) : null, dr = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Oe(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Po(t.parent),
    $root: (t) => Po(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => su(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      rs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Ie.bind(t.proxy)),
    $watch: (t) => Ed.bind(t)
  })
), to = (t, e) => t !== me && !t.__isScriptSetup && ye(t, e), Vd = {
  get({ _: t }, e) {
    if (e === "__v_skip")
      return !0;
    const { ctx: n, setupState: r, data: i, props: o, accessCache: s, type: a, appContext: l } = t;
    if (e[0] !== "$") {
      const f = s[e];
      if (f !== void 0)
        switch (f) {
          case 1:
            return r[e];
          case 2:
            return i[e];
          case 4:
            return n[e];
          case 3:
            return o[e];
        }
      else {
        if (to(r, e))
          return s[e] = 1, r[e];
        if (i !== me && ye(i, e))
          return s[e] = 2, i[e];
        if (ye(o, e))
          return s[e] = 3, o[e];
        if (n !== me && ye(n, e))
          return s[e] = 4, n[e];
        Ro && (s[e] = 0);
      }
    }
    const c = dr[e];
    let u, d;
    if (c)
      return e === "$attrs" && Ve(t.attrs, "get", ""), c(t);
    if (
      // css module (injected by vue-loader)
      (u = a.__cssModules) && (u = u[e])
    )
      return u;
    if (n !== me && ye(n, e))
      return s[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ye(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: i, ctx: o } = t;
    return to(i, e) ? (i[e] = n, !0) : r !== me && ye(r, e) ? (r[e] = n, !0) : ye(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (o[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: i, props: o, type: s }
  }, a) {
    let l;
    return !!(n[a] || t !== me && a[0] !== "$" && ye(t, a) || to(e, a) || ye(o, a) || ye(r, a) || ye(dr, a) || ye(i.config.globalProperties, a) || (l = s.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ye(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Wd() {
  return jd().slots;
}
function jd(t) {
  const e = ut();
  return e.setupContext || (e.setupContext = Tu(e));
}
function Oo(t) {
  return ne(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Ud(t, e) {
  const n = Oo(t);
  for (const r in e) {
    if (r.startsWith("__skip")) continue;
    let i = n[r];
    i ? ne(i) || se(i) ? i = n[r] = { type: i, default: e[r] } : i.default = e[r] : i === null && (i = n[r] = { default: e[r] }), i && e[`__skip_${r}`] && (i.skipFactory = !0);
  }
  return n;
}
let Ro = !0;
function Kd(t) {
  const e = su(t), n = t.proxy, r = t.ctx;
  Ro = !1, e.beforeCreate && js(e.beforeCreate, t, "bc");
  const {
    // state
    data: i,
    computed: o,
    methods: s,
    watch: a,
    provide: l,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: d,
    mounted: f,
    beforeUpdate: p,
    updated: h,
    activated: m,
    deactivated: g,
    beforeDestroy: x,
    beforeUnmount: _,
    destroyed: w,
    unmounted: y,
    render: S,
    renderTracked: T,
    renderTriggered: E,
    errorCaptured: D,
    serverPrefetch: A,
    // public API
    expose: k,
    inheritAttrs: $,
    // assets
    components: P,
    directives: W,
    filters: B
  } = e;
  if (c && Xd(c, r, null), s)
    for (const Z in s) {
      const ee = s[Z];
      se(ee) && (r[Z] = ee.bind(n));
    }
  if (i) {
    const Z = i.call(n, n);
    be(Z) && (t.data = /* @__PURE__ */ Rr(Z));
  }
  if (Ro = !0, o)
    for (const Z in o) {
      const ee = o[Z], _e = se(ee) ? ee.bind(n, n) : se(ee.get) ? ee.get.bind(n, n) : Mt, Me = !se(ee) && se(ee.set) ? ee.set.bind(n) : Mt, Je = M({
        get: _e,
        set: Me
      });
      Object.defineProperty(r, Z, {
        enumerable: !0,
        configurable: !0,
        get: () => Je.value,
        set: (Re) => Je.value = Re
      });
    }
  if (a)
    for (const Z in a)
      ou(a[Z], r, n, Z);
  if (l) {
    const Z = se(l) ? l.call(n) : l;
    Reflect.ownKeys(Z).forEach((ee) => {
      Ir(ee, Z[ee]);
    });
  }
  u && js(u, t, "c");
  function re(Z, ee) {
    ne(ee) ? ee.forEach((_e) => Z(_e.bind(n))) : ee && Z(ee.bind(n));
  }
  if (re(Id, d), re(ke, f), re(Md, p), re(Dd, h), re(Od, m), re(Rd, g), re(Nd, D), re(Fd, T), re(Bd, E), re(On, _), re(lt, y), re($d, A), ne(k))
    if (k.length) {
      const Z = t.exposed || (t.exposed = {});
      k.forEach((ee) => {
        Object.defineProperty(Z, ee, {
          get: () => n[ee],
          set: (_e) => n[ee] = _e,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  S && t.render === Mt && (t.render = S), $ != null && (t.inheritAttrs = $), P && (t.components = P), W && (t.directives = W), A && tu(t);
}
function Xd(t, e, n = Mt) {
  ne(t) && (t = Lo(t));
  for (const r in t) {
    const i = t[r];
    let o;
    be(i) ? "default" in i ? o = cn(
      i.from || r,
      i.default,
      !0
    ) : o = cn(i.from || r) : o = cn(i), /* @__PURE__ */ De(o) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => o.value,
      set: (s) => o.value = s
    }) : e[r] = o;
  }
}
function js(t, e, n) {
  wt(
    ne(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function ou(t, e, n, r) {
  let i = r.includes(".") ? Wl(n, r) : () => n[r];
  if (Pe(t)) {
    const o = e[t];
    se(o) && xe(i, o);
  } else if (se(t))
    xe(i, t.bind(n));
  else if (be(t))
    if (ne(t))
      t.forEach((o) => ou(o, e, n, r));
    else {
      const o = se(t.handler) ? t.handler.bind(n) : e[t.handler];
      se(o) && xe(i, o, t);
    }
}
function su(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: i,
    optionsCache: o,
    config: { optionMergeStrategies: s }
  } = t.appContext, a = o.get(e);
  let l;
  return a ? l = a : !i.length && !n && !r ? l = e : (l = {}, i.length && i.forEach(
    (c) => ci(l, c, s, !0)
  ), ci(l, e, s)), be(e) && o.set(e, l), l;
}
function ci(t, e, n, r = !1) {
  const { mixins: i, extends: o } = e;
  o && ci(t, o, n, !0), i && i.forEach(
    (s) => ci(t, s, n, !0)
  );
  for (const s in e)
    if (!(r && s === "expose")) {
      const a = Yd[s] || n && n[s];
      t[s] = a ? a(t[s], e[s]) : e[s];
    }
  return t;
}
const Yd = {
  data: Us,
  props: Ks,
  emits: Ks,
  // objects
  methods: ir,
  computed: ir,
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
  components: ir,
  directives: ir,
  // watch
  watch: Jd,
  // provide / inject
  provide: Us,
  inject: Gd
};
function Us(t, e) {
  return e ? t ? function() {
    return Oe(
      se(t) ? t.call(this, this) : t,
      se(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Gd(t, e) {
  return ir(Lo(t), Lo(e));
}
function Lo(t) {
  if (ne(t)) {
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
function ir(t, e) {
  return t ? Oe(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Ks(t, e) {
  return t ? ne(t) && ne(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Oe(
    /* @__PURE__ */ Object.create(null),
    Oo(t),
    Oo(e ?? {})
  ) : e;
}
function Jd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = Oe(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = Ue(t[r], e[r]);
  return n;
}
function au() {
  return {
    app: null,
    config: {
      isNativeTag: ol,
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
let Zd = 0;
function Qd(t, e) {
  return function(r, i = null) {
    se(r) || (r = Oe({}, r)), i != null && !be(i) && (i = null);
    const o = au(), s = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = o.app = {
      _uid: Zd++,
      _component: r,
      _props: i,
      _container: null,
      _context: o,
      _instance: null,
      version: Rf,
      get config() {
        return o.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return s.has(u) || (u && se(u.install) ? (s.add(u), u.install(c, ...d)) : se(u) && (s.add(u), u(c, ...d))), c;
      },
      mixin(u) {
        return o.mixins.includes(u) || o.mixins.push(u), c;
      },
      component(u, d) {
        return d ? (o.components[u] = d, c) : o.components[u];
      },
      directive(u, d) {
        return d ? (o.directives[u] = d, c) : o.directives[u];
      },
      mount(u, d, f) {
        if (!l) {
          const p = c._ceVNode || H(r, i);
          return p.appContext = o, f === !0 ? f = "svg" : f === !1 && (f = void 0), t(p, u, f), l = !0, c._container = u, u.__vue_app__ = c, Bi(p.component);
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
        return o.provides[u] = d, c;
      },
      runWithContext(u) {
        const d = jn;
        jn = c;
        try {
          return u();
        } finally {
          jn = d;
        }
      }
    };
    return c;
  };
}
let jn = null;
function ef(t, e, n = me) {
  const r = ut(), i = $e(e), o = tt(e), s = lu(t, i), a = Dl((l, c) => {
    let u, d = me, f;
    return Vl(() => {
      const p = t[i];
      Ke(u, p) && (u = p, c());
    }), {
      get() {
        return l(), n.get ? n.get(u) : u;
      },
      set(p) {
        const h = n.set ? n.set(p) : p;
        if (!Ke(h, u) && !(d !== me && Ke(p, d)))
          return;
        const m = r.vnode.props;
        m && // check if parent has passed v-model
        (e in m || i in m || o in m) && (`onUpdate:${e}` in m || `onUpdate:${i}` in m || `onUpdate:${o}` in m) || (u = p, c()), r.emit(`update:${e}`, h), Ke(p, h) && Ke(p, d) && !Ke(h, f) && c(), d = p, f = h;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? s || me : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const lu = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${$e(e)}Modifiers`] || t[`${tt(e)}Modifiers`];
function tf(t, e, ...n) {
  if (t.isUnmounted) return;
  const r = t.vnode.props || me;
  let i = n;
  const o = e.startsWith("update:"), s = o && lu(r, e.slice(7));
  s && (s.trim && (i = n.map((u) => Pe(u) ? u.trim() : u)), s.number && (i = n.map(Bc)));
  let a, l = r[a = Yr(e)] || // also try camelCase event handler (#2249)
  r[a = Yr($e(e))];
  !l && o && (l = r[a = Yr(tt(e))]), l && wt(
    l,
    t,
    6,
    i
  );
  const c = r[a + "Once"];
  if (c) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[a])
      return;
    t.emitted[a] = !0, wt(
      c,
      t,
      6,
      i
    );
  }
}
const nf = /* @__PURE__ */ new WeakMap();
function uu(t, e, n = !1) {
  const r = n ? nf : e.emitsCache, i = r.get(t);
  if (i !== void 0)
    return i;
  const o = t.emits;
  let s = {}, a = !1;
  if (!se(t)) {
    const l = (c) => {
      const u = uu(c, e, !0);
      u && (a = !0, Oe(s, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !o && !a ? (be(t) && r.set(t, null), null) : (ne(o) ? o.forEach((l) => s[l] = null) : Oe(s, o), be(t) && r.set(t, s), s);
}
function Mi(t, e) {
  return !t || !bi(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ye(t, e[0].toLowerCase() + e.slice(1)) || ye(t, tt(e)) || ye(t, e));
}
function Xs(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: i,
    propsOptions: [o],
    slots: s,
    attrs: a,
    emit: l,
    render: c,
    renderCache: u,
    props: d,
    data: f,
    setupState: p,
    ctx: h,
    inheritAttrs: m
  } = t, g = li(t);
  let x, _;
  try {
    if (n.shapeFlag & 4) {
      const y = i || r, S = y;
      x = Rt(
        c.call(
          S,
          y,
          u,
          d,
          p,
          f,
          h
        )
      ), _ = a;
    } else {
      const y = e;
      x = Rt(
        y.length > 1 ? y(
          d,
          { attrs: a, slots: s, emit: l }
        ) : y(
          d,
          null
        )
      ), _ = e.props ? a : rf(a);
    }
  } catch (y) {
    fr.length = 0, Ri(y, t, 1), x = H(Be);
  }
  let w = x;
  if (_ && m !== !1) {
    const y = Object.keys(_), { shapeFlag: S } = w;
    y.length && S & 7 && (o && y.some(Yo) && (_ = of(
      _,
      o
    )), w = Zt(w, _, !1, !0));
  }
  return n.dirs && (w = Zt(w, null, !1, !0), w.dirs = w.dirs ? w.dirs.concat(n.dirs) : n.dirs), n.transition && gr(w, n.transition), x = w, li(g), x;
}
const rf = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || bi(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, of = (t, e) => {
  const n = {};
  for (const r in t)
    (!Yo(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function sf(t, e, n) {
  const { props: r, children: i, component: o } = t, { props: s, children: a, patchFlag: l } = e, c = o.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return r ? Ys(r, s, c) : !!s;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        if (cu(s, r, f) && !Mi(c, f))
          return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable) ? !0 : r === s ? !1 : r ? s ? Ys(r, s, c) : !0 : !!s;
  return !1;
}
function Ys(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (cu(e, t, o) && !Mi(n, o))
      return !0;
  }
  return !1;
}
function cu(t, e, n) {
  const r = t[n], i = e[n];
  return n === "style" && be(r) && be(i) ? !Zo(r, i) : r !== i;
}
function af({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const r = e.subTree;
    if (r.suspense && r.suspense.activeBranch === t && (r.el = t.el), r === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const du = {}, fu = () => Object.create(du), pu = (t) => Object.getPrototypeOf(t) === du;
function lf(t, e, n, r = !1) {
  const i = {}, o = fu();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), hu(t, e, i, o);
  for (const s in t.propsOptions[0])
    s in i || (i[s] = void 0);
  n ? t.props = r ? i : /* @__PURE__ */ ki(i) : t.type.props ? t.props = i : t.props = o, t.attrs = o;
}
function uf(t, e, n, r) {
  const {
    props: i,
    attrs: o,
    vnode: { patchFlag: s }
  } = t, a = /* @__PURE__ */ ve(i), [l] = t.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const u = t.vnode.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        let f = u[d];
        if (Mi(t.emitsOptions, f))
          continue;
        const p = e[f];
        if (l)
          if (ye(o, f))
            p !== o[f] && (o[f] = p, c = !0);
          else {
            const h = $e(f);
            i[h] = Io(
              l,
              a,
              h,
              p,
              t,
              !1
            );
          }
        else
          p !== o[f] && (o[f] = p, c = !0);
      }
    }
  } else {
    hu(t, e, i, o) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ye(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = tt(d)) === d || !ye(e, u))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[d] = Io(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete i[d]);
    if (o !== a)
      for (const d in o)
        (!e || !ye(e, d)) && (delete o[d], c = !0);
  }
  c && Kt(t.attrs, "set", "");
}
function hu(t, e, n, r) {
  const [i, o] = t.propsOptions;
  let s = !1, a;
  if (e)
    for (let l in e) {
      if (sr(l))
        continue;
      const c = e[l];
      let u;
      i && ye(i, u = $e(l)) ? !o || !o.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Mi(t.emitsOptions, l) || (!(l in r) || c !== r[l]) && (r[l] = c, s = !0);
    }
  if (o) {
    const l = /* @__PURE__ */ ve(n), c = a || me;
    for (let u = 0; u < o.length; u++) {
      const d = o[u];
      n[d] = Io(
        i,
        l,
        d,
        c[d],
        t,
        !ye(c, d)
      );
    }
  }
  return s;
}
function Io(t, e, n, r, i, o) {
  const s = t[n];
  if (s != null) {
    const a = ye(s, "default");
    if (a && r === void 0) {
      const l = s.default;
      if (s.type !== Function && !s.skipFactory && se(l)) {
        const { propsDefaults: c } = i;
        if (n in c)
          r = c[n];
        else {
          const u = Dr(i);
          r = c[n] = l.call(
            null,
            e
          ), u();
        }
      } else
        r = l;
      i.ce && i.ce._setProp(n, r);
    }
    s[
      0
      /* shouldCast */
    ] && (o && !a ? r = !1 : s[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === tt(n)) && (r = !0));
  }
  return r;
}
const cf = /* @__PURE__ */ new WeakMap();
function vu(t, e, n = !1) {
  const r = n ? cf : e.propsCache, i = r.get(t);
  if (i)
    return i;
  const o = t.props, s = {}, a = [];
  let l = !1;
  if (!se(t)) {
    const u = (d) => {
      l = !0;
      const [f, p] = vu(d, e, !0);
      Oe(s, f), p && a.push(...p);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!o && !l)
    return be(t) && r.set(t, qn), qn;
  if (ne(o))
    for (let u = 0; u < o.length; u++) {
      const d = $e(o[u]);
      Gs(d) && (s[d] = me);
    }
  else if (o)
    for (const u in o) {
      const d = $e(u);
      if (Gs(d)) {
        const f = o[u], p = s[d] = ne(f) || se(f) ? { type: f } : Oe({}, f), h = p.type;
        let m = !1, g = !0;
        if (ne(h))
          for (let x = 0; x < h.length; ++x) {
            const _ = h[x], w = se(_) && _.name;
            if (w === "Boolean") {
              m = !0;
              break;
            } else w === "String" && (g = !1);
          }
        else
          m = se(h) && h.name === "Boolean";
        p[
          0
          /* shouldCast */
        ] = m, p[
          1
          /* shouldCastTrue */
        ] = g, (m || ye(p, "default")) && a.push(d);
      }
    }
  const c = [s, a];
  return be(t) && r.set(t, c), c;
}
function Gs(t) {
  return t[0] !== "$" && !sr(t);
}
const is = (t) => t === "_" || t === "_ctx" || t === "$stable", os = (t) => ne(t) ? t.map(Rt) : [Rt(t)], df = (t, e, n) => {
  if (e._n)
    return e;
  const r = I((...i) => os(e(...i)), n);
  return r._c = !1, r;
}, mu = (t, e, n) => {
  const r = t._ctx;
  for (const i in t) {
    if (is(i)) continue;
    const o = t[i];
    if (se(o))
      e[i] = df(i, o, r);
    else if (o != null) {
      const s = os(o);
      e[i] = () => s;
    }
  }
}, gu = (t, e) => {
  const n = os(e);
  t.slots.default = () => n;
}, yu = (t, e, n) => {
  for (const r in e)
    (n || !is(r)) && (t[r] = e[r]);
}, ff = (t, e, n) => {
  const r = t.slots = fu();
  if (t.vnode.shapeFlag & 32) {
    const i = e._;
    i ? (yu(r, e, n), n && ul(r, "_", i, !0)) : mu(e, r);
  } else e && gu(t, e);
}, pf = (t, e, n) => {
  const { vnode: r, slots: i } = t;
  let o = !0, s = me;
  if (r.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? o = !1 : yu(i, e, n) : (o = !e.$stable, mu(e, i)), s = e;
  } else e && (gu(t, e), s = { default: 1 });
  if (o)
    for (const a in i)
      !is(a) && s[a] == null && delete i[a];
}, qe = yf;
function hf(t) {
  return vf(t);
}
function vf(t, e) {
  const n = Ci();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: i,
    patchProp: o,
    createElement: s,
    createText: a,
    createComment: l,
    setText: c,
    setElementText: u,
    parentNode: d,
    nextSibling: f,
    setScopeId: p = Mt,
    insertStaticContent: h
  } = t, m = (b, C, R, q = null, F = null, N = null, Y = void 0, U = null, j = !!C.dynamicChildren) => {
    if (b === C)
      return;
    b && !Cn(b, C) && (q = G(b), Re(b, F, N, !0), b = null), C.patchFlag === -2 && (j = !1, C.dynamicChildren = null);
    const { type: z, ref: ie, shapeFlag: J } = C;
    switch (z) {
      case Di:
        g(b, C, R, q);
        break;
      case Be:
        x(b, C, R, q);
        break;
      case ro:
        b == null && _(C, R, q, Y);
        break;
      case Ae:
        P(
          b,
          C,
          R,
          q,
          F,
          N,
          Y,
          U,
          j
        );
        break;
      default:
        J & 1 ? S(
          b,
          C,
          R,
          q,
          F,
          N,
          Y,
          U,
          j
        ) : J & 6 ? W(
          b,
          C,
          R,
          q,
          F,
          N,
          Y,
          U,
          j
        ) : (J & 64 || J & 128) && z.process(
          b,
          C,
          R,
          q,
          F,
          N,
          Y,
          U,
          j,
          he
        );
    }
    ie != null && F ? cr(ie, b && b.ref, N, C || b, !C) : ie == null && b && b.ref != null && cr(b.ref, null, N, b, !0);
  }, g = (b, C, R, q) => {
    if (b == null)
      r(
        C.el = a(C.children),
        R,
        q
      );
    else {
      const F = C.el = b.el;
      C.children !== b.children && c(F, C.children);
    }
  }, x = (b, C, R, q) => {
    b == null ? r(
      C.el = l(C.children || ""),
      R,
      q
    ) : C.el = b.el;
  }, _ = (b, C, R, q) => {
    [b.el, b.anchor] = h(
      b.children,
      C,
      R,
      q,
      b.el,
      b.anchor
    );
  }, w = ({ el: b, anchor: C }, R, q) => {
    let F;
    for (; b && b !== C; )
      F = f(b), r(b, R, q), b = F;
    r(C, R, q);
  }, y = ({ el: b, anchor: C }) => {
    let R;
    for (; b && b !== C; )
      R = f(b), i(b), b = R;
    i(C);
  }, S = (b, C, R, q, F, N, Y, U, j) => {
    if (C.type === "svg" ? Y = "svg" : C.type === "math" && (Y = "mathml"), b == null)
      T(
        C,
        R,
        q,
        F,
        N,
        Y,
        U,
        j
      );
    else {
      const z = b.el && b.el._isVueCE ? b.el : null;
      try {
        z && z._beginPatch(), A(
          b,
          C,
          F,
          N,
          Y,
          U,
          j
        );
      } finally {
        z && z._endPatch();
      }
    }
  }, T = (b, C, R, q, F, N, Y, U) => {
    let j, z;
    const { props: ie, shapeFlag: J, transition: te, dirs: ae } = b;
    if (j = b.el = s(
      b.type,
      N,
      ie && ie.is,
      ie
    ), J & 8 ? u(j, b.children) : J & 16 && D(
      b.children,
      j,
      null,
      q,
      F,
      no(b, N),
      Y,
      U
    ), ae && yn(b, null, q, "created"), E(j, b, b.scopeId, Y, q), ie) {
      for (const Ee in ie)
        Ee !== "value" && !sr(Ee) && o(j, Ee, null, ie[Ee], N, q);
      "value" in ie && o(j, "value", null, ie.value, N), (z = ie.onVnodeBeforeMount) && kt(z, q, b);
    }
    ae && yn(b, null, q, "beforeMount");
    const pe = mf(F, te);
    pe && te.beforeEnter(j), r(j, C, R), ((z = ie && ie.onVnodeMounted) || pe || ae) && qe(() => {
      z && kt(z, q, b), pe && te.enter(j), ae && yn(b, null, q, "mounted");
    }, F);
  }, E = (b, C, R, q, F) => {
    if (R && p(b, R), q)
      for (let N = 0; N < q.length; N++)
        p(b, q[N]);
    if (F) {
      let N = F.subTree;
      if (C === N || wu(N.type) && (N.ssContent === C || N.ssFallback === C)) {
        const Y = F.vnode;
        E(
          b,
          Y,
          Y.scopeId,
          Y.slotScopeIds,
          F.parent
        );
      }
    }
  }, D = (b, C, R, q, F, N, Y, U, j = 0) => {
    for (let z = j; z < b.length; z++) {
      const ie = b[z] = U ? Ut(b[z]) : Rt(b[z]);
      m(
        null,
        ie,
        C,
        R,
        q,
        F,
        N,
        Y,
        U
      );
    }
  }, A = (b, C, R, q, F, N, Y) => {
    const U = C.el = b.el;
    let { patchFlag: j, dynamicChildren: z, dirs: ie } = C;
    j |= b.patchFlag & 16;
    const J = b.props || me, te = C.props || me;
    let ae;
    if (R && bn(R, !1), (ae = te.onVnodeBeforeUpdate) && kt(ae, R, C, b), ie && yn(C, b, R, "beforeUpdate"), R && bn(R, !0), (J.innerHTML && te.innerHTML == null || J.textContent && te.textContent == null) && u(U, ""), z ? k(
      b.dynamicChildren,
      z,
      U,
      R,
      q,
      no(C, F),
      N
    ) : Y || ee(
      b,
      C,
      U,
      null,
      R,
      q,
      no(C, F),
      N,
      !1
    ), j > 0) {
      if (j & 16)
        $(U, J, te, R, F);
      else if (j & 2 && J.class !== te.class && o(U, "class", null, te.class, F), j & 4 && o(U, "style", J.style, te.style, F), j & 8) {
        const pe = C.dynamicProps;
        for (let Ee = 0; Ee < pe.length; Ee++) {
          const Se = pe[Ee], Ze = J[Se], Qe = te[Se];
          (Qe !== Ze || Se === "value") && o(U, Se, Ze, Qe, F, R);
        }
      }
      j & 1 && b.children !== C.children && u(U, C.children);
    } else !Y && z == null && $(U, J, te, R, F);
    ((ae = te.onVnodeUpdated) || ie) && qe(() => {
      ae && kt(ae, R, C, b), ie && yn(C, b, R, "updated");
    }, q);
  }, k = (b, C, R, q, F, N, Y) => {
    for (let U = 0; U < C.length; U++) {
      const j = b[U], z = C[U], ie = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        j.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (j.type === Ae || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Cn(j, z) || // - In the case of a component, it could contain anything.
        j.shapeFlag & 198) ? d(j.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          R
        )
      );
      m(
        j,
        z,
        ie,
        null,
        q,
        F,
        N,
        Y,
        !0
      );
    }
  }, $ = (b, C, R, q, F) => {
    if (C !== R) {
      if (C !== me)
        for (const N in C)
          !sr(N) && !(N in R) && o(
            b,
            N,
            C[N],
            null,
            F,
            q
          );
      for (const N in R) {
        if (sr(N)) continue;
        const Y = R[N], U = C[N];
        Y !== U && N !== "value" && o(b, N, U, Y, F, q);
      }
      "value" in R && o(b, "value", C.value, R.value, F);
    }
  }, P = (b, C, R, q, F, N, Y, U, j) => {
    const z = C.el = b ? b.el : a(""), ie = C.anchor = b ? b.anchor : a("");
    let { patchFlag: J, dynamicChildren: te, slotScopeIds: ae } = C;
    ae && (U = U ? U.concat(ae) : ae), b == null ? (r(z, R, q), r(ie, R, q), D(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      C.children || [],
      R,
      ie,
      F,
      N,
      Y,
      U,
      j
    )) : J > 0 && J & 64 && te && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    b.dynamicChildren && b.dynamicChildren.length === te.length ? (k(
      b.dynamicChildren,
      te,
      R,
      F,
      N,
      Y,
      U
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (C.key != null || F && C === F.subTree) && ss(
      b,
      C,
      !0
      /* shallow */
    )) : ee(
      b,
      C,
      R,
      ie,
      F,
      N,
      Y,
      U,
      j
    );
  }, W = (b, C, R, q, F, N, Y, U, j) => {
    C.slotScopeIds = U, b == null ? C.shapeFlag & 512 ? F.ctx.activate(
      C,
      R,
      q,
      Y,
      j
    ) : B(
      C,
      R,
      q,
      F,
      N,
      Y,
      j
    ) : K(b, C, j);
  }, B = (b, C, R, q, F, N, Y) => {
    const U = b.component = Sf(
      b,
      q,
      F
    );
    if (Li(b) && (U.ctx.renderer = he), Cf(U, !1, Y), U.asyncDep) {
      if (F && F.registerDep(U, re, Y), !b.el) {
        const j = U.subTree = H(Be);
        x(null, j, C, R), b.placeholder = j.el;
      }
    } else
      re(
        U,
        b,
        C,
        R,
        F,
        N,
        Y
      );
  }, K = (b, C, R) => {
    const q = C.component = b.component;
    if (sf(b, C, R))
      if (q.asyncDep && !q.asyncResolved) {
        Z(q, C, R);
        return;
      } else
        q.next = C, q.update();
    else
      C.el = b.el, q.vnode = C;
  }, re = (b, C, R, q, F, N, Y) => {
    const U = () => {
      if (b.isMounted) {
        let { next: J, bu: te, u: ae, parent: pe, vnode: Ee } = b;
        {
          const Tt = bu(b);
          if (Tt) {
            J && (J.el = Ee.el, Z(b, J, Y)), Tt.asyncDep.then(() => {
              qe(() => {
                b.isUnmounted || z();
              }, F);
            });
            return;
          }
        }
        let Se = J, Ze;
        bn(b, !1), J ? (J.el = Ee.el, Z(b, J, Y)) : J = Ee, te && Yi(te), (Ze = J.props && J.props.onVnodeBeforeUpdate) && kt(Ze, pe, J, Ee), bn(b, !0);
        const Qe = Xs(b), Et = b.subTree;
        b.subTree = Qe, m(
          Et,
          Qe,
          // parent may have changed if it's in a teleport
          d(Et.el),
          // anchor may have changed if it's in a fragment
          G(Et),
          b,
          F,
          N
        ), J.el = Qe.el, Se === null && af(b, Qe.el), ae && qe(ae, F), (Ze = J.props && J.props.onVnodeUpdated) && qe(
          () => kt(Ze, pe, J, Ee),
          F
        );
      } else {
        let J;
        const { el: te, props: ae } = C, { bm: pe, m: Ee, parent: Se, root: Ze, type: Qe } = b, Et = Wn(C);
        bn(b, !1), pe && Yi(pe), !Et && (J = ae && ae.onVnodeBeforeMount) && kt(J, Se, C), bn(b, !0);
        {
          Ze.ce && Ze.ce._hasShadowRoot() && Ze.ce._injectChildStyle(Qe);
          const Tt = b.subTree = Xs(b);
          m(
            null,
            Tt,
            R,
            q,
            b,
            F,
            N
          ), C.el = Tt.el;
        }
        if (Ee && qe(Ee, F), !Et && (J = ae && ae.onVnodeMounted)) {
          const Tt = C;
          qe(
            () => kt(J, Se, Tt),
            F
          );
        }
        (C.shapeFlag & 256 || Se && Wn(Se.vnode) && Se.vnode.shapeFlag & 256) && b.a && qe(b.a, F), b.isMounted = !0, C = R = q = null;
      }
    };
    b.scope.on();
    const j = b.effect = new ml(U);
    b.scope.off();
    const z = b.update = j.run.bind(j), ie = b.job = j.runIfDirty.bind(j);
    ie.i = b, ie.id = b.uid, j.scheduler = () => rs(ie), bn(b, !0), z();
  }, Z = (b, C, R) => {
    C.component = b;
    const q = b.vnode.props;
    b.vnode = C, b.next = null, uf(b, C.props, q, R), pf(b, C.children, R), Yt(), Bs(b), Gt();
  }, ee = (b, C, R, q, F, N, Y, U, j = !1) => {
    const z = b && b.children, ie = b ? b.shapeFlag : 0, J = C.children, { patchFlag: te, shapeFlag: ae } = C;
    if (te > 0) {
      if (te & 128) {
        Me(
          z,
          J,
          R,
          q,
          F,
          N,
          Y,
          U,
          j
        );
        return;
      } else if (te & 256) {
        _e(
          z,
          J,
          R,
          q,
          F,
          N,
          Y,
          U,
          j
        );
        return;
      }
    }
    ae & 8 ? (ie & 16 && Ht(z, F, N), J !== z && u(R, J)) : ie & 16 ? ae & 16 ? Me(
      z,
      J,
      R,
      q,
      F,
      N,
      Y,
      U,
      j
    ) : Ht(z, F, N, !0) : (ie & 8 && u(R, ""), ae & 16 && D(
      J,
      R,
      q,
      F,
      N,
      Y,
      U,
      j
    ));
  }, _e = (b, C, R, q, F, N, Y, U, j) => {
    b = b || qn, C = C || qn;
    const z = b.length, ie = C.length, J = Math.min(z, ie);
    let te;
    for (te = 0; te < J; te++) {
      const ae = C[te] = j ? Ut(C[te]) : Rt(C[te]);
      m(
        b[te],
        ae,
        R,
        null,
        F,
        N,
        Y,
        U,
        j
      );
    }
    z > ie ? Ht(
      b,
      F,
      N,
      !0,
      !1,
      J
    ) : D(
      C,
      R,
      q,
      F,
      N,
      Y,
      U,
      j,
      J
    );
  }, Me = (b, C, R, q, F, N, Y, U, j) => {
    let z = 0;
    const ie = C.length;
    let J = b.length - 1, te = ie - 1;
    for (; z <= J && z <= te; ) {
      const ae = b[z], pe = C[z] = j ? Ut(C[z]) : Rt(C[z]);
      if (Cn(ae, pe))
        m(
          ae,
          pe,
          R,
          null,
          F,
          N,
          Y,
          U,
          j
        );
      else
        break;
      z++;
    }
    for (; z <= J && z <= te; ) {
      const ae = b[J], pe = C[te] = j ? Ut(C[te]) : Rt(C[te]);
      if (Cn(ae, pe))
        m(
          ae,
          pe,
          R,
          null,
          F,
          N,
          Y,
          U,
          j
        );
      else
        break;
      J--, te--;
    }
    if (z > J) {
      if (z <= te) {
        const ae = te + 1, pe = ae < ie ? C[ae].el : q;
        for (; z <= te; )
          m(
            null,
            C[z] = j ? Ut(C[z]) : Rt(C[z]),
            R,
            pe,
            F,
            N,
            Y,
            U,
            j
          ), z++;
      }
    } else if (z > te)
      for (; z <= J; )
        Re(b[z], F, N, !0), z++;
    else {
      const ae = z, pe = z, Ee = /* @__PURE__ */ new Map();
      for (z = pe; z <= te; z++) {
        const it = C[z] = j ? Ut(C[z]) : Rt(C[z]);
        it.key != null && Ee.set(it.key, z);
      }
      let Se, Ze = 0;
      const Qe = te - pe + 1;
      let Et = !1, Tt = 0;
      const Zn = new Array(Qe);
      for (z = 0; z < Qe; z++) Zn[z] = 0;
      for (z = ae; z <= J; z++) {
        const it = b[z];
        if (Ze >= Qe) {
          Re(it, F, N, !0);
          continue;
        }
        let At;
        if (it.key != null)
          At = Ee.get(it.key);
        else
          for (Se = pe; Se <= te; Se++)
            if (Zn[Se - pe] === 0 && Cn(it, C[Se])) {
              At = Se;
              break;
            }
        At === void 0 ? Re(it, F, N, !0) : (Zn[At - pe] = z + 1, At >= Tt ? Tt = At : Et = !0, m(
          it,
          C[At],
          R,
          null,
          F,
          N,
          Y,
          U,
          j
        ), Ze++);
      }
      const Ps = Et ? gf(Zn) : qn;
      for (Se = Ps.length - 1, z = Qe - 1; z >= 0; z--) {
        const it = pe + z, At = C[it], Os = C[it + 1], Rs = it + 1 < ie ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Os.el || _u(Os)
        ) : q;
        Zn[z] === 0 ? m(
          null,
          At,
          R,
          Rs,
          F,
          N,
          Y,
          U,
          j
        ) : Et && (Se < 0 || z !== Ps[Se] ? Je(At, R, Rs, 2) : Se--);
      }
    }
  }, Je = (b, C, R, q, F = null) => {
    const { el: N, type: Y, transition: U, children: j, shapeFlag: z } = b;
    if (z & 6) {
      Je(b.component.subTree, C, R, q);
      return;
    }
    if (z & 128) {
      b.suspense.move(C, R, q);
      return;
    }
    if (z & 64) {
      Y.move(b, C, R, he);
      return;
    }
    if (Y === Ae) {
      r(N, C, R);
      for (let J = 0; J < j.length; J++)
        Je(j[J], C, R, q);
      r(b.anchor, C, R);
      return;
    }
    if (Y === ro) {
      w(b, C, R);
      return;
    }
    if (q !== 2 && z & 1 && U)
      if (q === 0)
        U.beforeEnter(N), r(N, C, R), qe(() => U.enter(N), F);
      else {
        const { leave: J, delayLeave: te, afterLeave: ae } = U, pe = () => {
          b.ctx.isUnmounted ? i(N) : r(N, C, R);
        }, Ee = () => {
          N._isLeaving && N[Ot](
            !0
            /* cancelled */
          ), J(N, () => {
            pe(), ae && ae();
          });
        };
        te ? te(N, pe, Ee) : Ee();
      }
    else
      r(N, C, R);
  }, Re = (b, C, R, q = !1, F = !1) => {
    const {
      type: N,
      props: Y,
      ref: U,
      children: j,
      dynamicChildren: z,
      shapeFlag: ie,
      patchFlag: J,
      dirs: te,
      cacheIndex: ae
    } = b;
    if (J === -2 && (F = !1), U != null && (Yt(), cr(U, null, R, b, !0), Gt()), ae != null && (C.renderCache[ae] = void 0), ie & 256) {
      C.ctx.deactivate(b);
      return;
    }
    const pe = ie & 1 && te, Ee = !Wn(b);
    let Se;
    if (Ee && (Se = Y && Y.onVnodeBeforeUnmount) && kt(Se, C, b), ie & 6)
      Jn(b.component, R, q);
    else {
      if (ie & 128) {
        b.suspense.unmount(R, q);
        return;
      }
      pe && yn(b, null, C, "beforeUnmount"), ie & 64 ? b.type.remove(
        b,
        C,
        R,
        he,
        q
      ) : z && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !z.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (N !== Ae || J > 0 && J & 64) ? Ht(
        z,
        C,
        R,
        !1,
        !0
      ) : (N === Ae && J & 384 || !F && ie & 16) && Ht(j, C, R), q && zt(b);
    }
    (Ee && (Se = Y && Y.onVnodeUnmounted) || pe) && qe(() => {
      Se && kt(Se, C, b), pe && yn(b, null, C, "unmounted");
    }, R);
  }, zt = (b) => {
    const { type: C, el: R, anchor: q, transition: F } = b;
    if (C === Ae) {
      qt(R, q);
      return;
    }
    if (C === ro) {
      y(b);
      return;
    }
    const N = () => {
      i(R), F && !F.persisted && F.afterLeave && F.afterLeave();
    };
    if (b.shapeFlag & 1 && F && !F.persisted) {
      const { leave: Y, delayLeave: U } = F, j = () => Y(R, N);
      U ? U(b.el, N, j) : j();
    } else
      N();
  }, qt = (b, C) => {
    let R;
    for (; b !== C; )
      R = f(b), i(b), b = R;
    i(C);
  }, Jn = (b, C, R) => {
    const { bum: q, scope: F, job: N, subTree: Y, um: U, m: j, a: z } = b;
    Js(j), Js(z), q && Yi(q), F.stop(), N && (N.flags |= 8, Re(Y, b, C, R)), U && qe(U, C), qe(() => {
      b.isUnmounted = !0;
    }, C);
  }, Ht = (b, C, R, q = !1, F = !1, N = 0) => {
    for (let Y = N; Y < b.length; Y++)
      Re(b[Y], C, R, q, F);
  }, G = (b) => {
    if (b.shapeFlag & 6)
      return G(b.component.subTree);
    if (b.shapeFlag & 128)
      return b.suspense.next();
    const C = f(b.anchor || b.el), R = C && C[jl];
    return R ? f(R) : C;
  };
  let oe = !1;
  const ue = (b, C, R) => {
    let q;
    b == null ? C._vnode && (Re(C._vnode, null, null, !0), q = C._vnode.component) : m(
      C._vnode || null,
      b,
      C,
      null,
      null,
      null,
      R
    ), C._vnode = b, oe || (oe = !0, Bs(q), Nl(), oe = !1);
  }, he = {
    p: m,
    um: Re,
    m: Je,
    r: zt,
    mt: B,
    mc: D,
    pc: ee,
    pbc: k,
    n: G,
    o: t
  };
  return {
    render: ue,
    hydrate: void 0,
    createApp: Qd(ue)
  };
}
function no({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function bn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function mf(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function ss(t, e, n = !1) {
  const r = t.children, i = e.children;
  if (ne(r) && ne(i))
    for (let o = 0; o < r.length; o++) {
      const s = r[o];
      let a = i[o];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[o] = Ut(i[o]), a.el = s.el), !n && a.patchFlag !== -2 && ss(s, a)), a.type === Di && (a.patchFlag === -1 && (a = i[o] = Ut(a)), a.el = s.el), a.type === Be && !a.el && (a.el = s.el);
    }
}
function gf(t) {
  const e = t.slice(), n = [0];
  let r, i, o, s, a;
  const l = t.length;
  for (r = 0; r < l; r++) {
    const c = t[r];
    if (c !== 0) {
      if (i = n[n.length - 1], t[i] < c) {
        e[r] = i, n.push(r);
        continue;
      }
      for (o = 0, s = n.length - 1; o < s; )
        a = o + s >> 1, t[n[a]] < c ? o = a + 1 : s = a;
      c < t[n[o]] && (o > 0 && (e[r] = n[o - 1]), n[o] = r);
    }
  }
  for (o = n.length, s = n[o - 1]; o-- > 0; )
    n[o] = s, s = e[s];
  return n;
}
function bu(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : bu(e);
}
function Js(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function _u(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? _u(e.subTree) : null;
}
const wu = (t) => t.__isSuspense;
function yf(t, e) {
  e && e.pendingBranch ? ne(t) ? e.effects.push(...t) : e.effects.push(t) : wd(t);
}
const Ae = /* @__PURE__ */ Symbol.for("v-fgt"), Di = /* @__PURE__ */ Symbol.for("v-txt"), Be = /* @__PURE__ */ Symbol.for("v-cmt"), ro = /* @__PURE__ */ Symbol.for("v-stc"), fr = [];
let Ge = null;
function O(t = !1) {
  fr.push(Ge = t ? null : []);
}
function bf() {
  fr.pop(), Ge = fr[fr.length - 1] || null;
}
let Xn = 1;
function di(t, e = !1) {
  Xn += t, t < 0 && Ge && e && (Ge.hasOnce = !0);
}
function xu(t) {
  return t.dynamicChildren = Xn > 0 ? Ge || qn : null, bf(), Xn > 0 && Ge && Ge.push(t), t;
}
function ce(t, e, n, r, i, o) {
  return xu(
    le(
      t,
      e,
      n,
      r,
      i,
      o,
      !0
    )
  );
}
function V(t, e, n, r, i) {
  return xu(
    H(
      t,
      e,
      n,
      r,
      i,
      !0
    )
  );
}
function br(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Cn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const Su = ({ key: t }) => t ?? null, Zr = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Pe(t) || /* @__PURE__ */ De(t) || se(t) ? { i: Fe, r: t, k: e, f: !!n } : t : null);
function le(t, e = null, n = null, r = 0, i = null, o = t === Ae ? 0 : 1, s = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Su(e),
    ref: e && Zr(e),
    scopeId: ql,
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
    shapeFlag: o,
    patchFlag: r,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Fe
  };
  return a ? (as(l, n), o & 128 && t.normalize(l)) : n && (l.shapeFlag |= Pe(n) ? 8 : 16), Xn > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  Ge && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ge.push(l), l;
}
const H = _f;
function _f(t, e = null, n = null, r = 0, i = null, o = !1) {
  if ((!t || t === ru) && (t = Be), br(t)) {
    const a = Zt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && as(a, n), Xn > 0 && !o && Ge && (a.shapeFlag & 6 ? Ge[Ge.indexOf(t)] = a : Ge.push(a)), a.patchFlag = -2, a;
  }
  if (kf(t) && (t = t.__vccOpts), e) {
    e = $i(e);
    let { class: a, style: l } = e;
    a && !Pe(a) && (e.class = fn(a)), be(l) && (/* @__PURE__ */ Oi(l) && !ne(l) && (l = Oe({}, l)), e.style = nt(l));
  }
  const s = Pe(t) ? 1 : wu(t) ? 128 : Ul(t) ? 64 : be(t) ? 4 : se(t) ? 2 : 0;
  return le(
    t,
    e,
    n,
    r,
    i,
    s,
    o,
    !0
  );
}
function $i(t) {
  return t ? /* @__PURE__ */ Oi(t) || pu(t) ? Oe({}, t) : t : null;
}
function Zt(t, e, n = !1, r = !1) {
  const { props: i, ref: o, patchFlag: s, children: a, transition: l } = t, c = e ? de(i || {}, e) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && Su(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && o ? ne(o) ? o.concat(Zr(e)) : [o, Zr(e)] : Zr(e)
    ) : o,
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
    patchFlag: e && t.type !== Ae ? s === -1 ? 16 : s | 16 : s,
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
    ssContent: t.ssContent && Zt(t.ssContent),
    ssFallback: t.ssFallback && Zt(t.ssFallback),
    placeholder: t.placeholder,
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
  return l && r && gr(
    u,
    l.clone(u)
  ), u;
}
function je(t = " ", e = 0) {
  return H(Di, null, t, e);
}
function fe(t = "", e = !1) {
  return e ? (O(), V(Be, null, t)) : H(Be, null, t);
}
function Rt(t) {
  return t == null || typeof t == "boolean" ? H(Be) : ne(t) ? H(
    Ae,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : br(t) ? Ut(t) : H(Di, null, String(t));
}
function Ut(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Zt(t);
}
function as(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (ne(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const i = e.default;
      i && (i._c && (i._d = !1), as(t, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = e._;
      !i && !pu(e) ? e._ctx = Fe : i === 3 && Fe && (Fe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else se(e) ? (e = { default: e, _ctx: Fe }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [je(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function de(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const i in r)
      if (i === "class")
        e.class !== r.class && (e.class = fn([e.class, r.class]));
      else if (i === "style")
        e.style = nt([e.style, r.style]);
      else if (bi(i)) {
        const o = e[i], s = r[i];
        s && o !== s && !(ne(o) && o.includes(s)) && (e[i] = o ? [].concat(o, s) : s);
      } else i !== "" && (e[i] = r[i]);
  }
  return e;
}
function kt(t, e, n, r = null) {
  wt(t, e, 7, [
    n,
    r
  ]);
}
const wf = au();
let xf = 0;
function Sf(t, e, n) {
  const r = t.type, i = (e ? e.appContext : t.appContext) || wf, o = {
    uid: xf++,
    vnode: t,
    type: r,
    parent: e,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new pl(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(i.provides),
    ids: e ? e.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: vu(r, i),
    emitsOptions: uu(r, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: me,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
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
  return o.ctx = { _: o }, o.root = e ? e.root : o, o.emit = tf.bind(null, o), t.ce && t.ce(o), o;
}
let We = null;
const ut = () => We || Fe;
let fi, Mo;
{
  const t = Ci(), e = (n, r) => {
    let i;
    return (i = t[n]) || (i = t[n] = []), i.push(r), (o) => {
      i.length > 1 ? i.forEach((s) => s(o)) : i[0](o);
    };
  };
  fi = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => We = n
  ), Mo = e(
    "__VUE_SSR_SETTERS__",
    (n) => _r = n
  );
}
const Dr = (t) => {
  const e = We;
  return fi(t), t.scope.on(), () => {
    t.scope.off(), fi(e);
  };
}, Zs = () => {
  We && We.scope.off(), fi(null);
};
function Cu(t) {
  return t.vnode.shapeFlag & 4;
}
let _r = !1;
function Cf(t, e = !1, n = !1) {
  e && Mo(e);
  const { props: r, children: i } = t.vnode, o = Cu(t);
  lf(t, r, o, e), ff(t, i, n || e);
  const s = o ? Ef(t, e) : void 0;
  return e && Mo(!1), s;
}
function Ef(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Vd);
  const { setup: r } = n;
  if (r) {
    Yt();
    const i = t.setupContext = r.length > 1 ? Tu(t) : null, o = Dr(t), s = Lr(
      r,
      t,
      0,
      [
        t.props,
        i
      ]
    ), a = al(s);
    if (Gt(), o(), (a || t.sp) && !Wn(t) && tu(t), a) {
      if (s.then(Zs, Zs), e)
        return s.then((l) => {
          Qs(t, l);
        }).catch((l) => {
          Ri(l, t, 0);
        });
      t.asyncDep = s;
    } else
      Qs(t, s);
  } else
    Eu(t);
}
function Qs(t, e, n) {
  se(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = Ml(e)), Eu(t);
}
function Eu(t, e, n) {
  const r = t.type;
  t.render || (t.render = r.render || Mt);
  {
    const i = Dr(t);
    Yt();
    try {
      Kd(t);
    } finally {
      Gt(), i();
    }
  }
}
const Tf = {
  get(t, e) {
    return Ve(t, "get", ""), t[e];
  }
};
function Tu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, Tf),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Bi(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(Ml(Ll(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in dr)
        return dr[n](t);
    },
    has(e, n) {
      return n in e || n in dr;
    }
  })) : t.proxy;
}
function Af(t, e = !0) {
  return se(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function kf(t) {
  return se(t) && "__vccOpts" in t;
}
const M = (t, e) => /* @__PURE__ */ md(t, e, _r);
function yt(t, e, n) {
  try {
    di(-1);
    const r = arguments.length;
    return r === 2 ? be(e) && !ne(e) ? br(e) ? H(t, null, [e]) : H(t, e) : H(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && br(n) && (n = [n]), H(t, e, n));
  } finally {
    di(1);
  }
}
function Pf(t, e, n, r) {
  const i = n[r];
  if (i && Of(i, t))
    return i;
  const o = e();
  return o.memo = t.slice(), o.cacheIndex = r, n[r] = o;
}
function Of(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let r = 0; r < n.length; r++)
    if (Ke(n[r], e[r]))
      return !1;
  return Xn > 0 && Ge && Ge.push(t), !0;
}
const Rf = "3.5.28";
let Do;
const ea = typeof window < "u" && window.trustedTypes;
if (ea)
  try {
    Do = /* @__PURE__ */ ea.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const Au = Do ? (t) => Do.createHTML(t) : (t) => t, Lf = "http://www.w3.org/2000/svg", If = "http://www.w3.org/1998/Math/MathML", jt = typeof document < "u" ? document : null, ta = jt && /* @__PURE__ */ jt.createElement("template"), Mf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const i = e === "svg" ? jt.createElementNS(Lf, t) : e === "mathml" ? jt.createElementNS(If, t) : n ? jt.createElement(t, { is: n }) : jt.createElement(t);
    return t === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
  },
  createText: (t) => jt.createTextNode(t),
  createComment: (t) => jt.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => jt.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, r, i, o) {
    const s = n ? n.previousSibling : e.lastChild;
    if (i && (i === o || i.nextSibling))
      for (; e.insertBefore(i.cloneNode(!0), n), !(i === o || !(i = i.nextSibling)); )
        ;
    else {
      ta.innerHTML = Au(
        r === "svg" ? `<svg>${t}</svg>` : r === "mathml" ? `<math>${t}</math>` : t
      );
      const a = ta.content;
      if (r === "svg" || r === "mathml") {
        const l = a.firstChild;
        for (; l.firstChild; )
          a.appendChild(l.firstChild);
        a.removeChild(l);
      }
      e.insertBefore(a, n);
    }
    return [
      // first
      s ? s.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
}, on = "transition", tr = "animation", wr = /* @__PURE__ */ Symbol("_vtc"), ku = {
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
}, Df = /* @__PURE__ */ Oe(
  {},
  Yl,
  ku
), $f = (t) => (t.displayName = "Transition", t.props = Df, t), Bf = /* @__PURE__ */ $f(
  (t, { slots: e }) => yt(Pd, Ff(t), e)
), _n = (t, e = []) => {
  ne(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, na = (t) => t ? ne(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Ff(t) {
  const e = {};
  for (const P in t)
    P in ku || (e[P] = t[P]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: r,
    duration: i,
    enterFromClass: o = `${n}-enter-from`,
    enterActiveClass: s = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = o,
    appearActiveClass: c = s,
    appearToClass: u = a,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: p = `${n}-leave-to`
  } = t, h = Nf(i), m = h && h[0], g = h && h[1], {
    onBeforeEnter: x,
    onEnter: _,
    onEnterCancelled: w,
    onLeave: y,
    onLeaveCancelled: S,
    onBeforeAppear: T = x,
    onAppear: E = _,
    onAppearCancelled: D = w
  } = e, A = (P, W, B, K) => {
    P._enterCancelled = K, wn(P, W ? u : a), wn(P, W ? c : s), B && B();
  }, k = (P, W) => {
    P._isLeaving = !1, wn(P, d), wn(P, p), wn(P, f), W && W();
  }, $ = (P) => (W, B) => {
    const K = P ? E : _, re = () => A(W, P, B);
    _n(K, [W, re]), ra(() => {
      wn(W, P ? l : o), Wt(W, P ? u : a), na(K) || ia(W, r, m, re);
    });
  };
  return Oe(e, {
    onBeforeEnter(P) {
      _n(x, [P]), Wt(P, o), Wt(P, s);
    },
    onBeforeAppear(P) {
      _n(T, [P]), Wt(P, l), Wt(P, c);
    },
    onEnter: $(!1),
    onAppear: $(!0),
    onLeave(P, W) {
      P._isLeaving = !0;
      const B = () => k(P, W);
      Wt(P, d), P._enterCancelled ? (Wt(P, f), aa(P)) : (aa(P), Wt(P, f)), ra(() => {
        P._isLeaving && (wn(P, d), Wt(P, p), na(y) || ia(P, r, g, B));
      }), _n(y, [P, B]);
    },
    onEnterCancelled(P) {
      A(P, !1, void 0, !0), _n(w, [P]);
    },
    onAppearCancelled(P) {
      A(P, !0, void 0, !0), _n(D, [P]);
    },
    onLeaveCancelled(P) {
      k(P), _n(S, [P]);
    }
  });
}
function Nf(t) {
  if (t == null)
    return null;
  if (be(t))
    return [io(t.enter), io(t.leave)];
  {
    const e = io(t);
    return [e, e];
  }
}
function io(t) {
  return xo(t);
}
function Wt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[wr] || (t[wr] = /* @__PURE__ */ new Set())).add(e);
}
function wn(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const n = t[wr];
  n && (n.delete(e), n.size || (t[wr] = void 0));
}
function ra(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let zf = 0;
function ia(t, e, n, r) {
  const i = t._endId = ++zf, o = () => {
    i === t._endId && r();
  };
  if (n != null)
    return setTimeout(o, n);
  const { type: s, timeout: a, propCount: l } = qf(t, e);
  if (!s)
    return r();
  const c = s + "end";
  let u = 0;
  const d = () => {
    t.removeEventListener(c, f), o();
  }, f = (p) => {
    p.target === t && ++u >= l && d();
  };
  setTimeout(() => {
    u < l && d();
  }, a + 1), t.addEventListener(c, f);
}
function qf(t, e) {
  const n = window.getComputedStyle(t), r = (h) => (n[h] || "").split(", "), i = r(`${on}Delay`), o = r(`${on}Duration`), s = oa(i, o), a = r(`${tr}Delay`), l = r(`${tr}Duration`), c = oa(a, l);
  let u = null, d = 0, f = 0;
  e === on ? s > 0 && (u = on, d = s, f = o.length) : e === tr ? c > 0 && (u = tr, d = c, f = l.length) : (d = Math.max(s, c), u = d > 0 ? s > c ? on : tr : null, f = u ? u === on ? o.length : l.length : 0);
  const p = u === on && /\b(?:transform|all)(?:,|$)/.test(
    r(`${on}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: f,
    hasTransform: p
  };
}
function oa(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => sa(n) + sa(t[r])));
}
function sa(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function aa(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function Hf(t, e, n) {
  const r = t[wr];
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const pi = /* @__PURE__ */ Symbol("_vod"), Pu = /* @__PURE__ */ Symbol("_vsh"), Vf = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[pi] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : nr(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: r }) {
    !e != !n && (r ? e ? (r.beforeEnter(t), nr(t, !0), r.enter(t)) : r.leave(t, () => {
      nr(t, !1);
    }) : nr(t, e));
  },
  beforeUnmount(t, { value: e }) {
    nr(t, e);
  }
};
function nr(t, e) {
  t.style.display = e ? t[pi] : "none", t[Pu] = !e;
}
const Wf = /* @__PURE__ */ Symbol(""), jf = /(?:^|;)\s*display\s*:/;
function Uf(t, e, n) {
  const r = t.style, i = Pe(n);
  let o = !1;
  if (n && !i) {
    if (e)
      if (Pe(e))
        for (const s of e.split(";")) {
          const a = s.slice(0, s.indexOf(":")).trim();
          n[a] == null && Qr(r, a, "");
        }
      else
        for (const s in e)
          n[s] == null && Qr(r, s, "");
    for (const s in n)
      s === "display" && (o = !0), Qr(r, s, n[s]);
  } else if (i) {
    if (e !== n) {
      const s = r[Wf];
      s && (n += ";" + s), r.cssText = n, o = jf.test(n);
    }
  } else e && t.removeAttribute("style");
  pi in t && (t[pi] = o ? r.display : "", t[Pu] && (r.display = "none"));
}
const la = /\s*!important$/;
function Qr(t, e, n) {
  if (ne(n))
    n.forEach((r) => Qr(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = Kf(t, e);
    la.test(n) ? t.setProperty(
      tt(r),
      n.replace(la, ""),
      "important"
    ) : t[r] = n;
  }
}
const ua = ["Webkit", "Moz", "ms"], oo = {};
function Kf(t, e) {
  const n = oo[e];
  if (n)
    return n;
  let r = $e(e);
  if (r !== "filter" && r in t)
    return oo[e] = r;
  r = Si(r);
  for (let i = 0; i < ua.length; i++) {
    const o = ua[i] + r;
    if (o in t)
      return oo[e] = o;
  }
  return e;
}
const ca = "http://www.w3.org/1999/xlink";
function da(t, e, n, r, i, o = Vc(e)) {
  r && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(ca, e.slice(6, e.length)) : t.setAttributeNS(ca, e, n) : n == null || o && !cl(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    o ? "" : bt(n) ? String(n) : n
  );
}
function fa(t, e, n, r, i) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? Au(n) : n);
    return;
  }
  const o = t.tagName;
  if (e === "value" && o !== "PROGRESS" && // custom elements may use _value internally
  !o.includes("-")) {
    const a = o === "OPTION" ? t.getAttribute("value") || "" : t.value, l = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      t.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== l || !("_value" in t)) && (t.value = l), n == null && t.removeAttribute(e), t._value = n;
    return;
  }
  let s = !1;
  if (n === "" || n == null) {
    const a = typeof t[e];
    a === "boolean" ? n = cl(n) : n == null && a === "string" ? (n = "", s = !0) : a === "number" && (n = 0, s = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  s && t.removeAttribute(i || e);
}
function Xf(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function Yf(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
const pa = /* @__PURE__ */ Symbol("_vei");
function Gf(t, e, n, r, i = null) {
  const o = t[pa] || (t[pa] = {}), s = o[e];
  if (r && s)
    s.value = r;
  else {
    const [a, l] = Jf(e);
    if (r) {
      const c = o[e] = ep(
        r,
        i
      );
      Xf(t, a, c, l);
    } else s && (Yf(t, a, s, l), o[e] = void 0);
  }
}
const ha = /(?:Once|Passive|Capture)$/;
function Jf(t) {
  let e;
  if (ha.test(t)) {
    e = {};
    let r;
    for (; r = t.match(ha); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : tt(t.slice(2)), e];
}
let so = 0;
const Zf = /* @__PURE__ */ Promise.resolve(), Qf = () => so || (Zf.then(() => so = 0), so = Date.now());
function ep(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    wt(
      tp(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = Qf(), n;
}
function tp(t, e) {
  if (ne(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (r) => (i) => !i._stopped && r && r(i)
    );
  } else
    return e;
}
const va = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, np = (t, e, n, r, i, o) => {
  const s = i === "svg";
  e === "class" ? Hf(t, r, s) : e === "style" ? Uf(t, n, r) : bi(e) ? Yo(e) || Gf(t, e, n, r, o) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : rp(t, e, r, s)) ? (fa(t, e, r), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && da(t, e, r, s, o, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !Pe(r)) ? fa(t, $e(e), r, o, e) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), da(t, e, r, s));
};
function rp(t, e, n, r) {
  if (r)
    return !!(e === "innerHTML" || e === "textContent" || e in t && va(e) && se(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const i = t.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return va(e) && Pe(n) ? !1 : e in t;
}
const ma = {};
// @__NO_SIDE_EFFECTS__
function ip(t, e, n) {
  let r = /* @__PURE__ */ X(t, e);
  _i(r) && (r = Oe({}, r, e));
  class i extends ls {
    constructor(s) {
      super(r, s, n);
    }
  }
  return i.def = r, i;
}
const op = typeof HTMLElement < "u" ? HTMLElement : class {
};
class ls extends op {
  constructor(e, n = {}, r = ya) {
    super(), this._def = e, this._props = n, this._createApp = r, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && r !== ya ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
      Oe({}, e.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this;
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let e = this;
    for (; e = e && (e.parentNode || e.host); )
      if (e instanceof ls) {
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
    this._connected = !1, Ie(() => {
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
    for (let r = 0; r < this.attributes.length; r++)
      this._setAttr(this.attributes[r].name);
    this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
    const e = (r, i = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: o, styles: s } = r;
      let a;
      if (o && !ne(o))
        for (const l in o) {
          const c = o[l];
          (c === Number || c && c.type === Number) && (l in this._props && (this._props[l] = xo(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[$e(l)] = !0);
        }
      this._numberProps = a, this._resolveProps(r), this.shadowRoot && this._applyStyles(s), this._mount(r);
    }, n = this._def.__asyncLoader;
    n ? this._pendingResolve = n().then((r) => {
      r.configureApp = this._def.configureApp, e(this._def = r, !0);
    }) : e(this._def);
  }
  _mount(e) {
    this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const n = this._instance && this._instance.exposed;
    if (n)
      for (const r in n)
        ye(this, r) || Object.defineProperty(this, r, {
          // unwrap ref to be consistent with public instance behavior
          get: () => v(n[r])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, r = ne(n) ? n : Object.keys(n || {});
    for (const i of Object.keys(this))
      i[0] !== "_" && r.includes(i) && this._setProp(i, this[i]);
    for (const i of r.map($e))
      Object.defineProperty(this, i, {
        get() {
          return this._getProp(i);
        },
        set(o) {
          this._setProp(i, o, !0, !this._patching);
        }
      });
  }
  _setAttr(e) {
    if (e.startsWith("data-v-")) return;
    const n = this.hasAttribute(e);
    let r = n ? this.getAttribute(e) : ma;
    const i = $e(e);
    n && this._numberProps && this._numberProps[i] && (r = xo(r)), this._setProp(i, r, !1, !0);
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
  _setProp(e, n, r = !0, i = !1) {
    if (n !== this._props[e] && (this._dirty = !0, n === ma ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), i && this._instance && this._update(), r)) {
      const o = this._ob;
      o && (this._processMutations(o.takeRecords()), o.disconnect()), n === !0 ? this.setAttribute(tt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(tt(e), n + "") : n || this.removeAttribute(tt(e)), o && o.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), cp(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = H(this._def, Oe(e, this._props));
    return this._instance || (n.ce = (r) => {
      this._instance = r, r.ce = this, r.isCE = !0;
      const i = (o, s) => {
        this.dispatchEvent(
          new CustomEvent(
            o,
            _i(s[0]) ? Oe({ detail: s }, s[0]) : { detail: s }
          )
        );
      };
      r.emit = (o, ...s) => {
        i(o, s), tt(o) !== o && i(tt(o), s);
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
    const r = this._nonce;
    for (let i = e.length - 1; i >= 0; i--) {
      const o = document.createElement("style");
      r && o.setAttribute("nonce", r), o.textContent = e[i], this.shadowRoot.prepend(o);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const e = this._slots = {};
    let n;
    for (; n = this.firstChild; ) {
      const r = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (e[r] || (e[r] = [])).push(n), this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const e = this._getSlots(), n = this._instance.type.__scopeId;
    for (let r = 0; r < e.length; r++) {
      const i = e[r], o = i.getAttribute("name") || "default", s = this._slots[o], a = i.parentNode;
      if (s)
        for (const l of s) {
          if (n && l.nodeType === 1) {
            const c = n + "-s", u = document.createTreeWalker(l, 1);
            l.setAttribute(c, "");
            let d;
            for (; d = u.nextNode(); )
              d.setAttribute(c, "");
          }
          a.insertBefore(l, i);
        }
      else
        for (; i.firstChild; ) a.insertBefore(i.firstChild, i);
      a.removeChild(i);
    }
  }
  /**
   * @internal
   */
  _getSlots() {
    const e = [this];
    this._teleportTargets && e.push(...this._teleportTargets);
    const n = /* @__PURE__ */ new Set();
    for (const r of e) {
      const i = r.querySelectorAll("slot");
      for (let o = 0; o < i.length; o++)
        n.add(i[o]);
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
const sp = ["ctrl", "shift", "alt", "meta"], ap = {
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
  exact: (t, e) => sp.some((n) => t[`${n}Key`] && !e.includes(n))
}, dn = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), r = e.join(".");
  return n[r] || (n[r] = ((i, ...o) => {
    for (let s = 0; s < e.length; s++) {
      const a = ap[e[s]];
      if (a && a(i, e)) return;
    }
    return t(i, ...o);
  }));
}, lp = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, xr = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), r = e.join(".");
  return n[r] || (n[r] = ((i) => {
    if (!("key" in i))
      return;
    const o = tt(i.key);
    if (e.some(
      (s) => s === o || lp[s] === o
    ))
      return t(i);
  }));
}, up = /* @__PURE__ */ Oe({ patchProp: np }, Mf);
let ga;
function Ou() {
  return ga || (ga = hf(up));
}
const cp = ((...t) => {
  Ou().render(...t);
}), ya = ((...t) => {
  const e = Ou().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const i = fp(r);
    if (!i) return;
    const o = e._component;
    !se(o) && !o.render && !o.template && (o.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const s = n(i, !1, dp(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), s;
  }, e;
});
function dp(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function fp(t) {
  return Pe(t) ? document.querySelector(t) : t;
}
const pp = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ba = (t) => t === "";
const hp = (...t) => t.filter((e, n, r) => !!e && e.trim() !== "" && r.indexOf(e) === n).join(" ").trim();
const _a = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const vp = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const mp = (t) => {
  const e = vp(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var rr = {
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
const gp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": o,
  size: s = rr.width,
  color: a = rr.stroke,
  ...l
}, { slots: c }) => yt(
  "svg",
  {
    ...rr,
    ...l,
    width: s,
    height: s,
    stroke: a,
    "stroke-width": ba(n) || ba(r) || n === !0 || r === !0 ? Number(i || o || rr["stroke-width"]) * 24 / Number(s) : i || o || rr["stroke-width"],
    class: hp(
      "lucide",
      l.class,
      ...t ? [`lucide-${_a(mp(t))}-icon`, `lucide-${_a(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !pp(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => yt(...u)), ...c.default ? [c.default()] : []]
);
const ct = (t, e) => (n, { slots: r, attrs: i }) => yt(
  gp,
  {
    ...i,
    ...n,
    iconNode: e,
    name: t
  },
  r
);
const yp = ct("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Ru = ct("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const bp = ct("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const wa = ct("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const _p = ct("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const wp = ct("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const xp = ct("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Sp = ct("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Cp = ct("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Ep = ct("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Tp = ct("volume-2", [
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
const Ap = ct("volume-x", [
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
const Lu = ct("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), kp = ["aria-label"], Pp = /* @__PURE__ */ X({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (O(), ce("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      Q(e.$slots, "default", {}, void 0, !0)
    ], 8, kp));
  }
}), Op = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", rt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, i] of e)
    n[r] = i;
  return n;
}, $o = /* @__PURE__ */ rt(Pp, [["styles", [Op]], ["__scopeId", "data-v-3d3f8eba"]]), Rp = ["disabled", "aria-label"], Lp = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, Ip = /* @__PURE__ */ X({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary", type: String },
    size: { default: "md", type: String },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = Wd(), r = M(() => !!n.icon && !n.default), i = M(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      r.value && "editor-btn--icon-only"
    ]);
    return (o, s) => (O(), ce("button", {
      type: "button",
      class: fn(i.value),
      disabled: t.disabled,
      "aria-label": t.ariaLabel
    }, [
      o.$slots.icon ? (O(), ce("span", Lp, [
        Q(o.$slots, "icon", {}, void 0, !0)
      ])) : fe("", !0),
      Q(o.$slots, "default", {}, void 0, !0)
    ], 10, Rp));
  }
}), Mp = ".editor-btn[data-v-9ebbb489]{display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-xs);font-family:var(--font-family);font-weight:500;border:none;border-radius:var(--radius-md);cursor:pointer;transition:background-color var(--transition-duration),color var(--transition-duration);white-space:nowrap}.editor-btn[data-v-9ebbb489]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-9ebbb489]:disabled{opacity:.5;cursor:default;pointer-events:none}.editor-btn--sm[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-xs);height:28px}.editor-btn--md[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-sm);height:32px}.editor-btn--sm .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:14px;height:14px}.editor-btn--md .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:16px;height:16px}.editor-btn--icon-only.editor-btn--sm[data-v-9ebbb489]{width:28px;padding:0}.editor-btn--icon-only.editor-btn--md[data-v-9ebbb489]{width:32px;padding:0}.editor-btn--primary[data-v-9ebbb489]{color:var(--color-white);background-color:var(--color-primary)}.editor-btn--primary[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-primary-hover)}.editor-btn--secondary[data-v-9ebbb489],.editor-btn--ghost[data-v-9ebbb489]{color:var(--color-text-secondary);background:none}.editor-btn--secondary[data-v-9ebbb489]{border:1px solid var(--color-border)}.editor-btn--secondary[data-v-9ebbb489]:hover:not(:disabled),.editor-btn--ghost[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-surface-hover)}", Lt = /* @__PURE__ */ rt(Ip, [["styles", [Mp]], ["__scopeId", "data-v-9ebbb489"]]), Iu = {
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
}, Dp = {
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
}, xa = { fr: Iu, en: Dp }, Mu = /* @__PURE__ */ Symbol("i18n");
function $p(t) {
  const e = M(() => {
    const r = xa[t.value] ?? xa.fr;
    return (i) => r[i] ?? i;
  }), n = {
    t: (r) => e.value(r),
    locale: t
  };
  return Ir(Mu, n), n;
}
function Ft() {
  const t = cn(Mu);
  if (t) return t;
  const e = M(() => "fr");
  return {
    t: (n) => Iu[n] ?? n,
    locale: e
  };
}
function Bp(t, e) {
  const n = t.replace("#", ""), r = parseInt(n.substring(0, 2), 16), i = parseInt(n.substring(2, 4), 16), o = parseInt(n.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${o}, ${e})`;
}
function us(t, e, n = "*") {
  if (t === "*") return n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(t) ?? t;
  } catch {
    return t;
  }
}
function Du(t, e, n, r = "*") {
  return t.map((i) => ({
    value: i.id,
    label: i.languages.map((o) => us(o, e, r)).join(", ") + (i.isSource ? ` (${n})` : "")
  }));
}
function Fp(t, e = 250) {
  let n = !1, r = null;
  return (...i) => {
    if (n) {
      r = i;
      return;
    }
    n = !0, t(...i), setTimeout(() => {
      if (n = !1, r !== null) {
        const o = r;
        r = null, t(...o);
      }
    }, e);
  };
}
function hi(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, o = String(r).padStart(2, "0"), s = String(i).padStart(2, "0");
  return n > 0 ? `${n}:${o}:${s}` : `${o}:${s}`;
}
class et extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Np(t) {
  if (t == null || typeof t != "object")
    throw new et("document", "must be a non-null object");
  const e = t;
  if (typeof e.title != "string")
    throw new et("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new et("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new et("document.channels", "must be an array");
  for (let n = 0; n < e.channels.length; n++) {
    const r = e.channels[n], i = `channels[${n}]`;
    if (r == null || typeof r != "object")
      throw new et(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new et(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new et(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new et(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new et(`${i}.translations`, "must be an array");
    for (let o = 0; o < r.translations.length; o++) {
      const s = r.translations[o], a = `${i}.translations[${o}]`;
      if (s == null || typeof s != "object")
        throw new et(a, "must be a non-null object");
      if (typeof s.id != "string")
        throw new et(`${a}.id`, "must be a string");
      if (!Array.isArray(s.languages))
        throw new et(`${a}.languages`, "must be an array");
      if (typeof s.isSource != "boolean")
        throw new et(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(s.turns))
        throw new et(`${a}.turns`, "must be an array");
    }
  }
}
function zp(t, e) {
  const { width: n, height: r } = e.canvas, i = t[0], o = i.length / n, s = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += s * 2) {
    const l = Math.floor(a * o), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + s, 0), u = u + s, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + s, 0);
  }
  e.stroke(), e.closePath();
}
function $u(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function qp(t, e) {
  if (!$u(t)) return null;
  let n = 0, r = t.length - 1;
  for (; n <= r; ) {
    const i = n + r >>> 1, o = t[i];
    if (e < o.startTime)
      r = i - 1;
    else if (e > o.endTime)
      n = i + 1;
    else
      return o.id;
  }
  return null;
}
const Hp = { class: "editor-header" }, Vp = { class: "header-left" }, Wp = { class: "document-title" }, jp = { class: "badges" }, Up = ["datetime"], Kp = { class: "header-right" }, Xp = /* @__PURE__ */ X({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: r } = Ft(), i = M(() => us(e.language, r.value, n("language.wildcard"))), o = M(() => hi(e.duration)), s = M(() => e.title.replace(/-/g, " "));
    return (a, l) => (O(), ce("header", Hp, [
      le("div", Vp, [
        le("h1", Wp, we(s.value), 1),
        le("div", jp, [
          H($o, null, {
            default: I(() => [
              je(we(i.value), 1)
            ]),
            _: 1
          }),
          H($o, null, {
            default: I(() => [
              le("time", {
                datetime: `PT${t.duration}S`
              }, we(o.value), 9, Up)
            ]),
            _: 1
          })
        ])
      ]),
      le("div", Kp, [
        t.isMobile ? (O(), V(Lt, {
          key: 0,
          variant: "ghost",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: I(() => [
            H(v(Ep), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : fe("", !0),
        t.isMobile ? (O(), V(Lt, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, {
          icon: I(() => [
            H(v(wa), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (O(), V(Lt, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: I(() => [
            H(v(wa), { size: 16 })
          ]),
          default: I(() => [
            je(" " + we(v(n)("header.export")), 1)
          ]),
          _: 1
        })),
        H(Lt, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(n)("header.settings")
        }, {
          icon: I(() => [
            H(v(xp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Yp = ".editor-header[data-v-f16781f3]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-f16781f3]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-f16781f3]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-f16781f3]{padding:0 var(--spacing-md);height:48px}.badges[data-v-f16781f3]{display:none}.document-title[data-v-f16781f3]{font-size:var(--font-size-base)}}", Gp = /* @__PURE__ */ rt(Xp, [["styles", [Yp]], ["__scopeId", "data-v-f16781f3"]]);
function Sa(t) {
  return typeof t == "string" ? `'${t}'` : new Jp().serialize(t);
}
const Jp = /* @__PURE__ */ (function() {
  class t {
    #e = /* @__PURE__ */ new Map();
    compare(n, r) {
      const i = typeof n, o = typeof r;
      return i === "string" && o === "string" ? n.localeCompare(r) : i === "number" && o === "number" ? n - r : String.prototype.localeCompare.call(this.serialize(n, !0), this.serialize(r, !0));
    }
    serialize(n, r) {
      if (n === null) return "null";
      switch (typeof n) {
        case "string":
          return r ? n : `'${n}'`;
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
      const r = Object.prototype.toString.call(n);
      if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), n);
      const i = n.constructor, o = i === Object || i === void 0 ? "" : i.name;
      if (o !== "" && globalThis[o] === i) return this.serializeBuiltInType(o, n);
      if (typeof n.toJSON == "function") {
        const s = n.toJSON();
        return o + (s !== null && typeof s == "object" ? this.$object(s) : `(${this.serialize(s)})`);
      }
      return this.serializeObjectEntries(o, Object.entries(n));
    }
    serializeBuiltInType(n, r) {
      const i = this["$" + n];
      if (i) return i.call(this, r);
      if (typeof r?.entries == "function") return this.serializeObjectEntries(n, r.entries());
      throw new Error(`Cannot serialize ${n}`);
    }
    serializeObjectEntries(n, r) {
      const i = Array.from(r).sort((s, a) => this.compare(s[0], a[0]));
      let o = `${n}{`;
      for (let s = 0; s < i.length; s++) {
        const [a, l] = i[s];
        o += `${this.serialize(a, !0)}:${this.serialize(l)}`, s < i.length - 1 && (o += ",");
      }
      return o + "}";
    }
    $object(n) {
      let r = this.#e.get(n);
      return r === void 0 && (this.#e.set(n, `#${this.#e.size}`), r = this.serializeObject(n), this.#e.set(n, r)), r;
    }
    $function(n) {
      const r = Function.prototype.toString.call(n);
      return r.slice(-15) === "[native code] }" ? `${n.name || ""}()[native]` : `${n.name}(${n.length})${r.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(n) {
      let r = "[";
      for (let i = 0; i < n.length; i++) r += this.serialize(n[i]), i < n.length - 1 && (r += ",");
      return r + "]";
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
      return `Set${this.$Array(Array.from(n).sort((r, i) => this.compare(r, i)))}`;
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
function vi(t, e) {
  return t === e || Sa(t) === Sa(e);
}
function Zp(t, e, n) {
  const r = t.findIndex((a) => vi(a, e)), i = t.findIndex((a) => vi(a, n));
  if (r === -1 || i === -1) return [];
  const [o, s] = [r, i].sort((a, l) => a - l);
  return t.slice(o, s + 1);
}
function Bo(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function dt(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, r = Symbol(n);
  return [(s) => {
    const a = cn(r, s);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (s) => (Ir(r, s), s)];
}
function ht() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function Fi(t, e, n) {
  const r = n.originalEvent.target, i = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && r.addEventListener(t, e, { once: !0 }), r.dispatchEvent(i);
}
function Fo(t) {
  return t == null;
}
function cs(t) {
  return t ? t.flatMap((e) => e.type === Ae ? cs(e.children) : [e]) : [];
}
const [ds] = dt("ConfigProvider");
function Qp(t, e) {
  var n;
  const r = /* @__PURE__ */ kn();
  return ze(() => {
    r.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ oi(r);
}
function Ni(t, e) {
  return Qo() ? (vl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function ao() {
  const t = /* @__PURE__ */ new Set(), e = (o) => {
    t.delete(o);
  };
  return {
    on: (o) => {
      t.add(o);
      const s = () => e(o);
      return Ni(s), { off: s };
    },
    off: e,
    trigger: (...o) => Promise.all(Array.from(t).map((s) => s(...o))),
    clear: () => {
      t.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function eh(t) {
  let e = !1, n;
  const r = hl(!0);
  return ((...i) => (e || (n = r.run(() => t(...i)), e = !0), n));
}
const rn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const th = (t) => typeof t < "u", nh = Object.prototype.toString, rh = (t) => nh.call(t) === "[object Object]", Ca = () => {
}, Ea = /* @__PURE__ */ ih();
function ih() {
  var t, e, n;
  return rn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function oh(t, e) {
  function n(...r) {
    return new Promise((i, o) => {
      Promise.resolve(t(() => e.apply(this, r), {
        fn: e,
        thisArg: this,
        args: r
      })).then(i).catch(o);
    });
  }
  return n;
}
function sh(t, e = {}) {
  let n, r, i = Ca;
  const o = (l) => {
    clearTimeout(l), i(), i = Ca;
  };
  let s;
  return (l) => {
    const c = Ne(t), u = Ne(e.maxWait);
    return n && o(n), c <= 0 || u !== void 0 && u <= 0 ? (r && (o(r), r = void 0), Promise.resolve(l())) : new Promise((d, f) => {
      i = e.rejectOnCancel ? f : d, s = l, u && !r && (r = setTimeout(() => {
        n && o(n), r = void 0, d(s());
      }, u)), n = setTimeout(() => {
        r && o(r), r = void 0, d(l());
      }, c);
    });
  };
}
function lo(t) {
  return Array.isArray(t) ? t : [t];
}
function ah(t) {
  return ut();
}
// @__NO_SIDE_EFFECTS__
function lh(t) {
  if (!rn) return t;
  let e = 0, n, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), n = void 0, r = void 0);
  };
  return ((...o) => (e += 1, r || (r = hl(!0), n = r.run(() => t(...o))), Ni(i), n));
}
function Bu(t, e = 1e4) {
  return Dl((n, r) => {
    let i = Ne(t), o;
    const s = () => setTimeout(() => {
      i = Ne(t), r();
    }, Ne(e));
    return Ni(() => {
      clearTimeout(o);
    }), {
      get() {
        return n(), i;
      },
      set(a) {
        i = a, r(), clearTimeout(o), o = s();
      }
    };
  });
}
// @__NO_SIDE_EFFECTS__
function fs(t, e = 200, n = {}) {
  return oh(sh(e, n), t);
}
function uh(t, e) {
  ah() && On(t, e);
}
function ch(t, e, n) {
  return xe(t, e, {
    ...n,
    immediate: !0
  });
}
function dh(t, e, n) {
  return xe(t, e, {
    ...n,
    once: !0
  });
}
const zi = rn ? window : void 0;
function $t(t) {
  var e;
  const n = Ne(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Fu(...t) {
  const e = (r, i, o, s) => (r.addEventListener(i, o, s), () => r.removeEventListener(i, o, s)), n = M(() => {
    const r = lo(Ne(t[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return ch(() => {
    var r, i;
    return [
      (r = (i = n.value) === null || i === void 0 ? void 0 : i.map((o) => $t(o))) !== null && r !== void 0 ? r : [zi].filter((o) => o != null),
      lo(Ne(n.value ? t[1] : t[0])),
      lo(v(n.value ? t[2] : t[1])),
      Ne(n.value ? t[3] : t[2])
    ];
  }, ([r, i, o, s], a, l) => {
    if (!r?.length || !i?.length || !o?.length) return;
    const c = rh(s) ? { ...s } : s, u = r.flatMap((d) => i.flatMap((f) => o.map((p) => e(d, f, p, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Nu() {
  const t = /* @__PURE__ */ kn(!1), e = ut();
  return e && ke(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function fh(t) {
  const e = /* @__PURE__ */ Nu();
  return M(() => (e.value, !!t()));
}
function ph(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function hh(...t) {
  let e, n, r = {};
  t.length === 3 ? (e = t[0], n = t[1], r = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], r = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: i = zi, eventName: o = "keydown", passive: s = !1, dedupe: a = !1 } = r, l = ph(e);
  return Fu(i, o, (u) => {
    u.repeat && Ne(a) || l(u) && n(u);
  }, s);
}
function vh(t) {
  return JSON.parse(JSON.stringify(t));
}
function Sr(t, e, n = {}) {
  const { window: r = zi, ...i } = n;
  let o;
  const s = /* @__PURE__ */ fh(() => r && "ResizeObserver" in r), a = () => {
    o && (o.disconnect(), o = void 0);
  }, l = xe(M(() => {
    const u = Ne(t);
    return Array.isArray(u) ? u.map((d) => $t(d)) : [$t(u)];
  }), (u) => {
    if (a(), s.value && r) {
      o = new ResizeObserver(e);
      for (const d of u) d && o.observe(d, i);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    a(), l();
  };
  return Ni(c), {
    isSupported: s,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function Cr(t, e, n, r = {}) {
  var i, o;
  const { clone: s = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = ut(), p = n || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (o = f.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(f?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const m = (_) => s ? typeof s == "function" ? s(_) : vh(_) : _, g = () => th(t[e]) ? m(t[e]) : u, x = (_) => {
    d ? d(_) && p(h, _) : p(h, _);
  };
  if (a) {
    const _ = /* @__PURE__ */ L(g());
    let w = !1;
    return xe(() => t[e], (y) => {
      w || (w = !0, _.value = m(y), Ie(() => w = !1));
    }), xe(_, (y) => {
      !w && (y !== t[e] || c) && x(y);
    }, { deep: c }), _;
  } else return M({
    get() {
      return g();
    },
    set(_) {
      x(_);
    }
  });
}
function uo(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function No(t, e, n = ".", r) {
  if (!uo(e))
    return No(t, {}, n, r);
  const i = Object.assign({}, e);
  for (const o in t) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const s = t[o];
    s != null && (r && r(i, o, s, n) || (Array.isArray(s) && Array.isArray(i[o]) ? i[o] = [...s, ...i[o]] : uo(s) && uo(i[o]) ? i[o] = No(
      s,
      i[o],
      (n ? `${n}.` : "") + o.toString(),
      r
    ) : i[o] = s));
  }
  return i;
}
function mh(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, r) => No(n, r, "", t), {})
  );
}
const gh = mh(), yh = /* @__PURE__ */ lh(() => {
  const t = /* @__PURE__ */ L(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ L(), n = M(() => {
    for (const s of t.value.values()) if (s) return !0;
    return !1;
  }), r = ds({ scrollBody: /* @__PURE__ */ L(!0) });
  let i = null;
  const o = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", Ea && i?.(), e.value = void 0;
  };
  return xe(n, (s, a) => {
    if (!rn) return;
    if (!s) {
      a && o();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? gh({
      padding: r.scrollBody.value.padding === !0 ? l : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? l : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), Ea && (i = Fu(document, "touchmove", (d) => bh(d), { passive: !1 })), Ie(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function zu(t) {
  const e = Math.random().toString(36).substring(2, 7), n = yh();
  n.value.set(e, t ?? !1);
  const r = M({
    get: () => n.value.get(e) ?? !1,
    set: (i) => n.value.set(e, i)
  });
  return uh(() => {
    n.value.delete(e);
  }), r;
}
function qu(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : qu(n);
  }
}
function bh(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && qu(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function ps(t) {
  const e = ds({ dir: /* @__PURE__ */ L("ltr") });
  return M(() => t?.value || e.dir?.value || "ltr");
}
function qi(t) {
  const e = ut(), n = e?.type.emits, r = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((i) => {
    r[Yr($e(i))] = (...o) => t(i, ...o);
  }), r;
}
let co = 0;
function _h() {
  ze((t) => {
    if (!rn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Ta()), document.body.insertAdjacentElement("beforeend", e[1] ?? Ta()), co++, t(() => {
      co === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), co--;
    });
  });
}
function Ta() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function Hu(t) {
  return M(() => Ne(t) ? !!$t(t)?.closest("form") : !0);
}
function ge() {
  const t = ut(), e = /* @__PURE__ */ L(), n = M(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : $t(e)), r = Object.assign({}, t.exposed), i = {};
  for (const s in t.props) Object.defineProperty(i, s, {
    enumerable: !0,
    configurable: !0,
    get: () => t.props[s]
  });
  if (Object.keys(r).length > 0) for (const s in r) Object.defineProperty(i, s, {
    enumerable: !0,
    configurable: !0,
    get: () => r[s]
  });
  Object.defineProperty(i, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => t.vnode.el
  }), t.exposed = i;
  function o(s) {
    if (e.value = s, !!s && (Object.defineProperty(i, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => s instanceof Element ? s : s.$el
    }), !(s instanceof Element) && !Object.hasOwn(s, "$el"))) {
      const a = s.$.exposed, l = Object.assign({}, i);
      for (const c in a) Object.defineProperty(l, c, {
        enumerable: !0,
        configurable: !0,
        get: () => a[c]
      });
      t.exposed = l;
    }
  }
  return {
    forwardRef: o,
    currentRef: e,
    currentElement: n
  };
}
function hs(t) {
  const e = ut(), n = Object.keys(e?.type.props ?? {}).reduce((i, o) => {
    const s = (e?.type.props[o]).default;
    return s !== void 0 && (i[o] = s), i;
  }, {}), r = /* @__PURE__ */ Gr(t);
  return M(() => {
    const i = {}, o = e?.vnode.props ?? {};
    return Object.keys(o).forEach((s) => {
      i[$e(s)] = o[s];
    }), Object.keys({
      ...n,
      ...i
    }).reduce((s, a) => (r.value[a] !== void 0 && (s[a] = r.value[a]), s), {});
  });
}
function wh(t, e) {
  const n = hs(t), r = e ? qi(e) : {};
  return M(() => ({
    ...n.value,
    ...r
  }));
}
var xh = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Bn = /* @__PURE__ */ new WeakMap(), Vr = /* @__PURE__ */ new WeakMap(), Wr = {}, fo = 0, Vu = function(t) {
  return t && (t.host || Vu(t.parentNode));
}, Sh = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var r = Vu(n);
    return r && t.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Ch = function(t, e, n, r) {
  var i = Sh(e, Array.isArray(t) ? t : [t]);
  Wr[n] || (Wr[n] = /* @__PURE__ */ new WeakMap());
  var o = Wr[n], s = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var p = f.getAttribute(r), h = p !== null && p !== "false", m = (Bn.get(f) || 0) + 1, g = (o.get(f) || 0) + 1;
          Bn.set(f, m), o.set(f, g), s.push(f), m === 1 && h && Vr.set(f, !0), g === 1 && f.setAttribute(n, "true"), h || f.setAttribute(r, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", f, x);
        }
    });
  };
  return u(e), a.clear(), fo++, function() {
    s.forEach(function(d) {
      var f = Bn.get(d) - 1, p = o.get(d) - 1;
      Bn.set(d, f), o.set(d, p), f || (Vr.has(d) || d.removeAttribute(r), Vr.delete(d)), p || d.removeAttribute(n);
    }), fo--, fo || (Bn = /* @__PURE__ */ new WeakMap(), Bn = /* @__PURE__ */ new WeakMap(), Vr = /* @__PURE__ */ new WeakMap(), Wr = {});
  };
}, Eh = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(t) ? t : [t]), i = xh(t);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Ch(r, i, n, "aria-hidden")) : function() {
    return null;
  };
};
function Wu(t) {
  let e;
  xe(() => $t(t), (n) => {
    n ? e = Eh(n) : e && e();
  }), lt(() => {
    e && e();
  });
}
function Er(t, e = "reka") {
  return `${e}-${eu?.()}`;
}
function Th() {
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
function Ah(t) {
  const e = /* @__PURE__ */ L(), n = M(() => e.value?.width ?? 0), r = M(() => e.value?.height ?? 0);
  return ke(() => {
    const i = $t(t);
    if (i) {
      e.value = {
        width: i.offsetWidth,
        height: i.offsetHeight
      };
      const o = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length) return;
        const a = s[0];
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
      return o.observe(i, { box: "border-box" }), () => o.unobserve(i);
    } else e.value = void 0;
  }), {
    width: n,
    height: r
  };
}
function vs(t, e) {
  const n = /* @__PURE__ */ L(t);
  function r(o) {
    return e[n.value][o] ?? n.value;
  }
  return {
    state: n,
    dispatch: (o) => {
      n.value = r(o);
    }
  };
}
function ms(t) {
  const e = Bu("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, o) => {
      e.value = e.value + i;
      {
        const s = ht(), a = o.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === s), c = a.map((f) => f.textValue), u = Ph(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function kh(t, e) {
  return t.map((n, r) => t[(e + r) % t.length]);
}
function Ph(t, e, n) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, o = n ? t.indexOf(n) : -1;
  let s = kh(t, Math.max(o, 0));
  i.length === 1 && (s = s.filter((c) => c !== n));
  const l = s.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== n ? l : void 0;
}
function Oh(t, e) {
  const n = /* @__PURE__ */ L({}), r = /* @__PURE__ */ L("none"), i = /* @__PURE__ */ L(t), o = t.value ? "mounted" : "unmounted";
  let s;
  const a = e.value?.ownerDocument.defaultView ?? zi, { state: l, dispatch: c } = vs(o, {
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
    if (rn) {
      const x = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(x);
    }
  };
  xe(t, async (g, x) => {
    const _ = x !== g;
    if (await Ie(), _) {
      const w = r.value, y = jr(e.value);
      g ? (c("MOUNT"), u("enter"), y === "none" && u("after-enter")) : y === "none" || y === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : x && w !== y ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const x = jr(e.value), _ = x.includes(CSS.escape(g.animationName)), w = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && _ && (u(`after-${w}`), c("ANIMATION_END"), !i.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", s = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    g.target === e.value && x === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = jr(e.value));
  }, p = xe(e, (g, x) => {
    g ? (n.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), s !== void 0 && a?.clearTimeout(s), x?.removeEventListener("animationstart", f), x?.removeEventListener("animationcancel", d), x?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = xe(l, () => {
    const g = jr(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return lt(() => {
    p(), h();
  }), { isPresent: M(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function jr(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var Ln = /* @__PURE__ */ X({
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
    const { present: r, forceMount: i } = /* @__PURE__ */ tn(t), o = /* @__PURE__ */ L(), { isPresent: s } = Oh(r, o);
    n({ present: s });
    let a = e.default({ present: s.value });
    a = cs(a || []);
    const l = ut();
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
    return () => i.value || r.value || s.value ? yt(e.default({ present: s.value })[0], { ref: (c) => {
      const u = $t(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? o.value = u.firstElementChild : o.value = u), u;
    } }) : null;
  }
});
const zo = /* @__PURE__ */ X({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const r = cs(n.default()), i = r.findIndex((l) => l.type !== Be);
      if (i === -1) return r;
      const o = r[i];
      delete o.props?.ref;
      const s = o.props ? de(e, o.props) : e, a = Zt({
        ...o,
        props: {}
      }, s);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), Rh = [
  "area",
  "img",
  "input"
], Ce = /* @__PURE__ */ X({
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
    const r = t.asChild ? "template" : t.as;
    return typeof r == "string" && Rh.includes(r) ? () => yt(r, e) : r !== "template" ? () => yt(t.as, e, { default: n.default }) : () => yt(zo, e, { default: n.default });
  }
});
function Tr() {
  const t = /* @__PURE__ */ L(), e = M(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : $t(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [vn, Lh] = dt("DialogRoot");
var Ih = /* @__PURE__ */ X({
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
    const n = t, i = /* @__PURE__ */ Cr(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), o = /* @__PURE__ */ L(), s = /* @__PURE__ */ L(), { modal: a } = /* @__PURE__ */ tn(n);
    return Lh({
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
      triggerElement: o,
      contentElement: s
    }), (l, c) => Q(l.$slots, "default", {
      open: v(i),
      close: () => i.value = !1
    });
  }
}), ju = Ih, Mh = /* @__PURE__ */ X({
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
    ge();
    const n = vn();
    return (r, i) => (O(), V(v(Ce), de(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (o) => v(n).onOpenChange(!1))
    }), {
      default: I(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Dh = Mh;
const $h = "dismissableLayer.pointerDownOutside", Bh = "dismissableLayer.focusOutside";
function Uu(t, e) {
  const n = e.closest("[data-dismissable-layer]"), r = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), i = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (r === n || i.indexOf(r) < i.indexOf(n)));
}
function Fh(t, e, n = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ L(() => {
  });
  return ze((s) => {
    if (!rn || !Ne(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Uu(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            Fi($h, t, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (r.removeEventListener("click", o.value), o.value = f, r.addEventListener("click", o.value, { once: !0 })) : f();
        } else r.removeEventListener("click", o.value);
        i.value = !1;
      }
    }, l = window.setTimeout(() => {
      r.addEventListener("pointerdown", a);
    }, 0);
    s(() => {
      window.clearTimeout(l), r.removeEventListener("pointerdown", a), r.removeEventListener("click", o.value);
    });
  }), { onPointerDownCapture: () => {
    Ne(n) && (i.value = !0);
  } };
}
function Nh(t, e, n = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = /* @__PURE__ */ L(!1);
  return ze((o) => {
    if (!rn || !Ne(n)) return;
    const s = async (a) => {
      if (!e?.value) return;
      await Ie(), await Ie();
      const l = a.target;
      !e.value || !l || Uu(e.value, l) || a.target && !i.value && Fi(Bh, t, { originalEvent: a });
    };
    r.addEventListener("focusin", s), o(() => r.removeEventListener("focusin", s));
  }), {
    onFocusCapture: () => {
      Ne(n) && (i.value = !0);
    },
    onBlurCapture: () => {
      Ne(n) && (i.value = !1);
    }
  };
}
const pt = /* @__PURE__ */ Rr({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var zh = /* @__PURE__ */ X({
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
    const n = t, r = e, { forwardRef: i, currentElement: o } = ge(), s = M(() => o.value?.ownerDocument ?? globalThis.document), a = M(() => pt.layersRoot), l = M(() => o.value ? Array.from(a.value).indexOf(o.value) : -1), c = M(() => pt.layersWithOutsidePointerEventsDisabled.size > 0), u = M(() => {
      const p = Array.from(a.value), [h] = [...pt.layersWithOutsidePointerEventsDisabled].slice(-1), m = p.indexOf(h);
      return l.value >= m;
    }), d = Fh(async (p) => {
      const h = [...pt.branches].some((m) => m?.contains(p.target));
      !u.value || h || (r("pointerDownOutside", p), r("interactOutside", p), await Ie(), p.defaultPrevented || r("dismiss"));
    }, o), f = Nh((p) => {
      [...pt.branches].some((m) => m?.contains(p.target)) || (r("focusOutside", p), r("interactOutside", p), p.defaultPrevented || r("dismiss"));
    }, o);
    return hh("Escape", (p) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", p), p.defaultPrevented || r("dismiss"));
    }), ze((p) => {
      o.value && (n.disableOutsidePointerEvents && (pt.layersWithOutsidePointerEventsDisabled.size === 0 && (pt.originalBodyPointerEvents = s.value.body.style.pointerEvents, s.value.body.style.pointerEvents = "none"), pt.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), p(() => {
        n.disableOutsidePointerEvents && pt.layersWithOutsidePointerEventsDisabled.size === 1 && !Fo(pt.originalBodyPointerEvents) && (s.value.body.style.pointerEvents = pt.originalBodyPointerEvents);
      }));
    }), ze((p) => {
      p(() => {
        o.value && (a.value.delete(o.value), pt.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (p, h) => (O(), V(v(Ce), {
      ref: v(i),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: nt({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(f).onFocusCapture,
      onBlurCapture: v(f).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: I(() => [Q(p.$slots, "default")]),
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
}), Ku = zh;
const qh = /* @__PURE__ */ eh(() => /* @__PURE__ */ L([]));
function Hh() {
  const t = qh();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = Aa(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = Aa(t.value, e), t.value[0]?.resume();
    }
  };
}
function Aa(t, e) {
  const n = [...t], r = n.indexOf(e);
  return r !== -1 && n.splice(r, 1), n;
}
const po = "focusScope.autoFocusOnMount", ho = "focusScope.autoFocusOnUnmount", ka = {
  bubbles: !1,
  cancelable: !0
};
function Vh(t, { select: e = !1 } = {}) {
  const n = ht();
  for (const r of t)
    if (sn(r, { select: e }), ht() !== n) return !0;
}
function Wh(t) {
  const e = Xu(t), n = Pa(e, t), r = Pa(e.reverse(), t);
  return [n, r];
}
function Xu(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function Pa(t, e) {
  for (const n of t) if (!jh(n, { upTo: e })) return n;
}
function jh(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function Uh(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function sn(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = ht();
    t.focus({ preventScroll: !0 }), t !== n && Uh(t) && e && t.select();
  }
}
var Kh = /* @__PURE__ */ X({
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
    const n = t, r = e, { currentRef: i, currentElement: o } = ge(), s = /* @__PURE__ */ L(null), a = Hh(), l = /* @__PURE__ */ Rr({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ze((u) => {
      if (!rn) return;
      const d = o.value;
      if (!n.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const x = g.target;
        d.contains(x) ? s.value = x : sn(s.value, { select: !0 });
      }
      function p(g) {
        if (l.paused || !d) return;
        const x = g.relatedTarget;
        x !== null && (d.contains(x) || sn(s.value, { select: !0 }));
      }
      function h(g) {
        d.contains(s.value) || sn(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const m = new MutationObserver(h);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), m.disconnect();
      });
    }), ze(async (u) => {
      const d = o.value;
      if (await Ie(), !d) return;
      a.add(l);
      const f = ht();
      if (!d.contains(f)) {
        const h = new CustomEvent(po, ka);
        d.addEventListener(po, (m) => r("mountAutoFocus", m)), d.dispatchEvent(h), h.defaultPrevented || (Vh(Xu(d), { select: !0 }), ht() === f && sn(d));
      }
      u(() => {
        d.removeEventListener(po, (g) => r("mountAutoFocus", g));
        const h = new CustomEvent(ho, ka), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(ho, m), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || sn(f ?? document.body, { select: !0 }), d.removeEventListener(ho, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = ht();
      if (d && f) {
        const p = u.currentTarget, [h, m] = Wh(p);
        h && m ? !u.shiftKey && f === m ? (u.preventDefault(), n.loop && sn(h, { select: !0 })) : u.shiftKey && f === h && (u.preventDefault(), n.loop && sn(m, { select: !0 })) : f === p && u.preventDefault();
      }
    }
    return (u, d) => (O(), V(v(Ce), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: I(() => [Q(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Yu = Kh;
function Xh(t) {
  return t ? "open" : "closed";
}
function Oa(t) {
  const e = ht();
  for (const n of t)
    if (n === e || (n.focus(), ht() !== e)) return;
}
var Yh = /* @__PURE__ */ X({
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
    const n = t, r = e, i = vn(), { forwardRef: o, currentElement: s } = ge();
    return i.titleId ||= Er(void 0, "reka-dialog-title"), i.descriptionId ||= Er(void 0, "reka-dialog-description"), ke(() => {
      i.contentElement = s, ht() !== document.body && (i.triggerElement.value = ht());
    }), (a, l) => (O(), V(v(Yu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: I(() => [H(v(Ku), de({
        id: v(i).contentId,
        ref: v(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(i).descriptionId,
        "aria-labelledby": v(i).titleId,
        "data-state": v(Xh)(v(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => v(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: I(() => [Q(a.$slots, "default")]),
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
}), Gu = Yh, Gh = /* @__PURE__ */ X({
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
    const n = t, r = e, i = vn(), o = qi(r), { forwardRef: s, currentElement: a } = ge();
    return Wu(a), (l, c) => (O(), V(Gu, de({
      ...n,
      ...v(o)
    }, {
      ref: v(s),
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
      default: I(() => [Q(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Jh = Gh, Zh = /* @__PURE__ */ X({
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
    const n = t, i = qi(e);
    ge();
    const o = vn(), s = /* @__PURE__ */ L(!1), a = /* @__PURE__ */ L(!1);
    return (l, c) => (O(), V(Gu, de({
      ...n,
      ...v(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (s.value || v(o).triggerElement.value?.focus(), u.preventDefault()), s.value = !1, a.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (s.value = !0, u.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = u.target;
        v(o).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && a.value && u.preventDefault();
      })
    }), {
      default: I(() => [Q(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Qh = Zh, ev = /* @__PURE__ */ X({
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
    const n = t, r = e, i = vn(), o = qi(r), { forwardRef: s } = ge();
    return (a, l) => (O(), V(v(Ln), { present: a.forceMount || v(i).open.value }, {
      default: I(() => [v(i).modal.value ? (O(), V(Jh, de({
        key: 0,
        ref: v(s)
      }, {
        ...n,
        ...v(o),
        ...a.$attrs
      }), {
        default: I(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16)) : (O(), V(Qh, de({
        key: 1,
        ref: v(s)
      }, {
        ...n,
        ...v(o),
        ...a.$attrs
      }), {
        default: I(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Ju = ev, tv = /* @__PURE__ */ X({
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
    const e = vn();
    return zu(!0), ge(), (n, r) => (O(), V(v(Ce), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: I(() => [Q(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), nv = tv, rv = /* @__PURE__ */ X({
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
    const e = vn(), { forwardRef: n } = ge();
    return (r, i) => v(e)?.modal.value ? (O(), V(v(Ln), {
      key: 0,
      present: r.forceMount || v(e).open.value
    }, {
      default: I(() => [H(nv, de(r.$attrs, {
        ref: v(n),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: I(() => [Q(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : fe("v-if", !0);
  }
}), Zu = rv, iv = /* @__PURE__ */ X({
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
    const e = /* @__PURE__ */ Nu();
    return (n, r) => v(e) || n.forceMount ? (O(), V(Xl, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [Q(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : fe("v-if", !0);
  }
}), Qu = iv, ov = /* @__PURE__ */ X({
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
    return (n, r) => (O(), V(v(Qu), Jo($i(e)), {
      default: I(() => [Q(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ec = ov, sv = /* @__PURE__ */ X({
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
    const e = t, n = vn();
    return ge(), (r, i) => (O(), V(v(Ce), de(e, { id: v(n).titleId }), {
      default: I(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), tc = sv;
const Ra = "data-reka-collection-item";
function mn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, r = `${e}CollectionProvider`;
  let i;
  n ? (i = {
    collectionRef: /* @__PURE__ */ L(),
    itemMap: /* @__PURE__ */ L(/* @__PURE__ */ new Map())
  }, Ir(r, i)) : i = cn(r);
  const o = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Ra}]`)), h = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? h : h.filter((m) => m.ref.dataset.disabled !== "");
  }, s = /* @__PURE__ */ X({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Tr();
      return xe(h, () => {
        i.collectionRef.value = h.value;
      }), () => yt(zo, {
        ref: p,
        ...f
      }, d);
    }
  }), a = /* @__PURE__ */ X({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Tr();
      return ze((m) => {
        if (h.value) {
          const g = Ll(h.value);
          i.itemMap.value.set(g, {
            ref: h.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => yt(zo, {
        ...f,
        [Ra]: "",
        ref: p
      }, d);
    }
  }), l = M(() => Array.from(i.itemMap.value.values())), c = M(() => i.itemMap.value.size);
  return {
    getItems: o,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: s,
    CollectionItem: a
  };
}
const av = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function lv(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function uv(t, e, n) {
  const r = lv(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return av[r];
}
var cv = /* @__PURE__ */ X({
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
    return (e, n) => (O(), V(v(Ce), {
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
      default: I(() => [Q(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), nc = cv, dv = /* @__PURE__ */ X({
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
    const e = t, { primitiveElement: n, currentElement: r } = Tr(), i = M(() => e.checked ?? e.value);
    return xe(i, (o, s) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && o !== s) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, o), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (o, s) => (O(), V(nc, de({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...o.$attrs
    }, { as: "input" }), null, 16));
  }
}), La = dv, fv = /* @__PURE__ */ X({
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
    const e = t, n = M(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = M(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((i, o) => typeof i == "object" ? Object.entries(i).map(([s, a]) => ({
      name: `${e.name}[${o}][${s}]`,
      value: a
    })) : {
      name: `${e.name}[${o}]`,
      value: i
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([i, o]) => ({
      name: `${e.name}[${i}]`,
      value: o
    })) : []);
    return (i, o) => (O(), ce(Ae, null, [fe(" We render single input if it's required "), n.value ? (O(), V(La, de({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (O(!0), ce(Ae, { key: 1 }, Rn(r.value, (s) => (O(), V(La, de({ key: s.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), pv = fv;
const [rc, hv] = dt("PopperRoot");
var vv = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ L();
    return hv({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, r) => Q(n.$slots, "default");
  }
}), mv = vv, gv = /* @__PURE__ */ X({
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
    const e = t, { forwardRef: n, currentElement: r } = ge(), i = rc();
    return Hl(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (o, s) => (O(), V(v(Ce), {
      ref: v(n),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: I(() => [Q(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), yv = gv;
function bv(t) {
  return t !== null;
}
function _v(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: r, middlewareData: i } = e, s = i.arrow?.centerOffset !== 0, a = s ? 0 : t.arrowWidth, l = s ? 0 : t.arrowHeight, [c, u] = qo(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (i.arrow?.x ?? 0) + a / 2, p = (i.arrow?.y ?? 0) + l / 2;
      let h = "", m = "";
      return c === "bottom" ? (h = s ? d : `${f}px`, m = `${-l}px`) : c === "top" ? (h = s ? d : `${f}px`, m = `${r.floating.height + l}px`) : c === "right" ? (h = `${-l}px`, m = s ? d : `${p}px`) : c === "left" && (h = `${r.floating.width + l}px`, m = s ? d : `${p}px`), { data: {
        x: h,
        y: m
      } };
    }
  };
}
function qo(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const wv = ["top", "right", "bottom", "left"], pn = Math.min, ot = Math.max, mi = Math.round, Ur = Math.floor, Dt = (t) => ({
  x: t,
  y: t
}), xv = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Sv = {
  start: "end",
  end: "start"
};
function Ho(t, e, n) {
  return ot(t, pn(e, n));
}
function Qt(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function en(t) {
  return t.split("-")[0];
}
function Gn(t) {
  return t.split("-")[1];
}
function gs(t) {
  return t === "x" ? "y" : "x";
}
function ys(t) {
  return t === "y" ? "height" : "width";
}
const Cv = /* @__PURE__ */ new Set(["top", "bottom"]);
function It(t) {
  return Cv.has(en(t)) ? "y" : "x";
}
function bs(t) {
  return gs(It(t));
}
function Ev(t, e, n) {
  n === void 0 && (n = !1);
  const r = Gn(t), i = bs(t), o = ys(i);
  let s = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (s = gi(s)), [s, gi(s)];
}
function Tv(t) {
  const e = gi(t);
  return [Vo(t), e, Vo(e)];
}
function Vo(t) {
  return t.replace(/start|end/g, (e) => Sv[e]);
}
const Ia = ["left", "right"], Ma = ["right", "left"], Av = ["top", "bottom"], kv = ["bottom", "top"];
function Pv(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Ma : Ia : e ? Ia : Ma;
    case "left":
    case "right":
      return e ? Av : kv;
    default:
      return [];
  }
}
function Ov(t, e, n, r) {
  const i = Gn(t);
  let o = Pv(en(t), n === "start", r);
  return i && (o = o.map((s) => s + "-" + i), e && (o = o.concat(o.map(Vo)))), o;
}
function gi(t) {
  return t.replace(/left|right|bottom|top/g, (e) => xv[e]);
}
function Rv(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function ic(t) {
  return typeof t != "number" ? Rv(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function yi(t) {
  const {
    x: e,
    y: n,
    width: r,
    height: i
  } = t;
  return {
    width: r,
    height: i,
    top: n,
    left: e,
    right: e + r,
    bottom: n + i,
    x: e,
    y: n
  };
}
function Da(t, e, n) {
  let {
    reference: r,
    floating: i
  } = t;
  const o = It(e), s = bs(e), a = ys(s), l = en(e), c = o === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
  let p;
  switch (l) {
    case "top":
      p = {
        x: u,
        y: r.y - i.height
      };
      break;
    case "bottom":
      p = {
        x: u,
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
  switch (Gn(e)) {
    case "start":
      p[s] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      p[s] += f * (n && c ? -1 : 1);
      break;
  }
  return p;
}
async function Lv(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
    platform: o,
    rects: s,
    elements: a,
    strategy: l
  } = t, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: p = 0
  } = Qt(e, t), h = ic(p), g = a[f ? d === "floating" ? "reference" : "floating" : d], x = yi(await o.getClippingRect({
    element: (n = await (o.isElement == null ? void 0 : o.isElement(g))) == null || n ? g : g.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), _ = d === "floating" ? {
    x: r,
    y: i,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, w = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), y = await (o.isElement == null ? void 0 : o.isElement(w)) ? await (o.getScale == null ? void 0 : o.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = yi(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: _,
    offsetParent: w,
    strategy: l
  }) : _);
  return {
    top: (x.top - S.top + h.top) / y.y,
    bottom: (S.bottom - x.bottom + h.bottom) / y.y,
    left: (x.left - S.left + h.left) / y.x,
    right: (S.right - x.right + h.right) / y.x
  };
}
const Iv = async (t, e, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: o = [],
    platform: s
  } = n, a = o.filter(Boolean), l = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let c = await s.getElementRects({
    reference: t,
    floating: e,
    strategy: i
  }), {
    x: u,
    y: d
  } = Da(c, r, l), f = r, p = {}, h = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: x,
      fn: _
    } = a[g], {
      x: w,
      y,
      data: S,
      reset: T
    } = await _({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: p,
      rects: c,
      platform: {
        ...s,
        detectOverflow: (m = s.detectOverflow) != null ? m : Lv
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = w ?? u, d = y ?? d, p = {
      ...p,
      [x]: {
        ...p[x],
        ...S
      }
    }, T && h <= 50 && (h++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (c = T.rects === !0 ? await s.getElementRects({
      reference: t,
      floating: e,
      strategy: i
    }) : T.rects), {
      x: u,
      y: d
    } = Da(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: p
  };
}, Mv = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: r,
      placement: i,
      rects: o,
      platform: s,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = Qt(t, e) || {};
    if (c == null)
      return {};
    const d = ic(u), f = {
      x: n,
      y: r
    }, p = bs(i), h = ys(p), m = await s.getDimensions(c), g = p === "y", x = g ? "top" : "left", _ = g ? "bottom" : "right", w = g ? "clientHeight" : "clientWidth", y = o.reference[h] + o.reference[p] - f[p] - o.floating[h], S = f[p] - o.reference[p], T = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c));
    let E = T ? T[w] : 0;
    (!E || !await (s.isElement == null ? void 0 : s.isElement(T))) && (E = a.floating[w] || o.floating[h]);
    const D = y / 2 - S / 2, A = E / 2 - m[h] / 2 - 1, k = pn(d[x], A), $ = pn(d[_], A), P = k, W = E - m[h] - $, B = E / 2 - m[h] / 2 + D, K = Ho(P, B, W), re = !l.arrow && Gn(i) != null && B !== K && o.reference[h] / 2 - (B < P ? k : $) - m[h] / 2 < 0, Z = re ? B < P ? B - P : B - W : 0;
    return {
      [p]: f[p] + Z,
      data: {
        [p]: K,
        centerOffset: B - K - Z,
        ...re && {
          alignmentOffset: Z
        }
      },
      reset: re
    };
  }
}), Dv = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, r;
      const {
        placement: i,
        middlewareData: o,
        rects: s,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: m = !0,
        ...g
      } = Qt(t, e);
      if ((n = o.arrow) != null && n.alignmentOffset)
        return {};
      const x = en(i), _ = It(a), w = en(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), S = f || (w || !m ? [gi(a)] : Tv(a)), T = h !== "none";
      !f && T && S.push(...Ov(a, m, h, y));
      const E = [a, ...S], D = await l.detectOverflow(e, g), A = [];
      let k = ((r = o.flip) == null ? void 0 : r.overflows) || [];
      if (u && A.push(D[x]), d) {
        const B = Ev(i, s, y);
        A.push(D[B[0]], D[B[1]]);
      }
      if (k = [...k, {
        placement: i,
        overflows: A
      }], !A.every((B) => B <= 0)) {
        var $, P;
        const B = ((($ = o.flip) == null ? void 0 : $.index) || 0) + 1, K = E[B];
        if (K && (!(d === "alignment" ? _ !== It(K) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        k.every((ee) => It(ee.placement) === _ ? ee.overflows[0] > 0 : !0)))
          return {
            data: {
              index: B,
              overflows: k
            },
            reset: {
              placement: K
            }
          };
        let re = (P = k.filter((Z) => Z.overflows[0] <= 0).sort((Z, ee) => Z.overflows[1] - ee.overflows[1])[0]) == null ? void 0 : P.placement;
        if (!re)
          switch (p) {
            case "bestFit": {
              var W;
              const Z = (W = k.filter((ee) => {
                if (T) {
                  const _e = It(ee.placement);
                  return _e === _ || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  _e === "y";
                }
                return !0;
              }).map((ee) => [ee.placement, ee.overflows.filter((_e) => _e > 0).reduce((_e, Me) => _e + Me, 0)]).sort((ee, _e) => ee[1] - _e[1])[0]) == null ? void 0 : W[0];
              Z && (re = Z);
              break;
            }
            case "initialPlacement":
              re = a;
              break;
          }
        if (i !== re)
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
function $a(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function Ba(t) {
  return wv.some((e) => t[e] >= 0);
}
const $v = function(t) {
  return t === void 0 && (t = {}), {
    name: "hide",
    options: t,
    async fn(e) {
      const {
        rects: n,
        platform: r
      } = e, {
        strategy: i = "referenceHidden",
        ...o
      } = Qt(t, e);
      switch (i) {
        case "referenceHidden": {
          const s = await r.detectOverflow(e, {
            ...o,
            elementContext: "reference"
          }), a = $a(s, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Ba(a)
            }
          };
        }
        case "escaped": {
          const s = await r.detectOverflow(e, {
            ...o,
            altBoundary: !0
          }), a = $a(s, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Ba(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, oc = /* @__PURE__ */ new Set(["left", "top"]);
async function Bv(t, e) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = t, o = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), s = en(n), a = Gn(n), l = It(n) === "y", c = oc.has(s) ? -1 : 1, u = o && l ? -1 : 1, d = Qt(e, t);
  let {
    mainAxis: f,
    crossAxis: p,
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
  return a && typeof h == "number" && (p = a === "end" ? h * -1 : h), l ? {
    x: p * u,
    y: f * c
  } : {
    x: f * c,
    y: p * u
  };
}
const Fv = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, r;
      const {
        x: i,
        y: o,
        placement: s,
        middlewareData: a
      } = e, l = await Bv(e, t);
      return s === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + l.x,
        y: o + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, Nv = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: r,
        placement: i,
        platform: o
      } = e, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (x) => {
            let {
              x: _,
              y: w
            } = x;
            return {
              x: _,
              y: w
            };
          }
        },
        ...c
      } = Qt(t, e), u = {
        x: n,
        y: r
      }, d = await o.detectOverflow(e, c), f = It(en(i)), p = gs(f);
      let h = u[p], m = u[f];
      if (s) {
        const x = p === "y" ? "top" : "left", _ = p === "y" ? "bottom" : "right", w = h + d[x], y = h - d[_];
        h = Ho(w, h, y);
      }
      if (a) {
        const x = f === "y" ? "top" : "left", _ = f === "y" ? "bottom" : "right", w = m + d[x], y = m - d[_];
        m = Ho(w, m, y);
      }
      const g = l.fn({
        ...e,
        [p]: h,
        [f]: m
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - r,
          enabled: {
            [p]: s,
            [f]: a
          }
        }
      };
    }
  };
}, zv = function(t) {
  return t === void 0 && (t = {}), {
    options: t,
    fn(e) {
      const {
        x: n,
        y: r,
        placement: i,
        rects: o,
        middlewareData: s
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = Qt(t, e), u = {
        x: n,
        y: r
      }, d = It(i), f = gs(d);
      let p = u[f], h = u[d];
      const m = Qt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const w = f === "y" ? "height" : "width", y = o.reference[f] - o.floating[w] + g.mainAxis, S = o.reference[f] + o.reference[w] - g.mainAxis;
        p < y ? p = y : p > S && (p = S);
      }
      if (c) {
        var x, _;
        const w = f === "y" ? "width" : "height", y = oc.has(en(i)), S = o.reference[d] - o.floating[w] + (y && ((x = s.offset) == null ? void 0 : x[d]) || 0) + (y ? 0 : g.crossAxis), T = o.reference[d] + o.reference[w] + (y ? 0 : ((_ = s.offset) == null ? void 0 : _[d]) || 0) - (y ? g.crossAxis : 0);
        h < S ? h = S : h > T && (h = T);
      }
      return {
        [f]: p,
        [d]: h
      };
    }
  };
}, qv = function(t) {
  return t === void 0 && (t = {}), {
    name: "size",
    options: t,
    async fn(e) {
      var n, r;
      const {
        placement: i,
        rects: o,
        platform: s,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...c
      } = Qt(t, e), u = await s.detectOverflow(e, c), d = en(i), f = Gn(i), p = It(i) === "y", {
        width: h,
        height: m
      } = o.floating;
      let g, x;
      d === "top" || d === "bottom" ? (g = d, x = f === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (x = d, g = f === "end" ? "top" : "bottom");
      const _ = m - u.top - u.bottom, w = h - u.left - u.right, y = pn(m - u[g], _), S = pn(h - u[x], w), T = !e.middlewareData.shift;
      let E = y, D = S;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (D = w), (r = e.middlewareData.shift) != null && r.enabled.y && (E = _), T && !f) {
        const k = ot(u.left, 0), $ = ot(u.right, 0), P = ot(u.top, 0), W = ot(u.bottom, 0);
        p ? D = h - 2 * (k !== 0 || $ !== 0 ? k + $ : ot(u.left, u.right)) : E = m - 2 * (P !== 0 || W !== 0 ? P + W : ot(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: D,
        availableHeight: E
      });
      const A = await s.getDimensions(a.floating);
      return h !== A.width || m !== A.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Hi() {
  return typeof window < "u";
}
function In(t) {
  return _s(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function at(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Nt(t) {
  var e;
  return (e = (_s(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function _s(t) {
  return Hi() ? t instanceof Node || t instanceof at(t).Node : !1;
}
function xt(t) {
  return Hi() ? t instanceof Element || t instanceof at(t).Element : !1;
}
function Bt(t) {
  return Hi() ? t instanceof HTMLElement || t instanceof at(t).HTMLElement : !1;
}
function Fa(t) {
  return !Hi() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof at(t).ShadowRoot;
}
const Hv = /* @__PURE__ */ new Set(["inline", "contents"]);
function $r(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: r,
    display: i
  } = St(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + n) && !Hv.has(i);
}
const Vv = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Wv(t) {
  return Vv.has(In(t));
}
const jv = [":popover-open", ":modal"];
function Vi(t) {
  return jv.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Uv = ["transform", "translate", "scale", "rotate", "perspective"], Kv = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Xv = ["paint", "layout", "strict", "content"];
function ws(t) {
  const e = xs(), n = xt(t) ? St(t) : t;
  return Uv.some((r) => n[r] ? n[r] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Kv.some((r) => (n.willChange || "").includes(r)) || Xv.some((r) => (n.contain || "").includes(r));
}
function Yv(t) {
  let e = hn(t);
  for (; Bt(e) && !Yn(e); ) {
    if (ws(e))
      return e;
    if (Vi(e))
      return null;
    e = hn(e);
  }
  return null;
}
function xs() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Gv = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Yn(t) {
  return Gv.has(In(t));
}
function St(t) {
  return at(t).getComputedStyle(t);
}
function Wi(t) {
  return xt(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function hn(t) {
  if (In(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Fa(t) && t.host || // Fallback.
    Nt(t)
  );
  return Fa(e) ? e.host : e;
}
function sc(t) {
  const e = hn(t);
  return Yn(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Bt(e) && $r(e) ? e : sc(e);
}
function Ar(t, e, n) {
  var r;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const i = sc(t), o = i === ((r = t.ownerDocument) == null ? void 0 : r.body), s = at(i);
  if (o) {
    const a = Wo(s);
    return e.concat(s, s.visualViewport || [], $r(i) ? i : [], a && n ? Ar(a) : []);
  }
  return e.concat(i, Ar(i, [], n));
}
function Wo(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function ac(t) {
  const e = St(t);
  let n = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = Bt(t), o = i ? t.offsetWidth : n, s = i ? t.offsetHeight : r, a = mi(n) !== o || mi(r) !== s;
  return a && (n = o, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function Ss(t) {
  return xt(t) ? t : t.contextElement;
}
function Un(t) {
  const e = Ss(t);
  if (!Bt(e))
    return Dt(1);
  const n = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: o
  } = ac(e);
  let s = (o ? mi(n.width) : n.width) / r, a = (o ? mi(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const Jv = /* @__PURE__ */ Dt(0);
function lc(t) {
  const e = at(t);
  return !xs() || !e.visualViewport ? Jv : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Zv(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== at(t) ? !1 : e;
}
function Pn(t, e, n, r) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), o = Ss(t);
  let s = Dt(1);
  e && (r ? xt(r) && (s = Un(r)) : s = Un(t));
  const a = Zv(o, n, r) ? lc(o) : Dt(0);
  let l = (i.left + a.x) / s.x, c = (i.top + a.y) / s.y, u = i.width / s.x, d = i.height / s.y;
  if (o) {
    const f = at(o), p = r && xt(r) ? at(r) : r;
    let h = f, m = Wo(h);
    for (; m && r && p !== h; ) {
      const g = Un(m), x = m.getBoundingClientRect(), _ = St(m), w = x.left + (m.clientLeft + parseFloat(_.paddingLeft)) * g.x, y = x.top + (m.clientTop + parseFloat(_.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += w, c += y, h = at(m), m = Wo(h);
    }
  }
  return yi({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function ji(t, e) {
  const n = Wi(t).scrollLeft;
  return e ? e.left + n : Pn(Nt(t)).left + n;
}
function uc(t, e) {
  const n = t.getBoundingClientRect(), r = n.left + e.scrollLeft - ji(t, n), i = n.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function Qv(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: r,
    strategy: i
  } = t;
  const o = i === "fixed", s = Nt(r), a = e ? Vi(e.floating) : !1;
  if (r === s || a && o)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Dt(1);
  const u = Dt(0), d = Bt(r);
  if ((d || !d && !o) && ((In(r) !== "body" || $r(s)) && (l = Wi(r)), Bt(r))) {
    const p = Pn(r);
    c = Un(r), u.x = p.x + r.clientLeft, u.y = p.y + r.clientTop;
  }
  const f = s && !d && !o ? uc(s, l) : Dt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function em(t) {
  return Array.from(t.getClientRects());
}
function tm(t) {
  const e = Nt(t), n = Wi(t), r = t.ownerDocument.body, i = ot(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), o = ot(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + ji(t);
  const a = -n.scrollTop;
  return St(r).direction === "rtl" && (s += ot(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: o,
    x: s,
    y: a
  };
}
const Na = 25;
function nm(t, e) {
  const n = at(t), r = Nt(t), i = n.visualViewport;
  let o = r.clientWidth, s = r.clientHeight, a = 0, l = 0;
  if (i) {
    o = i.width, s = i.height;
    const u = xs();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = ji(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), p = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, h = Math.abs(r.clientWidth - d.clientWidth - p);
    h <= Na && (o -= h);
  } else c <= Na && (o += c);
  return {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
const rm = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function im(t, e) {
  const n = Pn(t, !0, e === "fixed"), r = n.top + t.clientTop, i = n.left + t.clientLeft, o = Bt(t) ? Un(t) : Dt(1), s = t.clientWidth * o.x, a = t.clientHeight * o.y, l = i * o.x, c = r * o.y;
  return {
    width: s,
    height: a,
    x: l,
    y: c
  };
}
function za(t, e, n) {
  let r;
  if (e === "viewport")
    r = nm(t, n);
  else if (e === "document")
    r = tm(Nt(t));
  else if (xt(e))
    r = im(e, n);
  else {
    const i = lc(t);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return yi(r);
}
function cc(t, e) {
  const n = hn(t);
  return n === e || !xt(n) || Yn(n) ? !1 : St(n).position === "fixed" || cc(n, e);
}
function om(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let r = Ar(t, [], !1).filter((a) => xt(a) && In(a) !== "body"), i = null;
  const o = St(t).position === "fixed";
  let s = o ? hn(t) : t;
  for (; xt(s) && !Yn(s); ) {
    const a = St(s), l = ws(s);
    !l && a.position === "fixed" && (i = null), (o ? !l && !i : !l && a.position === "static" && !!i && rm.has(i.position) || $r(s) && !l && cc(t, s)) ? r = r.filter((u) => u !== s) : i = a, s = hn(s);
  }
  return e.set(t, r), r;
}
function sm(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = t;
  const s = [...n === "clippingAncestors" ? Vi(e) ? [] : om(e, this._c) : [].concat(n), r], a = s[0], l = s.reduce((c, u) => {
    const d = za(e, u, i);
    return c.top = ot(d.top, c.top), c.right = pn(d.right, c.right), c.bottom = pn(d.bottom, c.bottom), c.left = ot(d.left, c.left), c;
  }, za(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function am(t) {
  const {
    width: e,
    height: n
  } = ac(t);
  return {
    width: e,
    height: n
  };
}
function lm(t, e, n) {
  const r = Bt(e), i = Nt(e), o = n === "fixed", s = Pn(t, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Dt(0);
  function c() {
    l.x = ji(i);
  }
  if (r || !r && !o)
    if ((In(e) !== "body" || $r(i)) && (a = Wi(e)), r) {
      const p = Pn(e, !0, o, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
    } else i && c();
  o && !r && i && c();
  const u = i && !r && !o ? uc(i, a) : Dt(0), d = s.left + a.scrollLeft - l.x - u.x, f = s.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: s.width,
    height: s.height
  };
}
function vo(t) {
  return St(t).position === "static";
}
function qa(t, e) {
  if (!Bt(t) || St(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return Nt(t) === n && (n = n.ownerDocument.body), n;
}
function dc(t, e) {
  const n = at(t);
  if (Vi(t))
    return n;
  if (!Bt(t)) {
    let i = hn(t);
    for (; i && !Yn(i); ) {
      if (xt(i) && !vo(i))
        return i;
      i = hn(i);
    }
    return n;
  }
  let r = qa(t, e);
  for (; r && Wv(r) && vo(r); )
    r = qa(r, e);
  return r && Yn(r) && vo(r) && !ws(r) ? n : r || Yv(t) || n;
}
const um = async function(t) {
  const e = this.getOffsetParent || dc, n = this.getDimensions, r = await n(t.floating);
  return {
    reference: lm(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function cm(t) {
  return St(t).direction === "rtl";
}
const dm = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Qv,
  getDocumentElement: Nt,
  getClippingRect: sm,
  getOffsetParent: dc,
  getElementRects: um,
  getClientRects: em,
  getDimensions: am,
  getScale: Un,
  isElement: xt,
  isRTL: cm
};
function fc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function fm(t, e) {
  let n = null, r;
  const i = Nt(t);
  function o() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const c = t.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: p
    } = c;
    if (a || e(), !f || !p)
      return;
    const h = Ur(d), m = Ur(i.clientWidth - (u + f)), g = Ur(i.clientHeight - (d + p)), x = Ur(u), w = {
      rootMargin: -h + "px " + -m + "px " + -g + "px " + -x + "px",
      threshold: ot(0, pn(1, l)) || 1
    };
    let y = !0;
    function S(T) {
      const E = T[0].intersectionRatio;
      if (E !== l) {
        if (!y)
          return s();
        E ? s(!1, E) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      E === 1 && !fc(c, t.getBoundingClientRect()) && s(), y = !1;
    }
    try {
      n = new IntersectionObserver(S, {
        ...w,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(S, w);
    }
    n.observe(t);
  }
  return s(!0), o;
}
function pm(t, e, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = Ss(t), u = i || o ? [...c ? Ar(c) : [], ...Ar(e)] : [];
  u.forEach((x) => {
    i && x.addEventListener("scroll", n, {
      passive: !0
    }), o && x.addEventListener("resize", n);
  });
  const d = c && a ? fm(c, n) : null;
  let f = -1, p = null;
  s && (p = new ResizeObserver((x) => {
    let [_] = x;
    _ && _.target === c && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var w;
      (w = p) == null || w.observe(e);
    })), n();
  }), c && !l && p.observe(c), p.observe(e));
  let h, m = l ? Pn(t) : null;
  l && g();
  function g() {
    const x = Pn(t);
    m && !fc(m, x) && n(), m = x, h = requestAnimationFrame(g);
  }
  return n(), () => {
    var x;
    u.forEach((_) => {
      i && _.removeEventListener("scroll", n), o && _.removeEventListener("resize", n);
    }), d?.(), (x = p) == null || x.disconnect(), p = null, l && cancelAnimationFrame(h);
  };
}
const hm = Fv, vm = Nv, Ha = Dv, mm = qv, gm = $v, ym = Mv, bm = zv, _m = (t, e, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: dm,
    ...n
  }, o = {
    ...i.platform,
    _c: r
  };
  return Iv(t, e, {
    ...i,
    platform: o
  });
};
function wm(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function jo(t) {
  if (wm(t)) {
    const e = t.$el;
    return _s(e) && In(e) === "#comment" ? null : e;
  }
  return t;
}
function zn(t) {
  return typeof t == "function" ? t() : v(t);
}
function xm(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = jo(zn(t.element));
      return n == null ? {} : ym({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function pc(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Va(t, e) {
  const n = pc(t);
  return Math.round(e * n) / n;
}
function Sm(t, e, n) {
  n === void 0 && (n = {});
  const r = n.whileElementsMounted, i = M(() => {
    var E;
    return (E = zn(n.open)) != null ? E : !0;
  }), o = M(() => zn(n.middleware)), s = M(() => {
    var E;
    return (E = zn(n.placement)) != null ? E : "bottom";
  }), a = M(() => {
    var E;
    return (E = zn(n.strategy)) != null ? E : "absolute";
  }), l = M(() => {
    var E;
    return (E = zn(n.transform)) != null ? E : !0;
  }), c = M(() => jo(t.value)), u = M(() => jo(e.value)), d = /* @__PURE__ */ L(0), f = /* @__PURE__ */ L(0), p = /* @__PURE__ */ L(a.value), h = /* @__PURE__ */ L(s.value), m = /* @__PURE__ */ kn({}), g = /* @__PURE__ */ L(!1), x = M(() => {
    const E = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return E;
    const D = Va(u.value, d.value), A = Va(u.value, f.value);
    return l.value ? {
      ...E,
      transform: "translate(" + D + "px, " + A + "px)",
      ...pc(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: D + "px",
      top: A + "px"
    };
  });
  let _;
  function w() {
    if (c.value == null || u.value == null)
      return;
    const E = i.value;
    _m(c.value, u.value, {
      middleware: o.value,
      placement: s.value,
      strategy: a.value
    }).then((D) => {
      d.value = D.x, f.value = D.y, p.value = D.strategy, h.value = D.placement, m.value = D.middlewareData, g.value = E !== !1;
    });
  }
  function y() {
    typeof _ == "function" && (_(), _ = void 0);
  }
  function S() {
    if (y(), r === void 0) {
      w();
      return;
    }
    if (c.value != null && u.value != null) {
      _ = r(c.value, u.value, w);
      return;
    }
  }
  function T() {
    i.value || (g.value = !1);
  }
  return xe([o, s, a, i], w, {
    flush: "sync"
  }), xe([c, u], S, {
    flush: "sync"
  }), xe(i, T, {
    flush: "sync"
  }), Qo() && vl(y), {
    x: /* @__PURE__ */ $n(d),
    y: /* @__PURE__ */ $n(f),
    strategy: /* @__PURE__ */ $n(p),
    placement: /* @__PURE__ */ $n(h),
    middlewareData: /* @__PURE__ */ $n(m),
    isPositioned: /* @__PURE__ */ $n(g),
    floatingStyles: x,
    update: w
  };
}
const Cm = {
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
}, [x0, Em] = dt("PopperContent");
var Tm = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Ud({
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
  }, { ...Cm }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, r = e, i = rc(), { forwardRef: o, currentElement: s } = ge(), a = /* @__PURE__ */ L(), l = /* @__PURE__ */ L(), { width: c, height: u } = Ah(l), d = M(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), f = M(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), p = M(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = M(() => ({
      padding: f.value,
      boundary: p.value.filter(bv),
      altBoundary: p.value.length > 0
    })), m = M(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), g = Qp(() => [
      hm({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && Ha({
        ...h.value,
        ...m.value
      }),
      n.avoidCollisions && vm({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? bm() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && Ha({
        ...h.value,
        ...m.value
      }),
      mm({
        ...h.value,
        apply: ({ elements: P, rects: W, availableWidth: B, availableHeight: K }) => {
          const { width: re, height: Z } = W.reference, ee = P.floating.style;
          ee.setProperty("--reka-popper-available-width", `${B}px`), ee.setProperty("--reka-popper-available-height", `${K}px`), ee.setProperty("--reka-popper-anchor-width", `${re}px`), ee.setProperty("--reka-popper-anchor-height", `${Z}px`);
        }
      }),
      l.value && xm({
        element: l.value,
        padding: n.arrowPadding
      }),
      _v({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && gm({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), x = M(() => n.reference ?? i.anchor.value), { floatingStyles: _, placement: w, isPositioned: y, middlewareData: S } = Sm(x, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...P) => pm(...P, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: g
    }), T = M(() => qo(w.value)[0]), E = M(() => qo(w.value)[1]);
    Hl(() => {
      y.value && r("placed");
    });
    const D = M(() => {
      const P = S.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && P;
    }), A = /* @__PURE__ */ L("");
    ze(() => {
      s.value && (A.value = window.getComputedStyle(s.value).zIndex);
    });
    const k = M(() => S.value.arrow?.x ?? 0), $ = M(() => S.value.arrow?.y ?? 0);
    return Em({
      placedSide: T,
      onArrowChange: (P) => l.value = P,
      arrowX: k,
      arrowY: $,
      shouldHideArrow: D
    }), (P, W) => (O(), ce("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: nt({
        ...v(_),
        transform: v(y) ? v(_).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: A.value,
        "--reka-popper-transform-origin": [v(S).transformOrigin?.x, v(S).transformOrigin?.y].join(" "),
        ...v(S).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [H(v(Ce), de({ ref: v(o) }, P.$attrs, {
      "as-child": n.asChild,
      as: P.as,
      "data-side": T.value,
      "data-align": E.value,
      style: { animation: v(y) ? void 0 : "none" }
    }), {
      default: I(() => [Q(P.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Am = Tm;
function km(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((r) => pr(r, e, n)) : pr(t, e, n);
}
function pr(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : vi(t, e);
}
const [Cs, Pm] = dt("ListboxRoot");
var Om = /* @__PURE__ */ X({
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
    const r = t, i = n, { multiple: o, highlightOnHover: s, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ tn(r), { getItems: d } = mn({ isProvider: !0 }), { handleTypeaheadSearch: f } = ms(), { primitiveElement: p, currentElement: h } = Tr(), m = Th(), g = ps(u), x = Hu(h), _ = /* @__PURE__ */ L(), w = /* @__PURE__ */ L(!1), y = /* @__PURE__ */ L(!0), S = /* @__PURE__ */ Cr(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (o.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function T(G) {
      if (w.value = !0, r.multiple) {
        const oe = Array.isArray(S.value) ? [...S.value] : [], ue = oe.findIndex((he) => pr(he, G, r.by));
        r.selectionBehavior === "toggle" ? (ue === -1 ? oe.push(G) : oe.splice(ue, 1), S.value = oe) : (S.value = [G], _.value = G);
      } else r.selectionBehavior === "toggle" && pr(S.value, G, r.by) ? S.value = void 0 : S.value = G;
      setTimeout(() => {
        w.value = !1;
      }, 1);
    }
    const E = /* @__PURE__ */ L(null), D = /* @__PURE__ */ L(null), A = /* @__PURE__ */ L(!1), k = /* @__PURE__ */ L(!1), $ = /* @__PURE__ */ ao(), P = /* @__PURE__ */ ao(), W = /* @__PURE__ */ ao();
    function B() {
      return d().map((G) => G.ref).filter((G) => G.dataset.disabled !== "");
    }
    function K(G, oe = !0) {
      if (!G) return;
      E.value = G, y.value && E.value.focus(), oe && E.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((he) => he.ref === G);
      i("highlight", ue);
    }
    function re(G) {
      if (A.value) W.trigger(G);
      else {
        const oe = d().find((ue) => pr(ue.value, G, r.by));
        oe && (E.value = oe.ref, K(oe.ref));
      }
    }
    function Z(G) {
      E.value && E.value.isConnected && (G.preventDefault(), G.stopPropagation(), k.value || E.value.click());
    }
    function ee(G) {
      if (y.value) {
        if (w.value = !0, A.value) P.trigger(G);
        else {
          const oe = G.altKey || G.ctrlKey || G.metaKey;
          if (oe && G.key === "a" && o.value) {
            const ue = d(), he = ue.map((vt) => vt.value);
            S.value = [...he], G.preventDefault(), K(ue[ue.length - 1].ref);
          } else if (!oe) {
            const ue = f(G.key, d());
            ue && K(ue);
          }
        }
        setTimeout(() => {
          w.value = !1;
        }, 1);
      }
    }
    function _e() {
      k.value = !0;
    }
    function Me() {
      Ie(() => {
        k.value = !1;
      });
    }
    function Je() {
      Ie(() => {
        const G = new KeyboardEvent("keydown", { key: "PageUp" });
        qt(G);
      });
    }
    function Re(G) {
      const oe = E.value;
      oe?.isConnected && (D.value = oe), E.value = null, i("leave", G);
    }
    function zt(G) {
      const oe = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (G.currentTarget?.dispatchEvent(oe), i("entryFocus", oe), !oe.defaultPrevented)
        if (D.value) K(D.value);
        else {
          const ue = B()?.[0];
          K(ue);
        }
    }
    function qt(G) {
      const oe = uv(G, a.value, g.value);
      if (!oe) return;
      let ue = B();
      if (E.value) {
        if (oe === "last") ue.reverse();
        else if (oe === "prev" || oe === "next") {
          oe === "prev" && ue.reverse();
          const he = ue.indexOf(E.value);
          ue = ue.slice(he + 1);
        }
        Jn(G, ue[0]);
      }
      if (ue.length) {
        const he = !E.value && oe === "prev" ? ue.length - 1 : 0;
        K(ue[he]);
      }
      if (A.value) return P.trigger(G);
    }
    function Jn(G, oe) {
      if (!(A.value || r.selectionBehavior !== "replace" || !o.value || !Array.isArray(S.value) || (G.altKey || G.ctrlKey || G.metaKey) && !G.shiftKey) && G.shiftKey) {
        const he = d().filter((C) => C.ref.dataset.disabled !== "");
        let vt = he.find((C) => C.ref === oe)?.value;
        if (G.key === m.END ? vt = he[he.length - 1].value : G.key === m.HOME && (vt = he[0].value), !vt || !_.value) return;
        const b = Zp(he.map((C) => C.value), _.value, vt);
        S.value = b;
      }
    }
    async function Ht(G) {
      if (await Ie(), A.value) $.trigger(G);
      else {
        const oe = B(), ue = oe.find((he) => he.dataset.state === "checked");
        ue ? K(ue) : oe.length && K(oe[0]);
      }
    }
    return xe(S, () => {
      w.value || Ie(() => {
        Ht();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: E,
      highlightItem: re,
      highlightFirstItem: Je,
      highlightSelected: Ht,
      getItems: d
    }), Pm({
      modelValue: S,
      onValueChange: T,
      multiple: o,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: s,
      highlightedElement: E,
      isVirtual: A,
      virtualFocusHook: $,
      virtualKeydownHook: P,
      virtualHighlightHook: W,
      by: r.by,
      firstValue: _,
      selectionBehavior: c,
      focusable: y,
      onLeave: Re,
      onEnter: zt,
      changeHighlight: K,
      onKeydownEnter: Z,
      onKeydownNavigation: qt,
      onKeydownTypeAhead: ee,
      onCompositionStart: _e,
      onCompositionEnd: Me,
      highlightFirstItem: Je
    }), (G, oe) => (O(), V(v(Ce), {
      ref_key: "primitiveElement",
      ref: p,
      as: G.as,
      "as-child": G.asChild,
      dir: v(g),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Re,
      onFocusout: oe[0] || (oe[0] = async (ue) => {
        const he = ue.relatedTarget || ue.target;
        await Ie(), E.value && v(h) && !v(h).contains(he) && Re(ue);
      })
    }, {
      default: I(() => [Q(G.$slots, "default", { modelValue: v(S) }), v(x) && G.name ? (O(), V(v(pv), {
        key: 0,
        name: G.name,
        value: v(S),
        disabled: v(l),
        required: G.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : fe("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), Rm = Om, Lm = /* @__PURE__ */ X({
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
    const { CollectionSlot: e } = mn(), n = Cs(), r = Bu(!1, 10);
    return (i, o) => (O(), V(v(e), null, {
      default: I(() => [H(v(Ce), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: o[0] || (o[0] = dn((s) => r.value = !0, ["left"])),
        onFocus: o[1] || (o[1] = (s) => {
          v(r) || v(n).onEnter(s);
        }),
        onKeydown: [
          o[2] || (o[2] = xr((s) => {
            v(n).orientation.value === "vertical" && (s.key === "ArrowLeft" || s.key === "ArrowRight") || v(n).orientation.value === "horizontal" && (s.key === "ArrowUp" || s.key === "ArrowDown") || (s.preventDefault(), v(n).focusable.value && v(n).onKeydownNavigation(s));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          xr(v(n).onKeydownEnter, ["enter"]),
          v(n).onKeydownTypeAhead
        ]
      }, {
        default: I(() => [Q(i.$slots, "default")]),
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
}), Im = Lm, Mm = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, i = /* @__PURE__ */ Cr(n, "modelValue", e, {
      defaultValue: "",
      passive: n.modelValue === void 0
    }), o = Cs(), { primitiveElement: s, currentElement: a } = Tr(), l = M(() => n.disabled || o.disabled.value || !1), c = /* @__PURE__ */ L();
    return Vl(() => c.value = o.highlightedElement.value?.id), ke(() => {
      o.focusable.value = !1, setTimeout(() => {
        n.autoFocus && a.value?.focus();
      }, 1);
    }), lt(() => {
      o.focusable.value = !0;
    }), (u, d) => (O(), V(v(Ce), {
      ref_key: "primitiveElement",
      ref: s,
      as: u.as,
      "as-child": u.asChild,
      value: v(i),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": c.value,
      type: "text",
      onKeydown: [xr(dn(v(o).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), xr(v(o).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (f) => {
        i.value = f.target.value, v(o).highlightFirstItem();
      }),
      onCompositionstart: v(o).onCompositionStart,
      onCompositionend: v(o).onCompositionEnd
    }, {
      default: I(() => [Q(u.$slots, "default", { modelValue: v(i) })]),
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
}), Dm = Mm;
const $m = "listbox.select", [Bm, Fm] = dt("ListboxItem");
var Nm = /* @__PURE__ */ X({
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
    const n = t, r = e, i = Er(void 0, "reka-listbox-item"), { CollectionItem: o } = mn(), { forwardRef: s, currentElement: a } = ge(), l = Cs(), c = M(() => a.value === l.highlightedElement.value), u = M(() => km(l.modelValue.value, n.value, l.by)), d = M(() => l.disabled.value || n.disabled);
    async function f(h) {
      r("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function p(h) {
      const m = {
        originalEvent: h,
        value: n.value
      };
      Fi($m, f, m);
    }
    return Fm({ isSelected: u }), (h, m) => (O(), V(v(o), { value: h.value }, {
      default: I(() => [Pf([c.value, u.value], () => H(v(Ce), de({ id: v(i) }, h.$attrs, {
        ref: v(s),
        role: "option",
        tabindex: v(l).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: h.as,
        "as-child": h.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: p,
        onKeydown: xr(dn(p, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
        })
      }), {
        default: I(() => [Q(h.$slots, "default")]),
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
}), zm = Nm, qm = /* @__PURE__ */ X({
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
    ge();
    const n = Bm();
    return (r, i) => v(n).isSelected.value ? (O(), V(v(Ce), de({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), Hm = qm;
function hc(t) {
  const e = ds({ nonce: /* @__PURE__ */ L() });
  return M(() => t?.value || e.nonce?.value);
}
const [Ct, Vm] = dt("ScrollAreaRoot");
var Wm = /* @__PURE__ */ X({
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
  setup(t, { expose: e }) {
    const n = t, r = /* @__PURE__ */ L(0), i = /* @__PURE__ */ L(0), o = /* @__PURE__ */ L(), s = /* @__PURE__ */ L(), a = /* @__PURE__ */ L(), l = /* @__PURE__ */ L(), c = /* @__PURE__ */ L(!1), u = /* @__PURE__ */ L(!1), { type: d, dir: f, scrollHideDelay: p } = /* @__PURE__ */ tn(n), h = ps(f);
    function m() {
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
      scrollTop: m,
      scrollTopLeft: g
    });
    const { forwardRef: x, currentElement: _ } = ge();
    return Vm({
      type: d,
      dir: h,
      scrollHideDelay: p,
      scrollArea: _,
      viewport: o,
      onViewportChange: (w) => {
        o.value = w || void 0;
      },
      content: s,
      onContentChange: (w) => {
        s.value = w;
      },
      scrollbarX: a,
      scrollbarXEnabled: c,
      scrollbarY: l,
      scrollbarYEnabled: u,
      onScrollbarXChange: (w) => {
        a.value = w || void 0;
      },
      onScrollbarYChange: (w) => {
        l.value = w || void 0;
      },
      onScrollbarXEnabledChange: (w) => {
        c.value = w;
      },
      onScrollbarYEnabledChange: (w) => {
        u.value = w;
      },
      onCornerWidthChange: (w) => {
        r.value = w;
      },
      onCornerHeightChange: (w) => {
        i.value = w;
      }
    }), (w, y) => (O(), V(v(Ce), {
      ref: v(x),
      "as-child": n.asChild,
      as: w.as,
      dir: v(h),
      style: nt({
        position: "relative",
        "--reka-scroll-area-corner-width": `${r.value}px`,
        "--reka-scroll-area-corner-height": `${i.value}px`
      })
    }, {
      default: I(() => [Q(w.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "dir",
      "style"
    ]));
  }
}), jm = Wm;
function vc(t, e) {
  return (n) => {
    if (t[0] === t[1] || e[0] === e[1]) return e[0];
    const r = (e[1] - e[0]) / (t[1] - t[0]);
    return e[0] + r * (n - t[0]);
  };
}
function Ui(t) {
  const e = mc(t.viewport, t.content), n = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, r = (t.scrollbar.size - n) * e;
  return Math.max(r, 18);
}
function mc(t, e) {
  const n = t / e;
  return Number.isNaN(n) ? 0 : n;
}
function Um(t, e = () => {
}) {
  let n = {
    left: t.scrollLeft,
    top: t.scrollTop
  }, r = 0;
  return (function i() {
    const o = {
      left: t.scrollLeft,
      top: t.scrollTop
    }, s = n.left !== o.left, a = n.top !== o.top;
    (s || a) && e(), n = o, r = window.requestAnimationFrame(i);
  })(), () => window.cancelAnimationFrame(r);
}
function Wa(t, e, n = "ltr") {
  const r = Ui(e), i = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = e.scrollbar.size - i, s = e.content - e.viewport, a = o - r, l = n === "ltr" ? [0, s] : [s * -1, 0], c = Bo(t, l[0], l[1]);
  return vc([0, s], [0, a])(c);
}
function Kr(t) {
  return t ? Number.parseInt(t, 10) : 0;
}
function Km(t, e, n, r = "ltr") {
  const i = Ui(n), o = i / 2, s = e || o, a = i - s, l = n.scrollbar.paddingStart + s, c = n.scrollbar.size - n.scrollbar.paddingEnd - a, u = n.content - n.viewport, d = r === "ltr" ? [0, u] : [u * -1, 0];
  return vc([l, c], d)(t);
}
function ja(t, e) {
  return t > 0 && t < e;
}
var Xm = /* @__PURE__ */ X({
  __name: "ScrollAreaScrollbarX",
  setup(t) {
    const e = Ct(), n = Ki(), { forwardRef: r, currentElement: i } = ge();
    ke(() => {
      i.value && e.onScrollbarXChange(i.value);
    });
    const o = M(() => n.sizes.value);
    return (s, a) => (O(), V(gc, {
      ref: v(r),
      "is-horizontal": !0,
      "data-orientation": "horizontal",
      style: nt({
        bottom: 0,
        left: v(e).dir.value === "rtl" ? "var(--reka-scroll-area-corner-width)" : 0,
        right: v(e).dir.value === "ltr" ? "var(--reka-scroll-area-corner-width)" : 0,
        "--reka-scroll-area-thumb-width": o.value ? `${v(Ui)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => v(n).onDragScroll(l.x))
    }, {
      default: I(() => [Q(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), Ym = Xm, Gm = /* @__PURE__ */ X({
  __name: "ScrollAreaScrollbarY",
  setup(t) {
    const e = Ct(), n = Ki(), { forwardRef: r, currentElement: i } = ge();
    ke(() => {
      i.value && e.onScrollbarYChange(i.value);
    });
    const o = M(() => n.sizes.value);
    return (s, a) => (O(), V(gc, {
      ref: v(r),
      "is-horizontal": !1,
      "data-orientation": "vertical",
      style: nt({
        top: 0,
        right: v(e).dir.value === "ltr" ? 0 : void 0,
        left: v(e).dir.value === "rtl" ? 0 : void 0,
        bottom: "var(--reka-scroll-area-corner-height)",
        "--reka-scroll-area-thumb-height": o.value ? `${v(Ui)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => v(n).onDragScroll(l.y))
    }, {
      default: I(() => [Q(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), Jm = Gm, Zm = /* @__PURE__ */ X({
  __name: "ScrollAreaScrollbarAuto",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Br(), { forwardRef: r } = ge(), i = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ fs(() => {
      if (e.viewport.value) {
        const s = e.viewport.value.offsetWidth < e.viewport.value.scrollWidth, a = e.viewport.value.offsetHeight < e.viewport.value.scrollHeight;
        i.value = n.isHorizontal.value ? s : a;
      }
    }, 10);
    return ke(() => o()), Sr(e.viewport, o), Sr(e.content, o), (s, a) => (O(), V(v(Ln), { present: s.forceMount || i.value }, {
      default: I(() => [H(Ts, de(s.$attrs, {
        ref: v(r),
        "data-state": i.value ? "visible" : "hidden"
      }), {
        default: I(() => [Q(s.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), Es = Zm, Qm = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarGlimpse",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Br(), { forwardRef: r } = ge(), { state: i, dispatch: o } = vs("hidden", {
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
    }), s = M(() => i.value !== "hidden");
    function a() {
      o("POINTER_ENTER");
    }
    function l() {
      o("POINTER_LEAVE");
    }
    const c = /* @__PURE__ */ fs(() => o("SCROLL_END"), 100);
    return ze((u) => {
      if (i.value === "glimpse") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        u(() => {
          window.clearTimeout(d);
        });
      }
    }), ze((u) => {
      if (i.value === "idle") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        u(() => {
          window.clearTimeout(d);
        });
      }
    }), ze((u) => {
      const d = e.viewport.value, f = n.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (d) {
        let p = d[f];
        const h = () => {
          const m = d[f];
          p !== m && (o("SCROLL"), c()), p = m;
        };
        d.addEventListener("scroll", h), u(() => {
          d.removeEventListener("scroll", h);
        });
      }
    }), ke(() => {
      const u = e.scrollArea.value;
      u && (u.addEventListener("pointerenter", a), u.addEventListener("pointerleave", l));
    }), lt(() => {
      const u = e.scrollArea.value;
      u && (u.removeEventListener("pointerenter", a), u.removeEventListener("pointerleave", l));
    }), (u, d) => (O(), V(v(Ln), { present: u.forceMount || s.value }, {
      default: I(() => [H(Es, de(u.$attrs, {
        ref: v(r),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: I(() => [Q(u.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), eg = Qm, tg = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarHover",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), { forwardRef: n } = ge();
    let r;
    const i = /* @__PURE__ */ L(!1);
    function o() {
      window.clearTimeout(r), i.value = !0;
    }
    function s() {
      r = window.setTimeout(() => {
        i.value = !1;
      }, e.scrollHideDelay.value);
    }
    return ke(() => {
      const a = e.scrollArea.value;
      a && (a.addEventListener("pointerenter", o), a.addEventListener("pointerleave", s));
    }), lt(() => {
      const a = e.scrollArea.value;
      a && (window.clearTimeout(r), a.removeEventListener("pointerenter", o), a.removeEventListener("pointerleave", s));
    }), (a, l) => (O(), V(v(Ln), { present: a.forceMount || i.value }, {
      default: I(() => [H(Es, de(a.$attrs, {
        ref: v(n),
        "data-state": i.value ? "visible" : "hidden"
      }), {
        default: I(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), ng = tg, rg = /* @__PURE__ */ X({
  __name: "ScrollAreaScrollbarScroll",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Br(), { forwardRef: r } = ge(), { state: i, dispatch: o } = vs("hidden", {
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
    }), s = M(() => i.value !== "hidden");
    ze((l) => {
      if (i.value === "idle") {
        const c = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        l(() => {
          window.clearTimeout(c);
        });
      }
    });
    const a = /* @__PURE__ */ fs(() => o("SCROLL_END"), 100);
    return ze((l) => {
      const c = e.viewport.value, u = n.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (c) {
        let d = c[u];
        const f = () => {
          const p = c[u];
          d !== p && (o("SCROLL"), a()), d = p;
        };
        c.addEventListener("scroll", f), l(() => {
          c.removeEventListener("scroll", f);
        });
      }
    }), (l, c) => (O(), V(v(Ln), { present: l.forceMount || s.value }, {
      default: I(() => [H(Ts, de(l.$attrs, {
        ref: v(r),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: I(() => [Q(l.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), ig = rg;
const [Br, og] = dt("ScrollAreaScrollbar");
var sg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, { forwardRef: n } = ge(), r = Ct(), i = M(() => e.orientation === "horizontal");
    xe(i, () => {
      i.value ? r.onScrollbarXEnabledChange(!0) : r.onScrollbarYEnabledChange(!0);
    }, { immediate: !0 }), lt(() => {
      r.onScrollbarXEnabledChange(!1), r.onScrollbarYEnabledChange(!1);
    });
    const { orientation: o, forceMount: s, asChild: a, as: l } = /* @__PURE__ */ tn(e);
    return og({
      orientation: o,
      forceMount: s,
      isHorizontal: i,
      as: l,
      asChild: a
    }), (c, u) => v(r).type.value === "hover" ? (O(), V(ng, de({ key: 0 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(s)
    }), {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "scroll" ? (O(), V(ig, de({ key: 1 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(s)
    }), {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "glimpse" ? (O(), V(eg, de({ key: 2 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(s)
    }), {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "auto" ? (O(), V(Es, de({ key: 3 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(s)
    }), {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "always" ? (O(), V(Ts, de({ key: 4 }, c.$attrs, {
      ref: v(n),
      "data-state": "visible"
    }), {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), ag = sg;
const [Ki, lg] = dt("ScrollAreaScrollbarVisible");
var ug = /* @__PURE__ */ X({
  __name: "ScrollAreaScrollbarVisible",
  setup(t) {
    const e = Ct(), n = Br(), { forwardRef: r } = ge(), i = /* @__PURE__ */ L({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    }), o = M(() => {
      const x = mc(i.value.viewport, i.value.content);
      return x > 0 && x < 1;
    }), s = /* @__PURE__ */ L(), a = /* @__PURE__ */ L(0);
    function l(x, _) {
      if (p.value) {
        const w = e.viewport.value.scrollLeft + x.deltaY;
        e.viewport.value.scrollLeft = w, ja(w, _) && x.preventDefault();
      } else {
        const w = e.viewport.value.scrollTop + x.deltaY;
        e.viewport.value.scrollTop = w, ja(w, _) && x.preventDefault();
      }
    }
    function c(x, _) {
      p.value ? a.value = _.x : a.value = _.y;
    }
    function u(x) {
      a.value = 0;
    }
    function d(x) {
      i.value = x;
    }
    function f(x, _) {
      return Km(x, a.value, i.value, _);
    }
    const p = M(() => n.isHorizontal.value);
    function h(x) {
      p.value ? e.viewport.value.scrollLeft = f(x, e.dir.value) : e.viewport.value.scrollTop = f(x);
    }
    function m() {
      if (p.value) {
        if (e.viewport.value && s.value) {
          const x = e.viewport.value.scrollLeft, _ = Wa(x, i.value, e.dir.value);
          s.value.style.transform = `translate3d(${_}px, 0, 0)`;
        }
      } else if (e.viewport.value && s.value) {
        const x = e.viewport.value.scrollTop, _ = Wa(x, i.value);
        s.value.style.transform = `translate3d(0, ${_}px, 0)`;
      }
    }
    function g(x) {
      s.value = x;
    }
    return lg({
      sizes: i,
      hasThumb: o,
      handleWheelScroll: l,
      handleThumbDown: c,
      handleThumbUp: u,
      handleSizeChange: d,
      onThumbPositionChange: m,
      onThumbChange: g,
      onDragScroll: h
    }), (x, _) => p.value ? (O(), V(Ym, de({ key: 0 }, x.$attrs, { ref: v(r) }), {
      default: I(() => [Q(x.$slots, "default")]),
      _: 3
    }, 16)) : (O(), V(Jm, de({ key: 1 }, x.$attrs, { ref: v(r) }), {
      default: I(() => [Q(x.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ts = ug, cg = /* @__PURE__ */ X({
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
  setup(t, { emit: e }) {
    const n = t, r = e, i = Ct(), o = Ki(), s = Br(), { forwardRef: a, currentElement: l } = ge(), c = /* @__PURE__ */ L(""), u = /* @__PURE__ */ L();
    function d(x) {
      if (u.value) {
        const _ = x.clientX - u.value?.left, w = x.clientY - u.value?.top;
        r("onDragScroll", {
          x: _,
          y: w
        });
      }
    }
    function f(x) {
      x.button === 0 && (x.target.setPointerCapture(x.pointerId), u.value = l.value.getBoundingClientRect(), c.value = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", i.viewport && (i.viewport.value.style.scrollBehavior = "auto"), d(x));
    }
    function p(x) {
      d(x);
    }
    function h(x) {
      const _ = x.target;
      _.hasPointerCapture(x.pointerId) && _.releasePointerCapture(x.pointerId), document.body.style.webkitUserSelect = c.value, i.viewport && (i.viewport.value.style.scrollBehavior = ""), u.value = void 0;
    }
    function m(x) {
      const _ = x.target, w = l.value?.contains(_), y = o.sizes.value.content - o.sizes.value.viewport;
      w && o.handleWheelScroll(x, y);
    }
    ke(() => {
      document.addEventListener("wheel", m, { passive: !1 });
    }), lt(() => {
      document.removeEventListener("wheel", m);
    });
    function g() {
      l.value && (n.isHorizontal ? o.handleSizeChange({
        content: i.viewport.value?.scrollWidth ?? 0,
        viewport: i.viewport.value?.offsetWidth ?? 0,
        scrollbar: {
          size: l.value.clientWidth ?? 0,
          paddingStart: Kr(getComputedStyle(l.value).paddingLeft),
          paddingEnd: Kr(getComputedStyle(l.value).paddingRight)
        }
      }) : o.handleSizeChange({
        content: i.viewport.value?.scrollHeight ?? 0,
        viewport: i.viewport.value?.offsetHeight ?? 0,
        scrollbar: {
          size: l.value?.clientHeight ?? 0,
          paddingStart: Kr(getComputedStyle(l.value).paddingTop),
          paddingEnd: Kr(getComputedStyle(l.value).paddingBottom)
        }
      }), o.onThumbPositionChange());
    }
    return Sr(l, g), Sr(i.content, g), (x, _) => (O(), V(v(Ce), {
      ref: v(a),
      style: { position: "absolute" },
      "data-scrollbarimpl": "",
      as: v(s).as.value,
      "as-child": v(s).asChild.value,
      onPointerdown: f,
      onPointermove: p,
      onPointerup: h
    }, {
      default: I(() => [Q(x.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), gc = cg, dg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, n = Ct(), r = Ki();
    function i(f) {
      const h = f.target.getBoundingClientRect(), m = f.clientX - h.left, g = f.clientY - h.top;
      r.handleThumbDown(f, {
        x: m,
        y: g
      });
    }
    function o(f) {
      r.handleThumbUp(f);
    }
    const { forwardRef: s, currentElement: a } = ge(), l = /* @__PURE__ */ L(), c = M(() => n.viewport.value);
    function u() {
      if (!l.value) {
        const f = Um(c.value, r.onThumbPositionChange);
        l.value = f, r.onThumbPositionChange();
      }
    }
    const d = M(() => r.sizes.value);
    return dh(d, () => {
      r.onThumbChange(a.value), c.value && (r.onThumbPositionChange(), c.value.addEventListener("scroll", u));
    }), lt(() => {
      c.value.removeEventListener("scroll", u), n.viewport.value?.removeEventListener("scroll", u);
    }), (f, p) => (O(), V(v(Ce), {
      ref: v(s),
      "data-state": v(r).hasThumb ? "visible" : "hidden",
      style: {
        width: "var(--reka-scroll-area-thumb-width)",
        height: "var(--reka-scroll-area-thumb-height)"
      },
      "as-child": e.asChild,
      as: f.as,
      onPointerdown: i,
      onPointerup: o
    }, {
      default: I(() => [Q(f.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "as-child",
      "as"
    ]));
  }
}), fg = dg, pg = /* @__PURE__ */ X({
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
  setup(t, { expose: e }) {
    const n = t, { nonce: r } = /* @__PURE__ */ tn(n), i = hc(r), o = Ct(), s = /* @__PURE__ */ L();
    ke(() => {
      o.onViewportChange(s.value), o.onContentChange(l.value);
    }), e({ viewportElement: s });
    const { forwardRef: a, currentElement: l } = ge();
    return (c, u) => (O(), ce(Ae, null, [le("div", de({
      ref_key: "viewportElement",
      ref: s,
      "data-reka-scroll-area-viewport": "",
      style: {
        overflowX: v(o).scrollbarXEnabled.value ? "scroll" : "hidden",
        overflowY: v(o).scrollbarYEnabled.value ? "scroll" : "hidden"
      }
    }, c.$attrs, { tabindex: 0 }), [H(v(Ce), {
      ref: v(a),
      style: nt({ minWidth: v(o).scrollbarXEnabled.value ? "fit-content" : void 0 }),
      "as-child": n.asChild,
      as: c.as
    }, {
      default: I(() => [Q(c.$slots, "default")]),
      _: 3
    }, 8, [
      "style",
      "as-child",
      "as"
    ])], 16), H(v(Ce), {
      as: "style",
      nonce: v(i)
    }, {
      default: I(() => u[0] || (u[0] = [je(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-scroll-area-viewport] { scrollbar-width:none; -ms-overflow-style:none; -webkit-overflow-scrolling:touch; } [data-reka-scroll-area-viewport]::-webkit-scrollbar { display:none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), hg = pg;
const vg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], mg = [" ", "Enter"], mt = 10;
function kr(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((r) => Uo(r, e, n)) : Uo(t, e, n);
}
function Uo(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : vi(t, e);
}
function gg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const yg = {
  key: 0,
  value: ""
}, [gn, yc] = dt("SelectRoot");
var bg = /* @__PURE__ */ X({
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
    const n = t, r = e, { required: i, disabled: o, multiple: s, dir: a } = /* @__PURE__ */ tn(n), l = /* @__PURE__ */ Cr(n, "modelValue", r, {
      defaultValue: n.defaultValue ?? (s.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ Cr(n, "open", r, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = /* @__PURE__ */ L(), d = /* @__PURE__ */ L(), f = /* @__PURE__ */ L({
      x: 0,
      y: 0
    }), p = M(() => s.value && Array.isArray(l.value) ? l.value?.length === 0 : Fo(l.value));
    mn({ isProvider: !0 });
    const h = ps(a), m = Hu(u), g = /* @__PURE__ */ L(/* @__PURE__ */ new Set()), x = M(() => Array.from(g.value).map((y) => y.value).join(";"));
    function _(y) {
      if (s.value) {
        const S = Array.isArray(l.value) ? [...l.value] : [], T = S.findIndex((E) => Uo(E, y, n.by));
        T === -1 ? S.push(y) : S.splice(T, 1), l.value = [...S];
      } else l.value = y;
    }
    function w(y) {
      return Array.from(g.value).find((S) => kr(y, S.value, n.by));
    }
    return yc({
      triggerElement: u,
      onTriggerChange: (y) => {
        u.value = y;
      },
      valueElement: d,
      onValueElementChange: (y) => {
        d.value = y;
      },
      contentId: "",
      modelValue: l,
      onValueChange: _,
      by: n.by,
      open: c,
      multiple: s,
      required: i,
      onOpenChange: (y) => {
        c.value = y;
      },
      dir: h,
      triggerPointerDownPosRef: f,
      disabled: o,
      isEmptyModelValue: p,
      optionsSet: g,
      onOptionAdd: (y) => {
        const S = w(y.value);
        S && g.value.delete(S), g.value.add(y);
      },
      onOptionRemove: (y) => {
        const S = w(y.value);
        S && g.value.delete(S);
      }
    }), (y, S) => (O(), V(v(mv), null, {
      default: I(() => [Q(y.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(m) ? (O(), V(xg, {
        key: x.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(s),
        required: v(i),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: v(o),
        value: v(l)
      }, {
        default: I(() => [v(Fo)(v(l)) ? (O(), ce("option", yg)) : fe("v-if", !0), (O(!0), ce(Ae, null, Rn(Array.from(g.value), (T) => (O(), ce("option", de({ key: T.value ?? "" }, { ref_for: !0 }, T), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : fe("v-if", !0)]),
      _: 3
    }));
  }
}), _g = bg, wg = /* @__PURE__ */ X({
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
    const e = t, n = /* @__PURE__ */ L(), r = gn();
    xe(() => e.value, (o, s) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (o !== s && c && n.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(n.value, o), n.value.dispatchEvent(u);
      }
    });
    function i(o) {
      r.onValueChange(o.target.value);
    }
    return (o, s) => (O(), V(v(nc), { "as-child": "" }, {
      default: I(() => [le("select", de({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: i }), [Q(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), xg = wg, Sg = /* @__PURE__ */ X({
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
    const n = hs(t);
    return (r, i) => (O(), V(v(Am), de(v(n), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: I(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Cg = Sg;
const Eg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Xi, bc] = dt("SelectContent");
var Tg = /* @__PURE__ */ X({
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
    const n = t, r = e, i = gn();
    _h(), zu(n.bodyLock);
    const { CollectionSlot: o, getItems: s } = mn(), a = /* @__PURE__ */ L();
    Wu(a);
    const { search: l, handleTypeaheadSearch: c } = ms(), u = /* @__PURE__ */ L(), d = /* @__PURE__ */ L(), f = /* @__PURE__ */ L(), p = /* @__PURE__ */ L(!1), h = /* @__PURE__ */ L(!1), m = /* @__PURE__ */ L(!1);
    function g() {
      d.value && a.value && Oa([d.value, a.value]);
    }
    xe(p, () => {
      g();
    });
    const { onOpenChange: x, triggerPointerDownPosRef: _ } = i;
    ze((T) => {
      if (!a.value) return;
      let E = {
        x: 0,
        y: 0
      };
      const D = (k) => {
        E = {
          x: Math.abs(Math.round(k.pageX) - (_.value?.x ?? 0)),
          y: Math.abs(Math.round(k.pageY) - (_.value?.y ?? 0))
        };
      }, A = (k) => {
        k.pointerType !== "touch" && (E.x <= 10 && E.y <= 10 ? k.preventDefault() : a.value?.contains(k.target) || x(!1), document.removeEventListener("pointermove", D), _.value = null);
      };
      _.value !== null && (document.addEventListener("pointermove", D), document.addEventListener("pointerup", A, {
        capture: !0,
        once: !0
      })), T(() => {
        document.removeEventListener("pointermove", D), document.removeEventListener("pointerup", A, { capture: !0 });
      });
    });
    function w(T) {
      const E = T.ctrlKey || T.altKey || T.metaKey;
      if (T.key === "Tab" && T.preventDefault(), !E && T.key.length === 1 && c(T.key, s()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(T.key)) {
        let A = [...s().map((k) => k.ref)];
        if (["ArrowUp", "End"].includes(T.key) && (A = A.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(T.key)) {
          const k = T.target, $ = A.indexOf(k);
          A = A.slice($ + 1);
        }
        setTimeout(() => Oa(A)), T.preventDefault();
      }
    }
    const y = M(() => n.position === "popper" ? n : {}), S = hs(y.value);
    return bc({
      content: a,
      viewport: u,
      onViewportChange: (T) => {
        u.value = T;
      },
      itemRefCallback: (T, E, D) => {
        const A = !h.value && !D, k = kr(i.modelValue.value, E, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (k || A) && (d.value = T, k && (m.value = !0));
        } else (k || A) && (d.value = T);
        A && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (T, E, D) => {
        const A = !h.value && !D;
        (kr(i.modelValue.value, E, i.by) || A) && (f.value = T);
      },
      focusSelectedItem: g,
      position: n.position,
      isPositioned: p,
      searchRef: l
    }), (T, E) => (O(), V(v(o), null, {
      default: I(() => [H(v(Yu), {
        "as-child": "",
        onMountAutoFocus: E[6] || (E[6] = dn(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: E[7] || (E[7] = (D) => {
          r("closeAutoFocus", D), !D.defaultPrevented && (v(i).triggerElement.value?.focus({ preventScroll: !0 }), D.preventDefault());
        })
      }, {
        default: I(() => [H(v(Ku), {
          "as-child": "",
          "disable-outside-pointer-events": T.disableOutsidePointerEvents,
          onFocusOutside: E[2] || (E[2] = dn(() => {
          }, ["prevent"])),
          onDismiss: E[3] || (E[3] = (D) => v(i).onOpenChange(!1)),
          onEscapeKeyDown: E[4] || (E[4] = (D) => r("escapeKeyDown", D)),
          onPointerDownOutside: E[5] || (E[5] = (D) => r("pointerDownOutside", D))
        }, {
          default: I(() => [(O(), V(qd(T.position === "popper" ? Cg : Rg), de({
            ...T.$attrs,
            ...v(S)
          }, {
            id: v(i).contentId,
            ref: (D) => {
              const A = v($t)(D);
              A?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = A.firstElementChild : a.value = A;
            },
            role: "listbox",
            "data-state": v(i).open.value ? "open" : "closed",
            dir: v(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: E[0] || (E[0] = dn(() => {
            }, ["prevent"])),
            onPlaced: E[1] || (E[1] = (D) => p.value = !0),
            onKeydown: w
          }), {
            default: I(() => [Q(T.$slots, "default")]),
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
}), Ag = Tg;
const [kg, Pg] = dt("SelectItemAlignedPosition");
var Og = /* @__PURE__ */ X({
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
    const n = t, r = e, { getItems: i } = mn(), o = gn(), s = Xi(), a = /* @__PURE__ */ L(!1), l = /* @__PURE__ */ L(!0), c = /* @__PURE__ */ L(), { forwardRef: u, currentElement: d } = ge(), { viewport: f, selectedItem: p, selectedItemText: h, focusSelectedItem: m } = s;
    function g() {
      if (o.triggerElement.value && o.valueElement.value && c.value && d.value && f?.value && p?.value && h?.value) {
        const w = o.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), S = o.valueElement.value.getBoundingClientRect(), T = h.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const G = T.left - y.left, oe = S.left - G, ue = w.left - oe, he = w.width + ue, vt = Math.max(he, y.width), b = window.innerWidth - mt, C = Bo(oe, mt, Math.max(mt, b - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.left = `${C}px`;
        } else {
          const G = y.right - T.right, oe = window.innerWidth - S.right - G, ue = window.innerWidth - w.right - oe, he = w.width + ue, vt = Math.max(he, y.width), b = window.innerWidth - mt, C = Bo(oe, mt, Math.max(mt, b - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.right = `${C}px`;
        }
        const E = i().map((G) => G.ref), D = window.innerHeight - mt * 2, A = f.value.scrollHeight, k = window.getComputedStyle(d.value), $ = Number.parseInt(k.borderTopWidth, 10), P = Number.parseInt(k.paddingTop, 10), W = Number.parseInt(k.borderBottomWidth, 10), B = Number.parseInt(k.paddingBottom, 10), K = $ + P + A + B + W, re = Math.min(p.value.offsetHeight * 5, K), Z = window.getComputedStyle(f.value), ee = Number.parseInt(Z.paddingTop, 10), _e = Number.parseInt(Z.paddingBottom, 10), Me = w.top + w.height / 2 - mt, Je = D - Me, Re = p.value.offsetHeight / 2, zt = p.value.offsetTop + Re, qt = $ + P + zt, Jn = K - qt;
        if (qt <= Me) {
          const G = p.value === E[E.length - 1];
          c.value.style.bottom = "0px";
          const oe = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ue = Math.max(Je, Re + (G ? _e : 0) + oe + W), he = qt + ue;
          c.value.style.height = `${he}px`;
        } else {
          const G = p.value === E[0];
          c.value.style.top = "0px";
          const ue = Math.max(Me, $ + f.value.offsetTop + (G ? ee : 0) + Re) + Jn;
          c.value.style.height = `${ue}px`, f.value.scrollTop = qt - Me + f.value.offsetTop;
        }
        c.value.style.margin = `${mt}px 0`, c.value.style.minHeight = `${re}px`, c.value.style.maxHeight = `${D}px`, r("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const x = /* @__PURE__ */ L("");
    ke(async () => {
      await Ie(), g(), d.value && (x.value = window.getComputedStyle(d.value).zIndex);
    });
    function _(w) {
      w && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return Sr(o.triggerElement, () => {
      g();
    }), Pg({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: _
    }), (w, y) => (O(), ce("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: nt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: x.value
      })
    }, [H(v(Ce), de({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...w.$attrs,
      ...n
    }), {
      default: I(() => [Q(w.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Rg = Og, Lg = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return yc(t.context), bc(Eg), (n, r) => Q(n.$slots, "default");
  }
}), Ig = Lg;
const Mg = { key: 1 };
var Dg = /* @__PURE__ */ X({
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
    const n = t, i = wh(n, e), o = gn(), s = /* @__PURE__ */ L();
    ke(() => {
      s.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ L(), l = M(() => n.forceMount || o.open.value), c = /* @__PURE__ */ L(l.value);
    return xe(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (O(), V(v(Ln), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: I(() => [H(Ag, Jo($i({
        ...v(i),
        ...u.$attrs
      })), {
        default: I(() => [Q(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : s.value ? (O(), ce("div", Mg, [(O(), V(Xl, { to: s.value }, [H(Ig, { context: v(o) }, {
      default: I(() => [Q(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : fe("v-if", !0);
  }
}), $g = Dg, Bg = /* @__PURE__ */ X({
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
    return (e, n) => (O(), V(v(Ce), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: I(() => [Q(e.$slots, "default", {}, () => [n[0] || (n[0] = je("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Fg = Bg;
const [_c, Ng] = dt("SelectItem");
var zg = /* @__PURE__ */ X({
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
    const n = t, r = e, { disabled: i } = /* @__PURE__ */ tn(n), o = gn(), s = Xi(), { forwardRef: a, currentElement: l } = ge(), { CollectionItem: c } = mn(), u = M(() => kr(o.modelValue?.value, n.value, o.by)), d = /* @__PURE__ */ L(!1), f = /* @__PURE__ */ L(n.textValue ?? ""), p = Er(void 0, "reka-select-item-text"), h = "select.select";
    async function m(y) {
      if (y.defaultPrevented) return;
      const S = {
        originalEvent: y,
        value: n.value
      };
      Fi(h, g, S);
    }
    async function g(y) {
      await Ie(), r("select", y), !y.defaultPrevented && (i.value || (o.onValueChange(n.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function x(y) {
      await Ie(), !y.defaultPrevented && (i.value ? s.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function _(y) {
      await Ie(), !y.defaultPrevented && y.currentTarget === ht() && s.onItemLeave?.();
    }
    async function w(y) {
      await Ie(), !(y.defaultPrevented || s.searchRef?.value !== "" && y.key === " ") && (mg.includes(y.key) && m(y), y.key === " " && y.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return ke(() => {
      l.value && s.itemRefCallback(l.value, n.value, n.disabled);
    }), Ng({
      value: n.value,
      disabled: i,
      textId: p,
      isSelected: u,
      onItemTextChange: (y) => {
        f.value = ((f.value || y?.textContent) ?? "").trim();
      }
    }), (y, S) => (O(), V(v(c), { value: { textValue: f.value } }, {
      default: I(() => [H(v(Ce), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(i) || void 0,
        "data-disabled": v(i) ? "" : void 0,
        tabindex: v(i) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: S[0] || (S[0] = (T) => d.value = !0),
        onBlur: S[1] || (S[1] = (T) => d.value = !1),
        onPointerup: m,
        onPointerdown: S[2] || (S[2] = (T) => {
          T.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: S[3] || (S[3] = dn(() => {
        }, ["prevent", "stop"])),
        onPointermove: x,
        onPointerleave: _,
        onKeydown: w
      }, {
        default: I(() => [Q(y.$slots, "default")]),
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
}), qg = zg, Hg = /* @__PURE__ */ X({
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
    const e = t, n = _c();
    return (r, i) => v(n).isSelected.value ? (O(), V(v(Ce), de({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), Vg = Hg, Wg = /* @__PURE__ */ X({
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
    const e = t, n = gn(), r = Xi(), i = _c(), { forwardRef: o, currentElement: s } = ge(), a = M(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: s.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return ke(() => {
      s.value && (i.onItemTextChange(s.value), r.itemTextRefCallback(s.value, i.value, i.disabled.value), n.onOptionAdd(a.value));
    }), lt(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (O(), V(v(Ce), de({
      id: v(i).textId,
      ref: v(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: I(() => [Q(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), jg = Wg, Ug = /* @__PURE__ */ X({
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
    return (n, r) => (O(), V(v(Qu), Jo($i(e)), {
      default: I(() => [Q(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Kg = Ug, Xg = /* @__PURE__ */ X({
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
    const e = t, n = gn(), { forwardRef: r, currentElement: i } = ge(), o = M(() => n.disabled?.value || e.disabled);
    n.contentId ||= Er(void 0, "reka-select-content"), ke(() => {
      n.onTriggerChange(i.value);
    });
    const { getItems: s } = mn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = ms();
    function u() {
      o.value || (n.onOpenChange(!0), c());
    }
    function d(f) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, p) => (O(), V(v(yv), {
      "as-child": "",
      reference: f.reference
    }, {
      default: I(() => [H(v(Ce), {
        ref: v(r),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": v(n).contentId,
        "aria-expanded": v(n).open.value || !1,
        "aria-required": v(n).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: v(n)?.dir.value,
        "data-state": v(n)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": v(gg)(v(n).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: p[0] || (p[0] = (h) => {
          h?.currentTarget?.focus();
        }),
        onPointerdown: p[1] || (p[1] = (h) => {
          if (h.pointerType === "touch") return h.preventDefault();
          const m = h.target;
          m.hasPointerCapture(h.pointerId) && m.releasePointerCapture(h.pointerId), h.button === 0 && h.ctrlKey === !1 && (d(h), h.preventDefault());
        }),
        onPointerup: p[2] || (p[2] = dn((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (h) => {
          const m = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && m && h.key === " " || (v(l)(h.key, v(s)()), v(vg).includes(h.key) && (u(), h.preventDefault()));
        })
      }, {
        default: I(() => [Q(f.$slots, "default")]),
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
}), Yg = Xg, Gg = /* @__PURE__ */ X({
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
  setup(t) {
    const e = t, { forwardRef: n, currentElement: r } = ge(), i = gn();
    ke(() => {
      i.valueElement = r;
    });
    const o = M(() => {
      let a = [];
      const l = Array.from(i.optionsSet.value), c = (u) => l.find((d) => kr(u, d.value, i.by));
      return Array.isArray(i.modelValue.value) ? a = i.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(i.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), s = M(() => o.value.length ? o.value.join(", ") : e.placeholder);
    return (a, l) => (O(), V(v(Ce), {
      ref: v(n),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: I(() => [Q(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: v(i).modelValue.value
      }, () => [je(we(s.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Jg = Gg, Zg = /* @__PURE__ */ X({
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
    const e = t, { nonce: n } = /* @__PURE__ */ tn(e), r = hc(n), i = Xi(), o = i.position === "item-aligned" ? kg() : void 0, { forwardRef: s, currentElement: a } = ge();
    ke(() => {
      i?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ L(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: p } = o ?? {};
      if (f?.value && p?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const m = window.innerHeight - mt * 2, g = Number.parseFloat(p.value.style.minHeight), x = Number.parseFloat(p.value.style.height), _ = Math.max(g, x);
          if (_ < m) {
            const w = _ + h, y = Math.min(m, w), S = w - y;
            p.value.style.height = `${y}px`, p.value.style.bottom === "0px" && (d.scrollTop = S > 0 ? S : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (O(), ce(Ae, null, [H(v(Ce), de({
      ref: v(s),
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
      default: I(() => [Q(u.$slots, "default")]),
      _: 3
    }, 16), H(v(Ce), {
      as: "style",
      nonce: v(r)
    }, {
      default: I(() => d[0] || (d[0] = [je(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Qg = Zg;
const mo = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, ey = 70, ty = 1e3 / 60, ny = 350;
let ei = !1, Ua = !1;
function ry() {
  Ua || typeof document > "u" || (document.addEventListener("mousedown", () => {
    ei = !0;
  }), document.addEventListener("mouseup", () => {
    ei = !1;
  }), document.addEventListener("click", () => {
    ei = !1;
  }), Ua = !0);
}
const go = /* @__PURE__ */ new Map();
function yo(...t) {
  const e = {
    damping: mo.damping,
    stiffness: mo.stiffness,
    mass: mo.mass
  };
  let n = !1;
  for (const i of t) {
    if (i === "instant") {
      n = !0;
      continue;
    }
    typeof i != "object" || !i || (n = !1, e.damping = i.damping ?? e.damping, e.stiffness = i.stiffness ?? e.stiffness, e.mass = i.mass ?? e.mass);
  }
  const r = JSON.stringify(e);
  return go.has(r) || go.set(r, Object.freeze({ ...e })), n ? "instant" : go.get(r);
}
function iy(t = {}) {
  ry();
  let e = { ...t };
  const n = /* @__PURE__ */ new Set(), r = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function i() {
    const k = o();
    for (const $ of n) $(k);
  }
  function o() {
    return {
      isAtBottom: r.isAtBottom || r.isNearBottom,
      isNearBottom: r.isNearBottom,
      escapedFromLock: r.escapedFromLock
    };
  }
  function s() {
    return r.scrollElement?.scrollTop ?? 0;
  }
  function a(k) {
    r.scrollElement && (r.scrollElement.scrollTop = k, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function l() {
    const k = r.scrollElement, $ = r.contentElement;
    return !k || !$ ? 0 : k.scrollHeight - 1 - k.clientHeight;
  }
  let c;
  function u() {
    const k = r.scrollElement, $ = r.contentElement;
    if (!k || !$)
      return 0;
    const P = l();
    if (!e.targetScrollTop)
      return P;
    if (c?.targetScrollTop === P)
      return c.calculatedScrollTop;
    const W = Math.max(
      Math.min(
        e.targetScrollTop(P, {
          scrollElement: k,
          contentElement: $
        }),
        P
      ),
      0
    );
    return c = { targetScrollTop: P, calculatedScrollTop: W }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), W;
  }
  function d() {
    return u() - s();
  }
  function f() {
    return d() <= ey;
  }
  function p(k) {
    r.isAtBottom = k, i();
  }
  function h(k) {
    r.escapedFromLock = k, i();
  }
  function m(k) {
    r.isNearBottom = k, i();
  }
  function g() {
    if (!ei || typeof window > "u")
      return !1;
    const k = window.getSelection?.();
    if (!k || !k.rangeCount)
      return !1;
    const $ = k.getRangeAt(0), P = r.scrollElement;
    if (!P)
      return !1;
    const W = $.commonAncestorContainer;
    return !!(W && (P.contains(W) || W.contains(P)));
  }
  const x = (k) => {
    if (k.target !== r.scrollElement)
      return;
    const $ = s(), P = r.ignoreScrollToTop;
    let W = r.lastScrollTop ?? $;
    r.lastScrollTop = $, r.ignoreScrollToTop = void 0, P && P > $ && (W = P), m(f()), setTimeout(() => {
      if (r.resizeDifference || $ === P)
        return;
      if (g()) {
        h(!0), p(!1);
        return;
      }
      const B = $ > W, K = $ < W;
      if (r.animation?.ignoreEscapes) {
        a(W);
        return;
      }
      K && (h(!0), p(!1)), B && h(!1), !r.escapedFromLock && f() && p(!0);
    }, 1);
  }, _ = (k) => {
    const $ = r.scrollElement;
    if (!$)
      return;
    let P = k.target;
    for (; P && !["scroll", "auto"].includes(getComputedStyle(P).overflow); ) {
      if (!P.parentElement)
        return;
      P = P.parentElement;
    }
    P === $ && k.deltaY < 0 && $.scrollHeight > $.clientHeight && !r.animation?.ignoreEscapes && (h(!0), p(!1));
  };
  function w(k, $) {
    y(), r.scrollElement = k, r.contentElement = $, getComputedStyle(k).overflow === "visible" && (k.style.overflow = "auto"), k.addEventListener("scroll", x, { passive: !0 }), k.addEventListener("wheel", _, { passive: !0 });
    let P;
    r.resizeObserver = new ResizeObserver((W) => {
      const B = W[0];
      if (!B)
        return;
      const { height: K } = B.contentRect, re = K - (P ?? K);
      if (r.resizeDifference = re, s() > l() && a(l()), m(f()), re >= 0) {
        const Z = yo(
          e,
          P ? e.resize : e.initial
        );
        E({
          animation: Z,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Z === "instant" ? void 0 : ny
        });
      } else
        f() && (h(!1), p(!0));
      P = K, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === re && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe($);
  }
  function y() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", x), r.scrollElement.removeEventListener("wheel", _)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function S() {
    y(), n.clear();
  }
  function T(k) {
    e = { ...e, ...k };
  }
  function E(k = {}) {
    const $ = typeof k == "string" ? { animation: k } : k;
    $.preserveScrollPosition || p(!0);
    const P = Date.now() + (Number($.wait) || 0), W = yo(e, $.animation), { ignoreEscapes: B = !1 } = $;
    let K, re = u();
    $.duration instanceof Promise ? $.duration.finally(() => {
      K = Date.now();
    }) : K = P + ($.duration ?? 0);
    const Z = async () => {
      const ee = new Promise((_e) => {
        if (typeof requestAnimationFrame > "u") {
          _e(!1);
          return;
        }
        requestAnimationFrame(() => _e(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const _e = s(), Me = typeof performance < "u" ? performance.now() : Date.now(), Je = (Me - (r.lastTick ?? Me)) / ty;
        if (r.animation ||= { behavior: W, promise: ee, ignoreEscapes: B }, r.animation.behavior === W && (r.lastTick = Me), g() || P > Date.now())
          return Z();
        if (_e < Math.min(re, u())) {
          if (r.animation?.behavior === W) {
            if (W === "instant")
              return a(u()), Z();
            const Re = W;
            r.velocity = (Re.damping * r.velocity + Re.stiffness * d()) / Re.mass, r.accumulated += r.velocity * Je;
            const zt = s();
            a(zt + r.accumulated), s() !== zt && (r.accumulated = 0);
          }
          return Z();
        }
        return K > Date.now() ? (re = u(), Z()) : (r.animation = void 0, s() < u() ? E({
          animation: yo(e, e.resize),
          ignoreEscapes: B,
          duration: Math.max(0, K - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ee.then((_e) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), _e));
    };
    return $.wait !== !0 && (r.animation = void 0), r.animation?.behavior === W ? r.animation.promise : Z();
  }
  const D = () => {
    h(!0), p(!1);
  };
  function A(k) {
    return n.add(k), () => n.delete(k);
  }
  return {
    attach: w,
    detach: y,
    destroy: S,
    setOptions: T,
    getState: o,
    onChange: A,
    scrollToBottom: E,
    stopScroll: D
  };
}
function oy(t = {}) {
  const e = /* @__PURE__ */ L(null), n = /* @__PURE__ */ L(null), r = /* @__PURE__ */ L(t.initial !== !1), i = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ L(!1), s = iy(t);
  let a = null;
  return ze((l) => {
    !e.value || !n.value || (s.attach(e.value, n.value), a = s.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, o.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, s.detach();
    }));
  }), On(() => {
    s.destroy();
  }), {
    scrollRef: e,
    contentRef: n,
    isAtBottom: r,
    isNearBottom: i,
    escapedFromLock: o,
    scrollToBottom: (l) => s.scrollToBottom(l),
    stopScroll: () => s.stopScroll(),
    setOptions: (l) => s.setOptions(l)
  };
}
const sy = /* @__PURE__ */ X({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (O(), ce("span", {
      class: "speaker-indicator",
      style: nt({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), ay = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", wc = /* @__PURE__ */ rt(sy, [["styles", [ay]], ["__scopeId", "data-v-9bffeda8"]]), ly = { class: "speaker-label" }, uy = {
  key: 1,
  class: "speaker-name"
}, cy = ["datetime"], dy = /* @__PURE__ */ X({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: r } = Ft(), i = M(
      () => us(e.language, r.value, n("language.wildcard"))
    ), o = M(
      () => e.startTime != null ? hi(e.startTime) : null
    ), s = M(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = M(() => e.speaker?.color ?? "transparent");
    return (l, c) => (O(), ce("div", ly, [
      t.speaker ? (O(), V(wc, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : fe("", !0),
      t.speaker ? (O(), ce("span", uy, we(t.speaker.name), 1)) : fe("", !0),
      o.value ? (O(), ce("time", {
        key: 2,
        class: "timestamp",
        datetime: s.value
      }, we(o.value), 9, cy)) : fe("", !0),
      H($o, null, {
        default: I(() => [
          je(we(i.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), fy = ".speaker-label[data-v-0fb7fa1e]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-0fb7fa1e]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-0fb7fa1e]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted)}", py = /* @__PURE__ */ rt(dy, [["styles", [fy]], ["__scopeId", "data-v-0fb7fa1e"]]);
function hy() {
  const t = /* @__PURE__ */ new Map();
  function e(o, s) {
    let a = t.get(o);
    return a || (a = /* @__PURE__ */ new Set(), t.set(o, a)), a.add(s), () => n(o, s);
  }
  function n(o, s) {
    t.get(o)?.delete(s);
  }
  function r(o, s) {
    t.get(o)?.forEach(
      (a) => a(s)
    );
  }
  function i() {
    t.clear();
  }
  return { on: e, off: n, emit: r, clear: i };
}
const Ka = [
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
function vy(t, e, n) {
  const r = Ka[t.size % Ka.length];
  return { id: e, name: n, color: r };
}
function my(t, e, n) {
  return !e || t.has(e) ? null : vy(t, e, n ?? e);
}
function gy(t, e, n) {
  const r = t.get(e);
  return r ? { ...r, ...n } : null;
}
function yy(t) {
  const e = /* @__PURE__ */ ki(/* @__PURE__ */ new Map());
  function n(o, s) {
    const a = my(e, o, s);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function r(o, s) {
    const a = gy(e, o, s);
    a && (e.set(o, a), t("speaker:update", { speaker: a }));
  }
  function i() {
    e.clear();
  }
  return { all: e, ensure: n, update: r, clear: i };
}
function by(t, e) {
  return [...t, e];
}
function _y(t, e) {
  return [...e, ...t];
}
function wy(t, e, n) {
  const r = t.findIndex((o) => o.id === e);
  if (r === -1) return null;
  const i = { ...t[r], ...n, id: e };
  return {
    turns: t.map((o, s) => s === r ? i : o),
    updated: i
  };
}
function xy(t, e) {
  const n = t.findIndex((r) => r.id === e);
  return n === -1 ? null : t.filter((r, i) => i !== n);
}
function Sy(t, e, n) {
  const r = t.findIndex((s) => s.id === e);
  if (r === -1) return null;
  const i = t[r], o = {
    ...i,
    words: n,
    text: null,
    startTime: n[0]?.startTime ?? i.startTime,
    endTime: n[n.length - 1]?.endTime ?? i.endTime
  };
  return {
    turns: t.map((s, a) => a === r ? o : s),
    updated: o
  };
}
function Ko(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    r.speakerId && !n.has(r.speakerId) && (n.add(r.speakerId), e(r.speakerId));
}
function Cy(t, e, n) {
  const { id: r, languages: i, isSource: o, audio: s } = t, a = /* @__PURE__ */ L(t.turns);
  function l(h) {
    n(h.speakerId), a.value = by(a.value, h), e("turn:add", { turn: h, translationId: r });
  }
  function c(h, m) {
    const g = wy(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function u(h) {
    const m = xy(a.value, h);
    m && (a.value = m, e("turn:remove", { turnId: h, translationId: r }));
  }
  function d(h, m) {
    const g = Sy(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function f(h) {
    Ko(h, n), a.value = _y(a.value, h);
  }
  function p(h) {
    Ko(h, n), a.value = h, e("translation:sync", { translationId: r });
  }
  return { id: r, languages: i, isSource: o, audio: s, turns: a, addTurn: l, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: p };
}
function Xa(t, e, n) {
  const { id: r, name: i, description: o, duration: s } = t, a = /* @__PURE__ */ ki(/* @__PURE__ */ new Map());
  let l;
  for (const h of t.translations) {
    const m = Cy(h, e, n);
    a.set(h.id, m), h.isSource && !l && (l = m);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ L(null), u = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(!0), f = M(() => c.value ? a.get(c.value) ?? l : l);
  function p(h) {
    const m = h === l.id ? null : h;
    m !== c.value && (c.value = m, e("translation:change", { translationId: f.value.id }));
  }
  return {
    id: r,
    name: i,
    description: o,
    duration: s,
    translations: a,
    sourceTranslation: l,
    activeTranslation: f,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: p
  };
}
function Ey(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [r, i] of t.speakers)
    e.add(r), n.push({ id: r, name: i.name });
  for (const r of t.channels)
    for (const i of r.translations)
      for (const o of i.turns)
        o.speakerId && !e.has(o.speakerId) && (e.add(o.speakerId), n.push({ id: o.speakerId, name: o.speakerId }));
  return n;
}
function Ty(t = {}) {
  const e = /* @__PURE__ */ L(""), n = /* @__PURE__ */ L(t.activeChannelId ?? ""), r = /* @__PURE__ */ L(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: o, emit: s, clear: a } = hy(), l = yy(s), c = l, u = /* @__PURE__ */ ki(/* @__PURE__ */ new Map()), d = M(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function f(S, T) {
    return i(S, (E) => {
      E.translationId === d.value.activeTranslation.value.id && T(E);
    });
  }
  function p(S) {
    e.value = S.title, l.clear(), u.clear();
    for (const T of Ey(S))
      c.ensure(T.id, T.name);
    for (const T of S.channels)
      u.set(T.id, Xa(T, s, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(S) {
    Np(S), p(S);
  }
  function m(S) {
    S !== n.value && (n.value = S, s("channel:change", { channelId: S }));
  }
  function g(S, T) {
    if (u.has(S)) {
      for (const E of T.translations)
        Ko(E.turns, c.ensure);
      u.set(S, Xa(T, s, c.ensure)), s("channel:sync", { channelId: S });
    }
  }
  const x = [];
  function _(S) {
    const T = S.install(y);
    T && x.push(T);
  }
  function w() {
    s("destroy", void 0), x.forEach((S) => S()), x.length = 0, a();
  }
  t.document && p(t.document);
  const y = {
    title: e,
    activeChannelId: n,
    capabilities: r,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: f,
    setDocument: h,
    setActiveChannel: m,
    setChannel: g,
    on: i,
    off: o,
    emit: s,
    use: _,
    destroy: w
  };
  return y;
}
const xc = /* @__PURE__ */ Symbol("editorStore");
function Ay(t) {
  Ir(xc, t);
}
function Mn() {
  const t = cn(xc);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const ky = ["data-turn-active"], Py = { class: "turn-text" }, Oy = ["data-word-active"], Ry = /* @__PURE__ */ X({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Mn(), r = M(() => e.turn.words.length > 0), i = M(() => {
      if (!n.audio?.src.value || !r.value) return null;
      const a = n.audio.currentTime.value, { startTime: l, endTime: c, words: u } = e.turn;
      return l == null || c == null || a < l || a > c ? null : qp(u, a);
    }), o = M(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || $u(e.turn.words)) return !1;
      const a = n.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), s = M(() => e.speaker?.color ?? "transparent");
    return (a, l) => (O(), ce("section", {
      class: fn(["turn", { "turn--active": o.value, "turn--partial": t.partial }]),
      "data-turn-active": o.value || t.partial || t.live || void 0,
      style: nt({ "--speaker-color": s.value })
    }, [
      t.partial ? fe("", !0) : (O(), V(py, {
        key: 0,
        speaker: t.speaker,
        "start-time": t.turn.startTime,
        language: t.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      le("p", Py, [
        r.value ? (O(!0), ce(Ae, { key: 0 }, Rn(t.turn.words, (c, u) => (O(), ce(Ae, {
          key: c.id
        }, [
          le("span", {
            class: fn({ "word--active": c.id === i.value }),
            "data-word-active": c.id === i.value || void 0
          }, we(c.text), 11, Oy),
          je(we(u < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (O(), ce(Ae, { key: 1 }, [
          je(we(t.turn.text), 1)
        ], 64)) : fe("", !0)
      ])
    ], 14, ky));
  }
}), Ly = ".turn[data-v-bf56e6fe]{padding:var(--spacing-sm) var(--spacing-lg)}.turn+.turn[data-v-bf56e6fe]{margin-top:var(--spacing-sm)}.turn-text[data-v-bf56e6fe]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-secondary)}.turn--active[data-v-bf56e6fe]{border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent)}.word--active[data-v-bf56e6fe]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-bf56e6fe]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-bf56e6fe .2s ease}@keyframes partial-fade-in-bf56e6fe{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-bf56e6fe]{animation:none}}@media(max-width:767px){.turn[data-v-bf56e6fe]{padding:var(--spacing-sm) var(--spacing-md)}}", Ya = /* @__PURE__ */ rt(Ry, [["styles", [Ly]], ["__scopeId", "data-v-bf56e6fe"]]), Iy = {
  ref: "panel",
  class: "transcription-panel"
}, My = { class: "turns-container" }, Dy = {
  key: 0,
  class: "history-loading",
  role: "status"
}, $y = {
  key: 1,
  class: "history-start"
}, By = /* @__PURE__ */ X({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = Ft(), r = Mn(), i = yr("panel"), o = M(() => {
      const w = r.live?.partial.value ?? null;
      return w === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: w,
        words: [],
        language: r.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), s = M(() => r.live?.hasLiveUpdate.value ?? !1), a = M(() => r.audio?.isPlaying.value ?? !1), l = M(
      () => r.activeChannel.value.activeTranslation.value
    ), c = M(() => r.activeChannel.value), u = M(
      () => c.value.isLoadingHistory.value
    ), d = M(() => c.value.hasMoreHistory.value), { scrollRef: f, contentRef: p, isAtBottom: h, scrollToBottom: m } = oy();
    ke(() => {
      f.value = i.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, p.value = i.value?.querySelector(".turns-container") ?? null;
    });
    let g = null;
    const x = Fp(() => {
      const w = c.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && r.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function _() {
      g && g.scrollTop < 100 && x();
    }
    return xe(
      () => e.turns,
      (w, y) => {
        const S = w.length, T = y.length;
        if (S > T && !h.value && w[0]?.id != y[0]?.id) {
          const E = S - T, D = e.turns[E]?.id;
          if (!D || !f.value) return;
          Ie(() => {
            f.value?.querySelector(
              `[data-turn-id="${D}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), ke(() => {
      g = i.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, g && g.addEventListener("scroll", _, { passive: !0 });
    }), On(() => {
      g && (g.removeEventListener("scroll", _), g = null);
    }), (w, y) => (O(), ce("article", Iy, [
      H(v(jm), { class: "scroll-root" }, {
        default: I(() => [
          H(v(hg), { class: "scroll-viewport" }, {
            default: I(() => [
              le("div", My, [
                u.value ? (O(), ce("div", Dy, [...y[1] || (y[1] = [
                  le("progress", null, null, -1)
                ])])) : fe("", !0),
                !d.value && t.turns.length > 0 ? (O(), ce("div", $y, we(v(n)("transcription.historyStart")), 1)) : fe("", !0),
                (O(!0), ce(Ae, null, Rn(t.turns, (S, T) => (O(), V(Ya, {
                  "data-turn-id": S.id,
                  key: S.id,
                  turn: S,
                  speaker: S.speakerId ? t.speakers.get(S.speakerId) : void 0,
                  live: s.value && !o.value && T === t.turns.length - 1
                }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
                o.value ? (O(), V(Ya, {
                  key: "__partial__",
                  turn: o.value,
                  partial: ""
                }, null, 8, ["turn"])) : fe("", !0)
              ])
            ]),
            _: 1
          }),
          H(v(ag), {
            class: "scrollbar",
            orientation: "vertical"
          }, {
            default: I(() => [
              H(v(fg), { class: "scrollbar-thumb" })
            ]),
            _: 1
          }),
          H(Bf, { name: "fade-slide" }, {
            default: I(() => [
              !v(h) && (a.value || s.value) ? (O(), V(Lt, {
                key: 0,
                size: "sm",
                class: "resume-scroll-btn",
                "aria-label": v(n)("transcription.resumeScroll"),
                onClick: y[0] || (y[0] = (S) => v(m)())
              }, {
                icon: I(() => [
                  H(v(yp), { size: 14 })
                ]),
                default: I(() => [
                  je(" " + we(v(n)("transcription.resumeScroll")), 1)
                ]),
                _: 1
              }, 8, ["aria-label"])) : fe("", !0)
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 512));
  }
}), Fy = ".transcription-panel[data-v-4e606f09]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-root[data-v-4e606f09]{height:100%;overflow:hidden;position:relative}.scroll-viewport[data-v-4e606f09]{height:100%;width:100%}[data-v-4e606f09] [data-reka-scroll-area-viewport]{height:100%;max-height:100%}.turns-container[data-v-4e606f09]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.history-loading[data-v-4e606f09]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-4e606f09]{width:120px}.history-start[data-v-4e606f09]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.scrollbar[data-v-4e606f09]{display:flex;touch-action:none;-webkit-user-select:none;user-select:none;padding:var(--spacing-xxs);width:8px;transition:background-color var(--transition-duration)}.scrollbar[data-v-4e606f09]:hover{background-color:var(--color-border-light)}.scrollbar-thumb[data-v-4e606f09]{flex:1;background-color:var(--color-text-muted);border-radius:var(--radius-lg);opacity:.4;transition:opacity var(--transition-duration);position:relative}.scrollbar-thumb[data-v-4e606f09]:hover{opacity:.6}.resume-scroll-btn[data-v-4e606f09]{position:absolute;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-4e606f09],.fade-slide-leave-active[data-v-4e606f09]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-4e606f09],.fade-slide-leave-to[data-v-4e606f09]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-4e606f09],.fade-slide-leave-active[data-v-4e606f09]{transition:none}}@media(max-width:767px){.turns-container[data-v-4e606f09]{padding:var(--spacing-md)}}", Ny = /* @__PURE__ */ rt(By, [["styles", [Fy]], ["__scopeId", "data-v-4e606f09"]]), zy = { class: "switch" }, qy = ["id", "checked"], Hy = ["for"], Vy = /* @__PURE__ */ X({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, r = e, i = n.id ?? eu();
    return (o, s) => (O(), ce("div", zy, [
      le("input", {
        type: "checkbox",
        id: v(i),
        checked: t.modelValue,
        onChange: s[0] || (s[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, qy),
      le("label", { for: v(i) }, [...s[1] || (s[1] = [
        le("div", { class: "switch-slider" }, null, -1)
      ])], 8, Hy)
    ]));
  }
}), Wy = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", jy = /* @__PURE__ */ rt(Vy, [["styles", [Wy]], ["__scopeId", "data-v-2aa0332f"]]), Uy = "(max-width: 767px)";
function Sc() {
  const t = /* @__PURE__ */ L(!1);
  let e = null;
  function n(r) {
    t.value = r.matches;
  }
  return ke(() => {
    e = window.matchMedia(Uy), t.value = e.matches, e.addEventListener("change", n);
  }), On(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Ky = { class: "sidebar-select" }, Xy = /* @__PURE__ */ X({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e;
    return (r, i) => (O(), ce("div", Ky, [
      H(v(_g), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": i[0] || (i[0] = (o) => n("update:selectedValue", o))
      }, {
        default: I(() => [
          H(v(Yg), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: I(() => [
              H(v(Jg), { class: "sidebar-select-trigger-label" }),
              H(v(Fg), null, {
                default: I(() => [
                  H(v(bp), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          H(v(Kg), { disabled: "" }, {
            default: I(() => [
              H(v($g), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: I(() => [
                  H(v(Qg), null, {
                    default: I(() => [
                      (O(!0), ce(Ae, null, Rn(t.items, (o) => (O(), V(v(qg), {
                        key: o.value,
                        value: o.value,
                        class: "sidebar-select-item"
                      }, {
                        default: I(() => [
                          H(v(Vg), { class: "sidebar-select-item-indicator" }, {
                            default: I(() => [
                              H(v(Ru), { size: 14 })
                            ]),
                            _: 1
                          }),
                          H(v(jg), null, {
                            default: I(() => [
                              je(we(o.label), 1)
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
}), Yy = { class: "sidebar-select" }, Gy = ["aria-label"], Jy = { class: "sidebar-select-trigger-label" }, Zy = 7, Qy = /* @__PURE__ */ X({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, r = e, { t: i } = Ft(), o = /* @__PURE__ */ L(!1), s = M(
      () => n.items.find((l) => l.value === n.selectedValue)?.label ?? ""
    );
    function a(l) {
      r("update:selectedValue", l), o.value = !1;
    }
    return (l, c) => (O(), ce("div", Yy, [
      le("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: c[0] || (c[0] = (u) => o.value = !0)
      }, [
        le("span", Jy, we(s.value), 1)
      ], 8, Gy),
      H(v(ju), {
        open: o.value,
        "onUpdate:open": c[2] || (c[2] = (u) => o.value = u)
      }, {
        default: I(() => [
          H(v(ec), { disabled: "" }, {
            default: I(() => [
              H(v(Zu), { class: "editor-overlay" }),
              H(v(Ju), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: I(() => [
                  H(v(tc), { class: "sr-only" }, {
                    default: I(() => [
                      je(we(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  c[3] || (c[3] = le("div", { class: "sheet-handle" }, null, -1)),
                  H(v(Rm), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": c[1] || (c[1] = (u) => a(u))
                  }, {
                    default: I(() => [
                      t.items.length > Zy ? (O(), V(v(Dm), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: v(i)("select.filter")
                      }, null, 8, ["placeholder"])) : fe("", !0),
                      H(v(Im), { class: "sheet-list" }, {
                        default: I(() => [
                          (O(!0), ce(Ae, null, Rn(t.items, (u) => (O(), V(v(zm), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: I(() => [
                              H(v(Hm), { class: "sheet-item-indicator" }, {
                                default: I(() => [
                                  H(v(Ru), { size: 16 })
                                ]),
                                _: 1
                              }),
                              le("span", null, we(u.label), 1)
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
}), As = /* @__PURE__ */ X({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: r } = Sc();
    return (i, o) => v(r) ? (O(), V(Qy, de({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (s) => n("update:selectedValue", s))
    }), null, 16)) : (O(), V(Xy, de({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (s) => n("update:selectedValue", s))
    }), null, 16));
  }
}), Cc = /* @__PURE__ */ X({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, r = e, { t: i } = Ft(), o = M(
      () => n.channels.map((s) => ({ value: s.id, label: s.name }))
    );
    return (s, a) => (O(), V(As, {
      items: o.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(i)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), eb = { class: "speaker-sidebar" }, tb = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, nb = { class: "sidebar-title" }, rb = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, ib = { class: "sidebar-title" }, ob = {
  key: 2,
  class: "sidebar-section"
}, sb = { class: "sidebar-title" }, ab = { class: "subtitle-toggle" }, lb = { class: "subtitle-toggle-label" }, ub = { class: "subtitle-slider" }, cb = { class: "subtitle-slider-label" }, db = { class: "subtitle-slider-value" }, fb = ["value", "disabled"], pb = {
  key: 3,
  class: "sidebar-section"
}, hb = { class: "sidebar-title" }, vb = { class: "speaker-list" }, mb = { class: "speaker-name" }, gb = /* @__PURE__ */ X({
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
    const e = t, n = Mn(), { t: r, locale: i } = Ft(), o = M(
      () => Du(e.translations, i.value, r("sidebar.originalLanguage"), r("language.wildcard"))
    );
    return (s, a) => (O(), ce("aside", eb, [
      t.channels.length > 1 ? (O(), ce("section", tb, [
        le("h2", nb, we(v(r)("sidebar.channel")), 1),
        H(Cc, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => s.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : fe("", !0),
      t.translations.length > 1 ? (O(), ce("section", rb, [
        le("h2", ib, we(v(r)("sidebar.translation")), 1),
        H(As, {
          items: o.value,
          "selected-value": t.selectedTranslationId,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => s.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : fe("", !0),
      v(n).subtitle ? (O(), ce("section", ob, [
        le("h2", sb, we(v(r)("sidebar.subtitle")), 1),
        le("div", ab, [
          le("span", lb, we(v(r)("subtitle.show")), 1),
          H(jy, {
            modelValue: v(n).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => v(n).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        le("label", ub, [
          le("span", cb, [
            je(we(v(r)("subtitle.fontSize")) + " ", 1),
            le("span", db, we(v(n).subtitle.fontSize.value) + "px", 1)
          ]),
          le("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(n).subtitle.fontSize.value,
            disabled: !v(n).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => v(n).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, fb)
        ])
      ])) : fe("", !0),
      t.speakers.length ? (O(), ce("section", pb, [
        le("h2", hb, we(v(r)("sidebar.speakers")), 1),
        le("ul", vb, [
          (O(!0), ce(Ae, null, Rn(t.speakers, (l) => (O(), ce("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            H(wc, {
              color: l.color
            }, null, 8, ["color"]),
            le("span", mb, we(l.name), 1)
          ]))), 128))
        ])
      ])) : fe("", !0)
    ]));
  }
}), yb = ".speaker-sidebar[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-0a4624c1]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-0a4624c1]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-0a4624c1]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-0a4624c1]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-0a4624c1]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-0a4624c1]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-0a4624c1]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-0a4624c1]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-0a4624c1]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-0a4624c1]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-0a4624c1]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-0a4624c1]{border-left:none}.sidebar-section--selector[data-v-0a4624c1]{display:none}}", Ga = /* @__PURE__ */ rt(gb, [["styles", [yb]], ["__scopeId", "data-v-0a4624c1"]]), bb = /* @__PURE__ */ X({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = ef(t, "open"), { t: n } = Ft();
    return (r, i) => (O(), V(v(ju), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (o) => e.value = o)
    }, {
      default: I(() => [
        H(v(ec), { disabled: "" }, {
          default: I(() => [
            H(v(Zu), { class: "editor-overlay" }),
            H(v(Ju), { class: "sidebar-drawer" }, {
              default: I(() => [
                H(v(tc), { class: "sr-only" }, {
                  default: I(() => [
                    je(we(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                H(v(Dh), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: I(() => [
                    H(v(Lu), { size: 20 })
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
}), _b = { class: "player-controls" }, wb = { class: "controls-left" }, xb = { class: "controls-time" }, Sb = { class: "time-display" }, Cb = { class: "time-display" }, Eb = { class: "controls-right" }, Tb = ["value", "aria-label", "disabled"], Ab = /* @__PURE__ */ X({
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
    const n = e, { t: r } = Ft(), i = /* @__PURE__ */ L(!1);
    function o(s) {
      const a = s.target;
      n("update:volume", parseFloat(a.value));
    }
    return (s, a) => (O(), ce("div", _b, [
      le("div", wb, [
        H(Lt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, {
          icon: I(() => [
            H(v(Sp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        H(Lt, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": t.isPlaying ? v(r)("player.pause") : v(r)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, {
          icon: I(() => [
            t.isPlaying ? (O(), V(v(_p), {
              key: 0,
              size: 20
            })) : (O(), V(v(wp), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        H(Lt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, {
          icon: I(() => [
            H(v(Cp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      le("div", xb, [
        le("time", Sb, we(t.currentTime), 1),
        a[7] || (a[7] = le("span", { class: "time-separator" }, "/", -1)),
        le("time", Cb, we(t.duration), 1)
      ]),
      le("div", Eb, [
        le("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          H(Lt, {
            variant: "ghost",
            size: "md",
            "aria-label": t.isMuted ? v(r)("player.unmute") : v(r)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, {
            icon: I(() => [
              t.isMuted ? (O(), V(v(Ap), {
                key: 0,
                size: 16
              })) : (O(), V(v(Tp), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          xd(le("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": v(r)("player.volume"),
            disabled: !t.isReady,
            onInput: o
          }, null, 40, Tb), [
            [Vf, i.value]
          ])
        ], 32),
        H(Lt, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(r)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: I(() => [
            je(we(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), kb = ".player-controls[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-02ebaa64]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-02ebaa64]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-02ebaa64]:disabled{opacity:.5;cursor:default}.play-button[data-v-02ebaa64]{width:40px;height:40px}.speed-button[data-v-02ebaa64]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-02ebaa64],.volume-slider[data-v-02ebaa64]{display:none}.player-controls[data-v-02ebaa64]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Pb = /* @__PURE__ */ rt(Ab, [["styles", [kb]], ["__scopeId", "data-v-02ebaa64"]]);
function Ye(t, e, n, r) {
  return new (n || (n = Promise))((function(i, o) {
    function s(c) {
      try {
        l(r.next(c));
      } catch (u) {
        o(u);
      }
    }
    function a(c) {
      try {
        l(r.throw(c));
      } catch (u) {
        o(u);
      }
    }
    function l(c) {
      var u;
      c.done ? i(c.value) : (u = c.value, u instanceof n ? u : new n((function(d) {
        d(u);
      }))).then(s, a);
    }
    l((r = r.apply(t, e || [])).next());
  }));
}
let Fr = class {
  constructor() {
    this.listeners = {};
  }
  on(e, n, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...o) => {
        this.un(e, i), n(...o);
      };
      return this.listeners[e].add(i), () => this.un(e, i);
    }
    return this.listeners[e].add(n), () => this.un(e, n);
  }
  un(e, n) {
    var r;
    (r = this.listeners[e]) === null || r === void 0 || r.delete(n);
  }
  once(e, n) {
    return this.on(e, n, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...n) {
    this.listeners[e] && this.listeners[e].forEach(((r) => r(...n)));
  }
};
const Xr = { decode: function(t, e) {
  return Ye(this, void 0, void 0, (function* () {
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
  (function(r) {
    const i = r[0];
    if (i.some(((o) => o > 1 || o < -1))) {
      const o = i.length;
      let s = 0;
      for (let a = 0; a < o; a++) {
        const l = Math.abs(i[a]);
        l > s && (s = l);
      }
      for (const a of r) for (let l = 0; l < o; l++) a[l] /= s;
    }
  })(t);
  const n = t.map(((r) => r instanceof Float32Array ? r : Float32Array.from(r)));
  return { duration: e, length: n[0].length, sampleRate: n[0].length / e, numberOfChannels: n.length, getChannelData: (r) => {
    const i = n[r];
    if (!i) throw new Error(`Channel ${r} not found`);
    return i;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Ec(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [o, s] of Object.entries(i)) s instanceof Node ? n.appendChild(s) : typeof s == "string" ? n.appendChild(document.createTextNode(s)) : n.appendChild(Ec(o, s));
  else r === "style" ? Object.assign(n.style, i) : r === "textContent" ? n.textContent = i : n.setAttribute(r, i.toString());
  return n;
}
function Ja(t, e, n) {
  const r = Ec(t, e || {});
  return n?.appendChild(r), r;
}
var Ob = Object.freeze({ __proto__: null, createElement: Ja, default: Ja });
const Rb = { fetchBlob: function(t, e, n) {
  return Ye(this, void 0, void 0, (function* () {
    const r = yield fetch(t, n);
    if (r.status >= 400) throw new Error(`Failed to fetch ${t}: ${r.status} (${r.statusText})`);
    return (function(i, o) {
      Ye(this, void 0, void 0, (function* () {
        if (!i.body || !i.headers) return;
        const s = i.body.getReader(), a = Number(i.headers.get("Content-Length")) || 0;
        let l = 0;
        const c = (u) => {
          l += u?.length || 0;
          const d = Math.round(l / a * 100);
          o(d);
        };
        try {
          for (; ; ) {
            const u = yield s.read();
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
function Le(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(r) {
    Object.is(e, r) || (e = r, n.forEach(((i) => i(e))));
  }, update(r) {
    this.set(r(e));
  }, subscribe: (r) => (n.add(r), () => n.delete(r)) };
}
function En(t, e) {
  const n = Le(t());
  return e.forEach(((r) => r.subscribe((() => {
    const i = t();
    Object.is(n.value, i) || n.set(i);
  })))), { get value() {
    return n.value;
  }, subscribe: (r) => n.subscribe(r) };
}
function un(t, e) {
  let n;
  const r = () => {
    n && (n(), n = void 0), n = t();
  }, i = e.map(((o) => o.subscribe(r)));
  return r(), () => {
    n && (n(), n = void 0), i.forEach(((o) => o()));
  };
}
class Lb extends Fr {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Le(!1), this._currentTime = Le(0), this._duration = Le(0), this._volume = Le(this.media.volume), this._muted = Le(this.media.muted), this._playbackRate = Le(this.media.playbackRate || 1), this._seeking = Le(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
  onMediaEvent(e, n, r) {
    return this.media.addEventListener(e, n, r), () => this.media.removeEventListener(e, n, r);
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
    const r = this.getSrc();
    if (e && r === e) return;
    this.revokeSrc();
    const i = n instanceof Blob && (this.canPlayType(n.type) || !e) ? URL.createObjectURL(n) : e;
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
    this.reactiveMediaEventCleanups.forEach(((n) => n())), this.reactiveMediaEventCleanups = [], this.media = e, this.setupReactiveMediaEvents();
  }
  play() {
    return Ye(this, void 0, void 0, (function* () {
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
function Ib({ maxTop: t, maxBottom: e, halfHeight: n, vScale: r, barMinHeight: i = 0, barAlign: o }) {
  let s = Math.round(t * n * r), a = s + Math.round(e * n * r) || 1;
  return a < i && (a = i, o || (s = a / 2)), { topHeight: s, totalHeight: a };
}
function Mb({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: r, canvasHeight: i }) {
  return t === "top" ? 0 : t === "bottom" ? i - r : e - n;
}
function Za(t, e, n) {
  const r = e - t.left, i = n - t.top;
  return [r / t.width, i / t.height];
}
function Tc(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Qa(t, e) {
  if (!Tc(e)) return t;
  const n = e.barWidth || 0.5, r = n + (e.barGap || n / 2);
  return r === 0 ? t : Math.floor(t / r) * r;
}
function el({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const r = t / e, i = Math.floor(r * n);
  return [i - 1, i, i + 1];
}
function Ac(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Db(t) {
  const e = Le({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = En((() => (function(o) {
    const { scrollLeft: s, scrollWidth: a, clientWidth: l } = o;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = s / a, u = (s + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = En((() => (function(o) {
    return { left: o.scrollLeft, right: o.scrollLeft + o.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: n, bounds: r, cleanup: () => {
    t.removeEventListener("scroll", i), Ac(e);
  } };
}
class $b extends Fr {
  constructor(e, n) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const r = this.parentFromOptionsContainer(e.container);
    this.parent = r;
    const [i, o] = this.initHtml();
    r.appendChild(i), this.container = i, this.scrollContainer = o.querySelector(".scroll"), this.wrapper = o.querySelector(".wrapper"), this.canvasWrapper = o.querySelector(".canvases"), this.progressWrapper = o.querySelector(".progress"), this.cursor = o.querySelector(".cursor"), n && o.appendChild(n), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let n;
    if (typeof e == "string" ? n = document.querySelector(e) : e instanceof HTMLElement && (n = e), !n) throw new Error("Container not found");
    return n;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((n) => {
      const r = this.wrapper.getBoundingClientRect(), [i, o] = Za(r, n.clientX, n.clientY);
      this.emit("click", i, o);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const r = this.wrapper.getBoundingClientRect(), [i, o] = Za(r, n.clientX, n.clientY);
      this.emit("dblclick", i, o);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Db(this.scrollContainer);
    const e = un((() => {
      const { startX: n, endX: r } = this.scrollStream.percentages.value, { left: i, right: o } = this.scrollStream.bounds.value;
      this.emit("scroll", n, r, i, o);
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
    this.dragStream = (function(n, r = {}) {
      const { threshold: i = 3, mouseButton: o = 0, touchDelay: s = 100 } = r, a = Le(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== o || (l.set(f.pointerId, f), l.size > 1)) return;
        let p = f.clientX, h = f.clientY, m = !1;
        const g = Date.now(), x = n.getBoundingClientRect(), { left: _, top: w } = x, y = (A) => {
          if (A.defaultPrevented || l.size > 1 || c && Date.now() - g < s) return;
          const k = A.clientX, $ = A.clientY, P = k - p, W = $ - h;
          (m || Math.abs(P) > i || Math.abs(W) > i) && (A.preventDefault(), A.stopPropagation(), m || (a.set({ type: "start", x: p - _, y: h - w }), m = !0), a.set({ type: "move", x: k - _, y: $ - w, deltaX: P, deltaY: W }), p = k, h = $);
        }, S = (A) => {
          if (l.delete(A.pointerId), m) {
            const k = A.clientX, $ = A.clientY;
            a.set({ type: "end", x: k - _, y: $ - w });
          }
          u();
        }, T = (A) => {
          l.delete(A.pointerId), A.relatedTarget && A.relatedTarget !== document.documentElement || S(A);
        }, E = (A) => {
          m && (A.stopPropagation(), A.preventDefault());
        }, D = (A) => {
          A.defaultPrevented || l.size > 1 || m && A.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", S), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", D, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", D), setTimeout((() => {
            document.removeEventListener("click", E, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), Ac(a);
      } };
    })(this.wrapper);
    const e = un((() => {
      const n = this.dragStream.signal.value;
      if (!n) return;
      const r = this.wrapper.getBoundingClientRect().width, i = (o = n.x / r) < 0 ? 0 : o > 1 ? 1 : o;
      var o;
      n.type === "start" ? (this.isDragging = !0, this.emit("dragstart", i)) : n.type === "move" ? this.emit("drag", i) : n.type === "end" && (this.isDragging = !1, this.emit("dragend", i));
    }), [this.dragStream.signal]);
    this.subscriptions.push(e);
  }
  initHtml() {
    const e = document.createElement("div"), n = e.attachShadow({ mode: "open" }), r = this.options.cspNonce && typeof this.options.cspNonce == "string" ? this.options.cspNonce.replace(/"/g, "") : "";
    return n.innerHTML = `
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
    const { scrollWidth: n } = this.scrollContainer, r = n * e;
    this.setScroll(r);
  }
  destroy() {
    var e;
    this.subscriptions.forEach(((n) => n())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), (e = this.unsubscribeOnScroll) === null || e === void 0 || e.forEach(((n) => n())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(e = 10) {
    let n, r;
    const i = () => {
      n && (clearTimeout(n), n = void 0), r && (r(), r = void 0);
    };
    return this.timeouts.push(i), () => new Promise(((o, s) => {
      i(), r = s, n = setTimeout((() => {
        n = void 0, r = void 0, o();
      }), e);
    }));
  }
  getHeight(e, n) {
    var r;
    const i = ((r = this.audioData) === null || r === void 0 ? void 0 : r.numberOfChannels) || 1;
    return (function({ optionsHeight: o, optionsSplitChannels: s, parentHeight: a, numberOfChannels: l, defaultHeight: c = 128 }) {
      if (o == null) return c;
      const u = Number(o);
      if (!isNaN(u)) return u;
      if (o === "auto") {
        const d = a || c;
        return s?.every(((f) => !f.overlay)) ? d / l : d;
      }
      return c;
    })({ optionsHeight: e, optionsSplitChannels: n, parentHeight: this.parent.clientHeight, numberOfChannels: i, defaultHeight: 128 });
  }
  convertColorValues(e, n) {
    return (function(r, i, o) {
      if (!Array.isArray(r)) return r || "";
      if (r.length === 0) return "#999";
      if (r.length < 2) return r[0] || "";
      const s = document.createElement("canvas"), a = s.getContext("2d"), l = o ?? s.height * i, c = a.createLinearGradient(0, 0, 0, l || i), u = 1 / (r.length - 1);
      return r.forEach(((d, f) => {
        c.addColorStop(f * u, d);
      })), c;
    })(e, this.getPixelRatio(), n?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, n, r, i) {
    const { width: o, height: s } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: h, height: m, length: g, options: x, pixelRatio: _ }) {
      const w = m / 2, y = x.barWidth ? x.barWidth * _ : 1, S = x.barGap ? x.barGap * _ : x.barWidth ? y / 2 : 0, T = y + S || 1;
      return { halfHeight: w, barWidth: y, barGap: S, barRadius: x.barRadius || 0, barMinHeight: x.barMinHeight ? x.barMinHeight * _ : 0, barIndexScale: g > 0 ? h / T / g : 0, barSpacing: T };
    })({ width: o, height: s, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: h, barIndexScale: m, barSpacing: g, barWidth: x, halfHeight: _, vScale: w, canvasHeight: y, barAlign: S, barMinHeight: T }) {
      const E = h[0] || [], D = h[1] || E, A = E.length, k = [];
      let $ = 0, P = 0, W = 0;
      for (let B = 0; B <= A; B++) {
        const K = Math.round(B * m);
        if (K > $) {
          const { topHeight: ee, totalHeight: _e } = Ib({ maxTop: P, maxBottom: W, halfHeight: _, vScale: w, barMinHeight: T, barAlign: S }), Me = Mb({ barAlign: S, halfHeight: _, topHeight: ee, totalHeight: _e, canvasHeight: y });
          k.push({ x: $ * g, y: Me, width: x, height: _e }), $ = K, P = 0, W = 0;
        }
        const re = Math.abs(E[B] || 0), Z = Math.abs(D[B] || 0);
        re > P && (P = re), Z > W && (W = Z);
      }
      return k;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: s, barAlign: n.barAlign, barMinHeight: f });
    r.beginPath();
    for (const h of p) c && "roundRect" in r ? r.roundRect(h.x, h.y, h.width, h.height, c) : r.rect(h.x, h.y, h.width, h.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, n, r, i) {
    const { width: o, height: s } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, p = l[0] || [];
      return [p, l[1] || p].map(((h, m) => {
        const g = h.length, x = g ? c / g : 0, _ = f, w = m === 0 ? -1 : 1, y = [{ x: 0, y: _ }];
        let S = 0, T = 0;
        for (let E = 0; E <= g; E++) {
          const D = Math.round(E * x);
          if (D > S) {
            const k = _ + (Math.round(T * f * d) || 1) * w;
            y.push({ x: S, y: k }), S = D, T = 0;
          }
          const A = Math.abs(h[E] || 0);
          A > T && (T = A);
        }
        return y.push({ x: S, y: _ }), y;
      }));
    })({ channelData: e, width: o, height: s, vScale: i });
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
  renderWaveform(e, n, r) {
    if (r.fillStyle = this.convertColorValues(n.waveColor, r), n.renderFunction) return void n.renderFunction(e, r);
    const i = (function({ channelData: o, barHeight: s, normalize: a, maxPeak: l }) {
      var c;
      const u = s || 1;
      if (!a) return u;
      const d = o[0];
      if (!d || d.length === 0) return u;
      let f = l ?? 0;
      if (!l) for (let p = 0; p < d.length; p++) {
        const h = (c = d[p]) !== null && c !== void 0 ? c : 0, m = Math.abs(h);
        m > f && (f = m);
      }
      return f ? u / f : u;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    Tc(n) ? this.renderBarWaveform(e, n, r, i) : this.renderLineWaveform(e, n, r, i);
  }
  renderSingleCanvas(e, n, r, i, o, s, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(r * l), c.height = Math.round(i * l), c.style.width = `${r}px`, c.style.height = `${i}px`, c.style.left = `${Math.round(o)}px`, s.appendChild(c);
    const u = c.getContext("2d");
    if (n.renderFunction ? (u.fillStyle = this.convertColorValues(n.waveColor, u), n.renderFunction(e, u)) : this.renderWaveform(e, n, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), f = d.getContext("2d");
      f.drawImage(c, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(n.progressColor, f), f.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, r, i, o, s) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = r / a, u = (function({ clientWidth: h, totalWidth: m, options: g }) {
      return Qa(Math.min(8e3, h, m), g);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const f = (h) => {
      if (h < 0 || h >= p || d[h]) return;
      d[h] = !0;
      const m = h * u;
      let g = Math.min(c - m, u);
      if (g = Qa(g, n), g <= 0) return;
      const x = (function({ channelData: _, offset: w, clampedWidth: y, totalWidth: S }) {
        return _.map(((T) => {
          const E = Math.floor(w / S * T.length), D = Math.floor((w + y) / S * T.length);
          return T.slice(E, D);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(x, n, g, i, m, o, s);
    }, p = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < p; h++) f(h);
      return;
    }
    if (el({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: p }).forEach(((h) => f(h))), p > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", s.innerHTML = "", d = {}), el({ scrollLeft: m, totalWidth: c, numCanvases: p }).forEach(((g) => f(g)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, n, r, i) {
    var { overlay: o } = n, s = (function(u, d) {
      var f = {};
      for (var p in u) Object.prototype.hasOwnProperty.call(u, p) && d.indexOf(p) < 0 && (f[p] = u[p]);
      if (u != null && typeof Object.getOwnPropertySymbols == "function") {
        var h = 0;
        for (p = Object.getOwnPropertySymbols(u); h < p.length; h++) d.indexOf(p[h]) < 0 && Object.prototype.propertyIsEnumerable.call(u, p[h]) && (f[p[h]] = u[p[h]]);
      }
      return f;
    })(n, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(s.height, s.splitChannels);
    a.style.height = `${l}px`, o && i > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, s, r, l, a, c);
  }
  render(e) {
    return Ye(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: s, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: f, pixelRatio: p }) {
        const h = Math.ceil(c * u), m = h > d, g = !!(f && !m);
        return { scrollWidth: h, isScrollable: m, useParentWidth: g, width: (g ? d : h) * p };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: i, fillParent: this.options.fillParent, pixelRatio: r });
      if (this.isScrollable = s, this.wrapper.style.width = a ? "100%" : `${o}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let c = 0; c < e.numberOfChannels; c++) {
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
    if (this.unsubscribeOnScroll.forEach(((r) => r())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: n } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: r } = this.progressWrapper.getBoundingClientRect(), i = (function(o) {
        const s = 2 * o;
        return (s < 0 ? Math.floor(s) : Math.ceil(s)) / 2;
      })(r - n);
      this.scrollContainer.scrollLeft += i;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, n = !1) {
    const { scrollLeft: r, scrollWidth: i, clientWidth: o } = this.scrollContainer, s = e * i, a = r, l = r + o, c = o / 2;
    if (this.isDragging)
      s + 30 > l ? this.scrollContainer.scrollLeft += 30 : s - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (s < a || s > l) && (this.scrollContainer.scrollLeft = s - (this.options.autoCenter ? c : 0));
      const u = s - r - c;
      n && this.options.autoCenter && u > 0 && (this.scrollContainer.scrollLeft += u);
    }
  }
  renderProgress(e, n) {
    if (isNaN(e)) return;
    const r = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${r}% 0%, 100% 0%, 100% 100%, ${r}% 100%)`, this.progressWrapper.style.width = `${r}%`, this.cursor.style.left = `${r}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, n);
  }
  exportImage(e, n, r) {
    return Ye(this, void 0, void 0, (function* () {
      const i = this.canvasWrapper.querySelectorAll("canvas");
      if (!i.length) throw new Error("No waveform data");
      if (r === "dataURL") {
        const o = Array.from(i).map(((s) => s.toDataURL(e, n)));
        return Promise.resolve(o);
      }
      return Promise.all(Array.from(i).map(((o) => new Promise(((s, a) => {
        o.toBlob(((l) => {
          l ? s(l) : a(new Error("Could not export image"));
        }), e, n);
      })))));
    }));
  }
}
class Bb extends Fr {
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
class bo extends Fr {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Ye(this, void 0, void 0, (function* () {
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
    return Ye(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(e) {
    const n = e - this.currentTime, r = this.bufferNode;
    r?.stop(this.audioContext.currentTime + n), r?.addEventListener("ended", (() => {
      r === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: !0 });
  }
  setSinkId(e) {
    return Ye(this, void 0, void 0, (function* () {
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
    for (let r = 0; r < n; r++) e.push(this.buffer.getChannelData(r));
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
const Fb = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Pr extends Lb {
  static create(e) {
    return new Pr(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new bo() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Fb, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, p;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Le(0), m = (c = a?.duration) !== null && c !== void 0 ? c : Le(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : Le(!1), x = (d = a?.isSeeking) !== null && d !== void 0 ? d : Le(!1), _ = (f = a?.volume) !== null && f !== void 0 ? f : Le(1), w = (p = a?.playbackRate) !== null && p !== void 0 ? p : Le(1), y = Le(null), S = Le(null), T = Le(""), E = Le(0), D = Le(0), A = En((() => !g.value), [g]), k = En((() => y.value !== null), [y]), $ = En((() => k.value && m.value > 0), [k, m]), P = En((() => h.value), [h]), W = En((() => m.value > 0 ? h.value / m.value : 0), [h, m]);
      return { state: { currentTime: h, duration: m, isPlaying: g, isPaused: A, isSeeking: x, volume: _, playbackRate: w, audioBuffer: y, peaks: S, url: T, zoom: E, scrollPosition: D, canPlay: k, isReady: $, progress: P, progressPercent: W }, actions: { setCurrentTime: (B) => {
        const K = Math.max(0, Math.min(m.value || 1 / 0, B));
        h.set(K);
      }, setDuration: (B) => {
        m.set(Math.max(0, B));
      }, setPlaying: (B) => {
        g.set(B);
      }, setSeeking: (B) => {
        x.set(B);
      }, setVolume: (B) => {
        const K = Math.max(0, Math.min(1, B));
        _.set(K);
      }, setPlaybackRate: (B) => {
        const K = Math.max(0.1, Math.min(16, B));
        w.set(K);
      }, setAudioBuffer: (B) => {
        y.set(B), B && m.set(B.duration);
      }, setPeaks: (B) => {
        S.set(B);
      }, setUrl: (B) => {
        T.set(B);
      }, setZoom: (B) => {
        E.set(Math.max(0, B));
      }, setScrollPosition: (B) => {
        D.set(Math.max(0, B));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new Bb();
    const o = n ? void 0 : this.getMediaElement();
    this.renderer = new $b(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const s = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (s || a && l) && this.load(s, a, l).catch(((c) => {
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
      const r = [];
      r.push(un((() => {
        const s = e.isPlaying.value;
        n.emit(s ? "play" : "pause");
      }), [e.isPlaying])), r.push(un((() => {
        const s = e.currentTime.value;
        n.emit("timeupdate", s), e.isPlaying.value && n.emit("audioprocess", s);
      }), [e.currentTime, e.isPlaying])), r.push(un((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(un((() => {
        e.isReady.value && !i && (i = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let o = !1;
      return r.push(un((() => {
        const s = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        o && !s && c && n.emit("finish"), o = s && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(un((() => {
        const s = e.zoom.value;
        s > 0 && n.emit("zoom", s);
      }), [e.zoom])), () => {
        r.forEach(((s) => s()));
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
    })), this.renderer.on("scroll", ((e, n, r, i) => {
      const o = this.getDuration();
      this.emit("scroll", e * o, n * o, r, i);
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
      const n = this.renderer.on("drag", ((r) => {
        var i;
        if (!this.options.interact) return;
        this.renderer.renderProgress(r), clearTimeout(e);
        let o = 0;
        const s = this.options.dragToSeek;
        this.isPlaying() ? o = 0 : s === !0 ? o = 200 : s && typeof s == "object" && (o = (i = s.debounceTime) !== null && i !== void 0 ? i : 200), e = setTimeout((() => {
          this.seekTo(r);
        }), o), this.emit("interaction", r * this.getDuration()), this.emit("drag", r);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Xr.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Xr.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
  }
  registerPlugin(e) {
    if (this.plugins.includes(e)) return e;
    e._init(this), this.plugins.push(e);
    const n = e.once("destroy", (() => {
      this.plugins = this.plugins.filter(((r) => r !== e)), this.subscriptions = this.subscriptions.filter(((r) => r !== n));
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
  loadAudio(e, n, r, i) {
    return Ye(this, void 0, void 0, (function* () {
      var o;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (o = this.abortController) === null || o === void 0 || o.abort(), this.abortController = null, !n && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        n = yield Rb.fetchBlob(e, l, a);
        const c = this.options.blobMimeType;
        c && (n = new Blob([n], { type: c }));
      }
      this.setSrc(e, n);
      const s = yield new Promise(((a) => {
        const l = i || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !n) {
        const a = this.getMediaElement();
        a instanceof bo && (a.duration = s);
      }
      if (r) this.decodedData = Xr.createBuffer(r, s || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield Xr.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, n, r) {
    return Ye(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, n, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, n, r) {
    return Ye(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, n, r);
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
  exportPeaks({ channels: e = 2, maxLength: n = 8e3, precision: r = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const i = Math.min(e, this.decodedData.numberOfChannels), o = [];
    for (let s = 0; s < i; s++) {
      const a = this.decodedData.getChannelData(s), l = [], c = a.length / n;
      for (let u = 0; u < n; u++) {
        const d = a.slice(Math.floor(u * c), Math.ceil((u + 1) * c));
        let f = 0;
        for (let p = 0; p < d.length; p++) {
          const h = d[p];
          Math.abs(h) > Math.abs(f) && (f = h);
        }
        l.push(Math.round(f * r) / r);
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
    const n = this.getDuration() * e;
    this.setTime(n);
  }
  play(e, n) {
    const r = Object.create(null, { play: { get: () => super.play } });
    return Ye(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return n != null && (this.media instanceof bo ? this.media.stopAt(n) : this.stopAtPosition = n), i;
    }));
  }
  playPause() {
    return Ye(this, void 0, void 0, (function* () {
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
    return Ye(this, arguments, void 0, (function* (e = "image/png", n = 1, r = "dataURL") {
      return this.renderer.exportImage(e, n, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((n) => n.destroy())), this.subscriptions.forEach(((n) => n())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((n) => n())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Pr.BasePlugin = class extends Fr {
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
}, Pr.dom = Ob;
class kc {
  constructor() {
    this.listeners = {};
  }
  on(e, n, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...o) => {
        this.un(e, i), n(...o);
      };
      return this.listeners[e].add(i), () => this.un(e, i);
    }
    return this.listeners[e].add(n), () => this.un(e, n);
  }
  un(e, n) {
    var r;
    (r = this.listeners[e]) === null || r === void 0 || r.delete(n);
  }
  once(e, n) {
    return this.on(e, n, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...n) {
    this.listeners[e] && this.listeners[e].forEach(((r) => r(...n)));
  }
}
class Nb extends kc {
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
function Pc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [o, s] of Object.entries(i)) s instanceof Node ? n.appendChild(s) : typeof s == "string" ? n.appendChild(document.createTextNode(s)) : n.appendChild(Pc(o, s));
  else r === "style" ? Object.assign(n.style, i) : r === "textContent" ? n.textContent = i : n.setAttribute(r, i.toString());
  return n;
}
function or(t, e, n) {
  const r = Pc(t, e || {});
  return n?.appendChild(r), r;
}
function Oc(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(r) {
    Object.is(e, r) || (e = r, n.forEach(((i) => i(e))));
  }, update(r) {
    this.set(r(e));
  }, subscribe: (r) => (n.add(r), () => n.delete(r)) };
}
function ti(t, e) {
  let n;
  const r = () => {
    n && (n(), n = void 0), n = t();
  }, i = e.map(((o) => o.subscribe(r)));
  return r(), () => {
    n && (n(), n = void 0), i.forEach(((o) => o()));
  };
}
function Fn(t, e) {
  const n = Oc(null), r = (i) => {
    n.set(i);
  };
  return t.addEventListener(e, r), n._cleanup = () => {
    t.removeEventListener(e, r);
  }, n;
}
function Sn(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function ni(t, e = {}) {
  const { threshold: n = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, o = Oc(null), s = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (s.set(u.pointerId, u), s.size > 1)) return;
    let d = u.clientX, f = u.clientY, p = !1;
    const h = Date.now(), m = t.getBoundingClientRect(), { left: g, top: x } = m, _ = (E) => {
      if (E.defaultPrevented || s.size > 1 || a && Date.now() - h < i) return;
      const D = E.clientX, A = E.clientY, k = D - d, $ = A - f;
      (p || Math.abs(k) > n || Math.abs($) > n) && (E.preventDefault(), E.stopPropagation(), p || (o.set({ type: "start", x: d - g, y: f - x }), p = !0), o.set({ type: "move", x: D - g, y: A - x, deltaX: k, deltaY: $ }), d = D, f = A);
    }, w = (E) => {
      if (s.delete(E.pointerId), p) {
        const D = E.clientX, A = E.clientY;
        o.set({ type: "end", x: D - g, y: A - x });
      }
      l();
    }, y = (E) => {
      s.delete(E.pointerId), E.relatedTarget && E.relatedTarget !== document.documentElement || w(E);
    }, S = (E) => {
      p && (E.stopPropagation(), E.preventDefault());
    }, T = (E) => {
      E.defaultPrevented || s.size > 1 || p && E.preventDefault();
    };
    document.addEventListener("pointermove", _), document.addEventListener("pointerup", w), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", w), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", S, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: o, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), s.clear(), Sn(o);
  } };
}
class tl extends kc {
  constructor(e, n, r = 0) {
    var i, o, s, a, l, c, u, d, f, p;
    super(), this.totalDuration = n, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (s = e.resize) === null || s === void 0 || s, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = or("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = or("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = ni(r, { threshold: 1 }), s = ni(i, { threshold: 1 }), a = ti((() => {
      const c = o.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [o.signal]), l = ti((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "end") : c.type === "end" && this.onEndResizing("end"));
    }), [s.signal]);
    this.subscriptions.push((() => {
      a(), l(), o.cleanup(), s.cleanup();
    }));
  }
  removeResizeHandles(e) {
    const n = e.querySelector('[part*="region-handle-left"]'), r = e.querySelector('[part*="region-handle-right"]');
    n && e.removeChild(n), r && e.removeChild(r);
  }
  initElement() {
    if (this.isRemoved) return null;
    const e = this.start === this.end;
    let n = 0, r = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (r = 100 / this.numberOfChannels, n = r * this.channelIdx);
    const i = or("div", { style: { position: "absolute", top: `${n}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(i), i;
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
    const n = Fn(e, "click"), r = Fn(e, "mouseenter"), i = Fn(e, "mouseleave"), o = Fn(e, "dblclick"), s = Fn(e, "pointerdown"), a = Fn(e, "pointerup"), l = n.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = o.subscribe(((g) => g && this.emit("dblclick", g))), f = s.subscribe(((g) => g && this.toggleCursor(!0))), p = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), p(), Sn(n), Sn(r), Sn(i), Sn(o), Sn(s), Sn(a);
    }));
    const h = ni(e), m = ti((() => {
      const g = h.signal.value;
      g && (g.type === "start" ? this.toggleCursor(!0) : g.type === "move" && g.deltaX !== void 0 ? this.onMove(g.deltaX) : g.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      m(), h.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (g) => this.onContentClick(g), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, n, r) {
    var i;
    if (!(!((i = this.element) === null || i === void 0) && i.parentElement)) return;
    const { width: o } = this.element.parentElement.getBoundingClientRect(), s = e / o * this.totalDuration;
    let a = n && n !== "start" ? this.start : this.start + s, l = n && n !== "end" ? this.end : this.end + s;
    const c = r !== void 0;
    c && this.updatingSide && this.updatingSide !== n && (this.updatingSide === "start" ? a = r : l = r), a = Math.max(0, a), l = Math.min(this.totalDuration, l);
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
        const r = this.start === this.end;
        this.content = or("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (r) => this.onContentClick(r), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var n, r;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const i = this.start === this.end;
        this.start = this.clampPosition((n = e.start) !== null && n !== void 0 ? n : this.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : i ? this.start : this.end), this.renderPosition(), this.setPart();
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
class ks extends Nb {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new ks(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((n) => {
      this.regions.forEach(((r) => r._setTotalDuration(n)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((n) => {
      const r = this.regions.filter(((i) => i.start <= n && (i.end === i.start ? i.start + 0.05 : i.end) >= n));
      r.forEach(((i) => {
        e.includes(i) || this.emit("region-in", i);
      })), e.forEach(((i) => {
        r.includes(i) || this.emit("region-out", i);
      })), e = r;
    })));
  }
  initRegionsContainer() {
    return or("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const n = e.content, r = n.getBoundingClientRect(), i = this.regions.map(((o) => {
        if (o === e || !o.content) return 0;
        const s = o.content.getBoundingClientRect();
        return r.left < s.left + s.width && s.left < r.left + r.width ? s.height : 0;
      })).reduce(((o, s) => o + s), 0);
      n.style.marginTop = `${i}px`;
    }), 10);
  }
  adjustScroll(e) {
    var n, r;
    if (!e.element) return;
    const i = (r = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getWrapper()) === null || r === void 0 ? void 0 : r.parentElement;
    if (!i) return;
    const { clientWidth: o, scrollWidth: s } = i;
    if (s <= o) return;
    const a = i.getBoundingClientRect(), l = e.element.getBoundingClientRect(), c = l.left - a.left, u = l.right - a.left;
    c < 0 ? i.scrollLeft += c : u > o && (i.scrollLeft += u - o);
  }
  virtualAppend(e, n, r) {
    const i = () => {
      if (!this.wavesurfer) return;
      const o = this.wavesurfer.getWidth(), s = this.wavesurfer.getScroll(), a = n.clientWidth, l = this.wavesurfer.getDuration(), c = Math.round(e.start / l * a), u = c + (Math.round((e.end - e.start) / l * a) || 1) > s && c < s + o;
      u && !r.parentElement ? n.appendChild(r) : !u && r.parentElement && r.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      i();
      const o = this.wavesurfer.on("scroll", i), s = this.wavesurfer.on("zoom", i), a = this.wavesurfer.on("resize", i);
      this.subscriptions.push(o, s, a), e.once("remove", (() => {
        o(), s(), a();
      }));
    }), 0);
  }
  saveRegion(e) {
    if (!e.element) return;
    this.virtualAppend(e, this.regionsContainer, e.element), this.avoidOverlapping(e), this.regions.push(e);
    const n = [e.on("update", ((r) => {
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
      n.forEach(((r) => r())), this.regions = this.regions.filter(((r) => r !== e)), this.emit("region-removed", e);
    }))];
    this.subscriptions.push(...n), this.emit("region-created", e);
  }
  addRegion(e) {
    var n, r;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const i = this.wavesurfer.getDuration(), o = (r = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, s = new tl(e, i, o);
    return this.emit("region-initialized", s), i ? this.saveRegion(s) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      s._setTotalDuration(a), this.saveRegion(s);
    }))), s;
  }
  enableDragSelection(e, n = 3) {
    var r;
    const i = (r = this.wavesurfer) === null || r === void 0 ? void 0 : r.getWrapper();
    if (!(i && i instanceof HTMLElement)) return () => {
    };
    let o = null, s = 0, a = 0;
    const l = ni(i, { threshold: n }), c = ti((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (s = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = s / m * p;
        const g = f.x / m * p, x = (f.x + 5) / m * p;
        o = new tl(Object.assign(Object.assign({}, e), { start: g, end: x }), p, h), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
      } else f.type === "move" && f.deltaX !== void 0 ? o && o._onUpdate(f.deltaX, f.x > s ? "end" : "start", a) : f.type === "end" && o && (this.saveRegion(o), o.updatingSide = void 0, o = null);
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
const _o = [0.5, 0.75, 1, 1.25, 1.5, 2];
function zb(t) {
  const { containerRef: e, audioSrc: n, turns: r, speakers: i } = t, o = /* @__PURE__ */ kn(null), s = /* @__PURE__ */ kn(null), a = /* @__PURE__ */ L(0), l = /* @__PURE__ */ L(0), c = /* @__PURE__ */ L(!1), u = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(!1), f = /* @__PURE__ */ L(1), p = /* @__PURE__ */ L(1), h = /* @__PURE__ */ L(!1), m = M(() => hi(a.value)), g = M(() => hi(l.value));
  function x(B, K) {
    P(), d.value = !0, u.value = !1;
    const re = ks.create();
    s.value = re;
    const Z = Pr.create({
      container: B,
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
      renderFunction: zp,
      url: K,
      plugins: [re]
    });
    Z.on("ready", () => {
      u.value = !0, d.value = !1, l.value = Z.getDuration(), _();
    }), Z.on("timeupdate", (ee) => {
      a.value = ee;
    }), Z.on("play", () => {
      c.value = !0;
    }), Z.on("pause", () => {
      c.value = !1;
    }), Z.on("finish", () => {
      c.value = !1;
    }), o.value = Z;
  }
  function _() {
    const B = s.value;
    if (B) {
      B.clearRegions();
      for (const K of r.value) {
        const re = K.speakerId ? i.value.get(K.speakerId) : void 0;
        if (!re || K.startTime == null || K.endTime == null) continue;
        const Z = re.color;
        B.addRegion({
          start: K.startTime,
          end: K.endTime,
          color: Bp(Z, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Z);
      }
    }
  }
  function w() {
    o.value?.play();
  }
  function y() {
    o.value?.pause();
  }
  function S() {
    o.value?.playPause();
  }
  function T(B) {
    const K = o.value;
    !K || l.value === 0 || K.setTime(B);
  }
  function E(B) {
    T(Math.max(0, Math.min(a.value + B, l.value)));
  }
  function D(B) {
    const K = o.value;
    K && (f.value = B, K.setVolume(B), B > 0 && h.value && (h.value = !1, K.setMuted(!1)));
  }
  function A() {
    const B = o.value;
    B && (h.value = !h.value, B.setMuted(h.value));
  }
  function k(B) {
    const K = o.value;
    K && (p.value = B, K.setPlaybackRate(B));
  }
  function $() {
    const K = (_o.indexOf(
      p.value
    ) + 1) % _o.length;
    k(_o[K] ?? 1);
  }
  function P() {
    W !== null && (clearTimeout(W), W = null), o.value && (o.value.destroy(), o.value = null, s.value = null);
  }
  xe(
    [e, n],
    ([B, K]) => {
      B && K && x(B, K);
    },
    { immediate: !0 }
  );
  let W = null;
  return xe([r, i], () => {
    u.value && (W !== null && clearTimeout(W), W = setTimeout(() => {
      W = null, _();
    }, 150));
  }), On(() => {
    P();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: f,
    playbackRate: p,
    isMuted: h,
    formattedCurrentTime: m,
    formattedDuration: g,
    play: w,
    pause: y,
    togglePlay: S,
    seekTo: T,
    skip: E,
    setVolume: D,
    setPlaybackRate: k,
    cyclePlaybackRate: $,
    toggleMute: A
  };
}
const qb = { class: "audio-player" }, Hb = /* @__PURE__ */ X({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const r = t, i = n, o = /* @__PURE__ */ L(null), {
      isPlaying: s,
      isReady: a,
      isLoading: l,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: f,
      formattedCurrentTime: p,
      formattedDuration: h,
      togglePlay: m,
      seekTo: g,
      pause: x,
      skip: _,
      setVolume: w,
      cyclePlaybackRate: y,
      toggleMute: S
    } = zb({
      containerRef: o,
      audioSrc: /* @__PURE__ */ Gr(() => r.audioSrc),
      turns: /* @__PURE__ */ Gr(() => r.turns),
      speakers: /* @__PURE__ */ Gr(() => r.speakers)
    });
    return xe(f, (T) => i("timeupdate", T)), xe(s, (T) => i("playStateChange", T)), e({ seekTo: g, pause: x }), (T, E) => (O(), ce("footer", qb, [
      le("div", {
        ref_key: "waveformRef",
        ref: o,
        class: fn(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      H(Pb, {
        "is-playing": v(s),
        "current-time": v(p),
        duration: v(h),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: E[0] || (E[0] = (D) => v(_)(-10)),
        onSkipForward: E[1] || (E[1] = (D) => v(_)(10)),
        "onUpdate:volume": v(w),
        onToggleMute: v(S),
        onCyclePlaybackRate: v(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Vb = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", Wb = /* @__PURE__ */ rt(Hb, [["styles", [Vb]], ["__scopeId", "data-v-9248e45e"]]);
class jb {
  diff(e, n, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const o = this.castInput(e, r), s = this.castInput(n, r), a = this.removeEmpty(this.tokenize(o, r)), l = this.removeEmpty(this.tokenize(s, r));
    return this.diffWithOptionsObj(a, l, r, i);
  }
  diffWithOptionsObj(e, n, r, i) {
    var o;
    const s = (_) => {
      if (_ = this.postProcess(_, r), i) {
        setTimeout(function() {
          i(_);
        }, 0);
        return;
      } else
        return _;
    }, a = n.length, l = e.length;
    let c = 1, u = a + l;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (o = r.timeout) !== null && o !== void 0 ? o : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(p[0], n, e, 0, r);
    if (p[0].oldPos + 1 >= l && h + 1 >= a)
      return s(this.buildValues(p[0].lastComponent, n, e));
    let m = -1 / 0, g = 1 / 0;
    const x = () => {
      for (let _ = Math.max(m, -c); _ <= Math.min(g, c); _ += 2) {
        let w;
        const y = p[_ - 1], S = p[_ + 1];
        y && (p[_ - 1] = void 0);
        let T = !1;
        if (S) {
          const D = S.oldPos - _;
          T = S && 0 <= D && D < a;
        }
        const E = y && y.oldPos + 1 < l;
        if (!T && !E) {
          p[_] = void 0;
          continue;
        }
        if (!E || T && y.oldPos < S.oldPos ? w = this.addToPath(S, !0, !1, 0, r) : w = this.addToPath(y, !1, !0, 1, r), h = this.extractCommon(w, n, e, _, r), w.oldPos + 1 >= l && h + 1 >= a)
          return s(this.buildValues(w.lastComponent, n, e)) || !0;
        p[_] = w, w.oldPos + 1 >= l && (g = Math.min(g, _ - 1)), h + 1 >= a && (m = Math.max(m, _ + 1));
      }
      c++;
    };
    if (i)
      (function _() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          x() || _();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const _ = x();
        if (_)
          return _;
      }
  }
  addToPath(e, n, r, i, o) {
    const s = e.lastComponent;
    return s && !o.oneChangePerToken && s.added === n && s.removed === r ? {
      oldPos: e.oldPos + i,
      lastComponent: { count: s.count + 1, added: n, removed: r, previousComponent: s.previousComponent }
    } : {
      oldPos: e.oldPos + i,
      lastComponent: { count: 1, added: n, removed: r, previousComponent: s }
    };
  }
  extractCommon(e, n, r, i, o) {
    const s = n.length, a = r.length;
    let l = e.oldPos, c = l - i, u = 0;
    for (; c + 1 < s && l + 1 < a && this.equals(r[l + 1], n[c + 1], o); )
      c++, l++, u++, o.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return u && !o.oneChangePerToken && (e.lastComponent = { count: u, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, c;
  }
  equals(e, n, r) {
    return r.comparator ? r.comparator(e, n) : e === n || !!r.ignoreCase && e.toLowerCase() === n.toLowerCase();
  }
  removeEmpty(e) {
    const n = [];
    for (let r = 0; r < e.length; r++)
      e[r] && n.push(e[r]);
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
  buildValues(e, n, r) {
    const i = [];
    let o;
    for (; e; )
      i.push(e), o = e.previousComponent, delete e.previousComponent, e = o;
    i.reverse();
    const s = i.length;
    let a = 0, l = 0, c = 0;
    for (; a < s; a++) {
      const u = i[a];
      if (u.removed)
        u.value = this.join(r.slice(c, c + u.count)), c += u.count;
      else {
        if (!u.added && this.useLongestToken) {
          let d = n.slice(l, l + u.count);
          d = d.map(function(f, p) {
            const h = r[c + p];
            return h.length > f.length ? h : f;
          }), u.value = this.join(d);
        } else
          u.value = this.join(n.slice(l, l + u.count));
        l += u.count, u.added || (c += u.count);
      }
    }
    return i;
  }
}
class Ub extends jb {
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
const Kb = new Ub();
function Xb(t, e, n) {
  return Kb.diff(t, e, n);
}
function wo({ previousText: t, previousIndexes: e }, n, r) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const i = t.split(" "), o = n.split(" "), s = Xb(i, o, {
    comparator: Gb
  }), a = Yb(s), l = [...e];
  let c = [...e], u = 0;
  for (const p of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in p && p.replaced)
      c = ri(
        c,
        l[0],
        p.countAdded - p.countRemoved
      ), u += p.countRemoved;
    else if ("removed" in p && p.removed) {
      const h = p;
      u += h.count, c = ri(
        c,
        l[0],
        -h.count
      );
    } else if ("added" in p && p.added) {
      const h = p;
      c = ri(
        c,
        l[0],
        h.count
      );
    } else
      u += p.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = o.slice(d).join(" ");
  if (r(f)) {
    const h = Rc(
      f,
      r
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
function Yb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (!r.removed) {
      e.push(r);
      continue;
    }
    if (n + 1 < t.length) {
      const i = t[n + 1];
      if (i.added) {
        e.push({
          replaced: !0,
          removed: r.removed ?? !1,
          added: i.added ?? !1,
          countRemoved: r.count,
          countAdded: i.count
        }), n++;
        continue;
      }
    }
    e.push(r);
  }
  return e;
}
function ri(t, e, n) {
  return t.map((r) => r >= e ? r + n : r);
}
function Rc(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let r;
  for (r = 0; r < n.length; r++) {
    const i = n.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    ri(
      Rc(
        n.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function Gb(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(n.length, r.length);
  let o = 0;
  for (let a = 0; a < i; a++)
    n[a] === r[a] && o++;
  return o / n.length > 0.8;
}
class Jb {
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
    lineHeight: r = 50,
    color: i = "white",
    font: o = "Arial",
    paddingInline: s = 100
  } = {}) {
    this.canvas = e, this.fontSize = n, this.lineHeight = r, this.color = i, this.font = o, this.paddingInline = s, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, n, r) {
    const i = this.canvas.getContext("2d");
    i.font = `${this.fontSize}px ${this.font}`, i.fillStyle = this.color, i.fillText(e, n + this.paddingInline, r);
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
class Zb extends Jb {
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
    this.resetAll(), this.currentState = wo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = wo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = wo(
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
    let r = 0;
    return e.previousIndexes.length > 1 && (r = e.previousIndexes[e.previousIndexes.length - 2]), e.previousText.split(" ").slice(r, n).join(" ");
  }
  computeIfTextIsTooLong(e) {
    const n = this.canvas.getContext("2d");
    n.font = `${this.fontSize}px ${this.font}`;
    const r = this.canvas.width - 2 * this.paddingInline;
    return n.measureText(e).width > r;
  }
}
function Lc(t) {
  const e = Mn();
  let n = null;
  ke(() => {
    t.canvasRef.value && (n = new Zb(t.canvasRef.value, {
      fontSize: t.fontSize,
      lineHeight: t.lineHeight
    }));
  }), xe(
    () => e.live?.partial.value,
    (a) => {
      a && n && n.newPartial(a);
    }
  );
  const r = e.onActiveTranslation("turn:add", ({ turn: a }) => {
    if (!n) return;
    const l = a.words.length > 0 ? a.words.map((c) => c.text).join(" ") : a.text ?? "";
    l && n.newFinal(l);
  });
  function i() {
    n && (n.resetDrawing(), n.resetAll());
  }
  const o = e.on("translation:sync", i), s = e.on("channel:sync", i);
  lt(() => {
    r(), o(), s(), n?.dispose(), n = null;
  });
}
const Qb = ["height"], e0 = /* @__PURE__ */ X({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Mn(), n = yr("canvas"), r = M(() => e.subtitle?.fontSize.value ?? 40), i = M(() => 1.2 * r.value), o = M(() => 2.4 * r.value);
    return Lc({
      canvasRef: n,
      fontSize: r.value,
      lineHeight: i.value
    }), (s, a) => (O(), ce("div", {
      class: "subtitle-banner",
      style: nt({ height: o.value + "px" })
    }, [
      le("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: o.value
      }, null, 8, Qb)
    ], 4));
  }
}), t0 = ".subtitle-banner[data-v-b80652cd]{flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-b80652cd]{display:block;width:100%;height:100%}", n0 = /* @__PURE__ */ rt(e0, [["styles", [t0]], ["__scopeId", "data-v-b80652cd"]]), r0 = {
  ref: "container",
  class: "subtitle-fullscreen"
}, i0 = ["aria-label"], o0 = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, nl = 48, s0 = /* @__PURE__ */ X({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Mn(), { t: n } = Ft(), r = yr("container"), i = yr("canvas");
    Lc({
      canvasRef: i,
      fontSize: nl,
      lineHeight: 1.2 * nl
    }), ke(async () => {
      const a = r.value;
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
    ke(() => {
      document.addEventListener("fullscreenchange", o);
    });
    function s() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return lt(() => {
      document.removeEventListener("fullscreenchange", o);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (O(), ce("div", r0, [
      le("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: s
      }, [
        H(v(Lu), { size: 24 })
      ], 8, i0),
      le("canvas", o0, null, 512)
    ], 512));
  }
}), a0 = ".subtitle-fullscreen[data-v-cfe63125]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-cfe63125]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-cfe63125]:hover,.subtitle-fullscreen__close[data-v-cfe63125]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-cfe63125]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-cfe63125]{transition:none}}", l0 = /* @__PURE__ */ rt(s0, [["styles", [a0]], ["__scopeId", "data-v-cfe63125"]]), u0 = { class: "editor-layout" }, c0 = { class: "editor-body" }, d0 = {
  key: 4,
  class: "mobile-selectors"
}, f0 = /* @__PURE__ */ X({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Mn(), { t: r, locale: i } = Ft(), { isMobile: o } = Sc(), s = /* @__PURE__ */ L(!1), a = M(() => n.activeChannel.value.activeTranslation.value.turns.value), l = n.speakers.all, c = M(() => [...n.channels.values()]), u = M(() => [...n.activeChannel.value.translations.values()]), d = M(() => n.activeChannel.value.activeTranslation.value.id), f = M(() => Array.from(l.values())), p = yr("audioPlayer");
    function h(_) {
      n.audio && (n.audio.currentTime.value = _);
    }
    xe(
      () => n.activeChannelId.value,
      () => {
        p.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), s.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((_) => p.value?.seekTo(_));
    const m = M(
      () => Du(
        u.value,
        i.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    function g(_) {
      n.setActiveChannel(_);
    }
    function x(_) {
      n.activeChannel.value.setActiveTranslation(_);
    }
    return (_, w) => (O(), ce("div", u0, [
      e.showHeader ? (O(), V(Gp, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value.duration,
        language: d.value,
        "is-mobile": v(o),
        onToggleSidebar: w[0] || (w[0] = (y) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : fe("", !0),
      le("main", c0, [
        H(Ny, {
          turns: a.value,
          speakers: v(l)
        }, null, 8, ["turns", "speakers"]),
        v(o) ? fe("", !0) : (O(), V(Ga, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": x
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(o) ? (O(), V(bb, {
          key: 1,
          open: s.value,
          "onUpdate:open": w[1] || (w[1] = (y) => s.value = y)
        }, {
          default: I(() => [
            H(Ga, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": x
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : fe("", !0)
      ]),
      v(n).audio?.src.value ? (O(), V(Wb, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: a.value,
        speakers: v(l),
        onTimeupdate: h,
        onPlayStateChange: w[2] || (w[2] = (y) => {
          v(n).audio && (v(n).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : fe("", !0),
      v(n).subtitle?.isVisible.value && !v(o) && !v(n).subtitle.isFullscreen.value ? (O(), V(n0, { key: 2 })) : fe("", !0),
      v(n).subtitle?.isFullscreen.value ? (O(), V(l0, { key: 3 })) : fe("", !0),
      v(o) ? (O(), ce("div", d0, [
        c.value.length > 1 ? (O(), V(Cc, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : fe("", !0),
        u.value.length > 1 ? (O(), V(As, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": x
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : fe("", !0)
      ])) : fe("", !0)
    ]));
  }
}), p0 = ".editor-layout[data-v-084c0e7c]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-084c0e7c]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-084c0e7c]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-084c0e7c]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-084c0e7c]{grid-template-columns:1fr}}", h0 = /* @__PURE__ */ rt(f0, [["styles", [p0]], ["__scopeId", "data-v-084c0e7c"]]);
function v0() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ L(0), n = /* @__PURE__ */ L(!1);
      let r = null;
      const i = M(
        () => t.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function o(l) {
        r?.(l);
      }
      function s(l) {
        r = l;
      }
      const a = {
        currentTime: e,
        isPlaying: n,
        src: i,
        seekTo: o,
        setSeekHandler: s
      };
      return t.audio = a, () => {
        t.audio = void 0;
      };
    }
  };
}
const m0 = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', g0 = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .75rem;--font-size-sm: .8125rem;--font-size-base: 1rem;--font-size-lg: 1.125rem;--font-size-xl: 1.5rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 260px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}', y0 = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}", b0 = ".sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow:hidden;padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}";
function rl(t) {
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
function il(t, e) {
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
function C0() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ kn(null), n = /* @__PURE__ */ L(!1);
      n.value = !0;
      function r() {
        e.value = null, $s(e);
      }
      function i(w, y) {
        if (t.activeChannelId.value !== y) return;
        const S = t.activeChannel.value.activeTranslation.value;
        if (S.isSource) {
          if (w.text == null) return;
          e.value = w.text;
        } else if (w.translations) {
          const T = w.translations.find(
            (E) => E.translationId === S.id
          );
          e.value = T?.text ?? null;
        } else
          return;
        $s(e);
      }
      let o = null;
      function s() {
        o === null && (o = setTimeout(() => {
          o = null, r();
        }, 150));
      }
      function a() {
        o !== null && (clearTimeout(o), o = null);
      }
      function l(w, y) {
        w.turns.value.some((T) => T.id === y.id) ? w.updateTurn(y.id, y) : w.addTurn(y);
      }
      function c(w, y) {
        w.speakerId && t.speakers.ensure(w.speakerId);
        const S = t.channels.get(y);
        if (!S) {
          f();
          return;
        }
        if (w.text != null && l(S.sourceTranslation, rl(w)), w.translations)
          for (const T of w.translations) {
            const E = S.translations.get(T.translationId);
            E && l(E, il(w, T));
          }
        f();
      }
      function u(w, y) {
        d([w], y);
      }
      function d(w, y) {
        const S = t.channels.get(y);
        if (!S) return;
        const T = /* @__PURE__ */ new Set();
        for (const A of w)
          A.speakerId && !T.has(A.speakerId) && (T.add(A.speakerId), t.speakers.ensure(A.speakerId));
        const E = [];
        for (const A of w)
          A.text != null && E.push(rl(A));
        E.length > 0 && S.sourceTranslation.prependTurns(E);
        const D = /* @__PURE__ */ new Map();
        for (const A of w)
          if (A.translations)
            for (const k of A.translations) {
              let $ = D.get(k.translationId);
              $ || ($ = [], D.set(k.translationId, $)), $.push(il(A, k));
            }
        for (const [A, k] of D) {
          const $ = S.translations.get(A);
          $ && $.prependTurns(k);
        }
      }
      function f() {
        a(), r();
      }
      function p(w) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const h = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: i,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: p
      }, m = t.on("channel:change", f), g = t.on("translation:change", f), x = t.on("translation:sync", s), _ = t.on("channel:sync", s);
      return t.live = h, () => {
        f(), m(), g(), x(), _(), t.live = void 0;
      };
    }
  };
}
function E0(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ L(t.fontSize ?? 40), r = /* @__PURE__ */ L(!0), i = /* @__PURE__ */ L(!1), o = {
        fontSize: n,
        isVisible: r,
        isFullscreen: i,
        enterFullscreen() {
          i.value = !0;
        },
        exitFullscreen() {
          i.value = !1;
        }
      };
      return e.subtitle = o, () => {
        r.value = !1, i.value = !1, e.subtitle = void 0;
      };
    }
  };
}
const _0 = /* @__PURE__ */ ip({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: !1 }
  },
  styles: [g0, y0, b0],
  setup(t, { expose: e }) {
    const n = /* @__PURE__ */ L(t.locale);
    $p(n);
    const r = Ty();
    return r.use(v0()), Ay(r), e({ editor: r }), () => r.channels.size ? yt(h0, { showHeader: !t.noHeader }) : null;
  }
});
function w0() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = m0, document.head.appendChild(e);
}
function T0(t = "linto-editor") {
  w0(), customElements.define(t, _0);
}
export {
  _0 as LintoEditor,
  v0 as createAudioPlugin,
  C0 as createLivePlugin,
  E0 as createSubtitlePlugin,
  T0 as register
};
