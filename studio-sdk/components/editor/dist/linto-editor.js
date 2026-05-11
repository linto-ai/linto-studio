// @__NO_SIDE_EFFECTS__
function Fs(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const de = {}, on = [], mt = () => {
}, Ao = () => !1, Ai = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), zs = (t) => t.startsWith("onUpdate:"), xe = Object.assign, Bs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Pl = Object.prototype.hasOwnProperty, fe = (t, e) => Pl.call(t, e), Y = Array.isArray, an = (t) => qn(t) === "[object Map]", Po = (t) => qn(t) === "[object Set]", hr = (t) => qn(t) === "[object Date]", ne = (t) => typeof t == "function", _e = (t) => typeof t == "string", st = (t) => typeof t == "symbol", he = (t) => t !== null && typeof t == "object", Mo = (t) => (he(t) || ne(t)) && ne(t.then) && ne(t.catch), Io = Object.prototype.toString, qn = (t) => Io.call(t), Ml = (t) => qn(t).slice(8, -1), Pi = (t) => qn(t) === "[object Object]", Mi = (t) => _e(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, An = /* @__PURE__ */ Fs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Ii = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Il = /-\w/g, Ae = Ii(
  (t) => t.replace(Il, (e) => e.slice(1).toUpperCase())
), Ol = /\B([A-Z])/g, Ve = Ii(
  (t) => t.replace(Ol, "-$1").toLowerCase()
), Oi = Ii((t) => t.charAt(0).toUpperCase() + t.slice(1)), ai = Ii(
  (t) => t ? `on${Oi(t)}` : ""
), Re = (t, e) => !Object.is(t, e), qi = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Oo = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, Dl = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, ms = (t) => {
  const e = _e(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let pr;
const Di = () => pr || (pr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function It(t) {
  if (Y(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], s = _e(i) ? Fl(i) : It(i);
      if (s)
        for (const r in s)
          e[r] = s[r];
    }
    return e;
  } else if (_e(t) || he(t))
    return t;
}
const Ll = /;(?![^(]*\))/g, Rl = /:([^]+)/, $l = /\/\*[^]*?\*\//g;
function Fl(t) {
  const e = {};
  return t.replace($l, "").split(Ll).forEach((n) => {
    if (n) {
      const i = n.split(Rl);
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
function zl(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !_e(e) && (t.class = Ze(e)), n && (t.style = It(n)), t;
}
const Bl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Nl = /* @__PURE__ */ Fs(Bl);
function Do(t) {
  return !!t || t === "";
}
function jl(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = Ns(t[i], e[i]);
  return n;
}
function Ns(t, e) {
  if (t === e) return !0;
  let n = hr(t), i = hr(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = st(t), i = st(e), n || i)
    return t === e;
  if (n = Y(t), i = Y(e), n || i)
    return n && i ? jl(t, e) : !1;
  if (n = he(t), i = he(e), n || i) {
    if (!n || !i)
      return !1;
    const s = Object.keys(t).length, r = Object.keys(e).length;
    if (s !== r)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Ns(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const Lo = (t) => !!(t && t.__v_isRef === !0), re = (t) => _e(t) ? t : t == null ? "" : Y(t) || he(t) && (t.toString === Io || !ne(t.toString)) ? Lo(t) ? re(t.value) : JSON.stringify(t, Ro, 2) : String(t), Ro = (t, e) => Lo(e) ? Ro(t, e.value) : an(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, s], r) => (n[Ui(i, r) + " =>"] = s, n),
    {}
  )
} : Po(e) ? {
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
class $o {
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
function Fo(t) {
  return new $o(t);
}
function zo() {
  return Ie;
}
function Hl(t, e = !1) {
  Ie && Ie.cleanups.push(t);
}
let me;
const Ki = /* @__PURE__ */ new WeakSet();
class Bo {
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || jo(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, vr(this), Ho(this);
    const e = me, n = nt;
    me = this, nt = !0;
    try {
      return this.fn();
    } finally {
      Wo(this), me = e, nt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ws(e);
      this.deps = this.depsTail = void 0, vr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Ki.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    gs(this) && this.run();
  }
  get dirty() {
    return gs(this);
  }
}
let No = 0, Pn, Mn;
function jo(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = Mn, Mn = t;
    return;
  }
  t.next = Pn, Pn = t;
}
function js() {
  No++;
}
function Hs() {
  if (--No > 0)
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
function Ho(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Wo(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), Ws(i), Wl(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  t.deps = e, t.depsTail = n;
}
function gs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Vo(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Vo(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Rn) || (t.globalVersion = Rn, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !gs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = me, i = nt;
  me = t, nt = !0;
  try {
    Ho(t);
    const s = t.fn(t._value);
    (e.version === 0 || Re(s, t._value)) && (t.flags |= 128, t._value = s, e.version++);
  } catch (s) {
    throw e.version++, s;
  } finally {
    me = n, nt = i, Wo(t), t.flags &= -3;
  }
}
function Ws(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: s } = t;
  if (i && (i.nextSub = s, t.prevSub = void 0), s && (s.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Ws(r, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Wl(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let nt = !0;
const qo = [];
function Tt() {
  qo.push(nt), nt = !1;
}
function At() {
  const t = qo.pop();
  nt = t === void 0 ? !0 : t;
}
function vr(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = me;
    me = void 0;
    try {
      e();
    } finally {
      me = n;
    }
  }
}
let Rn = 0;
class Vl {
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
    if (!me || !nt || me === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== me)
      n = this.activeLink = new Vl(me, this), me.deps ? (n.prevDep = me.depsTail, me.depsTail.nextDep = n, me.depsTail = n) : me.deps = me.depsTail = n, Uo(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = me.depsTail, n.nextDep = void 0, me.depsTail.nextDep = n, me.depsTail = n, me.deps === n && (me.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, Rn++, this.notify(e);
  }
  notify(e) {
    js();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Hs();
    }
  }
}
function Uo(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        Uo(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const gi = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ Symbol(
  ""
), bs = /* @__PURE__ */ Symbol(
  ""
), $n = /* @__PURE__ */ Symbol(
  ""
);
function Oe(t, e, n) {
  if (nt && me) {
    let i = gi.get(t);
    i || gi.set(t, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new Li()), s.map = i, s.key = n), s.track();
  }
}
function Ct(t, e, n, i, s, r) {
  const o = gi.get(t);
  if (!o) {
    Rn++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (js(), e === "clear")
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
          l ? u && a(o.get("length")) : (a(o.get(Zt)), an(t) && a(o.get(bs)));
          break;
        case "delete":
          l || (a(o.get(Zt)), an(t) && a(o.get(bs)));
          break;
        case "set":
          an(t) && a(o.get(Zt));
          break;
      }
  }
  Hs();
}
function ql(t, e) {
  const n = gi.get(t);
  return n && n.get(e);
}
function tn(t) {
  const e = /* @__PURE__ */ ue(t);
  return e === t ? e : (Oe(e, "iterate", $n), /* @__PURE__ */ Ue(t) ? e : e.map(rt));
}
function Ri(t) {
  return Oe(t = /* @__PURE__ */ ue(t), "iterate", $n), t;
}
function Ft(t, e) {
  return /* @__PURE__ */ Pt(t) ? dn(/* @__PURE__ */ Qt(t) ? rt(e) : e) : rt(e);
}
const Ul = {
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
    return _t(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return _t(
      this,
      "filter",
      t,
      e,
      (n) => n.map((i) => Ft(this, i)),
      arguments
    );
  },
  find(t, e) {
    return _t(
      this,
      "find",
      t,
      e,
      (n) => Ft(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return _t(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return _t(
      this,
      "findLast",
      t,
      e,
      (n) => Ft(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return _t(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return _t(this, "forEach", t, e, void 0, arguments);
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
    return _t(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return wn(this, "pop");
  },
  push(...t) {
    return wn(this, "push", t);
  },
  reduce(t, ...e) {
    return mr(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return mr(this, "reduceRight", t, e);
  },
  shift() {
    return wn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return _t(this, "some", t, e, void 0, arguments);
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
  return i !== t && !/* @__PURE__ */ Ue(t) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
const Kl = Array.prototype;
function _t(t, e, n, i, s, r) {
  const o = Ri(t), a = o !== t && !/* @__PURE__ */ Ue(t), l = o[e];
  if (l !== Kl[e]) {
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
function mr(t, e, n, i) {
  const s = Ri(t);
  let r = n;
  return s !== t && (/* @__PURE__ */ Ue(t) ? n.length > 3 && (r = function(o, a, l) {
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
  Tt(), js();
  const i = (/* @__PURE__ */ ue(t))[e].apply(t, n);
  return Hs(), At(), i;
}
const Gl = /* @__PURE__ */ Fs("__proto__,__v_isRef,__isVue"), Ko = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(st)
);
function Xl(t) {
  st(t) || (t = String(t));
  const e = /* @__PURE__ */ ue(this);
  return Oe(e, "has", t), e.hasOwnProperty(t);
}
class Go {
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
      return i === (s ? r ? rc : Zo : r ? Jo : Yo).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = Y(e);
    if (!s) {
      let l;
      if (o && (l = Ul[n]))
        return l;
      if (n === "hasOwnProperty")
        return Xl;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ce(e) ? e : i
    );
    if ((st(n) ? Ko.has(n) : Gl(n)) || (s || Oe(e, "get", n), r))
      return a;
    if (/* @__PURE__ */ Ce(a)) {
      const l = o && Mi(n) ? a : a.value;
      return s && he(l) ? /* @__PURE__ */ _s(l) : l;
    }
    return he(a) ? s ? /* @__PURE__ */ _s(a) : /* @__PURE__ */ Un(a) : a;
  }
}
class Xo extends Go {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, s) {
    let r = e[n];
    const o = Y(e) && Mi(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ Pt(r);
      if (!/* @__PURE__ */ Ue(i) && !/* @__PURE__ */ Pt(i) && (r = /* @__PURE__ */ ue(r), i = /* @__PURE__ */ ue(i)), !o && /* @__PURE__ */ Ce(r) && !/* @__PURE__ */ Ce(i))
        return u || (r.value = i), !0;
    }
    const a = o ? Number(n) < e.length : fe(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Ce(e) ? e : s
    );
    return e === /* @__PURE__ */ ue(s) && (a ? Re(i, r) && Ct(e, "set", n, i) : Ct(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = fe(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && i && Ct(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!st(n) || !Ko.has(n)) && Oe(e, "has", n), i;
  }
  ownKeys(e) {
    return Oe(
      e,
      "iterate",
      Y(e) ? "length" : Zt
    ), Reflect.ownKeys(e);
  }
}
class Yl extends Go {
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
const Jl = /* @__PURE__ */ new Xo(), Zl = /* @__PURE__ */ new Yl(), Ql = /* @__PURE__ */ new Xo(!0);
const ys = (t) => t, Qn = (t) => Reflect.getPrototypeOf(t);
function ec(t, e, n) {
  return function(...i) {
    const s = this.__v_raw, r = /* @__PURE__ */ ue(s), o = an(r), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, u = s[t](...i), c = n ? ys : e ? dn : rt;
    return !e && Oe(
      r,
      "iterate",
      l ? bs : Zt
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
function tc(t, e) {
  const n = {
    get(s) {
      const r = this.__v_raw, o = /* @__PURE__ */ ue(r), a = /* @__PURE__ */ ue(s);
      t || (Re(s, a) && Oe(o, "get", s), Oe(o, "get", a));
      const { has: l } = Qn(o), u = e ? ys : t ? dn : rt;
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
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ ue(a), u = e ? ys : t ? dn : rt;
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
        !e && !/* @__PURE__ */ Ue(s) && !/* @__PURE__ */ Pt(s) && (s = /* @__PURE__ */ ue(s));
        const r = /* @__PURE__ */ ue(this);
        return Qn(r).has.call(r, s) || (r.add(s), Ct(r, "add", s, s)), this;
      },
      set(s, r) {
        !e && !/* @__PURE__ */ Ue(r) && !/* @__PURE__ */ Pt(r) && (r = /* @__PURE__ */ ue(r));
        const o = /* @__PURE__ */ ue(this), { has: a, get: l } = Qn(o);
        let u = a.call(o, s);
        u || (s = /* @__PURE__ */ ue(s), u = a.call(o, s));
        const c = l.call(o, s);
        return o.set(s, r), u ? Re(r, c) && Ct(o, "set", s, r) : Ct(o, "add", s, r), this;
      },
      delete(s) {
        const r = /* @__PURE__ */ ue(this), { has: o, get: a } = Qn(r);
        let l = o.call(r, s);
        l || (s = /* @__PURE__ */ ue(s), l = o.call(r, s)), a && a.call(r, s);
        const u = r.delete(s);
        return l && Ct(r, "delete", s, void 0), u;
      },
      clear() {
        const s = /* @__PURE__ */ ue(this), r = s.size !== 0, o = s.clear();
        return r && Ct(
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
    n[s] = ec(s, t, e);
  }), n;
}
function Vs(t, e) {
  const n = tc(t, e);
  return (i, s, r) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? i : Reflect.get(
    fe(n, s) && s in i ? n : i,
    s,
    r
  );
}
const nc = {
  get: /* @__PURE__ */ Vs(!1, !1)
}, ic = {
  get: /* @__PURE__ */ Vs(!1, !0)
}, sc = {
  get: /* @__PURE__ */ Vs(!0, !1)
};
const Yo = /* @__PURE__ */ new WeakMap(), Jo = /* @__PURE__ */ new WeakMap(), Zo = /* @__PURE__ */ new WeakMap(), rc = /* @__PURE__ */ new WeakMap();
function oc(t) {
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
function ac(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : oc(Ml(t));
}
// @__NO_SIDE_EFFECTS__
function Un(t) {
  return /* @__PURE__ */ Pt(t) ? t : qs(
    t,
    !1,
    Jl,
    nc,
    Yo
  );
}
// @__NO_SIDE_EFFECTS__
function Kn(t) {
  return qs(
    t,
    !1,
    Ql,
    ic,
    Jo
  );
}
// @__NO_SIDE_EFFECTS__
function _s(t) {
  return qs(
    t,
    !0,
    Zl,
    sc,
    Zo
  );
}
function qs(t, e, n, i, s) {
  if (!he(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const r = ac(t);
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
  return /* @__PURE__ */ Pt(t) ? /* @__PURE__ */ Qt(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Pt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ue(t) {
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
function Qo(t) {
  return !fe(t, "__v_skip") && Object.isExtensible(t) && Oo(t, "__v_skip", !0), t;
}
const rt = (t) => he(t) ? /* @__PURE__ */ Un(t) : t, dn = (t) => he(t) ? /* @__PURE__ */ _s(t) : t;
// @__NO_SIDE_EFFECTS__
function Ce(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function q(t) {
  return ea(t, !1);
}
// @__NO_SIDE_EFFECTS__
function fn(t) {
  return ea(t, !0);
}
function ea(t, e) {
  return /* @__PURE__ */ Ce(t) ? t : new lc(t, e);
}
class lc {
  constructor(e, n) {
    this.dep = new Li(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ue(e), this._value = n ? e : rt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ Ue(e) || /* @__PURE__ */ Pt(e);
    e = i ? e : /* @__PURE__ */ ue(e), Re(e, n) && (this._rawValue = e, this._value = i ? e : rt(e), this.dep.trigger());
  }
}
function g(t) {
  return /* @__PURE__ */ Ce(t) ? t.value : t;
}
function it(t) {
  return ne(t) ? t() : g(t);
}
const cc = {
  get: (t, e, n) => e === "__v_raw" ? t : g(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const s = t[e];
    return /* @__PURE__ */ Ce(s) && !/* @__PURE__ */ Ce(n) ? (s.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function ta(t) {
  return /* @__PURE__ */ Qt(t) ? t : new Proxy(t, cc);
}
class uc {
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
function dc(t) {
  return new uc(t);
}
// @__NO_SIDE_EFFECTS__
function na(t) {
  const e = Y(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = ia(t, n);
  return e;
}
class fc {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ue(e);
    let s = !0, r = e;
    if (!Y(e) || !Mi(String(n)))
      do
        s = !/* @__PURE__ */ $i(r) || /* @__PURE__ */ Ue(r);
      while (s && (r = r.__v_raw));
    this._shallow = s;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = g(e)), this._value = e === void 0 ? this._defaultValue : e;
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
    return ql(this._raw, this._key);
  }
}
class hc {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Yi(t, e, n) {
  return /* @__PURE__ */ Ce(t) ? t : ne(t) ? new hc(t) : he(t) && arguments.length > 1 ? ia(t, e, n) : /* @__PURE__ */ q(t);
}
function ia(t, e, n) {
  return new fc(t, e, n);
}
class pc {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new Li(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Rn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    me !== this)
      return jo(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return Vo(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function vc(t, e, n = !1) {
  let i, s;
  return ne(t) ? i = t : (i = t.get, s = t.set), new pc(i, s, n);
}
const ti = {}, bi = /* @__PURE__ */ new WeakMap();
let Gt;
function mc(t, e = !1, n = Gt) {
  if (n) {
    let i = bi.get(n);
    i || bi.set(n, i = []), i.push(t);
  }
}
function gc(t, e, n = de) {
  const { immediate: i, deep: s, once: r, scheduler: o, augmentJob: a, call: l } = n, u = (w) => s ? w : /* @__PURE__ */ Ue(w) || s === !1 || s === 0 ? kt(w, 1) : kt(w);
  let c, d, h, f, p = !1, m = !1;
  if (/* @__PURE__ */ Ce(t) ? (d = () => t.value, p = /* @__PURE__ */ Ue(t)) : /* @__PURE__ */ Qt(t) ? (d = () => u(t), p = !0) : Y(t) ? (m = !0, p = t.some((w) => /* @__PURE__ */ Qt(w) || /* @__PURE__ */ Ue(w)), d = () => t.map((w) => {
    if (/* @__PURE__ */ Ce(w))
      return w.value;
    if (/* @__PURE__ */ Qt(w))
      return u(w);
    if (ne(w))
      return l ? l(w, 2) : w();
  })) : ne(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (h) {
      Tt();
      try {
        h();
      } finally {
        At();
      }
    }
    const w = Gt;
    Gt = c;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      Gt = w;
    }
  } : d = mt, e && s) {
    const w = d, M = s === !0 ? 1 / 0 : s;
    d = () => kt(w(), M);
  }
  const y = zo(), S = () => {
    c.stop(), y && y.active && Bs(y.effects, c);
  };
  if (r && e) {
    const w = e;
    e = (...M) => {
      w(...M), S();
    };
  }
  let x = m ? new Array(t.length).fill(ti) : ti;
  const _ = (w) => {
    if (!(!(c.flags & 1) || !c.dirty && !w))
      if (e) {
        const M = c.run();
        if (s || p || (m ? M.some((E, k) => Re(E, x[k])) : Re(M, x))) {
          h && h();
          const E = Gt;
          Gt = c;
          try {
            const k = [
              M,
              // pass undefined as the old value when it's changed for the first time
              x === ti ? void 0 : m && x[0] === ti ? [] : x,
              f
            ];
            x = M, l ? l(e, 3, k) : (
              // @ts-expect-error
              e(...k)
            );
          } finally {
            Gt = E;
          }
        }
      } else
        c.run();
  };
  return a && a(_), c = new Bo(d), c.scheduler = o ? () => o(_, !1) : _, f = (w) => mc(w, !1, c), h = c.onStop = () => {
    const w = bi.get(c);
    if (w) {
      if (l)
        l(w, 4);
      else
        for (const M of w) M();
      bi.delete(c);
    }
  }, e ? i ? _(!0) : x = c.run() : o ? o(_.bind(null, !0), !0) : c.run(), S.pause = c.pause.bind(c), S.resume = c.resume.bind(c), S.stop = S, S;
}
function kt(t, e = 1 / 0, n) {
  if (e <= 0 || !he(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Ce(t))
    kt(t.value, e, n);
  else if (Y(t))
    for (let i = 0; i < t.length; i++)
      kt(t[i], e, n);
  else if (Po(t) || an(t))
    t.forEach((i) => {
      kt(i, e, n);
    });
  else if (Pi(t)) {
    for (const i in t)
      kt(t[i], e, n);
    for (const i of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, i) && kt(t[i], e, n);
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
    return s && Mo(s) && s.catch((r) => {
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
      Tt(), Gn(r, null, 10, [
        t,
        l,
        u
      ]), At();
      return;
    }
  }
  bc(t, n, s, i, o);
}
function bc(t, e, n, i = !0, s = !1) {
  if (s)
    throw t;
  console.error(t);
}
const $e = [];
let ht = -1;
const ln = [];
let zt = null, rn = 0;
const sa = /* @__PURE__ */ Promise.resolve();
let yi = null;
function at(t) {
  const e = yi || sa;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function yc(t) {
  let e = ht + 1, n = $e.length;
  for (; e < n; ) {
    const i = e + n >>> 1, s = $e[i], r = Fn(s);
    r < t || r === t && s.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Us(t) {
  if (!(t.flags & 1)) {
    const e = Fn(t), n = $e[$e.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= Fn(n) ? $e.push(t) : $e.splice(yc(e), 0, t), t.flags |= 1, ra();
  }
}
function ra() {
  yi || (yi = sa.then(aa));
}
function _c(t) {
  Y(t) ? ln.push(...t) : zt && t.id === -1 ? zt.splice(rn + 1, 0, t) : t.flags & 1 || (ln.push(t), t.flags |= 1), ra();
}
function gr(t, e, n = ht + 1) {
  for (; n < $e.length; n++) {
    const i = $e[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      $e.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function oa(t) {
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
function aa(t) {
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
    ht = -1, $e.length = 0, oa(), yi = null, ($e.length || ln.length) && aa();
  }
}
let Te = null, la = null;
function _i(t) {
  const e = Te;
  return Te = t, la = t && t.type.__scopeId || null, e;
}
function se(t, e = Te, n) {
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
function wc(t, e) {
  if (Te === null)
    return t;
  const n = Wi(Te), i = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [r, o, a, l = de] = e[s];
    r && (ne(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && kt(o), i.push({
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
    l && (Tt(), ot(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), At());
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
const xc = /* @__PURE__ */ Symbol.for("v-scx"), Sc = () => Et(xc);
function Nt(t, e) {
  return zi(t, null, e);
}
function Cc(t, e) {
  return zi(
    t,
    null,
    { flush: "sync" }
  );
}
function ge(t, e, n) {
  return zi(t, e, n);
}
function zi(t, e, n = de) {
  const { immediate: i, deep: s, flush: r, once: o } = n, a = xe({}, n), l = e && i || !e && r !== "post";
  let u;
  if (jn) {
    if (r === "sync") {
      const f = Sc();
      u = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = mt, f.resume = mt, f.pause = mt, f;
    }
  }
  const c = De;
  a.call = (f, p, m) => ot(f, c, p, m);
  let d = !1;
  r === "post" ? a.scheduler = (f) => {
    Me(f, c && c.suspense);
  } : r !== "sync" && (d = !0, a.scheduler = (f, p) => {
    p ? f() : Us(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, c && (f.id = c.uid, f.i = c));
  };
  const h = gc(t, e, a);
  return jn && (u ? u.push(h) : l && h()), h;
}
function kc(t, e, n) {
  const i = this.proxy, s = _e(t) ? t.includes(".") ? ca(i, t) : () => i[t] : t.bind(i, i);
  let r;
  ne(e) ? r = e : (r = e.handler, n = e);
  const o = Xn(this), a = zi(s, r.bind(i), n);
  return o(), a;
}
function ca(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let s = 0; s < n.length && i; s++)
      i = i[n[s]];
    return i;
  };
}
const ua = /* @__PURE__ */ Symbol("_vte"), da = (t) => t.__isTeleport, In = (t) => t && (t.disabled || t.disabled === ""), br = (t) => t && (t.defer || t.defer === ""), yr = (t) => typeof SVGElement < "u" && t instanceof SVGElement, _r = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, ws = (t, e) => {
  const n = t && t.to;
  return _e(n) ? e ? e(n) : null : n;
}, fa = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, s, r, o, a, l, u) {
    const {
      mc: c,
      pc: d,
      pbc: h,
      o: { insert: f, querySelector: p, createText: m, createComment: y }
    } = u, S = In(e.props);
    let { shapeFlag: x, children: _, dynamicChildren: w } = e;
    if (t == null) {
      const M = e.el = m(""), E = e.anchor = m("");
      f(M, n, i), f(E, n, i);
      const k = (T, I) => {
        x & 16 && c(
          _,
          T,
          I,
          s,
          r,
          o,
          a,
          l
        );
      }, H = () => {
        const T = e.target = ws(e.props, p), I = xs(T, e, m, f);
        T && (o !== "svg" && yr(T) ? o = "svg" : o !== "mathml" && _r(T) && (o = "mathml"), s && s.isCE && (s.ce._teleportTargets || (s.ce._teleportTargets = /* @__PURE__ */ new Set())).add(T), S || (k(T, I), li(e, !1)));
      };
      S && (k(n, E), li(e, !0)), br(e.props) ? (e.el.__isMounted = !1, Me(() => {
        H(), delete e.el.__isMounted;
      }, r)) : H();
    } else {
      if (br(e.props) && t.el.__isMounted === !1) {
        Me(() => {
          fa.process(
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
      const M = e.anchor = t.anchor, E = e.target = t.target, k = e.targetAnchor = t.targetAnchor, H = In(t.props), T = H ? n : E, I = H ? M : k;
      if (o === "svg" || yr(E) ? o = "svg" : (o === "mathml" || _r(E)) && (o = "mathml"), w ? (h(
        t.dynamicChildren,
        w,
        T,
        s,
        r,
        o,
        a
      ), Ys(t, e, !0)) : l || d(
        t,
        e,
        T,
        I,
        s,
        r,
        o,
        a,
        !1
      ), S)
        H ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : ni(
          e,
          n,
          M,
          u,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const $ = e.target = ws(
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
        E,
        k,
        u,
        1
      );
      li(e, S);
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
        const m = a[p];
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
  move: ni,
  hydrate: Ec
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
function Ec(t, e, n, i, s, r, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: u, createText: c }
}, d) {
  function h(y, S) {
    let x = S;
    for (; x; ) {
      if (x && x.nodeType === 8) {
        if (x.data === "teleport start anchor")
          e.targetStart = x;
        else if (x.data === "teleport anchor") {
          e.targetAnchor = x, y._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      x = o(x);
    }
  }
  function f(y, S) {
    S.anchor = d(
      o(y),
      S,
      a(y),
      n,
      i,
      s,
      r
    );
  }
  const p = e.target = ws(
    e.props,
    l
  ), m = In(e.props);
  if (p) {
    const y = p._lpa || p.firstChild;
    e.shapeFlag & 16 && (m ? (f(t, e), h(p, y), e.targetAnchor || xs(
      p,
      e,
      c,
      u,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === p ? t : null
    )) : (e.anchor = o(t), h(p, y), e.targetAnchor || xs(p, e, c, u), d(
      y && o(y),
      e,
      p,
      n,
      i,
      s,
      r
    ))), li(e, m);
  } else m && e.shapeFlag & 16 && (f(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Tc = fa;
function li(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, s;
    for (e ? (i = t.el, s = t.anchor) : (i = t.targetStart, s = t.targetAnchor); i && i !== s; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function xs(t, e, n, i, s = null) {
  const r = e.targetStart = n(""), o = e.targetAnchor = n("");
  return r[ua] = o, t && (i(r, t, s), i(o, t, s)), o;
}
const pt = /* @__PURE__ */ Symbol("_leaveCb"), xn = /* @__PURE__ */ Symbol("_enterCb");
function Ac() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Ge(() => {
    t.isMounted = !0;
  }), Dt(() => {
    t.isUnmounting = !0;
  }), t;
}
const Xe = [Function, Array], ha = {
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
}, pa = (t) => {
  const e = t.subTree;
  return e.component ? pa(e.component) : e;
}, Pc = {
  name: "BaseTransition",
  props: ha,
  setup(t, { slots: e }) {
    const n = Qe(), i = Ac();
    return () => {
      const s = e.default && ga(e.default(), !0);
      if (!s || !s.length)
        return;
      const r = va(s), o = /* @__PURE__ */ ue(t), { mode: a } = o;
      if (i.isLeaving)
        return Ji(r);
      const l = wr(r);
      if (!l)
        return Ji(r);
      let u = Ss(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => u = d
      );
      l.type !== Ee && zn(l, u);
      let c = n.subTree && wr(n.subTree);
      if (c && c.type !== Ee && !Yt(c, l) && pa(n).type !== Ee) {
        let d = Ss(
          c,
          o,
          i,
          n
        );
        if (zn(c, d), a === "out-in" && l.type !== Ee)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, Ji(r);
        a === "in-out" && l.type !== Ee ? d.delayLeave = (h, f, p) => {
          const m = ma(
            i,
            c
          );
          m[String(c.key)] = c, h[pt] = () => {
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
function va(t) {
  let e = t[0];
  if (t.length > 1) {
    for (const n of t)
      if (n.type !== Ee) {
        e = n;
        break;
      }
  }
  return e;
}
const Mc = Pc;
function ma(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function Ss(t, e, n, i, s) {
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
    onLeaveCancelled: m,
    onBeforeAppear: y,
    onAppear: S,
    onAfterAppear: x,
    onAppearCancelled: _
  } = e, w = String(t.key), M = ma(n, t), E = (T, I) => {
    T && ot(
      T,
      i,
      9,
      I
    );
  }, k = (T, I) => {
    const $ = I[1];
    E(T, I), Y(T) ? T.every((P) => P.length <= 1) && $() : T.length <= 1 && $();
  }, H = {
    mode: o,
    persisted: a,
    beforeEnter(T) {
      let I = l;
      if (!n.isMounted)
        if (r)
          I = y || l;
        else
          return;
      T[pt] && T[pt](
        !0
        /* cancelled */
      );
      const $ = M[w];
      $ && Yt(t, $) && $.el[pt] && $.el[pt](), E(I, [T]);
    },
    enter(T) {
      let I = u, $ = c, P = d;
      if (!n.isMounted)
        if (r)
          I = S || u, $ = x || c, P = _ || d;
        else
          return;
      let V = !1;
      T[xn] = (G) => {
        V || (V = !0, G ? E(P, [T]) : E($, [T]), H.delayedLeave && H.delayedLeave(), T[xn] = void 0);
      };
      const z = T[xn].bind(null, !1);
      I ? k(I, [T, z]) : z();
    },
    leave(T, I) {
      const $ = String(t.key);
      if (T[xn] && T[xn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return I();
      E(h, [T]);
      let P = !1;
      T[pt] = (z) => {
        P || (P = !0, I(), z ? E(m, [T]) : E(p, [T]), T[pt] = void 0, M[$] === t && delete M[$]);
      };
      const V = T[pt].bind(null, !1);
      M[$] = t, f ? k(f, [T, V]) : V();
    },
    clone(T) {
      const I = Ss(
        T,
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
    return t = Mt(t), t.children = null, t;
}
function wr(t) {
  if (!Bi(t))
    return da(t.type) && t.children ? va(t.children) : t;
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
function ga(t, e = !1, n) {
  let i = [], s = 0;
  for (let r = 0; r < t.length; r++) {
    let o = t[r];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : r);
    o.type === be ? (o.patchFlag & 128 && s++, i = i.concat(
      ga(o.children, e, a)
    )) : (e || o.type !== Ee) && i.push(a != null ? Mt(o, { key: a }) : o);
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
function Ks() {
  const t = Qe();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function ba(t) {
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
function xr(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const wi = /* @__PURE__ */ new WeakMap();
function On(t, e, n, i, s = !1) {
  if (Y(t)) {
    t.forEach(
      (m, y) => On(
        m,
        e && (Y(e) ? e[y] : e),
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
  const r = i.shapeFlag & 4 ? Wi(i.component) : i.el, o = s ? null : r, { i: a, r: l } = t, u = e && e.r, c = a.refs === de ? a.refs = {} : a.refs, d = a.setupState, h = /* @__PURE__ */ ue(d), f = d === de ? Ao : (m) => xr(c, m) ? !1 : fe(h, m), p = (m, y) => !(y && xr(c, y));
  if (u != null && u !== l) {
    if (Sr(e), _e(u))
      c[u] = null, f(u) && (d[u] = null);
    else if (/* @__PURE__ */ Ce(u)) {
      const m = e;
      p(u, m.k) && (u.value = null), m.k && (c[m.k] = null);
    }
  }
  if (ne(l))
    Gn(l, a, 12, [o, c]);
  else {
    const m = _e(l), y = /* @__PURE__ */ Ce(l);
    if (m || y) {
      const S = () => {
        if (t.f) {
          const x = m ? f(l) ? d[l] : c[l] : p() || !t.k ? l.value : c[t.k];
          if (s)
            Y(x) && Bs(x, r);
          else if (Y(x))
            x.includes(r) || x.push(r);
          else if (m)
            c[l] = [r], f(l) && (d[l] = c[l]);
          else {
            const _ = [r];
            p(l, t.k) && (l.value = _), t.k && (c[t.k] = _);
          }
        } else m ? (c[l] = o, f(l) && (d[l] = o)) : y && (p(l, t.k) && (l.value = o), t.k && (c[t.k] = o));
      };
      if (o) {
        const x = () => {
          S(), wi.delete(t);
        };
        x.id = -1, wi.set(t, x), Me(x, n);
      } else
        Sr(t), S();
    }
  }
}
function Sr(t) {
  const e = wi.get(t);
  e && (e.flags |= 8, wi.delete(t));
}
Di().requestIdleCallback;
Di().cancelIdleCallback;
const cn = (t) => !!t.type.__asyncLoader, Bi = (t) => t.type.__isKeepAlive;
function Ic(t, e) {
  ya(t, "a", e);
}
function Oc(t, e) {
  ya(t, "da", e);
}
function ya(t, e, n = De) {
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
      Bi(s.parent.vnode) && Dc(i, e, n, s), s = s.parent;
  }
}
function Dc(t, e, n, i) {
  const s = Ni(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  en(() => {
    Bs(i[e], s);
  }, n);
}
function Ni(t, e, n = De, i = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), r = e.__weh || (e.__weh = (...o) => {
      Tt();
      const a = Xn(n), l = ot(e, n, t, o);
      return a(), At(), l;
    });
    return i ? s.unshift(r) : s.push(r), r;
  }
}
const Ot = (t) => (e, n = De) => {
  (!jn || t === "sp") && Ni(t, (...i) => e(...i), n);
}, Lc = Ot("bm"), Ge = Ot("m"), Rc = Ot(
  "bu"
), $c = Ot("u"), Dt = Ot(
  "bum"
), en = Ot("um"), Fc = Ot(
  "sp"
), zc = Ot("rtg"), Bc = Ot("rtc");
function Nc(t, e = De) {
  Ni("ec", t, e);
}
const jc = "components", _a = /* @__PURE__ */ Symbol.for("v-ndc");
function wa(t) {
  return _e(t) ? Hc(jc, t, !1) || t : t || _a;
}
function Hc(t, e, n = !0, i = !1) {
  const s = Te || De;
  if (s) {
    const r = s.type;
    {
      const a = Eu(
        r,
        !1
      );
      if (a && (a === e || a === Ae(e) || a === Oi(Ae(e))))
        return r;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Cr(s[t] || r[t], e) || // global registration
      Cr(s.appContext[t], e)
    );
    return !o && i ? r : o;
  }
}
function Cr(t, e) {
  return t && (t[e] || t[Ae(e)] || t[Oi(Ae(e))]);
}
function vn(t, e, n, i) {
  let s;
  const r = n && n[i], o = Y(t);
  if (o || _e(t)) {
    const a = o && /* @__PURE__ */ Qt(t);
    let l = !1, u = !1;
    a && (l = !/* @__PURE__ */ Ue(t), u = /* @__PURE__ */ Pt(t), t = Ri(t)), s = new Array(t.length);
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
  if (Te.ce || Te.parent && cn(Te.parent) && Te.parent.ce) {
    const u = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), A(), K(
      be,
      null,
      [U("slot", n, i && i())],
      u ? -2 : 64
    );
  }
  let r = t[e];
  r && r._c && (r._d = !1), A();
  const o = r && xa(r(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
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
function xa(t) {
  return t.some((e) => Nn(e) ? !(e.type === Ee || e.type === be && !xa(e.children)) : !0) ? t : null;
}
const Cs = (t) => t ? Wa(t) ? Wi(t) : Cs(t.parent) : null, Dn = (
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
    $parent: (t) => Cs(t.parent),
    $root: (t) => Cs(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => Ca(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Us(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = at.bind(t.proxy)),
    $watch: (t) => kc.bind(t)
  })
), Zi = (t, e) => t !== de && !t.__isScriptSetup && fe(t, e), Wc = {
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
        ks && (o[e] = 0);
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
function Vc() {
  return qc().slots;
}
function qc(t) {
  const e = Qe();
  return e.setupContext || (e.setupContext = qa(e));
}
function kr(t) {
  return Y(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let ks = !0;
function Uc(t) {
  const e = Ca(t), n = t.proxy, i = t.ctx;
  ks = !1, e.beforeCreate && Er(e.beforeCreate, t, "bc");
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
    activated: m,
    deactivated: y,
    beforeDestroy: S,
    beforeUnmount: x,
    destroyed: _,
    unmounted: w,
    render: M,
    renderTracked: E,
    renderTriggered: k,
    errorCaptured: H,
    serverPrefetch: T,
    // public API
    expose: I,
    inheritAttrs: $,
    // assets
    components: P,
    directives: V,
    filters: z
  } = e;
  if (u && Kc(u, i, null), o)
    for (const te in o) {
      const le = o[te];
      ne(le) && (i[te] = le.bind(n));
    }
  if (s) {
    const te = s.call(n, n);
    he(te) && (t.data = /* @__PURE__ */ Un(te));
  }
  if (ks = !0, r)
    for (const te in r) {
      const le = r[te], ke = ne(le) ? le.bind(n, n) : ne(le.get) ? le.get.bind(n, n) : mt, lt = !ne(le) && ne(le.set) ? le.set.bind(n) : mt, yt = N({
        get: ke,
        set: lt
      });
      Object.defineProperty(i, te, {
        enumerable: !0,
        configurable: !0,
        get: () => yt.value,
        set: (Ne) => yt.value = Ne
      });
    }
  if (a)
    for (const te in a)
      Sa(a[te], i, n, te);
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
  if (ae(Lc, d), ae(Ge, h), ae(Rc, f), ae($c, p), ae(Ic, m), ae(Oc, y), ae(Nc, H), ae(Bc, E), ae(zc, k), ae(Dt, x), ae(en, w), ae(Fc, T), Y(I))
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
  M && t.render === mt && (t.render = M), $ != null && (t.inheritAttrs = $), P && (t.components = P), V && (t.directives = V), T && ba(t);
}
function Kc(t, e, n = mt) {
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
function Sa(t, e, n, i) {
  let s = i.includes(".") ? ca(n, i) : () => n[i];
  if (_e(t)) {
    const r = e[t];
    ne(r) && ge(s, r);
  } else if (ne(t))
    ge(s, t.bind(n));
  else if (he(t))
    if (Y(t))
      t.forEach((r) => Sa(r, e, n, i));
    else {
      const r = ne(t.handler) ? t.handler.bind(n) : e[t.handler];
      ne(r) && ge(s, r, t);
    }
}
function Ca(t) {
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
      const a = Gc[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Gc = {
  data: Tr,
  props: Ar,
  emits: Ar,
  // objects
  methods: En,
  computed: En,
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
  components: En,
  directives: En,
  // watch
  watch: Yc,
  // provide / inject
  provide: Tr,
  inject: Xc
};
function Tr(t, e) {
  return e ? t ? function() {
    return xe(
      ne(t) ? t.call(this, this) : t,
      ne(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Xc(t, e) {
  return En(Es(t), Es(e));
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
function En(t, e) {
  return t ? xe(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Ar(t, e) {
  return t ? Y(t) && Y(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : xe(
    /* @__PURE__ */ Object.create(null),
    kr(t),
    kr(e ?? {})
  ) : e;
}
function Yc(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = xe(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Le(t[i], e[i]);
  return n;
}
function ka() {
  return {
    app: null,
    config: {
      isNativeTag: Ao,
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
let Jc = 0;
function Zc(t, e) {
  return function(i, s = null) {
    ne(i) || (i = xe({}, i)), s != null && !he(s) && (s = null);
    const r = ka(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const u = r.app = {
      _uid: Jc++,
      _component: i,
      _props: s,
      _container: null,
      _context: r,
      _instance: null,
      version: Pu,
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
function Qc(t, e, n = de) {
  const i = Qe(), s = Ae(e), r = Ve(e), o = Ea(t, s), a = dc((l, u) => {
    let c, d = de, h;
    return Cc(() => {
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
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || s in m || r in m) && (`onUpdate:${e}` in m || `onUpdate:${s}` in m || `onUpdate:${r}` in m) || (c = f, u()), i.emit(`update:${e}`, p), Re(f, p) && Re(f, d) && !Re(p, h) && u(), d = f, h = p;
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
function eu(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || de;
  let s = n;
  const r = e.startsWith("update:"), o = r && Ea(i, e.slice(7));
  o && (o.trim && (s = n.map((c) => _e(c) ? c.trim() : c)), o.number && (s = n.map(Dl)));
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
const tu = /* @__PURE__ */ new WeakMap();
function Ta(t, e, n = !1) {
  const i = n ? tu : e.emitsCache, s = i.get(t);
  if (s !== void 0)
    return s;
  const r = t.emits;
  let o = {}, a = !1;
  if (!ne(t)) {
    const l = (u) => {
      const c = Ta(u, e, !0);
      c && (a = !0, xe(o, c));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !r && !a ? (he(t) && i.set(t, null), null) : (Y(r) ? r.forEach((l) => o[l] = null) : xe(o, r), he(t) && i.set(t, o), o);
}
function ji(t, e) {
  return !t || !Ai(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), fe(t, e[0].toLowerCase() + e.slice(1)) || fe(t, Ve(e)) || fe(t, e));
}
function Pr(t) {
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
    inheritAttrs: m
  } = t, y = _i(t);
  let S, x;
  try {
    if (n.shapeFlag & 4) {
      const w = s || i, M = w;
      S = vt(
        u.call(
          M,
          w,
          c,
          d,
          f,
          h,
          p
        )
      ), x = a;
    } else {
      const w = e;
      S = vt(
        w.length > 1 ? w(
          d,
          { attrs: a, slots: o, emit: l }
        ) : w(
          d,
          null
        )
      ), x = e.props ? a : nu(a);
    }
  } catch (w) {
    Ln.length = 0, Fi(w, t, 1), S = U(Ee);
  }
  let _ = S;
  if (x && m !== !1) {
    const w = Object.keys(x), { shapeFlag: M } = _;
    w.length && M & 7 && (r && w.some(zs) && (x = iu(
      x,
      r
    )), _ = Mt(_, x, !1, !0));
  }
  return n.dirs && (_ = Mt(_, null, !1, !0), _.dirs = _.dirs ? _.dirs.concat(n.dirs) : n.dirs), n.transition && zn(_, n.transition), S = _, _i(y), S;
}
const nu = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || Ai(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, iu = (t, e) => {
  const n = {};
  for (const i in t)
    (!zs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function su(t, e, n) {
  const { props: i, children: s, component: r } = t, { props: o, children: a, patchFlag: l } = e, u = r.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Mr(i, o, u) : !!o;
    if (l & 8) {
      const c = e.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const h = c[d];
        if (Aa(o, i, h) && !ji(u, h))
          return !0;
      }
    }
  } else
    return (s || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Mr(i, o, u) : !0 : !!o;
  return !1;
}
function Mr(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    if (Aa(e, t, r) && !ji(n, r))
      return !0;
  }
  return !1;
}
function Aa(t, e, n) {
  const i = t[n], s = e[n];
  return n === "style" && he(i) && he(s) ? !Ns(i, s) : i !== s;
}
function ru({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Pa = {}, Ma = () => Object.create(Pa), Ia = (t) => Object.getPrototypeOf(t) === Pa;
function ou(t, e, n, i = !1) {
  const s = {}, r = Ma();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), Oa(t, e, s, r);
  for (const o in t.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? t.props = i ? s : /* @__PURE__ */ Kn(s) : t.type.props ? t.props = s : t.props = r, t.attrs = r;
}
function au(t, e, n, i) {
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
            s[p] = Ts(
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
    Oa(t, e, s, r) && (u = !0);
    let c;
    for (const d in a)
      (!e || // for camelCase
      !fe(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Ve(d)) === d || !fe(e, c))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (s[d] = Ts(
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
  u && Ct(t.attrs, "set", "");
}
function Oa(t, e, n, i) {
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
      n[d] = Ts(
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
function Ts(t, e, n, i, s, r) {
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
const lu = /* @__PURE__ */ new WeakMap();
function Da(t, e, n = !1) {
  const i = n ? lu : e.propsCache, s = i.get(t);
  if (s)
    return s;
  const r = t.props, o = {}, a = [];
  let l = !1;
  if (!ne(t)) {
    const c = (d) => {
      l = !0;
      const [h, f] = Da(d, e, !0);
      xe(o, h), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(c), t.extends && c(t.extends), t.mixins && t.mixins.forEach(c);
  }
  if (!r && !l)
    return he(t) && i.set(t, on), on;
  if (Y(r))
    for (let c = 0; c < r.length; c++) {
      const d = Ae(r[c]);
      Ir(d) && (o[d] = de);
    }
  else if (r)
    for (const c in r) {
      const d = Ae(c);
      if (Ir(d)) {
        const h = r[c], f = o[d] = Y(h) || ne(h) ? { type: h } : xe({}, h), p = f.type;
        let m = !1, y = !0;
        if (Y(p))
          for (let S = 0; S < p.length; ++S) {
            const x = p[S], _ = ne(x) && x.name;
            if (_ === "Boolean") {
              m = !0;
              break;
            } else _ === "String" && (y = !1);
          }
        else
          m = ne(p) && p.name === "Boolean";
        f[
          0
          /* shouldCast */
        ] = m, f[
          1
          /* shouldCastTrue */
        ] = y, (m || fe(f, "default")) && a.push(d);
      }
    }
  const u = [o, a];
  return he(t) && i.set(t, u), u;
}
function Ir(t) {
  return t[0] !== "$" && !An(t);
}
const Gs = (t) => t === "_" || t === "_ctx" || t === "$stable", Xs = (t) => Y(t) ? t.map(vt) : [vt(t)], cu = (t, e, n) => {
  if (e._n)
    return e;
  const i = se((...s) => Xs(e(...s)), n);
  return i._c = !1, i;
}, La = (t, e, n) => {
  const i = t._ctx;
  for (const s in t) {
    if (Gs(s)) continue;
    const r = t[s];
    if (ne(r))
      e[s] = cu(s, r, i);
    else if (r != null) {
      const o = Xs(r);
      e[s] = () => o;
    }
  }
}, Ra = (t, e) => {
  const n = Xs(e);
  t.slots.default = () => n;
}, $a = (t, e, n) => {
  for (const i in e)
    (n || !Gs(i)) && (t[i] = e[i]);
}, uu = (t, e, n) => {
  const i = t.slots = Ma();
  if (t.vnode.shapeFlag & 32) {
    const s = e._;
    s ? ($a(i, e, n), n && Oo(i, "_", s, !0)) : La(e, i);
  } else e && Ra(t, e);
}, du = (t, e, n) => {
  const { vnode: i, slots: s } = t;
  let r = !0, o = de;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? r = !1 : $a(s, e, n) : (r = !e.$stable, La(e, s)), o = e;
  } else e && (Ra(t, e), o = { default: 1 });
  if (r)
    for (const a in s)
      !Gs(a) && o[a] == null && delete s[a];
}, Me = mu;
function fu(t) {
  return hu(t);
}
function hu(t, e) {
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
  } = t, m = (v, b, C, R = null, O = null, D = null, j = void 0, B = null, F = !!b.dynamicChildren) => {
    if (v === b)
      return;
    v && !Yt(v, b) && (R = Zn(v), Ne(v, O, D, !0), v = null), b.patchFlag === -2 && (F = !1, b.dynamicChildren = null);
    const { type: L, ref: J, shapeFlag: W } = b;
    switch (L) {
      case Hi:
        y(v, b, C, R);
        break;
      case Ee:
        S(v, b, C, R);
        break;
      case ci:
        v == null && x(b, C, R, j);
        break;
      case be:
        P(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          B,
          F
        );
        break;
      default:
        W & 1 ? M(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          B,
          F
        ) : W & 6 ? V(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          B,
          F
        ) : (W & 64 || W & 128) && L.process(
          v,
          b,
          C,
          R,
          O,
          D,
          j,
          B,
          F,
          yn
        );
    }
    J != null && O ? On(J, v && v.ref, D, b || v, !b) : J == null && v && v.ref != null && On(v.ref, null, D, v, !0);
  }, y = (v, b, C, R) => {
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
  }, S = (v, b, C, R) => {
    v == null ? i(
      b.el = l(b.children || ""),
      C,
      R
    ) : b.el = v.el;
  }, x = (v, b, C, R) => {
    [v.el, v.anchor] = p(
      v.children,
      b,
      C,
      R,
      v.el,
      v.anchor
    );
  }, _ = ({ el: v, anchor: b }, C, R) => {
    let O;
    for (; v && v !== b; )
      O = h(v), i(v, C, R), v = O;
    i(b, C, R);
  }, w = ({ el: v, anchor: b }) => {
    let C;
    for (; v && v !== b; )
      C = h(v), s(v), v = C;
    s(b);
  }, M = (v, b, C, R, O, D, j, B, F) => {
    if (b.type === "svg" ? j = "svg" : b.type === "math" && (j = "mathml"), v == null)
      E(
        b,
        C,
        R,
        O,
        D,
        j,
        B,
        F
      );
    else {
      const L = v.el && v.el._isVueCE ? v.el : null;
      try {
        L && L._beginPatch(), T(
          v,
          b,
          O,
          D,
          j,
          B,
          F
        );
      } finally {
        L && L._endPatch();
      }
    }
  }, E = (v, b, C, R, O, D, j, B) => {
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
      B
    ), ie && Vt(v, null, R, "created"), k(F, v, v.scopeId, j, R), J) {
      for (const ve in J)
        ve !== "value" && !An(ve) && r(F, ve, null, J[ve], D, R);
      "value" in J && r(F, "value", null, J.value, D), (L = J.onVnodeBeforeMount) && ft(L, R, v);
    }
    ie && Vt(v, null, R, "beforeMount");
    const ce = pu(O, X);
    ce && X.beforeEnter(F), i(F, b, C), ((L = J && J.onVnodeMounted) || ce || ie) && Me(() => {
      L && ft(L, R, v), ce && X.enter(F), ie && Vt(v, null, R, "mounted");
    }, O);
  }, k = (v, b, C, R, O) => {
    if (C && f(v, C), R)
      for (let D = 0; D < R.length; D++)
        f(v, R[D]);
    if (O) {
      let D = O.subTree;
      if (b === D || Ba(D.type) && (D.ssContent === b || D.ssFallback === b)) {
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
  }, H = (v, b, C, R, O, D, j, B, F = 0) => {
    for (let L = F; L < v.length; L++) {
      const J = v[L] = B ? St(v[L]) : vt(v[L]);
      m(
        null,
        J,
        b,
        C,
        R,
        O,
        D,
        j,
        B
      );
    }
  }, T = (v, b, C, R, O, D, j) => {
    const B = b.el = v.el;
    let { patchFlag: F, dynamicChildren: L, dirs: J } = b;
    F |= v.patchFlag & 16;
    const W = v.props || de, X = b.props || de;
    let ie;
    if (C && qt(C, !1), (ie = X.onVnodeBeforeUpdate) && ft(ie, C, b, v), J && Vt(b, v, C, "beforeUpdate"), C && qt(C, !0), (W.innerHTML && X.innerHTML == null || W.textContent && X.textContent == null) && c(B, ""), L ? I(
      v.dynamicChildren,
      L,
      B,
      C,
      R,
      Qi(b, O),
      D
    ) : j || le(
      v,
      b,
      B,
      null,
      C,
      R,
      Qi(b, O),
      D,
      !1
    ), F > 0) {
      if (F & 16)
        $(B, W, X, C, O);
      else if (F & 2 && W.class !== X.class && r(B, "class", null, X.class, O), F & 4 && r(B, "style", W.style, X.style, O), F & 8) {
        const ce = b.dynamicProps;
        for (let ve = 0; ve < ce.length; ve++) {
          const pe = ce[ve], je = W[pe], He = X[pe];
          (He !== je || pe === "value") && r(B, pe, je, He, O, C);
        }
      }
      F & 1 && v.children !== b.children && c(B, b.children);
    } else !j && L == null && $(B, W, X, C, O);
    ((ie = X.onVnodeUpdated) || J) && Me(() => {
      ie && ft(ie, C, b, v), J && Vt(b, v, C, "updated");
    }, R);
  }, I = (v, b, C, R, O, D, j) => {
    for (let B = 0; B < b.length; B++) {
      const F = v[B], L = b[B], J = (
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
      m(
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
        const j = C[D], B = b[D];
        j !== B && D !== "value" && r(v, D, B, j, O, R);
      }
      "value" in C && r(v, "value", b.value, C.value, O);
    }
  }, P = (v, b, C, R, O, D, j, B, F) => {
    const L = b.el = v ? v.el : a(""), J = b.anchor = v ? v.anchor : a("");
    let { patchFlag: W, dynamicChildren: X, slotScopeIds: ie } = b;
    ie && (B = B ? B.concat(ie) : ie), v == null ? (i(L, C, R), i(J, C, R), H(
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
      B,
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
      B
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (b.key != null || O && b === O.subTree) && Ys(
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
      B,
      F
    );
  }, V = (v, b, C, R, O, D, j, B, F) => {
    b.slotScopeIds = B, v == null ? b.shapeFlag & 512 ? O.ctx.activate(
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
    const B = v.component = xu(
      v,
      R,
      O
    );
    if (Bi(v) && (B.ctx.renderer = yn), Su(B, !1, j), B.asyncDep) {
      if (O && O.registerDep(B, ae, j), !v.el) {
        const F = B.subTree = U(Ee);
        S(null, F, b, C), v.placeholder = F.el;
      }
    } else
      ae(
        B,
        v,
        b,
        C,
        O,
        D,
        j
      );
  }, G = (v, b, C) => {
    const R = b.component = v.component;
    if (su(v, b, C))
      if (R.asyncDep && !R.asyncResolved) {
        te(R, b, C);
        return;
      } else
        R.next = b, R.update();
    else
      b.el = v.el, R.vnode = b;
  }, ae = (v, b, C, R, O, D, j) => {
    const B = () => {
      if (v.isMounted) {
        let { next: W, bu: X, u: ie, parent: ce, vnode: ve } = v;
        {
          const ut = Fa(v);
          if (ut) {
            W && (W.el = ve.el, te(v, W, j)), ut.asyncDep.then(() => {
              Me(() => {
                v.isUnmounted || L();
              }, O);
            });
            return;
          }
        }
        let pe = W, je;
        qt(v, !1), W ? (W.el = ve.el, te(v, W, j)) : W = ve, X && qi(X), (je = W.props && W.props.onVnodeBeforeUpdate) && ft(je, ce, W, ve), qt(v, !0);
        const He = Pr(v), ct = v.subTree;
        v.subTree = He, m(
          ct,
          He,
          // parent may have changed if it's in a teleport
          d(ct.el),
          // anchor may have changed if it's in a fragment
          Zn(ct),
          v,
          O,
          D
        ), W.el = He.el, pe === null && ru(v, He.el), ie && Me(ie, O), (je = W.props && W.props.onVnodeUpdated) && Me(
          () => ft(je, ce, W, ve),
          O
        );
      } else {
        let W;
        const { el: X, props: ie } = b, { bm: ce, m: ve, parent: pe, root: je, type: He } = v, ct = cn(b);
        qt(v, !1), ce && qi(ce), !ct && (W = ie && ie.onVnodeBeforeMount) && ft(W, pe, b), qt(v, !0);
        {
          je.ce && je.ce._hasShadowRoot() && je.ce._injectChildStyle(He);
          const ut = v.subTree = Pr(v);
          m(
            null,
            ut,
            C,
            R,
            v,
            O,
            D
          ), b.el = ut.el;
        }
        if (ve && Me(ve, O), !ct && (W = ie && ie.onVnodeMounted)) {
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
    const F = v.effect = new Bo(B);
    v.scope.off();
    const L = v.update = F.run.bind(F), J = v.job = F.runIfDirty.bind(F);
    J.i = v, J.id = v.uid, F.scheduler = () => Us(J), qt(v, !0), L();
  }, te = (v, b, C) => {
    b.component = v;
    const R = v.vnode.props;
    v.vnode = b, v.next = null, au(v, b.props, R, C), du(v, b.children, C), Tt(), gr(v), At();
  }, le = (v, b, C, R, O, D, j, B, F = !1) => {
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
          B,
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
          B,
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
      B,
      F
    ) : bn(L, O, D, !0) : (J & 8 && c(C, ""), ie & 16 && H(
      W,
      C,
      R,
      O,
      D,
      j,
      B,
      F
    ));
  }, ke = (v, b, C, R, O, D, j, B, F) => {
    v = v || on, b = b || on;
    const L = v.length, J = b.length, W = Math.min(L, J);
    let X;
    for (X = 0; X < W; X++) {
      const ie = b[X] = F ? St(b[X]) : vt(b[X]);
      m(
        v[X],
        ie,
        C,
        null,
        O,
        D,
        j,
        B,
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
      B,
      F,
      W
    );
  }, lt = (v, b, C, R, O, D, j, B, F) => {
    let L = 0;
    const J = b.length;
    let W = v.length - 1, X = J - 1;
    for (; L <= W && L <= X; ) {
      const ie = v[L], ce = b[L] = F ? St(b[L]) : vt(b[L]);
      if (Yt(ie, ce))
        m(
          ie,
          ce,
          C,
          null,
          O,
          D,
          j,
          B,
          F
        );
      else
        break;
      L++;
    }
    for (; L <= W && L <= X; ) {
      const ie = v[W], ce = b[X] = F ? St(b[X]) : vt(b[X]);
      if (Yt(ie, ce))
        m(
          ie,
          ce,
          C,
          null,
          O,
          D,
          j,
          B,
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
          m(
            null,
            b[L] = F ? St(b[L]) : vt(b[L]),
            C,
            ce,
            O,
            D,
            j,
            B,
            F
          ), L++;
      }
    } else if (L > X)
      for (; L <= W; )
        Ne(v[L], O, D, !0), L++;
    else {
      const ie = L, ce = L, ve = /* @__PURE__ */ new Map();
      for (L = ce; L <= X; L++) {
        const qe = b[L] = F ? St(b[L]) : vt(b[L]);
        qe.key != null && ve.set(qe.key, L);
      }
      let pe, je = 0;
      const He = X - ce + 1;
      let ct = !1, ut = 0;
      const _n = new Array(He);
      for (L = 0; L < He; L++) _n[L] = 0;
      for (L = ie; L <= W; L++) {
        const qe = v[L];
        if (je >= He) {
          Ne(qe, O, D, !0);
          continue;
        }
        let dt;
        if (qe.key != null)
          dt = ve.get(qe.key);
        else
          for (pe = ce; pe <= X; pe++)
            if (_n[pe - ce] === 0 && Yt(qe, b[pe])) {
              dt = pe;
              break;
            }
        dt === void 0 ? Ne(qe, O, D, !0) : (_n[dt - ce] = L + 1, dt >= ut ? ut = dt : ct = !0, m(
          qe,
          b[dt],
          C,
          null,
          O,
          D,
          j,
          B,
          F
        ), je++);
      }
      const ur = ct ? vu(_n) : on;
      for (pe = ur.length - 1, L = He - 1; L >= 0; L--) {
        const qe = ce + L, dt = b[qe], dr = b[qe + 1], fr = qe + 1 < J ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          dr.el || za(dr)
        ) : R;
        _n[L] === 0 ? m(
          null,
          dt,
          C,
          fr,
          O,
          D,
          j,
          B,
          F
        ) : ct && (pe < 0 || L !== ur[pe] ? yt(dt, C, fr, 2) : pe--);
      }
    }
  }, yt = (v, b, C, R, O = null) => {
    const { el: D, type: j, transition: B, children: F, shapeFlag: L } = v;
    if (L & 6) {
      yt(v.component.subTree, b, C, R);
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
        yt(F[W], b, C, R);
      i(v.anchor, b, C);
      return;
    }
    if (j === ci) {
      _(v, b, C);
      return;
    }
    if (R !== 2 && L & 1 && B)
      if (R === 0)
        B.beforeEnter(D), i(D, b, C), Me(() => B.enter(D), O);
      else {
        const { leave: W, delayLeave: X, afterLeave: ie } = B, ce = () => {
          v.ctx.isUnmounted ? s(D) : i(D, b, C);
        }, ve = () => {
          D._isLeaving && D[pt](
            !0
            /* cancelled */
          ), W(D, () => {
            ce(), ie && ie();
          });
        };
        X ? X(D, ce, ve) : ve();
      }
    else
      i(D, b, C);
  }, Ne = (v, b, C, R = !1, O = !1) => {
    const {
      type: D,
      props: j,
      ref: B,
      children: F,
      dynamicChildren: L,
      shapeFlag: J,
      patchFlag: W,
      dirs: X,
      cacheIndex: ie
    } = v;
    if (W === -2 && (O = !1), B != null && (Tt(), On(B, null, C, v, !0), At()), ie != null && (b.renderCache[ie] = void 0), J & 256) {
      b.ctx.deactivate(v);
      return;
    }
    const ce = J & 1 && X, ve = !cn(v);
    let pe;
    if (ve && (pe = j && j.onVnodeBeforeUnmount) && ft(pe, b, v), J & 6)
      Al(v.component, C, R);
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
    (ve && (pe = j && j.onVnodeUnmounted) || ce) && Me(() => {
      pe && ft(pe, b, v), ce && Vt(v, null, b, "unmounted");
    }, C);
  }, gn = (v) => {
    const { type: b, el: C, anchor: R, transition: O } = v;
    if (b === be) {
      Tl(C, R);
      return;
    }
    if (b === ci) {
      w(v);
      return;
    }
    const D = () => {
      s(C), O && !O.persisted && O.afterLeave && O.afterLeave();
    };
    if (v.shapeFlag & 1 && O && !O.persisted) {
      const { leave: j, delayLeave: B } = O, F = () => j(C, D);
      B ? B(v.el, D, F) : F();
    } else
      D();
  }, Tl = (v, b) => {
    let C;
    for (; v !== b; )
      C = h(v), s(v), v = C;
    s(b);
  }, Al = (v, b, C) => {
    const { bum: R, scope: O, job: D, subTree: j, um: B, m: F, a: L } = v;
    Or(F), Or(L), R && qi(R), O.stop(), D && (D.flags |= 8, Ne(j, v, b, C)), B && Me(B, b), Me(() => {
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
    const b = h(v.anchor || v.el), C = b && b[ua];
    return C ? h(C) : b;
  };
  let Vi = !1;
  const cr = (v, b, C) => {
    let R;
    v == null ? b._vnode && (Ne(b._vnode, null, null, !0), R = b._vnode.component) : m(
      b._vnode || null,
      v,
      b,
      null,
      null,
      null,
      C
    ), b._vnode = v, Vi || (Vi = !0, gr(R), oa(), Vi = !1);
  }, yn = {
    p: m,
    um: Ne,
    m: yt,
    r: gn,
    mt: z,
    mc: H,
    pc: le,
    pbc: I,
    n: Zn,
    o: t
  };
  return {
    render: cr,
    hydrate: void 0,
    createApp: Zc(cr)
  };
}
function Qi({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function qt({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function pu(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function Ys(t, e, n = !1) {
  const i = t.children, s = e.children;
  if (Y(i) && Y(s))
    for (let r = 0; r < i.length; r++) {
      const o = i[r];
      let a = s[r];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = s[r] = St(s[r]), a.el = o.el), !n && a.patchFlag !== -2 && Ys(o, a)), a.type === Hi && (a.patchFlag === -1 && (a = s[r] = St(a)), a.el = o.el), a.type === Ee && !a.el && (a.el = o.el);
    }
}
function vu(t) {
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
function Fa(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : Fa(e);
}
function Or(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function za(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? za(e.subTree) : null;
}
const Ba = (t) => t.__isSuspense;
function mu(t, e) {
  e && e.pendingBranch ? Y(t) ? e.effects.push(...t) : e.effects.push(t) : _c(t);
}
const be = /* @__PURE__ */ Symbol.for("v-fgt"), Hi = /* @__PURE__ */ Symbol.for("v-txt"), Ee = /* @__PURE__ */ Symbol.for("v-cmt"), ci = /* @__PURE__ */ Symbol.for("v-stc"), Ln = [];
let ze = null;
function A(t = !1) {
  Ln.push(ze = t ? null : []);
}
function gu() {
  Ln.pop(), ze = Ln[Ln.length - 1] || null;
}
let hn = 1;
function Si(t, e = !1) {
  hn += t, t < 0 && ze && e && (ze.hasOnce = !0);
}
function Na(t) {
  return t.dynamicChildren = hn > 0 ? ze || on : null, gu(), hn > 0 && ze && ze.push(t), t;
}
function Q(t, e, n, i, s, r) {
  return Na(
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
  return Na(
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
const ja = ({ key: t }) => t ?? null, ui = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? _e(t) || /* @__PURE__ */ Ce(t) || ne(t) ? { i: Te, r: t, k: e, f: !!n } : t : null);
function Z(t, e = null, n = null, i = 0, s = null, r = t === be ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && ja(e),
    ref: e && ui(e),
    scopeId: la,
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
    ctx: Te
  };
  return a ? (Js(l, n), r & 128 && t.normalize(l)) : n && (l.shapeFlag |= _e(n) ? 8 : 16), hn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  ze && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && ze.push(l), l;
}
const U = bu;
function bu(t, e = null, n = null, i = 0, s = null, r = !1) {
  if ((!t || t === _a) && (t = Ee), Nn(t)) {
    const a = Mt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Js(a, n), hn > 0 && !r && ze && (a.shapeFlag & 6 ? ze[ze.indexOf(t)] = a : ze.push(a)), a.patchFlag = -2, a;
  }
  if (Tu(t) && (t = t.__vccOpts), e) {
    e = Ha(e);
    let { class: a, style: l } = e;
    a && !_e(a) && (e.class = Ze(a)), he(l) && (/* @__PURE__ */ $i(l) && !Y(l) && (l = xe({}, l)), e.style = It(l));
  }
  const o = _e(t) ? 1 : Ba(t) ? 128 : da(t) ? 64 : he(t) ? 4 : ne(t) ? 2 : 0;
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
function Ha(t) {
  return t ? /* @__PURE__ */ $i(t) || Ia(t) ? xe({}, t) : t : null;
}
function Mt(t, e, n = !1, i = !1) {
  const { props: s, ref: r, patchFlag: o, children: a, transition: l } = t, u = e ? Be(s || {}, e) : s, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: u,
    key: u && ja(u),
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
    ssContent: t.ssContent && Mt(t.ssContent),
    ssFallback: t.ssFallback && Mt(t.ssFallback),
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
function Ke(t = " ", e = 0) {
  return U(Hi, null, t, e);
}
function yu(t, e) {
  const n = U(ci, null, t);
  return n.staticCount = e, n;
}
function oe(t = "", e = !1) {
  return e ? (A(), K(Ee, null, t)) : U(Ee, null, t);
}
function vt(t) {
  return t == null || typeof t == "boolean" ? U(Ee) : Y(t) ? U(
    be,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : Nn(t) ? St(t) : U(Hi, null, String(t));
}
function St(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Mt(t);
}
function Js(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (Y(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), Js(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !Ia(e) ? e._ctx = Te : s === 3 && Te && (Te.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else ne(e) ? (e = { default: e, _ctx: Te }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Ke(e)]) : n = 8);
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
        e.style = It([e.style, i.style]);
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
const _u = ka();
let wu = 0;
function xu(t, e, n) {
  const i = t.type, s = (e ? e.appContext : t.appContext) || _u, r = {
    uid: wu++,
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
    scope: new $o(
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
    propsOptions: Da(i, s),
    emitsOptions: Ta(i, s),
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
  return r.ctx = { _: r }, r.root = e ? e.root : r, r.emit = eu.bind(null, r), t.ce && t.ce(r), r;
}
let De = null;
const Qe = () => De || Te;
let Ci, As;
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
  ), As = e(
    "__VUE_SSR_SETTERS__",
    (n) => jn = n
  );
}
const Xn = (t) => {
  const e = De;
  return Ci(t), t.scope.on(), () => {
    t.scope.off(), Ci(e);
  };
}, Dr = () => {
  De && De.scope.off(), Ci(null);
};
function Wa(t) {
  return t.vnode.shapeFlag & 4;
}
let jn = !1;
function Su(t, e = !1, n = !1) {
  e && As(e);
  const { props: i, children: s } = t.vnode, r = Wa(t);
  ou(t, i, r, e), uu(t, s, n || e);
  const o = r ? Cu(t, e) : void 0;
  return e && As(!1), o;
}
function Cu(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Wc);
  const { setup: i } = n;
  if (i) {
    Tt();
    const s = t.setupContext = i.length > 1 ? qa(t) : null, r = Xn(t), o = Gn(
      i,
      t,
      0,
      [
        t.props,
        s
      ]
    ), a = Mo(o);
    if (At(), r(), (a || t.sp) && !cn(t) && ba(t), a) {
      if (o.then(Dr, Dr), e)
        return o.then((l) => {
          Lr(t, l);
        }).catch((l) => {
          Fi(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Lr(t, o);
  } else
    Va(t);
}
function Lr(t, e, n) {
  ne(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : he(e) && (t.setupState = ta(e)), Va(t);
}
function Va(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || mt);
  {
    const s = Xn(t);
    Tt();
    try {
      Uc(t);
    } finally {
      At(), s();
    }
  }
}
const ku = {
  get(t, e) {
    return Oe(t, "get", ""), t[e];
  }
};
function qa(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, ku),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Wi(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(ta(Qo(t.exposed)), {
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
function Eu(t, e = !0) {
  return ne(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Tu(t) {
  return ne(t) && "__vccOpts" in t;
}
const N = (t, e) => /* @__PURE__ */ vc(t, e, jn);
function gt(t, e, n) {
  try {
    Si(-1);
    const i = arguments.length;
    return i === 2 ? he(e) && !Y(e) ? Nn(e) ? U(t, null, [e]) : U(t, e) : U(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && Nn(n) && (n = [n]), U(t, e, n));
  } finally {
    Si(1);
  }
}
function Au(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Re(n[i], e[i]))
      return !1;
  return hn > 0 && ze && ze.push(t), !0;
}
const Pu = "3.5.28";
let Ps;
const Rr = typeof window < "u" && window.trustedTypes;
if (Rr)
  try {
    Ps = /* @__PURE__ */ Rr.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const Ua = Ps ? (t) => Ps.createHTML(t) : (t) => t, Mu = "http://www.w3.org/2000/svg", Iu = "http://www.w3.org/1998/Math/MathML", xt = typeof document < "u" ? document : null, $r = xt && /* @__PURE__ */ xt.createElement("template"), Ou = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const s = e === "svg" ? xt.createElementNS(Mu, t) : e === "mathml" ? xt.createElementNS(Iu, t) : n ? xt.createElement(t, { is: n }) : xt.createElement(t);
    return t === "select" && i && i.multiple != null && s.setAttribute("multiple", i.multiple), s;
  },
  createText: (t) => xt.createTextNode(t),
  createComment: (t) => xt.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => xt.querySelector(t),
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
      $r.innerHTML = Ua(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = $r.content;
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
}, Rt = "transition", Sn = "animation", Hn = /* @__PURE__ */ Symbol("_vtc"), Ka = {
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
}, Du = /* @__PURE__ */ xe(
  {},
  ha,
  Ka
), Lu = (t) => (t.displayName = "Transition", t.props = Du, t), Zs = /* @__PURE__ */ Lu(
  (t, { slots: e }) => gt(Mc, Ru(t), e)
), Ut = (t, e = []) => {
  Y(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Fr = (t) => t ? Y(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Ru(t) {
  const e = {};
  for (const P in t)
    P in Ka || (e[P] = t[P]);
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
  } = t, p = $u(s), m = p && p[0], y = p && p[1], {
    onBeforeEnter: S,
    onEnter: x,
    onEnterCancelled: _,
    onLeave: w,
    onLeaveCancelled: M,
    onBeforeAppear: E = S,
    onAppear: k = x,
    onAppearCancelled: H = _
  } = e, T = (P, V, z, G) => {
    P._enterCancelled = G, Kt(P, V ? c : a), Kt(P, V ? u : o), z && z();
  }, I = (P, V) => {
    P._isLeaving = !1, Kt(P, d), Kt(P, f), Kt(P, h), V && V();
  }, $ = (P) => (V, z) => {
    const G = P ? k : x, ae = () => T(V, P, z);
    Ut(G, [V, ae]), zr(() => {
      Kt(V, P ? l : r), wt(V, P ? c : a), Fr(G) || Br(V, i, m, ae);
    });
  };
  return xe(e, {
    onBeforeEnter(P) {
      Ut(S, [P]), wt(P, r), wt(P, o);
    },
    onBeforeAppear(P) {
      Ut(E, [P]), wt(P, l), wt(P, u);
    },
    onEnter: $(!1),
    onAppear: $(!0),
    onLeave(P, V) {
      P._isLeaving = !0;
      const z = () => I(P, V);
      wt(P, d), P._enterCancelled ? (wt(P, h), Hr(P)) : (Hr(P), wt(P, h)), zr(() => {
        P._isLeaving && (Kt(P, d), wt(P, f), Fr(w) || Br(P, i, y, z));
      }), Ut(w, [P, z]);
    },
    onEnterCancelled(P) {
      T(P, !1, void 0, !0), Ut(_, [P]);
    },
    onAppearCancelled(P) {
      T(P, !0, void 0, !0), Ut(H, [P]);
    },
    onLeaveCancelled(P) {
      I(P), Ut(M, [P]);
    }
  });
}
function $u(t) {
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
  return ms(t);
}
function wt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[Hn] || (t[Hn] = /* @__PURE__ */ new Set())).add(e);
}
function Kt(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[Hn];
  n && (n.delete(e), n.size || (t[Hn] = void 0));
}
function zr(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Fu = 0;
function Br(t, e, n, i) {
  const s = t._endId = ++Fu, r = () => {
    s === t._endId && i();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: o, timeout: a, propCount: l } = zu(t, e);
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
function zu(t, e) {
  const n = window.getComputedStyle(t), i = (p) => (n[p] || "").split(", "), s = i(`${Rt}Delay`), r = i(`${Rt}Duration`), o = Nr(s, r), a = i(`${Sn}Delay`), l = i(`${Sn}Duration`), u = Nr(a, l);
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
function Nr(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => jr(n) + jr(t[i])));
}
function jr(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Hr(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function Bu(t, e, n) {
  const i = t[Hn];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const ki = /* @__PURE__ */ Symbol("_vod"), Ga = /* @__PURE__ */ Symbol("_vsh"), Nu = {
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
  t.style.display = e ? t[ki] : "none", t[Ga] = !e;
}
const ju = /* @__PURE__ */ Symbol(""), Hu = /(?:^|;)\s*display\s*:/;
function Wu(t, e, n) {
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
      const o = i[ju];
      o && (n += ";" + o), i.cssText = n, r = Hu.test(n);
    }
  } else e && t.removeAttribute("style");
  ki in t && (t[ki] = r ? i.display : "", t[Ga] && (i.display = "none"));
}
const Wr = /\s*!important$/;
function di(t, e, n) {
  if (Y(n))
    n.forEach((i) => di(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Vu(t, e);
    Wr.test(n) ? t.setProperty(
      Ve(i),
      n.replace(Wr, ""),
      "important"
    ) : t[i] = n;
  }
}
const Vr = ["Webkit", "Moz", "ms"], ts = {};
function Vu(t, e) {
  const n = ts[e];
  if (n)
    return n;
  let i = Ae(e);
  if (i !== "filter" && i in t)
    return ts[e] = i;
  i = Oi(i);
  for (let s = 0; s < Vr.length; s++) {
    const r = Vr[s] + i;
    if (r in t)
      return ts[e] = r;
  }
  return e;
}
const qr = "http://www.w3.org/1999/xlink";
function Ur(t, e, n, i, s, r = Nl(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(qr, e.slice(6, e.length)) : t.setAttributeNS(qr, e, n) : n == null || r && !Do(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    r ? "" : st(n) ? String(n) : n
  );
}
function Kr(t, e, n, i, s) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? Ua(n) : n);
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
    a === "boolean" ? n = Do(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(s || e);
}
function qu(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Uu(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const Gr = /* @__PURE__ */ Symbol("_vei");
function Ku(t, e, n, i, s = null) {
  const r = t[Gr] || (t[Gr] = {}), o = r[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Gu(e);
    if (i) {
      const u = r[e] = Ju(
        i,
        s
      );
      qu(t, a, u, l);
    } else o && (Uu(t, a, o, l), r[e] = void 0);
  }
}
const Xr = /(?:Once|Passive|Capture)$/;
function Gu(t) {
  let e;
  if (Xr.test(t)) {
    e = {};
    let i;
    for (; i = t.match(Xr); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Ve(t.slice(2)), e];
}
let ns = 0;
const Xu = /* @__PURE__ */ Promise.resolve(), Yu = () => ns || (Xu.then(() => ns = 0), ns = Date.now());
function Ju(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    ot(
      Zu(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Yu(), n;
}
function Zu(t, e) {
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
const Yr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, Qu = (t, e, n, i, s, r) => {
  const o = s === "svg";
  e === "class" ? Bu(t, i, o) : e === "style" ? Wu(t, n, i) : Ai(e) ? zs(e) || Ku(t, e, n, i, r) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : ed(t, e, i, o)) ? (Kr(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && Ur(t, e, i, o, r, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !_e(i)) ? Kr(t, Ae(e), i, r, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), Ur(t, e, i, o));
};
function ed(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && Yr(e) && ne(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return Yr(e) && _e(n) ? !1 : e in t;
}
const Jr = {};
// @__NO_SIDE_EFFECTS__
function td(t, e, n) {
  let i = /* @__PURE__ */ ee(t, e);
  Pi(i) && (i = xe({}, i, e));
  class s extends Qs {
    constructor(o) {
      super(i, o, n);
    }
  }
  return s.def = i, s;
}
const nd = typeof HTMLElement < "u" ? HTMLElement : class {
};
class Qs extends nd {
  constructor(e, n = {}, i = Qr) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== Qr ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
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
      if (e instanceof Qs) {
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
          (u === Number || u && u.type === Number) && (l in this._props && (this._props[l] = ms(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[Ae(l)] = !0);
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
          get: () => g(n[i])
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
    let i = n ? this.getAttribute(e) : Jr;
    const s = Ae(e);
    n && this._numberProps && this._numberProps[s] && (i = ms(i)), this._setProp(s, i, !1, !0);
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
    if (n !== this._props[e] && (this._dirty = !0, n === Jr ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), s && this._instance && this._update(), i)) {
      const r = this._ob;
      r && (this._processMutations(r.takeRecords()), r.disconnect()), n === !0 ? this.setAttribute(Ve(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(Ve(e), n + "") : n || this.removeAttribute(Ve(e)), r && r.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), ld(e, this._root);
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
const id = ["ctrl", "shift", "alt", "meta"], sd = {
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
  exact: (t, e) => id.some((n) => t[`${n}Key`] && !e.includes(n))
}, er = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((s, ...r) => {
    for (let o = 0; o < e.length; o++) {
      const a = sd[e[o]];
      if (a && a(s, e)) return;
    }
    return t(s, ...r);
  }));
}, rd = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, od = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((s) => {
    if (!("key" in s))
      return;
    const r = Ve(s.key);
    if (e.some(
      (o) => o === r || rd[o] === r
    ))
      return t(s);
  }));
}, ad = /* @__PURE__ */ xe({ patchProp: Qu }, Ou);
let Zr;
function Xa() {
  return Zr || (Zr = fu(ad));
}
const ld = ((...t) => {
  Xa().render(...t);
}), Qr = ((...t) => {
  const e = Xa().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const s = ud(i);
    if (!s) return;
    const r = e._component;
    !ne(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const o = n(s, !1, cd(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, e;
});
function cd(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function ud(t) {
  return _e(t) ? document.querySelector(t) : t;
}
const dd = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', fd = ["aria-label"], hd = /* @__PURE__ */ ee({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (A(), Q("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ye(e.$slots, "default", {}, void 0, !0)
    ], 8, fd));
  }
}), pd = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", we = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, s] of e)
    n[i] = s;
  return n;
}, eo = /* @__PURE__ */ we(hd, [["styles", [pd]], ["__scopeId", "data-v-3d3f8eba"]]);
const vd = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const to = (t) => t === "";
const md = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const no = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const gd = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const bd = (t) => {
  const e = gd(t);
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
const yd = ({
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
    "stroke-width": to(n) || to(i) || n === !0 || i === !0 ? Number(s || r || kn["stroke-width"]) * 24 / Number(o) : s || r || kn["stroke-width"],
    class: md(
      "lucide",
      l.class,
      ...t ? [`lucide-${no(bd(t))}-icon`, `lucide-${no(t)}`] : ["lucide-icon"]
    ),
    ...!u.default && !vd(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => gt(...c)), ...u.default ? [u.default()] : []]
);
const Pe = (t, e) => (n, { slots: i, attrs: s }) => gt(
  yd,
  {
    ...s,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const _d = Pe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Ya = Pe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const wd = Pe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const xd = Pe("clipboard-list", [
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
const Sd = Pe("clipboard-type", [
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
const Cd = Pe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const kd = Pe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const io = Pe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ed = Pe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Td = Pe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Ad = Pe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Pd = Pe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Md = Pe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Id = Pe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Od = Pe("volume-2", [
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
const Dd = Pe("volume-x", [
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
const tr = Pe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Ld = {
  "arrow-down": _d,
  check: Ya,
  "chevron-down": wd,
  "clipboard-list": xd,
  "clipboard-type": Sd,
  copy: Cd,
  download: kd,
  pause: Ed,
  play: Td,
  settings: Ad,
  "skip-back": Pd,
  "skip-forward": Md,
  users: Id,
  volume: Od,
  "volume-mute": Dd,
  x: tr,
  "circle-notch": io,
  spinner: io
};
function Ms(t) {
  if (t)
    return Ld[t];
}
const Ja = {
  sm: 16,
  md: 20,
  lg: 24
}, Rd = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, $d = /* @__PURE__ */ ee({
  __name: "EditorIcon",
  props: {
    name: { type: String },
    size: { type: Number },
    spin: { type: Boolean }
  },
  setup(t) {
    const e = t, n = N(() => Ms(e.name)), i = N(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (s, r) => n.value ? (A(), K(wa(n.value), {
      key: 0,
      style: It(i.value),
      class: Ze(["editor-icon", { "editor-icon--spin": t.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (A(), Q("span", Rd, "?"));
  }
}), Fd = ".editor-icon[data-v-210c7f09]{flex-shrink:0}.editor-icon--missing[data-v-210c7f09]{display:inline-flex;align-items:center;justify-content:center;opacity:.5;font-size:1em;line-height:1}.editor-icon--spin[data-v-210c7f09]{animation:editor-icon-spin-210c7f09 1s linear infinite}@keyframes editor-icon-spin-210c7f09{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.editor-icon--spin[data-v-210c7f09]{animation:none}}", fi = /* @__PURE__ */ we($d, [["styles", [Fd]], ["__scopeId", "data-v-210c7f09"]]), zd = ["type", "disabled", "aria-disabled", "aria-label"], Bd = {
  key: 3,
  class: "editor-btn__label"
}, Nd = /* @__PURE__ */ ee({
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
    const e = t, n = Vc(), i = N(() => !!Ms(e.icon)), s = N(() => !!Ms(e.iconRight)), r = N(() => Ja[e.size]), o = N(() => e.disabled || e.loading), a = N(() => !!e.label || !!n.default), l = N(
      () => e.loading || i.value || !!n.icon
    ), u = N(() => l.value && !a.value), c = N(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      u.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, h) => (A(), Q("button", {
      type: t.type,
      class: Ze(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": t.ariaLabel
    }, [
      t.loading ? (A(), K(fi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: r.value
      }, null, 8, ["size"])) : i.value ? (A(), K(fi, {
        key: 1,
        name: t.icon,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? ye(d.$slots, "icon", { key: 2 }, void 0, !0) : oe("", !0),
      a.value ? (A(), Q("span", Bd, [
        ye(d.$slots, "default", {}, () => [
          Ke(re(t.label), 1)
        ], !0)
      ])) : oe("", !0),
      s.value ? (A(), K(fi, {
        key: 4,
        name: t.iconRight,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? ye(d.$slots, "icon-right", { key: 5 }, void 0, !0) : oe("", !0)
    ], 10, zd));
  }
}), jd = ".editor-btn[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary);--btn-padding-y: 0;--btn-padding-x: var(--spacing-sm);--btn-font-size: var(--font-size-xs);--btn-height: 32px;--btn-gap: var(--spacing-xs);display:inline-flex;align-items:center;justify-content:center;gap:var(--btn-gap);box-sizing:border-box;height:var(--btn-height);padding:var(--btn-padding-y) var(--btn-padding-x);font-family:var(--font-family);font-size:var(--btn-font-size);font-weight:500;line-height:1;color:var(--btn-text);background-color:var(--btn-bg);border:1px solid var(--btn-border-color);border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap;transition:background-color var(--transition-duration),color var(--transition-duration),border-color var(--transition-duration)}.editor-btn[data-v-88f77497]:hover:not(:disabled){background-color:var(--btn-hover-bg);color:var(--btn-hover-text)}.editor-btn[data-v-88f77497]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-88f77497]:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.editor-btn__label[data-v-88f77497]{text-overflow:ellipsis;text-box:cap alphabetic}.editor-btn--md[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-sm);--btn-height: 40px}.editor-btn--lg[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-base);--btn-height: 44px}.editor-btn--icon-only[data-v-88f77497]{width:var(--btn-height);padding:0}.editor-btn--block[data-v-88f77497]{display:flex;width:100%}.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-primary);--btn-text: var(--color-white);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary-hover);--btn-hover-text: var(--color-white)}.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-primary);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary);--btn-hover-text: var(--color-white)}.editor-btn--tertiary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-primary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--transparent[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: transparent;--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--destructive.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-danger);--btn-text: var(--color-white);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger-hover);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-danger);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--tertiary[data-v-88f77497],.editor-btn--destructive.editor-btn--transparent[data-v-88f77497]{--btn-text: var(--color-danger);--btn-hover-bg: var(--color-danger-soft);--btn-hover-text: var(--color-danger)}", Je = /* @__PURE__ */ we(Nd, [["styles", [jd]], ["__scopeId", "data-v-88f77497"]]), Za = {
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
}, Hd = {
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
}, so = { fr: Za, en: Hd }, Qa = /* @__PURE__ */ Symbol("i18n");
function Wd(t) {
  const e = N(() => {
    const i = so[t.value] ?? so.fr;
    return (s) => i[s] ?? s;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return pn(Qa, n), n;
}
function et() {
  const t = Et(Qa);
  if (t) return t;
  const e = N(() => "fr");
  return {
    t: (n) => Za[n] ?? n,
    locale: e
  };
}
function Vd(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), s = parseInt(n.substring(2, 4), 16), r = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${r}, ${e})`;
}
function nr(t, e, n = "*", i = !0) {
  if (t === "*") return n;
  const s = i ? t.split("-")[0] ?? t : t;
  try {
    const r = new Intl.DisplayNames([e], { type: "language" });
    return r.of(s) ?? r.of(t.split("-")[0] ?? t) ?? t;
  } catch {
    return t;
  }
}
function qd(t, e, n, i = "*") {
  return [...t].sort(
    (r, o) => Number(o.isSource) - Number(r.isSource)
  ).map((r) => ({
    value: r.id,
    label: r.isSource ? n : r.languages.map((o) => nr(o, e, i, !1)).join(", ")
  }));
}
function Ud(t, e = 250) {
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
function Kd(t, e) {
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
function Gd(t) {
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
function Xd(t, e) {
  const { width: n, height: i } = e.canvas, s = t[0], r = s.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * r), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0), c = c + o, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0);
  }
  e.stroke(), e.closePath();
}
function el(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Yd(t, e) {
  if (!el(t)) return null;
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
const Jd = { class: "editor-header" }, Zd = { class: "header-left" }, Qd = { class: "document-title" }, ef = { class: "badges" }, tf = ["datetime"], nf = { class: "header-right" }, sf = /* @__PURE__ */ ee({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = et(), s = N(() => nr(e.language, i.value, n("language.wildcard"))), r = N(() => Wn(e.duration)), o = N(() => e.title.replace(/-/g, " "));
    return (a, l) => (A(), Q("header", Jd, [
      Z("div", Zd, [
        Z("h1", Qd, re(o.value), 1),
        Z("div", ef, [
          U(eo, null, {
            default: se(() => [
              Ke(re(s.value), 1)
            ]),
            _: 1
          }),
          U(eo, null, {
            default: se(() => [
              Z("time", {
                datetime: `PT${t.duration}S`
              }, re(r.value), 9, tf)
            ]),
            _: 1
          })
        ])
      ]),
      Z("div", nf, [
        t.isMobile ? (A(), K(Je, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": g(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : oe("", !0),
        t.isMobile ? (A(), K(Je, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": g(n)("header.export")
        }, null, 8, ["aria-label"])) : (A(), K(Je, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: se(() => [
            Ke(re(g(n)("header.export")), 1)
          ]),
          _: 1
        })),
        U(Je, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": g(n)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), rf = ".editor-header[data-v-c5fd975f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-c5fd975f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-c5fd975f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-c5fd975f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-c5fd975f]{display:none}.document-title[data-v-c5fd975f]{font-size:var(--font-size-base)}}", of = /* @__PURE__ */ we(sf, [["styles", [rf]], ["__scopeId", "data-v-c5fd975f"]]), is = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, af = 70, lf = 1e3 / 60, cf = 350;
let hi = !1, ro = !1;
function uf() {
  ro || typeof document > "u" || (document.addEventListener("mousedown", () => {
    hi = !0;
  }), document.addEventListener("mouseup", () => {
    hi = !1;
  }), document.addEventListener("click", () => {
    hi = !1;
  }), ro = !0);
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
function df(t = {}) {
  uf();
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
    const P = l();
    if (!e.targetScrollTop)
      return P;
    if (u?.targetScrollTop === P)
      return u.calculatedScrollTop;
    const V = Math.max(
      Math.min(
        e.targetScrollTop(P, {
          scrollElement: I,
          contentElement: $
        }),
        P
      ),
      0
    );
    return u = { targetScrollTop: P, calculatedScrollTop: V }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), V;
  }
  function d() {
    return c() - o();
  }
  function h() {
    return d() <= af;
  }
  function f(I) {
    i.isAtBottom = I, s();
  }
  function p(I) {
    i.escapedFromLock = I, s();
  }
  function m(I) {
    i.isNearBottom = I, s();
  }
  function y() {
    if (!hi || typeof window > "u")
      return !1;
    const I = window.getSelection?.();
    if (!I || !I.rangeCount)
      return !1;
    const $ = I.getRangeAt(0), P = i.scrollElement;
    if (!P)
      return !1;
    const V = $.commonAncestorContainer;
    return !!(V && (P.contains(V) || V.contains(P)));
  }
  const S = (I) => {
    if (I.target !== i.scrollElement)
      return;
    const $ = o(), P = i.ignoreScrollToTop;
    let V = i.lastScrollTop ?? $;
    i.lastScrollTop = $, i.ignoreScrollToTop = void 0, P && P > $ && (V = P), m(h()), setTimeout(() => {
      if (i.resizeDifference || $ === P)
        return;
      if (y()) {
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
  }, x = (I) => {
    const $ = i.scrollElement;
    if (!$)
      return;
    let P = I.target;
    for (; P && !["scroll", "auto"].includes(getComputedStyle(P).overflow); ) {
      if (!P.parentElement)
        return;
      P = P.parentElement;
    }
    P === $ && I.deltaY < 0 && $.scrollHeight > $.clientHeight && !i.animation?.ignoreEscapes && (p(!0), f(!1));
  };
  function _(I, $) {
    w(), i.scrollElement = I, i.contentElement = $, getComputedStyle(I).overflow === "visible" && (I.style.overflow = "auto"), I.addEventListener("scroll", S, { passive: !0 }), I.addEventListener("wheel", x, { passive: !0 });
    let P;
    i.resizeObserver = new ResizeObserver((V) => {
      const z = V[0];
      if (!z)
        return;
      const { height: G } = z.contentRect, ae = G - (P ?? G);
      if (i.resizeDifference = ae, o() > l() && a(l()), m(h()), ae >= 0) {
        const te = rs(
          e,
          P ? e.resize : e.initial
        );
        k({
          animation: te,
          wait: !0,
          preserveScrollPosition: !0,
          duration: te === "instant" ? void 0 : cf
        });
      } else
        h() && (p(!1), f(!0));
      P = G, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === ae && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe($);
  }
  function w() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", S), i.scrollElement.removeEventListener("wheel", x)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function M() {
    w(), n.clear();
  }
  function E(I) {
    e = { ...e, ...I };
  }
  function k(I = {}) {
    const $ = typeof I == "string" ? { animation: I } : I;
    $.preserveScrollPosition || f(!0);
    const P = Date.now() + (Number($.wait) || 0), V = rs(e, $.animation), { ignoreEscapes: z = !1 } = $;
    let G, ae = c();
    $.duration instanceof Promise ? $.duration.finally(() => {
      G = Date.now();
    }) : G = P + ($.duration ?? 0);
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
        const ke = o(), lt = typeof performance < "u" ? performance.now() : Date.now(), yt = (lt - (i.lastTick ?? lt)) / lf;
        if (i.animation ||= { behavior: V, promise: le, ignoreEscapes: z }, i.animation.behavior === V && (i.lastTick = lt), y() || P > Date.now())
          return te();
        if (ke < Math.min(ae, c())) {
          if (i.animation?.behavior === V) {
            if (V === "instant")
              return a(c()), te();
            const Ne = V;
            i.velocity = (Ne.damping * i.velocity + Ne.stiffness * d()) / Ne.mass, i.accumulated += i.velocity * yt;
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
  function T(I) {
    return n.add(I), () => n.delete(I);
  }
  return {
    attach: _,
    detach: w,
    destroy: M,
    setOptions: E,
    getState: r,
    onChange: T,
    scrollToBottom: k,
    stopScroll: H
  };
}
function ff(t = {}) {
  const e = /* @__PURE__ */ q(null), n = /* @__PURE__ */ q(null), i = /* @__PURE__ */ q(t.initial !== !1), s = /* @__PURE__ */ q(!1), r = /* @__PURE__ */ q(!1), o = df(t);
  let a = null;
  return Nt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, r.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), Dt(() => {
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
const hf = /* @__PURE__ */ ee({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (A(), Q("span", {
      class: "speaker-indicator",
      style: It({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), pf = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", tl = /* @__PURE__ */ we(hf, [["styles", [pf]], ["__scopeId", "data-v-9bffeda8"]]), vf = { class: "speaker-label" }, mf = {
  key: 1,
  class: "speaker-name"
}, gf = ["datetime"], bf = { class: "lang" }, yf = /* @__PURE__ */ ee({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    startDate: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = et(), s = N(
      () => nr(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), r = N(() => {
      if (e.startTime != null)
        return {
          text: Wn(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const a = new Date(e.startDate * 1e3);
        return {
          text: Kd(e.startDate, i.value),
          datetime: a.toISOString()
        };
      }
      return null;
    }), o = N(() => e.speaker?.color ?? "transparent");
    return (a, l) => (A(), Q("div", vf, [
      t.speaker ? (A(), K(tl, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : oe("", !0),
      t.speaker ? (A(), Q("span", mf, re(t.speaker.name), 1)) : oe("", !0),
      r.value ? (A(), Q("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value.datetime
      }, re(r.value.text), 9, gf)) : oe("", !0),
      Z("span", bf, re(s.value), 1)
    ]));
  }
}), _f = ".speaker-label[data-v-79207560]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-79207560]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-79207560]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);text-box:trim-both cap alphabetic}.lang[data-v-79207560]{font-size:var(--font-size-xs);font-weight:400;text-box:trim-both cap alphabetic}", wf = /* @__PURE__ */ we(yf, [["styles", [_f]], ["__scopeId", "data-v-79207560"]]);
function oo(t) {
  return typeof t == "string" ? `'${t}'` : new xf().serialize(t);
}
const xf = /* @__PURE__ */ (function() {
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
function Is(t, e) {
  return t === e || oo(t) === oo(e);
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
function nl(t, e, n) {
  const i = n.originalEvent.target, s = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(s);
}
function Ei(t) {
  return t == null;
}
function ao(t, e) {
  return Ei(t) ? !1 : Array.isArray(t) ? t.some((n) => Is(n, e)) : Is(t, e);
}
function ir(t) {
  return t ? t.flatMap((e) => e.type === be ? ir(e.children) : [e]) : [];
}
const [Sf] = Yn("ConfigProvider");
function Cf(t, e) {
  return zo() ? (Hl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function kf(t) {
  let e = !1, n;
  const i = Fo(!0);
  return ((...s) => (e || (n = i.run(() => t(...s)), e = !0), n));
}
const jt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Ef = (t) => typeof t < "u", Tf = Object.prototype.toString, Af = (t) => Tf.call(t) === "[object Object]", lo = /* @__PURE__ */ Pf();
function Pf() {
  var t, e, n;
  return jt && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function os(t) {
  return Array.isArray(t) ? t : [t];
}
function Mf(t) {
  return Qe();
}
// @__NO_SIDE_EFFECTS__
function If(t) {
  if (!jt) return t;
  let e = 0, n, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...r) => (e += 1, i || (i = Fo(!0), n = i.run(() => t(...r))), Cf(s), n));
}
function Of(t, e) {
  Mf() && Dt(t, e);
}
function Df(t, e, n) {
  return ge(t, e, {
    ...n,
    immediate: !0
  });
}
const sr = jt ? window : void 0;
function mn(t) {
  var e;
  const n = it(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function il(...t) {
  const e = (i, s, r, o) => (i.addEventListener(s, r, o), () => i.removeEventListener(s, r, o)), n = N(() => {
    const i = os(it(t[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return Df(() => {
    var i, s;
    return [
      (i = (s = n.value) === null || s === void 0 ? void 0 : s.map((r) => mn(r))) !== null && i !== void 0 ? i : [sr].filter((r) => r != null),
      os(it(n.value ? t[1] : t[0])),
      os(g(n.value ? t[2] : t[1])),
      it(n.value ? t[3] : t[2])
    ];
  }, ([i, s, r, o], a, l) => {
    if (!i?.length || !s?.length || !r?.length) return;
    const u = Af(o) ? { ...o } : o, c = i.flatMap((d) => s.flatMap((h) => r.map((f) => e(d, h, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Lf() {
  const t = /* @__PURE__ */ fn(!1), e = Qe();
  return e && Ge(() => {
    t.value = !0;
  }, e), t;
}
function Rf(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function $f(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: s = sr, eventName: r = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = Rf(e);
  return il(s, r, (c) => {
    c.repeat && it(a) || l(c) && n(c);
  }, o);
}
function Ff(t) {
  return JSON.parse(JSON.stringify(t));
}
// @__NO_SIDE_EFFECTS__
function sl(t, e, n, i = {}) {
  var s, r;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Qe(), f = n || h?.emit || (h == null || (s = h.$emit) === null || s === void 0 ? void 0 : s.bind(h)) || (h == null || (r = h.proxy) === null || r === void 0 || (r = r.$emit) === null || r === void 0 ? void 0 : r.bind(h?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (x) => o ? typeof o == "function" ? o(x) : Ff(x) : x, y = () => Ef(t[e]) ? m(t[e]) : c, S = (x) => {
    d ? d(x) && f(p, x) : f(p, x);
  };
  if (a) {
    const x = /* @__PURE__ */ q(y());
    let _ = !1;
    return ge(() => t[e], (w) => {
      _ || (_ = !0, x.value = m(w), at(() => _ = !1));
    }), ge(x, (w) => {
      !_ && (w !== t[e] || u) && S(w);
    }, { deep: u }), x;
  } else return N({
    get() {
      return y();
    },
    set(x) {
      S(x);
    }
  });
}
function as(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Os(t, e, n = ".", i) {
  if (!as(e))
    return Os(t, {}, n, i);
  const s = Object.assign({}, e);
  for (const r in t) {
    if (r === "__proto__" || r === "constructor")
      continue;
    const o = t[r];
    o != null && (i && i(s, r, o, n) || (Array.isArray(o) && Array.isArray(s[r]) ? s[r] = [...o, ...s[r]] : as(o) && as(s[r]) ? s[r] = Os(
      o,
      s[r],
      (n ? `${n}.` : "") + r.toString(),
      i
    ) : s[r] = o));
  }
  return s;
}
function zf(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Os(n, i, "", t), {})
  );
}
const Bf = zf(), Nf = /* @__PURE__ */ If(() => {
  const t = /* @__PURE__ */ q(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ q(), n = N(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = Sf({ scrollBody: /* @__PURE__ */ q(!0) });
  let s = null;
  const r = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", lo && s?.(), e.value = void 0;
  };
  return ge(n, (o, a) => {
    if (!jt) return;
    if (!o) {
      a && r();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Bf({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), lo && (s = il(document, "touchmove", (d) => Hf(d), { passive: !1 })), at(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function jf(t) {
  const e = Math.random().toString(36).substring(2, 7), n = Nf();
  n.value.set(e, t);
  const i = N({
    get: () => n.value.get(e) ?? !1,
    set: (s) => n.value.set(e, s)
  });
  return Of(() => {
    n.value.delete(e);
  }), i;
}
function rl(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : rl(n);
  }
}
function Hf(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && rl(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function rr(t) {
  const e = Qe(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((s) => {
    i[ai(Ae(s))] = (...r) => t(s, ...r);
  }), i;
}
function Wf(t) {
  return N(() => it(t) ? !!mn(t)?.closest("form") : !0);
}
function tt() {
  const t = Qe(), e = /* @__PURE__ */ q(), n = N(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : mn(e)), i = Object.assign({}, t.exposed), s = {};
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
var Vf = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, nn = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), si = {}, ls = 0, ol = function(t) {
  return t && (t.host || ol(t.parentNode));
}, qf = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = ol(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Uf = function(t, e, n, i) {
  var s = qf(e, Array.isArray(t) ? t : [t]);
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
          var f = h.getAttribute(i), p = f !== null && f !== "false", m = (nn.get(h) || 0) + 1, y = (r.get(h) || 0) + 1;
          nn.set(h, m), r.set(h, y), o.push(h), m === 1 && p && ii.set(h, !0), y === 1 && h.setAttribute(n, "true"), p || h.setAttribute(i, "true");
        } catch (S) {
          console.error("aria-hidden: cannot operate on ", h, S);
        }
    });
  };
  return c(e), a.clear(), ls++, function() {
    o.forEach(function(d) {
      var h = nn.get(d) - 1, f = r.get(d) - 1;
      nn.set(d, h), r.set(d, f), h || (ii.has(d) || d.removeAttribute(i), ii.delete(d)), f || d.removeAttribute(n);
    }), ls--, ls || (nn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), si = {});
  };
}, Kf = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), s = Vf(t);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), Uf(i, s, n, "aria-hidden")) : function() {
    return null;
  };
};
function Gf(t) {
  let e;
  ge(() => mn(t), (n) => {
    n ? e = Kf(n) : e && e();
  }), en(() => {
    e && e();
  });
}
function Ds(t, e = "reka") {
  return `${e}-${Ks?.()}`;
}
function Xf(t, e) {
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
function Yf(t, e) {
  const n = /* @__PURE__ */ q({}), i = /* @__PURE__ */ q("none"), s = /* @__PURE__ */ q(t), r = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? sr, { state: l, dispatch: u } = Xf(r, {
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
    if (jt) {
      const S = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(S);
    }
  };
  ge(t, async (y, S) => {
    const x = S !== y;
    if (await at(), x) {
      const _ = i.value, w = ri(e.value);
      y ? (u("MOUNT"), c("enter"), w === "none" && c("after-enter")) : w === "none" || w === "undefined" || n.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : S && _ !== w ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const S = ri(e.value), x = S.includes(CSS.escape(y.animationName)), _ = l.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && x && (c(`after-${_}`), u("ANIMATION_END"), !s.value)) {
      const w = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = w);
      });
    }
    y.target === e.value && S === "none" && u("ANIMATION_END");
  }, h = (y) => {
    y.target === e.value && (i.value = ri(e.value));
  }, f = ge(e, (y, S) => {
    y ? (n.value = getComputedStyle(y), y.addEventListener("animationstart", h), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (u("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), S?.removeEventListener("animationstart", h), S?.removeEventListener("animationcancel", d), S?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = ge(l, () => {
    const y = ri(e.value);
    i.value = l.value === "mounted" ? y : "none";
  });
  return en(() => {
    f(), p();
  }), { isPresent: N(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function ri(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var or = /* @__PURE__ */ ee({
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
    const { present: i, forceMount: s } = /* @__PURE__ */ na(t), r = /* @__PURE__ */ q(), { isPresent: o } = Yf(i, r);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = ir(a || []);
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
const Ls = /* @__PURE__ */ ee({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = ir(n.default()), s = i.findIndex((l) => l.type !== Ee);
      if (s === -1) return i;
      const r = i[s];
      delete r.props?.ref;
      const o = r.props ? Be(e, r.props) : e, a = Mt({
        ...r,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), Jf = [
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
    return typeof i == "string" && Jf.includes(i) ? () => gt(i, e) : i !== "template" ? () => gt(t.as, e, { default: n.default }) : () => gt(Ls, e, { default: n.default });
  }
});
function Rs() {
  const t = /* @__PURE__ */ q(), e = N(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : mn(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [Ht, Zf] = Yn("DialogRoot");
var Qf = /* @__PURE__ */ ee({
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
    const n = t, s = /* @__PURE__ */ sl(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), r = /* @__PURE__ */ q(), o = /* @__PURE__ */ q(), { modal: a } = /* @__PURE__ */ na(n);
    return Zf({
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
      open: g(s),
      close: () => s.value = !1
    });
  }
}), eh = Qf, th = /* @__PURE__ */ ee({
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
    return (i, s) => (A(), K(g(Lt), Be(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (r) => g(n).onOpenChange(!1))
    }), {
      default: se(() => [ye(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), nh = th;
const ih = "dismissableLayer.pointerDownOutside", sh = "dismissableLayer.focusOutside";
function al(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), s = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || s.indexOf(i) < s.indexOf(n)));
}
function rh(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ q(!1), r = /* @__PURE__ */ q(() => {
  });
  return Nt((o) => {
    if (!jt || !it(n)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (al(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let h = function() {
            nl(ih, t, d);
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
function oh(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ q(!1);
  return Nt((r) => {
    if (!jt || !it(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await at(), await at();
      const l = a.target;
      !e.value || !l || al(e.value, l) || a.target && !s.value && nl(sh, t, { originalEvent: a });
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
var ah = /* @__PURE__ */ ee({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = tt(), o = N(() => r.value?.ownerDocument ?? globalThis.document), a = N(() => Ye.layersRoot), l = N(() => r.value ? Array.from(a.value).indexOf(r.value) : -1), u = N(() => Ye.layersWithOutsidePointerEventsDisabled.size > 0), c = N(() => {
      const f = Array.from(a.value), [p] = [...Ye.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(p);
      return l.value >= m;
    }), d = rh(async (f) => {
      const p = [...Ye.branches].some((m) => m?.contains(f.target));
      !c.value || p || (i("pointerDownOutside", f), i("interactOutside", f), await at(), f.defaultPrevented || i("dismiss"));
    }, r), h = oh((f) => {
      [...Ye.branches].some((m) => m?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, r);
    return $f("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), Nt((f) => {
      r.value && (n.disableOutsidePointerEvents && (Ye.layersWithOutsidePointerEventsDisabled.size === 0 && (Ye.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Ye.layersWithOutsidePointerEventsDisabled.add(r.value)), a.value.add(r.value), f(() => {
        n.disableOutsidePointerEvents && Ye.layersWithOutsidePointerEventsDisabled.size === 1 && !Ei(Ye.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Ye.originalBodyPointerEvents);
      }));
    }), Nt((f) => {
      f(() => {
        r.value && (a.value.delete(r.value), Ye.layersWithOutsidePointerEventsDisabled.delete(r.value));
      });
    }), (f, p) => (A(), K(g(Lt), {
      ref: g(s),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: It({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: g(h).onFocusCapture,
      onBlurCapture: g(h).onBlurCapture,
      onPointerdownCapture: g(d).onPointerDownCapture
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
}), lh = ah;
const ch = /* @__PURE__ */ kf(() => /* @__PURE__ */ q([]));
function uh() {
  const t = ch();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = co(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = co(t.value, e), t.value[0]?.resume();
    }
  };
}
function co(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const cs = "focusScope.autoFocusOnMount", us = "focusScope.autoFocusOnUnmount", uo = {
  bubbles: !1,
  cancelable: !0
};
function dh(t, { select: e = !1 } = {}) {
  const n = bt();
  for (const i of t)
    if ($t(i, { select: e }), bt() !== n) return !0;
}
function fh(t) {
  const e = ll(t), n = fo(e, t), i = fo(e.reverse(), t);
  return [n, i];
}
function ll(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function fo(t, e) {
  for (const n of t) if (!hh(n, { upTo: e })) return n;
}
function hh(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function ph(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function $t(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = bt();
    t.focus({ preventScroll: !0 }), t !== n && ph(t) && e && t.select();
  }
}
var vh = /* @__PURE__ */ ee({
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
    const n = t, i = e, { currentRef: s, currentElement: r } = tt(), o = /* @__PURE__ */ q(null), a = uh(), l = /* @__PURE__ */ Un({
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
      function h(y) {
        if (l.paused || !d) return;
        const S = y.target;
        d.contains(S) ? o.value = S : $t(o.value, { select: !0 });
      }
      function f(y) {
        if (l.paused || !d) return;
        const S = y.relatedTarget;
        S !== null && (d.contains(S) || $t(o.value, { select: !0 }));
      }
      function p(y) {
        d.contains(o.value) || $t(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", f);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", f), m.disconnect();
      });
    }), Nt(async (c) => {
      const d = r.value;
      if (await at(), !d) return;
      a.add(l);
      const h = bt();
      if (!d.contains(h)) {
        const p = new CustomEvent(cs, uo);
        d.addEventListener(cs, (m) => i("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (dh(ll(d), { select: !0 }), bt() === h && $t(d));
      }
      c(() => {
        d.removeEventListener(cs, (y) => i("mountAutoFocus", y));
        const p = new CustomEvent(us, uo), m = (y) => {
          i("unmountAutoFocus", y);
        };
        d.addEventListener(us, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || $t(h ?? document.body, { select: !0 }), d.removeEventListener(us, m), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = bt();
      if (d && h) {
        const f = c.currentTarget, [p, m] = fh(f);
        p && m ? !c.shiftKey && h === m ? (c.preventDefault(), n.loop && $t(p, { select: !0 })) : c.shiftKey && h === p && (c.preventDefault(), n.loop && $t(m, { select: !0 })) : h === f && c.preventDefault();
      }
    }
    return (c, d) => (A(), K(g(Lt), {
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
}), mh = vh;
function gh(t) {
  return t ? "open" : "closed";
}
var bh = /* @__PURE__ */ ee({
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
    return s.titleId ||= Ds(void 0, "reka-dialog-title"), s.descriptionId ||= Ds(void 0, "reka-dialog-description"), Ge(() => {
      s.contentElement = o, bt() !== document.body && (s.triggerElement.value = bt());
    }), (a, l) => (A(), K(g(mh), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: se(() => [U(g(lh), Be({
        id: g(s).contentId,
        ref: g(r),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": g(s).descriptionId,
        "aria-labelledby": g(s).titleId,
        "data-state": g(gh)(g(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => g(s).onOpenChange(!1)),
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
}), cl = bh, yh = /* @__PURE__ */ ee({
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
    const n = t, i = e, s = Ht(), r = rr(i), { forwardRef: o, currentElement: a } = tt();
    return Gf(a), (l, u) => (A(), K(cl, Be({
      ...n,
      ...g(r)
    }, {
      ref: g(o),
      "trap-focus": g(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), g(s).triggerElement.value?.focus());
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
}), _h = yh, wh = /* @__PURE__ */ ee({
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
    const n = t, s = rr(e);
    tt();
    const r = Ht(), o = /* @__PURE__ */ q(!1), a = /* @__PURE__ */ q(!1);
    return (l, u) => (A(), K(cl, Be({
      ...n,
      ...g(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (o.value || g(r).triggerElement.value?.focus(), c.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (o.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        g(r).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: se(() => [ye(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), xh = wh, Sh = /* @__PURE__ */ ee({
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
    const n = t, i = e, s = Ht(), r = rr(i), { forwardRef: o } = tt();
    return (a, l) => (A(), K(g(or), { present: a.forceMount || g(s).open.value }, {
      default: se(() => [g(s).modal.value ? (A(), K(_h, Be({
        key: 0,
        ref: g(o)
      }, {
        ...n,
        ...g(r),
        ...a.$attrs
      }), {
        default: se(() => [ye(a.$slots, "default")]),
        _: 3
      }, 16)) : (A(), K(xh, Be({
        key: 1,
        ref: g(o)
      }, {
        ...n,
        ...g(r),
        ...a.$attrs
      }), {
        default: se(() => [ye(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Ch = Sh, kh = /* @__PURE__ */ ee({
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
    return jf(!0), tt(), (n, i) => (A(), K(g(Lt), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": g(e).open.value ? "open" : "closed",
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
}), Eh = kh, Th = /* @__PURE__ */ ee({
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
    return (i, s) => g(e)?.modal.value ? (A(), K(g(or), {
      key: 0,
      present: i.forceMount || g(e).open.value
    }, {
      default: se(() => [U(Eh, Be(i.$attrs, {
        ref: g(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: se(() => [ye(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : oe("v-if", !0);
  }
}), Ah = Th, Ph = /* @__PURE__ */ ee({
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
    const e = /* @__PURE__ */ Lf();
    return (n, i) => g(e) || n.forceMount ? (A(), K(Tc, {
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
}), Mh = Ph, Ih = /* @__PURE__ */ ee({
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
    return (n, i) => (A(), K(g(Mh), zl(Ha(e)), {
      default: se(() => [ye(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Oh = Ih, Dh = /* @__PURE__ */ ee({
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
    return tt(), (i, s) => (A(), K(g(Lt), Be(e, { id: g(n).titleId }), {
      default: se(() => [ye(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Lh = Dh;
const ho = "data-reka-collection-item";
function Rh(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let s;
  n ? (s = {
    collectionRef: /* @__PURE__ */ q(),
    itemMap: /* @__PURE__ */ q(/* @__PURE__ */ new Map())
  }, pn(i, s)) : s = Et(i);
  const r = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${ho}]`)), p = Array.from(s.itemMap.value.values()).sort((m, y) => h.indexOf(m.ref) - h.indexOf(y.ref));
    return c ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ ee({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Rs();
      return ge(p, () => {
        s.collectionRef.value = p.value;
      }), () => gt(Ls, {
        ref: f,
        ...h
      }, d);
    }
  }), a = /* @__PURE__ */ ee({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Rs();
      return Nt((m) => {
        if (p.value) {
          const y = Qo(p.value);
          s.itemMap.value.set(y, {
            ref: p.value,
            value: c.value
          }), m(() => s.itemMap.value.delete(y));
        }
      }), () => gt(Ls, {
        ...h,
        [ho]: "",
        ref: f
      }, d);
    }
  }), l = N(() => Array.from(s.itemMap.value.values())), u = N(() => s.itemMap.value.size);
  return {
    getItems: r,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const $h = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Fh(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function zh(t, e, n) {
  const i = Fh(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return $h[i];
}
function Bh(t, e = !1) {
  const n = bt();
  for (const i of t)
    if (i === n || (i.focus({ preventScroll: e }), bt() !== n)) return;
}
function Nh(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
const [jh] = Yn("RovingFocusGroup");
var Hh = /* @__PURE__ */ ee({
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
    const e = t, n = jh(), i = Ds(), s = N(() => e.tabStopId || i), r = N(() => n.currentTabStopId.value === s.value), { getItems: o, CollectionItem: a } = Rh();
    Ge(() => {
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
      const c = zh(u, n.orientation.value, n.dir.value);
      if (c !== void 0) {
        if (u.metaKey || u.ctrlKey || u.altKey || !e.allowShiftKey && u.shiftKey) return;
        u.preventDefault();
        let d = [...o().map((h) => h.ref).filter((h) => h.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const h = d.indexOf(u.currentTarget);
          d = n.loop.value ? Nh(d, h + 1) : d.slice(h + 1);
        }
        at(() => Bh(d));
      }
    }
    return (u, c) => (A(), K(g(a), null, {
      default: se(() => [U(g(Lt), {
        tabindex: r.value ? 0 : -1,
        "data-orientation": g(n).orientation.value,
        "data-active": u.active ? "" : void 0,
        "data-disabled": u.focusable ? void 0 : "",
        as: u.as,
        "as-child": u.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          u.focusable ? g(n).onItemFocus(s.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => g(n).onItemFocus(s.value)),
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
}), Wh = Hh, Vh = /* @__PURE__ */ ee({
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
    return (e, n) => (A(), K(g(Lt), {
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
}), qh = Vh, Uh = /* @__PURE__ */ ee({
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
    const e = t, { primitiveElement: n, currentElement: i } = Rs(), s = N(() => e.checked ?? e.value);
    return ge(s, (r, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && r !== o) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, r), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (r, o) => (A(), K(qh, Be({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...r.$attrs
    }, { as: "input" }), null, 16));
  }
}), po = Uh, Kh = /* @__PURE__ */ ee({
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
    const e = t, n = N(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = N(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (s, r) => (A(), Q(be, null, [oe(" We render single input if it's required "), n.value ? (A(), K(po, Be({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (A(!0), Q(be, { key: 1 }, vn(i.value, (o) => (A(), K(po, Be({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Gh = Kh;
const [Xh] = Yn("CheckboxGroupRoot");
function Ti(t) {
  return t === "indeterminate";
}
function ul(t) {
  return Ti(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
const [Yh, Jh] = Yn("CheckboxRoot");
var Zh = /* @__PURE__ */ ee({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = tt(), o = Xh(null), a = /* @__PURE__ */ sl(n, "modelValue", i, {
      defaultValue: n.defaultValue,
      passive: n.modelValue === void 0
    }), l = N(() => o?.disabled.value || n.disabled), u = N(() => Ei(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : ao(o.modelValue.value, n.value));
    function c() {
      if (Ei(o?.modelValue.value))
        a.value = Ti(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (ao(f, n.value)) {
          const p = f.findIndex((m) => Is(m, n.value));
          f.splice(p, 1);
        } else f.push(n.value);
        o.modelValue.value = f;
      }
    }
    const d = Wf(r), h = N(() => n.id && r.value ? document.querySelector(`[for="${n.id}"]`)?.innerText : void 0);
    return Jh({
      disabled: l,
      state: u
    }), (f, p) => (A(), K(wa(g(o)?.rovingFocus.value ? g(Wh) : g(Lt)), Be(f.$attrs, {
      id: f.id,
      ref: g(s),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": g(Ti)(u.value) ? "mixed" : u.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || h.value,
      "data-state": g(ul)(u.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: g(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: od(er(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: se(() => [ye(f.$slots, "default", {
        modelValue: g(a),
        state: u.value
      }), g(d) && f.name && !g(o) ? (A(), K(g(Gh), {
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
}), Qh = Zh, ep = /* @__PURE__ */ ee({
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
    const { forwardRef: e } = tt(), n = Yh();
    return (i, s) => (A(), K(g(or), { present: i.forceMount || g(Ti)(g(n).state.value) || g(n).state.value === !0 }, {
      default: se(() => [U(g(Lt), Be({
        ref: g(e),
        "data-state": g(ul)(g(n).state.value),
        "data-disabled": g(n).disabled.value ? "" : void 0,
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
}), tp = ep;
const np = /* @__PURE__ */ ee({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: { type: String }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (e, n) => (A(), K(g(Qh), {
      "model-value": t.modelValue,
      "aria-label": t.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": n[0] || (n[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: n[1] || (n[1] = er(() => {
      }, ["stop"]))
    }, {
      default: se(() => [
        U(g(tp), { class: "checkbox-indicator" }, {
          default: se(() => [
            U(g(Ya), {
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
}), ip = ".checkbox[data-v-024ee78b]{all:unset;width:16px;height:16px;flex-shrink:0;border:1.5px solid var(--color-border);border-radius:var(--radius-sm);background-color:var(--color-surface);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color var(--transition-duration),border-color var(--transition-duration)}.checkbox[data-v-024ee78b]:hover{border-color:var(--color-primary)}.checkbox[data-v-024ee78b]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.checkbox[data-state=checked][data-v-024ee78b]{background-color:var(--color-primary);border-color:var(--color-primary)}.checkbox-indicator[data-v-024ee78b]{color:var(--color-white, #fff);display:inline-flex;align-items:center;justify-content:center}", sp = /* @__PURE__ */ we(np, [["styles", [ip]], ["__scopeId", "data-v-024ee78b"]]);
function rp() {
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
const vo = [
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
function op(t, e, n) {
  const i = vo[t.size % vo.length];
  return { id: e, name: n, color: i };
}
function ap(t, e, n) {
  return !e || t.has(e) ? null : op(t, e, n ?? e);
}
function lp(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function cp(t) {
  const e = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  function n(r, o) {
    const a = ap(e, r, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(r, o) {
    const a = lp(e, r, o);
    a && (e.set(r, a), t("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: s };
}
function up(t, e) {
  return [...t, e];
}
function dp(t, e) {
  return [...e, ...t];
}
function ar(t, e) {
  return t.findIndex((n) => n.id === e);
}
function fp(t, e, n) {
  const i = ar(t, e);
  if (i === -1) return null;
  const s = { ...t[i], ...n, id: e }, r = t.slice();
  return r[i] = s, { turns: r, updated: s };
}
function hp(t, e) {
  const n = ar(t, e);
  return n === -1 ? null : t.filter((i, s) => s !== n);
}
function pp(t, e, n) {
  const i = ar(t, e);
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
function $s(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function vp(t, e, n) {
  const { id: i, languages: s, isSource: r, audio: o } = t, a = /* @__PURE__ */ fn(t.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const _ = a.value;
    for (let w = 0; w < _.length; w++)
      l.set(_[w].id, w);
  }
  u();
  function c(_) {
    n(_.speakerId), l.set(_.id, a.value.length), a.value = up(a.value, _), e("turn:add", { turn: _, translationId: i });
  }
  function d(_, w) {
    const M = fp(a.value, _, w);
    M && (a.value = M.turns, e("turn:update", { turn: M.updated, translationId: i }));
  }
  function h(_) {
    const w = hp(a.value, _);
    w && (a.value = w, u(), e("turn:remove", { turnId: _, translationId: i }));
  }
  function f(_, w) {
    const M = pp(a.value, _, w);
    M && (a.value = M.turns, e("turn:update", { turn: M.updated, translationId: i }));
  }
  function p(_) {
    $s(_, n), a.value = dp(a.value, _), u();
  }
  function m(_) {
    $s(_, n), a.value = _, u(), e("translation:sync", { translationId: i });
  }
  function y(_) {
    a.value = _, u();
  }
  function S(_) {
    const w = l.get(_.id);
    w !== void 0 ? a.value[w] = _ : (l.set(_.id, a.value.length), a.value.push(_));
  }
  function x(_) {
    return l.has(_);
  }
  return { id: i, languages: s, isSource: r, audio: o, turns: a, addTurn: c, prependTurns: p, updateTurn: d, removeTurn: h, updateWords: f, setTurns: m, replaceTurns: y, updateOrCreateTurnSilent: S, hasTurn: x };
}
function mo(t, e, n) {
  const { id: i, name: s, description: r, duration: o } = t, a = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  let l;
  for (const m of t.translations) {
    const y = vp(m, e, n);
    a.set(m.id, y), m.isSource && !l && (l = y);
  }
  l || (l = a.values().next().value);
  const u = /* @__PURE__ */ q(null), c = /* @__PURE__ */ q(!1), d = /* @__PURE__ */ q(!0), h = N(() => u.value ? a.get(u.value) ?? l : l);
  function f(m) {
    const y = m === l.id ? null : m;
    y !== u.value && (u.value = y, e("translation:change", { translationId: h.value.id }));
  }
  function p() {
    for (const m of a.values())
      m.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: s,
    description: r,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: h,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: p
  };
}
function mp(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, s] of t.speakers)
    e.add(i), n.push({ id: i, name: s.name });
  for (const i of t.channels)
    for (const s of i.translations)
      for (const r of s.turns)
        r.speakerId && !e.has(r.speakerId) && (e.add(r.speakerId), n.push({ id: r.speakerId, name: r.speakerId }));
  return n;
}
function gp(t = {}) {
  const e = /* @__PURE__ */ q(""), n = /* @__PURE__ */ q(t.activeChannelId ?? ""), i = /* @__PURE__ */ q(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: r, emit: o, clear: a } = rp(), l = cp(o), u = l, c = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map()), d = N(
    () => c.get(n.value) ?? [...c.values()][0]
  );
  function h(E, k) {
    return s(E, (H) => {
      H.translationId === d.value.activeTranslation.value.id && k(H);
    });
  }
  function f(E) {
    e.value = E.title, l.clear(), c.clear();
    for (const k of mp(E))
      u.ensure(k.id, k.name);
    for (const k of E.channels)
      c.set(k.id, mo(k, o, u.ensure));
    c.size > 0 && !c.has(n.value) && (n.value = c.keys().next().value);
  }
  function p(E) {
    Gd(E), f(E);
  }
  function m(E) {
    E !== n.value && (n.value = E, o("channel:change", { channelId: E }));
  }
  function y(E, k) {
    if (c.has(E)) {
      for (const H of k.translations)
        $s(H.turns, u.ensure);
      c.set(E, mo(k, o, u.ensure)), o("channel:sync", { channelId: E });
    }
  }
  const S = [], x = [];
  function _(E) {
    E.tiptapExtensions && x.push(...E.tiptapExtensions);
    const k = E.install(M);
    k && S.push(k);
  }
  function w() {
    o("destroy", void 0), S.forEach((E) => E()), S.length = 0, a();
  }
  t.document && f(t.document);
  const M = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: x,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: p,
    setActiveChannel: m,
    setChannel: y,
    on: s,
    off: r,
    emit: o,
    use: _,
    destroy: w
  };
  return M;
}
const dl = /* @__PURE__ */ Symbol("editorStore");
function bp(t) {
  pn(dl, t);
}
function Wt() {
  const t = Et(dl);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const fl = /* @__PURE__ */ Symbol("turnSelection");
function go(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function yp(t, e, n) {
  const i = /* @__PURE__ */ Kn(/* @__PURE__ */ new Map());
  let s = null;
  const r = N(() => i.size), o = N(() => i.size > 0);
  function a(S) {
    return i.has(S);
  }
  function l(S) {
    i.has(S) ? i.delete(S) : i.set(S, !0), s = S;
  }
  function u(S) {
    if (s === null) {
      l(S);
      return;
    }
    const x = t.value.map((k) => k.id), _ = x.indexOf(s), w = x.indexOf(S);
    if (_ === -1 || w === -1) {
      l(S);
      return;
    }
    const M = Math.min(_, w), E = Math.max(_, w);
    for (let k = M; k <= E; k++) {
      const H = x[k];
      H != null && i.set(H, !0);
    }
  }
  function c() {
    i.clear(), s = null;
  }
  async function d() {
    const x = t.value.filter((_) => i.has(_.id)).map(go).join(`

`);
    await navigator.clipboard.writeText(x);
  }
  async function h() {
    const x = t.value.filter((_) => i.has(_.id)).map((_) => {
      const M = (_.speakerId ? e.get(_.speakerId) : void 0)?.name ?? "", E = _.startTime != null ? Wn(_.startTime) : "", k = [M, E].filter(Boolean).join(" (") + (E ? ")" : ""), H = go(_);
      return k ? `${k}
${H}` : H;
    });
    await navigator.clipboard.writeText(x.join(`

`));
  }
  ge(
    () => t.value,
    (S) => {
      if (i.size === 0) return;
      const x = new Set(S.map((_) => _.id));
      for (const _ of [...i.keys()])
        x.has(_) || i.delete(_);
    }
  );
  const f = n.on("channel:change", c), p = n.on("translation:change", c);
  function m(S) {
    S.key === "Escape" && i.size > 0 && c();
  }
  Ge(() => {
    document.addEventListener("keydown", m);
  }), Dt(() => {
    document.removeEventListener("keydown", m), f(), p();
  });
  const y = {
    count: r,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: u,
    clear: c,
    copyText: d,
    copyWithMetadata: h
  };
  return pn(fl, y), y;
}
function hl() {
  const t = Et(fl);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const _p = ["data-turn-active", "aria-selected"], wp = { class: "turn-text" }, xp = ["data-word-active"], Sp = /* @__PURE__ */ ee({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Wt(), i = hl(), { t: s } = et(), r = N(() => e.turn.words.length > 0), o = N(() => {
      if (!n.audio?.src.value || !r.value) return null;
      const f = n.audio.currentTime.value, { startTime: p, endTime: m, words: y } = e.turn;
      return p == null || m == null || f < p || f > m ? null : Yd(y, f);
    }), a = N(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || el(e.turn.words)) return !1;
      const f = n.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = N(() => e.speaker?.color ?? "transparent"), u = N(() => i.isSelected(e.turn.id)), c = N(() => {
      const f = e.speaker?.name ?? "", p = u.value ? "selection.deselect" : "selection.select";
      return s(p).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function h(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, p) => (A(), Q("section", {
      class: Ze(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: It({ "--speaker-color": l.value }),
      "aria-selected": g(i).hasSelection.value ? u.value : void 0
    }, [
      t.partial ? oe("", !0) : (A(), Q("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        g(i).hasSelection.value ? (A(), K(sp, {
          key: 0,
          "model-value": u.value,
          "aria-label": c.value,
          onClick: er(h, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : oe("", !0),
        U(wf, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          "start-date": t.turn.startDate,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      Z("p", wp, [
        r.value ? (A(!0), Q(be, { key: 0 }, vn(t.turn.words, (m, y) => (A(), Q(be, {
          key: m.id
        }, [
          Z("span", {
            class: Ze({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, re(m.text), 11, xp),
          Ke(re(y < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (A(), Q(be, { key: 1 }, [
          Ke(re(t.turn.text), 1)
        ], 64)) : oe("", !0)
      ])
    ], 14, _p));
  }
}), Cp = ".turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-218f5091]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn[data-v-218f5091]:has(.turn-header:hover){background-color:var(--color-surface-hover)}.turn-text[data-v-218f5091]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-218f5091]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-218f5091]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-218f5091]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-218f5091]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-218f5091 .2s ease}@keyframes partial-fade-in-218f5091{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-218f5091]{animation:none}}@media(max-width:767px){.turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-218f5091],.turn--active[data-v-218f5091]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", bo = /* @__PURE__ */ we(Sp, [["styles", [Cp]], ["__scopeId", "data-v-218f5091"]]), kp = {}, Ep = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Tp(t, e) {
  return A(), Q("svg", Ep, [...e[0] || (e[0] = [
    yu('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Ap = /* @__PURE__ */ we(kp, [["render", Tp]]), Pp = { class: "transcription-empty" }, Mp = { class: "message" }, Ip = /* @__PURE__ */ ee({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = et();
    return (n, i) => (A(), Q("div", Pp, [
      U(Ap, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      Z("p", Mp, re(g(e)("transcription.empty")), 1)
    ]));
  }
}), Op = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", Dp = /* @__PURE__ */ we(Ip, [["styles", [Op]], ["__scopeId", "data-v-f82737e5"]]), Lp = { class: "transcription-panel" }, Rp = {
  ref: "scrollContainer",
  class: "scroll-container"
}, $p = { class: "turns-container" }, Fp = {
  key: 0,
  class: "history-loading",
  role: "status"
}, zp = {
  key: 1,
  class: "history-start"
}, Bp = /* @__PURE__ */ ee({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = et(), i = Wt(), s = Bn("scrollContainer"), r = N(() => {
      const x = i.live?.partial.value ?? null;
      return x === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: x,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = N(() => i.live?.hasLiveUpdate.value ?? !1), a = N(() => i.audio?.isPlaying.value ?? !1), l = N(
      () => i.activeChannel.value.activeTranslation.value
    ), u = N(() => i.activeChannel.value), c = N(
      () => u.value.isLoadingHistory.value
    ), d = N(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: f, isAtBottom: p, scrollToBottom: m } = ff();
    Ge(() => {
      h.value = s.value, f.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const y = Ud(() => {
      const x = u.value;
      x.hasMoreHistory.value && (x.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function S() {
      const x = s.value;
      x && x.scrollTop < 100 && y();
    }
    return ge(
      () => e.turns,
      (x, _) => {
        const w = x.length, M = _.length;
        if (w > M && !p.value && x[0]?.id != _[0]?.id) {
          const E = w - M, k = e.turns[E]?.id;
          if (!k || !h.value) return;
          at(() => {
            h.value?.querySelector(
              `[data-turn-id="${k}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), Ge(() => {
      s.value?.addEventListener("scroll", S, {
        passive: !0
      });
    }), Dt(() => {
      s.value?.removeEventListener("scroll", S);
    }), (x, _) => (A(), Q("article", Lp, [
      Z("div", Rp, [
        Z("div", $p, [
          c.value ? (A(), Q("div", Fp, [..._[3] || (_[3] = [
            Z("progress", null, null, -1)
          ])])) : oe("", !0),
          !d.value && t.turns.length > 0 ? (A(), Q("div", zp, re(g(n)("transcription.historyStart")), 1)) : oe("", !0),
          t.turns.length === 0 && !c.value && !r.value ? (A(), K(Dp, {
            key: 2,
            class: "transcription-empty"
          })) : oe("", !0),
          (A(!0), Q(be, null, vn(t.turns, (w, M, E, k) => {
            const H = [w, t.speakers.get(w.speakerId ?? ""), o.value && !r.value && M === t.turns.length - 1];
            if (k && k.key === w.id && Au(k, H)) return k;
            const T = (A(), K(bo, {
              "data-turn-id": w.id,
              key: w.id,
              turn: w,
              speaker: w.speakerId ? t.speakers.get(w.speakerId) : void 0,
              live: o.value && !r.value && M === t.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return T.memo = H, T;
          }, _, 0), 128)),
          r.value ? (A(), K(bo, {
            key: "__partial__",
            turn: r.value,
            partial: ""
          }, null, 8, ["turn"])) : oe("", !0)
        ]),
        U(Zs, { name: "fade-slide" }, {
          default: se(() => [
            !g(p) && (a.value || o.value) ? (A(), K(Je, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": g(n)("transcription.resumeScroll"),
              onClick: _[2] || (_[2] = (w) => g(m)())
            }, {
              default: se(() => [
                Ke(re(g(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : oe("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Np = ".transcription-panel[data-v-49c5b0cc]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-49c5b0cc]{height:100%;overflow:auto;position:relative}.turns-container[data-v-49c5b0cc]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-49c5b0cc]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-49c5b0cc]{width:120px}.history-start[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-49c5b0cc]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-49c5b0cc],.fade-slide-leave-to[data-v-49c5b0cc]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:none}}@media(max-width:767px){.turns-container[data-v-49c5b0cc]{padding:var(--spacing-md)}}", jp = /* @__PURE__ */ we(Bp, [["styles", [Np]], ["__scopeId", "data-v-49c5b0cc"]]), Hp = { class: "switch" }, Wp = ["id", "checked"], Vp = ["for"], qp = /* @__PURE__ */ ee({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, s = n.id ?? Ks();
    return (r, o) => (A(), Q("div", Hp, [
      Z("input", {
        type: "checkbox",
        id: g(s),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Wp),
      Z("label", { for: g(s) }, [...o[1] || (o[1] = [
        Z("div", { class: "switch-slider" }, null, -1)
      ])], 8, Vp)
    ]));
  }
}), Up = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", ds = /* @__PURE__ */ we(qp, [["styles", [Up]], ["__scopeId", "data-v-2aa0332f"]]), Kp = { class: "sidebar-select-field" }, Gp = ["for"], Xp = ["id", "value", "aria-label"], Yp = ["value"], Jp = /* @__PURE__ */ ee({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String },
    label: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, i = Ks();
    return (s, r) => (A(), Q("div", Kp, [
      t.label ? (A(), Q("label", {
        key: 0,
        for: g(i),
        class: "sidebar-select-label"
      }, re(t.label), 9, Gp)) : oe("", !0),
      Z("select", {
        id: g(i),
        class: "sidebar-select",
        value: t.selectedValue,
        "aria-label": t.label ? void 0 : t.ariaLabel,
        onChange: r[0] || (r[0] = (o) => n("update:selectedValue", o.target.value))
      }, [
        (A(!0), Q(be, null, vn(t.items, (o) => (A(), Q("option", {
          key: o.value,
          value: o.value
        }, re(o.label), 9, Yp))), 128))
      ], 40, Xp)
    ]));
  }
}), Zp = ".sidebar-select-field[data-v-fc926569]{display:flex;flex-direction:column;gap:var(--spacing-xs)}.sidebar-select-label[data-v-fc926569]{font-size:var(--font-size-xs);color:var(--color-text-primary)}", pl = /* @__PURE__ */ we(Jp, [["styles", [Zp]], ["__scopeId", "data-v-fc926569"]]), vl = /* @__PURE__ */ ee({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s } = et(), r = N(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (A(), K(pl, {
      items: r.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: g(s)("header.channelLabel"),
      label: g(s)("sidebar.channelSelectLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), Qp = { class: "translation-row" }, ev = {
  key: 0,
  class: "translation-row-badge"
}, tv = {
  key: 0,
  class: "translation-trigger-badge"
}, nv = /* @__PURE__ */ ee({
  __name: "TranslationSelector",
  props: {
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedTranslationId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s, locale: r } = et(), o = N(
      () => qd(
        n.translations,
        r.value,
        s("sidebar.originalLanguage"),
        s("language.wildcard")
      )
    );
    return (a, l) => (A(), K(pl, {
      items: o.value,
      "selected-value": t.selectedTranslationId,
      ariaLabel: g(s)("sidebar.translationLabel"),
      label: g(s)("sidebar.translationSelectLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (u) => i("update:selectedTranslationId", u))
    }, {
      item: se(({ item: u }) => [
        Z("span", Qp, [
          u.originalLabel ? (A(), Q("strong", ev, re(u.originalLabel), 1)) : oe("", !0),
          Z("span", null, re(u.label), 1)
        ])
      ]),
      trigger: se(({ item: u }) => [
        u?.originalLabel ? (A(), Q("span", tv, re(u.originalLabel), 1)) : oe("", !0),
        Z("span", null, re(u?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), iv = ".translation-row[data-v-602f3a37]{display:flex;flex-direction:column;gap:2px}.translation-row-badge[data-v-602f3a37]{font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}.translation-trigger-badge[data-v-602f3a37]{font-variant-caps:all-small-caps;color:var(--color-text-muted);margin-right:var(--spacing-xs);letter-spacing:.05em}", ml = /* @__PURE__ */ we(nv, [["styles", [iv]], ["__scopeId", "data-v-602f3a37"]]), sv = { class: "speaker-sidebar" }, rv = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, ov = { class: "sidebar-title" }, av = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, lv = { class: "sidebar-title" }, cv = {
  key: 2,
  class: "sidebar-section"
}, uv = { class: "sidebar-title" }, dv = { class: "subtitle-toggle" }, fv = { class: "subtitle-toggle-label" }, hv = { class: "subtitle-slider" }, pv = { class: "subtitle-slider-label" }, vv = { class: "subtitle-slider-value" }, mv = ["value", "disabled"], gv = {
  key: 0,
  class: "subtitle-toggle"
}, bv = { class: "subtitle-toggle-label" }, yv = {
  key: 1,
  class: "subtitle-toggle"
}, _v = { class: "subtitle-toggle-label" }, wv = {
  key: 3,
  class: "sidebar-section"
}, xv = { class: "sidebar-title" }, Sv = { class: "speaker-list" }, Cv = { class: "speaker-name" }, kv = /* @__PURE__ */ ee({
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
    return (i, s) => (A(), Q("aside", sv, [
      t.channels.length > 1 ? (A(), Q("section", rv, [
        Z("h2", ov, re(g(n)("sidebar.channel")), 1),
        U(vl, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": s[0] || (s[0] = (r) => i.$emit("update:selectedChannelId", r))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : oe("", !0),
      t.translations.length > 1 ? (A(), Q("section", av, [
        Z("h2", lv, re(g(n)("sidebar.translation")), 1),
        U(ml, {
          translations: t.translations,
          "selected-translation-id": t.selectedTranslationId,
          "onUpdate:selectedTranslationId": s[1] || (s[1] = (r) => i.$emit("update:selectedTranslationId", r))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : oe("", !0),
      g(e).subtitle ? (A(), Q("section", cv, [
        Z("h2", uv, re(g(n)("sidebar.subtitle")), 1),
        Z("div", dv, [
          Z("span", fv, re(g(n)("subtitle.show")), 1),
          U(ds, {
            modelValue: g(e).subtitle.isVisible.value,
            "onUpdate:modelValue": s[2] || (s[2] = (r) => g(e).subtitle.isVisible.value = r)
          }, null, 8, ["modelValue"])
        ]),
        Z("label", hv, [
          Z("span", pv, [
            Ke(re(g(n)("subtitle.fontSize")) + " ", 1),
            Z("span", vv, re(g(e).subtitle.fontSize.value) + "px", 1)
          ]),
          Z("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: g(e).subtitle.fontSize.value,
            disabled: !g(e).subtitle.isVisible.value,
            onInput: s[3] || (s[3] = (r) => g(e).subtitle.fontSize.value = Number(r.target.value))
          }, null, 40, mv)
        ]),
        g(e).subtitle.watermark && !g(e).subtitle.watermark.readonly ? (A(), Q("div", gv, [
          Z("span", bv, re(g(n)("subtitle.showWatermark")), 1),
          U(ds, {
            modelValue: g(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": s[4] || (s[4] = (r) => g(e).subtitle.watermark.display.value = r),
            disabled: !g(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : oe("", !0),
        g(e).subtitle.watermark && !g(e).subtitle.watermark.readonly && g(e).subtitle.watermark.display.value ? (A(), Q("div", yv, [
          Z("span", _v, re(g(n)("subtitle.pinWatermark")), 1),
          U(ds, {
            modelValue: g(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": s[5] || (s[5] = (r) => g(e).subtitle.watermark.pinned.value = r),
            disabled: !g(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : oe("", !0)
      ])) : oe("", !0),
      t.speakers.length ? (A(), Q("section", wv, [
        Z("h2", xv, re(g(n)("sidebar.speakers")), 1),
        Z("ul", Sv, [
          (A(!0), Q(be, null, vn(t.speakers, (r) => (A(), Q("li", {
            key: r.id,
            class: "speaker-item"
          }, [
            U(tl, {
              color: r.color
            }, null, 8, ["color"]),
            Z("span", Cv, re(r.name), 1)
          ]))), 128))
        ])
      ])) : oe("", !0)
    ]));
  }
}), Ev = ".speaker-sidebar[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-749c56f0]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-749c56f0]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-749c56f0]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-749c56f0]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-749c56f0]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-749c56f0]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-749c56f0]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-749c56f0]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-749c56f0]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-749c56f0]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-749c56f0]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-749c56f0]{border-left:none}.sidebar-section--selector[data-v-749c56f0]{display:none}}", yo = /* @__PURE__ */ we(kv, [["styles", [Ev]], ["__scopeId", "data-v-749c56f0"]]), Tv = /* @__PURE__ */ ee({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = Qc(t, "open"), { t: n } = et();
    return (i, s) => (A(), K(g(eh), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (r) => e.value = r)
    }, {
      default: se(() => [
        U(g(Oh), { disabled: "" }, {
          default: se(() => [
            U(g(Ah), { class: "editor-overlay" }),
            U(g(Ch), { class: "sidebar-drawer" }, {
              default: se(() => [
                U(g(Lh), { class: "sr-only" }, {
                  default: se(() => [
                    Ke(re(g(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                U(g(nh), {
                  class: "sidebar-close",
                  "aria-label": g(n)("header.closeSidebar")
                }, {
                  default: se(() => [
                    U(g(tr), { size: 20 })
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
}), Av = { class: "player-controls" }, Pv = { class: "controls-left" }, Mv = { class: "controls-time" }, Iv = { class: "time-display" }, Ov = { class: "time-display" }, Dv = { class: "controls-right" }, Lv = ["value", "aria-label", "disabled"], Rv = /* @__PURE__ */ ee({
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
    return (o, a) => (A(), Q("div", Av, [
      Z("div", Pv, [
        U(Je, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": g(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        U(Je, {
          variant: "transparent",
          icon: t.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": t.isPlaying ? g(i)("player.pause") : g(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        U(Je, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": g(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      Z("div", Mv, [
        Z("time", Iv, re(t.currentTime), 1),
        a[7] || (a[7] = Z("span", { class: "time-separator" }, "/", -1)),
        Z("time", Ov, re(t.duration), 1)
      ]),
      Z("div", Dv, [
        Z("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          U(Je, {
            variant: "transparent",
            icon: t.isMuted ? "volume-mute" : "volume",
            "aria-label": t.isMuted ? g(i)("player.unmute") : g(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          wc(Z("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": g(i)("player.volume"),
            disabled: !t.isReady,
            onInput: r
          }, null, 40, Lv), [
            [Nu, s.value]
          ])
        ], 32),
        U(Je, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": g(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: se(() => [
            Ke(re(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), $v = ".player-controls[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-2dcb93b1]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-2dcb93b1]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-2dcb93b1]:disabled{opacity:.5;cursor:default}.play-button[data-v-2dcb93b1]{--btn-height: 40px;--btn-icon-size: 20px}.speed-button[data-v-2dcb93b1]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-2dcb93b1],.volume-slider[data-v-2dcb93b1]{display:none}.player-controls[data-v-2dcb93b1]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Fv = /* @__PURE__ */ we(Rv, [["styles", [$v]], ["__scopeId", "data-v-2dcb93b1"]]);
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
function gl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(gl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function _o(t, e, n) {
  const i = gl(t, e || {});
  return n?.appendChild(i), i;
}
var zv = Object.freeze({ __proto__: null, createElement: _o, default: _o });
const Bv = { fetchBlob: function(t, e, n) {
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
class Nv extends Jn {
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
function jv({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: s = 0, barAlign: r }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < s && (a = s, r || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function Hv({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: s }) {
  return t === "top" ? 0 : t === "bottom" ? s - i : e - n;
}
function wo(t, e, n) {
  const i = e - t.left, s = n - t.top;
  return [i / t.width, s / t.height];
}
function bl(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function xo(t, e) {
  if (!bl(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function So({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, s = Math.floor(i * n);
  return [s - 1, s, s + 1];
}
function yl(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Wv(t) {
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
    t.removeEventListener("scroll", s), yl(e);
  } };
}
class Vv extends Jn {
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
      const i = this.wrapper.getBoundingClientRect(), [s, r] = wo(i, n.clientX, n.clientY);
      this.emit("click", s, r);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = wo(i, n.clientX, n.clientY);
      this.emit("dblclick", s, r);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Wv(this.scrollContainer);
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
        let f = h.clientX, p = h.clientY, m = !1;
        const y = Date.now(), S = n.getBoundingClientRect(), { left: x, top: _ } = S, w = (T) => {
          if (T.defaultPrevented || l.size > 1 || u && Date.now() - y < o) return;
          const I = T.clientX, $ = T.clientY, P = I - f, V = $ - p;
          (m || Math.abs(P) > s || Math.abs(V) > s) && (T.preventDefault(), T.stopPropagation(), m || (a.set({ type: "start", x: f - x, y: p - _ }), m = !0), a.set({ type: "move", x: I - x, y: $ - _, deltaX: P, deltaY: V }), f = I, p = $);
        }, M = (T) => {
          if (l.delete(T.pointerId), m) {
            const I = T.clientX, $ = T.clientY;
            a.set({ type: "end", x: I - x, y: $ - _ });
          }
          c();
        }, E = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || M(T);
        }, k = (T) => {
          m && (T.stopPropagation(), T.preventDefault());
        }, H = (T) => {
          T.defaultPrevented || l.size > 1 || m && T.preventDefault();
        };
        document.addEventListener("pointermove", w), document.addEventListener("pointerup", M), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", H, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", M), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", H), setTimeout((() => {
            document.removeEventListener("click", k, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), n.removeEventListener("pointerdown", d), l.clear(), yl(a);
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
    const { width: r, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: p, height: m, length: y, options: S, pixelRatio: x }) {
      const _ = m / 2, w = S.barWidth ? S.barWidth * x : 1, M = S.barGap ? S.barGap * x : S.barWidth ? w / 2 : 0, E = w + M || 1;
      return { halfHeight: _, barWidth: w, barGap: M, barRadius: S.barRadius || 0, barMinHeight: S.barMinHeight ? S.barMinHeight * x : 0, barIndexScale: y > 0 ? p / E / y : 0, barSpacing: E };
    })({ width: r, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: p, barIndexScale: m, barSpacing: y, barWidth: S, halfHeight: x, vScale: _, canvasHeight: w, barAlign: M, barMinHeight: E }) {
      const k = p[0] || [], H = p[1] || k, T = k.length, I = [];
      let $ = 0, P = 0, V = 0;
      for (let z = 0; z <= T; z++) {
        const G = Math.round(z * m);
        if (G > $) {
          const { topHeight: le, totalHeight: ke } = jv({ maxTop: P, maxBottom: V, halfHeight: x, vScale: _, barMinHeight: E, barAlign: M }), lt = Hv({ barAlign: M, halfHeight: x, topHeight: le, totalHeight: ke, canvasHeight: w });
          I.push({ x: $ * y, y: lt, width: S, height: ke }), $ = G, P = 0, V = 0;
        }
        const ae = Math.abs(k[z] || 0), te = Math.abs(H[z] || 0);
        ae > P && (P = ae), te > V && (V = te);
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
      return [f, l[1] || f].map(((p, m) => {
        const y = p.length, S = y ? u / y : 0, x = h, _ = m === 0 ? -1 : 1, w = [{ x: 0, y: x }];
        let M = 0, E = 0;
        for (let k = 0; k <= y; k++) {
          const H = Math.round(k * S);
          if (H > M) {
            const I = x + (Math.round(E * h * d) || 1) * _;
            w.push({ x: M, y: I }), M = H, E = 0;
          }
          const T = Math.abs(p[k] || 0);
          T > E && (E = T);
        }
        return w.push({ x: M, y: x }), w;
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
        const p = (u = d[f]) !== null && u !== void 0 ? u : 0, m = Math.abs(p);
        m > h && (h = m);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    bl(n) ? this.renderBarWaveform(e, n, i, s) : this.renderLineWaveform(e, n, i, s);
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
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: p, totalWidth: m, options: y }) {
      return xo(Math.min(8e3, p, m), y);
    })({ clientWidth: l, totalWidth: u, options: n });
    let d = {};
    if (c === 0) return;
    const h = (p) => {
      if (p < 0 || p >= f || d[p]) return;
      d[p] = !0;
      const m = p * c;
      let y = Math.min(u - m, c);
      if (y = xo(y, n), y <= 0) return;
      const S = (function({ channelData: x, offset: _, clampedWidth: w, totalWidth: M }) {
        return x.map(((E) => {
          const k = Math.floor(_ / M * E.length), H = Math.floor((_ + w) / M * E.length);
          return E.slice(k, H);
        }));
      })({ channelData: e, offset: m, clampedWidth: y, totalWidth: u });
      this.renderSingleCanvas(S, n, y, s, m, r, o);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let p = 0; p < f; p++) h(p);
      return;
    }
    if (So({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((p) => h(p))), f > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (r.innerHTML = "", o.innerHTML = "", d = {}), So({ scrollLeft: m, totalWidth: u, numCanvases: f }).forEach(((y) => h(y)));
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
        const p = Math.ceil(u * c), m = p > d, y = !!(h && !m);
        return { scrollWidth: p, isScrollable: m, useParentWidth: y, width: (y ? d : p) * f };
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
class qv extends Jn {
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
class fs extends Jn {
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
const Uv = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Vn extends Nv {
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
    const n = e.media || (e.backend === "WebAudio" ? new fs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Uv, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, h, f;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : Se(0), m = (u = a?.duration) !== null && u !== void 0 ? u : Se(0), y = (c = a?.isPlaying) !== null && c !== void 0 ? c : Se(!1), S = (d = a?.isSeeking) !== null && d !== void 0 ? d : Se(!1), x = (h = a?.volume) !== null && h !== void 0 ? h : Se(1), _ = (f = a?.playbackRate) !== null && f !== void 0 ? f : Se(1), w = Se(null), M = Se(null), E = Se(""), k = Se(0), H = Se(0), T = Jt((() => !y.value), [y]), I = Jt((() => w.value !== null), [w]), $ = Jt((() => I.value && m.value > 0), [I, m]), P = Jt((() => p.value), [p]), V = Jt((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: y, isPaused: T, isSeeking: S, volume: x, playbackRate: _, audioBuffer: w, peaks: M, url: E, zoom: k, scrollPosition: H, canPlay: I, isReady: $, progress: P, progressPercent: V }, actions: { setCurrentTime: (z) => {
        const G = Math.max(0, Math.min(m.value || 1 / 0, z));
        p.set(G);
      }, setDuration: (z) => {
        m.set(Math.max(0, z));
      }, setPlaying: (z) => {
        y.set(z);
      }, setSeeking: (z) => {
        S.set(z);
      }, setVolume: (z) => {
        const G = Math.max(0, Math.min(1, z));
        x.set(G);
      }, setPlaybackRate: (z) => {
        const G = Math.max(0.1, Math.min(16, z));
        _.set(G);
      }, setAudioBuffer: (z) => {
        w.set(z), z && m.set(z.duration);
      }, setPeaks: (z) => {
        M.set(z);
      }, setUrl: (z) => {
        E.set(z);
      }, setZoom: (z) => {
        k.set(Math.max(0, z));
      }, setScrollPosition: (z) => {
        H.set(Math.max(0, z));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new qv();
    const r = n ? void 0 : this.getMediaElement();
    this.renderer = new Vv(this.options, r), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
        n = yield Bv.fetchBlob(e, l, a);
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
        a instanceof fs && (a.duration = o);
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
      return n != null && (this.media instanceof fs ? this.media.stopAt(n) : this.stopAtPosition = n), s;
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
}, Vn.dom = zv;
class _l {
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
class Kv extends _l {
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
function wl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(wl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function Tn(t, e, n) {
  const i = wl(t, e || {});
  return n?.appendChild(i), i;
}
function xl(t) {
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
  const n = xl(null), i = (s) => {
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
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, r = xl(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, h = c.clientY, f = !1;
    const p = Date.now(), m = t.getBoundingClientRect(), { left: y, top: S } = m, x = (k) => {
      if (k.defaultPrevented || o.size > 1 || a && Date.now() - p < s) return;
      const H = k.clientX, T = k.clientY, I = H - d, $ = T - h;
      (f || Math.abs(I) > n || Math.abs($) > n) && (k.preventDefault(), k.stopPropagation(), f || (r.set({ type: "start", x: d - y, y: h - S }), f = !0), r.set({ type: "move", x: H - y, y: T - S, deltaX: I, deltaY: $ }), d = H, h = T);
    }, _ = (k) => {
      if (o.delete(k.pointerId), f) {
        const H = k.clientX, T = k.clientY;
        r.set({ type: "end", x: H - y, y: T - S });
      }
      l();
    }, w = (k) => {
      o.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || _(k);
    }, M = (k) => {
      f && (k.stopPropagation(), k.preventDefault());
    }, E = (k) => {
      k.defaultPrevented || o.size > 1 || f && k.preventDefault();
    };
    document.addEventListener("pointermove", x), document.addEventListener("pointerup", _), document.addEventListener("pointerout", w), document.addEventListener("pointercancel", w), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", M, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", x), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", w), document.removeEventListener("pointercancel", w), document.removeEventListener("touchmove", E), setTimeout((() => {
        document.removeEventListener("click", M, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", u), { signal: r, cleanup: () => {
    l(), t.removeEventListener("pointerdown", u), o.clear(), Xt(r);
  } };
}
class Co extends _l {
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = Tn("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = Tn("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), r = vi(i, { threshold: 1 }), o = vi(s, { threshold: 1 }), a = pi((() => {
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
    const s = Tn("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const n = sn(e, "click"), i = sn(e, "mouseenter"), s = sn(e, "mouseleave"), r = sn(e, "dblclick"), o = sn(e, "pointerdown"), a = sn(e, "pointerup"), l = n.subscribe(((y) => y && this.emit("click", y))), u = i.subscribe(((y) => y && this.emit("over", y))), c = s.subscribe(((y) => y && this.emit("leave", y))), d = r.subscribe(((y) => y && this.emit("dblclick", y))), h = o.subscribe(((y) => y && this.toggleCursor(!0))), f = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), f(), Xt(n), Xt(i), Xt(s), Xt(r), Xt(o), Xt(a);
    }));
    const p = vi(e), m = pi((() => {
      const y = p.signal.value;
      y && (y.type === "start" ? this.toggleCursor(!0) : y.type === "move" && y.deltaX !== void 0 ? this.onMove(y.deltaX) : y.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [p.signal]);
    this.subscriptions.push((() => {
      m(), p.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (y) => this.onContentClick(y), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
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
        this.content = Tn("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class lr extends Kv {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new lr(e);
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
    return Tn("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const s = this.wavesurfer.getDuration(), r = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Co(e, s, r);
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
        const f = this.wavesurfer.getDuration(), p = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const y = h.x / m * f, S = (h.x + 5) / m * f;
        r = new Co(Object.assign(Object.assign({}, e), { start: y, end: S }), f, p), this.emit("region-initialized", r), r.element && this.regionsContainer.appendChild(r.element);
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
const hs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Gv(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: s } = t, r = /* @__PURE__ */ fn(null), o = /* @__PURE__ */ fn(null), a = /* @__PURE__ */ q(0), l = /* @__PURE__ */ q(0), u = /* @__PURE__ */ q(!1), c = /* @__PURE__ */ q(!1), d = /* @__PURE__ */ q(!1), h = /* @__PURE__ */ q(1), f = /* @__PURE__ */ q(1), p = /* @__PURE__ */ q(!1), m = N(() => Wn(a.value)), y = N(() => Wn(l.value));
  function S(z, G) {
    P(), d.value = !0, c.value = !1;
    const ae = lr.create();
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
      renderFunction: Xd,
      url: G,
      plugins: [ae]
    });
    te.on("ready", () => {
      c.value = !0, d.value = !1, l.value = te.getDuration(), x();
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
  function x() {
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
          color: Vd(te, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", te);
      }
    }
  }
  function _() {
    r.value?.play();
  }
  function w() {
    r.value?.pause();
  }
  function M() {
    r.value?.playPause();
  }
  function E(z) {
    const G = r.value;
    !G || l.value === 0 || G.setTime(z);
  }
  function k(z) {
    E(Math.max(0, Math.min(a.value + z, l.value)));
  }
  function H(z) {
    const G = r.value;
    G && (h.value = z, G.setVolume(z), z > 0 && p.value && (p.value = !1, G.setMuted(!1)));
  }
  function T() {
    const z = r.value;
    z && (p.value = !p.value, z.setMuted(p.value));
  }
  function I(z) {
    const G = r.value;
    G && (f.value = z, G.setPlaybackRate(z));
  }
  function $() {
    const G = (hs.indexOf(
      f.value
    ) + 1) % hs.length;
    I(hs[G] ?? 1);
  }
  function P() {
    V !== null && (clearTimeout(V), V = null), r.value && (r.value.destroy(), r.value = null, o.value = null);
  }
  ge(
    [e, n],
    ([z, G]) => {
      z && G && S(z, G);
    },
    { immediate: !0 }
  );
  let V = null;
  return ge([i, s], () => {
    c.value && (V !== null && clearTimeout(V), V = setTimeout(() => {
      V = null, x();
    }, 150));
  }), Dt(() => {
    P();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: f,
    isMuted: p,
    formattedCurrentTime: m,
    formattedDuration: y,
    play: _,
    pause: w,
    togglePlay: M,
    seekTo: E,
    skip: k,
    setVolume: H,
    setPlaybackRate: I,
    cyclePlaybackRate: $,
    toggleMute: T
  };
}
const Xv = { class: "audio-player" }, Yv = /* @__PURE__ */ ee({
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
      togglePlay: m,
      seekTo: y,
      pause: S,
      skip: x,
      setVolume: _,
      cyclePlaybackRate: w,
      toggleMute: M
    } = Gv({
      containerRef: r,
      audioSrc: /* @__PURE__ */ Yi(() => i.audioSrc),
      turns: /* @__PURE__ */ Yi(() => i.turns),
      speakers: /* @__PURE__ */ Yi(() => i.speakers)
    });
    return ge(h, (E) => s("timeupdate", E)), ge(o, (E) => s("playStateChange", E)), e({ seekTo: y, pause: S }), (E, k) => (A(), Q("footer", Xv, [
      Z("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Ze(["waveform-container", { "waveform-container--loading": g(l) }])
      }, null, 2),
      U(Fv, {
        "is-playing": g(o),
        "current-time": g(f),
        duration: g(p),
        volume: g(u),
        "playback-rate": g(c),
        "is-muted": g(d),
        "is-ready": g(a),
        onTogglePlay: g(m),
        onSkipBack: k[0] || (k[0] = (H) => g(x)(-10)),
        onSkipForward: k[1] || (k[1] = (H) => g(x)(10)),
        "onUpdate:volume": g(_),
        onToggleMute: g(M),
        onCyclePlaybackRate: g(w)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Jv = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", Zv = /* @__PURE__ */ we(Yv, [["styles", [Jv]], ["__scopeId", "data-v-9248e45e"]]);
class Qv {
  diff(e, n, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const r = this.castInput(e, i), o = this.castInput(n, i), a = this.removeEmpty(this.tokenize(r, i)), l = this.removeEmpty(this.tokenize(o, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, n, i, s) {
    var r;
    const o = (x) => {
      if (x = this.postProcess(x, i), s) {
        setTimeout(function() {
          s(x);
        }, 0);
        return;
      } else
        return x;
    }, a = n.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (r = i.timeout) !== null && r !== void 0 ? r : 1 / 0, h = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(f[0], n, e, 0, i);
    if (f[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, n, e));
    let m = -1 / 0, y = 1 / 0;
    const S = () => {
      for (let x = Math.max(m, -u); x <= Math.min(y, u); x += 2) {
        let _;
        const w = f[x - 1], M = f[x + 1];
        w && (f[x - 1] = void 0);
        let E = !1;
        if (M) {
          const H = M.oldPos - x;
          E = M && 0 <= H && H < a;
        }
        const k = w && w.oldPos + 1 < l;
        if (!E && !k) {
          f[x] = void 0;
          continue;
        }
        if (!k || E && w.oldPos < M.oldPos ? _ = this.addToPath(M, !0, !1, 0, i) : _ = this.addToPath(w, !1, !0, 1, i), p = this.extractCommon(_, n, e, x, i), _.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(_.lastComponent, n, e)) || !0;
        f[x] = _, _.oldPos + 1 >= l && (y = Math.min(y, x - 1)), p + 1 >= a && (m = Math.max(m, x + 1));
      }
      u++;
    };
    if (s)
      (function x() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return s(void 0);
          S() || x();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= h; ) {
        const x = S();
        if (x)
          return x;
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
class em extends Qv {
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
const tm = new em();
function nm(t, e, n) {
  return tm.diff(t, e, n);
}
function ps({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const s = t.split(" "), r = n.split(" "), o = nm(s, r, {
    comparator: sm
  }), a = im(o), l = [...e];
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
    const p = Sl(
      h,
      i
    ).map(
      (m) => m + d
    );
    u = u.concat(p);
  }
  return {
    previousIndexes: u,
    previousText: n
  };
}
function im(t) {
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
function Sl(t, e) {
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
      Sl(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function sm(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(n.length, i.length);
  let r = 0;
  for (let a = 0; a < s; a++)
    n[a] === i[a] && r++;
  return r / n.length > 0.8;
}
class rm {
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
class om extends rm {
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
    this.resetAll(), this.currentState = ps(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = ps(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = ps(
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
function Cl(t) {
  const e = Wt();
  let n = null;
  Ge(() => {
    t.canvasRef.value && (n = new om(t.canvasRef.value, {
      fontSize: t.fontSize.value,
      lineHeight: t.lineHeight.value
    }));
  }), ge([t.fontSize, t.lineHeight], ([l, u]) => {
    n && n.setFontSize(l, u);
  }), ge(
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
function kl(t) {
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
  return t && ge(
    [t.display, t.pinned, t.frequency, t.duration],
    a
  ), Ge(a), Dt(s), { visible: e };
}
const ko = /\$(\w+)/g;
function am(t, e) {
  const n = [];
  let i = 0, s;
  for (ko.lastIndex = 0; (s = ko.exec(t)) !== null; ) {
    s.index > i && n.push({ type: "text", value: t.slice(i, s.index) });
    const r = s[1] ?? "", o = r ? e[r] : void 0;
    o ? n.push({ type: "token", src: o.src, alt: o.alt ?? r }) : n.push({ type: "text", value: s[0] }), i = s.index + s[0].length;
  }
  return i < t.length && n.push({ type: "text", value: t.slice(i) }), n;
}
const lm = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, cm = ["src", "alt"], um = { key: 1 }, dm = /* @__PURE__ */ ee({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(t) {
    const n = Wt().subtitle?.watermark, i = N(() => n ? am(n.content.value, n.tokens.value) : []);
    return (s, r) => (A(), K(Zs, { name: "watermark" }, {
      default: se(() => [
        t.visible && g(n) ? (A(), Q("div", lm, [
          (A(!0), Q(be, null, vn(i.value, (o, a) => (A(), Q(be, { key: a }, [
            o.type === "token" ? (A(), Q("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, cm)) : (A(), Q("span", um, re(o.value), 1))
          ], 64))), 128))
        ])) : oe("", !0)
      ]),
      _: 1
    }));
  }
}), fm = ".watermark[data-v-7d6bdc7d]{position:absolute;right:var(--spacing-md, 16px);bottom:4px;display:inline-flex;align-items:center;gap:.25em;font-size:1.2rem;color:var(--color-white, #fff);pointer-events:none;line-height:1}.watermark__img[data-v-7d6bdc7d]{height:1em;vertical-align:middle}.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .4s ease,transform .4s ease}.watermark-enter-from[data-v-7d6bdc7d],.watermark-leave-to[data-v-7d6bdc7d]{opacity:0;transform:translate(6px,6px)}@media(prefers-reduced-motion:reduce){.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .01s;transform:none}}", El = /* @__PURE__ */ we(dm, [["styles", [fm]], ["__scopeId", "data-v-7d6bdc7d"]]), hm = ["height"], pm = /* @__PURE__ */ ee({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Wt(), n = Bn("canvas"), i = N(() => e.subtitle?.fontSize.value ?? 40), s = N(() => 1.2 * i.value), r = N(() => 2.4 * i.value);
    Cl({
      canvasRef: n,
      fontSize: i,
      lineHeight: s
    });
    const { visible: o } = kl(
      e.subtitle?.watermark
    );
    return (a, l) => (A(), Q("div", {
      class: "subtitle-banner",
      style: It({ height: r.value + "px" })
    }, [
      Z("canvas", {
        ref: "canvas",
        class: Ze(["subtitle-canvas", { "subtitle-canvas--shrunk": g(o) }]),
        height: r.value
      }, null, 10, hm),
      U(El, { visible: g(o) }, null, 8, ["visible"])
    ], 4));
  }
}), vm = ".subtitle-banner[data-v-36f4501a]{position:relative;flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-36f4501a]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:top center}.subtitle-canvas--shrunk[data-v-36f4501a]{transform:scale(.8) translateY(-8%)}@media(prefers-reduced-motion:reduce){.subtitle-canvas[data-v-36f4501a]{transition:none}}", mm = /* @__PURE__ */ we(pm, [["styles", [vm]], ["__scopeId", "data-v-36f4501a"]]), gm = {
  ref: "container",
  class: "subtitle-fullscreen"
}, bm = ["aria-label"], ym = /* @__PURE__ */ ee({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Wt(), { t: n } = et(), i = Bn("container"), s = Bn("canvas"), r = N(() => e.subtitle?.fontSize.value ?? 48), o = N(() => 1.2 * r.value);
    Cl({
      canvasRef: s,
      fontSize: r,
      lineHeight: o
    });
    const { visible: a } = kl(
      e.subtitle?.watermark
    );
    Ge(async () => {
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
    Ge(() => {
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
    }), (c, d) => (A(), Q("div", gm, [
      Z("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": g(n)("subtitle.exitFullscreen"),
        onClick: u
      }, [
        U(g(tr), { size: 24 })
      ], 8, bm),
      Z("canvas", {
        ref: "canvas",
        class: Ze(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": g(a) }])
      }, null, 2),
      U(El, { visible: g(a) }, null, 8, ["visible"])
    ], 512));
  }
}), _m = ".subtitle-fullscreen[data-v-f31885e0]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-f31885e0]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-f31885e0]:hover,.subtitle-fullscreen__close[data-v-f31885e0]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-f31885e0]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:center}.subtitle-fullscreen__canvas--shrunk[data-v-f31885e0]{transform:scale(.85) translateY(-4%)}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-f31885e0],.subtitle-fullscreen__canvas[data-v-f31885e0]{transition:none}}", wm = /* @__PURE__ */ we(ym, [["styles", [_m]], ["__scopeId", "data-v-f31885e0"]]), xm = /* @__PURE__ */ ee({
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
    const o = N(() => i.value ? "check" : n.icon), a = N(() => Ja[n.size ?? "sm"]);
    return (l, u) => (A(), K(Je, {
      variant: t.variant,
      size: t.size,
      disabled: t.disabled,
      block: t.block,
      "aria-label": t.ariaLabel,
      class: Ze({ "copy-btn--copied": i.value }),
      onClick: r
    }, {
      icon: se(() => [
        U(Zs, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: se(() => [
            (A(), K(fi, {
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
}), Sm = ".copy-btn--copied[data-v-eed7503d]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-eed7503d],.copy-icon-leave-to[data-v-eed7503d]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:none}}", Eo = /* @__PURE__ */ we(xm, [["styles", [Sm]], ["__scopeId", "data-v-eed7503d"]]), Cm = ["aria-label"], km = { class: "selection-count" }, Em = { class: "selection-actions" }, Tm = /* @__PURE__ */ ee({
  __name: "SelectionActionBar",
  setup(t) {
    const e = hl(), { t: n } = et();
    return (i, s) => g(e).hasSelection.value ? (A(), Q("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": g(n)("selection.count")
    }, [
      Z("span", km, re(g(e).count.value) + " " + re(g(n)("selection.count")), 1),
      Z("div", Em, [
        U(Eo, {
          icon: "clipboard-type",
          "copy-fn": g(e).copyText,
          variant: "secondary"
        }, {
          default: se(() => [
            Ke(re(g(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        U(Eo, {
          icon: "clipboard-list",
          "copy-fn": g(e).copyWithMetadata
        }, {
          default: se(() => [
            Ke(re(g(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        U(Je, {
          variant: "transparent",
          icon: "x",
          onClick: s[0] || (s[0] = (r) => g(e).clear())
        }, {
          default: se(() => [
            Ke(re(g(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Cm)) : oe("", !0);
  }
}), Am = ".selection-bar[data-v-7569d6ad]{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-7569d6ad var(--transition-duration) ease}.selection-count[data-v-7569d6ad]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-7569d6ad]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-7569d6ad{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-7569d6ad]{animation:none}}@media(max-width:767px){.selection-bar[data-v-7569d6ad]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", Pm = /* @__PURE__ */ we(Tm, [["styles", [Am]], ["__scopeId", "data-v-7569d6ad"]]), Mm = "(max-width: 767px)";
function Im() {
  const t = /* @__PURE__ */ q(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return Ge(() => {
    e = window.matchMedia(Mm), t.value = e.matches, e.addEventListener("change", n);
  }), Dt(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Om = { class: "editor-layout" }, Dm = { class: "editor-body" }, Lm = {
  key: 4,
  class: "mobile-selectors"
}, Rm = /* @__PURE__ */ ee({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Wt(), { isMobile: i } = Im(), s = /* @__PURE__ */ q(!1), r = N(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), o = n.speakers.all;
    yp(r, o, n);
    const a = N(() => [...n.channels.values()]), l = N(() => [
      ...n.activeChannel.value.translations.values()
    ]), u = N(
      () => n.activeChannel.value.activeTranslation.value.id
    ), c = N(() => Array.from(o.values())), d = Bn("audioPlayer");
    function h(m) {
      n.audio && (n.audio.currentTime.value = m);
    }
    ge(
      () => n.activeChannelId.value,
      () => {
        d.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), s.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((m) => d.value?.seekTo(m));
    function f(m) {
      n.setActiveChannel(m);
    }
    function p(m) {
      n.activeChannel.value.setActiveTranslation(m);
    }
    return (m, y) => (A(), Q("div", Om, [
      e.showHeader ? (A(), K(of, {
        key: 0,
        title: g(n).title.value,
        duration: g(n).activeChannel.value.duration,
        language: u.value,
        "is-mobile": g(i),
        onToggleSidebar: y[0] || (y[0] = (S) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : oe("", !0),
      U(Pm),
      Z("main", Dm, [
        U(jp, {
          turns: r.value,
          speakers: g(o)
        }, null, 8, ["turns", "speakers"]),
        g(i) ? oe("", !0) : (A(), K(yo, {
          key: 0,
          speakers: c.value,
          channels: a.value,
          "selected-channel-id": g(n).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        g(i) ? (A(), K(Tv, {
          key: 1,
          open: s.value,
          "onUpdate:open": y[1] || (y[1] = (S) => s.value = S)
        }, {
          default: se(() => [
            U(yo, {
              speakers: c.value,
              channels: a.value,
              "selected-channel-id": g(n).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": u.value,
              "onUpdate:selectedChannelId": f,
              "onUpdate:selectedTranslationId": p
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : oe("", !0)
      ]),
      g(n).audio?.src.value ? (A(), K(Zv, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": g(n).audio.src.value,
        turns: r.value,
        speakers: g(o),
        onTimeupdate: h,
        onPlayStateChange: y[2] || (y[2] = (S) => {
          g(n).audio && (g(n).audio.isPlaying.value = S);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : oe("", !0),
      g(n).subtitle?.isVisible.value && !g(i) && !g(n).subtitle.isFullscreen.value ? (A(), K(mm, { key: 2 })) : oe("", !0),
      g(n).subtitle?.isFullscreen.value ? (A(), K(wm, { key: 3 })) : oe("", !0),
      g(i) && (a.value.length > 1 || l.value.length > 1) ? (A(), Q("div", Lm, [
        a.value.length > 1 ? (A(), K(vl, {
          key: 0,
          channels: a.value,
          "selected-channel-id": g(n).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : oe("", !0),
        l.value.length > 1 ? (A(), K(ml, {
          key: 1,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["translations", "selected-translation-id"])) : oe("", !0)
      ])) : oe("", !0)
    ]));
  }
}), $m = ".editor-layout[data-v-dfb86af2]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-dfb86af2]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-dfb86af2]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0;box-shadow:var(--shadow-md);align-items:end}.mobile-selectors[data-v-dfb86af2]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-dfb86af2]{grid-template-columns:1fr}}", Fm = /* @__PURE__ */ we(Rm, [["styles", [$m]], ["__scopeId", "data-v-dfb86af2"]]), zm = /* @__PURE__ */ ee({
  __name: "WebComponent",
  props: {
    locale: { default: "fr", type: String },
    noHeader: { type: Boolean, default: !1 }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ q(n.locale);
    Wd(i), ge(
      () => n.locale,
      (r) => {
        i.value = r;
      }
    );
    const s = gp();
    return bp(s), e({ editor: s }), (r, o) => g(s)?.channels?.size ? (A(), K(Fm, {
      key: 0,
      "show-header": !n.noHeader
    }, null, 8, ["show-header"])) : oe("", !0);
  }
}), Bm = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--color-danger: #e53935;--color-danger-hover: #c62828;--color-danger-soft: #fdecea;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}.sidebar-select{width:100%;font-size:var(--font-size-sm);font-family:inherit;border:1px solid var(--color-border);border-radius:var(--radius-md);background-color:var(--color-surface);color:var(--color-text-primary);padding:var(--spacing-sm)}', Nm = /* @__PURE__ */ we(zm, [["styles", [Bm]]]);
function To(t) {
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
function vs(t, e) {
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
function qm() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ fn(null), n = /* @__PURE__ */ q(!1);
      n.value = !0;
      function i() {
        e.value = null;
      }
      function s(_, w) {
        if (t.activeChannelId.value !== w) return;
        const M = t.activeChannel.value.activeTranslation.value;
        if (M.isSource) {
          if (_.text == null) return;
          e.value = _.text;
        } else if (_.translations) {
          const E = _.translations.find(
            (k) => k.translationId === M.id
          );
          e.value = E?.text ?? null;
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
      function l(_, w) {
        _.hasTurn(w.id) ? _.updateTurn(w.id, w) : _.addTurn(w);
      }
      function u(_, w) {
        _.speakerId && t.speakers.ensure(_.speakerId);
        const M = t.channels.get(w);
        if (!M) {
          h();
          return;
        }
        if (_.text != null && l(
          M.sourceTranslation,
          To(_)
        ), _.translations)
          for (const k of _.translations) {
            const H = M.translations.get(k.translationId);
            H && l(
              H,
              vs(_, k)
            );
          }
        t.activeChannel.value.activeTranslation.value.isSource && h();
      }
      function c(_, w) {
        d([_], w);
      }
      function d(_, w) {
        const M = t.channels.get(w);
        if (!M) return;
        const E = /* @__PURE__ */ new Set();
        for (const T of _)
          T.speakerId && !E.has(T.speakerId) && (E.add(T.speakerId), t.speakers.ensure(T.speakerId));
        const k = [];
        for (const T of _)
          T.text != null && k.push(To(T));
        k.length > 0 && M.sourceTranslation.prependTurns(k);
        const H = /* @__PURE__ */ new Map();
        for (const T of _)
          if (T.translations)
            for (const I of T.translations) {
              let $ = H.get(I.translationId);
              $ || ($ = [], H.set(I.translationId, $)), $.push(vs(T, I));
            }
        for (const [T, I] of H) {
          const $ = M.translations.get(T);
          $ && $.prependTurns(I);
        }
      }
      function h() {
        a(), i();
      }
      function f(_) {
        const w = t.activeChannel.value.activeTranslation.value, M = t.activeChannel.value;
        if (!_.final && w.languages.includes(_.language))
          e.value = _.text;
        else if (_.final) {
          const E = M.translations.get(_.language);
          if (E) {
            const k = vs(
              { ..._ },
              _
            );
            E === w ? l(E, k) : E.updateOrCreateTurnSilent(k);
          }
          w.languages.includes(_.language) && h();
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
      }, m = t.on(
        "channel:change",
        h
      ), y = t.on(
        "translation:change",
        h
      ), S = t.on(
        "translation:sync",
        o
      ), x = t.on("channel:sync", o);
      return t.live = p, () => {
        h(), m(), y(), S(), x(), t.live = void 0;
      };
    }
  };
}
function Um() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ q(0), n = /* @__PURE__ */ q(!1);
      let i = null;
      const s = N(
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
function Km(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ q(t.fontSize ?? 40), i = /* @__PURE__ */ q(!0), s = /* @__PURE__ */ q(!1);
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
          ge(
            r.display,
            (u) => e.emit("watermark:display", { display: u })
          ),
          ge(
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
const jm = /* @__PURE__ */ td(Nm);
function Hm() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = dd, document.head.appendChild(e);
}
function Gm(t = "linto-editor") {
  Hm(), customElements.define(t, jm);
}
export {
  jm as LintoEditor,
  Um as createAudioPlugin,
  qm as createLivePlugin,
  Km as createSubtitlePlugin,
  Gm as register
};
