// @__NO_SIDE_EFFECTS__
function Ns(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const me = {}, Fn = [], Mt = () => {
}, Ka = () => !1, hr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), qs = (t) => t.startsWith("onUpdate:"), ke = Object.assign, Hs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, bc = Object.prototype.hasOwnProperty, ge = (t, e) => bc.call(t, e), te = Array.isArray, zn = (t) => Ti(t) === "[object Map]", Xa = (t) => Ti(t) === "[object Set]", xo = (t) => Ti(t) === "[object Date]", ae = (t) => typeof t == "function", Te = (t) => typeof t == "string", yt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", Ga = (t) => (be(t) || ae(t)) && ae(t.then) && ae(t.catch), Ya = Object.prototype.toString, Ti = (t) => Ya.call(t), wc = (t) => Ti(t).slice(8, -1), vr = (t) => Ti(t) === "[object Object]", mr = (t) => Te(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, si = /* @__PURE__ */ Ns(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), gr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, _c = /-\w/g, $e = gr(
  (t) => t.replace(_c, (e) => e.slice(1).toUpperCase())
), xc = /\B([A-Z])/g, nt = gr(
  (t) => t.replace(xc, "-$1").toLowerCase()
), yr = gr((t) => t.charAt(0).toUpperCase() + t.slice(1)), Hi = gr(
  (t) => t ? `on${yr(t)}` : ""
), Ue = (t, e) => !Object.is(t, e), Hr = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Ja = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, Sc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, hs = (t) => {
  const e = Te(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let So;
const br = () => So || (So = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Dt(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = Te(i) ? kc(i) : Dt(i);
      if (r)
        for (const s in r)
          e[s] = r[s];
    }
    return e;
  } else if (Te(t) || be(t))
    return t;
}
const Cc = /;(?![^(]*\))/g, Ec = /:([^]+)/, Tc = /\/\*[^]*?\*\//g;
function kc(t) {
  const e = {};
  return t.replace(Tc, "").split(Cc).forEach((n) => {
    if (n) {
      const i = n.split(Ec);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function Xt(t) {
  let e = "";
  if (Te(t))
    e = t;
  else if (te(t))
    for (let n = 0; n < t.length; n++) {
      const i = Xt(t[n]);
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
  return e && !Te(e) && (t.class = Xt(e)), n && (t.style = Dt(n)), t;
}
const Ac = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Pc = /* @__PURE__ */ Ns(Ac);
function Za(t) {
  return !!t || t === "";
}
function Oc(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = js(t[i], e[i]);
  return n;
}
function js(t, e) {
  if (t === e) return !0;
  let n = xo(t), i = xo(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = yt(t), i = yt(e), n || i)
    return t === e;
  if (n = te(t), i = te(e), n || i)
    return n && i ? Oc(t, e) : !1;
  if (n = be(t), i = be(e), n || i) {
    if (!n || !i)
      return !1;
    const r = Object.keys(t).length, s = Object.keys(e).length;
    if (r !== s)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !js(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const Qa = (t) => !!(t && t.__v_isRef === !0), de = (t) => Te(t) ? t : t == null ? "" : te(t) || be(t) && (t.toString === Ya || !ae(t.toString)) ? Qa(t) ? de(t.value) : JSON.stringify(t, el, 2) : String(t), el = (t, e) => Qa(e) ? el(t, e.value) : zn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, r], s) => (n[Wr(i, s) + " =>"] = r, n),
    {}
  )
} : Xa(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Wr(n))
} : yt(e) ? Wr(e) : be(e) && !te(e) && !vr(e) ? String(e) : e, Wr = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    yt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let He;
class tl {
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
function nl(t) {
  return new tl(t);
}
function Vs() {
  return He;
}
function il(t, e = !1) {
  He && He.cleanups.push(t);
}
let Se;
const jr = /* @__PURE__ */ new WeakSet();
class rl {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, He && He.active && He.effects.push(this);
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ol(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Co(this), al(this);
    const e = Se, n = mt;
    Se = this, mt = !0;
    try {
      return this.fn();
    } finally {
      ll(this), Se = e, mt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Xs(e);
      this.deps = this.depsTail = void 0, Co(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? jr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let sl = 0, oi, ai;
function ol(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = ai, ai = t;
    return;
  }
  t.next = oi, oi = t;
}
function Us() {
  sl++;
}
function Ks() {
  if (--sl > 0)
    return;
  if (ai) {
    let e = ai;
    for (ai = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; oi; ) {
    let e = oi;
    for (oi = void 0; e; ) {
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
function al(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function ll(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const r = i.prevDep;
    i.version === -1 ? (i === n && (n = r), Xs(i), Mc(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  t.deps = e, t.depsTail = n;
}
function vs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (ul(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function ul(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === pi) || (t.globalVersion = pi, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !vs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Se, i = mt;
  Se = t, mt = !0;
  try {
    al(t);
    const r = t.fn(t._value);
    (e.version === 0 || Ue(r, t._value)) && (t.flags |= 128, t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    Se = n, mt = i, ll(t), t.flags &= -3;
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
function Mc(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let mt = !0;
const cl = [];
function Gt() {
  cl.push(mt), mt = !1;
}
function Yt() {
  const t = cl.pop();
  mt = t === void 0 ? !0 : t;
}
function Co(t) {
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
let pi = 0;
class Rc {
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
    if (!Se || !mt || Se === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Se)
      n = this.activeLink = new Rc(Se, this), Se.deps ? (n.prevDep = Se.depsTail, Se.depsTail.nextDep = n, Se.depsTail = n) : Se.deps = Se.depsTail = n, dl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = Se.depsTail, n.nextDep = void 0, Se.depsTail.nextDep = n, Se.depsTail = n, Se.deps === n && (Se.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, pi++, this.notify(e);
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
function dl(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        dl(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const Zi = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ Symbol(
  ""
), ms = /* @__PURE__ */ Symbol(
  ""
), hi = /* @__PURE__ */ Symbol(
  ""
);
function We(t, e, n) {
  if (mt && Se) {
    let i = Zi.get(t);
    i || Zi.set(t, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new wr()), r.map = i, r.key = n), r.track();
  }
}
function Vt(t, e, n, i, r, s) {
  const o = Zi.get(t);
  if (!o) {
    pi++;
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
      o.forEach((d, p) => {
        (p === "length" || p === hi || !yt(p) && p >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), c && a(o.get(hi)), e) {
        case "add":
          l ? c && a(o.get("length")) : (a(o.get(Cn)), zn(t) && a(o.get(ms)));
          break;
        case "delete":
          l || (a(o.get(Cn)), zn(t) && a(o.get(ms)));
          break;
        case "set":
          zn(t) && a(o.get(Cn));
          break;
      }
  }
  Ks();
}
function Ic(t, e) {
  const n = Zi.get(t);
  return n && n.get(e);
}
function Rn(t) {
  const e = /* @__PURE__ */ ve(t);
  return e === t ? e : (We(e, "iterate", hi), /* @__PURE__ */ st(t) ? e : e.map(bt));
}
function _r(t) {
  return We(t = /* @__PURE__ */ ve(t), "iterate", hi), t;
}
function on(t, e) {
  return /* @__PURE__ */ Jt(t) ? jn(/* @__PURE__ */ En(t) ? bt(e) : e) : bt(e);
}
const Lc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Vr(this, Symbol.iterator, (t) => on(this, t));
  },
  concat(...t) {
    return Rn(this).concat(
      ...t.map((e) => te(e) ? Rn(e) : e)
    );
  },
  entries() {
    return Vr(this, "entries", (t) => (t[1] = on(this, t[1]), t));
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
      (n) => n.map((i) => on(this, i)),
      arguments
    );
  },
  find(t, e) {
    return qt(
      this,
      "find",
      t,
      e,
      (n) => on(this, n),
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
      (n) => on(this, n),
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
    return Rn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Ur(this, "lastIndexOf", t);
  },
  map(t, e) {
    return qt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return Zn(this, "pop");
  },
  push(...t) {
    return Zn(this, "push", t);
  },
  reduce(t, ...e) {
    return Eo(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Eo(this, "reduceRight", t, e);
  },
  shift() {
    return Zn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return qt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return Zn(this, "splice", t);
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
    return Zn(this, "unshift", t);
  },
  values() {
    return Vr(this, "values", (t) => on(this, t));
  }
};
function Vr(t, e, n) {
  const i = _r(t), r = i[e]();
  return i !== t && !/* @__PURE__ */ st(t) && (r._next = r.next, r.next = () => {
    const s = r._next();
    return s.done || (s.value = n(s.value)), s;
  }), r;
}
const Dc = Array.prototype;
function qt(t, e, n, i, r, s) {
  const o = _r(t), a = o !== t && !/* @__PURE__ */ st(t), l = o[e];
  if (l !== Dc[e]) {
    const d = l.apply(t, s);
    return a ? bt(d) : d;
  }
  let c = n;
  o !== t && (a ? c = function(d, p) {
    return n.call(this, on(t, d), p, t);
  } : n.length > 2 && (c = function(d, p) {
    return n.call(this, d, p, t);
  }));
  const u = l.call(o, c, i);
  return a && r ? r(u) : u;
}
function Eo(t, e, n, i) {
  const r = _r(t);
  let s = n;
  return r !== t && (/* @__PURE__ */ st(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, on(t, a), l, t);
  }), r[e](s, ...i);
}
function Ur(t, e, n) {
  const i = /* @__PURE__ */ ve(t);
  We(i, "iterate", hi);
  const r = i[e](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ Er(n[0]) ? (n[0] = /* @__PURE__ */ ve(n[0]), i[e](...n)) : r;
}
function Zn(t, e, n = []) {
  Gt(), Us();
  const i = (/* @__PURE__ */ ve(t))[e].apply(t, n);
  return Ks(), Yt(), i;
}
const $c = /* @__PURE__ */ Ns("__proto__,__v_isRef,__isVue"), fl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(yt)
);
function Bc(t) {
  yt(t) || (t = String(t));
  const e = /* @__PURE__ */ ve(this);
  return We(e, "has", t), e.hasOwnProperty(t);
}
class pl {
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
      return i === (r ? s ? bl : yl : s ? gl : ml).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = te(e);
    if (!r) {
      let l;
      if (o && (l = Lc[n]))
        return l;
      if (n === "hasOwnProperty")
        return Bc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ De(e) ? e : i
    );
    if ((yt(n) ? fl.has(n) : $c(n)) || (r || We(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ De(a)) {
      const l = o && mr(n) ? a : a.value;
      return r && be(l) ? /* @__PURE__ */ Qi(l) : l;
    }
    return be(a) ? r ? /* @__PURE__ */ Qi(a) : /* @__PURE__ */ ki(a) : a;
  }
}
class hl extends pl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, r) {
    let s = e[n];
    const o = te(e) && mr(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Jt(s);
      if (!/* @__PURE__ */ st(i) && !/* @__PURE__ */ Jt(i) && (s = /* @__PURE__ */ ve(s), i = /* @__PURE__ */ ve(i)), !o && /* @__PURE__ */ De(s) && !/* @__PURE__ */ De(i))
        return c || (s.value = i), !0;
    }
    const a = o ? Number(n) < e.length : ge(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ De(e) ? e : r
    );
    return e === /* @__PURE__ */ ve(r) && (a ? Ue(i, s) && Vt(e, "set", n, i) : Vt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = ge(e, n);
    e[n];
    const r = Reflect.deleteProperty(e, n);
    return r && i && Vt(e, "delete", n, void 0), r;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!yt(n) || !fl.has(n)) && We(e, "has", n), i;
  }
  ownKeys(e) {
    return We(
      e,
      "iterate",
      te(e) ? "length" : Cn
    ), Reflect.ownKeys(e);
  }
}
class vl extends pl {
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
const Fc = /* @__PURE__ */ new hl(), zc = /* @__PURE__ */ new vl(), Nc = /* @__PURE__ */ new hl(!0), qc = /* @__PURE__ */ new vl(!0), gs = (t) => t, Ii = (t) => Reflect.getPrototypeOf(t);
function Hc(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = /* @__PURE__ */ ve(r), o = zn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = r[t](...i), u = n ? gs : e ? jn : bt;
    return !e && We(
      s,
      "iterate",
      l ? ms : Cn
    ), ke(
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
function Li(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Wc(t, e) {
  const n = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(r);
      t || (Ue(r, a) && We(o, "get", r), We(o, "get", a));
      const { has: l } = Ii(o), c = e ? gs : t ? jn : bt;
      if (l.call(o, r))
        return c(s.get(r));
      if (l.call(o, a))
        return c(s.get(a));
      s !== o && s.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !t && We(/* @__PURE__ */ ve(r), "iterate", Cn), r.size;
    },
    has(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(r);
      return t || (Ue(r, a) && We(o, "has", r), We(o, "has", a)), r === a ? s.has(r) : s.has(r) || s.has(a);
    },
    forEach(r, s) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ ve(a), c = e ? gs : t ? jn : bt;
      return !t && We(l, "iterate", Cn), a.forEach((u, d) => r.call(s, c(u), c(d), o));
    }
  };
  return ke(
    n,
    t ? {
      add: Li("add"),
      set: Li("set"),
      delete: Li("delete"),
      clear: Li("clear")
    } : {
      add(r) {
        !e && !/* @__PURE__ */ st(r) && !/* @__PURE__ */ Jt(r) && (r = /* @__PURE__ */ ve(r));
        const s = /* @__PURE__ */ ve(this);
        return Ii(s).has.call(s, r) || (s.add(r), Vt(s, "add", r, r)), this;
      },
      set(r, s) {
        !e && !/* @__PURE__ */ st(s) && !/* @__PURE__ */ Jt(s) && (s = /* @__PURE__ */ ve(s));
        const o = /* @__PURE__ */ ve(this), { has: a, get: l } = Ii(o);
        let c = a.call(o, r);
        c || (r = /* @__PURE__ */ ve(r), c = a.call(o, r));
        const u = l.call(o, r);
        return o.set(r, s), c ? Ue(s, u) && Vt(o, "set", r, s) : Vt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ ve(this), { has: o, get: a } = Ii(s);
        let l = o.call(s, r);
        l || (r = /* @__PURE__ */ ve(r), l = o.call(s, r)), a && a.call(s, r);
        const c = s.delete(r);
        return l && Vt(s, "delete", r, void 0), c;
      },
      clear() {
        const r = /* @__PURE__ */ ve(this), s = r.size !== 0, o = r.clear();
        return s && Vt(
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
    n[r] = Hc(r, t, e);
  }), n;
}
function xr(t, e) {
  const n = Wc(t, e);
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(
    ge(n, r) && r in i ? n : i,
    r,
    s
  );
}
const jc = {
  get: /* @__PURE__ */ xr(!1, !1)
}, Vc = {
  get: /* @__PURE__ */ xr(!1, !0)
}, Uc = {
  get: /* @__PURE__ */ xr(!0, !1)
}, Kc = {
  get: /* @__PURE__ */ xr(!0, !0)
}, ml = /* @__PURE__ */ new WeakMap(), gl = /* @__PURE__ */ new WeakMap(), yl = /* @__PURE__ */ new WeakMap(), bl = /* @__PURE__ */ new WeakMap();
function Xc(t) {
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
function Gc(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Xc(wc(t));
}
// @__NO_SIDE_EFFECTS__
function ki(t) {
  return /* @__PURE__ */ Jt(t) ? t : Cr(
    t,
    !1,
    Fc,
    jc,
    ml
  );
}
// @__NO_SIDE_EFFECTS__
function Sr(t) {
  return Cr(
    t,
    !1,
    Nc,
    Vc,
    gl
  );
}
// @__NO_SIDE_EFFECTS__
function Qi(t) {
  return Cr(
    t,
    !0,
    zc,
    Uc,
    yl
  );
}
// @__NO_SIDE_EFFECTS__
function In(t) {
  return Cr(
    t,
    !0,
    qc,
    Kc,
    bl
  );
}
function Cr(t, e, n, i, r) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = Gc(t);
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
  return /* @__PURE__ */ Jt(t) ? /* @__PURE__ */ En(t.__v_raw) : !!(t && t.__v_isReactive);
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
function Er(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ve(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ ve(e) : t;
}
function wl(t) {
  return !ge(t, "__v_skip") && Object.isExtensible(t) && Ja(t, "__v_skip", !0), t;
}
const bt = (t) => be(t) ? /* @__PURE__ */ ki(t) : t, jn = (t) => be(t) ? /* @__PURE__ */ Qi(t) : t;
// @__NO_SIDE_EFFECTS__
function De(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(t) {
  return _l(t, !1);
}
// @__NO_SIDE_EFFECTS__
function Tn(t) {
  return _l(t, !0);
}
function _l(t, e) {
  return /* @__PURE__ */ De(t) ? t : new Yc(t, e);
}
class Yc {
  constructor(e, n) {
    this.dep = new wr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ve(e), this._value = n ? e : bt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ st(e) || /* @__PURE__ */ Jt(e);
    e = i ? e : /* @__PURE__ */ ve(e), Ue(e, n) && (this._rawValue = e, this._value = i ? e : bt(e), this.dep.trigger());
  }
}
function To(t) {
  t.dep && t.dep.trigger();
}
function v(t) {
  return /* @__PURE__ */ De(t) ? t.value : t;
}
function Ye(t) {
  return ae(t) ? t() : v(t);
}
const Jc = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const r = t[e];
    return /* @__PURE__ */ De(r) && !/* @__PURE__ */ De(n) ? (r.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function xl(t) {
  return /* @__PURE__ */ En(t) ? t : new Proxy(t, Jc);
}
class Zc {
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
function Sl(t) {
  return new Zc(t);
}
// @__NO_SIDE_EFFECTS__
function Kn(t) {
  const e = te(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = Cl(t, n);
  return e;
}
class Qc {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ve(e);
    let r = !0, s = e;
    if (!te(e) || !mr(String(n)))
      do
        r = !/* @__PURE__ */ Er(s) || /* @__PURE__ */ st(s);
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
    return Ic(this._raw, this._key);
  }
}
class ed {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Wi(t, e, n) {
  return /* @__PURE__ */ De(t) ? t : ae(t) ? new ed(t) : be(t) && arguments.length > 1 ? Cl(t, e, n) : /* @__PURE__ */ B(t);
}
function Cl(t, e, n) {
  return new Qc(t, e, n);
}
class td {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new wr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = pi - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Se !== this)
      return ol(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return ul(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function nd(t, e, n = !1) {
  let i, r;
  return ae(t) ? i = t : (i = t.get, r = t.set), new td(i, r, n);
}
const Di = {}, er = /* @__PURE__ */ new WeakMap();
let wn;
function id(t, e = !1, n = wn) {
  if (n) {
    let i = er.get(n);
    i || er.set(n, i = []), i.push(t);
  }
}
function rd(t, e, n = me) {
  const { immediate: i, deep: r, once: s, scheduler: o, augmentJob: a, call: l } = n, c = (y) => r ? y : /* @__PURE__ */ st(y) || r === !1 || r === 0 ? Ut(y, 1) : Ut(y);
  let u, d, p, f, h = !1, m = !1;
  if (/* @__PURE__ */ De(t) ? (d = () => t.value, h = /* @__PURE__ */ st(t)) : /* @__PURE__ */ En(t) ? (d = () => c(t), h = !0) : te(t) ? (m = !0, h = t.some((y) => /* @__PURE__ */ En(y) || /* @__PURE__ */ st(y)), d = () => t.map((y) => {
    if (/* @__PURE__ */ De(y))
      return y.value;
    if (/* @__PURE__ */ En(y))
      return c(y);
    if (ae(y))
      return l ? l(y, 2) : y();
  })) : ae(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (p) {
      Gt();
      try {
        p();
      } finally {
        Yt();
      }
    }
    const y = wn;
    wn = u;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      wn = y;
    }
  } : d = Mt, e && r) {
    const y = d, E = r === !0 ? 1 / 0 : r;
    d = () => Ut(y(), E);
  }
  const g = Vs(), C = () => {
    u.stop(), g && g.active && Hs(g.effects, u);
  };
  if (s && e) {
    const y = e;
    e = (...E) => {
      y(...E), C();
    };
  }
  let w = m ? new Array(t.length).fill(Di) : Di;
  const _ = (y) => {
    if (!(!(u.flags & 1) || !u.dirty && !y))
      if (e) {
        const E = u.run();
        if (r || h || (m ? E.some((T, x) => Ue(T, w[x])) : Ue(E, w))) {
          p && p();
          const T = wn;
          wn = u;
          try {
            const x = [
              E,
              // pass undefined as the old value when it's changed for the first time
              w === Di ? void 0 : m && w[0] === Di ? [] : w,
              f
            ];
            w = E, l ? l(e, 3, x) : (
              // @ts-expect-error
              e(...x)
            );
          } finally {
            wn = T;
          }
        }
      } else
        u.run();
  };
  return a && a(_), u = new rl(d), u.scheduler = o ? () => o(_, !1) : _, f = (y) => id(y, !1, u), p = u.onStop = () => {
    const y = er.get(u);
    if (y) {
      if (l)
        l(y, 4);
      else
        for (const E of y) E();
      er.delete(u);
    }
  }, e ? i ? _(!0) : w = u.run() : o ? o(_.bind(null, !0), !0) : u.run(), C.pause = u.pause.bind(u), C.resume = u.resume.bind(u), C.stop = C, C;
}
function Ut(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ De(t))
    Ut(t.value, e, n);
  else if (te(t))
    for (let i = 0; i < t.length; i++)
      Ut(t[i], e, n);
  else if (Xa(t) || zn(t))
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
function Ai(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (r) {
    Tr(r, e, n);
  }
}
function wt(t, e, n, i) {
  if (ae(t)) {
    const r = Ai(t, e, n, i);
    return r && Ga(r) && r.catch((s) => {
      Tr(s, e, n);
    }), r;
  }
  if (te(t)) {
    const r = [];
    for (let s = 0; s < t.length; s++)
      r.push(wt(t[s], e, n, i));
    return r;
  }
}
function Tr(t, e, n, i = !0) {
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
      Gt(), Ai(s, null, 10, [
        t,
        l,
        c
      ]), Yt();
      return;
    }
  }
  sd(t, n, r, i, o);
}
function sd(t, e, n, i = !0, r = !1) {
  if (r)
    throw t;
  console.error(t);
}
const Ke = [];
let kt = -1;
const Nn = [];
let an = null, $n = 0;
const El = /* @__PURE__ */ Promise.resolve();
let tr = null;
function Me(t) {
  const e = tr || El;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function od(t) {
  let e = kt + 1, n = Ke.length;
  for (; e < n; ) {
    const i = e + n >>> 1, r = Ke[i], s = vi(r);
    s < t || s === t && r.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Gs(t) {
  if (!(t.flags & 1)) {
    const e = vi(t), n = Ke[Ke.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= vi(n) ? Ke.push(t) : Ke.splice(od(e), 0, t), t.flags |= 1, Tl();
  }
}
function Tl() {
  tr || (tr = El.then(Al));
}
function ad(t) {
  te(t) ? Nn.push(...t) : an && t.id === -1 ? an.splice($n + 1, 0, t) : t.flags & 1 || (Nn.push(t), t.flags |= 1), Tl();
}
function ko(t, e, n = kt + 1) {
  for (; n < Ke.length; n++) {
    const i = Ke[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      Ke.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function kl(t) {
  if (Nn.length) {
    const e = [...new Set(Nn)].sort(
      (n, i) => vi(n) - vi(i)
    );
    if (Nn.length = 0, an) {
      an.push(...e);
      return;
    }
    for (an = e, $n = 0; $n < an.length; $n++) {
      const n = an[$n];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    an = null, $n = 0;
  }
}
const vi = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function Al(t) {
  try {
    for (kt = 0; kt < Ke.length; kt++) {
      const e = Ke[kt];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Ai(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; kt < Ke.length; kt++) {
      const e = Ke[kt];
      e && (e.flags &= -2);
    }
    kt = -1, Ke.length = 0, kl(), tr = null, (Ke.length || Nn.length) && Al();
  }
}
let Ne = null, Pl = null;
function nr(t) {
  const e = Ne;
  return Ne = t, Pl = t && t.type.__scopeId || null, e;
}
function q(t, e = Ne, n) {
  if (!e || t._n)
    return t;
  const i = (...r) => {
    i._d && sr(-1);
    const s = nr(e);
    let o;
    try {
      o = t(...r);
    } finally {
      nr(s), i._d && sr(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function ld(t, e) {
  if (Ne === null)
    return t;
  const n = Rr(Ne), i = t.dirs || (t.dirs = []);
  for (let r = 0; r < e.length; r++) {
    let [s, o, a, l = me] = e[r];
    s && (ae(s) && (s = {
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
    l && (Gt(), wt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Yt());
  }
}
function Xn(t, e) {
  if (je) {
    let n = je.provides;
    const i = je.parent && je.parent.provides;
    i === n && (n = je.provides = Object.create(i)), n[t] = e;
  }
}
function Kt(t, e, n = !1) {
  const i = at();
  if (i || Hn) {
    let r = Hn ? Hn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (r && t in r)
      return r[t];
    if (arguments.length > 1)
      return n && ae(e) ? e.call(i && i.proxy) : e;
  }
}
const ud = /* @__PURE__ */ Symbol.for("v-scx"), cd = () => Kt(ud);
function ft(t, e) {
  return Pi(t, null, e);
}
function Ol(t, e) {
  return Pi(
    t,
    null,
    { flush: "post" }
  );
}
function dd(t, e) {
  return Pi(
    t,
    null,
    { flush: "sync" }
  );
}
function ye(t, e, n) {
  return Pi(t, e, n);
}
function Pi(t, e, n = me) {
  const { immediate: i, deep: r, flush: s, once: o } = n, a = ke({}, n), l = e && i || !e && s !== "post";
  let c;
  if (bi) {
    if (s === "sync") {
      const f = cd();
      c = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = Mt, f.resume = Mt, f.pause = Mt, f;
    }
  }
  const u = je;
  a.call = (f, h, m) => wt(f, u, h, m);
  let d = !1;
  s === "post" ? a.scheduler = (f) => {
    qe(f, u && u.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (f, h) => {
    h ? f() : Gs(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, u && (f.id = u.uid, f.i = u));
  };
  const p = rd(t, e, a);
  return bi && (c ? c.push(p) : l && p()), p;
}
function fd(t, e, n) {
  const i = this.proxy, r = Te(t) ? t.includes(".") ? Ml(i, t) : () => i[t] : t.bind(i, i);
  let s;
  ae(e) ? s = e : (s = e.handler, n = e);
  const o = Oi(this), a = Pi(r, s.bind(i), n);
  return o(), a;
}
function Ml(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const Rl = /* @__PURE__ */ Symbol("_vte"), Il = (t) => t.__isTeleport, li = (t) => t && (t.disabled || t.disabled === ""), Ao = (t) => t && (t.defer || t.defer === ""), Po = (t) => typeof SVGElement < "u" && t instanceof SVGElement, Oo = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, ys = (t, e) => {
  const n = t && t.to;
  return Te(n) ? e ? e(n) : null : n;
}, Ll = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, r, s, o, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: p,
      o: { insert: f, querySelector: h, createText: m, createComment: g }
    } = c, C = li(e.props);
    let { shapeFlag: w, children: _, dynamicChildren: y } = e;
    if (t == null) {
      const E = e.el = m(""), T = e.anchor = m("");
      f(E, n, i), f(T, n, i);
      const x = (k, A) => {
        w & 16 && u(
          _,
          k,
          A,
          r,
          s,
          o,
          a,
          l
        );
      }, R = () => {
        const k = e.target = ys(e.props, h), A = bs(k, e, m, f);
        k && (o !== "svg" && Po(k) ? o = "svg" : o !== "mathml" && Oo(k) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(k), C || (x(k, A), ji(e, !1)));
      };
      C && (x(n, T), ji(e, !0)), Ao(e.props) ? (e.el.__isMounted = !1, qe(() => {
        R(), delete e.el.__isMounted;
      }, s)) : R();
    } else {
      if (Ao(e.props) && t.el.__isMounted === !1) {
        qe(() => {
          Ll.process(
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
      const E = e.anchor = t.anchor, T = e.target = t.target, x = e.targetAnchor = t.targetAnchor, R = li(t.props), k = R ? n : T, A = R ? E : x;
      if (o === "svg" || Po(T) ? o = "svg" : (o === "mathml" || Oo(T)) && (o = "mathml"), y ? (p(
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
      ), C)
        R ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : $i(
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
        I && $i(
          e,
          I,
          null,
          c,
          0
        );
      } else R && $i(
        e,
        T,
        x,
        c,
        1
      );
      ji(e, C);
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
      const f = s || !li(p);
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
  move: $i,
  hydrate: pd
};
function $i(t, e, n, { o: { insert: i }, m: r }, s = 2) {
  s === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: c, props: u } = t, d = s === 2;
  if (d && i(o, e, n), (!d || li(u)) && l & 16)
    for (let p = 0; p < c.length; p++)
      r(
        c[p],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function pd(t, e, n, i, r, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function p(g, C) {
    let w = C;
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
  function f(g, C) {
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
  ), m = li(e.props);
  if (h) {
    const g = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (m ? (f(t, e), p(h, g), e.targetAnchor || bs(
      h,
      e,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = o(t), p(h, g), e.targetAnchor || bs(h, e, u, c), d(
      g && o(g),
      e,
      h,
      n,
      i,
      r,
      s
    ))), ji(e, m);
  } else m && e.shapeFlag & 16 && (f(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Dl = Ll;
function ji(t, e) {
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
  return s[Rl] = o, t && (i(s, t, r), i(o, t, r)), o;
}
const At = /* @__PURE__ */ Symbol("_leaveCb"), Qn = /* @__PURE__ */ Symbol("_enterCb");
function hd() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Re(() => {
    t.isMounted = !0;
  }), fn(() => {
    t.isUnmounting = !0;
  }), t;
}
const lt = [Function, Array], $l = {
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
}, Bl = (t) => {
  const e = t.subTree;
  return e.component ? Bl(e.component) : e;
}, vd = {
  name: "BaseTransition",
  props: $l,
  setup(t, { slots: e }) {
    const n = at(), i = hd();
    return () => {
      const r = e.default && Nl(e.default(), !0);
      if (!r || !r.length)
        return;
      const s = Fl(r), o = /* @__PURE__ */ ve(t), { mode: a } = o;
      if (i.isLeaving)
        return Kr(s);
      const l = Mo(s);
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
      l.type !== ze && mi(l, c);
      let u = n.subTree && Mo(n.subTree);
      if (u && u.type !== ze && !xn(u, l) && Bl(n).type !== ze) {
        let d = ws(
          u,
          o,
          i,
          n
        );
        if (mi(u, d), a === "out-in" && l.type !== ze)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, Kr(s);
        a === "in-out" && l.type !== ze ? d.delayLeave = (p, f, h) => {
          const m = zl(
            i,
            u
          );
          m[String(u.key)] = u, p[At] = () => {
            f(), p[At] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return s;
    };
  }
};
function Fl(t) {
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
const md = vd;
function zl(t, e) {
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
    onBeforeLeave: p,
    onLeave: f,
    onAfterLeave: h,
    onLeaveCancelled: m,
    onBeforeAppear: g,
    onAppear: C,
    onAfterAppear: w,
    onAppearCancelled: _
  } = e, y = String(t.key), E = zl(n, t), T = (k, A) => {
    k && wt(
      k,
      i,
      9,
      A
    );
  }, x = (k, A) => {
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
      k[At] && k[At](
        !0
        /* cancelled */
      );
      const I = E[y];
      I && xn(t, I) && I.el[At] && I.el[At](), T(A, [k]);
    },
    enter(k) {
      let A = c, I = u, P = d;
      if (!n.isMounted)
        if (s)
          A = C || c, I = w || u, P = _ || d;
        else
          return;
      let W = !1;
      k[Qn] = (U) => {
        W || (W = !0, U ? T(P, [k]) : T(I, [k]), R.delayedLeave && R.delayedLeave(), k[Qn] = void 0);
      };
      const D = k[Qn].bind(null, !1);
      A ? x(A, [k, D]) : D();
    },
    leave(k, A) {
      const I = String(t.key);
      if (k[Qn] && k[Qn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return A();
      T(p, [k]);
      let P = !1;
      k[At] = (D) => {
        P || (P = !0, A(), D ? T(m, [k]) : T(h, [k]), k[At] = void 0, E[I] === t && delete E[I]);
      };
      const W = k[At].bind(null, !1);
      E[I] = t, f ? x(f, [k, W]) : W();
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
    return t = Zt(t), t.children = null, t;
}
function Mo(t) {
  if (!kr(t))
    return Il(t.type) && t.children ? Fl(t.children) : t;
  if (t.component)
    return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (e & 16)
      return n[0];
    if (e & 32 && ae(n.default))
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
    )) : (e || o.type !== ze) && i.push(a != null ? Zt(o, { key: a }) : o);
  }
  if (r > 1)
    for (let s = 0; s < i.length; s++)
      i[s].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function Z(t, e) {
  return ae(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ke({ name: t.name }, e, { setup: t })
  ) : t;
}
function ql() {
  const t = at();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function Hl(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function gi(t) {
  const e = at(), n = /* @__PURE__ */ Tn(null);
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
function Ro(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const ir = /* @__PURE__ */ new WeakMap();
function ui(t, e, n, i, r = !1) {
  if (te(t)) {
    t.forEach(
      (m, g) => ui(
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
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && ui(t, e, n, i.component.subTree);
    return;
  }
  const s = i.shapeFlag & 4 ? Rr(i.component) : i.el, o = r ? null : s, { i: a, r: l } = t, c = e && e.r, u = a.refs === me ? a.refs = {} : a.refs, d = a.setupState, p = /* @__PURE__ */ ve(d), f = d === me ? Ka : (m) => Ro(u, m) ? !1 : ge(p, m), h = (m, g) => !(g && Ro(u, g));
  if (c != null && c !== l) {
    if (Io(e), Te(c))
      u[c] = null, f(c) && (d[c] = null);
    else if (/* @__PURE__ */ De(c)) {
      const m = e;
      h(c, m.k) && (c.value = null), m.k && (u[m.k] = null);
    }
  }
  if (ae(l))
    Ai(l, a, 12, [o, u]);
  else {
    const m = Te(l), g = /* @__PURE__ */ De(l);
    if (m || g) {
      const C = () => {
        if (t.f) {
          const w = m ? f(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (r)
            te(w) && Hs(w, s);
          else if (te(w))
            w.includes(s) || w.push(s);
          else if (m)
            u[l] = [s], f(l) && (d[l] = u[l]);
          else {
            const _ = [s];
            h(l, t.k) && (l.value = _), t.k && (u[t.k] = _);
          }
        } else m ? (u[l] = o, f(l) && (d[l] = o)) : g && (h(l, t.k) && (l.value = o), t.k && (u[t.k] = o));
      };
      if (o) {
        const w = () => {
          C(), ir.delete(t);
        };
        w.id = -1, ir.set(t, w), qe(w, n);
      } else
        Io(t), C();
    }
  }
}
function Io(t) {
  const e = ir.get(t);
  e && (e.flags |= 8, ir.delete(t));
}
br().requestIdleCallback;
br().cancelIdleCallback;
const qn = (t) => !!t.type.__asyncLoader, kr = (t) => t.type.__isKeepAlive;
function gd(t, e) {
  Wl(t, "a", e);
}
function yd(t, e) {
  Wl(t, "da", e);
}
function Wl(t, e, n = je) {
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
      kr(r.parent.vnode) && bd(i, e, n, r), r = r.parent;
  }
}
function bd(t, e, n, i) {
  const r = Ar(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  An(() => {
    Hs(i[e], r);
  }, n);
}
function Ar(t, e, n = je, i = !1) {
  if (n) {
    const r = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Gt();
      const a = Oi(n), l = wt(e, n, t, o);
      return a(), Yt(), l;
    });
    return i ? r.unshift(s) : r.push(s), s;
  }
}
const tn = (t) => (e, n = je) => {
  (!bi || t === "sp") && Ar(t, (...i) => e(...i), n);
}, wd = tn("bm"), Re = tn("m"), _d = tn(
  "bu"
), xd = tn("u"), fn = tn(
  "bum"
), An = tn("um"), Sd = tn(
  "sp"
), Cd = tn("rtg"), Ed = tn("rtc");
function Td(t, e = je) {
  Ar("ec", t, e);
}
const kd = "components", jl = /* @__PURE__ */ Symbol.for("v-ndc");
function Ad(t) {
  return Te(t) ? Pd(kd, t, !1) || t : t || jl;
}
function Pd(t, e, n = !0, i = !1) {
  const r = Ne || je;
  if (r) {
    const s = r.type;
    {
      const a = vf(
        s,
        !1
      );
      if (a && (a === e || a === $e(e) || a === yr($e(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Lo(r[t] || s[t], e) || // global registration
      Lo(r.appContext[t], e)
    );
    return !o && i ? s : o;
  }
}
function Lo(t, e) {
  return t && (t[e] || t[$e(e)] || t[yr($e(e))]);
}
function Pn(t, e, n, i) {
  let r;
  const s = n, o = te(t);
  if (o || Te(t)) {
    const a = o && /* @__PURE__ */ En(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ st(t), c = /* @__PURE__ */ Jt(t), t = _r(t)), r = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      r[u] = e(
        l ? c ? jn(bt(t[u])) : bt(t[u]) : t[u],
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
  if (Ne.ce || Ne.parent && qn(Ne.parent) && Ne.parent.ce) {
    const c = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), M(), X(
      Ee,
      null,
      [H("slot", n, i && i())],
      c ? -2 : 64
    );
  }
  let s = t[e];
  s && s._c && (s._d = !1), M();
  const o = s && Vl(s(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = X(
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
function Vl(t) {
  return t.some((e) => yi(e) ? !(e.type === ze || e.type === Ee && !Vl(e.children)) : !0) ? t : null;
}
const _s = (t) => t ? du(t) ? Rr(t) : _s(t.parent) : null, ci = (
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
    $options: (t) => Kl(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Gs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Me.bind(t.proxy)),
    $watch: (t) => fd.bind(t)
  })
), Xr = (t, e) => t !== me && !t.__isScriptSetup && ge(t, e), Od = {
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
        if (Xr(i, e))
          return o[e] = 1, i[e];
        if (r !== me && ge(r, e))
          return o[e] = 2, r[e];
        if (ge(s, e))
          return o[e] = 3, s[e];
        if (n !== me && ge(n, e))
          return o[e] = 4, n[e];
        Ss && (o[e] = 0);
      }
    }
    const c = ci[e];
    let u, d;
    if (c)
      return e === "$attrs" && We(t.attrs, "get", ""), c(t);
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
    return Xr(r, e) ? (r[e] = n, !0) : i !== me && ge(i, e) ? (i[e] = n, !0) : ge(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: r, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== me && a[0] !== "$" && ge(t, a) || Xr(e, a) || ge(s, a) || ge(i, a) || ge(ci, a) || ge(r.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ge(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Md() {
  return Rd().slots;
}
function Rd(t) {
  const e = at();
  return e.setupContext || (e.setupContext = pu(e));
}
function xs(t) {
  return te(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Id(t, e) {
  const n = xs(t);
  for (const i in e) {
    if (i.startsWith("__skip")) continue;
    let r = n[i];
    r ? te(r) || ae(r) ? r = n[i] = { type: r, default: e[i] } : r.default = e[i] : r === null && (r = n[i] = { default: e[i] }), r && e[`__skip_${i}`] && (r.skipFactory = !0);
  }
  return n;
}
let Ss = !0;
function Ld(t) {
  const e = Kl(t), n = t.proxy, i = t.ctx;
  Ss = !1, e.beforeCreate && Do(e.beforeCreate, t, "bc");
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
    deactivated: g,
    beforeDestroy: C,
    beforeUnmount: w,
    destroyed: _,
    unmounted: y,
    render: E,
    renderTracked: T,
    renderTriggered: x,
    errorCaptured: R,
    serverPrefetch: k,
    // public API
    expose: A,
    inheritAttrs: I,
    // assets
    components: P,
    directives: W,
    filters: D
  } = e;
  if (c && Dd(c, i, null), o)
    for (const J in o) {
      const Q = o[J];
      ae(Q) && (i[J] = Q.bind(n));
    }
  if (r) {
    const J = r.call(n, n);
    be(J) && (t.data = /* @__PURE__ */ ki(J));
  }
  if (Ss = !0, s)
    for (const J in s) {
      const Q = s[J], we = ae(Q) ? Q.bind(n, n) : ae(Q.get) ? Q.get.bind(n, n) : Mt, Le = !ae(Q) && ae(Q.set) ? Q.set.bind(n) : Mt, Ze = L({
        get: we,
        set: Le
      });
      Object.defineProperty(i, J, {
        enumerable: !0,
        configurable: !0,
        get: () => Ze.value,
        set: (Ae) => Ze.value = Ae
      });
    }
  if (a)
    for (const J in a)
      Ul(a[J], i, n, J);
  if (l) {
    const J = ae(l) ? l.call(n) : l;
    Reflect.ownKeys(J).forEach((Q) => {
      Xn(Q, J[Q]);
    });
  }
  u && Do(u, t, "c");
  function ne(J, Q) {
    te(Q) ? Q.forEach((we) => J(we.bind(n))) : Q && J(Q.bind(n));
  }
  if (ne(wd, d), ne(Re, p), ne(_d, f), ne(xd, h), ne(gd, m), ne(yd, g), ne(Td, R), ne(Ed, T), ne(Cd, x), ne(fn, w), ne(An, y), ne(Sd, k), te(A))
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
  E && t.render === Mt && (t.render = E), I != null && (t.inheritAttrs = I), P && (t.components = P), W && (t.directives = W), k && Hl(t);
}
function Dd(t, e, n = Mt) {
  te(t) && (t = Cs(t));
  for (const i in t) {
    const r = t[i];
    let s;
    be(r) ? "default" in r ? s = Kt(
      r.from || i,
      r.default,
      !0
    ) : s = Kt(r.from || i) : s = Kt(r), /* @__PURE__ */ De(s) ? Object.defineProperty(e, i, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[i] = s;
  }
}
function Do(t, e, n) {
  wt(
    te(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Ul(t, e, n, i) {
  let r = i.includes(".") ? Ml(n, i) : () => n[i];
  if (Te(t)) {
    const s = e[t];
    ae(s) && ye(r, s);
  } else if (ae(t))
    ye(r, t.bind(n));
  else if (be(t))
    if (te(t))
      t.forEach((s) => Ul(s, e, n, i));
    else {
      const s = ae(t.handler) ? t.handler.bind(n) : e[t.handler];
      ae(s) && ye(r, s, t);
    }
}
function Kl(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !r.length && !n && !i ? l = e : (l = {}, r.length && r.forEach(
    (c) => rr(l, c, o, !0)
  ), rr(l, e, o)), be(e) && s.set(e, l), l;
}
function rr(t, e, n, i = !1) {
  const { mixins: r, extends: s } = e;
  s && rr(t, s, n, !0), r && r.forEach(
    (o) => rr(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = $d[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const $d = {
  data: $o,
  props: Bo,
  emits: Bo,
  // objects
  methods: ii,
  computed: ii,
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
  components: ii,
  directives: ii,
  // watch
  watch: Fd,
  // provide / inject
  provide: $o,
  inject: Bd
};
function $o(t, e) {
  return e ? t ? function() {
    return ke(
      ae(t) ? t.call(this, this) : t,
      ae(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Bd(t, e) {
  return ii(Cs(t), Cs(e));
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
function ii(t, e) {
  return t ? ke(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Bo(t, e) {
  return t ? te(t) && te(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : ke(
    /* @__PURE__ */ Object.create(null),
    xs(t),
    xs(e ?? {})
  ) : e;
}
function Fd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = ke(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Ve(t[i], e[i]);
  return n;
}
function Xl() {
  return {
    app: null,
    config: {
      isNativeTag: Ka,
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
let zd = 0;
function Nd(t, e) {
  return function(i, r = null) {
    ae(i) || (i = ke({}, i)), r != null && !be(r) && (r = null);
    const s = Xl(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = s.app = {
      _uid: zd++,
      _component: i,
      _props: r,
      _container: null,
      _context: s,
      _instance: null,
      version: bf,
      get config() {
        return s.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return o.has(u) || (u && ae(u.install) ? (o.add(u), u.install(c, ...d)) : ae(u) && (o.add(u), u(c, ...d))), c;
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
          return f.appContext = s, p === !0 ? p = "svg" : p === !1 && (p = void 0), t(f, u, p), l = !0, c._container = u, u.__vue_app__ = c, Rr(f.component);
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
function qd(t, e, n = me) {
  const i = at(), r = $e(e), s = nt(e), o = Gl(t, r), a = Sl((l, c) => {
    let u, d = me, p;
    return dd(() => {
      const f = t[r];
      Ue(u, f) && (u = f, c());
    }), {
      get() {
        return l(), n.get ? n.get(u) : u;
      },
      set(f) {
        const h = n.set ? n.set(f) : f;
        if (!Ue(h, u) && !(d !== me && Ue(f, d)))
          return;
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || r in m || s in m) && (`onUpdate:${e}` in m || `onUpdate:${r}` in m || `onUpdate:${s}` in m) || (u = f, c()), i.emit(`update:${e}`, h), Ue(f, h) && Ue(f, d) && !Ue(h, p) && c(), d = f, p = h;
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
const Gl = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${$e(e)}Modifiers`] || t[`${nt(e)}Modifiers`];
function Hd(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || me;
  let r = n;
  const s = e.startsWith("update:"), o = s && Gl(i, e.slice(7));
  o && (o.trim && (r = n.map((u) => Te(u) ? u.trim() : u)), o.number && (r = n.map(Sc)));
  let a, l = i[a = Hi(e)] || // also try camelCase event handler (#2249)
  i[a = Hi($e(e))];
  !l && s && (l = i[a = Hi(nt(e))]), l && wt(
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
const Wd = /* @__PURE__ */ new WeakMap();
function Yl(t, e, n = !1) {
  const i = n ? Wd : e.emitsCache, r = i.get(t);
  if (r !== void 0)
    return r;
  const s = t.emits;
  let o = {}, a = !1;
  if (!ae(t)) {
    const l = (c) => {
      const u = Yl(c, e, !0);
      u && (a = !0, ke(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (be(t) && i.set(t, null), null) : (te(s) ? s.forEach((l) => o[l] = null) : ke(o, s), be(t) && i.set(t, o), o);
}
function Pr(t, e) {
  return !t || !hr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ge(t, e[0].toLowerCase() + e.slice(1)) || ge(t, nt(e)) || ge(t, e));
}
function Fo(t) {
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
  } = t, g = nr(t);
  let C, w;
  try {
    if (n.shapeFlag & 4) {
      const y = r || i, E = y;
      C = Pt(
        c.call(
          E,
          y,
          u,
          d,
          f,
          p,
          h
        )
      ), w = a;
    } else {
      const y = e;
      C = Pt(
        y.length > 1 ? y(
          d,
          { attrs: a, slots: o, emit: l }
        ) : y(
          d,
          null
        )
      ), w = e.props ? a : jd(a);
    }
  } catch (y) {
    di.length = 0, Tr(y, t, 1), C = H(ze);
  }
  let _ = C;
  if (w && m !== !1) {
    const y = Object.keys(w), { shapeFlag: E } = _;
    y.length && E & 7 && (s && y.some(qs) && (w = Vd(
      w,
      s
    )), _ = Zt(_, w, !1, !0));
  }
  return n.dirs && (_ = Zt(_, null, !1, !0), _.dirs = _.dirs ? _.dirs.concat(n.dirs) : n.dirs), n.transition && mi(_, n.transition), C = _, nr(g), C;
}
const jd = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || hr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, Vd = (t, e) => {
  const n = {};
  for (const i in t)
    (!qs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function Ud(t, e, n) {
  const { props: i, children: r, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? zo(i, o, c) : !!o;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const p = u[d];
        if (Jl(o, i, p) && !Pr(c, p))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? zo(i, o, c) : !0 : !!o;
  return !1;
}
function zo(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    if (Jl(e, t, s) && !Pr(n, s))
      return !0;
  }
  return !1;
}
function Jl(t, e, n) {
  const i = t[n], r = e[n];
  return n === "style" && be(i) && be(r) ? !js(i, r) : i !== r;
}
function Kd({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Zl = {}, Ql = () => Object.create(Zl), eu = (t) => Object.getPrototypeOf(t) === Zl;
function Xd(t, e, n, i = !1) {
  const r = {}, s = Ql();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), tu(t, e, r, s);
  for (const o in t.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? t.props = i ? r : /* @__PURE__ */ Sr(r) : t.type.props ? t.props = r : t.props = s, t.attrs = s;
}
function Gd(t, e, n, i) {
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
        if (Pr(t.emitsOptions, p))
          continue;
        const f = e[p];
        if (l)
          if (ge(s, p))
            f !== s[p] && (s[p] = f, c = !0);
          else {
            const h = $e(p);
            r[h] = Es(
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
    tu(t, e, r, s) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ge(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = nt(d)) === d || !ge(e, u))) && (l ? n && // for camelCase
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
  c && Vt(t.attrs, "set", "");
}
function tu(t, e, n, i) {
  const [r, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (si(l))
        continue;
      const c = e[l];
      let u;
      r && ge(r, u = $e(l)) ? !s || !s.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Pr(t.emitsOptions, l) || (!(l in i) || c !== i[l]) && (i[l] = c, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ ve(n), c = a || me;
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
      if (o.type !== Function && !o.skipFactory && ae(l)) {
        const { propsDefaults: c } = r;
        if (n in c)
          i = c[n];
        else {
          const u = Oi(r);
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
const Yd = /* @__PURE__ */ new WeakMap();
function nu(t, e, n = !1) {
  const i = n ? Yd : e.propsCache, r = i.get(t);
  if (r)
    return r;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!ae(t)) {
    const u = (d) => {
      l = !0;
      const [p, f] = nu(d, e, !0);
      ke(o, p), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!s && !l)
    return be(t) && i.set(t, Fn), Fn;
  if (te(s))
    for (let u = 0; u < s.length; u++) {
      const d = $e(s[u]);
      No(d) && (o[d] = me);
    }
  else if (s)
    for (const u in s) {
      const d = $e(u);
      if (No(d)) {
        const p = s[u], f = o[d] = te(p) || ae(p) ? { type: p } : ke({}, p), h = f.type;
        let m = !1, g = !0;
        if (te(h))
          for (let C = 0; C < h.length; ++C) {
            const w = h[C], _ = ae(w) && w.name;
            if (_ === "Boolean") {
              m = !0;
              break;
            } else _ === "String" && (g = !1);
          }
        else
          m = ae(h) && h.name === "Boolean";
        f[
          0
          /* shouldCast */
        ] = m, f[
          1
          /* shouldCastTrue */
        ] = g, (m || ge(f, "default")) && a.push(d);
      }
    }
  const c = [o, a];
  return be(t) && i.set(t, c), c;
}
function No(t) {
  return t[0] !== "$" && !si(t);
}
const Ys = (t) => t === "_" || t === "_ctx" || t === "$stable", Js = (t) => te(t) ? t.map(Pt) : [Pt(t)], Jd = (t, e, n) => {
  if (e._n)
    return e;
  const i = q((...r) => Js(e(...r)), n);
  return i._c = !1, i;
}, iu = (t, e, n) => {
  const i = t._ctx;
  for (const r in t) {
    if (Ys(r)) continue;
    const s = t[r];
    if (ae(s))
      e[r] = Jd(r, s, i);
    else if (s != null) {
      const o = Js(s);
      e[r] = () => o;
    }
  }
}, ru = (t, e) => {
  const n = Js(e);
  t.slots.default = () => n;
}, su = (t, e, n) => {
  for (const i in e)
    (n || !Ys(i)) && (t[i] = e[i]);
}, Zd = (t, e, n) => {
  const i = t.slots = Ql();
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (su(i, e, n), n && Ja(i, "_", r, !0)) : iu(e, i);
  } else e && ru(t, e);
}, Qd = (t, e, n) => {
  const { vnode: i, slots: r } = t;
  let s = !0, o = me;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : su(r, e, n) : (s = !e.$stable, iu(e, r)), o = e;
  } else e && (ru(t, e), o = { default: 1 });
  if (s)
    for (const a in r)
      !Ys(a) && o[a] == null && delete r[a];
}, qe = sf;
function ef(t) {
  return tf(t);
}
function tf(t, e) {
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
    nextSibling: p,
    setScopeId: f = Mt,
    insertStaticContent: h
  } = t, m = (b, S, O, N = null, $ = null, F = null, K = void 0, V = null, j = !!S.dynamicChildren) => {
    if (b === S)
      return;
    b && !xn(b, S) && (N = G(b), Ae(b, $, F, !0), b = null), S.patchFlag === -2 && (j = !1, S.dynamicChildren = null);
    const { type: z, ref: ie, shapeFlag: Y } = S;
    switch (z) {
      case Or:
        g(b, S, O, N);
        break;
      case ze:
        C(b, S, O, N);
        break;
      case Vi:
        b == null && w(S, O, N, K);
        break;
      case Ee:
        P(
          b,
          S,
          O,
          N,
          $,
          F,
          K,
          V,
          j
        );
        break;
      default:
        Y & 1 ? E(
          b,
          S,
          O,
          N,
          $,
          F,
          K,
          V,
          j
        ) : Y & 6 ? W(
          b,
          S,
          O,
          N,
          $,
          F,
          K,
          V,
          j
        ) : (Y & 64 || Y & 128) && z.process(
          b,
          S,
          O,
          N,
          $,
          F,
          K,
          V,
          j,
          he
        );
    }
    ie != null && $ ? ui(ie, b && b.ref, F, S || b, !S) : ie == null && b && b.ref != null && ui(b.ref, null, F, b, !0);
  }, g = (b, S, O, N) => {
    if (b == null)
      i(
        S.el = a(S.children),
        O,
        N
      );
    else {
      const $ = S.el = b.el;
      S.children !== b.children && c($, S.children);
    }
  }, C = (b, S, O, N) => {
    b == null ? i(
      S.el = l(S.children || ""),
      O,
      N
    ) : S.el = b.el;
  }, w = (b, S, O, N) => {
    [b.el, b.anchor] = h(
      b.children,
      S,
      O,
      N,
      b.el,
      b.anchor
    );
  }, _ = ({ el: b, anchor: S }, O, N) => {
    let $;
    for (; b && b !== S; )
      $ = p(b), i(b, O, N), b = $;
    i(S, O, N);
  }, y = ({ el: b, anchor: S }) => {
    let O;
    for (; b && b !== S; )
      O = p(b), r(b), b = O;
    r(S);
  }, E = (b, S, O, N, $, F, K, V, j) => {
    if (S.type === "svg" ? K = "svg" : S.type === "math" && (K = "mathml"), b == null)
      T(
        S,
        O,
        N,
        $,
        F,
        K,
        V,
        j
      );
    else {
      const z = b.el && b.el._isVueCE ? b.el : null;
      try {
        z && z._beginPatch(), k(
          b,
          S,
          $,
          F,
          K,
          V,
          j
        );
      } finally {
        z && z._endPatch();
      }
    }
  }, T = (b, S, O, N, $, F, K, V) => {
    let j, z;
    const { props: ie, shapeFlag: Y, transition: ee, dirs: le } = b;
    if (j = b.el = o(
      b.type,
      F,
      ie && ie.is,
      ie
    ), Y & 8 ? u(j, b.children) : Y & 16 && R(
      b.children,
      j,
      null,
      N,
      $,
      Gr(b, F),
      K,
      V
    ), le && mn(b, null, N, "created"), x(j, b, b.scopeId, K, N), ie) {
      for (const xe in ie)
        xe !== "value" && !si(xe) && s(j, xe, null, ie[xe], F, N);
      "value" in ie && s(j, "value", null, ie.value, F), (z = ie.onVnodeBeforeMount) && Tt(z, N, b);
    }
    le && mn(b, null, N, "beforeMount");
    const pe = nf($, ee);
    pe && ee.beforeEnter(j), i(j, S, O), ((z = ie && ie.onVnodeMounted) || pe || le) && qe(() => {
      z && Tt(z, N, b), pe && ee.enter(j), le && mn(b, null, N, "mounted");
    }, $);
  }, x = (b, S, O, N, $) => {
    if (O && f(b, O), N)
      for (let F = 0; F < N.length; F++)
        f(b, N[F]);
    if ($) {
      let F = $.subTree;
      if (S === F || lu(F.type) && (F.ssContent === S || F.ssFallback === S)) {
        const K = $.vnode;
        x(
          b,
          K,
          K.scopeId,
          K.slotScopeIds,
          $.parent
        );
      }
    }
  }, R = (b, S, O, N, $, F, K, V, j = 0) => {
    for (let z = j; z < b.length; z++) {
      const ie = b[z] = V ? jt(b[z]) : Pt(b[z]);
      m(
        null,
        ie,
        S,
        O,
        N,
        $,
        F,
        K,
        V
      );
    }
  }, k = (b, S, O, N, $, F, K) => {
    const V = S.el = b.el;
    let { patchFlag: j, dynamicChildren: z, dirs: ie } = S;
    j |= b.patchFlag & 16;
    const Y = b.props || me, ee = S.props || me;
    let le;
    if (O && gn(O, !1), (le = ee.onVnodeBeforeUpdate) && Tt(le, O, S, b), ie && mn(S, b, O, "beforeUpdate"), O && gn(O, !0), (Y.innerHTML && ee.innerHTML == null || Y.textContent && ee.textContent == null) && u(V, ""), z ? A(
      b.dynamicChildren,
      z,
      V,
      O,
      N,
      Gr(S, $),
      F
    ) : K || Q(
      b,
      S,
      V,
      null,
      O,
      N,
      Gr(S, $),
      F,
      !1
    ), j > 0) {
      if (j & 16)
        I(V, Y, ee, O, $);
      else if (j & 2 && Y.class !== ee.class && s(V, "class", null, ee.class, $), j & 4 && s(V, "style", Y.style, ee.style, $), j & 8) {
        const pe = S.dynamicProps;
        for (let xe = 0; xe < pe.length; xe++) {
          const _e = pe[xe], Qe = Y[_e], et = ee[_e];
          (et !== Qe || _e === "value") && s(V, _e, Qe, et, $, O);
        }
      }
      j & 1 && b.children !== S.children && u(V, S.children);
    } else !K && z == null && I(V, Y, ee, O, $);
    ((le = ee.onVnodeUpdated) || ie) && qe(() => {
      le && Tt(le, O, S, b), ie && mn(S, b, O, "updated");
    }, N);
  }, A = (b, S, O, N, $, F, K) => {
    for (let V = 0; V < S.length; V++) {
      const j = b[V], z = S[V], ie = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        j.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (j.type === Ee || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !xn(j, z) || // - In the case of a component, it could contain anything.
        j.shapeFlag & 198) ? d(j.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          O
        )
      );
      m(
        j,
        z,
        ie,
        null,
        N,
        $,
        F,
        K,
        !0
      );
    }
  }, I = (b, S, O, N, $) => {
    if (S !== O) {
      if (S !== me)
        for (const F in S)
          !si(F) && !(F in O) && s(
            b,
            F,
            S[F],
            null,
            $,
            N
          );
      for (const F in O) {
        if (si(F)) continue;
        const K = O[F], V = S[F];
        K !== V && F !== "value" && s(b, F, V, K, $, N);
      }
      "value" in O && s(b, "value", S.value, O.value, $);
    }
  }, P = (b, S, O, N, $, F, K, V, j) => {
    const z = S.el = b ? b.el : a(""), ie = S.anchor = b ? b.anchor : a("");
    let { patchFlag: Y, dynamicChildren: ee, slotScopeIds: le } = S;
    le && (V = V ? V.concat(le) : le), b == null ? (i(z, O, N), i(ie, O, N), R(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      S.children || [],
      O,
      ie,
      $,
      F,
      K,
      V,
      j
    )) : Y > 0 && Y & 64 && ee && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    b.dynamicChildren && b.dynamicChildren.length === ee.length ? (A(
      b.dynamicChildren,
      ee,
      O,
      $,
      F,
      K,
      V
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (S.key != null || $ && S === $.subTree) && Zs(
      b,
      S,
      !0
      /* shallow */
    )) : Q(
      b,
      S,
      O,
      ie,
      $,
      F,
      K,
      V,
      j
    );
  }, W = (b, S, O, N, $, F, K, V, j) => {
    S.slotScopeIds = V, b == null ? S.shapeFlag & 512 ? $.ctx.activate(
      S,
      O,
      N,
      K,
      j
    ) : D(
      S,
      O,
      N,
      $,
      F,
      K,
      j
    ) : U(b, S, j);
  }, D = (b, S, O, N, $, F, K) => {
    const V = b.component = df(
      b,
      N,
      $
    );
    if (kr(b) && (V.ctx.renderer = he), ff(V, !1, K), V.asyncDep) {
      if ($ && $.registerDep(V, ne, K), !b.el) {
        const j = V.subTree = H(ze);
        C(null, j, S, O), b.placeholder = j.el;
      }
    } else
      ne(
        V,
        b,
        S,
        O,
        $,
        F,
        K
      );
  }, U = (b, S, O) => {
    const N = S.component = b.component;
    if (Ud(b, S, O))
      if (N.asyncDep && !N.asyncResolved) {
        J(N, S, O);
        return;
      } else
        N.next = S, N.update();
    else
      S.el = b.el, N.vnode = S;
  }, ne = (b, S, O, N, $, F, K) => {
    const V = () => {
      if (b.isMounted) {
        let { next: Y, bu: ee, u: le, parent: pe, vnode: xe } = b;
        {
          const Ct = ou(b);
          if (Ct) {
            Y && (Y.el = xe.el, J(b, Y, K)), Ct.asyncDep.then(() => {
              qe(() => {
                b.isUnmounted || z();
              }, $);
            });
            return;
          }
        }
        let _e = Y, Qe;
        gn(b, !1), Y ? (Y.el = xe.el, J(b, Y, K)) : Y = xe, ee && Hr(ee), (Qe = Y.props && Y.props.onVnodeBeforeUpdate) && Tt(Qe, pe, Y, xe), gn(b, !0);
        const et = Fo(b), St = b.subTree;
        b.subTree = et, m(
          St,
          et,
          // parent may have changed if it's in a teleport
          d(St.el),
          // anchor may have changed if it's in a fragment
          G(St),
          b,
          $,
          F
        ), Y.el = et.el, _e === null && Kd(b, et.el), le && qe(le, $), (Qe = Y.props && Y.props.onVnodeUpdated) && qe(
          () => Tt(Qe, pe, Y, xe),
          $
        );
      } else {
        let Y;
        const { el: ee, props: le } = S, { bm: pe, m: xe, parent: _e, root: Qe, type: et } = b, St = qn(S);
        gn(b, !1), pe && Hr(pe), !St && (Y = le && le.onVnodeBeforeMount) && Tt(Y, _e, S), gn(b, !0);
        {
          Qe.ce && Qe.ce._hasShadowRoot() && Qe.ce._injectChildStyle(et);
          const Ct = b.subTree = Fo(b);
          m(
            null,
            Ct,
            O,
            N,
            b,
            $,
            F
          ), S.el = Ct.el;
        }
        if (xe && qe(xe, $), !St && (Y = le && le.onVnodeMounted)) {
          const Ct = S;
          qe(
            () => Tt(Y, _e, Ct),
            $
          );
        }
        (S.shapeFlag & 256 || _e && qn(_e.vnode) && _e.vnode.shapeFlag & 256) && b.a && qe(b.a, $), b.isMounted = !0, S = O = N = null;
      }
    };
    b.scope.on();
    const j = b.effect = new rl(V);
    b.scope.off();
    const z = b.update = j.run.bind(j), ie = b.job = j.runIfDirty.bind(j);
    ie.i = b, ie.id = b.uid, j.scheduler = () => Gs(ie), gn(b, !0), z();
  }, J = (b, S, O) => {
    S.component = b;
    const N = b.vnode.props;
    b.vnode = S, b.next = null, Gd(b, S.props, N, O), Qd(b, S.children, O), Gt(), ko(b), Yt();
  }, Q = (b, S, O, N, $, F, K, V, j = !1) => {
    const z = b && b.children, ie = b ? b.shapeFlag : 0, Y = S.children, { patchFlag: ee, shapeFlag: le } = S;
    if (ee > 0) {
      if (ee & 128) {
        Le(
          z,
          Y,
          O,
          N,
          $,
          F,
          K,
          V,
          j
        );
        return;
      } else if (ee & 256) {
        we(
          z,
          Y,
          O,
          N,
          $,
          F,
          K,
          V,
          j
        );
        return;
      }
    }
    le & 8 ? (ie & 16 && Nt(z, $, F), Y !== z && u(O, Y)) : ie & 16 ? le & 16 ? Le(
      z,
      Y,
      O,
      N,
      $,
      F,
      K,
      V,
      j
    ) : Nt(z, $, F, !0) : (ie & 8 && u(O, ""), le & 16 && R(
      Y,
      O,
      N,
      $,
      F,
      K,
      V,
      j
    ));
  }, we = (b, S, O, N, $, F, K, V, j) => {
    b = b || Fn, S = S || Fn;
    const z = b.length, ie = S.length, Y = Math.min(z, ie);
    let ee;
    for (ee = 0; ee < Y; ee++) {
      const le = S[ee] = j ? jt(S[ee]) : Pt(S[ee]);
      m(
        b[ee],
        le,
        O,
        null,
        $,
        F,
        K,
        V,
        j
      );
    }
    z > ie ? Nt(
      b,
      $,
      F,
      !0,
      !1,
      Y
    ) : R(
      S,
      O,
      N,
      $,
      F,
      K,
      V,
      j,
      Y
    );
  }, Le = (b, S, O, N, $, F, K, V, j) => {
    let z = 0;
    const ie = S.length;
    let Y = b.length - 1, ee = ie - 1;
    for (; z <= Y && z <= ee; ) {
      const le = b[z], pe = S[z] = j ? jt(S[z]) : Pt(S[z]);
      if (xn(le, pe))
        m(
          le,
          pe,
          O,
          null,
          $,
          F,
          K,
          V,
          j
        );
      else
        break;
      z++;
    }
    for (; z <= Y && z <= ee; ) {
      const le = b[Y], pe = S[ee] = j ? jt(S[ee]) : Pt(S[ee]);
      if (xn(le, pe))
        m(
          le,
          pe,
          O,
          null,
          $,
          F,
          K,
          V,
          j
        );
      else
        break;
      Y--, ee--;
    }
    if (z > Y) {
      if (z <= ee) {
        const le = ee + 1, pe = le < ie ? S[le].el : N;
        for (; z <= ee; )
          m(
            null,
            S[z] = j ? jt(S[z]) : Pt(S[z]),
            O,
            pe,
            $,
            F,
            K,
            V,
            j
          ), z++;
      }
    } else if (z > ee)
      for (; z <= Y; )
        Ae(b[z], $, F, !0), z++;
    else {
      const le = z, pe = z, xe = /* @__PURE__ */ new Map();
      for (z = pe; z <= ee; z++) {
        const it = S[z] = j ? jt(S[z]) : Pt(S[z]);
        it.key != null && xe.set(it.key, z);
      }
      let _e, Qe = 0;
      const et = ee - pe + 1;
      let St = !1, Ct = 0;
      const Jn = new Array(et);
      for (z = 0; z < et; z++) Jn[z] = 0;
      for (z = le; z <= Y; z++) {
        const it = b[z];
        if (Qe >= et) {
          Ae(it, $, F, !0);
          continue;
        }
        let Et;
        if (it.key != null)
          Et = xe.get(it.key);
        else
          for (_e = pe; _e <= ee; _e++)
            if (Jn[_e - pe] === 0 && xn(it, S[_e])) {
              Et = _e;
              break;
            }
        Et === void 0 ? Ae(it, $, F, !0) : (Jn[Et - pe] = z + 1, Et >= Ct ? Ct = Et : St = !0, m(
          it,
          S[Et],
          O,
          null,
          $,
          F,
          K,
          V,
          j
        ), Qe++);
      }
      const bo = St ? rf(Jn) : Fn;
      for (_e = bo.length - 1, z = et - 1; z >= 0; z--) {
        const it = pe + z, Et = S[it], wo = S[it + 1], _o = it + 1 < ie ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          wo.el || au(wo)
        ) : N;
        Jn[z] === 0 ? m(
          null,
          Et,
          O,
          _o,
          $,
          F,
          K,
          V,
          j
        ) : St && (_e < 0 || z !== bo[_e] ? Ze(Et, O, _o, 2) : _e--);
      }
    }
  }, Ze = (b, S, O, N, $ = null) => {
    const { el: F, type: K, transition: V, children: j, shapeFlag: z } = b;
    if (z & 6) {
      Ze(b.component.subTree, S, O, N);
      return;
    }
    if (z & 128) {
      b.suspense.move(S, O, N);
      return;
    }
    if (z & 64) {
      K.move(b, S, O, he);
      return;
    }
    if (K === Ee) {
      i(F, S, O);
      for (let Y = 0; Y < j.length; Y++)
        Ze(j[Y], S, O, N);
      i(b.anchor, S, O);
      return;
    }
    if (K === Vi) {
      _(b, S, O);
      return;
    }
    if (N !== 2 && z & 1 && V)
      if (N === 0)
        V.beforeEnter(F), i(F, S, O), qe(() => V.enter(F), $);
      else {
        const { leave: Y, delayLeave: ee, afterLeave: le } = V, pe = () => {
          b.ctx.isUnmounted ? r(F) : i(F, S, O);
        }, xe = () => {
          F._isLeaving && F[At](
            !0
            /* cancelled */
          ), Y(F, () => {
            pe(), le && le();
          });
        };
        ee ? ee(F, pe, xe) : xe();
      }
    else
      i(F, S, O);
  }, Ae = (b, S, O, N = !1, $ = !1) => {
    const {
      type: F,
      props: K,
      ref: V,
      children: j,
      dynamicChildren: z,
      shapeFlag: ie,
      patchFlag: Y,
      dirs: ee,
      cacheIndex: le
    } = b;
    if (Y === -2 && ($ = !1), V != null && (Gt(), ui(V, null, O, b, !0), Yt()), le != null && (S.renderCache[le] = void 0), ie & 256) {
      S.ctx.deactivate(b);
      return;
    }
    const pe = ie & 1 && ee, xe = !qn(b);
    let _e;
    if (xe && (_e = K && K.onVnodeBeforeUnmount) && Tt(_e, S, b), ie & 6)
      Yn(b.component, O, N);
    else {
      if (ie & 128) {
        b.suspense.unmount(O, N);
        return;
      }
      pe && mn(b, null, S, "beforeUnmount"), ie & 64 ? b.type.remove(
        b,
        S,
        O,
        he,
        N
      ) : z && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !z.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (F !== Ee || Y > 0 && Y & 64) ? Nt(
        z,
        S,
        O,
        !1,
        !0
      ) : (F === Ee && Y & 384 || !$ && ie & 16) && Nt(j, S, O), N && Ft(b);
    }
    (xe && (_e = K && K.onVnodeUnmounted) || pe) && qe(() => {
      _e && Tt(_e, S, b), pe && mn(b, null, S, "unmounted");
    }, O);
  }, Ft = (b) => {
    const { type: S, el: O, anchor: N, transition: $ } = b;
    if (S === Ee) {
      zt(O, N);
      return;
    }
    if (S === Vi) {
      y(b);
      return;
    }
    const F = () => {
      r(O), $ && !$.persisted && $.afterLeave && $.afterLeave();
    };
    if (b.shapeFlag & 1 && $ && !$.persisted) {
      const { leave: K, delayLeave: V } = $, j = () => K(O, F);
      V ? V(b.el, F, j) : j();
    } else
      F();
  }, zt = (b, S) => {
    let O;
    for (; b !== S; )
      O = p(b), r(b), b = O;
    r(S);
  }, Yn = (b, S, O) => {
    const { bum: N, scope: $, job: F, subTree: K, um: V, m: j, a: z } = b;
    qo(j), qo(z), N && Hr(N), $.stop(), F && (F.flags |= 8, Ae(K, b, S, O)), V && qe(V, S), qe(() => {
      b.isUnmounted = !0;
    }, S);
  }, Nt = (b, S, O, N = !1, $ = !1, F = 0) => {
    for (let K = F; K < b.length; K++)
      Ae(b[K], S, O, N, $);
  }, G = (b) => {
    if (b.shapeFlag & 6)
      return G(b.component.subTree);
    if (b.shapeFlag & 128)
      return b.suspense.next();
    const S = p(b.anchor || b.el), O = S && S[Rl];
    return O ? p(O) : S;
  };
  let re = !1;
  const ue = (b, S, O) => {
    let N;
    b == null ? S._vnode && (Ae(S._vnode, null, null, !0), N = S._vnode.component) : m(
      S._vnode || null,
      b,
      S,
      null,
      null,
      null,
      O
    ), S._vnode = b, re || (re = !0, ko(N), kl(), re = !1);
  }, he = {
    p: m,
    um: Ae,
    m: Ze,
    r: Ft,
    mt: D,
    mc: R,
    pc: Q,
    pbc: A,
    n: G,
    o: t
  };
  return {
    render: ue,
    hydrate: void 0,
    createApp: Nd(ue)
  };
}
function Gr({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function gn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function nf(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function Zs(t, e, n = !1) {
  const i = t.children, r = e.children;
  if (te(i) && te(r))
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let a = r[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[s] = jt(r[s]), a.el = o.el), !n && a.patchFlag !== -2 && Zs(o, a)), a.type === Or && (a.patchFlag === -1 && (a = r[s] = jt(a)), a.el = o.el), a.type === ze && !a.el && (a.el = o.el);
    }
}
function rf(t) {
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
function ou(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : ou(e);
}
function qo(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function au(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? au(e.subTree) : null;
}
const lu = (t) => t.__isSuspense;
function sf(t, e) {
  e && e.pendingBranch ? te(t) ? e.effects.push(...t) : e.effects.push(t) : ad(t);
}
const Ee = /* @__PURE__ */ Symbol.for("v-fgt"), Or = /* @__PURE__ */ Symbol.for("v-txt"), ze = /* @__PURE__ */ Symbol.for("v-cmt"), Vi = /* @__PURE__ */ Symbol.for("v-stc"), di = [];
let Ge = null;
function M(t = !1) {
  di.push(Ge = t ? null : []);
}
function of() {
  di.pop(), Ge = di[di.length - 1] || null;
}
let Vn = 1;
function sr(t, e = !1) {
  Vn += t, t < 0 && Ge && e && (Ge.hasOnce = !0);
}
function uu(t) {
  return t.dynamicChildren = Vn > 0 ? Ge || Fn : null, of(), Vn > 0 && Ge && Ge.push(t), t;
}
function oe(t, e, n, i, r, s) {
  return uu(
    se(
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
function X(t, e, n, i, r) {
  return uu(
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
function yi(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function xn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const cu = ({ key: t }) => t ?? null, Ui = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Te(t) || /* @__PURE__ */ De(t) || ae(t) ? { i: Ne, r: t, k: e, f: !!n } : t : null);
function se(t, e = null, n = null, i = 0, r = null, s = t === Ee ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && cu(e),
    ref: e && Ui(e),
    scopeId: Pl,
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
  return a ? (Qs(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= Te(n) ? 8 : 16), Vn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ge && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ge.push(l), l;
}
const H = af;
function af(t, e = null, n = null, i = 0, r = null, s = !1) {
  if ((!t || t === jl) && (t = ze), yi(t)) {
    const a = Zt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Qs(a, n), Vn > 0 && !s && Ge && (a.shapeFlag & 6 ? Ge[Ge.indexOf(t)] = a : Ge.push(a)), a.patchFlag = -2, a;
  }
  if (mf(t) && (t = t.__vccOpts), e) {
    e = Mr(e);
    let { class: a, style: l } = e;
    a && !Te(a) && (e.class = Xt(a)), be(l) && (/* @__PURE__ */ Er(l) && !te(l) && (l = ke({}, l)), e.style = Dt(l));
  }
  const o = Te(t) ? 1 : lu(t) ? 128 : Il(t) ? 64 : be(t) ? 4 : ae(t) ? 2 : 0;
  return se(
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
function Mr(t) {
  return t ? /* @__PURE__ */ Er(t) || eu(t) ? ke({}, t) : t : null;
}
function Zt(t, e, n = !1, i = !1) {
  const { props: r, ref: s, patchFlag: o, children: a, transition: l } = t, c = e ? Ce(r || {}, e) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && cu(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? te(s) ? s.concat(Ui(e)) : [s, Ui(e)] : Ui(e)
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
    ssContent: t.ssContent && Zt(t.ssContent),
    ssFallback: t.ssFallback && Zt(t.ssFallback),
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
function Be(t = " ", e = 0) {
  return H(Or, null, t, e);
}
function lf(t, e) {
  const n = H(Vi, null, t);
  return n.staticCount = e, n;
}
function fe(t = "", e = !1) {
  return e ? (M(), X(ze, null, t)) : H(ze, null, t);
}
function Pt(t) {
  return t == null || typeof t == "boolean" ? H(ze) : te(t) ? H(
    Ee,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : yi(t) ? jt(t) : H(Or, null, String(t));
}
function jt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Zt(t);
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
      !r && !eu(e) ? e._ctx = Ne : r === 3 && Ne && (Ne.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else ae(e) ? (e = { default: e, _ctx: Ne }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Be(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function Ce(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const r in i)
      if (r === "class")
        e.class !== i.class && (e.class = Xt([e.class, i.class]));
      else if (r === "style")
        e.style = Dt([e.style, i.style]);
      else if (hr(r)) {
        const s = e[r], o = i[r];
        o && s !== o && !(te(s) && s.includes(o)) && (e[r] = s ? [].concat(s, o) : o);
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
const uf = Xl();
let cf = 0;
function df(t, e, n) {
  const i = t.type, r = (e ? e.appContext : t.appContext) || uf, s = {
    uid: cf++,
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
    scope: new tl(
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
    propsOptions: nu(i, r),
    emitsOptions: Yl(i, r),
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Hd.bind(null, s), t.ce && t.ce(s), s;
}
let je = null;
const at = () => je || Ne;
let or, Ts;
{
  const t = br(), e = (n, i) => {
    let r;
    return (r = t[n]) || (r = t[n] = []), r.push(i), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  or = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => je = n
  ), Ts = e(
    "__VUE_SSR_SETTERS__",
    (n) => bi = n
  );
}
const Oi = (t) => {
  const e = je;
  return or(t), t.scope.on(), () => {
    t.scope.off(), or(e);
  };
}, Ho = () => {
  je && je.scope.off(), or(null);
};
function du(t) {
  return t.vnode.shapeFlag & 4;
}
let bi = !1;
function ff(t, e = !1, n = !1) {
  e && Ts(e);
  const { props: i, children: r } = t.vnode, s = du(t);
  Xd(t, i, s, e), Zd(t, r, n || e);
  const o = s ? pf(t, e) : void 0;
  return e && Ts(!1), o;
}
function pf(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Od);
  const { setup: i } = n;
  if (i) {
    Gt();
    const r = t.setupContext = i.length > 1 ? pu(t) : null, s = Oi(t), o = Ai(
      i,
      t,
      0,
      [
        t.props,
        r
      ]
    ), a = Ga(o);
    if (Yt(), s(), (a || t.sp) && !qn(t) && Hl(t), a) {
      if (o.then(Ho, Ho), e)
        return o.then((l) => {
          Wo(t, l);
        }).catch((l) => {
          Tr(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Wo(t, o);
  } else
    fu(t);
}
function Wo(t, e, n) {
  ae(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = xl(e)), fu(t);
}
function fu(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || Mt);
  {
    const r = Oi(t);
    Gt();
    try {
      Ld(t);
    } finally {
      Yt(), r();
    }
  }
}
const hf = {
  get(t, e) {
    return We(t, "get", ""), t[e];
  }
};
function pu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, hf),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Rr(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(xl(wl(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in ci)
        return ci[n](t);
    },
    has(e, n) {
      return n in e || n in ci;
    }
  })) : t.proxy;
}
function vf(t, e = !0) {
  return ae(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function mf(t) {
  return ae(t) && "__vccOpts" in t;
}
const L = (t, e) => /* @__PURE__ */ nd(t, e, bi);
function gt(t, e, n) {
  try {
    sr(-1);
    const i = arguments.length;
    return i === 2 ? be(e) && !te(e) ? yi(e) ? H(t, null, [e]) : H(t, e) : H(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && yi(n) && (n = [n]), H(t, e, n));
  } finally {
    sr(1);
  }
}
function gf(t, e, n, i) {
  const r = n[i];
  if (r && yf(r, t))
    return r;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = i, n[i] = s;
}
function yf(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Ue(n[i], e[i]))
      return !1;
  return Vn > 0 && Ge && Ge.push(t), !0;
}
const bf = "3.5.28";
let ks;
const jo = typeof window < "u" && window.trustedTypes;
if (jo)
  try {
    ks = /* @__PURE__ */ jo.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const hu = ks ? (t) => ks.createHTML(t) : (t) => t, wf = "http://www.w3.org/2000/svg", _f = "http://www.w3.org/1998/Math/MathML", Wt = typeof document < "u" ? document : null, Vo = Wt && /* @__PURE__ */ Wt.createElement("template"), xf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const r = e === "svg" ? Wt.createElementNS(wf, t) : e === "mathml" ? Wt.createElementNS(_f, t) : n ? Wt.createElement(t, { is: n }) : Wt.createElement(t);
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
      Vo.innerHTML = hu(
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
}, rn = "transition", ei = "animation", wi = /* @__PURE__ */ Symbol("_vtc"), vu = {
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
}, Sf = /* @__PURE__ */ ke(
  {},
  $l,
  vu
), Cf = (t) => (t.displayName = "Transition", t.props = Sf, t), mu = /* @__PURE__ */ Cf(
  (t, { slots: e }) => gt(md, Ef(t), e)
), yn = (t, e = []) => {
  te(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Uo = (t) => t ? te(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Ef(t) {
  const e = {};
  for (const P in t)
    P in vu || (e[P] = t[P]);
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
  } = t, h = Tf(r), m = h && h[0], g = h && h[1], {
    onBeforeEnter: C,
    onEnter: w,
    onEnterCancelled: _,
    onLeave: y,
    onLeaveCancelled: E,
    onBeforeAppear: T = C,
    onAppear: x = w,
    onAppearCancelled: R = _
  } = e, k = (P, W, D, U) => {
    P._enterCancelled = U, bn(P, W ? u : a), bn(P, W ? c : o), D && D();
  }, A = (P, W) => {
    P._isLeaving = !1, bn(P, d), bn(P, f), bn(P, p), W && W();
  }, I = (P) => (W, D) => {
    const U = P ? x : w, ne = () => k(W, P, D);
    yn(U, [W, ne]), Ko(() => {
      bn(W, P ? l : s), Ht(W, P ? u : a), Uo(U) || Xo(W, i, m, ne);
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
    onLeave(P, W) {
      P._isLeaving = !0;
      const D = () => A(P, W);
      Ht(P, d), P._enterCancelled ? (Ht(P, p), Jo(P)) : (Jo(P), Ht(P, p)), Ko(() => {
        P._isLeaving && (bn(P, d), Ht(P, f), Uo(y) || Xo(P, i, g, D));
      }), yn(y, [P, D]);
    },
    onEnterCancelled(P) {
      k(P, !1, void 0, !0), yn(_, [P]);
    },
    onAppearCancelled(P) {
      k(P, !0, void 0, !0), yn(R, [P]);
    },
    onLeaveCancelled(P) {
      A(P), yn(E, [P]);
    }
  });
}
function Tf(t) {
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
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[wi] || (t[wi] = /* @__PURE__ */ new Set())).add(e);
}
function bn(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[wi];
  n && (n.delete(e), n.size || (t[wi] = void 0));
}
function Ko(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let kf = 0;
function Xo(t, e, n, i) {
  const r = t._endId = ++kf, s = () => {
    r === t._endId && i();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Af(t, e);
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
function Af(t, e) {
  const n = window.getComputedStyle(t), i = (h) => (n[h] || "").split(", "), r = i(`${rn}Delay`), s = i(`${rn}Duration`), o = Go(r, s), a = i(`${ei}Delay`), l = i(`${ei}Duration`), c = Go(a, l);
  let u = null, d = 0, p = 0;
  e === rn ? o > 0 && (u = rn, d = o, p = s.length) : e === ei ? c > 0 && (u = ei, d = c, p = l.length) : (d = Math.max(o, c), u = d > 0 ? o > c ? rn : ei : null, p = u ? u === rn ? s.length : l.length : 0);
  const f = u === rn && /\b(?:transform|all)(?:,|$)/.test(
    i(`${rn}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: p,
    hasTransform: f
  };
}
function Go(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => Yo(n) + Yo(t[i])));
}
function Yo(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Jo(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function Pf(t, e, n) {
  const i = t[wi];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const ar = /* @__PURE__ */ Symbol("_vod"), gu = /* @__PURE__ */ Symbol("_vsh"), Of = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[ar] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : ti(t, e);
  },
  mounted(t, { value: e }, { transition: n }) {
    n && e && n.enter(t);
  },
  updated(t, { value: e, oldValue: n }, { transition: i }) {
    !e != !n && (i ? e ? (i.beforeEnter(t), ti(t, !0), i.enter(t)) : i.leave(t, () => {
      ti(t, !1);
    }) : ti(t, e));
  },
  beforeUnmount(t, { value: e }) {
    ti(t, e);
  }
};
function ti(t, e) {
  t.style.display = e ? t[ar] : "none", t[gu] = !e;
}
const Mf = /* @__PURE__ */ Symbol(""), Rf = /(?:^|;)\s*display\s*:/;
function If(t, e, n) {
  const i = t.style, r = Te(n);
  let s = !1;
  if (n && !r) {
    if (e)
      if (Te(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && Ki(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && Ki(i, o, "");
    for (const o in n)
      o === "display" && (s = !0), Ki(i, o, n[o]);
  } else if (r) {
    if (e !== n) {
      const o = i[Mf];
      o && (n += ";" + o), i.cssText = n, s = Rf.test(n);
    }
  } else e && t.removeAttribute("style");
  ar in t && (t[ar] = s ? i.display : "", t[gu] && (i.display = "none"));
}
const Zo = /\s*!important$/;
function Ki(t, e, n) {
  if (te(n))
    n.forEach((i) => Ki(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Lf(t, e);
    Zo.test(n) ? t.setProperty(
      nt(i),
      n.replace(Zo, ""),
      "important"
    ) : t[i] = n;
  }
}
const Qo = ["Webkit", "Moz", "ms"], Jr = {};
function Lf(t, e) {
  const n = Jr[e];
  if (n)
    return n;
  let i = $e(e);
  if (i !== "filter" && i in t)
    return Jr[e] = i;
  i = yr(i);
  for (let r = 0; r < Qo.length; r++) {
    const s = Qo[r] + i;
    if (s in t)
      return Jr[e] = s;
  }
  return e;
}
const ea = "http://www.w3.org/1999/xlink";
function ta(t, e, n, i, r, s = Pc(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(ea, e.slice(6, e.length)) : t.setAttributeNS(ea, e, n) : n == null || s && !Za(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : yt(n) ? String(n) : n
  );
}
function na(t, e, n, i, r) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? hu(n) : n);
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
    a === "boolean" ? n = Za(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(r || e);
}
function Df(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function $f(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const ia = /* @__PURE__ */ Symbol("_vei");
function Bf(t, e, n, i, r = null) {
  const s = t[ia] || (t[ia] = {}), o = s[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Ff(e);
    if (i) {
      const c = s[e] = qf(
        i,
        r
      );
      Df(t, a, c, l);
    } else o && ($f(t, a, o, l), s[e] = void 0);
  }
}
const ra = /(?:Once|Passive|Capture)$/;
function Ff(t) {
  let e;
  if (ra.test(t)) {
    e = {};
    let i;
    for (; i = t.match(ra); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : nt(t.slice(2)), e];
}
let Zr = 0;
const zf = /* @__PURE__ */ Promise.resolve(), Nf = () => Zr || (zf.then(() => Zr = 0), Zr = Date.now());
function qf(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    wt(
      Hf(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = Nf(), n;
}
function Hf(t, e) {
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
const sa = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, Wf = (t, e, n, i, r, s) => {
  const o = r === "svg";
  e === "class" ? Pf(t, i, o) : e === "style" ? If(t, n, i) : hr(e) ? qs(e) || Bf(t, e, n, i, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : jf(t, e, i, o)) ? (na(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && ta(t, e, i, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !Te(i)) ? na(t, $e(e), i, s, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), ta(t, e, i, o));
};
function jf(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && sa(e) && ae(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const r = t.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return sa(e) && Te(n) ? !1 : e in t;
}
const oa = {};
// @__NO_SIDE_EFFECTS__
function Vf(t, e, n) {
  let i = /* @__PURE__ */ Z(t, e);
  vr(i) && (i = ke({}, i, e));
  class r extends eo {
    constructor(o) {
      super(i, o, n);
    }
  }
  return r.def = i, r;
}
const Uf = typeof HTMLElement < "u" ? HTMLElement : class {
};
class eo extends Uf {
  constructor(e, n = {}, i = la) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== la ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
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
    let i = n ? this.getAttribute(e) : oa;
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
    if (n !== this._props[e] && (this._dirty = !0, n === oa ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), i)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(nt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(nt(e), n + "") : n || this.removeAttribute(nt(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), Jf(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = H(this._def, ke(e, this._props));
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
const Kf = ["ctrl", "shift", "alt", "meta"], Xf = {
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
  exact: (t, e) => Kf.some((n) => t[`${n}Key`] && !e.includes(n))
}, un = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((r, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = Xf[e[o]];
      if (a && a(r, e)) return;
    }
    return t(r, ...s);
  }));
}, Gf = {
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
    const s = nt(r.key);
    if (e.some(
      (o) => o === s || Gf[o] === s
    ))
      return t(r);
  }));
}, Yf = /* @__PURE__ */ ke({ patchProp: Wf }, xf);
let aa;
function yu() {
  return aa || (aa = ef(Yf));
}
const Jf = ((...t) => {
  yu().render(...t);
}), la = ((...t) => {
  const e = yu().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const r = Qf(i);
    if (!r) return;
    const s = e._component;
    !ae(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, Zf(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, e;
});
function Zf(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function Qf(t) {
  return Te(t) ? document.querySelector(t) : t;
}
const ep = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ua = (t) => t === "";
const tp = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const ca = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const np = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const ip = (t) => {
  const e = np(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var ni = {
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
const rp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": s,
  size: o = ni.width,
  color: a = ni.stroke,
  ...l
}, { slots: c }) => gt(
  "svg",
  {
    ...ni,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": ua(n) || ua(i) || n === !0 || i === !0 ? Number(r || s || ni["stroke-width"]) * 24 / Number(o) : r || s || ni["stroke-width"],
    class: tp(
      "lucide",
      l.class,
      ...t ? [`lucide-${ca(ip(t))}-icon`, `lucide-${ca(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !ep(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => gt(...u)), ...c.default ? [c.default()] : []]
);
const Je = (t, e) => (n, { slots: i, attrs: r }) => gt(
  rp,
  {
    ...r,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const sp = Je("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const to = Je("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const op = Je("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ap = Je("clipboard-list", [
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
const lp = Je("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const da = Je("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const up = Je("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const cp = Je("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const dp = Je("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const fp = Je("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const pp = Je("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const hp = Je("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const vp = Je("volume-2", [
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
const mp = Je("volume-x", [
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
const no = Je("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), gp = ["aria-label"], yp = /* @__PURE__ */ Z({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), oe("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ce(e.$slots, "default", {}, void 0, !0)
    ], 8, gp));
  }
}), bp = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", Fe = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, r] of e)
    n[i] = r;
  return n;
}, Ps = /* @__PURE__ */ Fe(yp, [["styles", [bp]], ["__scopeId", "data-v-3d3f8eba"]]), wp = ["disabled", "aria-label"], _p = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, xp = /* @__PURE__ */ Z({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary", type: String },
    size: { default: "md", type: String },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = Md(), i = L(() => !!n.icon && !n.default), r = L(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (M(), oe("button", {
      type: "button",
      class: Xt(r.value),
      disabled: t.disabled,
      "aria-label": t.ariaLabel
    }, [
      s.$slots.icon ? (M(), oe("span", _p, [
        ce(s.$slots, "icon", {}, void 0, !0)
      ])) : fe("", !0),
      ce(s.$slots, "default", {}, void 0, !0)
    ], 10, wp));
  }
}), Sp = ".editor-btn[data-v-9ebbb489]{display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-xs);font-family:var(--font-family);font-weight:500;border:none;border-radius:var(--radius-md);cursor:pointer;transition:background-color var(--transition-duration),color var(--transition-duration);white-space:nowrap}.editor-btn[data-v-9ebbb489]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-9ebbb489]:disabled{opacity:.5;cursor:default;pointer-events:none}.editor-btn--sm[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-xs);height:28px}.editor-btn--md[data-v-9ebbb489]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-sm);height:32px}.editor-btn--sm .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:14px;height:14px}.editor-btn--md .editor-btn__icon[data-v-9ebbb489]{display:inline-flex;width:16px;height:16px}.editor-btn--icon-only.editor-btn--sm[data-v-9ebbb489]{width:28px;padding:0}.editor-btn--icon-only.editor-btn--md[data-v-9ebbb489]{width:32px;padding:0}.editor-btn--primary[data-v-9ebbb489]{color:var(--color-white);background-color:var(--color-primary)}.editor-btn--primary[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-primary-hover)}.editor-btn--secondary[data-v-9ebbb489],.editor-btn--ghost[data-v-9ebbb489]{color:var(--color-text-secondary);background:none}.editor-btn--secondary[data-v-9ebbb489]{border:1px solid var(--color-border)}.editor-btn--secondary[data-v-9ebbb489]:hover:not(:disabled),.editor-btn--ghost[data-v-9ebbb489]:hover:not(:disabled){background-color:var(--color-surface-hover)}", ct = /* @__PURE__ */ Fe(xp, [["styles", [Sp]], ["__scopeId", "data-v-9ebbb489"]]), bu = {
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
  "selection.copyWithMetadata": "Copier avec métadonnées",
  "selection.cancel": "Annuler",
  "selection.select": "Sélectionner {name}",
  "selection.deselect": "Désélectionner {name}"
}, Cp = {
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
  "selection.copyWithMetadata": "Copy with metadata",
  "selection.cancel": "Cancel",
  "selection.select": "Select {name}",
  "selection.deselect": "Deselect {name}"
}, fa = { fr: bu, en: Cp }, wu = /* @__PURE__ */ Symbol("i18n");
function Ep(t) {
  const e = L(() => {
    const i = fa[t.value] ?? fa.fr;
    return (r) => i[r] ?? r;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return Xn(wu, n), n;
}
function pt() {
  const t = Kt(wu);
  if (t) return t;
  const e = L(() => "fr");
  return {
    t: (n) => bu[n] ?? n,
    locale: e
  };
}
function Tp(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), r = parseInt(n.substring(2, 4), 16), s = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${s}, ${e})`;
}
function io(t, e, n = "*") {
  if (t === "*") return n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(t) ?? t;
  } catch {
    return t;
  }
}
function _u(t, e, n, i = "*") {
  return t.map((r) => ({
    value: r.id,
    label: r.languages.map((s) => io(s, e, i)).join(", ") + (r.isSource ? ` (${n})` : "")
  }));
}
function kp(t, e = 250) {
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
function _i(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, s = String(i).padStart(2, "0"), o = String(r).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class tt extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Ap(t) {
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
function Pp(t, e) {
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
function Op(t, e) {
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
const Mp = { class: "editor-header" }, Rp = { class: "header-left" }, Ip = { class: "document-title" }, Lp = { class: "badges" }, Dp = ["datetime"], $p = { class: "header-right" }, Bp = /* @__PURE__ */ Z({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = pt(), r = L(() => io(e.language, i.value, n("language.wildcard"))), s = L(() => _i(e.duration)), o = L(() => e.title.replace(/-/g, " "));
    return (a, l) => (M(), oe("header", Mp, [
      se("div", Rp, [
        se("h1", Ip, de(o.value), 1),
        se("div", Lp, [
          H(Ps, null, {
            default: q(() => [
              Be(de(r.value), 1)
            ]),
            _: 1
          }),
          H(Ps, null, {
            default: q(() => [
              se("time", {
                datetime: `PT${t.duration}S`
              }, de(s.value), 9, Dp)
            ]),
            _: 1
          })
        ])
      ]),
      se("div", $p, [
        t.isMobile ? (M(), X(ct, {
          key: 0,
          variant: "ghost",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: q(() => [
            H(v(hp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : fe("", !0),
        t.isMobile ? (M(), X(ct, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, {
          icon: q(() => [
            H(v(da), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (M(), X(ct, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: q(() => [
            H(v(da), { size: 16 })
          ]),
          default: q(() => [
            Be(" " + de(v(n)("header.export")), 1)
          ]),
          _: 1
        })),
        H(ct, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(n)("header.settings")
        }, {
          icon: q(() => [
            H(v(dp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Fp = ".editor-header[data-v-f16781f3]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-f16781f3]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-f16781f3]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-f16781f3]{padding:0 var(--spacing-md);height:48px}.badges[data-v-f16781f3]{display:none}.document-title[data-v-f16781f3]{font-size:var(--font-size-base)}}", zp = /* @__PURE__ */ Fe(Bp, [["styles", [Fp]], ["__scopeId", "data-v-f16781f3"]]), Qr = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Np = 70, qp = 1e3 / 60, Hp = 350;
let Xi = !1, pa = !1;
function Wp() {
  pa || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Xi = !0;
  }), document.addEventListener("mouseup", () => {
    Xi = !1;
  }), document.addEventListener("click", () => {
    Xi = !1;
  }), pa = !0);
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
function jp(t = {}) {
  Wp();
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
    const W = Math.max(
      Math.min(
        e.targetScrollTop(P, {
          scrollElement: A,
          contentElement: I
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
    return u() - o();
  }
  function p() {
    return d() <= Np;
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
  function g() {
    if (!Xi || typeof window > "u")
      return !1;
    const A = window.getSelection?.();
    if (!A || !A.rangeCount)
      return !1;
    const I = A.getRangeAt(0), P = i.scrollElement;
    if (!P)
      return !1;
    const W = I.commonAncestorContainer;
    return !!(W && (P.contains(W) || W.contains(P)));
  }
  const C = (A) => {
    if (A.target !== i.scrollElement)
      return;
    const I = o(), P = i.ignoreScrollToTop;
    let W = i.lastScrollTop ?? I;
    i.lastScrollTop = I, i.ignoreScrollToTop = void 0, P && P > I && (W = P), m(p()), setTimeout(() => {
      if (i.resizeDifference || I === P)
        return;
      if (g()) {
        h(!0), f(!1);
        return;
      }
      const D = I > W, U = I < W;
      if (i.animation?.ignoreEscapes) {
        a(W);
        return;
      }
      U && (h(!0), f(!1)), D && h(!1), !i.escapedFromLock && p() && f(!0);
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
    P === I && A.deltaY < 0 && I.scrollHeight > I.clientHeight && !i.animation?.ignoreEscapes && (h(!0), f(!1));
  };
  function _(A, I) {
    y(), i.scrollElement = A, i.contentElement = I, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", C, { passive: !0 }), A.addEventListener("wheel", w, { passive: !0 });
    let P;
    i.resizeObserver = new ResizeObserver((W) => {
      const D = W[0];
      if (!D)
        return;
      const { height: U } = D.contentRect, ne = U - (P ?? U);
      if (i.resizeDifference = ne, o() > l() && a(l()), m(p()), ne >= 0) {
        const J = ts(
          e,
          P ? e.resize : e.initial
        );
        x({
          animation: J,
          wait: !0,
          preserveScrollPosition: !0,
          duration: J === "instant" ? void 0 : Hp
        });
      } else
        p() && (h(!1), f(!0));
      P = U, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === ne && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(I);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", C), i.scrollElement.removeEventListener("wheel", w)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function E() {
    y(), n.clear();
  }
  function T(A) {
    e = { ...e, ...A };
  }
  function x(A = {}) {
    const I = typeof A == "string" ? { animation: A } : A;
    I.preserveScrollPosition || f(!0);
    const P = Date.now() + (Number(I.wait) || 0), W = ts(e, I.animation), { ignoreEscapes: D = !1 } = I;
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
        const we = o(), Le = typeof performance < "u" ? performance.now() : Date.now(), Ze = (Le - (i.lastTick ?? Le)) / qp;
        if (i.animation ||= { behavior: W, promise: Q, ignoreEscapes: D }, i.animation.behavior === W && (i.lastTick = Le), g() || P > Date.now())
          return J();
        if (we < Math.min(ne, u())) {
          if (i.animation?.behavior === W) {
            if (W === "instant")
              return a(u()), J();
            const Ae = W;
            i.velocity = (Ae.damping * i.velocity + Ae.stiffness * d()) / Ae.mass, i.accumulated += i.velocity * Ze;
            const Ft = o();
            a(Ft + i.accumulated), o() !== Ft && (i.accumulated = 0);
          }
          return J();
        }
        return U > Date.now() ? (ne = u(), J()) : (i.animation = void 0, o() < u() ? x({
          animation: ts(e, e.resize),
          ignoreEscapes: D,
          duration: Math.max(0, U - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return Q.then((we) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), we));
    };
    return I.wait !== !0 && (i.animation = void 0), i.animation?.behavior === W ? i.animation.promise : J();
  }
  const R = () => {
    h(!0), f(!1);
  };
  function k(A) {
    return n.add(A), () => n.delete(A);
  }
  return {
    attach: _,
    detach: y,
    destroy: E,
    setOptions: T,
    getState: s,
    onChange: k,
    scrollToBottom: x,
    stopScroll: R
  };
}
function Vp(t = {}) {
  const e = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B(t.initial !== !1), r = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), o = jp(t);
  let a = null;
  return ft((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((c) => {
      i.value = c.isAtBottom, r.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), fn(() => {
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
const Up = /* @__PURE__ */ Z({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (M(), oe("span", {
      class: "speaker-indicator",
      style: Dt({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Kp = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", Su = /* @__PURE__ */ Fe(Up, [["styles", [Kp]], ["__scopeId", "data-v-9bffeda8"]]), Xp = { class: "speaker-label" }, Gp = {
  key: 1,
  class: "speaker-name"
}, Yp = ["datetime"], Jp = /* @__PURE__ */ Z({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = pt(), r = L(
      () => io(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), s = L(
      () => e.startTime != null ? _i(e.startTime) : null
    ), o = L(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = L(() => e.speaker?.color ?? "transparent");
    return (l, c) => (M(), oe("div", Xp, [
      t.speaker ? (M(), X(Su, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : fe("", !0),
      t.speaker ? (M(), oe("span", Gp, de(t.speaker.name), 1)) : fe("", !0),
      s.value ? (M(), oe("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, de(s.value), 9, Yp)) : fe("", !0),
      H(Ps, null, {
        default: q(() => [
          Be(de(r.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Zp = ".speaker-label[data-v-c5cddbd4]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-c5cddbd4]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-c5cddbd4]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);position:relative;top:1px;line-height:1em}", Qp = /* @__PURE__ */ Fe(Jp, [["styles", [Zp]], ["__scopeId", "data-v-c5cddbd4"]]);
function eh() {
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
const ha = [
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
function th(t, e, n) {
  const i = ha[t.size % ha.length];
  return { id: e, name: n, color: i };
}
function nh(t, e, n) {
  return !e || t.has(e) ? null : th(t, e, n ?? e);
}
function ih(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function rh(t) {
  const e = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = nh(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(s, o) {
    const a = ih(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: r };
}
function sh(t, e) {
  return [...t, e];
}
function oh(t, e) {
  return [...e, ...t];
}
function ah(t, e, n) {
  const i = t.findIndex((s) => s.id === e);
  if (i === -1) return null;
  const r = { ...t[i], ...n, id: e };
  return {
    turns: t.map((s, o) => o === i ? r : s),
    updated: r
  };
}
function lh(t, e) {
  const n = t.findIndex((i) => i.id === e);
  return n === -1 ? null : t.filter((i, r) => r !== n);
}
function uh(t, e, n) {
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
function ch(t, e, n) {
  const { id: i, languages: r, isSource: s, audio: o } = t, a = /* @__PURE__ */ B(t.turns);
  function l(h) {
    n(h.speakerId), a.value = sh(a.value, h), e("turn:add", { turn: h, translationId: i });
  }
  function c(h, m) {
    const g = ah(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function u(h) {
    const m = lh(a.value, h);
    m && (a.value = m, e("turn:remove", { turnId: h, translationId: i }));
  }
  function d(h, m) {
    const g = uh(a.value, h, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: i }));
  }
  function p(h) {
    Os(h, n), a.value = oh(a.value, h);
  }
  function f(h) {
    Os(h, n), a.value = h, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: r, isSource: s, audio: o, turns: a, addTurn: l, prependTurns: p, updateTurn: c, removeTurn: u, updateWords: d, setTurns: f };
}
function va(t, e, n) {
  const { id: i, name: r, description: s, duration: o } = t, a = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map());
  let l;
  for (const m of t.translations) {
    const g = ch(m, e, n);
    a.set(m.id, g), m.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ B(null), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!0), p = L(() => c.value ? a.get(c.value) ?? l : l);
  function f(m) {
    const g = m === l.id ? null : m;
    g !== c.value && (c.value = g, e("translation:change", { translationId: p.value.id }));
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
function dh(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, r] of t.speakers)
    e.add(i), n.push({ id: i, name: r.name });
  for (const i of t.channels)
    for (const r of i.translations)
      for (const s of r.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), n.push({ id: s.speakerId, name: s.speakerId }));
  return n;
}
function fh(t = {}) {
  const e = /* @__PURE__ */ B(""), n = /* @__PURE__ */ B(t.activeChannelId ?? ""), i = /* @__PURE__ */ B(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: s, emit: o, clear: a } = eh(), l = rh(o), c = l, u = /* @__PURE__ */ Sr(/* @__PURE__ */ new Map()), d = L(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function p(T, x) {
    return r(T, (R) => {
      R.translationId === d.value.activeTranslation.value.id && x(R);
    });
  }
  function f(T) {
    e.value = T.title, l.clear(), u.clear();
    for (const x of dh(T))
      c.ensure(x.id, x.name);
    for (const x of T.channels)
      u.set(x.id, va(x, o, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(T) {
    Ap(T), f(T);
  }
  function m(T) {
    T !== n.value && (n.value = T, o("channel:change", { channelId: T }));
  }
  function g(T, x) {
    if (u.has(T)) {
      for (const R of x.translations)
        Os(R.turns, c.ensure);
      u.set(T, va(x, o, c.ensure)), o("channel:sync", { channelId: T });
    }
  }
  const C = [], w = [];
  function _(T) {
    T.tiptapExtensions && w.push(...T.tiptapExtensions);
    const x = T.install(E);
    x && C.push(x);
  }
  function y() {
    o("destroy", void 0), C.forEach((T) => T()), C.length = 0, a();
  }
  t.document && f(t.document);
  const E = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: w,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: p,
    setDocument: h,
    setActiveChannel: m,
    setChannel: g,
    on: r,
    off: s,
    emit: o,
    use: _,
    destroy: y
  };
  return E;
}
const Cu = /* @__PURE__ */ Symbol("editorStore");
function ph(t) {
  Xn(Cu, t);
}
function On() {
  const t = Kt(Cu);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const Eu = /* @__PURE__ */ Symbol("turnSelection");
function ma(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function hh(t, e, n) {
  const i = /* @__PURE__ */ B(/* @__PURE__ */ new Set());
  let r = null;
  const s = L(() => i.value.size), o = L(() => i.value.size > 0);
  function a(g) {
    const C = new Set(i.value);
    C.has(g) ? C.delete(g) : C.add(g), i.value = C, r = g;
  }
  function l(g) {
    if (r === null) {
      a(g);
      return;
    }
    const C = t.value.map((x) => x.id), w = C.indexOf(r), _ = C.indexOf(g);
    if (w === -1 || _ === -1) {
      a(g);
      return;
    }
    const y = Math.min(w, _), E = Math.max(w, _), T = new Set(i.value);
    for (let x = y; x <= E; x++) {
      const R = C[x];
      R != null && T.add(R);
    }
    i.value = T;
  }
  function c() {
    i.value = /* @__PURE__ */ new Set(), r = null;
  }
  async function u() {
    const C = t.value.filter((w) => i.value.has(w.id)).map(ma).join(`

`);
    await navigator.clipboard.writeText(C);
  }
  async function d() {
    const C = t.value.filter((w) => i.value.has(w.id)).map((w) => {
      const y = (w.speakerId ? e.get(w.speakerId) : void 0)?.name ?? "", E = w.startTime != null ? _i(w.startTime) : "", T = [y, E].filter(Boolean).join(" (") + (E ? ")" : ""), x = ma(w);
      return T ? `${T}
${x}` : x;
    });
    await navigator.clipboard.writeText(C.join(`

`));
  }
  ye(
    () => t.value,
    (g) => {
      if (i.value.size === 0) return;
      const C = new Set(g.map((_) => _.id)), w = new Set(
        [...i.value].filter((_) => C.has(_))
      );
      w.size !== i.value.size && (i.value = w);
    }
  );
  const p = n.on("channel:change", c), f = n.on("translation:change", c);
  function h(g) {
    g.key === "Escape" && i.value.size > 0 && c();
  }
  Re(() => {
    document.addEventListener("keydown", h);
  }), fn(() => {
    document.removeEventListener("keydown", h), p(), f();
  });
  const m = {
    selectedIds: i,
    count: s,
    hasSelection: o,
    toggle: a,
    selectRange: l,
    clear: c,
    copyText: u,
    copyWithMetadata: d
  };
  return Xn(Eu, m), m;
}
function Tu() {
  const t = Kt(Eu);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const vh = ["data-turn-active"], mh = ["checked", "aria-label"], gh = { class: "turn-text" }, yh = ["data-word-active"], bh = /* @__PURE__ */ Z({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = On(), i = Tu(), { t: r } = pt(), s = L(() => e.turn.words.length > 0), o = L(() => {
      if (!n.audio?.src.value || !s.value) return null;
      const f = n.audio.currentTime.value, { startTime: h, endTime: m, words: g } = e.turn;
      return h == null || m == null || f < h || f > m ? null : Op(g, f);
    }), a = L(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || xu(e.turn.words)) return !1;
      const f = n.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = L(() => e.speaker?.color ?? "transparent"), c = L(() => i.selectedIds.value.has(e.turn.id)), u = L(() => {
      const f = e.speaker?.name ?? "", h = c.value ? "selection.deselect" : "selection.select";
      return r(h).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function p(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, h) => (M(), oe("section", {
      class: Xt(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: Dt({ "--speaker-color": l.value })
    }, [
      t.partial ? fe("", !0) : (M(), oe("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        se("input", {
          type: "checkbox",
          class: "turn-checkbox",
          checked: c.value,
          "aria-label": u.value,
          onClick: un(p, ["stop"])
        }, null, 8, mh),
        H(Qp, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      se("p", gh, [
        s.value ? (M(!0), oe(Ee, { key: 0 }, Pn(t.turn.words, (m, g) => (M(), oe(Ee, {
          key: m.id
        }, [
          se("span", {
            class: Xt({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, de(m.text), 11, yh),
          Be(de(g < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (M(), oe(Ee, { key: 1 }, [
          Be(de(t.turn.text), 1)
        ], 64)) : fe("", !0)
      ])
    ], 14, vh));
  }
}), wh = ".turn[data-v-56ba1c7c]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-56ba1c7c]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn-header[data-v-56ba1c7c]:hover{background-color:var(--color-surface-hover)}.turn-checkbox[data-v-56ba1c7c]{width:16px;height:16px;flex-shrink:0;cursor:pointer;accent-color:var(--color-primary);margin:0}.turn-text[data-v-56ba1c7c]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-56ba1c7c]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-56ba1c7c]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-56ba1c7c]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-56ba1c7c]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-56ba1c7c .2s ease}@keyframes partial-fade-in-56ba1c7c{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-56ba1c7c]{animation:none}}@media(max-width:767px){.turn[data-v-56ba1c7c]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-56ba1c7c],.turn--active[data-v-56ba1c7c]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", ga = /* @__PURE__ */ Fe(bh, [["styles", [wh]], ["__scopeId", "data-v-56ba1c7c"]]), _h = {}, xh = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Sh(t, e) {
  return M(), oe("svg", xh, [...e[0] || (e[0] = [
    lf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Ch = /* @__PURE__ */ Fe(_h, [["render", Sh]]), Eh = { class: "transcription-empty" }, Th = { class: "message" }, kh = /* @__PURE__ */ Z({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = pt();
    return (n, i) => (M(), oe("div", Eh, [
      H(Ch, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      se("p", Th, de(v(e)("transcription.empty")), 1)
    ]));
  }
}), Ah = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", Ph = /* @__PURE__ */ Fe(kh, [["styles", [Ah]], ["__scopeId", "data-v-f82737e5"]]), Oh = /* @__PURE__ */ Z({
  __name: "CopyButton",
  props: {
    icon: { default: "copy", type: String },
    copyFn: { type: Function }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ B(!1);
    let r;
    async function s() {
      if (!i.value)
        try {
          await n.copyFn(), i.value = !0, r = setTimeout(() => {
            i.value = !1;
          }, 2e3);
        } catch (o) {
          console.error(o);
        }
    }
    return e({ reset: () => {
      i.value = !1, clearTimeout(r);
    } }), (o, a) => (M(), X(ct, {
      size: "sm",
      class: Xt({ "copy-btn--copied": i.value }),
      onClick: s
    }, {
      icon: q(() => [
        H(mu, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: q(() => [
            i.value ? (M(), X(v(to), {
              key: 0,
              size: 14
            })) : t.icon === "copy" ? (M(), X(v(lp), {
              key: 1,
              size: 14
            })) : (M(), X(v(ap), {
              key: 2,
              size: 14
            }))
          ]),
          _: 1
        })
      ]),
      default: q(() => [
        ce(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), Mh = ".copy-btn--copied[data-v-08fc451a]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-08fc451a],.copy-icon-leave-active[data-v-08fc451a]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-08fc451a],.copy-icon-leave-to[data-v-08fc451a]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-08fc451a],.copy-icon-leave-active[data-v-08fc451a]{transition:none}}", ya = /* @__PURE__ */ Fe(Oh, [["styles", [Mh]], ["__scopeId", "data-v-08fc451a"]]), Rh = ["aria-label"], Ih = { class: "selection-count" }, Lh = { class: "selection-actions" }, Dh = /* @__PURE__ */ Z({
  __name: "SelectionActionBar",
  setup(t) {
    const e = Tu(), { t: n } = pt();
    return (i, r) => v(e).hasSelection.value ? (M(), oe("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": v(n)("selection.count")
    }, [
      se("span", Ih, de(v(e).count.value) + " " + de(v(n)("selection.count")), 1),
      se("div", Lh, [
        H(ya, {
          icon: "copy",
          "copy-fn": v(e).copyText
        }, {
          default: q(() => [
            Be(de(v(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(ya, {
          icon: "clipboard-list",
          "copy-fn": v(e).copyWithMetadata
        }, {
          default: q(() => [
            Be(de(v(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(ct, {
          size: "sm",
          variant: "ghost",
          onClick: r[0] || (r[0] = (s) => v(e).clear())
        }, {
          icon: q(() => [
            H(v(no), { size: 14 })
          ]),
          default: q(() => [
            Be(" " + de(v(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Rh)) : fe("", !0);
  }
}), $h = ".selection-bar[data-v-6def1b72]{position:sticky;top:0;z-index:var(--z-sticky);display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-6def1b72 var(--transition-duration) ease}.selection-count[data-v-6def1b72]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-6def1b72]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-6def1b72{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-6def1b72]{animation:none}}@media(max-width:767px){.selection-bar[data-v-6def1b72]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", Bh = /* @__PURE__ */ Fe(Dh, [["styles", [$h]], ["__scopeId", "data-v-6def1b72"]]), Fh = { class: "transcription-panel" }, zh = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Nh = { class: "turns-container" }, qh = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Hh = {
  key: 1,
  class: "history-start"
}, Wh = /* @__PURE__ */ Z({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = pt(), i = On(), r = gi("scrollContainer"), s = L(() => {
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
    }), o = L(() => i.live?.hasLiveUpdate.value ?? !1), a = L(() => i.audio?.isPlaying.value ?? !1), l = L(
      () => i.activeChannel.value.activeTranslation.value
    ), c = L(() => i.activeChannel.value), u = L(
      () => c.value.isLoadingHistory.value
    ), d = L(() => c.value.hasMoreHistory.value), { scrollRef: p, contentRef: f, isAtBottom: h, scrollToBottom: m } = Vp();
    Re(() => {
      p.value = r.value, f.value = r.value?.querySelector(".turns-container") ?? null;
    });
    const g = kp(() => {
      const w = c.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function C() {
      const w = r.value;
      w && w.scrollTop < 100 && g();
    }
    return ye(
      () => e.turns,
      (w, _) => {
        const y = w.length, E = _.length;
        if (y > E && !h.value && w[0]?.id != _[0]?.id) {
          const T = y - E, x = e.turns[T]?.id;
          if (!x || !p.value) return;
          Me(() => {
            p.value?.querySelector(
              `[data-turn-id="${x}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), Re(() => {
      r.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), fn(() => {
      r.value?.removeEventListener("scroll", C);
    }), (w, _) => (M(), oe("article", Fh, [
      se("div", zh, [
        se("div", Nh, [
          H(Bh),
          u.value ? (M(), oe("div", qh, [..._[1] || (_[1] = [
            se("progress", null, null, -1)
          ])])) : fe("", !0),
          !d.value && t.turns.length > 0 ? (M(), oe("div", Hh, de(v(n)("transcription.historyStart")), 1)) : fe("", !0),
          t.turns.length === 0 && !u.value && !s.value ? (M(), X(Ph, {
            key: 2,
            class: "transcription-empty"
          })) : fe("", !0),
          (M(!0), oe(Ee, null, Pn(t.turns, (y, E) => (M(), X(ga, {
            "data-turn-id": y.id,
            key: y.id,
            turn: y,
            speaker: y.speakerId ? t.speakers.get(y.speakerId) : void 0,
            live: o.value && !s.value && E === t.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (M(), X(ga, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : fe("", !0)
        ]),
        H(mu, { name: "fade-slide" }, {
          default: q(() => [
            !v(h) && (a.value || o.value) ? (M(), X(ct, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": v(n)("transcription.resumeScroll"),
              onClick: _[0] || (_[0] = (y) => v(m)())
            }, {
              icon: q(() => [
                H(v(sp), { size: 14 })
              ]),
              default: q(() => [
                Be(" " + de(v(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : fe("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), jh = ".transcription-panel[data-v-974ee253]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-974ee253]{height:100%;overflow:auto;position:relative}.turns-container[data-v-974ee253]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-974ee253]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-974ee253]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-974ee253]{width:120px}.history-start[data-v-974ee253]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-974ee253]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-974ee253],.fade-slide-leave-active[data-v-974ee253]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-974ee253],.fade-slide-leave-to[data-v-974ee253]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-974ee253],.fade-slide-leave-active[data-v-974ee253]{transition:none}}@media(max-width:767px){.turns-container[data-v-974ee253]{padding:var(--spacing-md)}}", Vh = /* @__PURE__ */ Fe(Wh, [["styles", [jh]], ["__scopeId", "data-v-974ee253"]]), Uh = { class: "switch" }, Kh = ["id", "checked"], Xh = ["for"], Gh = /* @__PURE__ */ Z({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = n.id ?? ql();
    return (s, o) => (M(), oe("div", Uh, [
      se("input", {
        type: "checkbox",
        id: v(r),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Kh),
      se("label", { for: v(r) }, [...o[1] || (o[1] = [
        se("div", { class: "switch-slider" }, null, -1)
      ])], 8, Xh)
    ]));
  }
}), Yh = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", Jh = /* @__PURE__ */ Fe(Gh, [["styles", [Yh]], ["__scopeId", "data-v-2aa0332f"]]), Zh = "(max-width: 767px)";
function ku() {
  const t = /* @__PURE__ */ B(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return Re(() => {
    e = window.matchMedia(Zh), t.value = e.matches, e.addEventListener("change", n);
  }), fn(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
function ba(t) {
  return typeof t == "string" ? `'${t}'` : new Qh().serialize(t);
}
const Qh = /* @__PURE__ */ (function() {
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
  return t === e || ba(t) === ba(e);
}
function ev(t, e, n) {
  const i = t.findIndex((a) => lr(a, e)), r = t.findIndex((a) => lr(a, n));
  if (i === -1 || r === -1) return [];
  const [s, o] = [i, r].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function wa(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function $t(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = Kt(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (Xn(i, o), o)];
}
function dt() {
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
function Ms(t) {
  return t == null;
}
function ro(t) {
  return t ? t.flatMap((e) => e.type === Ee ? ro(e.children) : [e]) : [];
}
const [so] = $t("ConfigProvider");
function tv(t, e) {
  var n;
  const i = /* @__PURE__ */ Tn();
  return ft(() => {
    i.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ Qi(i);
}
function Lr(t, e) {
  return Vs() ? (il(t, e), !0) : !1;
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
function nv(t) {
  let e = !1, n;
  const i = nl(!0);
  return ((...r) => (e || (n = i.run(() => t(...r)), e = !0), n));
}
const nn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const iv = (t) => typeof t < "u", rv = Object.prototype.toString, sv = (t) => rv.call(t) === "[object Object]", _a = /* @__PURE__ */ ov();
function ov() {
  var t, e, n;
  return nn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function is(t) {
  return Array.isArray(t) ? t : [t];
}
function av(t) {
  return at();
}
// @__NO_SIDE_EFFECTS__
function lv(t) {
  if (!nn) return t;
  let e = 0, n, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = nl(!0), n = i.run(() => t(...s))), Lr(r), n));
}
function Au(t, e = 1e4) {
  return Sl((n, i) => {
    let r = Ye(t), s;
    const o = () => setTimeout(() => {
      r = Ye(t), i();
    }, Ye(e));
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
function uv(t, e) {
  av() && fn(t, e);
}
function cv(t, e, n) {
  return ye(t, e, {
    ...n,
    immediate: !0
  });
}
const Dr = nn ? window : void 0;
function It(t) {
  var e;
  const n = Ye(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Pu(...t) {
  const e = (i, r, s, o) => (i.addEventListener(r, s, o), () => i.removeEventListener(r, s, o)), n = L(() => {
    const i = is(Ye(t[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return cv(() => {
    var i, r;
    return [
      (i = (r = n.value) === null || r === void 0 ? void 0 : r.map((s) => It(s))) !== null && i !== void 0 ? i : [Dr].filter((s) => s != null),
      is(Ye(n.value ? t[1] : t[0])),
      is(v(n.value ? t[2] : t[1])),
      Ye(n.value ? t[3] : t[2])
    ];
  }, ([i, r, s, o], a, l) => {
    if (!i?.length || !r?.length || !s?.length) return;
    const c = sv(o) ? { ...o } : o, u = i.flatMap((d) => r.flatMap((p) => s.map((f) => e(d, p, f, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Ou() {
  const t = /* @__PURE__ */ Tn(!1), e = at();
  return e && Re(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function dv(t) {
  const e = /* @__PURE__ */ Ou();
  return L(() => (e.value, !!t()));
}
function fv(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function pv(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: r = Dr, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = fv(e);
  return Pu(r, s, (u) => {
    u.repeat && Ye(a) || l(u) && n(u);
  }, o);
}
function hv(t) {
  return JSON.parse(JSON.stringify(t));
}
function vv(t, e, n = {}) {
  const { window: i = Dr, ...r } = n;
  let s;
  const o = /* @__PURE__ */ dv(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = ye(L(() => {
    const u = Ye(t);
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
  return Lr(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ur(t, e, n, i = {}) {
  var r, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = i, p = at(), f = n || p?.emit || (p == null || (r = p.$emit) === null || r === void 0 ? void 0 : r.bind(p)) || (p == null || (s = p.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(p?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : hv(w) : w, g = () => iv(t[e]) ? m(t[e]) : u, C = (w) => {
    d ? d(w) && f(h, w) : f(h, w);
  };
  if (a) {
    const w = /* @__PURE__ */ B(g());
    let _ = !1;
    return ye(() => t[e], (y) => {
      _ || (_ = !0, w.value = m(y), Me(() => _ = !1));
    }), ye(w, (y) => {
      !_ && (y !== t[e] || c) && C(y);
    }, { deep: c }), w;
  } else return L({
    get() {
      return g();
    },
    set(w) {
      C(w);
    }
  });
}
function rs(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Rs(t, e, n = ".", i) {
  if (!rs(e))
    return Rs(t, {}, n, i);
  const r = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (i && i(r, s, o, n) || (Array.isArray(o) && Array.isArray(r[s]) ? r[s] = [...o, ...r[s]] : rs(o) && rs(r[s]) ? r[s] = Rs(
      o,
      r[s],
      (n ? `${n}.` : "") + s.toString(),
      i
    ) : r[s] = o));
  }
  return r;
}
function mv(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Rs(n, i, "", t), {})
  );
}
const gv = mv(), yv = /* @__PURE__ */ lv(() => {
  const t = /* @__PURE__ */ B(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ B(), n = L(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = so({ scrollBody: /* @__PURE__ */ B(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", _a && r?.(), e.value = void 0;
  };
  return ye(n, (o, a) => {
    if (!nn) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? gv({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), _a && (r = Pu(document, "touchmove", (d) => bv(d), { passive: !1 })), Me(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Mu(t) {
  const e = Math.random().toString(36).substring(2, 7), n = yv();
  n.value.set(e, t ?? !1);
  const i = L({
    get: () => n.value.get(e) ?? !1,
    set: (r) => n.value.set(e, r)
  });
  return uv(() => {
    n.value.delete(e);
  }), i;
}
function Ru(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : Ru(n);
  }
}
function bv(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && Ru(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Iu(t) {
  const e = so({ dir: /* @__PURE__ */ B("ltr") });
  return L(() => t?.value || e.dir?.value || "ltr");
}
function $r(t) {
  const e = at(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((r) => {
    i[Hi($e(r))] = (...s) => t(r, ...s);
  }), i;
}
let ss = 0;
function wv() {
  ft((t) => {
    if (!nn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? xa()), document.body.insertAdjacentElement("beforeend", e[1] ?? xa()), ss++, t(() => {
      ss === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), ss--;
    });
  });
}
function xa() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function Lu(t) {
  return L(() => Ye(t) ? !!It(t)?.closest("form") : !0);
}
function Ie() {
  const t = at(), e = /* @__PURE__ */ B(), n = L(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : It(e)), i = Object.assign({}, t.exposed), r = {};
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
function oo(t) {
  const e = at(), n = Object.keys(e?.type.props ?? {}).reduce((r, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (r[s] = o), r;
  }, {}), i = /* @__PURE__ */ Wi(t);
  return L(() => {
    const r = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      r[$e(o)] = s[o];
    }), Object.keys({
      ...n,
      ...r
    }).reduce((o, a) => (i.value[a] !== void 0 && (o[a] = i.value[a]), o), {});
  });
}
function _v(t, e) {
  const n = oo(t), i = e ? $r(e) : {};
  return L(() => ({
    ...n.value,
    ...i
  }));
}
var xv = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Ln = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new WeakMap(), Fi = {}, os = 0, Du = function(t) {
  return t && (t.host || Du(t.parentNode));
}, Sv = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = Du(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Cv = function(t, e, n, i) {
  var r = Sv(e, Array.isArray(t) ? t : [t]);
  Fi[n] || (Fi[n] = /* @__PURE__ */ new WeakMap());
  var s = Fi[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(r), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  r.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (a.has(p))
        u(p);
      else
        try {
          var f = p.getAttribute(i), h = f !== null && f !== "false", m = (Ln.get(p) || 0) + 1, g = (s.get(p) || 0) + 1;
          Ln.set(p, m), s.set(p, g), o.push(p), m === 1 && h && Bi.set(p, !0), g === 1 && p.setAttribute(n, "true"), h || p.setAttribute(i, "true");
        } catch (C) {
          console.error("aria-hidden: cannot operate on ", p, C);
        }
    });
  };
  return u(e), a.clear(), os++, function() {
    o.forEach(function(d) {
      var p = Ln.get(d) - 1, f = s.get(d) - 1;
      Ln.set(d, p), s.set(d, f), p || (Bi.has(d) || d.removeAttribute(i), Bi.delete(d)), f || d.removeAttribute(n);
    }), os--, os || (Ln = /* @__PURE__ */ new WeakMap(), Ln = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new WeakMap(), Fi = {});
  };
}, Ev = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), r = xv(t);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), Cv(i, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function $u(t) {
  let e;
  ye(() => It(t), (n) => {
    n ? e = Ev(n) : e && e();
  }), An(() => {
    e && e();
  });
}
function xi(t, e = "reka") {
  return `${e}-${ql?.()}`;
}
function Tv() {
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
function kv(t) {
  const e = /* @__PURE__ */ B(), n = L(() => e.value?.width ?? 0), i = L(() => e.value?.height ?? 0);
  return Re(() => {
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
function Av(t, e) {
  const n = /* @__PURE__ */ B(t);
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
function ao(t) {
  const e = Au("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, s) => {
      e.value = e.value + r;
      {
        const o = dt(), a = s.map((p) => ({
          ...p,
          textValue: p.value?.textValue ?? p.ref.textContent?.trim() ?? ""
        })), l = a.find((p) => p.ref === o), c = a.map((p) => p.textValue), u = Ov(c, e.value, l?.textValue), d = a.find((p) => p.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Pv(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
function Ov(t, e, n) {
  const r = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = Pv(t, Math.max(s, 0));
  r.length === 1 && (o = o.filter((c) => c !== n));
  const l = o.find((c) => c.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function Mv(t, e) {
  const n = /* @__PURE__ */ B({}), i = /* @__PURE__ */ B("none"), r = /* @__PURE__ */ B(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Dr, { state: l, dispatch: c } = Av(s, {
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
    if (nn) {
      const C = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(C);
    }
  };
  ye(t, async (g, C) => {
    const w = C !== g;
    if (await Me(), w) {
      const _ = i.value, y = zi(e.value);
      g ? (c("MOUNT"), u("enter"), y === "none" && u("after-enter")) : y === "none" || y === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : C && _ !== y ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const C = zi(e.value), w = C.includes(CSS.escape(g.animationName)), _ = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && w && (u(`after-${_}`), c("ANIMATION_END"), !r.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    g.target === e.value && C === "none" && c("ANIMATION_END");
  }, p = (g) => {
    g.target === e.value && (i.value = zi(e.value));
  }, f = ye(e, (g, C) => {
    g ? (n.value = getComputedStyle(g), g.addEventListener("animationstart", p), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), C?.removeEventListener("animationstart", p), C?.removeEventListener("animationcancel", d), C?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = ye(l, () => {
    const g = zi(e.value);
    i.value = l.value === "mounted" ? g : "none";
  });
  return An(() => {
    f(), h();
  }), { isPresent: L(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function zi(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var lo = /* @__PURE__ */ Z({
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
    const { present: i, forceMount: r } = /* @__PURE__ */ Kn(t), s = /* @__PURE__ */ B(), { isPresent: o } = Mv(i, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = ro(a || []);
    const l = at();
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
    return () => r.value || i.value || o.value ? gt(e.default({ present: o.value })[0], { ref: (c) => {
      const u = It(c);
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
      const i = ro(n.default()), r = i.findIndex((l) => l.type !== ze);
      if (r === -1) return i;
      const s = i[r];
      delete s.props?.ref;
      const o = s.props ? Ce(e, s.props) : e, a = Zt({
        ...s,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[r] = a, i);
    };
  }
}), Rv = [
  "area",
  "img",
  "input"
], Oe = /* @__PURE__ */ Z({
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
    return typeof i == "string" && Rv.includes(i) ? () => gt(i, e) : i !== "template" ? () => gt(t.as, e, { default: n.default }) : () => gt(Is, e, { default: n.default });
  }
});
function cr() {
  const t = /* @__PURE__ */ B(), e = L(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : It(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [pn, Iv] = $t("DialogRoot");
var Lv = /* @__PURE__ */ Z({
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
    }), s = /* @__PURE__ */ B(), o = /* @__PURE__ */ B(), { modal: a } = /* @__PURE__ */ Kn(n);
    return Iv({
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
}), Bu = Lv, Dv = /* @__PURE__ */ Z({
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
    return (i, r) => (M(), X(v(Oe), Ce(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => v(n).onOpenChange(!1))
    }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), $v = Dv;
const Bv = "dismissableLayer.pointerDownOutside", Fv = "dismissableLayer.focusOutside";
function Fu(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), r = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || r.indexOf(i) < r.indexOf(n)));
}
function zv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(() => {
  });
  return ft((o) => {
    if (!nn || !Ye(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Fu(e.value, u)) {
          r.value = !1;
          return;
        }
        if (c.target && !r.value) {
          let p = function() {
            Ir(Bv, t, d);
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
    Ye(n) && (r.value = !0);
  } };
}
function Nv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ B(!1);
  return ft((s) => {
    if (!nn || !Ye(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Me(), await Me();
      const l = a.target;
      !e.value || !l || Fu(e.value, l) || a.target && !r.value && Ir(Fv, t, { originalEvent: a });
    };
    i.addEventListener("focusin", o), s(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Ye(n) && (r.value = !0);
    },
    onBlurCapture: () => {
      Ye(n) && (r.value = !1);
    }
  };
}
const ut = /* @__PURE__ */ ki({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var qv = /* @__PURE__ */ Z({
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
    const n = t, i = e, { forwardRef: r, currentElement: s } = Ie(), o = L(() => s.value?.ownerDocument ?? globalThis.document), a = L(() => ut.layersRoot), l = L(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = L(() => ut.layersWithOutsidePointerEventsDisabled.size > 0), u = L(() => {
      const f = Array.from(a.value), [h] = [...ut.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(h);
      return l.value >= m;
    }), d = zv(async (f) => {
      const h = [...ut.branches].some((m) => m?.contains(f.target));
      !u.value || h || (i("pointerDownOutside", f), i("interactOutside", f), await Me(), f.defaultPrevented || i("dismiss"));
    }, s), p = Nv((f) => {
      [...ut.branches].some((m) => m?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, s);
    return pv("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), ft((f) => {
      s.value && (n.disableOutsidePointerEvents && (ut.layersWithOutsidePointerEventsDisabled.size === 0 && (ut.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), ut.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), f(() => {
        n.disableOutsidePointerEvents && ut.layersWithOutsidePointerEventsDisabled.size === 1 && !Ms(ut.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = ut.originalBodyPointerEvents);
      }));
    }), ft((f) => {
      f(() => {
        s.value && (a.value.delete(s.value), ut.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (f, h) => (M(), X(v(Oe), {
      ref: v(r),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: Dt({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(p).onFocusCapture,
      onBlurCapture: v(p).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: q(() => [ce(f.$slots, "default")]),
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
}), zu = qv;
const Hv = /* @__PURE__ */ nv(() => /* @__PURE__ */ B([]));
function Wv() {
  const t = Hv();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = Sa(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = Sa(t.value, e), t.value[0]?.resume();
    }
  };
}
function Sa(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const as = "focusScope.autoFocusOnMount", ls = "focusScope.autoFocusOnUnmount", Ca = {
  bubbles: !1,
  cancelable: !0
};
function jv(t, { select: e = !1 } = {}) {
  const n = dt();
  for (const i of t)
    if (sn(i, { select: e }), dt() !== n) return !0;
}
function Vv(t) {
  const e = Nu(t), n = Ea(e, t), i = Ea(e.reverse(), t);
  return [n, i];
}
function Nu(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function Ea(t, e) {
  for (const n of t) if (!Uv(n, { upTo: e })) return n;
}
function Uv(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function Kv(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function sn(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = dt();
    t.focus({ preventScroll: !0 }), t !== n && Kv(t) && e && t.select();
  }
}
var Xv = /* @__PURE__ */ Z({
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
    const n = t, i = e, { currentRef: r, currentElement: s } = Ie(), o = /* @__PURE__ */ B(null), a = Wv(), l = /* @__PURE__ */ ki({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ft((u) => {
      if (!nn) return;
      const d = s.value;
      if (!n.trapped) return;
      function p(g) {
        if (l.paused || !d) return;
        const C = g.target;
        d.contains(C) ? o.value = C : sn(o.value, { select: !0 });
      }
      function f(g) {
        if (l.paused || !d) return;
        const C = g.relatedTarget;
        C !== null && (d.contains(C) || sn(o.value, { select: !0 }));
      }
      function h(g) {
        d.contains(o.value) || sn(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", f);
      const m = new MutationObserver(h);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", f), m.disconnect();
      });
    }), ft(async (u) => {
      const d = s.value;
      if (await Me(), !d) return;
      a.add(l);
      const p = dt();
      if (!d.contains(p)) {
        const h = new CustomEvent(as, Ca);
        d.addEventListener(as, (m) => i("mountAutoFocus", m)), d.dispatchEvent(h), h.defaultPrevented || (jv(Nu(d), { select: !0 }), dt() === p && sn(d));
      }
      u(() => {
        d.removeEventListener(as, (g) => i("mountAutoFocus", g));
        const h = new CustomEvent(ls, Ca), m = (g) => {
          i("unmountAutoFocus", g);
        };
        d.addEventListener(ls, m), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || sn(p ?? document.body, { select: !0 }), d.removeEventListener(ls, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, p = dt();
      if (d && p) {
        const f = u.currentTarget, [h, m] = Vv(f);
        h && m ? !u.shiftKey && p === m ? (u.preventDefault(), n.loop && sn(h, { select: !0 })) : u.shiftKey && p === h && (u.preventDefault(), n.loop && sn(m, { select: !0 })) : p === f && u.preventDefault();
      }
    }
    return (u, d) => (M(), X(v(Oe), {
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
}), qu = Xv;
function Gv(t) {
  return t ? "open" : "closed";
}
function Ta(t) {
  const e = dt();
  for (const n of t)
    if (n === e || (n.focus(), dt() !== e)) return;
}
var Yv = /* @__PURE__ */ Z({
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
    return r.titleId ||= xi(void 0, "reka-dialog-title"), r.descriptionId ||= xi(void 0, "reka-dialog-description"), Re(() => {
      r.contentElement = o, dt() !== document.body && (r.triggerElement.value = dt());
    }), (a, l) => (M(), X(v(qu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => i("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => i("closeAutoFocus", c))
    }, {
      default: q(() => [H(v(zu), Ce({
        id: v(r).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(r).descriptionId,
        "aria-labelledby": v(r).titleId,
        "data-state": v(Gv)(v(r).open.value)
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
}), Hu = Yv, Jv = /* @__PURE__ */ Z({
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
    return $u(a), (l, c) => (M(), X(Hu, Ce({
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
      default: q(() => [ce(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Zv = Jv, Qv = /* @__PURE__ */ Z({
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
    const s = pn(), o = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(!1);
    return (l, c) => (M(), X(Hu, Ce({
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
}), em = Qv, tm = /* @__PURE__ */ Z({
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
    return (a, l) => (M(), X(v(lo), { present: a.forceMount || v(r).open.value }, {
      default: q(() => [v(r).modal.value ? (M(), X(Zv, Ce({
        key: 0,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: q(() => [ce(a.$slots, "default")]),
        _: 3
      }, 16)) : (M(), X(em, Ce({
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
}), Wu = tm, nm = /* @__PURE__ */ Z({
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
    return Mu(!0), Ie(), (n, i) => (M(), X(v(Oe), {
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
}), im = nm, rm = /* @__PURE__ */ Z({
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
    return (i, r) => v(e)?.modal.value ? (M(), X(v(lo), {
      key: 0,
      present: i.forceMount || v(e).open.value
    }, {
      default: q(() => [H(im, Ce(i.$attrs, {
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
}), ju = rm, sm = /* @__PURE__ */ Z({
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
    const e = /* @__PURE__ */ Ou();
    return (n, i) => v(e) || n.forceMount ? (M(), X(Dl, {
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
}), Vu = sm, om = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), X(v(Vu), Ws(Mr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Uu = om, am = /* @__PURE__ */ Z({
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
    return Ie(), (i, r) => (M(), X(v(Oe), Ce(e, { id: v(n).titleId }), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Ku = am;
const ka = "data-reka-collection-item";
function hn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let r;
  n ? (r = {
    collectionRef: /* @__PURE__ */ B(),
    itemMap: /* @__PURE__ */ B(/* @__PURE__ */ new Map())
  }, Xn(i, r)) : r = Kt(i);
  const s = (u = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const p = Array.from(d.querySelectorAll(`[${ka}]`)), h = Array.from(r.itemMap.value.values()).sort((m, g) => p.indexOf(m.ref) - p.indexOf(g.ref));
    return u ? h : h.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ Z({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = cr();
      return ye(h, () => {
        r.collectionRef.value = h.value;
      }), () => gt(Is, {
        ref: f,
        ...p
      }, d);
    }
  }), a = /* @__PURE__ */ Z({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = cr();
      return ft((m) => {
        if (h.value) {
          const g = wl(h.value);
          r.itemMap.value.set(g, {
            ref: h.value,
            value: u.value
          }), m(() => r.itemMap.value.delete(g));
        }
      }), () => gt(Is, {
        ...p,
        [ka]: "",
        ref: f
      }, d);
    }
  }), l = L(() => Array.from(r.itemMap.value.values())), c = L(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const lm = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function um(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function cm(t, e, n) {
  const i = um(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return lm[i];
}
var dm = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), X(v(Oe), {
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
}), Xu = dm, fm = /* @__PURE__ */ Z({
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
    const e = t, { primitiveElement: n, currentElement: i } = cr(), r = L(() => e.checked ?? e.value);
    return ye(r, (s, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), p = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(p);
      }
    }), (s, o) => (M(), X(Xu, Ce({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Aa = fm, pm = /* @__PURE__ */ Z({
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
    const e = t, n = L(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = L(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (r, s) => (M(), oe(Ee, null, [fe(" We render single input if it's required "), n.value ? (M(), X(Aa, Ce({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (M(!0), oe(Ee, { key: 1 }, Pn(i.value, (o) => (M(), X(Aa, Ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), hm = pm;
const [Gu, vm] = $t("PopperRoot");
var mm = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ B();
    return vm({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, i) => ce(n.$slots, "default");
  }
}), gm = mm, ym = /* @__PURE__ */ Z({
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
    const e = t, { forwardRef: n, currentElement: i } = Ie(), r = Gu();
    return Ol(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (s, o) => (M(), X(v(Oe), {
      ref: v(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: q(() => [ce(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), bm = ym;
function wm(t) {
  return t !== null;
}
function _m(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: i, middlewareData: r } = e, o = r.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [c, u] = Ls(n), d = {
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
function Ls(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const xm = ["top", "right", "bottom", "left"], cn = Math.min, rt = Math.max, dr = Math.round, Ni = Math.floor, Rt = (t) => ({
  x: t,
  y: t
}), Sm = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Cm = {
  start: "end",
  end: "start"
};
function Ds(t, e, n) {
  return rt(t, cn(e, n));
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
function uo(t) {
  return t === "x" ? "y" : "x";
}
function co(t) {
  return t === "y" ? "height" : "width";
}
const Em = /* @__PURE__ */ new Set(["top", "bottom"]);
function Ot(t) {
  return Em.has(en(t)) ? "y" : "x";
}
function fo(t) {
  return uo(Ot(t));
}
function Tm(t, e, n) {
  n === void 0 && (n = !1);
  const i = Gn(t), r = fo(t), s = co(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = fr(o)), [o, fr(o)];
}
function km(t) {
  const e = fr(t);
  return [$s(t), e, $s(e)];
}
function $s(t) {
  return t.replace(/start|end/g, (e) => Cm[e]);
}
const Pa = ["left", "right"], Oa = ["right", "left"], Am = ["top", "bottom"], Pm = ["bottom", "top"];
function Om(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Oa : Pa : e ? Pa : Oa;
    case "left":
    case "right":
      return e ? Am : Pm;
    default:
      return [];
  }
}
function Mm(t, e, n, i) {
  const r = Gn(t);
  let s = Om(en(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map($s)))), s;
}
function fr(t) {
  return t.replace(/left|right|bottom|top/g, (e) => Sm[e]);
}
function Rm(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Yu(t) {
  return typeof t != "number" ? Rm(t) : {
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
function Ma(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = Ot(e), o = fo(e), a = co(o), l = en(e), c = s === "y", u = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
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
  switch (Gn(e)) {
    case "start":
      f[o] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      f[o] += p * (n && c ? -1 : 1);
      break;
  }
  return f;
}
async function Im(t, e) {
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
  } = Qt(e, t), h = Yu(f), g = a[p ? d === "floating" ? "reference" : "floating" : d], C = pr(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(g))) == null || n ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), w = d === "floating" ? {
    x: i,
    y: r,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, _ = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), y = await (s.isElement == null ? void 0 : s.isElement(_)) ? await (s.getScale == null ? void 0 : s.getScale(_)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, E = pr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: _,
    strategy: l
  }) : w);
  return {
    top: (C.top - E.top + h.top) / y.y,
    bottom: (E.bottom - C.bottom + h.bottom) / y.y,
    left: (C.left - E.left + h.left) / y.x,
    right: (E.right - C.right + h.right) / y.x
  };
}
const Lm = async (t, e, n) => {
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
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: C,
      fn: w
    } = a[g], {
      x: _,
      y,
      data: E,
      reset: T
    } = await w({
      x: u,
      y: d,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: f,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : Im
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = _ ?? u, d = y ?? d, f = {
      ...f,
      [C]: {
        ...f[C],
        ...E
      }
    }, T && h <= 50 && (h++, typeof T == "object" && (T.placement && (p = T.placement), T.rects && (c = T.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : T.rects), {
      x: u,
      y: d
    } = Ma(c, p, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: f
  };
}, Dm = (t) => ({
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
    } = Qt(t, e) || {};
    if (c == null)
      return {};
    const d = Yu(u), p = {
      x: n,
      y: i
    }, f = fo(r), h = co(f), m = await o.getDimensions(c), g = f === "y", C = g ? "top" : "left", w = g ? "bottom" : "right", _ = g ? "clientHeight" : "clientWidth", y = s.reference[h] + s.reference[f] - p[f] - s.floating[h], E = p[f] - s.reference[f], T = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let x = T ? T[_] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(T))) && (x = a.floating[_] || s.floating[h]);
    const R = y / 2 - E / 2, k = x / 2 - m[h] / 2 - 1, A = cn(d[C], k), I = cn(d[w], k), P = A, W = x - m[h] - I, D = x / 2 - m[h] / 2 + R, U = Ds(P, D, W), ne = !l.arrow && Gn(r) != null && D !== U && s.reference[h] / 2 - (D < P ? A : I) - m[h] / 2 < 0, J = ne ? D < P ? D - P : D - W : 0;
    return {
      [f]: p[f] + J,
      data: {
        [f]: U,
        centerOffset: D - U - J,
        ...ne && {
          alignmentOffset: J
        }
      },
      reset: ne
    };
  }
}), $m = function(t) {
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
        ...g
      } = Qt(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const C = en(r), w = Ot(a), _ = en(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), E = p || (_ || !m ? [fr(a)] : km(a)), T = h !== "none";
      !p && T && E.push(...Mm(a, m, h, y));
      const x = [a, ...E], R = await l.detectOverflow(e, g), k = [];
      let A = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (u && k.push(R[C]), d) {
        const D = Tm(r, o, y);
        k.push(R[D[0]], R[D[1]]);
      }
      if (A = [...A, {
        placement: r,
        overflows: k
      }], !k.every((D) => D <= 0)) {
        var I, P;
        const D = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, U = x[D];
        if (U && (!(d === "alignment" ? w !== Ot(U) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((Q) => Ot(Q.placement) === w ? Q.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: A
            },
            reset: {
              placement: U
            }
          };
        let ne = (P = A.filter((J) => J.overflows[0] <= 0).sort((J, Q) => J.overflows[1] - Q.overflows[1])[0]) == null ? void 0 : P.placement;
        if (!ne)
          switch (f) {
            case "bestFit": {
              var W;
              const J = (W = A.filter((Q) => {
                if (T) {
                  const we = Ot(Q.placement);
                  return we === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  we === "y";
                }
                return !0;
              }).map((Q) => [Q.placement, Q.overflows.filter((we) => we > 0).reduce((we, Le) => we + Le, 0)]).sort((Q, we) => Q[1] - we[1])[0]) == null ? void 0 : W[0];
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
function Ra(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function Ia(t) {
  return xm.some((e) => t[e] >= 0);
}
const Bm = function(t) {
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
      } = Qt(t, e);
      switch (r) {
        case "referenceHidden": {
          const o = await i.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Ra(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Ia(a)
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
              escaped: Ia(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ju = /* @__PURE__ */ new Set(["left", "top"]);
async function Fm(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = en(n), a = Gn(n), l = Ot(n) === "y", c = Ju.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Qt(e, t);
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
const zm = function(t) {
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
      } = e, l = await Fm(e, t);
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
}, Nm = function(t) {
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
              x: w,
              y: _
            } = C;
            return {
              x: w,
              y: _
            };
          }
        },
        ...c
      } = Qt(t, e), u = {
        x: n,
        y: i
      }, d = await s.detectOverflow(e, c), p = Ot(en(r)), f = uo(p);
      let h = u[f], m = u[p];
      if (o) {
        const C = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", _ = h + d[C], y = h - d[w];
        h = Ds(_, h, y);
      }
      if (a) {
        const C = p === "y" ? "top" : "left", w = p === "y" ? "bottom" : "right", _ = m + d[C], y = m - d[w];
        m = Ds(_, m, y);
      }
      const g = l.fn({
        ...e,
        [f]: h,
        [p]: m
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - i,
          enabled: {
            [f]: o,
            [p]: a
          }
        }
      };
    }
  };
}, qm = function(t) {
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
      } = Qt(t, e), u = {
        x: n,
        y: i
      }, d = Ot(r), p = uo(d);
      let f = u[p], h = u[d];
      const m = Qt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const _ = p === "y" ? "height" : "width", y = s.reference[p] - s.floating[_] + g.mainAxis, E = s.reference[p] + s.reference[_] - g.mainAxis;
        f < y ? f = y : f > E && (f = E);
      }
      if (c) {
        var C, w;
        const _ = p === "y" ? "width" : "height", y = Ju.has(en(r)), E = s.reference[d] - s.floating[_] + (y && ((C = o.offset) == null ? void 0 : C[d]) || 0) + (y ? 0 : g.crossAxis), T = s.reference[d] + s.reference[_] + (y ? 0 : ((w = o.offset) == null ? void 0 : w[d]) || 0) - (y ? g.crossAxis : 0);
        h < E ? h = E : h > T && (h = T);
      }
      return {
        [p]: f,
        [d]: h
      };
    }
  };
}, Hm = function(t) {
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
      } = Qt(t, e), u = await o.detectOverflow(e, c), d = en(r), p = Gn(r), f = Ot(r) === "y", {
        width: h,
        height: m
      } = s.floating;
      let g, C;
      d === "top" || d === "bottom" ? (g = d, C = p === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (C = d, g = p === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, _ = h - u.left - u.right, y = cn(m - u[g], w), E = cn(h - u[C], _), T = !e.middlewareData.shift;
      let x = y, R = E;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (R = _), (i = e.middlewareData.shift) != null && i.enabled.y && (x = w), T && !p) {
        const A = rt(u.left, 0), I = rt(u.right, 0), P = rt(u.top, 0), W = rt(u.bottom, 0);
        f ? R = h - 2 * (A !== 0 || I !== 0 ? A + I : rt(u.left, u.right)) : x = m - 2 * (P !== 0 || W !== 0 ? P + W : rt(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: R,
        availableHeight: x
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
function Mn(t) {
  return po(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function ot(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Bt(t) {
  var e;
  return (e = (po(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function po(t) {
  return Br() ? t instanceof Node || t instanceof ot(t).Node : !1;
}
function _t(t) {
  return Br() ? t instanceof Element || t instanceof ot(t).Element : !1;
}
function Lt(t) {
  return Br() ? t instanceof HTMLElement || t instanceof ot(t).HTMLElement : !1;
}
function La(t) {
  return !Br() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof ot(t).ShadowRoot;
}
const Wm = /* @__PURE__ */ new Set(["inline", "contents"]);
function Mi(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = xt(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !Wm.has(r);
}
const jm = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Vm(t) {
  return jm.has(Mn(t));
}
const Um = [":popover-open", ":modal"];
function Fr(t) {
  return Um.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Km = ["transform", "translate", "scale", "rotate", "perspective"], Xm = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Gm = ["paint", "layout", "strict", "content"];
function ho(t) {
  const e = vo(), n = _t(t) ? xt(t) : t;
  return Km.some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Xm.some((i) => (n.willChange || "").includes(i)) || Gm.some((i) => (n.contain || "").includes(i));
}
function Ym(t) {
  let e = dn(t);
  for (; Lt(e) && !Un(e); ) {
    if (ho(e))
      return e;
    if (Fr(e))
      return null;
    e = dn(e);
  }
  return null;
}
function vo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Jm = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Un(t) {
  return Jm.has(Mn(t));
}
function xt(t) {
  return ot(t).getComputedStyle(t);
}
function zr(t) {
  return _t(t) ? {
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
    La(t) && t.host || // Fallback.
    Bt(t)
  );
  return La(e) ? e.host : e;
}
function Zu(t) {
  const e = dn(t);
  return Un(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Lt(e) && Mi(e) ? e : Zu(e);
}
function Si(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = Zu(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = ot(r);
  if (s) {
    const a = Bs(o);
    return e.concat(o, o.visualViewport || [], Mi(r) ? r : [], a && n ? Si(a) : []);
  }
  return e.concat(r, Si(r, [], n));
}
function Bs(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Qu(t) {
  const e = xt(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Lt(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = dr(n) !== s || dr(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function mo(t) {
  return _t(t) ? t : t.contextElement;
}
function Wn(t) {
  const e = mo(t);
  if (!Lt(e))
    return Rt(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = Qu(e);
  let o = (s ? dr(n.width) : n.width) / i, a = (s ? dr(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Zm = /* @__PURE__ */ Rt(0);
function ec(t) {
  const e = ot(t);
  return !vo() || !e.visualViewport ? Zm : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Qm(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== ot(t) ? !1 : e;
}
function kn(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = mo(t);
  let o = Rt(1);
  e && (i ? _t(i) && (o = Wn(i)) : o = Wn(t));
  const a = Qm(s, n, i) ? ec(s) : Rt(0);
  let l = (r.left + a.x) / o.x, c = (r.top + a.y) / o.y, u = r.width / o.x, d = r.height / o.y;
  if (s) {
    const p = ot(s), f = i && _t(i) ? ot(i) : i;
    let h = p, m = Bs(h);
    for (; m && i && f !== h; ) {
      const g = Wn(m), C = m.getBoundingClientRect(), w = xt(m), _ = C.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, y = C.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += _, c += y, h = ot(m), m = Bs(h);
    }
  }
  return pr({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Nr(t, e) {
  const n = zr(t).scrollLeft;
  return e ? e.left + n : kn(Bt(t)).left + n;
}
function tc(t, e) {
  const n = t.getBoundingClientRect(), i = n.left + e.scrollLeft - Nr(t, n), r = n.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function eg(t) {
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
  const u = Rt(0), d = Lt(i);
  if ((d || !d && !s) && ((Mn(i) !== "body" || Mi(o)) && (l = zr(i)), Lt(i))) {
    const f = kn(i);
    c = Wn(i), u.x = f.x + i.clientLeft, u.y = f.y + i.clientTop;
  }
  const p = o && !d && !s ? tc(o, l) : Rt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + p.y
  };
}
function tg(t) {
  return Array.from(t.getClientRects());
}
function ng(t) {
  const e = Bt(t), n = zr(t), i = t.ownerDocument.body, r = rt(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = rt(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Nr(t);
  const a = -n.scrollTop;
  return xt(i).direction === "rtl" && (o += rt(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const Da = 25;
function ig(t, e) {
  const n = ot(t), i = Bt(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const u = vo();
    (!u || u && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const c = Nr(i);
  if (c <= 0) {
    const u = i.ownerDocument, d = u.body, p = getComputedStyle(d), f = u.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, h = Math.abs(i.clientWidth - d.clientWidth - f);
    h <= Da && (s -= h);
  } else c <= Da && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const rg = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function sg(t, e) {
  const n = kn(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = Lt(t) ? Wn(t) : Rt(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, c = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function $a(t, e, n) {
  let i;
  if (e === "viewport")
    i = ig(t, n);
  else if (e === "document")
    i = ng(Bt(t));
  else if (_t(e))
    i = sg(e, n);
  else {
    const r = ec(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return pr(i);
}
function nc(t, e) {
  const n = dn(t);
  return n === e || !_t(n) || Un(n) ? !1 : xt(n).position === "fixed" || nc(n, e);
}
function og(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Si(t, [], !1).filter((a) => _t(a) && Mn(a) !== "body"), r = null;
  const s = xt(t).position === "fixed";
  let o = s ? dn(t) : t;
  for (; _t(o) && !Un(o); ) {
    const a = xt(o), l = ho(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && rg.has(r.position) || Mi(o) && !l && nc(t, o)) ? i = i.filter((u) => u !== o) : r = a, o = dn(o);
  }
  return e.set(t, i), i;
}
function ag(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? Fr(e) ? [] : og(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((c, u) => {
    const d = $a(e, u, r);
    return c.top = rt(d.top, c.top), c.right = cn(d.right, c.right), c.bottom = cn(d.bottom, c.bottom), c.left = rt(d.left, c.left), c;
  }, $a(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function lg(t) {
  const {
    width: e,
    height: n
  } = Qu(t);
  return {
    width: e,
    height: n
  };
}
function ug(t, e, n) {
  const i = Lt(e), r = Bt(e), s = n === "fixed", o = kn(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Rt(0);
  function c() {
    l.x = Nr(r);
  }
  if (i || !i && !s)
    if ((Mn(e) !== "body" || Mi(r)) && (a = zr(e)), i) {
      const f = kn(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else r && c();
  s && !i && r && c();
  const u = r && !i && !s ? tc(r, a) : Rt(0), d = o.left + a.scrollLeft - l.x - u.x, p = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: p,
    width: o.width,
    height: o.height
  };
}
function us(t) {
  return xt(t).position === "static";
}
function Ba(t, e) {
  if (!Lt(t) || xt(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return Bt(t) === n && (n = n.ownerDocument.body), n;
}
function ic(t, e) {
  const n = ot(t);
  if (Fr(t))
    return n;
  if (!Lt(t)) {
    let r = dn(t);
    for (; r && !Un(r); ) {
      if (_t(r) && !us(r))
        return r;
      r = dn(r);
    }
    return n;
  }
  let i = Ba(t, e);
  for (; i && Vm(i) && us(i); )
    i = Ba(i, e);
  return i && Un(i) && us(i) && !ho(i) ? n : i || Ym(t) || n;
}
const cg = async function(t) {
  const e = this.getOffsetParent || ic, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: ug(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function dg(t) {
  return xt(t).direction === "rtl";
}
const fg = {
  convertOffsetParentRelativeRectToViewportRelativeRect: eg,
  getDocumentElement: Bt,
  getClippingRect: ag,
  getOffsetParent: ic,
  getElementRects: cg,
  getClientRects: tg,
  getDimensions: lg,
  getScale: Wn,
  isElement: _t,
  isRTL: dg
};
function rc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function pg(t, e) {
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
      width: p,
      height: f
    } = c;
    if (a || e(), !p || !f)
      return;
    const h = Ni(d), m = Ni(r.clientWidth - (u + p)), g = Ni(r.clientHeight - (d + f)), C = Ni(u), _ = {
      rootMargin: -h + "px " + -m + "px " + -g + "px " + -C + "px",
      threshold: rt(0, cn(1, l)) || 1
    };
    let y = !0;
    function E(T) {
      const x = T[0].intersectionRatio;
      if (x !== l) {
        if (!y)
          return o();
        x ? o(!1, x) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !rc(c, t.getBoundingClientRect()) && o(), y = !1;
    }
    try {
      n = new IntersectionObserver(E, {
        ..._,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(E, _);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function hg(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, c = mo(t), u = r || s ? [...c ? Si(c) : [], ...Si(e)] : [];
  u.forEach((C) => {
    r && C.addEventListener("scroll", n, {
      passive: !0
    }), s && C.addEventListener("resize", n);
  });
  const d = c && a ? pg(c, n) : null;
  let p = -1, f = null;
  o && (f = new ResizeObserver((C) => {
    let [w] = C;
    w && w.target === c && f && (f.unobserve(e), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var _;
      (_ = f) == null || _.observe(e);
    })), n();
  }), c && !l && f.observe(c), f.observe(e));
  let h, m = l ? kn(t) : null;
  l && g();
  function g() {
    const C = kn(t);
    m && !rc(m, C) && n(), m = C, h = requestAnimationFrame(g);
  }
  return n(), () => {
    var C;
    u.forEach((w) => {
      r && w.removeEventListener("scroll", n), s && w.removeEventListener("resize", n);
    }), d?.(), (C = f) == null || C.disconnect(), f = null, l && cancelAnimationFrame(h);
  };
}
const vg = zm, mg = Nm, Fa = $m, gg = Hm, yg = Bm, bg = Dm, wg = qm, _g = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: fg,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return Lm(t, e, {
    ...r,
    platform: s
  });
};
function xg(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function Fs(t) {
  if (xg(t)) {
    const e = t.$el;
    return po(e) && Mn(e) === "#comment" ? null : e;
  }
  return t;
}
function Bn(t) {
  return typeof t == "function" ? t() : v(t);
}
function Sg(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = Fs(Bn(t.element));
      return n == null ? {} : bg({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function sc(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function za(t, e) {
  const n = sc(t);
  return Math.round(e * n) / n;
}
function Cg(t, e, n) {
  n === void 0 && (n = {});
  const i = n.whileElementsMounted, r = L(() => {
    var x;
    return (x = Bn(n.open)) != null ? x : !0;
  }), s = L(() => Bn(n.middleware)), o = L(() => {
    var x;
    return (x = Bn(n.placement)) != null ? x : "bottom";
  }), a = L(() => {
    var x;
    return (x = Bn(n.strategy)) != null ? x : "absolute";
  }), l = L(() => {
    var x;
    return (x = Bn(n.transform)) != null ? x : !0;
  }), c = L(() => Fs(t.value)), u = L(() => Fs(e.value)), d = /* @__PURE__ */ B(0), p = /* @__PURE__ */ B(0), f = /* @__PURE__ */ B(a.value), h = /* @__PURE__ */ B(o.value), m = /* @__PURE__ */ Tn({}), g = /* @__PURE__ */ B(!1), C = L(() => {
    const x = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return x;
    const R = za(u.value, d.value), k = za(u.value, p.value);
    return l.value ? {
      ...x,
      transform: "translate(" + R + "px, " + k + "px)",
      ...sc(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: R + "px",
      top: k + "px"
    };
  });
  let w;
  function _() {
    if (c.value == null || u.value == null)
      return;
    const x = r.value;
    _g(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((R) => {
      d.value = R.x, p.value = R.y, f.value = R.strategy, h.value = R.placement, m.value = R.middlewareData, g.value = x !== !1;
    });
  }
  function y() {
    typeof w == "function" && (w(), w = void 0);
  }
  function E() {
    if (y(), i === void 0) {
      _();
      return;
    }
    if (c.value != null && u.value != null) {
      w = i(c.value, u.value, _);
      return;
    }
  }
  function T() {
    r.value || (g.value = !1);
  }
  return ye([s, o, a, r], _, {
    flush: "sync"
  }), ye([c, u], E, {
    flush: "sync"
  }), ye(r, T, {
    flush: "sync"
  }), Vs() && il(y), {
    x: /* @__PURE__ */ In(d),
    y: /* @__PURE__ */ In(p),
    strategy: /* @__PURE__ */ In(f),
    placement: /* @__PURE__ */ In(h),
    middlewareData: /* @__PURE__ */ In(m),
    isPositioned: /* @__PURE__ */ In(g),
    floatingStyles: C,
    update: _
  };
}
const Eg = {
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
}, [t0, Tg] = $t("PopperContent");
var kg = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Id({
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
  }, { ...Eg }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = Gu(), { forwardRef: s, currentElement: o } = Ie(), a = /* @__PURE__ */ B(), l = /* @__PURE__ */ B(), { width: c, height: u } = kv(l), d = L(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), p = L(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), f = L(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = L(() => ({
      padding: p.value,
      boundary: f.value.filter(wm),
      altBoundary: f.value.length > 0
    })), m = L(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), g = tv(() => [
      vg({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && Fa({
        ...h.value,
        ...m.value
      }),
      n.avoidCollisions && mg({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? wg() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && Fa({
        ...h.value,
        ...m.value
      }),
      gg({
        ...h.value,
        apply: ({ elements: P, rects: W, availableWidth: D, availableHeight: U }) => {
          const { width: ne, height: J } = W.reference, Q = P.floating.style;
          Q.setProperty("--reka-popper-available-width", `${D}px`), Q.setProperty("--reka-popper-available-height", `${U}px`), Q.setProperty("--reka-popper-anchor-width", `${ne}px`), Q.setProperty("--reka-popper-anchor-height", `${J}px`);
        }
      }),
      l.value && Sg({
        element: l.value,
        padding: n.arrowPadding
      }),
      _m({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && yg({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), C = L(() => n.reference ?? r.anchor.value), { floatingStyles: w, placement: _, isPositioned: y, middlewareData: E } = Cg(C, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...P) => hg(...P, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: g
    }), T = L(() => Ls(_.value)[0]), x = L(() => Ls(_.value)[1]);
    Ol(() => {
      y.value && i("placed");
    });
    const R = L(() => {
      const P = E.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && P;
    }), k = /* @__PURE__ */ B("");
    ft(() => {
      o.value && (k.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = L(() => E.value.arrow?.x ?? 0), I = L(() => E.value.arrow?.y ?? 0);
    return Tg({
      placedSide: T,
      onArrowChange: (P) => l.value = P,
      arrowX: A,
      arrowY: I,
      shouldHideArrow: R
    }), (P, W) => (M(), oe("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Dt({
        ...v(w),
        transform: v(y) ? v(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: k.value,
        "--reka-popper-transform-origin": [v(E).transformOrigin?.x, v(E).transformOrigin?.y].join(" "),
        ...v(E).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [H(v(Oe), Ce({ ref: v(s) }, P.$attrs, {
      "as-child": n.asChild,
      as: P.as,
      "data-side": T.value,
      "data-align": x.value,
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
}), Ag = kg;
function Pg(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => fi(i, e, n)) : fi(t, e, n);
}
function fi(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : lr(t, e);
}
const [oc, Og] = $t("ListboxRoot");
var Mg = /* @__PURE__ */ Z({
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
    const i = t, r = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ Kn(i), { getItems: d } = hn({ isProvider: !0 }), { handleTypeaheadSearch: p } = ao(), { primitiveElement: f, currentElement: h } = cr(), m = Tv(), g = Iu(u), C = Lu(h), w = /* @__PURE__ */ B(), _ = /* @__PURE__ */ B(!1), y = /* @__PURE__ */ B(!0), E = /* @__PURE__ */ ur(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function T(G) {
      if (_.value = !0, i.multiple) {
        const re = Array.isArray(E.value) ? [...E.value] : [], ue = re.findIndex((he) => fi(he, G, i.by));
        i.selectionBehavior === "toggle" ? (ue === -1 ? re.push(G) : re.splice(ue, 1), E.value = re) : (E.value = [G], w.value = G);
      } else i.selectionBehavior === "toggle" && fi(E.value, G, i.by) ? E.value = void 0 : E.value = G;
      setTimeout(() => {
        _.value = !1;
      }, 1);
    }
    const x = /* @__PURE__ */ B(null), R = /* @__PURE__ */ B(null), k = /* @__PURE__ */ B(!1), A = /* @__PURE__ */ B(!1), I = /* @__PURE__ */ ns(), P = /* @__PURE__ */ ns(), W = /* @__PURE__ */ ns();
    function D() {
      return d().map((G) => G.ref).filter((G) => G.dataset.disabled !== "");
    }
    function U(G, re = !0) {
      if (!G) return;
      x.value = G, y.value && x.value.focus(), re && x.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((he) => he.ref === G);
      r("highlight", ue);
    }
    function ne(G) {
      if (k.value) W.trigger(G);
      else {
        const re = d().find((ue) => fi(ue.value, G, i.by));
        re && (x.value = re.ref, U(re.ref));
      }
    }
    function J(G) {
      x.value && x.value.isConnected && (G.preventDefault(), G.stopPropagation(), A.value || x.value.click());
    }
    function Q(G) {
      if (y.value) {
        if (_.value = !0, k.value) P.trigger(G);
        else {
          const re = G.altKey || G.ctrlKey || G.metaKey;
          if (re && G.key === "a" && s.value) {
            const ue = d(), he = ue.map((ht) => ht.value);
            E.value = [...he], G.preventDefault(), U(ue[ue.length - 1].ref);
          } else if (!re) {
            const ue = p(G.key, d());
            ue && U(ue);
          }
        }
        setTimeout(() => {
          _.value = !1;
        }, 1);
      }
    }
    function we() {
      A.value = !0;
    }
    function Le() {
      Me(() => {
        A.value = !1;
      });
    }
    function Ze() {
      Me(() => {
        const G = new KeyboardEvent("keydown", { key: "PageUp" });
        zt(G);
      });
    }
    function Ae(G) {
      const re = x.value;
      re?.isConnected && (R.value = re), x.value = null, r("leave", G);
    }
    function Ft(G) {
      const re = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (G.currentTarget?.dispatchEvent(re), r("entryFocus", re), !re.defaultPrevented)
        if (R.value) U(R.value);
        else {
          const ue = D()?.[0];
          U(ue);
        }
    }
    function zt(G) {
      const re = cm(G, a.value, g.value);
      if (!re) return;
      let ue = D();
      if (x.value) {
        if (re === "last") ue.reverse();
        else if (re === "prev" || re === "next") {
          re === "prev" && ue.reverse();
          const he = ue.indexOf(x.value);
          ue = ue.slice(he + 1);
        }
        Yn(G, ue[0]);
      }
      if (ue.length) {
        const he = !x.value && re === "prev" ? ue.length - 1 : 0;
        U(ue[he]);
      }
      if (k.value) return P.trigger(G);
    }
    function Yn(G, re) {
      if (!(k.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(E.value) || (G.altKey || G.ctrlKey || G.metaKey) && !G.shiftKey) && G.shiftKey) {
        const he = d().filter((S) => S.ref.dataset.disabled !== "");
        let ht = he.find((S) => S.ref === re)?.value;
        if (G.key === m.END ? ht = he[he.length - 1].value : G.key === m.HOME && (ht = he[0].value), !ht || !w.value) return;
        const b = ev(he.map((S) => S.value), w.value, ht);
        E.value = b;
      }
    }
    async function Nt(G) {
      if (await Me(), k.value) I.trigger(G);
      else {
        const re = D(), ue = re.find((he) => he.dataset.state === "checked");
        ue ? U(ue) : re.length && U(re[0]);
      }
    }
    return ye(E, () => {
      _.value || Me(() => {
        Nt();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: x,
      highlightItem: ne,
      highlightFirstItem: Ze,
      highlightSelected: Nt,
      getItems: d
    }), Og({
      modelValue: E,
      onValueChange: T,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: x,
      isVirtual: k,
      virtualFocusHook: I,
      virtualKeydownHook: P,
      virtualHighlightHook: W,
      by: i.by,
      firstValue: w,
      selectionBehavior: c,
      focusable: y,
      onLeave: Ae,
      onEnter: Ft,
      changeHighlight: U,
      onKeydownEnter: J,
      onKeydownNavigation: zt,
      onKeydownTypeAhead: Q,
      onCompositionStart: we,
      onCompositionEnd: Le,
      highlightFirstItem: Ze
    }), (G, re) => (M(), X(v(Oe), {
      ref_key: "primitiveElement",
      ref: f,
      as: G.as,
      "as-child": G.asChild,
      dir: v(g),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Ae,
      onFocusout: re[0] || (re[0] = async (ue) => {
        const he = ue.relatedTarget || ue.target;
        await Me(), x.value && v(h) && !v(h).contains(he) && Ae(ue);
      })
    }, {
      default: q(() => [ce(G.$slots, "default", { modelValue: v(E) }), v(C) && G.name ? (M(), X(v(hm), {
        key: 0,
        name: G.name,
        value: v(E),
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
}), Rg = Mg, Ig = /* @__PURE__ */ Z({
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
    const { CollectionSlot: e } = hn(), n = oc(), i = Au(!1, 10);
    return (r, s) => (M(), X(v(e), null, {
      default: q(() => [H(v(Oe), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: s[0] || (s[0] = un((o) => i.value = !0, ["left"])),
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
}), Lg = Ig;
const Dg = "listbox.select", [$g, Bg] = $t("ListboxItem");
var Fg = /* @__PURE__ */ Z({
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
    const n = t, i = e, r = xi(void 0, "reka-listbox-item"), { CollectionItem: s } = hn(), { forwardRef: o, currentElement: a } = Ie(), l = oc(), c = L(() => a.value === l.highlightedElement.value), u = L(() => Pg(l.modelValue.value, n.value, l.by)), d = L(() => l.disabled.value || n.disabled);
    async function p(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function f(h) {
      const m = {
        originalEvent: h,
        value: n.value
      };
      Ir(Dg, p, m);
    }
    return Bg({ isSelected: u }), (h, m) => (M(), X(v(s), { value: h.value }, {
      default: q(() => [gf([c.value, u.value], () => H(v(Oe), Ce({ id: v(r) }, h.$attrs, {
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
        onKeydown: As(un(f, ["prevent"]), ["space"]),
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
}), zg = Fg, Ng = /* @__PURE__ */ Z({
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
    const n = $g();
    return (i, r) => v(n).isSelected.value ? (M(), X(v(Oe), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), qg = Ng;
function Hg(t) {
  const e = so({ nonce: /* @__PURE__ */ B() });
  return L(() => t?.value || e.nonce?.value);
}
const Wg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], jg = [" ", "Enter"], vt = 10;
function Ci(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => zs(i, e, n)) : zs(t, e, n);
}
function zs(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : lr(t, e);
}
function Vg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const Ug = {
  key: 0,
  value: ""
}, [vn, ac] = $t("SelectRoot");
var Kg = /* @__PURE__ */ Z({
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
    }), u = /* @__PURE__ */ B(), d = /* @__PURE__ */ B(), p = /* @__PURE__ */ B({
      x: 0,
      y: 0
    }), f = L(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Ms(l.value));
    hn({ isProvider: !0 });
    const h = Iu(a), m = Lu(u), g = /* @__PURE__ */ B(/* @__PURE__ */ new Set()), C = L(() => Array.from(g.value).map((y) => y.value).join(";"));
    function w(y) {
      if (o.value) {
        const E = Array.isArray(l.value) ? [...l.value] : [], T = E.findIndex((x) => zs(x, y, n.by));
        T === -1 ? E.push(y) : E.splice(T, 1), l.value = [...E];
      } else l.value = y;
    }
    function _(y) {
      return Array.from(g.value).find((E) => Ci(y, E.value, n.by));
    }
    return ac({
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
      triggerPointerDownPosRef: p,
      disabled: s,
      isEmptyModelValue: f,
      optionsSet: g,
      onOptionAdd: (y) => {
        const E = _(y.value);
        E && g.value.delete(E), g.value.add(y);
      },
      onOptionRemove: (y) => {
        const E = _(y.value);
        E && g.value.delete(E);
      }
    }), (y, E) => (M(), X(v(gm), null, {
      default: q(() => [ce(y.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(m) ? (M(), X(Yg, {
        key: C.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(r),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: v(s),
        value: v(l)
      }, {
        default: q(() => [v(Ms)(v(l)) ? (M(), oe("option", Ug)) : fe("v-if", !0), (M(!0), oe(Ee, null, Pn(Array.from(g.value), (T) => (M(), oe("option", Ce({ key: T.value ?? "" }, { ref_for: !0 }, T), null, 16))), 128))]),
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
}), Xg = Kg, Gg = /* @__PURE__ */ Z({
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
    const e = t, n = /* @__PURE__ */ B(), i = vn();
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
    return (s, o) => (M(), X(v(Xu), { "as-child": "" }, {
      default: q(() => [se("select", Ce({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: r }), [ce(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Yg = Gg, Jg = /* @__PURE__ */ Z({
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
      default: vt
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
    const n = oo(t);
    return (i, r) => (M(), X(v(Ag), Ce(v(n), { style: {
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
}), Zg = Jg;
const Qg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [qr, lc] = $t("SelectContent");
var ey = /* @__PURE__ */ Z({
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
    wv(), Mu(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = hn(), a = /* @__PURE__ */ B();
    $u(a);
    const { search: l, handleTypeaheadSearch: c } = ao(), u = /* @__PURE__ */ B(), d = /* @__PURE__ */ B(), p = /* @__PURE__ */ B(), f = /* @__PURE__ */ B(!1), h = /* @__PURE__ */ B(!1), m = /* @__PURE__ */ B(!1);
    function g() {
      d.value && a.value && Ta([d.value, a.value]);
    }
    ye(f, () => {
      g();
    });
    const { onOpenChange: C, triggerPointerDownPosRef: w } = r;
    ft((T) => {
      if (!a.value) return;
      let x = {
        x: 0,
        y: 0
      };
      const R = (A) => {
        x = {
          x: Math.abs(Math.round(A.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(A.pageY) - (w.value?.y ?? 0))
        };
      }, k = (A) => {
        A.pointerType !== "touch" && (x.x <= 10 && x.y <= 10 ? A.preventDefault() : a.value?.contains(A.target) || C(!1), document.removeEventListener("pointermove", R), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", R), document.addEventListener("pointerup", k, {
        capture: !0,
        once: !0
      })), T(() => {
        document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", k, { capture: !0 });
      });
    });
    function _(T) {
      const x = T.ctrlKey || T.altKey || T.metaKey;
      if (T.key === "Tab" && T.preventDefault(), !x && T.key.length === 1 && c(T.key, o()), [
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
        setTimeout(() => Ta(k)), T.preventDefault();
      }
    }
    const y = L(() => n.position === "popper" ? n : {}), E = oo(y.value);
    return lc({
      content: a,
      viewport: u,
      onViewportChange: (T) => {
        u.value = T;
      },
      itemRefCallback: (T, x, R) => {
        const k = !h.value && !R, A = Ci(r.modelValue.value, x, r.by);
        if (r.multiple.value) {
          if (m.value) return;
          (A || k) && (d.value = T, A && (m.value = !0));
        } else (A || k) && (d.value = T);
        k && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: p,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (T, x, R) => {
        const k = !h.value && !R;
        (Ci(r.modelValue.value, x, r.by) || k) && (p.value = T);
      },
      focusSelectedItem: g,
      position: n.position,
      isPositioned: f,
      searchRef: l
    }), (T, x) => (M(), X(v(s), null, {
      default: q(() => [H(v(qu), {
        "as-child": "",
        onMountAutoFocus: x[6] || (x[6] = un(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: x[7] || (x[7] = (R) => {
          i("closeAutoFocus", R), !R.defaultPrevented && (v(r).triggerElement.value?.focus({ preventScroll: !0 }), R.preventDefault());
        })
      }, {
        default: q(() => [H(v(zu), {
          "as-child": "",
          "disable-outside-pointer-events": T.disableOutsidePointerEvents,
          onFocusOutside: x[2] || (x[2] = un(() => {
          }, ["prevent"])),
          onDismiss: x[3] || (x[3] = (R) => v(r).onOpenChange(!1)),
          onEscapeKeyDown: x[4] || (x[4] = (R) => i("escapeKeyDown", R)),
          onPointerDownOutside: x[5] || (x[5] = (R) => i("pointerDownOutside", R))
        }, {
          default: q(() => [(M(), X(Ad(T.position === "popper" ? Zg : sy), Ce({
            ...T.$attrs,
            ...v(E)
          }, {
            id: v(r).contentId,
            ref: (R) => {
              const k = v(It)(R);
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
            onContextmenu: x[0] || (x[0] = un(() => {
            }, ["prevent"])),
            onPlaced: x[1] || (x[1] = (R) => f.value = !0),
            onKeydown: _
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
}), ty = ey;
const [ny, iy] = $t("SelectItemAlignedPosition");
var ry = /* @__PURE__ */ Z({
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
    const n = t, i = e, { getItems: r } = hn(), s = vn(), o = qr(), a = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!0), c = /* @__PURE__ */ B(), { forwardRef: u, currentElement: d } = Ie(), { viewport: p, selectedItem: f, selectedItemText: h, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && p?.value && f?.value && h?.value) {
        const _ = s.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), E = s.valueElement.value.getBoundingClientRect(), T = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const G = T.left - y.left, re = E.left - G, ue = _.left - re, he = _.width + ue, ht = Math.max(he, y.width), b = window.innerWidth - vt, S = wa(re, vt, Math.max(vt, b - ht));
          c.value.style.minWidth = `${he}px`, c.value.style.left = `${S}px`;
        } else {
          const G = y.right - T.right, re = window.innerWidth - E.right - G, ue = window.innerWidth - _.right - re, he = _.width + ue, ht = Math.max(he, y.width), b = window.innerWidth - vt, S = wa(re, vt, Math.max(vt, b - ht));
          c.value.style.minWidth = `${he}px`, c.value.style.right = `${S}px`;
        }
        const x = r().map((G) => G.ref), R = window.innerHeight - vt * 2, k = p.value.scrollHeight, A = window.getComputedStyle(d.value), I = Number.parseInt(A.borderTopWidth, 10), P = Number.parseInt(A.paddingTop, 10), W = Number.parseInt(A.borderBottomWidth, 10), D = Number.parseInt(A.paddingBottom, 10), U = I + P + k + D + W, ne = Math.min(f.value.offsetHeight * 5, U), J = window.getComputedStyle(p.value), Q = Number.parseInt(J.paddingTop, 10), we = Number.parseInt(J.paddingBottom, 10), Le = _.top + _.height / 2 - vt, Ze = R - Le, Ae = f.value.offsetHeight / 2, Ft = f.value.offsetTop + Ae, zt = I + P + Ft, Yn = U - zt;
        if (zt <= Le) {
          const G = f.value === x[x.length - 1];
          c.value.style.bottom = "0px";
          const re = d.value.clientHeight - p.value.offsetTop - p.value.offsetHeight, ue = Math.max(Ze, Ae + (G ? we : 0) + re + W), he = zt + ue;
          c.value.style.height = `${he}px`;
        } else {
          const G = f.value === x[0];
          c.value.style.top = "0px";
          const ue = Math.max(Le, I + p.value.offsetTop + (G ? Q : 0) + Ae) + Yn;
          c.value.style.height = `${ue}px`, p.value.scrollTop = zt - Le + p.value.offsetTop;
        }
        c.value.style.margin = `${vt}px 0`, c.value.style.minHeight = `${ne}px`, c.value.style.maxHeight = `${R}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const C = /* @__PURE__ */ B("");
    Re(async () => {
      await Me(), g(), d.value && (C.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(_) {
      _ && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return vv(s.triggerElement, () => {
      g();
    }), iy({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: w
    }), (_, y) => (M(), oe("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: Dt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: C.value
      })
    }, [H(v(Oe), Ce({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ..._.$attrs,
      ...n
    }), {
      default: q(() => [ce(_.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), sy = ry, oy = /* @__PURE__ */ Z({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return ac(t.context), lc(Qg), (n, i) => ce(n.$slots, "default");
  }
}), ay = oy;
const ly = { key: 1 };
var uy = /* @__PURE__ */ Z({
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
    const n = t, r = _v(n, e), s = vn(), o = /* @__PURE__ */ B();
    Re(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ B(), l = L(() => n.forceMount || s.open.value), c = /* @__PURE__ */ B(l.value);
    return ye(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (M(), X(v(lo), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: q(() => [H(ty, Ws(Mr({
        ...v(r),
        ...u.$attrs
      })), {
        default: q(() => [ce(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (M(), oe("div", ly, [(M(), X(Dl, { to: o.value }, [H(ay, { context: v(s) }, {
      default: q(() => [ce(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : fe("v-if", !0);
  }
}), cy = uy, dy = /* @__PURE__ */ Z({
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
    return (e, n) => (M(), X(v(Oe), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: q(() => [ce(e.$slots, "default", {}, () => [n[0] || (n[0] = Be("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), fy = dy;
const [uc, py] = $t("SelectItem");
var hy = /* @__PURE__ */ Z({
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
    const n = t, i = e, { disabled: r } = /* @__PURE__ */ Kn(n), s = vn(), o = qr(), { forwardRef: a, currentElement: l } = Ie(), { CollectionItem: c } = hn(), u = L(() => Ci(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ B(!1), p = /* @__PURE__ */ B(n.textValue ?? ""), f = xi(void 0, "reka-select-item-text"), h = "select.select";
    async function m(y) {
      if (y.defaultPrevented) return;
      const E = {
        originalEvent: y,
        value: n.value
      };
      Ir(h, g, E);
    }
    async function g(y) {
      await Me(), i("select", y), !y.defaultPrevented && (r.value || (s.onValueChange(n.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function C(y) {
      await Me(), !y.defaultPrevented && (r.value ? o.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(y) {
      await Me(), !y.defaultPrevented && y.currentTarget === dt() && o.onItemLeave?.();
    }
    async function _(y) {
      await Me(), !(y.defaultPrevented || o.searchRef?.value !== "" && y.key === " ") && (jg.includes(y.key) && m(y), y.key === " " && y.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return Re(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), py({
      value: n.value,
      disabled: r,
      textId: f,
      isSelected: u,
      onItemTextChange: (y) => {
        p.value = ((p.value || y?.textContent) ?? "").trim();
      }
    }), (y, E) => (M(), X(v(c), { value: { textValue: p.value } }, {
      default: q(() => [H(v(Oe), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(r) || void 0,
        "data-disabled": v(r) ? "" : void 0,
        tabindex: v(r) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: E[0] || (E[0] = (T) => d.value = !0),
        onBlur: E[1] || (E[1] = (T) => d.value = !1),
        onPointerup: m,
        onPointerdown: E[2] || (E[2] = (T) => {
          T.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: E[3] || (E[3] = un(() => {
        }, ["prevent", "stop"])),
        onPointermove: C,
        onPointerleave: w,
        onKeydown: _
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
}), vy = hy, my = /* @__PURE__ */ Z({
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
    const e = t, n = uc();
    return (i, r) => v(n).isSelected.value ? (M(), X(v(Oe), Ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: q(() => [ce(i.$slots, "default")]),
      _: 3
    }, 16)) : fe("v-if", !0);
  }
}), gy = my, yy = /* @__PURE__ */ Z({
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
    const e = t, n = vn(), i = qr(), r = uc(), { forwardRef: s, currentElement: o } = Ie(), a = L(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: o.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return Re(() => {
      o.value && (r.onItemTextChange(o.value), i.itemTextRefCallback(o.value, r.value, r.disabled.value), n.onOptionAdd(a.value));
    }), An(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (M(), X(v(Oe), Ce({
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
}), by = yy, wy = /* @__PURE__ */ Z({
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
    return (n, i) => (M(), X(v(Vu), Ws(Mr(e)), {
      default: q(() => [ce(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), _y = wy, xy = /* @__PURE__ */ Z({
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
    const e = t, n = vn(), { forwardRef: i, currentElement: r } = Ie(), s = L(() => n.disabled?.value || e.disabled);
    n.contentId ||= xi(void 0, "reka-select-content"), Re(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: o } = hn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = ao();
    function u() {
      s.value || (n.onOpenChange(!0), c());
    }
    function d(p) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      };
    }
    return (p, f) => (M(), X(v(bm), {
      "as-child": "",
      reference: p.reference
    }, {
      default: q(() => [H(v(Oe), {
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
        "data-placeholder": v(Vg)(v(n).modelValue?.value) ? "" : void 0,
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
        onPointerup: f[2] || (f[2] = un((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (h) => {
          const m = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && m && h.key === " " || (v(l)(h.key, v(o)()), v(Wg).includes(h.key) && (u(), h.preventDefault()));
        })
      }, {
        default: q(() => [ce(p.$slots, "default")]),
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
}), Sy = xy, Cy = /* @__PURE__ */ Z({
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
    Re(() => {
      r.valueElement = i;
    });
    const s = L(() => {
      let a = [];
      const l = Array.from(r.optionsSet.value), c = (u) => l.find((d) => Ci(u, d.value, r.by));
      return Array.isArray(r.modelValue.value) ? a = r.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(r.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = L(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (M(), X(v(Oe), {
      ref: v(n),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: q(() => [ce(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: v(r).modelValue.value
      }, () => [Be(de(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Ey = Cy, Ty = /* @__PURE__ */ Z({
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
    const e = t, { nonce: n } = /* @__PURE__ */ Kn(e), i = Hg(n), r = qr(), s = r.position === "item-aligned" ? ny() : void 0, { forwardRef: o, currentElement: a } = Ie();
    Re(() => {
      r?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ B(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: p, contentWrapper: f } = s ?? {};
      if (p?.value && f?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const m = window.innerHeight - vt * 2, g = Number.parseFloat(f.value.style.minHeight), C = Number.parseFloat(f.value.style.height), w = Math.max(g, C);
          if (w < m) {
            const _ = w + h, y = Math.min(m, _), E = _ - y;
            f.value.style.height = `${y}px`, f.value.style.bottom === "0px" && (d.scrollTop = E > 0 ? E : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (M(), oe(Ee, null, [H(v(Oe), Ce({
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
    }, 16), H(v(Oe), {
      as: "style",
      nonce: v(i)
    }, {
      default: q(() => d[0] || (d[0] = [Be(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), ky = Ty;
const Ay = /* @__PURE__ */ Z({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, i = /* @__PURE__ */ B(), r = /* @__PURE__ */ B([]);
    return Re(() => {
      const s = i.value?.closest(".speaker-sidebar");
      s && (r.value = [s]);
    }), (s, o) => (M(), oe("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      H(v(Xg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (a) => n("update:selectedValue", a))
      }, {
        default: q(() => [
          H(v(Sy), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: q(() => [
              H(v(Ey), { class: "sidebar-select-trigger-label" }),
              H(v(fy), null, {
                default: q(() => [
                  H(v(op), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          H(v(_y), { disabled: "" }, {
            default: q(() => [
              H(v(cy), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": r.value
              }, {
                default: q(() => [
                  H(v(ky), null, {
                    default: q(() => [
                      (M(!0), oe(Ee, null, Pn(t.items, (a) => (M(), X(v(vy), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: q(() => [
                          H(v(gy), { class: "sidebar-select-item-indicator" }, {
                            default: q(() => [
                              H(v(to), { size: 14 })
                            ]),
                            _: 1
                          }),
                          H(v(by), null, {
                            default: q(() => [
                              Be(de(a.label), 1)
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
}), Py = { class: "sidebar-select" }, Oy = ["aria-label"], My = { class: "sidebar-select-trigger-label" }, Ry = /* @__PURE__ */ Z({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = /* @__PURE__ */ B(!1), s = L(
      () => n.items.find((a) => a.value === n.selectedValue)?.label ?? ""
    );
    function o(a) {
      i("update:selectedValue", a), r.value = !1;
    }
    return (a, l) => (M(), oe("div", Py, [
      se("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: l[0] || (l[0] = (c) => r.value = !0)
      }, [
        se("span", My, de(s.value), 1)
      ], 8, Oy),
      H(v(Bu), {
        open: r.value,
        "onUpdate:open": l[2] || (l[2] = (c) => r.value = c)
      }, {
        default: q(() => [
          H(v(Uu), { disabled: "" }, {
            default: q(() => [
              H(v(ju), { class: "editor-overlay" }),
              H(v(Wu), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: q(() => [
                  H(v(Ku), { class: "sr-only" }, {
                    default: q(() => [
                      Be(de(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = se("div", { class: "sheet-handle" }, null, -1)),
                  H(v(Rg), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: q(() => [
                      H(v(Lg), { class: "sheet-list" }, {
                        default: q(() => [
                          (M(!0), oe(Ee, null, Pn(t.items, (c) => (M(), X(v(zg), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: q(() => [
                              H(v(qg), { class: "sheet-item-indicator" }, {
                                default: q(() => [
                                  H(v(to), { size: 16 })
                                ]),
                                _: 1
                              }),
                              se("span", null, de(c.label), 1)
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
}), go = /* @__PURE__ */ Z({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: i } = ku();
    return (r, s) => v(i) ? (M(), X(Ry, Ce({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), null, 16)) : (M(), X(Ay, Ce({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => n("update:selectedValue", o))
    }), null, 16));
  }
}), cc = /* @__PURE__ */ Z({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r } = pt(), s = L(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (M(), X(go, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Iy = { class: "speaker-sidebar" }, Ly = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Dy = { class: "sidebar-title" }, $y = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, By = { class: "sidebar-title" }, Fy = {
  key: 2,
  class: "sidebar-section"
}, zy = { class: "sidebar-title" }, Ny = { class: "subtitle-toggle" }, qy = { class: "subtitle-toggle-label" }, Hy = { class: "subtitle-slider" }, Wy = { class: "subtitle-slider-label" }, jy = { class: "subtitle-slider-value" }, Vy = ["value", "disabled"], Uy = {
  key: 3,
  class: "sidebar-section"
}, Ky = { class: "sidebar-title" }, Xy = { class: "speaker-list" }, Gy = { class: "speaker-name" }, Yy = /* @__PURE__ */ Z({
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
    const e = t, n = On(), { t: i, locale: r } = pt(), s = L(
      () => _u(e.translations, r.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (o, a) => (M(), oe("aside", Iy, [
      t.channels.length > 1 ? (M(), oe("section", Ly, [
        se("h2", Dy, de(v(i)("sidebar.channel")), 1),
        H(cc, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : fe("", !0),
      t.translations.length > 1 ? (M(), oe("section", $y, [
        se("h2", By, de(v(i)("sidebar.translation")), 1),
        H(go, {
          items: s.value,
          "selected-value": t.selectedTranslationId,
          ariaLabel: v(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : fe("", !0),
      v(n).subtitle ? (M(), oe("section", Fy, [
        se("h2", zy, de(v(i)("sidebar.subtitle")), 1),
        se("div", Ny, [
          se("span", qy, de(v(i)("subtitle.show")), 1),
          H(Jh, {
            modelValue: v(n).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => v(n).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        se("label", Hy, [
          se("span", Wy, [
            Be(de(v(i)("subtitle.fontSize")) + " ", 1),
            se("span", jy, de(v(n).subtitle.fontSize.value) + "px", 1)
          ]),
          se("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(n).subtitle.fontSize.value,
            disabled: !v(n).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => v(n).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Vy)
        ])
      ])) : fe("", !0),
      t.speakers.length ? (M(), oe("section", Uy, [
        se("h2", Ky, de(v(i)("sidebar.speakers")), 1),
        se("ul", Xy, [
          (M(!0), oe(Ee, null, Pn(t.speakers, (l) => (M(), oe("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            H(Su, {
              color: l.color
            }, null, 8, ["color"]),
            se("span", Gy, de(l.name), 1)
          ]))), 128))
        ])
      ])) : fe("", !0)
    ]));
  }
}), Jy = ".speaker-sidebar[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-0a4624c1]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-0a4624c1]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-0a4624c1]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-0a4624c1]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-0a4624c1]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-0a4624c1]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-0a4624c1]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-0a4624c1]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-0a4624c1]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-0a4624c1]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-0a4624c1]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-0a4624c1]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-0a4624c1]{border-left:none}.sidebar-section--selector[data-v-0a4624c1]{display:none}}", Na = /* @__PURE__ */ Fe(Yy, [["styles", [Jy]], ["__scopeId", "data-v-0a4624c1"]]), Zy = /* @__PURE__ */ Z({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = qd(t, "open"), { t: n } = pt();
    return (i, r) => (M(), X(v(Bu), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (s) => e.value = s)
    }, {
      default: q(() => [
        H(v(Uu), { disabled: "" }, {
          default: q(() => [
            H(v(ju), { class: "editor-overlay" }),
            H(v(Wu), { class: "sidebar-drawer" }, {
              default: q(() => [
                H(v(Ku), { class: "sr-only" }, {
                  default: q(() => [
                    Be(de(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                H(v($v), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: q(() => [
                    H(v(no), { size: 20 })
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
}), Qy = { class: "player-controls" }, eb = { class: "controls-left" }, tb = { class: "controls-time" }, nb = { class: "time-display" }, ib = { class: "time-display" }, rb = { class: "controls-right" }, sb = ["value", "aria-label", "disabled"], ob = /* @__PURE__ */ Z({
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
    const n = e, { t: i } = pt(), r = /* @__PURE__ */ B(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (M(), oe("div", Qy, [
      se("div", eb, [
        H(ct, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, {
          icon: q(() => [
            H(v(fp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        H(ct, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": t.isPlaying ? v(i)("player.pause") : v(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, {
          icon: q(() => [
            t.isPlaying ? (M(), X(v(up), {
              key: 0,
              size: 20
            })) : (M(), X(v(cp), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        H(ct, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, {
          icon: q(() => [
            H(v(pp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      se("div", tb, [
        se("time", nb, de(t.currentTime), 1),
        a[7] || (a[7] = se("span", { class: "time-separator" }, "/", -1)),
        se("time", ib, de(t.duration), 1)
      ]),
      se("div", rb, [
        se("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          H(ct, {
            variant: "ghost",
            size: "md",
            "aria-label": t.isMuted ? v(i)("player.unmute") : v(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, {
            icon: q(() => [
              t.isMuted ? (M(), X(v(mp), {
                key: 0,
                size: 16
              })) : (M(), X(v(vp), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          ld(se("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": v(i)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, sb), [
            [Of, r.value]
          ])
        ], 32),
        H(ct, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: q(() => [
            Be(de(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), ab = ".player-controls[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-02ebaa64]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-02ebaa64]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-02ebaa64]:disabled{opacity:.5;cursor:default}.play-button[data-v-02ebaa64]{width:40px;height:40px}.speed-button[data-v-02ebaa64]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-02ebaa64],.volume-slider[data-v-02ebaa64]{display:none}.player-controls[data-v-02ebaa64]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", lb = /* @__PURE__ */ Fe(ob, [["styles", [ab]], ["__scopeId", "data-v-02ebaa64"]]);
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
const qi = { decode: function(t, e) {
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
function dc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(dc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function qa(t, e, n) {
  const i = dc(t, e || {});
  return n?.appendChild(i), i;
}
var ub = Object.freeze({ __proto__: null, createElement: qa, default: qa });
const cb = { fetchBlob: function(t, e, n) {
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
function ln(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
class db extends Ri {
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
function fb({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: r = 0, barAlign: s }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < r && (a = r, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function pb({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: r }) {
  return t === "top" ? 0 : t === "bottom" ? r - i : e - n;
}
function Ha(t, e, n) {
  const i = e - t.left, r = n - t.top;
  return [i / t.width, r / t.height];
}
function fc(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Wa(t, e) {
  if (!fc(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function ja({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, r = Math.floor(i * n);
  return [r - 1, r, r + 1];
}
function pc(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function hb(t) {
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
    t.removeEventListener("scroll", r), pc(e);
  } };
}
class vb extends Ri {
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
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Ha(i, n.clientX, n.clientY);
      this.emit("click", r, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Ha(i, n.clientX, n.clientY);
      this.emit("dblclick", r, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = hb(this.scrollContainer);
    const e = ln((() => {
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
      const d = (p) => {
        if (p.button !== s || (l.set(p.pointerId, p), l.size > 1)) return;
        let f = p.clientX, h = p.clientY, m = !1;
        const g = Date.now(), C = n.getBoundingClientRect(), { left: w, top: _ } = C, y = (k) => {
          if (k.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const A = k.clientX, I = k.clientY, P = A - f, W = I - h;
          (m || Math.abs(P) > r || Math.abs(W) > r) && (k.preventDefault(), k.stopPropagation(), m || (a.set({ type: "start", x: f - w, y: h - _ }), m = !0), a.set({ type: "move", x: A - w, y: I - _, deltaX: P, deltaY: W }), f = A, h = I);
        }, E = (k) => {
          if (l.delete(k.pointerId), m) {
            const A = k.clientX, I = k.clientY;
            a.set({ type: "end", x: A - w, y: I - _ });
          }
          u();
        }, T = (k) => {
          l.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || E(k);
        }, x = (k) => {
          m && (k.stopPropagation(), k.preventDefault());
        }, R = (k) => {
          k.defaultPrevented || l.size > 1 || m && k.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", E), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", R, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", E), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", R), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), pc(a);
      } };
    })(this.wrapper);
    const e = ln((() => {
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
    const { width: s, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: p } = (function({ width: h, height: m, length: g, options: C, pixelRatio: w }) {
      const _ = m / 2, y = C.barWidth ? C.barWidth * w : 1, E = C.barGap ? C.barGap * w : C.barWidth ? y / 2 : 0, T = y + E || 1;
      return { halfHeight: _, barWidth: y, barGap: E, barRadius: C.barRadius || 0, barMinHeight: C.barMinHeight ? C.barMinHeight * w : 0, barIndexScale: g > 0 ? h / T / g : 0, barSpacing: T };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: h, barIndexScale: m, barSpacing: g, barWidth: C, halfHeight: w, vScale: _, canvasHeight: y, barAlign: E, barMinHeight: T }) {
      const x = h[0] || [], R = h[1] || x, k = x.length, A = [];
      let I = 0, P = 0, W = 0;
      for (let D = 0; D <= k; D++) {
        const U = Math.round(D * m);
        if (U > I) {
          const { topHeight: Q, totalHeight: we } = fb({ maxTop: P, maxBottom: W, halfHeight: w, vScale: _, barMinHeight: T, barAlign: E }), Le = pb({ barAlign: E, halfHeight: w, topHeight: Q, totalHeight: we, canvasHeight: y });
          A.push({ x: I * g, y: Le, width: C, height: we }), I = U, P = 0, W = 0;
        }
        const ne = Math.abs(x[D] || 0), J = Math.abs(R[D] || 0);
        ne > P && (P = ne), J > W && (W = J);
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
        const g = h.length, C = g ? c / g : 0, w = p, _ = m === 0 ? -1 : 1, y = [{ x: 0, y: w }];
        let E = 0, T = 0;
        for (let x = 0; x <= g; x++) {
          const R = Math.round(x * C);
          if (R > E) {
            const A = w + (Math.round(T * p * d) || 1) * _;
            y.push({ x: E, y: A }), E = R, T = 0;
          }
          const k = Math.abs(h[x] || 0);
          k > T && (T = k);
        }
        return y.push({ x: E, y: w }), y;
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
    fc(n) ? this.renderBarWaveform(e, n, i, r) : this.renderLineWaveform(e, n, i, r);
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
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = i / a, u = (function({ clientWidth: h, totalWidth: m, options: g }) {
      return Wa(Math.min(8e3, h, m), g);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const p = (h) => {
      if (h < 0 || h >= f || d[h]) return;
      d[h] = !0;
      const m = h * u;
      let g = Math.min(c - m, u);
      if (g = Wa(g, n), g <= 0) return;
      const C = (function({ channelData: w, offset: _, clampedWidth: y, totalWidth: E }) {
        return w.map(((T) => {
          const x = Math.floor(_ / E * T.length), R = Math.floor((_ + y) / E * T.length);
          return T.slice(x, R);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(C, n, g, r, m, s, o);
    }, f = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < f; h++) p(h);
      return;
    }
    if (ja({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: f }).forEach(((h) => p(h))), f > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), ja({ scrollLeft: m, totalWidth: c, numCanvases: f }).forEach(((g) => p(g)));
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
        const h = Math.ceil(c * u), m = h > d, g = !!(p && !m);
        return { scrollWidth: h, isScrollable: m, useParentWidth: g, width: (g ? d : h) * f };
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
class mb extends Ri {
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
const gb = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ei extends db {
  static create(e) {
    return new Ei(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new cs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, gb, e);
    const { state: i, actions: r } = (function(a) {
      var l, c, u, d, p, f;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Pe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : Pe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : Pe(!1), C = (d = a?.isSeeking) !== null && d !== void 0 ? d : Pe(!1), w = (p = a?.volume) !== null && p !== void 0 ? p : Pe(1), _ = (f = a?.playbackRate) !== null && f !== void 0 ? f : Pe(1), y = Pe(null), E = Pe(null), T = Pe(""), x = Pe(0), R = Pe(0), k = Sn((() => !g.value), [g]), A = Sn((() => y.value !== null), [y]), I = Sn((() => A.value && m.value > 0), [A, m]), P = Sn((() => h.value), [h]), W = Sn((() => m.value > 0 ? h.value / m.value : 0), [h, m]);
      return { state: { currentTime: h, duration: m, isPlaying: g, isPaused: k, isSeeking: C, volume: w, playbackRate: _, audioBuffer: y, peaks: E, url: T, zoom: x, scrollPosition: R, canPlay: A, isReady: I, progress: P, progressPercent: W }, actions: { setCurrentTime: (D) => {
        const U = Math.max(0, Math.min(m.value || 1 / 0, D));
        h.set(U);
      }, setDuration: (D) => {
        m.set(Math.max(0, D));
      }, setPlaying: (D) => {
        g.set(D);
      }, setSeeking: (D) => {
        C.set(D);
      }, setVolume: (D) => {
        const U = Math.max(0, Math.min(1, D));
        w.set(U);
      }, setPlaybackRate: (D) => {
        const U = Math.max(0.1, Math.min(16, D));
        _.set(U);
      }, setAudioBuffer: (D) => {
        y.set(D), D && m.set(D.duration);
      }, setPeaks: (D) => {
        E.set(D);
      }, setUrl: (D) => {
        T.set(D);
      }, setZoom: (D) => {
        x.set(Math.max(0, D));
      }, setScrollPosition: (D) => {
        R.set(Math.max(0, D));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new mb();
    const s = n ? void 0 : this.getMediaElement();
    this.renderer = new vb(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      i.push(ln((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(ln((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(ln((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(ln((() => {
        e.isReady.value && !r && (r = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(ln((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && n.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(ln((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = qi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = qi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
        n = yield cb.fetchBlob(e, l, a);
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
      if (i) this.decodedData = qi.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield qi.decode(a, this.options.sampleRate);
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
      return n != null && (this.media instanceof cs ? this.media.stopAt(n) : this.stopAtPosition = n), r;
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
Ei.BasePlugin = class extends Ri {
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
}, Ei.dom = ub;
class hc {
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
class yb extends hc {
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
function vc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(vc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function ri(t, e, n) {
  const i = vc(t, e || {});
  return n?.appendChild(i), i;
}
function mc(t) {
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
function Gi(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
function Dn(t, e) {
  const n = mc(null), i = (r) => {
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
function Yi(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, s = mc(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== i || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, p = u.clientY, f = !1;
    const h = Date.now(), m = t.getBoundingClientRect(), { left: g, top: C } = m, w = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - h < r) return;
      const R = x.clientX, k = x.clientY, A = R - d, I = k - p;
      (f || Math.abs(A) > n || Math.abs(I) > n) && (x.preventDefault(), x.stopPropagation(), f || (s.set({ type: "start", x: d - g, y: p - C }), f = !0), s.set({ type: "move", x: R - g, y: k - C, deltaX: A, deltaY: I }), d = R, p = k);
    }, _ = (x) => {
      if (o.delete(x.pointerId), f) {
        const R = x.clientX, k = x.clientY;
        s.set({ type: "end", x: R - g, y: k - C });
      }
      l();
    }, y = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || _(x);
    }, E = (x) => {
      f && (x.stopPropagation(), x.preventDefault());
    }, T = (x) => {
      x.defaultPrevented || o.size > 1 || f && x.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", _), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", E, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), o.clear(), _n(s);
  } };
}
class Va extends hc {
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ri("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = ri("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Yi(i, { threshold: 1 }), o = Yi(r, { threshold: 1 }), a = Gi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Gi((() => {
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
    const r = ri("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const n = Dn(e, "click"), i = Dn(e, "mouseenter"), r = Dn(e, "mouseleave"), s = Dn(e, "dblclick"), o = Dn(e, "pointerdown"), a = Dn(e, "pointerup"), l = n.subscribe(((g) => g && this.emit("click", g))), c = i.subscribe(((g) => g && this.emit("over", g))), u = r.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), p = o.subscribe(((g) => g && this.toggleCursor(!0))), f = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), p(), f(), _n(n), _n(i), _n(r), _n(s), _n(o), _n(a);
    }));
    const h = Yi(e), m = Gi((() => {
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
        this.content = ri("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class yo extends yb {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new yo(e);
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
    return ri("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const r = this.wavesurfer.getDuration(), s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Va(e, r, s);
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
    const l = Yi(r, { threshold: n }), c = Gi((() => {
      var u, d;
      const p = l.signal.value;
      if (p) if (p.type === "start") {
        if (o = p.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const g = p.x / m * f, C = (p.x + 5) / m * f;
        s = new Va(Object.assign(Object.assign({}, e), { start: g, end: C }), f, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const ds = [0.5, 0.75, 1, 1.25, 1.5, 2];
function bb(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: r } = t, s = /* @__PURE__ */ Tn(null), o = /* @__PURE__ */ Tn(null), a = /* @__PURE__ */ B(0), l = /* @__PURE__ */ B(0), c = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!1), p = /* @__PURE__ */ B(1), f = /* @__PURE__ */ B(1), h = /* @__PURE__ */ B(!1), m = L(() => _i(a.value)), g = L(() => _i(l.value));
  function C(D, U) {
    P(), d.value = !0, u.value = !1;
    const ne = yo.create();
    o.value = ne;
    const J = Ei.create({
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
      renderFunction: Pp,
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
    const D = o.value;
    if (D) {
      D.clearRegions();
      for (const U of i.value) {
        const ne = U.speakerId ? r.value.get(U.speakerId) : void 0;
        if (!ne || U.startTime == null || U.endTime == null) continue;
        const J = ne.color;
        D.addRegion({
          start: U.startTime,
          end: U.endTime,
          color: Tp(J, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", J);
      }
    }
  }
  function _() {
    s.value?.play();
  }
  function y() {
    s.value?.pause();
  }
  function E() {
    s.value?.playPause();
  }
  function T(D) {
    const U = s.value;
    !U || l.value === 0 || U.setTime(D);
  }
  function x(D) {
    T(Math.max(0, Math.min(a.value + D, l.value)));
  }
  function R(D) {
    const U = s.value;
    U && (p.value = D, U.setVolume(D), D > 0 && h.value && (h.value = !1, U.setMuted(!1)));
  }
  function k() {
    const D = s.value;
    D && (h.value = !h.value, D.setMuted(h.value));
  }
  function A(D) {
    const U = s.value;
    U && (f.value = D, U.setPlaybackRate(D));
  }
  function I() {
    const U = (ds.indexOf(
      f.value
    ) + 1) % ds.length;
    A(ds[U] ?? 1);
  }
  function P() {
    W !== null && (clearTimeout(W), W = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  ye(
    [e, n],
    ([D, U]) => {
      D && U && C(D, U);
    },
    { immediate: !0 }
  );
  let W = null;
  return ye([i, r], () => {
    u.value && (W !== null && clearTimeout(W), W = setTimeout(() => {
      W = null, w();
    }, 150));
  }), fn(() => {
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
    formattedDuration: g,
    play: _,
    pause: y,
    togglePlay: E,
    seekTo: T,
    skip: x,
    setVolume: R,
    setPlaybackRate: A,
    cyclePlaybackRate: I,
    toggleMute: k
  };
}
const wb = { class: "audio-player" }, _b = /* @__PURE__ */ Z({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, r = n, s = /* @__PURE__ */ B(null), {
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
      seekTo: g,
      pause: C,
      skip: w,
      setVolume: _,
      cyclePlaybackRate: y,
      toggleMute: E
    } = bb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ Wi(() => i.audioSrc),
      turns: /* @__PURE__ */ Wi(() => i.turns),
      speakers: /* @__PURE__ */ Wi(() => i.speakers)
    });
    return ye(p, (T) => r("timeupdate", T)), ye(o, (T) => r("playStateChange", T)), e({ seekTo: g, pause: C }), (T, x) => (M(), oe("footer", wb, [
      se("div", {
        ref_key: "waveformRef",
        ref: s,
        class: Xt(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      H(lb, {
        "is-playing": v(o),
        "current-time": v(f),
        duration: v(h),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: x[0] || (x[0] = (R) => v(w)(-10)),
        onSkipForward: x[1] || (x[1] = (R) => v(w)(10)),
        "onUpdate:volume": v(_),
        onToggleMute: v(E),
        onCyclePlaybackRate: v(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), xb = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", Sb = /* @__PURE__ */ Fe(_b, [["styles", [xb]], ["__scopeId", "data-v-9248e45e"]]);
class Cb {
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
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, p = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(f[0], n, e, 0, i);
    if (f[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, n, e));
    let m = -1 / 0, g = 1 / 0;
    const C = () => {
      for (let w = Math.max(m, -c); w <= Math.min(g, c); w += 2) {
        let _;
        const y = f[w - 1], E = f[w + 1];
        y && (f[w - 1] = void 0);
        let T = !1;
        if (E) {
          const R = E.oldPos - w;
          T = E && 0 <= R && R < a;
        }
        const x = y && y.oldPos + 1 < l;
        if (!T && !x) {
          f[w] = void 0;
          continue;
        }
        if (!x || T && y.oldPos < E.oldPos ? _ = this.addToPath(E, !0, !1, 0, i) : _ = this.addToPath(y, !1, !0, 1, i), h = this.extractCommon(_, n, e, w, i), _.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(_.lastComponent, n, e)) || !0;
        f[w] = _, _.oldPos + 1 >= l && (g = Math.min(g, w - 1)), h + 1 >= a && (m = Math.max(m, w + 1));
      }
      c++;
    };
    if (r)
      (function w() {
        setTimeout(function() {
          if (c > u || Date.now() > p)
            return r(void 0);
          C() || w();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= p; ) {
        const w = C();
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
class Eb extends Cb {
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
const Tb = new Eb();
function kb(t, e, n) {
  return Tb.diff(t, e, n);
}
function fs({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const r = t.split(" "), s = n.split(" "), o = kb(r, s, {
    comparator: Pb
  }), a = Ab(o), l = [...e];
  let c = [...e], u = 0;
  for (const f of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      c = Ji(
        c,
        l[0],
        f.countAdded - f.countRemoved
      ), u += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const h = f;
      u += h.count, c = Ji(
        c,
        l[0],
        -h.count
      );
    } else if ("added" in f && f.added) {
      const h = f;
      c = Ji(
        c,
        l[0],
        h.count
      );
    } else
      u += f.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, p = s.slice(d).join(" ");
  if (i(p)) {
    const h = gc(
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
function Ab(t) {
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
function Ji(t, e, n) {
  return t.map((i) => i >= e ? i + n : i);
}
function gc(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let i;
  for (i = 0; i < n.length; i++) {
    const r = n.slice(0, i).join(" ");
    if (e(r)) break;
  }
  return [i - 1].concat(
    Ji(
      gc(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function Pb(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(n.length, i.length);
  let s = 0;
  for (let a = 0; a < r; a++)
    n[a] === i[a] && s++;
  return s / n.length > 0.8;
}
class Ob {
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
class Mb extends Ob {
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
function yc(t) {
  const e = On();
  let n = null;
  Re(() => {
    t.canvasRef.value && (n = new Mb(t.canvasRef.value, {
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
  An(() => {
    i(), s(), o(), a(), n?.dispose(), n = null;
  });
}
const Rb = ["height"], Ib = /* @__PURE__ */ Z({
  __name: "SubtitleBanner",
  setup(t) {
    const e = On(), n = gi("canvas"), i = L(() => e.subtitle?.fontSize.value ?? 40), r = L(() => 1.2 * i.value), s = L(() => 2.4 * i.value);
    return yc({
      canvasRef: n,
      fontSize: i,
      lineHeight: r
    }), (o, a) => (M(), oe("div", {
      class: "subtitle-banner",
      style: Dt({ height: s.value + "px" })
    }, [
      se("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, Rb)
    ], 4));
  }
}), Lb = ".subtitle-banner[data-v-30da75ad]{flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-30da75ad]{display:block;width:100%;height:100%}", Db = /* @__PURE__ */ Fe(Ib, [["styles", [Lb]], ["__scopeId", "data-v-30da75ad"]]), $b = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Bb = ["aria-label"], Fb = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, zb = /* @__PURE__ */ Z({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = On(), { t: n } = pt(), i = gi("container"), r = gi("canvas"), s = L(() => e.subtitle?.fontSize.value ?? 48), o = L(() => 1.2 * s.value);
    yc({
      canvasRef: r,
      fontSize: s,
      lineHeight: o
    }), Re(async () => {
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
    Re(() => {
      document.addEventListener("fullscreenchange", a);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return An(() => {
      document.removeEventListener("fullscreenchange", a);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, u) => (M(), oe("div", $b, [
      se("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        H(v(no), { size: 24 })
      ], 8, Bb),
      se("canvas", Fb, null, 512)
    ], 512));
  }
}), Nb = ".subtitle-fullscreen[data-v-442e31fd]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-442e31fd]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-442e31fd]:hover,.subtitle-fullscreen__close[data-v-442e31fd]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-442e31fd]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-442e31fd]{transition:none}}", qb = /* @__PURE__ */ Fe(zb, [["styles", [Nb]], ["__scopeId", "data-v-442e31fd"]]), Hb = { class: "editor-layout" }, Wb = { class: "editor-body" }, jb = {
  key: 4,
  class: "mobile-selectors"
}, Vb = /* @__PURE__ */ Z({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = On(), { t: i, locale: r } = pt(), { isMobile: s } = ku(), o = /* @__PURE__ */ B(!1), a = L(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), l = n.speakers.all;
    hh(a, l, n);
    const c = L(() => [...n.channels.values()]), u = L(() => [
      ...n.activeChannel.value.translations.values()
    ]), d = L(
      () => n.activeChannel.value.activeTranslation.value.id
    ), p = L(() => Array.from(l.values())), f = gi("audioPlayer");
    function h(w) {
      n.audio && (n.audio.currentTime.value = w);
    }
    ye(
      () => n.activeChannelId.value,
      () => {
        f.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), o.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((w) => f.value?.seekTo(w));
    const m = L(
      () => _u(
        u.value,
        r.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function g(w) {
      n.setActiveChannel(w);
    }
    function C(w) {
      n.activeChannel.value.setActiveTranslation(w);
    }
    return (w, _) => (M(), oe("div", Hb, [
      e.showHeader ? (M(), X(zp, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value.duration,
        language: d.value,
        "is-mobile": v(s),
        onToggleSidebar: _[0] || (_[0] = (y) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : fe("", !0),
      se("main", Wb, [
        H(Vh, {
          turns: a.value,
          speakers: v(l)
        }, null, 8, ["turns", "speakers"]),
        v(s) ? fe("", !0) : (M(), X(Na, {
          key: 0,
          speakers: p.value,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": C
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(s) ? (M(), X(Zy, {
          key: 1,
          open: o.value,
          "onUpdate:open": _[1] || (_[1] = (y) => o.value = y)
        }, {
          default: q(() => [
            H(Na, {
              speakers: p.value,
              channels: c.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": C
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : fe("", !0)
      ]),
      v(n).audio?.src.value ? (M(), X(Sb, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: a.value,
        speakers: v(l),
        onTimeupdate: h,
        onPlayStateChange: _[2] || (_[2] = (y) => {
          v(n).audio && (v(n).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : fe("", !0),
      v(n).subtitle?.isVisible.value && !v(s) && !v(n).subtitle.isFullscreen.value ? (M(), X(Db, { key: 2 })) : fe("", !0),
      v(n).subtitle?.isFullscreen.value ? (M(), X(qb, { key: 3 })) : fe("", !0),
      v(s) && (c.value.length > 1 || u.value.length > 1) ? (M(), oe("div", jb, [
        c.value.length > 1 ? (M(), X(cc, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : fe("", !0),
        u.value.length > 1 ? (M(), X(go, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: v(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": C
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : fe("", !0)
      ])) : fe("", !0)
    ]));
  }
}), Ub = ".editor-layout[data-v-52972a0f]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-52972a0f]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-52972a0f]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-52972a0f]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-52972a0f]{grid-template-columns:1fr}}", Kb = /* @__PURE__ */ Fe(Vb, [["styles", [Ub]], ["__scopeId", "data-v-52972a0f"]]);
function Xb() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ B(0), n = /* @__PURE__ */ B(!1);
      let i = null;
      const r = L(
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
const Gb = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', Yb = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}', Jb = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}", Zb = ".sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow-y:auto;max-height:var(--reka-select-content-available-height);padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}";
function Ua(t) {
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
function i0() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ Tn(null), n = /* @__PURE__ */ B(!1);
      n.value = !0;
      function i() {
        e.value = null, To(e);
      }
      function r(_, y) {
        if (t.activeChannelId.value !== y) return;
        const E = t.activeChannel.value.activeTranslation.value;
        if (E.isSource) {
          if (_.text == null) return;
          e.value = _.text;
        } else if (_.translations) {
          const T = _.translations.find(
            (x) => x.translationId === E.id
          );
          e.value = T?.text ?? null;
        } else
          return;
        To(e);
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
      function l(_, y) {
        _.turns.value.some((T) => T.id === y.id) ? _.updateTurn(y.id, y) : _.addTurn(y);
      }
      function c(_, y) {
        _.speakerId && t.speakers.ensure(_.speakerId);
        const E = t.channels.get(y);
        if (!E) {
          p();
          return;
        }
        if (_.text != null && l(
          E.sourceTranslation,
          Ua(_)
        ), _.translations)
          for (const x of _.translations) {
            const R = E.translations.get(x.translationId);
            R && l(
              R,
              ps(_, x)
            );
          }
        t.activeChannel.value.activeTranslation.value.isSource && p();
      }
      function u(_, y) {
        d([_], y);
      }
      function d(_, y) {
        const E = t.channels.get(y);
        if (!E) return;
        const T = /* @__PURE__ */ new Set();
        for (const k of _)
          k.speakerId && !T.has(k.speakerId) && (T.add(k.speakerId), t.speakers.ensure(k.speakerId));
        const x = [];
        for (const k of _)
          k.text != null && x.push(Ua(k));
        x.length > 0 && E.sourceTranslation.prependTurns(x);
        const R = /* @__PURE__ */ new Map();
        for (const k of _)
          if (k.translations)
            for (const A of k.translations) {
              let I = R.get(A.translationId);
              I || (I = [], R.set(A.translationId, I)), I.push(ps(k, A));
            }
        for (const [k, A] of R) {
          const I = E.translations.get(k);
          I && I.prependTurns(A);
        }
      }
      function p() {
        a(), i();
      }
      function f(_) {
        const y = t.activeChannel.value.activeTranslation.value, E = t.activeChannel.value;
        if (!_.final && y.languages.includes(_.language))
          e.value = _.text;
        else if (_.final) {
          const T = E.translations.get(_.language);
          T && l(
            T,
            ps({ ..._ }, _)
          ), y.languages.includes(_.language) && p();
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
      ), g = t.on(
        "translation:change",
        p
      ), C = t.on(
        "translation:sync",
        o
      ), w = t.on("channel:sync", o);
      return t.live = h, () => {
        p(), m(), g(), C(), w(), t.live = void 0;
      };
    }
  };
}
function r0(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ B(t.fontSize ?? 40), i = /* @__PURE__ */ B(!0), r = /* @__PURE__ */ B(!1), s = {
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
const Qb = /* @__PURE__ */ Vf({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: !1 }
  },
  styles: [Yb, Jb, Zb],
  setup(t, { expose: e }) {
    const n = /* @__PURE__ */ B(t.locale);
    Ep(n), ye(() => t.locale, (r) => {
      n.value = r;
    });
    const i = fh();
    return i.use(Xb()), ph(i), e({ editor: i }), () => i.channels.size ? gt(Kb, { showHeader: !t.noHeader }) : null;
  }
});
function e0() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = Gb, document.head.appendChild(e);
}
function s0(t = "linto-editor") {
  e0(), customElements.define(t, Qb);
}
export {
  Qb as LintoEditor,
  Xb as createAudioPlugin,
  i0 as createLivePlugin,
  r0 as createSubtitlePlugin,
  s0 as register
};
