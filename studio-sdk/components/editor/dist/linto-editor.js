// @__NO_SIDE_EFFECTS__
function Vs(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const me = {}, qn = [], Mt = () => {
}, Za = () => !1, yi = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Ws = (t) => t.startsWith("onUpdate:"), Oe = Object.assign, js = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Ac = Object.prototype.hasOwnProperty, ye = (t, e) => Ac.call(t, e), Q = Array.isArray, zn = (t) => Rr(t) === "[object Map]", Qa = (t) => Rr(t) === "[object Set]", ko = (t) => Rr(t) === "[object Date]", oe = (t) => typeof t == "function", ke = (t) => typeof t == "string", bt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", el = (t) => (be(t) || oe(t)) && oe(t.then) && oe(t.catch), tl = Object.prototype.toString, Rr = (t) => tl.call(t), kc = (t) => Rr(t).slice(8, -1), bi = (t) => Rr(t) === "[object Object]", _i = (t) => ke(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, or = /* @__PURE__ */ Vs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), wi = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Pc = /-\w/g, De = wi(
  (t) => t.replace(Pc, (e) => e.slice(1).toUpperCase())
), Oc = /\B([A-Z])/g, et = wi(
  (t) => t.replace(Oc, "-$1").toLowerCase()
), xi = wi((t) => t.charAt(0).toUpperCase() + t.slice(1)), Gr = wi(
  (t) => t ? `on${xi(t)}` : ""
), Ke = (t, e) => !Object.is(t, e), Xi = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, nl = (t, e, n, r = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
}, Rc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, ys = (t) => {
  const e = ke(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let Po;
const Si = () => Po || (Po = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function tt(t) {
  if (Q(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = ke(r) ? Dc(r) : tt(r);
      if (i)
        for (const s in i)
          e[s] = i[s];
    }
    return e;
  } else if (ke(t) || be(t))
    return t;
}
const Ic = /;(?![^(]*\))/g, Lc = /:([^]+)/, Mc = /\/\*[^]*?\*\//g;
function Dc(t) {
  const e = {};
  return t.replace(Mc, "").split(Ic).forEach((n) => {
    if (n) {
      const r = n.split(Lc);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function dn(t) {
  let e = "";
  if (ke(t))
    e = t;
  else if (Q(t))
    for (let n = 0; n < t.length; n++) {
      const r = dn(t[n]);
      r && (e += r + " ");
    }
  else if (be(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Us(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !ke(e) && (t.class = dn(e)), n && (t.style = tt(n)), t;
}
const $c = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Bc = /* @__PURE__ */ Vs($c);
function rl(t) {
  return !!t || t === "";
}
function Fc(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let r = 0; n && r < t.length; r++)
    n = Ks(t[r], e[r]);
  return n;
}
function Ks(t, e) {
  if (t === e) return !0;
  let n = ko(t), r = ko(e);
  if (n || r)
    return n && r ? t.getTime() === e.getTime() : !1;
  if (n = bt(t), r = bt(e), n || r)
    return t === e;
  if (n = Q(t), r = Q(e), n || r)
    return n && r ? Fc(t, e) : !1;
  if (n = be(t), r = be(e), n || r) {
    if (!n || !r)
      return !1;
    const i = Object.keys(t).length, s = Object.keys(e).length;
    if (i !== s)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Ks(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const il = (t) => !!(t && t.__v_isRef === !0), _e = (t) => ke(t) ? t : t == null ? "" : Q(t) || be(t) && (t.toString === tl || !oe(t.toString)) ? il(t) ? _e(t.value) : JSON.stringify(t, sl, 2) : String(t), sl = (t, e) => il(e) ? sl(t, e.value) : zn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [r, i], s) => (n[Yi(r, s) + " =>"] = i, n),
    {}
  )
} : Qa(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Yi(n))
} : bt(e) ? Yi(e) : be(e) && !Q(e) && !bi(e) ? String(e) : e, Yi = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    bt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let He;
class ol {
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
function al(t) {
  return new ol(t);
}
function Xs() {
  return He;
}
function ll(t, e = !1) {
  He && He.cleanups.push(t);
}
let Ee;
const Gi = /* @__PURE__ */ new WeakSet();
class ul {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, He && He.active && He.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Gi.has(this) && (Gi.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || dl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Oo(this), fl(this);
    const e = Ee, n = gt;
    Ee = this, gt = !0;
    try {
      return this.fn();
    } finally {
      pl(this), Ee = e, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Js(e);
      this.deps = this.depsTail = void 0, Oo(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Gi.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let cl = 0, ar, lr;
function dl(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = lr, lr = t;
    return;
  }
  t.next = ar, ar = t;
}
function Ys() {
  cl++;
}
function Gs() {
  if (--cl > 0)
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
function fl(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function pl(t) {
  let e, n = t.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Js(r), Nc(r)) : e = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  t.deps = e, t.depsTail = n;
}
function bs(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (hl(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function hl(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === hr) || (t.globalVersion = hr, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !bs(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = Ee, r = gt;
  Ee = t, gt = !0;
  try {
    fl(t);
    const i = t.fn(t._value);
    (e.version === 0 || Ke(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    Ee = n, gt = r, pl(t), t.flags &= -3;
  }
}
function Js(t, e = !1) {
  const { dep: n, prevSub: r, nextSub: i } = t;
  if (r && (r.nextSub = i, t.prevSub = void 0), i && (i.prevSub = r, t.nextSub = void 0), n.subs === t && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      Js(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Nc(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let gt = !0;
const vl = [];
function Xt() {
  vl.push(gt), gt = !1;
}
function Yt() {
  const t = vl.pop();
  gt = t === void 0 ? !0 : t;
}
function Oo(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = Ee;
    Ee = void 0;
    try {
      e();
    } finally {
      Ee = n;
    }
  }
}
let hr = 0;
class Hc {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ci {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!Ee || !gt || Ee === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Ee)
      n = this.activeLink = new Hc(Ee, this), Ee.deps ? (n.prevDep = Ee.depsTail, Ee.depsTail.nextDep = n, Ee.depsTail = n) : Ee.deps = Ee.depsTail = n, ml(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = Ee.depsTail, n.nextDep = void 0, Ee.depsTail.nextDep = n, Ee.depsTail = n, Ee.deps === n && (Ee.deps = r);
    }
    return n;
  }
  trigger(e) {
    this.version++, hr++, this.notify(e);
  }
  notify(e) {
    Ys();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Gs();
    }
  }
}
function ml(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let r = e.deps; r; r = r.nextDep)
        ml(r);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const ii = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ Symbol(
  ""
), _s = /* @__PURE__ */ Symbol(
  ""
), vr = /* @__PURE__ */ Symbol(
  ""
);
function qe(t, e, n) {
  if (gt && Ee) {
    let r = ii.get(t);
    r || ii.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new Ci()), i.map = r, i.key = n), i.track();
  }
}
function Ut(t, e, n, r, i, s) {
  const o = ii.get(t);
  if (!o) {
    hr++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (Ys(), e === "clear")
    o.forEach(a);
  else {
    const l = Q(t), c = l && _i(n);
    if (l && n === "length") {
      const u = Number(r);
      o.forEach((d, f) => {
        (f === "length" || f === vr || !bt(f) && f >= u) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), c && a(o.get(vr)), e) {
        case "add":
          l ? c && a(o.get("length")) : (a(o.get(En)), zn(t) && a(o.get(_s)));
          break;
        case "delete":
          l || (a(o.get(En)), zn(t) && a(o.get(_s)));
          break;
        case "set":
          zn(t) && a(o.get(En));
          break;
      }
  }
  Gs();
}
function qc(t, e) {
  const n = ii.get(t);
  return n && n.get(e);
}
function Dn(t) {
  const e = /* @__PURE__ */ ve(t);
  return e === t ? e : (qe(e, "iterate", vr), /* @__PURE__ */ st(t) ? e : e.map(_t));
}
function Ei(t) {
  return qe(t = /* @__PURE__ */ ve(t), "iterate", vr), t;
}
function on(t, e) {
  return /* @__PURE__ */ Gt(t) ? Kn(/* @__PURE__ */ Tn(t) ? _t(e) : e) : _t(e);
}
const zc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ji(this, Symbol.iterator, (t) => on(this, t));
  },
  concat(...t) {
    return Dn(this).concat(
      ...t.map((e) => Q(e) ? Dn(e) : e)
    );
  },
  entries() {
    return Ji(this, "entries", (t) => (t[1] = on(this, t[1]), t));
  },
  every(t, e) {
    return zt(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return zt(
      this,
      "filter",
      t,
      e,
      (n) => n.map((r) => on(this, r)),
      arguments
    );
  },
  find(t, e) {
    return zt(
      this,
      "find",
      t,
      e,
      (n) => on(this, n),
      arguments
    );
  },
  findIndex(t, e) {
    return zt(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return zt(
      this,
      "findLast",
      t,
      e,
      (n) => on(this, n),
      arguments
    );
  },
  findLastIndex(t, e) {
    return zt(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return zt(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Zi(this, "includes", t);
  },
  indexOf(...t) {
    return Zi(this, "indexOf", t);
  },
  join(t) {
    return Dn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return Zi(this, "lastIndexOf", t);
  },
  map(t, e) {
    return zt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return Qn(this, "pop");
  },
  push(...t) {
    return Qn(this, "push", t);
  },
  reduce(t, ...e) {
    return Ro(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Ro(this, "reduceRight", t, e);
  },
  shift() {
    return Qn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return zt(this, "some", t, e, void 0, arguments);
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
    return Ji(this, "values", (t) => on(this, t));
  }
};
function Ji(t, e, n) {
  const r = Ei(t), i = r[e]();
  return r !== t && !/* @__PURE__ */ st(t) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const Vc = Array.prototype;
function zt(t, e, n, r, i, s) {
  const o = Ei(t), a = o !== t && !/* @__PURE__ */ st(t), l = o[e];
  if (l !== Vc[e]) {
    const d = l.apply(t, s);
    return a ? _t(d) : d;
  }
  let c = n;
  o !== t && (a ? c = function(d, f) {
    return n.call(this, on(t, d), f, t);
  } : n.length > 2 && (c = function(d, f) {
    return n.call(this, d, f, t);
  }));
  const u = l.call(o, c, r);
  return a && i ? i(u) : u;
}
function Ro(t, e, n, r) {
  const i = Ei(t);
  let s = n;
  return i !== t && (/* @__PURE__ */ st(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, on(t, a), l, t);
  }), i[e](s, ...r);
}
function Zi(t, e, n) {
  const r = /* @__PURE__ */ ve(t);
  qe(r, "iterate", vr);
  const i = r[e](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Pi(n[0]) ? (n[0] = /* @__PURE__ */ ve(n[0]), r[e](...n)) : i;
}
function Qn(t, e, n = []) {
  Xt(), Ys();
  const r = (/* @__PURE__ */ ve(t))[e].apply(t, n);
  return Gs(), Yt(), r;
}
const Wc = /* @__PURE__ */ Vs("__proto__,__v_isRef,__isVue"), gl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(bt)
);
function jc(t) {
  bt(t) || (t = String(t));
  const e = /* @__PURE__ */ ve(this);
  return qe(e, "has", t), e.hasOwnProperty(t);
}
class yl {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, r) {
    if (n === "__v_skip") return e.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return r === (i ? s ? Cl : Sl : s ? xl : wl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(r) ? e : void 0;
    const o = Q(e);
    if (!i) {
      let l;
      if (o && (l = zc[n]))
        return l;
      if (n === "hasOwnProperty")
        return jc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Le(e) ? e : r
    );
    if ((bt(n) ? gl.has(n) : Wc(n)) || (i || qe(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ Le(a)) {
      const l = o && _i(n) ? a : a.value;
      return i && be(l) ? /* @__PURE__ */ mr(l) : l;
    }
    return be(a) ? i ? /* @__PURE__ */ mr(a) : /* @__PURE__ */ Ir(a) : a;
  }
}
class bl extends yl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, r, i) {
    let s = e[n];
    const o = Q(e) && _i(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ Gt(s);
      if (!/* @__PURE__ */ st(r) && !/* @__PURE__ */ Gt(r) && (s = /* @__PURE__ */ ve(s), r = /* @__PURE__ */ ve(r)), !o && /* @__PURE__ */ Le(s) && !/* @__PURE__ */ Le(r))
        return c || (s.value = r), !0;
    }
    const a = o ? Number(n) < e.length : ye(e, n), l = Reflect.set(
      e,
      n,
      r,
      /* @__PURE__ */ Le(e) ? e : i
    );
    return e === /* @__PURE__ */ ve(i) && (a ? Ke(r, s) && Ut(e, "set", n, r) : Ut(e, "add", n, r)), l;
  }
  deleteProperty(e, n) {
    const r = ye(e, n);
    e[n];
    const i = Reflect.deleteProperty(e, n);
    return i && r && Ut(e, "delete", n, void 0), i;
  }
  has(e, n) {
    const r = Reflect.has(e, n);
    return (!bt(n) || !gl.has(n)) && qe(e, "has", n), r;
  }
  ownKeys(e) {
    return qe(
      e,
      "iterate",
      Q(e) ? "length" : En
    ), Reflect.ownKeys(e);
  }
}
class _l extends yl {
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
const Uc = /* @__PURE__ */ new bl(), Kc = /* @__PURE__ */ new _l(), Xc = /* @__PURE__ */ new bl(!0), Yc = /* @__PURE__ */ new _l(!0), ws = (t) => t, Hr = (t) => Reflect.getPrototypeOf(t);
function Gc(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, s = /* @__PURE__ */ ve(i), o = zn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = i[t](...r), u = n ? ws : e ? Kn : _t;
    return !e && qe(
      s,
      "iterate",
      l ? _s : En
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
function qr(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Jc(t, e) {
  const n = {
    get(i) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(i);
      t || (Ke(i, a) && qe(o, "get", i), qe(o, "get", a));
      const { has: l } = Hr(o), c = e ? ws : t ? Kn : _t;
      if (l.call(o, i))
        return c(s.get(i));
      if (l.call(o, a))
        return c(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && qe(/* @__PURE__ */ ve(i), "iterate", En), i.size;
    },
    has(i) {
      const s = this.__v_raw, o = /* @__PURE__ */ ve(s), a = /* @__PURE__ */ ve(i);
      return t || (Ke(i, a) && qe(o, "has", i), qe(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ ve(a), c = e ? ws : t ? Kn : _t;
      return !t && qe(l, "iterate", En), a.forEach((u, d) => i.call(s, c(u), c(d), o));
    }
  };
  return Oe(
    n,
    t ? {
      add: qr("add"),
      set: qr("set"),
      delete: qr("delete"),
      clear: qr("clear")
    } : {
      add(i) {
        !e && !/* @__PURE__ */ st(i) && !/* @__PURE__ */ Gt(i) && (i = /* @__PURE__ */ ve(i));
        const s = /* @__PURE__ */ ve(this);
        return Hr(s).has.call(s, i) || (s.add(i), Ut(s, "add", i, i)), this;
      },
      set(i, s) {
        !e && !/* @__PURE__ */ st(s) && !/* @__PURE__ */ Gt(s) && (s = /* @__PURE__ */ ve(s));
        const o = /* @__PURE__ */ ve(this), { has: a, get: l } = Hr(o);
        let c = a.call(o, i);
        c || (i = /* @__PURE__ */ ve(i), c = a.call(o, i));
        const u = l.call(o, i);
        return o.set(i, s), c ? Ke(s, u) && Ut(o, "set", i, s) : Ut(o, "add", i, s), this;
      },
      delete(i) {
        const s = /* @__PURE__ */ ve(this), { has: o, get: a } = Hr(s);
        let l = o.call(s, i);
        l || (i = /* @__PURE__ */ ve(i), l = o.call(s, i)), a && a.call(s, i);
        const c = s.delete(i);
        return l && Ut(s, "delete", i, void 0), c;
      },
      clear() {
        const i = /* @__PURE__ */ ve(this), s = i.size !== 0, o = i.clear();
        return s && Ut(
          i,
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
  ].forEach((i) => {
    n[i] = Gc(i, t, e);
  }), n;
}
function Ti(t, e) {
  const n = Jc(t, e);
  return (r, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    ye(n, i) && i in r ? n : r,
    i,
    s
  );
}
const Zc = {
  get: /* @__PURE__ */ Ti(!1, !1)
}, Qc = {
  get: /* @__PURE__ */ Ti(!1, !0)
}, ed = {
  get: /* @__PURE__ */ Ti(!0, !1)
}, td = {
  get: /* @__PURE__ */ Ti(!0, !0)
}, wl = /* @__PURE__ */ new WeakMap(), xl = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap(), Cl = /* @__PURE__ */ new WeakMap();
function nd(t) {
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
function rd(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : nd(kc(t));
}
// @__NO_SIDE_EFFECTS__
function Ir(t) {
  return /* @__PURE__ */ Gt(t) ? t : ki(
    t,
    !1,
    Uc,
    Zc,
    wl
  );
}
// @__NO_SIDE_EFFECTS__
function Ai(t) {
  return ki(
    t,
    !1,
    Xc,
    Qc,
    xl
  );
}
// @__NO_SIDE_EFFECTS__
function mr(t) {
  return ki(
    t,
    !0,
    Kc,
    ed,
    Sl
  );
}
// @__NO_SIDE_EFFECTS__
function $n(t) {
  return ki(
    t,
    !0,
    Yc,
    td,
    Cl
  );
}
function ki(t, e, n, r, i) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = rd(t);
  if (s === 0)
    return t;
  const o = i.get(t);
  if (o)
    return o;
  const a = new Proxy(
    t,
    s === 2 ? r : n
  );
  return i.set(t, a), a;
}
// @__NO_SIDE_EFFECTS__
function Tn(t) {
  return /* @__PURE__ */ Gt(t) ? /* @__PURE__ */ Tn(t.__v_raw) : !!(t && t.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Gt(t) {
  return !!(t && t.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function st(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Pi(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ve(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ ve(e) : t;
}
function El(t) {
  return !ye(t, "__v_skip") && Object.isExtensible(t) && nl(t, "__v_skip", !0), t;
}
const _t = (t) => be(t) ? /* @__PURE__ */ Ir(t) : t, Kn = (t) => be(t) ? /* @__PURE__ */ mr(t) : t;
// @__NO_SIDE_EFFECTS__
function Le(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function I(t) {
  return Tl(t, !1);
}
// @__NO_SIDE_EFFECTS__
function An(t) {
  return Tl(t, !0);
}
function Tl(t, e) {
  return /* @__PURE__ */ Le(t) ? t : new id(t, e);
}
class id {
  constructor(e, n) {
    this.dep = new Ci(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ ve(e), this._value = n ? e : _t(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, r = this.__v_isShallow || /* @__PURE__ */ st(e) || /* @__PURE__ */ Gt(e);
    e = r ? e : /* @__PURE__ */ ve(e), Ke(e, n) && (this._rawValue = e, this._value = r ? e : _t(e), this.dep.trigger());
  }
}
function Io(t) {
  t.dep && t.dep.trigger();
}
function v(t) {
  return /* @__PURE__ */ Le(t) ? t.value : t;
}
function Fe(t) {
  return oe(t) ? t() : v(t);
}
const sd = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const i = t[e];
    return /* @__PURE__ */ Le(i) && !/* @__PURE__ */ Le(n) ? (i.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function Al(t) {
  return /* @__PURE__ */ Tn(t) ? t : new Proxy(t, sd);
}
class od {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Ci(), { get: r, set: i } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = r, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function kl(t) {
  return new od(t);
}
// @__NO_SIDE_EFFECTS__
function en(t) {
  const e = Q(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = Pl(t, n);
  return e;
}
class ad {
  constructor(e, n, r) {
    this._object = e, this._key = n, this._defaultValue = r, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ ve(e);
    let i = !0, s = e;
    if (!Q(e) || !_i(String(n)))
      do
        i = !/* @__PURE__ */ Pi(s) || /* @__PURE__ */ st(s);
      while (i && (s = s.__v_raw));
    this._shallow = i;
  }
  get value() {
    let e = this._object[this._key];
    return this._shallow && (e = v(e)), this._value = e === void 0 ? this._defaultValue : e;
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
    return qc(this._raw, this._key);
  }
}
class ld {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Jr(t, e, n) {
  return /* @__PURE__ */ Le(t) ? t : oe(t) ? new ld(t) : be(t) && arguments.length > 1 ? Pl(t, e, n) : /* @__PURE__ */ I(t);
}
function Pl(t, e, n) {
  return new ad(t, e, n);
}
class ud {
  constructor(e, n, r) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new Ci(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = hr - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Ee !== this)
      return dl(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return hl(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function cd(t, e, n = !1) {
  let r, i;
  return oe(t) ? r = t : (r = t.get, i = t.set), new ud(r, i, n);
}
const zr = {}, si = /* @__PURE__ */ new WeakMap();
let wn;
function dd(t, e = !1, n = wn) {
  if (n) {
    let r = si.get(n);
    r || si.set(n, r = []), r.push(t);
  }
}
function fd(t, e, n = me) {
  const { immediate: r, deep: i, once: s, scheduler: o, augmentJob: a, call: l } = n, c = (b) => i ? b : /* @__PURE__ */ st(b) || i === !1 || i === 0 ? Kt(b, 1) : Kt(b);
  let u, d, f, p, h = !1, g = !1;
  if (/* @__PURE__ */ Le(t) ? (d = () => t.value, h = /* @__PURE__ */ st(t)) : /* @__PURE__ */ Tn(t) ? (d = () => c(t), h = !0) : Q(t) ? (g = !0, h = t.some((b) => /* @__PURE__ */ Tn(b) || /* @__PURE__ */ st(b)), d = () => t.map((b) => {
    if (/* @__PURE__ */ Le(b))
      return b.value;
    if (/* @__PURE__ */ Tn(b))
      return c(b);
    if (oe(b))
      return l ? l(b, 2) : b();
  })) : oe(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (f) {
      Xt();
      try {
        f();
      } finally {
        Yt();
      }
    }
    const b = wn;
    wn = u;
    try {
      return l ? l(t, 3, [p]) : t(p);
    } finally {
      wn = b;
    }
  } : d = Mt, e && i) {
    const b = d, C = i === !0 ? 1 / 0 : i;
    d = () => Kt(b(), C);
  }
  const y = Xs(), w = () => {
    u.stop(), y && y.active && js(y.effects, u);
  };
  if (s && e) {
    const b = e;
    e = (...C) => {
      b(...C), w();
    };
  }
  let m = g ? new Array(t.length).fill(zr) : zr;
  const x = (b) => {
    if (!(!(u.flags & 1) || !u.dirty && !b))
      if (e) {
        const C = u.run();
        if (i || h || (g ? C.some((T, E) => Ke(T, m[E])) : Ke(C, m))) {
          f && f();
          const T = wn;
          wn = u;
          try {
            const E = [
              C,
              // pass undefined as the old value when it's changed for the first time
              m === zr ? void 0 : g && m[0] === zr ? [] : m,
              p
            ];
            m = C, l ? l(e, 3, E) : (
              // @ts-expect-error
              e(...E)
            );
          } finally {
            wn = T;
          }
        }
      } else
        u.run();
  };
  return a && a(x), u = new ul(d), u.scheduler = o ? () => o(x, !1) : x, p = (b) => dd(b, !1, u), f = u.onStop = () => {
    const b = si.get(u);
    if (b) {
      if (l)
        l(b, 4);
      else
        for (const C of b) C();
      si.delete(u);
    }
  }, e ? r ? x(!0) : m = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), w.pause = u.pause.bind(u), w.resume = u.resume.bind(u), w.stop = w, w;
}
function Kt(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Le(t))
    Kt(t.value, e, n);
  else if (Q(t))
    for (let r = 0; r < t.length; r++)
      Kt(t[r], e, n);
  else if (Qa(t) || zn(t))
    t.forEach((r) => {
      Kt(r, e, n);
    });
  else if (bi(t)) {
    for (const r in t)
      Kt(t[r], e, n);
    for (const r of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, r) && Kt(t[r], e, n);
  }
  return t;
}
function Lr(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (i) {
    Oi(i, e, n);
  }
}
function wt(t, e, n, r) {
  if (oe(t)) {
    const i = Lr(t, e, n, r);
    return i && el(i) && i.catch((s) => {
      Oi(s, e, n);
    }), i;
  }
  if (Q(t)) {
    const i = [];
    for (let s = 0; s < t.length; s++)
      i.push(wt(t[s], e, n, r));
    return i;
  }
}
function Oi(t, e, n, r = !0) {
  const i = e ? e.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: o } = e && e.appContext.config || me;
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
      Xt(), Lr(s, null, 10, [
        t,
        l,
        c
      ]), Yt();
      return;
    }
  }
  pd(t, n, i, r, o);
}
function pd(t, e, n, r = !0, i = !1) {
  if (i)
    throw t;
  console.error(t);
}
const Xe = [];
let Pt = -1;
const Vn = [];
let an = null, Nn = 0;
const Ol = /* @__PURE__ */ Promise.resolve();
let oi = null;
function Ie(t) {
  const e = oi || Ol;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function hd(t) {
  let e = Pt + 1, n = Xe.length;
  for (; e < n; ) {
    const r = e + n >>> 1, i = Xe[r], s = gr(i);
    s < t || s === t && i.flags & 2 ? e = r + 1 : n = r;
  }
  return e;
}
function Zs(t) {
  if (!(t.flags & 1)) {
    const e = gr(t), n = Xe[Xe.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= gr(n) ? Xe.push(t) : Xe.splice(hd(e), 0, t), t.flags |= 1, Rl();
  }
}
function Rl() {
  oi || (oi = Ol.then(Ll));
}
function vd(t) {
  Q(t) ? Vn.push(...t) : an && t.id === -1 ? an.splice(Nn + 1, 0, t) : t.flags & 1 || (Vn.push(t), t.flags |= 1), Rl();
}
function Lo(t, e, n = Pt + 1) {
  for (; n < Xe.length; n++) {
    const r = Xe[n];
    if (r && r.flags & 2) {
      if (t && r.id !== t.uid)
        continue;
      Xe.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function Il(t) {
  if (Vn.length) {
    const e = [...new Set(Vn)].sort(
      (n, r) => gr(n) - gr(r)
    );
    if (Vn.length = 0, an) {
      an.push(...e);
      return;
    }
    for (an = e, Nn = 0; Nn < an.length; Nn++) {
      const n = an[Nn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    an = null, Nn = 0;
  }
}
const gr = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function Ll(t) {
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
    Pt = -1, Xe.length = 0, Il(), oi = null, (Xe.length || Vn.length) && Ll();
  }
}
let Be = null, Ml = null;
function ai(t) {
  const e = Be;
  return Be = t, Ml = t && t.type.__scopeId || null, e;
}
function R(t, e = Be, n) {
  if (!e || t._n)
    return t;
  const r = (...i) => {
    r._d && ci(-1);
    const s = ai(e);
    let o;
    try {
      o = t(...i);
    } finally {
      ai(s), r._d && ci(1);
    }
    return o;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function md(t, e) {
  if (Be === null)
    return t;
  const n = $i(Be), r = t.dirs || (t.dirs = []);
  for (let i = 0; i < e.length; i++) {
    let [s, o, a, l = me] = e[i];
    s && (oe(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && Kt(o), r.push({
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
function gn(t, e, n, r) {
  const i = t.dirs, s = e && e.dirs;
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    s && (a.oldValue = s[o].value);
    let l = a.dir[r];
    l && (Xt(), wt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Yt());
  }
}
function Mr(t, e) {
  if (ze) {
    let n = ze.provides;
    const r = ze.parent && ze.parent.provides;
    r === n && (n = ze.provides = Object.create(r)), n[t] = e;
  }
}
function un(t, e, n = !1) {
  const r = lt();
  if (r || jn) {
    let i = jn ? jn._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (i && t in i)
      return i[t];
    if (arguments.length > 1)
      return n && oe(e) ? e.call(r && r.proxy) : e;
  }
}
const gd = /* @__PURE__ */ Symbol.for("v-scx"), yd = () => un(gd);
function Ve(t, e) {
  return Dr(t, null, e);
}
function Dl(t, e) {
  return Dr(
    t,
    null,
    { flush: "post" }
  );
}
function $l(t, e) {
  return Dr(
    t,
    null,
    { flush: "sync" }
  );
}
function xe(t, e, n) {
  return Dr(t, e, n);
}
function Dr(t, e, n = me) {
  const { immediate: r, deep: i, flush: s, once: o } = n, a = Oe({}, n), l = e && r || !e && s !== "post";
  let c;
  if (wr) {
    if (s === "sync") {
      const p = yd();
      c = p.__watcherHandles || (p.__watcherHandles = []);
    } else if (!l) {
      const p = () => {
      };
      return p.stop = Mt, p.resume = Mt, p.pause = Mt, p;
    }
  }
  const u = ze;
  a.call = (p, h, g) => wt(p, u, h, g);
  let d = !1;
  s === "post" ? a.scheduler = (p) => {
    Ne(p, u && u.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (p, h) => {
    h ? p() : Zs(p);
  }), a.augmentJob = (p) => {
    e && (p.flags |= 4), d && (p.flags |= 2, u && (p.id = u.uid, p.i = u));
  };
  const f = fd(t, e, a);
  return wr && (c ? c.push(f) : l && f()), f;
}
function bd(t, e, n) {
  const r = this.proxy, i = ke(t) ? t.includes(".") ? Bl(r, t) : () => r[t] : t.bind(r, r);
  let s;
  oe(e) ? s = e : (s = e.handler, n = e);
  const o = $r(this), a = Dr(i, s.bind(r), n);
  return o(), a;
}
function Bl(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let i = 0; i < n.length && r; i++)
      r = r[n[i]];
    return r;
  };
}
const Fl = /* @__PURE__ */ Symbol("_vte"), Nl = (t) => t.__isTeleport, ur = (t) => t && (t.disabled || t.disabled === ""), Mo = (t) => t && (t.defer || t.defer === ""), Do = (t) => typeof SVGElement < "u" && t instanceof SVGElement, $o = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, xs = (t, e) => {
  const n = t && t.to;
  return ke(n) ? e ? e(n) : null : n;
}, Hl = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, r, i, s, o, a, l, c) {
    const {
      mc: u,
      pc: d,
      pbc: f,
      o: { insert: p, querySelector: h, createText: g, createComment: y }
    } = c, w = ur(e.props);
    let { shapeFlag: m, children: x, dynamicChildren: b } = e;
    if (t == null) {
      const C = e.el = g(""), T = e.anchor = g("");
      p(C, n, r), p(T, n, r);
      const E = (A, D) => {
        m & 16 && u(
          x,
          A,
          D,
          i,
          s,
          o,
          a,
          l
        );
      }, O = () => {
        const A = e.target = xs(e.props, h), D = Ss(A, e, g, p);
        A && (o !== "svg" && Do(A) ? o = "svg" : o !== "mathml" && $o(A) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(A), w || (E(A, D), Zr(e, !1)));
      };
      w && (E(n, T), Zr(e, !0)), Mo(e.props) ? (e.el.__isMounted = !1, Ne(() => {
        O(), delete e.el.__isMounted;
      }, s)) : O();
    } else {
      if (Mo(e.props) && t.el.__isMounted === !1) {
        Ne(() => {
          Hl.process(
            t,
            e,
            n,
            r,
            i,
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
      const C = e.anchor = t.anchor, T = e.target = t.target, E = e.targetAnchor = t.targetAnchor, O = ur(t.props), A = O ? n : T, D = O ? C : E;
      if (o === "svg" || Do(T) ? o = "svg" : (o === "mathml" || $o(T)) && (o = "mathml"), b ? (f(
        t.dynamicChildren,
        b,
        A,
        i,
        s,
        o,
        a
      ), to(t, e, !0)) : l || d(
        t,
        e,
        A,
        D,
        i,
        s,
        o,
        a,
        !1
      ), w)
        O ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : Vr(
          e,
          n,
          C,
          c,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const G = e.target = xs(
          e.props,
          h
        );
        G && Vr(
          e,
          G,
          null,
          c,
          0
        );
      } else O && Vr(
        e,
        T,
        E,
        c,
        1
      );
      Zr(e, w);
    }
  },
  remove(t, e, n, { um: r, o: { remove: i } }, s) {
    const {
      shapeFlag: o,
      children: a,
      anchor: l,
      targetStart: c,
      targetAnchor: u,
      target: d,
      props: f
    } = t;
    if (d && (i(c), i(u)), s && i(l), o & 16) {
      const p = s || !ur(f);
      for (let h = 0; h < a.length; h++) {
        const g = a[h];
        r(
          g,
          e,
          n,
          p,
          !!g.dynamicChildren
        );
      }
    }
  },
  move: Vr,
  hydrate: _d
};
function Vr(t, e, n, { o: { insert: r }, m: i }, s = 2) {
  s === 0 && r(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: c, props: u } = t, d = s === 2;
  if (d && r(o, e, n), (!d || ur(u)) && l & 16)
    for (let f = 0; f < c.length; f++)
      i(
        c[f],
        e,
        n,
        2
      );
  d && r(a, e, n);
}
function _d(t, e, n, r, i, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: c, createText: u }
}, d) {
  function f(y, w) {
    let m = w;
    for (; m; ) {
      if (m && m.nodeType === 8) {
        if (m.data === "teleport start anchor")
          e.targetStart = m;
        else if (m.data === "teleport anchor") {
          e.targetAnchor = m, y._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      m = o(m);
    }
  }
  function p(y, w) {
    w.anchor = d(
      o(y),
      w,
      a(y),
      n,
      r,
      i,
      s
    );
  }
  const h = e.target = xs(
    e.props,
    l
  ), g = ur(e.props);
  if (h) {
    const y = h._lpa || h.firstChild;
    e.shapeFlag & 16 && (g ? (p(t, e), f(h, y), e.targetAnchor || Ss(
      h,
      e,
      u,
      c,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = o(t), f(h, y), e.targetAnchor || Ss(h, e, u, c), d(
      y && o(y),
      e,
      h,
      n,
      r,
      i,
      s
    ))), Zr(e, g);
  } else g && e.shapeFlag & 16 && (p(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const ql = Hl;
function Zr(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let r, i;
    for (e ? (r = t.el, i = t.anchor) : (r = t.targetStart, i = t.targetAnchor); r && r !== i; )
      r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
    n.ut();
  }
}
function Ss(t, e, n, r, i = null) {
  const s = e.targetStart = n(""), o = e.targetAnchor = n("");
  return s[Fl] = o, t && (r(s, t, i), r(o, t, i)), o;
}
const Ot = /* @__PURE__ */ Symbol("_leaveCb"), er = /* @__PURE__ */ Symbol("_enterCb");
function wd() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Ae(() => {
    t.isMounted = !0;
  }), Pn(() => {
    t.isUnmounting = !0;
  }), t;
}
const ft = [Function, Array], zl = {
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
}, Vl = (t) => {
  const e = t.subTree;
  return e.component ? Vl(e.component) : e;
}, xd = {
  name: "BaseTransition",
  props: zl,
  setup(t, { slots: e }) {
    const n = lt(), r = wd();
    return () => {
      const i = e.default && Ul(e.default(), !0);
      if (!i || !i.length)
        return;
      const s = Wl(i), o = /* @__PURE__ */ ve(t), { mode: a } = o;
      if (r.isLeaving)
        return Qi(s);
      const l = Bo(s);
      if (!l)
        return Qi(s);
      let c = Cs(
        l,
        o,
        r,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => c = d
      );
      l.type !== $e && yr(l, c);
      let u = n.subTree && Bo(n.subTree);
      if (u && u.type !== $e && !Sn(u, l) && Vl(n).type !== $e) {
        let d = Cs(
          u,
          o,
          r,
          n
        );
        if (yr(u, d), a === "out-in" && l.type !== $e)
          return r.isLeaving = !0, d.afterLeave = () => {
            r.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, u = void 0;
          }, Qi(s);
        a === "in-out" && l.type !== $e ? d.delayLeave = (f, p, h) => {
          const g = jl(
            r,
            u
          );
          g[String(u.key)] = u, f[Ot] = () => {
            p(), f[Ot] = void 0, delete c.delayedLeave, u = void 0;
          }, c.delayedLeave = () => {
            h(), delete c.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return s;
    };
  }
};
function Wl(t) {
  let e = t[0];
  if (t.length > 1) {
    for (const n of t)
      if (n.type !== $e) {
        e = n;
        break;
      }
  }
  return e;
}
const Sd = xd;
function jl(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function Cs(t, e, n, r, i) {
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
    onLeaveCancelled: g,
    onBeforeAppear: y,
    onAppear: w,
    onAfterAppear: m,
    onAppearCancelled: x
  } = e, b = String(t.key), C = jl(n, t), T = (A, D) => {
    A && wt(
      A,
      r,
      9,
      D
    );
  }, E = (A, D) => {
    const G = D[1];
    T(A, D), Q(A) ? A.every((M) => M.length <= 1) && G() : A.length <= 1 && G();
  }, O = {
    mode: o,
    persisted: a,
    beforeEnter(A) {
      let D = l;
      if (!n.isMounted)
        if (s)
          D = y || l;
        else
          return;
      A[Ot] && A[Ot](
        !0
        /* cancelled */
      );
      const G = C[b];
      G && Sn(t, G) && G.el[Ot] && G.el[Ot](), T(D, [A]);
    },
    enter(A) {
      let D = c, G = u, M = d;
      if (!n.isMounted)
        if (s)
          D = w || c, G = m || u, M = x || d;
        else
          return;
      let W = !1;
      A[er] = (se) => {
        W || (W = !0, se ? T(M, [A]) : T(G, [A]), O.delayedLeave && O.delayedLeave(), A[er] = void 0);
      };
      const H = A[er].bind(null, !1);
      D ? E(D, [A, H]) : H();
    },
    leave(A, D) {
      const G = String(t.key);
      if (A[er] && A[er](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return D();
      T(f, [A]);
      let M = !1;
      A[Ot] = (H) => {
        M || (M = !0, D(), H ? T(g, [A]) : T(h, [A]), A[Ot] = void 0, C[G] === t && delete C[G]);
      };
      const W = A[Ot].bind(null, !1);
      C[G] = t, p ? E(p, [A, W]) : W();
    },
    clone(A) {
      const D = Cs(
        A,
        e,
        n,
        r,
        i
      );
      return i && i(D), D;
    }
  };
  return O;
}
function Qi(t) {
  if (Ri(t))
    return t = Jt(t), t.children = null, t;
}
function Bo(t) {
  if (!Ri(t))
    return Nl(t.type) && t.children ? Wl(t.children) : t;
  if (t.component)
    return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (e & 16)
      return n[0];
    if (e & 32 && oe(n.default))
      return n.default();
  }
}
function yr(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, yr(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Ul(t, e = !1, n) {
  let r = [], i = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Te ? (o.patchFlag & 128 && i++, r = r.concat(
      Ul(o.children, e, a)
    )) : (e || o.type !== $e) && r.push(a != null ? Jt(o, { key: a }) : o);
  }
  if (i > 1)
    for (let s = 0; s < r.length; s++)
      r[s].patchFlag = -2;
  return r;
}
// @__NO_SIDE_EFFECTS__
function U(t, e) {
  return oe(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Oe({ name: t.name }, e, { setup: t })
  ) : t;
}
function Kl() {
  const t = lt();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function Xl(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function br(t) {
  const e = lt(), n = /* @__PURE__ */ An(null);
  if (e) {
    const i = e.refs === me ? e.refs = {} : e.refs;
    Object.defineProperty(i, t, {
      enumerable: !0,
      get: () => n.value,
      set: (s) => n.value = s
    });
  }
  return n;
}
function Fo(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const li = /* @__PURE__ */ new WeakMap();
function cr(t, e, n, r, i = !1) {
  if (Q(t)) {
    t.forEach(
      (g, y) => cr(
        g,
        e && (Q(e) ? e[y] : e),
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
  const s = r.shapeFlag & 4 ? $i(r.component) : r.el, o = i ? null : s, { i: a, r: l } = t, c = e && e.r, u = a.refs === me ? a.refs = {} : a.refs, d = a.setupState, f = /* @__PURE__ */ ve(d), p = d === me ? Za : (g) => Fo(u, g) ? !1 : ye(f, g), h = (g, y) => !(y && Fo(u, y));
  if (c != null && c !== l) {
    if (No(e), ke(c))
      u[c] = null, p(c) && (d[c] = null);
    else if (/* @__PURE__ */ Le(c)) {
      const g = e;
      h(c, g.k) && (c.value = null), g.k && (u[g.k] = null);
    }
  }
  if (oe(l))
    Lr(l, a, 12, [o, u]);
  else {
    const g = ke(l), y = /* @__PURE__ */ Le(l);
    if (g || y) {
      const w = () => {
        if (t.f) {
          const m = g ? p(l) ? d[l] : u[l] : h() || !t.k ? l.value : u[t.k];
          if (i)
            Q(m) && js(m, s);
          else if (Q(m))
            m.includes(s) || m.push(s);
          else if (g)
            u[l] = [s], p(l) && (d[l] = u[l]);
          else {
            const x = [s];
            h(l, t.k) && (l.value = x), t.k && (u[t.k] = x);
          }
        } else g ? (u[l] = o, p(l) && (d[l] = o)) : y && (h(l, t.k) && (l.value = o), t.k && (u[t.k] = o));
      };
      if (o) {
        const m = () => {
          w(), li.delete(t);
        };
        m.id = -1, li.set(t, m), Ne(m, n);
      } else
        No(t), w();
    }
  }
}
function No(t) {
  const e = li.get(t);
  e && (e.flags |= 8, li.delete(t));
}
Si().requestIdleCallback;
Si().cancelIdleCallback;
const Wn = (t) => !!t.type.__asyncLoader, Ri = (t) => t.type.__isKeepAlive;
function Cd(t, e) {
  Yl(t, "a", e);
}
function Ed(t, e) {
  Yl(t, "da", e);
}
function Yl(t, e, n = ze) {
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
      Ri(i.parent.vnode) && Td(r, e, n, i), i = i.parent;
  }
}
function Td(t, e, n, r) {
  const i = Ii(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  at(() => {
    js(r[e], i);
  }, n);
}
function Ii(t, e, n = ze, r = !1) {
  if (n) {
    const i = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Xt();
      const a = $r(n), l = wt(e, n, t, o);
      return a(), Yt(), l;
    });
    return r ? i.unshift(s) : i.push(s), s;
  }
}
const tn = (t) => (e, n = ze) => {
  (!wr || t === "sp") && Ii(t, (...r) => e(...r), n);
}, Ad = tn("bm"), Ae = tn("m"), kd = tn(
  "bu"
), Pd = tn("u"), Pn = tn(
  "bum"
), at = tn("um"), Od = tn(
  "sp"
), Rd = tn("rtg"), Id = tn("rtc");
function Ld(t, e = ze) {
  Ii("ec", t, e);
}
const Md = "components", Gl = /* @__PURE__ */ Symbol.for("v-ndc");
function Dd(t) {
  return ke(t) ? $d(Md, t, !1) || t : t || Gl;
}
function $d(t, e, n = !0, r = !1) {
  const i = Be || ze;
  if (i) {
    const s = i.type;
    {
      const a = wf(
        s,
        !1
      );
      if (a && (a === e || a === De(e) || a === xi(De(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Ho(i[t] || s[t], e) || // global registration
      Ho(i.appContext[t], e)
    );
    return !o && r ? s : o;
  }
}
function Ho(t, e) {
  return t && (t[e] || t[De(e)] || t[xi(De(e))]);
}
function On(t, e, n, r) {
  let i;
  const s = n, o = Q(t);
  if (o || ke(t)) {
    const a = o && /* @__PURE__ */ Tn(t);
    let l = !1, c = !1;
    a && (l = !/* @__PURE__ */ st(t), c = /* @__PURE__ */ Gt(t), t = Ei(t)), i = new Array(t.length);
    for (let u = 0, d = t.length; u < d; u++)
      i[u] = e(
        l ? c ? Kn(_t(t[u])) : _t(t[u]) : t[u],
        u,
        void 0,
        s
      );
  } else if (typeof t == "number") {
    i = new Array(t);
    for (let a = 0; a < t; a++)
      i[a] = e(a + 1, a, void 0, s);
  } else if (be(t))
    if (t[Symbol.iterator])
      i = Array.from(
        t,
        (a, l) => e(a, l, void 0, s)
      );
    else {
      const a = Object.keys(t);
      i = new Array(a.length);
      for (let l = 0, c = a.length; l < c; l++) {
        const u = a[l];
        i[l] = e(t[u], u, l, s);
      }
    }
  else
    i = [];
  return i;
}
function J(t, e, n = {}, r, i) {
  if (Be.ce || Be.parent && Wn(Be.parent) && Be.parent.ce) {
    const c = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), k(), z(
      Te,
      null,
      [q("slot", n, r && r())],
      c ? -2 : 64
    );
  }
  let s = t[e];
  s && s._c && (s._d = !1), k();
  const o = s && Jl(s(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = z(
    Te,
    {
      key: (a && !bt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && r ? "_fb" : "")
    },
    o || (r ? r() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), s && s._c && (s._d = !0), l;
}
function Jl(t) {
  return t.some((e) => _r(e) ? !(e.type === $e || e.type === Te && !Jl(e.children)) : !0) ? t : null;
}
const Es = (t) => t ? gu(t) ? $i(t) : Es(t.parent) : null, dr = (
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
    $parent: (t) => Es(t.parent),
    $root: (t) => Es(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => Ql(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Zs(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Ie.bind(t.proxy)),
    $watch: (t) => bd.bind(t)
  })
), es = (t, e) => t !== me && !t.__isScriptSetup && ye(t, e), Bd = {
  get({ _: t }, e) {
    if (e === "__v_skip")
      return !0;
    const { ctx: n, setupState: r, data: i, props: s, accessCache: o, type: a, appContext: l } = t;
    if (e[0] !== "$") {
      const f = o[e];
      if (f !== void 0)
        switch (f) {
          case 1:
            return r[e];
          case 2:
            return i[e];
          case 4:
            return n[e];
          case 3:
            return s[e];
        }
      else {
        if (es(r, e))
          return o[e] = 1, r[e];
        if (i !== me && ye(i, e))
          return o[e] = 2, i[e];
        if (ye(s, e))
          return o[e] = 3, s[e];
        if (n !== me && ye(n, e))
          return o[e] = 4, n[e];
        As && (o[e] = 0);
      }
    }
    const c = dr[e];
    let u, d;
    if (c)
      return e === "$attrs" && qe(t.attrs, "get", ""), c(t);
    if (
      // css module (injected by vue-loader)
      (u = a.__cssModules) && (u = u[e])
    )
      return u;
    if (n !== me && ye(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ye(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: i, ctx: s } = t;
    return es(i, e) ? (i[e] = n, !0) : r !== me && ye(r, e) ? (r[e] = n, !0) : ye(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: i, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== me && a[0] !== "$" && ye(t, a) || es(e, a) || ye(s, a) || ye(r, a) || ye(dr, a) || ye(i.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ye(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Fd() {
  return Nd().slots;
}
function Nd(t) {
  const e = lt();
  return e.setupContext || (e.setupContext = bu(e));
}
function Ts(t) {
  return Q(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Hd(t, e) {
  const n = Ts(t);
  for (const r in e) {
    if (r.startsWith("__skip")) continue;
    let i = n[r];
    i ? Q(i) || oe(i) ? i = n[r] = { type: i, default: e[r] } : i.default = e[r] : i === null && (i = n[r] = { default: e[r] }), i && e[`__skip_${r}`] && (i.skipFactory = !0);
  }
  return n;
}
let As = !0;
function qd(t) {
  const e = Ql(t), n = t.proxy, r = t.ctx;
  As = !1, e.beforeCreate && qo(e.beforeCreate, t, "bc");
  const {
    // state
    data: i,
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
    activated: g,
    deactivated: y,
    beforeDestroy: w,
    beforeUnmount: m,
    destroyed: x,
    unmounted: b,
    render: C,
    renderTracked: T,
    renderTriggered: E,
    errorCaptured: O,
    serverPrefetch: A,
    // public API
    expose: D,
    inheritAttrs: G,
    // assets
    components: M,
    directives: W,
    filters: H
  } = e;
  if (c && zd(c, r, null), o)
    for (const ie in o) {
      const te = o[ie];
      oe(te) && (r[ie] = te.bind(n));
    }
  if (i) {
    const ie = i.call(n, n);
    be(ie) && (t.data = /* @__PURE__ */ Ir(ie));
  }
  if (As = !0, s)
    for (const ie in s) {
      const te = s[ie], Pe = oe(te) ? te.bind(n, n) : oe(te.get) ? te.get.bind(n, n) : Mt, je = !oe(te) && oe(te.set) ? te.set.bind(n) : Mt, dt = L({
        get: Pe,
        set: je
      });
      Object.defineProperty(r, ie, {
        enumerable: !0,
        configurable: !0,
        get: () => dt.value,
        set: (Me) => dt.value = Me
      });
    }
  if (a)
    for (const ie in a)
      Zl(a[ie], r, n, ie);
  if (l) {
    const ie = oe(l) ? l.call(n) : l;
    Reflect.ownKeys(ie).forEach((te) => {
      Mr(te, ie[te]);
    });
  }
  u && qo(u, t, "c");
  function re(ie, te) {
    Q(te) ? te.forEach((Pe) => ie(Pe.bind(n))) : te && ie(te.bind(n));
  }
  if (re(Ad, d), re(Ae, f), re(kd, p), re(Pd, h), re(Cd, g), re(Ed, y), re(Ld, O), re(Id, T), re(Rd, E), re(Pn, m), re(at, b), re(Od, A), Q(D))
    if (D.length) {
      const ie = t.exposed || (t.exposed = {});
      D.forEach((te) => {
        Object.defineProperty(ie, te, {
          get: () => n[te],
          set: (Pe) => n[te] = Pe,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  C && t.render === Mt && (t.render = C), G != null && (t.inheritAttrs = G), M && (t.components = M), W && (t.directives = W), A && Xl(t);
}
function zd(t, e, n = Mt) {
  Q(t) && (t = ks(t));
  for (const r in t) {
    const i = t[r];
    let s;
    be(i) ? "default" in i ? s = un(
      i.from || r,
      i.default,
      !0
    ) : s = un(i.from || r) : s = un(i), /* @__PURE__ */ Le(s) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[r] = s;
  }
}
function qo(t, e, n) {
  wt(
    Q(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Zl(t, e, n, r) {
  let i = r.includes(".") ? Bl(n, r) : () => n[r];
  if (ke(t)) {
    const s = e[t];
    oe(s) && xe(i, s);
  } else if (oe(t))
    xe(i, t.bind(n));
  else if (be(t))
    if (Q(t))
      t.forEach((s) => Zl(s, e, n, r));
    else {
      const s = oe(t.handler) ? t.handler.bind(n) : e[t.handler];
      oe(s) && xe(i, s, t);
    }
}
function Ql(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: i,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !i.length && !n && !r ? l = e : (l = {}, i.length && i.forEach(
    (c) => ui(l, c, o, !0)
  ), ui(l, e, o)), be(e) && s.set(e, l), l;
}
function ui(t, e, n, r = !1) {
  const { mixins: i, extends: s } = e;
  s && ui(t, s, n, !0), i && i.forEach(
    (o) => ui(t, o, n, !0)
  );
  for (const o in e)
    if (!(r && o === "expose")) {
      const a = Vd[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Vd = {
  data: zo,
  props: Vo,
  emits: Vo,
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
  watch: jd,
  // provide / inject
  provide: zo,
  inject: Wd
};
function zo(t, e) {
  return e ? t ? function() {
    return Oe(
      oe(t) ? t.call(this, this) : t,
      oe(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Wd(t, e) {
  return ir(ks(t), ks(e));
}
function ks(t) {
  if (Q(t)) {
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
function Vo(t, e) {
  return t ? Q(t) && Q(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Oe(
    /* @__PURE__ */ Object.create(null),
    Ts(t),
    Ts(e ?? {})
  ) : e;
}
function jd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = Oe(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = Ue(t[r], e[r]);
  return n;
}
function eu() {
  return {
    app: null,
    config: {
      isNativeTag: Za,
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
let Ud = 0;
function Kd(t, e) {
  return function(r, i = null) {
    oe(r) || (r = Oe({}, r)), i != null && !be(i) && (i = null);
    const s = eu(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const c = s.app = {
      _uid: Ud++,
      _component: r,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: Ef,
      get config() {
        return s.config;
      },
      set config(u) {
      },
      use(u, ...d) {
        return o.has(u) || (u && oe(u.install) ? (o.add(u), u.install(c, ...d)) : oe(u) && (o.add(u), u(c, ...d))), c;
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
          const p = c._ceVNode || q(r, i);
          return p.appContext = s, f === !0 ? f = "svg" : f === !1 && (f = void 0), t(p, u, f), l = !0, c._container = u, u.__vue_app__ = c, $i(p.component);
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
function Xd(t, e, n = me) {
  const r = lt(), i = De(e), s = et(e), o = tu(t, i), a = kl((l, c) => {
    let u, d = me, f;
    return $l(() => {
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
        const g = r.vnode.props;
        g && // check if parent has passed v-model
        (e in g || i in g || s in g) && (`onUpdate:${e}` in g || `onUpdate:${i}` in g || `onUpdate:${s}` in g) || (u = p, c()), r.emit(`update:${e}`, h), Ke(p, h) && Ke(p, d) && !Ke(h, f) && c(), d = p, f = h;
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
const tu = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${De(e)}Modifiers`] || t[`${et(e)}Modifiers`];
function Yd(t, e, ...n) {
  if (t.isUnmounted) return;
  const r = t.vnode.props || me;
  let i = n;
  const s = e.startsWith("update:"), o = s && tu(r, e.slice(7));
  o && (o.trim && (i = n.map((u) => ke(u) ? u.trim() : u)), o.number && (i = n.map(Rc)));
  let a, l = r[a = Gr(e)] || // also try camelCase event handler (#2249)
  r[a = Gr(De(e))];
  !l && s && (l = r[a = Gr(et(e))]), l && wt(
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
const Gd = /* @__PURE__ */ new WeakMap();
function nu(t, e, n = !1) {
  const r = n ? Gd : e.emitsCache, i = r.get(t);
  if (i !== void 0)
    return i;
  const s = t.emits;
  let o = {}, a = !1;
  if (!oe(t)) {
    const l = (c) => {
      const u = nu(c, e, !0);
      u && (a = !0, Oe(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (be(t) && r.set(t, null), null) : (Q(s) ? s.forEach((l) => o[l] = null) : Oe(o, s), be(t) && r.set(t, o), o);
}
function Li(t, e) {
  return !t || !yi(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ye(t, e[0].toLowerCase() + e.slice(1)) || ye(t, et(e)) || ye(t, e));
}
function Wo(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: i,
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
    inheritAttrs: g
  } = t, y = ai(t);
  let w, m;
  try {
    if (n.shapeFlag & 4) {
      const b = i || r, C = b;
      w = Rt(
        c.call(
          C,
          b,
          u,
          d,
          p,
          f,
          h
        )
      ), m = a;
    } else {
      const b = e;
      w = Rt(
        b.length > 1 ? b(
          d,
          { attrs: a, slots: o, emit: l }
        ) : b(
          d,
          null
        )
      ), m = e.props ? a : Jd(a);
    }
  } catch (b) {
    fr.length = 0, Oi(b, t, 1), w = q($e);
  }
  let x = w;
  if (m && g !== !1) {
    const b = Object.keys(m), { shapeFlag: C } = x;
    b.length && C & 7 && (s && b.some(Ws) && (m = Zd(
      m,
      s
    )), x = Jt(x, m, !1, !0));
  }
  return n.dirs && (x = Jt(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(n.dirs) : n.dirs), n.transition && yr(x, n.transition), w = x, ai(y), w;
}
const Jd = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || yi(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, Zd = (t, e) => {
  const n = {};
  for (const r in t)
    (!Ws(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function Qd(t, e, n) {
  const { props: r, children: i, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return r ? jo(r, o, c) : !!o;
    if (l & 8) {
      const u = e.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        if (ru(o, r, f) && !Li(c, f))
          return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable) ? !0 : r === o ? !1 : r ? o ? jo(r, o, c) : !0 : !!o;
  return !1;
}
function jo(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    if (ru(e, t, s) && !Li(n, s))
      return !0;
  }
  return !1;
}
function ru(t, e, n) {
  const r = t[n], i = e[n];
  return n === "style" && be(r) && be(i) ? !Ks(r, i) : r !== i;
}
function ef({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const r = e.subTree;
    if (r.suspense && r.suspense.activeBranch === t && (r.el = t.el), r === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const iu = {}, su = () => Object.create(iu), ou = (t) => Object.getPrototypeOf(t) === iu;
function tf(t, e, n, r = !1) {
  const i = {}, s = su();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), au(t, e, i, s);
  for (const o in t.propsOptions[0])
    o in i || (i[o] = void 0);
  n ? t.props = r ? i : /* @__PURE__ */ Ai(i) : t.type.props ? t.props = i : t.props = s, t.attrs = s;
}
function nf(t, e, n, r) {
  const {
    props: i,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ ve(i), [l] = t.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const u = t.vnode.dynamicProps;
      for (let d = 0; d < u.length; d++) {
        let f = u[d];
        if (Li(t.emitsOptions, f))
          continue;
        const p = e[f];
        if (l)
          if (ye(s, f))
            p !== s[f] && (s[f] = p, c = !0);
          else {
            const h = De(f);
            i[h] = Ps(
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
    au(t, e, i, s) && (c = !0);
    let u;
    for (const d in a)
      (!e || // for camelCase
      !ye(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = et(d)) === d || !ye(e, u))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[d] = Ps(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete i[d]);
    if (s !== a)
      for (const d in s)
        (!e || !ye(e, d)) && (delete s[d], c = !0);
  }
  c && Ut(t.attrs, "set", "");
}
function au(t, e, n, r) {
  const [i, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (or(l))
        continue;
      const c = e[l];
      let u;
      i && ye(i, u = De(l)) ? !s || !s.includes(u) ? n[u] = c : (a || (a = {}))[u] = c : Li(t.emitsOptions, l) || (!(l in r) || c !== r[l]) && (r[l] = c, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ ve(n), c = a || me;
    for (let u = 0; u < s.length; u++) {
      const d = s[u];
      n[d] = Ps(
        i,
        l,
        d,
        c[d],
        t,
        !ye(c, d)
      );
    }
  }
  return o;
}
function Ps(t, e, n, r, i, s) {
  const o = t[n];
  if (o != null) {
    const a = ye(o, "default");
    if (a && r === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && oe(l)) {
        const { propsDefaults: c } = i;
        if (n in c)
          r = c[n];
        else {
          const u = $r(i);
          r = c[n] = l.call(
            null,
            e
          ), u();
        }
      } else
        r = l;
      i.ce && i.ce._setProp(n, r);
    }
    o[
      0
      /* shouldCast */
    ] && (s && !a ? r = !1 : o[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === et(n)) && (r = !0));
  }
  return r;
}
const rf = /* @__PURE__ */ new WeakMap();
function lu(t, e, n = !1) {
  const r = n ? rf : e.propsCache, i = r.get(t);
  if (i)
    return i;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!oe(t)) {
    const u = (d) => {
      l = !0;
      const [f, p] = lu(d, e, !0);
      Oe(o, f), p && a.push(...p);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!s && !l)
    return be(t) && r.set(t, qn), qn;
  if (Q(s))
    for (let u = 0; u < s.length; u++) {
      const d = De(s[u]);
      Uo(d) && (o[d] = me);
    }
  else if (s)
    for (const u in s) {
      const d = De(u);
      if (Uo(d)) {
        const f = s[u], p = o[d] = Q(f) || oe(f) ? { type: f } : Oe({}, f), h = p.type;
        let g = !1, y = !0;
        if (Q(h))
          for (let w = 0; w < h.length; ++w) {
            const m = h[w], x = oe(m) && m.name;
            if (x === "Boolean") {
              g = !0;
              break;
            } else x === "String" && (y = !1);
          }
        else
          g = oe(h) && h.name === "Boolean";
        p[
          0
          /* shouldCast */
        ] = g, p[
          1
          /* shouldCastTrue */
        ] = y, (g || ye(p, "default")) && a.push(d);
      }
    }
  const c = [o, a];
  return be(t) && r.set(t, c), c;
}
function Uo(t) {
  return t[0] !== "$" && !or(t);
}
const Qs = (t) => t === "_" || t === "_ctx" || t === "$stable", eo = (t) => Q(t) ? t.map(Rt) : [Rt(t)], sf = (t, e, n) => {
  if (e._n)
    return e;
  const r = R((...i) => eo(e(...i)), n);
  return r._c = !1, r;
}, uu = (t, e, n) => {
  const r = t._ctx;
  for (const i in t) {
    if (Qs(i)) continue;
    const s = t[i];
    if (oe(s))
      e[i] = sf(i, s, r);
    else if (s != null) {
      const o = eo(s);
      e[i] = () => o;
    }
  }
}, cu = (t, e) => {
  const n = eo(e);
  t.slots.default = () => n;
}, du = (t, e, n) => {
  for (const r in e)
    (n || !Qs(r)) && (t[r] = e[r]);
}, of = (t, e, n) => {
  const r = t.slots = su();
  if (t.vnode.shapeFlag & 32) {
    const i = e._;
    i ? (du(r, e, n), n && nl(r, "_", i, !0)) : uu(e, r);
  } else e && cu(t, e);
}, af = (t, e, n) => {
  const { vnode: r, slots: i } = t;
  let s = !0, o = me;
  if (r.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : du(i, e, n) : (s = !e.$stable, uu(e, i)), o = e;
  } else e && (cu(t, e), o = { default: 1 });
  if (s)
    for (const a in i)
      !Qs(a) && o[a] == null && delete i[a];
}, Ne = ff;
function lf(t) {
  return uf(t);
}
function uf(t, e) {
  const n = Si();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: i,
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
  } = t, g = (_, S, P, N = null, $ = null, B = null, K = void 0, j = null, V = !!S.dynamicChildren) => {
    if (_ === S)
      return;
    _ && !Sn(_, S) && (N = X(_), Me(_, $, B, !0), _ = null), S.patchFlag === -2 && (V = !1, S.dynamicChildren = null);
    const { type: F, ref: ee, shapeFlag: Y } = S;
    switch (F) {
      case Mi:
        y(_, S, P, N);
        break;
      case $e:
        w(_, S, P, N);
        break;
      case ns:
        _ == null && m(S, P, N, K);
        break;
      case Te:
        M(
          _,
          S,
          P,
          N,
          $,
          B,
          K,
          j,
          V
        );
        break;
      default:
        Y & 1 ? C(
          _,
          S,
          P,
          N,
          $,
          B,
          K,
          j,
          V
        ) : Y & 6 ? W(
          _,
          S,
          P,
          N,
          $,
          B,
          K,
          j,
          V
        ) : (Y & 64 || Y & 128) && F.process(
          _,
          S,
          P,
          N,
          $,
          B,
          K,
          j,
          V,
          he
        );
    }
    ee != null && $ ? cr(ee, _ && _.ref, B, S || _, !S) : ee == null && _ && _.ref != null && cr(_.ref, null, B, _, !0);
  }, y = (_, S, P, N) => {
    if (_ == null)
      r(
        S.el = a(S.children),
        P,
        N
      );
    else {
      const $ = S.el = _.el;
      S.children !== _.children && c($, S.children);
    }
  }, w = (_, S, P, N) => {
    _ == null ? r(
      S.el = l(S.children || ""),
      P,
      N
    ) : S.el = _.el;
  }, m = (_, S, P, N) => {
    [_.el, _.anchor] = h(
      _.children,
      S,
      P,
      N,
      _.el,
      _.anchor
    );
  }, x = ({ el: _, anchor: S }, P, N) => {
    let $;
    for (; _ && _ !== S; )
      $ = f(_), r(_, P, N), _ = $;
    r(S, P, N);
  }, b = ({ el: _, anchor: S }) => {
    let P;
    for (; _ && _ !== S; )
      P = f(_), i(_), _ = P;
    i(S);
  }, C = (_, S, P, N, $, B, K, j, V) => {
    if (S.type === "svg" ? K = "svg" : S.type === "math" && (K = "mathml"), _ == null)
      T(
        S,
        P,
        N,
        $,
        B,
        K,
        j,
        V
      );
    else {
      const F = _.el && _.el._isVueCE ? _.el : null;
      try {
        F && F._beginPatch(), A(
          _,
          S,
          $,
          B,
          K,
          j,
          V
        );
      } finally {
        F && F._endPatch();
      }
    }
  }, T = (_, S, P, N, $, B, K, j) => {
    let V, F;
    const { props: ee, shapeFlag: Y, transition: Z, dirs: ae } = _;
    if (V = _.el = o(
      _.type,
      B,
      ee && ee.is,
      ee
    ), Y & 8 ? u(V, _.children) : Y & 16 && O(
      _.children,
      V,
      null,
      N,
      $,
      ts(_, B),
      K,
      j
    ), ae && gn(_, null, N, "created"), E(V, _, _.scopeId, K, N), ee) {
      for (const Ce in ee)
        Ce !== "value" && !or(Ce) && s(V, Ce, null, ee[Ce], B, N);
      "value" in ee && s(V, "value", null, ee.value, B), (F = ee.onVnodeBeforeMount) && kt(F, N, _);
    }
    ae && gn(_, null, N, "beforeMount");
    const fe = cf($, Z);
    fe && Z.beforeEnter(V), r(V, S, P), ((F = ee && ee.onVnodeMounted) || fe || ae) && Ne(() => {
      F && kt(F, N, _), fe && Z.enter(V), ae && gn(_, null, N, "mounted");
    }, $);
  }, E = (_, S, P, N, $) => {
    if (P && p(_, P), N)
      for (let B = 0; B < N.length; B++)
        p(_, N[B]);
    if ($) {
      let B = $.subTree;
      if (S === B || hu(B.type) && (B.ssContent === S || B.ssFallback === S)) {
        const K = $.vnode;
        E(
          _,
          K,
          K.scopeId,
          K.slotScopeIds,
          $.parent
        );
      }
    }
  }, O = (_, S, P, N, $, B, K, j, V = 0) => {
    for (let F = V; F < _.length; F++) {
      const ee = _[F] = j ? jt(_[F]) : Rt(_[F]);
      g(
        null,
        ee,
        S,
        P,
        N,
        $,
        B,
        K,
        j
      );
    }
  }, A = (_, S, P, N, $, B, K) => {
    const j = S.el = _.el;
    let { patchFlag: V, dynamicChildren: F, dirs: ee } = S;
    V |= _.patchFlag & 16;
    const Y = _.props || me, Z = S.props || me;
    let ae;
    if (P && yn(P, !1), (ae = Z.onVnodeBeforeUpdate) && kt(ae, P, S, _), ee && gn(S, _, P, "beforeUpdate"), P && yn(P, !0), (Y.innerHTML && Z.innerHTML == null || Y.textContent && Z.textContent == null) && u(j, ""), F ? D(
      _.dynamicChildren,
      F,
      j,
      P,
      N,
      ts(S, $),
      B
    ) : K || te(
      _,
      S,
      j,
      null,
      P,
      N,
      ts(S, $),
      B,
      !1
    ), V > 0) {
      if (V & 16)
        G(j, Y, Z, P, $);
      else if (V & 2 && Y.class !== Z.class && s(j, "class", null, Z.class, $), V & 4 && s(j, "style", Y.style, Z.style, $), V & 8) {
        const fe = S.dynamicProps;
        for (let Ce = 0; Ce < fe.length; Ce++) {
          const we = fe[Ce], Je = Y[we], Ze = Z[we];
          (Ze !== Je || we === "value") && s(j, we, Je, Ze, $, P);
        }
      }
      V & 1 && _.children !== S.children && u(j, S.children);
    } else !K && F == null && G(j, Y, Z, P, $);
    ((ae = Z.onVnodeUpdated) || ee) && Ne(() => {
      ae && kt(ae, P, S, _), ee && gn(S, _, P, "updated");
    }, N);
  }, D = (_, S, P, N, $, B, K) => {
    for (let j = 0; j < S.length; j++) {
      const V = _[j], F = S[j], ee = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        V.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (V.type === Te || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Sn(V, F) || // - In the case of a component, it could contain anything.
        V.shapeFlag & 198) ? d(V.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          P
        )
      );
      g(
        V,
        F,
        ee,
        null,
        N,
        $,
        B,
        K,
        !0
      );
    }
  }, G = (_, S, P, N, $) => {
    if (S !== P) {
      if (S !== me)
        for (const B in S)
          !or(B) && !(B in P) && s(
            _,
            B,
            S[B],
            null,
            $,
            N
          );
      for (const B in P) {
        if (or(B)) continue;
        const K = P[B], j = S[B];
        K !== j && B !== "value" && s(_, B, j, K, $, N);
      }
      "value" in P && s(_, "value", S.value, P.value, $);
    }
  }, M = (_, S, P, N, $, B, K, j, V) => {
    const F = S.el = _ ? _.el : a(""), ee = S.anchor = _ ? _.anchor : a("");
    let { patchFlag: Y, dynamicChildren: Z, slotScopeIds: ae } = S;
    ae && (j = j ? j.concat(ae) : ae), _ == null ? (r(F, P, N), r(ee, P, N), O(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      S.children || [],
      P,
      ee,
      $,
      B,
      K,
      j,
      V
    )) : Y > 0 && Y & 64 && Z && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    _.dynamicChildren && _.dynamicChildren.length === Z.length ? (D(
      _.dynamicChildren,
      Z,
      P,
      $,
      B,
      K,
      j
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (S.key != null || $ && S === $.subTree) && to(
      _,
      S,
      !0
      /* shallow */
    )) : te(
      _,
      S,
      P,
      ee,
      $,
      B,
      K,
      j,
      V
    );
  }, W = (_, S, P, N, $, B, K, j, V) => {
    S.slotScopeIds = j, _ == null ? S.shapeFlag & 512 ? $.ctx.activate(
      S,
      P,
      N,
      K,
      V
    ) : H(
      S,
      P,
      N,
      $,
      B,
      K,
      V
    ) : se(_, S, V);
  }, H = (_, S, P, N, $, B, K) => {
    const j = _.component = gf(
      _,
      N,
      $
    );
    if (Ri(_) && (j.ctx.renderer = he), yf(j, !1, K), j.asyncDep) {
      if ($ && $.registerDep(j, re, K), !_.el) {
        const V = j.subTree = q($e);
        w(null, V, S, P), _.placeholder = V.el;
      }
    } else
      re(
        j,
        _,
        S,
        P,
        $,
        B,
        K
      );
  }, se = (_, S, P) => {
    const N = S.component = _.component;
    if (Qd(_, S, P))
      if (N.asyncDep && !N.asyncResolved) {
        ie(N, S, P);
        return;
      } else
        N.next = S, N.update();
    else
      S.el = _.el, N.vnode = S;
  }, re = (_, S, P, N, $, B, K) => {
    const j = () => {
      if (_.isMounted) {
        let { next: Y, bu: Z, u: ae, parent: fe, vnode: Ce } = _;
        {
          const Tt = fu(_);
          if (Tt) {
            Y && (Y.el = Ce.el, ie(_, Y, K)), Tt.asyncDep.then(() => {
              Ne(() => {
                _.isUnmounted || F();
              }, $);
            });
            return;
          }
        }
        let we = Y, Je;
        yn(_, !1), Y ? (Y.el = Ce.el, ie(_, Y, K)) : Y = Ce, Z && Xi(Z), (Je = Y.props && Y.props.onVnodeBeforeUpdate) && kt(Je, fe, Y, Ce), yn(_, !0);
        const Ze = Wo(_), Et = _.subTree;
        _.subTree = Ze, g(
          Et,
          Ze,
          // parent may have changed if it's in a teleport
          d(Et.el),
          // anchor may have changed if it's in a fragment
          X(Et),
          _,
          $,
          B
        ), Y.el = Ze.el, we === null && ef(_, Ze.el), ae && Ne(ae, $), (Je = Y.props && Y.props.onVnodeUpdated) && Ne(
          () => kt(Je, fe, Y, Ce),
          $
        );
      } else {
        let Y;
        const { el: Z, props: ae } = S, { bm: fe, m: Ce, parent: we, root: Je, type: Ze } = _, Et = Wn(S);
        yn(_, !1), fe && Xi(fe), !Et && (Y = ae && ae.onVnodeBeforeMount) && kt(Y, we, S), yn(_, !0);
        {
          Je.ce && Je.ce._hasShadowRoot() && Je.ce._injectChildStyle(Ze);
          const Tt = _.subTree = Wo(_);
          g(
            null,
            Tt,
            P,
            N,
            _,
            $,
            B
          ), S.el = Tt.el;
        }
        if (Ce && Ne(Ce, $), !Et && (Y = ae && ae.onVnodeMounted)) {
          const Tt = S;
          Ne(
            () => kt(Y, we, Tt),
            $
          );
        }
        (S.shapeFlag & 256 || we && Wn(we.vnode) && we.vnode.shapeFlag & 256) && _.a && Ne(_.a, $), _.isMounted = !0, S = P = N = null;
      }
    };
    _.scope.on();
    const V = _.effect = new ul(j);
    _.scope.off();
    const F = _.update = V.run.bind(V), ee = _.job = V.runIfDirty.bind(V);
    ee.i = _, ee.id = _.uid, V.scheduler = () => Zs(ee), yn(_, !0), F();
  }, ie = (_, S, P) => {
    S.component = _;
    const N = _.vnode.props;
    _.vnode = S, _.next = null, nf(_, S.props, N, P), af(_, S.children, P), Xt(), Lo(_), Yt();
  }, te = (_, S, P, N, $, B, K, j, V = !1) => {
    const F = _ && _.children, ee = _ ? _.shapeFlag : 0, Y = S.children, { patchFlag: Z, shapeFlag: ae } = S;
    if (Z > 0) {
      if (Z & 128) {
        je(
          F,
          Y,
          P,
          N,
          $,
          B,
          K,
          j,
          V
        );
        return;
      } else if (Z & 256) {
        Pe(
          F,
          Y,
          P,
          N,
          $,
          B,
          K,
          j,
          V
        );
        return;
      }
    }
    ae & 8 ? (ee & 16 && qt(F, $, B), Y !== F && u(P, Y)) : ee & 16 ? ae & 16 ? je(
      F,
      Y,
      P,
      N,
      $,
      B,
      K,
      j,
      V
    ) : qt(F, $, B, !0) : (ee & 8 && u(P, ""), ae & 16 && O(
      Y,
      P,
      N,
      $,
      B,
      K,
      j,
      V
    ));
  }, Pe = (_, S, P, N, $, B, K, j, V) => {
    _ = _ || qn, S = S || qn;
    const F = _.length, ee = S.length, Y = Math.min(F, ee);
    let Z;
    for (Z = 0; Z < Y; Z++) {
      const ae = S[Z] = V ? jt(S[Z]) : Rt(S[Z]);
      g(
        _[Z],
        ae,
        P,
        null,
        $,
        B,
        K,
        j,
        V
      );
    }
    F > ee ? qt(
      _,
      $,
      B,
      !0,
      !1,
      Y
    ) : O(
      S,
      P,
      N,
      $,
      B,
      K,
      j,
      V,
      Y
    );
  }, je = (_, S, P, N, $, B, K, j, V) => {
    let F = 0;
    const ee = S.length;
    let Y = _.length - 1, Z = ee - 1;
    for (; F <= Y && F <= Z; ) {
      const ae = _[F], fe = S[F] = V ? jt(S[F]) : Rt(S[F]);
      if (Sn(ae, fe))
        g(
          ae,
          fe,
          P,
          null,
          $,
          B,
          K,
          j,
          V
        );
      else
        break;
      F++;
    }
    for (; F <= Y && F <= Z; ) {
      const ae = _[Y], fe = S[Z] = V ? jt(S[Z]) : Rt(S[Z]);
      if (Sn(ae, fe))
        g(
          ae,
          fe,
          P,
          null,
          $,
          B,
          K,
          j,
          V
        );
      else
        break;
      Y--, Z--;
    }
    if (F > Y) {
      if (F <= Z) {
        const ae = Z + 1, fe = ae < ee ? S[ae].el : N;
        for (; F <= Z; )
          g(
            null,
            S[F] = V ? jt(S[F]) : Rt(S[F]),
            P,
            fe,
            $,
            B,
            K,
            j,
            V
          ), F++;
      }
    } else if (F > Z)
      for (; F <= Y; )
        Me(_[F], $, B, !0), F++;
    else {
      const ae = F, fe = F, Ce = /* @__PURE__ */ new Map();
      for (F = fe; F <= Z; F++) {
        const rt = S[F] = V ? jt(S[F]) : Rt(S[F]);
        rt.key != null && Ce.set(rt.key, F);
      }
      let we, Je = 0;
      const Ze = Z - fe + 1;
      let Et = !1, Tt = 0;
      const Zn = new Array(Ze);
      for (F = 0; F < Ze; F++) Zn[F] = 0;
      for (F = ae; F <= Y; F++) {
        const rt = _[F];
        if (Je >= Ze) {
          Me(rt, $, B, !0);
          continue;
        }
        let At;
        if (rt.key != null)
          At = Ce.get(rt.key);
        else
          for (we = fe; we <= Z; we++)
            if (Zn[we - fe] === 0 && Sn(rt, S[we])) {
              At = we;
              break;
            }
        At === void 0 ? Me(rt, $, B, !0) : (Zn[At - fe] = F + 1, At >= Tt ? Tt = At : Et = !0, g(
          rt,
          S[At],
          P,
          null,
          $,
          B,
          K,
          j,
          V
        ), Je++);
      }
      const Eo = Et ? df(Zn) : qn;
      for (we = Eo.length - 1, F = Ze - 1; F >= 0; F--) {
        const rt = fe + F, At = S[rt], To = S[rt + 1], Ao = rt + 1 < ee ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          To.el || pu(To)
        ) : N;
        Zn[F] === 0 ? g(
          null,
          At,
          P,
          Ao,
          $,
          B,
          K,
          j,
          V
        ) : Et && (we < 0 || F !== Eo[we] ? dt(At, P, Ao, 2) : we--);
      }
    }
  }, dt = (_, S, P, N, $ = null) => {
    const { el: B, type: K, transition: j, children: V, shapeFlag: F } = _;
    if (F & 6) {
      dt(_.component.subTree, S, P, N);
      return;
    }
    if (F & 128) {
      _.suspense.move(S, P, N);
      return;
    }
    if (F & 64) {
      K.move(_, S, P, he);
      return;
    }
    if (K === Te) {
      r(B, S, P);
      for (let Y = 0; Y < V.length; Y++)
        dt(V[Y], S, P, N);
      r(_.anchor, S, P);
      return;
    }
    if (K === ns) {
      x(_, S, P);
      return;
    }
    if (N !== 2 && F & 1 && j)
      if (N === 0)
        j.beforeEnter(B), r(B, S, P), Ne(() => j.enter(B), $);
      else {
        const { leave: Y, delayLeave: Z, afterLeave: ae } = j, fe = () => {
          _.ctx.isUnmounted ? i(B) : r(B, S, P);
        }, Ce = () => {
          B._isLeaving && B[Ot](
            !0
            /* cancelled */
          ), Y(B, () => {
            fe(), ae && ae();
          });
        };
        Z ? Z(B, fe, Ce) : Ce();
      }
    else
      r(B, S, P);
  }, Me = (_, S, P, N = !1, $ = !1) => {
    const {
      type: B,
      props: K,
      ref: j,
      children: V,
      dynamicChildren: F,
      shapeFlag: ee,
      patchFlag: Y,
      dirs: Z,
      cacheIndex: ae
    } = _;
    if (Y === -2 && ($ = !1), j != null && (Xt(), cr(j, null, P, _, !0), Yt()), ae != null && (S.renderCache[ae] = void 0), ee & 256) {
      S.ctx.deactivate(_);
      return;
    }
    const fe = ee & 1 && Z, Ce = !Wn(_);
    let we;
    if (Ce && (we = K && K.onVnodeBeforeUnmount) && kt(we, S, _), ee & 6)
      Jn(_.component, P, N);
    else {
      if (ee & 128) {
        _.suspense.unmount(P, N);
        return;
      }
      fe && gn(_, null, S, "beforeUnmount"), ee & 64 ? _.type.remove(
        _,
        S,
        P,
        he,
        N
      ) : F && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !F.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (B !== Te || Y > 0 && Y & 64) ? qt(
        F,
        S,
        P,
        !1,
        !0
      ) : (B === Te && Y & 384 || !$ && ee & 16) && qt(V, S, P), N && Mn(_);
    }
    (Ce && (we = K && K.onVnodeUnmounted) || fe) && Ne(() => {
      we && kt(we, S, _), fe && gn(_, null, S, "unmounted");
    }, P);
  }, Mn = (_) => {
    const { type: S, el: P, anchor: N, transition: $ } = _;
    if (S === Te) {
      Ht(P, N);
      return;
    }
    if (S === ns) {
      b(_);
      return;
    }
    const B = () => {
      i(P), $ && !$.persisted && $.afterLeave && $.afterLeave();
    };
    if (_.shapeFlag & 1 && $ && !$.persisted) {
      const { leave: K, delayLeave: j } = $, V = () => K(P, B);
      j ? j(_.el, B, V) : V();
    } else
      B();
  }, Ht = (_, S) => {
    let P;
    for (; _ !== S; )
      P = f(_), i(_), _ = P;
    i(S);
  }, Jn = (_, S, P) => {
    const { bum: N, scope: $, job: B, subTree: K, um: j, m: V, a: F } = _;
    Ko(V), Ko(F), N && Xi(N), $.stop(), B && (B.flags |= 8, Me(K, _, S, P)), j && Ne(j, S), Ne(() => {
      _.isUnmounted = !0;
    }, S);
  }, qt = (_, S, P, N = !1, $ = !1, B = 0) => {
    for (let K = B; K < _.length; K++)
      Me(_[K], S, P, N, $);
  }, X = (_) => {
    if (_.shapeFlag & 6)
      return X(_.component.subTree);
    if (_.shapeFlag & 128)
      return _.suspense.next();
    const S = f(_.anchor || _.el), P = S && S[Fl];
    return P ? f(P) : S;
  };
  let ne = !1;
  const ue = (_, S, P) => {
    let N;
    _ == null ? S._vnode && (Me(S._vnode, null, null, !0), N = S._vnode.component) : g(
      S._vnode || null,
      _,
      S,
      null,
      null,
      null,
      P
    ), S._vnode = _, ne || (ne = !0, Lo(N), Il(), ne = !1);
  }, he = {
    p: g,
    um: Me,
    m: dt,
    r: Mn,
    mt: H,
    mc: O,
    pc: te,
    pbc: D,
    n: X,
    o: t
  };
  return {
    render: ue,
    hydrate: void 0,
    createApp: Kd(ue)
  };
}
function ts({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function yn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function cf(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function to(t, e, n = !1) {
  const r = t.children, i = e.children;
  if (Q(r) && Q(i))
    for (let s = 0; s < r.length; s++) {
      const o = r[s];
      let a = i[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[s] = jt(i[s]), a.el = o.el), !n && a.patchFlag !== -2 && to(o, a)), a.type === Mi && (a.patchFlag === -1 && (a = i[s] = jt(a)), a.el = o.el), a.type === $e && !a.el && (a.el = o.el);
    }
}
function df(t) {
  const e = t.slice(), n = [0];
  let r, i, s, o, a;
  const l = t.length;
  for (r = 0; r < l; r++) {
    const c = t[r];
    if (c !== 0) {
      if (i = n[n.length - 1], t[i] < c) {
        e[r] = i, n.push(r);
        continue;
      }
      for (s = 0, o = n.length - 1; s < o; )
        a = s + o >> 1, t[n[a]] < c ? s = a + 1 : o = a;
      c < t[n[s]] && (s > 0 && (e[r] = n[s - 1]), n[s] = r);
    }
  }
  for (s = n.length, o = n[s - 1]; s-- > 0; )
    n[s] = o, o = e[o];
  return n;
}
function fu(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : fu(e);
}
function Ko(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function pu(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? pu(e.subTree) : null;
}
const hu = (t) => t.__isSuspense;
function ff(t, e) {
  e && e.pendingBranch ? Q(t) ? e.effects.push(...t) : e.effects.push(t) : vd(t);
}
const Te = /* @__PURE__ */ Symbol.for("v-fgt"), Mi = /* @__PURE__ */ Symbol.for("v-txt"), $e = /* @__PURE__ */ Symbol.for("v-cmt"), ns = /* @__PURE__ */ Symbol.for("v-stc"), fr = [];
let Ge = null;
function k(t = !1) {
  fr.push(Ge = t ? null : []);
}
function pf() {
  fr.pop(), Ge = fr[fr.length - 1] || null;
}
let Xn = 1;
function ci(t, e = !1) {
  Xn += t, t < 0 && Ge && e && (Ge.hasOnce = !0);
}
function vu(t) {
  return t.dynamicChildren = Xn > 0 ? Ge || qn : null, pf(), Xn > 0 && Ge && Ge.push(t), t;
}
function ce(t, e, n, r, i, s) {
  return vu(
    le(
      t,
      e,
      n,
      r,
      i,
      s,
      !0
    )
  );
}
function z(t, e, n, r, i) {
  return vu(
    q(
      t,
      e,
      n,
      r,
      i,
      !0
    )
  );
}
function _r(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Sn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const mu = ({ key: t }) => t ?? null, Qr = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? ke(t) || /* @__PURE__ */ Le(t) || oe(t) ? { i: Be, r: t, k: e, f: !!n } : t : null);
function le(t, e = null, n = null, r = 0, i = null, s = t === Te ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && mu(e),
    ref: e && Qr(e),
    scopeId: Ml,
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
    patchFlag: r,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Be
  };
  return a ? (no(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= ke(n) ? 8 : 16), Xn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ge && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ge.push(l), l;
}
const q = hf;
function hf(t, e = null, n = null, r = 0, i = null, s = !1) {
  if ((!t || t === Gl) && (t = $e), _r(t)) {
    const a = Jt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && no(a, n), Xn > 0 && !s && Ge && (a.shapeFlag & 6 ? Ge[Ge.indexOf(t)] = a : Ge.push(a)), a.patchFlag = -2, a;
  }
  if (xf(t) && (t = t.__vccOpts), e) {
    e = Di(e);
    let { class: a, style: l } = e;
    a && !ke(a) && (e.class = dn(a)), be(l) && (/* @__PURE__ */ Pi(l) && !Q(l) && (l = Oe({}, l)), e.style = tt(l));
  }
  const o = ke(t) ? 1 : hu(t) ? 128 : Nl(t) ? 64 : be(t) ? 4 : oe(t) ? 2 : 0;
  return le(
    t,
    e,
    n,
    r,
    i,
    o,
    s,
    !0
  );
}
function Di(t) {
  return t ? /* @__PURE__ */ Pi(t) || ou(t) ? Oe({}, t) : t : null;
}
function Jt(t, e, n = !1, r = !1) {
  const { props: i, ref: s, patchFlag: o, children: a, transition: l } = t, c = e ? de(i || {}, e) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: c,
    key: c && mu(c),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? Q(s) ? s.concat(Qr(e)) : [s, Qr(e)] : Qr(e)
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
    patchFlag: e && t.type !== Te ? o === -1 ? 16 : o | 16 : o,
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
    ssContent: t.ssContent && Jt(t.ssContent),
    ssFallback: t.ssFallback && Jt(t.ssFallback),
    placeholder: t.placeholder,
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
  return l && r && yr(
    u,
    l.clone(u)
  ), u;
}
function We(t = " ", e = 0) {
  return q(Mi, null, t, e);
}
function pe(t = "", e = !1) {
  return e ? (k(), z($e, null, t)) : q($e, null, t);
}
function Rt(t) {
  return t == null || typeof t == "boolean" ? q($e) : Q(t) ? q(
    Te,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : _r(t) ? jt(t) : q(Mi, null, String(t));
}
function jt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Jt(t);
}
function no(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (Q(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const i = e.default;
      i && (i._c && (i._d = !1), no(t, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = e._;
      !i && !ou(e) ? e._ctx = Be : i === 3 && Be && (Be.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else oe(e) ? (e = { default: e, _ctx: Be }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [We(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function de(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const i in r)
      if (i === "class")
        e.class !== r.class && (e.class = dn([e.class, r.class]));
      else if (i === "style")
        e.style = tt([e.style, r.style]);
      else if (yi(i)) {
        const s = e[i], o = r[i];
        o && s !== o && !(Q(s) && s.includes(o)) && (e[i] = s ? [].concat(s, o) : o);
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
const vf = eu();
let mf = 0;
function gf(t, e, n) {
  const r = t.type, i = (e ? e.appContext : t.appContext) || vf, s = {
    uid: mf++,
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
    scope: new ol(
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
    propsOptions: lu(r, i),
    emitsOptions: nu(r, i),
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Yd.bind(null, s), t.ce && t.ce(s), s;
}
let ze = null;
const lt = () => ze || Be;
let di, Os;
{
  const t = Si(), e = (n, r) => {
    let i;
    return (i = t[n]) || (i = t[n] = []), i.push(r), (s) => {
      i.length > 1 ? i.forEach((o) => o(s)) : i[0](s);
    };
  };
  di = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ze = n
  ), Os = e(
    "__VUE_SSR_SETTERS__",
    (n) => wr = n
  );
}
const $r = (t) => {
  const e = ze;
  return di(t), t.scope.on(), () => {
    t.scope.off(), di(e);
  };
}, Xo = () => {
  ze && ze.scope.off(), di(null);
};
function gu(t) {
  return t.vnode.shapeFlag & 4;
}
let wr = !1;
function yf(t, e = !1, n = !1) {
  e && Os(e);
  const { props: r, children: i } = t.vnode, s = gu(t);
  tf(t, r, s, e), of(t, i, n || e);
  const o = s ? bf(t, e) : void 0;
  return e && Os(!1), o;
}
function bf(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Bd);
  const { setup: r } = n;
  if (r) {
    Xt();
    const i = t.setupContext = r.length > 1 ? bu(t) : null, s = $r(t), o = Lr(
      r,
      t,
      0,
      [
        t.props,
        i
      ]
    ), a = el(o);
    if (Yt(), s(), (a || t.sp) && !Wn(t) && Xl(t), a) {
      if (o.then(Xo, Xo), e)
        return o.then((l) => {
          Yo(t, l);
        }).catch((l) => {
          Oi(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Yo(t, o);
  } else
    yu(t);
}
function Yo(t, e, n) {
  oe(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = Al(e)), yu(t);
}
function yu(t, e, n) {
  const r = t.type;
  t.render || (t.render = r.render || Mt);
  {
    const i = $r(t);
    Xt();
    try {
      qd(t);
    } finally {
      Yt(), i();
    }
  }
}
const _f = {
  get(t, e) {
    return qe(t, "get", ""), t[e];
  }
};
function bu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, _f),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function $i(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(Al(El(t.exposed)), {
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
function wf(t, e = !0) {
  return oe(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function xf(t) {
  return oe(t) && "__vccOpts" in t;
}
const L = (t, e) => /* @__PURE__ */ cd(t, e, wr);
function yt(t, e, n) {
  try {
    ci(-1);
    const r = arguments.length;
    return r === 2 ? be(e) && !Q(e) ? _r(e) ? q(t, null, [e]) : q(t, e) : q(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && _r(n) && (n = [n]), q(t, e, n));
  } finally {
    ci(1);
  }
}
function Sf(t, e, n, r) {
  const i = n[r];
  if (i && Cf(i, t))
    return i;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = r, n[r] = s;
}
function Cf(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let r = 0; r < n.length; r++)
    if (Ke(n[r], e[r]))
      return !1;
  return Xn > 0 && Ge && Ge.push(t), !0;
}
const Ef = "3.5.28";
let Rs;
const Go = typeof window < "u" && window.trustedTypes;
if (Go)
  try {
    Rs = /* @__PURE__ */ Go.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const _u = Rs ? (t) => Rs.createHTML(t) : (t) => t, Tf = "http://www.w3.org/2000/svg", Af = "http://www.w3.org/1998/Math/MathML", Wt = typeof document < "u" ? document : null, Jo = Wt && /* @__PURE__ */ Wt.createElement("template"), kf = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const i = e === "svg" ? Wt.createElementNS(Tf, t) : e === "mathml" ? Wt.createElementNS(Af, t) : n ? Wt.createElement(t, { is: n }) : Wt.createElement(t);
    return t === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
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
  insertStaticContent(t, e, n, r, i, s) {
    const o = n ? n.previousSibling : e.lastChild;
    if (i && (i === s || i.nextSibling))
      for (; e.insertBefore(i.cloneNode(!0), n), !(i === s || !(i = i.nextSibling)); )
        ;
    else {
      Jo.innerHTML = _u(
        r === "svg" ? `<svg>${t}</svg>` : r === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Jo.content;
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
      o ? o.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
}, rn = "transition", tr = "animation", xr = /* @__PURE__ */ Symbol("_vtc"), wu = {
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
}, Pf = /* @__PURE__ */ Oe(
  {},
  zl,
  wu
), Of = (t) => (t.displayName = "Transition", t.props = Pf, t), Rf = /* @__PURE__ */ Of(
  (t, { slots: e }) => yt(Sd, If(t), e)
), bn = (t, e = []) => {
  Q(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Zo = (t) => t ? Q(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function If(t) {
  const e = {};
  for (const M in t)
    M in wu || (e[M] = t[M]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: r,
    duration: i,
    enterFromClass: s = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = s,
    appearActiveClass: c = o,
    appearToClass: u = a,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: p = `${n}-leave-to`
  } = t, h = Lf(i), g = h && h[0], y = h && h[1], {
    onBeforeEnter: w,
    onEnter: m,
    onEnterCancelled: x,
    onLeave: b,
    onLeaveCancelled: C,
    onBeforeAppear: T = w,
    onAppear: E = m,
    onAppearCancelled: O = x
  } = e, A = (M, W, H, se) => {
    M._enterCancelled = se, _n(M, W ? u : a), _n(M, W ? c : o), H && H();
  }, D = (M, W) => {
    M._isLeaving = !1, _n(M, d), _n(M, p), _n(M, f), W && W();
  }, G = (M) => (W, H) => {
    const se = M ? E : m, re = () => A(W, M, H);
    bn(se, [W, re]), Qo(() => {
      _n(W, M ? l : s), Vt(W, M ? u : a), Zo(se) || ea(W, r, g, re);
    });
  };
  return Oe(e, {
    onBeforeEnter(M) {
      bn(w, [M]), Vt(M, s), Vt(M, o);
    },
    onBeforeAppear(M) {
      bn(T, [M]), Vt(M, l), Vt(M, c);
    },
    onEnter: G(!1),
    onAppear: G(!0),
    onLeave(M, W) {
      M._isLeaving = !0;
      const H = () => D(M, W);
      Vt(M, d), M._enterCancelled ? (Vt(M, f), ra(M)) : (ra(M), Vt(M, f)), Qo(() => {
        M._isLeaving && (_n(M, d), Vt(M, p), Zo(b) || ea(M, r, y, H));
      }), bn(b, [M, H]);
    },
    onEnterCancelled(M) {
      A(M, !1, void 0, !0), bn(x, [M]);
    },
    onAppearCancelled(M) {
      A(M, !0, void 0, !0), bn(O, [M]);
    },
    onLeaveCancelled(M) {
      D(M), bn(C, [M]);
    }
  });
}
function Lf(t) {
  if (t == null)
    return null;
  if (be(t))
    return [rs(t.enter), rs(t.leave)];
  {
    const e = rs(t);
    return [e, e];
  }
}
function rs(t) {
  return ys(t);
}
function Vt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[xr] || (t[xr] = /* @__PURE__ */ new Set())).add(e);
}
function _n(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const n = t[xr];
  n && (n.delete(e), n.size || (t[xr] = void 0));
}
function Qo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Mf = 0;
function ea(t, e, n, r) {
  const i = t._endId = ++Mf, s = () => {
    i === t._endId && r();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Df(t, e);
  if (!o)
    return r();
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
function Df(t, e) {
  const n = window.getComputedStyle(t), r = (h) => (n[h] || "").split(", "), i = r(`${rn}Delay`), s = r(`${rn}Duration`), o = ta(i, s), a = r(`${tr}Delay`), l = r(`${tr}Duration`), c = ta(a, l);
  let u = null, d = 0, f = 0;
  e === rn ? o > 0 && (u = rn, d = o, f = s.length) : e === tr ? c > 0 && (u = tr, d = c, f = l.length) : (d = Math.max(o, c), u = d > 0 ? o > c ? rn : tr : null, f = u ? u === rn ? s.length : l.length : 0);
  const p = u === rn && /\b(?:transform|all)(?:,|$)/.test(
    r(`${rn}Property`).toString()
  );
  return {
    type: u,
    timeout: d,
    propCount: f,
    hasTransform: p
  };
}
function ta(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => na(n) + na(t[r])));
}
function na(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function ra(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function $f(t, e, n) {
  const r = t[xr];
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const fi = /* @__PURE__ */ Symbol("_vod"), xu = /* @__PURE__ */ Symbol("_vsh"), Bf = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[fi] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : nr(t, e);
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
  t.style.display = e ? t[fi] : "none", t[xu] = !e;
}
const Ff = /* @__PURE__ */ Symbol(""), Nf = /(?:^|;)\s*display\s*:/;
function Hf(t, e, n) {
  const r = t.style, i = ke(n);
  let s = !1;
  if (n && !i) {
    if (e)
      if (ke(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && ei(r, a, "");
        }
      else
        for (const o in e)
          n[o] == null && ei(r, o, "");
    for (const o in n)
      o === "display" && (s = !0), ei(r, o, n[o]);
  } else if (i) {
    if (e !== n) {
      const o = r[Ff];
      o && (n += ";" + o), r.cssText = n, s = Nf.test(n);
    }
  } else e && t.removeAttribute("style");
  fi in t && (t[fi] = s ? r.display : "", t[xu] && (r.display = "none"));
}
const ia = /\s*!important$/;
function ei(t, e, n) {
  if (Q(n))
    n.forEach((r) => ei(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = qf(t, e);
    ia.test(n) ? t.setProperty(
      et(r),
      n.replace(ia, ""),
      "important"
    ) : t[r] = n;
  }
}
const sa = ["Webkit", "Moz", "ms"], is = {};
function qf(t, e) {
  const n = is[e];
  if (n)
    return n;
  let r = De(e);
  if (r !== "filter" && r in t)
    return is[e] = r;
  r = xi(r);
  for (let i = 0; i < sa.length; i++) {
    const s = sa[i] + r;
    if (s in t)
      return is[e] = s;
  }
  return e;
}
const oa = "http://www.w3.org/1999/xlink";
function aa(t, e, n, r, i, s = Bc(e)) {
  r && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(oa, e.slice(6, e.length)) : t.setAttributeNS(oa, e, n) : n == null || s && !rl(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : bt(n) ? String(n) : n
  );
}
function la(t, e, n, r, i) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? _u(n) : n);
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
  o && t.removeAttribute(i || e);
}
function zf(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function Vf(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
const ua = /* @__PURE__ */ Symbol("_vei");
function Wf(t, e, n, r, i = null) {
  const s = t[ua] || (t[ua] = {}), o = s[e];
  if (r && o)
    o.value = r;
  else {
    const [a, l] = jf(e);
    if (r) {
      const c = s[e] = Xf(
        r,
        i
      );
      zf(t, a, c, l);
    } else o && (Vf(t, a, o, l), s[e] = void 0);
  }
}
const ca = /(?:Once|Passive|Capture)$/;
function jf(t) {
  let e;
  if (ca.test(t)) {
    e = {};
    let r;
    for (; r = t.match(ca); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : et(t.slice(2)), e];
}
let ss = 0;
const Uf = /* @__PURE__ */ Promise.resolve(), Kf = () => ss || (Uf.then(() => ss = 0), ss = Date.now());
function Xf(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    wt(
      Yf(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = Kf(), n;
}
function Yf(t, e) {
  if (Q(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (r) => (i) => !i._stopped && r && r(i)
    );
  } else
    return e;
}
const da = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, Gf = (t, e, n, r, i, s) => {
  const o = i === "svg";
  e === "class" ? $f(t, r, o) : e === "style" ? Hf(t, n, r) : yi(e) ? Ws(e) || Wf(t, e, n, r, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : Jf(t, e, r, o)) ? (la(t, e, r), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && aa(t, e, r, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !ke(r)) ? la(t, De(e), r, s, e) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), aa(t, e, r, o));
};
function Jf(t, e, n, r) {
  if (r)
    return !!(e === "innerHTML" || e === "textContent" || e in t && da(e) && oe(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const i = t.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return da(e) && ke(n) ? !1 : e in t;
}
const fa = {};
// @__NO_SIDE_EFFECTS__
function Zf(t, e, n) {
  let r = /* @__PURE__ */ U(t, e);
  bi(r) && (r = Oe({}, r, e));
  class i extends ro {
    constructor(o) {
      super(r, o, n);
    }
  }
  return i.def = r, i;
}
const Qf = typeof HTMLElement < "u" ? HTMLElement : class {
};
class ro extends Qf {
  constructor(e, n = {}, r = ha) {
    super(), this._def = e, this._props = n, this._createApp = r, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && r !== ha ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
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
      if (e instanceof ro) {
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
      const { props: s, styles: o } = r;
      let a;
      if (s && !Q(s))
        for (const l in s) {
          const c = s[l];
          (c === Number || c && c.type === Number) && (l in this._props && (this._props[l] = ys(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[De(l)] = !0);
        }
      this._numberProps = a, this._resolveProps(r), this.shadowRoot && this._applyStyles(o), this._mount(r);
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
    const { props: n } = e, r = Q(n) ? n : Object.keys(n || {});
    for (const i of Object.keys(this))
      i[0] !== "_" && r.includes(i) && this._setProp(i, this[i]);
    for (const i of r.map(De))
      Object.defineProperty(this, i, {
        get() {
          return this._getProp(i);
        },
        set(s) {
          this._setProp(i, s, !0, !this._patching);
        }
      });
  }
  _setAttr(e) {
    if (e.startsWith("data-v-")) return;
    const n = this.hasAttribute(e);
    let r = n ? this.getAttribute(e) : fa;
    const i = De(e);
    n && this._numberProps && this._numberProps[i] && (r = ys(r)), this._setProp(i, r, !1, !0);
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
    if (n !== this._props[e] && (this._dirty = !0, n === fa ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), i && this._instance && this._update(), r)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(et(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(et(e), n + "") : n || this.removeAttribute(et(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), ip(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = q(this._def, Oe(e, this._props));
    return this._instance || (n.ce = (r) => {
      this._instance = r, r.ce = this, r.isCE = !0;
      const i = (s, o) => {
        this.dispatchEvent(
          new CustomEvent(
            s,
            bi(o[0]) ? Oe({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      r.emit = (s, ...o) => {
        i(s, o), et(s) !== s && i(et(s), o);
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
      const s = document.createElement("style");
      r && s.setAttribute("nonce", r), s.textContent = e[i], this.shadowRoot.prepend(s);
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
      const i = e[r], s = i.getAttribute("name") || "default", o = this._slots[s], a = i.parentNode;
      if (o)
        for (const l of o) {
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
      for (let s = 0; s < i.length; s++)
        n.add(i[s]);
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
const ep = ["ctrl", "shift", "alt", "meta"], tp = {
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
  exact: (t, e) => ep.some((n) => t[`${n}Key`] && !e.includes(n))
}, cn = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), r = e.join(".");
  return n[r] || (n[r] = ((i, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = tp[e[o]];
      if (a && a(i, e)) return;
    }
    return t(i, ...s);
  }));
}, np = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Sr = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), r = e.join(".");
  return n[r] || (n[r] = ((i) => {
    if (!("key" in i))
      return;
    const s = et(i.key);
    if (e.some(
      (o) => o === s || np[o] === s
    ))
      return t(i);
  }));
}, rp = /* @__PURE__ */ Oe({ patchProp: Gf }, kf);
let pa;
function Su() {
  return pa || (pa = lf(rp));
}
const ip = ((...t) => {
  Su().render(...t);
}), ha = ((...t) => {
  const e = Su().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const i = op(r);
    if (!i) return;
    const s = e._component;
    !oe(s) && !s.render && !s.template && (s.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const o = n(i, !1, sp(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o;
  }, e;
});
function sp(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function op(t) {
  return ke(t) ? document.querySelector(t) : t;
}
const ap = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const va = (t) => t === "";
const lp = (...t) => t.filter((e, n, r) => !!e && e.trim() !== "" && r.indexOf(e) === n).join(" ").trim();
const ma = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const up = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const cp = (t) => {
  const e = up(t);
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
const dp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = rr.width,
  color: a = rr.stroke,
  ...l
}, { slots: c }) => yt(
  "svg",
  {
    ...rr,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": va(n) || va(r) || n === !0 || r === !0 ? Number(i || s || rr["stroke-width"]) * 24 / Number(o) : i || s || rr["stroke-width"],
    class: lp(
      "lucide",
      l.class,
      ...t ? [`lucide-${ma(cp(t))}-icon`, `lucide-${ma(t)}`] : ["lucide-icon"]
    ),
    ...!c.default && !ap(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => yt(...u)), ...c.default ? [c.default()] : []]
);
const ut = (t, e) => (n, { slots: r, attrs: i }) => yt(
  dp,
  {
    ...i,
    ...n,
    iconNode: e,
    name: t
  },
  r
);
const fp = ut("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Cu = ut("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const pp = ut("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ga = ut("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const hp = ut("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const vp = ut("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const mp = ut("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const gp = ut("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const yp = ut("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const bp = ut("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const _p = ut("volume-2", [
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
const wp = ut("volume-x", [
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
const Eu = ut("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), xp = ["aria-label"], Sp = /* @__PURE__ */ U({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (k(), ce("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      J(e.$slots, "default", {}, void 0, !0)
    ], 8, xp));
  }
}), Cp = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", nt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, i] of e)
    n[r] = i;
  return n;
}, Is = /* @__PURE__ */ nt(Sp, [["styles", [Cp]], ["__scopeId", "data-v-3d3f8eba"]]), Ep = ["disabled", "aria-label"], Tp = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, Ap = /* @__PURE__ */ U({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary", type: String },
    size: { default: "md", type: String },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: { type: String }
  },
  setup(t) {
    const e = t, n = Fd(), r = L(() => !!n.icon && !n.default), i = L(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      r.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (k(), ce("button", {
      type: "button",
      class: dn(i.value),
      disabled: t.disabled,
      "aria-label": t.ariaLabel
    }, [
      s.$slots.icon ? (k(), ce("span", Tp, [
        J(s.$slots, "icon", {}, void 0, !0)
      ])) : pe("", !0),
      J(s.$slots, "default", {}, void 0, !0)
    ], 10, Ep));
  }
}), kp = ".editor-btn[data-v-020699df]{display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-xs);font-family:var(--font-family);font-weight:500;border:none;border-radius:var(--radius-md);cursor:pointer;transition:background-color .15s,color .15s;white-space:nowrap}.editor-btn[data-v-020699df]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-020699df]:disabled{opacity:.5;cursor:default;pointer-events:none}.editor-btn--sm[data-v-020699df]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-xs);height:28px}.editor-btn--md[data-v-020699df]{padding:var(--spacing-xs) var(--spacing-sm);font-size:var(--font-size-sm);height:32px}.editor-btn--sm .editor-btn__icon[data-v-020699df]{display:inline-flex;width:14px;height:14px}.editor-btn--md .editor-btn__icon[data-v-020699df]{display:inline-flex;width:16px;height:16px}.editor-btn--icon-only.editor-btn--sm[data-v-020699df]{width:28px;padding:0}.editor-btn--icon-only.editor-btn--md[data-v-020699df]{width:32px;padding:0}.editor-btn--primary[data-v-020699df]{color:#fff;background-color:var(--color-primary)}.editor-btn--primary[data-v-020699df]:hover:not(:disabled){background-color:var(--color-primary-hover)}.editor-btn--secondary[data-v-020699df],.editor-btn--ghost[data-v-020699df]{color:var(--color-text-secondary);background:none}.editor-btn--secondary[data-v-020699df]{border:1px solid var(--color-border)}.editor-btn--secondary[data-v-020699df]:hover:not(:disabled),.editor-btn--ghost[data-v-020699df]:hover:not(:disabled){background-color:var(--color-surface-hover)}", It = /* @__PURE__ */ nt(Ap, [["styles", [kp]], ["__scopeId", "data-v-020699df"]]), Tu = {
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
}, Pp = {
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
}, ya = { fr: Tu, en: Pp }, Au = /* @__PURE__ */ Symbol("i18n");
function Op(t) {
  const e = L(() => {
    const r = ya[t.value] ?? ya.fr;
    return (i) => r[i] ?? i;
  }), n = {
    t: (r) => e.value(r),
    locale: t
  };
  return Mr(Au, n), n;
}
function Ft() {
  const t = un(Au);
  if (t) return t;
  const e = L(() => "fr");
  return {
    t: (n) => Tu[n] ?? n,
    locale: e
  };
}
function Rp(t, e) {
  const n = t.replace("#", ""), r = parseInt(n.substring(0, 2), 16), i = parseInt(n.substring(2, 4), 16), s = parseInt(n.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function io(t, e, n = "*") {
  if (t === "*") return n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(t) ?? t;
  } catch {
    return t;
  }
}
function ku(t, e, n, r = "*") {
  return t.map((i) => ({
    value: i.id,
    label: i.languages.map((s) => io(s, e, r)).join(", ") + (i.isSource ? ` (${n})` : "")
  }));
}
function Pu(t, e = 250) {
  let n = !1, r = null;
  return (...i) => {
    if (n) {
      r = i;
      return;
    }
    n = !0, t(...i), setTimeout(() => {
      if (n = !1, r !== null) {
        const s = r;
        r = null, t(...s);
      }
    }, e);
  };
}
function pi(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class Qe extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Ip(t) {
  if (t == null || typeof t != "object")
    throw new Qe("document", "must be a non-null object");
  const e = t;
  if (typeof e.title != "string")
    throw new Qe("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Qe("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Qe("document.channels", "must be an array");
  for (let n = 0; n < e.channels.length; n++) {
    const r = e.channels[n], i = `channels[${n}]`;
    if (r == null || typeof r != "object")
      throw new Qe(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Qe(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Qe(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Qe(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Qe(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Qe(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Qe(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Qe(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Qe(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Qe(`${a}.turns`, "must be an array");
    }
  }
}
function Lp(t, e) {
  const { width: n, height: r } = e.canvas, i = t[0], s = i.length / n, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function Ou(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Mp(t, e) {
  if (!Ou(t)) return null;
  let n = 0, r = t.length - 1;
  for (; n <= r; ) {
    const i = n + r >>> 1, s = t[i];
    if (e < s.startTime)
      r = i - 1;
    else if (e > s.endTime)
      n = i + 1;
    else
      return s.id;
  }
  return null;
}
const Dp = { class: "editor-header" }, $p = { class: "header-left" }, Bp = { class: "document-title" }, Fp = { class: "badges" }, Np = ["datetime"], Hp = { class: "header-right" }, qp = /* @__PURE__ */ U({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: r } = Ft(), i = L(() => io(e.language, r.value, n("language.wildcard"))), s = L(() => pi(e.duration)), o = L(() => e.title.replace(/-/g, " "));
    return (a, l) => (k(), ce("header", Dp, [
      le("div", $p, [
        le("h1", Bp, _e(o.value), 1),
        le("div", Fp, [
          q(Is, null, {
            default: R(() => [
              We(_e(i.value), 1)
            ]),
            _: 1
          }),
          q(Is, null, {
            default: R(() => [
              le("time", {
                datetime: `PT${t.duration}S`
              }, _e(s.value), 9, Np)
            ]),
            _: 1
          })
        ])
      ]),
      le("div", Hp, [
        t.isMobile ? (k(), z(It, {
          key: 0,
          variant: "ghost",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: R(() => [
            q(v(bp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : pe("", !0),
        t.isMobile ? (k(), z(It, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, {
          icon: R(() => [
            q(v(ga), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (k(), z(It, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: R(() => [
            q(v(ga), { size: 16 })
          ]),
          default: R(() => [
            We(" " + _e(v(n)("header.export")), 1)
          ]),
          _: 1
        })),
        q(It, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(n)("header.settings")
        }, {
          icon: R(() => [
            q(v(mp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), zp = ".editor-header[data-v-f16781f3]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-f16781f3]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-f16781f3]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-f16781f3]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-f16781f3]{padding:0 var(--spacing-md);height:48px}.badges[data-v-f16781f3]{display:none}.document-title[data-v-f16781f3]{font-size:var(--font-size-base)}}", Vp = /* @__PURE__ */ nt(qp, [["styles", [zp]], ["__scopeId", "data-v-f16781f3"]]);
function ba(t) {
  return typeof t == "string" ? `'${t}'` : new Wp().serialize(t);
}
const Wp = /* @__PURE__ */ (function() {
  class t {
    #e = /* @__PURE__ */ new Map();
    compare(n, r) {
      const i = typeof n, s = typeof r;
      return i === "string" && s === "string" ? n.localeCompare(r) : i === "number" && s === "number" ? n - r : String.prototype.localeCompare.call(this.serialize(n, !0), this.serialize(r, !0));
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
      const i = n.constructor, s = i === Object || i === void 0 ? "" : i.name;
      if (s !== "" && globalThis[s] === i) return this.serializeBuiltInType(s, n);
      if (typeof n.toJSON == "function") {
        const o = n.toJSON();
        return s + (o !== null && typeof o == "object" ? this.$object(o) : `(${this.serialize(o)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(n));
    }
    serializeBuiltInType(n, r) {
      const i = this["$" + n];
      if (i) return i.call(this, r);
      if (typeof r?.entries == "function") return this.serializeObjectEntries(n, r.entries());
      throw new Error(`Cannot serialize ${n}`);
    }
    serializeObjectEntries(n, r) {
      const i = Array.from(r).sort((o, a) => this.compare(o[0], a[0]));
      let s = `${n}{`;
      for (let o = 0; o < i.length; o++) {
        const [a, l] = i[o];
        s += `${this.serialize(a, !0)}:${this.serialize(l)}`, o < i.length - 1 && (s += ",");
      }
      return s + "}";
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
function hi(t, e) {
  return t === e || ba(t) === ba(e);
}
function jp(t, e, n) {
  const r = t.findIndex((a) => hi(a, e)), i = t.findIndex((a) => hi(a, n));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function Ls(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function ct(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, r = Symbol(n);
  return [(o) => {
    const a = un(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (Mr(r, o), o)];
}
function ht() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function Bi(t, e, n) {
  const r = n.originalEvent.target, i = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && r.addEventListener(t, e, { once: !0 }), r.dispatchEvent(i);
}
function Ms(t) {
  return t == null;
}
function so(t) {
  return t ? t.flatMap((e) => e.type === Te ? so(e.children) : [e]) : [];
}
const [oo] = ct("ConfigProvider");
function Up(t, e) {
  var n;
  const r = /* @__PURE__ */ An();
  return Ve(() => {
    r.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ mr(r);
}
function Fi(t, e) {
  return Xs() ? (ll(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function os() {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    t.delete(s);
  };
  return {
    on: (s) => {
      t.add(s);
      const o = () => e(s);
      return Fi(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(t).map((o) => o(...s))),
    clear: () => {
      t.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Kp(t) {
  let e = !1, n;
  const r = al(!0);
  return ((...i) => (e || (n = r.run(() => t(...i)), e = !0), n));
}
const nn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Xp = (t) => typeof t < "u", Yp = Object.prototype.toString, Gp = (t) => Yp.call(t) === "[object Object]", _a = () => {
}, wa = /* @__PURE__ */ Jp();
function Jp() {
  var t, e, n;
  return nn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function Zp(t, e) {
  function n(...r) {
    return new Promise((i, s) => {
      Promise.resolve(t(() => e.apply(this, r), {
        fn: e,
        thisArg: this,
        args: r
      })).then(i).catch(s);
    });
  }
  return n;
}
function Qp(t, e = {}) {
  let n, r, i = _a;
  const s = (l) => {
    clearTimeout(l), i(), i = _a;
  };
  let o;
  return (l) => {
    const c = Fe(t), u = Fe(e.maxWait);
    return n && s(n), c <= 0 || u !== void 0 && u <= 0 ? (r && (s(r), r = void 0), Promise.resolve(l())) : new Promise((d, f) => {
      i = e.rejectOnCancel ? f : d, o = l, u && !r && (r = setTimeout(() => {
        n && s(n), r = void 0, d(o());
      }, u)), n = setTimeout(() => {
        r && s(r), r = void 0, d(l());
      }, c);
    });
  };
}
function as(t) {
  return Array.isArray(t) ? t : [t];
}
function eh(t) {
  return lt();
}
// @__NO_SIDE_EFFECTS__
function th(t) {
  if (!nn) return t;
  let e = 0, n, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), n = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = al(!0), n = r.run(() => t(...s))), Fi(i), n));
}
function Ru(t, e = 1e4) {
  return kl((n, r) => {
    let i = Fe(t), s;
    const o = () => setTimeout(() => {
      i = Fe(t), r();
    }, Fe(e));
    return Fi(() => {
      clearTimeout(s);
    }), {
      get() {
        return n(), i;
      },
      set(a) {
        i = a, r(), clearTimeout(s), s = o();
      }
    };
  });
}
// @__NO_SIDE_EFFECTS__
function ao(t, e = 200, n = {}) {
  return Zp(Qp(e, n), t);
}
function nh(t, e) {
  eh() && Pn(t, e);
}
function rh(t, e, n) {
  return xe(t, e, {
    ...n,
    immediate: !0
  });
}
function ih(t, e, n) {
  return xe(t, e, {
    ...n,
    once: !0
  });
}
const Ni = nn ? window : void 0;
function $t(t) {
  var e;
  const n = Fe(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Iu(...t) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), n = L(() => {
    const r = as(Fe(t[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return rh(() => {
    var r, i;
    return [
      (r = (i = n.value) === null || i === void 0 ? void 0 : i.map((s) => $t(s))) !== null && r !== void 0 ? r : [Ni].filter((s) => s != null),
      as(Fe(n.value ? t[1] : t[0])),
      as(v(n.value ? t[2] : t[1])),
      Fe(n.value ? t[3] : t[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = Gp(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((p) => e(d, f, p, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Lu() {
  const t = /* @__PURE__ */ An(!1), e = lt();
  return e && Ae(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function sh(t) {
  const e = /* @__PURE__ */ Lu();
  return L(() => (e.value, !!t()));
}
function oh(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function ah(...t) {
  let e, n, r = {};
  t.length === 3 ? (e = t[0], n = t[1], r = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], r = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: i = Ni, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = oh(e);
  return Iu(i, s, (u) => {
    u.repeat && Fe(a) || l(u) && n(u);
  }, o);
}
function lh(t) {
  return JSON.parse(JSON.stringify(t));
}
function Cr(t, e, n = {}) {
  const { window: r = Ni, ...i } = n;
  let s;
  const o = /* @__PURE__ */ sh(() => r && "ResizeObserver" in r), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = xe(L(() => {
    const u = Fe(t);
    return Array.isArray(u) ? u.map((d) => $t(d)) : [$t(u)];
  }), (u) => {
    if (a(), o.value && r) {
      s = new ResizeObserver(e);
      for (const d of u) d && s.observe(d, i);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    a(), l();
  };
  return Fi(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function Er(t, e, n, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = lt(), p = n || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const g = (m) => o ? typeof o == "function" ? o(m) : lh(m) : m, y = () => Xp(t[e]) ? g(t[e]) : u, w = (m) => {
    d ? d(m) && p(h, m) : p(h, m);
  };
  if (a) {
    const m = /* @__PURE__ */ I(y());
    let x = !1;
    return xe(() => t[e], (b) => {
      x || (x = !0, m.value = g(b), Ie(() => x = !1));
    }), xe(m, (b) => {
      !x && (b !== t[e] || c) && w(b);
    }, { deep: c }), m;
  } else return L({
    get() {
      return y();
    },
    set(m) {
      w(m);
    }
  });
}
function ls(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function Ds(t, e, n = ".", r) {
  if (!ls(e))
    return Ds(t, {}, n, r);
  const i = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (r && r(i, s, o, n) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : ls(o) && ls(i[s]) ? i[s] = Ds(
      o,
      i[s],
      (n ? `${n}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function uh(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, r) => Ds(n, r, "", t), {})
  );
}
const ch = uh(), dh = /* @__PURE__ */ th(() => {
  const t = /* @__PURE__ */ I(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ I(), n = L(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), r = oo({ scrollBody: /* @__PURE__ */ I(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", wa && i?.(), e.value = void 0;
  };
  return xe(n, (o, a) => {
    if (!nn) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? ch({
      padding: r.scrollBody.value.padding === !0 ? l : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? l : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), wa && (i = Iu(document, "touchmove", (d) => fh(d), { passive: !1 })), Ie(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Mu(t) {
  const e = Math.random().toString(36).substring(2, 7), n = dh();
  n.value.set(e, t ?? !1);
  const r = L({
    get: () => n.value.get(e) ?? !1,
    set: (i) => n.value.set(e, i)
  });
  return nh(() => {
    n.value.delete(e);
  }), r;
}
function Du(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : Du(n);
  }
}
function fh(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && Du(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function lo(t) {
  const e = oo({ dir: /* @__PURE__ */ I("ltr") });
  return L(() => t?.value || e.dir?.value || "ltr");
}
function Hi(t) {
  const e = lt(), n = e?.type.emits, r = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((i) => {
    r[Gr(De(i))] = (...s) => t(i, ...s);
  }), r;
}
let us = 0;
function ph() {
  Ve((t) => {
    if (!nn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? xa()), document.body.insertAdjacentElement("beforeend", e[1] ?? xa()), us++, t(() => {
      us === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), us--;
    });
  });
}
function xa() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function $u(t) {
  return L(() => Fe(t) ? !!$t(t)?.closest("form") : !0);
}
function ge() {
  const t = lt(), e = /* @__PURE__ */ I(), n = L(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : $t(e)), r = Object.assign({}, t.exposed), i = {};
  for (const o in t.props) Object.defineProperty(i, o, {
    enumerable: !0,
    configurable: !0,
    get: () => t.props[o]
  });
  if (Object.keys(r).length > 0) for (const o in r) Object.defineProperty(i, o, {
    enumerable: !0,
    configurable: !0,
    get: () => r[o]
  });
  Object.defineProperty(i, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => t.vnode.el
  }), t.exposed = i;
  function s(o) {
    if (e.value = o, !!o && (Object.defineProperty(i, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => o instanceof Element ? o : o.$el
    }), !(o instanceof Element) && !Object.hasOwn(o, "$el"))) {
      const a = o.$.exposed, l = Object.assign({}, i);
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
function uo(t) {
  const e = lt(), n = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = /* @__PURE__ */ Jr(t);
  return L(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[De(o)] = s[o];
    }), Object.keys({
      ...n,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function hh(t, e) {
  const n = uo(t), r = e ? Hi(e) : {};
  return L(() => ({
    ...n.value,
    ...r
  }));
}
var vh = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Bn = /* @__PURE__ */ new WeakMap(), Wr = /* @__PURE__ */ new WeakMap(), jr = {}, cs = 0, Bu = function(t) {
  return t && (t.host || Bu(t.parentNode));
}, mh = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var r = Bu(n);
    return r && t.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, gh = function(t, e, n, r) {
  var i = mh(e, Array.isArray(t) ? t : [t]);
  jr[n] || (jr[n] = /* @__PURE__ */ new WeakMap());
  var s = jr[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var p = f.getAttribute(r), h = p !== null && p !== "false", g = (Bn.get(f) || 0) + 1, y = (s.get(f) || 0) + 1;
          Bn.set(f, g), s.set(f, y), o.push(f), g === 1 && h && Wr.set(f, !0), y === 1 && f.setAttribute(n, "true"), h || f.setAttribute(r, "true");
        } catch (w) {
          console.error("aria-hidden: cannot operate on ", f, w);
        }
    });
  };
  return u(e), a.clear(), cs++, function() {
    o.forEach(function(d) {
      var f = Bn.get(d) - 1, p = s.get(d) - 1;
      Bn.set(d, f), s.set(d, p), f || (Wr.has(d) || d.removeAttribute(r), Wr.delete(d)), p || d.removeAttribute(n);
    }), cs--, cs || (Bn = /* @__PURE__ */ new WeakMap(), Bn = /* @__PURE__ */ new WeakMap(), Wr = /* @__PURE__ */ new WeakMap(), jr = {});
  };
}, yh = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(t) ? t : [t]), i = vh(t);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), gh(r, i, n, "aria-hidden")) : function() {
    return null;
  };
};
function Fu(t) {
  let e;
  xe(() => $t(t), (n) => {
    n ? e = yh(n) : e && e();
  }), at(() => {
    e && e();
  });
}
function Tr(t, e = "reka") {
  return `${e}-${Kl?.()}`;
}
function bh() {
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
function _h(t) {
  const e = /* @__PURE__ */ I(), n = L(() => e.value?.width ?? 0), r = L(() => e.value?.height ?? 0);
  return Ae(() => {
    const i = $t(t);
    if (i) {
      e.value = {
        width: i.offsetWidth,
        height: i.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
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
      return s.observe(i, { box: "border-box" }), () => s.unobserve(i);
    } else e.value = void 0;
  }), {
    width: n,
    height: r
  };
}
function co(t, e) {
  const n = /* @__PURE__ */ I(t);
  function r(s) {
    return e[n.value][s] ?? n.value;
  }
  return {
    state: n,
    dispatch: (s) => {
      n.value = r(s);
    }
  };
}
function fo(t) {
  const e = Ru("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = ht(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = xh(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function wh(t, e) {
  return t.map((n, r) => t[(e + r) % t.length]);
}
function xh(t, e, n) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = wh(t, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== n));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== n ? l : void 0;
}
function Sh(t, e) {
  const n = /* @__PURE__ */ I({}), r = /* @__PURE__ */ I("none"), i = /* @__PURE__ */ I(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Ni, { state: l, dispatch: c } = co(s, {
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
    if (nn) {
      const w = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(w);
    }
  };
  xe(t, async (y, w) => {
    const m = w !== y;
    if (await Ie(), m) {
      const x = r.value, b = Ur(e.value);
      y ? (c("MOUNT"), u("enter"), b === "none" && u("after-enter")) : b === "none" || b === "undefined" || n.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : w && x !== b ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const w = Ur(e.value), m = w.includes(CSS.escape(y.animationName)), x = l.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && m && (u(`after-${x}`), c("ANIMATION_END"), !i.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    y.target === e.value && w === "none" && c("ANIMATION_END");
  }, f = (y) => {
    y.target === e.value && (r.value = Ur(e.value));
  }, p = xe(e, (y, w) => {
    y ? (n.value = getComputedStyle(y), y.addEventListener("animationstart", f), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), w?.removeEventListener("animationstart", f), w?.removeEventListener("animationcancel", d), w?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = xe(l, () => {
    const y = Ur(e.value);
    r.value = l.value === "mounted" ? y : "none";
  });
  return at(() => {
    p(), h();
  }), { isPresent: L(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Ur(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var Rn = /* @__PURE__ */ U({
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
    const { present: r, forceMount: i } = /* @__PURE__ */ en(t), s = /* @__PURE__ */ I(), { isPresent: o } = Sh(r, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = so(a || []);
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
    return () => i.value || r.value || o.value ? yt(e.default({ present: o.value })[0], { ref: (c) => {
      const u = $t(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const $s = /* @__PURE__ */ U({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const r = so(n.default()), i = r.findIndex((l) => l.type !== $e);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? de(e, s.props) : e, a = Jt({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), Ch = [
  "area",
  "img",
  "input"
], Se = /* @__PURE__ */ U({
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
    return typeof r == "string" && Ch.includes(r) ? () => yt(r, e) : r !== "template" ? () => yt(t.as, e, { default: n.default }) : () => yt($s, e, { default: n.default });
  }
});
function Ar() {
  const t = /* @__PURE__ */ I(), e = L(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : $t(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [hn, Eh] = ct("DialogRoot");
var Th = /* @__PURE__ */ U({
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
    const n = t, i = /* @__PURE__ */ Er(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), s = /* @__PURE__ */ I(), o = /* @__PURE__ */ I(), { modal: a } = /* @__PURE__ */ en(n);
    return Eh({
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
      triggerElement: s,
      contentElement: o
    }), (l, c) => J(l.$slots, "default", {
      open: v(i),
      close: () => i.value = !1
    });
  }
}), Nu = Th, Ah = /* @__PURE__ */ U({
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
    const n = hn();
    return (r, i) => (k(), z(v(Se), de(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => v(n).onOpenChange(!1))
    }), {
      default: R(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), kh = Ah;
const Ph = "dismissableLayer.pointerDownOutside", Oh = "dismissableLayer.focusOutside";
function Hu(t, e) {
  const n = e.closest("[data-dismissable-layer]"), r = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), i = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (r === n || i.indexOf(r) < i.indexOf(n)));
}
function Rh(t, e, n = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = /* @__PURE__ */ I(!1), s = /* @__PURE__ */ I(() => {
  });
  return Ve((o) => {
    if (!nn || !Fe(n)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Hu(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            Bi(Ph, t, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (r.removeEventListener("click", s.value), s.value = f, r.addEventListener("click", s.value, { once: !0 })) : f();
        } else r.removeEventListener("click", s.value);
        i.value = !1;
      }
    }, l = window.setTimeout(() => {
      r.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(l), r.removeEventListener("pointerdown", a), r.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    Fe(n) && (i.value = !0);
  } };
}
function Ih(t, e, n = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = /* @__PURE__ */ I(!1);
  return Ve((s) => {
    if (!nn || !Fe(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Ie(), await Ie();
      const l = a.target;
      !e.value || !l || Hu(e.value, l) || a.target && !i.value && Bi(Oh, t, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Fe(n) && (i.value = !0);
    },
    onBlurCapture: () => {
      Fe(n) && (i.value = !1);
    }
  };
}
const pt = /* @__PURE__ */ Ir({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Lh = /* @__PURE__ */ U({
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
    const n = t, r = e, { forwardRef: i, currentElement: s } = ge(), o = L(() => s.value?.ownerDocument ?? globalThis.document), a = L(() => pt.layersRoot), l = L(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = L(() => pt.layersWithOutsidePointerEventsDisabled.size > 0), u = L(() => {
      const p = Array.from(a.value), [h] = [...pt.layersWithOutsidePointerEventsDisabled].slice(-1), g = p.indexOf(h);
      return l.value >= g;
    }), d = Rh(async (p) => {
      const h = [...pt.branches].some((g) => g?.contains(p.target));
      !u.value || h || (r("pointerDownOutside", p), r("interactOutside", p), await Ie(), p.defaultPrevented || r("dismiss"));
    }, s), f = Ih((p) => {
      [...pt.branches].some((g) => g?.contains(p.target)) || (r("focusOutside", p), r("interactOutside", p), p.defaultPrevented || r("dismiss"));
    }, s);
    return ah("Escape", (p) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", p), p.defaultPrevented || r("dismiss"));
    }), Ve((p) => {
      s.value && (n.disableOutsidePointerEvents && (pt.layersWithOutsidePointerEventsDisabled.size === 0 && (pt.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), pt.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), p(() => {
        n.disableOutsidePointerEvents && pt.layersWithOutsidePointerEventsDisabled.size === 1 && !Ms(pt.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = pt.originalBodyPointerEvents);
      }));
    }), Ve((p) => {
      p(() => {
        s.value && (a.value.delete(s.value), pt.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (p, h) => (k(), z(v(Se), {
      ref: v(i),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: tt({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(f).onFocusCapture,
      onBlurCapture: v(f).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: R(() => [J(p.$slots, "default")]),
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
}), qu = Lh;
const Mh = /* @__PURE__ */ Kp(() => /* @__PURE__ */ I([]));
function Dh() {
  const t = Mh();
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
  const n = [...t], r = n.indexOf(e);
  return r !== -1 && n.splice(r, 1), n;
}
const ds = "focusScope.autoFocusOnMount", fs = "focusScope.autoFocusOnUnmount", Ca = {
  bubbles: !1,
  cancelable: !0
};
function $h(t, { select: e = !1 } = {}) {
  const n = ht();
  for (const r of t)
    if (sn(r, { select: e }), ht() !== n) return !0;
}
function Bh(t) {
  const e = zu(t), n = Ea(e, t), r = Ea(e.reverse(), t);
  return [n, r];
}
function zu(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function Ea(t, e) {
  for (const n of t) if (!Fh(n, { upTo: e })) return n;
}
function Fh(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function Nh(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function sn(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = ht();
    t.focus({ preventScroll: !0 }), t !== n && Nh(t) && e && t.select();
  }
}
var Hh = /* @__PURE__ */ U({
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
    const n = t, r = e, { currentRef: i, currentElement: s } = ge(), o = /* @__PURE__ */ I(null), a = Dh(), l = /* @__PURE__ */ Ir({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    Ve((u) => {
      if (!nn) return;
      const d = s.value;
      if (!n.trapped) return;
      function f(y) {
        if (l.paused || !d) return;
        const w = y.target;
        d.contains(w) ? o.value = w : sn(o.value, { select: !0 });
      }
      function p(y) {
        if (l.paused || !d) return;
        const w = y.relatedTarget;
        w !== null && (d.contains(w) || sn(o.value, { select: !0 }));
      }
      function h(y) {
        d.contains(o.value) || sn(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const g = new MutationObserver(h);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), g.disconnect();
      });
    }), Ve(async (u) => {
      const d = s.value;
      if (await Ie(), !d) return;
      a.add(l);
      const f = ht();
      if (!d.contains(f)) {
        const h = new CustomEvent(ds, Ca);
        d.addEventListener(ds, (g) => r("mountAutoFocus", g)), d.dispatchEvent(h), h.defaultPrevented || ($h(zu(d), { select: !0 }), ht() === f && sn(d));
      }
      u(() => {
        d.removeEventListener(ds, (y) => r("mountAutoFocus", y));
        const h = new CustomEvent(fs, Ca), g = (y) => {
          r("unmountAutoFocus", y);
        };
        d.addEventListener(fs, g), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || sn(f ?? document.body, { select: !0 }), d.removeEventListener(fs, g), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = ht();
      if (d && f) {
        const p = u.currentTarget, [h, g] = Bh(p);
        h && g ? !u.shiftKey && f === g ? (u.preventDefault(), n.loop && sn(h, { select: !0 })) : u.shiftKey && f === h && (u.preventDefault(), n.loop && sn(g, { select: !0 })) : f === p && u.preventDefault();
      }
    }
    return (u, d) => (k(), z(v(Se), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: R(() => [J(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Vu = Hh;
function qh(t) {
  return t ? "open" : "closed";
}
function Ta(t) {
  const e = ht();
  for (const n of t)
    if (n === e || (n.focus(), ht() !== e)) return;
}
var zh = /* @__PURE__ */ U({
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
    const n = t, r = e, i = hn(), { forwardRef: s, currentElement: o } = ge();
    return i.titleId ||= Tr(void 0, "reka-dialog-title"), i.descriptionId ||= Tr(void 0, "reka-dialog-description"), Ae(() => {
      i.contentElement = o, ht() !== document.body && (i.triggerElement.value = ht());
    }), (a, l) => (k(), z(v(Vu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: R(() => [q(v(qu), de({
        id: v(i).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(i).descriptionId,
        "aria-labelledby": v(i).titleId,
        "data-state": v(qh)(v(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => v(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: R(() => [J(a.$slots, "default")]),
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
}), Wu = zh, Vh = /* @__PURE__ */ U({
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
    const n = t, r = e, i = hn(), s = Hi(r), { forwardRef: o, currentElement: a } = ge();
    return Fu(a), (l, c) => (k(), z(Wu, de({
      ...n,
      ...v(s)
    }, {
      ref: v(o),
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
      default: R(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Wh = Vh, jh = /* @__PURE__ */ U({
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
    const n = t, i = Hi(e);
    ge();
    const s = hn(), o = /* @__PURE__ */ I(!1), a = /* @__PURE__ */ I(!1);
    return (l, c) => (k(), z(Wu, de({
      ...n,
      ...v(i)
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
      default: R(() => [J(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Uh = jh, Kh = /* @__PURE__ */ U({
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
    const n = t, r = e, i = hn(), s = Hi(r), { forwardRef: o } = ge();
    return (a, l) => (k(), z(v(Rn), { present: a.forceMount || v(i).open.value }, {
      default: R(() => [v(i).modal.value ? (k(), z(Wh, de({
        key: 0,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: R(() => [J(a.$slots, "default")]),
        _: 3
      }, 16)) : (k(), z(Uh, de({
        key: 1,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: R(() => [J(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), ju = Kh, Xh = /* @__PURE__ */ U({
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
    const e = hn();
    return Mu(!0), ge(), (n, r) => (k(), z(v(Se), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: R(() => [J(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Yh = Xh, Gh = /* @__PURE__ */ U({
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
    const e = hn(), { forwardRef: n } = ge();
    return (r, i) => v(e)?.modal.value ? (k(), z(v(Rn), {
      key: 0,
      present: r.forceMount || v(e).open.value
    }, {
      default: R(() => [q(Yh, de(r.$attrs, {
        ref: v(n),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: R(() => [J(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : pe("v-if", !0);
  }
}), Uu = Gh, Jh = /* @__PURE__ */ U({
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
    const e = /* @__PURE__ */ Lu();
    return (n, r) => v(e) || n.forceMount ? (k(), z(ql, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [J(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : pe("v-if", !0);
  }
}), Ku = Jh, Zh = /* @__PURE__ */ U({
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
    return (n, r) => (k(), z(v(Ku), Us(Di(e)), {
      default: R(() => [J(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Xu = Zh, Qh = /* @__PURE__ */ U({
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
    const e = t, n = hn();
    return ge(), (r, i) => (k(), z(v(Se), de(e, { id: v(n).titleId }), {
      default: R(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Yu = Qh;
const Aa = "data-reka-collection-item";
function vn(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, r = `${e}CollectionProvider`;
  let i;
  n ? (i = {
    collectionRef: /* @__PURE__ */ I(),
    itemMap: /* @__PURE__ */ I(/* @__PURE__ */ new Map())
  }, Mr(r, i)) : i = un(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Aa}]`)), h = Array.from(i.itemMap.value.values()).sort((g, y) => f.indexOf(g.ref) - f.indexOf(y.ref));
    return u ? h : h.filter((g) => g.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ U({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Ar();
      return xe(h, () => {
        i.collectionRef.value = h.value;
      }), () => yt($s, {
        ref: p,
        ...f
      }, d);
    }
  }), a = /* @__PURE__ */ U({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: h } = Ar();
      return Ve((g) => {
        if (h.value) {
          const y = El(h.value);
          i.itemMap.value.set(y, {
            ref: h.value,
            value: u.value
          }), g(() => i.itemMap.value.delete(y));
        }
      }), () => yt($s, {
        ...f,
        [Aa]: "",
        ref: p
      }, d);
    }
  }), l = L(() => Array.from(i.itemMap.value.values())), c = L(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const ev = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function tv(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function nv(t, e, n) {
  const r = tv(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return ev[r];
}
var rv = /* @__PURE__ */ U({
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
    return (e, n) => (k(), z(v(Se), {
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
      default: R(() => [J(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Gu = rv, iv = /* @__PURE__ */ U({
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
    const e = t, { primitiveElement: n, currentElement: r } = Ar(), i = L(() => e.checked ?? e.value);
    return xe(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (k(), z(Gu, de({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), ka = iv, sv = /* @__PURE__ */ U({
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
    const e = t, n = L(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = L(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (i, s) => (k(), ce(Te, null, [pe(" We render single input if it's required "), n.value ? (k(), z(ka, de({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (k(!0), ce(Te, { key: 1 }, On(r.value, (o) => (k(), z(ka, de({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), ov = sv;
const [Ju, av] = ct("PopperRoot");
var lv = /* @__PURE__ */ U({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ I();
    return av({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, r) => J(n.$slots, "default");
  }
}), uv = lv, cv = /* @__PURE__ */ U({
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
    const e = t, { forwardRef: n, currentElement: r } = ge(), i = Ju();
    return Dl(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (k(), z(v(Se), {
      ref: v(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: R(() => [J(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), dv = cv;
function fv(t) {
  return t !== null;
}
function pv(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [c, u] = Bs(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (i.arrow?.x ?? 0) + a / 2, p = (i.arrow?.y ?? 0) + l / 2;
      let h = "", g = "";
      return c === "bottom" ? (h = o ? d : `${f}px`, g = `${-l}px`) : c === "top" ? (h = o ? d : `${f}px`, g = `${r.floating.height + l}px`) : c === "right" ? (h = `${-l}px`, g = o ? d : `${p}px`) : c === "left" && (h = `${r.floating.width + l}px`, g = o ? d : `${p}px`), { data: {
        x: h,
        y: g
      } };
    }
  };
}
function Bs(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const hv = ["top", "right", "bottom", "left"], fn = Math.min, it = Math.max, vi = Math.round, Kr = Math.floor, Dt = (t) => ({
  x: t,
  y: t
}), vv = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, mv = {
  start: "end",
  end: "start"
};
function Fs(t, e, n) {
  return it(t, fn(e, n));
}
function Zt(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function Qt(t) {
  return t.split("-")[0];
}
function Gn(t) {
  return t.split("-")[1];
}
function po(t) {
  return t === "x" ? "y" : "x";
}
function ho(t) {
  return t === "y" ? "height" : "width";
}
const gv = /* @__PURE__ */ new Set(["top", "bottom"]);
function Lt(t) {
  return gv.has(Qt(t)) ? "y" : "x";
}
function vo(t) {
  return po(Lt(t));
}
function yv(t, e, n) {
  n === void 0 && (n = !1);
  const r = Gn(t), i = vo(t), s = ho(i);
  let o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = mi(o)), [o, mi(o)];
}
function bv(t) {
  const e = mi(t);
  return [Ns(t), e, Ns(e)];
}
function Ns(t) {
  return t.replace(/start|end/g, (e) => mv[e]);
}
const Pa = ["left", "right"], Oa = ["right", "left"], _v = ["top", "bottom"], wv = ["bottom", "top"];
function xv(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Oa : Pa : e ? Pa : Oa;
    case "left":
    case "right":
      return e ? _v : wv;
    default:
      return [];
  }
}
function Sv(t, e, n, r) {
  const i = Gn(t);
  let s = xv(Qt(t), n === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(Ns)))), s;
}
function mi(t) {
  return t.replace(/left|right|bottom|top/g, (e) => vv[e]);
}
function Cv(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Zu(t) {
  return typeof t != "number" ? Cv(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function gi(t) {
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
function Ra(t, e, n) {
  let {
    reference: r,
    floating: i
  } = t;
  const s = Lt(e), o = vo(e), a = ho(o), l = Qt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
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
      p[o] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      p[o] += f * (n && c ? -1 : 1);
      break;
  }
  return p;
}
async function Ev(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
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
  } = Zt(e, t), h = Zu(p), y = a[f ? d === "floating" ? "reference" : "floating" : d], w = gi(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(y))) == null || n ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), m = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), b = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = gi(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: m,
    offsetParent: x,
    strategy: l
  }) : m);
  return {
    top: (w.top - C.top + h.top) / b.y,
    bottom: (C.bottom - w.bottom + h.bottom) / b.y,
    left: (w.left - C.left + h.left) / b.x,
    right: (C.right - w.right + h.right) / b.x
  };
}
const Tv = async (t, e, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: i
  }), {
    x: u,
    y: d
  } = Ra(c, r, l), f = r, p = {}, h = 0;
  for (let y = 0; y < a.length; y++) {
    var g;
    const {
      name: w,
      fn: m
    } = a[y], {
      x,
      y: b,
      data: C,
      reset: T
    } = await m({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: p,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (g = o.detectOverflow) != null ? g : Ev
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    u = x ?? u, d = b ?? d, p = {
      ...p,
      [w]: {
        ...p[w],
        ...C
      }
    }, T && h <= 50 && (h++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (c = T.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: i
    }) : T.rects), {
      x: u,
      y: d
    } = Ra(c, f, l)), y = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: p
  };
}, Av = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: r,
      placement: i,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = Zt(t, e) || {};
    if (c == null)
      return {};
    const d = Zu(u), f = {
      x: n,
      y: r
    }, p = vo(i), h = ho(p), g = await o.getDimensions(c), y = p === "y", w = y ? "top" : "left", m = y ? "bottom" : "right", x = y ? "clientHeight" : "clientWidth", b = s.reference[h] + s.reference[p] - f[p] - s.floating[h], C = f[p] - s.reference[p], T = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let E = T ? T[x] : 0;
    (!E || !await (o.isElement == null ? void 0 : o.isElement(T))) && (E = a.floating[x] || s.floating[h]);
    const O = b / 2 - C / 2, A = E / 2 - g[h] / 2 - 1, D = fn(d[w], A), G = fn(d[m], A), M = D, W = E - g[h] - G, H = E / 2 - g[h] / 2 + O, se = Fs(M, H, W), re = !l.arrow && Gn(i) != null && H !== se && s.reference[h] / 2 - (H < M ? D : G) - g[h] / 2 < 0, ie = re ? H < M ? H - M : H - W : 0;
    return {
      [p]: f[p] + ie,
      data: {
        [p]: se,
        centerOffset: H - se - ie,
        ...re && {
          alignmentOffset: ie
        }
      },
      reset: re
    };
  }
}), kv = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, r;
      const {
        placement: i,
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
        flipAlignment: g = !0,
        ...y
      } = Zt(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const w = Qt(i), m = Lt(a), x = Qt(a) === a, b = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), C = f || (x || !g ? [mi(a)] : bv(a)), T = h !== "none";
      !f && T && C.push(...Sv(a, g, h, b));
      const E = [a, ...C], O = await l.detectOverflow(e, y), A = [];
      let D = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && A.push(O[w]), d) {
        const H = yv(i, o, b);
        A.push(O[H[0]], O[H[1]]);
      }
      if (D = [...D, {
        placement: i,
        overflows: A
      }], !A.every((H) => H <= 0)) {
        var G, M;
        const H = (((G = s.flip) == null ? void 0 : G.index) || 0) + 1, se = E[H];
        if (se && (!(d === "alignment" ? m !== Lt(se) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        D.every((te) => Lt(te.placement) === m ? te.overflows[0] > 0 : !0)))
          return {
            data: {
              index: H,
              overflows: D
            },
            reset: {
              placement: se
            }
          };
        let re = (M = D.filter((ie) => ie.overflows[0] <= 0).sort((ie, te) => ie.overflows[1] - te.overflows[1])[0]) == null ? void 0 : M.placement;
        if (!re)
          switch (p) {
            case "bestFit": {
              var W;
              const ie = (W = D.filter((te) => {
                if (T) {
                  const Pe = Lt(te.placement);
                  return Pe === m || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Pe === "y";
                }
                return !0;
              }).map((te) => [te.placement, te.overflows.filter((Pe) => Pe > 0).reduce((Pe, je) => Pe + je, 0)]).sort((te, Pe) => te[1] - Pe[1])[0]) == null ? void 0 : W[0];
              ie && (re = ie);
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
function Ia(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function La(t) {
  return hv.some((e) => t[e] >= 0);
}
const Pv = function(t) {
  return t === void 0 && (t = {}), {
    name: "hide",
    options: t,
    async fn(e) {
      const {
        rects: n,
        platform: r
      } = e, {
        strategy: i = "referenceHidden",
        ...s
      } = Zt(t, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Ia(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: La(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Ia(o, n.floating);
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
}, Qu = /* @__PURE__ */ new Set(["left", "top"]);
async function Ov(t, e) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = t, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Qt(n), a = Gn(n), l = Lt(n) === "y", c = Qu.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Zt(e, t);
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
const Rv = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, r;
      const {
        x: i,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await Ov(e, t);
      return o === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, Iv = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: r,
        placement: i,
        platform: s
      } = e, {
        mainAxis: o = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (w) => {
            let {
              x: m,
              y: x
            } = w;
            return {
              x: m,
              y: x
            };
          }
        },
        ...c
      } = Zt(t, e), u = {
        x: n,
        y: r
      }, d = await s.detectOverflow(e, c), f = Lt(Qt(i)), p = po(f);
      let h = u[p], g = u[f];
      if (o) {
        const w = p === "y" ? "top" : "left", m = p === "y" ? "bottom" : "right", x = h + d[w], b = h - d[m];
        h = Fs(x, h, b);
      }
      if (a) {
        const w = f === "y" ? "top" : "left", m = f === "y" ? "bottom" : "right", x = g + d[w], b = g - d[m];
        g = Fs(x, g, b);
      }
      const y = l.fn({
        ...e,
        [p]: h,
        [f]: g
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - r,
          enabled: {
            [p]: o,
            [f]: a
          }
        }
      };
    }
  };
}, Lv = function(t) {
  return t === void 0 && (t = {}), {
    options: t,
    fn(e) {
      const {
        x: n,
        y: r,
        placement: i,
        rects: s,
        middlewareData: o
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = Zt(t, e), u = {
        x: n,
        y: r
      }, d = Lt(i), f = po(d);
      let p = u[f], h = u[d];
      const g = Zt(a, e), y = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const x = f === "y" ? "height" : "width", b = s.reference[f] - s.floating[x] + y.mainAxis, C = s.reference[f] + s.reference[x] - y.mainAxis;
        p < b ? p = b : p > C && (p = C);
      }
      if (c) {
        var w, m;
        const x = f === "y" ? "width" : "height", b = Qu.has(Qt(i)), C = s.reference[d] - s.floating[x] + (b && ((w = o.offset) == null ? void 0 : w[d]) || 0) + (b ? 0 : y.crossAxis), T = s.reference[d] + s.reference[x] + (b ? 0 : ((m = o.offset) == null ? void 0 : m[d]) || 0) - (b ? y.crossAxis : 0);
        h < C ? h = C : h > T && (h = T);
      }
      return {
        [f]: p,
        [d]: h
      };
    }
  };
}, Mv = function(t) {
  return t === void 0 && (t = {}), {
    name: "size",
    options: t,
    async fn(e) {
      var n, r;
      const {
        placement: i,
        rects: s,
        platform: o,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...c
      } = Zt(t, e), u = await o.detectOverflow(e, c), d = Qt(i), f = Gn(i), p = Lt(i) === "y", {
        width: h,
        height: g
      } = s.floating;
      let y, w;
      d === "top" || d === "bottom" ? (y = d, w = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (w = d, y = f === "end" ? "top" : "bottom");
      const m = g - u.top - u.bottom, x = h - u.left - u.right, b = fn(g - u[y], m), C = fn(h - u[w], x), T = !e.middlewareData.shift;
      let E = b, O = C;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (O = x), (r = e.middlewareData.shift) != null && r.enabled.y && (E = m), T && !f) {
        const D = it(u.left, 0), G = it(u.right, 0), M = it(u.top, 0), W = it(u.bottom, 0);
        p ? O = h - 2 * (D !== 0 || G !== 0 ? D + G : it(u.left, u.right)) : E = g - 2 * (M !== 0 || W !== 0 ? M + W : it(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: O,
        availableHeight: E
      });
      const A = await o.getDimensions(a.floating);
      return h !== A.width || g !== A.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function qi() {
  return typeof window < "u";
}
function In(t) {
  return mo(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function ot(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Nt(t) {
  var e;
  return (e = (mo(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function mo(t) {
  return qi() ? t instanceof Node || t instanceof ot(t).Node : !1;
}
function xt(t) {
  return qi() ? t instanceof Element || t instanceof ot(t).Element : !1;
}
function Bt(t) {
  return qi() ? t instanceof HTMLElement || t instanceof ot(t).HTMLElement : !1;
}
function Ma(t) {
  return !qi() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof ot(t).ShadowRoot;
}
const Dv = /* @__PURE__ */ new Set(["inline", "contents"]);
function Br(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: r,
    display: i
  } = St(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + n) && !Dv.has(i);
}
const $v = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Bv(t) {
  return $v.has(In(t));
}
const Fv = [":popover-open", ":modal"];
function zi(t) {
  return Fv.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Nv = ["transform", "translate", "scale", "rotate", "perspective"], Hv = ["transform", "translate", "scale", "rotate", "perspective", "filter"], qv = ["paint", "layout", "strict", "content"];
function go(t) {
  const e = yo(), n = xt(t) ? St(t) : t;
  return Nv.some((r) => n[r] ? n[r] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Hv.some((r) => (n.willChange || "").includes(r)) || qv.some((r) => (n.contain || "").includes(r));
}
function zv(t) {
  let e = pn(t);
  for (; Bt(e) && !Yn(e); ) {
    if (go(e))
      return e;
    if (zi(e))
      return null;
    e = pn(e);
  }
  return null;
}
function yo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Vv = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Yn(t) {
  return Vv.has(In(t));
}
function St(t) {
  return ot(t).getComputedStyle(t);
}
function Vi(t) {
  return xt(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function pn(t) {
  if (In(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Ma(t) && t.host || // Fallback.
    Nt(t)
  );
  return Ma(e) ? e.host : e;
}
function ec(t) {
  const e = pn(t);
  return Yn(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Bt(e) && Br(e) ? e : ec(e);
}
function kr(t, e, n) {
  var r;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const i = ec(t), s = i === ((r = t.ownerDocument) == null ? void 0 : r.body), o = ot(i);
  if (s) {
    const a = Hs(o);
    return e.concat(o, o.visualViewport || [], Br(i) ? i : [], a && n ? kr(a) : []);
  }
  return e.concat(i, kr(i, [], n));
}
function Hs(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function tc(t) {
  const e = St(t);
  let n = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = Bt(t), s = i ? t.offsetWidth : n, o = i ? t.offsetHeight : r, a = vi(n) !== s || vi(r) !== o;
  return a && (n = s, r = o), {
    width: n,
    height: r,
    $: a
  };
}
function bo(t) {
  return xt(t) ? t : t.contextElement;
}
function Un(t) {
  const e = bo(t);
  if (!Bt(e))
    return Dt(1);
  const n = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = tc(e);
  let o = (s ? vi(n.width) : n.width) / r, a = (s ? vi(n.height) : n.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Wv = /* @__PURE__ */ Dt(0);
function nc(t) {
  const e = ot(t);
  return !yo() || !e.visualViewport ? Wv : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function jv(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== ot(t) ? !1 : e;
}
function kn(t, e, n, r) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), s = bo(t);
  let o = Dt(1);
  e && (r ? xt(r) && (o = Un(r)) : o = Un(t));
  const a = jv(s, n, r) ? nc(s) : Dt(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = ot(s), p = r && xt(r) ? ot(r) : r;
    let h = f, g = Hs(h);
    for (; g && r && p !== h; ) {
      const y = Un(g), w = g.getBoundingClientRect(), m = St(g), x = w.left + (g.clientLeft + parseFloat(m.paddingLeft)) * y.x, b = w.top + (g.clientTop + parseFloat(m.paddingTop)) * y.y;
      l *= y.x, c *= y.y, u *= y.x, d *= y.y, l += x, c += b, h = ot(g), g = Hs(h);
    }
  }
  return gi({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Wi(t, e) {
  const n = Vi(t).scrollLeft;
  return e ? e.left + n : kn(Nt(t)).left + n;
}
function rc(t, e) {
  const n = t.getBoundingClientRect(), r = n.left + e.scrollLeft - Wi(t, n), i = n.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function Uv(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: r,
    strategy: i
  } = t;
  const s = i === "fixed", o = Nt(r), a = e ? zi(e.floating) : !1;
  if (r === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Dt(1);
  const u = Dt(0), d = Bt(r);
  if ((d || !d && !s) && ((In(r) !== "body" || Br(o)) && (l = Vi(r)), Bt(r))) {
    const p = kn(r);
    c = Un(r), u.x = p.x + r.clientLeft, u.y = p.y + r.clientTop;
  }
  const f = o && !d && !s ? rc(o, l) : Dt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Kv(t) {
  return Array.from(t.getClientRects());
}
function Xv(t) {
  const e = Nt(t), n = Vi(t), r = t.ownerDocument.body, i = it(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = it(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -n.scrollLeft + Wi(t);
  const a = -n.scrollTop;
  return St(r).direction === "rtl" && (o += it(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const Da = 25;
function Yv(t, e) {
  const n = ot(t), r = Nt(t), i = n.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = yo();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = Wi(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), p = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, h = Math.abs(r.clientWidth - d.clientWidth - p);
    h <= Da && (s -= h);
  } else c <= Da && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Gv = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Jv(t, e) {
  const n = kn(t, !0, e === "fixed"), r = n.top + t.clientTop, i = n.left + t.clientLeft, s = Bt(t) ? Un(t) : Dt(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function $a(t, e, n) {
  let r;
  if (e === "viewport")
    r = Yv(t, n);
  else if (e === "document")
    r = Xv(Nt(t));
  else if (xt(e))
    r = Jv(e, n);
  else {
    const i = nc(t);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return gi(r);
}
function ic(t, e) {
  const n = pn(t);
  return n === e || !xt(n) || Yn(n) ? !1 : St(n).position === "fixed" || ic(n, e);
}
function Zv(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let r = kr(t, [], !1).filter((a) => xt(a) && In(a) !== "body"), i = null;
  const s = St(t).position === "fixed";
  let o = s ? pn(t) : t;
  for (; xt(o) && !Yn(o); ) {
    const a = St(o), l = go(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && Gv.has(i.position) || Br(o) && !l && ic(t, o)) ? r = r.filter((u) => u !== o) : i = a, o = pn(o);
  }
  return e.set(t, r), r;
}
function Qv(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = t;
  const o = [...n === "clippingAncestors" ? zi(e) ? [] : Zv(e, this._c) : [].concat(n), r], a = o[0], l = o.reduce((c, u) => {
    const d = $a(e, u, i);
    return c.top = it(d.top, c.top), c.right = fn(d.right, c.right), c.bottom = fn(d.bottom, c.bottom), c.left = it(d.left, c.left), c;
  }, $a(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function em(t) {
  const {
    width: e,
    height: n
  } = tc(t);
  return {
    width: e,
    height: n
  };
}
function tm(t, e, n) {
  const r = Bt(e), i = Nt(e), s = n === "fixed", o = kn(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Dt(0);
  function c() {
    l.x = Wi(i);
  }
  if (r || !r && !s)
    if ((In(e) !== "body" || Br(i)) && (a = Vi(e)), r) {
      const p = kn(e, !0, s, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? rc(i, a) : Dt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function ps(t) {
  return St(t).position === "static";
}
function Ba(t, e) {
  if (!Bt(t) || St(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return Nt(t) === n && (n = n.ownerDocument.body), n;
}
function sc(t, e) {
  const n = ot(t);
  if (zi(t))
    return n;
  if (!Bt(t)) {
    let i = pn(t);
    for (; i && !Yn(i); ) {
      if (xt(i) && !ps(i))
        return i;
      i = pn(i);
    }
    return n;
  }
  let r = Ba(t, e);
  for (; r && Bv(r) && ps(r); )
    r = Ba(r, e);
  return r && Yn(r) && ps(r) && !go(r) ? n : r || zv(t) || n;
}
const nm = async function(t) {
  const e = this.getOffsetParent || sc, n = this.getDimensions, r = await n(t.floating);
  return {
    reference: tm(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function rm(t) {
  return St(t).direction === "rtl";
}
const im = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Uv,
  getDocumentElement: Nt,
  getClippingRect: Qv,
  getOffsetParent: sc,
  getElementRects: nm,
  getClientRects: Kv,
  getDimensions: em,
  getScale: Un,
  isElement: xt,
  isRTL: rm
};
function oc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function sm(t, e) {
  let n = null, r;
  const i = Nt(t);
  function s() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
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
    const h = Kr(d), g = Kr(i.clientWidth - (u + f)), y = Kr(i.clientHeight - (d + p)), w = Kr(u), x = {
      rootMargin: -h + "px " + -g + "px " + -y + "px " + -w + "px",
      threshold: it(0, fn(1, l)) || 1
    };
    let b = !0;
    function C(T) {
      const E = T[0].intersectionRatio;
      if (E !== l) {
        if (!b)
          return o();
        E ? o(!1, E) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      E === 1 && !oc(c, t.getBoundingClientRect()) && o(), b = !1;
    }
    try {
      n = new IntersectionObserver(C, {
        ...x,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(C, x);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function om(t, e, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = bo(t), u = i || s ? [...c ? kr(c) : [], ...kr(e)] : [];
  u.forEach((w) => {
    i && w.addEventListener("scroll", n, {
      passive: !0
    }), s && w.addEventListener("resize", n);
  });
  const d = c && a ? sm(c, n) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((w) => {
    let [m] = w;
    m && m.target === c && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = p) == null || x.observe(e);
    })), n();
  }), c && !l && p.observe(c), p.observe(e));
  let h, g = l ? kn(t) : null;
  l && y();
  function y() {
    const w = kn(t);
    g && !oc(g, w) && n(), g = w, h = requestAnimationFrame(y);
  }
  return n(), () => {
    var w;
    u.forEach((m) => {
      i && m.removeEventListener("scroll", n), s && m.removeEventListener("resize", n);
    }), d?.(), (w = p) == null || w.disconnect(), p = null, l && cancelAnimationFrame(h);
  };
}
const am = Rv, lm = Iv, Fa = kv, um = Mv, cm = Pv, dm = Av, fm = Lv, pm = (t, e, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: im,
    ...n
  }, s = {
    ...i.platform,
    _c: r
  };
  return Tv(t, e, {
    ...i,
    platform: s
  });
};
function hm(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function qs(t) {
  if (hm(t)) {
    const e = t.$el;
    return mo(e) && In(e) === "#comment" ? null : e;
  }
  return t;
}
function Hn(t) {
  return typeof t == "function" ? t() : v(t);
}
function vm(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = qs(Hn(t.element));
      return n == null ? {} : dm({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function ac(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Na(t, e) {
  const n = ac(t);
  return Math.round(e * n) / n;
}
function mm(t, e, n) {
  n === void 0 && (n = {});
  const r = n.whileElementsMounted, i = L(() => {
    var E;
    return (E = Hn(n.open)) != null ? E : !0;
  }), s = L(() => Hn(n.middleware)), o = L(() => {
    var E;
    return (E = Hn(n.placement)) != null ? E : "bottom";
  }), a = L(() => {
    var E;
    return (E = Hn(n.strategy)) != null ? E : "absolute";
  }), l = L(() => {
    var E;
    return (E = Hn(n.transform)) != null ? E : !0;
  }), c = L(() => qs(t.value)), u = L(() => qs(e.value)), d = /* @__PURE__ */ I(0), f = /* @__PURE__ */ I(0), p = /* @__PURE__ */ I(a.value), h = /* @__PURE__ */ I(o.value), g = /* @__PURE__ */ An({}), y = /* @__PURE__ */ I(!1), w = L(() => {
    const E = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return E;
    const O = Na(u.value, d.value), A = Na(u.value, f.value);
    return l.value ? {
      ...E,
      transform: "translate(" + O + "px, " + A + "px)",
      ...ac(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: O + "px",
      top: A + "px"
    };
  });
  let m;
  function x() {
    if (c.value == null || u.value == null)
      return;
    const E = i.value;
    pm(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((O) => {
      d.value = O.x, f.value = O.y, p.value = O.strategy, h.value = O.placement, g.value = O.middlewareData, y.value = E !== !1;
    });
  }
  function b() {
    typeof m == "function" && (m(), m = void 0);
  }
  function C() {
    if (b(), r === void 0) {
      x();
      return;
    }
    if (c.value != null && u.value != null) {
      m = r(c.value, u.value, x);
      return;
    }
  }
  function T() {
    i.value || (y.value = !1);
  }
  return xe([s, o, a, i], x, {
    flush: "sync"
  }), xe([c, u], C, {
    flush: "sync"
  }), xe(i, T, {
    flush: "sync"
  }), Xs() && ll(b), {
    x: /* @__PURE__ */ $n(d),
    y: /* @__PURE__ */ $n(f),
    strategy: /* @__PURE__ */ $n(p),
    placement: /* @__PURE__ */ $n(h),
    middlewareData: /* @__PURE__ */ $n(g),
    isPositioned: /* @__PURE__ */ $n(y),
    floatingStyles: w,
    update: x
  };
}
const gm = {
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
}, [c0, ym] = ct("PopperContent");
var bm = /* @__PURE__ */ U({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Hd({
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
  }, { ...gm }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, r = e, i = Ju(), { forwardRef: s, currentElement: o } = ge(), a = /* @__PURE__ */ I(), l = /* @__PURE__ */ I(), { width: c, height: u } = _h(l), d = L(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), f = L(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), p = L(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = L(() => ({
      padding: f.value,
      boundary: p.value.filter(fv),
      altBoundary: p.value.length > 0
    })), g = L(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), y = Up(() => [
      am({
        mainAxis: n.sideOffset + u.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && Fa({
        ...h.value,
        ...g.value
      }),
      n.avoidCollisions && lm({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? fm() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && Fa({
        ...h.value,
        ...g.value
      }),
      um({
        ...h.value,
        apply: ({ elements: M, rects: W, availableWidth: H, availableHeight: se }) => {
          const { width: re, height: ie } = W.reference, te = M.floating.style;
          te.setProperty("--reka-popper-available-width", `${H}px`), te.setProperty("--reka-popper-available-height", `${se}px`), te.setProperty("--reka-popper-anchor-width", `${re}px`), te.setProperty("--reka-popper-anchor-height", `${ie}px`);
        }
      }),
      l.value && vm({
        element: l.value,
        padding: n.arrowPadding
      }),
      pv({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      n.hideWhenDetached && cm({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), w = L(() => n.reference ?? i.anchor.value), { floatingStyles: m, placement: x, isPositioned: b, middlewareData: C } = mm(w, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...M) => om(...M, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: y
    }), T = L(() => Bs(x.value)[0]), E = L(() => Bs(x.value)[1]);
    Dl(() => {
      b.value && r("placed");
    });
    const O = L(() => {
      const M = C.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && M;
    }), A = /* @__PURE__ */ I("");
    Ve(() => {
      o.value && (A.value = window.getComputedStyle(o.value).zIndex);
    });
    const D = L(() => C.value.arrow?.x ?? 0), G = L(() => C.value.arrow?.y ?? 0);
    return ym({
      placedSide: T,
      onArrowChange: (M) => l.value = M,
      arrowX: D,
      arrowY: G,
      shouldHideArrow: O
    }), (M, W) => (k(), ce("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: tt({
        ...v(m),
        transform: v(b) ? v(m).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: A.value,
        "--reka-popper-transform-origin": [v(C).transformOrigin?.x, v(C).transformOrigin?.y].join(" "),
        ...v(C).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(v(Se), de({ ref: v(s) }, M.$attrs, {
      "as-child": n.asChild,
      as: M.as,
      "data-side": T.value,
      "data-align": E.value,
      style: { animation: v(b) ? void 0 : "none" }
    }), {
      default: R(() => [J(M.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), _m = bm;
function wm(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((r) => pr(r, e, n)) : pr(t, e, n);
}
function pr(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : hi(t, e);
}
const [_o, xm] = ct("ListboxRoot");
var Sm = /* @__PURE__ */ U({
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
    const r = t, i = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = /* @__PURE__ */ en(r), { getItems: d } = vn({ isProvider: !0 }), { handleTypeaheadSearch: f } = fo(), { primitiveElement: p, currentElement: h } = Ar(), g = bh(), y = lo(u), w = $u(h), m = /* @__PURE__ */ I(), x = /* @__PURE__ */ I(!1), b = /* @__PURE__ */ I(!0), C = /* @__PURE__ */ Er(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function T(X) {
      if (x.value = !0, r.multiple) {
        const ne = Array.isArray(C.value) ? [...C.value] : [], ue = ne.findIndex((he) => pr(he, X, r.by));
        r.selectionBehavior === "toggle" ? (ue === -1 ? ne.push(X) : ne.splice(ue, 1), C.value = ne) : (C.value = [X], m.value = X);
      } else r.selectionBehavior === "toggle" && pr(C.value, X, r.by) ? C.value = void 0 : C.value = X;
      setTimeout(() => {
        x.value = !1;
      }, 1);
    }
    const E = /* @__PURE__ */ I(null), O = /* @__PURE__ */ I(null), A = /* @__PURE__ */ I(!1), D = /* @__PURE__ */ I(!1), G = /* @__PURE__ */ os(), M = /* @__PURE__ */ os(), W = /* @__PURE__ */ os();
    function H() {
      return d().map((X) => X.ref).filter((X) => X.dataset.disabled !== "");
    }
    function se(X, ne = !0) {
      if (!X) return;
      E.value = X, b.value && E.value.focus(), ne && E.value.scrollIntoView({ block: "nearest" });
      const ue = d().find((he) => he.ref === X);
      i("highlight", ue);
    }
    function re(X) {
      if (A.value) W.trigger(X);
      else {
        const ne = d().find((ue) => pr(ue.value, X, r.by));
        ne && (E.value = ne.ref, se(ne.ref));
      }
    }
    function ie(X) {
      E.value && E.value.isConnected && (X.preventDefault(), X.stopPropagation(), D.value || E.value.click());
    }
    function te(X) {
      if (b.value) {
        if (x.value = !0, A.value) M.trigger(X);
        else {
          const ne = X.altKey || X.ctrlKey || X.metaKey;
          if (ne && X.key === "a" && s.value) {
            const ue = d(), he = ue.map((vt) => vt.value);
            C.value = [...he], X.preventDefault(), se(ue[ue.length - 1].ref);
          } else if (!ne) {
            const ue = f(X.key, d());
            ue && se(ue);
          }
        }
        setTimeout(() => {
          x.value = !1;
        }, 1);
      }
    }
    function Pe() {
      D.value = !0;
    }
    function je() {
      Ie(() => {
        D.value = !1;
      });
    }
    function dt() {
      Ie(() => {
        const X = new KeyboardEvent("keydown", { key: "PageUp" });
        Ht(X);
      });
    }
    function Me(X) {
      const ne = E.value;
      ne?.isConnected && (O.value = ne), E.value = null, i("leave", X);
    }
    function Mn(X) {
      const ne = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (X.currentTarget?.dispatchEvent(ne), i("entryFocus", ne), !ne.defaultPrevented)
        if (O.value) se(O.value);
        else {
          const ue = H()?.[0];
          se(ue);
        }
    }
    function Ht(X) {
      const ne = nv(X, a.value, y.value);
      if (!ne) return;
      let ue = H();
      if (E.value) {
        if (ne === "last") ue.reverse();
        else if (ne === "prev" || ne === "next") {
          ne === "prev" && ue.reverse();
          const he = ue.indexOf(E.value);
          ue = ue.slice(he + 1);
        }
        Jn(X, ue[0]);
      }
      if (ue.length) {
        const he = !E.value && ne === "prev" ? ue.length - 1 : 0;
        se(ue[he]);
      }
      if (A.value) return M.trigger(X);
    }
    function Jn(X, ne) {
      if (!(A.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(C.value) || (X.altKey || X.ctrlKey || X.metaKey) && !X.shiftKey) && X.shiftKey) {
        const he = d().filter((S) => S.ref.dataset.disabled !== "");
        let vt = he.find((S) => S.ref === ne)?.value;
        if (X.key === g.END ? vt = he[he.length - 1].value : X.key === g.HOME && (vt = he[0].value), !vt || !m.value) return;
        const _ = jp(he.map((S) => S.value), m.value, vt);
        C.value = _;
      }
    }
    async function qt(X) {
      if (await Ie(), A.value) G.trigger(X);
      else {
        const ne = H(), ue = ne.find((he) => he.dataset.state === "checked");
        ue ? se(ue) : ne.length && se(ne[0]);
      }
    }
    return xe(C, () => {
      x.value || Ie(() => {
        qt();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: E,
      highlightItem: re,
      highlightFirstItem: dt,
      highlightSelected: qt,
      getItems: d
    }), xm({
      modelValue: C,
      onValueChange: T,
      multiple: s,
      orientation: a,
      dir: y,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: E,
      isVirtual: A,
      virtualFocusHook: G,
      virtualKeydownHook: M,
      virtualHighlightHook: W,
      by: r.by,
      firstValue: m,
      selectionBehavior: c,
      focusable: b,
      onLeave: Me,
      onEnter: Mn,
      changeHighlight: se,
      onKeydownEnter: ie,
      onKeydownNavigation: Ht,
      onKeydownTypeAhead: te,
      onCompositionStart: Pe,
      onCompositionEnd: je,
      highlightFirstItem: dt
    }), (X, ne) => (k(), z(v(Se), {
      ref_key: "primitiveElement",
      ref: p,
      as: X.as,
      "as-child": X.asChild,
      dir: v(y),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Me,
      onFocusout: ne[0] || (ne[0] = async (ue) => {
        const he = ue.relatedTarget || ue.target;
        await Ie(), E.value && v(h) && !v(h).contains(he) && Me(ue);
      })
    }, {
      default: R(() => [J(X.$slots, "default", { modelValue: v(C) }), v(w) && X.name ? (k(), z(v(ov), {
        key: 0,
        name: X.name,
        value: v(C),
        disabled: v(l),
        required: X.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : pe("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), Cm = Sm, Em = /* @__PURE__ */ U({
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
    const { CollectionSlot: e } = vn(), n = _o(), r = Ru(!1, 10);
    return (i, s) => (k(), z(v(e), null, {
      default: R(() => [q(v(Se), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: s[0] || (s[0] = cn((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          v(r) || v(n).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = Sr((o) => {
            v(n).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || v(n).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), v(n).focusable.value && v(n).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Sr(v(n).onKeydownEnter, ["enter"]),
          v(n).onKeydownTypeAhead
        ]
      }, {
        default: R(() => [J(i.$slots, "default")]),
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
}), Tm = Em, Am = /* @__PURE__ */ U({
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
    const n = t, i = /* @__PURE__ */ Er(n, "modelValue", e, {
      defaultValue: "",
      passive: n.modelValue === void 0
    }), s = _o(), { primitiveElement: o, currentElement: a } = Ar(), l = L(() => n.disabled || s.disabled.value || !1), c = /* @__PURE__ */ I();
    return $l(() => c.value = s.highlightedElement.value?.id), Ae(() => {
      s.focusable.value = !1, setTimeout(() => {
        n.autoFocus && a.value?.focus();
      }, 1);
    }), at(() => {
      s.focusable.value = !0;
    }), (u, d) => (k(), z(v(Se), {
      ref_key: "primitiveElement",
      ref: o,
      as: u.as,
      "as-child": u.asChild,
      value: v(i),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": c.value,
      type: "text",
      onKeydown: [Sr(cn(v(s).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), Sr(v(s).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (f) => {
        i.value = f.target.value, v(s).highlightFirstItem();
      }),
      onCompositionstart: v(s).onCompositionStart,
      onCompositionend: v(s).onCompositionEnd
    }, {
      default: R(() => [J(u.$slots, "default", { modelValue: v(i) })]),
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
}), km = Am;
const Pm = "listbox.select", [Om, Rm] = ct("ListboxItem");
var Im = /* @__PURE__ */ U({
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
    const n = t, r = e, i = Tr(void 0, "reka-listbox-item"), { CollectionItem: s } = vn(), { forwardRef: o, currentElement: a } = ge(), l = _o(), c = L(() => a.value === l.highlightedElement.value), u = L(() => wm(l.modelValue.value, n.value, l.by)), d = L(() => l.disabled.value || n.disabled);
    async function f(h) {
      r("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function p(h) {
      const g = {
        originalEvent: h,
        value: n.value
      };
      Bi(Pm, f, g);
    }
    return Rm({ isSelected: u }), (h, g) => (k(), z(v(s), { value: h.value }, {
      default: R(() => [Sf([c.value, u.value], () => q(v(Se), de({ id: v(i) }, h.$attrs, {
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
        onKeydown: Sr(cn(p, ["prevent"]), ["space"]),
        onPointermove: g[0] || (g[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
        })
      }), {
        default: R(() => [J(h.$slots, "default")]),
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
      ]), g, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Lm = Im, Mm = /* @__PURE__ */ U({
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
    const n = Om();
    return (r, i) => v(n).isSelected.value ? (k(), z(v(Se), de({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: R(() => [J(r.$slots, "default")]),
      _: 3
    }, 16)) : pe("v-if", !0);
  }
}), Dm = Mm;
function lc(t) {
  const e = oo({ nonce: /* @__PURE__ */ I() });
  return L(() => t?.value || e.nonce?.value);
}
const [Ct, $m] = ct("ScrollAreaRoot");
var Bm = /* @__PURE__ */ U({
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
    const n = t, r = /* @__PURE__ */ I(0), i = /* @__PURE__ */ I(0), s = /* @__PURE__ */ I(), o = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), l = /* @__PURE__ */ I(), c = /* @__PURE__ */ I(!1), u = /* @__PURE__ */ I(!1), { type: d, dir: f, scrollHideDelay: p } = /* @__PURE__ */ en(n), h = lo(f);
    function g() {
      s.value?.scrollTo({ top: 0 });
    }
    function y() {
      s.value?.scrollTo({
        top: 0,
        left: 0
      });
    }
    e({
      viewport: s,
      scrollTop: g,
      scrollTopLeft: y
    });
    const { forwardRef: w, currentElement: m } = ge();
    return $m({
      type: d,
      dir: h,
      scrollHideDelay: p,
      scrollArea: m,
      viewport: s,
      onViewportChange: (x) => {
        s.value = x || void 0;
      },
      content: o,
      onContentChange: (x) => {
        o.value = x;
      },
      scrollbarX: a,
      scrollbarXEnabled: c,
      scrollbarY: l,
      scrollbarYEnabled: u,
      onScrollbarXChange: (x) => {
        a.value = x || void 0;
      },
      onScrollbarYChange: (x) => {
        l.value = x || void 0;
      },
      onScrollbarXEnabledChange: (x) => {
        c.value = x;
      },
      onScrollbarYEnabledChange: (x) => {
        u.value = x;
      },
      onCornerWidthChange: (x) => {
        r.value = x;
      },
      onCornerHeightChange: (x) => {
        i.value = x;
      }
    }), (x, b) => (k(), z(v(Se), {
      ref: v(w),
      "as-child": n.asChild,
      as: x.as,
      dir: v(h),
      style: tt({
        position: "relative",
        "--reka-scroll-area-corner-width": `${r.value}px`,
        "--reka-scroll-area-corner-height": `${i.value}px`
      })
    }, {
      default: R(() => [J(x.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "dir",
      "style"
    ]));
  }
}), Fm = Bm;
function uc(t, e) {
  return (n) => {
    if (t[0] === t[1] || e[0] === e[1]) return e[0];
    const r = (e[1] - e[0]) / (t[1] - t[0]);
    return e[0] + r * (n - t[0]);
  };
}
function ji(t) {
  const e = cc(t.viewport, t.content), n = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, r = (t.scrollbar.size - n) * e;
  return Math.max(r, 18);
}
function cc(t, e) {
  const n = t / e;
  return Number.isNaN(n) ? 0 : n;
}
function Nm(t, e = () => {
}) {
  let n = {
    left: t.scrollLeft,
    top: t.scrollTop
  }, r = 0;
  return (function i() {
    const s = {
      left: t.scrollLeft,
      top: t.scrollTop
    }, o = n.left !== s.left, a = n.top !== s.top;
    (o || a) && e(), n = s, r = window.requestAnimationFrame(i);
  })(), () => window.cancelAnimationFrame(r);
}
function Ha(t, e, n = "ltr") {
  const r = ji(e), i = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, s = e.scrollbar.size - i, o = e.content - e.viewport, a = s - r, l = n === "ltr" ? [0, o] : [o * -1, 0], c = Ls(t, l[0], l[1]);
  return uc([0, o], [0, a])(c);
}
function Xr(t) {
  return t ? Number.parseInt(t, 10) : 0;
}
function Hm(t, e, n, r = "ltr") {
  const i = ji(n), s = i / 2, o = e || s, a = i - o, l = n.scrollbar.paddingStart + o, c = n.scrollbar.size - n.scrollbar.paddingEnd - a, u = n.content - n.viewport, d = r === "ltr" ? [0, u] : [u * -1, 0];
  return uc([l, c], d)(t);
}
function qa(t, e) {
  return t > 0 && t < e;
}
var qm = /* @__PURE__ */ U({
  __name: "ScrollAreaScrollbarX",
  setup(t) {
    const e = Ct(), n = Ui(), { forwardRef: r, currentElement: i } = ge();
    Ae(() => {
      i.value && e.onScrollbarXChange(i.value);
    });
    const s = L(() => n.sizes.value);
    return (o, a) => (k(), z(dc, {
      ref: v(r),
      "is-horizontal": !0,
      "data-orientation": "horizontal",
      style: tt({
        bottom: 0,
        left: v(e).dir.value === "rtl" ? "var(--reka-scroll-area-corner-width)" : 0,
        right: v(e).dir.value === "ltr" ? "var(--reka-scroll-area-corner-width)" : 0,
        "--reka-scroll-area-thumb-width": s.value ? `${v(ji)(s.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => v(n).onDragScroll(l.x))
    }, {
      default: R(() => [J(o.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), zm = qm, Vm = /* @__PURE__ */ U({
  __name: "ScrollAreaScrollbarY",
  setup(t) {
    const e = Ct(), n = Ui(), { forwardRef: r, currentElement: i } = ge();
    Ae(() => {
      i.value && e.onScrollbarYChange(i.value);
    });
    const s = L(() => n.sizes.value);
    return (o, a) => (k(), z(dc, {
      ref: v(r),
      "is-horizontal": !1,
      "data-orientation": "vertical",
      style: tt({
        top: 0,
        right: v(e).dir.value === "ltr" ? 0 : void 0,
        left: v(e).dir.value === "rtl" ? 0 : void 0,
        bottom: "var(--reka-scroll-area-corner-height)",
        "--reka-scroll-area-thumb-height": s.value ? `${v(ji)(s.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => v(n).onDragScroll(l.y))
    }, {
      default: R(() => [J(o.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), Wm = Vm, jm = /* @__PURE__ */ U({
  __name: "ScrollAreaScrollbarAuto",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Fr(), { forwardRef: r } = ge(), i = /* @__PURE__ */ I(!1), s = /* @__PURE__ */ ao(() => {
      if (e.viewport.value) {
        const o = e.viewport.value.offsetWidth < e.viewport.value.scrollWidth, a = e.viewport.value.offsetHeight < e.viewport.value.scrollHeight;
        i.value = n.isHorizontal.value ? o : a;
      }
    }, 10);
    return Ae(() => s()), Cr(e.viewport, s), Cr(e.content, s), (o, a) => (k(), z(v(Rn), { present: o.forceMount || i.value }, {
      default: R(() => [q(xo, de(o.$attrs, {
        ref: v(r),
        "data-state": i.value ? "visible" : "hidden"
      }), {
        default: R(() => [J(o.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), wo = jm, Um = /* @__PURE__ */ U({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarGlimpse",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Fr(), { forwardRef: r } = ge(), { state: i, dispatch: s } = co("hidden", {
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
    }), o = L(() => i.value !== "hidden");
    function a() {
      s("POINTER_ENTER");
    }
    function l() {
      s("POINTER_LEAVE");
    }
    const c = /* @__PURE__ */ ao(() => s("SCROLL_END"), 100);
    return Ve((u) => {
      if (i.value === "glimpse") {
        const d = window.setTimeout(() => s("HIDE"), e.scrollHideDelay.value);
        u(() => {
          window.clearTimeout(d);
        });
      }
    }), Ve((u) => {
      if (i.value === "idle") {
        const d = window.setTimeout(() => s("HIDE"), e.scrollHideDelay.value);
        u(() => {
          window.clearTimeout(d);
        });
      }
    }), Ve((u) => {
      const d = e.viewport.value, f = n.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (d) {
        let p = d[f];
        const h = () => {
          const g = d[f];
          p !== g && (s("SCROLL"), c()), p = g;
        };
        d.addEventListener("scroll", h), u(() => {
          d.removeEventListener("scroll", h);
        });
      }
    }), Ae(() => {
      const u = e.scrollArea.value;
      u && (u.addEventListener("pointerenter", a), u.addEventListener("pointerleave", l));
    }), at(() => {
      const u = e.scrollArea.value;
      u && (u.removeEventListener("pointerenter", a), u.removeEventListener("pointerleave", l));
    }), (u, d) => (k(), z(v(Rn), { present: u.forceMount || o.value }, {
      default: R(() => [q(wo, de(u.$attrs, {
        ref: v(r),
        "data-state": o.value ? "visible" : "hidden"
      }), {
        default: R(() => [J(u.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), Km = Um, Xm = /* @__PURE__ */ U({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarHover",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), { forwardRef: n } = ge();
    let r;
    const i = /* @__PURE__ */ I(!1);
    function s() {
      window.clearTimeout(r), i.value = !0;
    }
    function o() {
      r = window.setTimeout(() => {
        i.value = !1;
      }, e.scrollHideDelay.value);
    }
    return Ae(() => {
      const a = e.scrollArea.value;
      a && (a.addEventListener("pointerenter", s), a.addEventListener("pointerleave", o));
    }), at(() => {
      const a = e.scrollArea.value;
      a && (window.clearTimeout(r), a.removeEventListener("pointerenter", s), a.removeEventListener("pointerleave", o));
    }), (a, l) => (k(), z(v(Rn), { present: a.forceMount || i.value }, {
      default: R(() => [q(wo, de(a.$attrs, {
        ref: v(n),
        "data-state": i.value ? "visible" : "hidden"
      }), {
        default: R(() => [J(a.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), Ym = Xm, Gm = /* @__PURE__ */ U({
  __name: "ScrollAreaScrollbarScroll",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(t) {
    const e = Ct(), n = Fr(), { forwardRef: r } = ge(), { state: i, dispatch: s } = co("hidden", {
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
    }), o = L(() => i.value !== "hidden");
    Ve((l) => {
      if (i.value === "idle") {
        const c = window.setTimeout(() => s("HIDE"), e.scrollHideDelay.value);
        l(() => {
          window.clearTimeout(c);
        });
      }
    });
    const a = /* @__PURE__ */ ao(() => s("SCROLL_END"), 100);
    return Ve((l) => {
      const c = e.viewport.value, u = n.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (c) {
        let d = c[u];
        const f = () => {
          const p = c[u];
          d !== p && (s("SCROLL"), a()), d = p;
        };
        c.addEventListener("scroll", f), l(() => {
          c.removeEventListener("scroll", f);
        });
      }
    }), (l, c) => (k(), z(v(Rn), { present: l.forceMount || o.value }, {
      default: R(() => [q(xo, de(l.$attrs, {
        ref: v(r),
        "data-state": o.value ? "visible" : "hidden"
      }), {
        default: R(() => [J(l.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), Jm = Gm;
const [Fr, Zm] = ct("ScrollAreaScrollbar");
var Qm = /* @__PURE__ */ U({
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
    const e = t, { forwardRef: n } = ge(), r = Ct(), i = L(() => e.orientation === "horizontal");
    xe(i, () => {
      i.value ? r.onScrollbarXEnabledChange(!0) : r.onScrollbarYEnabledChange(!0);
    }, { immediate: !0 }), at(() => {
      r.onScrollbarXEnabledChange(!1), r.onScrollbarYEnabledChange(!1);
    });
    const { orientation: s, forceMount: o, asChild: a, as: l } = /* @__PURE__ */ en(e);
    return Zm({
      orientation: s,
      forceMount: o,
      isHorizontal: i,
      as: l,
      asChild: a
    }), (c, u) => v(r).type.value === "hover" ? (k(), z(Ym, de({ key: 0 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(o)
    }), {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "scroll" ? (k(), z(Jm, de({ key: 1 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(o)
    }), {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "glimpse" ? (k(), z(Km, de({ key: 2 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(o)
    }), {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "auto" ? (k(), z(wo, de({ key: 3 }, c.$attrs, {
      ref: v(n),
      "force-mount": v(o)
    }), {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : v(r).type.value === "always" ? (k(), z(xo, de({ key: 4 }, c.$attrs, {
      ref: v(n),
      "data-state": "visible"
    }), {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 16)) : pe("v-if", !0);
  }
}), eg = Qm;
const [Ui, tg] = ct("ScrollAreaScrollbarVisible");
var ng = /* @__PURE__ */ U({
  __name: "ScrollAreaScrollbarVisible",
  setup(t) {
    const e = Ct(), n = Fr(), { forwardRef: r } = ge(), i = /* @__PURE__ */ I({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    }), s = L(() => {
      const w = cc(i.value.viewport, i.value.content);
      return w > 0 && w < 1;
    }), o = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(0);
    function l(w, m) {
      if (p.value) {
        const x = e.viewport.value.scrollLeft + w.deltaY;
        e.viewport.value.scrollLeft = x, qa(x, m) && w.preventDefault();
      } else {
        const x = e.viewport.value.scrollTop + w.deltaY;
        e.viewport.value.scrollTop = x, qa(x, m) && w.preventDefault();
      }
    }
    function c(w, m) {
      p.value ? a.value = m.x : a.value = m.y;
    }
    function u(w) {
      a.value = 0;
    }
    function d(w) {
      i.value = w;
    }
    function f(w, m) {
      return Hm(w, a.value, i.value, m);
    }
    const p = L(() => n.isHorizontal.value);
    function h(w) {
      p.value ? e.viewport.value.scrollLeft = f(w, e.dir.value) : e.viewport.value.scrollTop = f(w);
    }
    function g() {
      if (p.value) {
        if (e.viewport.value && o.value) {
          const w = e.viewport.value.scrollLeft, m = Ha(w, i.value, e.dir.value);
          o.value.style.transform = `translate3d(${m}px, 0, 0)`;
        }
      } else if (e.viewport.value && o.value) {
        const w = e.viewport.value.scrollTop, m = Ha(w, i.value);
        o.value.style.transform = `translate3d(0, ${m}px, 0)`;
      }
    }
    function y(w) {
      o.value = w;
    }
    return tg({
      sizes: i,
      hasThumb: s,
      handleWheelScroll: l,
      handleThumbDown: c,
      handleThumbUp: u,
      handleSizeChange: d,
      onThumbPositionChange: g,
      onThumbChange: y,
      onDragScroll: h
    }), (w, m) => p.value ? (k(), z(zm, de({ key: 0 }, w.$attrs, { ref: v(r) }), {
      default: R(() => [J(w.$slots, "default")]),
      _: 3
    }, 16)) : (k(), z(Wm, de({ key: 1 }, w.$attrs, { ref: v(r) }), {
      default: R(() => [J(w.$slots, "default")]),
      _: 3
    }, 16));
  }
}), xo = ng, rg = /* @__PURE__ */ U({
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
    const n = t, r = e, i = Ct(), s = Ui(), o = Fr(), { forwardRef: a, currentElement: l } = ge(), c = /* @__PURE__ */ I(""), u = /* @__PURE__ */ I();
    function d(w) {
      if (u.value) {
        const m = w.clientX - u.value?.left, x = w.clientY - u.value?.top;
        r("onDragScroll", {
          x: m,
          y: x
        });
      }
    }
    function f(w) {
      w.button === 0 && (w.target.setPointerCapture(w.pointerId), u.value = l.value.getBoundingClientRect(), c.value = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", i.viewport && (i.viewport.value.style.scrollBehavior = "auto"), d(w));
    }
    function p(w) {
      d(w);
    }
    function h(w) {
      const m = w.target;
      m.hasPointerCapture(w.pointerId) && m.releasePointerCapture(w.pointerId), document.body.style.webkitUserSelect = c.value, i.viewport && (i.viewport.value.style.scrollBehavior = ""), u.value = void 0;
    }
    function g(w) {
      const m = w.target, x = l.value?.contains(m), b = s.sizes.value.content - s.sizes.value.viewport;
      x && s.handleWheelScroll(w, b);
    }
    Ae(() => {
      document.addEventListener("wheel", g, { passive: !1 });
    }), at(() => {
      document.removeEventListener("wheel", g);
    });
    function y() {
      l.value && (n.isHorizontal ? s.handleSizeChange({
        content: i.viewport.value?.scrollWidth ?? 0,
        viewport: i.viewport.value?.offsetWidth ?? 0,
        scrollbar: {
          size: l.value.clientWidth ?? 0,
          paddingStart: Xr(getComputedStyle(l.value).paddingLeft),
          paddingEnd: Xr(getComputedStyle(l.value).paddingRight)
        }
      }) : s.handleSizeChange({
        content: i.viewport.value?.scrollHeight ?? 0,
        viewport: i.viewport.value?.offsetHeight ?? 0,
        scrollbar: {
          size: l.value?.clientHeight ?? 0,
          paddingStart: Xr(getComputedStyle(l.value).paddingTop),
          paddingEnd: Xr(getComputedStyle(l.value).paddingBottom)
        }
      }), s.onThumbPositionChange());
    }
    return Cr(l, y), Cr(i.content, y), (w, m) => (k(), z(v(Se), {
      ref: v(a),
      style: { position: "absolute" },
      "data-scrollbarimpl": "",
      as: v(o).as.value,
      "as-child": v(o).asChild.value,
      onPointerdown: f,
      onPointermove: p,
      onPointerup: h
    }, {
      default: R(() => [J(w.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), dc = rg, ig = /* @__PURE__ */ U({
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
    const e = t, n = Ct(), r = Ui();
    function i(f) {
      const h = f.target.getBoundingClientRect(), g = f.clientX - h.left, y = f.clientY - h.top;
      r.handleThumbDown(f, {
        x: g,
        y
      });
    }
    function s(f) {
      r.handleThumbUp(f);
    }
    const { forwardRef: o, currentElement: a } = ge(), l = /* @__PURE__ */ I(), c = L(() => n.viewport.value);
    function u() {
      if (!l.value) {
        const f = Nm(c.value, r.onThumbPositionChange);
        l.value = f, r.onThumbPositionChange();
      }
    }
    const d = L(() => r.sizes.value);
    return ih(d, () => {
      r.onThumbChange(a.value), c.value && (r.onThumbPositionChange(), c.value.addEventListener("scroll", u));
    }), at(() => {
      c.value.removeEventListener("scroll", u), n.viewport.value?.removeEventListener("scroll", u);
    }), (f, p) => (k(), z(v(Se), {
      ref: v(o),
      "data-state": v(r).hasThumb ? "visible" : "hidden",
      style: {
        width: "var(--reka-scroll-area-thumb-width)",
        height: "var(--reka-scroll-area-thumb-height)"
      },
      "as-child": e.asChild,
      as: f.as,
      onPointerdown: i,
      onPointerup: s
    }, {
      default: R(() => [J(f.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "as-child",
      "as"
    ]));
  }
}), sg = ig, og = /* @__PURE__ */ U({
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
    const n = t, { nonce: r } = /* @__PURE__ */ en(n), i = lc(r), s = Ct(), o = /* @__PURE__ */ I();
    Ae(() => {
      s.onViewportChange(o.value), s.onContentChange(l.value);
    }), e({ viewportElement: o });
    const { forwardRef: a, currentElement: l } = ge();
    return (c, u) => (k(), ce(Te, null, [le("div", de({
      ref_key: "viewportElement",
      ref: o,
      "data-reka-scroll-area-viewport": "",
      style: {
        overflowX: v(s).scrollbarXEnabled.value ? "scroll" : "hidden",
        overflowY: v(s).scrollbarYEnabled.value ? "scroll" : "hidden"
      }
    }, c.$attrs, { tabindex: 0 }), [q(v(Se), {
      ref: v(a),
      style: tt({ minWidth: v(s).scrollbarXEnabled.value ? "fit-content" : void 0 }),
      "as-child": n.asChild,
      as: c.as
    }, {
      default: R(() => [J(c.$slots, "default")]),
      _: 3
    }, 8, [
      "style",
      "as-child",
      "as"
    ])], 16), q(v(Se), {
      as: "style",
      nonce: v(i)
    }, {
      default: R(() => u[0] || (u[0] = [We(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-scroll-area-viewport] { scrollbar-width:none; -ms-overflow-style:none; -webkit-overflow-scrolling:touch; } [data-reka-scroll-area-viewport]::-webkit-scrollbar { display:none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), ag = og;
const lg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], ug = [" ", "Enter"], mt = 10;
function Pr(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((r) => zs(r, e, n)) : zs(t, e, n);
}
function zs(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : hi(t, e);
}
function cg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const dg = {
  key: 0,
  value: ""
}, [mn, fc] = ct("SelectRoot");
var fg = /* @__PURE__ */ U({
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
    const n = t, r = e, { required: i, disabled: s, multiple: o, dir: a } = /* @__PURE__ */ en(n), l = /* @__PURE__ */ Er(n, "modelValue", r, {
      defaultValue: n.defaultValue ?? (o.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ Er(n, "open", r, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), u = /* @__PURE__ */ I(), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I({
      x: 0,
      y: 0
    }), p = L(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Ms(l.value));
    vn({ isProvider: !0 });
    const h = lo(a), g = $u(u), y = /* @__PURE__ */ I(/* @__PURE__ */ new Set()), w = L(() => Array.from(y.value).map((b) => b.value).join(";"));
    function m(b) {
      if (o.value) {
        const C = Array.isArray(l.value) ? [...l.value] : [], T = C.findIndex((E) => zs(E, b, n.by));
        T === -1 ? C.push(b) : C.splice(T, 1), l.value = [...C];
      } else l.value = b;
    }
    function x(b) {
      return Array.from(y.value).find((C) => Pr(b, C.value, n.by));
    }
    return fc({
      triggerElement: u,
      onTriggerChange: (b) => {
        u.value = b;
      },
      valueElement: d,
      onValueElementChange: (b) => {
        d.value = b;
      },
      contentId: "",
      modelValue: l,
      onValueChange: m,
      by: n.by,
      open: c,
      multiple: o,
      required: i,
      onOpenChange: (b) => {
        c.value = b;
      },
      dir: h,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: p,
      optionsSet: y,
      onOptionAdd: (b) => {
        const C = x(b.value);
        C && y.value.delete(C), y.value.add(b);
      },
      onOptionRemove: (b) => {
        const C = x(b.value);
        C && y.value.delete(C);
      }
    }), (b, C) => (k(), z(v(uv), null, {
      default: R(() => [J(b.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(g) ? (k(), z(vg, {
        key: w.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(i),
        name: b.name,
        autocomplete: b.autocomplete,
        disabled: v(s),
        value: v(l)
      }, {
        default: R(() => [v(Ms)(v(l)) ? (k(), ce("option", dg)) : pe("v-if", !0), (k(!0), ce(Te, null, On(Array.from(y.value), (T) => (k(), ce("option", de({ key: T.value ?? "" }, { ref_for: !0 }, T), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : pe("v-if", !0)]),
      _: 3
    }));
  }
}), pg = fg, hg = /* @__PURE__ */ U({
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
    const e = t, n = /* @__PURE__ */ I(), r = mn();
    xe(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && n.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(n.value, s), n.value.dispatchEvent(u);
      }
    });
    function i(s) {
      r.onValueChange(s.target.value);
    }
    return (s, o) => (k(), z(v(Gu), { "as-child": "" }, {
      default: R(() => [le("select", de({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: i }), [J(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), vg = hg, mg = /* @__PURE__ */ U({
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
    const n = uo(t);
    return (r, i) => (k(), z(v(_m), de(v(n), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: R(() => [J(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), gg = mg;
const yg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Ki, pc] = ct("SelectContent");
var bg = /* @__PURE__ */ U({
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
    const n = t, r = e, i = mn();
    ph(), Mu(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = vn(), a = /* @__PURE__ */ I();
    Fu(a);
    const { search: l, handleTypeaheadSearch: c } = fo(), u = /* @__PURE__ */ I(), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(!1), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1);
    function y() {
      d.value && a.value && Ta([d.value, a.value]);
    }
    xe(p, () => {
      y();
    });
    const { onOpenChange: w, triggerPointerDownPosRef: m } = i;
    Ve((T) => {
      if (!a.value) return;
      let E = {
        x: 0,
        y: 0
      };
      const O = (D) => {
        E = {
          x: Math.abs(Math.round(D.pageX) - (m.value?.x ?? 0)),
          y: Math.abs(Math.round(D.pageY) - (m.value?.y ?? 0))
        };
      }, A = (D) => {
        D.pointerType !== "touch" && (E.x <= 10 && E.y <= 10 ? D.preventDefault() : a.value?.contains(D.target) || w(!1), document.removeEventListener("pointermove", O), m.value = null);
      };
      m.value !== null && (document.addEventListener("pointermove", O), document.addEventListener("pointerup", A, {
        capture: !0,
        once: !0
      })), T(() => {
        document.removeEventListener("pointermove", O), document.removeEventListener("pointerup", A, { capture: !0 });
      });
    });
    function x(T) {
      const E = T.ctrlKey || T.altKey || T.metaKey;
      if (T.key === "Tab" && T.preventDefault(), !E && T.key.length === 1 && c(T.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(T.key)) {
        let A = [...o().map((D) => D.ref)];
        if (["ArrowUp", "End"].includes(T.key) && (A = A.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(T.key)) {
          const D = T.target, G = A.indexOf(D);
          A = A.slice(G + 1);
        }
        setTimeout(() => Ta(A)), T.preventDefault();
      }
    }
    const b = L(() => n.position === "popper" ? n : {}), C = uo(b.value);
    return pc({
      content: a,
      viewport: u,
      onViewportChange: (T) => {
        u.value = T;
      },
      itemRefCallback: (T, E, O) => {
        const A = !h.value && !O, D = Pr(i.modelValue.value, E, i.by);
        if (i.multiple.value) {
          if (g.value) return;
          (D || A) && (d.value = T, D && (g.value = !0));
        } else (D || A) && (d.value = T);
        A && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (T, E, O) => {
        const A = !h.value && !O;
        (Pr(i.modelValue.value, E, i.by) || A) && (f.value = T);
      },
      focusSelectedItem: y,
      position: n.position,
      isPositioned: p,
      searchRef: l
    }), (T, E) => (k(), z(v(s), null, {
      default: R(() => [q(v(Vu), {
        "as-child": "",
        onMountAutoFocus: E[6] || (E[6] = cn(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: E[7] || (E[7] = (O) => {
          r("closeAutoFocus", O), !O.defaultPrevented && (v(i).triggerElement.value?.focus({ preventScroll: !0 }), O.preventDefault());
        })
      }, {
        default: R(() => [q(v(qu), {
          "as-child": "",
          "disable-outside-pointer-events": T.disableOutsidePointerEvents,
          onFocusOutside: E[2] || (E[2] = cn(() => {
          }, ["prevent"])),
          onDismiss: E[3] || (E[3] = (O) => v(i).onOpenChange(!1)),
          onEscapeKeyDown: E[4] || (E[4] = (O) => r("escapeKeyDown", O)),
          onPointerDownOutside: E[5] || (E[5] = (O) => r("pointerDownOutside", O))
        }, {
          default: R(() => [(k(), z(Dd(T.position === "popper" ? gg : Cg), de({
            ...T.$attrs,
            ...v(C)
          }, {
            id: v(i).contentId,
            ref: (O) => {
              const A = v($t)(O);
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
            onContextmenu: E[0] || (E[0] = cn(() => {
            }, ["prevent"])),
            onPlaced: E[1] || (E[1] = (O) => p.value = !0),
            onKeydown: x
          }), {
            default: R(() => [J(T.$slots, "default")]),
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
}), _g = bg;
const [wg, xg] = ct("SelectItemAlignedPosition");
var Sg = /* @__PURE__ */ U({
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
    const n = t, r = e, { getItems: i } = vn(), s = mn(), o = Ki(), a = /* @__PURE__ */ I(!1), l = /* @__PURE__ */ I(!0), c = /* @__PURE__ */ I(), { forwardRef: u, currentElement: d } = ge(), { viewport: f, selectedItem: p, selectedItemText: h, focusSelectedItem: g } = o;
    function y() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && p?.value && h?.value) {
        const x = s.triggerElement.value.getBoundingClientRect(), b = d.value.getBoundingClientRect(), C = s.valueElement.value.getBoundingClientRect(), T = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const X = T.left - b.left, ne = C.left - X, ue = x.left - ne, he = x.width + ue, vt = Math.max(he, b.width), _ = window.innerWidth - mt, S = Ls(ne, mt, Math.max(mt, _ - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.left = `${S}px`;
        } else {
          const X = b.right - T.right, ne = window.innerWidth - C.right - X, ue = window.innerWidth - x.right - ne, he = x.width + ue, vt = Math.max(he, b.width), _ = window.innerWidth - mt, S = Ls(ne, mt, Math.max(mt, _ - vt));
          c.value.style.minWidth = `${he}px`, c.value.style.right = `${S}px`;
        }
        const E = i().map((X) => X.ref), O = window.innerHeight - mt * 2, A = f.value.scrollHeight, D = window.getComputedStyle(d.value), G = Number.parseInt(D.borderTopWidth, 10), M = Number.parseInt(D.paddingTop, 10), W = Number.parseInt(D.borderBottomWidth, 10), H = Number.parseInt(D.paddingBottom, 10), se = G + M + A + H + W, re = Math.min(p.value.offsetHeight * 5, se), ie = window.getComputedStyle(f.value), te = Number.parseInt(ie.paddingTop, 10), Pe = Number.parseInt(ie.paddingBottom, 10), je = x.top + x.height / 2 - mt, dt = O - je, Me = p.value.offsetHeight / 2, Mn = p.value.offsetTop + Me, Ht = G + M + Mn, Jn = se - Ht;
        if (Ht <= je) {
          const X = p.value === E[E.length - 1];
          c.value.style.bottom = "0px";
          const ne = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, ue = Math.max(dt, Me + (X ? Pe : 0) + ne + W), he = Ht + ue;
          c.value.style.height = `${he}px`;
        } else {
          const X = p.value === E[0];
          c.value.style.top = "0px";
          const ue = Math.max(je, G + f.value.offsetTop + (X ? te : 0) + Me) + Jn;
          c.value.style.height = `${ue}px`, f.value.scrollTop = Ht - je + f.value.offsetTop;
        }
        c.value.style.margin = `${mt}px 0`, c.value.style.minHeight = `${re}px`, c.value.style.maxHeight = `${O}px`, r("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const w = /* @__PURE__ */ I("");
    Ae(async () => {
      await Ie(), y(), d.value && (w.value = window.getComputedStyle(d.value).zIndex);
    });
    function m(x) {
      x && l.value === !0 && (y(), g?.(), l.value = !1);
    }
    return Cr(s.triggerElement, () => {
      y();
    }), xg({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: m
    }), (x, b) => (k(), ce("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: tt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: w.value
      })
    }, [q(v(Se), de({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...x.$attrs,
      ...n
    }), {
      default: R(() => [J(x.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Cg = Sg, Eg = /* @__PURE__ */ U({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return fc(t.context), pc(yg), (n, r) => J(n.$slots, "default");
  }
}), Tg = Eg;
const Ag = { key: 1 };
var kg = /* @__PURE__ */ U({
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
    const n = t, i = hh(n, e), s = mn(), o = /* @__PURE__ */ I();
    Ae(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ I(), l = L(() => n.forceMount || s.open.value), c = /* @__PURE__ */ I(l.value);
    return xe(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (k(), z(v(Rn), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: R(() => [q(_g, Us(Di({
        ...v(i),
        ...u.$attrs
      })), {
        default: R(() => [J(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (k(), ce("div", Ag, [(k(), z(ql, { to: o.value }, [q(Tg, { context: v(s) }, {
      default: R(() => [J(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : pe("v-if", !0);
  }
}), Pg = kg, Og = /* @__PURE__ */ U({
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
    return (e, n) => (k(), z(v(Se), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: R(() => [J(e.$slots, "default", {}, () => [n[0] || (n[0] = We("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Rg = Og;
const [hc, Ig] = ct("SelectItem");
var Lg = /* @__PURE__ */ U({
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
    const n = t, r = e, { disabled: i } = /* @__PURE__ */ en(n), s = mn(), o = Ki(), { forwardRef: a, currentElement: l } = ge(), { CollectionItem: c } = vn(), u = L(() => Pr(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ I(!1), f = /* @__PURE__ */ I(n.textValue ?? ""), p = Tr(void 0, "reka-select-item-text"), h = "select.select";
    async function g(b) {
      if (b.defaultPrevented) return;
      const C = {
        originalEvent: b,
        value: n.value
      };
      Bi(h, y, C);
    }
    async function y(b) {
      await Ie(), r("select", b), !b.defaultPrevented && (i.value || (s.onValueChange(n.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function w(b) {
      await Ie(), !b.defaultPrevented && (i.value ? o.onItemLeave?.() : b.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function m(b) {
      await Ie(), !b.defaultPrevented && b.currentTarget === ht() && o.onItemLeave?.();
    }
    async function x(b) {
      await Ie(), !(b.defaultPrevented || o.searchRef?.value !== "" && b.key === " ") && (ug.includes(b.key) && g(b), b.key === " " && b.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return Ae(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), Ig({
      value: n.value,
      disabled: i,
      textId: p,
      isSelected: u,
      onItemTextChange: (b) => {
        f.value = ((f.value || b?.textContent) ?? "").trim();
      }
    }), (b, C) => (k(), z(v(c), { value: { textValue: f.value } }, {
      default: R(() => [q(v(Se), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(i) || void 0,
        "data-disabled": v(i) ? "" : void 0,
        tabindex: v(i) ? void 0 : -1,
        as: b.as,
        "as-child": b.asChild,
        onFocus: C[0] || (C[0] = (T) => d.value = !0),
        onBlur: C[1] || (C[1] = (T) => d.value = !1),
        onPointerup: g,
        onPointerdown: C[2] || (C[2] = (T) => {
          T.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: C[3] || (C[3] = cn(() => {
        }, ["prevent", "stop"])),
        onPointermove: w,
        onPointerleave: m,
        onKeydown: x
      }, {
        default: R(() => [J(b.$slots, "default")]),
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
}), Mg = Lg, Dg = /* @__PURE__ */ U({
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
    const e = t, n = hc();
    return (r, i) => v(n).isSelected.value ? (k(), z(v(Se), de({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: R(() => [J(r.$slots, "default")]),
      _: 3
    }, 16)) : pe("v-if", !0);
  }
}), $g = Dg, Bg = /* @__PURE__ */ U({
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
    const e = t, n = mn(), r = Ki(), i = hc(), { forwardRef: s, currentElement: o } = ge(), a = L(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return Ae(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), n.onOptionAdd(a.value));
    }), at(() => {
      n.onOptionRemove(a.value);
    }), (l, c) => (k(), z(v(Se), de({
      id: v(i).textId,
      ref: v(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: R(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Fg = Bg, Ng = /* @__PURE__ */ U({
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
    return (n, r) => (k(), z(v(Ku), Us(Di(e)), {
      default: R(() => [J(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Hg = Ng, qg = /* @__PURE__ */ U({
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
    const e = t, n = mn(), { forwardRef: r, currentElement: i } = ge(), s = L(() => n.disabled?.value || e.disabled);
    n.contentId ||= Tr(void 0, "reka-select-content"), Ae(() => {
      n.onTriggerChange(i.value);
    });
    const { getItems: o } = vn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = fo();
    function u() {
      s.value || (n.onOpenChange(!0), c());
    }
    function d(f) {
      u(), n.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, p) => (k(), z(v(dv), {
      "as-child": "",
      reference: f.reference
    }, {
      default: R(() => [q(v(Se), {
        ref: v(r),
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
        "data-placeholder": v(cg)(v(n).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: p[0] || (p[0] = (h) => {
          h?.currentTarget?.focus();
        }),
        onPointerdown: p[1] || (p[1] = (h) => {
          if (h.pointerType === "touch") return h.preventDefault();
          const g = h.target;
          g.hasPointerCapture(h.pointerId) && g.releasePointerCapture(h.pointerId), h.button === 0 && h.ctrlKey === !1 && (d(h), h.preventDefault());
        }),
        onPointerup: p[2] || (p[2] = cn((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (h) => {
          const g = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && g && h.key === " " || (v(l)(h.key, v(o)()), v(lg).includes(h.key) && (u(), h.preventDefault()));
        })
      }, {
        default: R(() => [J(f.$slots, "default")]),
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
}), zg = qg, Vg = /* @__PURE__ */ U({
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
    const e = t, { forwardRef: n, currentElement: r } = ge(), i = mn();
    Ae(() => {
      i.valueElement = r;
    });
    const s = L(() => {
      let a = [];
      const l = Array.from(i.optionsSet.value), c = (u) => l.find((d) => Pr(u, d.value, i.by));
      return Array.isArray(i.modelValue.value) ? a = i.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(i.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = L(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (k(), z(v(Se), {
      ref: v(n),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: R(() => [J(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: v(i).modelValue.value
      }, () => [We(_e(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Wg = Vg, jg = /* @__PURE__ */ U({
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
    const e = t, { nonce: n } = /* @__PURE__ */ en(e), r = lc(n), i = Ki(), s = i.position === "item-aligned" ? wg() : void 0, { forwardRef: o, currentElement: a } = ge();
    Ae(() => {
      i?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ I(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: p } = s ?? {};
      if (f?.value && p?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const g = window.innerHeight - mt * 2, y = Number.parseFloat(p.value.style.minHeight), w = Number.parseFloat(p.value.style.height), m = Math.max(y, w);
          if (m < g) {
            const x = m + h, b = Math.min(g, x), C = x - b;
            p.value.style.height = `${b}px`, p.value.style.bottom === "0px" && (d.scrollTop = C > 0 ? C : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (k(), ce(Te, null, [q(v(Se), de({
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
      default: R(() => [J(u.$slots, "default")]),
      _: 3
    }, 16), q(v(Se), {
      as: "style",
      nonce: v(r)
    }, {
      default: R(() => d[0] || (d[0] = [We(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Ug = jg;
const Kg = /* @__PURE__ */ U({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (k(), ce("span", {
      class: "speaker-indicator",
      style: tt({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Xg = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", vc = /* @__PURE__ */ nt(Kg, [["styles", [Xg]], ["__scopeId", "data-v-9bffeda8"]]), Yg = { class: "speaker-label" }, Gg = {
  key: 1,
  class: "speaker-name"
}, Jg = ["datetime"], Zg = /* @__PURE__ */ U({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: r } = Ft(), i = L(
      () => io(e.language, r.value, n("language.wildcard"))
    ), s = L(
      () => e.startTime != null ? pi(e.startTime) : null
    ), o = L(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = L(() => e.speaker?.color ?? "transparent");
    return (l, c) => (k(), ce("div", Yg, [
      t.speaker ? (k(), z(vc, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : pe("", !0),
      t.speaker ? (k(), ce("span", Gg, _e(t.speaker.name), 1)) : pe("", !0),
      s.value ? (k(), ce("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, _e(s.value), 9, Jg)) : pe("", !0),
      q(Is, null, {
        default: R(() => [
          We(_e(i.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Qg = ".speaker-label[data-v-0fb7fa1e]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-0fb7fa1e]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-0fb7fa1e]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted)}", ey = /* @__PURE__ */ nt(Zg, [["styles", [Qg]], ["__scopeId", "data-v-0fb7fa1e"]]);
function ty() {
  const t = /* @__PURE__ */ new Map();
  function e(s, o) {
    let a = t.get(s);
    return a || (a = /* @__PURE__ */ new Set(), t.set(s, a)), a.add(o), () => n(s, o);
  }
  function n(s, o) {
    t.get(s)?.delete(o);
  }
  function r(s, o) {
    t.get(s)?.forEach(
      (a) => a(o)
    );
  }
  function i() {
    t.clear();
  }
  return { on: e, off: n, emit: r, clear: i };
}
const za = [
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
function ny(t, e, n) {
  const r = za[t.size % za.length];
  return { id: e, name: n, color: r };
}
function ry(t, e, n) {
  return !e || t.has(e) ? null : ny(t, e, n ?? e);
}
function iy(t, e, n) {
  const r = t.get(e);
  return r ? { ...r, ...n } : null;
}
function sy(t) {
  const e = /* @__PURE__ */ Ai(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = ry(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function r(s, o) {
    const a = iy(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function i() {
    e.clear();
  }
  return { all: e, ensure: n, update: r, clear: i };
}
function oy(t, e) {
  return [...t, e];
}
function ay(t, e) {
  return [...e, ...t];
}
function ly(t, e, n) {
  const r = t.findIndex((s) => s.id === e);
  if (r === -1) return null;
  const i = { ...t[r], ...n, id: e };
  return {
    turns: t.map((s, o) => o === r ? i : s),
    updated: i
  };
}
function uy(t, e) {
  const n = t.findIndex((r) => r.id === e);
  return n === -1 ? null : t.filter((r, i) => i !== n);
}
function cy(t, e, n) {
  const r = t.findIndex((o) => o.id === e);
  if (r === -1) return null;
  const i = t[r], s = {
    ...i,
    words: n,
    text: null,
    startTime: n[0]?.startTime ?? i.startTime,
    endTime: n[n.length - 1]?.endTime ?? i.endTime
  };
  return {
    turns: t.map((o, a) => a === r ? s : o),
    updated: s
  };
}
function dy(t, e, n) {
  const { id: r, languages: i, isSource: s, audio: o } = t, a = /* @__PURE__ */ I(t.turns), l = /* @__PURE__ */ I(!1), c = /* @__PURE__ */ I(!0);
  function u(y) {
    n(y.speakerId), a.value = oy(a.value, y), e("turn:add", { turn: y, translationId: r });
  }
  function d(y, w) {
    const m = ly(a.value, y, w);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: r }));
  }
  function f(y) {
    const w = uy(a.value, y);
    w && (a.value = w, e("turn:remove", { turnId: y, translationId: r }));
  }
  function p(y, w) {
    const m = cy(a.value, y, w);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: r }));
  }
  function h(y) {
    const w = /* @__PURE__ */ new Set();
    for (const m of y)
      m.speakerId && !w.has(m.speakerId) && (w.add(m.speakerId), n(m.speakerId));
    a.value = ay(a.value, y), e("turns:prepend", { turns: y, translationId: r });
  }
  function g(y) {
    const w = /* @__PURE__ */ new Set();
    for (const m of y)
      m.speakerId && !w.has(m.speakerId) && (w.add(m.speakerId), n(m.speakerId));
    a.value = y, e("translation:sync", { translationId: r });
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: a, isLoadingHistory: l, hasMoreHistory: c, addTurn: u, prependTurns: h, updateTurn: d, removeTurn: f, updateWords: p, setTurns: g };
}
function Va(t, e, n) {
  const { id: r, name: i, description: s, duration: o } = t, a = /* @__PURE__ */ Ai(/* @__PURE__ */ new Map());
  let l;
  for (const f of t.translations) {
    const p = dy(f, e, n);
    a.set(f.id, p), f.isSource && !l && (l = p);
  }
  l || (l = a.values().next().value);
  const c = /* @__PURE__ */ I(null), u = L(() => c.value ? a.get(c.value) ?? l : l);
  function d(f) {
    const p = f === l.id ? null : f;
    p !== c.value && (c.value = p, e("translation:change", { translationId: c.value }));
  }
  return {
    id: r,
    name: i,
    description: s,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: u,
    setActiveTranslation: d
  };
}
function fy(t) {
  const e = [];
  for (const [n, r] of t.speakers)
    e.push({ id: n, name: r.name });
  for (const n of t.channels)
    for (const r of n.translations)
      for (const i of r.turns)
        i.speakerId && e.push({ id: i.speakerId, name: i.speakerId });
  return e;
}
function py(t = {}) {
  const e = /* @__PURE__ */ I(""), n = /* @__PURE__ */ I(t.activeChannelId ?? ""), r = /* @__PURE__ */ I(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: a } = ty(), l = sy(o), c = l, u = /* @__PURE__ */ Ai(/* @__PURE__ */ new Map()), d = L(
    () => u.get(n.value) ?? [...u.values()][0]
  );
  function f(C, T) {
    return i(C, (E) => {
      E.translationId === d.value.activeTranslation.value.id && T(E);
    });
  }
  function p(C) {
    e.value = C.title, l.clear(), u.clear();
    for (const T of fy(C))
      c.ensure(T.id, T.name);
    for (const T of C.channels)
      u.set(T.id, Va(T, o, c.ensure));
    u.size > 0 && !u.has(n.value) && (n.value = u.keys().next().value);
  }
  function h(C) {
    Ip(C), p(C);
  }
  function g(C) {
    C !== n.value && (n.value = C, o("channel:change", { channelId: C }));
  }
  function y(C, T) {
    if (!u.has(C)) return;
    const E = /* @__PURE__ */ new Set();
    for (const O of T.translations)
      for (const A of O.turns)
        A.speakerId && !E.has(A.speakerId) && (E.add(A.speakerId), c.ensure(A.speakerId));
    u.set(C, Va(T, o, c.ensure)), o("channel:sync", { channelId: C });
  }
  const w = [];
  function m(C) {
    const T = C.install(b);
    T && w.push(T);
  }
  function x() {
    o("destroy", void 0), w.forEach((C) => C()), w.length = 0, a();
  }
  t.document && p(t.document);
  const b = {
    title: e,
    activeChannelId: n,
    capabilities: r,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: f,
    setDocument: h,
    setActiveChannel: g,
    setChannel: y,
    on: i,
    off: s,
    emit: o,
    use: m,
    destroy: x
  };
  return b;
}
const mc = /* @__PURE__ */ Symbol("editorStore");
function hy(t) {
  Mr(mc, t);
}
function Ln() {
  const t = un(mc);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const vy = ["data-turn-active"], my = { class: "turn-text" }, gy = ["data-word-active"], yy = /* @__PURE__ */ U({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Ln(), r = L(() => e.turn.words.length > 0), i = L(() => {
      if (!n.audio?.src.value || !r.value) return null;
      const a = n.audio.currentTime.value, { startTime: l, endTime: c, words: u } = e.turn;
      return l == null || c == null || a < l || a > c ? null : Mp(u, a);
    }), s = L(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Ou(e.turn.words)) return !1;
      const a = n.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), o = L(() => e.speaker?.color ?? "transparent");
    return (a, l) => (k(), ce("section", {
      class: dn(["turn", { "turn--active": s.value, "turn--partial": t.partial }]),
      "data-turn-active": s.value || t.partial || t.live || void 0,
      style: tt({ "--speaker-color": o.value })
    }, [
      t.partial ? pe("", !0) : (k(), z(ey, {
        key: 0,
        speaker: t.speaker,
        "start-time": t.turn.startTime,
        language: t.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      le("p", my, [
        r.value ? (k(!0), ce(Te, { key: 0 }, On(t.turn.words, (c, u) => (k(), ce(Te, {
          key: c.id
        }, [
          le("span", {
            class: dn({ "word--active": c.id === i.value }),
            "data-word-active": c.id === i.value || void 0
          }, _e(c.text), 11, gy),
          We(_e(u < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (k(), ce(Te, { key: 1 }, [
          We(_e(t.turn.text), 1)
        ], 64)) : pe("", !0)
      ])
    ], 14, vy));
  }
}), by = ".turn[data-v-bf56e6fe]{padding:var(--spacing-sm) var(--spacing-lg)}.turn+.turn[data-v-bf56e6fe]{margin-top:var(--spacing-sm)}.turn-text[data-v-bf56e6fe]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-secondary)}.turn--active[data-v-bf56e6fe]{border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent)}.word--active[data-v-bf56e6fe]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-bf56e6fe]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-bf56e6fe .2s ease}@keyframes partial-fade-in-bf56e6fe{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-bf56e6fe]{animation:none}}@media(max-width:767px){.turn[data-v-bf56e6fe]{padding:var(--spacing-sm) var(--spacing-md)}}", Wa = /* @__PURE__ */ nt(yy, [["styles", [by]], ["__scopeId", "data-v-bf56e6fe"]]);
function _y({
  panelRef: t,
  isPrepending: e
}) {
  const n = /* @__PURE__ */ I(!0), r = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let i = null;
  function s() {
    if (!n.value || e?.value || !i) return;
    const u = i.querySelector("[data-word-active]") ?? i.querySelector("[data-turn-active]");
    if (!u) return;
    const d = u.getBoundingClientRect(), f = i.getBoundingClientRect(), p = i.scrollTop + (d.top - f.top) - i.clientHeight / 2 + d.height / 2;
    i.scrollTo({
      top: p,
      behavior: r.matches ? "auto" : "smooth"
    });
  }
  const o = Pu(s);
  function a() {
    i && (n.value = i.scrollHeight - i.scrollTop < i.clientHeight + 150);
  }
  function l() {
    n.value = !0, s();
  }
  let c;
  return Ae(() => {
    i = t.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, i && (i.scrollTop = i.scrollHeight, i.addEventListener("scroll", a, { passive: !0 }), c = new MutationObserver(o), c.observe(i, {
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-word-active", "data-turn-active"],
      childList: !0,
      characterData: !0
    }));
  }), Pn(() => {
    i && (i.removeEventListener("scroll", a), i = null), c?.disconnect();
  }), {
    isFollowing: /* @__PURE__ */ mr(n),
    resumeFollow: l
  };
}
const wy = {
  ref: "panel",
  class: "transcription-panel"
}, xy = { class: "turns-container" }, Sy = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Cy = {
  key: 1,
  class: "history-start"
}, Ey = /* @__PURE__ */ U({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = Ft(), r = Ln(), i = br("panel"), s = L(() => {
      const m = r.live?.partial.value ?? null;
      return m === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: m,
        words: [],
        language: r.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = L(() => r.live?.hasLiveUpdate.value ?? !1), a = L(() => r.audio?.isPlaying.value ?? !1), l = L(() => r.activeChannel.value.activeTranslation.value), c = L(() => l.value.isLoadingHistory.value), u = L(() => l.value.hasMoreHistory.value), d = /* @__PURE__ */ I(!1);
    let f = null;
    const p = Pu(() => {
      const m = l.value;
      m.hasMoreHistory.value && (m.isLoadingHistory.value || e.turns.length !== 0 && r.emit("scroll:top", { translationId: m.id }));
    }, 500);
    function h() {
      f && f.scrollTop < 100 && p();
    }
    let g;
    Ae(() => {
      f = i.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, f && f.addEventListener("scroll", h, { passive: !0 }), g = r.on("turns:prepend", () => {
        if (!f) return;
        const m = f.scrollHeight;
        d.value = !0, Ie(() => {
          if (!f) return;
          const x = f.scrollHeight - m;
          f.scrollTop += x, d.value = !1;
        });
      });
    }), Pn(() => {
      f && (f.removeEventListener("scroll", h), f = null), g?.();
    });
    const { isFollowing: y, resumeFollow: w } = _y({ panelRef: i, isPrepending: d });
    return (m, x) => (k(), ce("article", wy, [
      q(v(Fm), { class: "scroll-root" }, {
        default: R(() => [
          q(v(ag), { class: "scroll-viewport" }, {
            default: R(() => [
              le("div", xy, [
                c.value ? (k(), ce("div", Sy, [...x[0] || (x[0] = [
                  le("progress", null, null, -1)
                ])])) : pe("", !0),
                !u.value && t.turns.length > 0 ? (k(), ce("div", Cy, _e(v(n)("transcription.historyStart")), 1)) : pe("", !0),
                (k(!0), ce(Te, null, On(t.turns, (b, C) => (k(), z(Wa, {
                  key: b.id,
                  turn: b,
                  speaker: b.speakerId ? t.speakers.get(b.speakerId) : void 0,
                  live: o.value && !s.value && C === t.turns.length - 1
                }, null, 8, ["turn", "speaker", "live"]))), 128)),
                s.value ? (k(), z(Wa, {
                  key: "__partial__",
                  turn: s.value,
                  partial: ""
                }, null, 8, ["turn"])) : pe("", !0)
              ])
            ]),
            _: 1
          }),
          q(v(eg), {
            class: "scrollbar",
            orientation: "vertical"
          }, {
            default: R(() => [
              q(v(sg), { class: "scrollbar-thumb" })
            ]),
            _: 1
          }),
          q(Rf, { name: "fade-slide" }, {
            default: R(() => [
              !v(y) && (a.value || o.value) ? (k(), z(It, {
                key: 0,
                size: "sm",
                class: "resume-scroll-btn",
                "aria-label": v(n)("transcription.resumeScroll"),
                onClick: v(w)
              }, {
                icon: R(() => [
                  q(v(fp), { size: 14 })
                ]),
                default: R(() => [
                  We(" " + _e(v(n)("transcription.resumeScroll")), 1)
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])) : pe("", !0)
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 512));
  }
}), Ty = ".transcription-panel[data-v-98845391]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-root[data-v-98845391]{height:100%;overflow:hidden;position:relative}.scroll-viewport[data-v-98845391]{height:100%;width:100%}[data-v-98845391] [data-reka-scroll-area-viewport]{height:100%;max-height:100%}.turns-container[data-v-98845391]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.history-loading[data-v-98845391]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-98845391]{width:120px}.history-start[data-v-98845391]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.scrollbar[data-v-98845391]{display:flex;touch-action:none;-webkit-user-select:none;user-select:none;padding:var(--spacing-xxs);width:8px;transition:background-color .15s}.scrollbar[data-v-98845391]:hover{background-color:var(--color-border-light)}.scrollbar-thumb[data-v-98845391]{flex:1;background-color:var(--color-text-muted);border-radius:var(--radius-lg);opacity:.4;transition:opacity .15s;position:relative}.scrollbar-thumb[data-v-98845391]:hover{opacity:.6}.resume-scroll-btn[data-v-98845391]{position:absolute;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:10;background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:0 4px 12px #0000001f}.fade-slide-enter-active[data-v-98845391],.fade-slide-leave-active[data-v-98845391]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-98845391],.fade-slide-leave-to[data-v-98845391]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-98845391],.fade-slide-leave-active[data-v-98845391]{transition:none}}@media(max-width:767px){.turns-container[data-v-98845391]{padding:var(--spacing-md)}}", Ay = /* @__PURE__ */ nt(Ey, [["styles", [Ty]], ["__scopeId", "data-v-98845391"]]), ky = { class: "switch" }, Py = ["id", "checked"], Oy = ["for"], Ry = /* @__PURE__ */ U({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, r = e, i = n.id ?? Kl();
    return (s, o) => (k(), ce("div", ky, [
      le("input", {
        type: "checkbox",
        id: v(i),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, Py),
      le("label", { for: v(i) }, [...o[1] || (o[1] = [
        le("div", { class: "switch-slider" }, null, -1)
      ])], 8, Oy)
    ]));
  }
}), Iy = ".switch[data-v-64fc0914]{display:inline-block;flex-shrink:0}.switch input[data-v-64fc0914]{display:none}.switch label[data-v-64fc0914]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color .15s}.switch .switch-slider[data-v-64fc0914]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:#fff;transition:left .15s}.switch input:checked+label[data-v-64fc0914]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-64fc0914]{left:20px;border-color:var(--color-primary)}", Ly = /* @__PURE__ */ nt(Ry, [["styles", [Iy]], ["__scopeId", "data-v-64fc0914"]]), My = "(max-width: 767px)";
function gc() {
  const t = /* @__PURE__ */ I(!1);
  let e = null;
  function n(r) {
    t.value = r.matches;
  }
  return Ae(() => {
    e = window.matchMedia(My), t.value = e.matches, e.addEventListener("change", n);
  }), Pn(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Dy = { class: "sidebar-select" }, $y = /* @__PURE__ */ U({
  __name: "SidebarSelectDropdown",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e;
    return (r, i) => (k(), ce("div", Dy, [
      q(v(pg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": i[0] || (i[0] = (s) => n("update:selectedValue", s))
      }, {
        default: R(() => [
          q(v(zg), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: R(() => [
              q(v(Wg), { class: "sidebar-select-trigger-label" }),
              q(v(Rg), null, {
                default: R(() => [
                  q(v(pp), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          q(v(Hg), { disabled: "" }, {
            default: R(() => [
              q(v(Pg), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: R(() => [
                  q(v(Ug), null, {
                    default: R(() => [
                      (k(!0), ce(Te, null, On(t.items, (s) => (k(), z(v(Mg), {
                        key: s.value,
                        value: s.value,
                        class: "sidebar-select-item"
                      }, {
                        default: R(() => [
                          q(v($g), { class: "sidebar-select-item-indicator" }, {
                            default: R(() => [
                              q(v(Cu), { size: 14 })
                            ]),
                            _: 1
                          }),
                          q(v(Fg), null, {
                            default: R(() => [
                              We(_e(s.label), 1)
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
}), By = { class: "sidebar-select" }, Fy = ["aria-label"], Ny = { class: "sidebar-select-trigger-label" }, Hy = 7, qy = /* @__PURE__ */ U({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, r = e, { t: i } = Ft(), s = /* @__PURE__ */ I(!1), o = L(
      () => n.items.find((l) => l.value === n.selectedValue)?.label ?? ""
    );
    function a(l) {
      r("update:selectedValue", l), s.value = !1;
    }
    return (l, c) => (k(), ce("div", By, [
      le("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: c[0] || (c[0] = (u) => s.value = !0)
      }, [
        le("span", Ny, _e(o.value), 1)
      ], 8, Fy),
      q(v(Nu), {
        open: s.value,
        "onUpdate:open": c[2] || (c[2] = (u) => s.value = u)
      }, {
        default: R(() => [
          q(v(Xu), { disabled: "" }, {
            default: R(() => [
              q(v(Uu), { class: "editor-overlay" }),
              q(v(ju), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: R(() => [
                  q(v(Yu), { class: "sr-only" }, {
                    default: R(() => [
                      We(_e(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  c[3] || (c[3] = le("div", { class: "sheet-handle" }, null, -1)),
                  q(v(Cm), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": c[1] || (c[1] = (u) => a(u))
                  }, {
                    default: R(() => [
                      t.items.length > Hy ? (k(), z(v(km), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: v(i)("select.filter")
                      }, null, 8, ["placeholder"])) : pe("", !0),
                      q(v(Tm), { class: "sheet-list" }, {
                        default: R(() => [
                          (k(!0), ce(Te, null, On(t.items, (u) => (k(), z(v(Lm), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: R(() => [
                              q(v(Dm), { class: "sheet-item-indicator" }, {
                                default: R(() => [
                                  q(v(Cu), { size: 16 })
                                ]),
                                _: 1
                              }),
                              le("span", null, _e(u.label), 1)
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
}), So = /* @__PURE__ */ U({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: r } = gc();
    return (i, s) => v(r) ? (k(), z(qy, de({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), null, 16)) : (k(), z($y, de({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => n("update:selectedValue", o))
    }), null, 16));
  }
}), yc = /* @__PURE__ */ U({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, r = e, { t: i } = Ft(), s = L(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (k(), z(So, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(i)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), zy = { class: "speaker-sidebar" }, Vy = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Wy = { class: "sidebar-title" }, jy = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Uy = { class: "sidebar-title" }, Ky = {
  key: 2,
  class: "sidebar-section"
}, Xy = { class: "sidebar-title" }, Yy = { class: "speaker-list" }, Gy = { class: "speaker-name" }, Jy = {
  key: 3,
  class: "sidebar-section"
}, Zy = { class: "sidebar-title" }, Qy = { class: "subtitle-toggle" }, eb = { class: "subtitle-toggle-label" }, tb = { class: "subtitle-slider" }, nb = { class: "subtitle-slider-label" }, rb = { class: "subtitle-slider-value" }, ib = ["value", "disabled"], sb = /* @__PURE__ */ U({
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
    const e = t, n = Ln(), { t: r, locale: i } = Ft(), s = L(
      () => ku(e.translations, i.value, r("sidebar.originalLanguage"), r("language.wildcard"))
    );
    return (o, a) => (k(), ce("aside", zy, [
      t.channels.length > 1 ? (k(), ce("section", Vy, [
        le("h2", Wy, _e(v(r)("sidebar.channel")), 1),
        q(yc, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : pe("", !0),
      t.translations.length > 1 ? (k(), ce("section", jy, [
        le("h2", Uy, _e(v(r)("sidebar.translation")), 1),
        q(So, {
          items: s.value,
          "selected-value": t.selectedTranslationId,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : pe("", !0),
      t.speakers.length ? (k(), ce("section", Ky, [
        le("h2", Xy, _e(v(r)("sidebar.speakers")), 1),
        le("ul", Yy, [
          (k(!0), ce(Te, null, On(t.speakers, (l) => (k(), ce("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            q(vc, {
              color: l.color
            }, null, 8, ["color"]),
            le("span", Gy, _e(l.name), 1)
          ]))), 128))
        ])
      ])) : pe("", !0),
      v(n).subtitle ? (k(), ce("section", Jy, [
        le("h2", Zy, _e(v(r)("sidebar.subtitle")), 1),
        le("div", Qy, [
          le("span", eb, _e(v(r)("subtitle.show")), 1),
          q(Ly, {
            modelValue: v(n).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => v(n).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        le("label", tb, [
          le("span", nb, [
            We(_e(v(r)("subtitle.fontSize")) + " ", 1),
            le("span", rb, _e(v(n).subtitle.fontSize.value) + "px", 1)
          ]),
          le("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(n).subtitle.fontSize.value,
            disabled: !v(n).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => v(n).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, ib)
        ])
      ])) : pe("", !0)
    ]));
  }
}), ob = ".speaker-sidebar[data-v-587ed426]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-587ed426]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-587ed426]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-587ed426]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-587ed426]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color .15s}.speaker-item[data-v-587ed426]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-587ed426]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-587ed426]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-587ed426]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-587ed426]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-587ed426]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-587ed426]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-587ed426]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-587ed426]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-587ed426]{border-left:none}.sidebar-section--selector[data-v-587ed426]{display:none}}", ja = /* @__PURE__ */ nt(sb, [["styles", [ob]], ["__scopeId", "data-v-587ed426"]]), ab = /* @__PURE__ */ U({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = Xd(t, "open"), { t: n } = Ft();
    return (r, i) => (k(), z(v(Nu), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: R(() => [
        q(v(Xu), { disabled: "" }, {
          default: R(() => [
            q(v(Uu), { class: "editor-overlay" }),
            q(v(ju), { class: "sidebar-drawer" }, {
              default: R(() => [
                q(v(Yu), { class: "sr-only" }, {
                  default: R(() => [
                    We(_e(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(v(kh), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: R(() => [
                    q(v(Eu), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                J(r.$slots, "default")
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
}), lb = { class: "player-controls" }, ub = { class: "controls-left" }, cb = { class: "controls-time" }, db = { class: "time-display" }, fb = { class: "time-display" }, pb = { class: "controls-right" }, hb = ["value", "aria-label", "disabled"], vb = /* @__PURE__ */ U({
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
    const n = e, { t: r } = Ft(), i = /* @__PURE__ */ I(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (k(), ce("div", lb, [
      le("div", ub, [
        q(It, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, {
          icon: R(() => [
            q(v(gp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(It, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": t.isPlaying ? v(r)("player.pause") : v(r)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, {
          icon: R(() => [
            t.isPlaying ? (k(), z(v(hp), {
              key: 0,
              size: 20
            })) : (k(), z(v(vp), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(It, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, {
          icon: R(() => [
            q(v(yp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      le("div", cb, [
        le("time", db, _e(t.currentTime), 1),
        a[7] || (a[7] = le("span", { class: "time-separator" }, "/", -1)),
        le("time", fb, _e(t.duration), 1)
      ]),
      le("div", pb, [
        le("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          q(It, {
            variant: "ghost",
            size: "md",
            "aria-label": t.isMuted ? v(r)("player.unmute") : v(r)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, {
            icon: R(() => [
              t.isMuted ? (k(), z(v(wp), {
                key: 0,
                size: 16
              })) : (k(), z(v(_p), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          md(le("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": v(r)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, hb), [
            [Bf, i.value]
          ])
        ], 32),
        q(It, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(r)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: R(() => [
            We(_e(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), mb = ".player-controls[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-02ebaa64]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-02ebaa64]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-02ebaa64]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-02ebaa64]:disabled{opacity:.5;cursor:default}.play-button[data-v-02ebaa64]{width:40px;height:40px}.speed-button[data-v-02ebaa64]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-02ebaa64],.volume-slider[data-v-02ebaa64]{display:none}.player-controls[data-v-02ebaa64]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", gb = /* @__PURE__ */ nt(vb, [["styles", [mb]], ["__scopeId", "data-v-02ebaa64"]]);
function Ye(t, e, n, r) {
  return new (n || (n = Promise))((function(i, s) {
    function o(c) {
      try {
        l(r.next(c));
      } catch (u) {
        s(u);
      }
    }
    function a(c) {
      try {
        l(r.throw(c));
      } catch (u) {
        s(u);
      }
    }
    function l(c) {
      var u;
      c.done ? i(c.value) : (u = c.value, u instanceof n ? u : new n((function(d) {
        d(u);
      }))).then(o, a);
    }
    l((r = r.apply(t, e || [])).next());
  }));
}
let Nr = class {
  constructor() {
    this.listeners = {};
  }
  on(e, n, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...s) => {
        this.un(e, i), n(...s);
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
const Yr = { decode: function(t, e) {
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
    if (i.some(((s) => s > 1 || s < -1))) {
      const s = i.length;
      let o = 0;
      for (let a = 0; a < s; a++) {
        const l = Math.abs(i[a]);
        l > o && (o = l);
      }
      for (const a of r) for (let l = 0; l < s; l++) a[l] /= o;
    }
  })(t);
  const n = t.map(((r) => r instanceof Float32Array ? r : Float32Array.from(r)));
  return { duration: e, length: n[0].length, sampleRate: n[0].length / e, numberOfChannels: n.length, getChannelData: (r) => {
    const i = n[r];
    if (!i) throw new Error(`Channel ${r} not found`);
    return i;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function bc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(bc(s, o));
  else r === "style" ? Object.assign(n.style, i) : r === "textContent" ? n.textContent = i : n.setAttribute(r, i.toString());
  return n;
}
function Ua(t, e, n) {
  const r = bc(t, e || {});
  return n?.appendChild(r), r;
}
var yb = Object.freeze({ __proto__: null, createElement: Ua, default: Ua });
const bb = { fetchBlob: function(t, e, n) {
  return Ye(this, void 0, void 0, (function* () {
    const r = yield fetch(t, n);
    if (r.status >= 400) throw new Error(`Failed to fetch ${t}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Ye(this, void 0, void 0, (function* () {
        if (!i.body || !i.headers) return;
        const o = i.body.getReader(), a = Number(i.headers.get("Content-Length")) || 0;
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
    })(r.clone(), e), r.blob();
  }));
} };
function Re(t) {
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
function Cn(t, e) {
  const n = Re(t());
  return e.forEach(((r) => r.subscribe((() => {
    const i = t();
    Object.is(n.value, i) || n.set(i);
  })))), { get value() {
    return n.value;
  }, subscribe: (r) => n.subscribe(r) };
}
function ln(t, e) {
  let n;
  const r = () => {
    n && (n(), n = void 0), n = t();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    n && (n(), n = void 0), i.forEach(((s) => s()));
  };
}
class _b extends Nr {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Re(!1), this._currentTime = Re(0), this._duration = Re(0), this._volume = Re(this.media.volume), this._muted = Re(this.media.muted), this._playbackRate = Re(this.media.playbackRate || 1), this._seeking = Re(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
function wb({ maxTop: t, maxBottom: e, halfHeight: n, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(t * n * r), a = o + Math.round(e * n * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function xb({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: r, canvasHeight: i }) {
  return t === "top" ? 0 : t === "bottom" ? i - r : e - n;
}
function Ka(t, e, n) {
  const r = e - t.left, i = n - t.top;
  return [r / t.width, i / t.height];
}
function _c(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Xa(t, e) {
  if (!_c(e)) return t;
  const n = e.barWidth || 0.5, r = n + (e.barGap || n / 2);
  return r === 0 ? t : Math.floor(t / r) * r;
}
function Ya({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const r = t / e, i = Math.floor(r * n);
  return [i - 1, i, i + 1];
}
function wc(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Sb(t) {
  const e = Re({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Cn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = Cn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: n, bounds: r, cleanup: () => {
    t.removeEventListener("scroll", i), wc(e);
  } };
}
class Cb extends Nr {
  constructor(e, n) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const r = this.parentFromOptionsContainer(e.container);
    this.parent = r;
    const [i, s] = this.initHtml();
    r.appendChild(i), this.container = i, this.scrollContainer = s.querySelector(".scroll"), this.wrapper = s.querySelector(".wrapper"), this.canvasWrapper = s.querySelector(".canvases"), this.progressWrapper = s.querySelector(".progress"), this.cursor = s.querySelector(".cursor"), n && s.appendChild(n), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let n;
    if (typeof e == "string" ? n = document.querySelector(e) : e instanceof HTMLElement && (n = e), !n) throw new Error("Container not found");
    return n;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((n) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Ka(r, n.clientX, n.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Ka(r, n.clientX, n.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Sb(this.scrollContainer);
    const e = ln((() => {
      const { startX: n, endX: r } = this.scrollStream.percentages.value, { left: i, right: s } = this.scrollStream.bounds.value;
      this.emit("scroll", n, r, i, s);
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = Re(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let p = f.clientX, h = f.clientY, g = !1;
        const y = Date.now(), w = n.getBoundingClientRect(), { left: m, top: x } = w, b = (A) => {
          if (A.defaultPrevented || l.size > 1 || c && Date.now() - y < o) return;
          const D = A.clientX, G = A.clientY, M = D - p, W = G - h;
          (g || Math.abs(M) > i || Math.abs(W) > i) && (A.preventDefault(), A.stopPropagation(), g || (a.set({ type: "start", x: p - m, y: h - x }), g = !0), a.set({ type: "move", x: D - m, y: G - x, deltaX: M, deltaY: W }), p = D, h = G);
        }, C = (A) => {
          if (l.delete(A.pointerId), g) {
            const D = A.clientX, G = A.clientY;
            a.set({ type: "end", x: D - m, y: G - x });
          }
          u();
        }, T = (A) => {
          l.delete(A.pointerId), A.relatedTarget && A.relatedTarget !== document.documentElement || C(A);
        }, E = (A) => {
          g && (A.stopPropagation(), A.preventDefault());
        }, O = (A) => {
          A.defaultPrevented || l.size > 1 || g && A.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", C), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", O, { passive: !1 }), document.addEventListener("click", E, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", O), setTimeout((() => {
            document.removeEventListener("click", E, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), n.removeEventListener("pointerdown", d), l.clear(), wc(a);
      } };
    })(this.wrapper);
    const e = ln((() => {
      const n = this.dragStream.signal.value;
      if (!n) return;
      const r = this.wrapper.getBoundingClientRect().width, i = (s = n.x / r) < 0 ? 0 : s > 1 ? 1 : s;
      var s;
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
    return this.timeouts.push(i), () => new Promise(((s, o) => {
      i(), r = o, n = setTimeout((() => {
        n = void 0, r = void 0, s();
      }), e);
    }));
  }
  getHeight(e, n) {
    var r;
    const i = ((r = this.audioData) === null || r === void 0 ? void 0 : r.numberOfChannels) || 1;
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: c = 128 }) {
      if (s == null) return c;
      const u = Number(s);
      if (!isNaN(u)) return u;
      if (s === "auto") {
        const d = a || c;
        return o?.every(((f) => !f.overlay)) ? d / l : d;
      }
      return c;
    })({ optionsHeight: e, optionsSplitChannels: n, parentHeight: this.parent.clientHeight, numberOfChannels: i, defaultHeight: 128 });
  }
  convertColorValues(e, n) {
    return (function(r, i, s) {
      if (!Array.isArray(r)) return r || "";
      if (r.length === 0) return "#999";
      if (r.length < 2) return r[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = s ?? o.height * i, c = a.createLinearGradient(0, 0, 0, l || i), u = 1 / (r.length - 1);
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
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: h, height: g, length: y, options: w, pixelRatio: m }) {
      const x = g / 2, b = w.barWidth ? w.barWidth * m : 1, C = w.barGap ? w.barGap * m : w.barWidth ? b / 2 : 0, T = b + C || 1;
      return { halfHeight: x, barWidth: b, barGap: C, barRadius: w.barRadius || 0, barMinHeight: w.barMinHeight ? w.barMinHeight * m : 0, barIndexScale: y > 0 ? h / T / y : 0, barSpacing: T };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: h, barIndexScale: g, barSpacing: y, barWidth: w, halfHeight: m, vScale: x, canvasHeight: b, barAlign: C, barMinHeight: T }) {
      const E = h[0] || [], O = h[1] || E, A = E.length, D = [];
      let G = 0, M = 0, W = 0;
      for (let H = 0; H <= A; H++) {
        const se = Math.round(H * g);
        if (se > G) {
          const { topHeight: te, totalHeight: Pe } = wb({ maxTop: M, maxBottom: W, halfHeight: m, vScale: x, barMinHeight: T, barAlign: C }), je = xb({ barAlign: C, halfHeight: m, topHeight: te, totalHeight: Pe, canvasHeight: b });
          D.push({ x: G * y, y: je, width: w, height: Pe }), G = se, M = 0, W = 0;
        }
        const re = Math.abs(E[H] || 0), ie = Math.abs(O[H] || 0);
        re > M && (M = re), ie > W && (W = ie);
      }
      return D;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: o, barAlign: n.barAlign, barMinHeight: f });
    r.beginPath();
    for (const h of p) c && "roundRect" in r ? r.roundRect(h.x, h.y, h.width, h.height, c) : r.rect(h.x, h.y, h.width, h.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, n, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, p = l[0] || [];
      return [p, l[1] || p].map(((h, g) => {
        const y = h.length, w = y ? c / y : 0, m = f, x = g === 0 ? -1 : 1, b = [{ x: 0, y: m }];
        let C = 0, T = 0;
        for (let E = 0; E <= y; E++) {
          const O = Math.round(E * w);
          if (O > C) {
            const D = m + (Math.round(T * f * d) || 1) * x;
            b.push({ x: C, y: D }), C = O, T = 0;
          }
          const A = Math.abs(h[E] || 0);
          A > T && (T = A);
        }
        return b.push({ x: C, y: m }), b;
      }));
    })({ channelData: e, width: s, height: o, vScale: i });
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
    const i = (function({ channelData: s, barHeight: o, normalize: a, maxPeak: l }) {
      var c;
      const u = o || 1;
      if (!a) return u;
      const d = s[0];
      if (!d || d.length === 0) return u;
      let f = l ?? 0;
      if (!l) for (let p = 0; p < d.length; p++) {
        const h = (c = d[p]) !== null && c !== void 0 ? c : 0, g = Math.abs(h);
        g > f && (f = g);
      }
      return f ? u / f : u;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    _c(n) ? this.renderBarWaveform(e, n, r, i) : this.renderLineWaveform(e, n, r, i);
  }
  renderSingleCanvas(e, n, r, i, s, o, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(r * l), c.height = Math.round(i * l), c.style.width = `${r}px`, c.style.height = `${i}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (n.renderFunction ? (u.fillStyle = this.convertColorValues(n.waveColor, u), n.renderFunction(e, u)) : this.renderWaveform(e, n, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), f = d.getContext("2d");
      f.drawImage(c, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(n.progressColor, f), f.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, r, i, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = r / a, u = (function({ clientWidth: h, totalWidth: g, options: y }) {
      return Xa(Math.min(8e3, h, g), y);
    })({ clientWidth: l, totalWidth: c, options: n });
    let d = {};
    if (u === 0) return;
    const f = (h) => {
      if (h < 0 || h >= p || d[h]) return;
      d[h] = !0;
      const g = h * u;
      let y = Math.min(c - g, u);
      if (y = Xa(y, n), y <= 0) return;
      const w = (function({ channelData: m, offset: x, clampedWidth: b, totalWidth: C }) {
        return m.map(((T) => {
          const E = Math.floor(x / C * T.length), O = Math.floor((x + b) / C * T.length);
          return T.slice(E, O);
        }));
      })({ channelData: e, offset: g, clampedWidth: y, totalWidth: c });
      this.renderSingleCanvas(w, n, y, i, g, s, o);
    }, p = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let h = 0; h < p; h++) f(h);
      return;
    }
    if (Ya({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: p }).forEach(((h) => f(h))), p > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Ya({ scrollLeft: g, totalWidth: c, numCanvases: p }).forEach(((y) => f(y)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, n, r, i) {
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
    a.style.height = `${l}px`, s && i > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, r, l, a, c);
  }
  render(e) {
    return Ye(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: f, pixelRatio: p }) {
        const h = Math.ceil(c * u), g = h > d, y = !!(f && !g);
        return { scrollWidth: h, isScrollable: g, useParentWidth: y, width: (y ? d : h) * p };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: i, fillParent: this.options.fillParent, pixelRatio: r });
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
    if (this.unsubscribeOnScroll.forEach(((r) => r())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: n } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: r } = this.progressWrapper.getBoundingClientRect(), i = (function(s) {
        const o = 2 * s;
        return (o < 0 ? Math.floor(o) : Math.ceil(o)) / 2;
      })(r - n);
      this.scrollContainer.scrollLeft += i;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, n = !1) {
    const { scrollLeft: r, scrollWidth: i, clientWidth: s } = this.scrollContainer, o = e * i, a = r, l = r + s, c = s / 2;
    if (this.isDragging)
      o + 30 > l ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > l) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? c : 0));
      const u = o - r - c;
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
        const s = Array.from(i).map(((o) => o.toDataURL(e, n)));
        return Promise.resolve(s);
      }
      return Promise.all(Array.from(i).map(((s) => new Promise(((o, a) => {
        s.toBlob(((l) => {
          l ? o(l) : a(new Error("Could not export image"));
        }), e, n);
      })))));
    }));
  }
}
class Eb extends Nr {
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
class hs extends Nr {
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
const Tb = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Or extends _b {
  static create(e) {
    return new Or(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new hs() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Tb, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, p;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Re(0), g = (c = a?.duration) !== null && c !== void 0 ? c : Re(0), y = (u = a?.isPlaying) !== null && u !== void 0 ? u : Re(!1), w = (d = a?.isSeeking) !== null && d !== void 0 ? d : Re(!1), m = (f = a?.volume) !== null && f !== void 0 ? f : Re(1), x = (p = a?.playbackRate) !== null && p !== void 0 ? p : Re(1), b = Re(null), C = Re(null), T = Re(""), E = Re(0), O = Re(0), A = Cn((() => !y.value), [y]), D = Cn((() => b.value !== null), [b]), G = Cn((() => D.value && g.value > 0), [D, g]), M = Cn((() => h.value), [h]), W = Cn((() => g.value > 0 ? h.value / g.value : 0), [h, g]);
      return { state: { currentTime: h, duration: g, isPlaying: y, isPaused: A, isSeeking: w, volume: m, playbackRate: x, audioBuffer: b, peaks: C, url: T, zoom: E, scrollPosition: O, canPlay: D, isReady: G, progress: M, progressPercent: W }, actions: { setCurrentTime: (H) => {
        const se = Math.max(0, Math.min(g.value || 1 / 0, H));
        h.set(se);
      }, setDuration: (H) => {
        g.set(Math.max(0, H));
      }, setPlaying: (H) => {
        y.set(H);
      }, setSeeking: (H) => {
        w.set(H);
      }, setVolume: (H) => {
        const se = Math.max(0, Math.min(1, H));
        m.set(se);
      }, setPlaybackRate: (H) => {
        const se = Math.max(0.1, Math.min(16, H));
        x.set(se);
      }, setAudioBuffer: (H) => {
        b.set(H), H && g.set(H.duration);
      }, setPeaks: (H) => {
        C.set(H);
      }, setUrl: (H) => {
        T.set(H);
      }, setZoom: (H) => {
        E.set(Math.max(0, H));
      }, setScrollPosition: (H) => {
        O.set(Math.max(0, H));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new Eb();
    const s = n ? void 0 : this.getMediaElement();
    this.renderer = new Cb(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      const r = [];
      r.push(ln((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(ln((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(ln((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(ln((() => {
        e.isReady.value && !i && (i = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(ln((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && n.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(ln((() => {
        const o = e.zoom.value;
        o > 0 && n.emit("zoom", o);
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
    this.subscriptions.push(this.renderer.on("click", ((e, n) => {
      this.options.interact && (this.seekTo(e), this.emit("interaction", e * this.getDuration()), this.emit("click", e, n));
    })), this.renderer.on("dblclick", ((e, n) => {
      this.emit("dblclick", e, n);
    })), this.renderer.on("scroll", ((e, n, r, i) => {
      const s = this.getDuration();
      this.emit("scroll", e * s, n * s, r, i);
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
        let s = 0;
        const o = this.options.dragToSeek;
        this.isPlaying() ? s = 0 : o === !0 ? s = 200 : o && typeof o == "object" && (s = (i = o.debounceTime) !== null && i !== void 0 ? i : 200), e = setTimeout((() => {
          this.seekTo(r);
        }), s), this.emit("interaction", r * this.getDuration()), this.emit("drag", r);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Yr.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Yr.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !n && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        n = yield bb.fetchBlob(e, l, a);
        const c = this.options.blobMimeType;
        c && (n = new Blob([n], { type: c }));
      }
      this.setSrc(e, n);
      const o = yield new Promise(((a) => {
        const l = i || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !n) {
        const a = this.getMediaElement();
        a instanceof hs && (a.duration = o);
      }
      if (r) this.decodedData = Yr.createBuffer(r, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield Yr.decode(a, this.options.sampleRate);
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
    const i = Math.min(e, this.decodedData.numberOfChannels), s = [];
    for (let o = 0; o < i; o++) {
      const a = this.decodedData.getChannelData(o), l = [], c = a.length / n;
      for (let u = 0; u < n; u++) {
        const d = a.slice(Math.floor(u * c), Math.ceil((u + 1) * c));
        let f = 0;
        for (let p = 0; p < d.length; p++) {
          const h = d[p];
          Math.abs(h) > Math.abs(f) && (f = h);
        }
        l.push(Math.round(f * r) / r);
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
    const r = Object.create(null, { play: { get: () => super.play } });
    return Ye(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return n != null && (this.media instanceof hs ? this.media.stopAt(n) : this.stopAtPosition = n), i;
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
Or.BasePlugin = class extends Nr {
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
}, Or.dom = yb;
class xc {
  constructor() {
    this.listeners = {};
  }
  on(e, n, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...s) => {
        this.un(e, i), n(...s);
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
class Ab extends xc {
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
function Sc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Sc(s, o));
  else r === "style" ? Object.assign(n.style, i) : r === "textContent" ? n.textContent = i : n.setAttribute(r, i.toString());
  return n;
}
function sr(t, e, n) {
  const r = Sc(t, e || {});
  return n?.appendChild(r), r;
}
function Cc(t) {
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
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    n && (n(), n = void 0), i.forEach(((s) => s()));
  };
}
function Fn(t, e) {
  const n = Cc(null), r = (i) => {
    n.set(i);
  };
  return t.addEventListener(e, r), n._cleanup = () => {
    t.removeEventListener(e, r);
  }, n;
}
function xn(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function ni(t, e = {}) {
  const { threshold: n = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = Cc(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, p = !1;
    const h = Date.now(), g = t.getBoundingClientRect(), { left: y, top: w } = g, m = (E) => {
      if (E.defaultPrevented || o.size > 1 || a && Date.now() - h < i) return;
      const O = E.clientX, A = E.clientY, D = O - d, G = A - f;
      (p || Math.abs(D) > n || Math.abs(G) > n) && (E.preventDefault(), E.stopPropagation(), p || (s.set({ type: "start", x: d - y, y: f - w }), p = !0), s.set({ type: "move", x: O - y, y: A - w, deltaX: D, deltaY: G }), d = O, f = A);
    }, x = (E) => {
      if (o.delete(E.pointerId), p) {
        const O = E.clientX, A = E.clientY;
        s.set({ type: "end", x: O - y, y: A - w });
      }
      l();
    }, b = (E) => {
      o.delete(E.pointerId), E.relatedTarget && E.relatedTarget !== document.documentElement || x(E);
    }, C = (E) => {
      p && (E.stopPropagation(), E.preventDefault());
    }, T = (E) => {
      E.defaultPrevented || o.size > 1 || p && E.preventDefault();
    };
    document.addEventListener("pointermove", m), document.addEventListener("pointerup", x), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", m), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", C, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", c), o.clear(), xn(s);
  } };
}
class Ga extends xc {
  constructor(e, n, r = 0) {
    var i, s, o, a, l, c, u, d, f, p;
    super(), this.totalDuration = n, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = sr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = sr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = ni(r, { threshold: 1 }), o = ni(i, { threshold: 1 }), a = ti((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = ti((() => {
      const c = o.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "end") : c.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), l(), s.cleanup(), o.cleanup();
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
    const i = sr("div", { style: { position: "absolute", top: `${n}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const n = Fn(e, "click"), r = Fn(e, "mouseenter"), i = Fn(e, "mouseleave"), s = Fn(e, "dblclick"), o = Fn(e, "pointerdown"), a = Fn(e, "pointerup"), l = n.subscribe(((y) => y && this.emit("click", y))), c = r.subscribe(((y) => y && this.emit("over", y))), u = i.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), f = o.subscribe(((y) => y && this.toggleCursor(!0))), p = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), p(), xn(n), xn(r), xn(i), xn(s), xn(o), xn(a);
    }));
    const h = ni(e), g = ti((() => {
      const y = h.signal.value;
      y && (y.type === "start" ? this.toggleCursor(!0) : y.type === "move" && y.deltaX !== void 0 ? this.onMove(y.deltaX) : y.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      g(), h.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (y) => this.onContentClick(y), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, n, r) {
    var i;
    if (!(!((i = this.element) === null || i === void 0) && i.parentElement)) return;
    const { width: s } = this.element.parentElement.getBoundingClientRect(), o = e / s * this.totalDuration;
    let a = n && n !== "start" ? this.start : this.start + o, l = n && n !== "end" ? this.end : this.end + o;
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
        this.content = sr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Co extends Ab {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Co(e);
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
    return sr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const n = e.content, r = n.getBoundingClientRect(), i = this.regions.map(((s) => {
        if (s === e || !s.content) return 0;
        const o = s.content.getBoundingClientRect();
        return r.left < o.left + o.width && o.left < r.left + r.width ? o.height : 0;
      })).reduce(((s, o) => s + o), 0);
      n.style.marginTop = `${i}px`;
    }), 10);
  }
  adjustScroll(e) {
    var n, r;
    if (!e.element) return;
    const i = (r = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getWrapper()) === null || r === void 0 ? void 0 : r.parentElement;
    if (!i) return;
    const { clientWidth: s, scrollWidth: o } = i;
    if (o <= s) return;
    const a = i.getBoundingClientRect(), l = e.element.getBoundingClientRect(), c = l.left - a.left, u = l.right - a.left;
    c < 0 ? i.scrollLeft += c : u > s && (i.scrollLeft += u - s);
  }
  virtualAppend(e, n, r) {
    const i = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = n.clientWidth, l = this.wavesurfer.getDuration(), c = Math.round(e.start / l * a), u = c + (Math.round((e.end - e.start) / l * a) || 1) > o && c < o + s;
      u && !r.parentElement ? n.appendChild(r) : !u && r.parentElement && r.remove();
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
    const i = this.wavesurfer.getDuration(), s = (r = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Ga(e, i, s);
    return this.emit("region-initialized", o), i ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      o._setTotalDuration(a), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, n = 3) {
    var r;
    const i = (r = this.wavesurfer) === null || r === void 0 ? void 0 : r.getWrapper();
    if (!(i && i instanceof HTMLElement)) return () => {
    };
    let s = null, o = 0, a = 0;
    const l = ni(i, { threshold: n }), c = ti((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), h = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / g * p;
        const y = f.x / g * p, w = (f.x + 5) / g * p;
        s = new Ga(Object.assign(Object.assign({}, e), { start: y, end: w }), p, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const vs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function kb(t) {
  const { containerRef: e, audioSrc: n, turns: r, speakers: i } = t, s = /* @__PURE__ */ An(null), o = /* @__PURE__ */ An(null), a = /* @__PURE__ */ I(0), l = /* @__PURE__ */ I(0), c = /* @__PURE__ */ I(!1), u = /* @__PURE__ */ I(!1), d = /* @__PURE__ */ I(!1), f = /* @__PURE__ */ I(1), p = /* @__PURE__ */ I(1), h = /* @__PURE__ */ I(!1), g = L(() => pi(a.value)), y = L(() => pi(l.value));
  function w(W, H) {
    M(), d.value = !0, u.value = !1;
    const se = Co.create();
    o.value = se;
    const re = Or.create({
      container: W,
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
      renderFunction: Lp,
      url: H,
      plugins: [se]
    });
    re.on("ready", () => {
      u.value = !0, d.value = !1, l.value = re.getDuration(), m();
    }), re.on("timeupdate", (ie) => {
      a.value = ie;
    }), re.on("play", () => {
      c.value = !0;
    }), re.on("pause", () => {
      c.value = !1;
    }), re.on("finish", () => {
      c.value = !1;
    }), s.value = re;
  }
  function m() {
    const W = o.value;
    if (W) {
      W.clearRegions();
      for (const H of r.value) {
        const se = H.speakerId ? i.value.get(H.speakerId) : void 0;
        if (!se || H.startTime == null || H.endTime == null) continue;
        const re = se.color;
        W.addRegion({
          start: H.startTime,
          end: H.endTime,
          color: Rp(re, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", re);
      }
    }
  }
  function x() {
    s.value?.play();
  }
  function b() {
    s.value?.pause();
  }
  function C() {
    s.value?.playPause();
  }
  function T(W) {
    const H = s.value;
    !H || l.value === 0 || H.setTime(W);
  }
  function E(W) {
    T(Math.max(0, Math.min(a.value + W, l.value)));
  }
  function O(W) {
    const H = s.value;
    H && (f.value = W, H.setVolume(W), W > 0 && h.value && (h.value = !1, H.setMuted(!1)));
  }
  function A() {
    const W = s.value;
    W && (h.value = !h.value, W.setMuted(h.value));
  }
  function D(W) {
    const H = s.value;
    H && (p.value = W, H.setPlaybackRate(W));
  }
  function G() {
    const H = (vs.indexOf(
      p.value
    ) + 1) % vs.length;
    D(vs[H] ?? 1);
  }
  function M() {
    s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  return xe(
    [e, n],
    ([W, H]) => {
      W && H && w(W, H);
    },
    { immediate: !0 }
  ), xe([r, i], () => {
    u.value && m();
  }), Pn(() => {
    M();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: f,
    playbackRate: p,
    isMuted: h,
    formattedCurrentTime: g,
    formattedDuration: y,
    play: x,
    pause: b,
    togglePlay: C,
    seekTo: T,
    skip: E,
    setVolume: O,
    setPlaybackRate: D,
    cyclePlaybackRate: G,
    toggleMute: A
  };
}
const Pb = { class: "audio-player" }, Ob = /* @__PURE__ */ U({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const r = t, i = n, s = /* @__PURE__ */ I(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: f,
      formattedCurrentTime: p,
      formattedDuration: h,
      togglePlay: g,
      seekTo: y,
      pause: w,
      skip: m,
      setVolume: x,
      cyclePlaybackRate: b,
      toggleMute: C
    } = kb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ Jr(() => r.audioSrc),
      turns: /* @__PURE__ */ Jr(() => r.turns),
      speakers: /* @__PURE__ */ Jr(() => r.speakers)
    });
    return xe(f, (T) => i("timeupdate", T)), xe(o, (T) => i("playStateChange", T)), e({ seekTo: y, pause: w }), (T, E) => (k(), ce("footer", Pb, [
      le("div", {
        ref_key: "waveformRef",
        ref: s,
        class: dn(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      q(gb, {
        "is-playing": v(o),
        "current-time": v(p),
        duration: v(h),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(g),
        onSkipBack: E[0] || (E[0] = (O) => v(m)(-10)),
        onSkipForward: E[1] || (E[1] = (O) => v(m)(10)),
        "onUpdate:volume": v(x),
        onToggleMute: v(C),
        onCyclePlaybackRate: v(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Rb = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", Ib = /* @__PURE__ */ nt(Ob, [["styles", [Rb]], ["__scopeId", "data-v-9248e45e"]]);
class Lb {
  diff(e, n, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(n, r), a = this.removeEmpty(this.tokenize(s, r)), l = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, l, r, i);
  }
  diffWithOptionsObj(e, n, r, i) {
    var s;
    const o = (m) => {
      if (m = this.postProcess(m, r), i) {
        setTimeout(function() {
          i(m);
        }, 0);
        return;
      } else
        return m;
    }, a = n.length, l = e.length;
    let c = 1, u = a + l;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(p[0], n, e, 0, r);
    if (p[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, n, e));
    let g = -1 / 0, y = 1 / 0;
    const w = () => {
      for (let m = Math.max(g, -c); m <= Math.min(y, c); m += 2) {
        let x;
        const b = p[m - 1], C = p[m + 1];
        b && (p[m - 1] = void 0);
        let T = !1;
        if (C) {
          const O = C.oldPos - m;
          T = C && 0 <= O && O < a;
        }
        const E = b && b.oldPos + 1 < l;
        if (!T && !E) {
          p[m] = void 0;
          continue;
        }
        if (!E || T && b.oldPos < C.oldPos ? x = this.addToPath(C, !0, !1, 0, r) : x = this.addToPath(b, !1, !0, 1, r), h = this.extractCommon(x, n, e, m, r), x.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(x.lastComponent, n, e)) || !0;
        p[m] = x, x.oldPos + 1 >= l && (y = Math.min(y, m - 1)), h + 1 >= a && (g = Math.max(g, m + 1));
      }
      c++;
    };
    if (i)
      (function m() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          w() || m();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const m = w();
        if (m)
          return m;
      }
  }
  addToPath(e, n, r, i, s) {
    const o = e.lastComponent;
    return o && !s.oneChangePerToken && o.added === n && o.removed === r ? {
      oldPos: e.oldPos + i,
      lastComponent: { count: o.count + 1, added: n, removed: r, previousComponent: o.previousComponent }
    } : {
      oldPos: e.oldPos + i,
      lastComponent: { count: 1, added: n, removed: r, previousComponent: o }
    };
  }
  extractCommon(e, n, r, i, s) {
    const o = n.length, a = r.length;
    let l = e.oldPos, c = l - i, u = 0;
    for (; c + 1 < o && l + 1 < a && this.equals(r[l + 1], n[c + 1], s); )
      c++, l++, u++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return u && !s.oneChangePerToken && (e.lastComponent = { count: u, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, c;
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
    let s;
    for (; e; )
      i.push(e), s = e.previousComponent, delete e.previousComponent, e = s;
    i.reverse();
    const o = i.length;
    let a = 0, l = 0, c = 0;
    for (; a < o; a++) {
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
class Mb extends Lb {
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
const Db = new Mb();
function $b(t, e, n) {
  return Db.diff(t, e, n);
}
function ms({ previousText: t, previousIndexes: e }, n, r) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const i = t.split(" "), s = n.split(" "), o = $b(i, s, {
    comparator: Fb
  }), a = Bb(o), l = [...e];
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
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const h = Ec(
      f,
      r
    ).map(
      (g) => g + d
    );
    c = c.concat(h);
  }
  return {
    previousIndexes: c,
    previousText: n
  };
}
function Bb(t) {
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
function Ec(t, e) {
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
      Ec(
        n.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function Fb(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(n.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    n[a] === r[a] && s++;
  return s / n.length > 0.8;
}
class Nb {
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
    font: s = "Arial",
    paddingInline: o = 100
  } = {}) {
    this.canvas = e, this.fontSize = n, this.lineHeight = r, this.color = i, this.font = s, this.paddingInline = o, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
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
class Hb extends Nb {
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
    this.resetAll(), this.currentState = ms(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = ms(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = ms(
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
function Tc(t) {
  const e = Ln();
  let n = null;
  Ae(() => {
    t.canvasRef.value && (n = new Hb(t.canvasRef.value, {
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
  const s = e.on("translation:sync", i), o = e.on("channel:sync", i);
  at(() => {
    r(), s(), o(), n?.dispose(), n = null;
  });
}
const qb = ["height"], zb = /* @__PURE__ */ U({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Ln(), n = br("canvas"), r = L(() => e.subtitle?.fontSize.value ?? 40), i = L(() => 1.2 * r.value), s = L(() => 2.4 * r.value);
    return Tc({
      canvasRef: n,
      fontSize: r.value,
      lineHeight: i.value
    }), (o, a) => (k(), ce("div", {
      class: "subtitle-banner",
      style: tt({ height: s.value + "px" })
    }, [
      le("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, qb)
    ], 4));
  }
}), Vb = ".subtitle-banner[data-v-02298bf5]{flex-shrink:0;background-color:#000;overflow:hidden}.subtitle-canvas[data-v-02298bf5]{display:block;width:100%;height:100%}", Wb = /* @__PURE__ */ nt(zb, [["styles", [Vb]], ["__scopeId", "data-v-02298bf5"]]), jb = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Ub = ["aria-label"], Kb = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Ja = 48, Xb = /* @__PURE__ */ U({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Ln(), { t: n } = Ft(), r = br("container"), i = br("canvas");
    Tc({
      canvasRef: i,
      fontSize: Ja,
      lineHeight: 1.2 * Ja
    }), Ae(async () => {
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
    function s() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    Ae(() => {
      document.addEventListener("fullscreenchange", s);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return at(() => {
      document.removeEventListener("fullscreenchange", s);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (k(), ce("div", jb, [
      le("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        q(v(Eu), { size: 24 })
      ], 8, Ub),
      le("canvas", Kb, null, 512)
    ], 512));
  }
}), Yb = ".subtitle-fullscreen[data-v-0dd47a7b]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:#000}.subtitle-fullscreen__close[data-v-0dd47a7b]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:#fff;border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color .15s ease}.subtitle-fullscreen__close[data-v-0dd47a7b]:hover,.subtitle-fullscreen__close[data-v-0dd47a7b]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-0dd47a7b]{display:block;width:100%;height:100%}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-0dd47a7b]{transition:none}}", Gb = /* @__PURE__ */ nt(Xb, [["styles", [Yb]], ["__scopeId", "data-v-0dd47a7b"]]), Jb = { class: "editor-layout" }, Zb = { class: "editor-body" }, Qb = {
  key: 4,
  class: "mobile-selectors"
}, e0 = /* @__PURE__ */ U({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Ln(), { t: r, locale: i } = Ft(), { isMobile: s } = gc(), o = /* @__PURE__ */ I(!1), a = L(() => n.activeChannel.value.activeTranslation.value.turns.value), l = n.speakers.all, c = L(() => [...n.channels.values()]), u = L(() => [...n.activeChannel.value.translations.values()]), d = L(() => n.activeChannel.value.activeTranslation.value.id), f = L(() => Array.from(l.values())), p = br("audioPlayer");
    function h(m) {
      n.audio && (n.audio.currentTime.value = m);
    }
    xe(
      () => n.activeChannelId.value,
      () => {
        p.value?.pause(), n.audio && (n.audio.currentTime.value = 0, n.audio.isPlaying.value = !1), o.value = !1;
      }
    ), n.audio && n.audio.setSeekHandler((m) => p.value?.seekTo(m));
    const g = L(
      () => ku(
        u.value,
        i.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    function y(m) {
      n.setActiveChannel(m);
    }
    function w(m) {
      n.activeChannel.value.setActiveTranslation(m);
    }
    return (m, x) => (k(), ce("div", Jb, [
      e.showHeader ? (k(), z(Vp, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value.duration,
        language: d.value,
        "is-mobile": v(s),
        onToggleSidebar: x[0] || (x[0] = (b) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : pe("", !0),
      le("main", Zb, [
        q(Ay, {
          turns: a.value,
          speakers: v(l)
        }, null, 8, ["turns", "speakers"]),
        v(s) ? pe("", !0) : (k(), z(ja, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": y,
          "onUpdate:selectedTranslationId": w
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        q(ab, {
          open: o.value,
          "onUpdate:open": x[1] || (x[1] = (b) => o.value = b)
        }, {
          default: R(() => [
            q(ja, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": y,
              "onUpdate:selectedTranslationId": w
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])
      ]),
      v(n).audio?.src.value ? (k(), z(Ib, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: a.value,
        speakers: v(l),
        onTimeupdate: h,
        onPlayStateChange: x[2] || (x[2] = (b) => {
          v(n).audio && (v(n).audio.isPlaying.value = b);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : pe("", !0),
      v(n).subtitle?.isVisible.value && !v(s) && !v(n).subtitle.isFullscreen.value ? (k(), z(Wb, { key: 2 })) : pe("", !0),
      v(n).subtitle?.isFullscreen.value ? (k(), z(Gb, { key: 3 })) : pe("", !0),
      v(s) ? (k(), ce("div", Qb, [
        c.value.length > 1 ? (k(), z(yc, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": y
        }, null, 8, ["channels", "selected-channel-id"])) : pe("", !0),
        u.value.length > 1 ? (k(), z(So, {
          key: 1,
          items: g.value,
          "selected-value": d.value,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": w
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : pe("", !0)
      ])) : pe("", !0)
    ]));
  }
}), t0 = ".editor-layout[data-v-9a2a971d]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-9a2a971d]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-9a2a971d]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-9a2a971d]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-9a2a971d]{grid-template-columns:1fr}}", n0 = /* @__PURE__ */ nt(e0, [["styles", [t0]], ["__scopeId", "data-v-9a2a971d"]]);
function r0() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ I(0), n = /* @__PURE__ */ I(!1);
      let r = null;
      const i = L(
        () => t.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function s(l) {
        r?.(l);
      }
      function o(l) {
        r = l;
      }
      const a = {
        currentTime: e,
        isPlaying: n,
        src: i,
        seekTo: s,
        setSeekHandler: o
      };
      return t.audio = a, () => {
        t.audio = void 0;
      };
    }
  };
}
const i0 = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', s0 = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .75rem;--font-size-sm: .8125rem;--font-size-base: 1rem;--font-size-lg: 1.125rem;--font-size-xl: 1.5rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 260px;--header-height: 56px;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}', o0 = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:50;animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:51;background-color:var(--color-surface);box-shadow:-4px 0 16px #00000026;animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}", a0 = ".sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:0 4px 12px #0000001a;z-index:100;min-width:var(--reka-select-trigger-width);overflow:hidden;padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color .15s}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:51;border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:0 -4px 16px #00000026;overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}";
function gs(t) {
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
function f0() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ An(null), n = /* @__PURE__ */ I(!1);
      n.value = !0;
      function r() {
        e.value = null, Io(e);
      }
      function i(m, x) {
        if (t.activeChannelId.value !== x) return;
        const b = t.activeChannel.value.activeTranslation.value;
        if (b.isSource) {
          if (m.text == null) return;
          e.value = m.text;
        } else if (m.translations) {
          const C = m.translations.find(
            (T) => T.translationId === b.id
          );
          e.value = C?.text ?? null;
        } else
          return;
        Io(e);
      }
      let s = null;
      function o() {
        s === null && (s = setTimeout(() => {
          s = null, r();
        }, 150));
      }
      function a() {
        s !== null && (clearTimeout(s), s = null);
      }
      function l(m, x) {
        m.speakerId && t.speakers.ensure(m.speakerId);
        const b = t.channels.get(x);
        if (m.text != null && b) {
          const C = gs(m), T = b.sourceTranslation;
          T.turns.value.some(
            (O) => O.id === m.turnId
          ) ? T.updateTurn(m.turnId, C) : T.addTurn(C);
        }
        if (m.translations && b)
          for (const C of m.translations) {
            const T = b.translations.get(C.translationId);
            if (!T) continue;
            const E = {
              id: m.turnId,
              speakerId: m.speakerId,
              text: C.text,
              words: [],
              startTime: m.startTime,
              endTime: m.endTime,
              language: C.language
            };
            T.turns.value.some(
              (A) => A.id === m.turnId
            ) ? T.updateTurn(m.turnId, E) : T.addTurn(E);
          }
        d();
      }
      function c(m, x) {
        m.speakerId && t.speakers.ensure(m.speakerId);
        const b = t.channels.get(x);
        if (b) {
          if (m.text != null) {
            const C = gs(m);
            b.sourceTranslation.prependTurns([C]);
          }
          if (m.translations)
            for (const C of m.translations) {
              const T = b.translations.get(C.translationId);
              if (!T) continue;
              const E = {
                id: m.turnId,
                speakerId: m.speakerId,
                text: C.text,
                words: [],
                startTime: m.startTime,
                endTime: m.endTime,
                language: C.language
              };
              T.prependTurns([E]);
            }
        }
      }
      function u(m, x) {
        const b = t.channels.get(x);
        if (!b) return;
        const C = /* @__PURE__ */ new Set();
        for (const O of m)
          O.speakerId && !C.has(O.speakerId) && (C.add(O.speakerId), t.speakers.ensure(O.speakerId));
        const T = [];
        for (const O of m)
          O.text != null && T.push(gs(O));
        T.length > 0 && b.sourceTranslation.prependTurns(T);
        const E = /* @__PURE__ */ new Map();
        for (const O of m)
          if (O.translations)
            for (const A of O.translations) {
              let D = E.get(A.translationId);
              D || (D = [], E.set(A.translationId, D)), D.push({
                id: O.turnId,
                speakerId: O.speakerId,
                text: A.text,
                words: [],
                startTime: O.startTime,
                endTime: O.endTime,
                language: A.language
              });
            }
        for (const [O, A] of E) {
          const D = b.translations.get(O);
          D && D.prependTurns(A);
        }
      }
      function d() {
        a(), r();
      }
      function f(m) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const p = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: i,
        onFinal: l,
        prependFinal: c,
        prependFinalBatch: u,
        onTranslation: f
      }, h = t.on("channel:change", d), g = t.on("translation:change", d), y = t.on("translation:sync", o), w = t.on("channel:sync", o);
      return t.live = p, () => {
        d(), h(), g(), y(), w(), t.live = void 0;
      };
    }
  };
}
function p0(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ I(t.fontSize ?? 40), r = /* @__PURE__ */ I(!0), i = /* @__PURE__ */ I(!1), s = {
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
      return e.subtitle = s, () => {
        r.value = !1, i.value = !1, e.subtitle = void 0;
      };
    }
  };
}
const l0 = /* @__PURE__ */ Zf({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: !1 }
  },
  styles: [s0, o0, a0],
  setup(t, { expose: e }) {
    console.log(t);
    const n = /* @__PURE__ */ I(t.locale);
    Op(n);
    const r = py();
    return r.use(r0()), hy(r), e({ editor: r }), () => r.channels.size ? yt(n0, { showHeader: !t.noHeader }) : null;
  }
});
function u0() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = i0, document.head.appendChild(e);
}
function h0(t = "linto-editor") {
  u0(), customElements.define(t, l0);
}
export {
  l0 as LintoEditor,
  r0 as createAudioPlugin,
  f0 as createLivePlugin,
  p0 as createSubtitlePlugin,
  h0 as register
};
