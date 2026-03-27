// @__NO_SIDE_EFFECTS__
function Ns(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const me = {}, Fn = [], Mt = () => {
}, ja = () => !1, mr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), zs = (t) => t.startsWith("onUpdate:"), ke = Object.assign, qs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, vc = Object.prototype.hasOwnProperty, ve = (t, e) => vc.call(t, e), te = Array.isArray, Nn = (t) => ki(t) === "[object Map]", Ua = (t) => ki(t) === "[object Set]", _o = (t) => ki(t) === "[object Date]", se = (t) => typeof t == "function", Te = (t) => typeof t == "string", vt = (t) => typeof t == "symbol", ye = (t) => t !== null && typeof t == "object", Ka = (t) => (ye(t) || se(t)) && se(t.then) && se(t.catch), Xa = Object.prototype.toString, ki = (t) => Xa.call(t), gc = (t) => ki(t).slice(8, -1), vr = (t) => ki(t) === "[object Object]", gr = (t) => Te(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, ri = /* @__PURE__ */ Ns(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), yr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, yc = /-\w/g, $e = yr(
  (t) => t.replace(yc, (e) => e.slice(1).toUpperCase())
), bc = /\B([A-Z])/g, tt = yr(
  (t) => t.replace(bc, "-$1").toLowerCase()
), br = yr((t) => t.charAt(0).toUpperCase() + t.slice(1)), Wi = yr(
  (t) => t ? `on${br(t)}` : ""
), je = (t, e) => !Object.is(t, e), Vr = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Ga = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, _c = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, hs = (t) => {
  const e = Te(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let wo;
const _r = () => wo || (wo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Dt(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = Te(i) ? Cc(i) : Dt(i);
      if (r)
        for (const s in r)
          e[s] = r[s];
    }
    return e;
  } else if (Te(t) || ye(t))
    return t;
}
const wc = /;(?![^(]*\))/g, xc = /:([^]+)/, Sc = /\/\*[^]*?\*\//g;
function Cc(t) {
  const e = {};
  return t.replace(Sc, "").split(wc).forEach((n) => {
    if (n) {
      const i = n.split(xc);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function un(t) {
  let e = "";
  if (Te(t))
    e = t;
  else if (te(t))
    for (let n = 0; n < t.length; n++) {
      const i = un(t[n]);
      i && (e += i + " ");
    }
  else if (ye(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Hs(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !Te(e) && (t.class = un(e)), n && (t.style = Dt(n)), t;
}
const Ec = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Tc = /* @__PURE__ */ Ns(Ec);
function Ya(t) {
  return !!t || t === "";
}
function kc(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = Vs(t[i], e[i]);
  return n;
}
function Vs(t, e) {
  if (t === e) return !0;
  let n = _o(t), i = _o(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = vt(t), i = vt(e), n || i)
    return t === e;
  if (n = te(t), i = te(e), n || i)
    return n && i ? kc(t, e) : !1;
  if (n = ye(t), i = ye(e), n || i) {
    if (!n || !i)
      return !1;
    const r = Object.keys(t).length, s = Object.keys(e).length;
    if (r !== s)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Vs(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const Ja = (t) => !!(t && t.__v_isRef === !0), ge = (t) => Te(t) ? t : t == null ? "" : te(t) || ye(t) && (t.toString === Xa || !se(t.toString)) ? Ja(t) ? ge(t.value) : JSON.stringify(t, Za, 2) : String(t), Za = (t, e) => Ja(e) ? Za(t, e.value) : Nn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, r], s) => (n[Wr(i, s) + " =>"] = r, n),
    {}
  )
} : Ua(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Wr(n))
} : vt(e) ? Wr(e) : ye(e) && !te(e) && !vr(e) ? String(e) : e, Wr = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    vt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let ze;
class Qa {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = ze, !e && ze && (this.index = (ze.scopes || (ze.scopes = [])).push(
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
      const n = ze;
      try {
        return ze = this, e();
      } finally {
        ze = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ze, ze = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (ze = this.prevScope, this.prevScope = void 0);
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
function el(t) {
  return new Qa(t);
}
function Ws() {
  return ze;
}
function tl(t, e = !1) {
  ze && ze.cleanups.push(t);
}
let Se;
const jr = /* @__PURE__ */ new WeakSet();
class nl {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ze && ze.active && ze.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, jr.has(this) && (jr.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || rl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, xo(this), sl(this);
    const e = Se, n = ht;
    Se = this, ht = !0;
    try {
      return this.fn();
    } finally {
      ol(this), Se = e, ht = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ks(e);
      this.deps = this.depsTail = void 0, xo(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? jr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ms(this) && this.run();
  }
  get dirty() {
    return ms(this);
  }
}
let il = 0, si, oi;
function rl(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = oi, oi = t;
    return;
  }
  t.next = si, si = t;
}
function js() {
  il++;
}
function Us() {
  if (--il > 0)
    return;
  if (oi) {
    let e = oi;
    for (oi = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; si; ) {
    let e = si;
    for (si = void 0; e; ) {
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
function sl(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function ol(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const r = i.prevDep;
    i.version === -1 ? (i === n && (n = r), Ks(i), Ac(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  t.deps = e, t.depsTail = n;
}
function ms(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (al(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function al(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === fi) || (t.globalVersion = fi, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !ms(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Se, i = ht;
  Se = t, ht = !0;
  try {
    sl(t);
    const r = t.fn(t._value);
    (e.version === 0 || je(r, t._value)) && (t.flags |= 128, t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    Se = n, ht = i, ol(t), t.flags &= -3;
  }
}
function Ks(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: r } = t;
  if (i && (i.nextSub = r, t.prevSub = void 0), r && (r.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Ks(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Ac(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let ht = !0;
const ll = [];
function Kt() {
  ll.push(ht), ht = !1;
}
function Xt() {
  const t = ll.pop();
  ht = t === void 0 ? !0 : t;
}
function xo(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = Se;
    Se = void 0;
    try {
      e();
    } finally {
      Se = n;
    }
  }
}
let fi = 0;
class Pc {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class wr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!Se || !ht || Se === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Se)
      n = this.activeLink = new Pc(Se, this), Se.deps ? (n.prevDep = Se.depsTail, Se.depsTail.nextDep = n, Se.depsTail = n) : Se.deps = Se.depsTail = n, ul(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = Se.depsTail, n.nextDep = void 0, Se.depsTail.nextDep = n, Se.depsTail = n, Se.deps === n && (Se.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, fi++, this.notify(e);
  }
  notify(e) {
    js();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Us();
    }
  }
}
function ul(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        ul(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const er = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ Symbol(
  ""
), vs = /* @__PURE__ */ Symbol(
  ""
), pi = /* @__PURE__ */ Symbol(
  ""
);
function qe(t, e, n) {
  if (ht && Se) {
    let i = er.get(t);
    i || er.set(t, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new wr()), r.map = i, r.key = n), r.track();
  }
}
function jt(t, e, n, i, r, s) {
  const o = er.get(t);
  if (!o) {
    fi++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (js(), e === "clear")
    o.forEach(a);
  else {
    const l = te(t), c = l && gr(n);
    if (l && n === "length") {
      const u = Number(i);
      o.forEach((d, f) => {
        (f === "length" || f === pi || !vt(f) && f >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), c && a(o.get(pi)), e) {
        case "add":
          l ? c && a(o.get("length")) : (a(o.get(Cn)), Nn(t) && a(o.get(vs)));
          break;
        case "delete":
          l || (a(o.get(Cn)), Nn(t) && a(o.get(vs)));
          break;
        case "set":
          Nn(t) && a(o.get(Cn));
          break;
      }
  }
  Us();
}
function Oc(t, e) {
  const n = er.get(t);
  return n && n.get(e);
}
function Rn(t) {
  const e = /* @__PURE__ */ he(t);
  return e === t ? e : (qe(e, "iterate", pi), /* @__PURE__ */ rt(t) ? e : e.map(gt));
}
function xr(t) {
  return qe(t = /* @__PURE__ */ he(t), "iterate", pi), t;
}
function rn(t, e) {
  return /* @__PURE__ */ Gt(t) ? Wn(/* @__PURE__ */ En(t) ? gt(e) : e) : gt(e);
}
const Mc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ur(this, Symbol.iterator, (t) => rn(this, t));
  },
  concat(...t) {
    return Rn(this).concat(
      ...t.map((e) => te(e) ? Rn(e) : e)
    );
  },
  entries() {
    return Ur(this, "entries", (t) => (t[1] = rn(this, t[1]), t));
  },
  every(t, e) {
    return qt(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return qt(
      this,
      "filter",
      t,
      e,
      (n) => n.map((i) => rn(this, i)),
      arguments
    );
  },
  find(t, e) {
    return qt(
      this,
      "find",
      t,
      e,
      (n) => rn(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return qt(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return qt(
      this,
      "findLast",
      t,
      e,
      (n) => rn(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return qt(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return qt(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Kr(this, "includes", t);
  },
  indexOf(...t) {
    return Kr(this, "indexOf", t);
  },
  join(t) {
    return Rn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Kr(this, "lastIndexOf", t);
  },
  map(t, e) {
    return qt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return Jn(this, "pop");
  },
  push(...t) {
    return Jn(this, "push", t);
  },
  reduce(t, ...e) {
    return So(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return So(this, "reduceRight", t, e);
  },
  shift() {
    return Jn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return qt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return Jn(this, "splice", t);
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
    return Jn(this, "unshift", t);
  },
  values() {
    return Ur(this, "values", (t) => rn(this, t));
  }
};
function Ur(t, e, n) {
  const i = xr(t), r = i[e]();
  return i !== t && !/* @__PURE__ */ rt(t) && (r._next = r.next, r.next = () => {
    const s = r._next();
    return s.done || (s.value = n(s.value)), s;
  }), r;
}
const Rc = Array.prototype;
function qt(t, e, n, i, r, s) {
  const o = xr(t), a = o !== t && !/* @__PURE__ */ rt(t), l = o[e];
  if (l !== Rc[e]) {
    const d = l.apply(t, s);
    return a ? gt(d) : d;
  }
  let c = n;
  o !== t && (a ? c = function(d, f) {
    return n.call(this, rn(t, d), f, t);
  } : n.length > 2 && (c = function(d, f) {
    return n.call(this, d, f, t);
  }));
  const u = l.call(o, c, i);
  return a && r ? r(u) : u;
}
function So(t, e, n, i) {
  const r = xr(t);
  let s = n;
  return r !== t && (/* @__PURE__ */ rt(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, rn(t, a), l, t);
  }), r[e](s, ...i);
}
function Kr(t, e, n) {
  const i = /* @__PURE__ */ he(t);
  qe(i, "iterate", pi);
  const r = i[e](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ Tr(n[0]) ? (n[0] = /* @__PURE__ */ he(n[0]), i[e](...n)) : r;
}
function Jn(t, e, n = []) {
  Kt(), js();
  const i = (/* @__PURE__ */ he(t))[e].apply(t, n);
  return Us(), Xt(), i;
}
const Ic = /* @__PURE__ */ Ns("__proto__,__v_isRef,__isVue"), cl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(vt)
);
function Lc(t) {
  vt(t) || (t = String(t));
  const e = /* @__PURE__ */ he(this);
  return qe(e, "has", t), e.hasOwnProperty(t);
}
class dl {
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
      return i === (r ? s ? gl : vl : s ? ml : hl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = te(e);
    if (!r) {
      let l;
      if (o && (l = Mc[n]))
        return l;
      if (n === "hasOwnProperty")
        return Lc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Le(e) ? e : i
    );
    if ((vt(n) ? cl.has(n) : Ic(n)) || (r || qe(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ Le(a)) {
      const l = o && gr(n) ? a : a.value;
      return r && ye(l) ? /* @__PURE__ */ tr(l) : l;
    }
    return ye(a) ? r ? /* @__PURE__ */ tr(a) : /* @__PURE__ */ Ai(a) : a;
  }
}
class fl extends dl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, r) {
    let s = e[n];
    const o = te(e) && gr(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Gt(s);
      if (!/* @__PURE__ */ rt(i) && !/* @__PURE__ */ Gt(i) && (s = /* @__PURE__ */ he(s), i = /* @__PURE__ */ he(i)), !o && /* @__PURE__ */ Le(s) && !/* @__PURE__ */ Le(i))
        return c || (s.value = i), !0;
    }
    const a = o ? Number(n) < e.length : ve(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Le(e) ? e : r
    );
    return e === /* @__PURE__ */ he(r) && (a ? je(i, s) && jt(e, "set", n, i) : jt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = ve(e, n);
    e[n];
    const r = Reflect.deleteProperty(e, n);
    return r && i && jt(e, "delete", n, void 0), r;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!vt(n) || !cl.has(n)) && qe(e, "has", n), i;
  }
  ownKeys(e) {
    return qe(
      e,
      "iterate",
      te(e) ? "length" : Cn
    ), Reflect.ownKeys(e);
  }
}
class pl extends dl {
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
const Dc = /* @__PURE__ */ new fl(), $c = /* @__PURE__ */ new pl(), Bc = /* @__PURE__ */ new fl(!0), Fc = /* @__PURE__ */ new pl(!0), gs = (t) => t, Di = (t) => Reflect.getPrototypeOf(t);
function Nc(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = /* @__PURE__ */ he(r), o = Nn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? gs : e ? Wn : gt;
    return !e && qe(
      s,
      "iterate",
      l ? vs : Cn
    ), ke(
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
function $i(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function zc(t, e) {
  const n = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ he(s), a = /* @__PURE__ */ he(r);
      t || (je(r, a) && qe(o, "get", r), qe(o, "get", a));
      const { has: l } = Di(o), c = e ? gs : t ? Wn : gt;
      if (l.call(o, r))
        return c(s.get(r));
      if (l.call(o, a))
        return c(s.get(a));
      s !== o && s.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !t && qe(/* @__PURE__ */ he(r), "iterate", Cn), r.size;
    },
    has(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ he(s), a = /* @__PURE__ */ he(r);
      return t || (je(r, a) && qe(o, "has", r), qe(o, "has", a)), r === a ? s.has(r) : s.has(r) || s.has(a);
    },
    forEach(r, s) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ he(a), c = e ? gs : t ? Wn : gt;
      return !t && qe(l, "iterate", Cn), a.forEach((u, d) => r.call(s, c(u), c(d), o));
    }
  };
  return ke(
    n,
    t ? {
      add: $i("add"),
      set: $i("set"),
      delete: $i("delete"),
      clear: $i("clear")
    } : {
      add(r) {
        !e && !/* @__PURE__ */ rt(r) && !/* @__PURE__ */ Gt(r) && (r = /* @__PURE__ */ he(r));
        const s = /* @__PURE__ */ he(this);
        return Di(s).has.call(s, r) || (s.add(r), jt(s, "add", r, r)), this;
      },
      set(r, s) {
        !e && !/* @__PURE__ */ rt(s) && !/* @__PURE__ */ Gt(s) && (s = /* @__PURE__ */ he(s));
        const o = /* @__PURE__ */ he(this), { has: a, get: l } = Di(o);
        let c = a.call(o, r);
        c || (r = /* @__PURE__ */ he(r), c = a.call(o, r));
        const u = l.call(o, r);
        return o.set(r, s), c ? je(s, u) && jt(o, "set", r, s) : jt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ he(this), { has: o, get: a } = Di(s);
        let l = o.call(s, r);
        l || (r = /* @__PURE__ */ he(r), l = o.call(s, r)), a && a.call(s, r);
        const c = s.delete(r);
        return l && jt(s, "delete", r, void 0), c;
      },
      clear() {
        const r = /* @__PURE__ */ he(this), s = r.size !== 0, o = r.clear();
        return s && jt(
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
    n[r] = Nc(r, t, e);
  }), n;
}
function Sr(t, e) {
  const n = zc(t, e);
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(
    ve(n, r) && r in i ? n : i,
    r,
    s
  );
}
const qc = {
  get: /* @__PURE__ */ Sr(!1, !1)
}, Hc = {
  get: /* @__PURE__ */ Sr(!1, !0)
}, Vc = {
  get: /* @__PURE__ */ Sr(!0, !1)
}, Wc = {
  get: /* @__PURE__ */ Sr(!0, !0)
}, hl = /* @__PURE__ */ new WeakMap(), ml = /* @__PURE__ */ new WeakMap(), vl = /* @__PURE__ */ new WeakMap(), gl = /* @__PURE__ */ new WeakMap();
function jc(t) {
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
function Uc(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : jc(gc(t));
}
// @__NO_SIDE_EFFECTS__
function Ai(t) {
  return /* @__PURE__ */ Gt(t) ? t : Er(
    t,
    !1,
    Dc,
    qc,
    hl
  );
}
// @__NO_SIDE_EFFECTS__
function Cr(t) {
  return Er(
    t,
    !1,
    Bc,
    Hc,
    ml
  );
}
// @__NO_SIDE_EFFECTS__
function tr(t) {
  return Er(
    t,
    !0,
    $c,
    Vc,
    vl
  );
}
// @__NO_SIDE_EFFECTS__
function In(t) {
  return Er(
    t,
    !0,
    Fc,
    Wc,
    gl
  );
}
function Er(t, e, n, i, r) {
  if (!ye(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = Uc(t);
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
function En(t) {
  return /* @__PURE__ */ Gt(t) ? /* @__PURE__ */ En(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Gt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function rt(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Tr(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function he(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ he(e) : t;
}
function yl(t) {
  return !ve(t, "__v_skip") && Object.isExtensible(t) && Ga(t, "__v_skip", !0), t;
}
const gt = (t) => ye(t) ? /* @__PURE__ */ Ai(t) : t, Wn = (t) => ye(t) ? /* @__PURE__ */ tr(t) : t;
// @__NO_SIDE_EFFECTS__
function Le(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(t) {
  return bl(t, !1);
}
// @__NO_SIDE_EFFECTS__
function Tn(t) {
  return bl(t, !0);
}
function bl(t, e) {
  return /* @__PURE__ */ Le(t) ? t : new Kc(t, e);
}
class Kc {
  constructor(e, n) {
    this.dep = new wr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ he(e), this._value = n ? e : gt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ rt(e) || /* @__PURE__ */ Gt(e);
    e = i ? e : /* @__PURE__ */ he(e), je(e, n) && (this._rawValue = e, this._value = i ? e : gt(e), this.dep.trigger());
  }
}
function Co(t) {
  t.dep && t.dep.trigger();
}
function m(t) {
  return /* @__PURE__ */ Le(t) ? t.value : t;
}
function Ge(t) {
  return se(t) ? t() : m(t);
}
const Xc = {
  get: (t, e, n) => e === "__v_raw" ? t : m(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const r = t[e];
    return /* @__PURE__ */ Le(r) && !/* @__PURE__ */ Le(n) ? (r.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function _l(t) {
  return /* @__PURE__ */ En(t) ? t : new Proxy(t, Xc);
}
class Gc {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new wr(), { get: i, set: r } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = r;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function wl(t) {
  return new Gc(t);
}
// @__NO_SIDE_EFFECTS__
function Kn(t) {
  const e = te(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = xl(t, n);
  return e;
}
class Yc {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ he(e);
    let r = !0, s = e;
    if (!te(e) || !gr(String(n)))
      do
        r = !/* @__PURE__ */ Tr(s) || /* @__PURE__ */ rt(s);
      while (r && (s = s.__v_raw));
    this._shallow = r;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = m(e)), this._value = e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    if (this._shallow && /* @__PURE__ */ Le(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ Le(n)) {
        n.value = e;
        return;
      }
    }
    this._object[this._key] = e;
  }
  get dep() {
    return Oc(this._raw, this._key);
  }
}
class Jc {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function ji(t, e, n) {
  return /* @__PURE__ */ Le(t) ? t : se(t) ? new Jc(t) : ye(t) && arguments.length > 1 ? xl(t, e, n) : /* @__PURE__ */ N(t);
}
function xl(t, e, n) {
  return new Yc(t, e, n);
}
class Zc {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new wr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = fi - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Se !== this)
      return rl(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return al(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function Qc(t, e, n = !1) {
  let i, r;
  return se(t) ? i = t : (i = t.get, r = t.set), new Zc(i, r, n);
}
const Bi = {}, nr = /* @__PURE__ */ new WeakMap();
let _n;
function ed(t, e = !1, n = _n) {
  if (n) {
    let i = nr.get(n);
    i || nr.set(n, i = []), i.push(t);
  }
}
function td(t, e, n = me) {
  const { immediate: i, deep: r, once: s, scheduler: o, augmentJob: a, call: l } = n, c = (y) => r ? y : /* @__PURE__ */ rt(y) || r === !1 || r === 0 ? Ut(y, 1) : Ut(y);
  let u, d, f, p, h = !1, v = !1;
  if (/* @__PURE__ */ Le(t) ? (d = () => t.value, h = /* @__PURE__ */ rt(t)) : /* @__PURE__ */ En(t) ? (d = () => c(t), h = !0) : te(t) ? (v = !0, h = t.some((y) => /* @__PURE__ */ En(y) || /* @__PURE__ */ rt(y)), d = () => t.map((y) => {
    if (/* @__PURE__ */ Le(y))
      return y.value;
    if (/* @__PURE__ */ En(y))
      return c(y);
    if (se(y))
      return l ? l(y, 2) : y();
  })) : se(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (f) {
      Kt();
      try {
        f();
      } finally {
        Xt();
      }
    }
    const y = _n;
    _n = u;
    try {
      return l ? l(t, 3, [p]) : t(p);
    } finally {
      _n = y;
    }
  } : d = Mt, e && r) {
    const y = d, E = r === !0 ? 1 / 0 : r;
    d = () => Ut(y(), E);
  }
  const g = Ws(), C = () => {
    u.stop(), g && g.active && qs(g.effects, u);
  };
  if (s && e) {
    const y = e;
    e = (...E) => {
      y(...E), C();
    };
  }
  let _ = v ? new Array(t.length).fill(Bi) : Bi;
  const x = (y) => {
    if (!(!(u.flags & 1) || !u.dirty && !y))
      if (e) {
        const E = u.run();
        if (r || h || (v ? E.some((T, S) => je(T, _[S])) : je(E, _))) {
          f && f();
          const T = _n;
          _n = u;
          try {
            const S = [
              E,
              // pass undefined as the old value when it's changed for the first time
              _ === Bi ? void 0 : v && _[0] === Bi ? [] : _,
              p
            ];
            _ = E, l ? l(e, 3, S) : (
              // @ts-expect-error
              e(...S)
            );
          } finally {
            _n = T;
          }
        }
      } else
        u.run();
  };
  return a && a(x), u = new nl(d), u.scheduler = o ? () => o(x, !1) : x, p = (y) => ed(y, !1, u), f = u.onStop = () => {
    const y = nr.get(u);
    if (y) {
      if (l)
        l(y, 4);
      else
        for (const E of y) E();
      nr.delete(u);
    }
  }, e ? i ? x(!0) : _ = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), C.pause = u.pause.bind(u), C.resume = u.resume.bind(u), C.stop = C, C;
}
function Ut(t, e = 1 / 0, n) {
  if (e <= 0 || !ye(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Le(t))
    Ut(t.value, e, n);
  else if (te(t))
    for (let i = 0; i < t.length; i++)
      Ut(t[i], e, n);
  else if (Ua(t) || Nn(t))
    t.forEach((i) => {
      Ut(i, e, n);
    });
  else if (vr(t)) {
    for (const i in t)
      Ut(t[i], e, n);
    for (const i of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, i) && Ut(t[i], e, n);
  }
  return t;
}
function Pi(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (r) {
    kr(r, e, n);
  }
}
function yt(t, e, n, i) {
  if (se(t)) {
    const r = Pi(t, e, n, i);
    return r && Ka(r) && r.catch((s) => {
      kr(s, e, n);
    }), r;
  }
  if (te(t)) {
    const r = [];
    for (let s = 0; s < t.length; s++)
      r.push(yt(t[s], e, n, i));
    return r;
  }
}
function kr(t, e, n, i = !0) {
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
      Kt(), Pi(s, null, 10, [
        t,
        l,
        c
      ]), Xt();
      return;
    }
  }
  nd(t, n, r, i, o);
}
function nd(t, e, n, i = !0, r = !1) {
  if (r)
    throw t;
  console.error(t);
}
const Ue = [];
let Tt = -1;
const zn = [];
let sn = null, $n = 0;
const Sl = /* @__PURE__ */ Promise.resolve();
let ir = null;
function Me(t) {
  const e = ir || Sl;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function id(t) {
  let e = Tt + 1, n = Ue.length;
  for (; e < n; ) {
    const i = e + n >>> 1, r = Ue[i], s = hi(r);
    s < t || s === t && r.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Xs(t) {
  if (!(t.flags & 1)) {
    const e = hi(t), n = Ue[Ue.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= hi(n) ? Ue.push(t) : Ue.splice(id(e), 0, t), t.flags |= 1, Cl();
  }
}
function Cl() {
  ir || (ir = Sl.then(Tl));
}
function rd(t) {
  te(t) ? zn.push(...t) : sn && t.id === -1 ? sn.splice($n + 1, 0, t) : t.flags & 1 || (zn.push(t), t.flags |= 1), Cl();
}
function Eo(t, e, n = Tt + 1) {
  for (; n < Ue.length; n++) {
    const i = Ue[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      Ue.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function El(t) {
  if (zn.length) {
    const e = [...new Set(zn)].sort(
      (n, i) => hi(n) - hi(i)
    );
    if (zn.length = 0, sn) {
      sn.push(...e);
      return;
    }
    for (sn = e, $n = 0; $n < sn.length; $n++) {
      const n = sn[$n];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    sn = null, $n = 0;
  }
}
const hi = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function Tl(t) {
  try {
    for (Tt = 0; Tt < Ue.length; Tt++) {
      const e = Ue[Tt];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Pi(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; Tt < Ue.length; Tt++) {
      const e = Ue[Tt];
      e && (e.flags &= -2);
    }
    Tt = -1, Ue.length = 0, El(), ir = null, (Ue.length || zn.length) && Tl();
  }
}
let Fe = null, kl = null;
function rr(t) {
  const e = Fe;
  return Fe = t, kl = t && t.type.__scopeId || null, e;
}
function q(t, e = Fe, n) {
  if (!e || t._n)
    return t;
  const i = (...r) => {
    i._d && ar(-1);
    const s = rr(e);
    let o;
    try {
      o = t(...r);
    } finally {
      rr(s), i._d && ar(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function sd(t, e) {
  if (Fe === null)
    return t;
  const n = Ir(Fe), i = t.dirs || (t.dirs = []);
  for (let r = 0; r < e.length; r++) {
    let [s, o, a, l = me] = e[r];
    s && (se(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && Ut(o), i.push({
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
function vn(t, e, n, i) {
  const r = t.dirs, s = e && e.dirs;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s && (a.oldValue = s[o].value);
    let l = a.dir[i];
    l && (Kt(), yt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Xt());
  }
}
function Oi(t, e) {
  if (He) {
    let n = He.provides;
    const i = He.parent && He.parent.provides;
    i === n && (n = He.provides = Object.create(i)), n[t] = e;
  }
}
function an(t, e, n = !1) {
  const i = ot();
  if (i || Hn) {
    let r = Hn ? Hn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (r && t in r)
      return r[t];
    if (arguments.length > 1)
      return n && se(e) ? e.call(i && i.proxy) : e;
  }
}
const od = /* @__PURE__ */ Symbol.for("v-scx"), ad = () => an(od);
function dt(t, e) {
  return Mi(t, null, e);
}
function Al(t, e) {
  return Mi(
    t,
    null,
    { flush: "post" }
  );
}
function Pl(t, e) {
  return Mi(
    t,
    null,
    { flush: "sync" }
  );
}
function we(t, e, n) {
  return Mi(t, e, n);
}
function Mi(t, e, n = me) {
  const { immediate: i, deep: r, flush: s, once: o } = n, a = ke({}, n), l = e && i || !e && s !== "post";
  let c;
  if (yi) {
    if (s === "sync") {
      const p = ad();
      c = p.__watcherHandles || (p.__watcherHandles = []);
    } else if (!l) {
      const p = () => {
      };
      return p.stop = Mt, p.resume = Mt, p.pause = Mt, p;
    }
  }
  const u = He;
  a.call = (p, h, v) => yt(p, u, h, v);
  let d = !1;
  s === "post" ? a.scheduler = (p) => {
    Ne(p, u && u.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (p, h) => {
    h ? p() : Xs(p);
  }), a.augmentJob = (p) => {
    e && (p.flags |= 4), d && (p.flags |= 2, u && (p.id = u.uid, p.i = u));
  };
  const f = td(t, e, a);
  return yi && (c ? c.push(f) : l && f()), f;
}
function ld(t, e, n) {
  const i = this.proxy, r = Te(t) ? t.includes(".") ? Ol(i, t) : () => i[t] : t.bind(i, i);
  let s;
  se(e) ? s = e : (s = e.handler, n = e);
  const o = Ri(this), a = Mi(r, s.bind(i), n);
  return o(), a;
}
function Ol(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const Ml = /* @__PURE__ */ Symbol("_vte"), Rl = (t) => t.__isTeleport, ai = (t) => t && (t.disabled || t.disabled === ""), To = (t) => t && (t.defer || t.defer === ""), ko = (t) => typeof SVGElement < "u" && t instanceof SVGElement, Ao = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, ys = (t, e) => {
  const n = t && t.to;
  return Te(n) ? e ? e(n) : null : n;
}, Il = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, r, s, o, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: f,
      o: { insert: p, querySelector: h, createText: v, createComment: g }
    } = c, C = ai(e.props);
    let { shapeFlag: _, children: x, dynamicChildren: y } = e;
    if (t == null) {
      const E = e.el = v(""), T = e.anchor = v("");
      p(E, n, i), p(T, n, i);
      const S = (k, A) => {
        _ & 16 && u(
          x,
          k,
          A,
          r,
          s,
          o,
          a,
          l
        );
      }, R = () => {
        const k = e.target = ys(e.props, h), A = bs(k, e, v, p);
        k && (o !== "svg" && ko(k) ? o = "svg" : o !== "mathml" && Ao(k) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(k), C || (S(k, A), Ui(e, !1)));
      };
      C && (S(n, T), Ui(e, !0)), To(e.props) ? (e.el.__isMounted = !1, Ne(() => {
        R(), delete e.el.__isMounted;
      }, s)) : R();
    } else {
      if (To(e.props) && t.el.__isMounted === !1) {
        Ne(() => {
          Il.process(
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
      const E = e.anchor = t.anchor, T = e.target = t.target, S = e.targetAnchor = t.targetAnchor, R = ai(t.props), k = R ? n : T, A = R ? E : S;
      if (o === "svg" || ko(T) ? o = "svg" : (o === "mathml" || Ao(T)) && (o = "mathml"), y ? (f(
        t.dynamicChildren,
        y,
        k,
        r,
        s,
        o,
        a
      ), Js(t, e, !0)) : l || d(
        t,
        e,
        k,
        A,
        r,
        s,
        o,
        a,
        !1
      ), C)
        R ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : Fi(
          e,
          n,
          E,
          c,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const I = e.target = ys(
          e.props,
          h
        );
        I && Fi(
          e,
          I,
          null,
          c,
          0
        );
      } else R && Fi(
        e,
        T,
        S,
        c,
        1
      );
      Ui(e, C);
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
      props: f
    } = t;
    if (d && (r(c), r(u)), s && r(l), o & 16) {
      const p = s || !ai(f);
      for (let h = 0; h < a.length; h++) {
        const v = a[h];
        i(
          v,
          e,
          n,
          p,
          !!v.dynamicChildren
        );
      }
    }
  },
  move: Fi,
  hydrate: ud
};
function Fi(t, e, n, { o: { insert: i }, m: r }, s = 2) {
  s === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: c, props: u } = t, d = s === 2;
  if (d && i(o, e, n), (!d || ai(u)) && l & 16)
    for (let f = 0; f < c.length; f++)
      r(
        c[f],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function ud(t, e, n, i, r, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function f(g, C) {
    let _ = C;
    for (; _; ) {
      if (_ && _.nodeType === 8) {
        if (_.data === "teleport start anchor")
          e.targetStart = _;
        else if (_.data === "teleport anchor") {
          e.targetAnchor = _, g._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      _ = o(_);
    }
  }
  function p(g, C) {
    C.anchor = d(
      o(g),
      C,
      a(g),
      n,
      i,
      r,
      s
    );
  }
  const h = e.target = ys(
    e.props,
    l
  ), v = ai(e.props);
  if (h) {
    const g = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (v ? (p(t, e), f(h, g), e.targetAnchor || bs(
      h,
      e,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = o(t), f(h, g), e.targetAnchor || bs(h, e, u, c), d(
      g && o(g),
      e,
      h,
      n,
      i,
      r,
      s
    ))), Ui(e, v);
  } else v && e.shapeFlag & 16 && (p(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Ll = Il;
function Ui(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, r;
    for (e ? (i = t.el, r = t.anchor) : (i = t.targetStart, r = t.targetAnchor); i && i !== r; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function bs(t, e, n, i, r = null) {
  const s = e.targetStart = n(""), o = e.targetAnchor = n("");
  return s[Ml] = o, t && (i(s, t, r), i(o, t, r)), o;
}
const kt = /* @__PURE__ */ Symbol("_leaveCb"), Zn = /* @__PURE__ */ Symbol("_enterCb");
function cd() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return De(() => {
    t.isMounted = !0;
  }), An(() => {
    t.isUnmounting = !0;
  }), t;
}
const lt = [Function, Array], Dl = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: lt,
  onEnter: lt,
  onAfterEnter: lt,
  onEnterCancelled: lt,
  // leave
  onBeforeLeave: lt,
  onLeave: lt,
  onAfterLeave: lt,
  onLeaveCancelled: lt,
  // appear
  onBeforeAppear: lt,
  onAppear: lt,
  onAfterAppear: lt,
  onAppearCancelled: lt
}, $l = (t) => {
  const e = t.subTree;
  return e.component ? $l(e.component) : e;
}, dd = {
  name: "BaseTransition",
  props: Dl,
  setup(t, { slots: e }) {
    const n = ot(), i = cd();
    return () => {
      const r = e.default && Nl(e.default(), !0);
      if (!r || !r.length)
        return;
      const s = Bl(r), o = /* @__PURE__ */ he(t), { mode: a } = o;
      if (i.isLeaving)
        return Xr(s);
      const l = Po(s);
      if (!l)
        return Xr(s);
      let c = _s(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      l.type !== Be && mi(l, c);
      let u = n.subTree && Po(n.subTree);
      if (u && u.type !== Be && !xn(u, l) && $l(n).type !== Be) {
        let d = _s(
          u,
          o,
          i,
          n
        );
        if (mi(u, d), a === "out-in" && l.type !== Be)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, Xr(s);
        a === "in-out" && l.type !== Be ? d.delayLeave = (f, p, h) => {
          const v = Fl(
            i,
            u
          );
          v[String(u.key)] = u, f[kt] = () => {
            p(), f[kt] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return s;
    };
  }
};
function Bl(t) {
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
const fd = dd;
function Fl(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function _s(t, e, n, i, r) {
  const {
    appear: s,
    mode: o,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: c,
    onAfterEnter: u,
    onEnterCancelled: d,
    onBeforeLeave: f,
    onLeave: p,
    onAfterLeave: h,
    onLeaveCancelled: v,
    onBeforeAppear: g,
    onAppear: C,
    onAfterAppear: _,
    onAppearCancelled: x
  } = e, y = String(t.key), E = Fl(n, t), T = (k, A) => {
    k && yt(
      k,
      i,
      9,
      A
    );
  }, S = (k, A) => {
    const I = A[1];
    T(k, A), te(k) ? k.every((P) => P.length <= 1) && I() : k.length <= 1 && I();
  }, R = {
    mode: o,
    persisted: a,
    beforeEnter(k) {
      let A = l;
      if (!n.isMounted)
        if (s)
          A = g || l;
        else
          return;
      k[kt] && k[kt](
        !0
        /* cancelled */
      );
      const I = E[y];
      I && xn(t, I) && I.el[kt] && I.el[kt](), T(A, [k]);
    },
    enter(k) {
      let A = c, I = u, P = d;
      if (!n.isMounted)
        if (s)
          A = C || c, I = _ || u, P = x || d;
        else
          return;
      let H = !1;
      k[Zn] = (U) => {
        H || (H = !0, U ? T(P, [k]) : T(I, [k]), R.delayedLeave && R.delayedLeave(), k[Zn] = void 0);
      };
      const L = k[Zn].bind(null, !1);
      A ? S(A, [k, L]) : L();
    },
    leave(k, A) {
      const I = String(t.key);
      if (k[Zn] && k[Zn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return A();
      T(f, [k]);
      let P = !1;
      k[kt] = (L) => {
        P || (P = !0, A(), L ? T(v, [k]) : T(h, [k]), k[kt] = void 0, E[I] === t && delete E[I]);
      };
      const H = k[kt].bind(null, !1);
      E[I] = t, p ? S(p, [k, H]) : H();
    },
    clone(k) {
      const A = _s(
        k,
        e,
        n,
        i,
        r
      );
      return r && r(A), A;
    }
  };
  return R;
}
function Xr(t) {
  if (Ar(t))
    return t = Yt(t), t.children = null, t;
}
function Po(t) {
  if (!Ar(t))
    return Rl(t.type) && t.children ? Bl(t.children) : t;
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
function mi(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, mi(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Nl(t, e = !1, n) {
  let i = [], r = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Ee ? (o.patchFlag & 128 && r++, i = i.concat(
      Nl(o.children, e, a)
    )) : (e || o.type !== Be) && i.push(a != null ? Yt(o, { key: a }) : o);
  }
  if (r > 1)
    for (let s = 0; s < i.length; s++)
      i[s].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function Z(t, e) {
  return se(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ke({ name: t.name }, e, { setup: t })
  ) : t;
}
function zl() {
  const t = ot();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function ql(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function vi(t) {
  const e = ot(), n = /* @__PURE__ */ Tn(null);
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
function Oo(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const sr = /* @__PURE__ */ new WeakMap();
function li(t, e, n, i, r = !1) {
  if (te(t)) {
    t.forEach(
      (v, g) => li(
        v,
        e && (te(e) ? e[g] : e),
        n,
        i,
        r
      )
    );
    return;
  }
  if (qn(i) && !r) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && li(t, e, n, i.component.subTree);
    return;
  }
  const s = i.shapeFlag & 4 ? Ir(i.component) : i.el, o = r ? null : s, { i: a, r: l } = t, c = e && e.r, u = a.refs === me ? a.refs = {} : a.refs, d = a.setupState, f = /* @__PURE__ */ he(d), p = d === me ? ja : (v) => Oo(u, v) ? !1 : ve(f, v), h = (v, g) => !(g && Oo(u, g));
  if (c != null && c !== l) {
    if (Mo(e), Te(c))
      u[c] = null, p(c) && (d[c] = null);
    else if (/* @__PURE__ */ Le(c)) {
      const v = e;
      h(c, v.k) && (c.value = null), v.k && (u[v.k] = null);
    }
  }
  if (se(l))
    Pi(l, a, 12, [o, u]);
  else {
    const v = Te(l), g = /* @__PURE__ */ Le(l);
    if (v || g) {
      const C = () => {
        if (t.f) {
          const _ = v ? p(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (r)
            te(_) && qs(_, s);
          else if (te(_))
            _.includes(s) || _.push(s);
          else if (v)
            u[l] = [s], p(l) && (d[l] = u[l]);
          else {
            const x = [s];
            h(l, t.k) && (l.value = x), t.k && (u[t.k] = x);
          }
        } else v ? (u[l] = o, p(l) && (d[l] = o)) : g && (h(l, t.k) && (l.value = o), t.k && (u[t.k] = o));
      };
      if (o) {
        const _ = () => {
          C(), sr.delete(t);
        };
        _.id = -1, sr.set(t, _), Ne(_, n);
      } else
        Mo(t), C();
    }
  }
}
function Mo(t) {
  const e = sr.get(t);
  e && (e.flags |= 8, sr.delete(t));
}
_r().requestIdleCallback;
_r().cancelIdleCallback;
const qn = (t) => !!t.type.__asyncLoader, Ar = (t) => t.type.__isKeepAlive;
function pd(t, e) {
  Hl(t, "a", e);
}
function hd(t, e) {
  Hl(t, "da", e);
}
function Hl(t, e, n = He) {
  const i = t.__wdc || (t.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return t();
  });
  if (Pr(e, i, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Ar(r.parent.vnode) && md(i, e, n, r), r = r.parent;
  }
}
function md(t, e, n, i) {
  const r = Pr(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  fn(() => {
    qs(i[e], r);
  }, n);
}
function Pr(t, e, n = He, i = !1) {
  if (n) {
    const r = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Kt();
      const a = Ri(n), l = yt(e, n, t, o);
      return a(), Xt(), l;
    });
    return i ? r.unshift(s) : r.push(s), s;
  }
}
const Qt = (t) => (e, n = He) => {
  (!yi || t === "sp") && Pr(t, (...i) => e(...i), n);
}, vd = Qt("bm"), De = Qt("m"), gd = Qt(
  "bu"
), yd = Qt("u"), An = Qt(
  "bum"
), fn = Qt("um"), bd = Qt(
  "sp"
), _d = Qt("rtg"), wd = Qt("rtc");
function xd(t, e = He) {
  Pr("ec", t, e);
}
const Sd = "components", Vl = /* @__PURE__ */ Symbol.for("v-ndc");
function Cd(t) {
  return Te(t) ? Ed(Sd, t, !1) || t : t || Vl;
}
function Ed(t, e, n = !0, i = !1) {
  const r = Fe || He;
  if (r) {
    const s = r.type;
    {
      const a = df(
        s,
        !1
      );
      if (a && (a === e || a === $e(e) || a === br($e(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Ro(r[t] || s[t], e) || // global registration
      Ro(r.appContext[t], e)
    );
    return !o && i ? s : o;
  }
}
function Ro(t, e) {
  return t && (t[e] || t[$e(e)] || t[br($e(e))]);
}
function Pn(t, e, n, i) {
  let r;
  const s = n, o = te(t);
  if (o || Te(t)) {
    const a = o && /* @__PURE__ */ En(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ rt(t), c = /* @__PURE__ */ Gt(t), t = xr(t)), r = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      r[u] = e(
        l ? c ? Wn(gt(t[u])) : gt(t[u]) : t[u],
        u,
        void 0,
        s
      );
  } else if (typeof t == "number") {
    r = new Array(t);
    for (let a = 0; a < t; a++)
      r[a] = e(a + 1, a, void 0, s);
  } else if (ye(t))
    if (t[Symbol.iterator])
      r = Array.from(
        t,
        (a, l) => e(a, l, void 0, s)
      );
    else {
      const a = Object.keys(t);
      r = new Array(a.length);
      for (let l = 0, c = a.length; l < c; l++) {
        const u = a[l];
        r[l] = e(t[u], u, l, s);
      }
    }
  else
    r = [];
  return r;
}
function ce(t, e, n = {}, i, r) {
  if (Fe.ce || Fe.parent && qn(Fe.parent) && Fe.parent.ce) {
    const c = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), M(), G(
      Ee,
      null,
      [V("slot", n, i && i())],
      c ? -2 : 64
    );
  }
  let s = t[e];
  s && s._c && (s._d = !1), M();
  const o = s && Wl(s(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = G(
    Ee,
    {
      key: (a && !vt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && i ? "_fb" : "")
    },
    o || (i ? i() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), s && s._c && (s._d = !0), l;
}
function Wl(t) {
  return t.some((e) => gi(e) ? !(e.type === Be || e.type === Ee && !Wl(e.children)) : !0) ? t : null;
}
const ws = (t) => t ? cu(t) ? Ir(t) : ws(t.parent) : null, ui = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ke(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => ws(t.parent),
    $root: (t) => ws(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => Ul(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Xs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Me.bind(t.proxy)),
    $watch: (t) => ld.bind(t)
  })
), Gr = (t, e) => t !== me && !t.__isScriptSetup && ve(t, e), Td = {
  get({ _: t }, e) {
    if (e === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: r, props: s, accessCache: o, type: a, appContext: l } = t;
    if (e[0] !== "$") {
      const f = o[e];
      if (f !== void 0)
        switch (f) {
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
        if (Gr(i, e))
          return o[e] = 1, i[e];
        if (r !== me && ve(r, e))
          return o[e] = 2, r[e];
        if (ve(s, e))
          return o[e] = 3, s[e];
        if (n !== me && ve(n, e))
          return o[e] = 4, n[e];
        Ss && (o[e] = 0);
      }
    }
    const c = ui[e];
    let u, d;
    if (c)
      return e === "$attrs" && qe(t.attrs, "get", ""), c(t);
    if (
      // css module (injected by vue-loader)
      (u = a.__cssModules) && (u = u[e])
    )
      return u;
    if (n !== me && ve(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ve(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: r, ctx: s } = t;
    return Gr(r, e) ? (r[e] = n, !0) : i !== me && ve(i, e) ? (i[e] = n, !0) : ve(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: r, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== me && a[0] !== "$" && ve(t, a) || Gr(e, a) || ve(s, a) || ve(i, a) || ve(ui, a) || ve(r.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ve(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function kd() {
  return Ad().slots;
}
function Ad(t) {
  const e = ot();
  return e.setupContext || (e.setupContext = fu(e));
}
function xs(t) {
  return te(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Pd(t, e) {
  const n = xs(t);
  for (const i in e) {
    if (i.startsWith("__skip")) continue;
    let r = n[i];
    r ? te(r) || se(r) ? r = n[i] = { type: r, default: e[i] } : r.default = e[i] : r === null && (r = n[i] = { default: e[i] }), r && e[`__skip_${i}`] && (r.skipFactory = !0);
  }
  return n;
}
let Ss = !0;
function Od(t) {
  const e = Ul(t), n = t.proxy, i = t.ctx;
  Ss = !1, e.beforeCreate && Io(e.beforeCreate, t, "bc");
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
    mounted: f,
    beforeUpdate: p,
    updated: h,
    activated: v,
    deactivated: g,
    beforeDestroy: C,
    beforeUnmount: _,
    destroyed: x,
    unmounted: y,
    render: E,
    renderTracked: T,
    renderTriggered: S,
    errorCaptured: R,
    serverPrefetch: k,
    // public API
    expose: A,
    inheritAttrs: I,
    // assets
    components: P,
    directives: H,
    filters: L
  } = e;
  if (c && Md(c, i, null), o)
    for (const J in o) {
      const Q = o[J];
      se(Q) && (i[J] = Q.bind(n));
    }
  if (r) {
    const J = r.call(n, n);
    ye(J) && (t.data = /* @__PURE__ */ Ai(J));
  }
  if (Ss = !0, s)
    for (const J in s) {
      const Q = s[J], be = se(Q) ? Q.bind(n, n) : se(Q.get) ? Q.get.bind(n, n) : Mt, Ie = !se(Q) && se(Q.set) ? Q.set.bind(n) : Mt, Je = F({
        get: be,
        set: Ie
      });
      Object.defineProperty(i, J, {
        enumerable: !0,
        configurable: !0,
        get: () => Je.value,
        set: (Ae) => Je.value = Ae
      });
    }
  if (a)
    for (const J in a)
      jl(a[J], i, n, J);
  if (l) {
    const J = se(l) ? l.call(n) : l;
    Reflect.ownKeys(J).forEach((Q) => {
      Oi(Q, J[Q]);
    });
  }
  u && Io(u, t, "c");
  function ne(J, Q) {
    te(Q) ? Q.forEach((be) => J(be.bind(n))) : Q && J(Q.bind(n));
  }
  if (ne(vd, d), ne(De, f), ne(gd, p), ne(yd, h), ne(pd, v), ne(hd, g), ne(xd, R), ne(wd, T), ne(_d, S), ne(An, _), ne(fn, y), ne(bd, k), te(A))
    if (A.length) {
      const J = t.exposed || (t.exposed = {});
      A.forEach((Q) => {
        Object.defineProperty(J, Q, {
          get: () => n[Q],
          set: (be) => n[Q] = be,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  E && t.render === Mt && (t.render = E), I != null && (t.inheritAttrs = I), P && (t.components = P), H && (t.directives = H), k && ql(t);
}
function Md(t, e, n = Mt) {
  te(t) && (t = Cs(t));
  for (const i in t) {
    const r = t[i];
    let s;
    ye(r) ? "default" in r ? s = an(
      r.from || i,
      r.default,
      !0
    ) : s = an(r.from || i) : s = an(r), /* @__PURE__ */ Le(s) ? Object.defineProperty(e, i, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[i] = s;
  }
}
function Io(t, e, n) {
  yt(
    te(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function jl(t, e, n, i) {
  let r = i.includes(".") ? Ol(n, i) : () => n[i];
  if (Te(t)) {
    const s = e[t];
    se(s) && we(r, s);
  } else if (se(t))
    we(r, t.bind(n));
  else if (ye(t))
    if (te(t))
      t.forEach((s) => jl(s, e, n, i));
    else {
      const s = se(t.handler) ? t.handler.bind(n) : e[t.handler];
      se(s) && we(r, s, t);
    }
}
function Ul(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !r.length && !n && !i ? l = e : (l = {}, r.length && r.forEach(
    (c) => or(l, c, o, !0)
  ), or(l, e, o)), ye(e) && s.set(e, l), l;
}
function or(t, e, n, i = !1) {
  const { mixins: r, extends: s } = e;
  s && or(t, s, n, !0), r && r.forEach(
    (o) => or(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = Rd[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Rd = {
  data: Lo,
  props: Do,
  emits: Do,
  // objects
  methods: ni,
  computed: ni,
  // lifecycle
  beforeCreate: We,
  created: We,
  beforeMount: We,
  mounted: We,
  beforeUpdate: We,
  updated: We,
  beforeDestroy: We,
  beforeUnmount: We,
  destroyed: We,
  unmounted: We,
  activated: We,
  deactivated: We,
  errorCaptured: We,
  serverPrefetch: We,
  // assets
  components: ni,
  directives: ni,
  // watch
  watch: Ld,
  // provide / inject
  provide: Lo,
  inject: Id
};
function Lo(t, e) {
  return e ? t ? function() {
    return ke(
      se(t) ? t.call(this, this) : t,
      se(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Id(t, e) {
  return ni(Cs(t), Cs(e));
}
function Cs(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function We(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function ni(t, e) {
  return t ? ke(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Do(t, e) {
  return t ? te(t) && te(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : ke(
    /* @__PURE__ */ Object.create(null),
    xs(t),
    xs(e ?? {})
  ) : e;
}
function Ld(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = ke(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = We(t[i], e[i]);
  return n;
}
function Kl() {
  return {
    app: null,
    config: {
      isNativeTag: ja,
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
let Dd = 0;
function $d(t, e) {
  return function(i, r = null) {
    se(i) || (i = ke({}, i)), r != null && !ye(r) && (r = null);
    const s = Kl(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = s.app = {
      _uid: Dd++,
      _component: i,
      _props: r,
      _container: null,
      _context: s,
      _instance: null,
      version: mf,
      get config() {
        return s.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return o.has(u) || (u && se(u.install) ? (o.add(u), u.install(c, ...d)) : se(u) && (o.add(u), u(c, ...d))), c;
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
      mount(u, d, f) {
        if (!l) {
          const p = c._ceVNode || V(i, r);
          return p.appContext = s, f === !0 ? f = "svg" : f === !1 && (f = void 0), t(p, u, f), l = !0, c._container = u, u.__vue_app__ = c, Ir(p.component);
        }
      },
      onUnmount(u) {
        a.push(u);
      },
      unmount() {
        l && (yt(
          a,
          c._instance,
          16
        ), t(null, c._container), delete c._container.__vue_app__);
      },
      provide(u, d) {
        return s.provides[u] = d, c;
      },
      runWithContext(u) {
        const d = Hn;
        Hn = c;
        try {
          return u();
        } finally {
          Hn = d;
        }
      }
    };
    return c;
  };
}
let Hn = null;
function Bd(t, e, n = me) {
  const i = ot(), r = $e(e), s = tt(e), o = Xl(t, r), a = wl((l, c) => {
    let u, d = me, f;
    return Pl(() => {
      const p = t[r];
      je(u, p) && (u = p, c());
    }), {
      get() {
        return l(), n.get ? n.get(u) : u;
      },
      set(p) {
        const h = n.set ? n.set(p) : p;
        if (!je(h, u) && !(d !== me && je(p, d)))
          return;
        const v = i.vnode.props;
        v && // check if parent has passed v-model
        (e in v || r in v || s in v) && (`onUpdate:${e}` in v || `onUpdate:${r}` in v || `onUpdate:${s}` in v) || (u = p, c()), i.emit(`update:${e}`, h), je(p, h) && je(p, d) && !je(h, f) && c(), d = p, f = h;
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
const Xl = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${$e(e)}Modifiers`] || t[`${tt(e)}Modifiers`];
function Fd(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || me;
  let r = n;
  const s = e.startsWith("update:"), o = s && Xl(i, e.slice(7));
  o && (o.trim && (r = n.map((u) => Te(u) ? u.trim() : u)), o.number && (r = n.map(_c)));
  let a, l = i[a = Wi(e)] || // also try camelCase event handler (#2249)
  i[a = Wi($e(e))];
  !l && s && (l = i[a = Wi(tt(e))]), l && yt(
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
    t.emitted[a] = !0, yt(
      c,
      t,
      6,
      r
    );
  }
}
const Nd = /* @__PURE__ */ new WeakMap();
function Gl(t, e, n = !1) {
  const i = n ? Nd : e.emitsCache, r = i.get(t);
  if (r !== void 0)
    return r;
  const s = t.emits;
  let o = {}, a = !1;
  if (!se(t)) {
    const l = (c) => {
      const u = Gl(c, e, !0);
      u && (a = !0, ke(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (ye(t) && i.set(t, null), null) : (te(s) ? s.forEach((l) => o[l] = null) : ke(o, s), ye(t) && i.set(t, o), o);
}
function Or(t, e) {
  return !t || !mr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ve(t, e[0].toLowerCase() + e.slice(1)) || ve(t, tt(e)) || ve(t, e));
}
function $o(t) {
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
    data: f,
    setupState: p,
    ctx: h,
    inheritAttrs: v
  } = t, g = rr(t);
  let C, _;
  try {
    if (n.shapeFlag & 4) {
      const y = r || i, E = y;
      C = At(
        c.call(
          E,
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
      C = At(
        y.length > 1 ? y(
          d,
          { attrs: a, slots: o, emit: l }
        ) : y(
          d,
          null
        )
      ), _ = e.props ? a : zd(a);
    }
  } catch (y) {
    ci.length = 0, kr(y, t, 1), C = V(Be);
  }
  let x = C;
  if (_ && v !== !1) {
    const y = Object.keys(_), { shapeFlag: E } = x;
    y.length && E & 7 && (s && y.some(zs) && (_ = qd(
      _,
      s
    )), x = Yt(x, _, !1, !0));
  }
  return n.dirs && (x = Yt(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(n.dirs) : n.dirs), n.transition && mi(x, n.transition), C = x, rr(g), C;
}
const zd = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || mr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, qd = (t, e) => {
  const n = {};
  for (const i in t)
    (!zs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function Hd(t, e, n) {
  const { props: i, children: r, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Bo(i, o, c) : !!o;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        if (Yl(o, i, f) && !Or(c, f))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Bo(i, o, c) : !0 : !!o;
  return !1;
}
function Bo(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    if (Yl(e, t, s) && !Or(n, s))
      return !0;
  }
  return !1;
}
function Yl(t, e, n) {
  const i = t[n], r = e[n];
  return n === "style" && ye(i) && ye(r) ? !Vs(i, r) : i !== r;
}
function Vd({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Jl = {}, Zl = () => Object.create(Jl), Ql = (t) => Object.getPrototypeOf(t) === Jl;
function Wd(t, e, n, i = !1) {
  const r = {}, s = Zl();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), eu(t, e, r, s);
  for (const o in t.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? t.props = i ? r : /* @__PURE__ */ Cr(r) : t.type.props ? t.props = r : t.props = s, t.attrs = s;
}
function jd(t, e, n, i) {
  const {
    props: r,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ he(r), [l] = t.propsOptions;
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
        let f = u[d];
        if (Or(t.emitsOptions, f))
          continue;
        const p = e[f];
        if (l)
          if (ve(s, f))
            p !== s[f] && (s[f] = p, c = !0);
          else {
            const h = $e(f);
            r[h] = Es(
              l,
              a,
              h,
              p,
              t,
              !1
            );
          }
        else
          p !== s[f] && (s[f] = p, c = !0);
      }
    }
  } else {
    eu(t, e, r, s) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ve(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = tt(d)) === d || !ve(e, u))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[u] !== void 0) && (r[d] = Es(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete r[d]);
    if (s !== a)
      for (const d in s)
        (!e || !ve(e, d)) && (delete s[d], c = !0);
  }
  c && jt(t.attrs, "set", "");
}
function eu(t, e, n, i) {
  const [r, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (ri(l))
        continue;
      const c = e[l];
      let u;
      r && ve(r, u = $e(l)) ? !s || !s.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Or(t.emitsOptions, l) || (!(l in i) || c !== i[l]) && (i[l] = c, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ he(n), c = a || me;
    for (let u = 0; u < s.length; u++) {
      const d = s[u];
      n[d] = Es(
        r,
        l,
        d,
        c[d],
        t,
        !ve(c, d)
      );
    }
  }
  return o;
}
function Es(t, e, n, i, r, s) {
  const o = t[n];
  if (o != null) {
    const a = ve(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && se(l)) {
        const { propsDefaults: c } = r;
        if (n in c)
          i = c[n];
        else {
          const u = Ri(r);
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
    ] && (i === "" || i === tt(n)) && (i = !0));
  }
  return i;
}
const Ud = /* @__PURE__ */ new WeakMap();
function tu(t, e, n = !1) {
  const i = n ? Ud : e.propsCache, r = i.get(t);
  if (r)
    return r;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!se(t)) {
    const u = (d) => {
      l = !0;
      const [f, p] = tu(d, e, !0);
      ke(o, f), p && a.push(...p);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!s && !l)
    return ye(t) && i.set(t, Fn), Fn;
  if (te(s))
    for (let u = 0; u < s.length; u++) {
      const d = $e(s[u]);
      Fo(d) && (o[d] = me);
    }
  else if (s)
    for (const u in s) {
      const d = $e(u);
      if (Fo(d)) {
        const f = s[u], p = o[d] = te(f) || se(f) ? { type: f } : ke({}, f), h = p.type;
        let v = !1, g = !0;
        if (te(h))
          for (let C = 0; C < h.length; ++C) {
            const _ = h[C], x = se(_) && _.name;
            if (x === "Boolean") {
              v = !0;
              break;
            } else x === "String" && (g = !1);
          }
        else
          v = se(h) && h.name === "Boolean";
        p[
          0
          /* shouldCast */
        ] = v, p[
          1
          /* shouldCastTrue */
        ] = g, (v || ve(p, "default")) && a.push(d);
      }
    }
  const c = [o, a];
  return ye(t) && i.set(t, c), c;
}
function Fo(t) {
  return t[0] !== "$" && !ri(t);
}
const Gs = (t) => t === "_" || t === "_ctx" || t === "$stable", Ys = (t) => te(t) ? t.map(At) : [At(t)], Kd = (t, e, n) => {
  if (e._n)
    return e;
  const i = q((...r) => Ys(e(...r)), n);
  return i._c = !1, i;
}, nu = (t, e, n) => {
  const i = t._ctx;
  for (const r in t) {
    if (Gs(r)) continue;
    const s = t[r];
    if (se(s))
      e[r] = Kd(r, s, i);
    else if (s != null) {
      const o = Ys(s);
      e[r] = () => o;
    }
  }
}, iu = (t, e) => {
  const n = Ys(e);
  t.slots.default = () => n;
}, ru = (t, e, n) => {
  for (const i in e)
    (n || !Gs(i)) && (t[i] = e[i]);
}, Xd = (t, e, n) => {
  const i = t.slots = Zl();
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (ru(i, e, n), n && Ga(i, "_", r, !0)) : nu(e, i);
  } else e && iu(t, e);
}, Gd = (t, e, n) => {
  const { vnode: i, slots: r } = t;
  let s = !0, o = me;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : ru(r, e, n) : (s = !e.$stable, nu(e, r)), o = e;
  } else e && (iu(t, e), o = { default: 1 });
  if (s)
    for (const a in r)
      !Gs(a) && o[a] == null && delete r[a];
}, Ne = ef;
function Yd(t) {
  return Jd(t);
}
function Jd(t, e) {
  const n = _r();
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
    nextSibling: f,
    setScopeId: p = Mt,
    insertStaticContent: h
  } = t, v = (b, w, O, z = null, D = null, $ = null, K = void 0, j = null, W = !!w.dynamicChildren) => {
    if (b === w)
      return;
    b && !xn(b, w) && (z = X(b), Ae(b, D, $, !0), b = null), w.patchFlag === -2 && (W = !1, w.dynamicChildren = null);
    const { type: B, ref: ie, shapeFlag: Y } = w;
    switch (B) {
      case Mr:
        g(b, w, O, z);
        break;
      case Be:
        C(b, w, O, z);
        break;
      case Ki:
        b == null && _(w, O, z, K);
        break;
      case Ee:
        P(
          b,
          w,
          O,
          z,
          D,
          $,
          K,
          j,
          W
        );
        break;
      default:
        Y & 1 ? E(
          b,
          w,
          O,
          z,
          D,
          $,
          K,
          j,
          W
        ) : Y & 6 ? H(
          b,
          w,
          O,
          z,
          D,
          $,
          K,
          j,
          W
        ) : (Y & 64 || Y & 128) && B.process(
          b,
          w,
          O,
          z,
          D,
          $,
          K,
          j,
          W,
          pe
        );
    }
    ie != null && D ? li(ie, b && b.ref, $, w || b, !w) : ie == null && b && b.ref != null && li(b.ref, null, $, b, !0);
  }, g = (b, w, O, z) => {
    if (b == null)
      i(
        w.el = a(w.children),
        O,
        z
      );
    else {
      const D = w.el = b.el;
      w.children !== b.children && c(D, w.children);
    }
  }, C = (b, w, O, z) => {
    b == null ? i(
      w.el = l(w.children || ""),
      O,
      z
    ) : w.el = b.el;
  }, _ = (b, w, O, z) => {
    [b.el, b.anchor] = h(
      b.children,
      w,
      O,
      z,
      b.el,
      b.anchor
    );
  }, x = ({ el: b, anchor: w }, O, z) => {
    let D;
    for (; b && b !== w; )
      D = f(b), i(b, O, z), b = D;
    i(w, O, z);
  }, y = ({ el: b, anchor: w }) => {
    let O;
    for (; b && b !== w; )
      O = f(b), r(b), b = O;
    r(w);
  }, E = (b, w, O, z, D, $, K, j, W) => {
    if (w.type === "svg" ? K = "svg" : w.type === "math" && (K = "mathml"), b == null)
      T(
        w,
        O,
        z,
        D,
        $,
        K,
        j,
        W
      );
    else {
      const B = b.el && b.el._isVueCE ? b.el : null;
      try {
        B && B._beginPatch(), k(
          b,
          w,
          D,
          $,
          K,
          j,
          W
        );
      } finally {
        B && B._endPatch();
      }
    }
  }, T = (b, w, O, z, D, $, K, j) => {
    let W, B;
    const { props: ie, shapeFlag: Y, transition: ee, dirs: ae } = b;
    if (W = b.el = o(
      b.type,
      $,
      ie && ie.is,
      ie
    ), Y & 8 ? u(W, b.children) : Y & 16 && R(
      b.children,
      W,
      null,
      z,
      D,
      Yr(b, $),
      K,
      j
    ), ae && vn(b, null, z, "created"), S(W, b, b.scopeId, K, z), ie) {
      for (const xe in ie)
        xe !== "value" && !ri(xe) && s(W, xe, null, ie[xe], $, z);
      "value" in ie && s(W, "value", null, ie.value, $), (B = ie.onVnodeBeforeMount) && Et(B, z, b);
    }
    ae && vn(b, null, z, "beforeMount");
    const fe = Zd(D, ee);
    fe && ee.beforeEnter(W), i(W, w, O), ((B = ie && ie.onVnodeMounted) || fe || ae) && Ne(() => {
      B && Et(B, z, b), fe && ee.enter(W), ae && vn(b, null, z, "mounted");
    }, D);
  }, S = (b, w, O, z, D) => {
    if (O && p(b, O), z)
      for (let $ = 0; $ < z.length; $++)
        p(b, z[$]);
    if (D) {
      let $ = D.subTree;
      if (w === $ || au($.type) && ($.ssContent === w || $.ssFallback === w)) {
        const K = D.vnode;
        S(
          b,
          K,
          K.scopeId,
          K.slotScopeIds,
          D.parent
        );
      }
    }
  }, R = (b, w, O, z, D, $, K, j, W = 0) => {
    for (let B = W; B < b.length; B++) {
      const ie = b[B] = j ? Wt(b[B]) : At(b[B]);
      v(
        null,
        ie,
        w,
        O,
        z,
        D,
        $,
        K,
        j
      );
    }
  }, k = (b, w, O, z, D, $, K) => {
    const j = w.el = b.el;
    let { patchFlag: W, dynamicChildren: B, dirs: ie } = w;
    W |= b.patchFlag & 16;
    const Y = b.props || me, ee = w.props || me;
    let ae;
    if (O && gn(O, !1), (ae = ee.onVnodeBeforeUpdate) && Et(ae, O, w, b), ie && vn(w, b, O, "beforeUpdate"), O && gn(O, !0), (Y.innerHTML && ee.innerHTML == null || Y.textContent && ee.textContent == null) && u(j, ""), B ? A(
      b.dynamicChildren,
      B,
      j,
      O,
      z,
      Yr(w, D),
      $
    ) : K || Q(
      b,
      w,
      j,
      null,
      O,
      z,
      Yr(w, D),
      $,
      !1
    ), W > 0) {
      if (W & 16)
        I(j, Y, ee, O, D);
      else if (W & 2 && Y.class !== ee.class && s(j, "class", null, ee.class, D), W & 4 && s(j, "style", Y.style, ee.style, D), W & 8) {
        const fe = w.dynamicProps;
        for (let xe = 0; xe < fe.length; xe++) {
          const _e = fe[xe], Ze = Y[_e], Qe = ee[_e];
          (Qe !== Ze || _e === "value") && s(j, _e, Ze, Qe, D, O);
        }
      }
      W & 1 && b.children !== w.children && u(j, w.children);
    } else !K && B == null && I(j, Y, ee, O, D);
    ((ae = ee.onVnodeUpdated) || ie) && Ne(() => {
      ae && Et(ae, O, w, b), ie && vn(w, b, O, "updated");
    }, z);
  }, A = (b, w, O, z, D, $, K) => {
    for (let j = 0; j < w.length; j++) {
      const W = b[j], B = w[j], ie = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        W.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (W.type === Ee || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !xn(W, B) || // - In the case of a component, it could contain anything.
        W.shapeFlag & 198) ? d(W.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          O
        )
      );
      v(
        W,
        B,
        ie,
        null,
        z,
        D,
        $,
        K,
        !0
      );
    }
  }, I = (b, w, O, z, D) => {
    if (w !== O) {
      if (w !== me)
        for (const $ in w)
          !ri($) && !($ in O) && s(
            b,
            $,
            w[$],
            null,
            D,
            z
          );
      for (const $ in O) {
        if (ri($)) continue;
        const K = O[$], j = w[$];
        K !== j && $ !== "value" && s(b, $, j, K, D, z);
      }
      "value" in O && s(b, "value", w.value, O.value, D);
    }
  }, P = (b, w, O, z, D, $, K, j, W) => {
    const B = w.el = b ? b.el : a(""), ie = w.anchor = b ? b.anchor : a("");
    let { patchFlag: Y, dynamicChildren: ee, slotScopeIds: ae } = w;
    ae && (j = j ? j.concat(ae) : ae), b == null ? (i(B, O, z), i(ie, O, z), R(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      w.children || [],
      O,
      ie,
      D,
      $,
      K,
      j,
      W
    )) : Y > 0 && Y & 64 && ee && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    b.dynamicChildren && b.dynamicChildren.length === ee.length ? (A(
      b.dynamicChildren,
      ee,
      O,
      D,
      $,
      K,
      j
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (w.key != null || D && w === D.subTree) && Js(
      b,
      w,
      !0
      /* shallow */
    )) : Q(
      b,
      w,
      O,
      ie,
      D,
      $,
      K,
      j,
      W
    );
  }, H = (b, w, O, z, D, $, K, j, W) => {
    w.slotScopeIds = j, b == null ? w.shapeFlag & 512 ? D.ctx.activate(
      w,
      O,
      z,
      K,
      W
    ) : L(
      w,
      O,
      z,
      D,
      $,
      K,
      W
    ) : U(b, w, W);
  }, L = (b, w, O, z, D, $, K) => {
    const j = b.component = af(
      b,
      z,
      D
    );
    if (Ar(b) && (j.ctx.renderer = pe), lf(j, !1, K), j.asyncDep) {
      if (D && D.registerDep(j, ne, K), !b.el) {
        const W = j.subTree = V(Be);
        C(null, W, w, O), b.placeholder = W.el;
      }
    } else
      ne(
        j,
        b,
        w,
        O,
        D,
        $,
        K
      );
  }, U = (b, w, O) => {
    const z = w.component = b.component;
    if (Hd(b, w, O))
      if (z.asyncDep && !z.asyncResolved) {
        J(z, w, O);
        return;
      } else
        z.next = w, z.update();
    else
      w.el = b.el, z.vnode = w;
  }, ne = (b, w, O, z, D, $, K) => {
    const j = () => {
      if (b.isMounted) {
        let { next: Y, bu: ee, u: ae, parent: fe, vnode: xe } = b;
        {
          const St = su(b);
          if (St) {
            Y && (Y.el = xe.el, J(b, Y, K)), St.asyncDep.then(() => {
              Ne(() => {
                b.isUnmounted || B();
              }, D);
            });
            return;
          }
        }
        let _e = Y, Ze;
        gn(b, !1), Y ? (Y.el = xe.el, J(b, Y, K)) : Y = xe, ee && Vr(ee), (Ze = Y.props && Y.props.onVnodeBeforeUpdate) && Et(Ze, fe, Y, xe), gn(b, !0);
        const Qe = $o(b), xt = b.subTree;
        b.subTree = Qe, v(
          xt,
          Qe,
          // parent may have changed if it's in a teleport
          d(xt.el),
          // anchor may have changed if it's in a fragment
          X(xt),
          b,
          D,
          $
        ), Y.el = Qe.el, _e === null && Vd(b, Qe.el), ae && Ne(ae, D), (Ze = Y.props && Y.props.onVnodeUpdated) && Ne(
          () => Et(Ze, fe, Y, xe),
          D
        );
      } else {
        let Y;
        const { el: ee, props: ae } = w, { bm: fe, m: xe, parent: _e, root: Ze, type: Qe } = b, xt = qn(w);
        gn(b, !1), fe && Vr(fe), !xt && (Y = ae && ae.onVnodeBeforeMount) && Et(Y, _e, w), gn(b, !0);
        {
          Ze.ce && Ze.ce._hasShadowRoot() && Ze.ce._injectChildStyle(Qe);
          const St = b.subTree = $o(b);
          v(
            null,
            St,
            O,
            z,
            b,
            D,
            $
          ), w.el = St.el;
        }
        if (xe && Ne(xe, D), !xt && (Y = ae && ae.onVnodeMounted)) {
          const St = w;
          Ne(
            () => Et(Y, _e, St),
            D
          );
        }
        (w.shapeFlag & 256 || _e && qn(_e.vnode) && _e.vnode.shapeFlag & 256) && b.a && Ne(b.a, D), b.isMounted = !0, w = O = z = null;
      }
    };
    b.scope.on();
    const W = b.effect = new nl(j);
    b.scope.off();
    const B = b.update = W.run.bind(W), ie = b.job = W.runIfDirty.bind(W);
    ie.i = b, ie.id = b.uid, W.scheduler = () => Xs(ie), gn(b, !0), B();
  }, J = (b, w, O) => {
    w.component = b;
    const z = b.vnode.props;
    b.vnode = w, b.next = null, jd(b, w.props, z, O), Gd(b, w.children, O), Kt(), Eo(b), Xt();
  }, Q = (b, w, O, z, D, $, K, j, W = !1) => {
    const B = b && b.children, ie = b ? b.shapeFlag : 0, Y = w.children, { patchFlag: ee, shapeFlag: ae } = w;
    if (ee > 0) {
      if (ee & 128) {
        Ie(
          B,
          Y,
          O,
          z,
          D,
          $,
          K,
          j,
          W
        );
        return;
      } else if (ee & 256) {
        be(
          B,
          Y,
          O,
          z,
          D,
          $,
          K,
          j,
          W
        );
        return;
      }
    }
    ae & 8 ? (ie & 16 && zt(B, D, $), Y !== B && u(O, Y)) : ie & 16 ? ae & 16 ? Ie(
      B,
      Y,
      O,
      z,
      D,
      $,
      K,
      j,
      W
    ) : zt(B, D, $, !0) : (ie & 8 && u(O, ""), ae & 16 && R(
      Y,
      O,
      z,
      D,
      $,
      K,
      j,
      W
    ));
  }, be = (b, w, O, z, D, $, K, j, W) => {
    b = b || Fn, w = w || Fn;
    const B = b.length, ie = w.length, Y = Math.min(B, ie);
    let ee;
    for (ee = 0; ee < Y; ee++) {
      const ae = w[ee] = W ? Wt(w[ee]) : At(w[ee]);
      v(
        b[ee],
        ae,
        O,
        null,
        D,
        $,
        K,
        j,
        W
      );
    }
    B > ie ? zt(
      b,
      D,
      $,
      !0,
      !1,
      Y
    ) : R(
      w,
      O,
      z,
      D,
      $,
      K,
      j,
      W,
      Y
    );
  }, Ie = (b, w, O, z, D, $, K, j, W) => {
    let B = 0;
    const ie = w.length;
    let Y = b.length - 1, ee = ie - 1;
    for (; B <= Y && B <= ee; ) {
      const ae = b[B], fe = w[B] = W ? Wt(w[B]) : At(w[B]);
      if (xn(ae, fe))
        v(
          ae,
          fe,
          O,
          null,
          D,
          $,
          K,
          j,
          W
        );
      else
        break;
      B++;
    }
    for (; B <= Y && B <= ee; ) {
      const ae = b[Y], fe = w[ee] = W ? Wt(w[ee]) : At(w[ee]);
      if (xn(ae, fe))
        v(
          ae,
          fe,
          O,
          null,
          D,
          $,
          K,
          j,
          W
        );
      else
        break;
      Y--, ee--;
    }
    if (B > Y) {
      if (B <= ee) {
        const ae = ee + 1, fe = ae < ie ? w[ae].el : z;
        for (; B <= ee; )
          v(
            null,
            w[B] = W ? Wt(w[B]) : At(w[B]),
            O,
            fe,
            D,
            $,
            K,
            j,
            W
          ), B++;
      }
    } else if (B > ee)
      for (; B <= Y; )
        Ae(b[B], D, $, !0), B++;
    else {
      const ae = B, fe = B, xe = /* @__PURE__ */ new Map();
      for (B = fe; B <= ee; B++) {
        const nt = w[B] = W ? Wt(w[B]) : At(w[B]);
        nt.key != null && xe.set(nt.key, B);
      }
      let _e, Ze = 0;
      const Qe = ee - fe + 1;
      let xt = !1, St = 0;
      const Yn = new Array(Qe);
      for (B = 0; B < Qe; B++) Yn[B] = 0;
      for (B = ae; B <= Y; B++) {
        const nt = b[B];
        if (Ze >= Qe) {
          Ae(nt, D, $, !0);
          continue;
        }
        let Ct;
        if (nt.key != null)
          Ct = xe.get(nt.key);
        else
          for (_e = fe; _e <= ee; _e++)
            if (Yn[_e - fe] === 0 && xn(nt, w[_e])) {
              Ct = _e;
              break;
            }
        Ct === void 0 ? Ae(nt, D, $, !0) : (Yn[Ct - fe] = B + 1, Ct >= St ? St = Ct : xt = !0, v(
          nt,
          w[Ct],
          O,
          null,
          D,
          $,
          K,
          j,
          W
        ), Ze++);
      }
      const go = xt ? Qd(Yn) : Fn;
      for (_e = go.length - 1, B = Qe - 1; B >= 0; B--) {
        const nt = fe + B, Ct = w[nt], yo = w[nt + 1], bo = nt + 1 < ie ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          yo.el || ou(yo)
        ) : z;
        Yn[B] === 0 ? v(
          null,
          Ct,
          O,
          bo,
          D,
          $,
          K,
          j,
          W
        ) : xt && (_e < 0 || B !== go[_e] ? Je(Ct, O, bo, 2) : _e--);
      }
    }
  }, Je = (b, w, O, z, D = null) => {
    const { el: $, type: K, transition: j, children: W, shapeFlag: B } = b;
    if (B & 6) {
      Je(b.component.subTree, w, O, z);
      return;
    }
    if (B & 128) {
      b.suspense.move(w, O, z);
      return;
    }
    if (B & 64) {
      K.move(b, w, O, pe);
      return;
    }
    if (K === Ee) {
      i($, w, O);
      for (let Y = 0; Y < W.length; Y++)
        Je(W[Y], w, O, z);
      i(b.anchor, w, O);
      return;
    }
    if (K === Ki) {
      x(b, w, O);
      return;
    }
    if (z !== 2 && B & 1 && j)
      if (z === 0)
        j.beforeEnter($), i($, w, O), Ne(() => j.enter($), D);
      else {
        const { leave: Y, delayLeave: ee, afterLeave: ae } = j, fe = () => {
          b.ctx.isUnmounted ? r($) : i($, w, O);
        }, xe = () => {
          $._isLeaving && $[kt](
            !0
            /* cancelled */
          ), Y($, () => {
            fe(), ae && ae();
          });
        };
        ee ? ee($, fe, xe) : xe();
      }
    else
      i($, w, O);
  }, Ae = (b, w, O, z = !1, D = !1) => {
    const {
      type: $,
      props: K,
      ref: j,
      children: W,
      dynamicChildren: B,
      shapeFlag: ie,
      patchFlag: Y,
      dirs: ee,
      cacheIndex: ae
    } = b;
    if (Y === -2 && (D = !1), j != null && (Kt(), li(j, null, O, b, !0), Xt()), ae != null && (w.renderCache[ae] = void 0), ie & 256) {
      w.ctx.deactivate(b);
      return;
    }
    const fe = ie & 1 && ee, xe = !qn(b);
    let _e;
    if (xe && (_e = K && K.onVnodeBeforeUnmount) && Et(_e, w, b), ie & 6)
      Gn(b.component, O, z);
    else {
      if (ie & 128) {
        b.suspense.unmount(O, z);
        return;
      }
      fe && vn(b, null, w, "beforeUnmount"), ie & 64 ? b.type.remove(
        b,
        w,
        O,
        pe,
        z
      ) : B && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !B.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      ($ !== Ee || Y > 0 && Y & 64) ? zt(
        B,
        w,
        O,
        !1,
        !0
      ) : ($ === Ee && Y & 384 || !D && ie & 16) && zt(W, w, O), z && Ft(b);
    }
    (xe && (_e = K && K.onVnodeUnmounted) || fe) && Ne(() => {
      _e && Et(_e, w, b), fe && vn(b, null, w, "unmounted");
    }, O);
  }, Ft = (b) => {
    const { type: w, el: O, anchor: z, transition: D } = b;
    if (w === Ee) {
      Nt(O, z);
      return;
    }
    if (w === Ki) {
      y(b);
      return;
    }
    const $ = () => {
      r(O), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if (b.shapeFlag & 1 && D && !D.persisted) {
      const { leave: K, delayLeave: j } = D, W = () => K(O, $);
      j ? j(b.el, $, W) : W();
    } else
      $();
  }, Nt = (b, w) => {
    let O;
    for (; b !== w; )
      O = f(b), r(b), b = O;
    r(w);
  }, Gn = (b, w, O) => {
    const { bum: z, scope: D, job: $, subTree: K, um: j, m: W, a: B } = b;
    No(W), No(B), z && Vr(z), D.stop(), $ && ($.flags |= 8, Ae(K, b, w, O)), j && Ne(j, w), Ne(() => {
      b.isUnmounted = !0;
    }, w);
  }, zt = (b, w, O, z = !1, D = !1, $ = 0) => {
    for (let K = $; K < b.length; K++)
      Ae(b[K], w, O, z, D);
  }, X = (b) => {
    if (b.shapeFlag & 6)
      return X(b.component.subTree);
    if (b.shapeFlag & 128)
      return b.suspense.next();
    const w = f(b.anchor || b.el), O = w && w[Ml];
    return O ? f(O) : w;
  };
  let re = !1;
  const ue = (b, w, O) => {
    let z;
    b == null ? w._vnode && (Ae(w._vnode, null, null, !0), z = w._vnode.component) : v(
      w._vnode || null,
      b,
      w,
      null,
      null,
      null,
      O
    ), w._vnode = b, re || (re = !0, Eo(z), El(), re = !1);
  }, pe = {
    p: v,
    um: Ae,
    m: Je,
    r: Ft,
    mt: L,
    mc: R,
    pc: Q,
    pbc: A,
    n: X,
    o: t
  };
  return {
    render: ue,
    hydrate: void 0,
    createApp: $d(ue)
  };
}
function Yr({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function gn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function Zd(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function Js(t, e, n = !1) {
  const i = t.children, r = e.children;
  if (te(i) && te(r))
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let a = r[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[s] = Wt(r[s]), a.el = o.el), !n && a.patchFlag !== -2 && Js(o, a)), a.type === Mr && (a.patchFlag === -1 && (a = r[s] = Wt(a)), a.el = o.el), a.type === Be && !a.el && (a.el = o.el);
    }
}
function Qd(t) {
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
function su(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : su(e);
}
function No(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function ou(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? ou(e.subTree) : null;
}
const au = (t) => t.__isSuspense;
function ef(t, e) {
  e && e.pendingBranch ? te(t) ? e.effects.push(...t) : e.effects.push(t) : rd(t);
}
const Ee = /* @__PURE__ */ Symbol.for("v-fgt"), Mr = /* @__PURE__ */ Symbol.for("v-txt"), Be = /* @__PURE__ */ Symbol.for("v-cmt"), Ki = /* @__PURE__ */ Symbol.for("v-stc"), ci = [];
let Xe = null;
function M(t = !1) {
  ci.push(Xe = t ? null : []);
}
function tf() {
  ci.pop(), Xe = ci[ci.length - 1] || null;
}
let jn = 1;
function ar(t, e = !1) {
  jn += t, t < 0 && Xe && e && (Xe.hasOnce = !0);
}
function lu(t) {
  return t.dynamicChildren = jn > 0 ? Xe || Fn : null, tf(), jn > 0 && Xe && Xe.push(t), t;
}
function le(t, e, n, i, r, s) {
  return lu(
    oe(
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
function G(t, e, n, i, r) {
  return lu(
    V(
      t,
      e,
      n,
      i,
      r,
      !0
    )
  );
}
function gi(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function xn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const uu = ({ key: t }) => t ?? null, Xi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Te(t) || /* @__PURE__ */ Le(t) || se(t) ? { i: Fe, r: t, k: e, f: !!n } : t : null);
function oe(t, e = null, n = null, i = 0, r = null, s = t === Ee ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && uu(e),
    ref: e && Xi(e),
    scopeId: kl,
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
    ctx: Fe
  };
  return a ? (Zs(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= Te(n) ? 8 : 16), jn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Xe && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Xe.push(l), l;
}
const V = nf;
function nf(t, e = null, n = null, i = 0, r = null, s = !1) {
  if ((!t || t === Vl) && (t = Be), gi(t)) {
    const a = Yt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Zs(a, n), jn > 0 && !s && Xe && (a.shapeFlag & 6 ? Xe[Xe.indexOf(t)] = a : Xe.push(a)), a.patchFlag = -2, a;
  }
  if (ff(t) && (t = t.__vccOpts), e) {
    e = Rr(e);
    let { class: a, style: l } = e;
    a && !Te(a) && (e.class = un(a)), ye(l) && (/* @__PURE__ */ Tr(l) && !te(l) && (l = ke({}, l)), e.style = Dt(l));
  }
  const o = Te(t) ? 1 : au(t) ? 128 : Rl(t) ? 64 : ye(t) ? 4 : se(t) ? 2 : 0;
  return oe(
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
function Rr(t) {
  return t ? /* @__PURE__ */ Tr(t) || Ql(t) ? ke({}, t) : t : null;
}
function Yt(t, e, n = !1, i = !1) {
  const { props: r, ref: s, patchFlag: o, children: a, transition: l } = t, c = e ? Ce(r || {}, e) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && uu(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? te(s) ? s.concat(Xi(e)) : [s, Xi(e)] : Xi(e)
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
    ssContent: t.ssContent && Yt(t.ssContent),
    ssFallback: t.ssFallback && Yt(t.ssFallback),
    placeholder: t.placeholder,
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
  return l && i && mi(
    u,
    l.clone(u)
  ), u;
}
function Ye(t = " ", e = 0) {
  return V(Mr, null, t, e);
}
function rf(t, e) {
  const n = V(Ki, null, t);
  return n.staticCount = e, n;
}
function de(t = "", e = !1) {
  return e ? (M(), G(Be, null, t)) : V(Be, null, t);
}
function At(t) {
  return t == null || typeof t == "boolean" ? V(Be) : te(t) ? V(
    Ee,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : gi(t) ? Wt(t) : V(Mr, null, String(t));
}
function Wt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Yt(t);
}
function Zs(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (te(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const r = e.default;
      r && (r._c && (r._d = !1), Zs(t, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = e._;
      !r && !Ql(e) ? e._ctx = Fe : r === 3 && Fe && (Fe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else se(e) ? (e = { default: e, _ctx: Fe }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Ye(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function Ce(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const r in i)
      if (r === "class")
        e.class !== i.class && (e.class = un([e.class, i.class]));
      else if (r === "style")
        e.style = Dt([e.style, i.style]);
      else if (mr(r)) {
        const s = e[r], o = i[r];
        o && s !== o && !(te(s) && s.includes(o)) && (e[r] = s ? [].concat(s, o) : o);
      } else r !== "" && (e[r] = i[r]);
  }
  return e;
}
function Et(t, e, n, i = null) {
  yt(t, e, 7, [
    n,
    i
  ]);
}
const sf = Kl();
let of = 0;
function af(t, e, n) {
  const i = t.type, r = (e ? e.appContext : t.appContext) || sf, s = {
    uid: of++,
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
    scope: new Qa(
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
    propsOptions: tu(i, r),
    emitsOptions: Gl(i, r),
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Fd.bind(null, s), t.ce && t.ce(s), s;
}
let He = null;
const ot = () => He || Fe;
let lr, Ts;
{
  const t = _r(), e = (n, i) => {
    let r;
    return (r = t[n]) || (r = t[n] = []), r.push(i), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  lr = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => He = n
  ), Ts = e(
    "__VUE_SSR_SETTERS__",
    (n) => yi = n
  );
}
const Ri = (t) => {
  const e = He;
  return lr(t), t.scope.on(), () => {
    t.scope.off(), lr(e);
  };
}, zo = () => {
  He && He.scope.off(), lr(null);
};
function cu(t) {
  return t.vnode.shapeFlag & 4;
}
let yi = !1;
function lf(t, e = !1, n = !1) {
  e && Ts(e);
  const { props: i, children: r } = t.vnode, s = cu(t);
  Wd(t, i, s, e), Xd(t, r, n || e);
  const o = s ? uf(t, e) : void 0;
  return e && Ts(!1), o;
}
function uf(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Td);
  const { setup: i } = n;
  if (i) {
    Kt();
    const r = t.setupContext = i.length > 1 ? fu(t) : null, s = Ri(t), o = Pi(
      i,
      t,
      0,
      [
        t.props,
        r
      ]
    ), a = Ka(o);
    if (Xt(), s(), (a || t.sp) && !qn(t) && ql(t), a) {
      if (o.then(zo, zo), e)
        return o.then((l) => {
          qo(t, l);
        }).catch((l) => {
          kr(l, t, 0);
        });
      t.asyncDep = o;
    } else
      qo(t, o);
  } else
    du(t);
}
function qo(t, e, n) {
  se(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : ye(e) && (t.setupState = _l(e)), du(t);
}
function du(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || Mt);
  {
    const r = Ri(t);
    Kt();
    try {
      Od(t);
    } finally {
      Xt(), r();
    }
  }
}
const cf = {
  get(t, e) {
    return qe(t, "get", ""), t[e];
  }
};
function fu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, cf),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Ir(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(_l(yl(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in ui)
        return ui[n](t);
    },
    has(e, n) {
      return n in e || n in ui;
    }
  })) : t.proxy;
}
function df(t, e = !0) {
  return se(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function ff(t) {
  return se(t) && "__vccOpts" in t;
}
const F = (t, e) => /* @__PURE__ */ Qc(t, e, yi);
function mt(t, e, n) {
  try {
    ar(-1);
    const i = arguments.length;
    return i === 2 ? ye(e) && !te(e) ? gi(e) ? V(t, null, [e]) : V(t, e) : V(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && gi(n) && (n = [n]), V(t, e, n));
  } finally {
    ar(1);
  }
}
function pf(t, e, n, i) {
  const r = n[i];
  if (r && hf(r, t))
    return r;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = i, n[i] = s;
}
function hf(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (je(n[i], e[i]))
      return !1;
  return jn > 0 && Xe && Xe.push(t), !0;
}
const mf = "3.5.28";
let ks;
const Ho = typeof window < "u" && window.trustedTypes;
if (Ho)
  try {
    ks = /* @__PURE__ */ Ho.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const pu = ks ? (t) => ks.createHTML(t) : (t) => t, vf = "http://www.w3.org/2000/svg", gf = "http://www.w3.org/1998/Math/MathML", Vt = typeof document < "u" ? document : null, Vo = Vt && /* @__PURE__ */ Vt.createElement("template"), yf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const r = e === "svg" ? Vt.createElementNS(vf, t) : e === "mathml" ? Vt.createElementNS(gf, t) : n ? Vt.createElement(t, { is: n }) : Vt.createElement(t);
    return t === "select" && i && i.multiple != null && r.setAttribute("multiple", i.multiple), r;
  },
  createText: (t) => Vt.createTextNode(t),
  createComment: (t) => Vt.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => Vt.querySelector(t),
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
      Vo.innerHTML = pu(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Vo.content;
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
}, tn = "transition", Qn = "animation", bi = /* @__PURE__ */ Symbol("_vtc"), hu = {
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
}, bf = /* @__PURE__ */ ke(
  {},
  Dl,
  hu
), _f = (t) => (t.displayName = "Transition", t.props = bf, t), wf = /* @__PURE__ */ _f(
  (t, { slots: e }) => mt(fd, xf(t), e)
), yn = (t, e = []) => {
  te(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Wo = (t) => t ? te(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function xf(t) {
  const e = {};
  for (const P in t)
    P in hu || (e[P] = t[P]);
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
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: p = `${n}-leave-to`
  } = t, h = Sf(r), v = h && h[0], g = h && h[1], {
    onBeforeEnter: C,
    onEnter: _,
    onEnterCancelled: x,
    onLeave: y,
    onLeaveCancelled: E,
    onBeforeAppear: T = C,
    onAppear: S = _,
    onAppearCancelled: R = x
  } = e, k = (P, H, L, U) => {
    P._enterCancelled = U, bn(P, H ? u : a), bn(P, H ? c : o), L && L();
  }, A = (P, H) => {
    P._isLeaving = !1, bn(P, d), bn(P, p), bn(P, f), H && H();
  }, I = (P) => (H, L) => {
    const U = P ? S : _, ne = () => k(H, P, L);
    yn(U, [H, ne]), jo(() => {
      bn(H, P ? l : s), Ht(H, P ? u : a), Wo(U) || Uo(H, i, v, ne);
    });
  };
  return ke(e, {
    onBeforeEnter(P) {
      yn(C, [P]), Ht(P, s), Ht(P, o);
    },
    onBeforeAppear(P) {
      yn(T, [P]), Ht(P, l), Ht(P, c);
    },
    onEnter: I(!1),
    onAppear: I(!0),
    onLeave(P, H) {
      P._isLeaving = !0;
      const L = () => A(P, H);
      Ht(P, d), P._enterCancelled ? (Ht(P, f), Go(P)) : (Go(P), Ht(P, f)), jo(() => {
        P._isLeaving && (bn(P, d), Ht(P, p), Wo(y) || Uo(P, i, g, L));
      }), yn(y, [P, L]);
    },
    onEnterCancelled(P) {
      k(P, !1, void 0, !0), yn(x, [P]);
    },
    onAppearCancelled(P) {
      k(P, !0, void 0, !0), yn(R, [P]);
    },
    onLeaveCancelled(P) {
      A(P), yn(E, [P]);
    }
  });
}
function Sf(t) {
  if (t == null)
    return null;
  if (ye(t))
    return [Jr(t.enter), Jr(t.leave)];
  {
    const e = Jr(t);
    return [e, e];
  }
}
function Jr(t) {
  return hs(t);
}
function Ht(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[bi] || (t[bi] = /* @__PURE__ */ new Set())).add(e);
}
function bn(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[bi];
  n && (n.delete(e), n.size || (t[bi] = void 0));
}
function jo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Cf = 0;
function Uo(t, e, n, i) {
  const r = t._endId = ++Cf, s = () => {
    r === t._endId && i();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Ef(t, e);
  if (!o)
    return i();
  const c = o + "end";
  let u = 0;
  const d = () => {
    t.removeEventListener(c, f), s();
  }, f = (p) => {
    p.target === t && ++u >= l && d();
  };
  setTimeout(() => {
    u < l && d();
  }, a + 1), t.addEventListener(c, f);
}
function Ef(t, e) {
  const n = window.getComputedStyle(t), i = (h) => (n[h] || "").split(", "), r = i(`${tn}Delay`), s = i(`${tn}Duration`), o = Ko(r, s), a = i(`${Qn}Delay`), l = i(`${Qn}Duration`), c = Ko(a, l);
  let u = null, d = 0, f = 0;
  e === tn ? o > 0 && (u = tn, d = o, f = s.length) : e === Qn ? c > 0 && (u = Qn, d = c, f = l.length) : (d = Math.max(o, c), u = d > 0 ? o > c ? tn : Qn : null, f = u ? u === tn ? s.length : l.length : 0);
  const p = u === tn && /\b(?:transform|all)(?:,|$)/.test(
    i(`${tn}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: f,
    hasTransform: p
  };
}
function Ko(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => Xo(n) + Xo(t[i])));
}
function Xo(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Go(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function Tf(t, e, n) {
  const i = t[bi];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const ur = /* @__PURE__ */ Symbol("_vod"), mu = /* @__PURE__ */ Symbol("_vsh"), kf = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[ur] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : ei(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: i }) {
    !e != !n && (i ? e ? (i.beforeEnter(t), ei(t, !0), i.enter(t)) : i.leave(t, () => {
      ei(t, !1);
    }) : ei(t, e));
  },
  beforeUnmount(t, { value: e }) {
    ei(t, e);
  }
};
function ei(t, e) {
  t.style.display = e ? t[ur] : "none", t[mu] = !e;
}
const Af = /* @__PURE__ */ Symbol(""), Pf = /(?:^|;)\s*display\s*:/;
function Of(t, e, n) {
  const i = t.style, r = Te(n);
  let s = !1;
  if (n && !r) {
    if (e)
      if (Te(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && Gi(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && Gi(i, o, "");
    for (const o in n)
      o === "display" && (s = !0), Gi(i, o, n[o]);
  } else if (r) {
    if (e !== n) {
      const o = i[Af];
      o && (n += ";" + o), i.cssText = n, s = Pf.test(n);
    }
  } else e && t.removeAttribute("style");
  ur in t && (t[ur] = s ? i.display : "", t[mu] && (i.display = "none"));
}
const Yo = /\s*!important$/;
function Gi(t, e, n) {
  if (te(n))
    n.forEach((i) => Gi(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Mf(t, e);
    Yo.test(n) ? t.setProperty(
      tt(i),
      n.replace(Yo, ""),
      "important"
    ) : t[i] = n;
  }
}
const Jo = ["Webkit", "Moz", "ms"], Zr = {};
function Mf(t, e) {
  const n = Zr[e];
  if (n)
    return n;
  let i = $e(e);
  if (i !== "filter" && i in t)
    return Zr[e] = i;
  i = br(i);
  for (let r = 0; r < Jo.length; r++) {
    const s = Jo[r] + i;
    if (s in t)
      return Zr[e] = s;
  }
  return e;
}
const Zo = "http://www.w3.org/1999/xlink";
function Qo(t, e, n, i, r, s = Tc(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(Zo, e.slice(6, e.length)) : t.setAttributeNS(Zo, e, n) : n == null || s && !Ya(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : vt(n) ? String(n) : n
  );
}
function ea(t, e, n, i, r) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? pu(n) : n);
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
    a === "boolean" ? n = Ya(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(r || e);
}
function Rf(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function If(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const ta = /* @__PURE__ */ Symbol("_vei");
function Lf(t, e, n, i, r = null) {
  const s = t[ta] || (t[ta] = {}), o = s[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Df(e);
    if (i) {
      const c = s[e] = Ff(
        i,
        r
      );
      Rf(t, a, c, l);
    } else o && (If(t, a, o, l), s[e] = void 0);
  }
}
const na = /(?:Once|Passive|Capture)$/;
function Df(t) {
  let e;
  if (na.test(t)) {
    e = {};
    let i;
    for (; i = t.match(na); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : tt(t.slice(2)), e];
}
let Qr = 0;
const $f = /* @__PURE__ */ Promise.resolve(), Bf = () => Qr || ($f.then(() => Qr = 0), Qr = Date.now());
function Ff(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    yt(
      Nf(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Bf(), n;
}
function Nf(t, e) {
  if (te(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (i) => (r) => !r._stopped && i && i(r)
    );
  } else
    return e;
}
const ia = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, zf = (t, e, n, i, r, s) => {
  const o = r === "svg";
  e === "class" ? Tf(t, i, o) : e === "style" ? Of(t, n, i) : mr(e) ? zs(e) || Lf(t, e, n, i, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : qf(t, e, i, o)) ? (ea(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && Qo(t, e, i, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !Te(i)) ? ea(t, $e(e), i, s, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), Qo(t, e, i, o));
};
function qf(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && ia(e) && se(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const r = t.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ia(e) && Te(n) ? !1 : e in t;
}
const ra = {};
// @__NO_SIDE_EFFECTS__
function Hf(t, e, n) {
  let i = /* @__PURE__ */ Z(t, e);
  vr(i) && (i = ke({}, i, e));
  class r extends Qs {
    constructor(o) {
      super(i, o, n);
    }
  }
  return r.def = i, r;
}
const Vf = typeof HTMLElement < "u" ? HTMLElement : class {
};
class Qs extends Vf {
  constructor(e, n = {}, i = oa) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== oa ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
      ke({}, e.shadowRootOptions, {
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
      if (s && !te(s))
        for (const l in s) {
          const c = s[l];
          (c === Number || c && c.type === Number) && (l in this._props && (this._props[l] = hs(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[$e(l)] = !0);
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
        ve(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => m(n[i])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, i = te(n) ? n : Object.keys(n || {});
    for (const r of Object.keys(this))
      r[0] !== "_" && i.includes(r) && this._setProp(r, this[r]);
    for (const r of i.map($e))
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
    let i = n ? this.getAttribute(e) : ra;
    const r = $e(e);
    n && this._numberProps && this._numberProps[r] && (i = hs(i)), this._setProp(r, i, !1, !0);
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
    if (n !== this._props[e] && (this._dirty = !0, n === ra ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), i)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(tt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(tt(e), n + "") : n || this.removeAttribute(tt(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), Xf(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = V(this._def, ke(e, this._props));
    return this._instance || (n.ce = (i) => {
      this._instance = i, i.ce = this, i.isCE = !0;
      const r = (s, o) => {
        this.dispatchEvent(
          new CustomEvent(
            s,
            vr(o[0]) ? ke({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      i.emit = (s, ...o) => {
        r(s, o), tt(s) !== s && r(tt(s), o);
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
const Wf = ["ctrl", "shift", "alt", "meta"], jf = {
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
  exact: (t, e) => Wf.some((n) => t[`${n}Key`] && !e.includes(n))
}, ln = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((r, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = jf[e[o]];
      if (a && a(r, e)) return;
    }
    return t(r, ...s);
  }));
}, Uf = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, _i = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((r) => {
    if (!("key" in r))
      return;
    const s = tt(r.key);
    if (e.some(
      (o) => o === s || Uf[o] === s
    ))
      return t(r);
  }));
}, Kf = /* @__PURE__ */ ke({ patchProp: zf }, yf);
let sa;
function vu() {
  return sa || (sa = Yd(Kf));
}
const Xf = ((...t) => {
  vu().render(...t);
}), oa = ((...t) => {
  const e = vu().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const r = Yf(i);
    if (!r) return;
    const s = e._component;
    !se(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, Gf(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, e;
});
function Gf(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function Yf(t) {
  return Te(t) ? document.querySelector(t) : t;
}
const Jf = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const aa = (t) => t === "";
const Zf = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const la = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Qf = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const ep = (t) => {
  const e = Qf(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var ti = {
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
const tp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": s,
  size: o = ti.width,
  color: a = ti.stroke,
  ...l
}, { slots: c }) => mt(
  "svg",
  {
    ...ti,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": aa(n) || aa(i) || n === !0 || i === !0 ? Number(r || s || ti["stroke-width"]) * 24 / Number(o) : r || s || ti["stroke-width"],
    class: Zf(
      "lucide",
      l.class,
      ...t ? [`lucide-${la(ep(t))}-icon`, `lucide-${la(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Jf(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => mt(...u)), ...c.default ? [c.default()] : []]
);
const at = (t, e) => (n, { slots: i, attrs: r }) => mt(
  tp,
  {
    ...r,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const np = at("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const gu = at("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const ip = at("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ua = at("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const rp = at("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const sp = at("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const op = at("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const ap = at("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const lp = at("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const up = at("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const cp = at("volume-2", [
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
const dp = at("volume-x", [
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
const yu = at("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), fp = ["aria-label"], pp = /* @__PURE__ */ Z({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), le("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ce(e.$slots, "default", {}, void 0, !0)
    ], 8, fp));
  }
}), hp = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", Ve = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, r] of e)
    n[i] = r;
  return n;
}, As = /* @__PURE__ */ Ve(pp, [["styles", [hp]], ["__scopeId", "data-v-3d3f8eba"]]), mp = ["disabled", "aria-label"], vp = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, gp = /* @__PURE__ */ Z({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary", type: String },
    size: { default: "md", type: String },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = kd(), i = F(() => !!n.icon && !n.default), r = F(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (M(), le("button", {
      type: "button",
      class: un(r.value),
      disabled: t.disabled,
      "aria-label": t.ariaLabel
    }, [
      s.$slots.icon ? (M(), le("span", vp, [
        ce(s.$slots, "icon", {}, void 0, !0)
      ])) : de("", !0),
      ce(s.$slots, "default", {}, void 0, !0)
    ], 10, mp));
  }
}), yp = ".editor-btn[data-v-9ebbb489]{display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-xs);font-family:var(--font-family);font-weight:500;border:none;border-radius:var(--radius-md);cursor:pointer;transition:background-color var(--transition-duration),color var(--transition-duration);white-space:nowrap}.editor-btn[data-v-9ebbb489]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-9ebbb489]:disabled{opacity:.5;cursor:default;pointer-events:none}.editor-btn--sm[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-xs);height:28px}.editor-btn--md[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-sm);height:32px}.editor-btn--sm .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:14px;height:14px}.editor-btn--md .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:16px;height:16px}.editor-btn--icon-only.editor-btn--sm[data-v-9ebbb489]{width:28px;padding:0}.editor-btn--icon-only.editor-btn--md[data-v-9ebbb489]{width:32px;padding:0}.editor-btn--primary[data-v-9ebbb489]{color:var(--color-white);background-color:var(--color-primary)}.editor-btn--primary[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-primary-hover)}.editor-btn--secondary[data-v-9ebbb489],.editor-btn--ghost[data-v-9ebbb489]{color:var(--color-text-secondary);background:none}.editor-btn--secondary[data-v-9ebbb489]{border:1px solid var(--color-border)}.editor-btn--secondary[data-v-9ebbb489]:hover:not(:disabled),.editor-btn--ghost[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-surface-hover)}", Pt = /* @__PURE__ */ Ve(gp, [["styles", [yp]], ["__scopeId", "data-v-9ebbb489"]]), bu = {
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
}, bp = {
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
}, ca = { fr: bu, en: bp }, _u = /* @__PURE__ */ Symbol("i18n");
function _p(t) {
  const e = F(() => {
    const i = ca[t.value] ?? ca.fr;
    return (r) => i[r] ?? r;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return Oi(_u, n), n;
}
function wt() {
  const t = an(_u);
  if (t) return t;
  const e = F(() => "fr");
  return {
    t: (n) => bu[n] ?? n,
    locale: e
  };
}
function wp(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), r = parseInt(n.substring(2, 4), 16), s = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${s}, ${e})`;
}
function eo(t, e, n = "*") {
  if (t === "*") return n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(t) ?? t;
  } catch {
    return t;
  }
}
function wu(t, e, n, i = "*") {
  return t.map((r) => ({
    value: r.id,
    label: r.languages.map((s) => eo(s, e, i)).join(", ") + (r.isSource ? ` (${n})` : "")
  }));
}
function xp(t, e = 250) {
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
function cr(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, s = String(i).padStart(2, "0"), o = String(r).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class et extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Sp(t) {
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
    const i = e.channels[n], r = `channels[${n}]`;
    if (i == null || typeof i != "object")
      throw new et(r, "must be a non-null object");
    if (typeof i.id != "string")
      throw new et(`${r}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new et(`${r}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new et(`${r}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new et(`${r}.translations`, "must be an array");
    for (let s = 0; s < i.translations.length; s++) {
      const o = i.translations[s], a = `${r}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new et(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new et(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new et(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new et(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new et(`${a}.turns`, "must be an array");
    }
  }
}
function Cp(t, e) {
  const { width: n, height: i } = e.canvas, r = t[0], s = r.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(r[l] ?? 0);
    let u = a, d = c * (i / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function xu(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Ep(t, e) {
  if (!xu(t)) return null;
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
const Tp = { class: "editor-header" }, kp = { class: "header-left" }, Ap = { class: "document-title" }, Pp = { class: "badges" }, Op = ["datetime"], Mp = { class: "header-right" }, Rp = /* @__PURE__ */ Z({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = wt(), r = F(() => eo(e.language, i.value, n("language.wildcard"))), s = F(() => cr(e.duration)), o = F(() => e.title.replace(/-/g, " "));
    return (a, l) => (M(), le("header", Tp, [
      oe("div", kp, [
        oe("h1", Ap, ge(o.value), 1),
        oe("div", Pp, [
          V(As, null, {
            default: q(() => [
              Ye(ge(r.value), 1)
            ]),
            _: 1
          }),
          V(As, null, {
            default: q(() => [
              oe("time", {
                datetime: `PT${t.duration}S`
              }, ge(s.value), 9, Op)
            ]),
            _: 1
          })
        ])
      ]),
      oe("div", Mp, [
        t.isMobile ? (M(), G(Pt, {
          key: 0,
          variant: "ghost",
          "aria-label": m(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: q(() => [
            V(m(up), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : de("", !0),
        t.isMobile ? (M(), G(Pt, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": m(n)("header.export")
        }, {
          icon: q(() => [
            V(m(ua), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (M(), G(Pt, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: q(() => [
            V(m(ua), { size: 16 })
          ]),
          default: q(() => [
            Ye(" " + ge(m(n)("header.export")), 1)
          ]),
          _: 1
        })),
        V(Pt, {
          variant: "ghost",
          disabled: "",
          "aria-label": m(n)("header.settings")
        }, {
          icon: q(() => [
            V(m(op), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Ip = ".editor-header[data-v-f16781f3]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-f16781f3]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-f16781f3]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-f16781f3]{padding:0 var(--spacing-md);height:48px}.badges[data-v-f16781f3]{display:none}.document-title[data-v-f16781f3]{font-size:var(--font-size-base)}}", Lp = /* @__PURE__ */ Ve(Rp, [["styles", [Ip]], ["__scopeId", "data-v-f16781f3"]]), es = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Dp = 70, $p = 1e3 / 60, Bp = 350;
let Yi = !1, da = !1;
function Fp() {
  da || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Yi = !0;
  }), document.addEventListener("mouseup", () => {
    Yi = !1;
  }), document.addEventListener("click", () => {
    Yi = !1;
  }), da = !0);
}
const ts = /* @__PURE__ */ new Map();
function ns(...t) {
  const e = {
    damping: es.damping,
    stiffness: es.stiffness,
    mass: es.mass
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
  return ts.has(i) || ts.set(i, Object.freeze({ ...e })), n ? "instant" : ts.get(i);
}
function Np(t = {}) {
  Fp();
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
    for (const I of n) I(A);
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
    const A = i.scrollElement, I = i.contentElement;
    return !A || !I ? 0 : A.scrollHeight - 1 - A.clientHeight;
  }
  let c;
  function u() {
    const A = i.scrollElement, I = i.contentElement;
    if (!A || !I)
      return 0;
    const P = l();
    if (!e.targetScrollTop)
      return P;
    if (c?.targetScrollTop === P)
      return c.calculatedScrollTop;
    const H = Math.max(
      Math.min(
        e.targetScrollTop(P, {
          scrollElement: A,
          contentElement: I
        }),
        P
      ),
      0
    );
    return c = { targetScrollTop: P, calculatedScrollTop: H }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), H;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= Dp;
  }
  function p(A) {
    i.isAtBottom = A, r();
  }
  function h(A) {
    i.escapedFromLock = A, r();
  }
  function v(A) {
    i.isNearBottom = A, r();
  }
  function g() {
    if (!Yi || typeof window > "u")
      return !1;
    const A = window.getSelection?.();
    if (!A || !A.rangeCount)
      return !1;
    const I = A.getRangeAt(0), P = i.scrollElement;
    if (!P)
      return !1;
    const H = I.commonAncestorContainer;
    return !!(H && (P.contains(H) || H.contains(P)));
  }
  const C = (A) => {
    if (A.target !== i.scrollElement)
      return;
    const I = o(), P = i.ignoreScrollToTop;
    let H = i.lastScrollTop ?? I;
    i.lastScrollTop = I, i.ignoreScrollToTop = void 0, P && P > I && (H = P), v(f()), setTimeout(() => {
      if (i.resizeDifference || I === P)
        return;
      if (g()) {
        h(!0), p(!1);
        return;
      }
      const L = I > H, U = I < H;
      if (i.animation?.ignoreEscapes) {
        a(H);
        return;
      }
      U && (h(!0), p(!1)), L && h(!1), !i.escapedFromLock && f() && p(!0);
    }, 1);
  }, _ = (A) => {
    const I = i.scrollElement;
    if (!I)
      return;
    let P = A.target;
    for (; P && !["scroll", "auto"].includes(getComputedStyle(P).overflow); ) {
      if (!P.parentElement)
        return;
      P = P.parentElement;
    }
    P === I && A.deltaY < 0 && I.scrollHeight > I.clientHeight && !i.animation?.ignoreEscapes && (h(!0), p(!1));
  };
  function x(A, I) {
    y(), i.scrollElement = A, i.contentElement = I, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", C, { passive: !0 }), A.addEventListener("wheel", _, { passive: !0 });
    let P;
    i.resizeObserver = new ResizeObserver((H) => {
      const L = H[0];
      if (!L)
        return;
      const { height: U } = L.contentRect, ne = U - (P ?? U);
      if (i.resizeDifference = ne, o() > l() && a(l()), v(f()), ne >= 0) {
        const J = ns(
          e,
          P ? e.resize : e.initial
        );
        S({
          animation: J,
          wait: !0,
          preserveScrollPosition: !0,
          duration: J === "instant" ? void 0 : Bp
        });
      } else
        f() && (h(!1), p(!0));
      P = U, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === ne && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(I);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", C), i.scrollElement.removeEventListener("wheel", _)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function E() {
    y(), n.clear();
  }
  function T(A) {
    e = { ...e, ...A };
  }
  function S(A = {}) {
    const I = typeof A == "string" ? { animation: A } : A;
    I.preserveScrollPosition || p(!0);
    const P = Date.now() + (Number(I.wait) || 0), H = ns(e, I.animation), { ignoreEscapes: L = !1 } = I;
    let U, ne = u();
    I.duration instanceof Promise ? I.duration.finally(() => {
      U = Date.now();
    }) : U = P + (I.duration ?? 0);
    const J = async () => {
      const Q = new Promise((be) => {
        if (typeof requestAnimationFrame > "u") {
          be(!1);
          return;
        }
        requestAnimationFrame(() => be(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const be = o(), Ie = typeof performance < "u" ? performance.now() : Date.now(), Je = (Ie - (i.lastTick ?? Ie)) / $p;
        if (i.animation ||= { behavior: H, promise: Q, ignoreEscapes: L }, i.animation.behavior === H && (i.lastTick = Ie), g() || P > Date.now())
          return J();
        if (be < Math.min(ne, u())) {
          if (i.animation?.behavior === H) {
            if (H === "instant")
              return a(u()), J();
            const Ae = H;
            i.velocity = (Ae.damping * i.velocity + Ae.stiffness * d()) / Ae.mass, i.accumulated += i.velocity * Je;
            const Ft = o();
            a(Ft + i.accumulated), o() !== Ft && (i.accumulated = 0);
          }
          return J();
        }
        return U > Date.now() ? (ne = u(), J()) : (i.animation = void 0, o() < u() ? S({
          animation: ns(e, e.resize),
          ignoreEscapes: L,
          duration: Math.max(0, U - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return Q.then((be) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), be));
    };
    return I.wait !== !0 && (i.animation = void 0), i.animation?.behavior === H ? i.animation.promise : J();
  }
  const R = () => {
    h(!0), p(!1);
  };
  function k(A) {
    return n.add(A), () => n.delete(A);
  }
  return {
    attach: x,
    detach: y,
    destroy: E,
    setOptions: T,
    getState: s,
    onChange: k,
    scrollToBottom: S,
    stopScroll: R
  };
}
function zp(t = {}) {
  const e = /* @__PURE__ */ N(null), n = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(t.initial !== !1), r = /* @__PURE__ */ N(!1), s = /* @__PURE__ */ N(!1), o = Np(t);
  let a = null;
  return dt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((c) => {
      i.value = c.isAtBottom, r.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), An(() => {
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
const qp = /* @__PURE__ */ Z({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), le("span", {
      class: "speaker-indicator",
      style: Dt({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Hp = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", Su = /* @__PURE__ */ Ve(qp, [["styles", [Hp]], ["__scopeId", "data-v-9bffeda8"]]), Vp = { class: "speaker-label" }, Wp = {
  key: 1,
  class: "speaker-name"
}, jp = ["datetime"], Up = /* @__PURE__ */ Z({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = wt(), r = F(
      () => eo(e.language, i.value, n("language.wildcard"))
    ), s = F(
      () => e.startTime != null ? cr(e.startTime) : null
    ), o = F(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = F(() => e.speaker?.color ?? "transparent");
    return (l, c) => (M(), le("div", Vp, [
      t.speaker ? (M(), G(Su, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : de("", !0),
      t.speaker ? (M(), le("span", Wp, ge(t.speaker.name), 1)) : de("", !0),
      s.value ? (M(), le("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, ge(s.value), 9, jp)) : de("", !0),
      V(As, null, {
        default: q(() => [
          Ye(ge(r.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Kp = ".speaker-label[data-v-0fb7fa1e]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-0fb7fa1e]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-0fb7fa1e]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted)}", Xp = /* @__PURE__ */ Ve(Up, [["styles", [Kp]], ["__scopeId", "data-v-0fb7fa1e"]]);
function Gp() {
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
const fa = [
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
function Yp(t, e, n) {
  const i = fa[t.size % fa.length];
  return { id: e, name: n, color: i };
}
function Jp(t, e, n) {
  return !e || t.has(e) ? null : Yp(t, e, n ?? e);
}
function Zp(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function Qp(t) {
  const e = /* @__PURE__ */ Cr(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = Jp(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(s, o) {
    const a = Zp(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: r };
}
function eh(t, e) {
  return [...t, e];
}
function th(t, e) {
  return [...e, ...t];
}
function nh(t, e, n) {
  const i = t.findIndex((s) => s.id === e);
  if (i === -1) return null;
  const r = { ...t[i], ...n, id: e };
  return {
    turns: t.map((s, o) => o === i ? r : s),
    updated: r
  };
}
function ih(t, e) {
  const n = t.findIndex((i) => i.id === e);
  return n === -1 ? null : t.filter((i, r) => r !== n);
}
function rh(t, e, n) {
  const i = t.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const r = t[i], s = {
    ...r,
    words: n,
    text: null,
    startTime: n[0]?.startTime ?? r.startTime,
    endTime: n[n.length - 1]?.endTime ?? r.endTime
  };
  return {
    turns: t.map((o, a) => a === i ? s : o),
    updated: s
  };
}
function Ps(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function sh(t, e, n) {
  const { id: i, languages: r, isSource: s, audio: o } = t, a = /* @__PURE__ */ N(t.turns);
  function l(h) {
    n(h.speakerId), a.value = eh(a.value, h), e("turn:add", { turn: h, translationId: i });
  }
  function c(h, v) {
    const g = nh(a.value, h, v);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function u(h) {
    const v = ih(a.value, h);
    v && (a.value = v, e("turn:remove", { turnId: h, translationId: i }));
  }
  function d(h, v) {
    const g = rh(a.value, h, v);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function f(h) {
    Ps(h, n), a.value = th(a.value, h);
  }
  function p(h) {
    Ps(h, n), a.value = h, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: r, isSource: s, audio: o, turns: a, addTurn: l, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: p };
}
function pa(t, e, n) {
  const { id: i, name: r, description: s, duration: o } = t, a = /* @__PURE__ */ Cr(/* @__PURE__ */ new Map());
  let l;
  for (const v of t.translations) {
    const g = sh(v, e, n);
    a.set(v.id, g), v.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ N(null), u = /* @__PURE__ */ N(!1), d = /* @__PURE__ */ N(!0), f = F(() => c.value ? a.get(c.value) ?? l : l);
  function p(v) {
    const g = v === l.id ? null : v;
    g !== c.value && (c.value = g, e("translation:change", { translationId: f.value.id }));
  }
  function h() {
    for (const v of a.values())
      v.setTurns([]);
    u.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: r,
    description: s,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: f,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: p,
    reset: h
  };
}
function oh(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, r] of t.speakers)
    e.add(i), n.push({ id: i, name: r.name });
  for (const i of t.channels)
    for (const r of i.translations)
      for (const s of r.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), n.push({ id: s.speakerId, name: s.speakerId }));
  return n;
}
function ah(t = {}) {
  const e = /* @__PURE__ */ N(""), n = /* @__PURE__ */ N(t.activeChannelId ?? ""), i = /* @__PURE__ */ N(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: s, emit: o, clear: a } = Gp(), l = Qp(o), c = l, u = /* @__PURE__ */ Cr(/* @__PURE__ */ new Map()), d = F(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function f(T, S) {
    return r(T, (R) => {
      R.translationId === d.value.activeTranslation.value.id && S(R);
    });
  }
  function p(T) {
    e.value = T.title, l.clear(), u.clear();
    for (const S of oh(T))
      c.ensure(S.id, S.name);
    for (const S of T.channels)
      u.set(S.id, pa(S, o, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(T) {
    Sp(T), p(T);
  }
  function v(T) {
    T !== n.value && (n.value = T, o("channel:change", { channelId: T }));
  }
  function g(T, S) {
    if (u.has(T)) {
      for (const R of S.translations)
        Ps(R.turns, c.ensure);
      u.set(T, pa(S, o, c.ensure)), o("channel:sync", { channelId: T });
    }
  }
  const C = [], _ = [];
  function x(T) {
    T.tiptapExtensions && _.push(...T.tiptapExtensions);
    const S = T.install(E);
    S && C.push(S);
  }
  function y() {
    o("destroy", void 0), C.forEach((T) => T()), C.length = 0, a();
  }
  t.document && p(t.document);
  const E = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: _,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: f,
    setDocument: h,
    setActiveChannel: v,
    setChannel: g,
    on: r,
    off: s,
    emit: o,
    use: x,
    destroy: y
  };
  return E;
}
const Cu = /* @__PURE__ */ Symbol("editorStore");
function lh(t) {
  Oi(Cu, t);
}
function On() {
  const t = an(Cu);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const uh = ["data-turn-active"], ch = { class: "turn-text" }, dh = ["data-word-active"], fh = /* @__PURE__ */ Z({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = On(), i = F(() => e.turn.words.length > 0), r = F(() => {
      if (!n.audio?.src.value || !i.value) return null;
      const a = n.audio.currentTime.value, { startTime: l, endTime: c, words: u } = e.turn;
      return l == null || c == null || a < l || a > c ? null : Ep(u, a);
    }), s = F(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || xu(e.turn.words)) return !1;
      const a = n.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), o = F(() => e.speaker?.color ?? "transparent");
    return (a, l) => (M(), le("section", {
      class: un(["turn", { "turn--active": s.value, "turn--partial": t.partial }]),
      "data-turn-active": s.value || t.partial || t.live || void 0,
      style: Dt({ "--speaker-color": o.value })
    }, [
      t.partial ? de("", !0) : (M(), G(Xp, {
        key: 0,
        speaker: t.speaker,
        "start-time": t.turn.startTime,
        language: t.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      oe("p", ch, [
        i.value ? (M(!0), le(Ee, { key: 0 }, Pn(t.turn.words, (c, u) => (M(), le(Ee, {
          key: c.id
        }, [
          oe("span", {
            class: un({ "word--active": c.id === r.value }),
            "data-word-active": c.id === r.value || void 0
          }, ge(c.text), 11, dh),
          Ye(ge(u < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (M(), le(Ee, { key: 1 }, [
          Ye(ge(t.turn.text), 1)
        ], 64)) : de("", !0)
      ])
    ], 14, uh));
  }
}), ph = ".turn[data-v-e8530a49]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-text[data-v-e8530a49]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--active[data-v-e8530a49]{border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent)}.word--active[data-v-e8530a49]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-e8530a49]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-e8530a49 .2s ease}@keyframes partial-fade-in-e8530a49{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-e8530a49]{animation:none}}@media(max-width:767px){.turn[data-v-e8530a49]{padding:var(--spacing-sm) var(--spacing-md)}}", ha = /* @__PURE__ */ Ve(fh, [["styles", [ph]], ["__scopeId", "data-v-e8530a49"]]), hh = {}, mh = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function vh(t, e) {
  return M(), le("svg", mh, [...e[0] || (e[0] = [
    rf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const gh = /* @__PURE__ */ Ve(hh, [["render", vh]]), yh = { class: "transcription-empty" }, bh = { class: "message" }, _h = /* @__PURE__ */ Z({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = wt();
    return (n, i) => (M(), le("div", yh, [
      V(gh, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      oe("p", bh, ge(m(e)("transcription.empty")), 1)
    ]));
  }
}), wh = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", xh = /* @__PURE__ */ Ve(_h, [["styles", [wh]], ["__scopeId", "data-v-f82737e5"]]), Sh = { class: "transcription-panel" }, Ch = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Eh = { class: "turns-container" }, Th = {
  key: 0,
  class: "history-loading",
  role: "status"
}, kh = {
  key: 1,
  class: "history-start"
}, Ah = /* @__PURE__ */ Z({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = wt(), i = On(), r = vi("scrollContainer"), s = F(() => {
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
    }), o = F(() => i.live?.hasLiveUpdate.value ?? !1), a = F(() => i.audio?.isPlaying.value ?? !1), l = F(
      () => i.activeChannel.value.activeTranslation.value
    ), c = F(() => i.activeChannel.value), u = F(
      () => c.value.isLoadingHistory.value
    ), d = F(() => c.value.hasMoreHistory.value), { scrollRef: f, contentRef: p, isAtBottom: h, scrollToBottom: v } = zp();
    De(() => {
      f.value = r.value, p.value = r.value?.querySelector(".turns-container") ?? null;
    });
    const g = xp(() => {
      const _ = c.value;
      _.hasMoreHistory.value && (_.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function C() {
      const _ = r.value;
      _ && _.scrollTop < 100 && g();
    }
    return we(
      () => e.turns,
      (_, x) => {
        const y = _.length, E = x.length;
        if (y > E && !h.value && _[0]?.id != x[0]?.id) {
          const T = y - E, S = e.turns[T]?.id;
          if (!S || !f.value) return;
          Me(() => {
            f.value?.querySelector(
              `[data-turn-id="${S}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), De(() => {
      r.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), An(() => {
      r.value?.removeEventListener("scroll", C);
    }), (_, x) => (M(), le("article", Sh, [
      oe("div", Ch, [
        oe("div", Eh, [
          u.value ? (M(), le("div", Th, [...x[1] || (x[1] = [
            oe("progress", null, null, -1)
          ])])) : de("", !0),
          !d.value && t.turns.length > 0 ? (M(), le("div", kh, ge(m(n)("transcription.historyStart")), 1)) : de("", !0),
          t.turns.length === 0 && !u.value ? (M(), G(xh, {
            key: 2,
            class: "transcription-empty"
          })) : de("", !0),
          (M(!0), le(Ee, null, Pn(t.turns, (y, E) => (M(), G(ha, {
            "data-turn-id": y.id,
            key: y.id,
            turn: y,
            speaker: y.speakerId ? t.speakers.get(y.speakerId) : void 0,
            live: o.value && !s.value && E === t.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (M(), G(ha, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : de("", !0)
        ]),
        V(wf, { name: "fade-slide" }, {
          default: q(() => [
            !m(h) && (a.value || o.value) ? (M(), G(Pt, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": m(n)("transcription.resumeScroll"),
              onClick: x[0] || (x[0] = (y) => m(v)())
            }, {
              icon: q(() => [
                V(m(np), { size: 14 })
              ]),
              default: q(() => [
                Ye(" " + ge(m(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : de("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Ph = ".transcription-panel[data-v-fce2d218]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-fce2d218]{height:100%;overflow:auto;position:relative}.turns-container[data-v-fce2d218]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-fce2d218]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-fce2d218]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-fce2d218]{width:120px}.history-start[data-v-fce2d218]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-fce2d218]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-fce2d218],.fade-slide-leave-active[data-v-fce2d218]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-fce2d218],.fade-slide-leave-to[data-v-fce2d218]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-fce2d218],.fade-slide-leave-active[data-v-fce2d218]{transition:none}}@media(max-width:767px){.turns-container[data-v-fce2d218]{padding:var(--spacing-md)}}", Oh = /* @__PURE__ */ Ve(Ah, [["styles", [Ph]], ["__scopeId", "data-v-fce2d218"]]), Mh = { class: "switch" }, Rh = ["id", "checked"], Ih = ["for"], Lh = /* @__PURE__ */ Z({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = n.id ?? zl();
    return (s, o) => (M(), le("div", Mh, [
      oe("input", {
        type: "checkbox",
        id: m(r),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Rh),
      oe("label", { for: m(r) }, [...o[1] || (o[1] = [
        oe("div", { class: "switch-slider" }, null, -1)
      ])], 8, Ih)
    ]));
  }
}), Dh = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", $h = /* @__PURE__ */ Ve(Lh, [["styles", [Dh]], ["__scopeId", "data-v-2aa0332f"]]), Bh = "(max-width: 767px)";
function Eu() {
  const t = /* @__PURE__ */ N(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return De(() => {
    e = window.matchMedia(Bh), t.value = e.matches, e.addEventListener("change", n);
  }), An(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
function ma(t) {
  return typeof t == "string" ? `'${t}'` : new Fh().serialize(t);
}
const Fh = /* @__PURE__ */ (function() {
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
function dr(t, e) {
  return t === e || ma(t) === ma(e);
}
function Nh(t, e, n) {
  const i = t.findIndex((a) => dr(a, e)), r = t.findIndex((a) => dr(a, n));
  if (i === -1 || r === -1) return [];
  const [s, o] = [i, r].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function va(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function $t(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = an(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (Oi(i, o), o)];
}
function ct() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function Lr(t, e, n) {
  const i = n.originalEvent.target, r = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(r);
}
function Os(t) {
  return t == null;
}
function to(t) {
  return t ? t.flatMap((e) => e.type === Ee ? to(e.children) : [e]) : [];
}
const [no] = $t("ConfigProvider");
function zh(t, e) {
  var n;
  const i = /* @__PURE__ */ Tn();
  return dt(() => {
    i.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ tr(i);
}
function Dr(t, e) {
  return Ws() ? (tl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function is() {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    t.delete(s);
  };
  return {
    on: (s) => {
      t.add(s);
      const o = () => e(s);
      return Dr(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(t).map((o) => o(...s))),
    clear: () => {
      t.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function qh(t) {
  let e = !1, n;
  const i = el(!0);
  return ((...r) => (e || (n = i.run(() => t(...r)), e = !0), n));
}
const en = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Hh = (t) => typeof t < "u", Vh = Object.prototype.toString, Wh = (t) => Vh.call(t) === "[object Object]", ga = /* @__PURE__ */ jh();
function jh() {
  var t, e, n;
  return en && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function rs(t) {
  return Array.isArray(t) ? t : [t];
}
function Uh(t) {
  return ot();
}
// @__NO_SIDE_EFFECTS__
function Kh(t) {
  if (!en) return t;
  let e = 0, n, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = el(!0), n = i.run(() => t(...s))), Dr(r), n));
}
function Tu(t, e = 1e4) {
  return wl((n, i) => {
    let r = Ge(t), s;
    const o = () => setTimeout(() => {
      r = Ge(t), i();
    }, Ge(e));
    return Dr(() => {
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
function Xh(t, e) {
  Uh() && An(t, e);
}
function Gh(t, e, n) {
  return we(t, e, {
    ...n,
    immediate: !0
  });
}
const $r = en ? window : void 0;
function It(t) {
  var e;
  const n = Ge(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function ku(...t) {
  const e = (i, r, s, o) => (i.addEventListener(r, s, o), () => i.removeEventListener(r, s, o)), n = F(() => {
    const i = rs(Ge(t[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return Gh(() => {
    var i, r;
    return [
      (i = (r = n.value) === null || r === void 0 ? void 0 : r.map((s) => It(s))) !== null && i !== void 0 ? i : [$r].filter((s) => s != null),
      rs(Ge(n.value ? t[1] : t[0])),
      rs(m(n.value ? t[2] : t[1])),
      Ge(n.value ? t[3] : t[2])
    ];
  }, ([i, r, s, o], a, l) => {
    if (!i?.length || !r?.length || !s?.length) return;
    const c = Wh(o) ? { ...o } : o, u = i.flatMap((d) => r.flatMap((f) => s.map((p) => e(d, f, p, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Au() {
  const t = /* @__PURE__ */ Tn(!1), e = ot();
  return e && De(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function Yh(t) {
  const e = /* @__PURE__ */ Au();
  return F(() => (e.value, !!t()));
}
function Jh(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function Zh(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: r = $r, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = Jh(e);
  return ku(r, s, (u) => {
    u.repeat && Ge(a) || l(u) && n(u);
  }, o);
}
function Qh(t) {
  return JSON.parse(JSON.stringify(t));
}
function em(t, e, n = {}) {
  const { window: i = $r, ...r } = n;
  let s;
  const o = /* @__PURE__ */ Yh(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = we(F(() => {
    const u = Ge(t);
    return Array.isArray(u) ? u.map((d) => It(d)) : [It(u)];
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
  return Dr(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function wi(t, e, n, i = {}) {
  var r, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = i, f = ot(), p = n || f?.emit || (f == null || (r = f.$emit) === null || r === void 0 ? void 0 : r.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const v = (_) => o ? typeof o == "function" ? o(_) : Qh(_) : _, g = () => Hh(t[e]) ? v(t[e]) : u, C = (_) => {
    d ? d(_) && p(h, _) : p(h, _);
  };
  if (a) {
    const _ = /* @__PURE__ */ N(g());
    let x = !1;
    return we(() => t[e], (y) => {
      x || (x = !0, _.value = v(y), Me(() => x = !1));
    }), we(_, (y) => {
      !x && (y !== t[e] || c) && C(y);
    }, { deep: c }), _;
  } else return F({
    get() {
      return g();
    },
    set(_) {
      C(_);
    }
  });
}
function ss(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Ms(t, e, n = ".", i) {
  if (!ss(e))
    return Ms(t, {}, n, i);
  const r = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (i && i(r, s, o, n) || (Array.isArray(o) && Array.isArray(r[s]) ? r[s] = [...o, ...r[s]] : ss(o) && ss(r[s]) ? r[s] = Ms(
      o,
      r[s],
      (n ? `${n}.` : "") + s.toString(),
      i
    ) : r[s] = o));
  }
  return r;
}
function tm(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Ms(n, i, "", t), {})
  );
}
const nm = tm(), im = /* @__PURE__ */ Kh(() => {
  const t = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ N(), n = F(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = no({ scrollBody: /* @__PURE__ */ N(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ga && r?.(), e.value = void 0;
  };
  return we(n, (o, a) => {
    if (!en) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? nm({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ga && (r = ku(document, "touchmove", (d) => rm(d), { passive: !1 })), Me(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Pu(t) {
  const e = Math.random().toString(36).substring(2, 7), n = im();
  n.value.set(e, t ?? !1);
  const i = F({
    get: () => n.value.get(e) ?? !1,
    set: (r) => n.value.set(e, r)
  });
  return Xh(() => {
    n.value.delete(e);
  }), i;
}
function Ou(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : Ou(n);
  }
}
function rm(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && Ou(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Mu(t) {
  const e = no({ dir: /* @__PURE__ */ N("ltr") });
  return F(() => t?.value || e.dir?.value || "ltr");
}
function Br(t) {
  const e = ot(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((r) => {
    i[Wi($e(r))] = (...s) => t(r, ...s);
  }), i;
}
let os = 0;
function sm() {
  dt((t) => {
    if (!en) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ya()), document.body.insertAdjacentElement("beforeend", e[1] ?? ya()), os++, t(() => {
      os === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), os--;
    });
  });
}
function ya() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function Ru(t) {
  return F(() => Ge(t) ? !!It(t)?.closest("form") : !0);
}
function Re() {
  const t = ot(), e = /* @__PURE__ */ N(), n = F(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : It(e)), i = Object.assign({}, t.exposed), r = {};
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
function io(t) {
  const e = ot(), n = Object.keys(e?.type.props ?? {}).reduce((r, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (r[s] = o), r;
  }, {}), i = /* @__PURE__ */ ji(t);
  return F(() => {
    const r = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      r[$e(o)] = s[o];
    }), Object.keys({
      ...n,
      ...r
    }).reduce((o, a) => (i.value[a] !== void 0 && (o[a] = i.value[a]), o), {});
  });
}
function om(t, e) {
  const n = io(t), i = e ? Br(e) : {};
  return F(() => ({
    ...n.value,
    ...i
  }));
}
var am = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Ln = /* @__PURE__ */ new WeakMap(), Ni = /* @__PURE__ */ new WeakMap(), zi = {}, as = 0, Iu = function(t) {
  return t && (t.host || Iu(t.parentNode));
}, lm = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = Iu(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, um = function(t, e, n, i) {
  var r = lm(e, Array.isArray(t) ? t : [t]);
  zi[n] || (zi[n] = /* @__PURE__ */ new WeakMap());
  var s = zi[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(r), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  r.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var p = f.getAttribute(i), h = p !== null && p !== "false", v = (Ln.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Ln.set(f, v), s.set(f, g), o.push(f), v === 1 && h && Ni.set(f, !0), g === 1 && f.setAttribute(n, "true"), h || f.setAttribute(i, "true");
        } catch (C) {
          console.error("aria-hidden: cannot operate on ", f, C);
        }
    });
  };
  return u(e), a.clear(), as++, function() {
    o.forEach(function(d) {
      var f = Ln.get(d) - 1, p = s.get(d) - 1;
      Ln.set(d, f), s.set(d, p), f || (Ni.has(d) || d.removeAttribute(i), Ni.delete(d)), p || d.removeAttribute(n);
    }), as--, as || (Ln = /* @__PURE__ */ new WeakMap(), Ln = /* @__PURE__ */ new WeakMap(), Ni = /* @__PURE__ */ new WeakMap(), zi = {});
  };
}, cm = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), r = am(t);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), um(i, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function Lu(t) {
  let e;
  we(() => It(t), (n) => {
    n ? e = cm(n) : e && e();
  }), fn(() => {
    e && e();
  });
}
function xi(t, e = "reka") {
  return `${e}-${zl?.()}`;
}
function dm() {
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
function fm(t) {
  const e = /* @__PURE__ */ N(), n = F(() => e.value?.width ?? 0), i = F(() => e.value?.height ?? 0);
  return De(() => {
    const r = It(t);
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
function pm(t, e) {
  const n = /* @__PURE__ */ N(t);
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
function ro(t) {
  const e = Tu("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, s) => {
      e.value = e.value + r;
      {
        const o = ct(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = mm(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function hm(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
function mm(t, e, n) {
  const r = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = hm(t, Math.max(s, 0));
  r.length === 1 && (o = o.filter((c) => c !== n));
  const l = o.find((c) => c.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function vm(t, e) {
  const n = /* @__PURE__ */ N({}), i = /* @__PURE__ */ N("none"), r = /* @__PURE__ */ N(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? $r, { state: l, dispatch: c } = pm(s, {
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
    if (en) {
      const C = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(C);
    }
  };
  we(t, async (g, C) => {
    const _ = C !== g;
    if (await Me(), _) {
      const x = i.value, y = qi(e.value);
      g ? (c("MOUNT"), u("enter"), y === "none" && u("after-enter")) : y === "none" || y === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : C && x !== y ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const C = qi(e.value), _ = C.includes(CSS.escape(g.animationName)), x = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && _ && (u(`after-${x}`), c("ANIMATION_END"), !r.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    g.target === e.value && C === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (i.value = qi(e.value));
  }, p = we(e, (g, C) => {
    g ? (n.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), C?.removeEventListener("animationstart", f), C?.removeEventListener("animationcancel", d), C?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = we(l, () => {
    const g = qi(e.value);
    i.value = l.value === "mounted" ? g : "none";
  });
  return fn(() => {
    p(), h();
  }), { isPresent: F(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function qi(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var so = /* @__PURE__ */ Z({
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
    const { present: i, forceMount: r } = /* @__PURE__ */ Kn(t), s = /* @__PURE__ */ N(), { isPresent: o } = vm(i, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = to(a || []);
    const l = ot();
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
    return () => r.value || i.value || o.value ? mt(e.default({ present: o.value })[0], { ref: (c) => {
      const u = It(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const Rs = /* @__PURE__ */ Z({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = to(n.default()), r = i.findIndex((l) => l.type !== Be);
      if (r === -1) return i;
      const s = i[r];
      delete s.props?.ref;
      const o = s.props ? Ce(e, s.props) : e, a = Yt({
        ...s,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[r] = a, i);
    };
  }
}), gm = [
  "area",
  "img",
  "input"
], Pe = /* @__PURE__ */ Z({
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
    return typeof i == "string" && gm.includes(i) ? () => mt(i, e) : i !== "template" ? () => mt(t.as, e, { default: n.default }) : () => mt(Rs, e, { default: n.default });
  }
});
function Si() {
  const t = /* @__PURE__ */ N(), e = F(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : It(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [pn, ym] = $t("DialogRoot");
var bm = /* @__PURE__ */ Z({
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
    const n = t, r = /* @__PURE__ */ wi(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), s = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), { modal: a } = /* @__PURE__ */ Kn(n);
    return ym({
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
    }), (l, c) => ce(l.$slots, "default", {
      open: m(r),
      close: () => r.value = !1
    });
  }
}), Du = bm, _m = /* @__PURE__ */ Z({
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
    const n = pn();
    return (i, r) => (M(), G(m(Pe), Ce(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => m(n).onOpenChange(!1))
    }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), wm = _m;
const xm = "dismissableLayer.pointerDownOutside", Sm = "dismissableLayer.focusOutside";
function $u(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), r = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || r.indexOf(i) < r.indexOf(n)));
}
function Cm(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ N(!1), s = /* @__PURE__ */ N(() => {
  });
  return dt((o) => {
    if (!en || !Ge(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if ($u(e.value, u)) {
          r.value = !1;
          return;
        }
        if (c.target && !r.value) {
          let f = function() {
            Lr(xm, t, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (i.removeEventListener("click", s.value), s.value = f, i.addEventListener("click", s.value, { once: !0 })) : f();
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
    Ge(n) && (r.value = !0);
  } };
}
function Em(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ N(!1);
  return dt((s) => {
    if (!en || !Ge(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Me(), await Me();
      const l = a.target;
      !e.value || !l || $u(e.value, l) || a.target && !r.value && Lr(Sm, t, { originalEvent: a });
    };
    i.addEventListener("focusin", o), s(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Ge(n) && (r.value = !0);
    },
    onBlurCapture: () => {
      Ge(n) && (r.value = !1);
    }
  };
}
const ut = /* @__PURE__ */ Ai({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Tm = /* @__PURE__ */ Z({
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
    const n = t, i = e, { forwardRef: r, currentElement: s } = Re(), o = F(() => s.value?.ownerDocument ?? globalThis.document), a = F(() => ut.layersRoot), l = F(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = F(() => ut.layersWithOutsidePointerEventsDisabled.size > 0), u = F(() => {
      const p = Array.from(a.value), [h] = [...ut.layersWithOutsidePointerEventsDisabled].slice(-1), v = p.indexOf(h);
      return l.value >= v;
    }), d = Cm(async (p) => {
      const h = [...ut.branches].some((v) => v?.contains(p.target));
      !u.value || h || (i("pointerDownOutside", p), i("interactOutside", p), await Me(), p.defaultPrevented || i("dismiss"));
    }, s), f = Em((p) => {
      [...ut.branches].some((v) => v?.contains(p.target)) || (i("focusOutside", p), i("interactOutside", p), p.defaultPrevented || i("dismiss"));
    }, s);
    return Zh("Escape", (p) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", p), p.defaultPrevented || i("dismiss"));
    }), dt((p) => {
      s.value && (n.disableOutsidePointerEvents && (ut.layersWithOutsidePointerEventsDisabled.size === 0 && (ut.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), ut.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), p(() => {
        n.disableOutsidePointerEvents && ut.layersWithOutsidePointerEventsDisabled.size === 1 && !Os(ut.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = ut.originalBodyPointerEvents);
      }));
    }), dt((p) => {
      p(() => {
        s.value && (a.value.delete(s.value), ut.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (p, h) => (M(), G(m(Pe), {
      ref: m(r),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: Dt({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: m(f).onFocusCapture,
      onBlurCapture: m(f).onBlurCapture,
      onPointerdownCapture: m(d).onPointerDownCapture
    }, {
      default: q(() => [ce(p.$slots, "default")]),
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
}), Bu = Tm;
const km = /* @__PURE__ */ qh(() => /* @__PURE__ */ N([]));
function Am() {
  const t = km();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = ba(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = ba(t.value, e), t.value[0]?.resume();
    }
  };
}
function ba(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const ls = "focusScope.autoFocusOnMount", us = "focusScope.autoFocusOnUnmount", _a = {
  bubbles: !1,
  cancelable: !0
};
function Pm(t, { select: e = !1 } = {}) {
  const n = ct();
  for (const i of t)
    if (nn(i, { select: e }), ct() !== n) return !0;
}
function Om(t) {
  const e = Fu(t), n = wa(e, t), i = wa(e.reverse(), t);
  return [n, i];
}
function Fu(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function wa(t, e) {
  for (const n of t) if (!Mm(n, { upTo: e })) return n;
}
function Mm(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function Rm(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function nn(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = ct();
    t.focus({ preventScroll: !0 }), t !== n && Rm(t) && e && t.select();
  }
}
var Im = /* @__PURE__ */ Z({
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
    const n = t, i = e, { currentRef: r, currentElement: s } = Re(), o = /* @__PURE__ */ N(null), a = Am(), l = /* @__PURE__ */ Ai({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    dt((u) => {
      if (!en) return;
      const d = s.value;
      if (!n.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const C = g.target;
        d.contains(C) ? o.value = C : nn(o.value, { select: !0 });
      }
      function p(g) {
        if (l.paused || !d) return;
        const C = g.relatedTarget;
        C !== null && (d.contains(C) || nn(o.value, { select: !0 }));
      }
      function h(g) {
        d.contains(o.value) || nn(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const v = new MutationObserver(h);
      d && v.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), v.disconnect();
      });
    }), dt(async (u) => {
      const d = s.value;
      if (await Me(), !d) return;
      a.add(l);
      const f = ct();
      if (!d.contains(f)) {
        const h = new CustomEvent(ls, _a);
        d.addEventListener(ls, (v) => i("mountAutoFocus", v)), d.dispatchEvent(h), h.defaultPrevented || (Pm(Fu(d), { select: !0 }), ct() === f && nn(d));
      }
      u(() => {
        d.removeEventListener(ls, (g) => i("mountAutoFocus", g));
        const h = new CustomEvent(us, _a), v = (g) => {
          i("unmountAutoFocus", g);
        };
        d.addEventListener(us, v), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || nn(f ?? document.body, { select: !0 }), d.removeEventListener(us, v), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = ct();
      if (d && f) {
        const p = u.currentTarget, [h, v] = Om(p);
        h && v ? !u.shiftKey && f === v ? (u.preventDefault(), n.loop && nn(h, { select: !0 })) : u.shiftKey && f === h && (u.preventDefault(), n.loop && nn(v, { select: !0 })) : f === p && u.preventDefault();
      }
    }
    return (u, d) => (M(), G(m(Pe), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Nu = Im;
function Lm(t) {
  return t ? "open" : "closed";
}
function xa(t) {
  const e = ct();
  for (const n of t)
    if (n === e || (n.focus(), ct() !== e)) return;
}
var Dm = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), { forwardRef: s, currentElement: o } = Re();
    return r.titleId ||= xi(void 0, "reka-dialog-title"), r.descriptionId ||= xi(void 0, "reka-dialog-description"), De(() => {
      r.contentElement = o, ct() !== document.body && (r.triggerElement.value = ct());
    }), (a, l) => (M(), G(m(Nu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => i("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => i("closeAutoFocus", c))
    }, {
      default: q(() => [V(m(Bu), Ce({
        id: m(r).contentId,
        ref: m(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": m(r).descriptionId,
        "aria-labelledby": m(r).titleId,
        "data-state": m(Lm)(m(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => m(r).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => i("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => i("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => i("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => i("pointerDownOutside", c))
      }), {
        default: q(() => [ce(a.$slots, "default")]),
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
}), zu = Dm, $m = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), s = Br(i), { forwardRef: o, currentElement: a } = Re();
    return Lu(a), (l, c) => (M(), G(zu, Ce({
      ...n,
      ...m(s)
    }, {
      ref: m(o),
      "trap-focus": m(r).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (u.preventDefault(), m(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || f) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Bm = $m, Fm = /* @__PURE__ */ Z({
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
    const n = t, r = Br(e);
    Re();
    const s = pn(), o = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1);
    return (l, c) => (M(), G(zu, Ce({
      ...n,
      ...m(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || m(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = u.target;
        m(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && a.value && u.preventDefault();
      })
    }), {
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Nm = Fm, zm = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), s = Br(i), { forwardRef: o } = Re();
    return (a, l) => (M(), G(m(so), { present: a.forceMount || m(r).open.value }, {
      default: q(() => [m(r).modal.value ? (M(), G(Bm, Ce({
        key: 0,
        ref: m(o)
      }, {
        ...n,
        ...m(s),
        ...a.$attrs
      }), {
        default: q(() => [ce(a.$slots, "default")]),
        _: 3
      }, 16)) : (M(), G(Nm, Ce({
        key: 1,
        ref: m(o)
      }, {
        ...n,
        ...m(s),
        ...a.$attrs
      }), {
        default: q(() => [ce(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), qu = zm, qm = /* @__PURE__ */ Z({
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
    const e = pn();
    return Pu(!0), Re(), (n, i) => (M(), G(m(Pe), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": m(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Hm = qm, Vm = /* @__PURE__ */ Z({
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
    const e = pn(), { forwardRef: n } = Re();
    return (i, r) => m(e)?.modal.value ? (M(), G(m(so), {
      key: 0,
      present: i.forceMount || m(e).open.value
    }, {
      default: q(() => [V(Hm, Ce(i.$attrs, {
        ref: m(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: q(() => [ce(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : de("v-if", !0);
  }
}), Hu = Vm, Wm = /* @__PURE__ */ Z({
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
    const e = /* @__PURE__ */ Au();
    return (n, i) => m(e) || n.forceMount ? (M(), G(Ll, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [ce(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : de("v-if", !0);
  }
}), Vu = Wm, jm = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), G(m(Vu), Hs(Rr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wu = jm, Um = /* @__PURE__ */ Z({
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
    const e = t, n = pn();
    return Re(), (i, r) => (M(), G(m(Pe), Ce(e, { id: m(n).titleId }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), ju = Um;
const Sa = "data-reka-collection-item";
function hn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let r;
  n ? (r = {
    collectionRef: /* @__PURE__ */ N(),
    itemMap: /* @__PURE__ */ N(/* @__PURE__ */ new Map())
  }, Oi(i, r)) : r = an(i);
  const s = (u = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Sa}]`)), h = Array.from(r.itemMap.value.values()).sort((v, g) => f.indexOf(v.ref) - f.indexOf(g.ref));
    return u ? h : h.filter((v) => v.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ Z({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Si();
      return we(h, () => {
        r.collectionRef.value = h.value;
      }), () => mt(Rs, {
        ref: p,
        ...f
      }, d);
    }
  }), a = /* @__PURE__ */ Z({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Si();
      return dt((v) => {
        if (h.value) {
          const g = yl(h.value);
          r.itemMap.value.set(g, {
            ref: h.value,
            value: u.value
          }), v(() => r.itemMap.value.delete(g));
        }
      }), () => mt(Rs, {
        ...f,
        [Sa]: "",
        ref: p
      }, d);
    }
  }), l = F(() => Array.from(r.itemMap.value.values())), c = F(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const Km = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Xm(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Gm(t, e, n) {
  const i = Xm(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Km[i];
}
var Ym = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), G(m(Pe), {
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
      default: q(() => [ce(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Uu = Ym, Jm = /* @__PURE__ */ Z({
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
    const e = t, { primitiveElement: n, currentElement: i } = Si(), r = F(() => e.checked ?? e.value);
    return we(r, (s, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (M(), G(Uu, Ce({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Ca = Jm, Zm = /* @__PURE__ */ Z({
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
    const e = t, n = F(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = F(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (r, s) => (M(), le(Ee, null, [de(" We render single input if it's required "), n.value ? (M(), G(Ca, Ce({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (M(!0), le(Ee, { key: 1 }, Pn(i.value, (o) => (M(), G(Ca, Ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Qm = Zm;
const [Ku, ev] = $t("PopperRoot");
var tv = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ N();
    return ev({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, i) => ce(n.$slots, "default");
  }
}), nv = tv, iv = /* @__PURE__ */ Z({
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
    const e = t, { forwardRef: n, currentElement: i } = Re(), r = Ku();
    return Al(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (s, o) => (M(), G(m(Pe), {
      ref: m(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: q(() => [ce(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), rv = iv;
function sv(t) {
  return t !== null;
}
function ov(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: i, middlewareData: r } = e, o = r.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [c, u] = Is(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (r.arrow?.x ?? 0) + a / 2, p = (r.arrow?.y ?? 0) + l / 2;
      let h = "", v = "";
      return c === "bottom" ? (h = o ? d : `${f}px`, v = `${-l}px`) : c === "top" ? (h = o ? d : `${f}px`, v = `${i.floating.height + l}px`) : c === "right" ? (h = `${-l}px`, v = o ? d : `${p}px`) : c === "left" && (h = `${i.floating.width + l}px`, v = o ? d : `${p}px`), { data: {
        x: h,
        y: v
      } };
    }
  };
}
function Is(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const av = ["top", "right", "bottom", "left"], cn = Math.min, it = Math.max, fr = Math.round, Hi = Math.floor, Rt = (t) => ({
  x: t,
  y: t
}), lv = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, uv = {
  start: "end",
  end: "start"
};
function Ls(t, e, n) {
  return it(t, cn(e, n));
}
function Jt(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function Zt(t) {
  return t.split("-")[0];
}
function Xn(t) {
  return t.split("-")[1];
}
function oo(t) {
  return t === "x" ? "y" : "x";
}
function ao(t) {
  return t === "y" ? "height" : "width";
}
const cv = /* @__PURE__ */ new Set(["top", "bottom"]);
function Ot(t) {
  return cv.has(Zt(t)) ? "y" : "x";
}
function lo(t) {
  return oo(Ot(t));
}
function dv(t, e, n) {
  n === void 0 && (n = !1);
  const i = Xn(t), r = lo(t), s = ao(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = pr(o)), [o, pr(o)];
}
function fv(t) {
  const e = pr(t);
  return [Ds(t), e, Ds(e)];
}
function Ds(t) {
  return t.replace(/start|end/g, (e) => uv[e]);
}
const Ea = ["left", "right"], Ta = ["right", "left"], pv = ["top", "bottom"], hv = ["bottom", "top"];
function mv(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Ta : Ea : e ? Ea : Ta;
    case "left":
    case "right":
      return e ? pv : hv;
    default:
      return [];
  }
}
function vv(t, e, n, i) {
  const r = Xn(t);
  let s = mv(Zt(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(Ds)))), s;
}
function pr(t) {
  return t.replace(/left|right|bottom|top/g, (e) => lv[e]);
}
function gv(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Xu(t) {
  return typeof t != "number" ? gv(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function hr(t) {
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
function ka(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = Ot(e), o = lo(e), a = ao(o), l = Zt(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
  let p;
  switch (l) {
    case "top":
      p = {
        x: u,
        y: i.y - r.height
      };
      break;
    case "bottom":
      p = {
        x: u,
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
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      p = {
        x: i.x,
        y: i.y
      };
  }
  switch (Xn(e)) {
    case "start":
      p[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      p[o] += f * (n && c ? -1 : 1);
      break;
  }
  return p;
}
async function yv(t, e) {
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
    altBoundary: f = !1,
    padding: p = 0
  } = Jt(e, t), h = Xu(p), g = a[f ? d === "floating" ? "reference" : "floating" : d], C = hr(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(g))) == null || n ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), _ = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), y = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, E = hr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: _,
    offsetParent: x,
    strategy: l
  }) : _);
  return {
    top: (C.top - E.top + h.top) / y.y,
    bottom: (E.bottom - C.bottom + h.bottom) / y.y,
    left: (C.left - E.left + h.left) / y.x,
    right: (E.right - C.right + h.right) / y.x
  };
}
const bv = async (t, e, n) => {
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
  } = ka(c, i, l), f = i, p = {}, h = 0;
  for (let g = 0; g < a.length; g++) {
    var v;
    const {
      name: C,
      fn: _
    } = a[g], {
      x,
      y,
      data: E,
      reset: T
    } = await _({
      x: u,
      y: d,
      initialPlacement: i,
      placement: f,
      strategy: r,
      middlewareData: p,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (v = o.detectOverflow) != null ? v : yv
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = x ?? u, d = y ?? d, p = {
      ...p,
      [C]: {
        ...p[C],
        ...E
      }
    }, T && h <= 50 && (h++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (c = T.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : T.rects), {
      x: u,
      y: d
    } = ka(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: p
  };
}, _v = (t) => ({
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
    } = Jt(t, e) || {};
    if (c == null)
      return {};
    const d = Xu(u), f = {
      x: n,
      y: i
    }, p = lo(r), h = ao(p), v = await o.getDimensions(c), g = p === "y", C = g ? "top" : "left", _ = g ? "bottom" : "right", x = g ? "clientHeight" : "clientWidth", y = s.reference[h] + s.reference[p] - f[p] - s.floating[h], E = f[p] - s.reference[p], T = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let S = T ? T[x] : 0;
    (!S || !await (o.isElement == null ? void 0 : o.isElement(T))) && (S = a.floating[x] || s.floating[h]);
    const R = y / 2 - E / 2, k = S / 2 - v[h] / 2 - 1, A = cn(d[C], k), I = cn(d[_], k), P = A, H = S - v[h] - I, L = S / 2 - v[h] / 2 + R, U = Ls(P, L, H), ne = !l.arrow && Xn(r) != null && L !== U && s.reference[h] / 2 - (L < P ? A : I) - v[h] / 2 < 0, J = ne ? L < P ? L - P : L - H : 0;
    return {
      [p]: f[p] + J,
      data: {
        [p]: U,
        centerOffset: L - U - J,
        ...ne && {
          alignmentOffset: J
        }
      },
      reset: ne
    };
  }
}), wv = function(t) {
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
        fallbackPlacements: f,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: v = !0,
        ...g
      } = Jt(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const C = Zt(r), _ = Ot(a), x = Zt(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), E = f || (x || !v ? [pr(a)] : fv(a)), T = h !== "none";
      !f && T && E.push(...vv(a, v, h, y));
      const S = [a, ...E], R = await l.detectOverflow(e, g), k = [];
      let A = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && k.push(R[C]), d) {
        const L = dv(r, o, y);
        k.push(R[L[0]], R[L[1]]);
      }
      if (A = [...A, {
        placement: r,
        overflows: k
      }], !k.every((L) => L <= 0)) {
        var I, P;
        const L = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, U = S[L];
        if (U && (!(d === "alignment" ? _ !== Ot(U) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((Q) => Ot(Q.placement) === _ ? Q.overflows[0] > 0 : !0)))
          return {
            data: {
              index: L,
              overflows: A
            },
            reset: {
              placement: U
            }
          };
        let ne = (P = A.filter((J) => J.overflows[0] <= 0).sort((J, Q) => J.overflows[1] - Q.overflows[1])[0]) == null ? void 0 : P.placement;
        if (!ne)
          switch (p) {
            case "bestFit": {
              var H;
              const J = (H = A.filter((Q) => {
                if (T) {
                  const be = Ot(Q.placement);
                  return be === _ || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  be === "y";
                }
                return !0;
              }).map((Q) => [Q.placement, Q.overflows.filter((be) => be > 0).reduce((be, Ie) => be + Ie, 0)]).sort((Q, be) => Q[1] - be[1])[0]) == null ? void 0 : H[0];
              J && (ne = J);
              break;
            }
            case "initialPlacement":
              ne = a;
              break;
          }
        if (r !== ne)
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
function Aa(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function Pa(t) {
  return av.some((e) => t[e] >= 0);
}
const xv = function(t) {
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
      } = Jt(t, e);
      switch (r) {
        case "referenceHidden": {
          const o = await i.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Aa(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Pa(a)
            }
          };
        }
        case "escaped": {
          const o = await i.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Aa(o, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Pa(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Gu = /* @__PURE__ */ new Set(["left", "top"]);
async function Sv(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = Zt(n), a = Xn(n), l = Ot(n) === "y", c = Gu.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Jt(e, t);
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
const Cv = function(t) {
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
      } = e, l = await Sv(e, t);
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
}, Ev = function(t) {
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
              y: x
            } = C;
            return {
              x: _,
              y: x
            };
          }
        },
        ...c
      } = Jt(t, e), u = {
        x: n,
        y: i
      }, d = await s.detectOverflow(e, c), f = Ot(Zt(r)), p = oo(f);
      let h = u[p], v = u[f];
      if (o) {
        const C = p === "y" ? "top" : "left", _ = p === "y" ? "bottom" : "right", x = h + d[C], y = h - d[_];
        h = Ls(x, h, y);
      }
      if (a) {
        const C = f === "y" ? "top" : "left", _ = f === "y" ? "bottom" : "right", x = v + d[C], y = v - d[_];
        v = Ls(x, v, y);
      }
      const g = l.fn({
        ...e,
        [p]: h,
        [f]: v
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - i,
          enabled: {
            [p]: o,
            [f]: a
          }
        }
      };
    }
  };
}, Tv = function(t) {
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
      } = Jt(t, e), u = {
        x: n,
        y: i
      }, d = Ot(r), f = oo(d);
      let p = u[f], h = u[d];
      const v = Jt(a, e), g = typeof v == "number" ? {
        mainAxis: v,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...v
      };
      if (l) {
        const x = f === "y" ? "height" : "width", y = s.reference[f] - s.floating[x] + g.mainAxis, E = s.reference[f] + s.reference[x] - g.mainAxis;
        p < y ? p = y : p > E && (p = E);
      }
      if (c) {
        var C, _;
        const x = f === "y" ? "width" : "height", y = Gu.has(Zt(r)), E = s.reference[d] - s.floating[x] + (y && ((C = o.offset) == null ? void 0 : C[d]) || 0) + (y ? 0 : g.crossAxis), T = s.reference[d] + s.reference[x] + (y ? 0 : ((_ = o.offset) == null ? void 0 : _[d]) || 0) - (y ? g.crossAxis : 0);
        h < E ? h = E : h > T && (h = T);
      }
      return {
        [f]: p,
        [d]: h
      };
    }
  };
}, kv = function(t) {
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
      } = Jt(t, e), u = await o.detectOverflow(e, c), d = Zt(r), f = Xn(r), p = Ot(r) === "y", {
        width: h,
        height: v
      } = s.floating;
      let g, C;
      d === "top" || d === "bottom" ? (g = d, C = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (C = d, g = f === "end" ? "top" : "bottom");
      const _ = v - u.top - u.bottom, x = h - u.left - u.right, y = cn(v - u[g], _), E = cn(h - u[C], x), T = !e.middlewareData.shift;
      let S = y, R = E;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (R = x), (i = e.middlewareData.shift) != null && i.enabled.y && (S = _), T && !f) {
        const A = it(u.left, 0), I = it(u.right, 0), P = it(u.top, 0), H = it(u.bottom, 0);
        p ? R = h - 2 * (A !== 0 || I !== 0 ? A + I : it(u.left, u.right)) : S = v - 2 * (P !== 0 || H !== 0 ? P + H : it(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: R,
        availableHeight: S
      });
      const k = await o.getDimensions(a.floating);
      return h !== k.width || v !== k.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Fr() {
  return typeof window < "u";
}
function Mn(t) {
  return uo(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function st(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Bt(t) {
  var e;
  return (e = (uo(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function uo(t) {
  return Fr() ? t instanceof Node || t instanceof st(t).Node : !1;
}
function bt(t) {
  return Fr() ? t instanceof Element || t instanceof st(t).Element : !1;
}
function Lt(t) {
  return Fr() ? t instanceof HTMLElement || t instanceof st(t).HTMLElement : !1;
}
function Oa(t) {
  return !Fr() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof st(t).ShadowRoot;
}
const Av = /* @__PURE__ */ new Set(["inline", "contents"]);
function Ii(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = _t(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !Av.has(r);
}
const Pv = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Ov(t) {
  return Pv.has(Mn(t));
}
const Mv = [":popover-open", ":modal"];
function Nr(t) {
  return Mv.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Rv = ["transform", "translate", "scale", "rotate", "perspective"], Iv = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Lv = ["paint", "layout", "strict", "content"];
function co(t) {
  const e = fo(), n = bt(t) ? _t(t) : t;
  return Rv.some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Iv.some((i) => (n.willChange || "").includes(i)) || Lv.some((i) => (n.contain || "").includes(i));
}
function Dv(t) {
  let e = dn(t);
  for (; Lt(e) && !Un(e); ) {
    if (co(e))
      return e;
    if (Nr(e))
      return null;
    e = dn(e);
  }
  return null;
}
function fo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const $v = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Un(t) {
  return $v.has(Mn(t));
}
function _t(t) {
  return st(t).getComputedStyle(t);
}
function zr(t) {
  return bt(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function dn(t) {
  if (Mn(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Oa(t) && t.host || // Fallback.
    Bt(t)
  );
  return Oa(e) ? e.host : e;
}
function Yu(t) {
  const e = dn(t);
  return Un(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Lt(e) && Ii(e) ? e : Yu(e);
}
function Ci(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = Yu(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = st(r);
  if (s) {
    const a = $s(o);
    return e.concat(o, o.visualViewport || [], Ii(r) ? r : [], a && n ? Ci(a) : []);
  }
  return e.concat(r, Ci(r, [], n));
}
function $s(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Ju(t) {
  const e = _t(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Lt(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = fr(n) !== s || fr(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function po(t) {
  return bt(t) ? t : t.contextElement;
}
function Vn(t) {
  const e = po(t);
  if (!Lt(e))
    return Rt(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Ju(e);
  let o = (s ? fr(n.width) : n.width) / i, a = (s ? fr(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Bv = /* @__PURE__ */ Rt(0);
function Zu(t) {
  const e = st(t);
  return !fo() || !e.visualViewport ? Bv : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Fv(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== st(t) ? !1 : e;
}
function kn(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = po(t);
  let o = Rt(1);
  e && (i ? bt(i) && (o = Vn(i)) : o = Vn(t));
  const a = Fv(s, n, i) ? Zu(s) : Rt(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = st(s), p = i && bt(i) ? st(i) : i;
    let h = f, v = $s(h);
    for (; v && i && p !== h; ) {
      const g = Vn(v), C = v.getBoundingClientRect(), _ = _t(v), x = C.left + (v.clientLeft + parseFloat(_.paddingLeft)) * g.x, y = C.top + (v.clientTop + parseFloat(_.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += x, c += y, h = st(v), v = $s(h);
    }
  }
  return hr({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function qr(t, e) {
  const n = zr(t).scrollLeft;
  return e ? e.left + n : kn(Bt(t)).left + n;
}
function Qu(t, e) {
  const n = t.getBoundingClientRect(), i = n.left + e.scrollLeft - qr(t, n), r = n.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function Nv(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = Bt(i), a = e ? Nr(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Rt(1);
  const u = Rt(0), d = Lt(i);
  if ((d || !d && !s) && ((Mn(i) !== "body" || Ii(o)) && (l = zr(i)), Lt(i))) {
    const p = kn(i);
    c = Vn(i), u.x = p.x + i.clientLeft, u.y = p.y + i.clientTop;
  }
  const f = o && !d && !s ? Qu(o, l) : Rt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function zv(t) {
  return Array.from(t.getClientRects());
}
function qv(t) {
  const e = Bt(t), n = zr(t), i = t.ownerDocument.body, r = it(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = it(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + qr(t);
  const a = -n.scrollTop;
  return _t(i).direction === "rtl" && (o += it(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const Ma = 25;
function Hv(t, e) {
  const n = st(t), i = Bt(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const u = fo();
    (!u || u && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const c = qr(i);
  if (c <= 0) {
    const u = i.ownerDocument, d = u.body, f = getComputedStyle(d), p = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, h = Math.abs(i.clientWidth - d.clientWidth - p);
    h <= Ma && (s -= h);
  } else c <= Ma && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Vv = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Wv(t, e) {
  const n = kn(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = Lt(t) ? Vn(t) : Rt(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Ra(t, e, n) {
  let i;
  if (e === "viewport")
    i = Hv(t, n);
  else if (e === "document")
    i = qv(Bt(t));
  else if (bt(e))
    i = Wv(e, n);
  else {
    const r = Zu(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return hr(i);
}
function ec(t, e) {
  const n = dn(t);
  return n === e || !bt(n) || Un(n) ? !1 : _t(n).position === "fixed" || ec(n, e);
}
function jv(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Ci(t, [], !1).filter((a) => bt(a) && Mn(a) !== "body"), r = null;
  const s = _t(t).position === "fixed";
  let o = s ? dn(t) : t;
  for (; bt(o) && !Un(o); ) {
    const a = _t(o), l = co(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && Vv.has(r.position) || Ii(o) && !l && ec(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = dn(o);
  }
  return e.set(t, i), i;
}
function Uv(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Nr(e) ? [] : jv(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = Ra(e, u, r);
    return c.top = it(d.top, c.top), c.right = cn(d.right, c.right), c.bottom = cn(d.bottom, c.bottom), c.left = it(d.left, c.left), c;
  }, Ra(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Kv(t) {
  const {
    width: e,
    height: n
  } = Ju(t);
  return {
    width: e,
    height: n
  };
}
function Xv(t, e, n) {
  const i = Lt(e), r = Bt(e), s = n === "fixed", o = kn(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Rt(0);
  function c() {
    l.x = qr(r);
  }
  if (i || !i && !s)
    if ((Mn(e) !== "body" || Ii(r)) && (a = zr(e)), i) {
      const p = kn(e, !0, s, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Qu(r, a) : Rt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function cs(t) {
  return _t(t).position === "static";
}
function Ia(t, e) {
  if (!Lt(t) || _t(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return Bt(t) === n && (n = n.ownerDocument.body), n;
}
function tc(t, e) {
  const n = st(t);
  if (Nr(t))
    return n;
  if (!Lt(t)) {
    let r = dn(t);
    for (; r && !Un(r); ) {
      if (bt(r) && !cs(r))
        return r;
      r = dn(r);
    }
    return n;
  }
  let i = Ia(t, e);
  for (; i && Ov(i) && cs(i); )
    i = Ia(i, e);
  return i && Un(i) && cs(i) && !co(i) ? n : i || Dv(t) || n;
}
const Gv = async function(t) {
  const e = this.getOffsetParent || tc, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Xv(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Yv(t) {
  return _t(t).direction === "rtl";
}
const Jv = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Nv,
  getDocumentElement: Bt,
  getClippingRect: Uv,
  getOffsetParent: tc,
  getElementRects: Gv,
  getClientRects: zv,
  getDimensions: Kv,
  getScale: Vn,
  isElement: bt,
  isRTL: Yv
};
function nc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Zv(t, e) {
  let n = null, i;
  const r = Bt(t);
  function s() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = t.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: p
    } = c;
    if (a || e(), !f || !p)
      return;
    const h = Hi(d), v = Hi(r.clientWidth - (u + f)), g = Hi(r.clientHeight - (d + p)), C = Hi(u), x = {
      rootMargin: -h + "px " + -v + "px " + -g + "px " + -C + "px",
      threshold: it(0, cn(1, l)) || 1
    };
    let y = !0;
    function E(T) {
      const S = T[0].intersectionRatio;
      if (S !== l) {
        if (!y)
          return o();
        S ? o(!1, S) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      S === 1 && !nc(c, t.getBoundingClientRect()) && o(), y = !1;
    }
    try {
      n = new IntersectionObserver(E, {
        ...x,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(E, x);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function Qv(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = po(t), u = r || s ? [...c ? Ci(c) : [], ...Ci(e)] : [];
  u.forEach((C) => {
    r && C.addEventListener("scroll", n, {
      passive: !0
    }), s && C.addEventListener("resize", n);
  });
  const d = c && a ? Zv(c, n) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((C) => {
    let [_] = C;
    _ && _.target === c && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = p) == null || x.observe(e);
    })), n();
  }), c && !l && p.observe(c), p.observe(e));
  let h, v = l ? kn(t) : null;
  l && g();
  function g() {
    const C = kn(t);
    v && !nc(v, C) && n(), v = C, h = requestAnimationFrame(g);
  }
  return n(), () => {
    var C;
    u.forEach((_) => {
      r && _.removeEventListener("scroll", n), s && _.removeEventListener("resize", n);
    }), d?.(), (C = p) == null || C.disconnect(), p = null, l && cancelAnimationFrame(h);
  };
}
const eg = Cv, tg = Ev, La = wv, ng = kv, ig = xv, rg = _v, sg = Tv, og = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Jv,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return bv(t, e, {
    ...r,
    platform: s
  });
};
function ag(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function Bs(t) {
  if (ag(t)) {
    const e = t.$el;
    return uo(e) && Mn(e) === "#comment" ? null : e;
  }
  return t;
}
function Bn(t) {
  return typeof t == "function" ? t() : m(t);
}
function lg(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = Bs(Bn(t.element));
      return n == null ? {} : rg({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function ic(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Da(t, e) {
  const n = ic(t);
  return Math.round(e * n) / n;
}
function ug(t, e, n) {
  n === void 0 && (n = {});
  const i = n.whileElementsMounted, r = F(() => {
    var S;
    return (S = Bn(n.open)) != null ? S : !0;
  }), s = F(() => Bn(n.middleware)), o = F(() => {
    var S;
    return (S = Bn(n.placement)) != null ? S : "bottom";
  }), a = F(() => {
    var S;
    return (S = Bn(n.strategy)) != null ? S : "absolute";
  }), l = F(() => {
    var S;
    return (S = Bn(n.transform)) != null ? S : !0;
  }), c = F(() => Bs(t.value)), u = F(() => Bs(e.value)), d = /* @__PURE__ */ N(0), f = /* @__PURE__ */ N(0), p = /* @__PURE__ */ N(a.value), h = /* @__PURE__ */ N(o.value), v = /* @__PURE__ */ Tn({}), g = /* @__PURE__ */ N(!1), C = F(() => {
    const S = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return S;
    const R = Da(u.value, d.value), k = Da(u.value, f.value);
    return l.value ? {
      ...S,
      transform: "translate(" + R + "px, " + k + "px)",
      ...ic(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: R + "px",
      top: k + "px"
    };
  });
  let _;
  function x() {
    if (c.value == null || u.value == null)
      return;
    const S = r.value;
    og(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((R) => {
      d.value = R.x, f.value = R.y, p.value = R.strategy, h.value = R.placement, v.value = R.middlewareData, g.value = S !== !1;
    });
  }
  function y() {
    typeof _ == "function" && (_(), _ = void 0);
  }
  function E() {
    if (y(), i === void 0) {
      x();
      return;
    }
    if (c.value != null && u.value != null) {
      _ = i(c.value, u.value, x);
      return;
    }
  }
  function T() {
    r.value || (g.value = !1);
  }
  return we([s, o, a, r], x, {
    flush: "sync"
  }), we([c, u], E, {
    flush: "sync"
  }), we(r, T, {
    flush: "sync"
  }), Ws() && tl(y), {
    x: /* @__PURE__ */ In(d),
    y: /* @__PURE__ */ In(f),
    strategy: /* @__PURE__ */ In(p),
    placement: /* @__PURE__ */ In(h),
    middlewareData: /* @__PURE__ */ In(v),
    isPositioned: /* @__PURE__ */ In(g),
    floatingStyles: C,
    update: x
  };
}
const cg = {
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
}, [Wb, dg] = $t("PopperContent");
var fg = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Pd({
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
  }, { ...cg }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = Ku(), { forwardRef: s, currentElement: o } = Re(), a = /* @__PURE__ */ N(), l = /* @__PURE__ */ N(), { width: c, height: u } = fm(l), d = F(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), f = F(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), p = F(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = F(() => ({
      padding: f.value,
      boundary: p.value.filter(sv),
      altBoundary: p.value.length > 0
    })), v = F(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), g = zh(() => [
      eg({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && La({
        ...h.value,
        ...v.value
      }),
      n.avoidCollisions && tg({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? sg() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && La({
        ...h.value,
        ...v.value
      }),
      ng({
        ...h.value,
        apply: ({ elements: P, rects: H, availableWidth: L, availableHeight: U }) => {
          const { width: ne, height: J } = H.reference, Q = P.floating.style;
          Q.setProperty("--reka-popper-available-width", `${L}px`), Q.setProperty("--reka-popper-available-height", `${U}px`), Q.setProperty("--reka-popper-anchor-width", `${ne}px`), Q.setProperty("--reka-popper-anchor-height", `${J}px`);
        }
      }),
      l.value && lg({
        element: l.value,
        padding: n.arrowPadding
      }),
      ov({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && ig({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), C = F(() => n.reference ?? r.anchor.value), { floatingStyles: _, placement: x, isPositioned: y, middlewareData: E } = ug(C, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...P) => Qv(...P, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: g
    }), T = F(() => Is(x.value)[0]), S = F(() => Is(x.value)[1]);
    Al(() => {
      y.value && i("placed");
    });
    const R = F(() => {
      const P = E.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && P;
    }), k = /* @__PURE__ */ N("");
    dt(() => {
      o.value && (k.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = F(() => E.value.arrow?.x ?? 0), I = F(() => E.value.arrow?.y ?? 0);
    return dg({
      placedSide: T,
      onArrowChange: (P) => l.value = P,
      arrowX: A,
      arrowY: I,
      shouldHideArrow: R
    }), (P, H) => (M(), le("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Dt({
        ...m(_),
        transform: m(y) ? m(_).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: k.value,
        "--reka-popper-transform-origin": [m(E).transformOrigin?.x, m(E).transformOrigin?.y].join(" "),
        ...m(E).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [V(m(Pe), Ce({ ref: m(s) }, P.$attrs, {
      "as-child": n.asChild,
      as: P.as,
      "data-side": T.value,
      "data-align": S.value,
      style: { animation: m(y) ? void 0 : "none" }
    }), {
      default: q(() => [ce(P.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), pg = fg;
function hg(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => di(i, e, n)) : di(t, e, n);
}
function di(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : dr(t, e);
}
const [ho, mg] = $t("ListboxRoot");
var vg = /* @__PURE__ */ Z({
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
    const i = t, r = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ Kn(i), { getItems: d } = hn({ isProvider: !0 }), { handleTypeaheadSearch: f } = ro(), { primitiveElement: p, currentElement: h } = Si(), v = dm(), g = Mu(u), C = Ru(h), _ = /* @__PURE__ */ N(), x = /* @__PURE__ */ N(!1), y = /* @__PURE__ */ N(!0), E = /* @__PURE__ */ wi(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function T(X) {
      if (x.value = !0, i.multiple) {
        const re = Array.isArray(E.value) ? [...E.value] : [], ue = re.findIndex((pe) => di(pe, X, i.by));
        i.selectionBehavior === "toggle" ? (ue === -1 ? re.push(X) : re.splice(ue, 1), E.value = re) : (E.value = [X], _.value = X);
      } else i.selectionBehavior === "toggle" && di(E.value, X, i.by) ? E.value = void 0 : E.value = X;
      setTimeout(() => {
        x.value = !1;
      }, 1);
    }
    const S = /* @__PURE__ */ N(null), R = /* @__PURE__ */ N(null), k = /* @__PURE__ */ N(!1), A = /* @__PURE__ */ N(!1), I = /* @__PURE__ */ is(), P = /* @__PURE__ */ is(), H = /* @__PURE__ */ is();
    function L() {
      return d().map((X) => X.ref).filter((X) => X.dataset.disabled !== "");
    }
    function U(X, re = !0) {
      if (!X) return;
      S.value = X, y.value && S.value.focus(), re && S.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((pe) => pe.ref === X);
      r("highlight", ue);
    }
    function ne(X) {
      if (k.value) H.trigger(X);
      else {
        const re = d().find((ue) => di(ue.value, X, i.by));
        re && (S.value = re.ref, U(re.ref));
      }
    }
    function J(X) {
      S.value && S.value.isConnected && (X.preventDefault(), X.stopPropagation(), A.value || S.value.click());
    }
    function Q(X) {
      if (y.value) {
        if (x.value = !0, k.value) P.trigger(X);
        else {
          const re = X.altKey || X.ctrlKey || X.metaKey;
          if (re && X.key === "a" && s.value) {
            const ue = d(), pe = ue.map((ft) => ft.value);
            E.value = [...pe], X.preventDefault(), U(ue[ue.length - 1].ref);
          } else if (!re) {
            const ue = f(X.key, d());
            ue && U(ue);
          }
        }
        setTimeout(() => {
          x.value = !1;
        }, 1);
      }
    }
    function be() {
      A.value = !0;
    }
    function Ie() {
      Me(() => {
        A.value = !1;
      });
    }
    function Je() {
      Me(() => {
        const X = new KeyboardEvent("keydown", { key: "PageUp" });
        Nt(X);
      });
    }
    function Ae(X) {
      const re = S.value;
      re?.isConnected && (R.value = re), S.value = null, r("leave", X);
    }
    function Ft(X) {
      const re = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (X.currentTarget?.dispatchEvent(re), r("entryFocus", re), !re.defaultPrevented)
        if (R.value) U(R.value);
        else {
          const ue = L()?.[0];
          U(ue);
        }
    }
    function Nt(X) {
      const re = Gm(X, a.value, g.value);
      if (!re) return;
      let ue = L();
      if (S.value) {
        if (re === "last") ue.reverse();
        else if (re === "prev" || re === "next") {
          re === "prev" && ue.reverse();
          const pe = ue.indexOf(S.value);
          ue = ue.slice(pe + 1);
        }
        Gn(X, ue[0]);
      }
      if (ue.length) {
        const pe = !S.value && re === "prev" ? ue.length - 1 : 0;
        U(ue[pe]);
      }
      if (k.value) return P.trigger(X);
    }
    function Gn(X, re) {
      if (!(k.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(E.value) || (X.altKey || X.ctrlKey || X.metaKey) && !X.shiftKey) && X.shiftKey) {
        const pe = d().filter((w) => w.ref.dataset.disabled !== "");
        let ft = pe.find((w) => w.ref === re)?.value;
        if (X.key === v.END ? ft = pe[pe.length - 1].value : X.key === v.HOME && (ft = pe[0].value), !ft || !_.value) return;
        const b = Nh(pe.map((w) => w.value), _.value, ft);
        E.value = b;
      }
    }
    async function zt(X) {
      if (await Me(), k.value) I.trigger(X);
      else {
        const re = L(), ue = re.find((pe) => pe.dataset.state === "checked");
        ue ? U(ue) : re.length && U(re[0]);
      }
    }
    return we(E, () => {
      x.value || Me(() => {
        zt();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: S,
      highlightItem: ne,
      highlightFirstItem: Je,
      highlightSelected: zt,
      getItems: d
    }), mg({
      modelValue: E,
      onValueChange: T,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: S,
      isVirtual: k,
      virtualFocusHook: I,
      virtualKeydownHook: P,
      virtualHighlightHook: H,
      by: i.by,
      firstValue: _,
      selectionBehavior: c,
      focusable: y,
      onLeave: Ae,
      onEnter: Ft,
      changeHighlight: U,
      onKeydownEnter: J,
      onKeydownNavigation: Nt,
      onKeydownTypeAhead: Q,
      onCompositionStart: be,
      onCompositionEnd: Ie,
      highlightFirstItem: Je
    }), (X, re) => (M(), G(m(Pe), {
      ref_key: "primitiveElement",
      ref: p,
      as: X.as,
      "as-child": X.asChild,
      dir: m(g),
      "data-disabled": m(l) ? "" : void 0,
      onPointerleave: Ae,
      onFocusout: re[0] || (re[0] = async (ue) => {
        const pe = ue.relatedTarget || ue.target;
        await Me(), S.value && m(h) && !m(h).contains(pe) && Ae(ue);
      })
    }, {
      default: q(() => [ce(X.$slots, "default", { modelValue: m(E) }), m(C) && X.name ? (M(), G(m(Qm), {
        key: 0,
        name: X.name,
        value: m(E),
        disabled: m(l),
        required: X.required
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
}), gg = vg, yg = /* @__PURE__ */ Z({
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
    const { CollectionSlot: e } = hn(), n = ho(), i = Tu(!1, 10);
    return (r, s) => (M(), G(m(e), null, {
      default: q(() => [V(m(Pe), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: m(n).focusable.value ? m(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": m(n).orientation.value,
        "aria-multiselectable": !!m(n).multiple.value,
        "data-orientation": m(n).orientation.value,
        onMousedown: s[0] || (s[0] = ln((o) => i.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          m(i) || m(n).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = _i((o) => {
            m(n).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || m(n).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), m(n).focusable.value && m(n).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          _i(m(n).onKeydownEnter, ["enter"]),
          m(n).onKeydownTypeAhead
        ]
      }, {
        default: q(() => [ce(r.$slots, "default")]),
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
}), bg = yg, _g = /* @__PURE__ */ Z({
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
    const n = t, r = /* @__PURE__ */ wi(n, "modelValue", e, {
      defaultValue: "",
      passive: n.modelValue === void 0
    }), s = ho(), { primitiveElement: o, currentElement: a } = Si(), l = F(() => n.disabled || s.disabled.value || !1), c = /* @__PURE__ */ N();
    return Pl(() => c.value = s.highlightedElement.value?.id), De(() => {
      s.focusable.value = !1, setTimeout(() => {
        n.autoFocus && a.value?.focus();
      }, 1);
    }), fn(() => {
      s.focusable.value = !0;
    }), (u, d) => (M(), G(m(Pe), {
      ref_key: "primitiveElement",
      ref: o,
      as: u.as,
      "as-child": u.asChild,
      value: m(r),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": c.value,
      type: "text",
      onKeydown: [_i(ln(m(s).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), _i(m(s).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (f) => {
        r.value = f.target.value, m(s).highlightFirstItem();
      }),
      onCompositionstart: m(s).onCompositionStart,
      onCompositionend: m(s).onCompositionEnd
    }, {
      default: q(() => [ce(u.$slots, "default", { modelValue: m(r) })]),
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
}), wg = _g;
const xg = "listbox.select", [Sg, Cg] = $t("ListboxItem");
var Eg = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = xi(void 0, "reka-listbox-item"), { CollectionItem: s } = hn(), { forwardRef: o, currentElement: a } = Re(), l = ho(), c = F(() => a.value === l.highlightedElement.value), u = F(() => hg(l.modelValue.value, n.value, l.by)), d = F(() => l.disabled.value || n.disabled);
    async function f(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function p(h) {
      const v = {
        originalEvent: h,
        value: n.value
      };
      Lr(xg, f, v);
    }
    return Cg({ isSelected: u }), (h, v) => (M(), G(m(s), { value: h.value }, {
      default: q(() => [pf([c.value, u.value], () => V(m(Pe), Ce({ id: m(r) }, h.$attrs, {
        ref: m(o),
        role: "option",
        tabindex: m(l).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: h.as,
        "as-child": h.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: p,
        onKeydown: _i(ln(p, ["prevent"]), ["space"]),
        onPointermove: v[0] || (v[0] = () => {
          m(l).highlightedElement.value !== m(a) && m(l).highlightOnHover.value && !m(l).focusable.value && m(l).changeHighlight(m(a), !1);
        })
      }), {
        default: q(() => [ce(h.$slots, "default")]),
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
      ]), v, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Tg = Eg, kg = /* @__PURE__ */ Z({
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
    const n = Sg();
    return (i, r) => m(n).isSelected.value ? (M(), G(m(Pe), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), Ag = kg;
function Pg(t) {
  const e = no({ nonce: /* @__PURE__ */ N() });
  return F(() => t?.value || e.nonce?.value);
}
const Og = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Mg = [" ", "Enter"], pt = 10;
function Ei(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => Fs(i, e, n)) : Fs(t, e, n);
}
function Fs(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : dr(t, e);
}
function Rg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const Ig = {
  key: 0,
  value: ""
}, [mn, rc] = $t("SelectRoot");
var Lg = /* @__PURE__ */ Z({
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
    const n = t, i = e, { required: r, disabled: s, multiple: o, dir: a } = /* @__PURE__ */ Kn(n), l = /* @__PURE__ */ wi(n, "modelValue", i, {
      defaultValue: n.defaultValue ?? (o.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ wi(n, "open", i, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = /* @__PURE__ */ N(), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N({
      x: 0,
      y: 0
    }), p = F(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Os(l.value));
    hn({ isProvider: !0 });
    const h = Mu(a), v = Ru(u), g = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), C = F(() => Array.from(g.value).map((y) => y.value).join(";"));
    function _(y) {
      if (o.value) {
        const E = Array.isArray(l.value) ? [...l.value] : [], T = E.findIndex((S) => Fs(S, y, n.by));
        T === -1 ? E.push(y) : E.splice(T, 1), l.value = [...E];
      } else l.value = y;
    }
    function x(y) {
      return Array.from(g.value).find((E) => Ei(y, E.value, n.by));
    }
    return rc({
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
      multiple: o,
      required: r,
      onOpenChange: (y) => {
        c.value = y;
      },
      dir: h,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: p,
      optionsSet: g,
      onOptionAdd: (y) => {
        const E = x(y.value);
        E && g.value.delete(E), g.value.add(y);
      },
      onOptionRemove: (y) => {
        const E = x(y.value);
        E && g.value.delete(E);
      }
    }), (y, E) => (M(), G(m(nv), null, {
      default: q(() => [ce(y.$slots, "default", {
        modelValue: m(l),
        open: m(c)
      }), m(v) ? (M(), G(Bg, {
        key: C.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: m(o),
        required: m(r),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: m(s),
        value: m(l)
      }, {
        default: q(() => [m(Os)(m(l)) ? (M(), le("option", Ig)) : de("v-if", !0), (M(!0), le(Ee, null, Pn(Array.from(g.value), (T) => (M(), le("option", Ce({ key: T.value ?? "" }, { ref_for: !0 }, T), null, 16))), 128))]),
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
}), Dg = Lg, $g = /* @__PURE__ */ Z({
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
    const e = t, n = /* @__PURE__ */ N(), i = mn();
    we(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && n.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(n.value, s), n.value.dispatchEvent(u);
      }
    });
    function r(s) {
      i.onValueChange(s.target.value);
    }
    return (s, o) => (M(), G(m(Uu), { "as-child": "" }, {
      default: q(() => [oe("select", Ce({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: r }), [ce(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Bg = $g, Fg = /* @__PURE__ */ Z({
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
      default: pt
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
    const n = io(t);
    return (i, r) => (M(), G(m(pg), Ce(m(n), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ng = Fg;
const zg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Hr, sc] = $t("SelectContent");
var qg = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = mn();
    sm(), Pu(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = hn(), a = /* @__PURE__ */ N();
    Lu(a);
    const { search: l, handleTypeaheadSearch: c } = ro(), u = /* @__PURE__ */ N(), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(!1), v = /* @__PURE__ */ N(!1);
    function g() {
      d.value && a.value && xa([d.value, a.value]);
    }
    we(p, () => {
      g();
    });
    const { onOpenChange: C, triggerPointerDownPosRef: _ } = r;
    dt((T) => {
      if (!a.value) return;
      let S = {
        x: 0,
        y: 0
      };
      const R = (A) => {
        S = {
          x: Math.abs(Math.round(A.pageX) - (_.value?.x ?? 0)),
          y: Math.abs(Math.round(A.pageY) - (_.value?.y ?? 0))
        };
      }, k = (A) => {
        A.pointerType !== "touch" && (S.x <= 10 && S.y <= 10 ? A.preventDefault() : a.value?.contains(A.target) || C(!1), document.removeEventListener("pointermove", R), _.value = null);
      };
      _.value !== null && (document.addEventListener("pointermove", R), document.addEventListener("pointerup", k, {
        capture: !0,
        once: !0
      })), T(() => {
        document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", k, { capture: !0 });
      });
    });
    function x(T) {
      const S = T.ctrlKey || T.altKey || T.metaKey;
      if (T.key === "Tab" && T.preventDefault(), !S && T.key.length === 1 && c(T.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(T.key)) {
        let k = [...o().map((A) => A.ref)];
        if (["ArrowUp", "End"].includes(T.key) && (k = k.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(T.key)) {
          const A = T.target, I = k.indexOf(A);
          k = k.slice(I + 1);
        }
        setTimeout(() => xa(k)), T.preventDefault();
      }
    }
    const y = F(() => n.position === "popper" ? n : {}), E = io(y.value);
    return sc({
      content: a,
      viewport: u,
      onViewportChange: (T) => {
        u.value = T;
      },
      itemRefCallback: (T, S, R) => {
        const k = !h.value && !R, A = Ei(r.modelValue.value, S, r.by);
        if (r.multiple.value) {
          if (v.value) return;
          (A || k) && (d.value = T, A && (v.value = !0));
        } else (A || k) && (d.value = T);
        k && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (T, S, R) => {
        const k = !h.value && !R;
        (Ei(r.modelValue.value, S, r.by) || k) && (f.value = T);
      },
      focusSelectedItem: g,
      position: n.position,
      isPositioned: p,
      searchRef: l
    }), (T, S) => (M(), G(m(s), null, {
      default: q(() => [V(m(Nu), {
        "as-child": "",
        onMountAutoFocus: S[6] || (S[6] = ln(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: S[7] || (S[7] = (R) => {
          i("closeAutoFocus", R), !R.defaultPrevented && (m(r).triggerElement.value?.focus({ preventScroll: !0 }), R.preventDefault());
        })
      }, {
        default: q(() => [V(m(Bu), {
          "as-child": "",
          "disable-outside-pointer-events": T.disableOutsidePointerEvents,
          onFocusOutside: S[2] || (S[2] = ln(() => {
          }, ["prevent"])),
          onDismiss: S[3] || (S[3] = (R) => m(r).onOpenChange(!1)),
          onEscapeKeyDown: S[4] || (S[4] = (R) => i("escapeKeyDown", R)),
          onPointerDownOutside: S[5] || (S[5] = (R) => i("pointerDownOutside", R))
        }, {
          default: q(() => [(M(), G(Cd(T.position === "popper" ? Ng : Ug), Ce({
            ...T.$attrs,
            ...m(E)
          }, {
            id: m(r).contentId,
            ref: (R) => {
              const k = m(It)(R);
              k?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = k.firstElementChild : a.value = k;
            },
            role: "listbox",
            "data-state": m(r).open.value ? "open" : "closed",
            dir: m(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: S[0] || (S[0] = ln(() => {
            }, ["prevent"])),
            onPlaced: S[1] || (S[1] = (R) => p.value = !0),
            onKeydown: x
          }), {
            default: q(() => [ce(T.$slots, "default")]),
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
}), Hg = qg;
const [Vg, Wg] = $t("SelectItemAlignedPosition");
var jg = /* @__PURE__ */ Z({
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
    const n = t, i = e, { getItems: r } = hn(), s = mn(), o = Hr(), a = /* @__PURE__ */ N(!1), l = /* @__PURE__ */ N(!0), c = /* @__PURE__ */ N(), { forwardRef: u, currentElement: d } = Re(), { viewport: f, selectedItem: p, selectedItemText: h, focusSelectedItem: v } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && p?.value && h?.value) {
        const x = s.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), E = s.valueElement.value.getBoundingClientRect(), T = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const X = T.left - y.left, re = E.left - X, ue = x.left - re, pe = x.width + ue, ft = Math.max(pe, y.width), b = window.innerWidth - pt, w = va(re, pt, Math.max(pt, b - ft));
          c.value.style.minWidth = `${pe}px`, c.value.style.left = `${w}px`;
        } else {
          const X = y.right - T.right, re = window.innerWidth - E.right - X, ue = window.innerWidth - x.right - re, pe = x.width + ue, ft = Math.max(pe, y.width), b = window.innerWidth - pt, w = va(re, pt, Math.max(pt, b - ft));
          c.value.style.minWidth = `${pe}px`, c.value.style.right = `${w}px`;
        }
        const S = r().map((X) => X.ref), R = window.innerHeight - pt * 2, k = f.value.scrollHeight, A = window.getComputedStyle(d.value), I = Number.parseInt(A.borderTopWidth, 10), P = Number.parseInt(A.paddingTop, 10), H = Number.parseInt(A.borderBottomWidth, 10), L = Number.parseInt(A.paddingBottom, 10), U = I + P + k + L + H, ne = Math.min(p.value.offsetHeight * 5, U), J = window.getComputedStyle(f.value), Q = Number.parseInt(J.paddingTop, 10), be = Number.parseInt(J.paddingBottom, 10), Ie = x.top + x.height / 2 - pt, Je = R - Ie, Ae = p.value.offsetHeight / 2, Ft = p.value.offsetTop + Ae, Nt = I + P + Ft, Gn = U - Nt;
        if (Nt <= Ie) {
          const X = p.value === S[S.length - 1];
          c.value.style.bottom = "0px";
          const re = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ue = Math.max(Je, Ae + (X ? be : 0) + re + H), pe = Nt + ue;
          c.value.style.height = `${pe}px`;
        } else {
          const X = p.value === S[0];
          c.value.style.top = "0px";
          const ue = Math.max(Ie, I + f.value.offsetTop + (X ? Q : 0) + Ae) + Gn;
          c.value.style.height = `${ue}px`, f.value.scrollTop = Nt - Ie + f.value.offsetTop;
        }
        c.value.style.margin = `${pt}px 0`, c.value.style.minHeight = `${ne}px`, c.value.style.maxHeight = `${R}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const C = /* @__PURE__ */ N("");
    De(async () => {
      await Me(), g(), d.value && (C.value = window.getComputedStyle(d.value).zIndex);
    });
    function _(x) {
      x && l.value === !0 && (g(), v?.(), l.value = !1);
    }
    return em(s.triggerElement, () => {
      g();
    }), Wg({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: _
    }), (x, y) => (M(), le("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: Dt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: C.value
      })
    }, [V(m(Pe), Ce({
      ref: m(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...x.$attrs,
      ...n
    }), {
      default: q(() => [ce(x.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Ug = jg, Kg = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return rc(t.context), sc(zg), (n, i) => ce(n.$slots, "default");
  }
}), Xg = Kg;
const Gg = { key: 1 };
var Yg = /* @__PURE__ */ Z({
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
    const n = t, r = om(n, e), s = mn(), o = /* @__PURE__ */ N();
    De(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ N(), l = F(() => n.forceMount || s.open.value), c = /* @__PURE__ */ N(l.value);
    return we(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (M(), G(m(so), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: q(() => [V(Hg, Hs(Rr({
        ...m(r),
        ...u.$attrs
      })), {
        default: q(() => [ce(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (M(), le("div", Gg, [(M(), G(Ll, { to: o.value }, [V(Xg, { context: m(s) }, {
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : de("v-if", !0);
  }
}), Jg = Yg, Zg = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), G(m(Pe), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: q(() => [ce(e.$slots, "default", {}, () => [n[0] || (n[0] = Ye("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Qg = Zg;
const [oc, ey] = $t("SelectItem");
var ty = /* @__PURE__ */ Z({
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
    const n = t, i = e, { disabled: r } = /* @__PURE__ */ Kn(n), s = mn(), o = Hr(), { forwardRef: a, currentElement: l } = Re(), { CollectionItem: c } = hn(), u = F(() => Ei(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(n.textValue ?? ""), p = xi(void 0, "reka-select-item-text"), h = "select.select";
    async function v(y) {
      if (y.defaultPrevented) return;
      const E = {
        originalEvent: y,
        value: n.value
      };
      Lr(h, g, E);
    }
    async function g(y) {
      await Me(), i("select", y), !y.defaultPrevented && (r.value || (s.onValueChange(n.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function C(y) {
      await Me(), !y.defaultPrevented && (r.value ? o.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function _(y) {
      await Me(), !y.defaultPrevented && y.currentTarget === ct() && o.onItemLeave?.();
    }
    async function x(y) {
      await Me(), !(y.defaultPrevented || o.searchRef?.value !== "" && y.key === " ") && (Mg.includes(y.key) && v(y), y.key === " " && y.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return De(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), ey({
      value: n.value,
      disabled: r,
      textId: p,
      isSelected: u,
      onItemTextChange: (y) => {
        f.value = ((f.value || y?.textContent) ?? "").trim();
      }
    }), (y, E) => (M(), G(m(c), { value: { textValue: f.value } }, {
      default: q(() => [V(m(Pe), {
        ref: m(a),
        role: "option",
        "aria-labelledby": m(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": m(r) || void 0,
        "data-disabled": m(r) ? "" : void 0,
        tabindex: m(r) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: E[0] || (E[0] = (T) => d.value = !0),
        onBlur: E[1] || (E[1] = (T) => d.value = !1),
        onPointerup: v,
        onPointerdown: E[2] || (E[2] = (T) => {
          T.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: E[3] || (E[3] = ln(() => {
        }, ["prevent", "stop"])),
        onPointermove: C,
        onPointerleave: _,
        onKeydown: x
      }, {
        default: q(() => [ce(y.$slots, "default")]),
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
}), ny = ty, iy = /* @__PURE__ */ Z({
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
    const e = t, n = oc();
    return (i, r) => m(n).isSelected.value ? (M(), G(m(Pe), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : de("v-if", !0);
  }
}), ry = iy, sy = /* @__PURE__ */ Z({
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
    const e = t, n = mn(), i = Hr(), r = oc(), { forwardRef: s, currentElement: o } = Re(), a = F(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: o.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return De(() => {
      o.value && (r.onItemTextChange(o.value), i.itemTextRefCallback(o.value, r.value, r.disabled.value), n.onOptionAdd(a.value));
    }), fn(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (M(), G(m(Pe), Ce({
      id: m(r).textId,
      ref: m(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), oy = sy, ay = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), G(m(Vu), Hs(Rr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ly = ay, uy = /* @__PURE__ */ Z({
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
    const e = t, n = mn(), { forwardRef: i, currentElement: r } = Re(), s = F(() => n.disabled?.value || e.disabled);
    n.contentId ||= xi(void 0, "reka-select-content"), De(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: o } = hn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = ro();
    function u() {
      s.value || (n.onOpenChange(!0), c());
    }
    function d(f) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, p) => (M(), G(m(rv), {
      "as-child": "",
      reference: f.reference
    }, {
      default: q(() => [V(m(Pe), {
        ref: m(i),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": m(n).contentId,
        "aria-expanded": m(n).open.value || !1,
        "aria-required": m(n).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: m(n)?.dir.value,
        "data-state": m(n)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": m(Rg)(m(n).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: p[0] || (p[0] = (h) => {
          h?.currentTarget?.focus();
        }),
        onPointerdown: p[1] || (p[1] = (h) => {
          if (h.pointerType === "touch") return h.preventDefault();
          const v = h.target;
          v.hasPointerCapture(h.pointerId) && v.releasePointerCapture(h.pointerId), h.button === 0 && h.ctrlKey === !1 && (d(h), h.preventDefault());
        }),
        onPointerup: p[2] || (p[2] = ln((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (h) => {
          const v = m(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && v && h.key === " " || (m(l)(h.key, m(o)()), m(Og).includes(h.key) && (u(), h.preventDefault()));
        })
      }, {
        default: q(() => [ce(f.$slots, "default")]),
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
}), cy = uy, dy = /* @__PURE__ */ Z({
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
    const e = t, { forwardRef: n, currentElement: i } = Re(), r = mn();
    De(() => {
      r.valueElement = i;
    });
    const s = F(() => {
      let a = [];
      const l = Array.from(r.optionsSet.value), c = (u) => l.find((d) => Ei(u, d.value, r.by));
      return Array.isArray(r.modelValue.value) ? a = r.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(r.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = F(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (M(), G(m(Pe), {
      ref: m(n),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: q(() => [ce(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: m(r).modelValue.value
      }, () => [Ye(ge(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), fy = dy, py = /* @__PURE__ */ Z({
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
    const e = t, { nonce: n } = /* @__PURE__ */ Kn(e), i = Pg(n), r = Hr(), s = r.position === "item-aligned" ? Vg() : void 0, { forwardRef: o, currentElement: a } = Re();
    De(() => {
      r?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ N(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: p } = s ?? {};
      if (f?.value && p?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const v = window.innerHeight - pt * 2, g = Number.parseFloat(p.value.style.minHeight), C = Number.parseFloat(p.value.style.height), _ = Math.max(g, C);
          if (_ < v) {
            const x = _ + h, y = Math.min(v, x), E = x - y;
            p.value.style.height = `${y}px`, p.value.style.bottom === "0px" && (d.scrollTop = E > 0 ? E : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (M(), le(Ee, null, [V(m(Pe), Ce({
      ref: m(o),
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
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 16), V(m(Pe), {
      as: "style",
      nonce: m(i)
    }, {
      default: q(() => d[0] || (d[0] = [Ye(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), hy = py;
const my = { class: "sidebar-select" }, vy = /* @__PURE__ */ Z({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e;
    return (i, r) => (M(), le("div", my, [
      V(m(Dg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (s) => n("update:selectedValue", s))
      }, {
        default: q(() => [
          V(m(cy), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: q(() => [
              V(m(fy), { class: "sidebar-select-trigger-label" }),
              V(m(Qg), null, {
                default: q(() => [
                  V(m(ip), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          V(m(ly), { disabled: "" }, {
            default: q(() => [
              V(m(Jg), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: q(() => [
                  V(m(hy), null, {
                    default: q(() => [
                      (M(!0), le(Ee, null, Pn(t.items, (s) => (M(), G(m(ny), {
                        key: s.value,
                        value: s.value,
                        class: "sidebar-select-item"
                      }, {
                        default: q(() => [
                          V(m(ry), { class: "sidebar-select-item-indicator" }, {
                            default: q(() => [
                              V(m(gu), { size: 14 })
                            ]),
                            _: 1
                          }),
                          V(m(oy), null, {
                            default: q(() => [
                              Ye(ge(s.label), 1)
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
}), gy = { class: "sidebar-select" }, yy = ["aria-label"], by = { class: "sidebar-select-trigger-label" }, _y = 7, wy = /* @__PURE__ */ Z({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r } = wt(), s = /* @__PURE__ */ N(!1), o = F(
      () => n.items.find((l) => l.value === n.selectedValue)?.label ?? ""
    );
    function a(l) {
      i("update:selectedValue", l), s.value = !1;
    }
    return (l, c) => (M(), le("div", gy, [
      oe("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: c[0] || (c[0] = (u) => s.value = !0)
      }, [
        oe("span", by, ge(o.value), 1)
      ], 8, yy),
      V(m(Du), {
        open: s.value,
        "onUpdate:open": c[2] || (c[2] = (u) => s.value = u)
      }, {
        default: q(() => [
          V(m(Wu), { disabled: "" }, {
            default: q(() => [
              V(m(Hu), { class: "editor-overlay" }),
              V(m(qu), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: q(() => [
                  V(m(ju), { class: "sr-only" }, {
                    default: q(() => [
                      Ye(ge(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  c[3] || (c[3] = oe("div", { class: "sheet-handle" }, null, -1)),
                  V(m(gg), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": c[1] || (c[1] = (u) => a(u))
                  }, {
                    default: q(() => [
                      t.items.length > _y ? (M(), G(m(wg), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: m(r)("select.filter")
                      }, null, 8, ["placeholder"])) : de("", !0),
                      V(m(bg), { class: "sheet-list" }, {
                        default: q(() => [
                          (M(!0), le(Ee, null, Pn(t.items, (u) => (M(), G(m(Tg), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: q(() => [
                              V(m(Ag), { class: "sheet-item-indicator" }, {
                                default: q(() => [
                                  V(m(gu), { size: 16 })
                                ]),
                                _: 1
                              }),
                              oe("span", null, ge(u.label), 1)
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
}), mo = /* @__PURE__ */ Z({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: i } = Eu();
    return (r, s) => m(i) ? (M(), G(wy, Ce({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), null, 16)) : (M(), G(vy, Ce({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => n("update:selectedValue", o))
    }), null, 16));
  }
}), ac = /* @__PURE__ */ Z({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r } = wt(), s = F(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (M(), G(mo, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: m(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), xy = { class: "speaker-sidebar" }, Sy = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Cy = { class: "sidebar-title" }, Ey = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Ty = { class: "sidebar-title" }, ky = {
  key: 2,
  class: "sidebar-section"
}, Ay = { class: "sidebar-title" }, Py = { class: "subtitle-toggle" }, Oy = { class: "subtitle-toggle-label" }, My = { class: "subtitle-slider" }, Ry = { class: "subtitle-slider-label" }, Iy = { class: "subtitle-slider-value" }, Ly = ["value", "disabled"], Dy = {
  key: 3,
  class: "sidebar-section"
}, $y = { class: "sidebar-title" }, By = { class: "speaker-list" }, Fy = { class: "speaker-name" }, Ny = /* @__PURE__ */ Z({
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
    const e = t, n = On(), { t: i, locale: r } = wt(), s = F(
      () => wu(e.translations, r.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (o, a) => (M(), le("aside", xy, [
      t.channels.length > 1 ? (M(), le("section", Sy, [
        oe("h2", Cy, ge(m(i)("sidebar.channel")), 1),
        V(ac, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : de("", !0),
      t.translations.length > 1 ? (M(), le("section", Ey, [
        oe("h2", Ty, ge(m(i)("sidebar.translation")), 1),
        V(mo, {
          items: s.value,
          "selected-value": t.selectedTranslationId,
          ariaLabel: m(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : de("", !0),
      m(n).subtitle ? (M(), le("section", ky, [
        oe("h2", Ay, ge(m(i)("sidebar.subtitle")), 1),
        oe("div", Py, [
          oe("span", Oy, ge(m(i)("subtitle.show")), 1),
          V($h, {
            modelValue: m(n).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => m(n).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        oe("label", My, [
          oe("span", Ry, [
            Ye(ge(m(i)("subtitle.fontSize")) + " ", 1),
            oe("span", Iy, ge(m(n).subtitle.fontSize.value) + "px", 1)
          ]),
          oe("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: m(n).subtitle.fontSize.value,
            disabled: !m(n).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => m(n).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Ly)
        ])
      ])) : de("", !0),
      t.speakers.length ? (M(), le("section", Dy, [
        oe("h2", $y, ge(m(i)("sidebar.speakers")), 1),
        oe("ul", By, [
          (M(!0), le(Ee, null, Pn(t.speakers, (l) => (M(), le("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            V(Su, {
              color: l.color
            }, null, 8, ["color"]),
            oe("span", Fy, ge(l.name), 1)
          ]))), 128))
        ])
      ])) : de("", !0)
    ]));
  }
}), zy = ".speaker-sidebar[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-0a4624c1]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-0a4624c1]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-0a4624c1]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-0a4624c1]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-0a4624c1]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-0a4624c1]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-0a4624c1]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-0a4624c1]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-0a4624c1]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-0a4624c1]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-0a4624c1]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-0a4624c1]{border-left:none}.sidebar-section--selector[data-v-0a4624c1]{display:none}}", $a = /* @__PURE__ */ Ve(Ny, [["styles", [zy]], ["__scopeId", "data-v-0a4624c1"]]), qy = /* @__PURE__ */ Z({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = Bd(t, "open"), { t: n } = wt();
    return (i, r) => (M(), G(m(Du), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (s) => e.value = s)
    }, {
      default: q(() => [
        V(m(Wu), { disabled: "" }, {
          default: q(() => [
            V(m(Hu), { class: "editor-overlay" }),
            V(m(qu), { class: "sidebar-drawer" }, {
              default: q(() => [
                V(m(ju), { class: "sr-only" }, {
                  default: q(() => [
                    Ye(ge(m(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                V(m(wm), {
                  class: "sidebar-close",
                  "aria-label": m(n)("header.closeSidebar")
                }, {
                  default: q(() => [
                    V(m(yu), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                ce(i.$slots, "default")
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
}), Hy = { class: "player-controls" }, Vy = { class: "controls-left" }, Wy = { class: "controls-time" }, jy = { class: "time-display" }, Uy = { class: "time-display" }, Ky = { class: "controls-right" }, Xy = ["value", "aria-label", "disabled"], Gy = /* @__PURE__ */ Z({
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
    const n = e, { t: i } = wt(), r = /* @__PURE__ */ N(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (M(), le("div", Hy, [
      oe("div", Vy, [
        V(Pt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": m(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, {
          icon: q(() => [
            V(m(ap), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        V(Pt, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": t.isPlaying ? m(i)("player.pause") : m(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, {
          icon: q(() => [
            t.isPlaying ? (M(), G(m(rp), {
              key: 0,
              size: 20
            })) : (M(), G(m(sp), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        V(Pt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": m(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, {
          icon: q(() => [
            V(m(lp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      oe("div", Wy, [
        oe("time", jy, ge(t.currentTime), 1),
        a[7] || (a[7] = oe("span", { class: "time-separator" }, "/", -1)),
        oe("time", Uy, ge(t.duration), 1)
      ]),
      oe("div", Ky, [
        oe("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          V(Pt, {
            variant: "ghost",
            size: "md",
            "aria-label": t.isMuted ? m(i)("player.unmute") : m(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, {
            icon: q(() => [
              t.isMuted ? (M(), G(m(dp), {
                key: 0,
                size: 16
              })) : (M(), G(m(cp), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          sd(oe("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": m(i)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, Xy), [
            [kf, r.value]
          ])
        ], 32),
        V(Pt, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": m(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: q(() => [
            Ye(ge(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Yy = ".player-controls[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-02ebaa64]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-02ebaa64]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-02ebaa64]:disabled{opacity:.5;cursor:default}.play-button[data-v-02ebaa64]{width:40px;height:40px}.speed-button[data-v-02ebaa64]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-02ebaa64],.volume-slider[data-v-02ebaa64]{display:none}.player-controls[data-v-02ebaa64]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Jy = /* @__PURE__ */ Ve(Gy, [["styles", [Yy]], ["__scopeId", "data-v-02ebaa64"]]);
function Ke(t, e, n, i) {
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
let Li = class {
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
const Vi = { decode: function(t, e) {
  return Ke(this, void 0, void 0, (function* () {
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
function lc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(lc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function Ba(t, e, n) {
  const i = lc(t, e || {});
  return n?.appendChild(i), i;
}
var Zy = Object.freeze({ __proto__: null, createElement: Ba, default: Ba });
const Qy = { fetchBlob: function(t, e, n) {
  return Ke(this, void 0, void 0, (function* () {
    const i = yield fetch(t, n);
    if (i.status >= 400) throw new Error(`Failed to fetch ${t}: ${i.status} (${i.statusText})`);
    return (function(r, s) {
      Ke(this, void 0, void 0, (function* () {
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
function Oe(t) {
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
function Sn(t, e) {
  const n = Oe(t());
  return e.forEach(((i) => i.subscribe((() => {
    const r = t();
    Object.is(n.value, r) || n.set(r);
  })))), { get value() {
    return n.value;
  }, subscribe: (i) => n.subscribe(i) };
}
function on(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
class eb extends Li {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Oe(!1), this._currentTime = Oe(0), this._duration = Oe(0), this._volume = Oe(this.media.volume), this._muted = Oe(this.media.muted), this._playbackRate = Oe(this.media.playbackRate || 1), this._seeking = Oe(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    return Ke(this, void 0, void 0, (function* () {
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
function tb({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: r = 0, barAlign: s }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < r && (a = r, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function nb({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: r }) {
  return t === "top" ? 0 : t === "bottom" ? r - i : e - n;
}
function Fa(t, e, n) {
  const i = e - t.left, r = n - t.top;
  return [i / t.width, r / t.height];
}
function uc(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Na(t, e) {
  if (!uc(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function za({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, r = Math.floor(i * n);
  return [r - 1, r, r + 1];
}
function cc(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function ib(t) {
  const e = Oe({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Sn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), i = Sn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), r = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", r, { passive: !0 }), { scrollData: e, percentages: n, bounds: i, cleanup: () => {
    t.removeEventListener("scroll", r), cc(e);
  } };
}
class rb extends Li {
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
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Fa(i, n.clientX, n.clientY);
      this.emit("click", r, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Fa(i, n.clientX, n.clientY);
      this.emit("dblclick", r, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = ib(this.scrollContainer);
    const e = on((() => {
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
      const { threshold: r = 3, mouseButton: s = 0, touchDelay: o = 100 } = i, a = Oe(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let p = f.clientX, h = f.clientY, v = !1;
        const g = Date.now(), C = n.getBoundingClientRect(), { left: _, top: x } = C, y = (k) => {
          if (k.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const A = k.clientX, I = k.clientY, P = A - p, H = I - h;
          (v || Math.abs(P) > r || Math.abs(H) > r) && (k.preventDefault(), k.stopPropagation(), v || (a.set({ type: "start", x: p - _, y: h - x }), v = !0), a.set({ type: "move", x: A - _, y: I - x, deltaX: P, deltaY: H }), p = A, h = I);
        }, E = (k) => {
          if (l.delete(k.pointerId), v) {
            const A = k.clientX, I = k.clientY;
            a.set({ type: "end", x: A - _, y: I - x });
          }
          u();
        }, T = (k) => {
          l.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || E(k);
        }, S = (k) => {
          v && (k.stopPropagation(), k.preventDefault());
        }, R = (k) => {
          k.defaultPrevented || l.size > 1 || v && k.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", E), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", R, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", E), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", R), setTimeout((() => {
            document.removeEventListener("click", S, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), cc(a);
      } };
    })(this.wrapper);
    const e = on((() => {
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
        return o?.every(((f) => !f.overlay)) ? d / l : d;
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
      return i.forEach(((d, f) => {
        c.addColorStop(f * u, d);
      })), c;
    })(e, this.getPixelRatio(), n?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: h, height: v, length: g, options: C, pixelRatio: _ }) {
      const x = v / 2, y = C.barWidth ? C.barWidth * _ : 1, E = C.barGap ? C.barGap * _ : C.barWidth ? y / 2 : 0, T = y + E || 1;
      return { halfHeight: x, barWidth: y, barGap: E, barRadius: C.barRadius || 0, barMinHeight: C.barMinHeight ? C.barMinHeight * _ : 0, barIndexScale: g > 0 ? h / T / g : 0, barSpacing: T };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: h, barIndexScale: v, barSpacing: g, barWidth: C, halfHeight: _, vScale: x, canvasHeight: y, barAlign: E, barMinHeight: T }) {
      const S = h[0] || [], R = h[1] || S, k = S.length, A = [];
      let I = 0, P = 0, H = 0;
      for (let L = 0; L <= k; L++) {
        const U = Math.round(L * v);
        if (U > I) {
          const { topHeight: Q, totalHeight: be } = tb({ maxTop: P, maxBottom: H, halfHeight: _, vScale: x, barMinHeight: T, barAlign: E }), Ie = nb({ barAlign: E, halfHeight: _, topHeight: Q, totalHeight: be, canvasHeight: y });
          A.push({ x: I * g, y: Ie, width: C, height: be }), I = U, P = 0, H = 0;
        }
        const ne = Math.abs(S[L] || 0), J = Math.abs(R[L] || 0);
        ne > P && (P = ne), J > H && (H = J);
      }
      return A;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: r, canvasHeight: o, barAlign: n.barAlign, barMinHeight: f });
    i.beginPath();
    for (const h of p) c && "roundRect" in i ? i.roundRect(h.x, h.y, h.width, h.height, c) : i.rect(h.x, h.y, h.width, h.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, p = l[0] || [];
      return [p, l[1] || p].map(((h, v) => {
        const g = h.length, C = g ? c / g : 0, _ = f, x = v === 0 ? -1 : 1, y = [{ x: 0, y: _ }];
        let E = 0, T = 0;
        for (let S = 0; S <= g; S++) {
          const R = Math.round(S * C);
          if (R > E) {
            const A = _ + (Math.round(T * f * d) || 1) * x;
            y.push({ x: E, y: A }), E = R, T = 0;
          }
          const k = Math.abs(h[S] || 0);
          k > T && (T = k);
        }
        return y.push({ x: E, y: _ }), y;
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
      let f = l ?? 0;
      if (!l) for (let p = 0; p < d.length; p++) {
        const h = (c = d[p]) !== null && c !== void 0 ? c : 0, v = Math.abs(h);
        v > f && (f = v);
      }
      return f ? u / f : u;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    uc(n) ? this.renderBarWaveform(e, n, i, r) : this.renderLineWaveform(e, n, i, r);
  }
  renderSingleCanvas(e, n, i, r, s, o, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(i * l), c.height = Math.round(r * l), c.style.width = `${i}px`, c.style.height = `${r}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (n.renderFunction ? (u.fillStyle = this.convertColorValues(n.waveColor, u), n.renderFunction(e, u)) : this.renderWaveform(e, n, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), f = d.getContext("2d");
      f.drawImage(c, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(n.progressColor, f), f.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, i, r, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = i / a, u = (function({ clientWidth: h, totalWidth: v, options: g }) {
      return Na(Math.min(8e3, h, v), g);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const f = (h) => {
      if (h < 0 || h >= p || d[h]) return;
      d[h] = !0;
      const v = h * u;
      let g = Math.min(c - v, u);
      if (g = Na(g, n), g <= 0) return;
      const C = (function({ channelData: _, offset: x, clampedWidth: y, totalWidth: E }) {
        return _.map(((T) => {
          const S = Math.floor(x / E * T.length), R = Math.floor((x + y) / E * T.length);
          return T.slice(S, R);
        }));
      })({ channelData: e, offset: v, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(C, n, g, r, v, s, o);
    }, p = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < p; h++) f(h);
      return;
    }
    if (za({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: p }).forEach(((h) => f(h))), p > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: v } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), za({ scrollLeft: v, totalWidth: c, numCanvases: p }).forEach(((g) => f(g)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, n, i, r) {
    var { overlay: s } = n, o = (function(u, d) {
      var f = {};
      for (var p in u) Object.prototype.hasOwnProperty.call(u, p) && d.indexOf(p) < 0 && (f[p] = u[p]);
      if (u != null && typeof Object.getOwnPropertySymbols == "function") {
        var h = 0;
        for (p = Object.getOwnPropertySymbols(u); h < p.length; h++) d.indexOf(p[h]) < 0 && Object.prototype.propertyIsEnumerable.call(u, p[h]) && (f[p[h]] = u[p[h]]);
      }
      return f;
    })(n, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, s && r > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, i, l, a, c);
  }
  render(e) {
    return Ke(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), r = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: f, pixelRatio: p }) {
        const h = Math.ceil(c * u), v = h > d, g = !!(f && !v);
        return { scrollWidth: h, isScrollable: v, useParentWidth: g, width: (g ? d : h) * p };
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
    return Ke(this, void 0, void 0, (function* () {
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
class sb extends Li {
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
class ds extends Li {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Ke(this, void 0, void 0, (function* () {
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
    return Ke(this, void 0, void 0, (function* () {
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
    return Ke(this, void 0, void 0, (function* () {
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
const ob = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ti extends eb {
  static create(e) {
    return new Ti(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new ds() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, ob, e);
    const { state: i, actions: r } = (function(a) {
      var l, c, u, d, f, p;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Oe(0), v = (c = a?.duration) !== null && c !== void 0 ? c : Oe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : Oe(!1), C = (d = a?.isSeeking) !== null && d !== void 0 ? d : Oe(!1), _ = (f = a?.volume) !== null && f !== void 0 ? f : Oe(1), x = (p = a?.playbackRate) !== null && p !== void 0 ? p : Oe(1), y = Oe(null), E = Oe(null), T = Oe(""), S = Oe(0), R = Oe(0), k = Sn((() => !g.value), [g]), A = Sn((() => y.value !== null), [y]), I = Sn((() => A.value && v.value > 0), [A, v]), P = Sn((() => h.value), [h]), H = Sn((() => v.value > 0 ? h.value / v.value : 0), [h, v]);
      return { state: { currentTime: h, duration: v, isPlaying: g, isPaused: k, isSeeking: C, volume: _, playbackRate: x, audioBuffer: y, peaks: E, url: T, zoom: S, scrollPosition: R, canPlay: A, isReady: I, progress: P, progressPercent: H }, actions: { setCurrentTime: (L) => {
        const U = Math.max(0, Math.min(v.value || 1 / 0, L));
        h.set(U);
      }, setDuration: (L) => {
        v.set(Math.max(0, L));
      }, setPlaying: (L) => {
        g.set(L);
      }, setSeeking: (L) => {
        C.set(L);
      }, setVolume: (L) => {
        const U = Math.max(0, Math.min(1, L));
        _.set(U);
      }, setPlaybackRate: (L) => {
        const U = Math.max(0.1, Math.min(16, L));
        x.set(U);
      }, setAudioBuffer: (L) => {
        y.set(L), L && v.set(L.duration);
      }, setPeaks: (L) => {
        E.set(L);
      }, setUrl: (L) => {
        T.set(L);
      }, setZoom: (L) => {
        S.set(Math.max(0, L));
      }, setScrollPosition: (L) => {
        R.set(Math.max(0, L));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new sb();
    const s = n ? void 0 : this.getMediaElement();
    this.renderer = new rb(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      i.push(on((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(on((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(on((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(on((() => {
        e.isReady.value && !r && (r = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(on((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && n.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(on((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Vi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Vi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return Ke(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !n && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        n = yield Qy.fetchBlob(e, l, a);
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
        a instanceof ds && (a.duration = o);
      }
      if (i) this.decodedData = Vi.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield Vi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, n, i) {
    return Ke(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, n, i);
      } catch (r) {
        throw this.emit("error", r), r;
      }
    }));
  }
  loadBlob(e, n, i) {
    return Ke(this, void 0, void 0, (function* () {
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
        let f = 0;
        for (let p = 0; p < d.length; p++) {
          const h = d[p];
          Math.abs(h) > Math.abs(f) && (f = h);
        }
        l.push(Math.round(f * i) / i);
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
    return Ke(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const r = yield i.play.call(this);
      return n != null && (this.media instanceof ds ? this.media.stopAt(n) : this.stopAtPosition = n), r;
    }));
  }
  playPause() {
    return Ke(this, void 0, void 0, (function* () {
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
    return Ke(this, arguments, void 0, (function* (e = "image/png", n = 1, i = "dataURL") {
      return this.renderer.exportImage(e, n, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((n) => n.destroy())), this.subscriptions.forEach(((n) => n())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((n) => n())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Ti.BasePlugin = class extends Li {
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
}, Ti.dom = Zy;
class dc {
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
class ab extends dc {
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
function fc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(fc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function ii(t, e, n) {
  const i = fc(t, e || {});
  return n?.appendChild(i), i;
}
function pc(t) {
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
function Ji(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
function Dn(t, e) {
  const n = pc(null), i = (r) => {
    n.set(r);
  };
  return t.addEventListener(e, i), n._cleanup = () => {
    t.removeEventListener(e, i);
  }, n;
}
function wn(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Zi(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, s = pc(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== i || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, p = !1;
    const h = Date.now(), v = t.getBoundingClientRect(), { left: g, top: C } = v, _ = (S) => {
      if (S.defaultPrevented || o.size > 1 || a && Date.now() - h < r) return;
      const R = S.clientX, k = S.clientY, A = R - d, I = k - f;
      (p || Math.abs(A) > n || Math.abs(I) > n) && (S.preventDefault(), S.stopPropagation(), p || (s.set({ type: "start", x: d - g, y: f - C }), p = !0), s.set({ type: "move", x: R - g, y: k - C, deltaX: A, deltaY: I }), d = R, f = k);
    }, x = (S) => {
      if (o.delete(S.pointerId), p) {
        const R = S.clientX, k = S.clientY;
        s.set({ type: "end", x: R - g, y: k - C });
      }
      l();
    }, y = (S) => {
      o.delete(S.pointerId), S.relatedTarget && S.relatedTarget !== document.documentElement || x(S);
    }, E = (S) => {
      p && (S.stopPropagation(), S.preventDefault());
    }, T = (S) => {
      S.defaultPrevented || o.size > 1 || p && S.preventDefault();
    };
    document.addEventListener("pointermove", _), document.addEventListener("pointerup", x), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", E, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), o.clear(), wn(s);
  } };
}
class qa extends dc {
  constructor(e, n, i = 0) {
    var r, s, o, a, l, c, u, d, f, p;
    super(), this.totalDuration = n, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ii("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = ii("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Zi(i, { threshold: 1 }), o = Zi(r, { threshold: 1 }), a = Ji((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Ji((() => {
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
    const r = ii("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const n = Dn(e, "click"), i = Dn(e, "mouseenter"), r = Dn(e, "mouseleave"), s = Dn(e, "dblclick"), o = Dn(e, "pointerdown"), a = Dn(e, "pointerup"), l = n.subscribe(((g) => g && this.emit("click", g))), c = i.subscribe(((g) => g && this.emit("over", g))), u = r.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), p = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), p(), wn(n), wn(i), wn(r), wn(s), wn(o), wn(a);
    }));
    const h = Zi(e), v = Ji((() => {
      const g = h.signal.value;
      g && (g.type === "start" ? this.toggleCursor(!0) : g.type === "move" && g.deltaX !== void 0 ? this.onMove(g.deltaX) : g.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      v(), h.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (g) => this.onContentClick(g), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
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
        this.content = ii("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class vo extends ab {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new vo(e);
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
    return ii("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const r = this.wavesurfer.getDuration(), s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new qa(e, r, s);
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
    const l = Zi(r, { threshold: n }), c = Ji((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: v } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / v * p;
        const g = f.x / v * p, C = (f.x + 5) / v * p;
        s = new qa(Object.assign(Object.assign({}, e), { start: g, end: C }), p, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const fs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function lb(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: r } = t, s = /* @__PURE__ */ Tn(null), o = /* @__PURE__ */ Tn(null), a = /* @__PURE__ */ N(0), l = /* @__PURE__ */ N(0), c = /* @__PURE__ */ N(!1), u = /* @__PURE__ */ N(!1), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(1), p = /* @__PURE__ */ N(1), h = /* @__PURE__ */ N(!1), v = F(() => cr(a.value)), g = F(() => cr(l.value));
  function C(L, U) {
    P(), d.value = !0, u.value = !1;
    const ne = vo.create();
    o.value = ne;
    const J = Ti.create({
      container: L,
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
      renderFunction: Cp,
      url: U,
      plugins: [ne]
    });
    J.on("ready", () => {
      u.value = !0, d.value = !1, l.value = J.getDuration(), _();
    }), J.on("timeupdate", (Q) => {
      a.value = Q;
    }), J.on("play", () => {
      c.value = !0;
    }), J.on("pause", () => {
      c.value = !1;
    }), J.on("finish", () => {
      c.value = !1;
    }), s.value = J;
  }
  function _() {
    const L = o.value;
    if (L) {
      L.clearRegions();
      for (const U of i.value) {
        const ne = U.speakerId ? r.value.get(U.speakerId) : void 0;
        if (!ne || U.startTime == null || U.endTime == null) continue;
        const J = ne.color;
        L.addRegion({
          start: U.startTime,
          end: U.endTime,
          color: wp(J, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", J);
      }
    }
  }
  function x() {
    s.value?.play();
  }
  function y() {
    s.value?.pause();
  }
  function E() {
    s.value?.playPause();
  }
  function T(L) {
    const U = s.value;
    !U || l.value === 0 || U.setTime(L);
  }
  function S(L) {
    T(Math.max(0, Math.min(a.value + L, l.value)));
  }
  function R(L) {
    const U = s.value;
    U && (f.value = L, U.setVolume(L), L > 0 && h.value && (h.value = !1, U.setMuted(!1)));
  }
  function k() {
    const L = s.value;
    L && (h.value = !h.value, L.setMuted(h.value));
  }
  function A(L) {
    const U = s.value;
    U && (p.value = L, U.setPlaybackRate(L));
  }
  function I() {
    const U = (fs.indexOf(
      p.value
    ) + 1) % fs.length;
    A(fs[U] ?? 1);
  }
  function P() {
    H !== null && (clearTimeout(H), H = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  we(
    [e, n],
    ([L, U]) => {
      L && U && C(L, U);
    },
    { immediate: !0 }
  );
  let H = null;
  return we([i, r], () => {
    u.value && (H !== null && clearTimeout(H), H = setTimeout(() => {
      H = null, _();
    }, 150));
  }), An(() => {
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
    formattedCurrentTime: v,
    formattedDuration: g,
    play: x,
    pause: y,
    togglePlay: E,
    seekTo: T,
    skip: S,
    setVolume: R,
    setPlaybackRate: A,
    cyclePlaybackRate: I,
    toggleMute: k
  };
}
const ub = { class: "audio-player" }, cb = /* @__PURE__ */ Z({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, r = n, s = /* @__PURE__ */ N(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: f,
      formattedCurrentTime: p,
      formattedDuration: h,
      togglePlay: v,
      seekTo: g,
      pause: C,
      skip: _,
      setVolume: x,
      cyclePlaybackRate: y,
      toggleMute: E
    } = lb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ ji(() => i.audioSrc),
      turns: /* @__PURE__ */ ji(() => i.turns),
      speakers: /* @__PURE__ */ ji(() => i.speakers)
    });
    return we(f, (T) => r("timeupdate", T)), we(o, (T) => r("playStateChange", T)), e({ seekTo: g, pause: C }), (T, S) => (M(), le("footer", ub, [
      oe("div", {
        ref_key: "waveformRef",
        ref: s,
        class: un(["waveform-container", { "waveform-container--loading": m(l) }])
      }, null, 2),
      V(Jy, {
        "is-playing": m(o),
        "current-time": m(p),
        duration: m(h),
        volume: m(c),
        "playback-rate": m(u),
        "is-muted": m(d),
        "is-ready": m(a),
        onTogglePlay: m(v),
        onSkipBack: S[0] || (S[0] = (R) => m(_)(-10)),
        onSkipForward: S[1] || (S[1] = (R) => m(_)(10)),
        "onUpdate:volume": m(x),
        onToggleMute: m(E),
        onCyclePlaybackRate: m(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), db = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", fb = /* @__PURE__ */ Ve(cb, [["styles", [db]], ["__scopeId", "data-v-9248e45e"]]);
class pb {
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
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(p[0], n, e, 0, i);
    if (p[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, n, e));
    let v = -1 / 0, g = 1 / 0;
    const C = () => {
      for (let _ = Math.max(v, -c); _ <= Math.min(g, c); _ += 2) {
        let x;
        const y = p[_ - 1], E = p[_ + 1];
        y && (p[_ - 1] = void 0);
        let T = !1;
        if (E) {
          const R = E.oldPos - _;
          T = E && 0 <= R && R < a;
        }
        const S = y && y.oldPos + 1 < l;
        if (!T && !S) {
          p[_] = void 0;
          continue;
        }
        if (!S || T && y.oldPos < E.oldPos ? x = this.addToPath(E, !0, !1, 0, i) : x = this.addToPath(y, !1, !0, 1, i), h = this.extractCommon(x, n, e, _, i), x.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(x.lastComponent, n, e)) || !0;
        p[_] = x, x.oldPos + 1 >= l && (g = Math.min(g, _ - 1)), h + 1 >= a && (v = Math.max(v, _ + 1));
      }
      c++;
    };
    if (r)
      (function _() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return r(void 0);
          C() || _();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
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
          d = d.map(function(f, p) {
            const h = i[c + p];
            return h.length > f.length ? h : f;
          }), u.value = this.join(d);
        } else
          u.value = this.join(n.slice(l, l + u.count));
        l += u.count, u.added || (c += u.count);
      }
    }
    return r;
  }
}
class hb extends pb {
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
const mb = new hb();
function vb(t, e, n) {
  return mb.diff(t, e, n);
}
function ps({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const r = t.split(" "), s = n.split(" "), o = vb(r, s, {
    comparator: yb
  }), a = gb(o), l = [...e];
  let c = [...e], u = 0;
  for (const p of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in p && p.replaced)
      c = Qi(
        c,
        l[0],
        p.countAdded - p.countRemoved
      ), u += p.countRemoved;
    else if ("removed" in p && p.removed) {
      const h = p;
      u += h.count, c = Qi(
        c,
        l[0],
        -h.count
      );
    } else if ("added" in p && p.added) {
      const h = p;
      c = Qi(
        c,
        l[0],
        h.count
      );
    } else
      u += p.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (i(f)) {
    const h = hc(
      f,
      i
    ).map(
      (v) => v + d
    );
    c = c.concat(h);
  }
  return {
    previousIndexes: c,
    previousText: n
  };
}
function gb(t) {
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
function Qi(t, e, n) {
  return t.map((i) => i >= e ? i + n : i);
}
function hc(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let i;
  for (i = 0; i < n.length; i++) {
    const r = n.slice(0, i).join(" ");
    if (e(r)) break;
  }
  return [i - 1].concat(
    Qi(
      hc(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function yb(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(n.length, i.length);
  let s = 0;
  for (let a = 0; a < r; a++)
    n[a] === i[a] && s++;
  return s / n.length > 0.8;
}
class bb {
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
class _b extends bb {
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
function mc(t) {
  const e = On();
  let n = null;
  De(() => {
    t.canvasRef.value && (n = new _b(t.canvasRef.value, {
      fontSize: t.fontSize,
      lineHeight: t.lineHeight
    }));
  }), we(
    () => e.live?.partial.value,
    (a) => {
      a && n && n.newPartial(a);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: a }) => {
    if (!n) return;
    const l = a.words.length > 0 ? a.words.map((c) => c.text).join(" ") : a.text ?? "";
    l && n.newFinal(l);
  });
  function r() {
    n && (n.resetDrawing(), n.resetAll());
  }
  const s = e.on("translation:sync", r), o = e.on("channel:sync", r);
  fn(() => {
    i(), s(), o(), n?.dispose(), n = null;
  });
}
const wb = ["height"], xb = /* @__PURE__ */ Z({
  __name: "SubtitleBanner",
  setup(t) {
    const e = On(), n = vi("canvas"), i = F(() => e.subtitle?.fontSize.value ?? 40), r = F(() => 1.2 * i.value), s = F(() => 2.4 * i.value);
    return mc({
      canvasRef: n,
      fontSize: i.value,
      lineHeight: r.value
    }), (o, a) => (M(), le("div", {
      class: "subtitle-banner",
      style: Dt({ height: s.value + "px" })
    }, [
      oe("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, wb)
    ], 4));
  }
}), Sb = ".subtitle-banner[data-v-b80652cd]{flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-b80652cd]{display:block;width:100%;height:100%}", Cb = /* @__PURE__ */ Ve(xb, [["styles", [Sb]], ["__scopeId", "data-v-b80652cd"]]), Eb = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Tb = ["aria-label"], kb = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Ha = 48, Ab = /* @__PURE__ */ Z({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = On(), { t: n } = wt(), i = vi("container"), r = vi("canvas");
    mc({
      canvasRef: r,
      fontSize: Ha,
      lineHeight: 1.2 * Ha
    }), De(async () => {
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
    function s() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    De(() => {
      document.addEventListener("fullscreenchange", s);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return fn(() => {
      document.removeEventListener("fullscreenchange", s);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (M(), le("div", Eb, [
      oe("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": m(n)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        V(m(yu), { size: 24 })
      ], 8, Tb),
      oe("canvas", kb, null, 512)
    ], 512));
  }
}), Pb = ".subtitle-fullscreen[data-v-cfe63125]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-cfe63125]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-cfe63125]:hover,.subtitle-fullscreen__close[data-v-cfe63125]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-cfe63125]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-cfe63125]{transition:none}}", Ob = /* @__PURE__ */ Ve(Ab, [["styles", [Pb]], ["__scopeId", "data-v-cfe63125"]]), Mb = { class: "editor-layout" }, Rb = { class: "editor-body" }, Ib = {
  key: 4,
  class: "mobile-selectors"
}, Lb = /* @__PURE__ */ Z({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = On(), { t: i, locale: r } = wt(), { isMobile: s } = Eu(), o = /* @__PURE__ */ N(!1), a = F(() => n.activeChannel.value.activeTranslation.value.turns.value), l = n.speakers.all, c = F(() => [...n.channels.values()]), u = F(() => [...n.activeChannel.value.translations.values()]), d = F(() => n.activeChannel.value.activeTranslation.value.id), f = F(() => Array.from(l.values())), p = vi("audioPlayer");
    function h(_) {
      n.audio && (n.audio.currentTime.value = _);
    }
    we(
      () => n.activeChannelId.value,
      () => {
        p.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), o.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((_) => p.value?.seekTo(_));
    const v = F(
      () => wu(
        u.value,
        r.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function g(_) {
      n.setActiveChannel(_);
    }
    function C(_) {
      n.activeChannel.value.setActiveTranslation(_);
    }
    return (_, x) => (M(), le("div", Mb, [
      e.showHeader ? (M(), G(Lp, {
        key: 0,
        title: m(n).title.value,
        duration: m(n).activeChannel.value.duration,
        language: d.value,
        "is-mobile": m(s),
        onToggleSidebar: x[0] || (x[0] = (y) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : de("", !0),
      oe("main", Rb, [
        V(Oh, {
          turns: a.value,
          speakers: m(l)
        }, null, 8, ["turns", "speakers"]),
        m(s) ? de("", !0) : (M(), G($a, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": m(n).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": C
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        m(s) ? (M(), G(qy, {
          key: 1,
          open: o.value,
          "onUpdate:open": x[1] || (x[1] = (y) => o.value = y)
        }, {
          default: q(() => [
            V($a, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": m(n).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": C
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : de("", !0)
      ]),
      m(n).audio?.src.value ? (M(), G(fb, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": m(n).audio.src.value,
        turns: a.value,
        speakers: m(l),
        onTimeupdate: h,
        onPlayStateChange: x[2] || (x[2] = (y) => {
          m(n).audio && (m(n).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : de("", !0),
      m(n).subtitle?.isVisible.value && !m(s) && !m(n).subtitle.isFullscreen.value ? (M(), G(Cb, { key: 2 })) : de("", !0),
      m(n).subtitle?.isFullscreen.value ? (M(), G(Ob, { key: 3 })) : de("", !0),
      m(s) ? (M(), le("div", Ib, [
        c.value.length > 1 ? (M(), G(ac, {
          key: 0,
          channels: c.value,
          "selected-channel-id": m(n).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : de("", !0),
        u.value.length > 1 ? (M(), G(mo, {
          key: 1,
          items: v.value,
          "selected-value": d.value,
          ariaLabel: m(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": C
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : de("", !0)
      ])) : de("", !0)
    ]));
  }
}), Db = ".editor-layout[data-v-084c0e7c]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-084c0e7c]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-084c0e7c]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-084c0e7c]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-084c0e7c]{grid-template-columns:1fr}}", $b = /* @__PURE__ */ Ve(Lb, [["styles", [Db]], ["__scopeId", "data-v-084c0e7c"]]);
function Bb() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ N(0), n = /* @__PURE__ */ N(!1);
      let i = null;
      const r = F(
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
const Fb = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', Nb = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}', zb = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}", qb = ".sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow:hidden;padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}";
function Va(t) {
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
function Wa(t, e) {
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
function Ub() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ Tn(null), n = /* @__PURE__ */ N(!1);
      n.value = !0;
      function i() {
        e.value = null, Co(e);
      }
      function r(x, y) {
        if (t.activeChannelId.value !== y) return;
        const E = t.activeChannel.value.activeTranslation.value;
        if (E.isSource) {
          if (x.text == null) return;
          e.value = x.text;
        } else if (x.translations) {
          const T = x.translations.find(
            (S) => S.translationId === E.id
          );
          e.value = T?.text ?? null;
        } else
          return;
        Co(e);
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
      function l(x, y) {
        x.turns.value.some((T) => T.id === y.id) ? x.updateTurn(y.id, y) : x.addTurn(y);
      }
      function c(x, y) {
        x.speakerId && t.speakers.ensure(x.speakerId);
        const E = t.channels.get(y);
        if (!E) {
          f();
          return;
        }
        if (x.text != null && l(E.sourceTranslation, Va(x)), x.translations)
          for (const T of x.translations) {
            const S = E.translations.get(T.translationId);
            S && l(S, Wa(x, T));
          }
        f();
      }
      function u(x, y) {
        d([x], y);
      }
      function d(x, y) {
        const E = t.channels.get(y);
        if (!E) return;
        const T = /* @__PURE__ */ new Set();
        for (const k of x)
          k.speakerId && !T.has(k.speakerId) && (T.add(k.speakerId), t.speakers.ensure(k.speakerId));
        const S = [];
        for (const k of x)
          k.text != null && S.push(Va(k));
        S.length > 0 && E.sourceTranslation.prependTurns(S);
        const R = /* @__PURE__ */ new Map();
        for (const k of x)
          if (k.translations)
            for (const A of k.translations) {
              let I = R.get(A.translationId);
              I || (I = [], R.set(A.translationId, I)), I.push(Wa(k, A));
            }
        for (const [k, A] of R) {
          const I = E.translations.get(k);
          I && I.prependTurns(A);
        }
      }
      function f() {
        a(), i();
      }
      function p(x) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const h = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: r,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: p
      }, v = t.on("channel:change", f), g = t.on("translation:change", f), C = t.on("translation:sync", o), _ = t.on("channel:sync", o);
      return t.live = h, () => {
        f(), v(), g(), C(), _(), t.live = void 0;
      };
    }
  };
}
function Kb(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ N(t.fontSize ?? 40), i = /* @__PURE__ */ N(!0), r = /* @__PURE__ */ N(!1), s = {
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
const Hb = /* @__PURE__ */ Hf({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: !1 }
  },
  styles: [Nb, zb, qb],
  setup(t, { expose: e }) {
    const n = /* @__PURE__ */ N(t.locale);
    _p(n), we(() => t.locale, (r) => {
      n.value = r;
    });
    const i = ah();
    return i.use(Bb()), lh(i), e({ editor: i }), () => i.channels.size ? mt($b, { showHeader: !t.noHeader }) : null;
  }
});
function Vb() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = Fb, document.head.appendChild(e);
}
function Xb(t = "linto-editor") {
  Vb(), customElements.define(t, Hb);
}
export {
  Hb as LintoEditor,
  Bb as createAudioPlugin,
  Ub as createLivePlugin,
  Kb as createSubtitlePlugin,
  Xb as register
};
