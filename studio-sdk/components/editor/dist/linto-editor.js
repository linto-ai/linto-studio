// @__NO_SIDE_EFFECTS__
function zs(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const de = {}, on = [], mt = () => {
}, Po = () => !1, Ai = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Bs = (t) => t.startsWith("onUpdate:"), xe = Object.assign, Ns = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Il = Object.prototype.hasOwnProperty, fe = (t, e) => Il.call(t, e), Y = Array.isArray, an = (t) => qn(t) === "[object Map]", Mo = (t) => qn(t) === "[object Set]", pr = (t) => qn(t) === "[object Date]", ne = (t) => typeof t == "function", _e = (t) => typeof t == "string", st = (t) => typeof t == "symbol", he = (t) => t !== null && typeof t == "object", Io = (t) => (he(t) || ne(t)) && ne(t.then) && ne(t.catch), Oo = Object.prototype.toString, qn = (t) => Oo.call(t), Ol = (t) => qn(t).slice(8, -1), Pi = (t) => qn(t) === "[object Object]", Mi = (t) => _e(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, An = /* @__PURE__ */ zs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Ii = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Dl = /-\w/g, Ae = Ii(
  (t) => t.replace(Dl, (e) => e.slice(1).toUpperCase())
), Ll = /\B([A-Z])/g, Ve = Ii(
  (t) => t.replace(Ll, "-$1").toLowerCase()
), Oi = Ii((t) => t.charAt(0).toUpperCase() + t.slice(1)), ai = Ii(
  (t) => t ? `on${Oi(t)}` : ""
), Re = (t, e) => !Object.is(t, e), qi = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Do = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, Rl = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, gs = (t) => {
  const e = _e(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let vr;
const Di = () => vr || (vr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ot(t) {
  if (Y(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], s = _e(i) ? Bl(i) : Ot(i);
      if (s)
        for (const r in s)
          e[r] = s[r];
    }
    return e;
  } else if (_e(t) || he(t))
    return t;
}
const $l = /;(?![^(]*\))/g, Fl = /:([^]+)/, zl = /\/\*[^]*?\*\//g;
function Bl(t) {
  const e = {};
  return t.replace(zl, "").split($l).forEach((n) => {
    if (n) {
      const i = n.split(Fl);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function Ze(t) {
  let e = "";
  if (_e(t))
    e = t;
  else if (Y(t))
    for (let n = 0; n < t.length; n++) {
      const i = Ze(t[n]);
      i && (e += i + " ");
    }
  else if (he(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Nl(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !_e(e) && (t.class = Ze(e)), n && (t.style = Ot(n)), t;
}
const jl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Hl = /* @__PURE__ */ zs(jl);
function Lo(t) {
  return !!t || t === "";
}
function Wl(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = js(t[i], e[i]);
  return n;
}
function js(t, e) {
  if (t === e) return !0;
  let n = pr(t), i = pr(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = st(t), i = st(e), n || i)
    return t === e;
  if (n = Y(t), i = Y(e), n || i)
    return n && i ? Wl(t, e) : !1;
  if (n = he(t), i = he(e), n || i) {
    if (!n || !i)
      return !1;
    const s = Object.keys(t).length, r = Object.keys(e).length;
    if (s !== r)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !js(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const Ro = (t) => !!(t && t.__v_isRef === !0), re = (t) => _e(t) ? t : t == null ? "" : Y(t) || he(t) && (t.toString === Oo || !ne(t.toString)) ? Ro(t) ? re(t.value) : JSON.stringify(t, $o, 2) : String(t), $o = (t, e) => Ro(e) ? $o(t, e.value) : an(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, s], r) => (n[Ui(i, r) + " =>"] = s, n),
    {}
  )
} : Mo(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Ui(n))
} : st(e) ? Ui(e) : he(e) && !Y(e) && !Pi(e) ? String(e) : e, Ui = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    st(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let Ie;
class Fo {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = Ie, !e && Ie && (this.index = (Ie.scopes || (Ie.scopes = [])).push(
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
      const n = Ie;
      try {
        return Ie = this, e();
      } finally {
        Ie = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ie, Ie = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Ie = this.prevScope, this.prevScope = void 0);
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
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function zo(t) {
  return new Fo(t);
}
function Bo() {
  return Ie;
}
function Vl(t, e = !1) {
  Ie && Ie.cleanups.push(t);
}
let ge;
const Ki = /* @__PURE__ */ new WeakSet();
class No {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ie && Ie.active && Ie.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Ki.has(this) && (Ki.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ho(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, mr(this), Wo(this);
    const e = ge, n = nt;
    ge = this, nt = !0;
    try {
      return this.fn();
    } finally {
      Vo(this), ge = e, nt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Vs(e);
      this.deps = this.depsTail = void 0, mr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Ki.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    bs(this) && this.run();
  }
  get dirty() {
    return bs(this);
  }
}
let jo = 0, Pn, Mn;
function Ho(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = Mn, Mn = t;
    return;
  }
  t.next = Pn, Pn = t;
}
function Hs() {
  jo++;
}
function Ws() {
  if (--jo > 0)
    return;
  if (Mn) {
    let e = Mn;
    for (Mn = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; Pn; ) {
    let e = Pn;
    for (Pn = void 0; e; ) {
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
function Wo(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Vo(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), Vs(i), ql(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  t.deps = e, t.depsTail = n;
}
function bs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (qo(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function qo(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Rn) || (t.globalVersion = Rn, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !bs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = ge, i = nt;
  ge = t, nt = !0;
  try {
    Wo(t);
    const s = t.fn(t._value);
    (e.version === 0 || Re(s, t._value)) && (t.flags |= 128, t._value = s, e.version++);
  } catch (s) {
    throw e.version++, s;
  } finally {
    ge = n, nt = i, Vo(t), t.flags &= -3;
  }
}
function Vs(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: s } = t;
  if (i && (i.nextSub = s, t.prevSub = void 0), s && (s.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Vs(r, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function ql(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let nt = !0;
const Uo = [];
function At() {
  Uo.push(nt), nt = !1;
}
function Pt() {
  const t = Uo.pop();
  nt = t === void 0 ? !0 : t;
}
function mr(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = ge;
    ge = void 0;
    try {
      e();
    } finally {
      ge = n;
    }
  }
}
let Rn = 0;
class Ul {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Li {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!ge || !nt || ge === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ge)
      n = this.activeLink = new Ul(ge, this), ge.deps ? (n.prevDep = ge.depsTail, ge.depsTail.nextDep = n, ge.depsTail = n) : ge.deps = ge.depsTail = n, Ko(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = ge.depsTail, n.nextDep = void 0, ge.depsTail.nextDep = n, ge.depsTail = n, ge.deps === n && (ge.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, Rn++, this.notify(e);
  }
  notify(e) {
    Hs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Ws();
    }
  }
}
function Ko(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        Ko(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const gi = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ Symbol(
  ""
), ys = /* @__PURE__ */ Symbol(
  ""
), $n = /* @__PURE__ */ Symbol(
  ""
);
function Oe(t, e, n) {
  if (nt && ge) {
    let i = gi.get(t);
    i || gi.set(t, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new Li()), s.map = i, s.key = n), s.track();
  }
}
function kt(t, e, n, i, s, r) {
  const o = gi.get(t);
  if (!o) {
    Rn++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (Hs(), e === "clear")
    o.forEach(a);
  else {
    const l = Y(t), u = l && Mi(n);
    if (l && n === "length") {
      const c = Number(i);
      o.forEach((d, h) => {
        (h === "length" || h === $n || !st(h) && h >= c) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), u && a(o.get($n)), e) {
        case "add":
          l ? u && a(o.get("length")) : (a(o.get(Zt)), an(t) && a(o.get(ys)));
          break;
        case "delete":
          l || (a(o.get(Zt)), an(t) && a(o.get(ys)));
          break;
        case "set":
          an(t) && a(o.get(Zt));
          break;
      }
  }
  Ws();
}
function Kl(t, e) {
  const n = gi.get(t);
  return n && n.get(e);
}
function tn(t) {
  const e = /* @__PURE__ */ ue(t);
  return e === t ? e : (Oe(e, "iterate", $n), /* @__PURE__ */ Ke(t) ? e : e.map(rt));
}
function Ri(t) {
  return Oe(t = /* @__PURE__ */ ue(t), "iterate", $n), t;
}
function Ft(t, e) {
  return /* @__PURE__ */ Mt(t) ? dn(/* @__PURE__ */ Qt(t) ? rt(e) : e) : rt(e);
}
const Gl = {
  __proto__: null,
  [Symbol.iterator]() {
    return Gi(this, Symbol.iterator, (t) => Ft(this, t));
  },
  concat(...t) {
    return tn(this).concat(
      ...t.map((e) => Y(e) ? tn(e) : e)
    );
  },
  entries() {
    return Gi(this, "entries", (t) => (t[1] = Ft(this, t[1]), t));
  },
  every(t, e) {
    return wt(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return wt(
      this,
      "filter",
      t,
      e,
      (n) => n.map((i) => Ft(this, i)),
      arguments
    );
  },
  find(t, e) {
    return wt(
      this,
      "find",
      t,
      e,
      (n) => Ft(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return wt(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return wt(
      this,
      "findLast",
      t,
      e,
      (n) => Ft(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return wt(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return wt(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Xi(this, "includes", t);
  },
  indexOf(...t) {
    return Xi(this, "indexOf", t);
  },
  join(t) {
    return tn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Xi(this, "lastIndexOf", t);
  },
  map(t, e) {
    return wt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return wn(this, "pop");
  },
  push(...t) {
    return wn(this, "push", t);
  },
  reduce(t, ...e) {
    return gr(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return gr(this, "reduceRight", t, e);
  },
  shift() {
    return wn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return wt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return wn(this, "splice", t);
  },
  toReversed() {
    return tn(this).toReversed();
  },
  toSorted(t) {
    return tn(this).toSorted(t);
  },
  toSpliced(...t) {
    return tn(this).toSpliced(...t);
  },
  unshift(...t) {
    return wn(this, "unshift", t);
  },
  values() {
    return Gi(this, "values", (t) => Ft(this, t));
  }
};
function Gi(t, e, n) {
  const i = Ri(t), s = i[e]();
  return i !== t && !/* @__PURE__ */ Ke(t) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
const Xl = Array.prototype;
function wt(t, e, n, i, s, r) {
  const o = Ri(t), a = o !== t && !/* @__PURE__ */ Ke(t), l = o[e];
  if (l !== Xl[e]) {
    const d = l.apply(t, r);
    return a ? rt(d) : d;
  }
  let u = n;
  o !== t && (a ? u = function(d, h) {
    return n.call(this, Ft(t, d), h, t);
  } : n.length > 2 && (u = function(d, h) {
    return n.call(this, d, h, t);
  }));
  const c = l.call(o, u, i);
  return a && s ? s(c) : c;
}
function gr(t, e, n, i) {
  const s = Ri(t);
  let r = n;
  return s !== t && (/* @__PURE__ */ Ke(t) ? n.length > 3 && (r = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : r = function(o, a, l) {
    return n.call(this, o, Ft(t, a), l, t);
  }), s[e](r, ...i);
}
function Xi(t, e, n) {
  const i = /* @__PURE__ */ ue(t);
  Oe(i, "iterate", $n);
  const s = i[e](...n);
  return (s === -1 || s === !1) && /* @__PURE__ */ $i(n[0]) ? (n[0] = /* @__PURE__ */ ue(n[0]), i[e](...n)) : s;
}
function wn(t, e, n = []) {
  At(), Hs();
  const i = (/* @__PURE__ */ ue(t))[e].apply(t, n);
  return Ws(), Pt(), i;
}
const Yl = /* @__PURE__ */ zs("__proto__,__v_isRef,__isVue"), Go = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(st)
);
function Jl(t) {
  st(t) || (t = String(t));
  const e = /* @__PURE__ */ ue(this);
  return Oe(e, "has", t), e.hasOwnProperty(t);
}
class Xo {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, i) {
    if (n === "__v_skip") return e.__v_skip;
    const s = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !s;
    if (n === "__v_isReadonly")
      return s;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return i === (s ? r ? ac : Qo : r ? Zo : Jo).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = Y(e);
    if (!s) {
      let l;
      if (o && (l = Gl[n]))
        return l;
      if (n === "hasOwnProperty")
        return Jl;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ce(e) ? e : i
    );
    if ((st(n) ? Go.has(n) : Yl(n)) || (s || Oe(e, "get", n), r))
      return a;
    if (/* @__PURE__ */ Ce(a)) {
      const l = o && Mi(n) ? a : a.value;
      return s && he(l) ? /* @__PURE__ */ ws(l) : l;
    }
    return he(a) ? s ? /* @__PURE__ */ ws(a) : /* @__PURE__ */ Un(a) : a;
  }
}
class Yo extends Xo {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, s) {
    let r = e[n];
    const o = Y(e) && Mi(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ Mt(r);
      if (!/* @__PURE__ */ Ke(i) && !/* @__PURE__ */ Mt(i) && (r = /* @__PURE__ */ ue(r), i = /* @__PURE__ */ ue(i)), !o && /* @__PURE__ */ Ce(r) && !/* @__PURE__ */ Ce(i))
        return u || (r.value = i), !0;
    }
    const a = o ? Number(n) < e.length : fe(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Ce(e) ? e : s
    );
    return e === /* @__PURE__ */ ue(s) && (a ? Re(i, r) && kt(e, "set", n, i) : kt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = fe(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && i && kt(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!st(n) || !Go.has(n)) && Oe(e, "has", n), i;
  }
  ownKeys(e) {
    return Oe(
      e,
      "iterate",
      Y(e) ? "length" : Zt
    ), Reflect.ownKeys(e);
  }
}
class Zl extends Xo {
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
const Ql = /* @__PURE__ */ new Yo(), ec = /* @__PURE__ */ new Zl(), tc = /* @__PURE__ */ new Yo(!0);
const _s = (t) => t, Qn = (t) => Reflect.getPrototypeOf(t);
function nc(t, e, n) {
  return function(...i) {
    const s = this.__v_raw, r = /* @__PURE__ */ ue(s), o = an(r), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, u = s[t](...i), c = n ? _s : e ? dn : rt;
    return !e && Oe(
      r,
      "iterate",
      l ? ys : Zt
    ), xe(
      // inheriting all iterator properties
      Object.create(u),
      {
        // iterator protocol
        next() {
          const { value: d, done: h } = u.next();
          return h ? { value: d, done: h } : {
            value: a ? [c(d[0]), c(d[1])] : c(d),
            done: h
          };
        }
      }
    );
  };
}
function ei(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function ic(t, e) {
  const n = {
    get(s) {
      const r = this.__v_raw, o = /* @__PURE__ */ ue(r), a = /* @__PURE__ */ ue(s);
      t || (Re(s, a) && Oe(o, "get", s), Oe(o, "get", a));
      const { has: l } = Qn(o), u = e ? _s : t ? dn : rt;
      if (l.call(o, s))
        return u(r.get(s));
      if (l.call(o, a))
        return u(r.get(a));
      r !== o && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !t && Oe(/* @__PURE__ */ ue(s), "iterate", Zt), s.size;
    },
    has(s) {
      const r = this.__v_raw, o = /* @__PURE__ */ ue(r), a = /* @__PURE__ */ ue(s);
      return t || (Re(s, a) && Oe(o, "has", s), Oe(o, "has", a)), s === a ? r.has(s) : r.has(s) || r.has(a);
    },
    forEach(s, r) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ ue(a), u = e ? _s : t ? dn : rt;
      return !t && Oe(l, "iterate", Zt), a.forEach((c, d) => s.call(r, u(c), u(d), o));
    }
  };
  return xe(
    n,
    t ? {
      add: ei("add"),
      set: ei("set"),
      delete: ei("delete"),
      clear: ei("clear")
    } : {
      add(s) {
        !e && !/* @__PURE__ */ Ke(s) && !/* @__PURE__ */ Mt(s) && (s = /* @__PURE__ */ ue(s));
        const r = /* @__PURE__ */ ue(this);
        return Qn(r).has.call(r, s) || (r.add(s), kt(r, "add", s, s)), this;
      },
      set(s, r) {
        !e && !/* @__PURE__ */ Ke(r) && !/* @__PURE__ */ Mt(r) && (r = /* @__PURE__ */ ue(r));
        const o = /* @__PURE__ */ ue(this), { has: a, get: l } = Qn(o);
        let u = a.call(o, s);
        u || (s = /* @__PURE__ */ ue(s), u = a.call(o, s));
        const c = l.call(o, s);
        return o.set(s, r), u ? Re(r, c) && kt(o, "set", s, r) : kt(o, "add", s, r), this;
      },
      delete(s) {
        const r = /* @__PURE__ */ ue(this), { has: o, get: a } = Qn(r);
        let l = o.call(r, s);
        l || (s = /* @__PURE__ */ ue(s), l = o.call(r, s)), a && a.call(r, s);
        const u = r.delete(s);
        return l && kt(r, "delete", s, void 0), u;
      },
      clear() {
        const s = /* @__PURE__ */ ue(this), r = s.size !== 0, o = s.clear();
        return r && kt(
          s,
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
  ].forEach((s) => {
    n[s] = nc(s, t, e);
  }), n;
}
function qs(t, e) {
  const n = ic(t, e);
  return (i, s, r) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? i : Reflect.get(
    fe(n, s) && s in i ? n : i,
    s,
    r
  );
}
const sc = {
  get: /* @__PURE__ */ qs(!1, !1)
}, rc = {
  get: /* @__PURE__ */ qs(!1, !0)
}, oc = {
  get: /* @__PURE__ */ qs(!0, !1)
};
const Jo = /* @__PURE__ */ new WeakMap(), Zo = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), ac = /* @__PURE__ */ new WeakMap();
function lc(t) {
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
function cc(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : lc(Ol(t));
}
// @__NO_SIDE_EFFECTS__
function Un(t) {
  return /* @__PURE__ */ Mt(t) ? t : Us(
    t,
    !1,
    Ql,
    sc,
    Jo
  );
}
// @__NO_SIDE_EFFECTS__
function Kn(t) {
  return Us(
    t,
    !1,
    tc,
    rc,
    Zo
  );
}
// @__NO_SIDE_EFFECTS__
function ws(t) {
  return Us(
    t,
    !0,
    ec,
    oc,
    Qo
  );
}
function Us(t, e, n, i, s) {
  if (!he(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const r = cc(t);
  if (r === 0)
    return t;
  const o = s.get(t);
  if (o)
    return o;
  const a = new Proxy(
    t,
    r === 2 ? i : n
  );
  return s.set(t, a), a;
}
// @__NO_SIDE_EFFECTS__
function Qt(t) {
  return /* @__PURE__ */ Mt(t) ? /* @__PURE__ */ Qt(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Mt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ke(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function $i(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ue(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ ue(e) : t;
}
function ea(t) {
  return !fe(t, "__v_skip") && Object.isExtensible(t) && Do(t, "__v_skip", !0), t;
}
const rt = (t) => he(t) ? /* @__PURE__ */ Un(t) : t, dn = (t) => he(t) ? /* @__PURE__ */ ws(t) : t;
// @__NO_SIDE_EFFECTS__
function Ce(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function q(t) {
  return ta(t, !1);
}
// @__NO_SIDE_EFFECTS__
function fn(t) {
  return ta(t, !0);
}
function ta(t, e) {
  return /* @__PURE__ */ Ce(t) ? t : new uc(t, e);
}
class uc {
  constructor(e, n) {
    this.dep = new Li(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ue(e), this._value = n ? e : rt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ Ke(e) || /* @__PURE__ */ Mt(e);
    e = i ? e : /* @__PURE__ */ ue(e), Re(e, n) && (this._rawValue = e, this._value = i ? e : rt(e), this.dep.trigger());
  }
}
function m(t) {
  return /* @__PURE__ */ Ce(t) ? t.value : t;
}
function it(t) {
  return ne(t) ? t() : m(t);
}
const dc = {
  get: (t, e, n) => e === "__v_raw" ? t : m(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const s = t[e];
    return /* @__PURE__ */ Ce(s) && !/* @__PURE__ */ Ce(n) ? (s.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function na(t) {
  return /* @__PURE__ */ Qt(t) ? t : new Proxy(t, dc);
}
class fc {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Li(), { get: i, set: s } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = s;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function hc(t) {
  return new fc(t);
}
// @__NO_SIDE_EFFECTS__
function ia(t) {
  const e = Y(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = sa(t, n);
  return e;
}
class pc {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ue(e);
    let s = !0, r = e;
    if (!Y(e) || !Mi(String(n)))
      do
        s = !/* @__PURE__ */ $i(r) || /* @__PURE__ */ Ke(r);
      while (s && (r = r.__v_raw));
    this._shallow = s;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = m(e)), this._value = e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    if (this._shallow && /* @__PURE__ */ Ce(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ Ce(n)) {
        n.value = e;
        return;
      }
    }
    this._object[this._key] = e;
  }
  get dep() {
    return Kl(this._raw, this._key);
  }
}
class vc {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Yi(t, e, n) {
  return /* @__PURE__ */ Ce(t) ? t : ne(t) ? new vc(t) : he(t) && arguments.length > 1 ? sa(t, e, n) : /* @__PURE__ */ q(t);
}
function sa(t, e, n) {
  return new pc(t, e, n);
}
class mc {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new Li(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Rn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ge !== this)
      return Ho(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return qo(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function gc(t, e, n = !1) {
  let i, s;
  return ne(t) ? i = t : (i = t.get, s = t.set), new mc(i, s, n);
}
const ti = {}, bi = /* @__PURE__ */ new WeakMap();
let Gt;
function bc(t, e = !1, n = Gt) {
  if (n) {
    let i = bi.get(n);
    i || bi.set(n, i = []), i.push(t);
  }
}
function yc(t, e, n = de) {
  const { immediate: i, deep: s, once: r, scheduler: o, augmentJob: a, call: l } = n, u = (y) => s ? y : /* @__PURE__ */ Ke(y) || s === !1 || s === 0 ? Tt(y, 1) : Tt(y);
  let c, d, h, f, p = !1, g = !1;
  if (/* @__PURE__ */ Ce(t) ? (d = () => t.value, p = /* @__PURE__ */ Ke(t)) : /* @__PURE__ */ Qt(t) ? (d = () => u(t), p = !0) : Y(t) ? (g = !0, p = t.some((y) => /* @__PURE__ */ Qt(y) || /* @__PURE__ */ Ke(y)), d = () => t.map((y) => {
    if (/* @__PURE__ */ Ce(y))
      return y.value;
    if (/* @__PURE__ */ Qt(y))
      return u(y);
    if (ne(y))
      return l ? l(y, 2) : y();
  })) : ne(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (h) {
      At();
      try {
        h();
      } finally {
        Pt();
      }
    }
    const y = Gt;
    Gt = c;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      Gt = y;
    }
  } : d = mt, e && s) {
    const y = d, E = s === !0 ? 1 / 0 : s;
    d = () => Tt(y(), E);
  }
  const _ = Bo(), x = () => {
    c.stop(), _ && _.active && Ns(_.effects, c);
  };
  if (r && e) {
    const y = e;
    e = (...E) => {
      y(...E), x();
    };
  }
  let w = g ? new Array(t.length).fill(ti) : ti;
  const S = (y) => {
    if (!(!(c.flags & 1) || !c.dirty && !y))
      if (e) {
        const E = c.run();
        if (s || p || (g ? E.some((T, k) => Re(T, w[k])) : Re(E, w))) {
          h && h();
          const T = Gt;
          Gt = c;
          try {
            const k = [
              E,
              // pass undefined as the old value when it's changed for the first time
              w === ti ? void 0 : g && w[0] === ti ? [] : w,
              f
            ];
            w = E, l ? l(e, 3, k) : (
              // @ts-expect-error
              e(...k)
            );
          } finally {
            Gt = T;
          }
        }
      } else
        c.run();
  };
  return a && a(S), c = new No(d), c.scheduler = o ? () => o(S, !1) : S, f = (y) => bc(y, !1, c), h = c.onStop = () => {
    const y = bi.get(c);
    if (y) {
      if (l)
        l(y, 4);
      else
        for (const E of y) E();
      bi.delete(c);
    }
  }, e ? i ? S(!0) : w = c.run() : o ? o(S.bind(null, !0), !0) : c.run(), x.pause = c.pause.bind(c), x.resume = c.resume.bind(c), x.stop = x, x;
}
function Tt(t, e = 1 / 0, n) {
  if (e <= 0 || !he(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Ce(t))
    Tt(t.value, e, n);
  else if (Y(t))
    for (let i = 0; i < t.length; i++)
      Tt(t[i], e, n);
  else if (Mo(t) || an(t))
    t.forEach((i) => {
      Tt(i, e, n);
    });
  else if (Pi(t)) {
    for (const i in t)
      Tt(t[i], e, n);
    for (const i of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, i) && Tt(t[i], e, n);
  }
  return t;
}
function Gn(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (s) {
    Fi(s, e, n);
  }
}
function ot(t, e, n, i) {
  if (ne(t)) {
    const s = Gn(t, e, n, i);
    return s && Io(s) && s.catch((r) => {
      Fi(r, e, n);
    }), s;
  }
  if (Y(t)) {
    const s = [];
    for (let r = 0; r < t.length; r++)
      s.push(ot(t[r], e, n, i));
    return s;
  }
}
function Fi(t, e, n, i = !0) {
  const s = e ? e.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: o } = e && e.appContext.config || de;
  if (e) {
    let a = e.parent;
    const l = e.proxy, u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](t, l, u) === !1)
            return;
      }
      a = a.parent;
    }
    if (r) {
      At(), Gn(r, null, 10, [
        t,
        l,
        u
      ]), Pt();
      return;
    }
  }
  _c(t, n, s, i, o);
}
function _c(t, e, n, i = !0, s = !1) {
  if (s)
    throw t;
  console.error(t);
}
const $e = [];
let ht = -1;
const ln = [];
let zt = null, rn = 0;
const ra = /* @__PURE__ */ Promise.resolve();
let yi = null;
function at(t) {
  const e = yi || ra;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function wc(t) {
  let e = ht + 1, n = $e.length;
  for (; e < n; ) {
    const i = e + n >>> 1, s = $e[i], r = Fn(s);
    r < t || r === t && s.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Ks(t) {
  if (!(t.flags & 1)) {
    const e = Fn(t), n = $e[$e.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= Fn(n) ? $e.push(t) : $e.splice(wc(e), 0, t), t.flags |= 1, oa();
  }
}
function oa() {
  yi || (yi = ra.then(la));
}
function xc(t) {
  Y(t) ? ln.push(...t) : zt && t.id === -1 ? zt.splice(rn + 1, 0, t) : t.flags & 1 || (ln.push(t), t.flags |= 1), oa();
}
function br(t, e, n = ht + 1) {
  for (; n < $e.length; n++) {
    const i = $e[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      $e.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function aa(t) {
  if (ln.length) {
    const e = [...new Set(ln)].sort(
      (n, i) => Fn(n) - Fn(i)
    );
    if (ln.length = 0, zt) {
      zt.push(...e);
      return;
    }
    for (zt = e, rn = 0; rn < zt.length; rn++) {
      const n = zt[rn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    zt = null, rn = 0;
  }
}
const Fn = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function la(t) {
  try {
    for (ht = 0; ht < $e.length; ht++) {
      const e = $e[ht];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Gn(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; ht < $e.length; ht++) {
      const e = $e[ht];
      e && (e.flags &= -2);
    }
    ht = -1, $e.length = 0, aa(), yi = null, ($e.length || ln.length) && la();
  }
}
let Ee = null, ca = null;
function _i(t) {
  const e = Ee;
  return Ee = t, ca = t && t.type.__scopeId || null, e;
}
function se(t, e = Ee, n) {
  if (!e || t._n)
    return t;
  const i = (...s) => {
    i._d && Si(-1);
    const r = _i(e);
    let o;
    try {
      o = t(...s);
    } finally {
      _i(r), i._d && Si(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function Sc(t, e) {
  if (Ee === null)
    return t;
  const n = Wi(Ee), i = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [r, o, a, l = de] = e[s];
    r && (ne(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && Tt(o), i.push({
      dir: r,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: a,
      modifiers: l
    }));
  }
  return t;
}
function Vt(t, e, n, i) {
  const s = t.dirs, r = e && e.dirs;
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    r && (a.oldValue = r[o].value);
    let l = a.dir[i];
    l && (At(), ot(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Pt());
  }
}
function pn(t, e) {
  if (De) {
    let n = De.provides;
    const i = De.parent && De.parent.provides;
    i === n && (n = De.provides = Object.create(i)), n[t] = e;
  }
}
function Et(t, e, n = !1) {
  const i = Qe();
  if (i || un) {
    let s = un ? un._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (s && t in s)
      return s[t];
    if (arguments.length > 1)
      return n && ne(e) ? e.call(i && i.proxy) : e;
  }
}
const Cc = /* @__PURE__ */ Symbol.for("v-scx"), kc = () => Et(Cc);
function Nt(t, e) {
  return zi(t, null, e);
}
function Tc(t, e) {
  return zi(
    t,
    null,
    { flush: "sync" }
  );
}
function ve(t, e, n) {
  return zi(t, e, n);
}
function zi(t, e, n = de) {
  const { immediate: i, deep: s, flush: r, once: o } = n, a = xe({}, n), l = e && i || !e && r !== "post";
  let u;
  if (jn) {
    if (r === "sync") {
      const f = kc();
      u = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = mt, f.resume = mt, f.pause = mt, f;
    }
  }
  const c = De;
  a.call = (f, p, g) => ot(f, c, p, g);
  let d = !1;
  r === "post" ? a.scheduler = (f) => {
    Me(f, c && c.suspense);
  } : r !== "sync" && (d = !0, a.scheduler = (f, p) => {
    p ? f() : Ks(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, c && (f.id = c.uid, f.i = c));
  };
  const h = yc(t, e, a);
  return jn && (u ? u.push(h) : l && h()), h;
}
function Ec(t, e, n) {
  const i = this.proxy, s = _e(t) ? t.includes(".") ? ua(i, t) : () => i[t] : t.bind(i, i);
  let r;
  ne(e) ? r = e : (r = e.handler, n = e);
  const o = Xn(this), a = zi(s, r.bind(i), n);
  return o(), a;
}
function ua(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let s = 0; s < n.length && i; s++)
      i = i[n[s]];
    return i;
  };
}
const da = /* @__PURE__ */ Symbol("_vte"), fa = (t) => t.__isTeleport, In = (t) => t && (t.disabled || t.disabled === ""), yr = (t) => t && (t.defer || t.defer === ""), _r = (t) => typeof SVGElement < "u" && t instanceof SVGElement, wr = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, xs = (t, e) => {
  const n = t && t.to;
  return _e(n) ? e ? e(n) : null : n;
}, ha = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, s, r, o, a, l, u) {
    const {
      mc: c,
      pc: d,
      pbc: h,
      o: { insert: f, querySelector: p, createText: g, createComment: _ }
    } = u, x = In(e.props);
    let { shapeFlag: w, children: S, dynamicChildren: y } = e;
    if (t == null) {
      const E = e.el = g(""), T = e.anchor = g("");
      f(E, n, i), f(T, n, i);
      const k = (A, I) => {
        w & 16 && c(
          S,
          A,
          I,
          s,
          r,
          o,
          a,
          l
        );
      }, H = () => {
        const A = e.target = xs(e.props, p), I = Ss(A, e, g, f);
        A && (o !== "svg" && _r(A) ? o = "svg" : o !== "mathml" && wr(A) && (o = "mathml"), s && s.isCE && (s.ce._teleportTargets || (s.ce._teleportTargets = /* @__PURE__ */ new Set())).add(A), x || (k(A, I), li(e, !1)));
      };
      x && (k(n, T), li(e, !0)), yr(e.props) ? (e.el.__isMounted = !1, Me(() => {
        H(), delete e.el.__isMounted;
      }, r)) : H();
    } else {
      if (yr(e.props) && t.el.__isMounted === !1) {
        Me(() => {
          ha.process(
            t,
            e,
            n,
            i,
            s,
            r,
            o,
            a,
            l,
            u
          );
        }, r);
        return;
      }
      e.el = t.el, e.targetStart = t.targetStart;
      const E = e.anchor = t.anchor, T = e.target = t.target, k = e.targetAnchor = t.targetAnchor, H = In(t.props), A = H ? n : T, I = H ? E : k;
      if (o === "svg" || _r(T) ? o = "svg" : (o === "mathml" || wr(T)) && (o = "mathml"), y ? (h(
        t.dynamicChildren,
        y,
        A,
        s,
        r,
        o,
        a
      ), Js(t, e, !0)) : l || d(
        t,
        e,
        A,
        I,
        s,
        r,
        o,
        a,
        !1
      ), x)
        H ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : ni(
          e,
          n,
          E,
          u,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const $ = e.target = xs(
          e.props,
          p
        );
        $ && ni(
          e,
          $,
          null,
          u,
          0
        );
      } else H && ni(
        e,
        T,
        k,
        u,
        1
      );
      li(e, x);
    }
  },
  remove(t, e, n, { um: i, o: { remove: s } }, r) {
    const {
      shapeFlag: o,
      children: a,
      anchor: l,
      targetStart: u,
      targetAnchor: c,
      target: d,
      props: h
    } = t;
    if (d && (s(u), s(c)), r && s(l), o & 16) {
      const f = r || !In(h);
      for (let p = 0; p < a.length; p++) {
        const g = a[p];
        i(
          g,
          e,
          n,
          f,
          !!g.dynamicChildren
        );
      }
    }
  },
  move: ni,
  hydrate: Ac
};
function ni(t, e, n, { o: { insert: i }, m: s }, r = 2) {
  r === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: u, props: c } = t, d = r === 2;
  if (d && i(o, e, n), (!d || In(c)) && l & 16)
    for (let h = 0; h < u.length; h++)
      s(
        u[h],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function Ac(t, e, n, i, s, r, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: u, createText: c }
}, d) {
  function h(_, x) {
    let w = x;
    for (; w; ) {
      if (w && w.nodeType === 8) {
        if (w.data === "teleport start anchor")
          e.targetStart = w;
        else if (w.data === "teleport anchor") {
          e.targetAnchor = w, _._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      w = o(w);
    }
  }
  function f(_, x) {
    x.anchor = d(
      o(_),
      x,
      a(_),
      n,
      i,
      s,
      r
    );
  }
  const p = e.target = xs(
    e.props,
    l
  ), g = In(e.props);
  if (p) {
    const _ = p._lpa || p.firstChild;
    e.shapeFlag & 16 && (g ? (f(t, e), h(p, _), e.targetAnchor || Ss(
      p,
      e,
      c,
      u,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === p ? t : null
    )) : (e.anchor = o(t), h(p, _), e.targetAnchor || Ss(p, e, c, u), d(
      _ && o(_),
      e,
      p,
      n,
      i,
      s,
      r
    ))), li(e, g);
  } else g && e.shapeFlag & 16 && (f(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Pc = ha;
function li(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, s;
    for (e ? (i = t.el, s = t.anchor) : (i = t.targetStart, s = t.targetAnchor); i && i !== s; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function Ss(t, e, n, i, s = null) {
  const r = e.targetStart = n(""), o = e.targetAnchor = n("");
  return r[da] = o, t && (i(r, t, s), i(o, t, s)), o;
}
const pt = /* @__PURE__ */ Symbol("_leaveCb"), xn = /* @__PURE__ */ Symbol("_enterCb");
function Mc() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return qe(() => {
    t.isMounted = !0;
  }), yt(() => {
    t.isUnmounting = !0;
  }), t;
}
const Xe = [Function, Array], pa = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Xe,
  onEnter: Xe,
  onAfterEnter: Xe,
  onEnterCancelled: Xe,
  // leave
  onBeforeLeave: Xe,
  onLeave: Xe,
  onAfterLeave: Xe,
  onLeaveCancelled: Xe,
  // appear
  onBeforeAppear: Xe,
  onAppear: Xe,
  onAfterAppear: Xe,
  onAppearCancelled: Xe
}, va = (t) => {
  const e = t.subTree;
  return e.component ? va(e.component) : e;
}, Ic = {
  name: "BaseTransition",
  props: pa,
  setup(t, { slots: e }) {
    const n = Qe(), i = Mc();
    return () => {
      const s = e.default && ba(e.default(), !0);
      if (!s || !s.length)
        return;
      const r = ma(s), o = /* @__PURE__ */ ue(t), { mode: a } = o;
      if (i.isLeaving)
        return Ji(r);
      const l = xr(r);
      if (!l)
        return Ji(r);
      let u = Cs(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => u = d
      );
      l.type !== Te && zn(l, u);
      let c = n.subTree && xr(n.subTree);
      if (c && c.type !== Te && !Yt(c, l) && va(n).type !== Te) {
        let d = Cs(
          c,
          o,
          i,
          n
        );
        if (zn(c, d), a === "out-in" && l.type !== Te)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, Ji(r);
        a === "in-out" && l.type !== Te ? d.delayLeave = (h, f, p) => {
          const g = ga(
            i,
            c
          );
          g[String(c.key)] = c, h[pt] = () => {
            f(), h[pt] = void 0, delete u.delayedLeave, c = void 0;
          }, u.delayedLeave = () => {
            p(), delete u.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return r;
    };
  }
};
function ma(t) {
  let e = t[0];
  if (t.length > 1) {
    for (const n of t)
      if (n.type !== Te) {
        e = n;
        break;
      }
  }
  return e;
}
const Oc = Ic;
function ga(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function Cs(t, e, n, i, s) {
  const {
    appear: r,
    mode: o,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: u,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: h,
    onLeave: f,
    onAfterLeave: p,
    onLeaveCancelled: g,
    onBeforeAppear: _,
    onAppear: x,
    onAfterAppear: w,
    onAppearCancelled: S
  } = e, y = String(t.key), E = ga(n, t), T = (A, I) => {
    A && ot(
      A,
      i,
      9,
      I
    );
  }, k = (A, I) => {
    const $ = I[1];
    T(A, I), Y(A) ? A.every((M) => M.length <= 1) && $() : A.length <= 1 && $();
  }, H = {
    mode: o,
    persisted: a,
    beforeEnter(A) {
      let I = l;
      if (!n.isMounted)
        if (r)
          I = _ || l;
        else
          return;
      A[pt] && A[pt](
        !0
        /* cancelled */
      );
      const $ = E[y];
      $ && Yt(t, $) && $.el[pt] && $.el[pt](), T(I, [A]);
    },
    enter(A) {
      let I = u, $ = c, M = d;
      if (!n.isMounted)
        if (r)
          I = x || u, $ = w || c, M = S || d;
        else
          return;
      let V = !1;
      A[xn] = (G) => {
        V || (V = !0, G ? T(M, [A]) : T($, [A]), H.delayedLeave && H.delayedLeave(), A[xn] = void 0);
      };
      const z = A[xn].bind(null, !1);
      I ? k(I, [A, z]) : z();
    },
    leave(A, I) {
      const $ = String(t.key);
      if (A[xn] && A[xn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return I();
      T(h, [A]);
      let M = !1;
      A[pt] = (z) => {
        M || (M = !0, I(), z ? T(g, [A]) : T(p, [A]), A[pt] = void 0, E[$] === t && delete E[$]);
      };
      const V = A[pt].bind(null, !1);
      E[$] = t, f ? k(f, [A, V]) : V();
    },
    clone(A) {
      const I = Cs(
        A,
        e,
        n,
        i,
        s
      );
      return s && s(I), I;
    }
  };
  return H;
}
function Ji(t) {
  if (Bi(t))
    return t = It(t), t.children = null, t;
}
function xr(t) {
  if (!Bi(t))
    return fa(t.type) && t.children ? ma(t.children) : t;
  if (t.component)
    return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (e & 16)
      return n[0];
    if (e & 32 && ne(n.default))
      return n.default();
  }
}
function zn(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, zn(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function ba(t, e = !1, n) {
  let i = [], s = 0;
  for (let r = 0; r < t.length; r++) {
    let o = t[r];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : r);
    o.type === be ? (o.patchFlag & 128 && s++, i = i.concat(
      ba(o.children, e, a)
    )) : (e || o.type !== Te) && i.push(a != null ? It(o, { key: a }) : o);
  }
  if (s > 1)
    for (let r = 0; r < i.length; r++)
      i[r].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function ee(t, e) {
  return ne(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    xe({ name: t.name }, e, { setup: t })
  ) : t;
}
function Gs() {
  const t = Qe();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function ya(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function Bn(t) {
  const e = Qe(), n = /* @__PURE__ */ fn(null);
  if (e) {
    const s = e.refs === de ? e.refs = {} : e.refs;
    Object.defineProperty(s, t, {
      enumerable: !0,
      get: () => n.value,
      set: (r) => n.value = r
    });
  }
  return n;
}
function Sr(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const wi = /* @__PURE__ */ new WeakMap();
function On(t, e, n, i, s = !1) {
  if (Y(t)) {
    t.forEach(
      (g, _) => On(
        g,
        e && (Y(e) ? e[_] : e),
        n,
        i,
        s
      )
    );
    return;
  }
  if (cn(i) && !s) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && On(t, e, n, i.component.subTree);
    return;
  }
  const r = i.shapeFlag & 4 ? Wi(i.component) : i.el, o = s ? null : r, { i: a, r: l } = t, u = e && e.r, c = a.refs === de ? a.refs = {} : a.refs, d = a.setupState, h = /* @__PURE__ */ ue(d), f = d === de ? Po : (g) => Sr(c, g) ? !1 : fe(h, g), p = (g, _) => !(_ && Sr(c, _));
  if (u != null && u !== l) {
    if (Cr(e), _e(u))
      c[u] = null, f(u) && (d[u] = null);
    else if (/* @__PURE__ */ Ce(u)) {
      const g = e;
      p(u, g.k) && (u.value = null), g.k && (c[g.k] = null);
    }
  }
  if (ne(l))
    Gn(l, a, 12, [o, c]);
  else {
    const g = _e(l), _ = /* @__PURE__ */ Ce(l);
    if (g || _) {
      const x = () => {
        if (t.f) {
          const w = g ? f(l) ? d[l] : c[l] : p() || !t.k ? l.value : c[t.k];
          if (s)
            Y(w) && Ns(w, r);
          else if (Y(w))
            w.includes(r) || w.push(r);
          else if (g)
            c[l] = [r], f(l) && (d[l] = c[l]);
          else {
            const S = [r];
            p(l, t.k) && (l.value = S), t.k && (c[t.k] = S);
          }
        } else g ? (c[l] = o, f(l) && (d[l] = o)) : _ && (p(l, t.k) && (l.value = o), t.k && (c[t.k] = o));
      };
      if (o) {
        const w = () => {
          x(), wi.delete(t);
        };
        w.id = -1, wi.set(t, w), Me(w, n);
      } else
        Cr(t), x();
    }
  }
}
function Cr(t) {
  const e = wi.get(t);
  e && (e.flags |= 8, wi.delete(t));
}
Di().requestIdleCallback;
Di().cancelIdleCallback;
const cn = (t) => !!t.type.__asyncLoader, Bi = (t) => t.type.__isKeepAlive;
function Dc(t, e) {
  _a(t, "a", e);
}
function Lc(t, e) {
  _a(t, "da", e);
}
function _a(t, e, n = De) {
  const i = t.__wdc || (t.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return t();
  });
  if (Ni(e, i, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      Bi(s.parent.vnode) && Rc(i, e, n, s), s = s.parent;
  }
}
function Rc(t, e, n, i) {
  const s = Ni(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  en(() => {
    Ns(i[e], s);
  }, n);
}
function Ni(t, e, n = De, i = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), r = e.__weh || (e.__weh = (...o) => {
      At();
      const a = Xn(n), l = ot(e, n, t, o);
      return a(), Pt(), l;
    });
    return i ? s.unshift(r) : s.push(r), r;
  }
}
const Dt = (t) => (e, n = De) => {
  (!jn || t === "sp") && Ni(t, (...i) => e(...i), n);
}, $c = Dt("bm"), qe = Dt("m"), Fc = Dt(
  "bu"
), zc = Dt("u"), yt = Dt(
  "bum"
), en = Dt("um"), Bc = Dt(
  "sp"
), Nc = Dt("rtg"), jc = Dt("rtc");
function Hc(t, e = De) {
  Ni("ec", t, e);
}
const Wc = "components", wa = /* @__PURE__ */ Symbol.for("v-ndc");
function xa(t) {
  return _e(t) ? Vc(Wc, t, !1) || t : t || wa;
}
function Vc(t, e, n = !0, i = !1) {
  const s = Ee || De;
  if (s) {
    const r = s.type;
    {
      const a = Au(
        r,
        !1
      );
      if (a && (a === e || a === Ae(e) || a === Oi(Ae(e))))
        return r;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      kr(s[t] || r[t], e) || // global registration
      kr(s.appContext[t], e)
    );
    return !o && i ? r : o;
  }
}
function kr(t, e) {
  return t && (t[e] || t[Ae(e)] || t[Oi(Ae(e))]);
}
function vn(t, e, n, i) {
  let s;
  const r = n && n[i], o = Y(t);
  if (o || _e(t)) {
    const a = o && /* @__PURE__ */ Qt(t);
    let l = !1, u = !1;
    a && (l = !/* @__PURE__ */ Ke(t), u = /* @__PURE__ */ Mt(t), t = Ri(t)), s = new Array(t.length);
    for (let c = 0, d = t.length; c < d; c++)
      s[c] = e(
        l ? u ? dn(rt(t[c])) : rt(t[c]) : t[c],
        c,
        void 0,
        r && r[c]
      );
  } else if (typeof t == "number") {
    s = new Array(t);
    for (let a = 0; a < t; a++)
      s[a] = e(a + 1, a, void 0, r && r[a]);
  } else if (he(t))
    if (t[Symbol.iterator])
      s = Array.from(
        t,
        (a, l) => e(a, l, void 0, r && r[l])
      );
    else {
      const a = Object.keys(t);
      s = new Array(a.length);
      for (let l = 0, u = a.length; l < u; l++) {
        const c = a[l];
        s[l] = e(t[c], c, l, r && r[l]);
      }
    }
  else
    s = [];
  return n && (n[i] = s), s;
}
function ye(t, e, n = {}, i, s) {
  if (Ee.ce || Ee.parent && cn(Ee.parent) && Ee.parent.ce) {
    const u = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), P(), K(
      be,
      null,
      [U("slot", n, i && i())],
      u ? -2 : 64
    );
  }
  let r = t[e];
  r && r._c && (r._d = !1), P();
  const o = r && Sa(r(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = K(
    be,
    {
      key: (a && !st(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && i ? "_fb" : "")
    },
    o || (i ? i() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !s && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), r && r._c && (r._d = !0), l;
}
function Sa(t) {
  return t.some((e) => Nn(e) ? !(e.type === Te || e.type === be && !Sa(e.children)) : !0) ? t : null;
}
const ks = (t) => t ? Va(t) ? Wi(t) : ks(t.parent) : null, Dn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ xe(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => ks(t.parent),
    $root: (t) => ks(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => ka(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Ks(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = at.bind(t.proxy)),
    $watch: (t) => Ec.bind(t)
  })
), Zi = (t, e) => t !== de && !t.__isScriptSetup && fe(t, e), qc = {
  get({ _: t }, e) {
    if (e === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: s, props: r, accessCache: o, type: a, appContext: l } = t;
    if (e[0] !== "$") {
      const h = o[e];
      if (h !== void 0)
        switch (h) {
          case 1:
            return i[e];
          case 2:
            return s[e];
          case 4:
            return n[e];
          case 3:
            return r[e];
        }
      else {
        if (Zi(i, e))
          return o[e] = 1, i[e];
        if (s !== de && fe(s, e))
          return o[e] = 2, s[e];
        if (fe(r, e))
          return o[e] = 3, r[e];
        if (n !== de && fe(n, e))
          return o[e] = 4, n[e];
        Ts && (o[e] = 0);
      }
    }
    const u = Dn[e];
    let c, d;
    if (u)
      return e === "$attrs" && Oe(t.attrs, "get", ""), u(t);
    if (
      // css module (injected by vue-loader)
      (c = a.__cssModules) && (c = c[e])
    )
      return c;
    if (n !== de && fe(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, fe(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: s, ctx: r } = t;
    return Zi(s, e) ? (s[e] = n, !0) : i !== de && fe(i, e) ? (i[e] = n, !0) : fe(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (r[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: s, props: r, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== de && a[0] !== "$" && fe(t, a) || Zi(e, a) || fe(r, a) || fe(i, a) || fe(Dn, a) || fe(s.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : fe(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Uc() {
  return Kc().slots;
}
function Kc(t) {
  const e = Qe();
  return e.setupContext || (e.setupContext = Ua(e));
}
function Tr(t) {
  return Y(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Ts = !0;
function Gc(t) {
  const e = ka(t), n = t.proxy, i = t.ctx;
  Ts = !1, e.beforeCreate && Er(e.beforeCreate, t, "bc");
  const {
    // state
    data: s,
    computed: r,
    methods: o,
    watch: a,
    provide: l,
    inject: u,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: h,
    beforeUpdate: f,
    updated: p,
    activated: g,
    deactivated: _,
    beforeDestroy: x,
    beforeUnmount: w,
    destroyed: S,
    unmounted: y,
    render: E,
    renderTracked: T,
    renderTriggered: k,
    errorCaptured: H,
    serverPrefetch: A,
    // public API
    expose: I,
    inheritAttrs: $,
    // assets
    components: M,
    directives: V,
    filters: z
  } = e;
  if (u && Xc(u, i, null), o)
    for (const te in o) {
      const le = o[te];
      ne(le) && (i[te] = le.bind(n));
    }
  if (s) {
    const te = s.call(n, n);
    he(te) && (t.data = /* @__PURE__ */ Un(te));
  }
  if (Ts = !0, r)
    for (const te in r) {
      const le = r[te], ke = ne(le) ? le.bind(n, n) : ne(le.get) ? le.get.bind(n, n) : mt, lt = !ne(le) && ne(le.set) ? le.set.bind(n) : mt, _t = B({
        get: ke,
        set: lt
      });
      Object.defineProperty(i, te, {
        enumerable: !0,
        configurable: !0,
        get: () => _t.value,
        set: (Ne) => _t.value = Ne
      });
    }
  if (a)
    for (const te in a)
      Ca(a[te], i, n, te);
  if (l) {
    const te = ne(l) ? l.call(n) : l;
    Reflect.ownKeys(te).forEach((le) => {
      pn(le, te[le]);
    });
  }
  c && Er(c, t, "c");
  function ae(te, le) {
    Y(le) ? le.forEach((ke) => te(ke.bind(n))) : le && te(le.bind(n));
  }
  if (ae($c, d), ae(qe, h), ae(Fc, f), ae(zc, p), ae(Dc, g), ae(Lc, _), ae(Hc, H), ae(jc, T), ae(Nc, k), ae(yt, w), ae(en, y), ae(Bc, A), Y(I))
    if (I.length) {
      const te = t.exposed || (t.exposed = {});
      I.forEach((le) => {
        Object.defineProperty(te, le, {
          get: () => n[le],
          set: (ke) => n[le] = ke,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  E && t.render === mt && (t.render = E), $ != null && (t.inheritAttrs = $), M && (t.components = M), V && (t.directives = V), A && ya(t);
}
function Xc(t, e, n = mt) {
  Y(t) && (t = Es(t));
  for (const i in t) {
    const s = t[i];
    let r;
    he(s) ? "default" in s ? r = Et(
      s.from || i,
      s.default,
      !0
    ) : r = Et(s.from || i) : r = Et(s), /* @__PURE__ */ Ce(r) ? Object.defineProperty(e, i, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (o) => r.value = o
    }) : e[i] = r;
  }
}
function Er(t, e, n) {
  ot(
    Y(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Ca(t, e, n, i) {
  let s = i.includes(".") ? ua(n, i) : () => n[i];
  if (_e(t)) {
    const r = e[t];
    ne(r) && ve(s, r);
  } else if (ne(t))
    ve(s, t.bind(n));
  else if (he(t))
    if (Y(t))
      t.forEach((r) => Ca(r, e, n, i));
    else {
      const r = ne(t.handler) ? t.handler.bind(n) : e[t.handler];
      ne(r) && ve(s, r, t);
    }
}
function ka(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: s,
    optionsCache: r,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = r.get(e);
  let l;
  return a ? l = a : !s.length && !n && !i ? l = e : (l = {}, s.length && s.forEach(
    (u) => xi(l, u, o, !0)
  ), xi(l, e, o)), he(e) && r.set(e, l), l;
}
function xi(t, e, n, i = !1) {
  const { mixins: s, extends: r } = e;
  r && xi(t, r, n, !0), s && s.forEach(
    (o) => xi(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = Yc[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Yc = {
  data: Ar,
  props: Pr,
  emits: Pr,
  // objects
  methods: Tn,
  computed: Tn,
  // lifecycle
  beforeCreate: Le,
  created: Le,
  beforeMount: Le,
  mounted: Le,
  beforeUpdate: Le,
  updated: Le,
  beforeDestroy: Le,
  beforeUnmount: Le,
  destroyed: Le,
  unmounted: Le,
  activated: Le,
  deactivated: Le,
  errorCaptured: Le,
  serverPrefetch: Le,
  // assets
  components: Tn,
  directives: Tn,
  // watch
  watch: Zc,
  // provide / inject
  provide: Ar,
  inject: Jc
};
function Ar(t, e) {
  return e ? t ? function() {
    return xe(
      ne(t) ? t.call(this, this) : t,
      ne(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Jc(t, e) {
  return Tn(Es(t), Es(e));
}
function Es(t) {
  if (Y(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function Le(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function Tn(t, e) {
  return t ? xe(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Pr(t, e) {
  return t ? Y(t) && Y(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : xe(
    /* @__PURE__ */ Object.create(null),
    Tr(t),
    Tr(e ?? {})
  ) : e;
}
function Zc(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = xe(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Le(t[i], e[i]);
  return n;
}
function Ta() {
  return {
    app: null,
    config: {
      isNativeTag: Po,
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
let Qc = 0;
function eu(t, e) {
  return function(i, s = null) {
    ne(i) || (i = xe({}, i)), s != null && !he(s) && (s = null);
    const r = Ta(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const u = r.app = {
      _uid: Qc++,
      _component: i,
      _props: s,
      _container: null,
      _context: r,
      _instance: null,
      version: Iu,
      get config() {
        return r.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && ne(c.install) ? (o.add(c), c.install(u, ...d)) : ne(c) && (o.add(c), c(u, ...d))), u;
      },
      mixin(c) {
        return r.mixins.includes(c) || r.mixins.push(c), u;
      },
      component(c, d) {
        return d ? (r.components[c] = d, u) : r.components[c];
      },
      directive(c, d) {
        return d ? (r.directives[c] = d, u) : r.directives[c];
      },
      mount(c, d, h) {
        if (!l) {
          const f = u._ceVNode || U(i, s);
          return f.appContext = r, h === !0 ? h = "svg" : h === !1 && (h = void 0), t(f, c, h), l = !0, u._container = c, c.__vue_app__ = u, Wi(f.component);
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l && (ot(
          a,
          u._instance,
          16
        ), t(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, d) {
        return r.provides[c] = d, u;
      },
      runWithContext(c) {
        const d = un;
        un = u;
        try {
          return c();
        } finally {
          un = d;
        }
      }
    };
    return u;
  };
}
let un = null;
function tu(t, e, n = de) {
  const i = Qe(), s = Ae(e), r = Ve(e), o = Ea(t, s), a = hc((l, u) => {
    let c, d = de, h;
    return Tc(() => {
      const f = t[s];
      Re(c, f) && (c = f, u());
    }), {
      get() {
        return l(), n.get ? n.get(c) : c;
      },
      set(f) {
        const p = n.set ? n.set(f) : f;
        if (!Re(p, c) && !(d !== de && Re(f, d)))
          return;
        const g = i.vnode.props;
        g && // check if parent has passed v-model
        (e in g || s in g || r in g) && (`onUpdate:${e}` in g || `onUpdate:${s}` in g || `onUpdate:${r}` in g) || (c = f, u()), i.emit(`update:${e}`, p), Re(f, p) && Re(f, d) && !Re(p, h) && u(), d = f, h = p;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? o || de : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const Ea = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${Ae(e)}Modifiers`] || t[`${Ve(e)}Modifiers`];
function nu(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || de;
  let s = n;
  const r = e.startsWith("update:"), o = r && Ea(i, e.slice(7));
  o && (o.trim && (s = n.map((c) => _e(c) ? c.trim() : c)), o.number && (s = n.map(Rl)));
  let a, l = i[a = ai(e)] || // also try camelCase event handler (#2249)
  i[a = ai(Ae(e))];
  !l && r && (l = i[a = ai(Ve(e))]), l && ot(
    l,
    t,
    6,
    s
  );
  const u = i[a + "Once"];
  if (u) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[a])
      return;
    t.emitted[a] = !0, ot(
      u,
      t,
      6,
      s
    );
  }
}
const iu = /* @__PURE__ */ new WeakMap();
function Aa(t, e, n = !1) {
  const i = n ? iu : e.emitsCache, s = i.get(t);
  if (s !== void 0)
    return s;
  const r = t.emits;
  let o = {}, a = !1;
  if (!ne(t)) {
    const l = (u) => {
      const c = Aa(u, e, !0);
      c && (a = !0, xe(o, c));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !r && !a ? (he(t) && i.set(t, null), null) : (Y(r) ? r.forEach((l) => o[l] = null) : xe(o, r), he(t) && i.set(t, o), o);
}
function ji(t, e) {
  return !t || !Ai(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), fe(t, e[0].toLowerCase() + e.slice(1)) || fe(t, Ve(e)) || fe(t, e));
}
function Mr(t) {
  const {
    type: e,
    vnode: n,
    proxy: i,
    withProxy: s,
    propsOptions: [r],
    slots: o,
    attrs: a,
    emit: l,
    render: u,
    renderCache: c,
    props: d,
    data: h,
    setupState: f,
    ctx: p,
    inheritAttrs: g
  } = t, _ = _i(t);
  let x, w;
  try {
    if (n.shapeFlag & 4) {
      const y = s || i, E = y;
      x = vt(
        u.call(
          E,
          y,
          c,
          d,
          f,
          h,
          p
        )
      ), w = a;
    } else {
      const y = e;
      x = vt(
        y.length > 1 ? y(
          d,
          { attrs: a, slots: o, emit: l }
        ) : y(
          d,
          null
        )
      ), w = e.props ? a : su(a);
    }
  } catch (y) {
    Ln.length = 0, Fi(y, t, 1), x = U(Te);
  }
  let S = x;
  if (w && g !== !1) {
    const y = Object.keys(w), { shapeFlag: E } = S;
    y.length && E & 7 && (r && y.some(Bs) && (w = ru(
      w,
      r
    )), S = It(S, w, !1, !0));
  }
  return n.dirs && (S = It(S, null, !1, !0), S.dirs = S.dirs ? S.dirs.concat(n.dirs) : n.dirs), n.transition && zn(S, n.transition), x = S, _i(_), x;
}
const su = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || Ai(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, ru = (t, e) => {
  const n = {};
  for (const i in t)
    (!Bs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function ou(t, e, n) {
  const { props: i, children: s, component: r } = t, { props: o, children: a, patchFlag: l } = e, u = r.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Ir(i, o, u) : !!o;
    if (l & 8) {
      const c = e.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const h = c[d];
        if (Pa(o, i, h) && !ji(u, h))
          return !0;
      }
    }
  } else
    return (s || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Ir(i, o, u) : !0 : !!o;
  return !1;
}
function Ir(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    if (Pa(e, t, r) && !ji(n, r))
      return !0;
  }
  return !1;
}
function Pa(t, e, n) {
  const i = t[n], s = e[n];
  return n === "style" && he(i) && he(s) ? !js(i, s) : i !== s;
}
function au({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Ma = {}, Ia = () => Object.create(Ma), Oa = (t) => Object.getPrototypeOf(t) === Ma;
function lu(t, e, n, i = !1) {
  const s = {}, r = Ia();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), Da(t, e, s, r);
  for (const o in t.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? t.props = i ? s : /* @__PURE__ */ Kn(s) : t.type.props ? t.props = s : t.props = r, t.attrs = r;
}
function cu(t, e, n, i) {
  const {
    props: s,
    attrs: r,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ ue(s), [l] = t.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const c = t.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let h = c[d];
        if (ji(t.emitsOptions, h))
          continue;
        const f = e[h];
        if (l)
          if (fe(r, h))
            f !== r[h] && (r[h] = f, u = !0);
          else {
            const p = Ae(h);
            s[p] = As(
              l,
              a,
              p,
              f,
              t,
              !1
            );
          }
        else
          f !== r[h] && (r[h] = f, u = !0);
      }
    }
  } else {
    Da(t, e, s, r) && (u = !0);
    let c;
    for (const d in a)
      (!e || // for camelCase
      !fe(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Ve(d)) === d || !fe(e, c))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (s[d] = As(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete s[d]);
    if (r !== a)
      for (const d in r)
        (!e || !fe(e, d)) && (delete r[d], u = !0);
  }
  u && kt(t.attrs, "set", "");
}
function Da(t, e, n, i) {
  const [s, r] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (An(l))
        continue;
      const u = e[l];
      let c;
      s && fe(s, c = Ae(l)) ? !r || !r.includes(c) ? n[c] = u : (a || (a = {}))[c] = u : ji(t.emitsOptions, l) || (!(l in i) || u !== i[l]) && (i[l] = u, o = !0);
    }
  if (r) {
    const l = /* @__PURE__ */ ue(n), u = a || de;
    for (let c = 0; c < r.length; c++) {
      const d = r[c];
      n[d] = As(
        s,
        l,
        d,
        u[d],
        t,
        !fe(u, d)
      );
    }
  }
  return o;
}
function As(t, e, n, i, s, r) {
  const o = t[n];
  if (o != null) {
    const a = fe(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && ne(l)) {
        const { propsDefaults: u } = s;
        if (n in u)
          i = u[n];
        else {
          const c = Xn(s);
          i = u[n] = l.call(
            null,
            e
          ), c();
        }
      } else
        i = l;
      s.ce && s.ce._setProp(n, i);
    }
    o[
      0
      /* shouldCast */
    ] && (r && !a ? i = !1 : o[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === Ve(n)) && (i = !0));
  }
  return i;
}
const uu = /* @__PURE__ */ new WeakMap();
function La(t, e, n = !1) {
  const i = n ? uu : e.propsCache, s = i.get(t);
  if (s)
    return s;
  const r = t.props, o = {}, a = [];
  let l = !1;
  if (!ne(t)) {
    const c = (d) => {
      l = !0;
      const [h, f] = La(d, e, !0);
      xe(o, h), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(c), t.extends && c(t.extends), t.mixins && t.mixins.forEach(c);
  }
  if (!r && !l)
    return he(t) && i.set(t, on), on;
  if (Y(r))
    for (let c = 0; c < r.length; c++) {
      const d = Ae(r[c]);
      Or(d) && (o[d] = de);
    }
  else if (r)
    for (const c in r) {
      const d = Ae(c);
      if (Or(d)) {
        const h = r[c], f = o[d] = Y(h) || ne(h) ? { type: h } : xe({}, h), p = f.type;
        let g = !1, _ = !0;
        if (Y(p))
          for (let x = 0; x < p.length; ++x) {
            const w = p[x], S = ne(w) && w.name;
            if (S === "Boolean") {
              g = !0;
              break;
            } else S === "String" && (_ = !1);
          }
        else
          g = ne(p) && p.name === "Boolean";
        f[
          0
          /* shouldCast */
        ] = g, f[
          1
          /* shouldCastTrue */
        ] = _, (g || fe(f, "default")) && a.push(d);
      }
    }
  const u = [o, a];
  return he(t) && i.set(t, u), u;
}
function Or(t) {
  return t[0] !== "$" && !An(t);
}
const Xs = (t) => t === "_" || t === "_ctx" || t === "$stable", Ys = (t) => Y(t) ? t.map(vt) : [vt(t)], du = (t, e, n) => {
  if (e._n)
    return e;
  const i = se((...s) => Ys(e(...s)), n);
  return i._c = !1, i;
}, Ra = (t, e, n) => {
  const i = t._ctx;
  for (const s in t) {
    if (Xs(s)) continue;
    const r = t[s];
    if (ne(r))
      e[s] = du(s, r, i);
    else if (r != null) {
      const o = Ys(r);
      e[s] = () => o;
    }
  }
}, $a = (t, e) => {
  const n = Ys(e);
  t.slots.default = () => n;
}, Fa = (t, e, n) => {
  for (const i in e)
    (n || !Xs(i)) && (t[i] = e[i]);
}, fu = (t, e, n) => {
  const i = t.slots = Ia();
  if (t.vnode.shapeFlag & 32) {
    const s = e._;
    s ? (Fa(i, e, n), n && Do(i, "_", s, !0)) : Ra(e, i);
  } else e && $a(t, e);
}, hu = (t, e, n) => {
  const { vnode: i, slots: s } = t;
  let r = !0, o = de;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? r = !1 : Fa(s, e, n) : (r = !e.$stable, Ra(e, s)), o = e;
  } else e && ($a(t, e), o = { default: 1 });
  if (r)
    for (const a in s)
      !Xs(a) && o[a] == null && delete s[a];
}, Me = bu;
function pu(t) {
  return vu(t);
}
function vu(t, e) {
  const n = Di();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: s,
    patchProp: r,
    createElement: o,
    createText: a,
    createComment: l,
    setText: u,
    setElementText: c,
    parentNode: d,
    nextSibling: h,
    setScopeId: f = mt,
    insertStaticContent: p
  } = t, g = (v, b, C, R = null, O = null, D = null, j = void 0, N = null, F = !!b.dynamicChildren) => {
    if (v === b)
      return;
    v && !Yt(v, b) && (R = Zn(v), Ne(v, O, D, !0), v = null), b.patchFlag === -2 && (F = !1, b.dynamicChildren = null);
    const { type: L, ref: J, shapeFlag: W } = b;
    switch (L) {
      case Hi:
        _(v, b, C, R);
        break;
      case Te:
        x(v, b, C, R);
        break;
      case ci:
        v == null && w(b, C, R, j);
        break;
      case be:
        M(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          N,
          F
        );
        break;
      default:
        W & 1 ? E(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          N,
          F
        ) : W & 6 ? V(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          N,
          F
        ) : (W & 64 || W & 128) && L.process(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          N,
          F,
          yn
        );
    }
    J != null && O ? On(J, v && v.ref, D, b || v, !b) : J == null && v && v.ref != null && On(v.ref, null, D, v, !0);
  }, _ = (v, b, C, R) => {
    if (v == null)
      i(
        b.el = a(b.children),
        C,
        R
      );
    else {
      const O = b.el = v.el;
      b.children !== v.children && u(O, b.children);
    }
  }, x = (v, b, C, R) => {
    v == null ? i(
      b.el = l(b.children || ""),
      C,
      R
    ) : b.el = v.el;
  }, w = (v, b, C, R) => {
    [v.el, v.anchor] = p(
      v.children,
      b,
      C,
      R,
      v.el,
      v.anchor
    );
  }, S = ({ el: v, anchor: b }, C, R) => {
    let O;
    for (; v && v !== b; )
      O = h(v), i(v, C, R), v = O;
    i(b, C, R);
  }, y = ({ el: v, anchor: b }) => {
    let C;
    for (; v && v !== b; )
      C = h(v), s(v), v = C;
    s(b);
  }, E = (v, b, C, R, O, D, j, N, F) => {
    if (b.type === "svg" ? j = "svg" : b.type === "math" && (j = "mathml"), v == null)
      T(
        b,
        C,
        R,
        O,
        D,
        j,
        N,
        F
      );
    else {
      const L = v.el && v.el._isVueCE ? v.el : null;
      try {
        L && L._beginPatch(), A(
          v,
          b,
          O,
          D,
          j,
          N,
          F
        );
      } finally {
        L && L._endPatch();
      }
    }
  }, T = (v, b, C, R, O, D, j, N) => {
    let F, L;
    const { props: J, shapeFlag: W, transition: X, dirs: ie } = v;
    if (F = v.el = o(
      v.type,
      D,
      J && J.is,
      J
    ), W & 8 ? c(F, v.children) : W & 16 && H(
      v.children,
      F,
      null,
      R,
      O,
      Qi(v, D),
      j,
      N
    ), ie && Vt(v, null, R, "created"), k(F, v, v.scopeId, j, R), J) {
      for (const me in J)
        me !== "value" && !An(me) && r(F, me, null, J[me], D, R);
      "value" in J && r(F, "value", null, J.value, D), (L = J.onVnodeBeforeMount) && ft(L, R, v);
    }
    ie && Vt(v, null, R, "beforeMount");
    const ce = mu(O, X);
    ce && X.beforeEnter(F), i(F, b, C), ((L = J && J.onVnodeMounted) || ce || ie) && Me(() => {
      L && ft(L, R, v), ce && X.enter(F), ie && Vt(v, null, R, "mounted");
    }, O);
  }, k = (v, b, C, R, O) => {
    if (C && f(v, C), R)
      for (let D = 0; D < R.length; D++)
        f(v, R[D]);
    if (O) {
      let D = O.subTree;
      if (b === D || Na(D.type) && (D.ssContent === b || D.ssFallback === b)) {
        const j = O.vnode;
        k(
          v,
          j,
          j.scopeId,
          j.slotScopeIds,
          O.parent
        );
      }
    }
  }, H = (v, b, C, R, O, D, j, N, F = 0) => {
    for (let L = F; L < v.length; L++) {
      const J = v[L] = N ? Ct(v[L]) : vt(v[L]);
      g(
        null,
        J,
        b,
        C,
        R,
        O,
        D,
        j,
        N
      );
    }
  }, A = (v, b, C, R, O, D, j) => {
    const N = b.el = v.el;
    let { patchFlag: F, dynamicChildren: L, dirs: J } = b;
    F |= v.patchFlag & 16;
    const W = v.props || de, X = b.props || de;
    let ie;
    if (C && qt(C, !1), (ie = X.onVnodeBeforeUpdate) && ft(ie, C, b, v), J && Vt(b, v, C, "beforeUpdate"), C && qt(C, !0), (W.innerHTML && X.innerHTML == null || W.textContent && X.textContent == null) && c(N, ""), L ? I(
      v.dynamicChildren,
      L,
      N,
      C,
      R,
      Qi(b, O),
      D
    ) : j || le(
      v,
      b,
      N,
      null,
      C,
      R,
      Qi(b, O),
      D,
      !1
    ), F > 0) {
      if (F & 16)
        $(N, W, X, C, O);
      else if (F & 2 && W.class !== X.class && r(N, "class", null, X.class, O), F & 4 && r(N, "style", W.style, X.style, O), F & 8) {
        const ce = b.dynamicProps;
        for (let me = 0; me < ce.length; me++) {
          const pe = ce[me], je = W[pe], He = X[pe];
          (He !== je || pe === "value") && r(N, pe, je, He, O, C);
        }
      }
      F & 1 && v.children !== b.children && c(N, b.children);
    } else !j && L == null && $(N, W, X, C, O);
    ((ie = X.onVnodeUpdated) || J) && Me(() => {
      ie && ft(ie, C, b, v), J && Vt(b, v, C, "updated");
    }, R);
  }, I = (v, b, C, R, O, D, j) => {
    for (let N = 0; N < b.length; N++) {
      const F = v[N], L = b[N], J = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        F.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (F.type === be || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Yt(F, L) || // - In the case of a component, it could contain anything.
        F.shapeFlag & 198) ? d(F.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          C
        )
      );
      g(
        F,
        L,
        J,
        null,
        R,
        O,
        D,
        j,
        !0
      );
    }
  }, $ = (v, b, C, R, O) => {
    if (b !== C) {
      if (b !== de)
        for (const D in b)
          !An(D) && !(D in C) && r(
            v,
            D,
            b[D],
            null,
            O,
            R
          );
      for (const D in C) {
        if (An(D)) continue;
        const j = C[D], N = b[D];
        j !== N && D !== "value" && r(v, D, N, j, O, R);
      }
      "value" in C && r(v, "value", b.value, C.value, O);
    }
  }, M = (v, b, C, R, O, D, j, N, F) => {
    const L = b.el = v ? v.el : a(""), J = b.anchor = v ? v.anchor : a("");
    let { patchFlag: W, dynamicChildren: X, slotScopeIds: ie } = b;
    ie && (N = N ? N.concat(ie) : ie), v == null ? (i(L, C, R), i(J, C, R), H(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      b.children || [],
      C,
      J,
      O,
      D,
      j,
      N,
      F
    )) : W > 0 && W & 64 && X && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    v.dynamicChildren && v.dynamicChildren.length === X.length ? (I(
      v.dynamicChildren,
      X,
      C,
      O,
      D,
      j,
      N
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (b.key != null || O && b === O.subTree) && Js(
      v,
      b,
      !0
      /* shallow */
    )) : le(
      v,
      b,
      C,
      J,
      O,
      D,
      j,
      N,
      F
    );
  }, V = (v, b, C, R, O, D, j, N, F) => {
    b.slotScopeIds = N, v == null ? b.shapeFlag & 512 ? O.ctx.activate(
      b,
      C,
      R,
      j,
      F
    ) : z(
      b,
      C,
      R,
      O,
      D,
      j,
      F
    ) : G(v, b, F);
  }, z = (v, b, C, R, O, D, j) => {
    const N = v.component = Cu(
      v,
      R,
      O
    );
    if (Bi(v) && (N.ctx.renderer = yn), ku(N, !1, j), N.asyncDep) {
      if (O && O.registerDep(N, ae, j), !v.el) {
        const F = N.subTree = U(Te);
        x(null, F, b, C), v.placeholder = F.el;
      }
    } else
      ae(
        N,
        v,
        b,
        C,
        O,
        D,
        j
      );
  }, G = (v, b, C) => {
    const R = b.component = v.component;
    if (ou(v, b, C))
      if (R.asyncDep && !R.asyncResolved) {
        te(R, b, C);
        return;
      } else
        R.next = b, R.update();
    else
      b.el = v.el, R.vnode = b;
  }, ae = (v, b, C, R, O, D, j) => {
    const N = () => {
      if (v.isMounted) {
        let { next: W, bu: X, u: ie, parent: ce, vnode: me } = v;
        {
          const ut = za(v);
          if (ut) {
            W && (W.el = me.el, te(v, W, j)), ut.asyncDep.then(() => {
              Me(() => {
                v.isUnmounted || L();
              }, O);
            });
            return;
          }
        }
        let pe = W, je;
        qt(v, !1), W ? (W.el = me.el, te(v, W, j)) : W = me, X && qi(X), (je = W.props && W.props.onVnodeBeforeUpdate) && ft(je, ce, W, me), qt(v, !0);
        const He = Mr(v), ct = v.subTree;
        v.subTree = He, g(
          ct,
          He,
          // parent may have changed if it's in a teleport
          d(ct.el),
          // anchor may have changed if it's in a fragment
          Zn(ct),
          v,
          O,
          D
        ), W.el = He.el, pe === null && au(v, He.el), ie && Me(ie, O), (je = W.props && W.props.onVnodeUpdated) && Me(
          () => ft(je, ce, W, me),
          O
        );
      } else {
        let W;
        const { el: X, props: ie } = b, { bm: ce, m: me, parent: pe, root: je, type: He } = v, ct = cn(b);
        qt(v, !1), ce && qi(ce), !ct && (W = ie && ie.onVnodeBeforeMount) && ft(W, pe, b), qt(v, !0);
        {
          je.ce && je.ce._hasShadowRoot() && je.ce._injectChildStyle(He);
          const ut = v.subTree = Mr(v);
          g(
            null,
            ut,
            C,
            R,
            v,
            O,
            D
          ), b.el = ut.el;
        }
        if (me && Me(me, O), !ct && (W = ie && ie.onVnodeMounted)) {
          const ut = b;
          Me(
            () => ft(W, pe, ut),
            O
          );
        }
        (b.shapeFlag & 256 || pe && cn(pe.vnode) && pe.vnode.shapeFlag & 256) && v.a && Me(v.a, O), v.isMounted = !0, b = C = R = null;
      }
    };
    v.scope.on();
    const F = v.effect = new No(N);
    v.scope.off();
    const L = v.update = F.run.bind(F), J = v.job = F.runIfDirty.bind(F);
    J.i = v, J.id = v.uid, F.scheduler = () => Ks(J), qt(v, !0), L();
  }, te = (v, b, C) => {
    b.component = v;
    const R = v.vnode.props;
    v.vnode = b, v.next = null, cu(v, b.props, R, C), hu(v, b.children, C), At(), br(v), Pt();
  }, le = (v, b, C, R, O, D, j, N, F = !1) => {
    const L = v && v.children, J = v ? v.shapeFlag : 0, W = b.children, { patchFlag: X, shapeFlag: ie } = b;
    if (X > 0) {
      if (X & 128) {
        lt(
          L,
          W,
          C,
          R,
          O,
          D,
          j,
          N,
          F
        );
        return;
      } else if (X & 256) {
        ke(
          L,
          W,
          C,
          R,
          O,
          D,
          j,
          N,
          F
        );
        return;
      }
    }
    ie & 8 ? (J & 16 && bn(L, O, D), W !== L && c(C, W)) : J & 16 ? ie & 16 ? lt(
      L,
      W,
      C,
      R,
      O,
      D,
      j,
      N,
      F
    ) : bn(L, O, D, !0) : (J & 8 && c(C, ""), ie & 16 && H(
      W,
      C,
      R,
      O,
      D,
      j,
      N,
      F
    ));
  }, ke = (v, b, C, R, O, D, j, N, F) => {
    v = v || on, b = b || on;
    const L = v.length, J = b.length, W = Math.min(L, J);
    let X;
    for (X = 0; X < W; X++) {
      const ie = b[X] = F ? Ct(b[X]) : vt(b[X]);
      g(
        v[X],
        ie,
        C,
        null,
        O,
        D,
        j,
        N,
        F
      );
    }
    L > J ? bn(
      v,
      O,
      D,
      !0,
      !1,
      W
    ) : H(
      b,
      C,
      R,
      O,
      D,
      j,
      N,
      F,
      W
    );
  }, lt = (v, b, C, R, O, D, j, N, F) => {
    let L = 0;
    const J = b.length;
    let W = v.length - 1, X = J - 1;
    for (; L <= W && L <= X; ) {
      const ie = v[L], ce = b[L] = F ? Ct(b[L]) : vt(b[L]);
      if (Yt(ie, ce))
        g(
          ie,
          ce,
          C,
          null,
          O,
          D,
          j,
          N,
          F
        );
      else
        break;
      L++;
    }
    for (; L <= W && L <= X; ) {
      const ie = v[W], ce = b[X] = F ? Ct(b[X]) : vt(b[X]);
      if (Yt(ie, ce))
        g(
          ie,
          ce,
          C,
          null,
          O,
          D,
          j,
          N,
          F
        );
      else
        break;
      W--, X--;
    }
    if (L > W) {
      if (L <= X) {
        const ie = X + 1, ce = ie < J ? b[ie].el : R;
        for (; L <= X; )
          g(
            null,
            b[L] = F ? Ct(b[L]) : vt(b[L]),
            C,
            ce,
            O,
            D,
            j,
            N,
            F
          ), L++;
      }
    } else if (L > X)
      for (; L <= W; )
        Ne(v[L], O, D, !0), L++;
    else {
      const ie = L, ce = L, me = /* @__PURE__ */ new Map();
      for (L = ce; L <= X; L++) {
        const Ue = b[L] = F ? Ct(b[L]) : vt(b[L]);
        Ue.key != null && me.set(Ue.key, L);
      }
      let pe, je = 0;
      const He = X - ce + 1;
      let ct = !1, ut = 0;
      const _n = new Array(He);
      for (L = 0; L < He; L++) _n[L] = 0;
      for (L = ie; L <= W; L++) {
        const Ue = v[L];
        if (je >= He) {
          Ne(Ue, O, D, !0);
          continue;
        }
        let dt;
        if (Ue.key != null)
          dt = me.get(Ue.key);
        else
          for (pe = ce; pe <= X; pe++)
            if (_n[pe - ce] === 0 && Yt(Ue, b[pe])) {
              dt = pe;
              break;
            }
        dt === void 0 ? Ne(Ue, O, D, !0) : (_n[dt - ce] = L + 1, dt >= ut ? ut = dt : ct = !0, g(
          Ue,
          b[dt],
          C,
          null,
          O,
          D,
          j,
          N,
          F
        ), je++);
      }
      const dr = ct ? gu(_n) : on;
      for (pe = dr.length - 1, L = He - 1; L >= 0; L--) {
        const Ue = ce + L, dt = b[Ue], fr = b[Ue + 1], hr = Ue + 1 < J ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          fr.el || Ba(fr)
        ) : R;
        _n[L] === 0 ? g(
          null,
          dt,
          C,
          hr,
          O,
          D,
          j,
          N,
          F
        ) : ct && (pe < 0 || L !== dr[pe] ? _t(dt, C, hr, 2) : pe--);
      }
    }
  }, _t = (v, b, C, R, O = null) => {
    const { el: D, type: j, transition: N, children: F, shapeFlag: L } = v;
    if (L & 6) {
      _t(v.component.subTree, b, C, R);
      return;
    }
    if (L & 128) {
      v.suspense.move(b, C, R);
      return;
    }
    if (L & 64) {
      j.move(v, b, C, yn);
      return;
    }
    if (j === be) {
      i(D, b, C);
      for (let W = 0; W < F.length; W++)
        _t(F[W], b, C, R);
      i(v.anchor, b, C);
      return;
    }
    if (j === ci) {
      S(v, b, C);
      return;
    }
    if (R !== 2 && L & 1 && N)
      if (R === 0)
        N.beforeEnter(D), i(D, b, C), Me(() => N.enter(D), O);
      else {
        const { leave: W, delayLeave: X, afterLeave: ie } = N, ce = () => {
          v.ctx.isUnmounted ? s(D) : i(D, b, C);
        }, me = () => {
          D._isLeaving && D[pt](
            !0
            /* cancelled */
          ), W(D, () => {
            ce(), ie && ie();
          });
        };
        X ? X(D, ce, me) : me();
      }
    else
      i(D, b, C);
  }, Ne = (v, b, C, R = !1, O = !1) => {
    const {
      type: D,
      props: j,
      ref: N,
      children: F,
      dynamicChildren: L,
      shapeFlag: J,
      patchFlag: W,
      dirs: X,
      cacheIndex: ie
    } = v;
    if (W === -2 && (O = !1), N != null && (At(), On(N, null, C, v, !0), Pt()), ie != null && (b.renderCache[ie] = void 0), J & 256) {
      b.ctx.deactivate(v);
      return;
    }
    const ce = J & 1 && X, me = !cn(v);
    let pe;
    if (me && (pe = j && j.onVnodeBeforeUnmount) && ft(pe, b, v), J & 6)
      Ml(v.component, C, R);
    else {
      if (J & 128) {
        v.suspense.unmount(C, R);
        return;
      }
      ce && Vt(v, null, b, "beforeUnmount"), J & 64 ? v.type.remove(
        v,
        b,
        C,
        yn,
        R
      ) : L && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !L.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (D !== be || W > 0 && W & 64) ? bn(
        L,
        b,
        C,
        !1,
        !0
      ) : (D === be && W & 384 || !O && J & 16) && bn(F, b, C), R && gn(v);
    }
    (me && (pe = j && j.onVnodeUnmounted) || ce) && Me(() => {
      pe && ft(pe, b, v), ce && Vt(v, null, b, "unmounted");
    }, C);
  }, gn = (v) => {
    const { type: b, el: C, anchor: R, transition: O } = v;
    if (b === be) {
      Pl(C, R);
      return;
    }
    if (b === ci) {
      y(v);
      return;
    }
    const D = () => {
      s(C), O && !O.persisted && O.afterLeave && O.afterLeave();
    };
    if (v.shapeFlag & 1 && O && !O.persisted) {
      const { leave: j, delayLeave: N } = O, F = () => j(C, D);
      N ? N(v.el, D, F) : F();
    } else
      D();
  }, Pl = (v, b) => {
    let C;
    for (; v !== b; )
      C = h(v), s(v), v = C;
    s(b);
  }, Ml = (v, b, C) => {
    const { bum: R, scope: O, job: D, subTree: j, um: N, m: F, a: L } = v;
    Dr(F), Dr(L), R && qi(R), O.stop(), D && (D.flags |= 8, Ne(j, v, b, C)), N && Me(N, b), Me(() => {
      v.isUnmounted = !0;
    }, b);
  }, bn = (v, b, C, R = !1, O = !1, D = 0) => {
    for (let j = D; j < v.length; j++)
      Ne(v[j], b, C, R, O);
  }, Zn = (v) => {
    if (v.shapeFlag & 6)
      return Zn(v.component.subTree);
    if (v.shapeFlag & 128)
      return v.suspense.next();
    const b = h(v.anchor || v.el), C = b && b[da];
    return C ? h(C) : b;
  };
  let Vi = !1;
  const ur = (v, b, C) => {
    let R;
    v == null ? b._vnode && (Ne(b._vnode, null, null, !0), R = b._vnode.component) : g(
      b._vnode || null,
      v,
      b,
      null,
      null,
      null,
      C
    ), b._vnode = v, Vi || (Vi = !0, br(R), aa(), Vi = !1);
  }, yn = {
    p: g,
    um: Ne,
    m: _t,
    r: gn,
    mt: z,
    mc: H,
    pc: le,
    pbc: I,
    n: Zn,
    o: t
  };
  return {
    render: ur,
    hydrate: void 0,
    createApp: eu(ur)
  };
}
function Qi({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function qt({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function mu(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function Js(t, e, n = !1) {
  const i = t.children, s = e.children;
  if (Y(i) && Y(s))
    for (let r = 0; r < i.length; r++) {
      const o = i[r];
      let a = s[r];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = s[r] = Ct(s[r]), a.el = o.el), !n && a.patchFlag !== -2 && Js(o, a)), a.type === Hi && (a.patchFlag === -1 && (a = s[r] = Ct(a)), a.el = o.el), a.type === Te && !a.el && (a.el = o.el);
    }
}
function gu(t) {
  const e = t.slice(), n = [0];
  let i, s, r, o, a;
  const l = t.length;
  for (i = 0; i < l; i++) {
    const u = t[i];
    if (u !== 0) {
      if (s = n[n.length - 1], t[s] < u) {
        e[i] = s, n.push(i);
        continue;
      }
      for (r = 0, o = n.length - 1; r < o; )
        a = r + o >> 1, t[n[a]] < u ? r = a + 1 : o = a;
      u < t[n[r]] && (r > 0 && (e[i] = n[r - 1]), n[r] = i);
    }
  }
  for (r = n.length, o = n[r - 1]; r-- > 0; )
    n[r] = o, o = e[o];
  return n;
}
function za(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : za(e);
}
function Dr(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function Ba(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? Ba(e.subTree) : null;
}
const Na = (t) => t.__isSuspense;
function bu(t, e) {
  e && e.pendingBranch ? Y(t) ? e.effects.push(...t) : e.effects.push(t) : xc(t);
}
const be = /* @__PURE__ */ Symbol.for("v-fgt"), Hi = /* @__PURE__ */ Symbol.for("v-txt"), Te = /* @__PURE__ */ Symbol.for("v-cmt"), ci = /* @__PURE__ */ Symbol.for("v-stc"), Ln = [];
let ze = null;
function P(t = !1) {
  Ln.push(ze = t ? null : []);
}
function yu() {
  Ln.pop(), ze = Ln[Ln.length - 1] || null;
}
let hn = 1;
function Si(t, e = !1) {
  hn += t, t < 0 && ze && e && (ze.hasOnce = !0);
}
function ja(t) {
  return t.dynamicChildren = hn > 0 ? ze || on : null, yu(), hn > 0 && ze && ze.push(t), t;
}
function Q(t, e, n, i, s, r) {
  return ja(
    Z(
      t,
      e,
      n,
      i,
      s,
      r,
      !0
    )
  );
}
function K(t, e, n, i, s) {
  return ja(
    U(
      t,
      e,
      n,
      i,
      s,
      !0
    )
  );
}
function Nn(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Yt(t, e) {
  return t.type === e.type && t.key === e.key;
}
const Ha = ({ key: t }) => t ?? null, ui = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? _e(t) || /* @__PURE__ */ Ce(t) || ne(t) ? { i: Ee, r: t, k: e, f: !!n } : t : null);
function Z(t, e = null, n = null, i = 0, s = null, r = t === be ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Ha(e),
    ref: e && ui(e),
    scopeId: ca,
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
    shapeFlag: r,
    patchFlag: i,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: Ee
  };
  return a ? (Zs(l, n), r & 128 && t.normalize(l)) : n && (l.shapeFlag |= _e(n) ? 8 : 16), hn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  ze && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && ze.push(l), l;
}
const U = _u;
function _u(t, e = null, n = null, i = 0, s = null, r = !1) {
  if ((!t || t === wa) && (t = Te), Nn(t)) {
    const a = It(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Zs(a, n), hn > 0 && !r && ze && (a.shapeFlag & 6 ? ze[ze.indexOf(t)] = a : ze.push(a)), a.patchFlag = -2, a;
  }
  if (Pu(t) && (t = t.__vccOpts), e) {
    e = Wa(e);
    let { class: a, style: l } = e;
    a && !_e(a) && (e.class = Ze(a)), he(l) && (/* @__PURE__ */ $i(l) && !Y(l) && (l = xe({}, l)), e.style = Ot(l));
  }
  const o = _e(t) ? 1 : Na(t) ? 128 : fa(t) ? 64 : he(t) ? 4 : ne(t) ? 2 : 0;
  return Z(
    t,
    e,
    n,
    i,
    s,
    o,
    r,
    !0
  );
}
function Wa(t) {
  return t ? /* @__PURE__ */ $i(t) || Oa(t) ? xe({}, t) : t : null;
}
function It(t, e, n = !1, i = !1) {
  const { props: s, ref: r, patchFlag: o, children: a, transition: l } = t, u = e ? Be(s || {}, e) : s, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: u,
    key: u && Ha(u),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? Y(r) ? r.concat(ui(e)) : [r, ui(e)] : ui(e)
    ) : r,
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
    patchFlag: e && t.type !== be ? o === -1 ? 16 : o | 16 : o,
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
    ssContent: t.ssContent && It(t.ssContent),
    ssFallback: t.ssFallback && It(t.ssFallback),
    placeholder: t.placeholder,
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
  return l && i && zn(
    c,
    l.clone(c)
  ), c;
}
function Ge(t = " ", e = 0) {
  return U(Hi, null, t, e);
}
function wu(t, e) {
  const n = U(ci, null, t);
  return n.staticCount = e, n;
}
function oe(t = "", e = !1) {
  return e ? (P(), K(Te, null, t)) : U(Te, null, t);
}
function vt(t) {
  return t == null || typeof t == "boolean" ? U(Te) : Y(t) ? U(
    be,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : Nn(t) ? Ct(t) : U(Hi, null, String(t));
}
function Ct(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : It(t);
}
function Zs(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (Y(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), Zs(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !Oa(e) ? e._ctx = Ee : s === 3 && Ee && (Ee.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else ne(e) ? (e = { default: e, _ctx: Ee }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Ge(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function Be(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const s in i)
      if (s === "class")
        e.class !== i.class && (e.class = Ze([e.class, i.class]));
      else if (s === "style")
        e.style = Ot([e.style, i.style]);
      else if (Ai(s)) {
        const r = e[s], o = i[s];
        o && r !== o && !(Y(r) && r.includes(o)) && (e[s] = r ? [].concat(r, o) : o);
      } else s !== "" && (e[s] = i[s]);
  }
  return e;
}
function ft(t, e, n, i = null) {
  ot(t, e, 7, [
    n,
    i
  ]);
}
const xu = Ta();
let Su = 0;
function Cu(t, e, n) {
  const i = t.type, s = (e ? e.appContext : t.appContext) || xu, r = {
    uid: Su++,
    vnode: t,
    type: i,
    parent: e,
    appContext: s,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Fo(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(s.provides),
    ids: e ? e.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: La(i, s),
    emitsOptions: Aa(i, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: de,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: de,
    data: de,
    props: de,
    attrs: de,
    slots: de,
    refs: de,
    setupState: de,
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
  return r.ctx = { _: r }, r.root = e ? e.root : r, r.emit = nu.bind(null, r), t.ce && t.ce(r), r;
}
let De = null;
const Qe = () => De || Ee;
let Ci, Ps;
{
  const t = Di(), e = (n, i) => {
    let s;
    return (s = t[n]) || (s = t[n] = []), s.push(i), (r) => {
      s.length > 1 ? s.forEach((o) => o(r)) : s[0](r);
    };
  };
  Ci = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => De = n
  ), Ps = e(
    "__VUE_SSR_SETTERS__",
    (n) => jn = n
  );
}
const Xn = (t) => {
  const e = De;
  return Ci(t), t.scope.on(), () => {
    t.scope.off(), Ci(e);
  };
}, Lr = () => {
  De && De.scope.off(), Ci(null);
};
function Va(t) {
  return t.vnode.shapeFlag & 4;
}
let jn = !1;
function ku(t, e = !1, n = !1) {
  e && Ps(e);
  const { props: i, children: s } = t.vnode, r = Va(t);
  lu(t, i, r, e), fu(t, s, n || e);
  const o = r ? Tu(t, e) : void 0;
  return e && Ps(!1), o;
}
function Tu(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, qc);
  const { setup: i } = n;
  if (i) {
    At();
    const s = t.setupContext = i.length > 1 ? Ua(t) : null, r = Xn(t), o = Gn(
      i,
      t,
      0,
      [
        t.props,
        s
      ]
    ), a = Io(o);
    if (Pt(), r(), (a || t.sp) && !cn(t) && ya(t), a) {
      if (o.then(Lr, Lr), e)
        return o.then((l) => {
          Rr(t, l);
        }).catch((l) => {
          Fi(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Rr(t, o);
  } else
    qa(t);
}
function Rr(t, e, n) {
  ne(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : he(e) && (t.setupState = na(e)), qa(t);
}
function qa(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || mt);
  {
    const s = Xn(t);
    At();
    try {
      Gc(t);
    } finally {
      Pt(), s();
    }
  }
}
const Eu = {
  get(t, e) {
    return Oe(t, "get", ""), t[e];
  }
};
function Ua(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, Eu),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Wi(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(na(ea(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in Dn)
        return Dn[n](t);
    },
    has(e, n) {
      return n in e || n in Dn;
    }
  })) : t.proxy;
}
function Au(t, e = !0) {
  return ne(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Pu(t) {
  return ne(t) && "__vccOpts" in t;
}
const B = (t, e) => /* @__PURE__ */ gc(t, e, jn);
function gt(t, e, n) {
  try {
    Si(-1);
    const i = arguments.length;
    return i === 2 ? he(e) && !Y(e) ? Nn(e) ? U(t, null, [e]) : U(t, e) : U(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && Nn(n) && (n = [n]), U(t, e, n));
  } finally {
    Si(1);
  }
}
function Mu(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Re(n[i], e[i]))
      return !1;
  return hn > 0 && ze && ze.push(t), !0;
}
const Iu = "3.5.28";
let Ms;
const $r = typeof window < "u" && window.trustedTypes;
if ($r)
  try {
    Ms = /* @__PURE__ */ $r.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const Ka = Ms ? (t) => Ms.createHTML(t) : (t) => t, Ou = "http://www.w3.org/2000/svg", Du = "http://www.w3.org/1998/Math/MathML", St = typeof document < "u" ? document : null, Fr = St && /* @__PURE__ */ St.createElement("template"), Lu = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const s = e === "svg" ? St.createElementNS(Ou, t) : e === "mathml" ? St.createElementNS(Du, t) : n ? St.createElement(t, { is: n }) : St.createElement(t);
    return t === "select" && i && i.multiple != null && s.setAttribute("multiple", i.multiple), s;
  },
  createText: (t) => St.createTextNode(t),
  createComment: (t) => St.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => St.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, i, s, r) {
    const o = n ? n.previousSibling : e.lastChild;
    if (s && (s === r || s.nextSibling))
      for (; e.insertBefore(s.cloneNode(!0), n), !(s === r || !(s = s.nextSibling)); )
        ;
    else {
      Fr.innerHTML = Ka(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Fr.content;
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
}, Rt = "transition", Sn = "animation", Hn = /* @__PURE__ */ Symbol("_vtc"), Ga = {
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
}, Ru = /* @__PURE__ */ xe(
  {},
  pa,
  Ga
), $u = (t) => (t.displayName = "Transition", t.props = Ru, t), Qs = /* @__PURE__ */ $u(
  (t, { slots: e }) => gt(Oc, Fu(t), e)
), Ut = (t, e = []) => {
  Y(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, zr = (t) => t ? Y(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Fu(t) {
  const e = {};
  for (const M in t)
    M in Ga || (e[M] = t[M]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: i,
    duration: s,
    enterFromClass: r = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = r,
    appearActiveClass: u = o,
    appearToClass: c = a,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: h = `${n}-leave-active`,
    leaveToClass: f = `${n}-leave-to`
  } = t, p = zu(s), g = p && p[0], _ = p && p[1], {
    onBeforeEnter: x,
    onEnter: w,
    onEnterCancelled: S,
    onLeave: y,
    onLeaveCancelled: E,
    onBeforeAppear: T = x,
    onAppear: k = w,
    onAppearCancelled: H = S
  } = e, A = (M, V, z, G) => {
    M._enterCancelled = G, Kt(M, V ? c : a), Kt(M, V ? u : o), z && z();
  }, I = (M, V) => {
    M._isLeaving = !1, Kt(M, d), Kt(M, f), Kt(M, h), V && V();
  }, $ = (M) => (V, z) => {
    const G = M ? k : w, ae = () => A(V, M, z);
    Ut(G, [V, ae]), Br(() => {
      Kt(V, M ? l : r), xt(V, M ? c : a), zr(G) || Nr(V, i, g, ae);
    });
  };
  return xe(e, {
    onBeforeEnter(M) {
      Ut(x, [M]), xt(M, r), xt(M, o);
    },
    onBeforeAppear(M) {
      Ut(T, [M]), xt(M, l), xt(M, u);
    },
    onEnter: $(!1),
    onAppear: $(!0),
    onLeave(M, V) {
      M._isLeaving = !0;
      const z = () => I(M, V);
      xt(M, d), M._enterCancelled ? (xt(M, h), Wr(M)) : (Wr(M), xt(M, h)), Br(() => {
        M._isLeaving && (Kt(M, d), xt(M, f), zr(y) || Nr(M, i, _, z));
      }), Ut(y, [M, z]);
    },
    onEnterCancelled(M) {
      A(M, !1, void 0, !0), Ut(S, [M]);
    },
    onAppearCancelled(M) {
      A(M, !0, void 0, !0), Ut(H, [M]);
    },
    onLeaveCancelled(M) {
      I(M), Ut(E, [M]);
    }
  });
}
function zu(t) {
  if (t == null)
    return null;
  if (he(t))
    return [es(t.enter), es(t.leave)];
  {
    const e = es(t);
    return [e, e];
  }
}
function es(t) {
  return gs(t);
}
function xt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[Hn] || (t[Hn] = /* @__PURE__ */ new Set())).add(e);
}
function Kt(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[Hn];
  n && (n.delete(e), n.size || (t[Hn] = void 0));
}
function Br(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Bu = 0;
function Nr(t, e, n, i) {
  const s = t._endId = ++Bu, r = () => {
    s === t._endId && i();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: o, timeout: a, propCount: l } = Nu(t, e);
  if (!o)
    return i();
  const u = o + "end";
  let c = 0;
  const d = () => {
    t.removeEventListener(u, h), r();
  }, h = (f) => {
    f.target === t && ++c >= l && d();
  };
  setTimeout(() => {
    c < l && d();
  }, a + 1), t.addEventListener(u, h);
}
function Nu(t, e) {
  const n = window.getComputedStyle(t), i = (p) => (n[p] || "").split(", "), s = i(`${Rt}Delay`), r = i(`${Rt}Duration`), o = jr(s, r), a = i(`${Sn}Delay`), l = i(`${Sn}Duration`), u = jr(a, l);
  let c = null, d = 0, h = 0;
  e === Rt ? o > 0 && (c = Rt, d = o, h = r.length) : e === Sn ? u > 0 && (c = Sn, d = u, h = l.length) : (d = Math.max(o, u), c = d > 0 ? o > u ? Rt : Sn : null, h = c ? c === Rt ? r.length : l.length : 0);
  const f = c === Rt && /\b(?:transform|all)(?:,|$)/.test(
    i(`${Rt}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: h,
    hasTransform: f
  };
}
function jr(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => Hr(n) + Hr(t[i])));
}
function Hr(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Wr(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function ju(t, e, n) {
  const i = t[Hn];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const ki = /* @__PURE__ */ Symbol("_vod"), Xa = /* @__PURE__ */ Symbol("_vsh"), Hu = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[ki] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : Cn(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: i }) {
    !e != !n && (i ? e ? (i.beforeEnter(t), Cn(t, !0), i.enter(t)) : i.leave(t, () => {
      Cn(t, !1);
    }) : Cn(t, e));
  },
  beforeUnmount(t, { value: e }) {
    Cn(t, e);
  }
};
function Cn(t, e) {
  t.style.display = e ? t[ki] : "none", t[Xa] = !e;
}
const Wu = /* @__PURE__ */ Symbol(""), Vu = /(?:^|;)\s*display\s*:/;
function qu(t, e, n) {
  const i = t.style, s = _e(n);
  let r = !1;
  if (n && !s) {
    if (e)
      if (_e(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && di(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && di(i, o, "");
    for (const o in n)
      o === "display" && (r = !0), di(i, o, n[o]);
  } else if (s) {
    if (e !== n) {
      const o = i[Wu];
      o && (n += ";" + o), i.cssText = n, r = Vu.test(n);
    }
  } else e && t.removeAttribute("style");
  ki in t && (t[ki] = r ? i.display : "", t[Xa] && (i.display = "none"));
}
const Vr = /\s*!important$/;
function di(t, e, n) {
  if (Y(n))
    n.forEach((i) => di(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Uu(t, e);
    Vr.test(n) ? t.setProperty(
      Ve(i),
      n.replace(Vr, ""),
      "important"
    ) : t[i] = n;
  }
}
const qr = ["Webkit", "Moz", "ms"], ts = {};
function Uu(t, e) {
  const n = ts[e];
  if (n)
    return n;
  let i = Ae(e);
  if (i !== "filter" && i in t)
    return ts[e] = i;
  i = Oi(i);
  for (let s = 0; s < qr.length; s++) {
    const r = qr[s] + i;
    if (r in t)
      return ts[e] = r;
  }
  return e;
}
const Ur = "http://www.w3.org/1999/xlink";
function Kr(t, e, n, i, s, r = Hl(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(Ur, e.slice(6, e.length)) : t.setAttributeNS(Ur, e, n) : n == null || r && !Lo(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    r ? "" : st(n) ? String(n) : n
  );
}
function Gr(t, e, n, i, s) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? Ka(n) : n);
    return;
  }
  const r = t.tagName;
  if (e === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const a = r === "OPTION" ? t.getAttribute("value") || "" : t.value, l = n == null ? (
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
    a === "boolean" ? n = Lo(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(s || e);
}
function Ku(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Gu(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const Xr = /* @__PURE__ */ Symbol("_vei");
function Xu(t, e, n, i, s = null) {
  const r = t[Xr] || (t[Xr] = {}), o = r[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Yu(e);
    if (i) {
      const u = r[e] = Qu(
        i,
        s
      );
      Ku(t, a, u, l);
    } else o && (Gu(t, a, o, l), r[e] = void 0);
  }
}
const Yr = /(?:Once|Passive|Capture)$/;
function Yu(t) {
  let e;
  if (Yr.test(t)) {
    e = {};
    let i;
    for (; i = t.match(Yr); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Ve(t.slice(2)), e];
}
let ns = 0;
const Ju = /* @__PURE__ */ Promise.resolve(), Zu = () => ns || (Ju.then(() => ns = 0), ns = Date.now());
function Qu(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    ot(
      ed(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Zu(), n;
}
function ed(t, e) {
  if (Y(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (i) => (s) => !s._stopped && i && i(s)
    );
  } else
    return e;
}
const Jr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, td = (t, e, n, i, s, r) => {
  const o = s === "svg";
  e === "class" ? ju(t, i, o) : e === "style" ? qu(t, n, i) : Ai(e) ? Bs(e) || Xu(t, e, n, i, r) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : nd(t, e, i, o)) ? (Gr(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && Kr(t, e, i, o, r, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !_e(i)) ? Gr(t, Ae(e), i, r, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), Kr(t, e, i, o));
};
function nd(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && Jr(e) && ne(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return Jr(e) && _e(n) ? !1 : e in t;
}
const Zr = {};
// @__NO_SIDE_EFFECTS__
function id(t, e, n) {
  let i = /* @__PURE__ */ ee(t, e);
  Pi(i) && (i = xe({}, i, e));
  class s extends er {
    constructor(o) {
      super(i, o, n);
    }
  }
  return s.def = i, s;
}
const sd = typeof HTMLElement < "u" ? HTMLElement : class {
};
class er extends sd {
  constructor(e, n = {}, i = eo) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== eo ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
      xe({}, e.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this;
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let e = this;
    for (; e = e && (e.parentNode || e.host); )
      if (e instanceof er) {
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
    this._connected = !1, at(() => {
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
    const e = (i, s = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: r, styles: o } = i;
      let a;
      if (r && !Y(r))
        for (const l in r) {
          const u = r[l];
          (u === Number || u && u.type === Number) && (l in this._props && (this._props[l] = gs(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[Ae(l)] = !0);
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
        fe(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => m(n[i])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, i = Y(n) ? n : Object.keys(n || {});
    for (const s of Object.keys(this))
      s[0] !== "_" && i.includes(s) && this._setProp(s, this[s]);
    for (const s of i.map(Ae))
      Object.defineProperty(this, s, {
        get() {
          return this._getProp(s);
        },
        set(r) {
          this._setProp(s, r, !0, !this._patching);
        }
      });
  }
  _setAttr(e) {
    if (e.startsWith("data-v-")) return;
    const n = this.hasAttribute(e);
    let i = n ? this.getAttribute(e) : Zr;
    const s = Ae(e);
    n && this._numberProps && this._numberProps[s] && (i = gs(i)), this._setProp(s, i, !1, !0);
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
  _setProp(e, n, i = !0, s = !1) {
    if (n !== this._props[e] && (this._dirty = !0, n === Zr ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), s && this._instance && this._update(), i)) {
      const r = this._ob;
      r && (this._processMutations(r.takeRecords()), r.disconnect()), n === !0 ? this.setAttribute(Ve(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(Ve(e), n + "") : n || this.removeAttribute(Ve(e)), r && r.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), ud(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = U(this._def, xe(e, this._props));
    return this._instance || (n.ce = (i) => {
      this._instance = i, i.ce = this, i.isCE = !0;
      const s = (r, o) => {
        this.dispatchEvent(
          new CustomEvent(
            r,
            Pi(o[0]) ? xe({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      i.emit = (r, ...o) => {
        s(r, o), Ve(r) !== r && s(Ve(r), o);
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
    for (let s = e.length - 1; s >= 0; s--) {
      const r = document.createElement("style");
      i && r.setAttribute("nonce", i), r.textContent = e[s], this.shadowRoot.prepend(r);
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
      const s = e[i], r = s.getAttribute("name") || "default", o = this._slots[r], a = s.parentNode;
      if (o)
        for (const l of o) {
          if (n && l.nodeType === 1) {
            const u = n + "-s", c = document.createTreeWalker(l, 1);
            l.setAttribute(u, "");
            let d;
            for (; d = c.nextNode(); )
              d.setAttribute(u, "");
          }
          a.insertBefore(l, s);
        }
      else
        for (; s.firstChild; ) a.insertBefore(s.firstChild, s);
      a.removeChild(s);
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
      const s = i.querySelectorAll("slot");
      for (let r = 0; r < s.length; r++)
        n.add(s[r]);
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
const rd = ["ctrl", "shift", "alt", "meta"], od = {
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
  exact: (t, e) => rd.some((n) => t[`${n}Key`] && !e.includes(n))
}, tr = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((s, ...r) => {
    for (let o = 0; o < e.length; o++) {
      const a = od[e[o]];
      if (a && a(s, e)) return;
    }
    return t(s, ...r);
  }));
}, ad = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, ld = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((s) => {
    if (!("key" in s))
      return;
    const r = Ve(s.key);
    if (e.some(
      (o) => o === r || ad[o] === r
    ))
      return t(s);
  }));
}, cd = /* @__PURE__ */ xe({ patchProp: td }, Lu);
let Qr;
function Ya() {
  return Qr || (Qr = pu(cd));
}
const ud = ((...t) => {
  Ya().render(...t);
}), eo = ((...t) => {
  const e = Ya().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const s = fd(i);
    if (!s) return;
    const r = e._component;
    !ne(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const o = n(s, !1, dd(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, e;
});
function dd(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function fd(t) {
  return _e(t) ? document.querySelector(t) : t;
}
const hd = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', pd = ["aria-label"], vd = /* @__PURE__ */ ee({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (P(), Q("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ye(e.$slots, "default", {}, void 0, !0)
    ], 8, pd));
  }
}), md = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", we = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, s] of e)
    n[i] = s;
  return n;
}, to = /* @__PURE__ */ we(vd, [["styles", [md]], ["__scopeId", "data-v-3d3f8eba"]]);
const gd = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const no = (t) => t === "";
const bd = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const io = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const yd = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const _d = (t) => {
  const e = yd(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var kn = {
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
const wd = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: s,
  "stroke-width": r,
  size: o = kn.width,
  color: a = kn.stroke,
  ...l
}, { slots: u }) => gt(
  "svg",
  {
    ...kn,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": no(n) || no(i) || n === !0 || i === !0 ? Number(s || r || kn["stroke-width"]) * 24 / Number(o) : s || r || kn["stroke-width"],
    class: bd(
      "lucide",
      l.class,
      ...t ? [`lucide-${io(_d(t))}-icon`, `lucide-${io(t)}`] : ["lucide-icon"]
    ),
    ...!u.default && !gd(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => gt(...c)), ...u.default ? [u.default()] : []]
);
const Pe = (t, e) => (n, { slots: i, attrs: s }) => gt(
  wd,
  {
    ...s,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const xd = Pe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Ja = Pe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Sd = Pe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Cd = Pe("clipboard-list", [
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
const kd = Pe("clipboard-type", [
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
const Td = Pe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Ed = Pe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const so = Pe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ad = Pe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Pd = Pe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Md = Pe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Id = Pe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Od = Pe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Dd = Pe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Ld = Pe("volume-2", [
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
const Rd = Pe("volume-x", [
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
const nr = Pe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), $d = {
  "arrow-down": xd,
  check: Ja,
  "chevron-down": Sd,
  "clipboard-list": Cd,
  "clipboard-type": kd,
  copy: Td,
  download: Ed,
  pause: Ad,
  play: Pd,
  settings: Md,
  "skip-back": Id,
  "skip-forward": Od,
  users: Dd,
  volume: Ld,
  "volume-mute": Rd,
  x: nr,
  "circle-notch": so,
  spinner: so
};
function Is(t) {
  if (t)
    return $d[t];
}
const Za = {
  sm: 16,
  md: 20,
  lg: 24
}, Fd = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, zd = /* @__PURE__ */ ee({
  __name: "EditorIcon",
  props: {
    name: { type: String },
    size: { type: Number },
    spin: { type: Boolean }
  },
  setup(t) {
    const e = t, n = B(() => Is(e.name)), i = B(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (s, r) => n.value ? (P(), K(xa(n.value), {
      key: 0,
      style: Ot(i.value),
      class: Ze(["editor-icon", { "editor-icon--spin": t.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (P(), Q("span", Fd, "?"));
  }
}), Bd = ".editor-icon[data-v-210c7f09]{flex-shrink:0}.editor-icon--missing[data-v-210c7f09]{display:inline-flex;align-items:center;justify-content:center;opacity:.5;font-size:1em;line-height:1}.editor-icon--spin[data-v-210c7f09]{animation:editor-icon-spin-210c7f09 1s linear infinite}@keyframes editor-icon-spin-210c7f09{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.editor-icon--spin[data-v-210c7f09]{animation:none}}", fi = /* @__PURE__ */ we(zd, [["styles", [Bd]], ["__scopeId", "data-v-210c7f09"]]), Nd = ["type", "disabled", "aria-disabled", "aria-label"], jd = {
  key: 3,
  class: "editor-btn__label"
}, Hd = /* @__PURE__ */ ee({
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
    const e = t, n = Uc(), i = B(() => !!Is(e.icon)), s = B(() => !!Is(e.iconRight)), r = B(() => Za[e.size]), o = B(() => e.disabled || e.loading), a = B(() => !!e.label || !!n.default), l = B(
      () => e.loading || i.value || !!n.icon
    ), u = B(() => l.value && !a.value), c = B(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      u.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, h) => (P(), Q("button", {
      type: t.type,
      class: Ze(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": t.ariaLabel
    }, [
      t.loading ? (P(), K(fi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: r.value
      }, null, 8, ["size"])) : i.value ? (P(), K(fi, {
        key: 1,
        name: t.icon,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? ye(d.$slots, "icon", { key: 2 }, void 0, !0) : oe("", !0),
      a.value ? (P(), Q("span", jd, [
        ye(d.$slots, "default", {}, () => [
          Ge(re(t.label), 1)
        ], !0)
      ])) : oe("", !0),
      s.value ? (P(), K(fi, {
        key: 4,
        name: t.iconRight,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? ye(d.$slots, "icon-right", { key: 5 }, void 0, !0) : oe("", !0)
    ], 10, Nd));
  }
}), Wd = ".editor-btn[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary);--btn-padding-y: 0;--btn-padding-x: var(--spacing-sm);--btn-font-size: var(--font-size-xs);--btn-height: 32px;--btn-gap: var(--spacing-xs);display:inline-flex;align-items:center;justify-content:center;gap:var(--btn-gap);box-sizing:border-box;height:var(--btn-height);padding:var(--btn-padding-y) var(--btn-padding-x);font-family:var(--font-family);font-size:var(--btn-font-size);font-weight:500;line-height:1;color:var(--btn-text);background-color:var(--btn-bg);border:1px solid var(--btn-border-color);border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap;transition:background-color var(--transition-duration),color var(--transition-duration),border-color var(--transition-duration)}.editor-btn[data-v-88f77497]:hover:not(:disabled){background-color:var(--btn-hover-bg);color:var(--btn-hover-text)}.editor-btn[data-v-88f77497]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-88f77497]:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.editor-btn__label[data-v-88f77497]{text-overflow:ellipsis;text-box:cap alphabetic}.editor-btn--md[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-sm);--btn-height: 40px}.editor-btn--lg[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-base);--btn-height: 44px}.editor-btn--icon-only[data-v-88f77497]{width:var(--btn-height);padding:0}.editor-btn--block[data-v-88f77497]{display:flex;width:100%}.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-primary);--btn-text: var(--color-white);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary-hover);--btn-hover-text: var(--color-white)}.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-primary);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary);--btn-hover-text: var(--color-white)}.editor-btn--tertiary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-primary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--transparent[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: transparent;--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--destructive.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-danger);--btn-text: var(--color-white);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger-hover);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-danger);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--tertiary[data-v-88f77497],.editor-btn--destructive.editor-btn--transparent[data-v-88f77497]{--btn-text: var(--color-danger);--btn-hover-bg: var(--color-danger-soft);--btn-hover-text: var(--color-danger)}", Je = /* @__PURE__ */ we(Hd, [["styles", [Wd]], ["__scopeId", "data-v-88f77497"]]), Qa = {
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
  "sidebar.bilingual": "Traductions croisées",
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
}, Vd = {
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
  "sidebar.bilingual": "Cross subtitles",
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
}, ro = { fr: Qa, en: Vd }, el = /* @__PURE__ */ Symbol("i18n");
function qd(t) {
  const e = B(() => {
    const i = ro[t.value] ?? ro.fr;
    return (s) => i[s] ?? s;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return pn(el, n), n;
}
function et() {
  const t = Et(el);
  if (t) return t;
  const e = B(() => "fr");
  return {
    t: (n) => Qa[n] ?? n,
    locale: e
  };
}
function Ud(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), s = parseInt(n.substring(2, 4), 16), r = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${r}, ${e})`;
}
function ir(t, e, n = "*", i = !0) {
  if (t === "*") return n;
  const s = i ? t.split("-")[0] ?? t : t;
  try {
    const r = new Intl.DisplayNames([e], { type: "language" });
    return r.of(s) ?? r.of(t.split("-")[0] ?? t) ?? t;
  } catch {
    return t;
  }
}
function Kd(t, e, n, i = "*", s = "") {
  return [...t].sort(
    (o, a) => Number(a.isSource) - Number(o.isSource)
  ).map((o) => {
    const a = !o.isSource && o.languages.length > 1;
    return {
      value: o.id,
      label: o.isSource ? n : a && s ? s : o.languages.map((l) => ir(l, e, i, !1)).join(", ")
    };
  });
}
function Gd(t, e = 250) {
  let n = !1, i = null;
  return (...s) => {
    if (n) {
      i = s;
      return;
    }
    n = !0, t(...s), setTimeout(() => {
      if (n = !1, i !== null) {
        const r = i;
        i = null, t(...r);
      }
    }, e);
  };
}
function Wn(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), s = e % 60, r = String(i).padStart(2, "0"), o = String(s).padStart(2, "0");
  return n > 0 ? `${n}:${r}:${o}` : `${r}:${o}`;
}
function Xd(t, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t * 1e3));
}
class We extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Yd(t) {
  if (t == null || typeof t != "object")
    throw new We("document", "must be a non-null object");
  const e = t;
  if (typeof e.title != "string")
    throw new We("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new We("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new We("document.channels", "must be an array");
  for (let n = 0; n < e.channels.length; n++) {
    const i = e.channels[n], s = `channels[${n}]`;
    if (i == null || typeof i != "object")
      throw new We(s, "must be a non-null object");
    if (typeof i.id != "string")
      throw new We(`${s}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new We(`${s}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new We(`${s}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new We(`${s}.translations`, "must be an array");
    for (let r = 0; r < i.translations.length; r++) {
      const o = i.translations[r], a = `${s}.translations[${r}]`;
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
function Jd(t, e) {
  const { width: n, height: i } = e.canvas, s = t[0], r = s.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * r), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0), c = c + o, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0);
  }
  e.stroke(), e.closePath();
}
function tl(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Zd(t, e) {
  if (!tl(t)) return null;
  let n = 0, i = t.length - 1;
  for (; n <= i; ) {
    const s = n + i >>> 1, r = t[s];
    if (e < r.startTime)
      i = s - 1;
    else if (e > r.endTime)
      n = s + 1;
    else
      return r.id;
  }
  return null;
}
const Qd = { class: "editor-header" }, ef = { class: "header-left" }, tf = { class: "document-title" }, nf = { class: "badges" }, sf = ["datetime"], rf = { class: "header-right" }, of = /* @__PURE__ */ ee({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = et(), s = B(() => ir(e.language, i.value, n("language.wildcard"))), r = B(() => Wn(e.duration)), o = B(() => e.title.replace(/-/g, " "));
    return (a, l) => (P(), Q("header", Qd, [
      Z("div", ef, [
        Z("h1", tf, re(o.value), 1),
        Z("div", nf, [
          U(to, null, {
            default: se(() => [
              Ge(re(s.value), 1)
            ]),
            _: 1
          }),
          U(to, null, {
            default: se(() => [
              Z("time", {
                datetime: `PT${t.duration}S`
              }, re(r.value), 9, sf)
            ]),
            _: 1
          })
        ])
      ]),
      Z("div", rf, [
        t.isMobile ? (P(), K(Je, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": m(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : oe("", !0),
        t.isMobile ? (P(), K(Je, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": m(n)("header.export")
        }, null, 8, ["aria-label"])) : (P(), K(Je, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: se(() => [
            Ge(re(m(n)("header.export")), 1)
          ]),
          _: 1
        })),
        U(Je, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": m(n)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), af = ".editor-header[data-v-c5fd975f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-c5fd975f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-c5fd975f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-c5fd975f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-c5fd975f]{display:none}.document-title[data-v-c5fd975f]{font-size:var(--font-size-base)}}", lf = /* @__PURE__ */ we(of, [["styles", [af]], ["__scopeId", "data-v-c5fd975f"]]), is = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, cf = 70, uf = 1e3 / 60, df = 350;
let hi = !1, oo = !1;
function ff() {
  oo || typeof document > "u" || (document.addEventListener("mousedown", () => {
    hi = !0;
  }), document.addEventListener("mouseup", () => {
    hi = !1;
  }), document.addEventListener("click", () => {
    hi = !1;
  }), oo = !0);
}
const ss = /* @__PURE__ */ new Map();
function rs(...t) {
  const e = {
    damping: is.damping,
    stiffness: is.stiffness,
    mass: is.mass
  };
  let n = !1;
  for (const s of t) {
    if (s === "instant") {
      n = !0;
      continue;
    }
    typeof s != "object" || !s || (n = !1, e.damping = s.damping ?? e.damping, e.stiffness = s.stiffness ?? e.stiffness, e.mass = s.mass ?? e.mass);
  }
  const i = JSON.stringify(e);
  return ss.has(i) || ss.set(i, Object.freeze({ ...e })), n ? "instant" : ss.get(i);
}
function hf(t = {}) {
  ff();
  let e = { ...t };
  const n = /* @__PURE__ */ new Set(), i = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function s() {
    const I = r();
    for (const $ of n) $(I);
  }
  function r() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function o() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(I) {
    i.scrollElement && (i.scrollElement.scrollTop = I, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const I = i.scrollElement, $ = i.contentElement;
    return !I || !$ ? 0 : I.scrollHeight - 1 - I.clientHeight;
  }
  let u;
  function c() {
    const I = i.scrollElement, $ = i.contentElement;
    if (!I || !$)
      return 0;
    const M = l();
    if (!e.targetScrollTop)
      return M;
    if (u?.targetScrollTop === M)
      return u.calculatedScrollTop;
    const V = Math.max(
      Math.min(
        e.targetScrollTop(M, {
          scrollElement: I,
          contentElement: $
        }),
        M
      ),
      0
    );
    return u = { targetScrollTop: M, calculatedScrollTop: V }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), V;
  }
  function d() {
    return c() - o();
  }
  function h() {
    return d() <= cf;
  }
  function f(I) {
    i.isAtBottom = I, s();
  }
  function p(I) {
    i.escapedFromLock = I, s();
  }
  function g(I) {
    i.isNearBottom = I, s();
  }
  function _() {
    if (!hi || typeof window > "u")
      return !1;
    const I = window.getSelection?.();
    if (!I || !I.rangeCount)
      return !1;
    const $ = I.getRangeAt(0), M = i.scrollElement;
    if (!M)
      return !1;
    const V = $.commonAncestorContainer;
    return !!(V && (M.contains(V) || V.contains(M)));
  }
  const x = (I) => {
    if (I.target !== i.scrollElement)
      return;
    const $ = o(), M = i.ignoreScrollToTop;
    let V = i.lastScrollTop ?? $;
    i.lastScrollTop = $, i.ignoreScrollToTop = void 0, M && M > $ && (V = M), g(h()), setTimeout(() => {
      if (i.resizeDifference || $ === M)
        return;
      if (_()) {
        p(!0), f(!1);
        return;
      }
      const z = $ > V, G = $ < V;
      if (i.animation?.ignoreEscapes) {
        a(V);
        return;
      }
      G && (p(!0), f(!1)), z && p(!1), !i.escapedFromLock && h() && f(!0);
    }, 1);
  }, w = (I) => {
    const $ = i.scrollElement;
    if (!$)
      return;
    let M = I.target;
    for (; M && !["scroll", "auto"].includes(getComputedStyle(M).overflow); ) {
      if (!M.parentElement)
        return;
      M = M.parentElement;
    }
    M === $ && I.deltaY < 0 && $.scrollHeight > $.clientHeight && !i.animation?.ignoreEscapes && (p(!0), f(!1));
  };
  function S(I, $) {
    y(), i.scrollElement = I, i.contentElement = $, getComputedStyle(I).overflow === "visible" && (I.style.overflow = "auto"), I.addEventListener("scroll", x, { passive: !0 }), I.addEventListener("wheel", w, { passive: !0 });
    let M;
    i.resizeObserver = new ResizeObserver((V) => {
      const z = V[0];
      if (!z)
        return;
      const { height: G } = z.contentRect, ae = G - (M ?? G);
      if (i.resizeDifference = ae, o() > l() && a(l()), g(h()), ae >= 0) {
        const te = rs(
          e,
          M ? e.resize : e.initial
        );
        k({
          animation: te,
          wait: !0,
          preserveScrollPosition: !0,
          duration: te === "instant" ? void 0 : df
        });
      } else
        h() && (p(!1), f(!0));
      M = G, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === ae && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe($);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", x), i.scrollElement.removeEventListener("wheel", w)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function E() {
    y(), n.clear();
  }
  function T(I) {
    e = { ...e, ...I };
  }
  function k(I = {}) {
    const $ = typeof I == "string" ? { animation: I } : I;
    $.preserveScrollPosition || f(!0);
    const M = Date.now() + (Number($.wait) || 0), V = rs(e, $.animation), { ignoreEscapes: z = !1 } = $;
    let G, ae = c();
    $.duration instanceof Promise ? $.duration.finally(() => {
      G = Date.now();
    }) : G = M + ($.duration ?? 0);
    const te = async () => {
      const le = new Promise((ke) => {
        if (typeof requestAnimationFrame > "u") {
          ke(!1);
          return;
        }
        requestAnimationFrame(() => ke(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const ke = o(), lt = typeof performance < "u" ? performance.now() : Date.now(), _t = (lt - (i.lastTick ?? lt)) / uf;
        if (i.animation ||= { behavior: V, promise: le, ignoreEscapes: z }, i.animation.behavior === V && (i.lastTick = lt), _() || M > Date.now())
          return te();
        if (ke < Math.min(ae, c())) {
          if (i.animation?.behavior === V) {
            if (V === "instant")
              return a(c()), te();
            const Ne = V;
            i.velocity = (Ne.damping * i.velocity + Ne.stiffness * d()) / Ne.mass, i.accumulated += i.velocity * _t;
            const gn = o();
            a(gn + i.accumulated), o() !== gn && (i.accumulated = 0);
          }
          return te();
        }
        return G > Date.now() ? (ae = c(), te()) : (i.animation = void 0, o() < c() ? k({
          animation: rs(e, e.resize),
          ignoreEscapes: z,
          duration: Math.max(0, G - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return le.then((ke) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ke));
    };
    return $.wait !== !0 && (i.animation = void 0), i.animation?.behavior === V ? i.animation.promise : te();
  }
  const H = () => {
    p(!0), f(!1);
  };
  function A(I) {
    return n.add(I), () => n.delete(I);
  }
  return {
    attach: S,
    detach: y,
    destroy: E,
    setOptions: T,
    getState: r,
    onChange: A,
    scrollToBottom: k,
    stopScroll: H
  };
}
function pf(t = {}) {
  const e = /* @__PURE__ */ q(null), n = /* @__PURE__ */ q(null), i = /* @__PURE__ */ q(t.initial !== !1), s = /* @__PURE__ */ q(!1), r = /* @__PURE__ */ q(!1), o = hf(t);
  let a = null;
  return Nt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, r.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), yt(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: n,
    isAtBottom: i,
    isNearBottom: s,
    escapedFromLock: r,
    scrollToBottom: (l) => o.scrollToBottom(l),
    stopScroll: () => o.stopScroll(),
    setOptions: (l) => o.setOptions(l)
  };
}
const vf = /* @__PURE__ */ ee({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (P(), Q("span", {
      class: "speaker-indicator",
      style: Ot({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), mf = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", nl = /* @__PURE__ */ we(vf, [["styles", [mf]], ["__scopeId", "data-v-9bffeda8"]]), gf = { class: "speaker-label" }, bf = {
  key: 1,
  class: "speaker-name"
}, yf = ["datetime"], _f = { class: "lang" }, wf = /* @__PURE__ */ ee({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    startDate: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = et(), s = B(
      () => ir(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), r = B(() => {
      if (e.startTime != null)
        return {
          text: Wn(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const a = new Date(e.startDate * 1e3);
        return {
          text: Xd(e.startDate, i.value),
          datetime: a.toISOString()
        };
      }
      return null;
    }), o = B(() => e.speaker?.color ?? "transparent");
    return (a, l) => (P(), Q("div", gf, [
      t.speaker ? (P(), K(nl, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : oe("", !0),
      t.speaker ? (P(), Q("span", bf, re(t.speaker.name), 1)) : oe("", !0),
      r.value ? (P(), Q("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value.datetime
      }, re(r.value.text), 9, yf)) : oe("", !0),
      Z("span", _f, re(s.value), 1)
    ]));
  }
}), xf = ".speaker-label[data-v-79207560]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-79207560]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-79207560]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);text-box:trim-both cap alphabetic}.lang[data-v-79207560]{font-size:var(--font-size-xs);font-weight:400;text-box:trim-both cap alphabetic}", Sf = /* @__PURE__ */ we(wf, [["styles", [xf]], ["__scopeId", "data-v-79207560"]]);
function ao(t) {
  return typeof t == "string" ? `'${t}'` : new Cf().serialize(t);
}
const Cf = /* @__PURE__ */ (function() {
  class t {
    #e = /* @__PURE__ */ new Map();
    compare(n, i) {
      const s = typeof n, r = typeof i;
      return s === "string" && r === "string" ? n.localeCompare(i) : s === "number" && r === "number" ? n - i : String.prototype.localeCompare.call(this.serialize(n, !0), this.serialize(i, !0));
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
      const s = n.constructor, r = s === Object || s === void 0 ? "" : s.name;
      if (r !== "" && globalThis[r] === s) return this.serializeBuiltInType(r, n);
      if (typeof n.toJSON == "function") {
        const o = n.toJSON();
        return r + (o !== null && typeof o == "object" ? this.$object(o) : `(${this.serialize(o)})`);
      }
      return this.serializeObjectEntries(r, Object.entries(n));
    }
    serializeBuiltInType(n, i) {
      const s = this["$" + n];
      if (s) return s.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(n, i.entries());
      throw new Error(`Cannot serialize ${n}`);
    }
    serializeObjectEntries(n, i) {
      const s = Array.from(i).sort((o, a) => this.compare(o[0], a[0]));
      let r = `${n}{`;
      for (let o = 0; o < s.length; o++) {
        const [a, l] = s[o];
        r += `${this.serialize(a, !0)}:${this.serialize(l)}`, o < s.length - 1 && (r += ",");
      }
      return r + "}";
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
      for (let s = 0; s < n.length; s++) i += this.serialize(n[s]), s < n.length - 1 && (i += ",");
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
      return `Set${this.$Array(Array.from(n).sort((i, s) => this.compare(i, s)))}`;
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
function Os(t, e) {
  return t === e || ao(t) === ao(e);
}
function Yn(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = Et(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (pn(i, o), o)];
}
function bt() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function il(t, e, n) {
  const i = n.originalEvent.target, s = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(s);
}
function Ti(t) {
  return t == null;
}
function lo(t, e) {
  return Ti(t) ? !1 : Array.isArray(t) ? t.some((n) => Os(n, e)) : Os(t, e);
}
function sr(t) {
  return t ? t.flatMap((e) => e.type === be ? sr(e.children) : [e]) : [];
}
const [kf] = Yn("ConfigProvider");
function Tf(t, e) {
  return Bo() ? (Vl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Ef(t) {
  let e = !1, n;
  const i = zo(!0);
  return ((...s) => (e || (n = i.run(() => t(...s)), e = !0), n));
}
const jt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Af = (t) => typeof t < "u", Pf = Object.prototype.toString, Mf = (t) => Pf.call(t) === "[object Object]", co = /* @__PURE__ */ If();
function If() {
  var t, e, n;
  return jt && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function os(t) {
  return Array.isArray(t) ? t : [t];
}
function Of(t) {
  return Qe();
}
// @__NO_SIDE_EFFECTS__
function Df(t) {
  if (!jt) return t;
  let e = 0, n, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...r) => (e += 1, i || (i = zo(!0), n = i.run(() => t(...r))), Tf(s), n));
}
function Lf(t, e) {
  Of() && yt(t, e);
}
function Rf(t, e, n) {
  return ve(t, e, {
    ...n,
    immediate: !0
  });
}
const rr = jt ? window : void 0;
function mn(t) {
  var e;
  const n = it(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function sl(...t) {
  const e = (i, s, r, o) => (i.addEventListener(s, r, o), () => i.removeEventListener(s, r, o)), n = B(() => {
    const i = os(it(t[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return Rf(() => {
    var i, s;
    return [
      (i = (s = n.value) === null || s === void 0 ? void 0 : s.map((r) => mn(r))) !== null && i !== void 0 ? i : [rr].filter((r) => r != null),
      os(it(n.value ? t[1] : t[0])),
      os(m(n.value ? t[2] : t[1])),
      it(n.value ? t[3] : t[2])
    ];
  }, ([i, s, r, o], a, l) => {
    if (!i?.length || !s?.length || !r?.length) return;
    const u = Mf(o) ? { ...o } : o, c = i.flatMap((d) => s.flatMap((h) => r.map((f) => e(d, h, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function $f() {
  const t = /* @__PURE__ */ fn(!1), e = Qe();
  return e && qe(() => {
    t.value = !0;
  }, e), t;
}
function Ff(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function zf(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: s = rr, eventName: r = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = Ff(e);
  return sl(s, r, (c) => {
    c.repeat && it(a) || l(c) && n(c);
  }, o);
}
function Bf(t) {
  return JSON.parse(JSON.stringify(t));
}
// @__NO_SIDE_EFFECTS__
function rl(t, e, n, i = {}) {
  var s, r;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Qe(), f = n || h?.emit || (h == null || (s = h.$emit) === null || s === void 0 ? void 0 : s.bind(h)) || (h == null || (r = h.proxy) === null || r === void 0 || (r = r.$emit) === null || r === void 0 ? void 0 : r.bind(h?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const g = (w) => o ? typeof o == "function" ? o(w) : Bf(w) : w, _ = () => Af(t[e]) ? g(t[e]) : c, x = (w) => {
    d ? d(w) && f(p, w) : f(p, w);
  };
  if (a) {
    const w = /* @__PURE__ */ q(_());
    let S = !1;
    return ve(() => t[e], (y) => {
      S || (S = !0, w.value = g(y), at(() => S = !1));
    }), ve(w, (y) => {
      !S && (y !== t[e] || u) && x(y);
    }, { deep: u }), w;
  } else return B({
    get() {
      return _();
    },
    set(w) {
      x(w);
    }
  });
}
function as(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Ds(t, e, n = ".", i) {
  if (!as(e))
    return Ds(t, {}, n, i);
  const s = Object.assign({}, e);
  for (const r in t) {
    if (r === "__proto__" || r === "constructor")
      continue;
    const o = t[r];
    o != null && (i && i(s, r, o, n) || (Array.isArray(o) && Array.isArray(s[r]) ? s[r] = [...o, ...s[r]] : as(o) && as(s[r]) ? s[r] = Ds(
      o,
      s[r],
      (n ? `${n}.` : "") + r.toString(),
      i
    ) : s[r] = o));
  }
  return s;
}
function Nf(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Ds(n, i, "", t), {})
  );
}
const jf = Nf(), Hf = /* @__PURE__ */ Df(() => {
  const t = /* @__PURE__ */ q(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ q(), n = B(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = kf({ scrollBody: /* @__PURE__ */ q(!0) });
  let s = null;
  const r = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", co && s?.(), e.value = void 0;
  };
  return ve(n, (o, a) => {
    if (!jt) return;
    if (!o) {
      a && r();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? jf({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), co && (s = sl(document, "touchmove", (d) => Vf(d), { passive: !1 })), at(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Wf(t) {
  const e = Math.random().toString(36).substring(2, 7), n = Hf();
  n.value.set(e, t);
  const i = B({
    get: () => n.value.get(e) ?? !1,
    set: (s) => n.value.set(e, s)
  });
  return Lf(() => {
    n.value.delete(e);
  }), i;
}
function ol(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : ol(n);
  }
}
function Vf(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && ol(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function or(t) {
  const e = Qe(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((s) => {
    i[ai(Ae(s))] = (...r) => t(s, ...r);
  }), i;
}
function qf(t) {
  return B(() => it(t) ? !!mn(t)?.closest("form") : !0);
}
function tt() {
  const t = Qe(), e = /* @__PURE__ */ q(), n = B(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : mn(e)), i = Object.assign({}, t.exposed), s = {};
  for (const o in t.props) Object.defineProperty(s, o, {
    enumerable: !0,
    configurable: !0,
    get: () => t.props[o]
  });
  if (Object.keys(i).length > 0) for (const o in i) Object.defineProperty(s, o, {
    enumerable: !0,
    configurable: !0,
    get: () => i[o]
  });
  Object.defineProperty(s, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => t.vnode.el
  }), t.exposed = s;
  function r(o) {
    if (e.value = o, !!o && (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => o instanceof Element ? o : o.$el
    }), !(o instanceof Element) && !Object.hasOwn(o, "$el"))) {
      const a = o.$.exposed, l = Object.assign({}, s);
      for (const u in a) Object.defineProperty(l, u, {
        enumerable: !0,
        configurable: !0,
        get: () => a[u]
      });
      t.exposed = l;
    }
  }
  return {
    forwardRef: r,
    currentRef: e,
    currentElement: n
  };
}
var Uf = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, nn = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), si = {}, ls = 0, al = function(t) {
  return t && (t.host || al(t.parentNode));
}, Kf = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = al(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Gf = function(t, e, n, i) {
  var s = Kf(e, Array.isArray(t) ? t : [t]);
  si[n] || (si[n] = /* @__PURE__ */ new WeakMap());
  var r = si[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(s), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  s.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var f = h.getAttribute(i), p = f !== null && f !== "false", g = (nn.get(h) || 0) + 1, _ = (r.get(h) || 0) + 1;
          nn.set(h, g), r.set(h, _), o.push(h), g === 1 && p && ii.set(h, !0), _ === 1 && h.setAttribute(n, "true"), p || h.setAttribute(i, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", h, x);
        }
    });
  };
  return c(e), a.clear(), ls++, function() {
    o.forEach(function(d) {
      var h = nn.get(d) - 1, f = r.get(d) - 1;
      nn.set(d, h), r.set(d, f), h || (ii.has(d) || d.removeAttribute(i), ii.delete(d)), f || d.removeAttribute(n);
    }), ls--, ls || (nn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), si = {});
  };
}, Xf = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), s = Uf(t);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), Gf(i, s, n, "aria-hidden")) : function() {
    return null;
  };
};
function Yf(t) {
  let e;
  ve(() => mn(t), (n) => {
    n ? e = Xf(n) : e && e();
  }), en(() => {
    e && e();
  });
}
function Ls(t, e = "reka") {
  return `${e}-${Gs?.()}`;
}
function Jf(t, e) {
  const n = /* @__PURE__ */ q(t);
  function i(r) {
    return e[n.value][r] ?? n.value;
  }
  return {
    state: n,
    dispatch: (r) => {
      n.value = i(r);
    }
  };
}
function Zf(t, e) {
  const n = /* @__PURE__ */ q({}), i = /* @__PURE__ */ q("none"), s = /* @__PURE__ */ q(t), r = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? rr, { state: l, dispatch: u } = Jf(r, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (_) => {
    if (jt) {
      const x = new CustomEvent(_, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(x);
    }
  };
  ve(t, async (_, x) => {
    const w = x !== _;
    if (await at(), w) {
      const S = i.value, y = ri(e.value);
      _ ? (u("MOUNT"), c("enter"), y === "none" && c("after-enter")) : y === "none" || y === "undefined" || n.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : x && S !== y ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (_) => {
    const x = ri(e.value), w = x.includes(CSS.escape(_.animationName)), S = l.value === "mounted" ? "enter" : "leave";
    if (_.target === e.value && w && (c(`after-${S}`), u("ANIMATION_END"), !s.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    _.target === e.value && x === "none" && u("ANIMATION_END");
  }, h = (_) => {
    _.target === e.value && (i.value = ri(e.value));
  }, f = ve(e, (_, x) => {
    _ ? (n.value = getComputedStyle(_), _.addEventListener("animationstart", h), _.addEventListener("animationcancel", d), _.addEventListener("animationend", d)) : (u("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), x?.removeEventListener("animationstart", h), x?.removeEventListener("animationcancel", d), x?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = ve(l, () => {
    const _ = ri(e.value);
    i.value = l.value === "mounted" ? _ : "none";
  });
  return en(() => {
    f(), p();
  }), { isPresent: B(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function ri(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var ar = /* @__PURE__ */ ee({
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
    const { present: i, forceMount: s } = /* @__PURE__ */ ia(t), r = /* @__PURE__ */ q(), { isPresent: o } = Zf(i, r);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = sr(a || []);
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
    return () => s.value || i.value || o.value ? gt(e.default({ present: o.value })[0], { ref: (u) => {
      const c = mn(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? r.value = c.firstElementChild : r.value = c), c;
    } }) : null;
  }
});
const Rs = /* @__PURE__ */ ee({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = sr(n.default()), s = i.findIndex((l) => l.type !== Te);
      if (s === -1) return i;
      const r = i[s];
      delete r.props?.ref;
      const o = r.props ? Be(e, r.props) : e, a = It({
        ...r,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), Qf = [
  "area",
  "img",
  "input"
], Lt = /* @__PURE__ */ ee({
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
    return typeof i == "string" && Qf.includes(i) ? () => gt(i, e) : i !== "template" ? () => gt(t.as, e, { default: n.default }) : () => gt(Rs, e, { default: n.default });
  }
});
function $s() {
  const t = /* @__PURE__ */ q(), e = B(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : mn(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [Ht, eh] = Yn("DialogRoot");
var th = /* @__PURE__ */ ee({
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
    const n = t, s = /* @__PURE__ */ rl(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), r = /* @__PURE__ */ q(), o = /* @__PURE__ */ q(), { modal: a } = /* @__PURE__ */ ia(n);
    return eh({
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
      triggerElement: r,
      contentElement: o
    }), (l, u) => ye(l.$slots, "default", {
      open: m(s),
      close: () => s.value = !1
    });
  }
}), nh = th, ih = /* @__PURE__ */ ee({
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
    tt();
    const n = Ht();
    return (i, s) => (P(), K(m(Lt), Be(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (r) => m(n).onOpenChange(!1))
    }), {
      default: se(() => [ye(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), sh = ih;
const rh = "dismissableLayer.pointerDownOutside", oh = "dismissableLayer.focusOutside";
function ll(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), s = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || s.indexOf(i) < s.indexOf(n)));
}
function ah(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ q(!1), r = /* @__PURE__ */ q(() => {
  });
  return Nt((o) => {
    if (!jt || !it(n)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (ll(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let h = function() {
            il(rh, t, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", r.value), r.value = h, i.addEventListener("click", r.value, { once: !0 })) : h();
        } else i.removeEventListener("click", r.value);
        s.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", r.value);
    });
  }), { onPointerDownCapture: () => {
    it(n) && (s.value = !0);
  } };
}
function lh(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ q(!1);
  return Nt((r) => {
    if (!jt || !it(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await at(), await at();
      const l = a.target;
      !e.value || !l || ll(e.value, l) || a.target && !s.value && il(oh, t, { originalEvent: a });
    };
    i.addEventListener("focusin", o), r(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      it(n) && (s.value = !0);
    },
    onBlurCapture: () => {
      it(n) && (s.value = !1);
    }
  };
}
const Ye = /* @__PURE__ */ Un({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ch = /* @__PURE__ */ ee({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = tt(), o = B(() => r.value?.ownerDocument ?? globalThis.document), a = B(() => Ye.layersRoot), l = B(() => r.value ? Array.from(a.value).indexOf(r.value) : -1), u = B(() => Ye.layersWithOutsidePointerEventsDisabled.size > 0), c = B(() => {
      const f = Array.from(a.value), [p] = [...Ye.layersWithOutsidePointerEventsDisabled].slice(-1), g = f.indexOf(p);
      return l.value >= g;
    }), d = ah(async (f) => {
      const p = [...Ye.branches].some((g) => g?.contains(f.target));
      !c.value || p || (i("pointerDownOutside", f), i("interactOutside", f), await at(), f.defaultPrevented || i("dismiss"));
    }, r), h = lh((f) => {
      [...Ye.branches].some((g) => g?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, r);
    return zf("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), Nt((f) => {
      r.value && (n.disableOutsidePointerEvents && (Ye.layersWithOutsidePointerEventsDisabled.size === 0 && (Ye.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Ye.layersWithOutsidePointerEventsDisabled.add(r.value)), a.value.add(r.value), f(() => {
        n.disableOutsidePointerEvents && Ye.layersWithOutsidePointerEventsDisabled.size === 1 && !Ti(Ye.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Ye.originalBodyPointerEvents);
      }));
    }), Nt((f) => {
      f(() => {
        r.value && (a.value.delete(r.value), Ye.layersWithOutsidePointerEventsDisabled.delete(r.value));
      });
    }), (f, p) => (P(), K(m(Lt), {
      ref: m(s),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: Ot({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: m(h).onFocusCapture,
      onBlurCapture: m(h).onBlurCapture,
      onPointerdownCapture: m(d).onPointerDownCapture
    }, {
      default: se(() => [ye(f.$slots, "default")]),
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
}), uh = ch;
const dh = /* @__PURE__ */ Ef(() => /* @__PURE__ */ q([]));
function fh() {
  const t = dh();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = uo(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = uo(t.value, e), t.value[0]?.resume();
    }
  };
}
function uo(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const cs = "focusScope.autoFocusOnMount", us = "focusScope.autoFocusOnUnmount", fo = {
  bubbles: !1,
  cancelable: !0
};
function hh(t, { select: e = !1 } = {}) {
  const n = bt();
  for (const i of t)
    if ($t(i, { select: e }), bt() !== n) return !0;
}
function ph(t) {
  const e = cl(t), n = ho(e, t), i = ho(e.reverse(), t);
  return [n, i];
}
function cl(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function ho(t, e) {
  for (const n of t) if (!vh(n, { upTo: e })) return n;
}
function vh(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function mh(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function $t(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = bt();
    t.focus({ preventScroll: !0 }), t !== n && mh(t) && e && t.select();
  }
}
var gh = /* @__PURE__ */ ee({
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
    const n = t, i = e, { currentRef: s, currentElement: r } = tt(), o = /* @__PURE__ */ q(null), a = fh(), l = /* @__PURE__ */ Un({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    Nt((c) => {
      if (!jt) return;
      const d = r.value;
      if (!n.trapped) return;
      function h(_) {
        if (l.paused || !d) return;
        const x = _.target;
        d.contains(x) ? o.value = x : $t(o.value, { select: !0 });
      }
      function f(_) {
        if (l.paused || !d) return;
        const x = _.relatedTarget;
        x !== null && (d.contains(x) || $t(o.value, { select: !0 }));
      }
      function p(_) {
        d.contains(o.value) || $t(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", f);
      const g = new MutationObserver(p);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", f), g.disconnect();
      });
    }), Nt(async (c) => {
      const d = r.value;
      if (await at(), !d) return;
      a.add(l);
      const h = bt();
      if (!d.contains(h)) {
        const p = new CustomEvent(cs, fo);
        d.addEventListener(cs, (g) => i("mountAutoFocus", g)), d.dispatchEvent(p), p.defaultPrevented || (hh(cl(d), { select: !0 }), bt() === h && $t(d));
      }
      c(() => {
        d.removeEventListener(cs, (_) => i("mountAutoFocus", _));
        const p = new CustomEvent(us, fo), g = (_) => {
          i("unmountAutoFocus", _);
        };
        d.addEventListener(us, g), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || $t(h ?? document.body, { select: !0 }), d.removeEventListener(us, g), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = bt();
      if (d && h) {
        const f = c.currentTarget, [p, g] = ph(f);
        p && g ? !c.shiftKey && h === g ? (c.preventDefault(), n.loop && $t(p, { select: !0 })) : c.shiftKey && h === p && (c.preventDefault(), n.loop && $t(g, { select: !0 })) : h === f && c.preventDefault();
      }
    }
    return (c, d) => (P(), K(m(Lt), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: se(() => [ye(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), bh = gh;
function yh(t) {
  return t ? "open" : "closed";
}
var _h = /* @__PURE__ */ ee({
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
    const n = t, i = e, s = Ht(), { forwardRef: r, currentElement: o } = tt();
    return s.titleId ||= Ls(void 0, "reka-dialog-title"), s.descriptionId ||= Ls(void 0, "reka-dialog-description"), qe(() => {
      s.contentElement = o, bt() !== document.body && (s.triggerElement.value = bt());
    }), (a, l) => (P(), K(m(bh), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: se(() => [U(m(uh), Be({
        id: m(s).contentId,
        ref: m(r),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": m(s).descriptionId,
        "aria-labelledby": m(s).titleId,
        "data-state": m(yh)(m(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => m(s).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: se(() => [ye(a.$slots, "default")]),
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
}), ul = _h, wh = /* @__PURE__ */ ee({
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
    const n = t, i = e, s = Ht(), r = or(i), { forwardRef: o, currentElement: a } = tt();
    return Yf(a), (l, u) => (P(), K(ul, Be({
      ...n,
      ...m(r)
    }, {
      ref: m(o),
      "trap-focus": m(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), m(s).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || h) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: se(() => [ye(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), xh = wh, Sh = /* @__PURE__ */ ee({
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
    const n = t, s = or(e);
    tt();
    const r = Ht(), o = /* @__PURE__ */ q(!1), a = /* @__PURE__ */ q(!1);
    return (l, u) => (P(), K(ul, Be({
      ...n,
      ...m(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (o.value || m(r).triggerElement.value?.focus(), c.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (o.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        m(r).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: se(() => [ye(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ch = Sh, kh = /* @__PURE__ */ ee({
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
    const n = t, i = e, s = Ht(), r = or(i), { forwardRef: o } = tt();
    return (a, l) => (P(), K(m(ar), { present: a.forceMount || m(s).open.value }, {
      default: se(() => [m(s).modal.value ? (P(), K(xh, Be({
        key: 0,
        ref: m(o)
      }, {
        ...n,
        ...m(r),
        ...a.$attrs
      }), {
        default: se(() => [ye(a.$slots, "default")]),
        _: 3
      }, 16)) : (P(), K(Ch, Be({
        key: 1,
        ref: m(o)
      }, {
        ...n,
        ...m(r),
        ...a.$attrs
      }), {
        default: se(() => [ye(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Th = kh, Eh = /* @__PURE__ */ ee({
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
    const e = Ht();
    return Wf(!0), tt(), (n, i) => (P(), K(m(Lt), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": m(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: se(() => [ye(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Ah = Eh, Ph = /* @__PURE__ */ ee({
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
    const e = Ht(), { forwardRef: n } = tt();
    return (i, s) => m(e)?.modal.value ? (P(), K(m(ar), {
      key: 0,
      present: i.forceMount || m(e).open.value
    }, {
      default: se(() => [U(Ah, Be(i.$attrs, {
        ref: m(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: se(() => [ye(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : oe("v-if", !0);
  }
}), Mh = Ph, Ih = /* @__PURE__ */ ee({
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
    const e = /* @__PURE__ */ $f();
    return (n, i) => m(e) || n.forceMount ? (P(), K(Pc, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [ye(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : oe("v-if", !0);
  }
}), Oh = Ih, Dh = /* @__PURE__ */ ee({
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
    return (n, i) => (P(), K(m(Oh), Nl(Wa(e)), {
      default: se(() => [ye(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Lh = Dh, Rh = /* @__PURE__ */ ee({
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
    const e = t, n = Ht();
    return tt(), (i, s) => (P(), K(m(Lt), Be(e, { id: m(n).titleId }), {
      default: se(() => [ye(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), $h = Rh;
const po = "data-reka-collection-item";
function Fh(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let s;
  n ? (s = {
    collectionRef: /* @__PURE__ */ q(),
    itemMap: /* @__PURE__ */ q(/* @__PURE__ */ new Map())
  }, pn(i, s)) : s = Et(i);
  const r = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${po}]`)), p = Array.from(s.itemMap.value.values()).sort((g, _) => h.indexOf(g.ref) - h.indexOf(_.ref));
    return c ? p : p.filter((g) => g.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ ee({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = $s();
      return ve(p, () => {
        s.collectionRef.value = p.value;
      }), () => gt(Rs, {
        ref: f,
        ...h
      }, d);
    }
  }), a = /* @__PURE__ */ ee({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = $s();
      return Nt((g) => {
        if (p.value) {
          const _ = ea(p.value);
          s.itemMap.value.set(_, {
            ref: p.value,
            value: c.value
          }), g(() => s.itemMap.value.delete(_));
        }
      }), () => gt(Rs, {
        ...h,
        [po]: "",
        ref: f
      }, d);
    }
  }), l = B(() => Array.from(s.itemMap.value.values())), u = B(() => s.itemMap.value.size);
  return {
    getItems: r,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const zh = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Bh(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Nh(t, e, n) {
  const i = Bh(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return zh[i];
}
function jh(t, e = !1) {
  const n = bt();
  for (const i of t)
    if (i === n || (i.focus({ preventScroll: e }), bt() !== n)) return;
}
function Hh(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
const [Wh] = Yn("RovingFocusGroup");
var Vh = /* @__PURE__ */ ee({
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
    const e = t, n = Wh(), i = Ls(), s = B(() => e.tabStopId || i), r = B(() => n.currentTabStopId.value === s.value), { getItems: o, CollectionItem: a } = Fh();
    qe(() => {
      e.focusable && n.onFocusableItemAdd();
    }), en(() => {
      e.focusable && n.onFocusableItemRemove();
    });
    function l(u) {
      if (u.key === "Tab" && u.shiftKey) {
        n.onItemShiftTab();
        return;
      }
      if (u.target !== u.currentTarget) return;
      const c = Nh(u, n.orientation.value, n.dir.value);
      if (c !== void 0) {
        if (u.metaKey || u.ctrlKey || u.altKey || !e.allowShiftKey && u.shiftKey) return;
        u.preventDefault();
        let d = [...o().map((h) => h.ref).filter((h) => h.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const h = d.indexOf(u.currentTarget);
          d = n.loop.value ? Hh(d, h + 1) : d.slice(h + 1);
        }
        at(() => jh(d));
      }
    }
    return (u, c) => (P(), K(m(a), null, {
      default: se(() => [U(m(Lt), {
        tabindex: r.value ? 0 : -1,
        "data-orientation": m(n).orientation.value,
        "data-active": u.active ? "" : void 0,
        "data-disabled": u.focusable ? void 0 : "",
        as: u.as,
        "as-child": u.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          u.focusable ? m(n).onItemFocus(s.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => m(n).onItemFocus(s.value)),
        onKeydown: l
      }, {
        default: se(() => [ye(u.$slots, "default")]),
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
}), qh = Vh, Uh = /* @__PURE__ */ ee({
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
    return (e, n) => (P(), K(m(Lt), {
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
      default: se(() => [ye(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Kh = Uh, Gh = /* @__PURE__ */ ee({
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
    const e = t, { primitiveElement: n, currentElement: i } = $s(), s = B(() => e.checked ?? e.value);
    return ve(s, (r, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && r !== o) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, r), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (r, o) => (P(), K(Kh, Be({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...r.$attrs
    }, { as: "input" }), null, 16));
  }
}), vo = Gh, Xh = /* @__PURE__ */ ee({
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
    const e = t, n = B(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = B(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((s, r) => typeof s == "object" ? Object.entries(s).map(([o, a]) => ({
      name: `${e.name}[${r}][${o}]`,
      value: a
    })) : {
      name: `${e.name}[${r}]`,
      value: s
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([s, r]) => ({
      name: `${e.name}[${s}]`,
      value: r
    })) : []);
    return (s, r) => (P(), Q(be, null, [oe(" We render single input if it's required "), n.value ? (P(), K(vo, Be({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (P(!0), Q(be, { key: 1 }, vn(i.value, (o) => (P(), K(vo, Be({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Yh = Xh;
const [Jh] = Yn("CheckboxGroupRoot");
function Ei(t) {
  return t === "indeterminate";
}
function dl(t) {
  return Ei(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
const [Zh, Qh] = Yn("CheckboxRoot");
var ep = /* @__PURE__ */ ee({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = tt(), o = Jh(null), a = /* @__PURE__ */ rl(n, "modelValue", i, {
      defaultValue: n.defaultValue,
      passive: n.modelValue === void 0
    }), l = B(() => o?.disabled.value || n.disabled), u = B(() => Ti(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : lo(o.modelValue.value, n.value));
    function c() {
      if (Ti(o?.modelValue.value))
        a.value = Ei(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (lo(f, n.value)) {
          const p = f.findIndex((g) => Os(g, n.value));
          f.splice(p, 1);
        } else f.push(n.value);
        o.modelValue.value = f;
      }
    }
    const d = qf(r), h = B(() => n.id && r.value ? document.querySelector(`[for="${n.id}"]`)?.innerText : void 0);
    return Qh({
      disabled: l,
      state: u
    }), (f, p) => (P(), K(xa(m(o)?.rovingFocus.value ? m(qh) : m(Lt)), Be(f.$attrs, {
      id: f.id,
      ref: m(s),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": m(Ei)(u.value) ? "mixed" : u.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || h.value,
      "data-state": m(dl)(u.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: m(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: ld(tr(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: se(() => [ye(f.$slots, "default", {
        modelValue: m(a),
        state: u.value
      }), m(d) && f.name && !m(o) ? (P(), K(m(Yh), {
        key: 0,
        type: "checkbox",
        checked: !!u.value,
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
      ])) : oe("v-if", !0)]),
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
}), tp = ep, np = /* @__PURE__ */ ee({
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
    const { forwardRef: e } = tt(), n = Zh();
    return (i, s) => (P(), K(m(ar), { present: i.forceMount || m(Ei)(m(n).state.value) || m(n).state.value === !0 }, {
      default: se(() => [U(m(Lt), Be({
        ref: m(e),
        "data-state": m(dl)(m(n).state.value),
        "data-disabled": m(n).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": i.asChild,
        as: i.as
      }, i.$attrs), {
        default: se(() => [ye(i.$slots, "default")]),
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
}), ip = np;
const sp = /* @__PURE__ */ ee({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: { type: String }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (e, n) => (P(), K(m(tp), {
      "model-value": t.modelValue,
      "aria-label": t.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": n[0] || (n[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: n[1] || (n[1] = tr(() => {
      }, ["stop"]))
    }, {
      default: se(() => [
        U(m(ip), { class: "checkbox-indicator" }, {
          default: se(() => [
            U(m(Ja), {
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
}), rp = ".checkbox[data-v-024ee78b]{all:unset;width:16px;height:16px;flex-shrink:0;border:1.5px solid var(--color-border);border-radius:var(--radius-sm);background-color:var(--color-surface);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color var(--transition-duration),border-color var(--transition-duration)}.checkbox[data-v-024ee78b]:hover{border-color:var(--color-primary)}.checkbox[data-v-024ee78b]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.checkbox[data-state=checked][data-v-024ee78b]{background-color:var(--color-primary);border-color:var(--color-primary)}.checkbox-indicator[data-v-024ee78b]{color:var(--color-white, #fff);display:inline-flex;align-items:center;justify-content:center}", op = /* @__PURE__ */ we(sp, [["styles", [rp]], ["__scopeId", "data-v-024ee78b"]]);
function ap() {
  const t = /* @__PURE__ */ new Map();
  function e(r, o) {
    let a = t.get(r);
    return a || (a = /* @__PURE__ */ new Set(), t.set(r, a)), a.add(o), () => n(r, o);
  }
  function n(r, o) {
    t.get(r)?.delete(o);
  }
  function i(r, o) {
    t.get(r)?.forEach(
      (a) => a(o)
    );
  }
  function s() {
    t.clear();
  }
  return { on: e, off: n, emit: i, clear: s };
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
function lp(t, e, n) {
  const i = mo[t.size % mo.length];
  return { id: e, name: n, color: i };
}
function cp(t, e, n) {
  return !e || t.has(e) ? null : lp(t, e, n ?? e);
}
function up(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function dp(t) {
  const e = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  function n(r, o) {
    const a = cp(e, r, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(r, o) {
    const a = up(e, r, o);
    a && (e.set(r, a), t("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: s };
}
function fp(t, e) {
  return [...t, e];
}
function hp(t, e) {
  return [...e, ...t];
}
function lr(t, e) {
  return t.findIndex((n) => n.id === e);
}
function pp(t, e, n) {
  const i = lr(t, e);
  if (i === -1) return null;
  const s = { ...t[i], ...n, id: e }, r = t.slice();
  return r[i] = s, { turns: r, updated: s };
}
function vp(t, e) {
  const n = lr(t, e);
  return n === -1 ? null : t.filter((i, s) => s !== n);
}
function mp(t, e, n) {
  const i = lr(t, e);
  if (i === -1) return null;
  const s = t[i], r = {
    ...s,
    words: n,
    text: null,
    startTime: n[0]?.startTime ?? s.startTime,
    endTime: n[n.length - 1]?.endTime ?? s.endTime
  }, o = t.slice();
  return o[i] = r, { turns: o, updated: r };
}
function Fs(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function gp(t, e, n) {
  const { id: i, languages: s, isSource: r, audio: o } = t, a = /* @__PURE__ */ fn(t.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const y = a.value;
    for (let E = 0; E < y.length; E++)
      l.set(y[E].id, E);
  }
  u();
  function c(y) {
    n(y.speakerId), l.set(y.id, a.value.length), a.value = fp(a.value, y), e("turn:add", { turn: y, translationId: i });
  }
  function d(y, E) {
    const T = pp(a.value, y, E);
    T && (a.value = T.turns, e("turn:update", { turn: T.updated, translationId: i }));
  }
  function h(y) {
    const E = vp(a.value, y);
    E && (a.value = E, u(), e("turn:remove", { turnId: y, translationId: i }));
  }
  function f(y, E) {
    const T = mp(a.value, y, E);
    T && (a.value = T.turns, e("turn:update", { turn: T.updated, translationId: i }));
  }
  function p(y) {
    Fs(y, n), a.value = hp(a.value, y), u();
  }
  function g(y) {
    Fs(y, n), a.value = y, u(), e("translation:sync", { translationId: i });
  }
  function _(y) {
    a.value = y, u();
  }
  function x(y) {
    const E = l.get(y.id);
    E !== void 0 ? a.value[E] = y : (l.set(y.id, a.value.length), a.value.push(y));
  }
  function w(y) {
    return l.has(y);
  }
  function S(y) {
    const E = l.get(y);
    if (E !== void 0)
      return a.value[E];
  }
  return {
    id: i,
    languages: s,
    isSource: r,
    audio: o,
    turns: a,
    addTurn: c,
    prependTurns: p,
    updateTurn: d,
    removeTurn: h,
    updateWords: f,
    setTurns: g,
    replaceTurns: _,
    updateOrCreateTurnSilent: x,
    hasTurn: w,
    getTurn: S
  };
}
const fl = "cross";
function ds(t) {
  return t.split("-")[0];
}
function bp(t, e) {
  const n = t.languages.map(ds);
  if (n.length !== 2) return null;
  const i = /* @__PURE__ */ new Map();
  for (const l of e.values())
    if (l.id !== t.id) {
      if (l.languages.length != 1 || !l.languages[0])
        return null;
      i.set(ds(l.languages[0]), l);
    }
  for (const l of n)
    if (!i.has(l))
      return null;
  const [s, r] = n;
  if (!s || !r) return null;
  const o = B(
    () => t.turns.value.map((l) => a(l.id) ?? l)
  );
  function a(l) {
    const u = t.getTurn(l);
    if (!u) return;
    const c = ds(u.language) === s ? r : s;
    if (!c) return u;
    const d = i.get(c)?.getTurn(l);
    return d || u;
  }
  return {
    id: fl,
    isSource: !1,
    languages: t.languages,
    turns: o,
    getTurn: a
  };
}
function go(t, e, n) {
  const { id: i, name: s, description: r, duration: o } = t, a = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  let l;
  for (const x of t.translations) {
    const w = gp(x, e, n);
    a.set(x.id, w), x.isSource && !l && (l = w);
  }
  l || (l = a.values().next().value);
  const u = bp(l, a), c = [...a.values()];
  u && c.push(u);
  const d = /* @__PURE__ */ q(null), h = /* @__PURE__ */ q(!1), f = /* @__PURE__ */ q(!0), p = B(() => {
    const x = d.value;
    return x === fl ? u ?? l : x ? a.get(x) ?? l : l;
  });
  function g(x) {
    const w = x === l.id ? null : x;
    w !== d.value && (d.value = w, e("translation:change", { translationId: p.value.id }));
  }
  function _() {
    for (const x of a.values())
      x.setTurns([]);
    h.value = !1, f.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: s,
    description: r,
    duration: o,
    translations: a,
    sourceTranslation: l,
    crossTranslation: u,
    selectableTranslations: c,
    activeTranslation: p,
    isLoadingHistory: h,
    hasMoreHistory: f,
    setActiveTranslation: g,
    reset: _
  };
}
function yp(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, s] of t.speakers)
    e.add(i), n.push({ id: i, name: s.name });
  for (const i of t.channels)
    for (const s of i.translations)
      for (const r of s.turns)
        r.speakerId && !e.has(r.speakerId) && (e.add(r.speakerId), n.push({ id: r.speakerId, name: r.speakerId }));
  return n;
}
function _p(t = {}) {
  const e = /* @__PURE__ */ q(""), n = /* @__PURE__ */ q(t.activeChannelId ?? ""), i = /* @__PURE__ */ q(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: r, emit: o, clear: a } = ap(), l = dp(o), u = l, c = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map()), d = B(
    () => c.get(n.value) ?? [...c.values()][0]
  );
  function h(T, k) {
    return s(T, (H) => {
      H.translationId === d.value.activeTranslation.value.id && k(H);
    });
  }
  function f(T) {
    e.value = T.title, l.clear(), c.clear();
    for (const k of yp(T))
      u.ensure(k.id, k.name);
    for (const k of T.channels)
      c.set(k.id, go(k, o, u.ensure));
    c.size > 0 && !c.has(n.value) && (n.value = c.keys().next().value);
  }
  function p(T) {
    Yd(T), f(T);
  }
  function g(T) {
    T !== n.value && (n.value = T, o("channel:change", { channelId: T }));
  }
  function _(T, k) {
    if (c.has(T)) {
      for (const H of k.translations)
        Fs(H.turns, u.ensure);
      c.set(T, go(k, o, u.ensure)), o("channel:sync", { channelId: T });
    }
  }
  const x = [], w = [];
  function S(T) {
    T.tiptapExtensions && w.push(...T.tiptapExtensions);
    const k = T.install(E);
    k && x.push(k);
  }
  function y() {
    o("destroy", void 0), x.forEach((T) => T()), x.length = 0, a();
  }
  t.document && f(t.document);
  const E = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: w,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: p,
    setActiveChannel: g,
    setChannel: _,
    on: s,
    off: r,
    emit: o,
    use: S,
    destroy: y
  };
  return E;
}
const hl = /* @__PURE__ */ Symbol("editorStore");
function wp(t) {
  pn(hl, t);
}
function Wt() {
  const t = Et(hl);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const pl = /* @__PURE__ */ Symbol("turnSelection");
function bo(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function xp(t, e, n) {
  const i = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  let s = null;
  const r = B(() => i.size), o = B(() => i.size > 0);
  function a(x) {
    return i.has(x);
  }
  function l(x) {
    i.has(x) ? i.delete(x) : i.set(x, !0), s = x;
  }
  function u(x) {
    if (s === null) {
      l(x);
      return;
    }
    const w = t.value.map((k) => k.id), S = w.indexOf(s), y = w.indexOf(x);
    if (S === -1 || y === -1) {
      l(x);
      return;
    }
    const E = Math.min(S, y), T = Math.max(S, y);
    for (let k = E; k <= T; k++) {
      const H = w[k];
      H != null && i.set(H, !0);
    }
  }
  function c() {
    i.clear(), s = null;
  }
  async function d() {
    const w = t.value.filter((S) => i.has(S.id)).map(bo).join(`

`);
    await navigator.clipboard.writeText(w);
  }
  async function h() {
    const w = t.value.filter((S) => i.has(S.id)).map((S) => {
      const E = (S.speakerId ? e.get(S.speakerId) : void 0)?.name ?? "", T = S.startTime != null ? Wn(S.startTime) : "", k = [E, T].filter(Boolean).join(" (") + (T ? ")" : ""), H = bo(S);
      return k ? `${k}
${H}` : H;
    });
    await navigator.clipboard.writeText(w.join(`

`));
  }
  ve(
    () => t.value,
    (x) => {
      if (i.size === 0) return;
      const w = new Set(x.map((S) => S.id));
      for (const S of [...i.keys()])
        w.has(S) || i.delete(S);
    }
  );
  const f = n.on("channel:change", c), p = n.on("translation:change", c);
  function g(x) {
    x.key === "Escape" && i.size > 0 && c();
  }
  qe(() => {
    document.addEventListener("keydown", g);
  }), yt(() => {
    document.removeEventListener("keydown", g), f(), p();
  });
  const _ = {
    count: r,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: u,
    clear: c,
    copyText: d,
    copyWithMetadata: h
  };
  return pn(pl, _), _;
}
function vl() {
  const t = Et(pl);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const Sp = ["data-turn-active", "aria-selected"], Cp = { class: "turn-text" }, kp = ["data-word-active"], Tp = /* @__PURE__ */ ee({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Wt(), i = vl(), { t: s } = et(), r = B(() => e.turn.words.length > 0), o = B(() => {
      if (!n.audio?.src.value || !r.value) return null;
      const f = n.audio.currentTime.value, { startTime: p, endTime: g, words: _ } = e.turn;
      return p == null || g == null || f < p || f > g ? null : Zd(_, f);
    }), a = B(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || tl(e.turn.words)) return !1;
      const f = n.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = B(() => e.speaker?.color ?? "transparent"), u = B(() => i.isSelected(e.turn.id)), c = B(() => {
      const f = e.speaker?.name ?? "", p = u.value ? "selection.deselect" : "selection.select";
      return s(p).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function h(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, p) => (P(), Q("section", {
      class: Ze(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: Ot({ "--speaker-color": l.value }),
      "aria-selected": m(i).hasSelection.value ? u.value : void 0
    }, [
      t.partial ? oe("", !0) : (P(), Q("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        m(i).hasSelection.value ? (P(), K(op, {
          key: 0,
          "model-value": u.value,
          "aria-label": c.value,
          onClick: tr(h, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : oe("", !0),
        U(Sf, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          "start-date": t.turn.startDate,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      Z("p", Cp, [
        r.value ? (P(!0), Q(be, { key: 0 }, vn(t.turn.words, (g, _) => (P(), Q(be, {
          key: g.id
        }, [
          Z("span", {
            class: Ze({ "word--active": g.id === o.value }),
            "data-word-active": g.id === o.value || void 0
          }, re(g.text), 11, kp),
          Ge(re(_ < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (P(), Q(be, { key: 1 }, [
          Ge(re(t.turn.text), 1)
        ], 64)) : oe("", !0)
      ])
    ], 14, Sp));
  }
}), Ep = ".turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-218f5091]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn[data-v-218f5091]:has(.turn-header:hover){background-color:var(--color-surface-hover)}.turn-text[data-v-218f5091]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-218f5091]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-218f5091]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-218f5091]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-218f5091]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-218f5091 .2s ease}@keyframes partial-fade-in-218f5091{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-218f5091]{animation:none}}@media(max-width:767px){.turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-218f5091],.turn--active[data-v-218f5091]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", yo = /* @__PURE__ */ we(Tp, [["styles", [Ep]], ["__scopeId", "data-v-218f5091"]]), Ap = {}, Pp = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Mp(t, e) {
  return P(), Q("svg", Pp, [...e[0] || (e[0] = [
    wu('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Ip = /* @__PURE__ */ we(Ap, [["render", Mp]]), Op = { class: "transcription-empty" }, Dp = { class: "message" }, Lp = /* @__PURE__ */ ee({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = et();
    return (n, i) => (P(), Q("div", Op, [
      U(Ip, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      Z("p", Dp, re(m(e)("transcription.empty")), 1)
    ]));
  }
}), Rp = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", $p = /* @__PURE__ */ we(Lp, [["styles", [Rp]], ["__scopeId", "data-v-f82737e5"]]), Fp = { class: "transcription-panel" }, zp = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Bp = { class: "turns-container" }, Np = {
  key: 0,
  class: "history-loading",
  role: "status"
}, jp = {
  key: 1,
  class: "history-start"
}, Hp = /* @__PURE__ */ ee({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = et(), i = Wt(), s = Bn("scrollContainer"), r = B(() => {
      const w = i.live?.partial.value ?? null;
      return w === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: w,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = B(() => i.live?.hasLiveUpdate.value ?? !1), a = B(() => i.audio?.isPlaying.value ?? !1), l = B(
      () => i.activeChannel.value.activeTranslation.value
    ), u = B(() => i.activeChannel.value), c = B(
      () => u.value.isLoadingHistory.value
    ), d = B(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: f, isAtBottom: p, scrollToBottom: g } = pf();
    qe(() => {
      h.value = s.value, f.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const _ = Gd(() => {
      const w = u.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function x() {
      const w = s.value;
      w && w.scrollTop < 100 && _();
    }
    return ve(
      () => e.turns,
      (w, S) => {
        const y = w.length, E = S.length;
        if (y > E && !p.value && w[0]?.id != S[0]?.id) {
          const T = y - E, k = e.turns[T]?.id;
          if (!k || !h.value) return;
          at(() => {
            h.value?.querySelector(
              `[data-turn-id="${k}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), qe(() => {
      s.value?.addEventListener("scroll", x, {
        passive: !0
      });
    }), yt(() => {
      s.value?.removeEventListener("scroll", x);
    }), (w, S) => (P(), Q("article", Fp, [
      Z("div", zp, [
        Z("div", Bp, [
          c.value ? (P(), Q("div", Np, [...S[3] || (S[3] = [
            Z("progress", null, null, -1)
          ])])) : oe("", !0),
          !d.value && t.turns.length > 0 ? (P(), Q("div", jp, re(m(n)("transcription.historyStart")), 1)) : oe("", !0),
          t.turns.length === 0 && !c.value && !r.value ? (P(), K($p, {
            key: 2,
            class: "transcription-empty"
          })) : oe("", !0),
          (P(!0), Q(be, null, vn(t.turns, (y, E, T, k) => {
            const H = [
              y,
              t.speakers.get(y.speakerId ?? ""),
              o.value && !r.value && E === t.turns.length - 1
            ];
            if (k && k.key === y.id && Mu(k, H)) return k;
            const A = (P(), K(yo, {
              "data-turn-id": y.id,
              key: y.id,
              turn: y,
              speaker: y.speakerId ? t.speakers.get(y.speakerId) : void 0,
              live: o.value && !r.value && E === t.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return A.memo = H, A;
          }, S, 0), 128)),
          r.value ? (P(), K(yo, {
            key: "__partial__",
            turn: r.value,
            partial: ""
          }, null, 8, ["turn"])) : oe("", !0)
        ]),
        U(Qs, { name: "fade-slide" }, {
          default: se(() => [
            !m(p) && (a.value || o.value) ? (P(), K(Je, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": m(n)("transcription.resumeScroll"),
              onClick: S[2] || (S[2] = (y) => m(g)())
            }, {
              default: se(() => [
                Ge(re(m(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : oe("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Wp = ".transcription-panel[data-v-a27efea3]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-a27efea3]{height:100%;overflow:auto;position:relative}.turns-container[data-v-a27efea3]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-a27efea3]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-a27efea3]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-a27efea3]{width:120px}.history-start[data-v-a27efea3]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-a27efea3]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-a27efea3],.fade-slide-leave-active[data-v-a27efea3]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-a27efea3],.fade-slide-leave-to[data-v-a27efea3]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-a27efea3],.fade-slide-leave-active[data-v-a27efea3]{transition:none}}@media(max-width:767px){.turns-container[data-v-a27efea3]{padding:var(--spacing-md)}}", Vp = /* @__PURE__ */ we(Hp, [["styles", [Wp]], ["__scopeId", "data-v-a27efea3"]]), qp = { class: "switch" }, Up = ["id", "checked"], Kp = ["for"], Gp = /* @__PURE__ */ ee({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, s = n.id ?? Gs();
    return (r, o) => (P(), Q("div", qp, [
      Z("input", {
        type: "checkbox",
        id: m(s),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Up),
      Z("label", { for: m(s) }, [...o[1] || (o[1] = [
        Z("div", { class: "switch-slider" }, null, -1)
      ])], 8, Kp)
    ]));
  }
}), Xp = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", fs = /* @__PURE__ */ we(Gp, [["styles", [Xp]], ["__scopeId", "data-v-2aa0332f"]]), Yp = { class: "sidebar-select-field" }, Jp = ["for"], Zp = ["id", "value", "aria-label"], Qp = ["value"], ev = /* @__PURE__ */ ee({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String },
    label: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, i = Gs();
    return (s, r) => (P(), Q("div", Yp, [
      t.label ? (P(), Q("label", {
        key: 0,
        for: m(i),
        class: "sidebar-select-label"
      }, re(t.label), 9, Jp)) : oe("", !0),
      Z("select", {
        id: m(i),
        class: "sidebar-select",
        value: t.selectedValue,
        "aria-label": t.label ? void 0 : t.ariaLabel,
        onChange: r[0] || (r[0] = (o) => n("update:selectedValue", o.target.value))
      }, [
        (P(!0), Q(be, null, vn(t.items, (o) => (P(), Q("option", {
          key: o.value,
          value: o.value
        }, re(o.label), 9, Qp))), 128))
      ], 40, Zp)
    ]));
  }
}), tv = ".sidebar-select-field[data-v-fc926569]{display:flex;flex-direction:column;gap:var(--spacing-xs)}.sidebar-select-label[data-v-fc926569]{font-size:var(--font-size-xs);color:var(--color-text-primary)}", ml = /* @__PURE__ */ we(ev, [["styles", [tv]], ["__scopeId", "data-v-fc926569"]]), gl = /* @__PURE__ */ ee({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s } = et(), r = B(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (P(), K(ml, {
      items: r.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: m(s)("header.channelLabel"),
      label: m(s)("sidebar.channelSelectLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), nv = { class: "translation-row" }, iv = {
  key: 0,
  class: "translation-row-badge"
}, sv = {
  key: 0,
  class: "translation-trigger-badge"
}, rv = /* @__PURE__ */ ee({
  __name: "TranslationSelector",
  props: {
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedTranslationId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s, locale: r } = et(), o = B(
      () => Kd(
        n.translations,
        r.value,
        s("sidebar.originalLanguage"),
        s("language.wildcard"),
        s("sidebar.bilingual")
      )
    );
    return (a, l) => (P(), K(ml, {
      items: o.value,
      "selected-value": t.selectedTranslationId,
      ariaLabel: m(s)("sidebar.translationLabel"),
      label: m(s)("sidebar.translationSelectLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (u) => i("update:selectedTranslationId", u))
    }, {
      item: se(({ item: u }) => [
        Z("span", nv, [
          u.originalLabel ? (P(), Q("strong", iv, re(u.originalLabel), 1)) : oe("", !0),
          Z("span", null, re(u.label), 1)
        ])
      ]),
      trigger: se(({ item: u }) => [
        u?.originalLabel ? (P(), Q("span", sv, re(u.originalLabel), 1)) : oe("", !0),
        Z("span", null, re(u?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), ov = ".translation-row[data-v-988a9770]{display:flex;flex-direction:column;gap:2px}.translation-row-badge[data-v-988a9770]{font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}.translation-trigger-badge[data-v-988a9770]{font-variant-caps:all-small-caps;color:var(--color-text-muted);margin-right:var(--spacing-xs);letter-spacing:.05em}", bl = /* @__PURE__ */ we(rv, [["styles", [ov]], ["__scopeId", "data-v-988a9770"]]), av = { class: "speaker-sidebar" }, lv = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, cv = { class: "sidebar-title" }, uv = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, dv = { class: "sidebar-title" }, fv = {
  key: 2,
  class: "sidebar-section"
}, hv = { class: "sidebar-title" }, pv = { class: "subtitle-toggle" }, vv = { class: "subtitle-toggle-label" }, mv = { class: "subtitle-slider" }, gv = { class: "subtitle-slider-label" }, bv = { class: "subtitle-slider-value" }, yv = ["value", "disabled"], _v = {
  key: 0,
  class: "subtitle-toggle"
}, wv = { class: "subtitle-toggle-label" }, xv = {
  key: 1,
  class: "subtitle-toggle"
}, Sv = { class: "subtitle-toggle-label" }, Cv = {
  key: 3,
  class: "sidebar-section"
}, kv = { class: "sidebar-title" }, Tv = { class: "speaker-list" }, Ev = { class: "speaker-name" }, Av = /* @__PURE__ */ ee({
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
    const e = Wt(), { t: n } = et();
    return (i, s) => (P(), Q("aside", av, [
      t.channels.length > 1 ? (P(), Q("section", lv, [
        Z("h2", cv, re(m(n)("sidebar.channel")), 1),
        U(gl, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": s[0] || (s[0] = (r) => i.$emit("update:selectedChannelId", r))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : oe("", !0),
      t.translations.length > 1 ? (P(), Q("section", uv, [
        Z("h2", dv, re(m(n)("sidebar.translation")), 1),
        U(bl, {
          translations: t.translations,
          "selected-translation-id": t.selectedTranslationId,
          "onUpdate:selectedTranslationId": s[1] || (s[1] = (r) => i.$emit("update:selectedTranslationId", r))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : oe("", !0),
      m(e).subtitle ? (P(), Q("section", fv, [
        Z("h2", hv, re(m(n)("sidebar.subtitle")), 1),
        Z("div", pv, [
          Z("span", vv, re(m(n)("subtitle.show")), 1),
          U(fs, {
            modelValue: m(e).subtitle.isVisible.value,
            "onUpdate:modelValue": s[2] || (s[2] = (r) => m(e).subtitle.isVisible.value = r)
          }, null, 8, ["modelValue"])
        ]),
        Z("label", mv, [
          Z("span", gv, [
            Ge(re(m(n)("subtitle.fontSize")) + " ", 1),
            Z("span", bv, re(m(e).subtitle.fontSize.value) + "px", 1)
          ]),
          Z("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: m(e).subtitle.fontSize.value,
            disabled: !m(e).subtitle.isVisible.value,
            onInput: s[3] || (s[3] = (r) => m(e).subtitle.fontSize.value = Number(r.target.value))
          }, null, 40, yv)
        ]),
        m(e).subtitle.watermark && !m(e).subtitle.watermark.readonly ? (P(), Q("div", _v, [
          Z("span", wv, re(m(n)("subtitle.showWatermark")), 1),
          U(fs, {
            modelValue: m(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": s[4] || (s[4] = (r) => m(e).subtitle.watermark.display.value = r),
            disabled: !m(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : oe("", !0),
        m(e).subtitle.watermark && !m(e).subtitle.watermark.readonly && m(e).subtitle.watermark.display.value ? (P(), Q("div", xv, [
          Z("span", Sv, re(m(n)("subtitle.pinWatermark")), 1),
          U(fs, {
            modelValue: m(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": s[5] || (s[5] = (r) => m(e).subtitle.watermark.pinned.value = r),
            disabled: !m(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : oe("", !0)
      ])) : oe("", !0),
      t.speakers.length ? (P(), Q("section", Cv, [
        Z("h2", kv, re(m(n)("sidebar.speakers")), 1),
        Z("ul", Tv, [
          (P(!0), Q(be, null, vn(t.speakers, (r) => (P(), Q("li", {
            key: r.id,
            class: "speaker-item"
          }, [
            U(nl, {
              color: r.color
            }, null, 8, ["color"]),
            Z("span", Ev, re(r.name), 1)
          ]))), 128))
        ])
      ])) : oe("", !0)
    ]));
  }
}), Pv = ".speaker-sidebar[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-749c56f0]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-749c56f0]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-749c56f0]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-749c56f0]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-749c56f0]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-749c56f0]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-749c56f0]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-749c56f0]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-749c56f0]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-749c56f0]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-749c56f0]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-749c56f0]{border-left:none}.sidebar-section--selector[data-v-749c56f0]{display:none}}", _o = /* @__PURE__ */ we(Av, [["styles", [Pv]], ["__scopeId", "data-v-749c56f0"]]), Mv = /* @__PURE__ */ ee({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = tu(t, "open"), { t: n } = et();
    return (i, s) => (P(), K(m(nh), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (r) => e.value = r)
    }, {
      default: se(() => [
        U(m(Lh), { disabled: "" }, {
          default: se(() => [
            U(m(Mh), { class: "editor-overlay" }),
            U(m(Th), { class: "sidebar-drawer" }, {
              default: se(() => [
                U(m($h), { class: "sr-only" }, {
                  default: se(() => [
                    Ge(re(m(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                U(m(sh), {
                  class: "sidebar-close",
                  "aria-label": m(n)("header.closeSidebar")
                }, {
                  default: se(() => [
                    U(m(nr), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                ye(i.$slots, "default")
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
}), Iv = { class: "player-controls" }, Ov = { class: "controls-left" }, Dv = { class: "controls-time" }, Lv = { class: "time-display" }, Rv = { class: "time-display" }, $v = { class: "controls-right" }, Fv = ["value", "aria-label", "disabled"], zv = /* @__PURE__ */ ee({
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
    const n = e, { t: i } = et(), s = /* @__PURE__ */ q(!1);
    function r(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (P(), Q("div", Iv, [
      Z("div", Ov, [
        U(Je, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": m(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        U(Je, {
          variant: "transparent",
          icon: t.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": t.isPlaying ? m(i)("player.pause") : m(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        U(Je, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": m(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      Z("div", Dv, [
        Z("time", Lv, re(t.currentTime), 1),
        a[7] || (a[7] = Z("span", { class: "time-separator" }, "/", -1)),
        Z("time", Rv, re(t.duration), 1)
      ]),
      Z("div", $v, [
        Z("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          U(Je, {
            variant: "transparent",
            icon: t.isMuted ? "volume-mute" : "volume",
            "aria-label": t.isMuted ? m(i)("player.unmute") : m(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          Sc(Z("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": m(i)("player.volume"),
            disabled: !t.isReady,
            onInput: r
          }, null, 40, Fv), [
            [Hu, s.value]
          ])
        ], 32),
        U(Je, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": m(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: se(() => [
            Ge(re(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Bv = ".player-controls[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-2dcb93b1]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-2dcb93b1]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-2dcb93b1]:disabled{opacity:.5;cursor:default}.play-button[data-v-2dcb93b1]{--btn-height: 40px;--btn-icon-size: 20px}.speed-button[data-v-2dcb93b1]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-2dcb93b1],.volume-slider[data-v-2dcb93b1]{display:none}.player-controls[data-v-2dcb93b1]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Nv = /* @__PURE__ */ we(zv, [["styles", [Bv]], ["__scopeId", "data-v-2dcb93b1"]]);
function Fe(t, e, n, i) {
  return new (n || (n = Promise))((function(s, r) {
    function o(u) {
      try {
        l(i.next(u));
      } catch (c) {
        r(c);
      }
    }
    function a(u) {
      try {
        l(i.throw(u));
      } catch (c) {
        r(c);
      }
    }
    function l(u) {
      var c;
      u.done ? s(u.value) : (c = u.value, c instanceof n ? c : new n((function(d) {
        d(c);
      }))).then(o, a);
    }
    l((i = i.apply(t, e || [])).next());
  }));
}
let Jn = class {
  constructor() {
    this.listeners = {};
  }
  on(e, n, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...r) => {
        this.un(e, s), n(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
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
const oi = { decode: function(t, e) {
  return Fe(this, void 0, void 0, (function* () {
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
    const s = i[0];
    if (s.some(((r) => r > 1 || r < -1))) {
      const r = s.length;
      let o = 0;
      for (let a = 0; a < r; a++) {
        const l = Math.abs(s[a]);
        l > o && (o = l);
      }
      for (const a of i) for (let l = 0; l < r; l++) a[l] /= o;
    }
  })(t);
  const n = t.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: n[0].length, sampleRate: n[0].length / e, numberOfChannels: n.length, getChannelData: (i) => {
    const s = n[i];
    if (!s) throw new Error(`Channel ${i} not found`);
    return s;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function yl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(yl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function wo(t, e, n) {
  const i = yl(t, e || {});
  return n?.appendChild(i), i;
}
var jv = Object.freeze({ __proto__: null, createElement: wo, default: wo });
const Hv = { fetchBlob: function(t, e, n) {
  return Fe(this, void 0, void 0, (function* () {
    const i = yield fetch(t, n);
    if (i.status >= 400) throw new Error(`Failed to fetch ${t}: ${i.status} (${i.statusText})`);
    return (function(s, r) {
      Fe(this, void 0, void 0, (function* () {
        if (!s.body || !s.headers) return;
        const o = s.body.getReader(), a = Number(s.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          r(d);
        };
        try {
          for (; ; ) {
            const c = yield o.read();
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
function Se(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, n.forEach(((s) => s(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (n.add(i), () => n.delete(i)) };
}
function Jt(t, e) {
  const n = Se(t());
  return e.forEach(((i) => i.subscribe((() => {
    const s = t();
    Object.is(n.value, s) || n.set(s);
  })))), { get value() {
    return n.value;
  }, subscribe: (i) => n.subscribe(i) };
}
function Bt(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, s = e.map(((r) => r.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), s.forEach(((r) => r()));
  };
}
class Wv extends Jn {
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
    const s = n instanceof Blob && (this.canPlayType(n.type) || !e) ? URL.createObjectURL(n) : e;
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
    this.reactiveMediaEventCleanups.forEach(((n) => n())), this.reactiveMediaEventCleanups = [], this.media = e, this.setupReactiveMediaEvents();
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
function Vv({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: s = 0, barAlign: r }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < s && (a = s, r || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function qv({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: s }) {
  return t === "top" ? 0 : t === "bottom" ? s - i : e - n;
}
function xo(t, e, n) {
  const i = e - t.left, s = n - t.top;
  return [i / t.width, s / t.height];
}
function _l(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function So(t, e) {
  if (!_l(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function Co({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, s = Math.floor(i * n);
  return [s - 1, s, s + 1];
}
function wl(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Uv(t) {
  const e = Se({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Jt((() => (function(r) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = r;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = o / a, c = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Jt((() => (function(r) {
    return { left: r.scrollLeft, right: r.scrollLeft + r.clientWidth };
  })(e.value)), [e]), s = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", s, { passive: !0 }), { scrollData: e, percentages: n, bounds: i, cleanup: () => {
    t.removeEventListener("scroll", s), wl(e);
  } };
}
class Kv extends Jn {
  constructor(e, n) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [s, r] = this.initHtml();
    i.appendChild(s), this.container = s, this.scrollContainer = r.querySelector(".scroll"), this.wrapper = r.querySelector(".wrapper"), this.canvasWrapper = r.querySelector(".canvases"), this.progressWrapper = r.querySelector(".progress"), this.cursor = r.querySelector(".cursor"), n && r.appendChild(n), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let n;
    if (typeof e == "string" ? n = document.querySelector(e) : e instanceof HTMLElement && (n = e), !n) throw new Error("Container not found");
    return n;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = xo(i, n.clientX, n.clientY);
      this.emit("click", s, r);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = xo(i, n.clientX, n.clientY);
      this.emit("dblclick", s, r);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Uv(this.scrollContainer);
    const e = Bt((() => {
      const { startX: n, endX: i } = this.scrollStream.percentages.value, { left: s, right: r } = this.scrollStream.bounds.value;
      this.emit("scroll", n, i, s, r);
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
      const { threshold: s = 3, mouseButton: r = 0, touchDelay: o = 100 } = i, a = Se(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== r || (l.set(h.pointerId, h), l.size > 1)) return;
        let f = h.clientX, p = h.clientY, g = !1;
        const _ = Date.now(), x = n.getBoundingClientRect(), { left: w, top: S } = x, y = (A) => {
          if (A.defaultPrevented || l.size > 1 || u && Date.now() - _ < o) return;
          const I = A.clientX, $ = A.clientY, M = I - f, V = $ - p;
          (g || Math.abs(M) > s || Math.abs(V) > s) && (A.preventDefault(), A.stopPropagation(), g || (a.set({ type: "start", x: f - w, y: p - S }), g = !0), a.set({ type: "move", x: I - w, y: $ - S, deltaX: M, deltaY: V }), f = I, p = $);
        }, E = (A) => {
          if (l.delete(A.pointerId), g) {
            const I = A.clientX, $ = A.clientY;
            a.set({ type: "end", x: I - w, y: $ - S });
          }
          c();
        }, T = (A) => {
          l.delete(A.pointerId), A.relatedTarget && A.relatedTarget !== document.documentElement || E(A);
        }, k = (A) => {
          g && (A.stopPropagation(), A.preventDefault());
        }, H = (A) => {
          A.defaultPrevented || l.size > 1 || g && A.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", E), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", H, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", E), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", H), setTimeout((() => {
            document.removeEventListener("click", k, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), n.removeEventListener("pointerdown", d), l.clear(), wl(a);
      } };
    })(this.wrapper);
    const e = Bt((() => {
      const n = this.dragStream.signal.value;
      if (!n) return;
      const i = this.wrapper.getBoundingClientRect().width, s = (r = n.x / i) < 0 ? 0 : r > 1 ? 1 : r;
      var r;
      n.type === "start" ? (this.isDragging = !0, this.emit("dragstart", s)) : n.type === "move" ? this.emit("drag", s) : n.type === "end" && (this.isDragging = !1, this.emit("dragend", s));
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
    const s = () => {
      n && (clearTimeout(n), n = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(s), () => new Promise(((r, o) => {
      s(), i = o, n = setTimeout((() => {
        n = void 0, i = void 0, r();
      }), e);
    }));
  }
  getHeight(e, n) {
    var i;
    const s = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: r, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (r == null) return u;
      const c = Number(r);
      if (!isNaN(c)) return c;
      if (r === "auto") {
        const d = a || u;
        return o?.every(((h) => !h.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: n, parentHeight: this.parent.clientHeight, numberOfChannels: s, defaultHeight: 128 });
  }
  convertColorValues(e, n) {
    return (function(i, s, r) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = r ?? o.height * s, u = a.createLinearGradient(0, 0, 0, l || s), c = 1 / (i.length - 1);
      return i.forEach(((d, h) => {
        u.addColorStop(h * c, d);
      })), u;
    })(e, this.getPixelRatio(), n?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, n, i, s) {
    const { width: r, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: p, height: g, length: _, options: x, pixelRatio: w }) {
      const S = g / 2, y = x.barWidth ? x.barWidth * w : 1, E = x.barGap ? x.barGap * w : x.barWidth ? y / 2 : 0, T = y + E || 1;
      return { halfHeight: S, barWidth: y, barGap: E, barRadius: x.barRadius || 0, barMinHeight: x.barMinHeight ? x.barMinHeight * w : 0, barIndexScale: _ > 0 ? p / T / _ : 0, barSpacing: T };
    })({ width: r, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: p, barIndexScale: g, barSpacing: _, barWidth: x, halfHeight: w, vScale: S, canvasHeight: y, barAlign: E, barMinHeight: T }) {
      const k = p[0] || [], H = p[1] || k, A = k.length, I = [];
      let $ = 0, M = 0, V = 0;
      for (let z = 0; z <= A; z++) {
        const G = Math.round(z * g);
        if (G > $) {
          const { topHeight: le, totalHeight: ke } = Vv({ maxTop: M, maxBottom: V, halfHeight: w, vScale: S, barMinHeight: T, barAlign: E }), lt = qv({ barAlign: E, halfHeight: w, topHeight: le, totalHeight: ke, canvasHeight: y });
          I.push({ x: $ * _, y: lt, width: x, height: ke }), $ = G, M = 0, V = 0;
        }
        const ae = Math.abs(k[z] || 0), te = Math.abs(H[z] || 0);
        ae > M && (M = ae), te > V && (V = te);
      }
      return I;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: o, barAlign: n.barAlign, barMinHeight: h });
    i.beginPath();
    for (const p of f) u && "roundRect" in i ? i.roundRect(p.x, p.y, p.width, p.height, u) : i.rect(p.x, p.y, p.width, p.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, n, i, s) {
    const { width: r, height: o } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, f = l[0] || [];
      return [f, l[1] || f].map(((p, g) => {
        const _ = p.length, x = _ ? u / _ : 0, w = h, S = g === 0 ? -1 : 1, y = [{ x: 0, y: w }];
        let E = 0, T = 0;
        for (let k = 0; k <= _; k++) {
          const H = Math.round(k * x);
          if (H > E) {
            const I = w + (Math.round(T * h * d) || 1) * S;
            y.push({ x: E, y: I }), E = H, T = 0;
          }
          const A = Math.abs(p[k] || 0);
          A > T && (T = A);
        }
        return y.push({ x: E, y: w }), y;
      }));
    })({ channelData: e, width: r, height: o, vScale: s });
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
  renderWaveform(e, n, i) {
    if (i.fillStyle = this.convertColorValues(n.waveColor, i), n.renderFunction) return void n.renderFunction(e, i);
    const s = (function({ channelData: r, barHeight: o, normalize: a, maxPeak: l }) {
      var u;
      const c = o || 1;
      if (!a) return c;
      const d = r[0];
      if (!d || d.length === 0) return c;
      let h = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const p = (u = d[f]) !== null && u !== void 0 ? u : 0, g = Math.abs(p);
        g > h && (h = g);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    _l(n) ? this.renderBarWaveform(e, n, i, s) : this.renderLineWaveform(e, n, i, s);
  }
  renderSingleCanvas(e, n, i, s, r, o, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(s * l), u.style.width = `${i}px`, u.style.height = `${s}px`, u.style.left = `${Math.round(r)}px`, o.appendChild(u);
    const c = u.getContext("2d");
    if (n.renderFunction ? (c.fillStyle = this.convertColorValues(n.waveColor, c), n.renderFunction(e, c)) : this.renderWaveform(e, n, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), h = d.getContext("2d");
      h.drawImage(u, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(n.progressColor, h), h.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, i, s, r, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: p, totalWidth: g, options: _ }) {
      return So(Math.min(8e3, p, g), _);
    })({ clientWidth: l, totalWidth: u, options: n });
    let d = {};
    if (c === 0) return;
    const h = (p) => {
      if (p < 0 || p >= f || d[p]) return;
      d[p] = !0;
      const g = p * c;
      let _ = Math.min(u - g, c);
      if (_ = So(_, n), _ <= 0) return;
      const x = (function({ channelData: w, offset: S, clampedWidth: y, totalWidth: E }) {
        return w.map(((T) => {
          const k = Math.floor(S / E * T.length), H = Math.floor((S + y) / E * T.length);
          return T.slice(k, H);
        }));
      })({ channelData: e, offset: g, clampedWidth: _, totalWidth: u });
      this.renderSingleCanvas(x, n, _, s, g, r, o);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let p = 0; p < f; p++) h(p);
      return;
    }
    if (Co({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((p) => h(p))), f > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (r.innerHTML = "", o.innerHTML = "", d = {}), Co({ scrollLeft: g, totalWidth: u, numCanvases: f }).forEach(((_) => h(_)));
      }));
      this.unsubscribeOnScroll.push(p);
    }
  }
  renderChannel(e, n, i, s) {
    var { overlay: r } = n, o = (function(c, d) {
      var h = {};
      for (var f in c) Object.prototype.hasOwnProperty.call(c, f) && d.indexOf(f) < 0 && (h[f] = c[f]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var p = 0;
        for (f = Object.getOwnPropertySymbols(c); p < f.length; p++) d.indexOf(f[p]) < 0 && Object.prototype.propertyIsEnumerable.call(c, f[p]) && (h[f[p]] = c[f[p]]);
      }
      return h;
    })(n, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, r && s > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, o, i, l, a, u);
  }
  render(e) {
    return Fe(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: r, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: f }) {
        const p = Math.ceil(u * c), g = p > d, _ = !!(h && !g);
        return { scrollWidth: p, isScrollable: g, useParentWidth: _, width: (_ ? d : p) * f };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: s, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${r}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
        const c = Object.assign(Object.assign({}, this.options), (n = this.options.splitChannels) === null || n === void 0 ? void 0 : n[u]);
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
    const { scrollWidth: e } = this.scrollContainer, { right: n } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: i } = this.progressWrapper.getBoundingClientRect(), s = (function(r) {
        const o = 2 * r;
        return (o < 0 ? Math.floor(o) : Math.ceil(o)) / 2;
      })(i - n);
      this.scrollContainer.scrollLeft += s;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, n = !1) {
    const { scrollLeft: i, scrollWidth: s, clientWidth: r } = this.scrollContainer, o = e * s, a = i, l = i + r, u = r / 2;
    if (this.isDragging)
      o + 30 > l ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > l) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? u : 0));
      const c = o - i - u;
      n && this.options.autoCenter && c > 0 && (this.scrollContainer.scrollLeft += c);
    }
  }
  renderProgress(e, n) {
    if (isNaN(e)) return;
    const i = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${i}% 0%, 100% 0%, 100% 100%, ${i}% 100%)`, this.progressWrapper.style.width = `${i}%`, this.cursor.style.left = `${i}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, n);
  }
  exportImage(e, n, i) {
    return Fe(this, void 0, void 0, (function* () {
      const s = this.canvasWrapper.querySelectorAll("canvas");
      if (!s.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const r = Array.from(s).map(((o) => o.toDataURL(e, n)));
        return Promise.resolve(r);
      }
      return Promise.all(Array.from(s).map(((r) => new Promise(((o, a) => {
        r.toBlob(((l) => {
          l ? o(l) : a(new Error("Could not export image"));
        }), e, n);
      })))));
    }));
  }
}
class Gv extends Jn {
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
class hs extends Jn {
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
    return Fe(this, void 0, void 0, (function* () {
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
const Xv = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Vn extends Wv {
  static create(e) {
    return new Vn(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new hs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Xv, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, h, f;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : Se(0), g = (u = a?.duration) !== null && u !== void 0 ? u : Se(0), _ = (c = a?.isPlaying) !== null && c !== void 0 ? c : Se(!1), x = (d = a?.isSeeking) !== null && d !== void 0 ? d : Se(!1), w = (h = a?.volume) !== null && h !== void 0 ? h : Se(1), S = (f = a?.playbackRate) !== null && f !== void 0 ? f : Se(1), y = Se(null), E = Se(null), T = Se(""), k = Se(0), H = Se(0), A = Jt((() => !_.value), [_]), I = Jt((() => y.value !== null), [y]), $ = Jt((() => I.value && g.value > 0), [I, g]), M = Jt((() => p.value), [p]), V = Jt((() => g.value > 0 ? p.value / g.value : 0), [p, g]);
      return { state: { currentTime: p, duration: g, isPlaying: _, isPaused: A, isSeeking: x, volume: w, playbackRate: S, audioBuffer: y, peaks: E, url: T, zoom: k, scrollPosition: H, canPlay: I, isReady: $, progress: M, progressPercent: V }, actions: { setCurrentTime: (z) => {
        const G = Math.max(0, Math.min(g.value || 1 / 0, z));
        p.set(G);
      }, setDuration: (z) => {
        g.set(Math.max(0, z));
      }, setPlaying: (z) => {
        _.set(z);
      }, setSeeking: (z) => {
        x.set(z);
      }, setVolume: (z) => {
        const G = Math.max(0, Math.min(1, z));
        w.set(G);
      }, setPlaybackRate: (z) => {
        const G = Math.max(0.1, Math.min(16, z));
        S.set(G);
      }, setAudioBuffer: (z) => {
        y.set(z), z && g.set(z.duration);
      }, setPeaks: (z) => {
        E.set(z);
      }, setUrl: (z) => {
        T.set(z);
      }, setZoom: (z) => {
        k.set(Math.max(0, z));
      }, setScrollPosition: (z) => {
        H.set(Math.max(0, z));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new Gv();
    const r = n ? void 0 : this.getMediaElement();
    this.renderer = new Kv(this.options, r), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const o = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (o || a && l) && this.load(o, a, l).catch(((u) => {
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
    this.reactiveCleanups.push((function(e, n) {
      const i = [];
      i.push(Bt((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(Bt((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(Bt((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let s = !1;
      i.push(Bt((() => {
        e.isReady.value && !s && (s = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let r = !1;
      return i.push(Bt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        r && !o && u && n.emit("finish"), r = o && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(Bt((() => {
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
    })), this.renderer.on("scroll", ((e, n, i, s) => {
      const r = this.getDuration();
      this.emit("scroll", e * r, n * r, i, s);
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
        var s;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let r = 0;
        const o = this.options.dragToSeek;
        this.isPlaying() ? r = 0 : o === !0 ? r = 200 : o && typeof o == "object" && (r = (s = o.debounceTime) !== null && s !== void 0 ? s : 200), e = setTimeout((() => {
          this.seekTo(i);
        }), r), this.emit("interaction", i * this.getDuration()), this.emit("drag", i);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = oi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = oi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
  loadAudio(e, n, i, s) {
    return Fe(this, void 0, void 0, (function* () {
      var r;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (r = this.abortController) === null || r === void 0 || r.abort(), this.abortController = null, !n && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        n = yield Hv.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (n = new Blob([n], { type: u }));
      }
      this.setSrc(e, n);
      const o = yield new Promise(((a) => {
        const l = s || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !n) {
        const a = this.getMediaElement();
        a instanceof hs && (a.duration = o);
      }
      if (i) this.decodedData = oi.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield oi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, n, i) {
    return Fe(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, n, i);
      } catch (s) {
        throw this.emit("error", s), s;
      }
    }));
  }
  loadBlob(e, n, i) {
    return Fe(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, n, i);
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
  exportPeaks({ channels: e = 2, maxLength: n = 8e3, precision: i = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const s = Math.min(e, this.decodedData.numberOfChannels), r = [];
    for (let o = 0; o < s; o++) {
      const a = this.decodedData.getChannelData(o), l = [], u = a.length / n;
      for (let c = 0; c < n; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let h = 0;
        for (let f = 0; f < d.length; f++) {
          const p = d[f];
          Math.abs(p) > Math.abs(h) && (h = p);
        }
        l.push(Math.round(h * i) / i);
      }
      r.push(l);
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
    const n = this.getDuration() * e;
    this.setTime(n);
  }
  play(e, n) {
    const i = Object.create(null, { play: { get: () => super.play } });
    return Fe(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const s = yield i.play.call(this);
      return n != null && (this.media instanceof hs ? this.media.stopAt(n) : this.stopAtPosition = n), s;
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
    return Fe(this, arguments, void 0, (function* (e = "image/png", n = 1, i = "dataURL") {
      return this.renderer.exportImage(e, n, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((n) => n.destroy())), this.subscriptions.forEach(((n) => n())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((n) => n())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Vn.BasePlugin = class extends Jn {
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
}, Vn.dom = jv;
class xl {
  constructor() {
    this.listeners = {};
  }
  on(e, n, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...r) => {
        this.un(e, s), n(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
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
class Yv extends xl {
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
function Sl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Sl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function En(t, e, n) {
  const i = Sl(t, e || {});
  return n?.appendChild(i), i;
}
function Cl(t) {
  let e = t;
  const n = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, n.forEach(((s) => s(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (n.add(i), () => n.delete(i)) };
}
function pi(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, s = e.map(((r) => r.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), s.forEach(((r) => r()));
  };
}
function sn(t, e) {
  const n = Cl(null), i = (s) => {
    n.set(s);
  };
  return t.addEventListener(e, i), n._cleanup = () => {
    t.removeEventListener(e, i);
  }, n;
}
function Xt(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function vi(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, r = Cl(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, h = c.clientY, f = !1;
    const p = Date.now(), g = t.getBoundingClientRect(), { left: _, top: x } = g, w = (k) => {
      if (k.defaultPrevented || o.size > 1 || a && Date.now() - p < s) return;
      const H = k.clientX, A = k.clientY, I = H - d, $ = A - h;
      (f || Math.abs(I) > n || Math.abs($) > n) && (k.preventDefault(), k.stopPropagation(), f || (r.set({ type: "start", x: d - _, y: h - x }), f = !0), r.set({ type: "move", x: H - _, y: A - x, deltaX: I, deltaY: $ }), d = H, h = A);
    }, S = (k) => {
      if (o.delete(k.pointerId), f) {
        const H = k.clientX, A = k.clientY;
        r.set({ type: "end", x: H - _, y: A - x });
      }
      l();
    }, y = (k) => {
      o.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || S(k);
    }, E = (k) => {
      f && (k.stopPropagation(), k.preventDefault());
    }, T = (k) => {
      k.defaultPrevented || o.size > 1 || f && k.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", S), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", E, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", u), { signal: r, cleanup: () => {
    l(), t.removeEventListener("pointerdown", u), o.clear(), Xt(r);
  } };
}
class ko extends xl {
  constructor(e, n, i = 0) {
    var s, r, o, a, l, u, c, d, h, f;
    super(), this.totalDuration = n, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (r = e.drag) === null || r === void 0 || r, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = En("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = En("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), r = vi(i, { threshold: 1 }), o = vi(s, { threshold: 1 }), a = pi((() => {
      const u = r.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [r.signal]), l = pi((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), l(), r.cleanup(), o.cleanup();
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
    const s = En("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(s), s;
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
    const n = sn(e, "click"), i = sn(e, "mouseenter"), s = sn(e, "mouseleave"), r = sn(e, "dblclick"), o = sn(e, "pointerdown"), a = sn(e, "pointerup"), l = n.subscribe(((_) => _ && this.emit("click", _))), u = i.subscribe(((_) => _ && this.emit("over", _))), c = s.subscribe(((_) => _ && this.emit("leave", _))), d = r.subscribe(((_) => _ && this.emit("dblclick", _))), h = o.subscribe(((_) => _ && this.toggleCursor(!0))), f = a.subscribe(((_) => _ && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), f(), Xt(n), Xt(i), Xt(s), Xt(r), Xt(o), Xt(a);
    }));
    const p = vi(e), g = pi((() => {
      const _ = p.signal.value;
      _ && (_.type === "start" ? this.toggleCursor(!0) : _.type === "move" && _.deltaX !== void 0 ? this.onMove(_.deltaX) : _.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [p.signal]);
    this.subscriptions.push((() => {
      g(), p.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (_) => this.onContentClick(_), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, n, i) {
    var s;
    if (!(!((s = this.element) === null || s === void 0) && s.parentElement)) return;
    const { width: r } = this.element.parentElement.getBoundingClientRect(), o = e / r * this.totalDuration;
    let a = n && n !== "start" ? this.start : this.start + o, l = n && n !== "end" ? this.end : this.end + o;
    const u = i !== void 0;
    u && this.updatingSide && this.updatingSide !== n && (this.updatingSide === "start" ? a = i : l = i), a = Math.max(0, a), l = Math.min(this.totalDuration, l);
    const c = l - a;
    this.updatingSide = n;
    const d = c >= this.minLength && c <= this.maxLength;
    a <= l && (d || u) && (this.start = a, this.end = l, this.renderPosition(), this.emit("update", n));
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
        this.content = En("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (i) => this.onContentClick(i), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var n, i;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const s = this.start === this.end;
        this.start = this.clampPosition((n = e.start) !== null && n !== void 0 ? n : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : s ? this.start : this.end), this.renderPosition(), this.setPart();
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
class cr extends Yv {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new cr(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((n) => {
      this.regions.forEach(((i) => i._setTotalDuration(n)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((n) => {
      const i = this.regions.filter(((s) => s.start <= n && (s.end === s.start ? s.start + 0.05 : s.end) >= n));
      i.forEach(((s) => {
        e.includes(s) || this.emit("region-in", s);
      })), e.forEach(((s) => {
        i.includes(s) || this.emit("region-out", s);
      })), e = i;
    })));
  }
  initRegionsContainer() {
    return En("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const n = e.content, i = n.getBoundingClientRect(), s = this.regions.map(((r) => {
        if (r === e || !r.content) return 0;
        const o = r.content.getBoundingClientRect();
        return i.left < o.left + o.width && o.left < i.left + i.width ? o.height : 0;
      })).reduce(((r, o) => r + o), 0);
      n.style.marginTop = `${s}px`;
    }), 10);
  }
  adjustScroll(e) {
    var n, i;
    if (!e.element) return;
    const s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!s) return;
    const { clientWidth: r, scrollWidth: o } = s;
    if (o <= r) return;
    const a = s.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? s.scrollLeft += u : c > r && (s.scrollLeft += c - r);
  }
  virtualAppend(e, n, i) {
    const s = () => {
      if (!this.wavesurfer) return;
      const r = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = n.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > o && u < o + r;
      c && !i.parentElement ? n.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      s();
      const r = this.wavesurfer.on("scroll", s), o = this.wavesurfer.on("zoom", s), a = this.wavesurfer.on("resize", s);
      this.subscriptions.push(r, o, a), e.once("remove", (() => {
        r(), o(), a();
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
      var s;
      (s = this.wavesurfer) === null || s === void 0 || s.play(e.start, i);
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
    const s = this.wavesurfer.getDuration(), r = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new ko(e, s, r);
    return this.emit("region-initialized", o), s ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      o._setTotalDuration(a), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, n = 3) {
    var i;
    const s = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(s && s instanceof HTMLElement)) return () => {
    };
    let r = null, o = 0, a = 0;
    const l = vi(s, { threshold: n }), u = pi((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (o = h.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), p = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / g * f;
        const _ = h.x / g * f, x = (h.x + 5) / g * f;
        r = new ko(Object.assign(Object.assign({}, e), { start: _, end: x }), f, p), this.emit("region-initialized", r), r.element && this.regionsContainer.appendChild(r.element);
      } else h.type === "move" && h.deltaX !== void 0 ? r && r._onUpdate(h.deltaX, h.x > o ? "end" : "start", a) : h.type === "end" && r && (this.saveRegion(r), r.updatingSide = void 0, r = null);
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
const ps = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Jv(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: s } = t, r = /* @__PURE__ */ fn(null), o = /* @__PURE__ */ fn(null), a = /* @__PURE__ */ q(0), l = /* @__PURE__ */ q(0), u = /* @__PURE__ */ q(!1), c = /* @__PURE__ */ q(!1), d = /* @__PURE__ */ q(!1), h = /* @__PURE__ */ q(1), f = /* @__PURE__ */ q(1), p = /* @__PURE__ */ q(!1), g = B(() => Wn(a.value)), _ = B(() => Wn(l.value));
  function x(z, G) {
    M(), d.value = !0, c.value = !1;
    const ae = cr.create();
    o.value = ae;
    const te = Vn.create({
      container: z,
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
      renderFunction: Jd,
      url: G,
      plugins: [ae]
    });
    te.on("ready", () => {
      c.value = !0, d.value = !1, l.value = te.getDuration(), w();
    }), te.on("timeupdate", (le) => {
      a.value = le;
    }), te.on("play", () => {
      u.value = !0;
    }), te.on("pause", () => {
      u.value = !1;
    }), te.on("finish", () => {
      u.value = !1;
    }), r.value = te;
  }
  function w() {
    const z = o.value;
    if (z) {
      z.clearRegions();
      for (const G of i.value) {
        const ae = G.speakerId ? s.value.get(G.speakerId) : void 0;
        if (!ae || G.startTime == null || G.endTime == null) continue;
        const te = ae.color;
        z.addRegion({
          start: G.startTime,
          end: G.endTime,
          color: Ud(te, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", te);
      }
    }
  }
  function S() {
    r.value?.play();
  }
  function y() {
    r.value?.pause();
  }
  function E() {
    r.value?.playPause();
  }
  function T(z) {
    const G = r.value;
    !G || l.value === 0 || G.setTime(z);
  }
  function k(z) {
    T(Math.max(0, Math.min(a.value + z, l.value)));
  }
  function H(z) {
    const G = r.value;
    G && (h.value = z, G.setVolume(z), z > 0 && p.value && (p.value = !1, G.setMuted(!1)));
  }
  function A() {
    const z = r.value;
    z && (p.value = !p.value, z.setMuted(p.value));
  }
  function I(z) {
    const G = r.value;
    G && (f.value = z, G.setPlaybackRate(z));
  }
  function $() {
    const G = (ps.indexOf(
      f.value
    ) + 1) % ps.length;
    I(ps[G] ?? 1);
  }
  function M() {
    V !== null && (clearTimeout(V), V = null), r.value && (r.value.destroy(), r.value = null, o.value = null);
  }
  ve(
    [e, n],
    ([z, G]) => {
      z && G && x(z, G);
    },
    { immediate: !0 }
  );
  let V = null;
  return ve([i, s], () => {
    c.value && (V !== null && clearTimeout(V), V = setTimeout(() => {
      V = null, w();
    }, 150));
  }), yt(() => {
    M();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: f,
    isMuted: p,
    formattedCurrentTime: g,
    formattedDuration: _,
    play: S,
    pause: y,
    togglePlay: E,
    seekTo: T,
    skip: k,
    setVolume: H,
    setPlaybackRate: I,
    cyclePlaybackRate: $,
    toggleMute: A
  };
}
const Zv = { class: "audio-player" }, Qv = /* @__PURE__ */ ee({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, s = n, r = /* @__PURE__ */ q(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: f,
      formattedDuration: p,
      togglePlay: g,
      seekTo: _,
      pause: x,
      skip: w,
      setVolume: S,
      cyclePlaybackRate: y,
      toggleMute: E
    } = Jv({
      containerRef: r,
      audioSrc: /* @__PURE__ */ Yi(() => i.audioSrc),
      turns: /* @__PURE__ */ Yi(() => i.turns),
      speakers: /* @__PURE__ */ Yi(() => i.speakers)
    });
    return ve(h, (T) => s("timeupdate", T)), ve(o, (T) => s("playStateChange", T)), e({ seekTo: _, pause: x }), (T, k) => (P(), Q("footer", Zv, [
      Z("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Ze(["waveform-container", { "waveform-container--loading": m(l) }])
      }, null, 2),
      U(Nv, {
        "is-playing": m(o),
        "current-time": m(f),
        duration: m(p),
        volume: m(u),
        "playback-rate": m(c),
        "is-muted": m(d),
        "is-ready": m(a),
        onTogglePlay: m(g),
        onSkipBack: k[0] || (k[0] = (H) => m(w)(-10)),
        onSkipForward: k[1] || (k[1] = (H) => m(w)(10)),
        "onUpdate:volume": m(S),
        onToggleMute: m(E),
        onCyclePlaybackRate: m(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), em = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", tm = /* @__PURE__ */ we(Qv, [["styles", [em]], ["__scopeId", "data-v-9248e45e"]]);
class nm {
  diff(e, n, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const r = this.castInput(e, i), o = this.castInput(n, i), a = this.removeEmpty(this.tokenize(r, i)), l = this.removeEmpty(this.tokenize(o, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, n, i, s) {
    var r;
    const o = (w) => {
      if (w = this.postProcess(w, i), s) {
        setTimeout(function() {
          s(w);
        }, 0);
        return;
      } else
        return w;
    }, a = n.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (r = i.timeout) !== null && r !== void 0 ? r : 1 / 0, h = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(f[0], n, e, 0, i);
    if (f[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, n, e));
    let g = -1 / 0, _ = 1 / 0;
    const x = () => {
      for (let w = Math.max(g, -u); w <= Math.min(_, u); w += 2) {
        let S;
        const y = f[w - 1], E = f[w + 1];
        y && (f[w - 1] = void 0);
        let T = !1;
        if (E) {
          const H = E.oldPos - w;
          T = E && 0 <= H && H < a;
        }
        const k = y && y.oldPos + 1 < l;
        if (!T && !k) {
          f[w] = void 0;
          continue;
        }
        if (!k || T && y.oldPos < E.oldPos ? S = this.addToPath(E, !0, !1, 0, i) : S = this.addToPath(y, !1, !0, 1, i), p = this.extractCommon(S, n, e, w, i), S.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(S.lastComponent, n, e)) || !0;
        f[w] = S, S.oldPos + 1 >= l && (_ = Math.min(_, w - 1)), p + 1 >= a && (g = Math.max(g, w + 1));
      }
      u++;
    };
    if (s)
      (function w() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return s(void 0);
          x() || w();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= h; ) {
        const w = x();
        if (w)
          return w;
      }
  }
  addToPath(e, n, i, s, r) {
    const o = e.lastComponent;
    return o && !r.oneChangePerToken && o.added === n && o.removed === i ? {
      oldPos: e.oldPos + s,
      lastComponent: { count: o.count + 1, added: n, removed: i, previousComponent: o.previousComponent }
    } : {
      oldPos: e.oldPos + s,
      lastComponent: { count: 1, added: n, removed: i, previousComponent: o }
    };
  }
  extractCommon(e, n, i, s, r) {
    const o = n.length, a = i.length;
    let l = e.oldPos, u = l - s, c = 0;
    for (; u + 1 < o && l + 1 < a && this.equals(i[l + 1], n[u + 1], r); )
      u++, l++, c++, r.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !r.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, u;
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
    const s = [];
    let r;
    for (; e; )
      s.push(e), r = e.previousComponent, delete e.previousComponent, e = r;
    s.reverse();
    const o = s.length;
    let a = 0, l = 0, u = 0;
    for (; a < o; a++) {
      const c = s[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = n.slice(l, l + c.count);
          d = d.map(function(h, f) {
            const p = i[u + f];
            return p.length > h.length ? p : h;
          }), c.value = this.join(d);
        } else
          c.value = this.join(n.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return s;
  }
}
class im extends nm {
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
const sm = new im();
function rm(t, e, n) {
  return sm.diff(t, e, n);
}
function vs({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const s = t.split(" "), r = n.split(" "), o = rm(s, r, {
    comparator: am
  }), a = om(o), l = [...e];
  let u = [...e], c = 0;
  for (const f of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      u = mi(
        u,
        l[0],
        f.countAdded - f.countRemoved
      ), c += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const p = f;
      c += p.count, u = mi(
        u,
        l[0],
        -p.count
      );
    } else if ("added" in f && f.added) {
      const p = f;
      u = mi(
        u,
        l[0],
        p.count
      );
    } else
      c += f.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = r.slice(d).join(" ");
  if (i(h)) {
    const p = kl(
      h,
      i
    ).map(
      (g) => g + d
    );
    u = u.concat(p);
  }
  return {
    previousIndexes: u,
    previousText: n
  };
}
function om(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (n + 1 < t.length) {
      const s = t[n + 1];
      if (s.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: s.added ?? !1,
          countRemoved: i.count,
          countAdded: s.count
        }), n++;
        continue;
      }
    }
    e.push(i);
  }
  return e;
}
function mi(t, e, n) {
  return t.map((i) => i >= e ? i + n : i);
}
function kl(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let i;
  for (i = 0; i < n.length; i++) {
    const s = n.slice(0, i).join(" ");
    if (e(s)) break;
  }
  return [i - 1].concat(
    mi(
      kl(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function am(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(n.length, i.length);
  let r = 0;
  for (let a = 0; a < s; a++)
    n[a] === i[a] && r++;
  return r / n.length > 0.8;
}
class lm {
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
    color: s = "white",
    font: r = "Arial",
    paddingInline: o = 100
  } = {}) {
    this.canvas = e, this.fontSize = n, this.lineHeight = i, this.color = s, this.font = r, this.paddingInline = o, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
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
    const s = this.canvas.getContext("2d");
    s.font = `${this.fontSize}px ${this.font}`, s.fillStyle = this.color, s.fillText(e, n + this.paddingInline, i);
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
class cm extends lm {
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
    this.resetAll(), this.currentState = vs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = vs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = vs(
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
function Tl(t) {
  const e = Wt();
  let n = null;
  qe(() => {
    t.canvasRef.value && (n = new cm(t.canvasRef.value, {
      fontSize: t.fontSize.value,
      lineHeight: t.lineHeight.value
    }));
  }), ve([t.fontSize, t.lineHeight], ([l, u]) => {
    n && n.setFontSize(l, u);
  }), ve(
    () => e.live?.partial.value,
    (l) => {
      l && n && n.newPartial(l);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: l }) => {
    if (!n) return;
    const u = l.words.length > 0 ? l.words.map((c) => c.text).join(" ") : l.text ?? "";
    u && n.newFinal(u);
  });
  function s() {
    n && (n.resetDrawing(), n.resetAll());
  }
  const r = e.on("translation:change", s), o = e.on("translation:sync", s), a = e.on("channel:sync", s);
  en(() => {
    i(), r(), o(), a(), n?.dispose(), n = null;
  });
}
function El(t) {
  const e = /* @__PURE__ */ q(!1);
  let n = null, i = null;
  function s() {
    n && (clearTimeout(n), n = null), i && (clearTimeout(i), i = null);
  }
  function r() {
    !t || !t.display.value || (e.value = !0, t.pinned.value || (i = setTimeout(o, t.duration.value * 1e3)));
  }
  function o() {
    e.value = !1, !(!t || !t.display.value || t.pinned.value) && (n = setTimeout(r, t.frequency.value * 1e3));
  }
  function a() {
    if (s(), !t || !t.display.value) {
      e.value = !1;
      return;
    }
    if (t.pinned.value) {
      e.value = !0;
      return;
    }
    e.value = !1, n = setTimeout(r, t.frequency.value * 1e3);
  }
  return t && ve(
    [t.display, t.pinned, t.frequency, t.duration],
    a
  ), qe(a), yt(s), { visible: e };
}
const To = /\$(\w+)/g;
function um(t, e) {
  const n = [];
  let i = 0, s;
  for (To.lastIndex = 0; (s = To.exec(t)) !== null; ) {
    s.index > i && n.push({ type: "text", value: t.slice(i, s.index) });
    const r = s[1] ?? "", o = r ? e[r] : void 0;
    o ? n.push({ type: "token", src: o.src, alt: o.alt ?? r }) : n.push({ type: "text", value: s[0] }), i = s.index + s[0].length;
  }
  return i < t.length && n.push({ type: "text", value: t.slice(i) }), n;
}
const dm = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, fm = ["src", "alt"], hm = { key: 1 }, pm = /* @__PURE__ */ ee({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(t) {
    const n = Wt().subtitle?.watermark, i = B(() => n ? um(n.content.value, n.tokens.value) : []);
    return (s, r) => (P(), K(Qs, { name: "watermark" }, {
      default: se(() => [
        t.visible && m(n) ? (P(), Q("div", dm, [
          (P(!0), Q(be, null, vn(i.value, (o, a) => (P(), Q(be, { key: a }, [
            o.type === "token" ? (P(), Q("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, fm)) : (P(), Q("span", hm, re(o.value), 1))
          ], 64))), 128))
        ])) : oe("", !0)
      ]),
      _: 1
    }));
  }
}), vm = ".watermark[data-v-7d6bdc7d]{position:absolute;right:var(--spacing-md, 16px);bottom:4px;display:inline-flex;align-items:center;gap:.25em;font-size:1.2rem;color:var(--color-white, #fff);pointer-events:none;line-height:1}.watermark__img[data-v-7d6bdc7d]{height:1em;vertical-align:middle}.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .4s ease,transform .4s ease}.watermark-enter-from[data-v-7d6bdc7d],.watermark-leave-to[data-v-7d6bdc7d]{opacity:0;transform:translate(6px,6px)}@media(prefers-reduced-motion:reduce){.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .01s;transform:none}}", Al = /* @__PURE__ */ we(pm, [["styles", [vm]], ["__scopeId", "data-v-7d6bdc7d"]]), mm = ["height"], gm = /* @__PURE__ */ ee({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Wt(), n = Bn("canvas"), i = B(() => e.subtitle?.fontSize.value ?? 40), s = B(() => 1.2 * i.value), r = B(() => 2.4 * i.value);
    Tl({
      canvasRef: n,
      fontSize: i,
      lineHeight: s
    });
    const { visible: o } = El(
      e.subtitle?.watermark
    );
    return qe(() => {
      e.emit("subtitle:visible", { visible: !0, height: r.value });
    }), ve(r, (a) => {
      e.emit("subtitle:visible", { visible: !0, height: a });
    }), yt(() => {
      e.emit("subtitle:visible", { visible: !1, height: 0 });
    }), (a, l) => (P(), Q("div", {
      class: "subtitle-banner",
      style: Ot({ height: r.value + "px" })
    }, [
      Z("canvas", {
        ref: "canvas",
        class: Ze(["subtitle-canvas", { "subtitle-canvas--shrunk": m(o) }]),
        height: r.value
      }, null, 10, mm),
      U(Al, { visible: m(o) }, null, 8, ["visible"])
    ], 4));
  }
}), bm = ".subtitle-banner[data-v-5b52c946]{position:fixed;bottom:0;left:0;right:0;flex-shrink:0;background-color:var(--color-black);overflow:hidden;z-index:1001}.subtitle-canvas[data-v-5b52c946]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:top center}.subtitle-canvas--shrunk[data-v-5b52c946]{transform:scale(.8) translateY(-8%)}@media(prefers-reduced-motion:reduce){.subtitle-canvas[data-v-5b52c946]{transition:none}}", ym = /* @__PURE__ */ we(gm, [["styles", [bm]], ["__scopeId", "data-v-5b52c946"]]), _m = {
  ref: "container",
  class: "subtitle-fullscreen"
}, wm = ["aria-label"], xm = /* @__PURE__ */ ee({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Wt(), { t: n } = et(), i = Bn("container"), s = Bn("canvas"), r = B(() => e.subtitle?.fontSize.value ?? 48), o = B(() => 1.2 * r.value);
    Tl({
      canvasRef: s,
      fontSize: r,
      lineHeight: o
    });
    const { visible: a } = El(
      e.subtitle?.watermark
    );
    qe(async () => {
      const c = i.value;
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
    function l() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    qe(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function u() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return en(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, d) => (P(), Q("div", _m, [
      Z("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": m(n)("subtitle.exitFullscreen"),
        onClick: u
      }, [
        U(m(nr), { size: 24 })
      ], 8, wm),
      Z("canvas", {
        ref: "canvas",
        class: Ze(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": m(a) }])
      }, null, 2),
      U(Al, { visible: m(a) }, null, 8, ["visible"])
    ], 512));
  }
}), Sm = ".subtitle-fullscreen[data-v-f31885e0]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-f31885e0]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-f31885e0]:hover,.subtitle-fullscreen__close[data-v-f31885e0]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-f31885e0]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:center}.subtitle-fullscreen__canvas--shrunk[data-v-f31885e0]{transform:scale(.85) translateY(-4%)}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-f31885e0],.subtitle-fullscreen__canvas[data-v-f31885e0]{transition:none}}", Cm = /* @__PURE__ */ we(xm, [["styles", [Sm]], ["__scopeId", "data-v-f31885e0"]]), km = /* @__PURE__ */ ee({
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
    const n = t, i = /* @__PURE__ */ q(!1);
    let s;
    async function r() {
      if (!i.value)
        try {
          await n.copyFn(), i.value = !0, s = setTimeout(() => {
            i.value = !1;
          }, 2e3);
        } catch (l) {
          console.error(l);
        }
    }
    e({
      reset: () => {
        i.value = !1, clearTimeout(s);
      }
    });
    const o = B(() => i.value ? "check" : n.icon), a = B(() => Za[n.size ?? "sm"]);
    return (l, u) => (P(), K(Je, {
      variant: t.variant,
      size: t.size,
      disabled: t.disabled,
      block: t.block,
      "aria-label": t.ariaLabel,
      class: Ze({ "copy-btn--copied": i.value }),
      onClick: r
    }, {
      icon: se(() => [
        U(Qs, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: se(() => [
            (P(), K(fi, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: se(() => [
        ye(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Tm = ".copy-btn--copied[data-v-eed7503d]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-eed7503d],.copy-icon-leave-to[data-v-eed7503d]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:none}}", Eo = /* @__PURE__ */ we(km, [["styles", [Tm]], ["__scopeId", "data-v-eed7503d"]]), Em = ["aria-label"], Am = { class: "selection-count" }, Pm = { class: "selection-actions" }, Mm = /* @__PURE__ */ ee({
  __name: "SelectionActionBar",
  setup(t) {
    const e = vl(), { t: n } = et();
    return (i, s) => m(e).hasSelection.value ? (P(), Q("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": m(n)("selection.count")
    }, [
      Z("span", Am, re(m(e).count.value) + " " + re(m(n)("selection.count")), 1),
      Z("div", Pm, [
        U(Eo, {
          icon: "clipboard-type",
          "copy-fn": m(e).copyText,
          variant: "secondary"
        }, {
          default: se(() => [
            Ge(re(m(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        U(Eo, {
          icon: "clipboard-list",
          "copy-fn": m(e).copyWithMetadata
        }, {
          default: se(() => [
            Ge(re(m(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        U(Je, {
          variant: "transparent",
          icon: "x",
          onClick: s[0] || (s[0] = (r) => m(e).clear())
        }, {
          default: se(() => [
            Ge(re(m(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Em)) : oe("", !0);
  }
}), Im = ".selection-bar[data-v-7569d6ad]{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-7569d6ad var(--transition-duration) ease}.selection-count[data-v-7569d6ad]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-7569d6ad]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-7569d6ad{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-7569d6ad]{animation:none}}@media(max-width:767px){.selection-bar[data-v-7569d6ad]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", Om = /* @__PURE__ */ we(Mm, [["styles", [Im]], ["__scopeId", "data-v-7569d6ad"]]), Dm = "(max-width: 767px)";
function Lm() {
  const t = /* @__PURE__ */ q(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return qe(() => {
    e = window.matchMedia(Dm), t.value = e.matches, e.addEventListener("change", n);
  }), yt(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Rm = { class: "editor-layout" }, $m = { class: "editor-body" }, Fm = {
  key: 4,
  class: "mobile-selectors"
}, zm = /* @__PURE__ */ ee({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Wt(), { isMobile: i } = Lm(), s = /* @__PURE__ */ q(!1), r = B(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), o = n.speakers.all;
    xp(r, o, n);
    const a = B(() => [...n.channels.values()]), l = B(
      () => n.activeChannel.value.selectableTranslations
    ), u = B(
      () => n.activeChannel.value.activeTranslation.value.id
    ), c = B(() => Array.from(o.values())), d = Bn("audioPlayer");
    function h(g) {
      n.audio && (n.audio.currentTime.value = g);
    }
    ve(
      () => n.activeChannelId.value,
      () => {
        d.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), s.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((g) => d.value?.seekTo(g));
    function f(g) {
      n.setActiveChannel(g);
    }
    function p(g) {
      n.activeChannel.value.setActiveTranslation(g);
    }
    return (g, _) => (P(), Q("div", Rm, [
      e.showHeader ? (P(), K(lf, {
        key: 0,
        title: m(n).title.value,
        duration: m(n).activeChannel.value.duration,
        language: u.value,
        "is-mobile": m(i),
        onToggleSidebar: _[0] || (_[0] = (x) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : oe("", !0),
      U(Om),
      Z("main", $m, [
        U(Vp, {
          turns: r.value,
          speakers: m(o)
        }, null, 8, ["turns", "speakers"]),
        m(i) ? oe("", !0) : (P(), K(_o, {
          key: 0,
          speakers: c.value,
          channels: a.value,
          "selected-channel-id": m(n).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        m(i) ? (P(), K(Mv, {
          key: 1,
          open: s.value,
          "onUpdate:open": _[1] || (_[1] = (x) => s.value = x)
        }, {
          default: se(() => [
            U(_o, {
              speakers: c.value,
              channels: a.value,
              "selected-channel-id": m(n).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": u.value,
              "onUpdate:selectedChannelId": f,
              "onUpdate:selectedTranslationId": p
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : oe("", !0)
      ]),
      m(n).audio?.src.value ? (P(), K(tm, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": m(n).audio.src.value,
        turns: r.value,
        speakers: m(o),
        onTimeupdate: h,
        onPlayStateChange: _[2] || (_[2] = (x) => {
          m(n).audio && (m(n).audio.isPlaying.value = x);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : oe("", !0),
      m(n).subtitle?.isVisible.value && !m(i) && !m(n).subtitle.isFullscreen.value ? (P(), K(ym, { key: 2 })) : oe("", !0),
      m(n).subtitle?.isFullscreen.value ? (P(), K(Cm, { key: 3 })) : oe("", !0),
      m(i) && (a.value.length > 1 || l.value.length > 1) ? (P(), Q("div", Fm, [
        a.value.length > 1 ? (P(), K(gl, {
          key: 0,
          channels: a.value,
          "selected-channel-id": m(n).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : oe("", !0),
        l.value.length > 1 ? (P(), K(bl, {
          key: 1,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["translations", "selected-translation-id"])) : oe("", !0)
      ])) : oe("", !0)
    ]));
  }
}), Bm = ".editor-layout[data-v-028b08c1]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-028b08c1]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-028b08c1]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0;box-shadow:var(--shadow-md);align-items:end}.mobile-selectors[data-v-028b08c1]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-028b08c1]{grid-template-columns:1fr}}", Nm = /* @__PURE__ */ we(zm, [["styles", [Bm]], ["__scopeId", "data-v-028b08c1"]]), jm = /* @__PURE__ */ ee({
  __name: "WebComponent",
  props: {
    locale: { default: "fr", type: String },
    noHeader: { type: Boolean, default: !1 }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ q(n.locale);
    qd(i), ve(
      () => n.locale,
      (r) => {
        i.value = r;
      }
    );
    const s = _p();
    return wp(s), e({ editor: s }), (r, o) => m(s)?.channels?.size ? (P(), K(Nm, {
      key: 0,
      "show-header": !n.noHeader
    }, null, 8, ["show-header"])) : oe("", !0);
  }
}), Hm = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--color-danger: #e53935;--color-danger-hover: #c62828;--color-danger-soft: #fdecea;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}.sidebar-select{width:100%;font-size:var(--font-size-sm);font-family:inherit;border:1px solid var(--color-border);border-radius:var(--radius-md);background-color:var(--color-surface);color:var(--color-text-primary);padding:var(--spacing-sm)}', Wm = /* @__PURE__ */ we(jm, [["styles", [Hm]]]);
function Ao(t) {
  const e = t.words.length > 0;
  return {
    id: t.turnId,
    speakerId: t.speakerId,
    text: e ? null : t.text ?? null,
    words: t.words,
    startTime: t.startTime,
    endTime: t.endTime,
    startDate: t.startDate,
    endDate: t.endDate,
    language: t.language
  };
}
function ms(t, e) {
  return {
    id: t.turnId,
    speakerId: t.speakerId,
    text: e.text,
    words: [],
    startTime: t.startTime,
    endTime: t.endTime,
    startDate: t.startDate,
    endDate: t.endDate,
    language: e.language
  };
}
function Gm() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ fn(null), n = /* @__PURE__ */ q(!1);
      n.value = !0;
      function i() {
        e.value = null;
      }
      function s(S, y) {
        if (t.activeChannelId.value !== y) return;
        const E = t.activeChannel.value.activeTranslation.value;
        if (E.isSource) {
          if (S.text == null) return;
          e.value = S.text;
        } else if (S.translations) {
          const T = S.translations.find(
            (k) => k.translationId === E.id
          );
          e.value = T?.text ?? null;
        } else
          return;
      }
      let r = null;
      function o() {
        r === null && (r = setTimeout(() => {
          r = null, i();
        }, 150));
      }
      function a() {
        r !== null && (clearTimeout(r), r = null);
      }
      function l(S, y) {
        S.hasTurn(y.id) ? S.updateTurn(y.id, y) : S.addTurn(y);
      }
      function u(S, y) {
        S.speakerId && t.speakers.ensure(S.speakerId);
        const E = t.channels.get(y);
        if (!E) {
          h();
          return;
        }
        if (S.text != null && l(
          E.sourceTranslation,
          Ao(S)
        ), S.translations)
          for (const k of S.translations) {
            const H = E.translations.get(k.translationId);
            H && l(
              H,
              ms(S, k)
            );
          }
        t.activeChannel.value.activeTranslation.value.isSource && h();
      }
      function c(S, y) {
        d([S], y);
      }
      function d(S, y) {
        const E = t.channels.get(y);
        if (!E) return;
        const T = /* @__PURE__ */ new Set();
        for (const A of S)
          A.speakerId && !T.has(A.speakerId) && (T.add(A.speakerId), t.speakers.ensure(A.speakerId));
        const k = [];
        for (const A of S)
          A.text != null && k.push(Ao(A));
        k.length > 0 && E.sourceTranslation.prependTurns(k);
        const H = /* @__PURE__ */ new Map();
        for (const A of S)
          if (A.translations)
            for (const I of A.translations) {
              let $ = H.get(I.translationId);
              $ || ($ = [], H.set(I.translationId, $)), $.push(ms(A, I));
            }
        for (const [A, I] of H) {
          const $ = E.translations.get(A);
          $ && $.prependTurns(I);
        }
      }
      function h() {
        a(), i();
      }
      function f(S) {
        const y = t.activeChannel.value.activeTranslation.value, E = t.activeChannel.value;
        if (!S.final && y.languages.includes(S.language))
          e.value = S.text;
        else if (S.final) {
          const T = E.translations.get(S.language);
          if (T) {
            const k = ms(
              { ...S },
              S
            );
            T === y ? l(T, k) : T.updateOrCreateTurnSilent(k);
          }
          y.languages.includes(S.language) && h();
        }
      }
      const p = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: s,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: f
      }, g = t.on(
        "channel:change",
        h
      ), _ = t.on(
        "translation:change",
        h
      ), x = t.on(
        "translation:sync",
        o
      ), w = t.on("channel:sync", o);
      return t.live = p, () => {
        h(), g(), _(), x(), w(), t.live = void 0;
      };
    }
  };
}
function Xm() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ q(0), n = /* @__PURE__ */ q(!1);
      let i = null;
      const s = B(
        () => t.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function r(l) {
        i?.(l);
      }
      function o(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: n,
        src: s,
        seekTo: r,
        setSeekHandler: o
      };
      return t.audio = a, () => {
        t.audio = void 0;
      };
    }
  };
}
function Ym(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ q(t.fontSize ?? 40), i = /* @__PURE__ */ q(t.isVisible ?? !1), s = /* @__PURE__ */ q(!1);
      let r;
      const o = [];
      if (t.watermark) {
        const l = t.watermark;
        r = {
          display: /* @__PURE__ */ q(l.display ?? !1),
          pinned: /* @__PURE__ */ q(l.pinned ?? !1),
          content: /* @__PURE__ */ q(l.content ?? ""),
          frequency: /* @__PURE__ */ q(l.frequency ?? 30),
          duration: /* @__PURE__ */ q(l.duration ?? 5),
          tokens: /* @__PURE__ */ q(l.tokens ?? {}),
          readonly: l.readonly ?? !1
        }, o.push(
          ve(
            r.display,
            (u) => e.emit("watermark:display", { display: u })
          ),
          ve(
            r.pinned,
            (u) => e.emit("watermark:pin", { pinned: u })
          )
        );
      }
      const a = {
        fontSize: n,
        isVisible: i,
        isFullscreen: s,
        enterFullscreen() {
          s.value = !0;
        },
        exitFullscreen() {
          s.value = !1;
        },
        watermark: r
      };
      return e.subtitle = a, () => {
        i.value = !1, s.value = !1, o.forEach((l) => l()), e.subtitle = void 0;
      };
    }
  };
}
const Vm = /* @__PURE__ */ id(Wm);
function qm() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = hd, document.head.appendChild(e);
}
function Jm(t = "linto-editor") {
  qm(), customElements.define(t, Vm);
}
export {
  Vm as LintoEditor,
  Xm as createAudioPlugin,
  Gm as createLivePlugin,
  Ym as createSubtitlePlugin,
  Jm as register
};
