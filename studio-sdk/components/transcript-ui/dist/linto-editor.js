// @__NO_SIDE_EFFECTS__
function zs(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const ve = {}, Fn = [], Ot = () => {
}, ja = () => !1, hr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), qs = (t) => t.startsWith("onUpdate:"), ke = Object.assign, Hs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, mc = Object.prototype.hasOwnProperty, ge = (t, e) => mc.call(t, e), te = Array.isArray, Nn = (t) => Ci(t) === "[object Map]", Ua = (t) => Ci(t) === "[object Set]", _o = (t) => Ci(t) === "[object Date]", se = (t) => typeof t == "function", Te = (t) => typeof t == "string", mt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", Ka = (t) => (be(t) || se(t)) && se(t.then) && se(t.catch), Xa = Object.prototype.toString, Ci = (t) => Xa.call(t), gc = (t) => Ci(t).slice(8, -1), vr = (t) => Ci(t) === "[object Object]", mr = (t) => Te(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, ri = /* @__PURE__ */ zs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), gr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, yc = /-\w/g, $e = gr(
  (t) => t.replace(yc, (e) => e.slice(1).toUpperCase())
), bc = /\B([A-Z])/g, tt = gr(
  (t) => t.replace(bc, "-$1").toLowerCase()
), yr = gr((t) => t.charAt(0).toUpperCase() + t.slice(1)), qi = gr(
  (t) => t ? `on${yr(t)}` : ""
), je = (t, e) => !Object.is(t, e), Hr = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Ga = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, wc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, hs = (t) => {
  const e = Te(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let xo;
const br = () => xo || (xo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Lt(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = Te(i) ? Cc(i) : Lt(i);
      if (r)
        for (const s in r)
          e[s] = r[s];
    }
    return e;
  } else if (Te(t) || be(t))
    return t;
}
const _c = /;(?![^(]*\))/g, xc = /:([^]+)/, Sc = /\/\*[^]*?\*\//g;
function Cc(t) {
  const e = {};
  return t.replace(Sc, "").split(_c).forEach((n) => {
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
  else if (be(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Ws(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !Te(e) && (t.class = un(e)), n && (t.style = Lt(n)), t;
}
const Ec = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Tc = /* @__PURE__ */ zs(Ec);
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
  if (n = mt(t), i = mt(e), n || i)
    return t === e;
  if (n = te(t), i = te(e), n || i)
    return n && i ? kc(t, e) : !1;
  if (n = be(t), i = be(e), n || i) {
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
const Ja = (t) => !!(t && t.__v_isRef === !0), ye = (t) => Te(t) ? t : t == null ? "" : te(t) || be(t) && (t.toString === Xa || !se(t.toString)) ? Ja(t) ? ye(t.value) : JSON.stringify(t, Za, 2) : String(t), Za = (t, e) => Ja(e) ? Za(t, e.value) : Nn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, r], s) => (n[Wr(i, s) + " =>"] = r, n),
    {}
  )
} : Ua(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Wr(n))
} : mt(e) ? Wr(e) : be(e) && !te(e) && !vr(e) ? String(e) : e, Wr = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    mt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
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
function js() {
  return ze;
}
function tl(t, e = !1) {
  ze && ze.cleanups.push(t);
}
let Se;
const Vr = /* @__PURE__ */ new WeakSet();
class nl {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ze && ze.active && ze.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Vr.has(this) && (Vr.delete(this), this.trigger()));
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
    this.flags |= 2, So(this), sl(this);
    const e = Se, n = vt;
    Se = this, vt = !0;
    try {
      return this.fn();
    } finally {
      ol(this), Se = e, vt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Xs(e);
      this.deps = this.depsTail = void 0, So(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Vr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    vs(this) && this.run();
  }
  get dirty() {
    return vs(this);
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
function Us() {
  il++;
}
function Ks() {
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
    i.version === -1 ? (i === n && (n = r), Xs(i), Ac(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  t.deps = e, t.depsTail = n;
}
function vs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (al(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function al(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === fi) || (t.globalVersion = fi, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !vs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Se, i = vt;
  Se = t, vt = !0;
  try {
    sl(t);
    const r = t.fn(t._value);
    (e.version === 0 || je(r, t._value)) && (t.flags |= 128, t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    Se = n, vt = i, ol(t), t.flags &= -3;
  }
}
function Xs(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: r } = t;
  if (i && (i.nextSub = r, t.prevSub = void 0), r && (r.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Xs(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Ac(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let vt = !0;
const ll = [];
function Kt() {
  ll.push(vt), vt = !1;
}
function Xt() {
  const t = ll.pop();
  vt = t === void 0 ? !0 : t;
}
function So(t) {
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
    if (!Se || !vt || Se === this.computed)
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
    Us();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Ks();
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
const Ji = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ Symbol(
  ""
), ms = /* @__PURE__ */ Symbol(
  ""
), pi = /* @__PURE__ */ Symbol(
  ""
);
function qe(t, e, n) {
  if (vt && Se) {
    let i = Ji.get(t);
    i || Ji.set(t, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new wr()), r.map = i, r.key = n), r.track();
  }
}
function jt(t, e, n, i, r, s) {
  const o = Ji.get(t);
  if (!o) {
    fi++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (Us(), e === "clear")
    o.forEach(a);
  else {
    const l = te(t), c = l && mr(n);
    if (l && n === "length") {
      const u = Number(i);
      o.forEach((d, f) => {
        (f === "length" || f === pi || !mt(f) && f >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), c && a(o.get(pi)), e) {
        case "add":
          l ? c && a(o.get("length")) : (a(o.get(Cn)), Nn(t) && a(o.get(ms)));
          break;
        case "delete":
          l || (a(o.get(Cn)), Nn(t) && a(o.get(ms)));
          break;
        case "set":
          Nn(t) && a(o.get(Cn));
          break;
      }
  }
  Ks();
}
function Oc(t, e) {
  const n = Ji.get(t);
  return n && n.get(e);
}
function Mn(t) {
  const e = /* @__PURE__ */ he(t);
  return e === t ? e : (qe(e, "iterate", pi), /* @__PURE__ */ ot(t) ? e : e.map(gt));
}
function _r(t) {
  return qe(t = /* @__PURE__ */ he(t), "iterate", pi), t;
}
function sn(t, e) {
  return /* @__PURE__ */ Gt(t) ? Vn(/* @__PURE__ */ En(t) ? gt(e) : e) : gt(e);
}
const Rc = {
  __proto__: null,
  [Symbol.iterator]() {
    return jr(this, Symbol.iterator, (t) => sn(this, t));
  },
  concat(...t) {
    return Mn(this).concat(
      ...t.map((e) => te(e) ? Mn(e) : e)
    );
  },
  entries() {
    return jr(this, "entries", (t) => (t[1] = sn(this, t[1]), t));
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
      (n) => n.map((i) => sn(this, i)),
      arguments
    );
  },
  find(t, e) {
    return qt(
      this,
      "find",
      t,
      e,
      (n) => sn(this, n),
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
      (n) => sn(this, n),
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
    return Ur(this, "includes", t);
  },
  indexOf(...t) {
    return Ur(this, "indexOf", t);
  },
  join(t) {
    return Mn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Ur(this, "lastIndexOf", t);
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
    return Co(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Co(this, "reduceRight", t, e);
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
    return Mn(this).toReversed();
  },
  toSorted(t) {
    return Mn(this).toSorted(t);
  },
  toSpliced(...t) {
    return Mn(this).toSpliced(...t);
  },
  unshift(...t) {
    return Jn(this, "unshift", t);
  },
  values() {
    return jr(this, "values", (t) => sn(this, t));
  }
};
function jr(t, e, n) {
  const i = _r(t), r = i[e]();
  return i !== t && !/* @__PURE__ */ ot(t) && (r._next = r.next, r.next = () => {
    const s = r._next();
    return s.done || (s.value = n(s.value)), s;
  }), r;
}
const Mc = Array.prototype;
function qt(t, e, n, i, r, s) {
  const o = _r(t), a = o !== t && !/* @__PURE__ */ ot(t), l = o[e];
  if (l !== Mc[e]) {
    const d = l.apply(t, s);
    return a ? gt(d) : d;
  }
  let c = n;
  o !== t && (a ? c = function(d, f) {
    return n.call(this, sn(t, d), f, t);
  } : n.length > 2 && (c = function(d, f) {
    return n.call(this, d, f, t);
  }));
  const u = l.call(o, c, i);
  return a && r ? r(u) : u;
}
function Co(t, e, n, i) {
  const r = _r(t);
  let s = n;
  return r !== t && (/* @__PURE__ */ ot(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, sn(t, a), l, t);
  }), r[e](s, ...i);
}
function Ur(t, e, n) {
  const i = /* @__PURE__ */ he(t);
  qe(i, "iterate", pi);
  const r = i[e](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ Er(n[0]) ? (n[0] = /* @__PURE__ */ he(n[0]), i[e](...n)) : r;
}
function Jn(t, e, n = []) {
  Kt(), Us();
  const i = (/* @__PURE__ */ he(t))[e].apply(t, n);
  return Ks(), Xt(), i;
}
const Ic = /* @__PURE__ */ zs("__proto__,__v_isRef,__isVue"), cl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(mt)
);
function Lc(t) {
  mt(t) || (t = String(t));
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
      return i === (r ? s ? gl : ml : s ? vl : hl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = te(e);
    if (!r) {
      let l;
      if (o && (l = Rc[n]))
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
      /* @__PURE__ */ De(e) ? e : i
    );
    if ((mt(n) ? cl.has(n) : Ic(n)) || (r || qe(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ De(a)) {
      const l = o && mr(n) ? a : a.value;
      return r && be(l) ? /* @__PURE__ */ Zi(l) : l;
    }
    return be(a) ? r ? /* @__PURE__ */ Zi(a) : /* @__PURE__ */ Ei(a) : a;
  }
}
class fl extends dl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, r) {
    let s = e[n];
    const o = te(e) && mr(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Gt(s);
      if (!/* @__PURE__ */ ot(i) && !/* @__PURE__ */ Gt(i) && (s = /* @__PURE__ */ he(s), i = /* @__PURE__ */ he(i)), !o && /* @__PURE__ */ De(s) && !/* @__PURE__ */ De(i))
        return c || (s.value = i), !0;
    }
    const a = o ? Number(n) < e.length : ge(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ De(e) ? e : r
    );
    return e === /* @__PURE__ */ he(r) && (a ? je(i, s) && jt(e, "set", n, i) : jt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = ge(e, n);
    e[n];
    const r = Reflect.deleteProperty(e, n);
    return r && i && jt(e, "delete", n, void 0), r;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!mt(n) || !cl.has(n)) && qe(e, "has", n), i;
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
const Dc = /* @__PURE__ */ new fl(), $c = /* @__PURE__ */ new pl(), Bc = /* @__PURE__ */ new fl(!0), Fc = /* @__PURE__ */ new pl(!0), gs = (t) => t, Mi = (t) => Reflect.getPrototypeOf(t);
function Nc(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = /* @__PURE__ */ he(r), o = Nn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? gs : e ? Vn : gt;
    return !e && qe(
      s,
      "iterate",
      l ? ms : Cn
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
function Ii(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function zc(t, e) {
  const n = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ he(s), a = /* @__PURE__ */ he(r);
      t || (je(r, a) && qe(o, "get", r), qe(o, "get", a));
      const { has: l } = Mi(o), c = e ? gs : t ? Vn : gt;
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
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ he(a), c = e ? gs : t ? Vn : gt;
      return !t && qe(l, "iterate", Cn), a.forEach((u, d) => r.call(s, c(u), c(d), o));
    }
  };
  return ke(
    n,
    t ? {
      add: Ii("add"),
      set: Ii("set"),
      delete: Ii("delete"),
      clear: Ii("clear")
    } : {
      add(r) {
        !e && !/* @__PURE__ */ ot(r) && !/* @__PURE__ */ Gt(r) && (r = /* @__PURE__ */ he(r));
        const s = /* @__PURE__ */ he(this);
        return Mi(s).has.call(s, r) || (s.add(r), jt(s, "add", r, r)), this;
      },
      set(r, s) {
        !e && !/* @__PURE__ */ ot(s) && !/* @__PURE__ */ Gt(s) && (s = /* @__PURE__ */ he(s));
        const o = /* @__PURE__ */ he(this), { has: a, get: l } = Mi(o);
        let c = a.call(o, r);
        c || (r = /* @__PURE__ */ he(r), c = a.call(o, r));
        const u = l.call(o, r);
        return o.set(r, s), c ? je(s, u) && jt(o, "set", r, s) : jt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ he(this), { has: o, get: a } = Mi(s);
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
function xr(t, e) {
  const n = zc(t, e);
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(
    ge(n, r) && r in i ? n : i,
    r,
    s
  );
}
const qc = {
  get: /* @__PURE__ */ xr(!1, !1)
}, Hc = {
  get: /* @__PURE__ */ xr(!1, !0)
}, Wc = {
  get: /* @__PURE__ */ xr(!0, !1)
}, Vc = {
  get: /* @__PURE__ */ xr(!0, !0)
}, hl = /* @__PURE__ */ new WeakMap(), vl = /* @__PURE__ */ new WeakMap(), ml = /* @__PURE__ */ new WeakMap(), gl = /* @__PURE__ */ new WeakMap();
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
function Ei(t) {
  return /* @__PURE__ */ Gt(t) ? t : Cr(
    t,
    !1,
    Dc,
    qc,
    hl
  );
}
// @__NO_SIDE_EFFECTS__
function Sr(t) {
  return Cr(
    t,
    !1,
    Bc,
    Hc,
    vl
  );
}
// @__NO_SIDE_EFFECTS__
function Zi(t) {
  return Cr(
    t,
    !0,
    $c,
    Wc,
    ml
  );
}
// @__NO_SIDE_EFFECTS__
function In(t) {
  return Cr(
    t,
    !0,
    Fc,
    Vc,
    gl
  );
}
function Cr(t, e, n, i, r) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
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
function ot(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Er(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function he(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ he(e) : t;
}
function yl(t) {
  return !ge(t, "__v_skip") && Object.isExtensible(t) && Ga(t, "__v_skip", !0), t;
}
const gt = (t) => be(t) ? /* @__PURE__ */ Ei(t) : t, Vn = (t) => be(t) ? /* @__PURE__ */ Zi(t) : t;
// @__NO_SIDE_EFFECTS__
function De(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function D(t) {
  return bl(t, !1);
}
// @__NO_SIDE_EFFECTS__
function kn(t) {
  return bl(t, !0);
}
function bl(t, e) {
  return /* @__PURE__ */ De(t) ? t : new Kc(t, e);
}
class Kc {
  constructor(e, n) {
    this.dep = new wr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ he(e), this._value = n ? e : gt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ ot(e) || /* @__PURE__ */ Gt(e);
    e = i ? e : /* @__PURE__ */ he(e), je(e, n) && (this._rawValue = e, this._value = i ? e : gt(e), this.dep.trigger());
  }
}
function Eo(t) {
  t.dep && t.dep.trigger();
}
function v(t) {
  return /* @__PURE__ */ De(t) ? t.value : t;
}
function Ge(t) {
  return se(t) ? t() : v(t);
}
const Xc = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const r = t[e];
    return /* @__PURE__ */ De(r) && !/* @__PURE__ */ De(n) ? (r.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function wl(t) {
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
function _l(t) {
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
    if (!te(e) || !mr(String(n)))
      do
        r = !/* @__PURE__ */ Er(s) || /* @__PURE__ */ ot(s);
      while (r && (s = s.__v_raw));
    this._shallow = r;
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
function Hi(t, e, n) {
  return /* @__PURE__ */ De(t) ? t : se(t) ? new Jc(t) : be(t) && arguments.length > 1 ? xl(t, e, n) : /* @__PURE__ */ D(t);
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
const Li = {}, Qi = /* @__PURE__ */ new WeakMap();
let wn;
function ed(t, e = !1, n = wn) {
  if (n) {
    let i = Qi.get(n);
    i || Qi.set(n, i = []), i.push(t);
  }
}
function td(t, e, n = ve) {
  const { immediate: i, deep: r, once: s, scheduler: o, augmentJob: a, call: l } = n, c = (y) => r ? y : /* @__PURE__ */ ot(y) || r === !1 || r === 0 ? Ut(y, 1) : Ut(y);
  let u, d, f, p, h = !1, m = !1;
  if (/* @__PURE__ */ De(t) ? (d = () => t.value, h = /* @__PURE__ */ ot(t)) : /* @__PURE__ */ En(t) ? (d = () => c(t), h = !0) : te(t) ? (m = !0, h = t.some((y) => /* @__PURE__ */ En(y) || /* @__PURE__ */ ot(y)), d = () => t.map((y) => {
    if (/* @__PURE__ */ De(y))
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
    const y = wn;
    wn = u;
    try {
      return l ? l(t, 3, [p]) : t(p);
    } finally {
      wn = y;
    }
  } : d = Ot, e && r) {
    const y = d, T = r === !0 ? 1 / 0 : r;
    d = () => Ut(y(), T);
  }
  const g = js(), E = () => {
    u.stop(), g && g.active && Hs(g.effects, u);
  };
  if (s && e) {
    const y = e;
    e = (...T) => {
      y(...T), E();
    };
  }
  let w = m ? new Array(t.length).fill(Li) : Li;
  const S = (y) => {
    if (!(!(u.flags & 1) || !u.dirty && !y))
      if (e) {
        const T = u.run();
        if (r || h || (m ? T.some((C, _) => je(C, w[_])) : je(T, w))) {
          f && f();
          const C = wn;
          wn = u;
          try {
            const _ = [
              T,
              // pass undefined as the old value when it's changed for the first time
              w === Li ? void 0 : m && w[0] === Li ? [] : w,
              p
            ];
            w = T, l ? l(e, 3, _) : (
              // @ts-expect-error
              e(..._)
            );
          } finally {
            wn = C;
          }
        }
      } else
        u.run();
  };
  return a && a(S), u = new nl(d), u.scheduler = o ? () => o(S, !1) : S, p = (y) => ed(y, !1, u), f = u.onStop = () => {
    const y = Qi.get(u);
    if (y) {
      if (l)
        l(y, 4);
      else
        for (const T of y) T();
      Qi.delete(u);
    }
  }, e ? i ? S(!0) : w = u.run() : o ? o(S.bind(null, !0), !0) : u.run(), E.pause = u.pause.bind(u), E.resume = u.resume.bind(u), E.stop = E, E;
}
function Ut(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ De(t))
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
function Ti(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (r) {
    Tr(r, e, n);
  }
}
function yt(t, e, n, i) {
  if (se(t)) {
    const r = Ti(t, e, n, i);
    return r && Ka(r) && r.catch((s) => {
      Tr(s, e, n);
    }), r;
  }
  if (te(t)) {
    const r = [];
    for (let s = 0; s < t.length; s++)
      r.push(yt(t[s], e, n, i));
    return r;
  }
}
function Tr(t, e, n, i = !0) {
  const r = e ? e.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: o } = e && e.appContext.config || ve;
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
      Kt(), Ti(s, null, 10, [
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
let Et = -1;
const zn = [];
let on = null, $n = 0;
const Sl = /* @__PURE__ */ Promise.resolve();
let er = null;
function Oe(t) {
  const e = er || Sl;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function id(t) {
  let e = Et + 1, n = Ue.length;
  for (; e < n; ) {
    const i = e + n >>> 1, r = Ue[i], s = hi(r);
    s < t || s === t && r.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Gs(t) {
  if (!(t.flags & 1)) {
    const e = hi(t), n = Ue[Ue.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= hi(n) ? Ue.push(t) : Ue.splice(id(e), 0, t), t.flags |= 1, Cl();
  }
}
function Cl() {
  er || (er = Sl.then(Tl));
}
function rd(t) {
  te(t) ? zn.push(...t) : on && t.id === -1 ? on.splice($n + 1, 0, t) : t.flags & 1 || (zn.push(t), t.flags |= 1), Cl();
}
function To(t, e, n = Et + 1) {
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
    if (zn.length = 0, on) {
      on.push(...e);
      return;
    }
    for (on = e, $n = 0; $n < on.length; $n++) {
      const n = on[$n];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    on = null, $n = 0;
  }
}
const hi = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function Tl(t) {
  try {
    for (Et = 0; Et < Ue.length; Et++) {
      const e = Ue[Et];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Ti(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; Et < Ue.length; Et++) {
      const e = Ue[Et];
      e && (e.flags &= -2);
    }
    Et = -1, Ue.length = 0, El(), er = null, (Ue.length || zn.length) && Tl();
  }
}
let Fe = null, kl = null;
function tr(t) {
  const e = Fe;
  return Fe = t, kl = t && t.type.__scopeId || null, e;
}
function q(t, e = Fe, n) {
  if (!e || t._n)
    return t;
  const i = (...r) => {
    i._d && rr(-1);
    const s = tr(e);
    let o;
    try {
      o = t(...r);
    } finally {
      tr(s), i._d && rr(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function sd(t, e) {
  if (Fe === null)
    return t;
  const n = Mr(Fe), i = t.dirs || (t.dirs = []);
  for (let r = 0; r < e.length; r++) {
    let [s, o, a, l = ve] = e[r];
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
function mn(t, e, n, i) {
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
function ki(t, e) {
  if (He) {
    let n = He.provides;
    const i = He.parent && He.parent.provides;
    i === n && (n = He.provides = Object.create(i)), n[t] = e;
  }
}
function ln(t, e, n = !1) {
  const i = it();
  if (i || Hn) {
    let r = Hn ? Hn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (r && t in r)
      return r[t];
    if (arguments.length > 1)
      return n && se(e) ? e.call(i && i.proxy) : e;
  }
}
const od = /* @__PURE__ */ Symbol.for("v-scx"), ad = () => ln(od);
function nt(t, e) {
  return Ai(t, null, e);
}
function Al(t, e) {
  return Ai(
    t,
    null,
    { flush: "post" }
  );
}
function ld(t, e) {
  return Ai(
    t,
    null,
    { flush: "sync" }
  );
}
function me(t, e, n) {
  return Ai(t, e, n);
}
function Ai(t, e, n = ve) {
  const { immediate: i, deep: r, flush: s, once: o } = n, a = ke({}, n), l = e && i || !e && s !== "post";
  let c;
  if (yi) {
    if (s === "sync") {
      const p = ad();
      c = p.__watcherHandles || (p.__watcherHandles = []);
    } else if (!l) {
      const p = () => {
      };
      return p.stop = Ot, p.resume = Ot, p.pause = Ot, p;
    }
  }
  const u = He;
  a.call = (p, h, m) => yt(p, u, h, m);
  let d = !1;
  s === "post" ? a.scheduler = (p) => {
    Ne(p, u && u.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (p, h) => {
    h ? p() : Gs(p);
  }), a.augmentJob = (p) => {
    e && (p.flags |= 4), d && (p.flags |= 2, u && (p.id = u.uid, p.i = u));
  };
  const f = td(t, e, a);
  return yi && (c ? c.push(f) : l && f()), f;
}
function ud(t, e, n) {
  const i = this.proxy, r = Te(t) ? t.includes(".") ? Pl(i, t) : () => i[t] : t.bind(i, i);
  let s;
  se(e) ? s = e : (s = e.handler, n = e);
  const o = Pi(this), a = Ai(r, s.bind(i), n);
  return o(), a;
}
function Pl(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const Ol = /* @__PURE__ */ Symbol("_vte"), Rl = (t) => t.__isTeleport, ai = (t) => t && (t.disabled || t.disabled === ""), ko = (t) => t && (t.defer || t.defer === ""), Ao = (t) => typeof SVGElement < "u" && t instanceof SVGElement, Po = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, ys = (t, e) => {
  const n = t && t.to;
  return Te(n) ? e ? e(n) : null : n;
}, Ml = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, r, s, o, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: f,
      o: { insert: p, querySelector: h, createText: m, createComment: g }
    } = c, E = ai(e.props);
    let { shapeFlag: w, children: S, dynamicChildren: y } = e;
    if (t == null) {
      const T = e.el = m(""), C = e.anchor = m("");
      p(T, n, i), p(C, n, i);
      const _ = (k, A) => {
        w & 16 && u(
          S,
          k,
          A,
          r,
          s,
          o,
          a,
          l
        );
      }, R = () => {
        const k = e.target = ys(e.props, h), A = bs(k, e, m, p);
        k && (o !== "svg" && Ao(k) ? o = "svg" : o !== "mathml" && Po(k) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(k), E || (_(k, A), Wi(e, !1)));
      };
      E && (_(n, C), Wi(e, !0)), ko(e.props) ? (e.el.__isMounted = !1, Ne(() => {
        R(), delete e.el.__isMounted;
      }, s)) : R();
    } else {
      if (ko(e.props) && t.el.__isMounted === !1) {
        Ne(() => {
          Ml.process(
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
      const T = e.anchor = t.anchor, C = e.target = t.target, _ = e.targetAnchor = t.targetAnchor, R = ai(t.props), k = R ? n : C, A = R ? T : _;
      if (o === "svg" || Ao(C) ? o = "svg" : (o === "mathml" || Po(C)) && (o = "mathml"), y ? (f(
        t.dynamicChildren,
        y,
        k,
        r,
        s,
        o,
        a
      ), Zs(t, e, !0)) : l || d(
        t,
        e,
        k,
        A,
        r,
        s,
        o,
        a,
        !1
      ), E)
        R ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : Di(
          e,
          n,
          T,
          c,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const I = e.target = ys(
          e.props,
          h
        );
        I && Di(
          e,
          I,
          null,
          c,
          0
        );
      } else R && Di(
        e,
        C,
        _,
        c,
        1
      );
      Wi(e, E);
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
        const m = a[h];
        i(
          m,
          e,
          n,
          p,
          !!m.dynamicChildren
        );
      }
    }
  },
  move: Di,
  hydrate: cd
};
function Di(t, e, n, { o: { insert: i }, m: r }, s = 2) {
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
function cd(t, e, n, i, r, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function f(g, E) {
    let w = E;
    for (; w; ) {
      if (w && w.nodeType === 8) {
        if (w.data === "teleport start anchor")
          e.targetStart = w;
        else if (w.data === "teleport anchor") {
          e.targetAnchor = w, g._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      w = o(w);
    }
  }
  function p(g, E) {
    E.anchor = d(
      o(g),
      E,
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
  ), m = ai(e.props);
  if (h) {
    const g = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (m ? (p(t, e), f(h, g), e.targetAnchor || bs(
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
    ))), Wi(e, m);
  } else m && e.shapeFlag & 16 && (p(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Il = Ml;
function Wi(t, e) {
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
  return s[Ol] = o, t && (i(s, t, r), i(o, t, r)), o;
}
const Tt = /* @__PURE__ */ Symbol("_leaveCb"), Zn = /* @__PURE__ */ Symbol("_enterCb");
function dd() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Me(() => {
    t.isMounted = !0;
  }), en(() => {
    t.isUnmounting = !0;
  }), t;
}
const ut = [Function, Array], Ll = {
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
}, Dl = (t) => {
  const e = t.subTree;
  return e.component ? Dl(e.component) : e;
}, fd = {
  name: "BaseTransition",
  props: Ll,
  setup(t, { slots: e }) {
    const n = it(), i = dd();
    return () => {
      const r = e.default && Fl(e.default(), !0);
      if (!r || !r.length)
        return;
      const s = $l(r), o = /* @__PURE__ */ he(t), { mode: a } = o;
      if (i.isLeaving)
        return Kr(s);
      const l = Oo(s);
      if (!l)
        return Kr(s);
      let c = ws(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      l.type !== Be && vi(l, c);
      let u = n.subTree && Oo(n.subTree);
      if (u && u.type !== Be && !xn(u, l) && Dl(n).type !== Be) {
        let d = ws(
          u,
          o,
          i,
          n
        );
        if (vi(u, d), a === "out-in" && l.type !== Be)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, Kr(s);
        a === "in-out" && l.type !== Be ? d.delayLeave = (f, p, h) => {
          const m = Bl(
            i,
            u
          );
          m[String(u.key)] = u, f[Tt] = () => {
            p(), f[Tt] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return s;
    };
  }
};
function $l(t) {
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
const pd = fd;
function Bl(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function ws(t, e, n, i, r) {
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
    onLeaveCancelled: m,
    onBeforeAppear: g,
    onAppear: E,
    onAfterAppear: w,
    onAppearCancelled: S
  } = e, y = String(t.key), T = Bl(n, t), C = (k, A) => {
    k && yt(
      k,
      i,
      9,
      A
    );
  }, _ = (k, A) => {
    const I = A[1];
    C(k, A), te(k) ? k.every((P) => P.length <= 1) && I() : k.length <= 1 && I();
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
      k[Tt] && k[Tt](
        !0
        /* cancelled */
      );
      const I = T[y];
      I && xn(t, I) && I.el[Tt] && I.el[Tt](), C(A, [k]);
    },
    enter(k) {
      let A = c, I = u, P = d;
      if (!n.isMounted)
        if (s)
          A = E || c, I = w || u, P = S || d;
        else
          return;
      let H = !1;
      k[Zn] = (U) => {
        H || (H = !0, U ? C(P, [k]) : C(I, [k]), R.delayedLeave && R.delayedLeave(), k[Zn] = void 0);
      };
      const L = k[Zn].bind(null, !1);
      A ? _(A, [k, L]) : L();
    },
    leave(k, A) {
      const I = String(t.key);
      if (k[Zn] && k[Zn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return A();
      C(f, [k]);
      let P = !1;
      k[Tt] = (L) => {
        P || (P = !0, A(), L ? C(m, [k]) : C(h, [k]), k[Tt] = void 0, T[I] === t && delete T[I]);
      };
      const H = k[Tt].bind(null, !1);
      T[I] = t, p ? _(p, [k, H]) : H();
    },
    clone(k) {
      const A = ws(
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
function Kr(t) {
  if (kr(t))
    return t = Yt(t), t.children = null, t;
}
function Oo(t) {
  if (!kr(t))
    return Rl(t.type) && t.children ? $l(t.children) : t;
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
function vi(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, vi(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Fl(t, e = !1, n) {
  let i = [], r = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Ee ? (o.patchFlag & 128 && r++, i = i.concat(
      Fl(o.children, e, a)
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
function Nl() {
  const t = it();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function zl(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function mi(t) {
  const e = it(), n = /* @__PURE__ */ kn(null);
  if (e) {
    const r = e.refs === ve ? e.refs = {} : e.refs;
    Object.defineProperty(r, t, {
      enumerable: !0,
      get: () => n.value,
      set: (s) => n.value = s
    });
  }
  return n;
}
function Ro(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const nr = /* @__PURE__ */ new WeakMap();
function li(t, e, n, i, r = !1) {
  if (te(t)) {
    t.forEach(
      (m, g) => li(
        m,
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
  const s = i.shapeFlag & 4 ? Mr(i.component) : i.el, o = r ? null : s, { i: a, r: l } = t, c = e && e.r, u = a.refs === ve ? a.refs = {} : a.refs, d = a.setupState, f = /* @__PURE__ */ he(d), p = d === ve ? ja : (m) => Ro(u, m) ? !1 : ge(f, m), h = (m, g) => !(g && Ro(u, g));
  if (c != null && c !== l) {
    if (Mo(e), Te(c))
      u[c] = null, p(c) && (d[c] = null);
    else if (/* @__PURE__ */ De(c)) {
      const m = e;
      h(c, m.k) && (c.value = null), m.k && (u[m.k] = null);
    }
  }
  if (se(l))
    Ti(l, a, 12, [o, u]);
  else {
    const m = Te(l), g = /* @__PURE__ */ De(l);
    if (m || g) {
      const E = () => {
        if (t.f) {
          const w = m ? p(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (r)
            te(w) && Hs(w, s);
          else if (te(w))
            w.includes(s) || w.push(s);
          else if (m)
            u[l] = [s], p(l) && (d[l] = u[l]);
          else {
            const S = [s];
            h(l, t.k) && (l.value = S), t.k && (u[t.k] = S);
          }
        } else m ? (u[l] = o, p(l) && (d[l] = o)) : g && (h(l, t.k) && (l.value = o), t.k && (u[t.k] = o));
      };
      if (o) {
        const w = () => {
          E(), nr.delete(t);
        };
        w.id = -1, nr.set(t, w), Ne(w, n);
      } else
        Mo(t), E();
    }
  }
}
function Mo(t) {
  const e = nr.get(t);
  e && (e.flags |= 8, nr.delete(t));
}
br().requestIdleCallback;
br().cancelIdleCallback;
const qn = (t) => !!t.type.__asyncLoader, kr = (t) => t.type.__isKeepAlive;
function hd(t, e) {
  ql(t, "a", e);
}
function vd(t, e) {
  ql(t, "da", e);
}
function ql(t, e, n = He) {
  const i = t.__wdc || (t.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return t();
  });
  if (Ar(e, i, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      kr(r.parent.vnode) && md(i, e, n, r), r = r.parent;
  }
}
function md(t, e, n, i) {
  const r = Ar(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  Pn(() => {
    Hs(i[e], r);
  }, n);
}
function Ar(t, e, n = He, i = !1) {
  if (n) {
    const r = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Kt();
      const a = Pi(n), l = yt(e, n, t, o);
      return a(), Xt(), l;
    });
    return i ? r.unshift(s) : r.push(s), s;
  }
}
const Qt = (t) => (e, n = He) => {
  (!yi || t === "sp") && Ar(t, (...i) => e(...i), n);
}, gd = Qt("bm"), Me = Qt("m"), yd = Qt(
  "bu"
), bd = Qt("u"), en = Qt(
  "bum"
), Pn = Qt("um"), wd = Qt(
  "sp"
), _d = Qt("rtg"), xd = Qt("rtc");
function Sd(t, e = He) {
  Ar("ec", t, e);
}
const Cd = "components", Hl = /* @__PURE__ */ Symbol.for("v-ndc");
function Ed(t) {
  return Te(t) ? Td(Cd, t, !1) || t : t || Hl;
}
function Td(t, e, n = !0, i = !1) {
  const r = Fe || He;
  if (r) {
    const s = r.type;
    {
      const a = ff(
        s,
        !1
      );
      if (a && (a === e || a === $e(e) || a === yr($e(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Io(r[t] || s[t], e) || // global registration
      Io(r.appContext[t], e)
    );
    return !o && i ? s : o;
  }
}
function Io(t, e) {
  return t && (t[e] || t[$e(e)] || t[yr($e(e))]);
}
function On(t, e, n, i) {
  let r;
  const s = n, o = te(t);
  if (o || Te(t)) {
    const a = o && /* @__PURE__ */ En(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ ot(t), c = /* @__PURE__ */ Gt(t), t = _r(t)), r = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      r[u] = e(
        l ? c ? Vn(gt(t[u])) : gt(t[u]) : t[u],
        u,
        void 0,
        s
      );
  } else if (typeof t == "number") {
    r = new Array(t);
    for (let a = 0; a < t; a++)
      r[a] = e(a + 1, a, void 0, s);
  } else if (be(t))
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
      [W("slot", n, i && i())],
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
      key: (a && !mt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
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
const _s = (t) => t ? uu(t) ? Mr(t) : _s(t.parent) : null, ui = (
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
    $parent: (t) => _s(t.parent),
    $root: (t) => _s(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => jl(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Gs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Oe.bind(t.proxy)),
    $watch: (t) => ud.bind(t)
  })
), Xr = (t, e) => t !== ve && !t.__isScriptSetup && ge(t, e), kd = {
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
        if (Xr(i, e))
          return o[e] = 1, i[e];
        if (r !== ve && ge(r, e))
          return o[e] = 2, r[e];
        if (ge(s, e))
          return o[e] = 3, s[e];
        if (n !== ve && ge(n, e))
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
    if (n !== ve && ge(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ge(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: r, ctx: s } = t;
    return Xr(r, e) ? (r[e] = n, !0) : i !== ve && ge(i, e) ? (i[e] = n, !0) : ge(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: r, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== ve && a[0] !== "$" && ge(t, a) || Xr(e, a) || ge(s, a) || ge(i, a) || ge(ui, a) || ge(r.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ge(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Ad() {
  return Pd().slots;
}
function Pd(t) {
  const e = it();
  return e.setupContext || (e.setupContext = du(e));
}
function xs(t) {
  return te(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Od(t, e) {
  const n = xs(t);
  for (const i in e) {
    if (i.startsWith("__skip")) continue;
    let r = n[i];
    r ? te(r) || se(r) ? r = n[i] = { type: r, default: e[i] } : r.default = e[i] : r === null && (r = n[i] = { default: e[i] }), r && e[`__skip_${i}`] && (r.skipFactory = !0);
  }
  return n;
}
let Ss = !0;
function Rd(t) {
  const e = jl(t), n = t.proxy, i = t.ctx;
  Ss = !1, e.beforeCreate && Lo(e.beforeCreate, t, "bc");
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
    activated: m,
    deactivated: g,
    beforeDestroy: E,
    beforeUnmount: w,
    destroyed: S,
    unmounted: y,
    render: T,
    renderTracked: C,
    renderTriggered: _,
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
    be(J) && (t.data = /* @__PURE__ */ Ei(J));
  }
  if (Ss = !0, s)
    for (const J in s) {
      const Q = s[J], we = se(Q) ? Q.bind(n, n) : se(Q.get) ? Q.get.bind(n, n) : Ot, Le = !se(Q) && se(Q.set) ? Q.set.bind(n) : Ot, Je = B({
        get: we,
        set: Le
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
      Vl(a[J], i, n, J);
  if (l) {
    const J = se(l) ? l.call(n) : l;
    Reflect.ownKeys(J).forEach((Q) => {
      ki(Q, J[Q]);
    });
  }
  u && Lo(u, t, "c");
  function ne(J, Q) {
    te(Q) ? Q.forEach((we) => J(we.bind(n))) : Q && J(Q.bind(n));
  }
  if (ne(gd, d), ne(Me, f), ne(yd, p), ne(bd, h), ne(hd, m), ne(vd, g), ne(Sd, R), ne(xd, C), ne(_d, _), ne(en, w), ne(Pn, y), ne(wd, k), te(A))
    if (A.length) {
      const J = t.exposed || (t.exposed = {});
      A.forEach((Q) => {
        Object.defineProperty(J, Q, {
          get: () => n[Q],
          set: (we) => n[Q] = we,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  T && t.render === Ot && (t.render = T), I != null && (t.inheritAttrs = I), P && (t.components = P), H && (t.directives = H), k && zl(t);
}
function Md(t, e, n = Ot) {
  te(t) && (t = Cs(t));
  for (const i in t) {
    const r = t[i];
    let s;
    be(r) ? "default" in r ? s = ln(
      r.from || i,
      r.default,
      !0
    ) : s = ln(r.from || i) : s = ln(r), /* @__PURE__ */ De(s) ? Object.defineProperty(e, i, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[i] = s;
  }
}
function Lo(t, e, n) {
  yt(
    te(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Vl(t, e, n, i) {
  let r = i.includes(".") ? Pl(n, i) : () => n[i];
  if (Te(t)) {
    const s = e[t];
    se(s) && me(r, s);
  } else if (se(t))
    me(r, t.bind(n));
  else if (be(t))
    if (te(t))
      t.forEach((s) => Vl(s, e, n, i));
    else {
      const s = se(t.handler) ? t.handler.bind(n) : e[t.handler];
      se(s) && me(r, s, t);
    }
}
function jl(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !r.length && !n && !i ? l = e : (l = {}, r.length && r.forEach(
    (c) => ir(l, c, o, !0)
  ), ir(l, e, o)), be(e) && s.set(e, l), l;
}
function ir(t, e, n, i = !1) {
  const { mixins: r, extends: s } = e;
  s && ir(t, s, n, !0), r && r.forEach(
    (o) => ir(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = Id[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Id = {
  data: Do,
  props: $o,
  emits: $o,
  // objects
  methods: ni,
  computed: ni,
  // lifecycle
  beforeCreate: Ve,
  created: Ve,
  beforeMount: Ve,
  mounted: Ve,
  beforeUpdate: Ve,
  updated: Ve,
  beforeDestroy: Ve,
  beforeUnmount: Ve,
  destroyed: Ve,
  unmounted: Ve,
  activated: Ve,
  deactivated: Ve,
  errorCaptured: Ve,
  serverPrefetch: Ve,
  // assets
  components: ni,
  directives: ni,
  // watch
  watch: Dd,
  // provide / inject
  provide: Do,
  inject: Ld
};
function Do(t, e) {
  return e ? t ? function() {
    return ke(
      se(t) ? t.call(this, this) : t,
      se(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Ld(t, e) {
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
function Ve(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function ni(t, e) {
  return t ? ke(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function $o(t, e) {
  return t ? te(t) && te(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : ke(
    /* @__PURE__ */ Object.create(null),
    xs(t),
    xs(e ?? {})
  ) : e;
}
function Dd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = ke(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Ve(t[i], e[i]);
  return n;
}
function Ul() {
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
let $d = 0;
function Bd(t, e) {
  return function(i, r = null) {
    se(i) || (i = ke({}, i)), r != null && !be(r) && (r = null);
    const s = Ul(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = s.app = {
      _uid: $d++,
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
          const p = c._ceVNode || W(i, r);
          return p.appContext = s, f === !0 ? f = "svg" : f === !1 && (f = void 0), t(p, u, f), l = !0, c._container = u, u.__vue_app__ = c, Mr(p.component);
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
function Fd(t, e, n = ve) {
  const i = it(), r = $e(e), s = tt(e), o = Kl(t, r), a = _l((l, c) => {
    let u, d = ve, f;
    return ld(() => {
      const p = t[r];
      je(u, p) && (u = p, c());
    }), {
      get() {
        return l(), n.get ? n.get(u) : u;
      },
      set(p) {
        const h = n.set ? n.set(p) : p;
        if (!je(h, u) && !(d !== ve && je(p, d)))
          return;
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || r in m || s in m) && (`onUpdate:${e}` in m || `onUpdate:${r}` in m || `onUpdate:${s}` in m) || (u = p, c()), i.emit(`update:${e}`, h), je(p, h) && je(p, d) && !je(h, f) && c(), d = p, f = h;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? o || ve : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const Kl = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${$e(e)}Modifiers`] || t[`${tt(e)}Modifiers`];
function Nd(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || ve;
  let r = n;
  const s = e.startsWith("update:"), o = s && Kl(i, e.slice(7));
  o && (o.trim && (r = n.map((u) => Te(u) ? u.trim() : u)), o.number && (r = n.map(wc)));
  let a, l = i[a = qi(e)] || // also try camelCase event handler (#2249)
  i[a = qi($e(e))];
  !l && s && (l = i[a = qi(tt(e))]), l && yt(
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
const zd = /* @__PURE__ */ new WeakMap();
function Xl(t, e, n = !1) {
  const i = n ? zd : e.emitsCache, r = i.get(t);
  if (r !== void 0)
    return r;
  const s = t.emits;
  let o = {}, a = !1;
  if (!se(t)) {
    const l = (c) => {
      const u = Xl(c, e, !0);
      u && (a = !0, ke(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (be(t) && i.set(t, null), null) : (te(s) ? s.forEach((l) => o[l] = null) : ke(o, s), be(t) && i.set(t, o), o);
}
function Pr(t, e) {
  return !t || !hr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ge(t, e[0].toLowerCase() + e.slice(1)) || ge(t, tt(e)) || ge(t, e));
}
function Bo(t) {
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
    inheritAttrs: m
  } = t, g = tr(t);
  let E, w;
  try {
    if (n.shapeFlag & 4) {
      const y = r || i, T = y;
      E = kt(
        c.call(
          T,
          y,
          u,
          d,
          p,
          f,
          h
        )
      ), w = a;
    } else {
      const y = e;
      E = kt(
        y.length > 1 ? y(
          d,
          { attrs: a, slots: o, emit: l }
        ) : y(
          d,
          null
        )
      ), w = e.props ? a : qd(a);
    }
  } catch (y) {
    ci.length = 0, Tr(y, t, 1), E = W(Be);
  }
  let S = E;
  if (w && m !== !1) {
    const y = Object.keys(w), { shapeFlag: T } = S;
    y.length && T & 7 && (s && y.some(qs) && (w = Hd(
      w,
      s
    )), S = Yt(S, w, !1, !0));
  }
  return n.dirs && (S = Yt(S, null, !1, !0), S.dirs = S.dirs ? S.dirs.concat(n.dirs) : n.dirs), n.transition && vi(S, n.transition), E = S, tr(g), E;
}
const qd = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || hr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, Hd = (t, e) => {
  const n = {};
  for (const i in t)
    (!qs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function Wd(t, e, n) {
  const { props: i, children: r, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Fo(i, o, c) : !!o;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        if (Gl(o, i, f) && !Pr(c, f))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Fo(i, o, c) : !0 : !!o;
  return !1;
}
function Fo(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    if (Gl(e, t, s) && !Pr(n, s))
      return !0;
  }
  return !1;
}
function Gl(t, e, n) {
  const i = t[n], r = e[n];
  return n === "style" && be(i) && be(r) ? !Vs(i, r) : i !== r;
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
const Yl = {}, Jl = () => Object.create(Yl), Zl = (t) => Object.getPrototypeOf(t) === Yl;
function jd(t, e, n, i = !1) {
  const r = {}, s = Jl();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), Ql(t, e, r, s);
  for (const o in t.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? t.props = i ? r : /* @__PURE__ */ Sr(r) : t.type.props ? t.props = r : t.props = s, t.attrs = s;
}
function Ud(t, e, n, i) {
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
        if (Pr(t.emitsOptions, f))
          continue;
        const p = e[f];
        if (l)
          if (ge(s, f))
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
    Ql(t, e, r, s) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ge(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = tt(d)) === d || !ge(e, u))) && (l ? n && // for camelCase
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
        (!e || !ge(e, d)) && (delete s[d], c = !0);
  }
  c && jt(t.attrs, "set", "");
}
function Ql(t, e, n, i) {
  const [r, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (ri(l))
        continue;
      const c = e[l];
      let u;
      r && ge(r, u = $e(l)) ? !s || !s.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Pr(t.emitsOptions, l) || (!(l in i) || c !== i[l]) && (i[l] = c, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ he(n), c = a || ve;
    for (let u = 0; u < s.length; u++) {
      const d = s[u];
      n[d] = Es(
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
function Es(t, e, n, i, r, s) {
  const o = t[n];
  if (o != null) {
    const a = ge(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && se(l)) {
        const { propsDefaults: c } = r;
        if (n in c)
          i = c[n];
        else {
          const u = Pi(r);
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
const Kd = /* @__PURE__ */ new WeakMap();
function eu(t, e, n = !1) {
  const i = n ? Kd : e.propsCache, r = i.get(t);
  if (r)
    return r;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!se(t)) {
    const u = (d) => {
      l = !0;
      const [f, p] = eu(d, e, !0);
      ke(o, f), p && a.push(...p);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!s && !l)
    return be(t) && i.set(t, Fn), Fn;
  if (te(s))
    for (let u = 0; u < s.length; u++) {
      const d = $e(s[u]);
      No(d) && (o[d] = ve);
    }
  else if (s)
    for (const u in s) {
      const d = $e(u);
      if (No(d)) {
        const f = s[u], p = o[d] = te(f) || se(f) ? { type: f } : ke({}, f), h = p.type;
        let m = !1, g = !0;
        if (te(h))
          for (let E = 0; E < h.length; ++E) {
            const w = h[E], S = se(w) && w.name;
            if (S === "Boolean") {
              m = !0;
              break;
            } else S === "String" && (g = !1);
          }
        else
          m = se(h) && h.name === "Boolean";
        p[
          0
          /* shouldCast */
        ] = m, p[
          1
          /* shouldCastTrue */
        ] = g, (m || ge(p, "default")) && a.push(d);
      }
    }
  const c = [o, a];
  return be(t) && i.set(t, c), c;
}
function No(t) {
  return t[0] !== "$" && !ri(t);
}
const Ys = (t) => t === "_" || t === "_ctx" || t === "$stable", Js = (t) => te(t) ? t.map(kt) : [kt(t)], Xd = (t, e, n) => {
  if (e._n)
    return e;
  const i = q((...r) => Js(e(...r)), n);
  return i._c = !1, i;
}, tu = (t, e, n) => {
  const i = t._ctx;
  for (const r in t) {
    if (Ys(r)) continue;
    const s = t[r];
    if (se(s))
      e[r] = Xd(r, s, i);
    else if (s != null) {
      const o = Js(s);
      e[r] = () => o;
    }
  }
}, nu = (t, e) => {
  const n = Js(e);
  t.slots.default = () => n;
}, iu = (t, e, n) => {
  for (const i in e)
    (n || !Ys(i)) && (t[i] = e[i]);
}, Gd = (t, e, n) => {
  const i = t.slots = Jl();
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (iu(i, e, n), n && Ga(i, "_", r, !0)) : tu(e, i);
  } else e && nu(t, e);
}, Yd = (t, e, n) => {
  const { vnode: i, slots: r } = t;
  let s = !0, o = ve;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : iu(r, e, n) : (s = !e.$stable, tu(e, r)), o = e;
  } else e && (nu(t, e), o = { default: 1 });
  if (s)
    for (const a in r)
      !Ys(a) && o[a] == null && delete r[a];
}, Ne = tf;
function Jd(t) {
  return Zd(t);
}
function Zd(t, e) {
  const n = br();
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
    setScopeId: p = Ot,
    insertStaticContent: h
  } = t, m = (b, x, O, z = null, $ = null, F = null, K = void 0, j = null, V = !!x.dynamicChildren) => {
    if (b === x)
      return;
    b && !xn(b, x) && (z = X(b), Ae(b, $, F, !0), b = null), x.patchFlag === -2 && (V = !1, x.dynamicChildren = null);
    const { type: N, ref: ie, shapeFlag: Y } = x;
    switch (N) {
      case Or:
        g(b, x, O, z);
        break;
      case Be:
        E(b, x, O, z);
        break;
      case Vi:
        b == null && w(x, O, z, K);
        break;
      case Ee:
        P(
          b,
          x,
          O,
          z,
          $,
          F,
          K,
          j,
          V
        );
        break;
      default:
        Y & 1 ? T(
          b,
          x,
          O,
          z,
          $,
          F,
          K,
          j,
          V
        ) : Y & 6 ? H(
          b,
          x,
          O,
          z,
          $,
          F,
          K,
          j,
          V
        ) : (Y & 64 || Y & 128) && N.process(
          b,
          x,
          O,
          z,
          $,
          F,
          K,
          j,
          V,
          pe
        );
    }
    ie != null && $ ? li(ie, b && b.ref, F, x || b, !x) : ie == null && b && b.ref != null && li(b.ref, null, F, b, !0);
  }, g = (b, x, O, z) => {
    if (b == null)
      i(
        x.el = a(x.children),
        O,
        z
      );
    else {
      const $ = x.el = b.el;
      x.children !== b.children && c($, x.children);
    }
  }, E = (b, x, O, z) => {
    b == null ? i(
      x.el = l(x.children || ""),
      O,
      z
    ) : x.el = b.el;
  }, w = (b, x, O, z) => {
    [b.el, b.anchor] = h(
      b.children,
      x,
      O,
      z,
      b.el,
      b.anchor
    );
  }, S = ({ el: b, anchor: x }, O, z) => {
    let $;
    for (; b && b !== x; )
      $ = f(b), i(b, O, z), b = $;
    i(x, O, z);
  }, y = ({ el: b, anchor: x }) => {
    let O;
    for (; b && b !== x; )
      O = f(b), r(b), b = O;
    r(x);
  }, T = (b, x, O, z, $, F, K, j, V) => {
    if (x.type === "svg" ? K = "svg" : x.type === "math" && (K = "mathml"), b == null)
      C(
        x,
        O,
        z,
        $,
        F,
        K,
        j,
        V
      );
    else {
      const N = b.el && b.el._isVueCE ? b.el : null;
      try {
        N && N._beginPatch(), k(
          b,
          x,
          $,
          F,
          K,
          j,
          V
        );
      } finally {
        N && N._endPatch();
      }
    }
  }, C = (b, x, O, z, $, F, K, j) => {
    let V, N;
    const { props: ie, shapeFlag: Y, transition: ee, dirs: ae } = b;
    if (V = b.el = o(
      b.type,
      F,
      ie && ie.is,
      ie
    ), Y & 8 ? u(V, b.children) : Y & 16 && R(
      b.children,
      V,
      null,
      z,
      $,
      Gr(b, F),
      K,
      j
    ), ae && mn(b, null, z, "created"), _(V, b, b.scopeId, K, z), ie) {
      for (const xe in ie)
        xe !== "value" && !ri(xe) && s(V, xe, null, ie[xe], F, z);
      "value" in ie && s(V, "value", null, ie.value, F), (N = ie.onVnodeBeforeMount) && Ct(N, z, b);
    }
    ae && mn(b, null, z, "beforeMount");
    const de = Qd($, ee);
    de && ee.beforeEnter(V), i(V, x, O), ((N = ie && ie.onVnodeMounted) || de || ae) && Ne(() => {
      N && Ct(N, z, b), de && ee.enter(V), ae && mn(b, null, z, "mounted");
    }, $);
  }, _ = (b, x, O, z, $) => {
    if (O && p(b, O), z)
      for (let F = 0; F < z.length; F++)
        p(b, z[F]);
    if ($) {
      let F = $.subTree;
      if (x === F || ou(F.type) && (F.ssContent === x || F.ssFallback === x)) {
        const K = $.vnode;
        _(
          b,
          K,
          K.scopeId,
          K.slotScopeIds,
          $.parent
        );
      }
    }
  }, R = (b, x, O, z, $, F, K, j, V = 0) => {
    for (let N = V; N < b.length; N++) {
      const ie = b[N] = j ? Vt(b[N]) : kt(b[N]);
      m(
        null,
        ie,
        x,
        O,
        z,
        $,
        F,
        K,
        j
      );
    }
  }, k = (b, x, O, z, $, F, K) => {
    const j = x.el = b.el;
    let { patchFlag: V, dynamicChildren: N, dirs: ie } = x;
    V |= b.patchFlag & 16;
    const Y = b.props || ve, ee = x.props || ve;
    let ae;
    if (O && gn(O, !1), (ae = ee.onVnodeBeforeUpdate) && Ct(ae, O, x, b), ie && mn(x, b, O, "beforeUpdate"), O && gn(O, !0), (Y.innerHTML && ee.innerHTML == null || Y.textContent && ee.textContent == null) && u(j, ""), N ? A(
      b.dynamicChildren,
      N,
      j,
      O,
      z,
      Gr(x, $),
      F
    ) : K || Q(
      b,
      x,
      j,
      null,
      O,
      z,
      Gr(x, $),
      F,
      !1
    ), V > 0) {
      if (V & 16)
        I(j, Y, ee, O, $);
      else if (V & 2 && Y.class !== ee.class && s(j, "class", null, ee.class, $), V & 4 && s(j, "style", Y.style, ee.style, $), V & 8) {
        const de = x.dynamicProps;
        for (let xe = 0; xe < de.length; xe++) {
          const _e = de[xe], Ze = Y[_e], Qe = ee[_e];
          (Qe !== Ze || _e === "value") && s(j, _e, Ze, Qe, $, O);
        }
      }
      V & 1 && b.children !== x.children && u(j, x.children);
    } else !K && N == null && I(j, Y, ee, O, $);
    ((ae = ee.onVnodeUpdated) || ie) && Ne(() => {
      ae && Ct(ae, O, x, b), ie && mn(x, b, O, "updated");
    }, z);
  }, A = (b, x, O, z, $, F, K) => {
    for (let j = 0; j < x.length; j++) {
      const V = b[j], N = x[j], ie = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        V.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (V.type === Ee || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !xn(V, N) || // - In the case of a component, it could contain anything.
        V.shapeFlag & 198) ? d(V.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          O
        )
      );
      m(
        V,
        N,
        ie,
        null,
        z,
        $,
        F,
        K,
        !0
      );
    }
  }, I = (b, x, O, z, $) => {
    if (x !== O) {
      if (x !== ve)
        for (const F in x)
          !ri(F) && !(F in O) && s(
            b,
            F,
            x[F],
            null,
            $,
            z
          );
      for (const F in O) {
        if (ri(F)) continue;
        const K = O[F], j = x[F];
        K !== j && F !== "value" && s(b, F, j, K, $, z);
      }
      "value" in O && s(b, "value", x.value, O.value, $);
    }
  }, P = (b, x, O, z, $, F, K, j, V) => {
    const N = x.el = b ? b.el : a(""), ie = x.anchor = b ? b.anchor : a("");
    let { patchFlag: Y, dynamicChildren: ee, slotScopeIds: ae } = x;
    ae && (j = j ? j.concat(ae) : ae), b == null ? (i(N, O, z), i(ie, O, z), R(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      x.children || [],
      O,
      ie,
      $,
      F,
      K,
      j,
      V
    )) : Y > 0 && Y & 64 && ee && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    b.dynamicChildren && b.dynamicChildren.length === ee.length ? (A(
      b.dynamicChildren,
      ee,
      O,
      $,
      F,
      K,
      j
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (x.key != null || $ && x === $.subTree) && Zs(
      b,
      x,
      !0
      /* shallow */
    )) : Q(
      b,
      x,
      O,
      ie,
      $,
      F,
      K,
      j,
      V
    );
  }, H = (b, x, O, z, $, F, K, j, V) => {
    x.slotScopeIds = j, b == null ? x.shapeFlag & 512 ? $.ctx.activate(
      x,
      O,
      z,
      K,
      V
    ) : L(
      x,
      O,
      z,
      $,
      F,
      K,
      V
    ) : U(b, x, V);
  }, L = (b, x, O, z, $, F, K) => {
    const j = b.component = lf(
      b,
      z,
      $
    );
    if (kr(b) && (j.ctx.renderer = pe), uf(j, !1, K), j.asyncDep) {
      if ($ && $.registerDep(j, ne, K), !b.el) {
        const V = j.subTree = W(Be);
        E(null, V, x, O), b.placeholder = V.el;
      }
    } else
      ne(
        j,
        b,
        x,
        O,
        $,
        F,
        K
      );
  }, U = (b, x, O) => {
    const z = x.component = b.component;
    if (Wd(b, x, O))
      if (z.asyncDep && !z.asyncResolved) {
        J(z, x, O);
        return;
      } else
        z.next = x, z.update();
    else
      x.el = b.el, z.vnode = x;
  }, ne = (b, x, O, z, $, F, K) => {
    const j = () => {
      if (b.isMounted) {
        let { next: Y, bu: ee, u: ae, parent: de, vnode: xe } = b;
        {
          const xt = ru(b);
          if (xt) {
            Y && (Y.el = xe.el, J(b, Y, K)), xt.asyncDep.then(() => {
              Ne(() => {
                b.isUnmounted || N();
              }, $);
            });
            return;
          }
        }
        let _e = Y, Ze;
        gn(b, !1), Y ? (Y.el = xe.el, J(b, Y, K)) : Y = xe, ee && Hr(ee), (Ze = Y.props && Y.props.onVnodeBeforeUpdate) && Ct(Ze, de, Y, xe), gn(b, !0);
        const Qe = Bo(b), _t = b.subTree;
        b.subTree = Qe, m(
          _t,
          Qe,
          // parent may have changed if it's in a teleport
          d(_t.el),
          // anchor may have changed if it's in a fragment
          X(_t),
          b,
          $,
          F
        ), Y.el = Qe.el, _e === null && Vd(b, Qe.el), ae && Ne(ae, $), (Ze = Y.props && Y.props.onVnodeUpdated) && Ne(
          () => Ct(Ze, de, Y, xe),
          $
        );
      } else {
        let Y;
        const { el: ee, props: ae } = x, { bm: de, m: xe, parent: _e, root: Ze, type: Qe } = b, _t = qn(x);
        gn(b, !1), de && Hr(de), !_t && (Y = ae && ae.onVnodeBeforeMount) && Ct(Y, _e, x), gn(b, !0);
        {
          Ze.ce && Ze.ce._hasShadowRoot() && Ze.ce._injectChildStyle(Qe);
          const xt = b.subTree = Bo(b);
          m(
            null,
            xt,
            O,
            z,
            b,
            $,
            F
          ), x.el = xt.el;
        }
        if (xe && Ne(xe, $), !_t && (Y = ae && ae.onVnodeMounted)) {
          const xt = x;
          Ne(
            () => Ct(Y, _e, xt),
            $
          );
        }
        (x.shapeFlag & 256 || _e && qn(_e.vnode) && _e.vnode.shapeFlag & 256) && b.a && Ne(b.a, $), b.isMounted = !0, x = O = z = null;
      }
    };
    b.scope.on();
    const V = b.effect = new nl(j);
    b.scope.off();
    const N = b.update = V.run.bind(V), ie = b.job = V.runIfDirty.bind(V);
    ie.i = b, ie.id = b.uid, V.scheduler = () => Gs(ie), gn(b, !0), N();
  }, J = (b, x, O) => {
    x.component = b;
    const z = b.vnode.props;
    b.vnode = x, b.next = null, Ud(b, x.props, z, O), Yd(b, x.children, O), Kt(), To(b), Xt();
  }, Q = (b, x, O, z, $, F, K, j, V = !1) => {
    const N = b && b.children, ie = b ? b.shapeFlag : 0, Y = x.children, { patchFlag: ee, shapeFlag: ae } = x;
    if (ee > 0) {
      if (ee & 128) {
        Le(
          N,
          Y,
          O,
          z,
          $,
          F,
          K,
          j,
          V
        );
        return;
      } else if (ee & 256) {
        we(
          N,
          Y,
          O,
          z,
          $,
          F,
          K,
          j,
          V
        );
        return;
      }
    }
    ae & 8 ? (ie & 16 && zt(N, $, F), Y !== N && u(O, Y)) : ie & 16 ? ae & 16 ? Le(
      N,
      Y,
      O,
      z,
      $,
      F,
      K,
      j,
      V
    ) : zt(N, $, F, !0) : (ie & 8 && u(O, ""), ae & 16 && R(
      Y,
      O,
      z,
      $,
      F,
      K,
      j,
      V
    ));
  }, we = (b, x, O, z, $, F, K, j, V) => {
    b = b || Fn, x = x || Fn;
    const N = b.length, ie = x.length, Y = Math.min(N, ie);
    let ee;
    for (ee = 0; ee < Y; ee++) {
      const ae = x[ee] = V ? Vt(x[ee]) : kt(x[ee]);
      m(
        b[ee],
        ae,
        O,
        null,
        $,
        F,
        K,
        j,
        V
      );
    }
    N > ie ? zt(
      b,
      $,
      F,
      !0,
      !1,
      Y
    ) : R(
      x,
      O,
      z,
      $,
      F,
      K,
      j,
      V,
      Y
    );
  }, Le = (b, x, O, z, $, F, K, j, V) => {
    let N = 0;
    const ie = x.length;
    let Y = b.length - 1, ee = ie - 1;
    for (; N <= Y && N <= ee; ) {
      const ae = b[N], de = x[N] = V ? Vt(x[N]) : kt(x[N]);
      if (xn(ae, de))
        m(
          ae,
          de,
          O,
          null,
          $,
          F,
          K,
          j,
          V
        );
      else
        break;
      N++;
    }
    for (; N <= Y && N <= ee; ) {
      const ae = b[Y], de = x[ee] = V ? Vt(x[ee]) : kt(x[ee]);
      if (xn(ae, de))
        m(
          ae,
          de,
          O,
          null,
          $,
          F,
          K,
          j,
          V
        );
      else
        break;
      Y--, ee--;
    }
    if (N > Y) {
      if (N <= ee) {
        const ae = ee + 1, de = ae < ie ? x[ae].el : z;
        for (; N <= ee; )
          m(
            null,
            x[N] = V ? Vt(x[N]) : kt(x[N]),
            O,
            de,
            $,
            F,
            K,
            j,
            V
          ), N++;
      }
    } else if (N > ee)
      for (; N <= Y; )
        Ae(b[N], $, F, !0), N++;
    else {
      const ae = N, de = N, xe = /* @__PURE__ */ new Map();
      for (N = de; N <= ee; N++) {
        const rt = x[N] = V ? Vt(x[N]) : kt(x[N]);
        rt.key != null && xe.set(rt.key, N);
      }
      let _e, Ze = 0;
      const Qe = ee - de + 1;
      let _t = !1, xt = 0;
      const Yn = new Array(Qe);
      for (N = 0; N < Qe; N++) Yn[N] = 0;
      for (N = ae; N <= Y; N++) {
        const rt = b[N];
        if (Ze >= Qe) {
          Ae(rt, $, F, !0);
          continue;
        }
        let St;
        if (rt.key != null)
          St = xe.get(rt.key);
        else
          for (_e = de; _e <= ee; _e++)
            if (Yn[_e - de] === 0 && xn(rt, x[_e])) {
              St = _e;
              break;
            }
        St === void 0 ? Ae(rt, $, F, !0) : (Yn[St - de] = N + 1, St >= xt ? xt = St : _t = !0, m(
          rt,
          x[St],
          O,
          null,
          $,
          F,
          K,
          j,
          V
        ), Ze++);
      }
      const yo = _t ? ef(Yn) : Fn;
      for (_e = yo.length - 1, N = Qe - 1; N >= 0; N--) {
        const rt = de + N, St = x[rt], bo = x[rt + 1], wo = rt + 1 < ie ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          bo.el || su(bo)
        ) : z;
        Yn[N] === 0 ? m(
          null,
          St,
          O,
          wo,
          $,
          F,
          K,
          j,
          V
        ) : _t && (_e < 0 || N !== yo[_e] ? Je(St, O, wo, 2) : _e--);
      }
    }
  }, Je = (b, x, O, z, $ = null) => {
    const { el: F, type: K, transition: j, children: V, shapeFlag: N } = b;
    if (N & 6) {
      Je(b.component.subTree, x, O, z);
      return;
    }
    if (N & 128) {
      b.suspense.move(x, O, z);
      return;
    }
    if (N & 64) {
      K.move(b, x, O, pe);
      return;
    }
    if (K === Ee) {
      i(F, x, O);
      for (let Y = 0; Y < V.length; Y++)
        Je(V[Y], x, O, z);
      i(b.anchor, x, O);
      return;
    }
    if (K === Vi) {
      S(b, x, O);
      return;
    }
    if (z !== 2 && N & 1 && j)
      if (z === 0)
        j.beforeEnter(F), i(F, x, O), Ne(() => j.enter(F), $);
      else {
        const { leave: Y, delayLeave: ee, afterLeave: ae } = j, de = () => {
          b.ctx.isUnmounted ? r(F) : i(F, x, O);
        }, xe = () => {
          F._isLeaving && F[Tt](
            !0
            /* cancelled */
          ), Y(F, () => {
            de(), ae && ae();
          });
        };
        ee ? ee(F, de, xe) : xe();
      }
    else
      i(F, x, O);
  }, Ae = (b, x, O, z = !1, $ = !1) => {
    const {
      type: F,
      props: K,
      ref: j,
      children: V,
      dynamicChildren: N,
      shapeFlag: ie,
      patchFlag: Y,
      dirs: ee,
      cacheIndex: ae
    } = b;
    if (Y === -2 && ($ = !1), j != null && (Kt(), li(j, null, O, b, !0), Xt()), ae != null && (x.renderCache[ae] = void 0), ie & 256) {
      x.ctx.deactivate(b);
      return;
    }
    const de = ie & 1 && ee, xe = !qn(b);
    let _e;
    if (xe && (_e = K && K.onVnodeBeforeUnmount) && Ct(_e, x, b), ie & 6)
      Gn(b.component, O, z);
    else {
      if (ie & 128) {
        b.suspense.unmount(O, z);
        return;
      }
      de && mn(b, null, x, "beforeUnmount"), ie & 64 ? b.type.remove(
        b,
        x,
        O,
        pe,
        z
      ) : N && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !N.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (F !== Ee || Y > 0 && Y & 64) ? zt(
        N,
        x,
        O,
        !1,
        !0
      ) : (F === Ee && Y & 384 || !$ && ie & 16) && zt(V, x, O), z && Ft(b);
    }
    (xe && (_e = K && K.onVnodeUnmounted) || de) && Ne(() => {
      _e && Ct(_e, x, b), de && mn(b, null, x, "unmounted");
    }, O);
  }, Ft = (b) => {
    const { type: x, el: O, anchor: z, transition: $ } = b;
    if (x === Ee) {
      Nt(O, z);
      return;
    }
    if (x === Vi) {
      y(b);
      return;
    }
    const F = () => {
      r(O), $ && !$.persisted && $.afterLeave && $.afterLeave();
    };
    if (b.shapeFlag & 1 && $ && !$.persisted) {
      const { leave: K, delayLeave: j } = $, V = () => K(O, F);
      j ? j(b.el, F, V) : V();
    } else
      F();
  }, Nt = (b, x) => {
    let O;
    for (; b !== x; )
      O = f(b), r(b), b = O;
    r(x);
  }, Gn = (b, x, O) => {
    const { bum: z, scope: $, job: F, subTree: K, um: j, m: V, a: N } = b;
    zo(V), zo(N), z && Hr(z), $.stop(), F && (F.flags |= 8, Ae(K, b, x, O)), j && Ne(j, x), Ne(() => {
      b.isUnmounted = !0;
    }, x);
  }, zt = (b, x, O, z = !1, $ = !1, F = 0) => {
    for (let K = F; K < b.length; K++)
      Ae(b[K], x, O, z, $);
  }, X = (b) => {
    if (b.shapeFlag & 6)
      return X(b.component.subTree);
    if (b.shapeFlag & 128)
      return b.suspense.next();
    const x = f(b.anchor || b.el), O = x && x[Ol];
    return O ? f(O) : x;
  };
  let re = !1;
  const ue = (b, x, O) => {
    let z;
    b == null ? x._vnode && (Ae(x._vnode, null, null, !0), z = x._vnode.component) : m(
      x._vnode || null,
      b,
      x,
      null,
      null,
      null,
      O
    ), x._vnode = b, re || (re = !0, To(z), El(), re = !1);
  }, pe = {
    p: m,
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
    createApp: Bd(ue)
  };
}
function Gr({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function gn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function Qd(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function Zs(t, e, n = !1) {
  const i = t.children, r = e.children;
  if (te(i) && te(r))
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let a = r[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[s] = Vt(r[s]), a.el = o.el), !n && a.patchFlag !== -2 && Zs(o, a)), a.type === Or && (a.patchFlag === -1 && (a = r[s] = Vt(a)), a.el = o.el), a.type === Be && !a.el && (a.el = o.el);
    }
}
function ef(t) {
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
function ru(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : ru(e);
}
function zo(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function su(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? su(e.subTree) : null;
}
const ou = (t) => t.__isSuspense;
function tf(t, e) {
  e && e.pendingBranch ? te(t) ? e.effects.push(...t) : e.effects.push(t) : rd(t);
}
const Ee = /* @__PURE__ */ Symbol.for("v-fgt"), Or = /* @__PURE__ */ Symbol.for("v-txt"), Be = /* @__PURE__ */ Symbol.for("v-cmt"), Vi = /* @__PURE__ */ Symbol.for("v-stc"), ci = [];
let Xe = null;
function M(t = !1) {
  ci.push(Xe = t ? null : []);
}
function nf() {
  ci.pop(), Xe = ci[ci.length - 1] || null;
}
let jn = 1;
function rr(t, e = !1) {
  jn += t, t < 0 && Xe && e && (Xe.hasOnce = !0);
}
function au(t) {
  return t.dynamicChildren = jn > 0 ? Xe || Fn : null, nf(), jn > 0 && Xe && Xe.push(t), t;
}
function le(t, e, n, i, r, s) {
  return au(
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
  return au(
    W(
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
const lu = ({ key: t }) => t ?? null, ji = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Te(t) || /* @__PURE__ */ De(t) || se(t) ? { i: Fe, r: t, k: e, f: !!n } : t : null);
function oe(t, e = null, n = null, i = 0, r = null, s = t === Ee ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && lu(e),
    ref: e && ji(e),
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
  return a ? (Qs(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= Te(n) ? 8 : 16), jn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Xe && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Xe.push(l), l;
}
const W = rf;
function rf(t, e = null, n = null, i = 0, r = null, s = !1) {
  if ((!t || t === Hl) && (t = Be), gi(t)) {
    const a = Yt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Qs(a, n), jn > 0 && !s && Xe && (a.shapeFlag & 6 ? Xe[Xe.indexOf(t)] = a : Xe.push(a)), a.patchFlag = -2, a;
  }
  if (pf(t) && (t = t.__vccOpts), e) {
    e = Rr(e);
    let { class: a, style: l } = e;
    a && !Te(a) && (e.class = un(a)), be(l) && (/* @__PURE__ */ Er(l) && !te(l) && (l = ke({}, l)), e.style = Lt(l));
  }
  const o = Te(t) ? 1 : ou(t) ? 128 : Rl(t) ? 64 : be(t) ? 4 : se(t) ? 2 : 0;
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
  return t ? /* @__PURE__ */ Er(t) || Zl(t) ? ke({}, t) : t : null;
}
function Yt(t, e, n = !1, i = !1) {
  const { props: r, ref: s, patchFlag: o, children: a, transition: l } = t, c = e ? Ce(r || {}, e) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && lu(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? te(s) ? s.concat(ji(e)) : [s, ji(e)] : ji(e)
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
  return l && i && vi(
    u,
    l.clone(u)
  ), u;
}
function Ye(t = " ", e = 0) {
  return W(Or, null, t, e);
}
function sf(t, e) {
  const n = W(Vi, null, t);
  return n.staticCount = e, n;
}
function fe(t = "", e = !1) {
  return e ? (M(), G(Be, null, t)) : W(Be, null, t);
}
function kt(t) {
  return t == null || typeof t == "boolean" ? W(Be) : te(t) ? W(
    Ee,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : gi(t) ? Vt(t) : W(Or, null, String(t));
}
function Vt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Yt(t);
}
function Qs(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (te(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const r = e.default;
      r && (r._c && (r._d = !1), Qs(t, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = e._;
      !r && !Zl(e) ? e._ctx = Fe : r === 3 && Fe && (Fe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
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
        e.style = Lt([e.style, i.style]);
      else if (hr(r)) {
        const s = e[r], o = i[r];
        o && s !== o && !(te(s) && s.includes(o)) && (e[r] = s ? [].concat(s, o) : o);
      } else r !== "" && (e[r] = i[r]);
  }
  return e;
}
function Ct(t, e, n, i = null) {
  yt(t, e, 7, [
    n,
    i
  ]);
}
const of = Ul();
let af = 0;
function lf(t, e, n) {
  const i = t.type, r = (e ? e.appContext : t.appContext) || of, s = {
    uid: af++,
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
    propsOptions: eu(i, r),
    emitsOptions: Xl(i, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ve,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: ve,
    data: ve,
    props: ve,
    attrs: ve,
    slots: ve,
    refs: ve,
    setupState: ve,
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Nd.bind(null, s), t.ce && t.ce(s), s;
}
let He = null;
const it = () => He || Fe;
let sr, Ts;
{
  const t = br(), e = (n, i) => {
    let r;
    return (r = t[n]) || (r = t[n] = []), r.push(i), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  sr = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => He = n
  ), Ts = e(
    "__VUE_SSR_SETTERS__",
    (n) => yi = n
  );
}
const Pi = (t) => {
  const e = He;
  return sr(t), t.scope.on(), () => {
    t.scope.off(), sr(e);
  };
}, qo = () => {
  He && He.scope.off(), sr(null);
};
function uu(t) {
  return t.vnode.shapeFlag & 4;
}
let yi = !1;
function uf(t, e = !1, n = !1) {
  e && Ts(e);
  const { props: i, children: r } = t.vnode, s = uu(t);
  jd(t, i, s, e), Gd(t, r, n || e);
  const o = s ? cf(t, e) : void 0;
  return e && Ts(!1), o;
}
function cf(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, kd);
  const { setup: i } = n;
  if (i) {
    Kt();
    const r = t.setupContext = i.length > 1 ? du(t) : null, s = Pi(t), o = Ti(
      i,
      t,
      0,
      [
        t.props,
        r
      ]
    ), a = Ka(o);
    if (Xt(), s(), (a || t.sp) && !qn(t) && zl(t), a) {
      if (o.then(qo, qo), e)
        return o.then((l) => {
          Ho(t, l);
        }).catch((l) => {
          Tr(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Ho(t, o);
  } else
    cu(t);
}
function Ho(t, e, n) {
  se(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = wl(e)), cu(t);
}
function cu(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || Ot);
  {
    const r = Pi(t);
    Kt();
    try {
      Rd(t);
    } finally {
      Xt(), r();
    }
  }
}
const df = {
  get(t, e) {
    return qe(t, "get", ""), t[e];
  }
};
function du(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, df),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Mr(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(wl(yl(t.exposed)), {
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
function ff(t, e = !0) {
  return se(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function pf(t) {
  return se(t) && "__vccOpts" in t;
}
const B = (t, e) => /* @__PURE__ */ Qc(t, e, yi);
function dt(t, e, n) {
  try {
    rr(-1);
    const i = arguments.length;
    return i === 2 ? be(e) && !te(e) ? gi(e) ? W(t, null, [e]) : W(t, e) : W(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && gi(n) && (n = [n]), W(t, e, n));
  } finally {
    rr(1);
  }
}
function hf(t, e, n, i) {
  const r = n[i];
  if (r && vf(r, t))
    return r;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = i, n[i] = s;
}
function vf(t, e) {
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
const Wo = typeof window < "u" && window.trustedTypes;
if (Wo)
  try {
    ks = /* @__PURE__ */ Wo.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const fu = ks ? (t) => ks.createHTML(t) : (t) => t, gf = "http://www.w3.org/2000/svg", yf = "http://www.w3.org/1998/Math/MathML", Wt = typeof document < "u" ? document : null, Vo = Wt && /* @__PURE__ */ Wt.createElement("template"), bf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const r = e === "svg" ? Wt.createElementNS(gf, t) : e === "mathml" ? Wt.createElementNS(yf, t) : n ? Wt.createElement(t, { is: n }) : Wt.createElement(t);
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
      Vo.innerHTML = fu(
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
}, nn = "transition", Qn = "animation", bi = /* @__PURE__ */ Symbol("_vtc"), pu = {
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
}, wf = /* @__PURE__ */ ke(
  {},
  Ll,
  pu
), _f = (t) => (t.displayName = "Transition", t.props = wf, t), xf = /* @__PURE__ */ _f(
  (t, { slots: e }) => dt(pd, Sf(t), e)
), yn = (t, e = []) => {
  te(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, jo = (t) => t ? te(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Sf(t) {
  const e = {};
  for (const P in t)
    P in pu || (e[P] = t[P]);
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
  } = t, h = Cf(r), m = h && h[0], g = h && h[1], {
    onBeforeEnter: E,
    onEnter: w,
    onEnterCancelled: S,
    onLeave: y,
    onLeaveCancelled: T,
    onBeforeAppear: C = E,
    onAppear: _ = w,
    onAppearCancelled: R = S
  } = e, k = (P, H, L, U) => {
    P._enterCancelled = U, bn(P, H ? u : a), bn(P, H ? c : o), L && L();
  }, A = (P, H) => {
    P._isLeaving = !1, bn(P, d), bn(P, p), bn(P, f), H && H();
  }, I = (P) => (H, L) => {
    const U = P ? _ : w, ne = () => k(H, P, L);
    yn(U, [H, ne]), Uo(() => {
      bn(H, P ? l : s), Ht(H, P ? u : a), jo(U) || Ko(H, i, m, ne);
    });
  };
  return ke(e, {
    onBeforeEnter(P) {
      yn(E, [P]), Ht(P, s), Ht(P, o);
    },
    onBeforeAppear(P) {
      yn(C, [P]), Ht(P, l), Ht(P, c);
    },
    onEnter: I(!1),
    onAppear: I(!0),
    onLeave(P, H) {
      P._isLeaving = !0;
      const L = () => A(P, H);
      Ht(P, d), P._enterCancelled ? (Ht(P, f), Yo(P)) : (Yo(P), Ht(P, f)), Uo(() => {
        P._isLeaving && (bn(P, d), Ht(P, p), jo(y) || Ko(P, i, g, L));
      }), yn(y, [P, L]);
    },
    onEnterCancelled(P) {
      k(P, !1, void 0, !0), yn(S, [P]);
    },
    onAppearCancelled(P) {
      k(P, !0, void 0, !0), yn(R, [P]);
    },
    onLeaveCancelled(P) {
      A(P), yn(T, [P]);
    }
  });
}
function Cf(t) {
  if (t == null)
    return null;
  if (be(t))
    return [Yr(t.enter), Yr(t.leave)];
  {
    const e = Yr(t);
    return [e, e];
  }
}
function Yr(t) {
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
function Uo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Ef = 0;
function Ko(t, e, n, i) {
  const r = t._endId = ++Ef, s = () => {
    r === t._endId && i();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Tf(t, e);
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
function Tf(t, e) {
  const n = window.getComputedStyle(t), i = (h) => (n[h] || "").split(", "), r = i(`${nn}Delay`), s = i(`${nn}Duration`), o = Xo(r, s), a = i(`${Qn}Delay`), l = i(`${Qn}Duration`), c = Xo(a, l);
  let u = null, d = 0, f = 0;
  e === nn ? o > 0 && (u = nn, d = o, f = s.length) : e === Qn ? c > 0 && (u = Qn, d = c, f = l.length) : (d = Math.max(o, c), u = d > 0 ? o > c ? nn : Qn : null, f = u ? u === nn ? s.length : l.length : 0);
  const p = u === nn && /\b(?:transform|all)(?:,|$)/.test(
    i(`${nn}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: f,
    hasTransform: p
  };
}
function Xo(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => Go(n) + Go(t[i])));
}
function Go(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Yo(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function kf(t, e, n) {
  const i = t[bi];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const or = /* @__PURE__ */ Symbol("_vod"), hu = /* @__PURE__ */ Symbol("_vsh"), Af = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[or] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : ei(t, e);
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
  t.style.display = e ? t[or] : "none", t[hu] = !e;
}
const Pf = /* @__PURE__ */ Symbol(""), Of = /(?:^|;)\s*display\s*:/;
function Rf(t, e, n) {
  const i = t.style, r = Te(n);
  let s = !1;
  if (n && !r) {
    if (e)
      if (Te(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && Ui(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && Ui(i, o, "");
    for (const o in n)
      o === "display" && (s = !0), Ui(i, o, n[o]);
  } else if (r) {
    if (e !== n) {
      const o = i[Pf];
      o && (n += ";" + o), i.cssText = n, s = Of.test(n);
    }
  } else e && t.removeAttribute("style");
  or in t && (t[or] = s ? i.display : "", t[hu] && (i.display = "none"));
}
const Jo = /\s*!important$/;
function Ui(t, e, n) {
  if (te(n))
    n.forEach((i) => Ui(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Mf(t, e);
    Jo.test(n) ? t.setProperty(
      tt(i),
      n.replace(Jo, ""),
      "important"
    ) : t[i] = n;
  }
}
const Zo = ["Webkit", "Moz", "ms"], Jr = {};
function Mf(t, e) {
  const n = Jr[e];
  if (n)
    return n;
  let i = $e(e);
  if (i !== "filter" && i in t)
    return Jr[e] = i;
  i = yr(i);
  for (let r = 0; r < Zo.length; r++) {
    const s = Zo[r] + i;
    if (s in t)
      return Jr[e] = s;
  }
  return e;
}
const Qo = "http://www.w3.org/1999/xlink";
function ea(t, e, n, i, r, s = Tc(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(Qo, e.slice(6, e.length)) : t.setAttributeNS(Qo, e, n) : n == null || s && !Ya(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : mt(n) ? String(n) : n
  );
}
function ta(t, e, n, i, r) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? fu(n) : n);
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
function If(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Lf(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const na = /* @__PURE__ */ Symbol("_vei");
function Df(t, e, n, i, r = null) {
  const s = t[na] || (t[na] = {}), o = s[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = $f(e);
    if (i) {
      const c = s[e] = Nf(
        i,
        r
      );
      If(t, a, c, l);
    } else o && (Lf(t, a, o, l), s[e] = void 0);
  }
}
const ia = /(?:Once|Passive|Capture)$/;
function $f(t) {
  let e;
  if (ia.test(t)) {
    e = {};
    let i;
    for (; i = t.match(ia); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : tt(t.slice(2)), e];
}
let Zr = 0;
const Bf = /* @__PURE__ */ Promise.resolve(), Ff = () => Zr || (Bf.then(() => Zr = 0), Zr = Date.now());
function Nf(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    yt(
      zf(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Ff(), n;
}
function zf(t, e) {
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
const ra = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, qf = (t, e, n, i, r, s) => {
  const o = r === "svg";
  e === "class" ? kf(t, i, o) : e === "style" ? Rf(t, n, i) : hr(e) ? qs(e) || Df(t, e, n, i, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : Hf(t, e, i, o)) ? (ta(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && ea(t, e, i, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !Te(i)) ? ta(t, $e(e), i, s, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), ea(t, e, i, o));
};
function Hf(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && ra(e) && se(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const r = t.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ra(e) && Te(n) ? !1 : e in t;
}
const sa = {};
// @__NO_SIDE_EFFECTS__
function Wf(t, e, n) {
  let i = /* @__PURE__ */ Z(t, e);
  vr(i) && (i = ke({}, i, e));
  class r extends eo {
    constructor(o) {
      super(i, o, n);
    }
  }
  return r.def = i, r;
}
const Vf = typeof HTMLElement < "u" ? HTMLElement : class {
};
class eo extends Vf {
  constructor(e, n = {}, i = aa) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== aa ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
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
      if (e instanceof eo) {
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
    this._connected = !1, Oe(() => {
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
        ge(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => v(n[i])
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
    let i = n ? this.getAttribute(e) : sa;
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
    if (n !== this._props[e] && (this._dirty = !0, n === sa ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), i)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(tt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(tt(e), n + "") : n || this.removeAttribute(tt(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), Gf(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = W(this._def, ke(e, this._props));
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
const jf = ["ctrl", "shift", "alt", "meta"], Uf = {
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
  exact: (t, e) => jf.some((n) => t[`${n}Key`] && !e.includes(n))
}, Tn = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((r, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = Uf[e[o]];
      if (a && a(r, e)) return;
    }
    return t(r, ...s);
  }));
}, Kf = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, As = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((r) => {
    if (!("key" in r))
      return;
    const s = tt(r.key);
    if (e.some(
      (o) => o === s || Kf[o] === s
    ))
      return t(r);
  }));
}, Xf = /* @__PURE__ */ ke({ patchProp: qf }, bf);
let oa;
function vu() {
  return oa || (oa = Jd(Xf));
}
const Gf = ((...t) => {
  vu().render(...t);
}), aa = ((...t) => {
  const e = vu().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const r = Jf(i);
    if (!r) return;
    const s = e._component;
    !se(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, Yf(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, e;
});
function Yf(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function Jf(t) {
  return Te(t) ? document.querySelector(t) : t;
}
const Zf = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const la = (t) => t === "";
const Qf = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const ua = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const ep = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const tp = (t) => {
  const e = ep(t);
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
const np = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": s,
  size: o = ti.width,
  color: a = ti.stroke,
  ...l
}, { slots: c }) => dt(
  "svg",
  {
    ...ti,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": la(n) || la(i) || n === !0 || i === !0 ? Number(r || s || ti["stroke-width"]) * 24 / Number(o) : r || s || ti["stroke-width"],
    class: Qf(
      "lucide",
      l.class,
      ...t ? [`lucide-${ua(tp(t))}-icon`, `lucide-${ua(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Zf(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => dt(...u)), ...c.default ? [c.default()] : []]
);
const lt = (t, e) => (n, { slots: i, attrs: r }) => dt(
  np,
  {
    ...r,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const ip = lt("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const mu = lt("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const rp = lt("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ca = lt("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const sp = lt("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const op = lt("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const ap = lt("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const lp = lt("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const up = lt("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const cp = lt("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const dp = lt("volume-2", [
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
const fp = lt("volume-x", [
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
const gu = lt("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), pp = ["aria-label"], hp = /* @__PURE__ */ Z({
  __name: "Badge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), le("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ce(e.$slots, "default", {}, void 0, !0)
    ], 8, pp));
  }
}), vp = ".editor-badge[data-v-732d4c24]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", We = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, r] of e)
    n[i] = r;
  return n;
}, Ps = /* @__PURE__ */ We(hp, [["styles", [vp]], ["__scopeId", "data-v-732d4c24"]]), mp = ["disabled", "aria-label"], gp = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, yp = /* @__PURE__ */ Z({
  __name: "Button",
  props: {
    variant: { default: "secondary", type: String },
    size: { default: "md", type: String },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = Ad(), i = B(() => !!n.icon && !n.default), r = B(() => [
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
      s.$slots.icon ? (M(), le("span", gp, [
        ce(s.$slots, "icon", {}, void 0, !0)
      ])) : fe("", !0),
      ce(s.$slots, "default", {}, void 0, !0)
    ], 10, mp));
  }
}), bp = ".editor-btn[data-v-d2460090]{display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-xs);font-family:var(--font-family);font-weight:500;border:none;border-radius:var(--radius-md);cursor:pointer;transition:background-color var(--transition-duration),color var(--transition-duration);white-space:nowrap}.editor-btn[data-v-d2460090]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-d2460090]:disabled{opacity:.5;cursor:default;pointer-events:none}.editor-btn--sm[data-v-d2460090]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-xs);height:28px}.editor-btn--md[data-v-d2460090]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-sm);height:32px}.editor-btn--sm .editor-btn__icon[data-v-d2460090]{display:inline-flex;width:14px;height:14px}.editor-btn--md .editor-btn__icon[data-v-d2460090]{display:inline-flex;width:16px;height:16px}.editor-btn--icon-only.editor-btn--sm[data-v-d2460090]{width:28px;padding:0}.editor-btn--icon-only.editor-btn--md[data-v-d2460090]{width:32px;padding:0}.editor-btn--primary[data-v-d2460090]{color:var(--color-white);background-color:var(--color-primary)}.editor-btn--primary[data-v-d2460090]:hover:not(:disabled){background-color:var(--color-primary-hover)}.editor-btn--secondary[data-v-d2460090],.editor-btn--ghost[data-v-d2460090]{color:var(--color-text-secondary);background:none}.editor-btn--secondary[data-v-d2460090]{border:1px solid var(--color-border)}.editor-btn--secondary[data-v-d2460090]:hover:not(:disabled),.editor-btn--ghost[data-v-d2460090]:hover:not(:disabled){background-color:var(--color-surface-hover)}", At = /* @__PURE__ */ We(yp, [["styles", [bp]], ["__scopeId", "data-v-d2460090"]]), yu = {
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
}, wp = {
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
}, da = { fr: yu, en: wp }, bu = /* @__PURE__ */ Symbol("i18n");
function _p(t) {
  const e = B(() => {
    const i = da[t.value] ?? da.fr;
    return (r) => i[r] ?? r;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return ki(bu, n), n;
}
function Dt() {
  const t = ln(bu);
  if (t) return t;
  const e = B(() => "fr");
  return {
    t: (n) => yu[n] ?? n,
    locale: e
  };
}
function xp(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), r = parseInt(n.substring(2, 4), 16), s = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${s}, ${e})`;
}
function to(t, e, n = "*") {
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
    label: r.languages.map((s) => to(s, e, i)).join(", ") + (r.isSource ? ` (${n})` : "")
  }));
}
function Sp(t, e = 250) {
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
function ar(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, s = String(i).padStart(2, "0"), o = String(r).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class et extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Cp(t) {
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
function Ep(t, e) {
  const { width: n, height: i } = e.canvas, r = t[0], s = r.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(r[l] ?? 0);
    let u = a, d = c * (i / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function no(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
const Tp = 1;
function _u(t, e) {
  if (!no(t)) return null;
  for (const n of t)
    if (n.startTime - Tp <= e && e <= n.endTime)
      return n.id;
  return null;
}
const kp = { class: "editor-header" }, Ap = { class: "header-left" }, Pp = { class: "document-title" }, Op = { class: "badges" }, Rp = ["datetime"], Mp = { class: "header-right" }, Ip = /* @__PURE__ */ Z({
  __name: "Header",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = Dt(), r = B(() => to(e.language, i.value, n("language.wildcard"))), s = B(() => ar(e.duration)), o = B(() => e.title.replace(/-/g, " "));
    return (a, l) => (M(), le("header", kp, [
      oe("div", Ap, [
        oe("h1", Pp, ye(o.value), 1),
        oe("div", Op, [
          W(Ps, null, {
            default: q(() => [
              Ye(ye(r.value), 1)
            ]),
            _: 1
          }),
          W(Ps, null, {
            default: q(() => [
              oe("time", {
                datetime: `PT${t.duration}S`
              }, ye(s.value), 9, Rp)
            ]),
            _: 1
          })
        ])
      ]),
      oe("div", Mp, [
        t.isMobile ? (M(), G(At, {
          key: 0,
          variant: "ghost",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: q(() => [
            W(v(cp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : fe("", !0),
        t.isMobile ? (M(), G(At, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, {
          icon: q(() => [
            W(v(ca), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (M(), G(At, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: q(() => [
            W(v(ca), { size: 16 })
          ]),
          default: q(() => [
            Ye(" " + ye(v(n)("header.export")), 1)
          ]),
          _: 1
        })),
        W(At, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(n)("header.settings")
        }, {
          icon: q(() => [
            W(v(ap), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Lp = ".editor-header[data-v-fce7f10f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-fce7f10f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-fce7f10f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-fce7f10f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-fce7f10f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-fce7f10f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-fce7f10f]{display:none}.document-title[data-v-fce7f10f]{font-size:var(--font-size-base)}}", Dp = /* @__PURE__ */ We(Ip, [["styles", [Lp]], ["__scopeId", "data-v-fce7f10f"]]), Qr = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, $p = 70, Bp = 1e3 / 60, Fp = 350;
let Ki = !1, fa = !1;
function Np() {
  fa || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Ki = !0;
  }), document.addEventListener("mouseup", () => {
    Ki = !1;
  }), document.addEventListener("click", () => {
    Ki = !1;
  }), fa = !0);
}
const es = /* @__PURE__ */ new Map();
function ts(...t) {
  const e = {
    damping: Qr.damping,
    stiffness: Qr.stiffness,
    mass: Qr.mass
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
  return es.has(i) || es.set(i, Object.freeze({ ...e })), n ? "instant" : es.get(i);
}
function zp(t = {}) {
  Np();
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
    return d() <= $p;
  }
  function p(A) {
    i.isAtBottom = A, r();
  }
  function h(A) {
    i.escapedFromLock = A, r();
  }
  function m(A) {
    i.isNearBottom = A, r();
  }
  function g() {
    if (!Ki || typeof window > "u")
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
  const E = (A) => {
    if (A.target !== i.scrollElement)
      return;
    const I = o(), P = i.ignoreScrollToTop;
    let H = i.lastScrollTop ?? I;
    i.lastScrollTop = I, i.ignoreScrollToTop = void 0, P && P > I && (H = P), m(f()), setTimeout(() => {
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
  }, w = (A) => {
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
  function S(A, I) {
    y(), i.scrollElement = A, i.contentElement = I, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", E, { passive: !0 }), A.addEventListener("wheel", w, { passive: !0 });
    let P;
    i.resizeObserver = new ResizeObserver((H) => {
      const L = H[0];
      if (!L)
        return;
      const { height: U } = L.contentRect, ne = U - (P ?? U);
      if (i.resizeDifference = ne, o() > l() && a(l()), m(f()), ne >= 0) {
        const J = ts(
          e,
          P ? e.resize : e.initial
        );
        _({
          animation: J,
          wait: !0,
          preserveScrollPosition: !0,
          duration: J === "instant" ? void 0 : Fp
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
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", E), i.scrollElement.removeEventListener("wheel", w)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function T() {
    y(), n.clear();
  }
  function C(A) {
    e = { ...e, ...A };
  }
  function _(A = {}) {
    const I = typeof A == "string" ? { animation: A } : A;
    I.preserveScrollPosition || p(!0);
    const P = Date.now() + (Number(I.wait) || 0), H = ts(e, I.animation), { ignoreEscapes: L = !1 } = I;
    let U, ne = u();
    I.duration instanceof Promise ? I.duration.finally(() => {
      U = Date.now();
    }) : U = P + (I.duration ?? 0);
    const J = async () => {
      const Q = new Promise((we) => {
        if (typeof requestAnimationFrame > "u") {
          we(!1);
          return;
        }
        requestAnimationFrame(() => we(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const we = o(), Le = typeof performance < "u" ? performance.now() : Date.now(), Je = (Le - (i.lastTick ?? Le)) / Bp;
        if (i.animation ||= { behavior: H, promise: Q, ignoreEscapes: L }, i.animation.behavior === H && (i.lastTick = Le), g() || P > Date.now())
          return J();
        if (we < Math.min(ne, u())) {
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
        return U > Date.now() ? (ne = u(), J()) : (i.animation = void 0, o() < u() ? _({
          animation: ts(e, e.resize),
          ignoreEscapes: L,
          duration: Math.max(0, U - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return Q.then((we) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), we));
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
    attach: S,
    detach: y,
    destroy: T,
    setOptions: C,
    getState: s,
    onChange: k,
    scrollToBottom: _,
    stopScroll: R
  };
}
function qp(t = {}) {
  const e = /* @__PURE__ */ D(null), n = /* @__PURE__ */ D(null), i = /* @__PURE__ */ D(t.initial !== !1), r = /* @__PURE__ */ D(!1), s = /* @__PURE__ */ D(!1), o = zp(t);
  let a = null;
  return nt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((c) => {
      i.value = c.isAtBottom, r.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), en(() => {
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
const Hp = /* @__PURE__ */ Z({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), le("span", {
      class: "speaker-indicator",
      style: Lt({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Wp = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", xu = /* @__PURE__ */ We(Hp, [["styles", [Wp]], ["__scopeId", "data-v-9bffeda8"]]), Vp = { class: "speaker-label" }, jp = {
  key: 1,
  class: "speaker-name"
}, Up = ["datetime"], Kp = /* @__PURE__ */ Z({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = Dt(), r = B(
      () => to(e.language, i.value, n("language.wildcard"))
    ), s = B(
      () => e.startTime != null ? ar(e.startTime) : null
    ), o = B(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = B(() => e.speaker?.color ?? "transparent");
    return (l, c) => (M(), le("div", Vp, [
      t.speaker ? (M(), G(xu, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : fe("", !0),
      t.speaker ? (M(), le("span", jp, ye(t.speaker.name), 1)) : fe("", !0),
      s.value ? (M(), le("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, ye(s.value), 9, Up)) : fe("", !0),
      W(Ps, null, {
        default: q(() => [
          Ye(ye(r.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Xp = ".speaker-label[data-v-8bb5c8bd]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-8bb5c8bd]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-8bb5c8bd]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted)}", Gp = /* @__PURE__ */ We(Kp, [["styles", [Xp]], ["__scopeId", "data-v-8bb5c8bd"]]);
function Yp() {
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
const pa = [
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
function Jp(t, e, n) {
  const i = pa[t.size % pa.length];
  return { id: e, name: n, color: i };
}
function Zp(t, e, n) {
  return !e || t.has(e) ? null : Jp(t, e, n ?? e);
}
function Qp(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function eh(t) {
  const e = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = Zp(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(s, o) {
    const a = Qp(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: r };
}
function th(t, e) {
  return [...t, e];
}
function nh(t, e) {
  return [...e, ...t];
}
function ih(t, e, n) {
  const i = t.findIndex((s) => s.id === e);
  if (i === -1) return null;
  const r = { ...t[i], ...n, id: e };
  return {
    turns: t.map((s, o) => o === i ? r : s),
    updated: r
  };
}
function rh(t, e) {
  const n = t.findIndex((i) => i.id === e);
  return n === -1 ? null : t.filter((i, r) => r !== n);
}
function sh(t, e, n) {
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
function Os(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function oh(t, e, n) {
  const { id: i, languages: r, isSource: s, audio: o } = t, a = /* @__PURE__ */ D(t.turns);
  function l(h) {
    n(h.speakerId), a.value = th(a.value, h), e("turn:add", { turn: h, translationId: i });
  }
  function c(h, m) {
    const g = ih(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function u(h) {
    const m = rh(a.value, h);
    m && (a.value = m, e("turn:remove", { turnId: h, translationId: i }));
  }
  function d(h, m) {
    const g = sh(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function f(h) {
    Os(h, n), a.value = nh(a.value, h);
  }
  function p(h) {
    Os(h, n), a.value = h, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: r, isSource: s, audio: o, turns: a, addTurn: l, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: p };
}
function ha(t, e, n) {
  const { id: i, name: r, description: s, duration: o } = t, a = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map());
  let l;
  for (const m of t.translations) {
    const g = oh(m, e, n);
    a.set(m.id, g), m.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ D(null), u = /* @__PURE__ */ D(!1), d = /* @__PURE__ */ D(!0), f = B(() => c.value ? a.get(c.value) ?? l : l);
  function p(m) {
    const g = m === l.id ? null : m;
    g !== c.value && (c.value = g, e("translation:change", { translationId: f.value.id }));
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
    activeTranslation: f,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: p,
    reset: h
  };
}
function ah(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, r] of t.speakers)
    e.add(i), n.push({ id: i, name: r.name });
  for (const i of t.channels)
    for (const r of i.translations)
      for (const s of r.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), n.push({ id: s.speakerId, name: s.speakerId }));
  return n;
}
function lh(t = {}) {
  const e = /* @__PURE__ */ D(""), n = /* @__PURE__ */ D(t.activeChannelId ?? ""), i = /* @__PURE__ */ D(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: s, emit: o, clear: a } = Yp(), l = eh(o), c = l, u = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map()), d = B(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function f(C, _) {
    return r(C, (R) => {
      const k = d.value;
      k && R.translationId === k.activeTranslation.value.id && _(R);
    });
  }
  function p(C) {
    e.value = C.title, l.clear(), u.clear();
    for (const _ of ah(C))
      c.ensure(_.id, _.name);
    for (const _ of C.channels)
      u.set(_.id, ha(_, o, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(C) {
    Cp(C), p(C);
  }
  function m(C) {
    C !== n.value && (n.value = C, o("channel:change", { channelId: C }));
  }
  function g(C, _) {
    if (u.has(C)) {
      for (const R of _.translations)
        Os(R.turns, c.ensure);
      u.set(C, ha(_, o, c.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const E = [], w = [];
  function S(C) {
    C.tiptapExtensions && w.push(...C.tiptapExtensions);
    const _ = C.install(T);
    _ && E.push(_);
  }
  function y() {
    o("destroy", void 0), E.forEach((C) => C()), E.length = 0, a();
  }
  t.document && p(t.document);
  const T = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: w,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: f,
    setDocument: h,
    setActiveChannel: m,
    setChannel: g,
    on: r,
    off: s,
    emit: o,
    use: S,
    destroy: y
  };
  return T;
}
const Su = /* @__PURE__ */ Symbol("core");
function uh(t) {
  ki(Su, t);
}
function fn() {
  const t = ln(Su);
  if (!t)
    throw new Error("useCore() requires a parent provideCore()");
  return t;
}
const ch = ["data-turn-active"], dh = { class: "turn-text" }, fh = ["data-word-active"], ph = /* @__PURE__ */ Z({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = fn(), i = B(() => e.turn.words.length > 0), r = B(() => {
      if (!n.audio?.src.value || !i.value) return null;
      const a = n.audio.currentTime.value, { startTime: l, endTime: c, words: u } = e.turn;
      return l == null || c == null || a < l || a > c ? null : _u(u, a);
    }), s = B(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || no(e.turn.words)) return !1;
      const a = n.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), o = B(() => e.speaker?.color ?? "transparent");
    return (a, l) => (M(), le("section", {
      class: un(["turn", { "turn--active": s.value, "turn--partial": t.partial }]),
      "data-turn-active": s.value || t.partial || t.live || void 0,
      style: Lt({ "--speaker-color": o.value })
    }, [
      t.partial ? fe("", !0) : (M(), G(Gp, {
        key: 0,
        speaker: t.speaker,
        "start-time": t.turn.startTime,
        language: t.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      oe("p", dh, [
        i.value ? (M(!0), le(Ee, { key: 0 }, On(t.turn.words, (c, u) => (M(), le(Ee, {
          key: c.id
        }, [
          oe("span", {
            class: un({ "word--active": c.id === r.value }),
            "data-word-active": c.id === r.value || void 0
          }, ye(c.text), 11, fh),
          Ye(ye(u < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (M(), le(Ee, { key: 1 }, [
          Ye(ye(t.turn.text), 1)
        ], 64)) : fe("", !0)
      ])
    ], 14, ch));
  }
}), hh = ".turn[data-v-8d148b2f]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-text[data-v-8d148b2f]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--active[data-v-8d148b2f]{border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent)}.word--active[data-v-8d148b2f]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-8d148b2f]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-8d148b2f .2s ease}@keyframes partial-fade-in-8d148b2f{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-8d148b2f]{animation:none}}@media(max-width:767px){.turn[data-v-8d148b2f]{padding:var(--spacing-sm) var(--spacing-md)}}", va = /* @__PURE__ */ We(ph, [["styles", [hh]], ["__scopeId", "data-v-8d148b2f"]]), vh = {}, mh = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function gh(t, e) {
  return M(), le("svg", mh, [...e[0] || (e[0] = [
    sf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const yh = /* @__PURE__ */ We(vh, [["render", gh]]), bh = { class: "transcription-empty" }, wh = { class: "message" }, _h = /* @__PURE__ */ Z({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = Dt();
    return (n, i) => (M(), le("div", bh, [
      W(yh, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      oe("p", wh, ye(v(e)("transcription.empty")), 1)
    ]));
  }
}), xh = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", Sh = /* @__PURE__ */ We(_h, [["styles", [xh]], ["__scopeId", "data-v-f82737e5"]]), Ch = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function Eh(t) {
  const e = fn(), n = /* @__PURE__ */ D(!0), i = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function r() {
    const u = t.value;
    if (!u || !n.value) return;
    const d = e.audio?.activeTurnId.value, f = u.querySelector("[data-word-active]") ?? (d ? u.querySelector(`[data-turn-id="${d}"]`) : null);
    f && f.scrollIntoView({
      behavior: i ? "instant" : "smooth",
      block: "center"
    });
  }
  me(
    () => e.audio?.activeWordId.value,
    (u) => {
      u && r();
    },
    { flush: "post" }
  ), me(
    () => e.audio?.activeTurnId.value,
    (u) => {
      u && r();
    },
    { flush: "post" }
  ), me(
    () => e.audio?.isPlaying.value,
    (u) => {
      u && (n.value = !0);
    }
  );
  function s() {
    n.value = !1;
  }
  function o(u) {
    Ch.has(u.key) && s();
  }
  function a(u) {
    const d = t.value;
    d && (d.addEventListener("wheel", u, { passive: !0 }), d.addEventListener("touchstart", u, { passive: !0 }), d.addEventListener("pointerdown", u, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function l(u) {
    const d = t.value;
    d && (d.removeEventListener("wheel", u), d.removeEventListener("touchstart", u), d.removeEventListener("pointerdown", u), d.removeEventListener("keydown", o));
  }
  Me(() => {
    a(s);
  }), en(() => {
    l(s);
  });
  function c() {
    n.value = !0, r();
  }
  return { isFollowing: n, resumeFollow: c };
}
var Th = /* @__PURE__ */ Z({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(t) {
    const e = /* @__PURE__ */ D(), n = it();
    return nt(() => {
      const i = t.editor;
      i && i.options.element && e.value && Oe(() => {
        var r;
        if (!e.value || !((r = i.view.dom) != null && r.parentNode))
          return;
        const s = v(e.value);
        e.value.append(...i.view.dom.parentNode.childNodes), i.contentComponent = n.ctx._, n && (i.appContext = {
          ...n.appContext,
          // Vue internally uses prototype chain to forward/shadow injects across the entire component chain
          // so don't use object spread operator or 'Object.assign' and just set `provides` as is on editor's appContext
          // @ts-expect-error forward instance's 'provides' into appContext
          provides: n.provides
        }), i.setOptions({
          element: s
        }), i.createNodeViews();
      });
    }), en(() => {
      const i = t.editor;
      i && (i.contentComponent = null, i.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return dt("div", {
      ref: (t) => {
        this.rootEl = t;
      }
    });
  }
});
const kh = { class: "transcription-panel" }, Ah = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Ph = { class: "turns-container" }, Oh = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Rh = {
  key: 1,
  class: "history-start"
}, Mh = /* @__PURE__ */ Z({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = Dt(), i = fn(), r = mi("scrollContainer"), s = B(() => {
      const _ = i.live?.partial.value ?? null;
      return _ === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: _,
        words: [],
        language: i.activeChannel.value?.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = B(() => i.transcriptionEditor?.tiptapEditor.value), a = B(() => i.live?.hasLiveUpdate.value ?? !1), l = B(() => i.audio?.isPlaying.value ?? !1), c = B(
      () => i.activeChannel.value?.activeTranslation.value
    ), u = B(() => i.activeChannel.value), d = B(
      () => u.value?.isLoadingHistory.value ?? !1
    ), f = B(() => u.value?.hasMoreHistory.value ?? !1), { isFollowing: p, resumeFollow: h } = Eh(r), { scrollRef: m, contentRef: g, isAtBottom: E, scrollToBottom: w } = qp();
    Me(() => {
      m.value = r.value, g.value = r.value?.querySelector(".turns-container") ?? null;
    });
    const S = B(
      () => !p.value && l.value || !E.value && a.value
    );
    function y() {
      l.value ? h() : w();
    }
    const T = Sp(() => {
      const _ = u.value;
      if (!_?.hasMoreHistory.value || _.isLoadingHistory.value || e.turns.length === 0) return;
      const R = c.value;
      R && i.emit("scroll:top", { translationId: R.id });
    }, 500);
    function C() {
      const _ = r.value;
      _ && _.scrollTop < 100 && T();
    }
    return me(
      () => e.turns,
      (_, R) => {
        const k = _.length, A = R.length;
        if (k > A && !E.value && _[0]?.id != R[0]?.id) {
          const I = k - A, P = e.turns[I]?.id;
          if (!P || !m.value) return;
          Oe(() => {
            m.value?.querySelector(
              `[data-turn-id="${P}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), Me(() => {
      r.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), en(() => {
      r.value?.removeEventListener("scroll", C);
    }), (_, R) => (M(), le("article", kh, [
      oe("div", Ah, [
        oe("div", Ph, [
          d.value ? (M(), le("div", Oh, [...R[0] || (R[0] = [
            oe("progress", null, null, -1)
          ])])) : fe("", !0),
          !f.value && t.turns.length > 0 ? (M(), le("div", Rh, ye(v(n)("transcription.historyStart")), 1)) : fe("", !0),
          t.turns.length === 0 && !d.value && !s.value ? (M(), G(Sh, {
            key: 2,
            class: "transcription-empty"
          })) : fe("", !0),
          o.value ? (M(), G(v(Th), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (M(!0), le(Ee, { key: 4 }, On(t.turns, (k, A) => (M(), G(va, {
            "data-turn-id": k.id,
            key: k.id,
            turn: k,
            speaker: k.speakerId ? t.speakers.get(k.speakerId) : void 0,
            live: a.value && !s.value && A === t.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (M(), G(va, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : fe("", !0)
        ]),
        W(xf, { name: "fade-slide" }, {
          default: q(() => [
            S.value ? (M(), G(At, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": v(n)("transcription.resumeScroll"),
              onClick: y
            }, {
              icon: q(() => [
                W(v(ip), { size: 14 })
              ]),
              default: q(() => [
                Ye(" " + ye(v(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : fe("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Ih = ".transcription-panel[data-v-13e13590]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-13e13590]{height:100%;overflow:auto;position:relative}.turns-container[data-v-13e13590]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-13e13590]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-13e13590]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-13e13590]{width:120px}.history-start[data-v-13e13590]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-13e13590]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-13e13590],.fade-slide-leave-active[data-v-13e13590]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-13e13590],.fade-slide-leave-to[data-v-13e13590]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-13e13590],.fade-slide-leave-active[data-v-13e13590]{transition:none}}@media(max-width:767px){.turns-container[data-v-13e13590]{padding:var(--spacing-md)}}", Lh = /* @__PURE__ */ We(Mh, [["styles", [Ih]], ["__scopeId", "data-v-13e13590"]]), Dh = { class: "switch" }, $h = ["id", "checked"], Bh = ["for"], Fh = /* @__PURE__ */ Z({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = n.id ?? Nl();
    return (s, o) => (M(), le("div", Dh, [
      oe("input", {
        type: "checkbox",
        id: v(r),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, $h),
      oe("label", { for: v(r) }, [...o[1] || (o[1] = [
        oe("div", { class: "switch-slider" }, null, -1)
      ])], 8, Bh)
    ]));
  }
}), Nh = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", zh = /* @__PURE__ */ We(Fh, [["styles", [Nh]], ["__scopeId", "data-v-2aa0332f"]]), qh = "(max-width: 767px)";
function Cu() {
  const t = /* @__PURE__ */ D(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return Me(() => {
    e = window.matchMedia(qh), t.value = e.matches, e.addEventListener("change", n);
  }), en(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
function ma(t) {
  return typeof t == "string" ? `'${t}'` : new Hh().serialize(t);
}
const Hh = /* @__PURE__ */ (function() {
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
function lr(t, e) {
  return t === e || ma(t) === ma(e);
}
function Wh(t, e, n) {
  const i = t.findIndex((a) => lr(a, e)), r = t.findIndex((a) => lr(a, n));
  if (i === -1 || r === -1) return [];
  const [s, o] = [i, r].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function ga(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function $t(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = ln(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (ki(i, o), o)];
}
function ft() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function Ir(t, e, n) {
  const i = n.originalEvent.target, r = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(r);
}
function Rs(t) {
  return t == null;
}
function io(t) {
  return t ? t.flatMap((e) => e.type === Ee ? io(e.children) : [e]) : [];
}
const [ro] = $t("ConfigProvider");
function Vh(t, e) {
  var n;
  const i = /* @__PURE__ */ kn();
  return nt(() => {
    i.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ Zi(i);
}
function Lr(t, e) {
  return js() ? (tl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function ns() {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    t.delete(s);
  };
  return {
    on: (s) => {
      t.add(s);
      const o = () => e(s);
      return Lr(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(t).map((o) => o(...s))),
    clear: () => {
      t.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function jh(t) {
  let e = !1, n;
  const i = el(!0);
  return ((...r) => (e || (n = i.run(() => t(...r)), e = !0), n));
}
const tn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Uh = (t) => typeof t < "u", Kh = Object.prototype.toString, Xh = (t) => Kh.call(t) === "[object Object]", ya = /* @__PURE__ */ Gh();
function Gh() {
  var t, e, n;
  return tn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function is(t) {
  return Array.isArray(t) ? t : [t];
}
function Yh(t) {
  return it();
}
// @__NO_SIDE_EFFECTS__
function Jh(t) {
  if (!tn) return t;
  let e = 0, n, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = el(!0), n = i.run(() => t(...s))), Lr(r), n));
}
function Eu(t, e = 1e4) {
  return _l((n, i) => {
    let r = Ge(t), s;
    const o = () => setTimeout(() => {
      r = Ge(t), i();
    }, Ge(e));
    return Lr(() => {
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
function Zh(t, e) {
  Yh() && en(t, e);
}
function Qh(t, e, n) {
  return me(t, e, {
    ...n,
    immediate: !0
  });
}
const Dr = tn ? window : void 0;
function Mt(t) {
  var e;
  const n = Ge(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Tu(...t) {
  const e = (i, r, s, o) => (i.addEventListener(r, s, o), () => i.removeEventListener(r, s, o)), n = B(() => {
    const i = is(Ge(t[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return Qh(() => {
    var i, r;
    return [
      (i = (r = n.value) === null || r === void 0 ? void 0 : r.map((s) => Mt(s))) !== null && i !== void 0 ? i : [Dr].filter((s) => s != null),
      is(Ge(n.value ? t[1] : t[0])),
      is(v(n.value ? t[2] : t[1])),
      Ge(n.value ? t[3] : t[2])
    ];
  }, ([i, r, s, o], a, l) => {
    if (!i?.length || !r?.length || !s?.length) return;
    const c = Xh(o) ? { ...o } : o, u = i.flatMap((d) => r.flatMap((f) => s.map((p) => e(d, f, p, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function ku() {
  const t = /* @__PURE__ */ kn(!1), e = it();
  return e && Me(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function ev(t) {
  const e = /* @__PURE__ */ ku();
  return B(() => (e.value, !!t()));
}
function tv(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function nv(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: r = Dr, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = tv(e);
  return Tu(r, s, (u) => {
    u.repeat && Ge(a) || l(u) && n(u);
  }, o);
}
function iv(t) {
  return JSON.parse(JSON.stringify(t));
}
function rv(t, e, n = {}) {
  const { window: i = Dr, ...r } = n;
  let s;
  const o = /* @__PURE__ */ ev(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = me(B(() => {
    const u = Ge(t);
    return Array.isArray(u) ? u.map((d) => Mt(d)) : [Mt(u)];
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
  return Lr(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ur(t, e, n, i = {}) {
  var r, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = i, f = it(), p = n || f?.emit || (f == null || (r = f.$emit) === null || r === void 0 ? void 0 : r.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : iv(w) : w, g = () => Uh(t[e]) ? m(t[e]) : u, E = (w) => {
    d ? d(w) && p(h, w) : p(h, w);
  };
  if (a) {
    const w = /* @__PURE__ */ D(g());
    let S = !1;
    return me(() => t[e], (y) => {
      S || (S = !0, w.value = m(y), Oe(() => S = !1));
    }), me(w, (y) => {
      !S && (y !== t[e] || c) && E(y);
    }, { deep: c }), w;
  } else return B({
    get() {
      return g();
    },
    set(w) {
      E(w);
    }
  });
}
function rs(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Ms(t, e, n = ".", i) {
  if (!rs(e))
    return Ms(t, {}, n, i);
  const r = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (i && i(r, s, o, n) || (Array.isArray(o) && Array.isArray(r[s]) ? r[s] = [...o, ...r[s]] : rs(o) && rs(r[s]) ? r[s] = Ms(
      o,
      r[s],
      (n ? `${n}.` : "") + s.toString(),
      i
    ) : r[s] = o));
  }
  return r;
}
function sv(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Ms(n, i, "", t), {})
  );
}
const ov = sv(), av = /* @__PURE__ */ Jh(() => {
  const t = /* @__PURE__ */ D(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ D(), n = B(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = ro({ scrollBody: /* @__PURE__ */ D(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ya && r?.(), e.value = void 0;
  };
  return me(n, (o, a) => {
    if (!tn) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? ov({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ya && (r = Tu(document, "touchmove", (d) => lv(d), { passive: !1 })), Oe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Au(t) {
  const e = Math.random().toString(36).substring(2, 7), n = av();
  n.value.set(e, t ?? !1);
  const i = B({
    get: () => n.value.get(e) ?? !1,
    set: (r) => n.value.set(e, r)
  });
  return Zh(() => {
    n.value.delete(e);
  }), i;
}
function Pu(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : Pu(n);
  }
}
function lv(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && Pu(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Ou(t) {
  const e = ro({ dir: /* @__PURE__ */ D("ltr") });
  return B(() => t?.value || e.dir?.value || "ltr");
}
function $r(t) {
  const e = it(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((r) => {
    i[qi($e(r))] = (...s) => t(r, ...s);
  }), i;
}
let ss = 0;
function uv() {
  nt((t) => {
    if (!tn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ba()), document.body.insertAdjacentElement("beforeend", e[1] ?? ba()), ss++, t(() => {
      ss === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), ss--;
    });
  });
}
function ba() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function Ru(t) {
  return B(() => Ge(t) ? !!Mt(t)?.closest("form") : !0);
}
function Ie() {
  const t = it(), e = /* @__PURE__ */ D(), n = B(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Mt(e)), i = Object.assign({}, t.exposed), r = {};
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
function so(t) {
  const e = it(), n = Object.keys(e?.type.props ?? {}).reduce((r, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (r[s] = o), r;
  }, {}), i = /* @__PURE__ */ Hi(t);
  return B(() => {
    const r = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      r[$e(o)] = s[o];
    }), Object.keys({
      ...n,
      ...r
    }).reduce((o, a) => (i.value[a] !== void 0 && (o[a] = i.value[a]), o), {});
  });
}
function cv(t, e) {
  const n = so(t), i = e ? $r(e) : {};
  return B(() => ({
    ...n.value,
    ...i
  }));
}
var dv = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Ln = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), Bi = {}, os = 0, Mu = function(t) {
  return t && (t.host || Mu(t.parentNode));
}, fv = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = Mu(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, pv = function(t, e, n, i) {
  var r = fv(e, Array.isArray(t) ? t : [t]);
  Bi[n] || (Bi[n] = /* @__PURE__ */ new WeakMap());
  var s = Bi[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(r), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  r.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var p = f.getAttribute(i), h = p !== null && p !== "false", m = (Ln.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Ln.set(f, m), s.set(f, g), o.push(f), m === 1 && h && $i.set(f, !0), g === 1 && f.setAttribute(n, "true"), h || f.setAttribute(i, "true");
        } catch (E) {
          console.error("aria-hidden: cannot operate on ", f, E);
        }
    });
  };
  return u(e), a.clear(), os++, function() {
    o.forEach(function(d) {
      var f = Ln.get(d) - 1, p = s.get(d) - 1;
      Ln.set(d, f), s.set(d, p), f || ($i.has(d) || d.removeAttribute(i), $i.delete(d)), p || d.removeAttribute(n);
    }), os--, os || (Ln = /* @__PURE__ */ new WeakMap(), Ln = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), Bi = {});
  };
}, hv = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), r = dv(t);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), pv(i, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function Iu(t) {
  let e;
  me(() => Mt(t), (n) => {
    n ? e = hv(n) : e && e();
  }), Pn(() => {
    e && e();
  });
}
function wi(t, e = "reka") {
  return `${e}-${Nl?.()}`;
}
function vv() {
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
function mv(t) {
  const e = /* @__PURE__ */ D(), n = B(() => e.value?.width ?? 0), i = B(() => e.value?.height ?? 0);
  return Me(() => {
    const r = Mt(t);
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
function gv(t, e) {
  const n = /* @__PURE__ */ D(t);
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
function oo(t) {
  const e = Eu("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, s) => {
      e.value = e.value + r;
      {
        const o = ft(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = bv(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function yv(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
function bv(t, e, n) {
  const r = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = yv(t, Math.max(s, 0));
  r.length === 1 && (o = o.filter((c) => c !== n));
  const l = o.find((c) => c.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function wv(t, e) {
  const n = /* @__PURE__ */ D({}), i = /* @__PURE__ */ D("none"), r = /* @__PURE__ */ D(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Dr, { state: l, dispatch: c } = gv(s, {
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
    if (tn) {
      const E = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(E);
    }
  };
  me(t, async (g, E) => {
    const w = E !== g;
    if (await Oe(), w) {
      const S = i.value, y = Fi(e.value);
      g ? (c("MOUNT"), u("enter"), y === "none" && u("after-enter")) : y === "none" || y === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : E && S !== y ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const E = Fi(e.value), w = E.includes(CSS.escape(g.animationName)), S = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && w && (u(`after-${S}`), c("ANIMATION_END"), !r.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    g.target === e.value && E === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (i.value = Fi(e.value));
  }, p = me(e, (g, E) => {
    g ? (n.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), E?.removeEventListener("animationstart", f), E?.removeEventListener("animationcancel", d), E?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = me(l, () => {
    const g = Fi(e.value);
    i.value = l.value === "mounted" ? g : "none";
  });
  return Pn(() => {
    p(), h();
  }), { isPresent: B(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Fi(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var ao = /* @__PURE__ */ Z({
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
    const { present: i, forceMount: r } = /* @__PURE__ */ Kn(t), s = /* @__PURE__ */ D(), { isPresent: o } = wv(i, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = io(a || []);
    const l = it();
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
    return () => r.value || i.value || o.value ? dt(e.default({ present: o.value })[0], { ref: (c) => {
      const u = Mt(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const Is = /* @__PURE__ */ Z({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = io(n.default()), r = i.findIndex((l) => l.type !== Be);
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
}), _v = [
  "area",
  "img",
  "input"
], Re = /* @__PURE__ */ Z({
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
    return typeof i == "string" && _v.includes(i) ? () => dt(i, e) : i !== "template" ? () => dt(t.as, e, { default: n.default }) : () => dt(Is, e, { default: n.default });
  }
});
function cr() {
  const t = /* @__PURE__ */ D(), e = B(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : Mt(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [pn, xv] = $t("DialogRoot");
var Sv = /* @__PURE__ */ Z({
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
    const n = t, r = /* @__PURE__ */ ur(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), s = /* @__PURE__ */ D(), o = /* @__PURE__ */ D(), { modal: a } = /* @__PURE__ */ Kn(n);
    return xv({
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
      open: v(r),
      close: () => r.value = !1
    });
  }
}), Lu = Sv, Cv = /* @__PURE__ */ Z({
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
    Ie();
    const n = pn();
    return (i, r) => (M(), G(v(Re), Ce(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => v(n).onOpenChange(!1))
    }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Ev = Cv;
const Tv = "dismissableLayer.pointerDownOutside", kv = "dismissableLayer.focusOutside";
function Du(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), r = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || r.indexOf(i) < r.indexOf(n)));
}
function Av(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ D(!1), s = /* @__PURE__ */ D(() => {
  });
  return nt((o) => {
    if (!tn || !Ge(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Du(e.value, u)) {
          r.value = !1;
          return;
        }
        if (c.target && !r.value) {
          let f = function() {
            Ir(Tv, t, d);
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
function Pv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ D(!1);
  return nt((s) => {
    if (!tn || !Ge(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Oe(), await Oe();
      const l = a.target;
      !e.value || !l || Du(e.value, l) || a.target && !r.value && Ir(kv, t, { originalEvent: a });
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
const ct = /* @__PURE__ */ Ei({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Ov = /* @__PURE__ */ Z({
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
    const n = t, i = e, { forwardRef: r, currentElement: s } = Ie(), o = B(() => s.value?.ownerDocument ?? globalThis.document), a = B(() => ct.layersRoot), l = B(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = B(() => ct.layersWithOutsidePointerEventsDisabled.size > 0), u = B(() => {
      const p = Array.from(a.value), [h] = [...ct.layersWithOutsidePointerEventsDisabled].slice(-1), m = p.indexOf(h);
      return l.value >= m;
    }), d = Av(async (p) => {
      const h = [...ct.branches].some((m) => m?.contains(p.target));
      !u.value || h || (i("pointerDownOutside", p), i("interactOutside", p), await Oe(), p.defaultPrevented || i("dismiss"));
    }, s), f = Pv((p) => {
      [...ct.branches].some((m) => m?.contains(p.target)) || (i("focusOutside", p), i("interactOutside", p), p.defaultPrevented || i("dismiss"));
    }, s);
    return nv("Escape", (p) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", p), p.defaultPrevented || i("dismiss"));
    }), nt((p) => {
      s.value && (n.disableOutsidePointerEvents && (ct.layersWithOutsidePointerEventsDisabled.size === 0 && (ct.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), ct.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), p(() => {
        n.disableOutsidePointerEvents && ct.layersWithOutsidePointerEventsDisabled.size === 1 && !Rs(ct.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = ct.originalBodyPointerEvents);
      }));
    }), nt((p) => {
      p(() => {
        s.value && (a.value.delete(s.value), ct.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (p, h) => (M(), G(v(Re), {
      ref: v(r),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: Lt({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(f).onFocusCapture,
      onBlurCapture: v(f).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
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
}), $u = Ov;
const Rv = /* @__PURE__ */ jh(() => /* @__PURE__ */ D([]));
function Mv() {
  const t = Rv();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = wa(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = wa(t.value, e), t.value[0]?.resume();
    }
  };
}
function wa(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const as = "focusScope.autoFocusOnMount", ls = "focusScope.autoFocusOnUnmount", _a = {
  bubbles: !1,
  cancelable: !0
};
function Iv(t, { select: e = !1 } = {}) {
  const n = ft();
  for (const i of t)
    if (rn(i, { select: e }), ft() !== n) return !0;
}
function Lv(t) {
  const e = Bu(t), n = xa(e, t), i = xa(e.reverse(), t);
  return [n, i];
}
function Bu(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function xa(t, e) {
  for (const n of t) if (!Dv(n, { upTo: e })) return n;
}
function Dv(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function $v(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function rn(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = ft();
    t.focus({ preventScroll: !0 }), t !== n && $v(t) && e && t.select();
  }
}
var Bv = /* @__PURE__ */ Z({
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
    const n = t, i = e, { currentRef: r, currentElement: s } = Ie(), o = /* @__PURE__ */ D(null), a = Mv(), l = /* @__PURE__ */ Ei({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    nt((u) => {
      if (!tn) return;
      const d = s.value;
      if (!n.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const E = g.target;
        d.contains(E) ? o.value = E : rn(o.value, { select: !0 });
      }
      function p(g) {
        if (l.paused || !d) return;
        const E = g.relatedTarget;
        E !== null && (d.contains(E) || rn(o.value, { select: !0 }));
      }
      function h(g) {
        d.contains(o.value) || rn(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const m = new MutationObserver(h);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), m.disconnect();
      });
    }), nt(async (u) => {
      const d = s.value;
      if (await Oe(), !d) return;
      a.add(l);
      const f = ft();
      if (!d.contains(f)) {
        const h = new CustomEvent(as, _a);
        d.addEventListener(as, (m) => i("mountAutoFocus", m)), d.dispatchEvent(h), h.defaultPrevented || (Iv(Bu(d), { select: !0 }), ft() === f && rn(d));
      }
      u(() => {
        d.removeEventListener(as, (g) => i("mountAutoFocus", g));
        const h = new CustomEvent(ls, _a), m = (g) => {
          i("unmountAutoFocus", g);
        };
        d.addEventListener(ls, m), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || rn(f ?? document.body, { select: !0 }), d.removeEventListener(ls, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = ft();
      if (d && f) {
        const p = u.currentTarget, [h, m] = Lv(p);
        h && m ? !u.shiftKey && f === m ? (u.preventDefault(), n.loop && rn(h, { select: !0 })) : u.shiftKey && f === h && (u.preventDefault(), n.loop && rn(m, { select: !0 })) : f === p && u.preventDefault();
      }
    }
    return (u, d) => (M(), G(v(Re), {
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
}), Fu = Bv;
function Fv(t) {
  return t ? "open" : "closed";
}
function Sa(t) {
  const e = ft();
  for (const n of t)
    if (n === e || (n.focus(), ft() !== e)) return;
}
var Nv = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), { forwardRef: s, currentElement: o } = Ie();
    return r.titleId ||= wi(void 0, "reka-dialog-title"), r.descriptionId ||= wi(void 0, "reka-dialog-description"), Me(() => {
      r.contentElement = o, ft() !== document.body && (r.triggerElement.value = ft());
    }), (a, l) => (M(), G(v(Fu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => i("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => i("closeAutoFocus", c))
    }, {
      default: q(() => [W(v($u), Ce({
        id: v(r).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(r).descriptionId,
        "aria-labelledby": v(r).titleId,
        "data-state": v(Fv)(v(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => v(r).onOpenChange(!1)),
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
}), Nu = Nv, zv = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), s = $r(i), { forwardRef: o, currentElement: a } = Ie();
    return Iu(a), (l, c) => (M(), G(Nu, Ce({
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
}), qv = zv, Hv = /* @__PURE__ */ Z({
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
    const n = t, r = $r(e);
    Ie();
    const s = pn(), o = /* @__PURE__ */ D(!1), a = /* @__PURE__ */ D(!1);
    return (l, c) => (M(), G(Nu, Ce({
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
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wv = Hv, Vv = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = pn(), s = $r(i), { forwardRef: o } = Ie();
    return (a, l) => (M(), G(v(ao), { present: a.forceMount || v(r).open.value }, {
      default: q(() => [v(r).modal.value ? (M(), G(qv, Ce({
        key: 0,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: q(() => [ce(a.$slots, "default")]),
        _: 3
      }, 16)) : (M(), G(Wv, Ce({
        key: 1,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: q(() => [ce(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), zu = Vv, jv = /* @__PURE__ */ Z({
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
    return Au(!0), Ie(), (n, i) => (M(), G(v(Re), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
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
}), Uv = jv, Kv = /* @__PURE__ */ Z({
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
    const e = pn(), { forwardRef: n } = Ie();
    return (i, r) => v(e)?.modal.value ? (M(), G(v(ao), {
      key: 0,
      present: i.forceMount || v(e).open.value
    }, {
      default: q(() => [W(Uv, Ce(i.$attrs, {
        ref: v(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: q(() => [ce(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : fe("v-if", !0);
  }
}), qu = Kv, Xv = /* @__PURE__ */ Z({
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
    const e = /* @__PURE__ */ ku();
    return (n, i) => v(e) || n.forceMount ? (M(), G(Il, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [ce(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : fe("v-if", !0);
  }
}), Hu = Xv, Gv = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), G(v(Hu), Ws(Rr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wu = Gv, Yv = /* @__PURE__ */ Z({
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
    return Ie(), (i, r) => (M(), G(v(Re), Ce(e, { id: v(n).titleId }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Vu = Yv;
const Ca = "data-reka-collection-item";
function hn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let r;
  n ? (r = {
    collectionRef: /* @__PURE__ */ D(),
    itemMap: /* @__PURE__ */ D(/* @__PURE__ */ new Map())
  }, ki(i, r)) : r = ln(i);
  const s = (u = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Ca}]`)), h = Array.from(r.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? h : h.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ Z({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = cr();
      return me(h, () => {
        r.collectionRef.value = h.value;
      }), () => dt(Is, {
        ref: p,
        ...f
      }, d);
    }
  }), a = /* @__PURE__ */ Z({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = cr();
      return nt((m) => {
        if (h.value) {
          const g = yl(h.value);
          r.itemMap.value.set(g, {
            ref: h.value,
            value: u.value
          }), m(() => r.itemMap.value.delete(g));
        }
      }), () => dt(Is, {
        ...f,
        [Ca]: "",
        ref: p
      }, d);
    }
  }), l = B(() => Array.from(r.itemMap.value.values())), c = B(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const Jv = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Zv(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Qv(t, e, n) {
  const i = Zv(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Jv[i];
}
var em = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), G(v(Re), {
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
}), ju = em, tm = /* @__PURE__ */ Z({
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
    const e = t, { primitiveElement: n, currentElement: i } = cr(), r = B(() => e.checked ?? e.value);
    return me(r, (s, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (M(), G(ju, Ce({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Ea = tm, nm = /* @__PURE__ */ Z({
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
    return (r, s) => (M(), le(Ee, null, [fe(" We render single input if it's required "), n.value ? (M(), G(Ea, Ce({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (M(!0), le(Ee, { key: 1 }, On(i.value, (o) => (M(), G(Ea, Ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), im = nm;
const [Uu, rm] = $t("PopperRoot");
var sm = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ D();
    return rm({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, i) => ce(n.$slots, "default");
  }
}), om = sm, am = /* @__PURE__ */ Z({
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
    const e = t, { forwardRef: n, currentElement: i } = Ie(), r = Uu();
    return Al(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (s, o) => (M(), G(v(Re), {
      ref: v(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: q(() => [ce(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), lm = am;
function um(t) {
  return t !== null;
}
function cm(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: i, middlewareData: r } = e, o = r.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [c, u] = Ls(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (r.arrow?.x ?? 0) + a / 2, p = (r.arrow?.y ?? 0) + l / 2;
      let h = "", m = "";
      return c === "bottom" ? (h = o ? d : `${f}px`, m = `${-l}px`) : c === "top" ? (h = o ? d : `${f}px`, m = `${i.floating.height + l}px`) : c === "right" ? (h = `${-l}px`, m = o ? d : `${p}px`) : c === "left" && (h = `${i.floating.width + l}px`, m = o ? d : `${p}px`), { data: {
        x: h,
        y: m
      } };
    }
  };
}
function Ls(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const dm = ["top", "right", "bottom", "left"], cn = Math.min, st = Math.max, dr = Math.round, Ni = Math.floor, Rt = (t) => ({
  x: t,
  y: t
}), fm = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, pm = {
  start: "end",
  end: "start"
};
function Ds(t, e, n) {
  return st(t, cn(e, n));
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
function lo(t) {
  return t === "x" ? "y" : "x";
}
function uo(t) {
  return t === "y" ? "height" : "width";
}
const hm = /* @__PURE__ */ new Set(["top", "bottom"]);
function Pt(t) {
  return hm.has(Zt(t)) ? "y" : "x";
}
function co(t) {
  return lo(Pt(t));
}
function vm(t, e, n) {
  n === void 0 && (n = !1);
  const i = Xn(t), r = co(t), s = uo(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = fr(o)), [o, fr(o)];
}
function mm(t) {
  const e = fr(t);
  return [$s(t), e, $s(e)];
}
function $s(t) {
  return t.replace(/start|end/g, (e) => pm[e]);
}
const Ta = ["left", "right"], ka = ["right", "left"], gm = ["top", "bottom"], ym = ["bottom", "top"];
function bm(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? ka : Ta : e ? Ta : ka;
    case "left":
    case "right":
      return e ? gm : ym;
    default:
      return [];
  }
}
function wm(t, e, n, i) {
  const r = Xn(t);
  let s = bm(Zt(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map($s)))), s;
}
function fr(t) {
  return t.replace(/left|right|bottom|top/g, (e) => fm[e]);
}
function _m(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Ku(t) {
  return typeof t != "number" ? _m(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function pr(t) {
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
function Aa(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = Pt(e), o = co(e), a = uo(o), l = Zt(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, f = i[a] / 2 - r[a] / 2;
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
async function xm(t, e) {
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
  } = Jt(e, t), h = Ku(p), g = a[f ? d === "floating" ? "reference" : "floating" : d], E = pr(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(g))) == null || n ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), w = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, S = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), y = await (s.isElement == null ? void 0 : s.isElement(S)) ? await (s.getScale == null ? void 0 : s.getScale(S)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, T = pr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: S,
    strategy: l
  }) : w);
  return {
    top: (E.top - T.top + h.top) / y.y,
    bottom: (T.bottom - E.bottom + h.bottom) / y.y,
    left: (E.left - T.left + h.left) / y.x,
    right: (T.right - E.right + h.right) / y.x
  };
}
const Sm = async (t, e, n) => {
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
  } = Aa(c, i, l), f = i, p = {}, h = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: E,
      fn: w
    } = a[g], {
      x: S,
      y,
      data: T,
      reset: C
    } = await w({
      x: u,
      y: d,
      initialPlacement: i,
      placement: f,
      strategy: r,
      middlewareData: p,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : xm
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = S ?? u, d = y ?? d, p = {
      ...p,
      [E]: {
        ...p[E],
        ...T
      }
    }, C && h <= 50 && (h++, typeof C == "object" && (C.placement && (f = C.placement), C.rects && (c = C.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : C.rects), {
      x: u,
      y: d
    } = Aa(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: p
  };
}, Cm = (t) => ({
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
    const d = Ku(u), f = {
      x: n,
      y: i
    }, p = co(r), h = uo(p), m = await o.getDimensions(c), g = p === "y", E = g ? "top" : "left", w = g ? "bottom" : "right", S = g ? "clientHeight" : "clientWidth", y = s.reference[h] + s.reference[p] - f[p] - s.floating[h], T = f[p] - s.reference[p], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let _ = C ? C[S] : 0;
    (!_ || !await (o.isElement == null ? void 0 : o.isElement(C))) && (_ = a.floating[S] || s.floating[h]);
    const R = y / 2 - T / 2, k = _ / 2 - m[h] / 2 - 1, A = cn(d[E], k), I = cn(d[w], k), P = A, H = _ - m[h] - I, L = _ / 2 - m[h] / 2 + R, U = Ds(P, L, H), ne = !l.arrow && Xn(r) != null && L !== U && s.reference[h] / 2 - (L < P ? A : I) - m[h] / 2 < 0, J = ne ? L < P ? L - P : L - H : 0;
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
}), Em = function(t) {
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
        flipAlignment: m = !0,
        ...g
      } = Jt(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const E = Zt(r), w = Pt(a), S = Zt(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), T = f || (S || !m ? [fr(a)] : mm(a)), C = h !== "none";
      !f && C && T.push(...wm(a, m, h, y));
      const _ = [a, ...T], R = await l.detectOverflow(e, g), k = [];
      let A = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && k.push(R[E]), d) {
        const L = vm(r, o, y);
        k.push(R[L[0]], R[L[1]]);
      }
      if (A = [...A, {
        placement: r,
        overflows: k
      }], !k.every((L) => L <= 0)) {
        var I, P;
        const L = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, U = _[L];
        if (U && (!(d === "alignment" ? w !== Pt(U) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((Q) => Pt(Q.placement) === w ? Q.overflows[0] > 0 : !0)))
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
                if (C) {
                  const we = Pt(Q.placement);
                  return we === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  we === "y";
                }
                return !0;
              }).map((Q) => [Q.placement, Q.overflows.filter((we) => we > 0).reduce((we, Le) => we + Le, 0)]).sort((Q, we) => Q[1] - we[1])[0]) == null ? void 0 : H[0];
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
function Pa(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function Oa(t) {
  return dm.some((e) => t[e] >= 0);
}
const Tm = function(t) {
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
          }), a = Pa(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Oa(a)
            }
          };
        }
        case "escaped": {
          const o = await i.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Pa(o, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Oa(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Xu = /* @__PURE__ */ new Set(["left", "top"]);
async function km(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = Zt(n), a = Xn(n), l = Pt(n) === "y", c = Xu.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Jt(e, t);
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
const Am = function(t) {
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
      } = e, l = await km(e, t);
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
}, Pm = function(t) {
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
          fn: (E) => {
            let {
              x: w,
              y: S
            } = E;
            return {
              x: w,
              y: S
            };
          }
        },
        ...c
      } = Jt(t, e), u = {
        x: n,
        y: i
      }, d = await s.detectOverflow(e, c), f = Pt(Zt(r)), p = lo(f);
      let h = u[p], m = u[f];
      if (o) {
        const E = p === "y" ? "top" : "left", w = p === "y" ? "bottom" : "right", S = h + d[E], y = h - d[w];
        h = Ds(S, h, y);
      }
      if (a) {
        const E = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", S = m + d[E], y = m - d[w];
        m = Ds(S, m, y);
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
          y: g.y - i,
          enabled: {
            [p]: o,
            [f]: a
          }
        }
      };
    }
  };
}, Om = function(t) {
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
      }, d = Pt(r), f = lo(d);
      let p = u[f], h = u[d];
      const m = Jt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const S = f === "y" ? "height" : "width", y = s.reference[f] - s.floating[S] + g.mainAxis, T = s.reference[f] + s.reference[S] - g.mainAxis;
        p < y ? p = y : p > T && (p = T);
      }
      if (c) {
        var E, w;
        const S = f === "y" ? "width" : "height", y = Xu.has(Zt(r)), T = s.reference[d] - s.floating[S] + (y && ((E = o.offset) == null ? void 0 : E[d]) || 0) + (y ? 0 : g.crossAxis), C = s.reference[d] + s.reference[S] + (y ? 0 : ((w = o.offset) == null ? void 0 : w[d]) || 0) - (y ? g.crossAxis : 0);
        h < T ? h = T : h > C && (h = C);
      }
      return {
        [f]: p,
        [d]: h
      };
    }
  };
}, Rm = function(t) {
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
      } = Jt(t, e), u = await o.detectOverflow(e, c), d = Zt(r), f = Xn(r), p = Pt(r) === "y", {
        width: h,
        height: m
      } = s.floating;
      let g, E;
      d === "top" || d === "bottom" ? (g = d, E = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (E = d, g = f === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, S = h - u.left - u.right, y = cn(m - u[g], w), T = cn(h - u[E], S), C = !e.middlewareData.shift;
      let _ = y, R = T;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (R = S), (i = e.middlewareData.shift) != null && i.enabled.y && (_ = w), C && !f) {
        const A = st(u.left, 0), I = st(u.right, 0), P = st(u.top, 0), H = st(u.bottom, 0);
        p ? R = h - 2 * (A !== 0 || I !== 0 ? A + I : st(u.left, u.right)) : _ = m - 2 * (P !== 0 || H !== 0 ? P + H : st(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: R,
        availableHeight: _
      });
      const k = await o.getDimensions(a.floating);
      return h !== k.width || m !== k.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Br() {
  return typeof window < "u";
}
function Rn(t) {
  return fo(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function at(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Bt(t) {
  var e;
  return (e = (fo(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function fo(t) {
  return Br() ? t instanceof Node || t instanceof at(t).Node : !1;
}
function bt(t) {
  return Br() ? t instanceof Element || t instanceof at(t).Element : !1;
}
function It(t) {
  return Br() ? t instanceof HTMLElement || t instanceof at(t).HTMLElement : !1;
}
function Ra(t) {
  return !Br() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof at(t).ShadowRoot;
}
const Mm = /* @__PURE__ */ new Set(["inline", "contents"]);
function Oi(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = wt(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !Mm.has(r);
}
const Im = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Lm(t) {
  return Im.has(Rn(t));
}
const Dm = [":popover-open", ":modal"];
function Fr(t) {
  return Dm.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const $m = ["transform", "translate", "scale", "rotate", "perspective"], Bm = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Fm = ["paint", "layout", "strict", "content"];
function po(t) {
  const e = ho(), n = bt(t) ? wt(t) : t;
  return $m.some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Bm.some((i) => (n.willChange || "").includes(i)) || Fm.some((i) => (n.contain || "").includes(i));
}
function Nm(t) {
  let e = dn(t);
  for (; It(e) && !Un(e); ) {
    if (po(e))
      return e;
    if (Fr(e))
      return null;
    e = dn(e);
  }
  return null;
}
function ho() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const zm = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Un(t) {
  return zm.has(Rn(t));
}
function wt(t) {
  return at(t).getComputedStyle(t);
}
function Nr(t) {
  return bt(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function dn(t) {
  if (Rn(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Ra(t) && t.host || // Fallback.
    Bt(t)
  );
  return Ra(e) ? e.host : e;
}
function Gu(t) {
  const e = dn(t);
  return Un(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : It(e) && Oi(e) ? e : Gu(e);
}
function _i(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = Gu(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = at(r);
  if (s) {
    const a = Bs(o);
    return e.concat(o, o.visualViewport || [], Oi(r) ? r : [], a && n ? _i(a) : []);
  }
  return e.concat(r, _i(r, [], n));
}
function Bs(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Yu(t) {
  const e = wt(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = It(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = dr(n) !== s || dr(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function vo(t) {
  return bt(t) ? t : t.contextElement;
}
function Wn(t) {
  const e = vo(t);
  if (!It(e))
    return Rt(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Yu(e);
  let o = (s ? dr(n.width) : n.width) / i, a = (s ? dr(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const qm = /* @__PURE__ */ Rt(0);
function Ju(t) {
  const e = at(t);
  return !ho() || !e.visualViewport ? qm : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Hm(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== at(t) ? !1 : e;
}
function An(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = vo(t);
  let o = Rt(1);
  e && (i ? bt(i) && (o = Wn(i)) : o = Wn(t));
  const a = Hm(s, n, i) ? Ju(s) : Rt(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const f = at(s), p = i && bt(i) ? at(i) : i;
    let h = f, m = Bs(h);
    for (; m && i && p !== h; ) {
      const g = Wn(m), E = m.getBoundingClientRect(), w = wt(m), S = E.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, y = E.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += S, c += y, h = at(m), m = Bs(h);
    }
  }
  return pr({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function zr(t, e) {
  const n = Nr(t).scrollLeft;
  return e ? e.left + n : An(Bt(t)).left + n;
}
function Zu(t, e) {
  const n = t.getBoundingClientRect(), i = n.left + e.scrollLeft - zr(t, n), r = n.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function Wm(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = Bt(i), a = e ? Fr(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Rt(1);
  const u = Rt(0), d = It(i);
  if ((d || !d && !s) && ((Rn(i) !== "body" || Oi(o)) && (l = Nr(i)), It(i))) {
    const p = An(i);
    c = Wn(i), u.x = p.x + i.clientLeft, u.y = p.y + i.clientTop;
  }
  const f = o && !d && !s ? Zu(o, l) : Rt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Vm(t) {
  return Array.from(t.getClientRects());
}
function jm(t) {
  const e = Bt(t), n = Nr(t), i = t.ownerDocument.body, r = st(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = st(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + zr(t);
  const a = -n.scrollTop;
  return wt(i).direction === "rtl" && (o += st(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const Ma = 25;
function Um(t, e) {
  const n = at(t), i = Bt(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const u = ho();
    (!u || u && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const c = zr(i);
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
const Km = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Xm(t, e) {
  const n = An(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = It(t) ? Wn(t) : Rt(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Ia(t, e, n) {
  let i;
  if (e === "viewport")
    i = Um(t, n);
  else if (e === "document")
    i = jm(Bt(t));
  else if (bt(e))
    i = Xm(e, n);
  else {
    const r = Ju(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return pr(i);
}
function Qu(t, e) {
  const n = dn(t);
  return n === e || !bt(n) || Un(n) ? !1 : wt(n).position === "fixed" || Qu(n, e);
}
function Gm(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = _i(t, [], !1).filter((a) => bt(a) && Rn(a) !== "body"), r = null;
  const s = wt(t).position === "fixed";
  let o = s ? dn(t) : t;
  for (; bt(o) && !Un(o); ) {
    const a = wt(o), l = po(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && Km.has(r.position) || Oi(o) && !l && Qu(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = dn(o);
  }
  return e.set(t, i), i;
}
function Ym(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Fr(e) ? [] : Gm(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = Ia(e, u, r);
    return c.top = st(d.top, c.top), c.right = cn(d.right, c.right), c.bottom = cn(d.bottom, c.bottom), c.left = st(d.left, c.left), c;
  }, Ia(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Jm(t) {
  const {
    width: e,
    height: n
  } = Yu(t);
  return {
    width: e,
    height: n
  };
}
function Zm(t, e, n) {
  const i = It(e), r = Bt(e), s = n === "fixed", o = An(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Rt(0);
  function c() {
    l.x = zr(r);
  }
  if (i || !i && !s)
    if ((Rn(e) !== "body" || Oi(r)) && (a = Nr(e)), i) {
      const p = An(e, !0, s, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? Zu(r, a) : Rt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function us(t) {
  return wt(t).position === "static";
}
function La(t, e) {
  if (!It(t) || wt(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return Bt(t) === n && (n = n.ownerDocument.body), n;
}
function ec(t, e) {
  const n = at(t);
  if (Fr(t))
    return n;
  if (!It(t)) {
    let r = dn(t);
    for (; r && !Un(r); ) {
      if (bt(r) && !us(r))
        return r;
      r = dn(r);
    }
    return n;
  }
  let i = La(t, e);
  for (; i && Lm(i) && us(i); )
    i = La(i, e);
  return i && Un(i) && us(i) && !po(i) ? n : i || Nm(t) || n;
}
const Qm = async function(t) {
  const e = this.getOffsetParent || ec, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Zm(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function eg(t) {
  return wt(t).direction === "rtl";
}
const tg = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Wm,
  getDocumentElement: Bt,
  getClippingRect: Ym,
  getOffsetParent: ec,
  getElementRects: Qm,
  getClientRects: Vm,
  getDimensions: Jm,
  getScale: Wn,
  isElement: bt,
  isRTL: eg
};
function tc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function ng(t, e) {
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
    const h = Ni(d), m = Ni(r.clientWidth - (u + f)), g = Ni(r.clientHeight - (d + p)), E = Ni(u), S = {
      rootMargin: -h + "px " + -m + "px " + -g + "px " + -E + "px",
      threshold: st(0, cn(1, l)) || 1
    };
    let y = !0;
    function T(C) {
      const _ = C[0].intersectionRatio;
      if (_ !== l) {
        if (!y)
          return o();
        _ ? o(!1, _) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      _ === 1 && !tc(c, t.getBoundingClientRect()) && o(), y = !1;
    }
    try {
      n = new IntersectionObserver(T, {
        ...S,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(T, S);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function ig(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = vo(t), u = r || s ? [...c ? _i(c) : [], ..._i(e)] : [];
  u.forEach((E) => {
    r && E.addEventListener("scroll", n, {
      passive: !0
    }), s && E.addEventListener("resize", n);
  });
  const d = c && a ? ng(c, n) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((E) => {
    let [w] = E;
    w && w.target === c && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var S;
      (S = p) == null || S.observe(e);
    })), n();
  }), c && !l && p.observe(c), p.observe(e));
  let h, m = l ? An(t) : null;
  l && g();
  function g() {
    const E = An(t);
    m && !tc(m, E) && n(), m = E, h = requestAnimationFrame(g);
  }
  return n(), () => {
    var E;
    u.forEach((w) => {
      r && w.removeEventListener("scroll", n), s && w.removeEventListener("resize", n);
    }), d?.(), (E = p) == null || E.disconnect(), p = null, l && cancelAnimationFrame(h);
  };
}
const rg = Am, sg = Pm, Da = Em, og = Rm, ag = Tm, lg = Cm, ug = Om, cg = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: tg,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Sm(t, e, {
    ...r,
    platform: s
  });
};
function dg(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function Fs(t) {
  if (dg(t)) {
    const e = t.$el;
    return fo(e) && Rn(e) === "#comment" ? null : e;
  }
  return t;
}
function Bn(t) {
  return typeof t == "function" ? t() : v(t);
}
function fg(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = Fs(Bn(t.element));
      return n == null ? {} : lg({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function nc(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function $a(t, e) {
  const n = nc(t);
  return Math.round(e * n) / n;
}
function pg(t, e, n) {
  n === void 0 && (n = {});
  const i = n.whileElementsMounted, r = B(() => {
    var _;
    return (_ = Bn(n.open)) != null ? _ : !0;
  }), s = B(() => Bn(n.middleware)), o = B(() => {
    var _;
    return (_ = Bn(n.placement)) != null ? _ : "bottom";
  }), a = B(() => {
    var _;
    return (_ = Bn(n.strategy)) != null ? _ : "absolute";
  }), l = B(() => {
    var _;
    return (_ = Bn(n.transform)) != null ? _ : !0;
  }), c = B(() => Fs(t.value)), u = B(() => Fs(e.value)), d = /* @__PURE__ */ D(0), f = /* @__PURE__ */ D(0), p = /* @__PURE__ */ D(a.value), h = /* @__PURE__ */ D(o.value), m = /* @__PURE__ */ kn({}), g = /* @__PURE__ */ D(!1), E = B(() => {
    const _ = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return _;
    const R = $a(u.value, d.value), k = $a(u.value, f.value);
    return l.value ? {
      ..._,
      transform: "translate(" + R + "px, " + k + "px)",
      ...nc(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: R + "px",
      top: k + "px"
    };
  });
  let w;
  function S() {
    if (c.value == null || u.value == null)
      return;
    const _ = r.value;
    cg(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((R) => {
      d.value = R.x, f.value = R.y, p.value = R.strategy, h.value = R.placement, m.value = R.middlewareData, g.value = _ !== !1;
    });
  }
  function y() {
    typeof w == "function" && (w(), w = void 0);
  }
  function T() {
    if (y(), i === void 0) {
      S();
      return;
    }
    if (c.value != null && u.value != null) {
      w = i(c.value, u.value, S);
      return;
    }
  }
  function C() {
    r.value || (g.value = !1);
  }
  return me([s, o, a, r], S, {
    flush: "sync"
  }), me([c, u], T, {
    flush: "sync"
  }), me(r, C, {
    flush: "sync"
  }), js() && tl(y), {
    x: /* @__PURE__ */ In(d),
    y: /* @__PURE__ */ In(f),
    strategy: /* @__PURE__ */ In(p),
    placement: /* @__PURE__ */ In(h),
    middlewareData: /* @__PURE__ */ In(m),
    isPositioned: /* @__PURE__ */ In(g),
    floatingStyles: E,
    update: S
  };
}
const hg = {
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
}, [Vb, vg] = $t("PopperContent");
var mg = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Od({
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
  }, { ...hg }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = Uu(), { forwardRef: s, currentElement: o } = Ie(), a = /* @__PURE__ */ D(), l = /* @__PURE__ */ D(), { width: c, height: u } = mv(l), d = B(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), f = B(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), p = B(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = B(() => ({
      padding: f.value,
      boundary: p.value.filter(um),
      altBoundary: p.value.length > 0
    })), m = B(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), g = Vh(() => [
      rg({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && Da({
        ...h.value,
        ...m.value
      }),
      n.avoidCollisions && sg({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? ug() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && Da({
        ...h.value,
        ...m.value
      }),
      og({
        ...h.value,
        apply: ({ elements: P, rects: H, availableWidth: L, availableHeight: U }) => {
          const { width: ne, height: J } = H.reference, Q = P.floating.style;
          Q.setProperty("--reka-popper-available-width", `${L}px`), Q.setProperty("--reka-popper-available-height", `${U}px`), Q.setProperty("--reka-popper-anchor-width", `${ne}px`), Q.setProperty("--reka-popper-anchor-height", `${J}px`);
        }
      }),
      l.value && fg({
        element: l.value,
        padding: n.arrowPadding
      }),
      cm({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && ag({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), E = B(() => n.reference ?? r.anchor.value), { floatingStyles: w, placement: S, isPositioned: y, middlewareData: T } = pg(E, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...P) => ig(...P, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: g
    }), C = B(() => Ls(S.value)[0]), _ = B(() => Ls(S.value)[1]);
    Al(() => {
      y.value && i("placed");
    });
    const R = B(() => {
      const P = T.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && P;
    }), k = /* @__PURE__ */ D("");
    nt(() => {
      o.value && (k.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = B(() => T.value.arrow?.x ?? 0), I = B(() => T.value.arrow?.y ?? 0);
    return vg({
      placedSide: C,
      onArrowChange: (P) => l.value = P,
      arrowX: A,
      arrowY: I,
      shouldHideArrow: R
    }), (P, H) => (M(), le("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Lt({
        ...v(w),
        transform: v(y) ? v(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: k.value,
        "--reka-popper-transform-origin": [v(T).transformOrigin?.x, v(T).transformOrigin?.y].join(" "),
        ...v(T).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [W(v(Re), Ce({ ref: v(s) }, P.$attrs, {
      "as-child": n.asChild,
      as: P.as,
      "data-side": C.value,
      "data-align": _.value,
      style: { animation: v(y) ? void 0 : "none" }
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
}), gg = mg;
function yg(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => di(i, e, n)) : di(t, e, n);
}
function di(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : lr(t, e);
}
const [ic, bg] = $t("ListboxRoot");
var wg = /* @__PURE__ */ Z({
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
    const i = t, r = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ Kn(i), { getItems: d } = hn({ isProvider: !0 }), { handleTypeaheadSearch: f } = oo(), { primitiveElement: p, currentElement: h } = cr(), m = vv(), g = Ou(u), E = Ru(h), w = /* @__PURE__ */ D(), S = /* @__PURE__ */ D(!1), y = /* @__PURE__ */ D(!0), T = /* @__PURE__ */ ur(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function C(X) {
      if (S.value = !0, i.multiple) {
        const re = Array.isArray(T.value) ? [...T.value] : [], ue = re.findIndex((pe) => di(pe, X, i.by));
        i.selectionBehavior === "toggle" ? (ue === -1 ? re.push(X) : re.splice(ue, 1), T.value = re) : (T.value = [X], w.value = X);
      } else i.selectionBehavior === "toggle" && di(T.value, X, i.by) ? T.value = void 0 : T.value = X;
      setTimeout(() => {
        S.value = !1;
      }, 1);
    }
    const _ = /* @__PURE__ */ D(null), R = /* @__PURE__ */ D(null), k = /* @__PURE__ */ D(!1), A = /* @__PURE__ */ D(!1), I = /* @__PURE__ */ ns(), P = /* @__PURE__ */ ns(), H = /* @__PURE__ */ ns();
    function L() {
      return d().map((X) => X.ref).filter((X) => X.dataset.disabled !== "");
    }
    function U(X, re = !0) {
      if (!X) return;
      _.value = X, y.value && _.value.focus(), re && _.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((pe) => pe.ref === X);
      r("highlight", ue);
    }
    function ne(X) {
      if (k.value) H.trigger(X);
      else {
        const re = d().find((ue) => di(ue.value, X, i.by));
        re && (_.value = re.ref, U(re.ref));
      }
    }
    function J(X) {
      _.value && _.value.isConnected && (X.preventDefault(), X.stopPropagation(), A.value || _.value.click());
    }
    function Q(X) {
      if (y.value) {
        if (S.value = !0, k.value) P.trigger(X);
        else {
          const re = X.altKey || X.ctrlKey || X.metaKey;
          if (re && X.key === "a" && s.value) {
            const ue = d(), pe = ue.map((pt) => pt.value);
            T.value = [...pe], X.preventDefault(), U(ue[ue.length - 1].ref);
          } else if (!re) {
            const ue = f(X.key, d());
            ue && U(ue);
          }
        }
        setTimeout(() => {
          S.value = !1;
        }, 1);
      }
    }
    function we() {
      A.value = !0;
    }
    function Le() {
      Oe(() => {
        A.value = !1;
      });
    }
    function Je() {
      Oe(() => {
        const X = new KeyboardEvent("keydown", { key: "PageUp" });
        Nt(X);
      });
    }
    function Ae(X) {
      const re = _.value;
      re?.isConnected && (R.value = re), _.value = null, r("leave", X);
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
      const re = Qv(X, a.value, g.value);
      if (!re) return;
      let ue = L();
      if (_.value) {
        if (re === "last") ue.reverse();
        else if (re === "prev" || re === "next") {
          re === "prev" && ue.reverse();
          const pe = ue.indexOf(_.value);
          ue = ue.slice(pe + 1);
        }
        Gn(X, ue[0]);
      }
      if (ue.length) {
        const pe = !_.value && re === "prev" ? ue.length - 1 : 0;
        U(ue[pe]);
      }
      if (k.value) return P.trigger(X);
    }
    function Gn(X, re) {
      if (!(k.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(T.value) || (X.altKey || X.ctrlKey || X.metaKey) && !X.shiftKey) && X.shiftKey) {
        const pe = d().filter((x) => x.ref.dataset.disabled !== "");
        let pt = pe.find((x) => x.ref === re)?.value;
        if (X.key === m.END ? pt = pe[pe.length - 1].value : X.key === m.HOME && (pt = pe[0].value), !pt || !w.value) return;
        const b = Wh(pe.map((x) => x.value), w.value, pt);
        T.value = b;
      }
    }
    async function zt(X) {
      if (await Oe(), k.value) I.trigger(X);
      else {
        const re = L(), ue = re.find((pe) => pe.dataset.state === "checked");
        ue ? U(ue) : re.length && U(re[0]);
      }
    }
    return me(T, () => {
      S.value || Oe(() => {
        zt();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: _,
      highlightItem: ne,
      highlightFirstItem: Je,
      highlightSelected: zt,
      getItems: d
    }), bg({
      modelValue: T,
      onValueChange: C,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: _,
      isVirtual: k,
      virtualFocusHook: I,
      virtualKeydownHook: P,
      virtualHighlightHook: H,
      by: i.by,
      firstValue: w,
      selectionBehavior: c,
      focusable: y,
      onLeave: Ae,
      onEnter: Ft,
      changeHighlight: U,
      onKeydownEnter: J,
      onKeydownNavigation: Nt,
      onKeydownTypeAhead: Q,
      onCompositionStart: we,
      onCompositionEnd: Le,
      highlightFirstItem: Je
    }), (X, re) => (M(), G(v(Re), {
      ref_key: "primitiveElement",
      ref: p,
      as: X.as,
      "as-child": X.asChild,
      dir: v(g),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Ae,
      onFocusout: re[0] || (re[0] = async (ue) => {
        const pe = ue.relatedTarget || ue.target;
        await Oe(), _.value && v(h) && !v(h).contains(pe) && Ae(ue);
      })
    }, {
      default: q(() => [ce(X.$slots, "default", { modelValue: v(T) }), v(E) && X.name ? (M(), G(v(im), {
        key: 0,
        name: X.name,
        value: v(T),
        disabled: v(l),
        required: X.required
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
}), _g = wg, xg = /* @__PURE__ */ Z({
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
    const { CollectionSlot: e } = hn(), n = ic(), i = Eu(!1, 10);
    return (r, s) => (M(), G(v(e), null, {
      default: q(() => [W(v(Re), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: s[0] || (s[0] = Tn((o) => i.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          v(i) || v(n).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = As((o) => {
            v(n).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || v(n).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), v(n).focusable.value && v(n).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          As(v(n).onKeydownEnter, ["enter"]),
          v(n).onKeydownTypeAhead
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
}), Sg = xg;
const Cg = "listbox.select", [Eg, Tg] = $t("ListboxItem");
var kg = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = wi(void 0, "reka-listbox-item"), { CollectionItem: s } = hn(), { forwardRef: o, currentElement: a } = Ie(), l = ic(), c = B(() => a.value === l.highlightedElement.value), u = B(() => yg(l.modelValue.value, n.value, l.by)), d = B(() => l.disabled.value || n.disabled);
    async function f(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function p(h) {
      const m = {
        originalEvent: h,
        value: n.value
      };
      Ir(Cg, f, m);
    }
    return Tg({ isSelected: u }), (h, m) => (M(), G(v(s), { value: h.value }, {
      default: q(() => [hf([c.value, u.value], () => W(v(Re), Ce({ id: v(r) }, h.$attrs, {
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
        onClick: p,
        onKeydown: As(Tn(p, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
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
      ]), m, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Ag = kg, Pg = /* @__PURE__ */ Z({
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
    Ie();
    const n = Eg();
    return (i, r) => v(n).isSelected.value ? (M(), G(v(Re), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), Og = Pg;
function Rg(t) {
  const e = ro({ nonce: /* @__PURE__ */ D() });
  return B(() => t?.value || e.nonce?.value);
}
const Mg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Ig = [" ", "Enter"], ht = 10;
function xi(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => Ns(i, e, n)) : Ns(t, e, n);
}
function Ns(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : lr(t, e);
}
function Lg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const Dg = {
  key: 0,
  value: ""
}, [vn, rc] = $t("SelectRoot");
var $g = /* @__PURE__ */ Z({
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
    const n = t, i = e, { required: r, disabled: s, multiple: o, dir: a } = /* @__PURE__ */ Kn(n), l = /* @__PURE__ */ ur(n, "modelValue", i, {
      defaultValue: n.defaultValue ?? (o.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ ur(n, "open", i, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = /* @__PURE__ */ D(), d = /* @__PURE__ */ D(), f = /* @__PURE__ */ D({
      x: 0,
      y: 0
    }), p = B(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Rs(l.value));
    hn({ isProvider: !0 });
    const h = Ou(a), m = Ru(u), g = /* @__PURE__ */ D(/* @__PURE__ */ new Set()), E = B(() => Array.from(g.value).map((y) => y.value).join(";"));
    function w(y) {
      if (o.value) {
        const T = Array.isArray(l.value) ? [...l.value] : [], C = T.findIndex((_) => Ns(_, y, n.by));
        C === -1 ? T.push(y) : T.splice(C, 1), l.value = [...T];
      } else l.value = y;
    }
    function S(y) {
      return Array.from(g.value).find((T) => xi(y, T.value, n.by));
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
      onValueChange: w,
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
        const T = S(y.value);
        T && g.value.delete(T), g.value.add(y);
      },
      onOptionRemove: (y) => {
        const T = S(y.value);
        T && g.value.delete(T);
      }
    }), (y, T) => (M(), G(v(om), null, {
      default: q(() => [ce(y.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(m) ? (M(), G(Ng, {
        key: E.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(r),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: v(s),
        value: v(l)
      }, {
        default: q(() => [v(Rs)(v(l)) ? (M(), le("option", Dg)) : fe("v-if", !0), (M(!0), le(Ee, null, On(Array.from(g.value), (C) => (M(), le("option", Ce({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
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
}), Bg = $g, Fg = /* @__PURE__ */ Z({
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
    const e = t, n = /* @__PURE__ */ D(), i = vn();
    me(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && n.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(n.value, s), n.value.dispatchEvent(u);
      }
    });
    function r(s) {
      i.onValueChange(s.target.value);
    }
    return (s, o) => (M(), G(v(ju), { "as-child": "" }, {
      default: q(() => [oe("select", Ce({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: r }), [ce(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Ng = Fg, zg = /* @__PURE__ */ Z({
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
      default: ht
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
    const n = so(t);
    return (i, r) => (M(), G(v(gg), Ce(v(n), { style: {
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
}), qg = zg;
const Hg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [qr, sc] = $t("SelectContent");
var Wg = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = vn();
    uv(), Au(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = hn(), a = /* @__PURE__ */ D();
    Iu(a);
    const { search: l, handleTypeaheadSearch: c } = oo(), u = /* @__PURE__ */ D(), d = /* @__PURE__ */ D(), f = /* @__PURE__ */ D(), p = /* @__PURE__ */ D(!1), h = /* @__PURE__ */ D(!1), m = /* @__PURE__ */ D(!1);
    function g() {
      d.value && a.value && Sa([d.value, a.value]);
    }
    me(p, () => {
      g();
    });
    const { onOpenChange: E, triggerPointerDownPosRef: w } = r;
    nt((C) => {
      if (!a.value) return;
      let _ = {
        x: 0,
        y: 0
      };
      const R = (A) => {
        _ = {
          x: Math.abs(Math.round(A.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(A.pageY) - (w.value?.y ?? 0))
        };
      }, k = (A) => {
        A.pointerType !== "touch" && (_.x <= 10 && _.y <= 10 ? A.preventDefault() : a.value?.contains(A.target) || E(!1), document.removeEventListener("pointermove", R), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", R), document.addEventListener("pointerup", k, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", k, { capture: !0 });
      });
    });
    function S(C) {
      const _ = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !_ && C.key.length === 1 && c(C.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let k = [...o().map((A) => A.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (k = k.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const A = C.target, I = k.indexOf(A);
          k = k.slice(I + 1);
        }
        setTimeout(() => Sa(k)), C.preventDefault();
      }
    }
    const y = B(() => n.position === "popper" ? n : {}), T = so(y.value);
    return sc({
      content: a,
      viewport: u,
      onViewportChange: (C) => {
        u.value = C;
      },
      itemRefCallback: (C, _, R) => {
        const k = !h.value && !R, A = xi(r.modelValue.value, _, r.by);
        if (r.multiple.value) {
          if (m.value) return;
          (A || k) && (d.value = C, A && (m.value = !0));
        } else (A || k) && (d.value = C);
        k && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (C, _, R) => {
        const k = !h.value && !R;
        (xi(r.modelValue.value, _, r.by) || k) && (f.value = C);
      },
      focusSelectedItem: g,
      position: n.position,
      isPositioned: p,
      searchRef: l
    }), (C, _) => (M(), G(v(s), null, {
      default: q(() => [W(v(Fu), {
        "as-child": "",
        onMountAutoFocus: _[6] || (_[6] = Tn(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: _[7] || (_[7] = (R) => {
          i("closeAutoFocus", R), !R.defaultPrevented && (v(r).triggerElement.value?.focus({ preventScroll: !0 }), R.preventDefault());
        })
      }, {
        default: q(() => [W(v($u), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: _[2] || (_[2] = Tn(() => {
          }, ["prevent"])),
          onDismiss: _[3] || (_[3] = (R) => v(r).onOpenChange(!1)),
          onEscapeKeyDown: _[4] || (_[4] = (R) => i("escapeKeyDown", R)),
          onPointerDownOutside: _[5] || (_[5] = (R) => i("pointerDownOutside", R))
        }, {
          default: q(() => [(M(), G(Ed(C.position === "popper" ? qg : Xg), Ce({
            ...C.$attrs,
            ...v(T)
          }, {
            id: v(r).contentId,
            ref: (R) => {
              const k = v(Mt)(R);
              k?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = k.firstElementChild : a.value = k;
            },
            role: "listbox",
            "data-state": v(r).open.value ? "open" : "closed",
            dir: v(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: _[0] || (_[0] = Tn(() => {
            }, ["prevent"])),
            onPlaced: _[1] || (_[1] = (R) => p.value = !0),
            onKeydown: S
          }), {
            default: q(() => [ce(C.$slots, "default")]),
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
}), Vg = Wg;
const [jg, Ug] = $t("SelectItemAlignedPosition");
var Kg = /* @__PURE__ */ Z({
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
    const n = t, i = e, { getItems: r } = hn(), s = vn(), o = qr(), a = /* @__PURE__ */ D(!1), l = /* @__PURE__ */ D(!0), c = /* @__PURE__ */ D(), { forwardRef: u, currentElement: d } = Ie(), { viewport: f, selectedItem: p, selectedItemText: h, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && p?.value && h?.value) {
        const S = s.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), T = s.valueElement.value.getBoundingClientRect(), C = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const X = C.left - y.left, re = T.left - X, ue = S.left - re, pe = S.width + ue, pt = Math.max(pe, y.width), b = window.innerWidth - ht, x = ga(re, ht, Math.max(ht, b - pt));
          c.value.style.minWidth = `${pe}px`, c.value.style.left = `${x}px`;
        } else {
          const X = y.right - C.right, re = window.innerWidth - T.right - X, ue = window.innerWidth - S.right - re, pe = S.width + ue, pt = Math.max(pe, y.width), b = window.innerWidth - ht, x = ga(re, ht, Math.max(ht, b - pt));
          c.value.style.minWidth = `${pe}px`, c.value.style.right = `${x}px`;
        }
        const _ = r().map((X) => X.ref), R = window.innerHeight - ht * 2, k = f.value.scrollHeight, A = window.getComputedStyle(d.value), I = Number.parseInt(A.borderTopWidth, 10), P = Number.parseInt(A.paddingTop, 10), H = Number.parseInt(A.borderBottomWidth, 10), L = Number.parseInt(A.paddingBottom, 10), U = I + P + k + L + H, ne = Math.min(p.value.offsetHeight * 5, U), J = window.getComputedStyle(f.value), Q = Number.parseInt(J.paddingTop, 10), we = Number.parseInt(J.paddingBottom, 10), Le = S.top + S.height / 2 - ht, Je = R - Le, Ae = p.value.offsetHeight / 2, Ft = p.value.offsetTop + Ae, Nt = I + P + Ft, Gn = U - Nt;
        if (Nt <= Le) {
          const X = p.value === _[_.length - 1];
          c.value.style.bottom = "0px";
          const re = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ue = Math.max(Je, Ae + (X ? we : 0) + re + H), pe = Nt + ue;
          c.value.style.height = `${pe}px`;
        } else {
          const X = p.value === _[0];
          c.value.style.top = "0px";
          const ue = Math.max(Le, I + f.value.offsetTop + (X ? Q : 0) + Ae) + Gn;
          c.value.style.height = `${ue}px`, f.value.scrollTop = Nt - Le + f.value.offsetTop;
        }
        c.value.style.margin = `${ht}px 0`, c.value.style.minHeight = `${ne}px`, c.value.style.maxHeight = `${R}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const E = /* @__PURE__ */ D("");
    Me(async () => {
      await Oe(), g(), d.value && (E.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(S) {
      S && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return rv(s.triggerElement, () => {
      g();
    }), Ug({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: w
    }), (S, y) => (M(), le("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: Lt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: E.value
      })
    }, [W(v(Re), Ce({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...S.$attrs,
      ...n
    }), {
      default: q(() => [ce(S.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Xg = Kg, Gg = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return rc(t.context), sc(Hg), (n, i) => ce(n.$slots, "default");
  }
}), Yg = Gg;
const Jg = { key: 1 };
var Zg = /* @__PURE__ */ Z({
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
    const n = t, r = cv(n, e), s = vn(), o = /* @__PURE__ */ D();
    Me(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ D(), l = B(() => n.forceMount || s.open.value), c = /* @__PURE__ */ D(l.value);
    return me(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (M(), G(v(ao), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: q(() => [W(Vg, Ws(Rr({
        ...v(r),
        ...u.$attrs
      })), {
        default: q(() => [ce(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (M(), le("div", Jg, [(M(), G(Il, { to: o.value }, [W(Yg, { context: v(s) }, {
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : fe("v-if", !0);
  }
}), Qg = Zg, ey = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), G(v(Re), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: q(() => [ce(e.$slots, "default", {}, () => [n[0] || (n[0] = Ye("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), ty = ey;
const [oc, ny] = $t("SelectItem");
var iy = /* @__PURE__ */ Z({
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
    const n = t, i = e, { disabled: r } = /* @__PURE__ */ Kn(n), s = vn(), o = qr(), { forwardRef: a, currentElement: l } = Ie(), { CollectionItem: c } = hn(), u = B(() => xi(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ D(!1), f = /* @__PURE__ */ D(n.textValue ?? ""), p = wi(void 0, "reka-select-item-text"), h = "select.select";
    async function m(y) {
      if (y.defaultPrevented) return;
      const T = {
        originalEvent: y,
        value: n.value
      };
      Ir(h, g, T);
    }
    async function g(y) {
      await Oe(), i("select", y), !y.defaultPrevented && (r.value || (s.onValueChange(n.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function E(y) {
      await Oe(), !y.defaultPrevented && (r.value ? o.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(y) {
      await Oe(), !y.defaultPrevented && y.currentTarget === ft() && o.onItemLeave?.();
    }
    async function S(y) {
      await Oe(), !(y.defaultPrevented || o.searchRef?.value !== "" && y.key === " ") && (Ig.includes(y.key) && m(y), y.key === " " && y.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return Me(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), ny({
      value: n.value,
      disabled: r,
      textId: p,
      isSelected: u,
      onItemTextChange: (y) => {
        f.value = ((f.value || y?.textContent) ?? "").trim();
      }
    }), (y, T) => (M(), G(v(c), { value: { textValue: f.value } }, {
      default: q(() => [W(v(Re), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(r) || void 0,
        "data-disabled": v(r) ? "" : void 0,
        tabindex: v(r) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: T[0] || (T[0] = (C) => d.value = !0),
        onBlur: T[1] || (T[1] = (C) => d.value = !1),
        onPointerup: m,
        onPointerdown: T[2] || (T[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: T[3] || (T[3] = Tn(() => {
        }, ["prevent", "stop"])),
        onPointermove: E,
        onPointerleave: w,
        onKeydown: S
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
}), ry = iy, sy = /* @__PURE__ */ Z({
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
    return (i, r) => v(n).isSelected.value ? (M(), G(v(Re), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), oy = sy, ay = /* @__PURE__ */ Z({
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
    const e = t, n = vn(), i = qr(), r = oc(), { forwardRef: s, currentElement: o } = Ie(), a = B(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: o.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return Me(() => {
      o.value && (r.onItemTextChange(o.value), i.itemTextRefCallback(o.value, r.value, r.disabled.value), n.onOptionAdd(a.value));
    }), Pn(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (M(), G(v(Re), Ce({
      id: v(r).textId,
      ref: v(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), ly = ay, uy = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), G(v(Hu), Ws(Rr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), cy = uy, dy = /* @__PURE__ */ Z({
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
    const e = t, n = vn(), { forwardRef: i, currentElement: r } = Ie(), s = B(() => n.disabled?.value || e.disabled);
    n.contentId ||= wi(void 0, "reka-select-content"), Me(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: o } = hn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = oo();
    function u() {
      s.value || (n.onOpenChange(!0), c());
    }
    function d(f) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, p) => (M(), G(v(lm), {
      "as-child": "",
      reference: f.reference
    }, {
      default: q(() => [W(v(Re), {
        ref: v(i),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": v(n).contentId,
        "aria-expanded": v(n).open.value || !1,
        "aria-required": v(n).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: v(n)?.dir.value,
        "data-state": v(n)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": v(Lg)(v(n).modelValue?.value) ? "" : void 0,
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
        onPointerup: p[2] || (p[2] = Tn((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (h) => {
          const m = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && m && h.key === " " || (v(l)(h.key, v(o)()), v(Mg).includes(h.key) && (u(), h.preventDefault()));
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
}), fy = dy, py = /* @__PURE__ */ Z({
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
    const e = t, { forwardRef: n, currentElement: i } = Ie(), r = vn();
    Me(() => {
      r.valueElement = i;
    });
    const s = B(() => {
      let a = [];
      const l = Array.from(r.optionsSet.value), c = (u) => l.find((d) => xi(u, d.value, r.by));
      return Array.isArray(r.modelValue.value) ? a = r.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(r.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = B(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (M(), G(v(Re), {
      ref: v(n),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: q(() => [ce(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: v(r).modelValue.value
      }, () => [Ye(ye(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), hy = py, vy = /* @__PURE__ */ Z({
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
    const e = t, { nonce: n } = /* @__PURE__ */ Kn(e), i = Rg(n), r = qr(), s = r.position === "item-aligned" ? jg() : void 0, { forwardRef: o, currentElement: a } = Ie();
    Me(() => {
      r?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ D(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: p } = s ?? {};
      if (f?.value && p?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const m = window.innerHeight - ht * 2, g = Number.parseFloat(p.value.style.minHeight), E = Number.parseFloat(p.value.style.height), w = Math.max(g, E);
          if (w < m) {
            const S = w + h, y = Math.min(m, S), T = S - y;
            p.value.style.height = `${y}px`, p.value.style.bottom === "0px" && (d.scrollTop = T > 0 ? T : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (M(), le(Ee, null, [W(v(Re), Ce({
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
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 16), W(v(Re), {
      as: "style",
      nonce: v(i)
    }, {
      default: q(() => d[0] || (d[0] = [Ye(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), my = vy;
const gy = /* @__PURE__ */ Z({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, i = /* @__PURE__ */ D(), r = /* @__PURE__ */ D([]);
    return Me(() => {
      const s = i.value?.closest(".speaker-sidebar");
      s && (r.value = [s]);
    }), (s, o) => (M(), le("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      W(v(Bg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (a) => n("update:selectedValue", a))
      }, {
        default: q(() => [
          W(v(fy), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: q(() => [
              W(v(hy), { class: "sidebar-select-trigger-label" }),
              W(v(ty), null, {
                default: q(() => [
                  W(v(rp), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          W(v(cy), { disabled: "" }, {
            default: q(() => [
              W(v(Qg), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": r.value
              }, {
                default: q(() => [
                  W(v(my), null, {
                    default: q(() => [
                      (M(!0), le(Ee, null, On(t.items, (a) => (M(), G(v(ry), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: q(() => [
                          W(v(oy), { class: "sidebar-select-item-indicator" }, {
                            default: q(() => [
                              W(v(mu), { size: 14 })
                            ]),
                            _: 1
                          }),
                          W(v(ly), null, {
                            default: q(() => [
                              Ye(ye(a.label), 1)
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
}), yy = { class: "sidebar-select" }, by = ["aria-label"], wy = { class: "sidebar-select-trigger-label" }, _y = /* @__PURE__ */ Z({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = /* @__PURE__ */ D(!1), s = B(
      () => n.items.find((a) => a.value === n.selectedValue)?.label ?? ""
    );
    function o(a) {
      i("update:selectedValue", a), r.value = !1;
    }
    return (a, l) => (M(), le("div", yy, [
      oe("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: l[0] || (l[0] = (c) => r.value = !0)
      }, [
        oe("span", wy, ye(s.value), 1)
      ], 8, by),
      W(v(Lu), {
        open: r.value,
        "onUpdate:open": l[2] || (l[2] = (c) => r.value = c)
      }, {
        default: q(() => [
          W(v(Wu), { disabled: "" }, {
            default: q(() => [
              W(v(qu), { class: "editor-overlay" }),
              W(v(zu), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: q(() => [
                  W(v(Vu), { class: "sr-only" }, {
                    default: q(() => [
                      Ye(ye(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = oe("div", { class: "sheet-handle" }, null, -1)),
                  W(v(_g), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: q(() => [
                      W(v(Sg), { class: "sheet-list" }, {
                        default: q(() => [
                          (M(!0), le(Ee, null, On(t.items, (c) => (M(), G(v(Ag), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: q(() => [
                              W(v(Og), { class: "sheet-item-indicator" }, {
                                default: q(() => [
                                  W(v(mu), { size: 16 })
                                ]),
                                _: 1
                              }),
                              oe("span", null, ye(c.label), 1)
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
    const n = e, { isMobile: i } = Cu();
    return (r, s) => v(i) ? (M(), G(_y, Ce({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), null, 16)) : (M(), G(gy, Ce({ key: 1 }, r.$props, {
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
    const n = t, i = e, { t: r } = Dt(), s = B(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (M(), G(mo, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(r)("header.channelLabel"),
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
}, Ay = { class: "sidebar-title" }, Py = { class: "subtitle-toggle" }, Oy = { class: "subtitle-toggle-label" }, Ry = { class: "subtitle-slider" }, My = { class: "subtitle-slider-label" }, Iy = { class: "subtitle-slider-value" }, Ly = ["value", "disabled"], Dy = {
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
    const e = t, n = fn(), { t: i, locale: r } = Dt(), s = B(
      () => wu(e.translations, r.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (o, a) => (M(), le("aside", xy, [
      t.channels.length > 1 ? (M(), le("section", Sy, [
        oe("h2", Cy, ye(v(i)("sidebar.channel")), 1),
        W(ac, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : fe("", !0),
      t.translations.length > 1 ? (M(), le("section", Ey, [
        oe("h2", Ty, ye(v(i)("sidebar.translation")), 1),
        W(mo, {
          items: s.value,
          "selected-value": t.selectedTranslationId,
          ariaLabel: v(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : fe("", !0),
      v(n).subtitle ? (M(), le("section", ky, [
        oe("h2", Ay, ye(v(i)("sidebar.subtitle")), 1),
        oe("div", Py, [
          oe("span", Oy, ye(v(i)("subtitle.show")), 1),
          W(zh, {
            modelValue: v(n).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => v(n).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        oe("label", Ry, [
          oe("span", My, [
            Ye(ye(v(i)("subtitle.fontSize")) + " ", 1),
            oe("span", Iy, ye(v(n).subtitle.fontSize.value) + "px", 1)
          ]),
          oe("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(n).subtitle.fontSize.value,
            disabled: !v(n).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => v(n).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Ly)
        ])
      ])) : fe("", !0),
      t.speakers.length ? (M(), le("section", Dy, [
        oe("h2", $y, ye(v(i)("sidebar.speakers")), 1),
        oe("ul", By, [
          (M(!0), le(Ee, null, On(t.speakers, (l) => (M(), le("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            W(xu, {
              color: l.color
            }, null, 8, ["color"]),
            oe("span", Fy, ye(l.name), 1)
          ]))), 128))
        ])
      ])) : fe("", !0)
    ]));
  }
}), zy = ".speaker-sidebar[data-v-6e6fa62e]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-6e6fa62e]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-6e6fa62e]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-6e6fa62e]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-6e6fa62e]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-6e6fa62e]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-6e6fa62e]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-6e6fa62e]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-6e6fa62e]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-6e6fa62e]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-6e6fa62e]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-6e6fa62e]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-6e6fa62e]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-6e6fa62e]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-6e6fa62e]{border-left:none}.sidebar-section--selector[data-v-6e6fa62e]{display:none}}", Ba = /* @__PURE__ */ We(Ny, [["styles", [zy]], ["__scopeId", "data-v-6e6fa62e"]]), qy = /* @__PURE__ */ Z({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = Fd(t, "open"), { t: n } = Dt();
    return (i, r) => (M(), G(v(Lu), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (s) => e.value = s)
    }, {
      default: q(() => [
        W(v(Wu), { disabled: "" }, {
          default: q(() => [
            W(v(qu), { class: "editor-overlay" }),
            W(v(zu), { class: "sidebar-drawer" }, {
              default: q(() => [
                W(v(Vu), { class: "sr-only" }, {
                  default: q(() => [
                    Ye(ye(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                W(v(Ev), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: q(() => [
                    W(v(gu), { size: 20 })
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
}), Hy = { class: "player-controls" }, Wy = { class: "controls-left" }, Vy = { class: "controls-time" }, jy = { class: "time-display" }, Uy = { class: "time-display" }, Ky = { class: "controls-right" }, Xy = ["value", "aria-label", "disabled"], Gy = /* @__PURE__ */ Z({
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
    const n = e, { t: i } = Dt(), r = /* @__PURE__ */ D(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (M(), le("div", Hy, [
      oe("div", Wy, [
        W(At, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, {
          icon: q(() => [
            W(v(lp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        W(At, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": t.isPlaying ? v(i)("player.pause") : v(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, {
          icon: q(() => [
            t.isPlaying ? (M(), G(v(sp), {
              key: 0,
              size: 20
            })) : (M(), G(v(op), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        W(At, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, {
          icon: q(() => [
            W(v(up), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      oe("div", Vy, [
        oe("time", jy, ye(t.currentTime), 1),
        a[7] || (a[7] = oe("span", { class: "time-separator" }, "/", -1)),
        oe("time", Uy, ye(t.duration), 1)
      ]),
      oe("div", Ky, [
        oe("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          W(At, {
            variant: "ghost",
            size: "md",
            "aria-label": t.isMuted ? v(i)("player.unmute") : v(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, {
            icon: q(() => [
              t.isMuted ? (M(), G(v(fp), {
                key: 0,
                size: 16
              })) : (M(), G(v(dp), {
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
            "aria-label": v(i)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, Xy), [
            [Af, r.value]
          ])
        ], 32),
        W(At, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: q(() => [
            Ye(ye(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Yy = ".player-controls[data-v-89b8138f]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-89b8138f]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-89b8138f]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-89b8138f]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-89b8138f]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-89b8138f]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-89b8138f]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-89b8138f]:disabled{opacity:.5;cursor:default}.play-button[data-v-89b8138f]{width:40px;height:40px}.speed-button[data-v-89b8138f]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-89b8138f],.volume-slider[data-v-89b8138f]{display:none}.player-controls[data-v-89b8138f]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Jy = /* @__PURE__ */ We(Gy, [["styles", [Yy]], ["__scopeId", "data-v-89b8138f"]]);
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
let Ri = class {
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
const zi = { decode: function(t, e) {
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
function Fa(t, e, n) {
  const i = lc(t, e || {});
  return n?.appendChild(i), i;
}
var Zy = Object.freeze({ __proto__: null, createElement: Fa, default: Fa });
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
function Pe(t) {
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
  const n = Pe(t());
  return e.forEach(((i) => i.subscribe((() => {
    const r = t();
    Object.is(n.value, r) || n.set(r);
  })))), { get value() {
    return n.value;
  }, subscribe: (i) => n.subscribe(i) };
}
function an(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
class eb extends Ri {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Pe(!1), this._currentTime = Pe(0), this._duration = Pe(0), this._volume = Pe(this.media.volume), this._muted = Pe(this.media.muted), this._playbackRate = Pe(this.media.playbackRate || 1), this._seeking = Pe(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
function Na(t, e, n) {
  const i = e - t.left, r = n - t.top;
  return [i / t.width, r / t.height];
}
function uc(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function za(t, e) {
  if (!uc(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function qa({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, r = Math.floor(i * n);
  return [r - 1, r, r + 1];
}
function cc(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function ib(t) {
  const e = Pe({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Sn((() => (function(s) {
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
class rb extends Ri {
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
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Na(i, n.clientX, n.clientY);
      this.emit("click", r, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Na(i, n.clientX, n.clientY);
      this.emit("dblclick", r, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = ib(this.scrollContainer);
    const e = an((() => {
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
      const { threshold: r = 3, mouseButton: s = 0, touchDelay: o = 100 } = i, a = Pe(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let p = f.clientX, h = f.clientY, m = !1;
        const g = Date.now(), E = n.getBoundingClientRect(), { left: w, top: S } = E, y = (k) => {
          if (k.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const A = k.clientX, I = k.clientY, P = A - p, H = I - h;
          (m || Math.abs(P) > r || Math.abs(H) > r) && (k.preventDefault(), k.stopPropagation(), m || (a.set({ type: "start", x: p - w, y: h - S }), m = !0), a.set({ type: "move", x: A - w, y: I - S, deltaX: P, deltaY: H }), p = A, h = I);
        }, T = (k) => {
          if (l.delete(k.pointerId), m) {
            const A = k.clientX, I = k.clientY;
            a.set({ type: "end", x: A - w, y: I - S });
          }
          u();
        }, C = (k) => {
          l.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || T(k);
        }, _ = (k) => {
          m && (k.stopPropagation(), k.preventDefault());
        }, R = (k) => {
          k.defaultPrevented || l.size > 1 || m && k.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", T), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", R, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", T), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", R), setTimeout((() => {
            document.removeEventListener("click", _, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), cc(a);
      } };
    })(this.wrapper);
    const e = an((() => {
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
    const { width: s, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: h, height: m, length: g, options: E, pixelRatio: w }) {
      const S = m / 2, y = E.barWidth ? E.barWidth * w : 1, T = E.barGap ? E.barGap * w : E.barWidth ? y / 2 : 0, C = y + T || 1;
      return { halfHeight: S, barWidth: y, barGap: T, barRadius: E.barRadius || 0, barMinHeight: E.barMinHeight ? E.barMinHeight * w : 0, barIndexScale: g > 0 ? h / C / g : 0, barSpacing: C };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: h, barIndexScale: m, barSpacing: g, barWidth: E, halfHeight: w, vScale: S, canvasHeight: y, barAlign: T, barMinHeight: C }) {
      const _ = h[0] || [], R = h[1] || _, k = _.length, A = [];
      let I = 0, P = 0, H = 0;
      for (let L = 0; L <= k; L++) {
        const U = Math.round(L * m);
        if (U > I) {
          const { topHeight: Q, totalHeight: we } = tb({ maxTop: P, maxBottom: H, halfHeight: w, vScale: S, barMinHeight: C, barAlign: T }), Le = nb({ barAlign: T, halfHeight: w, topHeight: Q, totalHeight: we, canvasHeight: y });
          A.push({ x: I * g, y: Le, width: E, height: we }), I = U, P = 0, H = 0;
        }
        const ne = Math.abs(_[L] || 0), J = Math.abs(R[L] || 0);
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
      return [p, l[1] || p].map(((h, m) => {
        const g = h.length, E = g ? c / g : 0, w = f, S = m === 0 ? -1 : 1, y = [{ x: 0, y: w }];
        let T = 0, C = 0;
        for (let _ = 0; _ <= g; _++) {
          const R = Math.round(_ * E);
          if (R > T) {
            const A = w + (Math.round(C * f * d) || 1) * S;
            y.push({ x: T, y: A }), T = R, C = 0;
          }
          const k = Math.abs(h[_] || 0);
          k > C && (C = k);
        }
        return y.push({ x: T, y: w }), y;
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
        const h = (c = d[p]) !== null && c !== void 0 ? c : 0, m = Math.abs(h);
        m > f && (f = m);
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
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = i / a, u = (function({ clientWidth: h, totalWidth: m, options: g }) {
      return za(Math.min(8e3, h, m), g);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const f = (h) => {
      if (h < 0 || h >= p || d[h]) return;
      d[h] = !0;
      const m = h * u;
      let g = Math.min(c - m, u);
      if (g = za(g, n), g <= 0) return;
      const E = (function({ channelData: w, offset: S, clampedWidth: y, totalWidth: T }) {
        return w.map(((C) => {
          const _ = Math.floor(S / T * C.length), R = Math.floor((S + y) / T * C.length);
          return C.slice(_, R);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(E, n, g, r, m, s, o);
    }, p = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < p; h++) f(h);
      return;
    }
    if (qa({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: p }).forEach(((h) => f(h))), p > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), qa({ scrollLeft: m, totalWidth: c, numCanvases: p }).forEach(((g) => f(g)));
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
        const h = Math.ceil(c * u), m = h > d, g = !!(f && !m);
        return { scrollWidth: h, isScrollable: m, useParentWidth: g, width: (g ? d : h) * p };
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
class sb extends Ri {
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
class cs extends Ri {
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
class Si extends eb {
  static create(e) {
    return new Si(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new cs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, ob, e);
    const { state: i, actions: r } = (function(a) {
      var l, c, u, d, f, p;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Pe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : Pe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : Pe(!1), E = (d = a?.isSeeking) !== null && d !== void 0 ? d : Pe(!1), w = (f = a?.volume) !== null && f !== void 0 ? f : Pe(1), S = (p = a?.playbackRate) !== null && p !== void 0 ? p : Pe(1), y = Pe(null), T = Pe(null), C = Pe(""), _ = Pe(0), R = Pe(0), k = Sn((() => !g.value), [g]), A = Sn((() => y.value !== null), [y]), I = Sn((() => A.value && m.value > 0), [A, m]), P = Sn((() => h.value), [h]), H = Sn((() => m.value > 0 ? h.value / m.value : 0), [h, m]);
      return { state: { currentTime: h, duration: m, isPlaying: g, isPaused: k, isSeeking: E, volume: w, playbackRate: S, audioBuffer: y, peaks: T, url: C, zoom: _, scrollPosition: R, canPlay: A, isReady: I, progress: P, progressPercent: H }, actions: { setCurrentTime: (L) => {
        const U = Math.max(0, Math.min(m.value || 1 / 0, L));
        h.set(U);
      }, setDuration: (L) => {
        m.set(Math.max(0, L));
      }, setPlaying: (L) => {
        g.set(L);
      }, setSeeking: (L) => {
        E.set(L);
      }, setVolume: (L) => {
        const U = Math.max(0, Math.min(1, L));
        w.set(U);
      }, setPlaybackRate: (L) => {
        const U = Math.max(0.1, Math.min(16, L));
        S.set(U);
      }, setAudioBuffer: (L) => {
        y.set(L), L && m.set(L.duration);
      }, setPeaks: (L) => {
        T.set(L);
      }, setUrl: (L) => {
        C.set(L);
      }, setZoom: (L) => {
        _.set(Math.max(0, L));
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
      i.push(an((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(an((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(an((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(an((() => {
        e.isReady.value && !r && (r = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(an((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && n.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(an((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = zi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = zi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
        a instanceof cs && (a.duration = o);
      }
      if (i) this.decodedData = zi.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield zi.decode(a, this.options.sampleRate);
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
      return n != null && (this.media instanceof cs ? this.media.stopAt(n) : this.stopAtPosition = n), r;
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
Si.BasePlugin = class extends Ri {
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
}, Si.dom = Zy;
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
function Xi(t, e) {
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
function _n(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Gi(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, s = pc(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== i || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, p = !1;
    const h = Date.now(), m = t.getBoundingClientRect(), { left: g, top: E } = m, w = (_) => {
      if (_.defaultPrevented || o.size > 1 || a && Date.now() - h < r) return;
      const R = _.clientX, k = _.clientY, A = R - d, I = k - f;
      (p || Math.abs(A) > n || Math.abs(I) > n) && (_.preventDefault(), _.stopPropagation(), p || (s.set({ type: "start", x: d - g, y: f - E }), p = !0), s.set({ type: "move", x: R - g, y: k - E, deltaX: A, deltaY: I }), d = R, f = k);
    }, S = (_) => {
      if (o.delete(_.pointerId), p) {
        const R = _.clientX, k = _.clientY;
        s.set({ type: "end", x: R - g, y: k - E });
      }
      l();
    }, y = (_) => {
      o.delete(_.pointerId), _.relatedTarget && _.relatedTarget !== document.documentElement || S(_);
    }, T = (_) => {
      p && (_.stopPropagation(), _.preventDefault());
    }, C = (_) => {
      _.defaultPrevented || o.size > 1 || p && _.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", S), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", T, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", T, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), o.clear(), _n(s);
  } };
}
class Ha extends dc {
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ii("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = ii("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Gi(i, { threshold: 1 }), o = Gi(r, { threshold: 1 }), a = Xi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Xi((() => {
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
      l(), c(), u(), d(), f(), p(), _n(n), _n(i), _n(r), _n(s), _n(o), _n(a);
    }));
    const h = Gi(e), m = Xi((() => {
      const g = h.signal.value;
      g && (g.type === "start" ? this.toggleCursor(!0) : g.type === "move" && g.deltaX !== void 0 ? this.onMove(g.deltaX) : g.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      m(), h.cleanup();
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
class go extends ab {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new go(e);
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
    const r = this.wavesurfer.getDuration(), s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Ha(e, r, s);
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
    const l = Gi(r, { threshold: n }), c = Xi((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * p;
        const g = f.x / m * p, E = (f.x + 5) / m * p;
        s = new Ha(Object.assign(Object.assign({}, e), { start: g, end: E }), p, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const ds = [0.5, 0.75, 1, 1.25, 1.5, 2];
function lb(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: r } = t, s = /* @__PURE__ */ kn(null), o = /* @__PURE__ */ kn(null), a = /* @__PURE__ */ D(0), l = /* @__PURE__ */ D(0), c = /* @__PURE__ */ D(!1), u = /* @__PURE__ */ D(!1), d = /* @__PURE__ */ D(!1), f = /* @__PURE__ */ D(1), p = /* @__PURE__ */ D(1), h = /* @__PURE__ */ D(!1), m = B(() => ar(a.value)), g = B(() => ar(l.value));
  function E(L, U) {
    P(), d.value = !0, u.value = !1;
    const ne = go.create();
    o.value = ne;
    const J = Si.create({
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
      renderFunction: Ep,
      url: U,
      plugins: [ne]
    });
    J.on("ready", () => {
      u.value = !0, d.value = !1, l.value = J.getDuration(), w();
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
  function w() {
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
          color: xp(J, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", J);
      }
    }
  }
  function S() {
    s.value?.play();
  }
  function y() {
    s.value?.pause();
  }
  function T() {
    s.value?.playPause();
  }
  function C(L) {
    const U = s.value;
    !U || l.value === 0 || U.setTime(L);
  }
  function _(L) {
    C(Math.max(0, Math.min(a.value + L, l.value)));
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
    const U = (ds.indexOf(
      p.value
    ) + 1) % ds.length;
    A(ds[U] ?? 1);
  }
  function P() {
    H !== null && (clearTimeout(H), H = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  me(
    [e, n],
    ([L, U]) => {
      L && U && E(L, U);
    },
    { immediate: !0 }
  );
  let H = null;
  return me([i, r], () => {
    u.value && (H !== null && clearTimeout(H), H = setTimeout(() => {
      H = null, w();
    }, 150));
  }), en(() => {
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
    play: S,
    pause: y,
    togglePlay: T,
    seekTo: C,
    skip: _,
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
    const i = t, r = n, s = /* @__PURE__ */ D(null), {
      isPlaying: o,
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
      pause: E,
      skip: w,
      setVolume: S,
      cyclePlaybackRate: y,
      toggleMute: T
    } = lb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ Hi(() => i.audioSrc),
      turns: /* @__PURE__ */ Hi(() => i.turns),
      speakers: /* @__PURE__ */ Hi(() => i.speakers)
    });
    return me(f, (C) => r("timeupdate", C)), me(o, (C) => r("playStateChange", C)), e({ seekTo: g, pause: E }), (C, _) => (M(), le("footer", ub, [
      oe("div", {
        ref_key: "waveformRef",
        ref: s,
        class: un(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      W(Jy, {
        "is-playing": v(o),
        "current-time": v(p),
        duration: v(h),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: _[0] || (_[0] = (R) => v(w)(-10)),
        onSkipForward: _[1] || (_[1] = (R) => v(w)(10)),
        "onUpdate:volume": v(S),
        onToggleMute: v(T),
        onCyclePlaybackRate: v(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), db = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", fb = /* @__PURE__ */ We(cb, [["styles", [db]], ["__scopeId", "data-v-9248e45e"]]);
class pb {
  diff(e, n, i = {}) {
    let r;
    typeof i == "function" ? (r = i, i = {}) : "callback" in i && (r = i.callback);
    const s = this.castInput(e, i), o = this.castInput(n, i), a = this.removeEmpty(this.tokenize(s, i)), l = this.removeEmpty(this.tokenize(o, i));
    return this.diffWithOptionsObj(a, l, i, r);
  }
  diffWithOptionsObj(e, n, i, r) {
    var s;
    const o = (w) => {
      if (w = this.postProcess(w, i), r) {
        setTimeout(function() {
          r(w);
        }, 0);
        return;
      } else
        return w;
    }, a = n.length, l = e.length;
    let c = 1, u = a + l;
    i.maxEditLength != null && (u = Math.min(u, i.maxEditLength));
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(p[0], n, e, 0, i);
    if (p[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, n, e));
    let m = -1 / 0, g = 1 / 0;
    const E = () => {
      for (let w = Math.max(m, -c); w <= Math.min(g, c); w += 2) {
        let S;
        const y = p[w - 1], T = p[w + 1];
        y && (p[w - 1] = void 0);
        let C = !1;
        if (T) {
          const R = T.oldPos - w;
          C = T && 0 <= R && R < a;
        }
        const _ = y && y.oldPos + 1 < l;
        if (!C && !_) {
          p[w] = void 0;
          continue;
        }
        if (!_ || C && y.oldPos < T.oldPos ? S = this.addToPath(T, !0, !1, 0, i) : S = this.addToPath(y, !1, !0, 1, i), h = this.extractCommon(S, n, e, w, i), S.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(S.lastComponent, n, e)) || !0;
        p[w] = S, S.oldPos + 1 >= l && (g = Math.min(g, w - 1)), h + 1 >= a && (m = Math.max(m, w + 1));
      }
      c++;
    };
    if (r)
      (function w() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return r(void 0);
          E() || w();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const w = E();
        if (w)
          return w;
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
const vb = new hb();
function mb(t, e, n) {
  return vb.diff(t, e, n);
}
function fs({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const r = t.split(" "), s = n.split(" "), o = mb(r, s, {
    comparator: yb
  }), a = gb(o), l = [...e];
  let c = [...e], u = 0;
  for (const p of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in p && p.replaced)
      c = Yi(
        c,
        l[0],
        p.countAdded - p.countRemoved
      ), u += p.countRemoved;
    else if ("removed" in p && p.removed) {
      const h = p;
      u += h.count, c = Yi(
        c,
        l[0],
        -h.count
      );
    } else if ("added" in p && p.added) {
      const h = p;
      c = Yi(
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
      (m) => m + d
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
function Yi(t, e, n) {
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
    Yi(
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
class wb extends bb {
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
    this.resetAll(), this.currentState = fs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = fs(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = fs(
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
function vc(t) {
  const e = fn();
  let n = null;
  Me(() => {
    t.canvasRef.value && (n = new wb(t.canvasRef.value, {
      fontSize: t.fontSize,
      lineHeight: t.lineHeight
    }));
  }), me(
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
  Pn(() => {
    i(), s(), o(), a(), n?.dispose(), n = null;
  });
}
const _b = ["height"], xb = /* @__PURE__ */ Z({
  __name: "SubtitleBanner",
  setup(t) {
    const e = fn(), n = mi("canvas"), i = B(() => e.subtitle?.fontSize.value ?? 40), r = B(() => 1.2 * i.value), s = B(() => 2.4 * i.value);
    return vc({
      canvasRef: n,
      fontSize: i.value,
      lineHeight: r.value
    }), (o, a) => (M(), le("div", {
      class: "subtitle-banner",
      style: Lt({ height: s.value + "px" })
    }, [
      oe("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, _b)
    ], 4));
  }
}), Sb = ".subtitle-banner[data-v-69ab661c]{flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-69ab661c]{display:block;width:100%;height:100%}", Cb = /* @__PURE__ */ We(xb, [["styles", [Sb]], ["__scopeId", "data-v-69ab661c"]]), Eb = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Tb = ["aria-label"], kb = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Wa = 48, Ab = /* @__PURE__ */ Z({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = fn(), { t: n } = Dt(), i = mi("container"), r = mi("canvas");
    vc({
      canvasRef: r,
      fontSize: Wa,
      lineHeight: 1.2 * Wa
    }), Me(async () => {
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
    Me(() => {
      document.addEventListener("fullscreenchange", s);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Pn(() => {
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
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        W(v(gu), { size: 24 })
      ], 8, Tb),
      oe("canvas", kb, null, 512)
    ], 512));
  }
}), Pb = ".subtitle-fullscreen[data-v-dde0e356]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-dde0e356]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-dde0e356]:hover,.subtitle-fullscreen__close[data-v-dde0e356]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-dde0e356]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-dde0e356]{transition:none}}", Ob = /* @__PURE__ */ We(Ab, [["styles", [Pb]], ["__scopeId", "data-v-dde0e356"]]), Rb = { class: "editor-layout" }, Mb = { class: "editor-body" }, Ib = {
  key: 4,
  class: "mobile-selectors"
}, Lb = /* @__PURE__ */ Z({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = fn(), { t: i, locale: r } = Dt(), { isMobile: s } = Cu(), o = /* @__PURE__ */ D(!1), a = B(
      () => n.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), l = n.speakers.all, c = B(() => [...n.channels.values()]), u = B(
      () => n.activeChannel.value ? [...n.activeChannel.value.translations.values()] : []
    ), d = B(
      () => n.activeChannel.value?.activeTranslation.value.id ?? ""
    ), f = B(() => Array.from(l.values())), p = mi("audioPlayer");
    function h(w) {
      n.audio && (n.audio.currentTime.value = w);
    }
    me(
      () => n.activeChannelId.value,
      () => {
        p.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), o.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((w) => p.value?.seekTo(w));
    const m = B(
      () => wu(
        u.value,
        r.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function g(w) {
      n.setActiveChannel(w);
    }
    function E(w) {
      n.activeChannel.value?.setActiveTranslation(w);
    }
    return (w, S) => (M(), le("div", Rb, [
      e.showHeader ? (M(), G(Dp, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value?.duration ?? 0,
        language: d.value,
        "is-mobile": v(s),
        onToggleSidebar: S[0] || (S[0] = (y) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : fe("", !0),
      oe("main", Mb, [
        W(Lh, {
          turns: a.value,
          speakers: v(l)
        }, null, 8, ["turns", "speakers"]),
        v(s) ? fe("", !0) : (M(), G(Ba, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": E
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(s) ? (M(), G(qy, {
          key: 1,
          open: o.value,
          "onUpdate:open": S[1] || (S[1] = (y) => o.value = y)
        }, {
          default: q(() => [
            W(Ba, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": E
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : fe("", !0)
      ]),
      v(n).audio?.src.value ? (M(), G(fb, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: a.value,
        speakers: v(l),
        onTimeupdate: h,
        onPlayStateChange: S[2] || (S[2] = (y) => {
          v(n).audio && (v(n).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : fe("", !0),
      v(n).subtitle?.isVisible.value && !v(s) && !v(n).subtitle.isFullscreen.value ? (M(), G(Cb, { key: 2 })) : fe("", !0),
      v(n).subtitle?.isFullscreen.value ? (M(), G(Ob, { key: 3 })) : fe("", !0),
      v(s) && (c.value.length > 1 || u.value.length > 1) ? (M(), le("div", Ib, [
        c.value.length > 1 ? (M(), G(ac, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : fe("", !0),
        u.value.length > 1 ? (M(), G(mo, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: v(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": E
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : fe("", !0)
      ])) : fe("", !0)
    ]));
  }
}), Db = ".editor-layout[data-v-8dfbbd79]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-8dfbbd79]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-8dfbbd79]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-8dfbbd79]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-8dfbbd79]{grid-template-columns:1fr}}", $b = /* @__PURE__ */ We(Lb, [["styles", [Db]], ["__scopeId", "data-v-8dfbbd79"]]);
function Bb() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ D(0), n = /* @__PURE__ */ D(!1), i = /* @__PURE__ */ D(null), r = /* @__PURE__ */ D(null);
      let s = null;
      const o = B(
        () => t.activeChannel.value?.activeTranslation.value.audio?.src ?? null
      ), a = nt(() => {
        if (!n.value) return;
        const d = e.value, f = t.activeChannel.value?.activeTranslation.value;
        if (f) {
          for (const p of f.turns.value)
            if (p.startTime != null && p.endTime != null && d >= p.startTime && d <= p.endTime) {
              r.value = p.id, i.value = no(p.words) ? _u(p.words, d) : null;
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
        isPlaying: n,
        src: o,
        activeWordId: i,
        activeTurnId: r,
        seekTo: l,
        setSeekHandler: c
      };
      return t.audio = u, () => {
        a(), t.audio = void 0;
      };
    }
  };
}
const Fb = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', Nb = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}', zb = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}", qb = ".sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow-y:auto;max-height:var(--reka-select-content-available-height);padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}";
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
function ps(t, e) {
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
      const e = /* @__PURE__ */ kn(null), n = /* @__PURE__ */ D(!1);
      n.value = !0;
      function i() {
        e.value = null, Eo(e);
      }
      function r(S, y) {
        if (t.activeChannelId.value !== y) return;
        const T = t.activeChannel.value;
        if (!T) return;
        const C = T.activeTranslation.value;
        if (C.isSource) {
          if (S.text == null) return;
          e.value = S.text;
        } else if (S.translations) {
          const _ = S.translations.find(
            (R) => R.translationId === C.id
          );
          e.value = _?.text ?? null;
        } else
          return;
        Eo(e);
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
      function l(S, y) {
        S.turns.value.some((C) => C.id === y.id) ? S.updateTurn(y.id, y) : S.addTurn(y);
      }
      function c(S, y) {
        S.speakerId && t.speakers.ensure(S.speakerId);
        const T = t.channels.get(y);
        if (!T) {
          f();
          return;
        }
        if (S.text != null && l(
          T.sourceTranslation,
          Va(S)
        ), S.translations)
          for (const C of S.translations) {
            const _ = T.translations.get(C.translationId);
            _ && l(
              _,
              ps(S, C)
            );
          }
        f();
      }
      function u(S, y) {
        d([S], y);
      }
      function d(S, y) {
        const T = t.channels.get(y);
        if (!T) return;
        const C = /* @__PURE__ */ new Set();
        for (const k of S)
          k.speakerId && !C.has(k.speakerId) && (C.add(k.speakerId), t.speakers.ensure(k.speakerId));
        const _ = [];
        for (const k of S)
          k.text != null && _.push(Va(k));
        _.length > 0 && T.sourceTranslation.prependTurns(_);
        const R = /* @__PURE__ */ new Map();
        for (const k of S)
          if (k.translations)
            for (const A of k.translations) {
              let I = R.get(A.translationId);
              I || (I = [], R.set(A.translationId, I)), I.push(ps(k, A));
            }
        for (const [k, A] of R) {
          const I = T.translations.get(k);
          I && I.prependTurns(A);
        }
      }
      function f() {
        a(), i();
      }
      function p(S) {
        const y = t.activeChannel.value;
        if (!y) return;
        const T = y.activeTranslation.value;
        if (!S.final && T.languages.includes(S.language))
          e.value = S.text;
        else if (S.final) {
          const C = y.translations.get(S.language);
          C && l(
            C,
            ps({ ...S }, S)
          );
        }
      }
      const h = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: r,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: p
      }, m = t.on(
        "channel:change",
        f
      ), g = t.on(
        "translation:change",
        f
      ), E = t.on(
        "translation:sync",
        o
      ), w = t.on("channel:sync", o);
      return t.live = h, () => {
        f(), m(), g(), E(), w(), t.live = void 0;
      };
    }
  };
}
function Kb(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ D(t.fontSize ?? 40), i = /* @__PURE__ */ D(!0), r = /* @__PURE__ */ D(!1), s = {
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
const Hb = /* @__PURE__ */ Wf({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: !1 }
  },
  styles: [Nb, zb, qb],
  setup(t, { expose: e }) {
    const n = /* @__PURE__ */ D(t.locale);
    _p(n), me(() => t.locale, (r) => {
      n.value = r;
    });
    const i = lh();
    return i.use(Bb()), uh(i), e({ core: i }), () => i.channels.size ? dt($b, { showHeader: !t.noHeader }) : null;
  }
});
function Wb() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = Fb, document.head.appendChild(e);
}
function Xb(t = "linto-editor") {
  Wb(), customElements.define(t, Hb);
}
export {
  Hb as LintoEditor,
  Bb as createAudioPlugin,
  Ub as createLivePlugin,
  Kb as createSubtitlePlugin,
  Xb as register
};
