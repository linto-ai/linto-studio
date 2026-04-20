// @__NO_SIDE_EFFECTS__
function Us(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const ge = {}, zn = [], Rt = () => {
}, nl = () => !1, wr = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Ks = (t) => t.startsWith("onUpdate:"), Te = Object.assign, Gs = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Dc = Object.prototype.hasOwnProperty, ye = (t, e) => Dc.call(t, e), ne = Array.isArray, Nn = (t) => Pi(t) === "[object Map]", il = (t) => Pi(t) === "[object Set]", Ao = (t) => Pi(t) === "[object Date]", le = (t) => typeof t == "function", Ee = (t) => typeof t == "string", bt = (t) => typeof t == "symbol", be = (t) => t !== null && typeof t == "object", rl = (t) => (be(t) || le(t)) && le(t.then) && le(t.catch), sl = Object.prototype.toString, Pi = (t) => sl.call(t), $c = (t) => Pi(t).slice(8, -1), _r = (t) => Pi(t) === "[object Object]", xr = (t) => Ee(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, li = /* @__PURE__ */ Us(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Sr = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Bc = /-\w/g, Fe = Sr(
  (t) => t.replace(Bc, (e) => e.slice(1).toUpperCase())
), Fc = /\B([A-Z])/g, nt = Sr(
  (t) => t.replace(Fc, "-$1").toLowerCase()
), Cr = Sr((t) => t.charAt(0).toUpperCase() + t.slice(1)), Ui = Sr(
  (t) => t ? `on${Cr(t)}` : ""
), Ke = (t, e) => !Object.is(t, e), Xr = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, ol = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, zc = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, xs = (t) => {
  const e = Ee(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let Po;
const kr = () => Po || (Po = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ct(t) {
  if (ne(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = Ee(i) ? Vc(i) : Ct(i);
      if (r)
        for (const s in r)
          e[s] = r[s];
    }
    return e;
  } else if (Ee(t) || be(t))
    return t;
}
const Nc = /;(?![^(]*\))/g, qc = /:([^]+)/, Hc = /\/\*[^]*?\*\//g;
function Vc(t) {
  const e = {};
  return t.replace(Hc, "").split(Nc).forEach((n) => {
    if (n) {
      const i = n.split(qc);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function pt(t) {
  let e = "";
  if (Ee(t))
    e = t;
  else if (ne(t))
    for (let n = 0; n < t.length; n++) {
      const i = pt(t[n]);
      i && (e += i + " ");
    }
  else if (be(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Xs(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !Ee(e) && (t.class = pt(e)), n && (t.style = Ct(n)), t;
}
const Wc = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", jc = /* @__PURE__ */ Us(Wc);
function al(t) {
  return !!t || t === "";
}
function Uc(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = Ys(t[i], e[i]);
  return n;
}
function Ys(t, e) {
  if (t === e) return !0;
  let n = Ao(t), i = Ao(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = bt(t), i = bt(e), n || i)
    return t === e;
  if (n = ne(t), i = ne(e), n || i)
    return n && i ? Uc(t, e) : !1;
  if (n = be(t), i = be(e), n || i) {
    if (!n || !i)
      return !1;
    const r = Object.keys(t).length, s = Object.keys(e).length;
    if (r !== s)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Ys(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const ll = (t) => !!(t && t.__v_isRef === !0), fe = (t) => Ee(t) ? t : t == null ? "" : ne(t) || be(t) && (t.toString === sl || !le(t.toString)) ? ll(t) ? fe(t.value) : JSON.stringify(t, ul, 2) : String(t), ul = (t, e) => ll(e) ? ul(t, e.value) : Nn(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, r], s) => (n[Yr(i, s) + " =>"] = r, n),
    {}
  )
} : il(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Yr(n))
} : bt(e) ? Yr(e) : be(e) && !ne(e) && !_r(e) ? String(e) : e, Yr = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    bt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let Ve;
class cl {
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
function dl(t) {
  return new cl(t);
}
function Js() {
  return Ve;
}
function fl(t, e = !1) {
  Ve && Ve.cleanups.push(t);
}
let ke;
const Jr = /* @__PURE__ */ new WeakSet();
class pl {
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || vl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Oo(this), ml(this);
    const e = ke, n = yt;
    ke = this, yt = !0;
    try {
      return this.fn();
    } finally {
      gl(this), ke = e, yt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        eo(e);
      this.deps = this.depsTail = void 0, Oo(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Jr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Ss(this) && this.run();
  }
  get dirty() {
    return Ss(this);
  }
}
let hl = 0, ui, ci;
function vl(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = ci, ci = t;
    return;
  }
  t.next = ui, ui = t;
}
function Zs() {
  hl++;
}
function Qs() {
  if (--hl > 0)
    return;
  if (ci) {
    let e = ci;
    for (ci = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; ui; ) {
    let e = ui;
    for (ui = void 0; e; ) {
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
function ml(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function gl(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const r = i.prevDep;
    i.version === -1 ? (i === n && (n = r), eo(i), Kc(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = r;
  }
  t.deps = e, t.depsTail = n;
}
function Ss(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (yl(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function yl(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === gi) || (t.globalVersion = gi, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !Ss(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = ke, i = yt;
  ke = t, yt = !0;
  try {
    ml(t);
    const r = t.fn(t._value);
    (e.version === 0 || Ke(r, t._value)) && (t.flags |= 128, t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    ke = n, yt = i, gl(t), t.flags &= -3;
  }
}
function eo(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: r } = t;
  if (i && (i.nextSub = r, t.prevSub = void 0), r && (r.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      eo(s, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Kc(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let yt = !0;
const bl = [];
function Yt() {
  bl.push(yt), yt = !1;
}
function Jt() {
  const t = bl.pop();
  yt = t === void 0 ? !0 : t;
}
function Oo(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = ke;
    ke = void 0;
    try {
      e();
    } finally {
      ke = n;
    }
  }
}
let gi = 0;
class Gc {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Er {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!ke || !yt || ke === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ke)
      n = this.activeLink = new Gc(ke, this), ke.deps ? (n.prevDep = ke.depsTail, ke.depsTail.nextDep = n, ke.depsTail = n) : ke.deps = ke.depsTail = n, wl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = ke.depsTail, n.nextDep = void 0, ke.depsTail.nextDep = n, ke.depsTail = n, ke.deps === n && (ke.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, gi++, this.notify(e);
  }
  notify(e) {
    Zs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Qs();
    }
  }
}
function wl(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        wl(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const ir = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ Symbol(
  ""
), Cs = /* @__PURE__ */ Symbol(
  ""
), yi = /* @__PURE__ */ Symbol(
  ""
);
function We(t, e, n) {
  if (yt && ke) {
    let i = ir.get(t);
    i || ir.set(t, i = /* @__PURE__ */ new Map());
    let r = i.get(n);
    r || (i.set(n, r = new Er()), r.map = i, r.key = n), r.track();
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
  if (Zs(), e === "clear")
    o.forEach(a);
  else {
    const l = ne(t), u = l && xr(n);
    if (l && n === "length") {
      const c = Number(i);
      o.forEach((d, p) => {
        (p === "length" || p === yi || !bt(p) && p >= c) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), u && a(o.get(yi)), e) {
        case "add":
          l ? u && a(o.get("length")) : (a(o.get(Tn)), Nn(t) && a(o.get(Cs)));
          break;
        case "delete":
          l || (a(o.get(Tn)), Nn(t) && a(o.get(Cs)));
          break;
        case "set":
          Nn(t) && a(o.get(Tn));
          break;
      }
  }
  Qs();
}
function Xc(t, e) {
  const n = ir.get(t);
  return n && n.get(e);
}
function Rn(t) {
  const e = /* @__PURE__ */ me(t);
  return e === t ? e : (We(e, "iterate", yi), /* @__PURE__ */ ot(t) ? e : e.map(wt));
}
function Tr(t) {
  return We(t = /* @__PURE__ */ me(t), "iterate", yi), t;
}
function un(t, e) {
  return /* @__PURE__ */ Zt(t) ? jn(/* @__PURE__ */ An(t) ? wt(e) : e) : wt(e);
}
const Yc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Zr(this, Symbol.iterator, (t) => un(this, t));
  },
  concat(...t) {
    return Rn(this).concat(
      ...t.map((e) => ne(e) ? Rn(e) : e)
    );
  },
  entries() {
    return Zr(this, "entries", (t) => (t[1] = un(this, t[1]), t));
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
      (n) => n.map((i) => un(this, i)),
      arguments
    );
  },
  find(t, e) {
    return Vt(
      this,
      "find",
      t,
      e,
      (n) => un(this, n),
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
      (n) => un(this, n),
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
    return Io(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Io(this, "reduceRight", t, e);
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
    return Zr(this, "values", (t) => un(this, t));
  }
};
function Zr(t, e, n) {
  const i = Tr(t), r = i[e]();
  return i !== t && !/* @__PURE__ */ ot(t) && (r._next = r.next, r.next = () => {
    const s = r._next();
    return s.done || (s.value = n(s.value)), s;
  }), r;
}
const Jc = Array.prototype;
function Vt(t, e, n, i, r, s) {
  const o = Tr(t), a = o !== t && !/* @__PURE__ */ ot(t), l = o[e];
  if (l !== Jc[e]) {
    const d = l.apply(t, s);
    return a ? wt(d) : d;
  }
  let u = n;
  o !== t && (a ? u = function(d, p) {
    return n.call(this, un(t, d), p, t);
  } : n.length > 2 && (u = function(d, p) {
    return n.call(this, d, p, t);
  }));
  const c = l.call(o, u, i);
  return a && r ? r(c) : c;
}
function Io(t, e, n, i) {
  const r = Tr(t);
  let s = n;
  return r !== t && (/* @__PURE__ */ ot(t) ? n.length > 3 && (s = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : s = function(o, a, l) {
    return n.call(this, o, un(t, a), l, t);
  }), r[e](s, ...i);
}
function Qr(t, e, n) {
  const i = /* @__PURE__ */ me(t);
  We(i, "iterate", yi);
  const r = i[e](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ Or(n[0]) ? (n[0] = /* @__PURE__ */ me(n[0]), i[e](...n)) : r;
}
function ti(t, e, n = []) {
  Yt(), Zs();
  const i = (/* @__PURE__ */ me(t))[e].apply(t, n);
  return Qs(), Jt(), i;
}
const Zc = /* @__PURE__ */ Us("__proto__,__v_isRef,__isVue"), _l = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(bt)
);
function Qc(t) {
  bt(t) || (t = String(t));
  const e = /* @__PURE__ */ me(this);
  return We(e, "has", t), e.hasOwnProperty(t);
}
class xl {
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
      return i === (r ? s ? Al : Tl : s ? El : kl).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = ne(e);
    if (!r) {
      let l;
      if (o && (l = Yc[n]))
        return l;
      if (n === "hasOwnProperty")
        return Qc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Be(e) ? e : i
    );
    if ((bt(n) ? _l.has(n) : Zc(n)) || (r || We(e, "get", n), s))
      return a;
    if (/* @__PURE__ */ Be(a)) {
      const l = o && xr(n) ? a : a.value;
      return r && be(l) ? /* @__PURE__ */ rr(l) : l;
    }
    return be(a) ? r ? /* @__PURE__ */ rr(a) : /* @__PURE__ */ Oi(a) : a;
  }
}
class Sl extends xl {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, r) {
    let s = e[n];
    const o = ne(e) && xr(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ Zt(s);
      if (!/* @__PURE__ */ ot(i) && !/* @__PURE__ */ Zt(i) && (s = /* @__PURE__ */ me(s), i = /* @__PURE__ */ me(i)), !o && /* @__PURE__ */ Be(s) && !/* @__PURE__ */ Be(i))
        return u || (s.value = i), !0;
    }
    const a = o ? Number(n) < e.length : ye(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Be(e) ? e : r
    );
    return e === /* @__PURE__ */ me(r) && (a ? Ke(i, s) && Kt(e, "set", n, i) : Kt(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = ye(e, n);
    e[n];
    const r = Reflect.deleteProperty(e, n);
    return r && i && Kt(e, "delete", n, void 0), r;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!bt(n) || !_l.has(n)) && We(e, "has", n), i;
  }
  ownKeys(e) {
    return We(
      e,
      "iterate",
      ne(e) ? "length" : Tn
    ), Reflect.ownKeys(e);
  }
}
class Cl extends xl {
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
const ed = /* @__PURE__ */ new Sl(), td = /* @__PURE__ */ new Cl(), nd = /* @__PURE__ */ new Sl(!0), id = /* @__PURE__ */ new Cl(!0), ks = (t) => t, Bi = (t) => Reflect.getPrototypeOf(t);
function rd(t, e, n) {
  return function(...i) {
    const r = this.__v_raw, s = /* @__PURE__ */ me(r), o = Nn(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, u = r[t](...i), c = n ? ks : e ? jn : wt;
    return !e && We(
      s,
      "iterate",
      l ? Cs : Tn
    ), Te(
      // inheriting all iterator properties
      Object.create(u),
      {
        // iterator protocol
        next() {
          const { value: d, done: p } = u.next();
          return p ? { value: d, done: p } : {
            value: a ? [c(d[0]), c(d[1])] : c(d),
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
function sd(t, e) {
  const n = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ me(s), a = /* @__PURE__ */ me(r);
      t || (Ke(r, a) && We(o, "get", r), We(o, "get", a));
      const { has: l } = Bi(o), u = e ? ks : t ? jn : wt;
      if (l.call(o, r))
        return u(s.get(r));
      if (l.call(o, a))
        return u(s.get(a));
      s !== o && s.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !t && We(/* @__PURE__ */ me(r), "iterate", Tn), r.size;
    },
    has(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ me(s), a = /* @__PURE__ */ me(r);
      return t || (Ke(r, a) && We(o, "has", r), We(o, "has", a)), r === a ? s.has(r) : s.has(r) || s.has(a);
    },
    forEach(r, s) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ me(a), u = e ? ks : t ? jn : wt;
      return !t && We(l, "iterate", Tn), a.forEach((c, d) => r.call(s, u(c), u(d), o));
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
        !e && !/* @__PURE__ */ ot(r) && !/* @__PURE__ */ Zt(r) && (r = /* @__PURE__ */ me(r));
        const s = /* @__PURE__ */ me(this);
        return Bi(s).has.call(s, r) || (s.add(r), Kt(s, "add", r, r)), this;
      },
      set(r, s) {
        !e && !/* @__PURE__ */ ot(s) && !/* @__PURE__ */ Zt(s) && (s = /* @__PURE__ */ me(s));
        const o = /* @__PURE__ */ me(this), { has: a, get: l } = Bi(o);
        let u = a.call(o, r);
        u || (r = /* @__PURE__ */ me(r), u = a.call(o, r));
        const c = l.call(o, r);
        return o.set(r, s), u ? Ke(s, c) && Kt(o, "set", r, s) : Kt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ me(this), { has: o, get: a } = Bi(s);
        let l = o.call(s, r);
        l || (r = /* @__PURE__ */ me(r), l = o.call(s, r)), a && a.call(s, r);
        const u = s.delete(r);
        return l && Kt(s, "delete", r, void 0), u;
      },
      clear() {
        const r = /* @__PURE__ */ me(this), s = r.size !== 0, o = r.clear();
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
    n[r] = rd(r, t, e);
  }), n;
}
function Ar(t, e) {
  const n = sd(t, e);
  return (i, r, s) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? i : Reflect.get(
    ye(n, r) && r in i ? n : i,
    r,
    s
  );
}
const od = {
  get: /* @__PURE__ */ Ar(!1, !1)
}, ad = {
  get: /* @__PURE__ */ Ar(!1, !0)
}, ld = {
  get: /* @__PURE__ */ Ar(!0, !1)
}, ud = {
  get: /* @__PURE__ */ Ar(!0, !0)
}, kl = /* @__PURE__ */ new WeakMap(), El = /* @__PURE__ */ new WeakMap(), Tl = /* @__PURE__ */ new WeakMap(), Al = /* @__PURE__ */ new WeakMap();
function cd(t) {
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
function dd(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : cd($c(t));
}
// @__NO_SIDE_EFFECTS__
function Oi(t) {
  return /* @__PURE__ */ Zt(t) ? t : Pr(
    t,
    !1,
    ed,
    od,
    kl
  );
}
// @__NO_SIDE_EFFECTS__
function Ii(t) {
  return Pr(
    t,
    !1,
    nd,
    ad,
    El
  );
}
// @__NO_SIDE_EFFECTS__
function rr(t) {
  return Pr(
    t,
    !0,
    td,
    ld,
    Tl
  );
}
// @__NO_SIDE_EFFECTS__
function Ln(t) {
  return Pr(
    t,
    !0,
    id,
    ud,
    Al
  );
}
function Pr(t, e, n, i, r) {
  if (!be(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = dd(t);
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
function An(t) {
  return /* @__PURE__ */ Zt(t) ? /* @__PURE__ */ An(t.__v_raw) : !!(t && t.__v_isReactive);
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
function me(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ me(e) : t;
}
function Pl(t) {
  return !ye(t, "__v_skip") && Object.isExtensible(t) && ol(t, "__v_skip", !0), t;
}
const wt = (t) => be(t) ? /* @__PURE__ */ Oi(t) : t, jn = (t) => be(t) ? /* @__PURE__ */ rr(t) : t;
// @__NO_SIDE_EFFECTS__
function Be(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function L(t) {
  return Ol(t, !1);
}
// @__NO_SIDE_EFFECTS__
function fn(t) {
  return Ol(t, !0);
}
function Ol(t, e) {
  return /* @__PURE__ */ Be(t) ? t : new fd(t, e);
}
class fd {
  constructor(e, n) {
    this.dep = new Er(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ me(e), this._value = n ? e : wt(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ ot(e) || /* @__PURE__ */ Zt(e);
    e = i ? e : /* @__PURE__ */ me(e), Ke(e, n) && (this._rawValue = e, this._value = i ? e : wt(e), this.dep.trigger());
  }
}
function v(t) {
  return /* @__PURE__ */ Be(t) ? t.value : t;
}
function Je(t) {
  return le(t) ? t() : v(t);
}
const pd = {
  get: (t, e, n) => e === "__v_raw" ? t : v(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const r = t[e];
    return /* @__PURE__ */ Be(r) && !/* @__PURE__ */ Be(n) ? (r.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function Il(t) {
  return /* @__PURE__ */ An(t) ? t : new Proxy(t, pd);
}
class hd {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Er(), { get: i, set: r } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = r;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function Ml(t) {
  return new hd(t);
}
// @__NO_SIDE_EFFECTS__
function Yn(t) {
  const e = ne(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = Rl(t, n);
  return e;
}
class vd {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ me(e);
    let r = !0, s = e;
    if (!ne(e) || !xr(String(n)))
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
    return Xc(this._raw, this._key);
  }
}
class md {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Ki(t, e, n) {
  return /* @__PURE__ */ Be(t) ? t : le(t) ? new md(t) : be(t) && arguments.length > 1 ? Rl(t, e, n) : /* @__PURE__ */ L(t);
}
function Rl(t, e, n) {
  return new vd(t, e, n);
}
class gd {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new Er(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = gi - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ke !== this)
      return vl(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return yl(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function yd(t, e, n = !1) {
  let i, r;
  return le(t) ? i = t : (i = t.get, r = t.set), new gd(i, r, n);
}
const zi = {}, sr = /* @__PURE__ */ new WeakMap();
let Sn;
function bd(t, e = !1, n = Sn) {
  if (n) {
    let i = sr.get(n);
    i || sr.set(n, i = []), i.push(t);
  }
}
function wd(t, e, n = ge) {
  const { immediate: i, deep: r, once: s, scheduler: o, augmentJob: a, call: l } = n, u = (g) => r ? g : /* @__PURE__ */ ot(g) || r === !1 || r === 0 ? Gt(g, 1) : Gt(g);
  let c, d, p, f, h = !1, m = !1;
  if (/* @__PURE__ */ Be(t) ? (d = () => t.value, h = /* @__PURE__ */ ot(t)) : /* @__PURE__ */ An(t) ? (d = () => u(t), h = !0) : ne(t) ? (m = !0, h = t.some((g) => /* @__PURE__ */ An(g) || /* @__PURE__ */ ot(g)), d = () => t.map((g) => {
    if (/* @__PURE__ */ Be(g))
      return g.value;
    if (/* @__PURE__ */ An(g))
      return u(g);
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
    const g = Sn;
    Sn = c;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      Sn = g;
    }
  } : d = Rt, e && r) {
    const g = d, k = r === !0 ? 1 / 0 : r;
    d = () => Gt(g(), k);
  }
  const y = Js(), C = () => {
    c.stop(), y && y.active && Gs(y.effects, c);
  };
  if (s && e) {
    const g = e;
    e = (...k) => {
      g(...k), C();
    };
  }
  let _ = m ? new Array(t.length).fill(zi) : zi;
  const b = (g) => {
    if (!(!(c.flags & 1) || !c.dirty && !g))
      if (e) {
        const k = c.run();
        if (r || h || (m ? k.some((E, x) => Ke(E, _[x])) : Ke(k, _))) {
          p && p();
          const E = Sn;
          Sn = c;
          try {
            const x = [
              k,
              // pass undefined as the old value when it's changed for the first time
              _ === zi ? void 0 : m && _[0] === zi ? [] : _,
              f
            ];
            _ = k, l ? l(e, 3, x) : (
              // @ts-expect-error
              e(...x)
            );
          } finally {
            Sn = E;
          }
        }
      } else
        c.run();
  };
  return a && a(b), c = new pl(d), c.scheduler = o ? () => o(b, !1) : b, f = (g) => bd(g, !1, c), p = c.onStop = () => {
    const g = sr.get(c);
    if (g) {
      if (l)
        l(g, 4);
      else
        for (const k of g) k();
      sr.delete(c);
    }
  }, e ? i ? b(!0) : _ = c.run() : o ? o(b.bind(null, !0), !0) : c.run(), C.pause = c.pause.bind(c), C.resume = c.resume.bind(c), C.stop = C, C;
}
function Gt(t, e = 1 / 0, n) {
  if (e <= 0 || !be(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Be(t))
    Gt(t.value, e, n);
  else if (ne(t))
    for (let i = 0; i < t.length; i++)
      Gt(t[i], e, n);
  else if (il(t) || Nn(t))
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
function _t(t, e, n, i) {
  if (le(t)) {
    const r = Mi(t, e, n, i);
    return r && rl(r) && r.catch((s) => {
      Ir(s, e, n);
    }), r;
  }
  if (ne(t)) {
    const r = [];
    for (let s = 0; s < t.length; s++)
      r.push(_t(t[s], e, n, i));
    return r;
  }
}
function Ir(t, e, n, i = !0) {
  const r = e ? e.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: o } = e && e.appContext.config || ge;
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
    if (s) {
      Yt(), Mi(s, null, 10, [
        t,
        l,
        u
      ]), Jt();
      return;
    }
  }
  _d(t, n, r, i, o);
}
function _d(t, e, n, i = !0, r = !1) {
  if (r)
    throw t;
  console.error(t);
}
const Ge = [];
let Pt = -1;
const qn = [];
let cn = null, Bn = 0;
const Ll = /* @__PURE__ */ Promise.resolve();
let or = null;
function Me(t) {
  const e = or || Ll;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function xd(t) {
  let e = Pt + 1, n = Ge.length;
  for (; e < n; ) {
    const i = e + n >>> 1, r = Ge[i], s = bi(r);
    s < t || s === t && r.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function to(t) {
  if (!(t.flags & 1)) {
    const e = bi(t), n = Ge[Ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= bi(n) ? Ge.push(t) : Ge.splice(xd(e), 0, t), t.flags |= 1, Dl();
  }
}
function Dl() {
  or || (or = Ll.then(Bl));
}
function Sd(t) {
  ne(t) ? qn.push(...t) : cn && t.id === -1 ? cn.splice(Bn + 1, 0, t) : t.flags & 1 || (qn.push(t), t.flags |= 1), Dl();
}
function Mo(t, e, n = Pt + 1) {
  for (; n < Ge.length; n++) {
    const i = Ge[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      Ge.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function $l(t) {
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
function Bl(t) {
  try {
    for (Pt = 0; Pt < Ge.length; Pt++) {
      const e = Ge[Pt];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Mi(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; Pt < Ge.length; Pt++) {
      const e = Ge[Pt];
      e && (e.flags &= -2);
    }
    Pt = -1, Ge.length = 0, $l(), or = null, (Ge.length || qn.length) && Bl();
  }
}
let Ne = null, Fl = null;
function ar(t) {
  const e = Ne;
  return Ne = t, Fl = t && t.type.__scopeId || null, e;
}
function N(t, e = Ne, n) {
  if (!e || t._n)
    return t;
  const i = (...r) => {
    i._d && cr(-1);
    const s = ar(e);
    let o;
    try {
      o = t(...r);
    } finally {
      ar(s), i._d && cr(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function Cd(t, e) {
  if (Ne === null)
    return t;
  const n = Br(Ne), i = t.dirs || (t.dirs = []);
  for (let r = 0; r < e.length; r++) {
    let [s, o, a, l = ge] = e[r];
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
function bn(t, e, n, i) {
  const r = t.dirs, s = e && e.dirs;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s && (a.oldValue = s[o].value);
    let l = a.dir[i];
    l && (Yt(), _t(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Jt());
  }
}
function Jn(t, e) {
  if (je) {
    let n = je.provides;
    const i = je.parent && je.parent.provides;
    i === n && (n = je.provides = Object.create(i)), n[t] = e;
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
const kd = /* @__PURE__ */ Symbol.for("v-scx"), Ed = () => Xt(kd);
function ht(t, e) {
  return Ri(t, null, e);
}
function zl(t, e) {
  return Ri(
    t,
    null,
    { flush: "post" }
  );
}
function Td(t, e) {
  return Ri(
    t,
    null,
    { flush: "sync" }
  );
}
function he(t, e, n) {
  return Ri(t, e, n);
}
function Ri(t, e, n = ge) {
  const { immediate: i, deep: r, flush: s, once: o } = n, a = Te({}, n), l = e && i || !e && s !== "post";
  let u;
  if (Si) {
    if (s === "sync") {
      const f = Ed();
      u = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = Rt, f.resume = Rt, f.pause = Rt, f;
    }
  }
  const c = je;
  a.call = (f, h, m) => _t(f, c, h, m);
  let d = !1;
  s === "post" ? a.scheduler = (f) => {
    He(f, c && c.suspense);
  } : s !== "sync" && (d = !0, a.scheduler = (f, h) => {
    h ? f() : to(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, c && (f.id = c.uid, f.i = c));
  };
  const p = wd(t, e, a);
  return Si && (u ? u.push(p) : l && p()), p;
}
function Ad(t, e, n) {
  const i = this.proxy, r = Ee(t) ? t.includes(".") ? Nl(i, t) : () => i[t] : t.bind(i, i);
  let s;
  le(e) ? s = e : (s = e.handler, n = e);
  const o = Li(this), a = Ri(r, s.bind(i), n);
  return o(), a;
}
function Nl(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let r = 0; r < n.length && i; r++)
      i = i[n[r]];
    return i;
  };
}
const ql = /* @__PURE__ */ Symbol("_vte"), Hl = (t) => t.__isTeleport, di = (t) => t && (t.disabled || t.disabled === ""), Ro = (t) => t && (t.defer || t.defer === ""), Lo = (t) => typeof SVGElement < "u" && t instanceof SVGElement, Do = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, Es = (t, e) => {
  const n = t && t.to;
  return Ee(n) ? e ? e(n) : null : n;
}, Vl = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, r, s, o, a, l, u) {
    const {
      mc: c,
      pc: d,
      pbc: p,
      o: { insert: f, querySelector: h, createText: m, createComment: y }
    } = u, C = di(e.props);
    let { shapeFlag: _, children: b, dynamicChildren: g } = e;
    if (t == null) {
      const k = e.el = m(""), E = e.anchor = m("");
      f(k, n, i), f(E, n, i);
      const x = (T, A) => {
        _ & 16 && c(
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
        const T = e.target = Es(e.props, h), A = Ts(T, e, m, f);
        T && (o !== "svg" && Lo(T) ? o = "svg" : o !== "mathml" && Do(T) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(T), C || (x(T, A), Gi(e, !1)));
      };
      C && (x(n, E), Gi(e, !0)), Ro(e.props) ? (e.el.__isMounted = !1, He(() => {
        M(), delete e.el.__isMounted;
      }, s)) : M();
    } else {
      if (Ro(e.props) && t.el.__isMounted === !1) {
        He(() => {
          Vl.process(
            t,
            e,
            n,
            i,
            r,
            s,
            o,
            a,
            l,
            u
          );
        }, s);
        return;
      }
      e.el = t.el, e.targetStart = t.targetStart;
      const k = e.anchor = t.anchor, E = e.target = t.target, x = e.targetAnchor = t.targetAnchor, M = di(t.props), T = M ? n : E, A = M ? k : x;
      if (o === "svg" || Lo(E) ? o = "svg" : (o === "mathml" || Do(E)) && (o = "mathml"), g ? (p(
        t.dynamicChildren,
        g,
        T,
        r,
        s,
        o,
        a
      ), so(t, e, !0)) : l || d(
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
          k,
          u,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const D = e.target = Es(
          e.props,
          h
        );
        D && Ni(
          e,
          D,
          null,
          u,
          0
        );
      } else M && Ni(
        e,
        E,
        x,
        u,
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
      targetStart: u,
      targetAnchor: c,
      target: d,
      props: p
    } = t;
    if (d && (r(u), r(c)), s && r(l), o & 16) {
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
  hydrate: Pd
};
function Ni(t, e, n, { o: { insert: i }, m: r }, s = 2) {
  s === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: u, props: c } = t, d = s === 2;
  if (d && i(o, e, n), (!d || di(c)) && l & 16)
    for (let p = 0; p < u.length; p++)
      r(
        u[p],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function Pd(t, e, n, i, r, s, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: u, createText: c }
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
    e.shapeFlag & 16 && (m ? (f(t, e), p(h, y), e.targetAnchor || Ts(
      h,
      e,
      c,
      u,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === h ? t : null
    )) : (e.anchor = o(t), p(h, y), e.targetAnchor || Ts(h, e, c, u), d(
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
const Wl = Vl;
function Gi(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, r;
    for (e ? (i = t.el, r = t.anchor) : (i = t.targetStart, r = t.targetAnchor); i && i !== r; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function Ts(t, e, n, i, r = null) {
  const s = e.targetStart = n(""), o = e.targetAnchor = n("");
  return s[ql] = o, t && (i(s, t, r), i(o, t, r)), o;
}
const Ot = /* @__PURE__ */ Symbol("_leaveCb"), ni = /* @__PURE__ */ Symbol("_enterCb");
function Od() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Re(() => {
    t.isMounted = !0;
  }), rn(() => {
    t.isUnmounting = !0;
  }), t;
}
const ct = [Function, Array], jl = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: ct,
  onEnter: ct,
  onAfterEnter: ct,
  onEnterCancelled: ct,
  // leave
  onBeforeLeave: ct,
  onLeave: ct,
  onAfterLeave: ct,
  onLeaveCancelled: ct,
  // appear
  onBeforeAppear: ct,
  onAppear: ct,
  onAfterAppear: ct,
  onAppearCancelled: ct
}, Ul = (t) => {
  const e = t.subTree;
  return e.component ? Ul(e.component) : e;
}, Id = {
  name: "BaseTransition",
  props: jl,
  setup(t, { slots: e }) {
    const n = lt(), i = Od();
    return () => {
      const r = e.default && Xl(e.default(), !0);
      if (!r || !r.length)
        return;
      const s = Kl(r), o = /* @__PURE__ */ me(t), { mode: a } = o;
      if (i.isLeaving)
        return es(s);
      const l = $o(s);
      if (!l)
        return es(s);
      let u = As(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => u = d
      );
      l.type !== ze && wi(l, u);
      let c = n.subTree && $o(n.subTree);
      if (c && c.type !== ze && !kn(c, l) && Ul(n).type !== ze) {
        let d = As(
          c,
          o,
          i,
          n
        );
        if (wi(c, d), a === "out-in" && l.type !== ze)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, es(s);
        a === "in-out" && l.type !== ze ? d.delayLeave = (p, f, h) => {
          const m = Gl(
            i,
            c
          );
          m[String(c.key)] = c, p[Ot] = () => {
            f(), p[Ot] = void 0, delete u.delayedLeave, c = void 0;
          }, u.delayedLeave = () => {
            h(), delete u.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return s;
    };
  }
};
function Kl(t) {
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
const Md = Id;
function Gl(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function As(t, e, n, i, r) {
  const {
    appear: s,
    mode: o,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: u,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: p,
    onLeave: f,
    onAfterLeave: h,
    onLeaveCancelled: m,
    onBeforeAppear: y,
    onAppear: C,
    onAfterAppear: _,
    onAppearCancelled: b
  } = e, g = String(t.key), k = Gl(n, t), E = (T, A) => {
    T && _t(
      T,
      i,
      9,
      A
    );
  }, x = (T, A) => {
    const D = A[1];
    E(T, A), ne(T) ? T.every((O) => O.length <= 1) && D() : T.length <= 1 && D();
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
      T[Ot] && T[Ot](
        !0
        /* cancelled */
      );
      const D = k[g];
      D && kn(t, D) && D.el[Ot] && D.el[Ot](), E(A, [T]);
    },
    enter(T) {
      let A = u, D = c, O = d;
      if (!n.isMounted)
        if (s)
          A = C || u, D = _ || c, O = b || d;
        else
          return;
      let V = !1;
      T[ni] = (K) => {
        V || (V = !0, K ? E(O, [T]) : E(D, [T]), M.delayedLeave && M.delayedLeave(), T[ni] = void 0);
      };
      const $ = T[ni].bind(null, !1);
      A ? x(A, [T, $]) : $();
    },
    leave(T, A) {
      const D = String(t.key);
      if (T[ni] && T[ni](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return A();
      E(p, [T]);
      let O = !1;
      T[Ot] = ($) => {
        O || (O = !0, A(), $ ? E(m, [T]) : E(h, [T]), T[Ot] = void 0, k[D] === t && delete k[D]);
      };
      const V = T[Ot].bind(null, !1);
      k[D] = t, f ? x(f, [T, V]) : V();
    },
    clone(T) {
      const A = As(
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
function $o(t) {
  if (!Mr(t))
    return Hl(t.type) && t.children ? Kl(t.children) : t;
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
function Xl(t, e = !1, n) {
  let i = [], r = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Se ? (o.patchFlag & 128 && r++, i = i.concat(
      Xl(o.children, e, a)
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
function Yl() {
  const t = lt();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function Jl(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function _i(t) {
  const e = lt(), n = /* @__PURE__ */ fn(null);
  if (e) {
    const r = e.refs === ge ? e.refs = {} : e.refs;
    Object.defineProperty(r, t, {
      enumerable: !0,
      get: () => n.value,
      set: (s) => n.value = s
    });
  }
  return n;
}
function Bo(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const lr = /* @__PURE__ */ new WeakMap();
function fi(t, e, n, i, r = !1) {
  if (ne(t)) {
    t.forEach(
      (m, y) => fi(
        m,
        e && (ne(e) ? e[y] : e),
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
  const s = i.shapeFlag & 4 ? Br(i.component) : i.el, o = r ? null : s, { i: a, r: l } = t, u = e && e.r, c = a.refs === ge ? a.refs = {} : a.refs, d = a.setupState, p = /* @__PURE__ */ me(d), f = d === ge ? nl : (m) => Bo(c, m) ? !1 : ye(p, m), h = (m, y) => !(y && Bo(c, y));
  if (u != null && u !== l) {
    if (Fo(e), Ee(u))
      c[u] = null, f(u) && (d[u] = null);
    else if (/* @__PURE__ */ Be(u)) {
      const m = e;
      h(u, m.k) && (u.value = null), m.k && (c[m.k] = null);
    }
  }
  if (le(l))
    Mi(l, a, 12, [o, c]);
  else {
    const m = Ee(l), y = /* @__PURE__ */ Be(l);
    if (m || y) {
      const C = () => {
        if (t.f) {
          const _ = m ? f(l) ? d[l] : c[l] : h() || !t.k ? l.value : c[t.k];
          if (r)
            ne(_) && Gs(_, s);
          else if (ne(_))
            _.includes(s) || _.push(s);
          else if (m)
            c[l] = [s], f(l) && (d[l] = c[l]);
          else {
            const b = [s];
            h(l, t.k) && (l.value = b), t.k && (c[t.k] = b);
          }
        } else m ? (c[l] = o, f(l) && (d[l] = o)) : y && (h(l, t.k) && (l.value = o), t.k && (c[t.k] = o));
      };
      if (o) {
        const _ = () => {
          C(), lr.delete(t);
        };
        _.id = -1, lr.set(t, _), He(_, n);
      } else
        Fo(t), C();
    }
  }
}
function Fo(t) {
  const e = lr.get(t);
  e && (e.flags |= 8, lr.delete(t));
}
kr().requestIdleCallback;
kr().cancelIdleCallback;
const Hn = (t) => !!t.type.__asyncLoader, Mr = (t) => t.type.__isKeepAlive;
function Rd(t, e) {
  Zl(t, "a", e);
}
function Ld(t, e) {
  Zl(t, "da", e);
}
function Zl(t, e, n = je) {
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
      Mr(r.parent.vnode) && Dd(i, e, n, r), r = r.parent;
  }
}
function Dd(t, e, n, i) {
  const r = Rr(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  vn(() => {
    Gs(i[e], r);
  }, n);
}
function Rr(t, e, n = je, i = !1) {
  if (n) {
    const r = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      Yt();
      const a = Li(n), l = _t(e, n, t, o);
      return a(), Jt(), l;
    });
    return i ? r.unshift(s) : r.push(s), s;
  }
}
const nn = (t) => (e, n = je) => {
  (!Si || t === "sp") && Rr(t, (...i) => e(...i), n);
}, $d = nn("bm"), Re = nn("m"), Bd = nn(
  "bu"
), Fd = nn("u"), rn = nn(
  "bum"
), vn = nn("um"), zd = nn(
  "sp"
), Nd = nn("rtg"), qd = nn("rtc");
function Hd(t, e = je) {
  Rr("ec", t, e);
}
const Vd = "components", Ql = /* @__PURE__ */ Symbol.for("v-ndc");
function no(t) {
  return Ee(t) ? Wd(Vd, t, !1) || t : t || Ql;
}
function Wd(t, e, n = !0, i = !1) {
  const r = Ne || je;
  if (r) {
    const s = r.type;
    {
      const a = Of(
        s,
        !1
      );
      if (a && (a === e || a === Fe(e) || a === Cr(Fe(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      zo(r[t] || s[t], e) || // global registration
      zo(r.appContext[t], e)
    );
    return !o && i ? s : o;
  }
}
function zo(t, e) {
  return t && (t[e] || t[Fe(e)] || t[Cr(Fe(e))]);
}
function mn(t, e, n, i) {
  let r;
  const s = n && n[i], o = ne(t);
  if (o || Ee(t)) {
    const a = o && /* @__PURE__ */ An(t);
    let l = !1, u = !1;
    a && (l = !/* @__PURE__ */ ot(t), u = /* @__PURE__ */ Zt(t), t = Tr(t)), r = new Array(t.length);
    for (let c = 0, d = t.length; c < d; c++)
      r[c] = e(
        l ? u ? jn(wt(t[c])) : wt(t[c]) : t[c],
        c,
        void 0,
        s && s[c]
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
      for (let l = 0, u = a.length; l < u; l++) {
        const c = a[l];
        r[l] = e(t[c], c, l, s && s[l]);
      }
    }
  else
    r = [];
  return n && (n[i] = r), r;
}
function No(t, e) {
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    if (ne(i))
      for (let r = 0; r < i.length; r++)
        t[i[r].name] = i[r].fn;
    else i && (t[i.name] = i.key ? (...r) => {
      const s = i.fn(...r);
      return s && (s.key = i.key), s;
    } : i.fn);
  }
  return t;
}
function ie(t, e, n = {}, i, r) {
  if (Ne.ce || Ne.parent && Hn(Ne.parent) && Ne.parent.ce) {
    const u = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), P(), j(
      Se,
      null,
      [H("slot", n, i && i())],
      u ? -2 : 64
    );
  }
  let s = t[e];
  s && s._c && (s._d = !1), P();
  const o = s && eu(s(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = j(
    Se,
    {
      key: (a && !bt(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && i ? "_fb" : "")
    },
    o || (i ? i() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), s && s._c && (s._d = !0), l;
}
function eu(t) {
  return t.some((e) => xi(e) ? !(e.type === ze || e.type === Se && !eu(e.children)) : !0) ? t : null;
}
const Ps = (t) => t ? wu(t) ? Br(t) : Ps(t.parent) : null, pi = (
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
    $parent: (t) => Ps(t.parent),
    $root: (t) => Ps(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => nu(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      to(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Me.bind(t.proxy)),
    $watch: (t) => Ad.bind(t)
  })
), ts = (t, e) => t !== ge && !t.__isScriptSetup && ye(t, e), jd = {
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
        if (r !== ge && ye(r, e))
          return o[e] = 2, r[e];
        if (ye(s, e))
          return o[e] = 3, s[e];
        if (n !== ge && ye(n, e))
          return o[e] = 4, n[e];
        Is && (o[e] = 0);
      }
    }
    const u = pi[e];
    let c, d;
    if (u)
      return e === "$attrs" && We(t.attrs, "get", ""), u(t);
    if (
      // css module (injected by vue-loader)
      (c = a.__cssModules) && (c = c[e])
    )
      return c;
    if (n !== ge && ye(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, ye(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: r, ctx: s } = t;
    return ts(r, e) ? (r[e] = n, !0) : i !== ge && ye(i, e) ? (i[e] = n, !0) : ye(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: r, props: s, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== ge && a[0] !== "$" && ye(t, a) || ts(e, a) || ye(s, a) || ye(i, a) || ye(pi, a) || ye(r.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : ye(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Ud() {
  return Kd().slots;
}
function Kd(t) {
  const e = lt();
  return e.setupContext || (e.setupContext = xu(e));
}
function Os(t) {
  return ne(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
function Gd(t, e) {
  const n = Os(t);
  for (const i in e) {
    if (i.startsWith("__skip")) continue;
    let r = n[i];
    r ? ne(r) || le(r) ? r = n[i] = { type: r, default: e[i] } : r.default = e[i] : r === null && (r = n[i] = { default: e[i] }), r && e[`__skip_${i}`] && (r.skipFactory = !0);
  }
  return n;
}
let Is = !0;
function Xd(t) {
  const e = nu(t), n = t.proxy, i = t.ctx;
  Is = !1, e.beforeCreate && qo(e.beforeCreate, t, "bc");
  const {
    // state
    data: r,
    computed: s,
    methods: o,
    watch: a,
    provide: l,
    inject: u,
    // lifecycle
    created: c,
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
    render: k,
    renderTracked: E,
    renderTriggered: x,
    errorCaptured: M,
    serverPrefetch: T,
    // public API
    expose: A,
    inheritAttrs: D,
    // assets
    components: O,
    directives: V,
    filters: $
  } = e;
  if (u && Yd(u, i, null), o)
    for (const Z in o) {
      const ee = o[Z];
      le(ee) && (i[Z] = ee.bind(n));
    }
  if (r) {
    const Z = r.call(n, n);
    be(Z) && (t.data = /* @__PURE__ */ Oi(Z));
  }
  if (Is = !0, s)
    for (const Z in s) {
      const ee = s[Z], we = le(ee) ? ee.bind(n, n) : le(ee.get) ? ee.get.bind(n, n) : Rt, $e = !le(ee) && le(ee.set) ? ee.set.bind(n) : Rt, Ze = R({
        get: we,
        set: $e
      });
      Object.defineProperty(i, Z, {
        enumerable: !0,
        configurable: !0,
        get: () => Ze.value,
        set: (Oe) => Ze.value = Oe
      });
    }
  if (a)
    for (const Z in a)
      tu(a[Z], i, n, Z);
  if (l) {
    const Z = le(l) ? l.call(n) : l;
    Reflect.ownKeys(Z).forEach((ee) => {
      Jn(ee, Z[ee]);
    });
  }
  c && qo(c, t, "c");
  function se(Z, ee) {
    ne(ee) ? ee.forEach((we) => Z(we.bind(n))) : ee && Z(ee.bind(n));
  }
  if (se($d, d), se(Re, p), se(Bd, f), se(Fd, h), se(Rd, m), se(Ld, y), se(Hd, M), se(qd, E), se(Nd, x), se(rn, _), se(vn, g), se(zd, T), ne(A))
    if (A.length) {
      const Z = t.exposed || (t.exposed = {});
      A.forEach((ee) => {
        Object.defineProperty(Z, ee, {
          get: () => n[ee],
          set: (we) => n[ee] = we,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  k && t.render === Rt && (t.render = k), D != null && (t.inheritAttrs = D), O && (t.components = O), V && (t.directives = V), T && Jl(t);
}
function Yd(t, e, n = Rt) {
  ne(t) && (t = Ms(t));
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
function qo(t, e, n) {
  _t(
    ne(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function tu(t, e, n, i) {
  let r = i.includes(".") ? Nl(n, i) : () => n[i];
  if (Ee(t)) {
    const s = e[t];
    le(s) && he(r, s);
  } else if (le(t))
    he(r, t.bind(n));
  else if (be(t))
    if (ne(t))
      t.forEach((s) => tu(s, e, n, i));
    else {
      const s = le(t.handler) ? t.handler.bind(n) : e[t.handler];
      le(s) && he(r, s, t);
    }
}
function nu(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !r.length && !n && !i ? l = e : (l = {}, r.length && r.forEach(
    (u) => ur(l, u, o, !0)
  ), ur(l, e, o)), be(e) && s.set(e, l), l;
}
function ur(t, e, n, i = !1) {
  const { mixins: r, extends: s } = e;
  s && ur(t, s, n, !0), r && r.forEach(
    (o) => ur(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = Jd[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Jd = {
  data: Ho,
  props: Vo,
  emits: Vo,
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
  watch: Qd,
  // provide / inject
  provide: Ho,
  inject: Zd
};
function Ho(t, e) {
  return e ? t ? function() {
    return Te(
      le(t) ? t.call(this, this) : t,
      le(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Zd(t, e) {
  return oi(Ms(t), Ms(e));
}
function Ms(t) {
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
function oi(t, e) {
  return t ? Te(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Vo(t, e) {
  return t ? ne(t) && ne(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Te(
    /* @__PURE__ */ Object.create(null),
    Os(t),
    Os(e ?? {})
  ) : e;
}
function Qd(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = Te(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = Ue(t[i], e[i]);
  return n;
}
function iu() {
  return {
    app: null,
    config: {
      isNativeTag: nl,
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
let ef = 0;
function tf(t, e) {
  return function(i, r = null) {
    le(i) || (i = Te({}, i)), r != null && !be(r) && (r = null);
    const s = iu(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const u = s.app = {
      _uid: ef++,
      _component: i,
      _props: r,
      _container: null,
      _context: s,
      _instance: null,
      version: Rf,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && le(c.install) ? (o.add(c), c.install(u, ...d)) : le(c) && (o.add(c), c(u, ...d))), u;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), u;
      },
      component(c, d) {
        return d ? (s.components[c] = d, u) : s.components[c];
      },
      directive(c, d) {
        return d ? (s.directives[c] = d, u) : s.directives[c];
      },
      mount(c, d, p) {
        if (!l) {
          const f = u._ceVNode || H(i, r);
          return f.appContext = s, p === !0 ? p = "svg" : p === !1 && (p = void 0), t(f, c, p), l = !0, u._container = c, c.__vue_app__ = u, Br(f.component);
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l && (_t(
          a,
          u._instance,
          16
        ), t(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, d) {
        return s.provides[c] = d, u;
      },
      runWithContext(c) {
        const d = Vn;
        Vn = u;
        try {
          return c();
        } finally {
          Vn = d;
        }
      }
    };
    return u;
  };
}
let Vn = null;
function nf(t, e, n = ge) {
  const i = lt(), r = Fe(e), s = nt(e), o = ru(t, r), a = Ml((l, u) => {
    let c, d = ge, p;
    return Td(() => {
      const f = t[r];
      Ke(c, f) && (c = f, u());
    }), {
      get() {
        return l(), n.get ? n.get(c) : c;
      },
      set(f) {
        const h = n.set ? n.set(f) : f;
        if (!Ke(h, c) && !(d !== ge && Ke(f, d)))
          return;
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || r in m || s in m) && (`onUpdate:${e}` in m || `onUpdate:${r}` in m || `onUpdate:${s}` in m) || (c = f, u()), i.emit(`update:${e}`, h), Ke(f, h) && Ke(f, d) && !Ke(h, p) && u(), d = f, p = h;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? o || ge : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const ru = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${Fe(e)}Modifiers`] || t[`${nt(e)}Modifiers`];
function rf(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || ge;
  let r = n;
  const s = e.startsWith("update:"), o = s && ru(i, e.slice(7));
  o && (o.trim && (r = n.map((c) => Ee(c) ? c.trim() : c)), o.number && (r = n.map(zc)));
  let a, l = i[a = Ui(e)] || // also try camelCase event handler (#2249)
  i[a = Ui(Fe(e))];
  !l && s && (l = i[a = Ui(nt(e))]), l && _t(
    l,
    t,
    6,
    r
  );
  const u = i[a + "Once"];
  if (u) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[a])
      return;
    t.emitted[a] = !0, _t(
      u,
      t,
      6,
      r
    );
  }
}
const sf = /* @__PURE__ */ new WeakMap();
function su(t, e, n = !1) {
  const i = n ? sf : e.emitsCache, r = i.get(t);
  if (r !== void 0)
    return r;
  const s = t.emits;
  let o = {}, a = !1;
  if (!le(t)) {
    const l = (u) => {
      const c = su(u, e, !0);
      c && (a = !0, Te(o, c));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (be(t) && i.set(t, null), null) : (ne(s) ? s.forEach((l) => o[l] = null) : Te(o, s), be(t) && i.set(t, o), o);
}
function Lr(t, e) {
  return !t || !wr(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), ye(t, e[0].toLowerCase() + e.slice(1)) || ye(t, nt(e)) || ye(t, e));
}
function Wo(t) {
  const {
    type: e,
    vnode: n,
    proxy: i,
    withProxy: r,
    propsOptions: [s],
    slots: o,
    attrs: a,
    emit: l,
    render: u,
    renderCache: c,
    props: d,
    data: p,
    setupState: f,
    ctx: h,
    inheritAttrs: m
  } = t, y = ar(t);
  let C, _;
  try {
    if (n.shapeFlag & 4) {
      const g = r || i, k = g;
      C = It(
        u.call(
          k,
          g,
          c,
          d,
          f,
          p,
          h
        )
      ), _ = a;
    } else {
      const g = e;
      C = It(
        g.length > 1 ? g(
          d,
          { attrs: a, slots: o, emit: l }
        ) : g(
          d,
          null
        )
      ), _ = e.props ? a : of(a);
    }
  } catch (g) {
    hi.length = 0, Ir(g, t, 1), C = H(ze);
  }
  let b = C;
  if (_ && m !== !1) {
    const g = Object.keys(_), { shapeFlag: k } = b;
    g.length && k & 7 && (s && g.some(Ks) && (_ = af(
      _,
      s
    )), b = Qt(b, _, !1, !0));
  }
  return n.dirs && (b = Qt(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && wi(b, n.transition), C = b, ar(y), C;
}
const of = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || wr(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, af = (t, e) => {
  const n = {};
  for (const i in t)
    (!Ks(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function lf(t, e, n) {
  const { props: i, children: r, component: s } = t, { props: o, children: a, patchFlag: l } = e, u = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? jo(i, o, u) : !!o;
    if (l & 8) {
      const c = e.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const p = c[d];
        if (ou(o, i, p) && !Lr(u, p))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? jo(i, o, u) : !0 : !!o;
  return !1;
}
function jo(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    if (ou(e, t, s) && !Lr(n, s))
      return !0;
  }
  return !1;
}
function ou(t, e, n) {
  const i = t[n], r = e[n];
  return n === "style" && be(i) && be(r) ? !Ys(i, r) : i !== r;
}
function uf({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const au = {}, lu = () => Object.create(au), uu = (t) => Object.getPrototypeOf(t) === au;
function cf(t, e, n, i = !1) {
  const r = {}, s = lu();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), cu(t, e, r, s);
  for (const o in t.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? t.props = i ? r : /* @__PURE__ */ Ii(r) : t.type.props ? t.props = r : t.props = s, t.attrs = s;
}
function df(t, e, n, i) {
  const {
    props: r,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ me(r), [l] = t.propsOptions;
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
        let p = c[d];
        if (Lr(t.emitsOptions, p))
          continue;
        const f = e[p];
        if (l)
          if (ye(s, p))
            f !== s[p] && (s[p] = f, u = !0);
          else {
            const h = Fe(p);
            r[h] = Rs(
              l,
              a,
              h,
              f,
              t,
              !1
            );
          }
        else
          f !== s[p] && (s[p] = f, u = !0);
      }
    }
  } else {
    cu(t, e, r, s) && (u = !0);
    let c;
    for (const d in a)
      (!e || // for camelCase
      !ye(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = nt(d)) === d || !ye(e, c))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (r[d] = Rs(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete r[d]);
    if (s !== a)
      for (const d in s)
        (!e || !ye(e, d)) && (delete s[d], u = !0);
  }
  u && Kt(t.attrs, "set", "");
}
function cu(t, e, n, i) {
  const [r, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (li(l))
        continue;
      const u = e[l];
      let c;
      r && ye(r, c = Fe(l)) ? !s || !s.includes(c) ? n[c] = u : (a || (a = {}))[c] = u : Lr(t.emitsOptions, l) || (!(l in i) || u !== i[l]) && (i[l] = u, o = !0);
    }
  if (s) {
    const l = /* @__PURE__ */ me(n), u = a || ge;
    for (let c = 0; c < s.length; c++) {
      const d = s[c];
      n[d] = Rs(
        r,
        l,
        d,
        u[d],
        t,
        !ye(u, d)
      );
    }
  }
  return o;
}
function Rs(t, e, n, i, r, s) {
  const o = t[n];
  if (o != null) {
    const a = ye(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && le(l)) {
        const { propsDefaults: u } = r;
        if (n in u)
          i = u[n];
        else {
          const c = Li(r);
          i = u[n] = l.call(
            null,
            e
          ), c();
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
const ff = /* @__PURE__ */ new WeakMap();
function du(t, e, n = !1) {
  const i = n ? ff : e.propsCache, r = i.get(t);
  if (r)
    return r;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!le(t)) {
    const c = (d) => {
      l = !0;
      const [p, f] = du(d, e, !0);
      Te(o, p), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(c), t.extends && c(t.extends), t.mixins && t.mixins.forEach(c);
  }
  if (!s && !l)
    return be(t) && i.set(t, zn), zn;
  if (ne(s))
    for (let c = 0; c < s.length; c++) {
      const d = Fe(s[c]);
      Uo(d) && (o[d] = ge);
    }
  else if (s)
    for (const c in s) {
      const d = Fe(c);
      if (Uo(d)) {
        const p = s[c], f = o[d] = ne(p) || le(p) ? { type: p } : Te({}, p), h = f.type;
        let m = !1, y = !0;
        if (ne(h))
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
        ] = y, (m || ye(f, "default")) && a.push(d);
      }
    }
  const u = [o, a];
  return be(t) && i.set(t, u), u;
}
function Uo(t) {
  return t[0] !== "$" && !li(t);
}
const io = (t) => t === "_" || t === "_ctx" || t === "$stable", ro = (t) => ne(t) ? t.map(It) : [It(t)], pf = (t, e, n) => {
  if (e._n)
    return e;
  const i = N((...r) => ro(e(...r)), n);
  return i._c = !1, i;
}, fu = (t, e, n) => {
  const i = t._ctx;
  for (const r in t) {
    if (io(r)) continue;
    const s = t[r];
    if (le(s))
      e[r] = pf(r, s, i);
    else if (s != null) {
      const o = ro(s);
      e[r] = () => o;
    }
  }
}, pu = (t, e) => {
  const n = ro(e);
  t.slots.default = () => n;
}, hu = (t, e, n) => {
  for (const i in e)
    (n || !io(i)) && (t[i] = e[i]);
}, hf = (t, e, n) => {
  const i = t.slots = lu();
  if (t.vnode.shapeFlag & 32) {
    const r = e._;
    r ? (hu(i, e, n), n && ol(i, "_", r, !0)) : fu(e, i);
  } else e && pu(t, e);
}, vf = (t, e, n) => {
  const { vnode: i, slots: r } = t;
  let s = !0, o = ge;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : hu(r, e, n) : (s = !e.$stable, fu(e, r)), o = e;
  } else e && (pu(t, e), o = { default: 1 });
  if (s)
    for (const a in r)
      !io(a) && o[a] == null && delete r[a];
}, He = wf;
function mf(t) {
  return gf(t);
}
function gf(t, e) {
  const n = kr();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: r,
    patchProp: s,
    createElement: o,
    createText: a,
    createComment: l,
    setText: u,
    setElementText: c,
    parentNode: d,
    nextSibling: p,
    setScopeId: f = Rt,
    insertStaticContent: h
  } = t, m = (w, S, I, q = null, B = null, F = null, G = void 0, U = null, W = !!S.dynamicChildren) => {
    if (w === S)
      return;
    w && !kn(w, S) && (q = Y(w), Oe(w, B, F, !0), w = null), S.patchFlag === -2 && (W = !1, S.dynamicChildren = null);
    const { type: z, ref: oe, shapeFlag: J } = S;
    switch (z) {
      case Dr:
        y(w, S, I, q);
        break;
      case ze:
        C(w, S, I, q);
        break;
      case Xi:
        w == null && _(S, I, q, G);
        break;
      case Se:
        O(
          w,
          S,
          I,
          q,
          B,
          F,
          G,
          U,
          W
        );
        break;
      default:
        J & 1 ? k(
          w,
          S,
          I,
          q,
          B,
          F,
          G,
          U,
          W
        ) : J & 6 ? V(
          w,
          S,
          I,
          q,
          B,
          F,
          G,
          U,
          W
        ) : (J & 64 || J & 128) && z.process(
          w,
          S,
          I,
          q,
          B,
          F,
          G,
          U,
          W,
          ve
        );
    }
    oe != null && B ? fi(oe, w && w.ref, F, S || w, !S) : oe == null && w && w.ref != null && fi(w.ref, null, F, w, !0);
  }, y = (w, S, I, q) => {
    if (w == null)
      i(
        S.el = a(S.children),
        I,
        q
      );
    else {
      const B = S.el = w.el;
      S.children !== w.children && u(B, S.children);
    }
  }, C = (w, S, I, q) => {
    w == null ? i(
      S.el = l(S.children || ""),
      I,
      q
    ) : S.el = w.el;
  }, _ = (w, S, I, q) => {
    [w.el, w.anchor] = h(
      w.children,
      S,
      I,
      q,
      w.el,
      w.anchor
    );
  }, b = ({ el: w, anchor: S }, I, q) => {
    let B;
    for (; w && w !== S; )
      B = p(w), i(w, I, q), w = B;
    i(S, I, q);
  }, g = ({ el: w, anchor: S }) => {
    let I;
    for (; w && w !== S; )
      I = p(w), r(w), w = I;
    r(S);
  }, k = (w, S, I, q, B, F, G, U, W) => {
    if (S.type === "svg" ? G = "svg" : S.type === "math" && (G = "mathml"), w == null)
      E(
        S,
        I,
        q,
        B,
        F,
        G,
        U,
        W
      );
    else {
      const z = w.el && w.el._isVueCE ? w.el : null;
      try {
        z && z._beginPatch(), T(
          w,
          S,
          B,
          F,
          G,
          U,
          W
        );
      } finally {
        z && z._endPatch();
      }
    }
  }, E = (w, S, I, q, B, F, G, U) => {
    let W, z;
    const { props: oe, shapeFlag: J, transition: re, dirs: ue } = w;
    if (W = w.el = o(
      w.type,
      F,
      oe && oe.is,
      oe
    ), J & 8 ? c(W, w.children) : J & 16 && M(
      w.children,
      W,
      null,
      q,
      B,
      ns(w, F),
      G,
      U
    ), ue && bn(w, null, q, "created"), x(W, w, w.scopeId, G, q), oe) {
      for (const Ce in oe)
        Ce !== "value" && !li(Ce) && s(W, Ce, null, oe[Ce], F, q);
      "value" in oe && s(W, "value", null, oe.value, F), (z = oe.onVnodeBeforeMount) && At(z, q, w);
    }
    ue && bn(w, null, q, "beforeMount");
    const pe = yf(B, re);
    pe && re.beforeEnter(W), i(W, S, I), ((z = oe && oe.onVnodeMounted) || pe || ue) && He(() => {
      z && At(z, q, w), pe && re.enter(W), ue && bn(w, null, q, "mounted");
    }, B);
  }, x = (w, S, I, q, B) => {
    if (I && f(w, I), q)
      for (let F = 0; F < q.length; F++)
        f(w, q[F]);
    if (B) {
      let F = B.subTree;
      if (S === F || gu(F.type) && (F.ssContent === S || F.ssFallback === S)) {
        const G = B.vnode;
        x(
          w,
          G,
          G.scopeId,
          G.slotScopeIds,
          B.parent
        );
      }
    }
  }, M = (w, S, I, q, B, F, G, U, W = 0) => {
    for (let z = W; z < w.length; z++) {
      const oe = w[z] = U ? Ut(w[z]) : It(w[z]);
      m(
        null,
        oe,
        S,
        I,
        q,
        B,
        F,
        G,
        U
      );
    }
  }, T = (w, S, I, q, B, F, G) => {
    const U = S.el = w.el;
    let { patchFlag: W, dynamicChildren: z, dirs: oe } = S;
    W |= w.patchFlag & 16;
    const J = w.props || ge, re = S.props || ge;
    let ue;
    if (I && wn(I, !1), (ue = re.onVnodeBeforeUpdate) && At(ue, I, S, w), oe && bn(S, w, I, "beforeUpdate"), I && wn(I, !0), (J.innerHTML && re.innerHTML == null || J.textContent && re.textContent == null) && c(U, ""), z ? A(
      w.dynamicChildren,
      z,
      U,
      I,
      q,
      ns(S, B),
      F
    ) : G || ee(
      w,
      S,
      U,
      null,
      I,
      q,
      ns(S, B),
      F,
      !1
    ), W > 0) {
      if (W & 16)
        D(U, J, re, I, B);
      else if (W & 2 && J.class !== re.class && s(U, "class", null, re.class, B), W & 4 && s(U, "style", J.style, re.style, B), W & 8) {
        const pe = S.dynamicProps;
        for (let Ce = 0; Ce < pe.length; Ce++) {
          const _e = pe[Ce], Qe = J[_e], et = re[_e];
          (et !== Qe || _e === "value") && s(U, _e, Qe, et, B, I);
        }
      }
      W & 1 && w.children !== S.children && c(U, S.children);
    } else !G && z == null && D(U, J, re, I, B);
    ((ue = re.onVnodeUpdated) || oe) && He(() => {
      ue && At(ue, I, S, w), oe && bn(S, w, I, "updated");
    }, q);
  }, A = (w, S, I, q, B, F, G) => {
    for (let U = 0; U < S.length; U++) {
      const W = w[U], z = S[U], oe = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        W.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (W.type === Se || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !kn(W, z) || // - In the case of a component, it could contain anything.
        W.shapeFlag & 198) ? d(W.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          I
        )
      );
      m(
        W,
        z,
        oe,
        null,
        q,
        B,
        F,
        G,
        !0
      );
    }
  }, D = (w, S, I, q, B) => {
    if (S !== I) {
      if (S !== ge)
        for (const F in S)
          !li(F) && !(F in I) && s(
            w,
            F,
            S[F],
            null,
            B,
            q
          );
      for (const F in I) {
        if (li(F)) continue;
        const G = I[F], U = S[F];
        G !== U && F !== "value" && s(w, F, U, G, B, q);
      }
      "value" in I && s(w, "value", S.value, I.value, B);
    }
  }, O = (w, S, I, q, B, F, G, U, W) => {
    const z = S.el = w ? w.el : a(""), oe = S.anchor = w ? w.anchor : a("");
    let { patchFlag: J, dynamicChildren: re, slotScopeIds: ue } = S;
    ue && (U = U ? U.concat(ue) : ue), w == null ? (i(z, I, q), i(oe, I, q), M(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      S.children || [],
      I,
      oe,
      B,
      F,
      G,
      U,
      W
    )) : J > 0 && J & 64 && re && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    w.dynamicChildren && w.dynamicChildren.length === re.length ? (A(
      w.dynamicChildren,
      re,
      I,
      B,
      F,
      G,
      U
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (S.key != null || B && S === B.subTree) && so(
      w,
      S,
      !0
      /* shallow */
    )) : ee(
      w,
      S,
      I,
      oe,
      B,
      F,
      G,
      U,
      W
    );
  }, V = (w, S, I, q, B, F, G, U, W) => {
    S.slotScopeIds = U, w == null ? S.shapeFlag & 512 ? B.ctx.activate(
      S,
      I,
      q,
      G,
      W
    ) : $(
      S,
      I,
      q,
      B,
      F,
      G,
      W
    ) : K(w, S, W);
  }, $ = (w, S, I, q, B, F, G) => {
    const U = w.component = Ef(
      w,
      q,
      B
    );
    if (Mr(w) && (U.ctx.renderer = ve), Tf(U, !1, G), U.asyncDep) {
      if (B && B.registerDep(U, se, G), !w.el) {
        const W = U.subTree = H(ze);
        C(null, W, S, I), w.placeholder = W.el;
      }
    } else
      se(
        U,
        w,
        S,
        I,
        B,
        F,
        G
      );
  }, K = (w, S, I) => {
    const q = S.component = w.component;
    if (lf(w, S, I))
      if (q.asyncDep && !q.asyncResolved) {
        Z(q, S, I);
        return;
      } else
        q.next = S, q.update();
    else
      S.el = w.el, q.vnode = S;
  }, se = (w, S, I, q, B, F, G) => {
    const U = () => {
      if (w.isMounted) {
        let { next: J, bu: re, u: ue, parent: pe, vnode: Ce } = w;
        {
          const Et = vu(w);
          if (Et) {
            J && (J.el = Ce.el, Z(w, J, G)), Et.asyncDep.then(() => {
              He(() => {
                w.isUnmounted || z();
              }, B);
            });
            return;
          }
        }
        let _e = J, Qe;
        wn(w, !1), J ? (J.el = Ce.el, Z(w, J, G)) : J = Ce, re && Xr(re), (Qe = J.props && J.props.onVnodeBeforeUpdate) && At(Qe, pe, J, Ce), wn(w, !0);
        const et = Wo(w), kt = w.subTree;
        w.subTree = et, m(
          kt,
          et,
          // parent may have changed if it's in a teleport
          d(kt.el),
          // anchor may have changed if it's in a fragment
          Y(kt),
          w,
          B,
          F
        ), J.el = et.el, _e === null && uf(w, et.el), ue && He(ue, B), (Qe = J.props && J.props.onVnodeUpdated) && He(
          () => At(Qe, pe, J, Ce),
          B
        );
      } else {
        let J;
        const { el: re, props: ue } = S, { bm: pe, m: Ce, parent: _e, root: Qe, type: et } = w, kt = Hn(S);
        wn(w, !1), pe && Xr(pe), !kt && (J = ue && ue.onVnodeBeforeMount) && At(J, _e, S), wn(w, !0);
        {
          Qe.ce && Qe.ce._hasShadowRoot() && Qe.ce._injectChildStyle(et);
          const Et = w.subTree = Wo(w);
          m(
            null,
            Et,
            I,
            q,
            w,
            B,
            F
          ), S.el = Et.el;
        }
        if (Ce && He(Ce, B), !kt && (J = ue && ue.onVnodeMounted)) {
          const Et = S;
          He(
            () => At(J, _e, Et),
            B
          );
        }
        (S.shapeFlag & 256 || _e && Hn(_e.vnode) && _e.vnode.shapeFlag & 256) && w.a && He(w.a, B), w.isMounted = !0, S = I = q = null;
      }
    };
    w.scope.on();
    const W = w.effect = new pl(U);
    w.scope.off();
    const z = w.update = W.run.bind(W), oe = w.job = W.runIfDirty.bind(W);
    oe.i = w, oe.id = w.uid, W.scheduler = () => to(oe), wn(w, !0), z();
  }, Z = (w, S, I) => {
    S.component = w;
    const q = w.vnode.props;
    w.vnode = S, w.next = null, df(w, S.props, q, I), vf(w, S.children, I), Yt(), Mo(w), Jt();
  }, ee = (w, S, I, q, B, F, G, U, W = !1) => {
    const z = w && w.children, oe = w ? w.shapeFlag : 0, J = S.children, { patchFlag: re, shapeFlag: ue } = S;
    if (re > 0) {
      if (re & 128) {
        $e(
          z,
          J,
          I,
          q,
          B,
          F,
          G,
          U,
          W
        );
        return;
      } else if (re & 256) {
        we(
          z,
          J,
          I,
          q,
          B,
          F,
          G,
          U,
          W
        );
        return;
      }
    }
    ue & 8 ? (oe & 16 && Ht(z, B, F), J !== z && c(I, J)) : oe & 16 ? ue & 16 ? $e(
      z,
      J,
      I,
      q,
      B,
      F,
      G,
      U,
      W
    ) : Ht(z, B, F, !0) : (oe & 8 && c(I, ""), ue & 16 && M(
      J,
      I,
      q,
      B,
      F,
      G,
      U,
      W
    ));
  }, we = (w, S, I, q, B, F, G, U, W) => {
    w = w || zn, S = S || zn;
    const z = w.length, oe = S.length, J = Math.min(z, oe);
    let re;
    for (re = 0; re < J; re++) {
      const ue = S[re] = W ? Ut(S[re]) : It(S[re]);
      m(
        w[re],
        ue,
        I,
        null,
        B,
        F,
        G,
        U,
        W
      );
    }
    z > oe ? Ht(
      w,
      B,
      F,
      !0,
      !1,
      J
    ) : M(
      S,
      I,
      q,
      B,
      F,
      G,
      U,
      W,
      J
    );
  }, $e = (w, S, I, q, B, F, G, U, W) => {
    let z = 0;
    const oe = S.length;
    let J = w.length - 1, re = oe - 1;
    for (; z <= J && z <= re; ) {
      const ue = w[z], pe = S[z] = W ? Ut(S[z]) : It(S[z]);
      if (kn(ue, pe))
        m(
          ue,
          pe,
          I,
          null,
          B,
          F,
          G,
          U,
          W
        );
      else
        break;
      z++;
    }
    for (; z <= J && z <= re; ) {
      const ue = w[J], pe = S[re] = W ? Ut(S[re]) : It(S[re]);
      if (kn(ue, pe))
        m(
          ue,
          pe,
          I,
          null,
          B,
          F,
          G,
          U,
          W
        );
      else
        break;
      J--, re--;
    }
    if (z > J) {
      if (z <= re) {
        const ue = re + 1, pe = ue < oe ? S[ue].el : q;
        for (; z <= re; )
          m(
            null,
            S[z] = W ? Ut(S[z]) : It(S[z]),
            I,
            pe,
            B,
            F,
            G,
            U,
            W
          ), z++;
      }
    } else if (z > re)
      for (; z <= J; )
        Oe(w[z], B, F, !0), z++;
    else {
      const ue = z, pe = z, Ce = /* @__PURE__ */ new Map();
      for (z = pe; z <= re; z++) {
        const rt = S[z] = W ? Ut(S[z]) : It(S[z]);
        rt.key != null && Ce.set(rt.key, z);
      }
      let _e, Qe = 0;
      const et = re - pe + 1;
      let kt = !1, Et = 0;
      const ei = new Array(et);
      for (z = 0; z < et; z++) ei[z] = 0;
      for (z = ue; z <= J; z++) {
        const rt = w[z];
        if (Qe >= et) {
          Oe(rt, B, F, !0);
          continue;
        }
        let Tt;
        if (rt.key != null)
          Tt = Ce.get(rt.key);
        else
          for (_e = pe; _e <= re; _e++)
            if (ei[_e - pe] === 0 && kn(rt, S[_e])) {
              Tt = _e;
              break;
            }
        Tt === void 0 ? Oe(rt, B, F, !0) : (ei[Tt - pe] = z + 1, Tt >= Et ? Et = Tt : kt = !0, m(
          rt,
          S[Tt],
          I,
          null,
          B,
          F,
          G,
          U,
          W
        ), Qe++);
      }
      const ko = kt ? bf(ei) : zn;
      for (_e = ko.length - 1, z = et - 1; z >= 0; z--) {
        const rt = pe + z, Tt = S[rt], Eo = S[rt + 1], To = rt + 1 < oe ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Eo.el || mu(Eo)
        ) : q;
        ei[z] === 0 ? m(
          null,
          Tt,
          I,
          To,
          B,
          F,
          G,
          U,
          W
        ) : kt && (_e < 0 || z !== ko[_e] ? Ze(Tt, I, To, 2) : _e--);
      }
    }
  }, Ze = (w, S, I, q, B = null) => {
    const { el: F, type: G, transition: U, children: W, shapeFlag: z } = w;
    if (z & 6) {
      Ze(w.component.subTree, S, I, q);
      return;
    }
    if (z & 128) {
      w.suspense.move(S, I, q);
      return;
    }
    if (z & 64) {
      G.move(w, S, I, ve);
      return;
    }
    if (G === Se) {
      i(F, S, I);
      for (let J = 0; J < W.length; J++)
        Ze(W[J], S, I, q);
      i(w.anchor, S, I);
      return;
    }
    if (G === Xi) {
      b(w, S, I);
      return;
    }
    if (q !== 2 && z & 1 && U)
      if (q === 0)
        U.beforeEnter(F), i(F, S, I), He(() => U.enter(F), B);
      else {
        const { leave: J, delayLeave: re, afterLeave: ue } = U, pe = () => {
          w.ctx.isUnmounted ? r(F) : i(F, S, I);
        }, Ce = () => {
          F._isLeaving && F[Ot](
            !0
            /* cancelled */
          ), J(F, () => {
            pe(), ue && ue();
          });
        };
        re ? re(F, pe, Ce) : Ce();
      }
    else
      i(F, S, I);
  }, Oe = (w, S, I, q = !1, B = !1) => {
    const {
      type: F,
      props: G,
      ref: U,
      children: W,
      dynamicChildren: z,
      shapeFlag: oe,
      patchFlag: J,
      dirs: re,
      cacheIndex: ue
    } = w;
    if (J === -2 && (B = !1), U != null && (Yt(), fi(U, null, I, w, !0), Jt()), ue != null && (S.renderCache[ue] = void 0), oe & 256) {
      S.ctx.deactivate(w);
      return;
    }
    const pe = oe & 1 && re, Ce = !Hn(w);
    let _e;
    if (Ce && (_e = G && G.onVnodeBeforeUnmount) && At(_e, S, w), oe & 6)
      Qn(w.component, I, q);
    else {
      if (oe & 128) {
        w.suspense.unmount(I, q);
        return;
      }
      pe && bn(w, null, S, "beforeUnmount"), oe & 64 ? w.type.remove(
        w,
        S,
        I,
        ve,
        q
      ) : z && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !z.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (F !== Se || J > 0 && J & 64) ? Ht(
        z,
        S,
        I,
        !1,
        !0
      ) : (F === Se && J & 384 || !B && oe & 16) && Ht(W, S, I), q && Nt(w);
    }
    (Ce && (_e = G && G.onVnodeUnmounted) || pe) && He(() => {
      _e && At(_e, S, w), pe && bn(w, null, S, "unmounted");
    }, I);
  }, Nt = (w) => {
    const { type: S, el: I, anchor: q, transition: B } = w;
    if (S === Se) {
      qt(I, q);
      return;
    }
    if (S === Xi) {
      g(w);
      return;
    }
    const F = () => {
      r(I), B && !B.persisted && B.afterLeave && B.afterLeave();
    };
    if (w.shapeFlag & 1 && B && !B.persisted) {
      const { leave: G, delayLeave: U } = B, W = () => G(I, F);
      U ? U(w.el, F, W) : W();
    } else
      F();
  }, qt = (w, S) => {
    let I;
    for (; w !== S; )
      I = p(w), r(w), w = I;
    r(S);
  }, Qn = (w, S, I) => {
    const { bum: q, scope: B, job: F, subTree: G, um: U, m: W, a: z } = w;
    Ko(W), Ko(z), q && Xr(q), B.stop(), F && (F.flags |= 8, Oe(G, w, S, I)), U && He(U, S), He(() => {
      w.isUnmounted = !0;
    }, S);
  }, Ht = (w, S, I, q = !1, B = !1, F = 0) => {
    for (let G = F; G < w.length; G++)
      Oe(w[G], S, I, q, B);
  }, Y = (w) => {
    if (w.shapeFlag & 6)
      return Y(w.component.subTree);
    if (w.shapeFlag & 128)
      return w.suspense.next();
    const S = p(w.anchor || w.el), I = S && S[ql];
    return I ? p(I) : S;
  };
  let ae = !1;
  const de = (w, S, I) => {
    let q;
    w == null ? S._vnode && (Oe(S._vnode, null, null, !0), q = S._vnode.component) : m(
      S._vnode || null,
      w,
      S,
      null,
      null,
      null,
      I
    ), S._vnode = w, ae || (ae = !0, Mo(q), $l(), ae = !1);
  }, ve = {
    p: m,
    um: Oe,
    m: Ze,
    r: Nt,
    mt: $,
    mc: M,
    pc: ee,
    pbc: A,
    n: Y,
    o: t
  };
  return {
    render: de,
    hydrate: void 0,
    createApp: tf(de)
  };
}
function ns({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function wn({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function yf(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function so(t, e, n = !1) {
  const i = t.children, r = e.children;
  if (ne(i) && ne(r))
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let a = r[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[s] = Ut(r[s]), a.el = o.el), !n && a.patchFlag !== -2 && so(o, a)), a.type === Dr && (a.patchFlag === -1 && (a = r[s] = Ut(a)), a.el = o.el), a.type === ze && !a.el && (a.el = o.el);
    }
}
function bf(t) {
  const e = t.slice(), n = [0];
  let i, r, s, o, a;
  const l = t.length;
  for (i = 0; i < l; i++) {
    const u = t[i];
    if (u !== 0) {
      if (r = n[n.length - 1], t[r] < u) {
        e[i] = r, n.push(i);
        continue;
      }
      for (s = 0, o = n.length - 1; s < o; )
        a = s + o >> 1, t[n[a]] < u ? s = a + 1 : o = a;
      u < t[n[s]] && (s > 0 && (e[i] = n[s - 1]), n[s] = i);
    }
  }
  for (s = n.length, o = n[s - 1]; s-- > 0; )
    n[s] = o, o = e[o];
  return n;
}
function vu(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : vu(e);
}
function Ko(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function mu(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? mu(e.subTree) : null;
}
const gu = (t) => t.__isSuspense;
function wf(t, e) {
  e && e.pendingBranch ? ne(t) ? e.effects.push(...t) : e.effects.push(t) : Sd(t);
}
const Se = /* @__PURE__ */ Symbol.for("v-fgt"), Dr = /* @__PURE__ */ Symbol.for("v-txt"), ze = /* @__PURE__ */ Symbol.for("v-cmt"), Xi = /* @__PURE__ */ Symbol.for("v-stc"), hi = [];
let Ye = null;
function P(t = !1) {
  hi.push(Ye = t ? null : []);
}
function _f() {
  hi.pop(), Ye = hi[hi.length - 1] || null;
}
let Un = 1;
function cr(t, e = !1) {
  Un += t, t < 0 && Ye && e && (Ye.hasOnce = !0);
}
function yu(t) {
  return t.dynamicChildren = Un > 0 ? Ye || zn : null, _f(), Un > 0 && Ye && Ye.push(t), t;
}
function Q(t, e, n, i, r, s) {
  return yu(
    te(
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
function j(t, e, n, i, r) {
  return yu(
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
function kn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const bu = ({ key: t }) => t ?? null, Yi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Ee(t) || /* @__PURE__ */ Be(t) || le(t) ? { i: Ne, r: t, k: e, f: !!n } : t : null);
function te(t, e = null, n = null, i = 0, r = null, s = t === Se ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && bu(e),
    ref: e && Yi(e),
    scopeId: Fl,
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
  return a ? (oo(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= Ee(n) ? 8 : 16), Un > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ye && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ye.push(l), l;
}
const H = xf;
function xf(t, e = null, n = null, i = 0, r = null, s = !1) {
  if ((!t || t === Ql) && (t = ze), xi(t)) {
    const a = Qt(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && oo(a, n), Un > 0 && !s && Ye && (a.shapeFlag & 6 ? Ye[Ye.indexOf(t)] = a : Ye.push(a)), a.patchFlag = -2, a;
  }
  if (If(t) && (t = t.__vccOpts), e) {
    e = $r(e);
    let { class: a, style: l } = e;
    a && !Ee(a) && (e.class = pt(a)), be(l) && (/* @__PURE__ */ Or(l) && !ne(l) && (l = Te({}, l)), e.style = Ct(l));
  }
  const o = Ee(t) ? 1 : gu(t) ? 128 : Hl(t) ? 64 : be(t) ? 4 : le(t) ? 2 : 0;
  return te(
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
  return t ? /* @__PURE__ */ Or(t) || uu(t) ? Te({}, t) : t : null;
}
function Qt(t, e, n = !1, i = !1) {
  const { props: r, ref: s, patchFlag: o, children: a, transition: l } = t, u = e ? xe(r || {}, e) : r, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: u,
    key: u && bu(u),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? ne(s) ? s.concat(Yi(e)) : [s, Yi(e)] : Yi(e)
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
    patchFlag: e && t.type !== Se ? o === -1 ? 16 : o | 16 : o,
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
    c,
    l.clone(c)
  ), c;
}
function De(t = " ", e = 0) {
  return H(Dr, null, t, e);
}
function Sf(t, e) {
  const n = H(Xi, null, t);
  return n.staticCount = e, n;
}
function ce(t = "", e = !1) {
  return e ? (P(), j(ze, null, t)) : H(ze, null, t);
}
function It(t) {
  return t == null || typeof t == "boolean" ? H(ze) : ne(t) ? H(
    Se,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : xi(t) ? Ut(t) : H(Dr, null, String(t));
}
function Ut(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Qt(t);
}
function oo(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (ne(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const r = e.default;
      r && (r._c && (r._d = !1), oo(t, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = e._;
      !r && !uu(e) ? e._ctx = Ne : r === 3 && Ne && (Ne.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else le(e) ? (e = { default: e, _ctx: Ne }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [De(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function xe(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const r in i)
      if (r === "class")
        e.class !== i.class && (e.class = pt([e.class, i.class]));
      else if (r === "style")
        e.style = Ct([e.style, i.style]);
      else if (wr(r)) {
        const s = e[r], o = i[r];
        o && s !== o && !(ne(s) && s.includes(o)) && (e[r] = s ? [].concat(s, o) : o);
      } else r !== "" && (e[r] = i[r]);
  }
  return e;
}
function At(t, e, n, i = null) {
  _t(t, e, 7, [
    n,
    i
  ]);
}
const Cf = iu();
let kf = 0;
function Ef(t, e, n) {
  const i = t.type, r = (e ? e.appContext : t.appContext) || Cf, s = {
    uid: kf++,
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
    scope: new cl(
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
    propsOptions: du(i, r),
    emitsOptions: su(i, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ge,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: ge,
    data: ge,
    props: ge,
    attrs: ge,
    slots: ge,
    refs: ge,
    setupState: ge,
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = rf.bind(null, s), t.ce && t.ce(s), s;
}
let je = null;
const lt = () => je || Ne;
let dr, Ls;
{
  const t = kr(), e = (n, i) => {
    let r;
    return (r = t[n]) || (r = t[n] = []), r.push(i), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  dr = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => je = n
  ), Ls = e(
    "__VUE_SSR_SETTERS__",
    (n) => Si = n
  );
}
const Li = (t) => {
  const e = je;
  return dr(t), t.scope.on(), () => {
    t.scope.off(), dr(e);
  };
}, Go = () => {
  je && je.scope.off(), dr(null);
};
function wu(t) {
  return t.vnode.shapeFlag & 4;
}
let Si = !1;
function Tf(t, e = !1, n = !1) {
  e && Ls(e);
  const { props: i, children: r } = t.vnode, s = wu(t);
  cf(t, i, s, e), hf(t, r, n || e);
  const o = s ? Af(t, e) : void 0;
  return e && Ls(!1), o;
}
function Af(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, jd);
  const { setup: i } = n;
  if (i) {
    Yt();
    const r = t.setupContext = i.length > 1 ? xu(t) : null, s = Li(t), o = Mi(
      i,
      t,
      0,
      [
        t.props,
        r
      ]
    ), a = rl(o);
    if (Jt(), s(), (a || t.sp) && !Hn(t) && Jl(t), a) {
      if (o.then(Go, Go), e)
        return o.then((l) => {
          Xo(t, l);
        }).catch((l) => {
          Ir(l, t, 0);
        });
      t.asyncDep = o;
    } else
      Xo(t, o);
  } else
    _u(t);
}
function Xo(t, e, n) {
  le(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : be(e) && (t.setupState = Il(e)), _u(t);
}
function _u(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || Rt);
  {
    const r = Li(t);
    Yt();
    try {
      Xd(t);
    } finally {
      Jt(), r();
    }
  }
}
const Pf = {
  get(t, e) {
    return We(t, "get", ""), t[e];
  }
};
function xu(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, Pf),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Br(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(Il(Pl(t.exposed)), {
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
function Of(t, e = !0) {
  return le(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function If(t) {
  return le(t) && "__vccOpts" in t;
}
const R = (t, e) => /* @__PURE__ */ yd(t, e, Si);
function Lt(t, e, n) {
  try {
    cr(-1);
    const i = arguments.length;
    return i === 2 ? be(e) && !ne(e) ? xi(e) ? H(t, null, [e]) : H(t, e) : H(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && xi(n) && (n = [n]), H(t, e, n));
  } finally {
    cr(1);
  }
}
function Mf(t, e, n, i) {
  const r = n[i];
  if (r && Su(r, t))
    return r;
  const s = e();
  return s.memo = t.slice(), s.cacheIndex = i, n[i] = s;
}
function Su(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Ke(n[i], e[i]))
      return !1;
  return Un > 0 && Ye && Ye.push(t), !0;
}
const Rf = "3.5.28";
let Ds;
const Yo = typeof window < "u" && window.trustedTypes;
if (Yo)
  try {
    Ds = /* @__PURE__ */ Yo.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const Cu = Ds ? (t) => Ds.createHTML(t) : (t) => t, Lf = "http://www.w3.org/2000/svg", Df = "http://www.w3.org/1998/Math/MathML", jt = typeof document < "u" ? document : null, Jo = jt && /* @__PURE__ */ jt.createElement("template"), $f = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const r = e === "svg" ? jt.createElementNS(Lf, t) : e === "mathml" ? jt.createElementNS(Df, t) : n ? jt.createElement(t, { is: n }) : jt.createElement(t);
    return t === "select" && i && i.multiple != null && r.setAttribute("multiple", i.multiple), r;
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
  insertStaticContent(t, e, n, i, r, s) {
    const o = n ? n.previousSibling : e.lastChild;
    if (r && (r === s || r.nextSibling))
      for (; e.insertBefore(r.cloneNode(!0), n), !(r === s || !(r = r.nextSibling)); )
        ;
    else {
      Jo.innerHTML = Cu(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Jo.content;
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
}, an = "transition", ii = "animation", Ci = /* @__PURE__ */ Symbol("_vtc"), ku = {
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
}, Bf = /* @__PURE__ */ Te(
  {},
  jl,
  ku
), Ff = (t) => (t.displayName = "Transition", t.props = Bf, t), ao = /* @__PURE__ */ Ff(
  (t, { slots: e }) => Lt(Md, zf(t), e)
), _n = (t, e = []) => {
  ne(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, Zo = (t) => t ? ne(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function zf(t) {
  const e = {};
  for (const O in t)
    O in ku || (e[O] = t[O]);
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
    appearActiveClass: u = o,
    appearToClass: c = a,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: p = `${n}-leave-active`,
    leaveToClass: f = `${n}-leave-to`
  } = t, h = Nf(r), m = h && h[0], y = h && h[1], {
    onBeforeEnter: C,
    onEnter: _,
    onEnterCancelled: b,
    onLeave: g,
    onLeaveCancelled: k,
    onBeforeAppear: E = C,
    onAppear: x = _,
    onAppearCancelled: M = b
  } = e, T = (O, V, $, K) => {
    O._enterCancelled = K, xn(O, V ? c : a), xn(O, V ? u : o), $ && $();
  }, A = (O, V) => {
    O._isLeaving = !1, xn(O, d), xn(O, f), xn(O, p), V && V();
  }, D = (O) => (V, $) => {
    const K = O ? x : _, se = () => T(V, O, $);
    _n(K, [V, se]), Qo(() => {
      xn(V, O ? l : s), Wt(V, O ? c : a), Zo(K) || ea(V, i, m, se);
    });
  };
  return Te(e, {
    onBeforeEnter(O) {
      _n(C, [O]), Wt(O, s), Wt(O, o);
    },
    onBeforeAppear(O) {
      _n(E, [O]), Wt(O, l), Wt(O, u);
    },
    onEnter: D(!1),
    onAppear: D(!0),
    onLeave(O, V) {
      O._isLeaving = !0;
      const $ = () => A(O, V);
      Wt(O, d), O._enterCancelled ? (Wt(O, p), ia(O)) : (ia(O), Wt(O, p)), Qo(() => {
        O._isLeaving && (xn(O, d), Wt(O, f), Zo(g) || ea(O, i, y, $));
      }), _n(g, [O, $]);
    },
    onEnterCancelled(O) {
      T(O, !1, void 0, !0), _n(b, [O]);
    },
    onAppearCancelled(O) {
      T(O, !0, void 0, !0), _n(M, [O]);
    },
    onLeaveCancelled(O) {
      A(O), _n(k, [O]);
    }
  });
}
function Nf(t) {
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
  return xs(t);
}
function Wt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[Ci] || (t[Ci] = /* @__PURE__ */ new Set())).add(e);
}
function xn(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[Ci];
  n && (n.delete(e), n.size || (t[Ci] = void 0));
}
function Qo(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let qf = 0;
function ea(t, e, n, i) {
  const r = t._endId = ++qf, s = () => {
    r === t._endId && i();
  };
  if (n != null)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = Hf(t, e);
  if (!o)
    return i();
  const u = o + "end";
  let c = 0;
  const d = () => {
    t.removeEventListener(u, p), s();
  }, p = (f) => {
    f.target === t && ++c >= l && d();
  };
  setTimeout(() => {
    c < l && d();
  }, a + 1), t.addEventListener(u, p);
}
function Hf(t, e) {
  const n = window.getComputedStyle(t), i = (h) => (n[h] || "").split(", "), r = i(`${an}Delay`), s = i(`${an}Duration`), o = ta(r, s), a = i(`${ii}Delay`), l = i(`${ii}Duration`), u = ta(a, l);
  let c = null, d = 0, p = 0;
  e === an ? o > 0 && (c = an, d = o, p = s.length) : e === ii ? u > 0 && (c = ii, d = u, p = l.length) : (d = Math.max(o, u), c = d > 0 ? o > u ? an : ii : null, p = c ? c === an ? s.length : l.length : 0);
  const f = c === an && /\b(?:transform|all)(?:,|$)/.test(
    i(`${an}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: p,
    hasTransform: f
  };
}
function ta(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => na(n) + na(t[i])));
}
function na(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function ia(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function Vf(t, e, n) {
  const i = t[Ci];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const fr = /* @__PURE__ */ Symbol("_vod"), Eu = /* @__PURE__ */ Symbol("_vsh"), Wf = {
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
  t.style.display = e ? t[fr] : "none", t[Eu] = !e;
}
const jf = /* @__PURE__ */ Symbol(""), Uf = /(?:^|;)\s*display\s*:/;
function Kf(t, e, n) {
  const i = t.style, r = Ee(n);
  let s = !1;
  if (n && !r) {
    if (e)
      if (Ee(e))
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
      const o = i[jf];
      o && (n += ";" + o), i.cssText = n, s = Uf.test(n);
    }
  } else e && t.removeAttribute("style");
  fr in t && (t[fr] = s ? i.display : "", t[Eu] && (i.display = "none"));
}
const ra = /\s*!important$/;
function Ji(t, e, n) {
  if (ne(n))
    n.forEach((i) => Ji(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Gf(t, e);
    ra.test(n) ? t.setProperty(
      nt(i),
      n.replace(ra, ""),
      "important"
    ) : t[i] = n;
  }
}
const sa = ["Webkit", "Moz", "ms"], rs = {};
function Gf(t, e) {
  const n = rs[e];
  if (n)
    return n;
  let i = Fe(e);
  if (i !== "filter" && i in t)
    return rs[e] = i;
  i = Cr(i);
  for (let r = 0; r < sa.length; r++) {
    const s = sa[r] + i;
    if (s in t)
      return rs[e] = s;
  }
  return e;
}
const oa = "http://www.w3.org/1999/xlink";
function aa(t, e, n, i, r, s = jc(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(oa, e.slice(6, e.length)) : t.setAttributeNS(oa, e, n) : n == null || s && !al(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    s ? "" : bt(n) ? String(n) : n
  );
}
function la(t, e, n, i, r) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? Cu(n) : n);
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
    a === "boolean" ? n = al(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(r || e);
}
function Xf(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Yf(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const ua = /* @__PURE__ */ Symbol("_vei");
function Jf(t, e, n, i, r = null) {
  const s = t[ua] || (t[ua] = {}), o = s[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = Zf(e);
    if (i) {
      const u = s[e] = tp(
        i,
        r
      );
      Xf(t, a, u, l);
    } else o && (Yf(t, a, o, l), s[e] = void 0);
  }
}
const ca = /(?:Once|Passive|Capture)$/;
function Zf(t) {
  let e;
  if (ca.test(t)) {
    e = {};
    let i;
    for (; i = t.match(ca); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : nt(t.slice(2)), e];
}
let ss = 0;
const Qf = /* @__PURE__ */ Promise.resolve(), ep = () => ss || (Qf.then(() => ss = 0), ss = Date.now());
function tp(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    _t(
      np(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = ep(), n;
}
function np(t, e) {
  if (ne(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (i) => (r) => !r._stopped && i && i(r)
    );
  } else
    return e;
}
const da = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, ip = (t, e, n, i, r, s) => {
  const o = r === "svg";
  e === "class" ? Vf(t, i, o) : e === "style" ? Kf(t, n, i) : wr(e) ? Ks(e) || Jf(t, e, n, i, s) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : rp(t, e, i, o)) ? (la(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && aa(t, e, i, o, s, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !Ee(i)) ? la(t, Fe(e), i, s, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), aa(t, e, i, o));
};
function rp(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && da(e) && le(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const r = t.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return da(e) && Ee(n) ? !1 : e in t;
}
const fa = {};
// @__NO_SIDE_EFFECTS__
function sp(t, e, n) {
  let i = /* @__PURE__ */ X(t, e);
  _r(i) && (i = Te({}, i, e));
  class r extends lo {
    constructor(o) {
      super(i, o, n);
    }
  }
  return r.def = i, r;
}
const op = typeof HTMLElement < "u" ? HTMLElement : class {
};
class lo extends op {
  constructor(e, n = {}, i = ha) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== ha ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
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
      if (e instanceof lo) {
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
      if (s && !ne(s))
        for (const l in s) {
          const u = s[l];
          (u === Number || u && u.type === Number) && (l in this._props && (this._props[l] = xs(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[Fe(l)] = !0);
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
        ye(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => v(n[i])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, i = ne(n) ? n : Object.keys(n || {});
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
    let i = n ? this.getAttribute(e) : fa;
    const r = Fe(e);
    n && this._numberProps && this._numberProps[r] && (i = xs(i)), this._setProp(r, i, !1, !0);
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
    if (n !== this._props[e] && (this._dirty = !0, n === fa ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), i)) {
      const s = this._ob;
      s && (this._processMutations(s.takeRecords()), s.disconnect()), n === !0 ? this.setAttribute(nt(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(nt(e), n + "") : n || this.removeAttribute(nt(e)), s && s.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), dp(e, this._root);
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
            const u = n + "-s", c = document.createTreeWalker(l, 1);
            l.setAttribute(u, "");
            let d;
            for (; d = c.nextNode(); )
              d.setAttribute(u, "");
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
const ap = ["ctrl", "shift", "alt", "meta"], lp = {
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
  exact: (t, e) => ap.some((n) => t[`${n}Key`] && !e.includes(n))
}, Dt = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((r, ...s) => {
    for (let o = 0; o < e.length; o++) {
      const a = lp[e[o]];
      if (a && a(r, e)) return;
    }
    return t(r, ...s);
  }));
}, up = {
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
      (o) => o === s || up[o] === s
    ))
      return t(r);
  }));
}, cp = /* @__PURE__ */ Te({ patchProp: ip }, $f);
let pa;
function Tu() {
  return pa || (pa = mf(cp));
}
const dp = ((...t) => {
  Tu().render(...t);
}), ha = ((...t) => {
  const e = Tu().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const r = pp(i);
    if (!r) return;
    const s = e._component;
    !le(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, fp(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, e;
});
function fp(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function pp(t) {
  return Ee(t) ? document.querySelector(t) : t;
}
const hp = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', vp = ["aria-label"], mp = /* @__PURE__ */ X({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (P(), Q("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      ie(e.$slots, "default", {}, void 0, !0)
    ], 8, vp));
  }
}), gp = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", Pe = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, r] of e)
    n[i] = r;
  return n;
}, va = /* @__PURE__ */ Pe(mp, [["styles", [gp]], ["__scopeId", "data-v-3d3f8eba"]]);
const yp = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ma = (t) => t === "";
const bp = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const ga = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const wp = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const _p = (t) => {
  const e = wp(t);
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
const xp = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": s,
  size: o = si.width,
  color: a = si.stroke,
  ...l
}, { slots: u }) => Lt(
  "svg",
  {
    ...si,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": ma(n) || ma(i) || n === !0 || i === !0 ? Number(r || s || si["stroke-width"]) * 24 / Number(o) : r || s || si["stroke-width"],
    class: bp(
      "lucide",
      l.class,
      ...t ? [`lucide-${ga(_p(t))}-icon`, `lucide-${ga(t)}`] : ["lucide-icon"]
    ),
    ...!u.default && !yp(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Lt(...c)), ...u.default ? [u.default()] : []]
);
const qe = (t, e) => (n, { slots: i, attrs: r }) => Lt(
  xp,
  {
    ...r,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const Sp = qe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Fr = qe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Au = qe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Cp = qe("clipboard-list", [
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
const kp = qe("clipboard-type", [
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
const Ep = qe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Tp = qe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const ya = qe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ap = qe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Pp = qe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Op = qe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Ip = qe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Mp = qe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Rp = qe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Lp = qe("volume-2", [
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
const Dp = qe("volume-x", [
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
const uo = qe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), $p = {
  "arrow-down": Sp,
  check: Fr,
  "chevron-down": Au,
  "clipboard-list": Cp,
  "clipboard-type": kp,
  copy: Ep,
  download: Tp,
  pause: Ap,
  play: Pp,
  settings: Op,
  "skip-back": Ip,
  "skip-forward": Mp,
  users: Rp,
  volume: Lp,
  "volume-mute": Dp,
  x: uo,
  "circle-notch": ya,
  spinner: ya
};
function $s(t) {
  if (t)
    return $p[t];
}
const Pu = {
  sm: 16,
  md: 20,
  lg: 24
}, Bp = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Fp = /* @__PURE__ */ X({
  __name: "EditorIcon",
  props: {
    name: { type: String },
    size: { type: Number },
    spin: { type: Boolean }
  },
  setup(t) {
    const e = t, n = R(() => $s(e.name)), i = R(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (r, s) => n.value ? (P(), j(no(n.value), {
      key: 0,
      style: Ct(i.value),
      class: pt(["editor-icon", { "editor-icon--spin": t.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (P(), Q("span", Bp, "?"));
  }
}), zp = ".editor-icon[data-v-210c7f09]{flex-shrink:0}.editor-icon--missing[data-v-210c7f09]{display:inline-flex;align-items:center;justify-content:center;opacity:.5;font-size:1em;line-height:1}.editor-icon--spin[data-v-210c7f09]{animation:editor-icon-spin-210c7f09 1s linear infinite}@keyframes editor-icon-spin-210c7f09{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.editor-icon--spin[data-v-210c7f09]{animation:none}}", Zi = /* @__PURE__ */ Pe(Fp, [["styles", [zp]], ["__scopeId", "data-v-210c7f09"]]), Np = ["type", "disabled", "aria-disabled", "aria-label"], qp = {
  key: 3,
  class: "editor-btn__label"
}, Hp = /* @__PURE__ */ X({
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
    const e = t, n = Ud(), i = R(() => !!$s(e.icon)), r = R(() => !!$s(e.iconRight)), s = R(() => Pu[e.size]), o = R(() => e.disabled || e.loading), a = R(() => !!e.label || !!n.default), l = R(
      () => e.loading || i.value || !!n.icon
    ), u = R(() => l.value && !a.value), c = R(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      u.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, p) => (P(), Q("button", {
      type: t.type,
      class: pt(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": t.ariaLabel
    }, [
      t.loading ? (P(), j(Zi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : i.value ? (P(), j(Zi, {
        key: 1,
        name: t.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? ie(d.$slots, "icon", { key: 2 }, void 0, !0) : ce("", !0),
      a.value ? (P(), Q("span", qp, [
        ie(d.$slots, "default", {}, () => [
          De(fe(t.label), 1)
        ], !0)
      ])) : ce("", !0),
      r.value ? (P(), j(Zi, {
        key: 4,
        name: t.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? ie(d.$slots, "icon-right", { key: 5 }, void 0, !0) : ce("", !0)
    ], 10, Np));
  }
}), Vp = ".editor-btn[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary);--btn-padding-y: 0;--btn-padding-x: var(--spacing-sm);--btn-font-size: var(--font-size-xs);--btn-height: 32px;--btn-gap: var(--spacing-xs);display:inline-flex;align-items:center;justify-content:center;gap:var(--btn-gap);box-sizing:border-box;height:var(--btn-height);padding:var(--btn-padding-y) var(--btn-padding-x);font-family:var(--font-family);font-size:var(--btn-font-size);font-weight:500;line-height:1;color:var(--btn-text);background-color:var(--btn-bg);border:1px solid var(--btn-border-color);border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap;transition:background-color var(--transition-duration),color var(--transition-duration),border-color var(--transition-duration)}.editor-btn[data-v-88f77497]:hover:not(:disabled){background-color:var(--btn-hover-bg);color:var(--btn-hover-text)}.editor-btn[data-v-88f77497]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-88f77497]:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.editor-btn__label[data-v-88f77497]{text-overflow:ellipsis;text-box:cap alphabetic}.editor-btn--md[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-sm);--btn-height: 40px}.editor-btn--lg[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-base);--btn-height: 44px}.editor-btn--icon-only[data-v-88f77497]{width:var(--btn-height);padding:0}.editor-btn--block[data-v-88f77497]{display:flex;width:100%}.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-primary);--btn-text: var(--color-white);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary-hover);--btn-hover-text: var(--color-white)}.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-primary);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary);--btn-hover-text: var(--color-white)}.editor-btn--tertiary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-primary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--transparent[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: transparent;--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--destructive.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-danger);--btn-text: var(--color-white);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger-hover);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-danger);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--tertiary[data-v-88f77497],.editor-btn--destructive.editor-btn--transparent[data-v-88f77497]{--btn-text: var(--color-danger);--btn-hover-bg: var(--color-danger-soft);--btn-hover-text: var(--color-danger)}", ft = /* @__PURE__ */ Pe(Hp, [["styles", [Vp]], ["__scopeId", "data-v-88f77497"]]), Ou = {
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
  "subtitle.showWatermark": "Afficher le watermark",
  "subtitle.pinWatermark": "Épingler le watermark",
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
}, Wp = {
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
}, ba = { fr: Ou, en: Wp }, Iu = /* @__PURE__ */ Symbol("i18n");
function jp(t) {
  const e = R(() => {
    const i = ba[t.value] ?? ba.fr;
    return (r) => i[r] ?? r;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return Jn(Iu, n), n;
}
function vt() {
  const t = Xt(Iu);
  if (t) return t;
  const e = R(() => "fr");
  return {
    t: (n) => Ou[n] ?? n,
    locale: e
  };
}
function Up(t, e) {
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
function Kp(t, e, n, i = "*") {
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
function Gp(t, e = 250) {
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
function ki(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, s = String(i).padStart(2, "0"), o = String(r).padStart(2, "0");
  return n > 0 ? `${n}:${s}:${o}` : `${s}:${o}`;
}
class tt extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Xp(t) {
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
function Yp(t, e) {
  const { width: n, height: i } = e.canvas, r = t[0], s = r.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * s), u = Math.abs(r[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0), c = c + o, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0);
  }
  e.stroke(), e.closePath();
}
function Mu(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function Jp(t, e) {
  if (!Mu(t)) return null;
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
const Zp = { class: "editor-header" }, Qp = { class: "header-left" }, eh = { class: "document-title" }, th = { class: "badges" }, nh = ["datetime"], ih = { class: "header-right" }, rh = /* @__PURE__ */ X({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = vt(), r = R(() => vi(e.language, i.value, n("language.wildcard"))), s = R(() => ki(e.duration)), o = R(() => e.title.replace(/-/g, " "));
    return (a, l) => (P(), Q("header", Zp, [
      te("div", Qp, [
        te("h1", eh, fe(o.value), 1),
        te("div", th, [
          H(va, null, {
            default: N(() => [
              De(fe(r.value), 1)
            ]),
            _: 1
          }),
          H(va, null, {
            default: N(() => [
              te("time", {
                datetime: `PT${t.duration}S`
              }, fe(s.value), 9, nh)
            ]),
            _: 1
          })
        ])
      ]),
      te("div", ih, [
        t.isMobile ? (P(), j(ft, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": v(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : ce("", !0),
        t.isMobile ? (P(), j(ft, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": v(n)("header.export")
        }, null, 8, ["aria-label"])) : (P(), j(ft, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: N(() => [
            De(fe(v(n)("header.export")), 1)
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
}), sh = ".editor-header[data-v-c5fd975f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-c5fd975f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-c5fd975f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-c5fd975f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-c5fd975f]{display:none}.document-title[data-v-c5fd975f]{font-size:var(--font-size-base)}}", oh = /* @__PURE__ */ Pe(rh, [["styles", [sh]], ["__scopeId", "data-v-c5fd975f"]]), os = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, ah = 70, lh = 1e3 / 60, uh = 350;
let Qi = !1, wa = !1;
function ch() {
  wa || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Qi = !0;
  }), document.addEventListener("mouseup", () => {
    Qi = !1;
  }), document.addEventListener("click", () => {
    Qi = !1;
  }), wa = !0);
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
function dh(t = {}) {
  ch();
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
    for (const D of n) D(A);
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
    const A = i.scrollElement, D = i.contentElement;
    return !A || !D ? 0 : A.scrollHeight - 1 - A.clientHeight;
  }
  let u;
  function c() {
    const A = i.scrollElement, D = i.contentElement;
    if (!A || !D)
      return 0;
    const O = l();
    if (!e.targetScrollTop)
      return O;
    if (u?.targetScrollTop === O)
      return u.calculatedScrollTop;
    const V = Math.max(
      Math.min(
        e.targetScrollTop(O, {
          scrollElement: A,
          contentElement: D
        }),
        O
      ),
      0
    );
    return u = { targetScrollTop: O, calculatedScrollTop: V }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), V;
  }
  function d() {
    return c() - o();
  }
  function p() {
    return d() <= ah;
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
    const D = A.getRangeAt(0), O = i.scrollElement;
    if (!O)
      return !1;
    const V = D.commonAncestorContainer;
    return !!(V && (O.contains(V) || V.contains(O)));
  }
  const C = (A) => {
    if (A.target !== i.scrollElement)
      return;
    const D = o(), O = i.ignoreScrollToTop;
    let V = i.lastScrollTop ?? D;
    i.lastScrollTop = D, i.ignoreScrollToTop = void 0, O && O > D && (V = O), m(p()), setTimeout(() => {
      if (i.resizeDifference || D === O)
        return;
      if (y()) {
        h(!0), f(!1);
        return;
      }
      const $ = D > V, K = D < V;
      if (i.animation?.ignoreEscapes) {
        a(V);
        return;
      }
      K && (h(!0), f(!1)), $ && h(!1), !i.escapedFromLock && p() && f(!0);
    }, 1);
  }, _ = (A) => {
    const D = i.scrollElement;
    if (!D)
      return;
    let O = A.target;
    for (; O && !["scroll", "auto"].includes(getComputedStyle(O).overflow); ) {
      if (!O.parentElement)
        return;
      O = O.parentElement;
    }
    O === D && A.deltaY < 0 && D.scrollHeight > D.clientHeight && !i.animation?.ignoreEscapes && (h(!0), f(!1));
  };
  function b(A, D) {
    g(), i.scrollElement = A, i.contentElement = D, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", C, { passive: !0 }), A.addEventListener("wheel", _, { passive: !0 });
    let O;
    i.resizeObserver = new ResizeObserver((V) => {
      const $ = V[0];
      if (!$)
        return;
      const { height: K } = $.contentRect, se = K - (O ?? K);
      if (i.resizeDifference = se, o() > l() && a(l()), m(p()), se >= 0) {
        const Z = ls(
          e,
          O ? e.resize : e.initial
        );
        x({
          animation: Z,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Z === "instant" ? void 0 : uh
        });
      } else
        p() && (h(!1), f(!0));
      O = K, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === se && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(D);
  }
  function g() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", C), i.scrollElement.removeEventListener("wheel", _)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function k() {
    g(), n.clear();
  }
  function E(A) {
    e = { ...e, ...A };
  }
  function x(A = {}) {
    const D = typeof A == "string" ? { animation: A } : A;
    D.preserveScrollPosition || f(!0);
    const O = Date.now() + (Number(D.wait) || 0), V = ls(e, D.animation), { ignoreEscapes: $ = !1 } = D;
    let K, se = c();
    D.duration instanceof Promise ? D.duration.finally(() => {
      K = Date.now();
    }) : K = O + (D.duration ?? 0);
    const Z = async () => {
      const ee = new Promise((we) => {
        if (typeof requestAnimationFrame > "u") {
          we(!1);
          return;
        }
        requestAnimationFrame(() => we(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const we = o(), $e = typeof performance < "u" ? performance.now() : Date.now(), Ze = ($e - (i.lastTick ?? $e)) / lh;
        if (i.animation ||= { behavior: V, promise: ee, ignoreEscapes: $ }, i.animation.behavior === V && (i.lastTick = $e), y() || O > Date.now())
          return Z();
        if (we < Math.min(se, c())) {
          if (i.animation?.behavior === V) {
            if (V === "instant")
              return a(c()), Z();
            const Oe = V;
            i.velocity = (Oe.damping * i.velocity + Oe.stiffness * d()) / Oe.mass, i.accumulated += i.velocity * Ze;
            const Nt = o();
            a(Nt + i.accumulated), o() !== Nt && (i.accumulated = 0);
          }
          return Z();
        }
        return K > Date.now() ? (se = c(), Z()) : (i.animation = void 0, o() < c() ? x({
          animation: ls(e, e.resize),
          ignoreEscapes: $,
          duration: Math.max(0, K - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return ee.then((we) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), we));
    };
    return D.wait !== !0 && (i.animation = void 0), i.animation?.behavior === V ? i.animation.promise : Z();
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
    destroy: k,
    setOptions: E,
    getState: s,
    onChange: T,
    scrollToBottom: x,
    stopScroll: M
  };
}
function fh(t = {}) {
  const e = /* @__PURE__ */ L(null), n = /* @__PURE__ */ L(null), i = /* @__PURE__ */ L(t.initial !== !1), r = /* @__PURE__ */ L(!1), s = /* @__PURE__ */ L(!1), o = dh(t);
  let a = null;
  return ht((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((u) => {
      i.value = u.isAtBottom, r.value = u.isNearBottom, s.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), rn(() => {
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
const ph = /* @__PURE__ */ X({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (P(), Q("span", {
      class: "speaker-indicator",
      style: Ct({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), hh = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", Ru = /* @__PURE__ */ Pe(ph, [["styles", [hh]], ["__scopeId", "data-v-9bffeda8"]]), vh = { class: "speaker-label" }, mh = {
  key: 1,
  class: "speaker-name"
}, gh = ["datetime"], yh = { class: "lang" }, bh = /* @__PURE__ */ X({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = vt(), r = R(
      () => vi(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), s = R(
      () => e.startTime != null ? ki(e.startTime) : null
    ), o = R(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = R(() => e.speaker?.color ?? "transparent");
    return (l, u) => (P(), Q("div", vh, [
      t.speaker ? (P(), j(Ru, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : ce("", !0),
      t.speaker ? (P(), Q("span", mh, fe(t.speaker.name), 1)) : ce("", !0),
      s.value ? (P(), Q("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, fe(s.value), 9, gh)) : ce("", !0),
      te("span", yh, fe(r.value), 1)
    ]));
  }
}), wh = ".speaker-label[data-v-64a75575]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-64a75575]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-64a75575]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);text-box:trim-both cap alphabetic}.lang[data-v-64a75575]{font-size:var(--font-size-xs);font-weight:400;text-box:trim-both cap alphabetic}", _h = /* @__PURE__ */ Pe(bh, [["styles", [wh]], ["__scopeId", "data-v-64a75575"]]);
function _a(t) {
  return typeof t == "string" ? `'${t}'` : new xh().serialize(t);
}
const xh = /* @__PURE__ */ (function() {
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
function Pn(t, e) {
  return t === e || _a(t) === _a(e);
}
function Sh(t, e, n) {
  const i = t.findIndex((a) => Pn(a, e)), r = t.findIndex((a) => Pn(a, n));
  if (i === -1 || r === -1) return [];
  const [s, o] = [i, r].sort((a, l) => a - l);
  return t.slice(s, o + 1);
}
function xa(t, e = Number.NEGATIVE_INFINITY, n = Number.POSITIVE_INFINITY) {
  return Math.min(n, Math.max(e, t));
}
function ut(t, e) {
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
function Sa(t, e) {
  return Kn(t) ? !1 : Array.isArray(t) ? t.some((n) => Pn(n, e)) : Pn(t, e);
}
function co(t) {
  return t ? t.flatMap((e) => e.type === Se ? co(e.children) : [e]) : [];
}
const [fo] = ut("ConfigProvider");
function Ch(t, e) {
  var n;
  const i = /* @__PURE__ */ fn();
  return ht(() => {
    i.value = t();
  }, {
    ...e,
    flush: (n = e?.flush) !== null && n !== void 0 ? n : "sync"
  }), /* @__PURE__ */ rr(i);
}
function Nr(t, e) {
  return Js() ? (fl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function us() {
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
function kh(t) {
  let e = !1, n;
  const i = dl(!0);
  return ((...r) => (e || (n = i.run(() => t(...r)), e = !0), n));
}
const sn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Eh = (t) => typeof t < "u", Th = Object.prototype.toString, Ah = (t) => Th.call(t) === "[object Object]", Ca = /* @__PURE__ */ Ph();
function Ph() {
  var t, e, n;
  return sn && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function cs(t) {
  return Array.isArray(t) ? t : [t];
}
function Oh(t) {
  return lt();
}
// @__NO_SIDE_EFFECTS__
function Ih(t) {
  if (!sn) return t;
  let e = 0, n, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = dl(!0), n = i.run(() => t(...s))), Nr(r), n));
}
function Lu(t, e = 1e4) {
  return Ml((n, i) => {
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
function Mh(t, e) {
  Oh() && rn(t, e);
}
function Rh(t, e, n) {
  return he(t, e, {
    ...n,
    immediate: !0
  });
}
const qr = sn ? window : void 0;
function Bt(t) {
  var e;
  const n = Je(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function Du(...t) {
  const e = (i, r, s, o) => (i.addEventListener(r, s, o), () => i.removeEventListener(r, s, o)), n = R(() => {
    const i = cs(Je(t[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return Rh(() => {
    var i, r;
    return [
      (i = (r = n.value) === null || r === void 0 ? void 0 : r.map((s) => Bt(s))) !== null && i !== void 0 ? i : [qr].filter((s) => s != null),
      cs(Je(n.value ? t[1] : t[0])),
      cs(v(n.value ? t[2] : t[1])),
      Je(n.value ? t[3] : t[2])
    ];
  }, ([i, r, s, o], a, l) => {
    if (!i?.length || !r?.length || !s?.length) return;
    const u = Ah(o) ? { ...o } : o, c = i.flatMap((d) => r.flatMap((p) => s.map((f) => e(d, p, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function $u() {
  const t = /* @__PURE__ */ fn(!1), e = lt();
  return e && Re(() => {
    t.value = !0;
  }, e), t;
}
// @__NO_SIDE_EFFECTS__
function Lh(t) {
  const e = /* @__PURE__ */ $u();
  return R(() => (e.value, !!t()));
}
function Dh(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function $h(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: r = qr, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = Dh(e);
  return Du(r, s, (c) => {
    c.repeat && Je(a) || l(c) && n(c);
  }, o);
}
function Bh(t) {
  return JSON.parse(JSON.stringify(t));
}
function Fh(t, e, n = {}) {
  const { window: i = qr, ...r } = n;
  let s;
  const o = /* @__PURE__ */ Lh(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = he(R(() => {
    const c = Je(t);
    return Array.isArray(c) ? c.map((d) => Bt(d)) : [Bt(c)];
  }), (c) => {
    if (a(), o.value && i) {
      s = new ResizeObserver(e);
      for (const d of c) d && s.observe(d, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Nr(u), {
    isSupported: o,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function Ei(t, e, n, i = {}) {
  var r, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, p = lt(), f = n || p?.emit || (p == null || (r = p.$emit) === null || r === void 0 ? void 0 : r.bind(p)) || (p == null || (s = p.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(p?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const m = (_) => o ? typeof o == "function" ? o(_) : Bh(_) : _, y = () => Eh(t[e]) ? m(t[e]) : c, C = (_) => {
    d ? d(_) && f(h, _) : f(h, _);
  };
  if (a) {
    const _ = /* @__PURE__ */ L(y());
    let b = !1;
    return he(() => t[e], (g) => {
      b || (b = !0, _.value = m(g), Me(() => b = !1));
    }), he(_, (g) => {
      !b && (g !== t[e] || u) && C(g);
    }, { deep: u }), _;
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
function Bs(t, e, n = ".", i) {
  if (!ds(e))
    return Bs(t, {}, n, i);
  const r = Object.assign({}, e);
  for (const s in t) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = t[s];
    o != null && (i && i(r, s, o, n) || (Array.isArray(o) && Array.isArray(r[s]) ? r[s] = [...o, ...r[s]] : ds(o) && ds(r[s]) ? r[s] = Bs(
      o,
      r[s],
      (n ? `${n}.` : "") + s.toString(),
      i
    ) : r[s] = o));
  }
  return r;
}
function zh(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => Bs(n, i, "", t), {})
  );
}
const Nh = zh(), qh = /* @__PURE__ */ Ih(() => {
  const t = /* @__PURE__ */ L(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ L(), n = R(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = fo({ scrollBody: /* @__PURE__ */ L(!0) });
  let r = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", Ca && r?.(), e.value = void 0;
  };
  return he(n, (o, a) => {
    if (!sn) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Nh({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), Ca && (r = Du(document, "touchmove", (d) => Hh(d), { passive: !1 })), Me(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Bu(t) {
  const e = Math.random().toString(36).substring(2, 7), n = qh();
  n.value.set(e, t ?? !1);
  const i = R({
    get: () => n.value.get(e) ?? !1,
    set: (r) => n.value.set(e, r)
  });
  return Mh(() => {
    n.value.delete(e);
  }), i;
}
function Fu(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : Fu(n);
  }
}
function Hh(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && Fu(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function zu(t) {
  const e = fo({ dir: /* @__PURE__ */ L("ltr") });
  return R(() => t?.value || e.dir?.value || "ltr");
}
function Hr(t) {
  const e = lt(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((r) => {
    i[Ui(Fe(r))] = (...s) => t(r, ...s);
  }), i;
}
let fs = 0;
function Vh() {
  ht((t) => {
    if (!sn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ka()), document.body.insertAdjacentElement("beforeend", e[1] ?? ka()), fs++, t(() => {
      fs === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((n) => n.remove()), fs--;
    });
  });
}
function ka() {
  const t = document.createElement("span");
  return t.setAttribute("data-reka-focus-guard", ""), t.tabIndex = 0, t.style.outline = "none", t.style.opacity = "0", t.style.position = "fixed", t.style.pointerEvents = "none", t;
}
function po(t) {
  return R(() => Je(t) ? !!Bt(t)?.closest("form") : !0);
}
function Le() {
  const t = lt(), e = /* @__PURE__ */ L(), n = R(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Bt(e)), i = Object.assign({}, t.exposed), r = {};
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
      for (const u in a) Object.defineProperty(l, u, {
        enumerable: !0,
        configurable: !0,
        get: () => a[u]
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
function ho(t) {
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
function Wh(t, e) {
  const n = ho(t), i = e ? Hr(e) : {};
  return R(() => ({
    ...n.value,
    ...i
  }));
}
var jh = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, Dn = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Hi = {}, ps = 0, Nu = function(t) {
  return t && (t.host || Nu(t.parentNode));
}, Uh = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = Nu(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Kh = function(t, e, n, i) {
  var r = Uh(e, Array.isArray(t) ? t : [t]);
  Hi[n] || (Hi[n] = /* @__PURE__ */ new WeakMap());
  var s = Hi[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(r), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  r.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (a.has(p))
        c(p);
      else
        try {
          var f = p.getAttribute(i), h = f !== null && f !== "false", m = (Dn.get(p) || 0) + 1, y = (s.get(p) || 0) + 1;
          Dn.set(p, m), s.set(p, y), o.push(p), m === 1 && h && qi.set(p, !0), y === 1 && p.setAttribute(n, "true"), h || p.setAttribute(i, "true");
        } catch (C) {
          console.error("aria-hidden: cannot operate on ", p, C);
        }
    });
  };
  return c(e), a.clear(), ps++, function() {
    o.forEach(function(d) {
      var p = Dn.get(d) - 1, f = s.get(d) - 1;
      Dn.set(d, p), s.set(d, f), p || (qi.has(d) || d.removeAttribute(i), qi.delete(d)), f || d.removeAttribute(n);
    }), ps--, ps || (Dn = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Hi = {});
  };
}, Gh = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), r = jh(t);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), Kh(i, r, n, "aria-hidden")) : function() {
    return null;
  };
};
function qu(t) {
  let e;
  he(() => Bt(t), (n) => {
    n ? e = Gh(n) : e && e();
  }), vn(() => {
    e && e();
  });
}
function Gn(t, e = "reka") {
  return `${e}-${Yl?.()}`;
}
function Xh() {
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
function Yh(t) {
  const e = /* @__PURE__ */ L(), n = R(() => e.value?.width ?? 0), i = R(() => e.value?.height ?? 0);
  return Re(() => {
    const r = Bt(t);
    if (r) {
      e.value = {
        width: r.offsetWidth,
        height: r.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
        let l, u;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          l = d.inlineSize, u = d.blockSize;
        } else
          l = r.offsetWidth, u = r.offsetHeight;
        e.value = {
          width: l,
          height: u
        };
      });
      return s.observe(r, { box: "border-box" }), () => s.unobserve(r);
    } else e.value = void 0;
  }), {
    width: n,
    height: i
  };
}
function Jh(t, e) {
  const n = /* @__PURE__ */ L(t);
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
function vo(t) {
  const e = Lu("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, s) => {
      e.value = e.value + r;
      {
        const o = it(), a = s.map((p) => ({
          ...p,
          textValue: p.value?.textValue ?? p.ref.textContent?.trim() ?? ""
        })), l = a.find((p) => p.ref === o), u = a.map((p) => p.textValue), c = Qh(u, e.value, l?.textValue), d = a.find((p) => p.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Zh(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
function Qh(t, e, n) {
  const r = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, s = n ? t.indexOf(n) : -1;
  let o = Zh(t, Math.max(s, 0));
  r.length === 1 && (o = o.filter((u) => u !== n));
  const l = o.find((u) => u.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function ev(t, e) {
  const n = /* @__PURE__ */ L({}), i = /* @__PURE__ */ L("none"), r = /* @__PURE__ */ L(t), s = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? qr, { state: l, dispatch: u } = Jh(s, {
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
    if (sn) {
      const C = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(C);
    }
  };
  he(t, async (y, C) => {
    const _ = C !== y;
    if (await Me(), _) {
      const b = i.value, g = Vi(e.value);
      y ? (u("MOUNT"), c("enter"), g === "none" && c("after-enter")) : g === "none" || g === "undefined" || n.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : C && b !== g ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const C = Vi(e.value), _ = C.includes(CSS.escape(y.animationName)), b = l.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && _ && (c(`after-${b}`), u("ANIMATION_END"), !r.value)) {
      const g = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = g);
      });
    }
    y.target === e.value && C === "none" && u("ANIMATION_END");
  }, p = (y) => {
    y.target === e.value && (i.value = Vi(e.value));
  }, f = he(e, (y, C) => {
    y ? (n.value = getComputedStyle(y), y.addEventListener("animationstart", p), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (u("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), C?.removeEventListener("animationstart", p), C?.removeEventListener("animationcancel", d), C?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = he(l, () => {
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
    const { present: i, forceMount: r } = /* @__PURE__ */ Yn(t), s = /* @__PURE__ */ L(), { isPresent: o } = ev(i, s);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = co(a || []);
    const l = lt();
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
    return () => r.value || i.value || o.value ? Lt(e.default({ present: o.value })[0], { ref: (u) => {
      const c = Bt(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const Fs = /* @__PURE__ */ X({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = co(n.default()), r = i.findIndex((l) => l.type !== ze);
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
}), tv = [
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
    return typeof i == "string" && tv.includes(i) ? () => Lt(i, e) : i !== "template" ? () => Lt(t.as, e, { default: n.default }) : () => Lt(Fs, e, { default: n.default });
  }
});
function hr() {
  const t = /* @__PURE__ */ L(), e = R(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : Bt(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [gn, nv] = ut("DialogRoot");
var iv = /* @__PURE__ */ X({
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
    const n = t, r = /* @__PURE__ */ Ei(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), s = /* @__PURE__ */ L(), o = /* @__PURE__ */ L(), { modal: a } = /* @__PURE__ */ Yn(n);
    return nv({
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
    }), (l, u) => ie(l.$slots, "default", {
      open: v(r),
      close: () => r.value = !1
    });
  }
}), Hu = iv, rv = /* @__PURE__ */ X({
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
    Le();
    const n = gn();
    return (i, r) => (P(), j(v(Ae), xe(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (s) => v(n).onOpenChange(!1))
    }), {
      default: N(() => [ie(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), sv = rv;
const ov = "dismissableLayer.pointerDownOutside", av = "dismissableLayer.focusOutside";
function Vu(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), r = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || r.indexOf(i) < r.indexOf(n)));
}
function lv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ L(!1), s = /* @__PURE__ */ L(() => {
  });
  return ht((o) => {
    if (!sn || !Je(n)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (Vu(e.value, c)) {
          r.value = !1;
          return;
        }
        if (u.target && !r.value) {
          let p = function() {
            zr(ov, t, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", s.value), s.value = p, i.addEventListener("click", s.value, { once: !0 })) : p();
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
function uv(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = /* @__PURE__ */ L(!1);
  return ht((s) => {
    if (!sn || !Je(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Me(), await Me();
      const l = a.target;
      !e.value || !l || Vu(e.value, l) || a.target && !r.value && zr(av, t, { originalEvent: a });
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
var cv = /* @__PURE__ */ X({
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
    const n = t, i = e, { forwardRef: r, currentElement: s } = Le(), o = R(() => s.value?.ownerDocument ?? globalThis.document), a = R(() => dt.layersRoot), l = R(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), u = R(() => dt.layersWithOutsidePointerEventsDisabled.size > 0), c = R(() => {
      const f = Array.from(a.value), [h] = [...dt.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(h);
      return l.value >= m;
    }), d = lv(async (f) => {
      const h = [...dt.branches].some((m) => m?.contains(f.target));
      !c.value || h || (i("pointerDownOutside", f), i("interactOutside", f), await Me(), f.defaultPrevented || i("dismiss"));
    }, s), p = uv((f) => {
      [...dt.branches].some((m) => m?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, s);
    return $h("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), ht((f) => {
      s.value && (n.disableOutsidePointerEvents && (dt.layersWithOutsidePointerEventsDisabled.size === 0 && (dt.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), dt.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), f(() => {
        n.disableOutsidePointerEvents && dt.layersWithOutsidePointerEventsDisabled.size === 1 && !Kn(dt.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = dt.originalBodyPointerEvents);
      }));
    }), ht((f) => {
      f(() => {
        s.value && (a.value.delete(s.value), dt.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (f, h) => (P(), j(v(Ae), {
      ref: v(r),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: Ct({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(p).onFocusCapture,
      onBlurCapture: v(p).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: N(() => [ie(f.$slots, "default")]),
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
}), Wu = cv;
const dv = /* @__PURE__ */ kh(() => /* @__PURE__ */ L([]));
function fv() {
  const t = dv();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = Ea(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = Ea(t.value, e), t.value[0]?.resume();
    }
  };
}
function Ea(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const hs = "focusScope.autoFocusOnMount", vs = "focusScope.autoFocusOnUnmount", Ta = {
  bubbles: !1,
  cancelable: !0
};
function pv(t, { select: e = !1 } = {}) {
  const n = it();
  for (const i of t)
    if (ln(i, { select: e }), it() !== n) return !0;
}
function hv(t) {
  const e = ju(t), n = Aa(e, t), i = Aa(e.reverse(), t);
  return [n, i];
}
function ju(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function Aa(t, e) {
  for (const n of t) if (!vv(n, { upTo: e })) return n;
}
function vv(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function mv(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function ln(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = it();
    t.focus({ preventScroll: !0 }), t !== n && mv(t) && e && t.select();
  }
}
var gv = /* @__PURE__ */ X({
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
    const n = t, i = e, { currentRef: r, currentElement: s } = Le(), o = /* @__PURE__ */ L(null), a = fv(), l = /* @__PURE__ */ Oi({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ht((c) => {
      if (!sn) return;
      const d = s.value;
      if (!n.trapped) return;
      function p(y) {
        if (l.paused || !d) return;
        const C = y.target;
        d.contains(C) ? o.value = C : ln(o.value, { select: !0 });
      }
      function f(y) {
        if (l.paused || !d) return;
        const C = y.relatedTarget;
        C !== null && (d.contains(C) || ln(o.value, { select: !0 }));
      }
      function h(y) {
        d.contains(o.value) || ln(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", f);
      const m = new MutationObserver(h);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", f), m.disconnect();
      });
    }), ht(async (c) => {
      const d = s.value;
      if (await Me(), !d) return;
      a.add(l);
      const p = it();
      if (!d.contains(p)) {
        const h = new CustomEvent(hs, Ta);
        d.addEventListener(hs, (m) => i("mountAutoFocus", m)), d.dispatchEvent(h), h.defaultPrevented || (pv(ju(d), { select: !0 }), it() === p && ln(d));
      }
      c(() => {
        d.removeEventListener(hs, (y) => i("mountAutoFocus", y));
        const h = new CustomEvent(vs, Ta), m = (y) => {
          i("unmountAutoFocus", y);
        };
        d.addEventListener(vs, m), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || ln(p ?? document.body, { select: !0 }), d.removeEventListener(vs, m), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, p = it();
      if (d && p) {
        const f = c.currentTarget, [h, m] = hv(f);
        h && m ? !c.shiftKey && p === m ? (c.preventDefault(), n.loop && ln(h, { select: !0 })) : c.shiftKey && p === h && (c.preventDefault(), n.loop && ln(m, { select: !0 })) : p === f && c.preventDefault();
      }
    }
    return (c, d) => (P(), j(v(Ae), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: N(() => [ie(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Uu = gv;
function yv(t) {
  return t ? "open" : "closed";
}
function Pa(t) {
  const e = it();
  for (const n of t)
    if (n === e || (n.focus(), it() !== e)) return;
}
var bv = /* @__PURE__ */ X({
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
    const n = t, i = e, r = gn(), { forwardRef: s, currentElement: o } = Le();
    return r.titleId ||= Gn(void 0, "reka-dialog-title"), r.descriptionId ||= Gn(void 0, "reka-dialog-description"), Re(() => {
      r.contentElement = o, it() !== document.body && (r.triggerElement.value = it());
    }), (a, l) => (P(), j(v(Uu), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: N(() => [H(v(Wu), xe({
        id: v(r).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(r).descriptionId,
        "aria-labelledby": v(r).titleId,
        "data-state": v(yv)(v(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => v(r).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: N(() => [ie(a.$slots, "default")]),
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
}), Ku = bv, wv = /* @__PURE__ */ X({
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
    const n = t, i = e, r = gn(), s = Hr(i), { forwardRef: o, currentElement: a } = Le();
    return qu(a), (l, u) => (P(), j(Ku, xe({
      ...n,
      ...v(s)
    }, {
      ref: v(o),
      "trap-focus": v(r).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), v(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, p = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || p) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: N(() => [ie(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), _v = wv, xv = /* @__PURE__ */ X({
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
    Le();
    const s = gn(), o = /* @__PURE__ */ L(!1), a = /* @__PURE__ */ L(!1);
    return (l, u) => (P(), j(Ku, xe({
      ...n,
      ...v(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (o.value || v(s).triggerElement.value?.focus(), c.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (o.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        v(s).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: N(() => [ie(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Sv = xv, Cv = /* @__PURE__ */ X({
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
    const n = t, i = e, r = gn(), s = Hr(i), { forwardRef: o } = Le();
    return (a, l) => (P(), j(v(Vr), { present: a.forceMount || v(r).open.value }, {
      default: N(() => [v(r).modal.value ? (P(), j(_v, xe({
        key: 0,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: N(() => [ie(a.$slots, "default")]),
        _: 3
      }, 16)) : (P(), j(Sv, xe({
        key: 1,
        ref: v(o)
      }, {
        ...n,
        ...v(s),
        ...a.$attrs
      }), {
        default: N(() => [ie(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Gu = Cv, kv = /* @__PURE__ */ X({
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
    const e = gn();
    return Bu(!0), Le(), (n, i) => (P(), j(v(Ae), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: N(() => [ie(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Ev = kv, Tv = /* @__PURE__ */ X({
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
    const e = gn(), { forwardRef: n } = Le();
    return (i, r) => v(e)?.modal.value ? (P(), j(v(Vr), {
      key: 0,
      present: i.forceMount || v(e).open.value
    }, {
      default: N(() => [H(Ev, xe(i.$attrs, {
        ref: v(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: N(() => [ie(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : ce("v-if", !0);
  }
}), Xu = Tv, Av = /* @__PURE__ */ X({
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
    const e = /* @__PURE__ */ $u();
    return (n, i) => v(e) || n.forceMount ? (P(), j(Wl, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [ie(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : ce("v-if", !0);
  }
}), Yu = Av, Pv = /* @__PURE__ */ X({
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
    return (n, i) => (P(), j(v(Yu), Xs($r(e)), {
      default: N(() => [ie(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ju = Pv, Ov = /* @__PURE__ */ X({
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
    const e = t, n = gn();
    return Le(), (i, r) => (P(), j(v(Ae), xe(e, { id: v(n).titleId }), {
      default: N(() => [ie(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Zu = Ov;
const Oa = "data-reka-collection-item";
function on(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let r;
  n ? (r = {
    collectionRef: /* @__PURE__ */ L(),
    itemMap: /* @__PURE__ */ L(/* @__PURE__ */ new Map())
  }, Jn(i, r)) : r = Xt(i);
  const s = (c = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const p = Array.from(d.querySelectorAll(`[${Oa}]`)), h = Array.from(r.itemMap.value.values()).sort((m, y) => p.indexOf(m.ref) - p.indexOf(y.ref));
    return c ? h : h.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ X({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = hr();
      return he(h, () => {
        r.collectionRef.value = h.value;
      }), () => Lt(Fs, {
        ref: f,
        ...p
      }, d);
    }
  }), a = /* @__PURE__ */ X({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: f, currentElement: h } = hr();
      return ht((m) => {
        if (h.value) {
          const y = Pl(h.value);
          r.itemMap.value.set(y, {
            ref: h.value,
            value: c.value
          }), m(() => r.itemMap.value.delete(y));
        }
      }), () => Lt(Fs, {
        ...p,
        [Oa]: "",
        ref: f
      }, d);
    }
  }), l = R(() => Array.from(r.itemMap.value.values())), u = R(() => r.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const Iv = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Mv(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Qu(t, e, n) {
  const i = Mv(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Iv[i];
}
function Rv(t, e = !1) {
  const n = it();
  for (const i of t)
    if (i === n || (i.focus({ preventScroll: e }), it() !== n)) return;
}
function Lv(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
const [Dv] = ut("RovingFocusGroup");
var $v = /* @__PURE__ */ X({
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
    const e = t, n = Dv(), i = Gn(), r = R(() => e.tabStopId || i), s = R(() => n.currentTabStopId.value === r.value), { getItems: o, CollectionItem: a } = on();
    Re(() => {
      e.focusable && n.onFocusableItemAdd();
    }), vn(() => {
      e.focusable && n.onFocusableItemRemove();
    });
    function l(u) {
      if (u.key === "Tab" && u.shiftKey) {
        n.onItemShiftTab();
        return;
      }
      if (u.target !== u.currentTarget) return;
      const c = Qu(u, n.orientation.value, n.dir.value);
      if (c !== void 0) {
        if (u.metaKey || u.ctrlKey || u.altKey || !e.allowShiftKey && u.shiftKey) return;
        u.preventDefault();
        let d = [...o().map((p) => p.ref).filter((p) => p.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const p = d.indexOf(u.currentTarget);
          d = n.loop.value ? Lv(d, p + 1) : d.slice(p + 1);
        }
        Me(() => Rv(d));
      }
    }
    return (u, c) => (P(), j(v(a), null, {
      default: N(() => [H(v(Ae), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": v(n).orientation.value,
        "data-active": u.active ? "" : void 0,
        "data-disabled": u.focusable ? void 0 : "",
        as: u.as,
        "as-child": u.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          u.focusable ? v(n).onItemFocus(r.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => v(n).onItemFocus(r.value)),
        onKeydown: l
      }, {
        default: N(() => [ie(u.$slots, "default")]),
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
}), Bv = $v, Fv = /* @__PURE__ */ X({
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
    return (e, n) => (P(), j(v(Ae), {
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
      default: N(() => [ie(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), ec = Fv, zv = /* @__PURE__ */ X({
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
    return he(r, (s, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && s !== o) {
        const d = new Event("input", { bubbles: !0 }), p = new Event("change", { bubbles: !0 });
        c.call(a, s), a.dispatchEvent(d), a.dispatchEvent(p);
      }
    }), (s, o) => (P(), j(ec, xe({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Ia = zv, Nv = /* @__PURE__ */ X({
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
    return (r, s) => (P(), Q(Se, null, [ce(" We render single input if it's required "), n.value ? (P(), j(Ia, xe({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (P(!0), Q(Se, { key: 1 }, mn(i.value, (o) => (P(), j(Ia, xe({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), tc = Nv;
const [qv] = ut("CheckboxGroupRoot");
function vr(t) {
  return t === "indeterminate";
}
function nc(t) {
  return vr(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
const [Hv, Vv] = ut("CheckboxRoot");
var Wv = /* @__PURE__ */ X({
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
    const n = t, i = e, { forwardRef: r, currentElement: s } = Le(), o = qv(null), a = /* @__PURE__ */ Ei(n, "modelValue", i, {
      defaultValue: n.defaultValue,
      passive: n.modelValue === void 0
    }), l = R(() => o?.disabled.value || n.disabled), u = R(() => Kn(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : Sa(o.modelValue.value, n.value));
    function c() {
      if (Kn(o?.modelValue.value))
        a.value = vr(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (Sa(f, n.value)) {
          const h = f.findIndex((m) => Pn(m, n.value));
          f.splice(h, 1);
        } else f.push(n.value);
        o.modelValue.value = f;
      }
    }
    const d = po(s), p = R(() => n.id && s.value ? document.querySelector(`[for="${n.id}"]`)?.innerText : void 0);
    return Vv({
      disabled: l,
      state: u
    }), (f, h) => (P(), j(no(v(o)?.rovingFocus.value ? v(Bv) : v(Ae)), xe(f.$attrs, {
      id: f.id,
      ref: v(r),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": v(vr)(u.value) ? "mixed" : u.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || p.value,
      "data-state": v(nc)(u.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: v(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: pr(Dt(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: N(() => [ie(f.$slots, "default", {
        modelValue: v(a),
        state: u.value
      }), v(d) && f.name && !v(o) ? (P(), j(v(tc), {
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
      ])) : ce("v-if", !0)]),
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
}), jv = Wv, Uv = /* @__PURE__ */ X({
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
    const { forwardRef: e } = Le(), n = Hv();
    return (i, r) => (P(), j(v(Vr), { present: i.forceMount || v(vr)(v(n).state.value) || v(n).state.value === !0 }, {
      default: N(() => [H(v(Ae), xe({
        ref: v(e),
        "data-state": v(nc)(v(n).state.value),
        "data-disabled": v(n).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": i.asChild,
        as: i.as
      }, i.$attrs), {
        default: N(() => [ie(i.$slots, "default")]),
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
}), Kv = Uv;
const [ic, Gv] = ut("PopperRoot");
var Xv = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(t) {
    const e = /* @__PURE__ */ L();
    return Gv({
      anchor: e,
      onAnchorChange: (n) => e.value = n
    }), (n, i) => ie(n.$slots, "default");
  }
}), Yv = Xv, Jv = /* @__PURE__ */ X({
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
    const e = t, { forwardRef: n, currentElement: i } = Le(), r = ic();
    return zl(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (s, o) => (P(), j(v(Ae), {
      ref: v(n),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: N(() => [ie(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Zv = Jv;
function Qv(t) {
  return t !== null;
}
function em(t) {
  return {
    name: "transformOrigin",
    options: t,
    fn(e) {
      const { placement: n, rects: i, middlewareData: r } = e, o = r.arrow?.centerOffset !== 0, a = o ? 0 : t.arrowWidth, l = o ? 0 : t.arrowHeight, [u, c] = zs(n), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], p = (r.arrow?.x ?? 0) + a / 2, f = (r.arrow?.y ?? 0) + l / 2;
      let h = "", m = "";
      return u === "bottom" ? (h = o ? d : `${p}px`, m = `${-l}px`) : u === "top" ? (h = o ? d : `${p}px`, m = `${i.floating.height + l}px`) : u === "right" ? (h = `${-l}px`, m = o ? d : `${f}px`) : u === "left" && (h = `${i.floating.width + l}px`, m = o ? d : `${f}px`), { data: {
        x: h,
        y: m
      } };
    }
  };
}
function zs(t) {
  const [e, n = "center"] = t.split("-");
  return [e, n];
}
const tm = ["top", "right", "bottom", "left"], pn = Math.min, st = Math.max, mr = Math.round, Wi = Math.floor, $t = (t) => ({
  x: t,
  y: t
}), nm = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, im = {
  start: "end",
  end: "start"
};
function Ns(t, e, n) {
  return st(t, pn(e, n));
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
function mo(t) {
  return t === "x" ? "y" : "x";
}
function go(t) {
  return t === "y" ? "height" : "width";
}
const rm = /* @__PURE__ */ new Set(["top", "bottom"]);
function Mt(t) {
  return rm.has(tn(t)) ? "y" : "x";
}
function yo(t) {
  return mo(Mt(t));
}
function sm(t, e, n) {
  n === void 0 && (n = !1);
  const i = Zn(t), r = yo(t), s = go(r);
  let o = r === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = gr(o)), [o, gr(o)];
}
function om(t) {
  const e = gr(t);
  return [qs(t), e, qs(e)];
}
function qs(t) {
  return t.replace(/start|end/g, (e) => im[e]);
}
const Ma = ["left", "right"], Ra = ["right", "left"], am = ["top", "bottom"], lm = ["bottom", "top"];
function um(t, e, n) {
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? Ra : Ma : e ? Ma : Ra;
    case "left":
    case "right":
      return e ? am : lm;
    default:
      return [];
  }
}
function cm(t, e, n, i) {
  const r = Zn(t);
  let s = um(tn(t), n === "start", i);
  return r && (s = s.map((o) => o + "-" + r), e && (s = s.concat(s.map(qs)))), s;
}
function gr(t) {
  return t.replace(/left|right|bottom|top/g, (e) => nm[e]);
}
function dm(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function rc(t) {
  return typeof t != "number" ? dm(t) : {
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
function La(t, e, n) {
  let {
    reference: i,
    floating: r
  } = t;
  const s = Mt(e), o = yo(e), a = go(o), l = tn(e), u = s === "y", c = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: c,
        y: i.y - r.height
      };
      break;
    case "bottom":
      f = {
        x: c,
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
      f[o] -= p * (n && u ? -1 : 1);
      break;
    case "end":
      f[o] += p * (n && u ? -1 : 1);
      break;
  }
  return f;
}
async function fm(t, e) {
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
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: p = !1,
    padding: f = 0
  } = en(e, t), h = rc(f), y = a[p ? d === "floating" ? "reference" : "floating" : d], C = yr(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(y))) == null || n ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
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
  }, k = yr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: _,
    offsetParent: b,
    strategy: l
  }) : _);
  return {
    top: (C.top - k.top + h.top) / g.y,
    bottom: (k.bottom - C.bottom + h.bottom) / g.y,
    left: (C.left - k.left + h.left) / g.x,
    right: (k.right - C.right + h.right) / g.x
  };
}
const pm = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: s = [],
    platform: o
  } = n, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let u = await o.getElementRects({
    reference: t,
    floating: e,
    strategy: r
  }), {
    x: c,
    y: d
  } = La(u, i, l), p = i, f = {}, h = 0;
  for (let y = 0; y < a.length; y++) {
    var m;
    const {
      name: C,
      fn: _
    } = a[y], {
      x: b,
      y: g,
      data: k,
      reset: E
    } = await _({
      x: c,
      y: d,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: f,
      rects: u,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : fm
      },
      elements: {
        reference: t,
        floating: e
      }
    });
    c = b ?? c, d = g ?? d, f = {
      ...f,
      [C]: {
        ...f[C],
        ...k
      }
    }, E && h <= 50 && (h++, typeof E == "object" && (E.placement && (p = E.placement), E.rects && (u = E.rects === !0 ? await o.getElementRects({
      reference: t,
      floating: e,
      strategy: r
    }) : E.rects), {
      x: c,
      y: d
    } = La(u, p, l)), y = -1);
  }
  return {
    x: c,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: f
  };
}, hm = (t) => ({
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
      element: u,
      padding: c = 0
    } = en(t, e) || {};
    if (u == null)
      return {};
    const d = rc(c), p = {
      x: n,
      y: i
    }, f = yo(r), h = go(f), m = await o.getDimensions(u), y = f === "y", C = y ? "top" : "left", _ = y ? "bottom" : "right", b = y ? "clientHeight" : "clientWidth", g = s.reference[h] + s.reference[f] - p[f] - s.floating[h], k = p[f] - s.reference[f], E = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(u));
    let x = E ? E[b] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(E))) && (x = a.floating[b] || s.floating[h]);
    const M = g / 2 - k / 2, T = x / 2 - m[h] / 2 - 1, A = pn(d[C], T), D = pn(d[_], T), O = A, V = x - m[h] - D, $ = x / 2 - m[h] / 2 + M, K = Ns(O, $, V), se = !l.arrow && Zn(r) != null && $ !== K && s.reference[h] / 2 - ($ < O ? A : D) - m[h] / 2 < 0, Z = se ? $ < O ? $ - O : $ - V : 0;
    return {
      [f]: p[f] + Z,
      data: {
        [f]: K,
        centerOffset: $ - K - Z,
        ...se && {
          alignmentOffset: Z
        }
      },
      reset: se
    };
  }
}), vm = function(t) {
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
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: p,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: m = !0,
        ...y
      } = en(t, e);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const C = tn(r), _ = Mt(a), b = tn(a) === a, g = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), k = p || (b || !m ? [gr(a)] : om(a)), E = h !== "none";
      !p && E && k.push(...cm(a, m, h, g));
      const x = [a, ...k], M = await l.detectOverflow(e, y), T = [];
      let A = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (c && T.push(M[C]), d) {
        const $ = sm(r, o, g);
        T.push(M[$[0]], M[$[1]]);
      }
      if (A = [...A, {
        placement: r,
        overflows: T
      }], !T.every(($) => $ <= 0)) {
        var D, O;
        const $ = (((D = s.flip) == null ? void 0 : D.index) || 0) + 1, K = x[$];
        if (K && (!(d === "alignment" ? _ !== Mt(K) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((ee) => Mt(ee.placement) === _ ? ee.overflows[0] > 0 : !0)))
          return {
            data: {
              index: $,
              overflows: A
            },
            reset: {
              placement: K
            }
          };
        let se = (O = A.filter((Z) => Z.overflows[0] <= 0).sort((Z, ee) => Z.overflows[1] - ee.overflows[1])[0]) == null ? void 0 : O.placement;
        if (!se)
          switch (f) {
            case "bestFit": {
              var V;
              const Z = (V = A.filter((ee) => {
                if (E) {
                  const we = Mt(ee.placement);
                  return we === _ || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  we === "y";
                }
                return !0;
              }).map((ee) => [ee.placement, ee.overflows.filter((we) => we > 0).reduce((we, $e) => we + $e, 0)]).sort((ee, we) => ee[1] - we[1])[0]) == null ? void 0 : V[0];
              Z && (se = Z);
              break;
            }
            case "initialPlacement":
              se = a;
              break;
          }
        if (r !== se)
          return {
            reset: {
              placement: se
            }
          };
      }
      return {};
    }
  };
};
function Da(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width
  };
}
function $a(t) {
  return tm.some((e) => t[e] >= 0);
}
const mm = function(t) {
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
          }), a = Da(o, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: $a(a)
            }
          };
        }
        case "escaped": {
          const o = await i.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Da(o, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: $a(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, sc = /* @__PURE__ */ new Set(["left", "top"]);
async function gm(t, e) {
  const {
    placement: n,
    platform: i,
    elements: r
  } = t, s = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), o = tn(n), a = Zn(n), l = Mt(n) === "y", u = sc.has(o) ? -1 : 1, c = s && l ? -1 : 1, d = en(e, t);
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
    x: f * c,
    y: p * u
  } : {
    x: p * u,
    y: f * c
  };
}
const ym = function(t) {
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
      } = e, l = await gm(e, t);
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
}, bm = function(t) {
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
        ...u
      } = en(t, e), c = {
        x: n,
        y: i
      }, d = await s.detectOverflow(e, u), p = Mt(tn(r)), f = mo(p);
      let h = c[f], m = c[p];
      if (o) {
        const C = f === "y" ? "top" : "left", _ = f === "y" ? "bottom" : "right", b = h + d[C], g = h - d[_];
        h = Ns(b, h, g);
      }
      if (a) {
        const C = p === "y" ? "top" : "left", _ = p === "y" ? "bottom" : "right", b = m + d[C], g = m - d[_];
        m = Ns(b, m, g);
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
}, wm = function(t) {
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
        crossAxis: u = !0
      } = en(t, e), c = {
        x: n,
        y: i
      }, d = Mt(r), p = mo(d);
      let f = c[p], h = c[d];
      const m = en(a, e), y = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const b = p === "y" ? "height" : "width", g = s.reference[p] - s.floating[b] + y.mainAxis, k = s.reference[p] + s.reference[b] - y.mainAxis;
        f < g ? f = g : f > k && (f = k);
      }
      if (u) {
        var C, _;
        const b = p === "y" ? "width" : "height", g = sc.has(tn(r)), k = s.reference[d] - s.floating[b] + (g && ((C = o.offset) == null ? void 0 : C[d]) || 0) + (g ? 0 : y.crossAxis), E = s.reference[d] + s.reference[b] + (g ? 0 : ((_ = o.offset) == null ? void 0 : _[d]) || 0) - (g ? y.crossAxis : 0);
        h < k ? h = k : h > E && (h = E);
      }
      return {
        [p]: f,
        [d]: h
      };
    }
  };
}, _m = function(t) {
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
        ...u
      } = en(t, e), c = await o.detectOverflow(e, u), d = tn(r), p = Zn(r), f = Mt(r) === "y", {
        width: h,
        height: m
      } = s.floating;
      let y, C;
      d === "top" || d === "bottom" ? (y = d, C = p === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (C = d, y = p === "end" ? "top" : "bottom");
      const _ = m - c.top - c.bottom, b = h - c.left - c.right, g = pn(m - c[y], _), k = pn(h - c[C], b), E = !e.middlewareData.shift;
      let x = g, M = k;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (M = b), (i = e.middlewareData.shift) != null && i.enabled.y && (x = _), E && !p) {
        const A = st(c.left, 0), D = st(c.right, 0), O = st(c.top, 0), V = st(c.bottom, 0);
        f ? M = h - 2 * (A !== 0 || D !== 0 ? A + D : st(c.left, c.right)) : x = m - 2 * (O !== 0 || V !== 0 ? O + V : st(c.top, c.bottom));
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
function Wr() {
  return typeof window < "u";
}
function In(t) {
  return bo(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function at(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function zt(t) {
  var e;
  return (e = (bo(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function bo(t) {
  return Wr() ? t instanceof Node || t instanceof at(t).Node : !1;
}
function xt(t) {
  return Wr() ? t instanceof Element || t instanceof at(t).Element : !1;
}
function Ft(t) {
  return Wr() ? t instanceof HTMLElement || t instanceof at(t).HTMLElement : !1;
}
function Ba(t) {
  return !Wr() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof at(t).ShadowRoot;
}
const xm = /* @__PURE__ */ new Set(["inline", "contents"]);
function Di(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: r
  } = St(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !xm.has(r);
}
const Sm = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Cm(t) {
  return Sm.has(In(t));
}
const km = [":popover-open", ":modal"];
function jr(t) {
  return km.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
const Em = ["transform", "translate", "scale", "rotate", "perspective"], Tm = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Am = ["paint", "layout", "strict", "content"];
function wo(t) {
  const e = _o(), n = xt(t) ? St(t) : t;
  return Em.some((i) => n[i] ? n[i] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Tm.some((i) => (n.willChange || "").includes(i)) || Am.some((i) => (n.contain || "").includes(i));
}
function Pm(t) {
  let e = hn(t);
  for (; Ft(e) && !Xn(e); ) {
    if (wo(e))
      return e;
    if (jr(e))
      return null;
    e = hn(e);
  }
  return null;
}
function _o() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Om = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Xn(t) {
  return Om.has(In(t));
}
function St(t) {
  return at(t).getComputedStyle(t);
}
function Ur(t) {
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
    Ba(t) && t.host || // Fallback.
    zt(t)
  );
  return Ba(e) ? e.host : e;
}
function oc(t) {
  const e = hn(t);
  return Xn(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Ft(e) && Di(e) ? e : oc(e);
}
function Ti(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = oc(t), s = r === ((i = t.ownerDocument) == null ? void 0 : i.body), o = at(r);
  if (s) {
    const a = Hs(o);
    return e.concat(o, o.visualViewport || [], Di(r) ? r : [], a && n ? Ti(a) : []);
  }
  return e.concat(r, Ti(r, [], n));
}
function Hs(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function ac(t) {
  const e = St(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Ft(t), s = r ? t.offsetWidth : n, o = r ? t.offsetHeight : i, a = mr(n) !== s || mr(i) !== o;
  return a && (n = s, i = o), {
    width: n,
    height: i,
    $: a
  };
}
function xo(t) {
  return xt(t) ? t : t.contextElement;
}
function Wn(t) {
  const e = xo(t);
  if (!Ft(e))
    return $t(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: s
  } = ac(e);
  let o = (s ? mr(n.width) : n.width) / i, a = (s ? mr(n.height) : n.height) / r;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Im = /* @__PURE__ */ $t(0);
function lc(t) {
  const e = at(t);
  return !_o() || !e.visualViewport ? Im : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Mm(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== at(t) ? !1 : e;
}
function On(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), s = xo(t);
  let o = $t(1);
  e && (i ? xt(i) && (o = Wn(i)) : o = Wn(t));
  const a = Mm(s, n, i) ? lc(s) : $t(0);
  let l = (r.left + a.x) / o.x, u = (r.top + a.y) / o.y, c = r.width / o.x, d = r.height / o.y;
  if (s) {
    const p = at(s), f = i && xt(i) ? at(i) : i;
    let h = p, m = Hs(h);
    for (; m && i && f !== h; ) {
      const y = Wn(m), C = m.getBoundingClientRect(), _ = St(m), b = C.left + (m.clientLeft + parseFloat(_.paddingLeft)) * y.x, g = C.top + (m.clientTop + parseFloat(_.paddingTop)) * y.y;
      l *= y.x, u *= y.y, c *= y.x, d *= y.y, l += b, u += g, h = at(m), m = Hs(h);
    }
  }
  return yr({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function Kr(t, e) {
  const n = Ur(t).scrollLeft;
  return e ? e.left + n : On(zt(t)).left + n;
}
function uc(t, e) {
  const n = t.getBoundingClientRect(), i = n.left + e.scrollLeft - Kr(t, n), r = n.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function Rm(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: r
  } = t;
  const s = r === "fixed", o = zt(i), a = e ? jr(e.floating) : !1;
  if (i === o || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = $t(1);
  const c = $t(0), d = Ft(i);
  if ((d || !d && !s) && ((In(i) !== "body" || Di(o)) && (l = Ur(i)), Ft(i))) {
    const f = On(i);
    u = Wn(i), c.x = f.x + i.clientLeft, c.y = f.y + i.clientTop;
  }
  const p = o && !d && !s ? uc(o, l) : $t(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - l.scrollLeft * u.x + c.x + p.x,
    y: n.y * u.y - l.scrollTop * u.y + c.y + p.y
  };
}
function Lm(t) {
  return Array.from(t.getClientRects());
}
function Dm(t) {
  const e = zt(t), n = Ur(t), i = t.ownerDocument.body, r = st(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = st(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -n.scrollLeft + Kr(t);
  const a = -n.scrollTop;
  return St(i).direction === "rtl" && (o += st(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: s,
    x: o,
    y: a
  };
}
const Fa = 25;
function $m(t, e) {
  const n = at(t), i = zt(t), r = n.visualViewport;
  let s = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (r) {
    s = r.width, o = r.height;
    const c = _o();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const u = Kr(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, p = getComputedStyle(d), f = c.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, h = Math.abs(i.clientWidth - d.clientWidth - f);
    h <= Fa && (s -= h);
  } else u <= Fa && (s += u);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Bm = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Fm(t, e) {
  const n = On(t, !0, e === "fixed"), i = n.top + t.clientTop, r = n.left + t.clientLeft, s = Ft(t) ? Wn(t) : $t(1), o = t.clientWidth * s.x, a = t.clientHeight * s.y, l = r * s.x, u = i * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: u
  };
}
function za(t, e, n) {
  let i;
  if (e === "viewport")
    i = $m(t, n);
  else if (e === "document")
    i = Dm(zt(t));
  else if (xt(e))
    i = Fm(e, n);
  else {
    const r = lc(t);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return yr(i);
}
function cc(t, e) {
  const n = hn(t);
  return n === e || !xt(n) || Xn(n) ? !1 : St(n).position === "fixed" || cc(n, e);
}
function zm(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Ti(t, [], !1).filter((a) => xt(a) && In(a) !== "body"), r = null;
  const s = St(t).position === "fixed";
  let o = s ? hn(t) : t;
  for (; xt(o) && !Xn(o); ) {
    const a = St(o), l = wo(o);
    !l && a.position === "fixed" && (r = null), (s ? !l && !r : !l && a.position === "static" && !!r && Bm.has(r.position) || Di(o) && !l && cc(t, o)) ? i = i.filter((c) => c !== o) : r = a, o = hn(o);
  }
  return e.set(t, i), i;
}
function Nm(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: r
  } = t;
  const o = [...n === "clippingAncestors" ? jr(e) ? [] : zm(e, this._c) : [].concat(n), i], a = o[0], l = o.reduce((u, c) => {
    const d = za(e, c, r);
    return u.top = st(d.top, u.top), u.right = pn(d.right, u.right), u.bottom = pn(d.bottom, u.bottom), u.left = st(d.left, u.left), u;
  }, za(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function qm(t) {
  const {
    width: e,
    height: n
  } = ac(t);
  return {
    width: e,
    height: n
  };
}
function Hm(t, e, n) {
  const i = Ft(e), r = zt(e), s = n === "fixed", o = On(t, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = $t(0);
  function u() {
    l.x = Kr(r);
  }
  if (i || !i && !s)
    if ((In(e) !== "body" || Di(r)) && (a = Ur(e)), i) {
      const f = On(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else r && u();
  s && !i && r && u();
  const c = r && !i && !s ? uc(r, a) : $t(0), d = o.left + a.scrollLeft - l.x - c.x, p = o.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: p,
    width: o.width,
    height: o.height
  };
}
function ms(t) {
  return St(t).position === "static";
}
function Na(t, e) {
  if (!Ft(t) || St(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return zt(t) === n && (n = n.ownerDocument.body), n;
}
function dc(t, e) {
  const n = at(t);
  if (jr(t))
    return n;
  if (!Ft(t)) {
    let r = hn(t);
    for (; r && !Xn(r); ) {
      if (xt(r) && !ms(r))
        return r;
      r = hn(r);
    }
    return n;
  }
  let i = Na(t, e);
  for (; i && Cm(i) && ms(i); )
    i = Na(i, e);
  return i && Xn(i) && ms(i) && !wo(i) ? n : i || Pm(t) || n;
}
const Vm = async function(t) {
  const e = this.getOffsetParent || dc, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: Hm(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Wm(t) {
  return St(t).direction === "rtl";
}
const jm = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Rm,
  getDocumentElement: zt,
  getClippingRect: Nm,
  getOffsetParent: dc,
  getElementRects: Vm,
  getClientRects: Lm,
  getDimensions: qm,
  getScale: Wn,
  isElement: xt,
  isRTL: Wm
};
function fc(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Um(t, e) {
  let n = null, i;
  const r = zt(t);
  function s() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const u = t.getBoundingClientRect(), {
      left: c,
      top: d,
      width: p,
      height: f
    } = u;
    if (a || e(), !p || !f)
      return;
    const h = Wi(d), m = Wi(r.clientWidth - (c + p)), y = Wi(r.clientHeight - (d + f)), C = Wi(c), b = {
      rootMargin: -h + "px " + -m + "px " + -y + "px " + -C + "px",
      threshold: st(0, pn(1, l)) || 1
    };
    let g = !0;
    function k(E) {
      const x = E[0].intersectionRatio;
      if (x !== l) {
        if (!g)
          return o();
        x ? o(!1, x) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !fc(u, t.getBoundingClientRect()) && o(), g = !1;
    }
    try {
      n = new IntersectionObserver(k, {
        ...b,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(k, b);
    }
    n.observe(t);
  }
  return o(!0), s;
}
function Km(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = xo(t), c = r || s ? [...u ? Ti(u) : [], ...Ti(e)] : [];
  c.forEach((C) => {
    r && C.addEventListener("scroll", n, {
      passive: !0
    }), s && C.addEventListener("resize", n);
  });
  const d = u && a ? Um(u, n) : null;
  let p = -1, f = null;
  o && (f = new ResizeObserver((C) => {
    let [_] = C;
    _ && _.target === u && f && (f.unobserve(e), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var b;
      (b = f) == null || b.observe(e);
    })), n();
  }), u && !l && f.observe(u), f.observe(e));
  let h, m = l ? On(t) : null;
  l && y();
  function y() {
    const C = On(t);
    m && !fc(m, C) && n(), m = C, h = requestAnimationFrame(y);
  }
  return n(), () => {
    var C;
    c.forEach((_) => {
      r && _.removeEventListener("scroll", n), s && _.removeEventListener("resize", n);
    }), d?.(), (C = f) == null || C.disconnect(), f = null, l && cancelAnimationFrame(h);
  };
}
const Gm = ym, Xm = bm, qa = vm, Ym = _m, Jm = mm, Zm = hm, Qm = wm, eg = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: jm,
    ...n
  }, s = {
    ...r.platform,
    _c: i
  };
  return pm(t, e, {
    ...r,
    platform: s
  });
};
function tg(t) {
  return t != null && typeof t == "object" && "$el" in t;
}
function Vs(t) {
  if (tg(t)) {
    const e = t.$el;
    return bo(e) && In(e) === "#comment" ? null : e;
  }
  return t;
}
function Fn(t) {
  return typeof t == "function" ? t() : v(t);
}
function ng(t) {
  return {
    name: "arrow",
    options: t,
    fn(e) {
      const n = Vs(Fn(t.element));
      return n == null ? {} : Zm({
        element: n,
        padding: t.padding
      }).fn(e);
    }
  };
}
function pc(t) {
  return typeof window > "u" ? 1 : (t.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ha(t, e) {
  const n = pc(t);
  return Math.round(e * n) / n;
}
function ig(t, e, n) {
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
  }), u = R(() => Vs(t.value)), c = R(() => Vs(e.value)), d = /* @__PURE__ */ L(0), p = /* @__PURE__ */ L(0), f = /* @__PURE__ */ L(a.value), h = /* @__PURE__ */ L(o.value), m = /* @__PURE__ */ fn({}), y = /* @__PURE__ */ L(!1), C = R(() => {
    const x = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return x;
    const M = Ha(c.value, d.value), T = Ha(c.value, p.value);
    return l.value ? {
      ...x,
      transform: "translate(" + M + "px, " + T + "px)",
      ...pc(c.value) >= 1.5 && {
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
    if (u.value == null || c.value == null)
      return;
    const x = r.value;
    eg(u.value, c.value, {
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
  function k() {
    if (g(), i === void 0) {
      b();
      return;
    }
    if (u.value != null && c.value != null) {
      _ = i(u.value, c.value, b);
      return;
    }
  }
  function E() {
    r.value || (y.value = !1);
  }
  return he([s, o, a, r], b, {
    flush: "sync"
  }), he([u, c], k, {
    flush: "sync"
  }), he(r, E, {
    flush: "sync"
  }), Js() && fl(g), {
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
const rg = {
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
}, [j0, sg] = ut("PopperContent");
var og = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Gd({
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
  }, { ...rg }),
  emits: ["placed"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = ic(), { forwardRef: s, currentElement: o } = Le(), a = /* @__PURE__ */ L(), l = /* @__PURE__ */ L(), { width: u, height: c } = Yh(l), d = R(() => n.side + (n.align !== "center" ? `-${n.align}` : "")), p = R(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...n.collisionPadding
    }), f = R(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = R(() => ({
      padding: p.value,
      boundary: f.value.filter(Qv),
      altBoundary: f.value.length > 0
    })), m = R(() => ({
      mainAxis: n.sideFlip,
      crossAxis: n.alignFlip
    })), y = Ch(() => [
      Gm({
        mainAxis: n.sideOffset + c.value,
        alignmentAxis: n.alignOffset
      }),
      n.prioritizePosition && n.avoidCollisions && qa({
        ...h.value,
        ...m.value
      }),
      n.avoidCollisions && Xm({
        mainAxis: !0,
        crossAxis: !!n.prioritizePosition,
        limiter: n.sticky === "partial" ? Qm() : void 0,
        ...h.value
      }),
      !n.prioritizePosition && n.avoidCollisions && qa({
        ...h.value,
        ...m.value
      }),
      Ym({
        ...h.value,
        apply: ({ elements: O, rects: V, availableWidth: $, availableHeight: K }) => {
          const { width: se, height: Z } = V.reference, ee = O.floating.style;
          ee.setProperty("--reka-popper-available-width", `${$}px`), ee.setProperty("--reka-popper-available-height", `${K}px`), ee.setProperty("--reka-popper-anchor-width", `${se}px`), ee.setProperty("--reka-popper-anchor-height", `${Z}px`);
        }
      }),
      l.value && ng({
        element: l.value,
        padding: n.arrowPadding
      }),
      em({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      n.hideWhenDetached && Jm({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), C = R(() => n.reference ?? r.anchor.value), { floatingStyles: _, placement: b, isPositioned: g, middlewareData: k } = ig(C, a, {
      strategy: n.positionStrategy,
      placement: d,
      whileElementsMounted: (...O) => Km(...O, {
        layoutShift: !n.disableUpdateOnLayoutShift,
        animationFrame: n.updatePositionStrategy === "always"
      }),
      middleware: y
    }), E = R(() => zs(b.value)[0]), x = R(() => zs(b.value)[1]);
    zl(() => {
      g.value && i("placed");
    });
    const M = R(() => {
      const O = k.value.arrow?.centerOffset !== 0;
      return n.hideShiftedArrow && O;
    }), T = /* @__PURE__ */ L("");
    ht(() => {
      o.value && (T.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = R(() => k.value.arrow?.x ?? 0), D = R(() => k.value.arrow?.y ?? 0);
    return sg({
      placedSide: E,
      onArrowChange: (O) => l.value = O,
      arrowX: A,
      arrowY: D,
      shouldHideArrow: M
    }), (O, V) => (P(), Q("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Ct({
        ...v(_),
        transform: v(g) ? v(_).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: T.value,
        "--reka-popper-transform-origin": [v(k).transformOrigin?.x, v(k).transformOrigin?.y].join(" "),
        ...v(k).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [H(v(Ae), xe({ ref: v(s) }, O.$attrs, {
      "as-child": n.asChild,
      as: O.as,
      "data-side": E.value,
      "data-align": x.value,
      style: { animation: v(g) ? void 0 : "none" }
    }), {
      default: N(() => [ie(O.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), ag = og;
function lg(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => mi(i, e, n)) : mi(t, e, n);
}
function mi(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : Pn(t, e);
}
const [hc, ug] = ut("ListboxRoot");
var cg = /* @__PURE__ */ X({
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
    const i = t, r = n, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: u, dir: c } = /* @__PURE__ */ Yn(i), { getItems: d } = on({ isProvider: !0 }), { handleTypeaheadSearch: p } = vo(), { primitiveElement: f, currentElement: h } = hr(), m = Xh(), y = zu(c), C = po(h), _ = /* @__PURE__ */ L(), b = /* @__PURE__ */ L(!1), g = /* @__PURE__ */ L(!0), k = /* @__PURE__ */ Ei(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function E(Y) {
      if (b.value = !0, i.multiple) {
        const ae = Array.isArray(k.value) ? [...k.value] : [], de = ae.findIndex((ve) => mi(ve, Y, i.by));
        i.selectionBehavior === "toggle" ? (de === -1 ? ae.push(Y) : ae.splice(de, 1), k.value = ae) : (k.value = [Y], _.value = Y);
      } else i.selectionBehavior === "toggle" && mi(k.value, Y, i.by) ? k.value = void 0 : k.value = Y;
      setTimeout(() => {
        b.value = !1;
      }, 1);
    }
    const x = /* @__PURE__ */ L(null), M = /* @__PURE__ */ L(null), T = /* @__PURE__ */ L(!1), A = /* @__PURE__ */ L(!1), D = /* @__PURE__ */ us(), O = /* @__PURE__ */ us(), V = /* @__PURE__ */ us();
    function $() {
      return d().map((Y) => Y.ref).filter((Y) => Y.dataset.disabled !== "");
    }
    function K(Y, ae = !0) {
      if (!Y) return;
      x.value = Y, g.value && x.value.focus(), ae && x.value.scrollIntoView({ block: "nearest" });
      const de = d().find((ve) => ve.ref === Y);
      r("highlight", de);
    }
    function se(Y) {
      if (T.value) V.trigger(Y);
      else {
        const ae = d().find((de) => mi(de.value, Y, i.by));
        ae && (x.value = ae.ref, K(ae.ref));
      }
    }
    function Z(Y) {
      x.value && x.value.isConnected && (Y.preventDefault(), Y.stopPropagation(), A.value || x.value.click());
    }
    function ee(Y) {
      if (g.value) {
        if (b.value = !0, T.value) O.trigger(Y);
        else {
          const ae = Y.altKey || Y.ctrlKey || Y.metaKey;
          if (ae && Y.key === "a" && s.value) {
            const de = d(), ve = de.map((mt) => mt.value);
            k.value = [...ve], Y.preventDefault(), K(de[de.length - 1].ref);
          } else if (!ae) {
            const de = p(Y.key, d());
            de && K(de);
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
    function Oe(Y) {
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
          const de = $()?.[0];
          K(de);
        }
    }
    function qt(Y) {
      const ae = Qu(Y, a.value, y.value);
      if (!ae) return;
      let de = $();
      if (x.value) {
        if (ae === "last") de.reverse();
        else if (ae === "prev" || ae === "next") {
          ae === "prev" && de.reverse();
          const ve = de.indexOf(x.value);
          de = de.slice(ve + 1);
        }
        Qn(Y, de[0]);
      }
      if (de.length) {
        const ve = !x.value && ae === "prev" ? de.length - 1 : 0;
        K(de[ve]);
      }
      if (T.value) return O.trigger(Y);
    }
    function Qn(Y, ae) {
      if (!(T.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(k.value) || (Y.altKey || Y.ctrlKey || Y.metaKey) && !Y.shiftKey) && Y.shiftKey) {
        const ve = d().filter((S) => S.ref.dataset.disabled !== "");
        let mt = ve.find((S) => S.ref === ae)?.value;
        if (Y.key === m.END ? mt = ve[ve.length - 1].value : Y.key === m.HOME && (mt = ve[0].value), !mt || !_.value) return;
        const w = Sh(ve.map((S) => S.value), _.value, mt);
        k.value = w;
      }
    }
    async function Ht(Y) {
      if (await Me(), T.value) D.trigger(Y);
      else {
        const ae = $(), de = ae.find((ve) => ve.dataset.state === "checked");
        de ? K(de) : ae.length && K(ae[0]);
      }
    }
    return he(k, () => {
      b.value || Me(() => {
        Ht();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: x,
      highlightItem: se,
      highlightFirstItem: Ze,
      highlightSelected: Ht,
      getItems: d
    }), ug({
      modelValue: k,
      onValueChange: E,
      multiple: s,
      orientation: a,
      dir: y,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: x,
      isVirtual: T,
      virtualFocusHook: D,
      virtualKeydownHook: O,
      virtualHighlightHook: V,
      by: i.by,
      firstValue: _,
      selectionBehavior: u,
      focusable: g,
      onLeave: Oe,
      onEnter: Nt,
      changeHighlight: K,
      onKeydownEnter: Z,
      onKeydownNavigation: qt,
      onKeydownTypeAhead: ee,
      onCompositionStart: we,
      onCompositionEnd: $e,
      highlightFirstItem: Ze
    }), (Y, ae) => (P(), j(v(Ae), {
      ref_key: "primitiveElement",
      ref: f,
      as: Y.as,
      "as-child": Y.asChild,
      dir: v(y),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: Oe,
      onFocusout: ae[0] || (ae[0] = async (de) => {
        const ve = de.relatedTarget || de.target;
        await Me(), x.value && v(h) && !v(h).contains(ve) && Oe(de);
      })
    }, {
      default: N(() => [ie(Y.$slots, "default", { modelValue: v(k) }), v(C) && Y.name ? (P(), j(v(tc), {
        key: 0,
        name: Y.name,
        value: v(k),
        disabled: v(l),
        required: Y.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : ce("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), dg = cg, fg = /* @__PURE__ */ X({
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
    const { CollectionSlot: e } = on(), n = hc(), i = Lu(!1, 10);
    return (r, s) => (P(), j(v(e), null, {
      default: N(() => [H(v(Ae), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: v(n).focusable.value ? v(n).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(n).orientation.value,
        "aria-multiselectable": !!v(n).multiple.value,
        "data-orientation": v(n).orientation.value,
        onMousedown: s[0] || (s[0] = Dt((o) => i.value = !0, ["left"])),
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
        default: N(() => [ie(r.$slots, "default")]),
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
}), pg = fg;
const hg = "listbox.select", [vg, mg] = ut("ListboxItem");
var gg = /* @__PURE__ */ X({
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
    const n = t, i = e, r = Gn(void 0, "reka-listbox-item"), { CollectionItem: s } = on(), { forwardRef: o, currentElement: a } = Le(), l = hc(), u = R(() => a.value === l.highlightedElement.value), c = R(() => lg(l.modelValue.value, n.value, l.by)), d = R(() => l.disabled.value || n.disabled);
    async function p(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(n.value), l.changeHighlight(a.value));
    }
    function f(h) {
      const m = {
        originalEvent: h,
        value: n.value
      };
      zr(hg, p, m);
    }
    return mg({ isSelected: c }), (h, m) => (P(), j(v(s), { value: h.value }, {
      default: N(() => [Mf([u.value, c.value], () => H(v(Ae), xe({ id: v(r) }, h.$attrs, {
        ref: v(o),
        role: "option",
        tabindex: v(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: h.as,
        "as-child": h.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: f,
        onKeydown: pr(Dt(f, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
        })
      }), {
        default: N(() => [ie(h.$slots, "default")]),
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
}), yg = gg, bg = /* @__PURE__ */ X({
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
    Le();
    const n = vg();
    return (i, r) => v(n).isSelected.value ? (P(), j(v(Ae), xe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [ie(i.$slots, "default")]),
      _: 3
    }, 16)) : ce("v-if", !0);
  }
}), wg = bg;
function _g(t) {
  const e = fo({ nonce: /* @__PURE__ */ L() });
  return R(() => t?.value || e.nonce?.value);
}
const xg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Sg = [" ", "Enter"], gt = 10;
function br(t, e, n) {
  return t === void 0 ? !1 : Array.isArray(t) ? t.some((i) => Ws(i, e, n)) : Ws(t, e, n);
}
function Ws(t, e, n) {
  return t === void 0 || e === void 0 ? !1 : typeof t == "string" ? t === e : typeof n == "function" ? n(t, e) : typeof n == "string" ? t?.[n] === e?.[n] : Pn(t, e);
}
function Cg(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0;
}
const kg = {
  key: 0,
  value: ""
}, [Mn, vc] = ut("SelectRoot");
var Eg = /* @__PURE__ */ X({
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
    const n = t, i = e, { required: r, disabled: s, multiple: o, dir: a } = /* @__PURE__ */ Yn(n), l = /* @__PURE__ */ Ei(n, "modelValue", i, {
      defaultValue: n.defaultValue ?? (o.value ? [] : void 0),
      passive: n.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ Ei(n, "open", i, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), c = /* @__PURE__ */ L(), d = /* @__PURE__ */ L(), p = /* @__PURE__ */ L({
      x: 0,
      y: 0
    }), f = R(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Kn(l.value));
    on({ isProvider: !0 });
    const h = zu(a), m = po(c), y = /* @__PURE__ */ L(/* @__PURE__ */ new Set()), C = R(() => Array.from(y.value).map((g) => g.value).join(";"));
    function _(g) {
      if (o.value) {
        const k = Array.isArray(l.value) ? [...l.value] : [], E = k.findIndex((x) => Ws(x, g, n.by));
        E === -1 ? k.push(g) : k.splice(E, 1), l.value = [...k];
      } else l.value = g;
    }
    function b(g) {
      return Array.from(y.value).find((k) => br(g, k.value, n.by));
    }
    return vc({
      triggerElement: c,
      onTriggerChange: (g) => {
        c.value = g;
      },
      valueElement: d,
      onValueElementChange: (g) => {
        d.value = g;
      },
      contentId: "",
      modelValue: l,
      onValueChange: _,
      by: n.by,
      open: u,
      multiple: o,
      required: r,
      onOpenChange: (g) => {
        u.value = g;
      },
      dir: h,
      triggerPointerDownPosRef: p,
      disabled: s,
      isEmptyModelValue: f,
      optionsSet: y,
      onOptionAdd: (g) => {
        const k = b(g.value);
        k && y.value.delete(k), y.value.add(g);
      },
      onOptionRemove: (g) => {
        const k = b(g.value);
        k && y.value.delete(k);
      }
    }), (g, k) => (P(), j(v(Yv), null, {
      default: N(() => [ie(g.$slots, "default", {
        modelValue: v(l),
        open: v(u)
      }), v(m) ? (P(), j(Pg, {
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
        default: N(() => [v(Kn)(v(l)) ? (P(), Q("option", kg)) : ce("v-if", !0), (P(!0), Q(Se, null, mn(Array.from(y.value), (E) => (P(), Q("option", xe({ key: E.value ?? "" }, { ref_for: !0 }, E), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : ce("v-if", !0)]),
      _: 3
    }));
  }
}), Tg = Eg, Ag = /* @__PURE__ */ X({
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
    const e = t, n = /* @__PURE__ */ L(), i = Mn();
    he(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && u && n.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(n.value, s), n.value.dispatchEvent(c);
      }
    });
    function r(s) {
      i.onValueChange(s.target.value);
    }
    return (s, o) => (P(), j(v(ec), { "as-child": "" }, {
      default: N(() => [te("select", xe({
        ref_key: "selectElement",
        ref: n
      }, e, { onInput: r }), [ie(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Pg = Ag, Og = /* @__PURE__ */ X({
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
      default: gt
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
    const n = ho(t);
    return (i, r) => (P(), j(v(ag), xe(v(n), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: N(() => [ie(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ig = Og;
const Mg = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Gr, mc] = ut("SelectContent");
var Rg = /* @__PURE__ */ X({
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
    const n = t, i = e, r = Mn();
    Vh(), Bu(n.bodyLock);
    const { CollectionSlot: s, getItems: o } = on(), a = /* @__PURE__ */ L();
    qu(a);
    const { search: l, handleTypeaheadSearch: u } = vo(), c = /* @__PURE__ */ L(), d = /* @__PURE__ */ L(), p = /* @__PURE__ */ L(), f = /* @__PURE__ */ L(!1), h = /* @__PURE__ */ L(!1), m = /* @__PURE__ */ L(!1);
    function y() {
      d.value && a.value && Pa([d.value, a.value]);
    }
    he(f, () => {
      y();
    });
    const { onOpenChange: C, triggerPointerDownPosRef: _ } = r;
    ht((E) => {
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
      })), E(() => {
        document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function b(E) {
      const x = E.ctrlKey || E.altKey || E.metaKey;
      if (E.key === "Tab" && E.preventDefault(), !x && E.key.length === 1 && u(E.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(E.key)) {
        let T = [...o().map((A) => A.ref)];
        if (["ArrowUp", "End"].includes(E.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(E.key)) {
          const A = E.target, D = T.indexOf(A);
          T = T.slice(D + 1);
        }
        setTimeout(() => Pa(T)), E.preventDefault();
      }
    }
    const g = R(() => n.position === "popper" ? n : {}), k = ho(g.value);
    return mc({
      content: a,
      viewport: c,
      onViewportChange: (E) => {
        c.value = E;
      },
      itemRefCallback: (E, x, M) => {
        const T = !h.value && !M, A = br(r.modelValue.value, x, r.by);
        if (r.multiple.value) {
          if (m.value) return;
          (A || T) && (d.value = E, A && (m.value = !0));
        } else (A || T) && (d.value = E);
        T && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: p,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (E, x, M) => {
        const T = !h.value && !M;
        (br(r.modelValue.value, x, r.by) || T) && (p.value = E);
      },
      focusSelectedItem: y,
      position: n.position,
      isPositioned: f,
      searchRef: l
    }), (E, x) => (P(), j(v(s), null, {
      default: N(() => [H(v(Uu), {
        "as-child": "",
        onMountAutoFocus: x[6] || (x[6] = Dt(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: x[7] || (x[7] = (M) => {
          i("closeAutoFocus", M), !M.defaultPrevented && (v(r).triggerElement.value?.focus({ preventScroll: !0 }), M.preventDefault());
        })
      }, {
        default: N(() => [H(v(Wu), {
          "as-child": "",
          "disable-outside-pointer-events": E.disableOutsidePointerEvents,
          onFocusOutside: x[2] || (x[2] = Dt(() => {
          }, ["prevent"])),
          onDismiss: x[3] || (x[3] = (M) => v(r).onOpenChange(!1)),
          onEscapeKeyDown: x[4] || (x[4] = (M) => i("escapeKeyDown", M)),
          onPointerDownOutside: x[5] || (x[5] = (M) => i("pointerDownOutside", M))
        }, {
          default: N(() => [(P(), j(no(E.position === "popper" ? Ig : Fg), xe({
            ...E.$attrs,
            ...v(k)
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
            onContextmenu: x[0] || (x[0] = Dt(() => {
            }, ["prevent"])),
            onPlaced: x[1] || (x[1] = (M) => f.value = !0),
            onKeydown: b
          }), {
            default: N(() => [ie(E.$slots, "default")]),
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
}), Lg = Rg;
const [Dg, $g] = ut("SelectItemAlignedPosition");
var Bg = /* @__PURE__ */ X({
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
    const n = t, i = e, { getItems: r } = on(), s = Mn(), o = Gr(), a = /* @__PURE__ */ L(!1), l = /* @__PURE__ */ L(!0), u = /* @__PURE__ */ L(), { forwardRef: c, currentElement: d } = Le(), { viewport: p, selectedItem: f, selectedItemText: h, focusSelectedItem: m } = o;
    function y() {
      if (s.triggerElement.value && s.valueElement.value && u.value && d.value && p?.value && f?.value && h?.value) {
        const b = s.triggerElement.value.getBoundingClientRect(), g = d.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), E = h.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const Y = E.left - g.left, ae = k.left - Y, de = b.left - ae, ve = b.width + de, mt = Math.max(ve, g.width), w = window.innerWidth - gt, S = xa(ae, gt, Math.max(gt, w - mt));
          u.value.style.minWidth = `${ve}px`, u.value.style.left = `${S}px`;
        } else {
          const Y = g.right - E.right, ae = window.innerWidth - k.right - Y, de = window.innerWidth - b.right - ae, ve = b.width + de, mt = Math.max(ve, g.width), w = window.innerWidth - gt, S = xa(ae, gt, Math.max(gt, w - mt));
          u.value.style.minWidth = `${ve}px`, u.value.style.right = `${S}px`;
        }
        const x = r().map((Y) => Y.ref), M = window.innerHeight - gt * 2, T = p.value.scrollHeight, A = window.getComputedStyle(d.value), D = Number.parseInt(A.borderTopWidth, 10), O = Number.parseInt(A.paddingTop, 10), V = Number.parseInt(A.borderBottomWidth, 10), $ = Number.parseInt(A.paddingBottom, 10), K = D + O + T + $ + V, se = Math.min(f.value.offsetHeight * 5, K), Z = window.getComputedStyle(p.value), ee = Number.parseInt(Z.paddingTop, 10), we = Number.parseInt(Z.paddingBottom, 10), $e = b.top + b.height / 2 - gt, Ze = M - $e, Oe = f.value.offsetHeight / 2, Nt = f.value.offsetTop + Oe, qt = D + O + Nt, Qn = K - qt;
        if (qt <= $e) {
          const Y = f.value === x[x.length - 1];
          u.value.style.bottom = "0px";
          const ae = d.value.clientHeight - p.value.offsetTop - p.value.offsetHeight, de = Math.max(Ze, Oe + (Y ? we : 0) + ae + V), ve = qt + de;
          u.value.style.height = `${ve}px`;
        } else {
          const Y = f.value === x[0];
          u.value.style.top = "0px";
          const de = Math.max($e, D + p.value.offsetTop + (Y ? ee : 0) + Oe) + Qn;
          u.value.style.height = `${de}px`, p.value.scrollTop = qt - $e + p.value.offsetTop;
        }
        u.value.style.margin = `${gt}px 0`, u.value.style.minHeight = `${se}px`, u.value.style.maxHeight = `${M}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const C = /* @__PURE__ */ L("");
    Re(async () => {
      await Me(), y(), d.value && (C.value = window.getComputedStyle(d.value).zIndex);
    });
    function _(b) {
      b && l.value === !0 && (y(), m?.(), l.value = !1);
    }
    return Fh(s.triggerElement, () => {
      y();
    }), $g({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: _
    }), (b, g) => (P(), Q("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: Ct({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: C.value
      })
    }, [H(v(Ae), xe({
      ref: v(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...b.$attrs,
      ...n
    }), {
      default: N(() => [ie(b.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Fg = Bg, zg = /* @__PURE__ */ X({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(t) {
    return vc(t.context), mc(Mg), (n, i) => ie(n.$slots, "default");
  }
}), Ng = zg;
const qg = { key: 1 };
var Hg = /* @__PURE__ */ X({
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
    const n = t, r = Wh(n, e), s = Mn(), o = /* @__PURE__ */ L();
    Re(() => {
      o.value = new DocumentFragment();
    });
    const a = /* @__PURE__ */ L(), l = R(() => n.forceMount || s.open.value), u = /* @__PURE__ */ L(l.value);
    return he(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (P(), j(v(Vr), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: N(() => [H(Lg, Xs($r({
        ...v(r),
        ...c.$attrs
      })), {
        default: N(() => [ie(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (P(), Q("div", qg, [(P(), j(Wl, { to: o.value }, [H(Ng, { context: v(s) }, {
      default: N(() => [ie(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : ce("v-if", !0);
  }
}), Vg = Hg, Wg = /* @__PURE__ */ X({
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
    return (e, n) => (P(), j(v(Ae), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: N(() => [ie(e.$slots, "default", {}, () => [n[0] || (n[0] = De("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), jg = Wg;
const [gc, Ug] = ut("SelectItem");
var Kg = /* @__PURE__ */ X({
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
    const n = t, i = e, { disabled: r } = /* @__PURE__ */ Yn(n), s = Mn(), o = Gr(), { forwardRef: a, currentElement: l } = Le(), { CollectionItem: u } = on(), c = R(() => br(s.modelValue?.value, n.value, s.by)), d = /* @__PURE__ */ L(!1), p = /* @__PURE__ */ L(n.textValue ?? ""), f = Gn(void 0, "reka-select-item-text"), h = "select.select";
    async function m(g) {
      if (g.defaultPrevented) return;
      const k = {
        originalEvent: g,
        value: n.value
      };
      zr(h, y, k);
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
      await Me(), !(g.defaultPrevented || o.searchRef?.value !== "" && g.key === " ") && (Sg.includes(g.key) && m(g), g.key === " " && g.preventDefault());
    }
    if (n.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return Re(() => {
      l.value && o.itemRefCallback(l.value, n.value, n.disabled);
    }), Ug({
      value: n.value,
      disabled: r,
      textId: f,
      isSelected: c,
      onItemTextChange: (g) => {
        p.value = ((p.value || g?.textContent) ?? "").trim();
      }
    }), (g, k) => (P(), j(v(u), { value: { textValue: p.value } }, {
      default: N(() => [H(v(Ae), {
        ref: v(a),
        role: "option",
        "aria-labelledby": v(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": v(r) || void 0,
        "data-disabled": v(r) ? "" : void 0,
        tabindex: v(r) ? void 0 : -1,
        as: g.as,
        "as-child": g.asChild,
        onFocus: k[0] || (k[0] = (E) => d.value = !0),
        onBlur: k[1] || (k[1] = (E) => d.value = !1),
        onPointerup: m,
        onPointerdown: k[2] || (k[2] = (E) => {
          E.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: k[3] || (k[3] = Dt(() => {
        }, ["prevent", "stop"])),
        onPointermove: C,
        onPointerleave: _,
        onKeydown: b
      }, {
        default: N(() => [ie(g.$slots, "default")]),
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
}), Gg = Kg, Xg = /* @__PURE__ */ X({
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
    const e = t, n = gc();
    return (i, r) => v(n).isSelected.value ? (P(), j(v(Ae), xe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [ie(i.$slots, "default")]),
      _: 3
    }, 16)) : ce("v-if", !0);
  }
}), Yg = Xg, Jg = /* @__PURE__ */ X({
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
    const e = t, n = Mn(), i = Gr(), r = gc(), { forwardRef: s, currentElement: o } = Le(), a = R(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: o.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return Re(() => {
      o.value && (r.onItemTextChange(o.value), i.itemTextRefCallback(o.value, r.value, r.disabled.value), n.onOptionAdd(a.value));
    }), vn(() => {
      n.onOptionRemove(a.value);
    }), (l, u) => (P(), j(v(Ae), xe({
      id: v(r).textId,
      ref: v(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: N(() => [ie(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Zg = Jg, Qg = /* @__PURE__ */ X({
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
    return (n, i) => (P(), j(v(Yu), Xs($r(e)), {
      default: N(() => [ie(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ey = Qg, ty = /* @__PURE__ */ X({
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
    const e = t, n = Mn(), { forwardRef: i, currentElement: r } = Le(), s = R(() => n.disabled?.value || e.disabled);
    n.contentId ||= Gn(void 0, "reka-select-content"), Re(() => {
      n.onTriggerChange(r.value);
    });
    const { getItems: o } = on(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = vo();
    function c() {
      s.value || (n.onOpenChange(!0), u());
    }
    function d(p) {
      c(), n.triggerPointerDownPosRef.value = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      };
    }
    return (p, f) => (P(), j(v(Zv), {
      "as-child": "",
      reference: p.reference
    }, {
      default: N(() => [H(v(Ae), {
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
        "data-placeholder": v(Cg)(v(n).modelValue?.value) ? "" : void 0,
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
        onPointerup: f[2] || (f[2] = Dt((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (h) => {
          const m = v(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && m && h.key === " " || (v(l)(h.key, v(o)()), v(xg).includes(h.key) && (c(), h.preventDefault()));
        })
      }, {
        default: N(() => [ie(p.$slots, "default")]),
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
}), ny = ty, iy = /* @__PURE__ */ X({
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
    const e = t, { nonce: n } = /* @__PURE__ */ Yn(e), i = _g(n), r = Gr(), s = r.position === "item-aligned" ? Dg() : void 0, { forwardRef: o, currentElement: a } = Le();
    Re(() => {
      r?.onViewportChange(a.value);
    });
    const l = /* @__PURE__ */ L(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: p, contentWrapper: f } = s ?? {};
      if (p?.value && f?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const m = window.innerHeight - gt * 2, y = Number.parseFloat(f.value.style.minHeight), C = Number.parseFloat(f.value.style.height), _ = Math.max(y, C);
          if (_ < m) {
            const b = _ + h, g = Math.min(m, b), k = b - g;
            f.value.style.height = `${g}px`, f.value.style.bottom === "0px" && (d.scrollTop = k > 0 ? k : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (P(), Q(Se, null, [H(v(Ae), xe({
      ref: v(o),
      "data-reka-select-viewport": "",
      role: "presentation"
    }, {
      ...c.$attrs,
      ...e
    }, {
      style: {
        position: "relative",
        flex: 1,
        overflow: "hidden auto"
      },
      onScroll: u
    }), {
      default: N(() => [ie(c.$slots, "default")]),
      _: 3
    }, 16), H(v(Ae), {
      as: "style",
      nonce: v(i)
    }, {
      default: N(() => d[0] || (d[0] = [De(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), ry = iy;
const sy = /* @__PURE__ */ X({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: { type: String }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (e, n) => (P(), j(v(jv), {
      "model-value": t.modelValue,
      "aria-label": t.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": n[0] || (n[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: n[1] || (n[1] = Dt(() => {
      }, ["stop"]))
    }, {
      default: N(() => [
        H(v(Kv), { class: "checkbox-indicator" }, {
          default: N(() => [
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
}), oy = ".checkbox[data-v-024ee78b]{all:unset;width:16px;height:16px;flex-shrink:0;border:1.5px solid var(--color-border);border-radius:var(--radius-sm);background-color:var(--color-surface);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color var(--transition-duration),border-color var(--transition-duration)}.checkbox[data-v-024ee78b]:hover{border-color:var(--color-primary)}.checkbox[data-v-024ee78b]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.checkbox[data-state=checked][data-v-024ee78b]{background-color:var(--color-primary);border-color:var(--color-primary)}.checkbox-indicator[data-v-024ee78b]{color:var(--color-white, #fff);display:inline-flex;align-items:center;justify-content:center}", ay = /* @__PURE__ */ Pe(sy, [["styles", [oy]], ["__scopeId", "data-v-024ee78b"]]);
function ly() {
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
const Va = [
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
function uy(t, e, n) {
  const i = Va[t.size % Va.length];
  return { id: e, name: n, color: i };
}
function cy(t, e, n) {
  return !e || t.has(e) ? null : uy(t, e, n ?? e);
}
function dy(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function fy(t) {
  const e = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  function n(s, o) {
    const a = cy(e, s, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(s, o) {
    const a = dy(e, s, o);
    a && (e.set(s, a), t("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: r };
}
function py(t, e) {
  return [...t, e];
}
function hy(t, e) {
  return [...e, ...t];
}
function So(t, e) {
  return t.findIndex((n) => n.id === e);
}
function vy(t, e, n) {
  const i = So(t, e);
  if (i === -1) return null;
  const r = { ...t[i], ...n, id: e }, s = t.slice();
  return s[i] = r, { turns: s, updated: r };
}
function my(t, e) {
  const n = So(t, e);
  return n === -1 ? null : t.filter((i, r) => r !== n);
}
function gy(t, e, n) {
  const i = So(t, e);
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
function yy(t, e, n) {
  const { id: i, languages: r, isSource: s, audio: o } = t, a = /* @__PURE__ */ fn(t.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const b = a.value;
    for (let g = 0; g < b.length; g++)
      l.set(b[g].id, g);
  }
  u();
  function c(b) {
    n(b.speakerId), l.set(b.id, a.value.length), a.value = py(a.value, b), e("turn:add", { turn: b, translationId: i });
  }
  function d(b, g) {
    const k = vy(a.value, b, g);
    k && (a.value = k.turns, e("turn:update", { turn: k.updated, translationId: i }));
  }
  function p(b) {
    const g = my(a.value, b);
    g && (a.value = g, u(), e("turn:remove", { turnId: b, translationId: i }));
  }
  function f(b, g) {
    const k = gy(a.value, b, g);
    k && (a.value = k.turns, e("turn:update", { turn: k.updated, translationId: i }));
  }
  function h(b) {
    js(b, n), a.value = hy(a.value, b), u();
  }
  function m(b) {
    js(b, n), a.value = b, u(), e("translation:sync", { translationId: i });
  }
  function y(b) {
    a.value = b, u();
  }
  function C(b) {
    const g = l.get(b.id);
    g !== void 0 ? a.value[g] = b : (l.set(b.id, a.value.length), a.value.push(b));
  }
  function _(b) {
    return l.has(b);
  }
  return { id: i, languages: r, isSource: s, audio: o, turns: a, addTurn: c, prependTurns: h, updateTurn: d, removeTurn: p, updateWords: f, setTurns: m, replaceTurns: y, updateOrCreateTurnSilent: C, hasTurn: _ };
}
function Wa(t, e, n) {
  const { id: i, name: r, description: s, duration: o } = t, a = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  let l;
  for (const m of t.translations) {
    const y = yy(m, e, n);
    a.set(m.id, y), m.isSource && !l && (l = y);
  }
  l || (l = a.values().next().value);
  const u = /* @__PURE__ */ L(null), c = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(!0), p = R(() => u.value ? a.get(u.value) ?? l : l);
  function f(m) {
    const y = m === l.id ? null : m;
    y !== u.value && (u.value = y, e("translation:change", { translationId: p.value.id }));
  }
  function h() {
    for (const m of a.values())
      m.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: r,
    description: s,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: p,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: h
  };
}
function by(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, r] of t.speakers)
    e.add(i), n.push({ id: i, name: r.name });
  for (const i of t.channels)
    for (const r of i.translations)
      for (const s of r.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), n.push({ id: s.speakerId, name: s.speakerId }));
  return n;
}
function wy(t = {}) {
  const e = /* @__PURE__ */ L(""), n = /* @__PURE__ */ L(t.activeChannelId ?? ""), i = /* @__PURE__ */ L(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: s, emit: o, clear: a } = ly(), l = fy(o), u = l, c = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map()), d = R(
    () => c.get(n.value) ?? [...c.values()][0]
  );
  function p(E, x) {
    return r(E, (M) => {
      M.translationId === d.value.activeTranslation.value.id && x(M);
    });
  }
  function f(E) {
    e.value = E.title, l.clear(), c.clear();
    for (const x of by(E))
      u.ensure(x.id, x.name);
    for (const x of E.channels)
      c.set(x.id, Wa(x, o, u.ensure));
    c.size > 0 && !c.has(n.value) && (n.value = c.keys().next().value);
  }
  function h(E) {
    Xp(E), f(E);
  }
  function m(E) {
    E !== n.value && (n.value = E, o("channel:change", { channelId: E }));
  }
  function y(E, x) {
    if (c.has(E)) {
      for (const M of x.translations)
        js(M.turns, u.ensure);
      c.set(E, Wa(x, o, u.ensure)), o("channel:sync", { channelId: E });
    }
  }
  const C = [], _ = [];
  function b(E) {
    E.tiptapExtensions && _.push(...E.tiptapExtensions);
    const x = E.install(k);
    x && C.push(x);
  }
  function g() {
    o("destroy", void 0), C.forEach((E) => E()), C.length = 0, a();
  }
  t.document && f(t.document);
  const k = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: _,
    speakers: u,
    channels: c,
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
  return k;
}
const yc = /* @__PURE__ */ Symbol("editorStore");
function _y(t) {
  Jn(yc, t);
}
function yn() {
  const t = Xt(yc);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const bc = /* @__PURE__ */ Symbol("turnSelection");
function ja(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function xy(t, e, n) {
  const i = /* @__PURE__ */ Ii(/* @__PURE__ */ new Map());
  let r = null;
  const s = R(() => i.size), o = R(() => i.size > 0);
  function a(C) {
    return i.has(C);
  }
  function l(C) {
    i.has(C) ? i.delete(C) : i.set(C, !0), r = C;
  }
  function u(C) {
    if (r === null) {
      l(C);
      return;
    }
    const _ = t.value.map((x) => x.id), b = _.indexOf(r), g = _.indexOf(C);
    if (b === -1 || g === -1) {
      l(C);
      return;
    }
    const k = Math.min(b, g), E = Math.max(b, g);
    for (let x = k; x <= E; x++) {
      const M = _[x];
      M != null && i.set(M, !0);
    }
  }
  function c() {
    i.clear(), r = null;
  }
  async function d() {
    const _ = t.value.filter((b) => i.has(b.id)).map(ja).join(`

`);
    await navigator.clipboard.writeText(_);
  }
  async function p() {
    const _ = t.value.filter((b) => i.has(b.id)).map((b) => {
      const k = (b.speakerId ? e.get(b.speakerId) : void 0)?.name ?? "", E = b.startTime != null ? ki(b.startTime) : "", x = [k, E].filter(Boolean).join(" (") + (E ? ")" : ""), M = ja(b);
      return x ? `${x}
${M}` : M;
    });
    await navigator.clipboard.writeText(_.join(`

`));
  }
  he(
    () => t.value,
    (C) => {
      if (i.size === 0) return;
      const _ = new Set(C.map((b) => b.id));
      for (const b of [...i.keys()])
        _.has(b) || i.delete(b);
    }
  );
  const f = n.on("channel:change", c), h = n.on("translation:change", c);
  function m(C) {
    C.key === "Escape" && i.size > 0 && c();
  }
  Re(() => {
    document.addEventListener("keydown", m);
  }), rn(() => {
    document.removeEventListener("keydown", m), f(), h();
  });
  const y = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: u,
    clear: c,
    copyText: d,
    copyWithMetadata: p
  };
  return Jn(bc, y), y;
}
function wc() {
  const t = Xt(bc);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const Sy = ["data-turn-active", "aria-selected"], Cy = { class: "turn-text" }, ky = ["data-word-active"], Ey = /* @__PURE__ */ X({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = yn(), i = wc(), { t: r } = vt(), s = R(() => e.turn.words.length > 0), o = R(() => {
      if (!n.audio?.src.value || !s.value) return null;
      const f = n.audio.currentTime.value, { startTime: h, endTime: m, words: y } = e.turn;
      return h == null || m == null || f < h || f > m ? null : Jp(y, f);
    }), a = R(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Mu(e.turn.words)) return !1;
      const f = n.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = R(() => e.speaker?.color ?? "transparent"), u = R(() => i.isSelected(e.turn.id)), c = R(() => {
      const f = e.speaker?.name ?? "", h = u.value ? "selection.deselect" : "selection.select";
      return r(h).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function p(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, h) => (P(), Q("section", {
      class: pt(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: Ct({ "--speaker-color": l.value }),
      "aria-selected": v(i).hasSelection.value ? u.value : void 0
    }, [
      t.partial ? ce("", !0) : (P(), Q("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        v(i).hasSelection.value ? (P(), j(ay, {
          key: 0,
          "model-value": u.value,
          "aria-label": c.value,
          onClick: Dt(p, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : ce("", !0),
        H(_h, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      te("p", Cy, [
        s.value ? (P(!0), Q(Se, { key: 0 }, mn(t.turn.words, (m, y) => (P(), Q(Se, {
          key: m.id
        }, [
          te("span", {
            class: pt({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, fe(m.text), 11, ky),
          De(fe(y < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (P(), Q(Se, { key: 1 }, [
          De(fe(t.turn.text), 1)
        ], 64)) : ce("", !0)
      ])
    ], 14, Sy));
  }
}), Ty = ".turn[data-v-a69afe32]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-a69afe32]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn[data-v-a69afe32]:has(.turn-header:hover){background-color:var(--color-surface-hover)}.turn-text[data-v-a69afe32]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-a69afe32]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-a69afe32]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-a69afe32]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-a69afe32]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-a69afe32 .2s ease}@keyframes partial-fade-in-a69afe32{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-a69afe32]{animation:none}}@media(max-width:767px){.turn[data-v-a69afe32]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-a69afe32],.turn--active[data-v-a69afe32]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", Ua = /* @__PURE__ */ Pe(Ey, [["styles", [Ty]], ["__scopeId", "data-v-a69afe32"]]), Ay = {}, Py = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Oy(t, e) {
  return P(), Q("svg", Py, [...e[0] || (e[0] = [
    Sf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Iy = /* @__PURE__ */ Pe(Ay, [["render", Oy]]), My = { class: "transcription-empty" }, Ry = { class: "message" }, Ly = /* @__PURE__ */ X({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = vt();
    return (n, i) => (P(), Q("div", My, [
      H(Iy, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      te("p", Ry, fe(v(e)("transcription.empty")), 1)
    ]));
  }
}), Dy = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", $y = /* @__PURE__ */ Pe(Ly, [["styles", [Dy]], ["__scopeId", "data-v-f82737e5"]]), By = { class: "transcription-panel" }, Fy = {
  ref: "scrollContainer",
  class: "scroll-container"
}, zy = { class: "turns-container" }, Ny = {
  key: 0,
  class: "history-loading",
  role: "status"
}, qy = {
  key: 1,
  class: "history-start"
}, Hy = /* @__PURE__ */ X({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = vt(), i = yn(), r = _i("scrollContainer"), s = R(() => {
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
    ), u = R(() => i.activeChannel.value), c = R(
      () => u.value.isLoadingHistory.value
    ), d = R(() => u.value.hasMoreHistory.value), { scrollRef: p, contentRef: f, isAtBottom: h, scrollToBottom: m } = fh();
    Re(() => {
      p.value = r.value, f.value = r.value?.querySelector(".turns-container") ?? null;
    });
    const y = Gp(() => {
      const _ = u.value;
      _.hasMoreHistory.value && (_.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function C() {
      const _ = r.value;
      _ && _.scrollTop < 100 && y();
    }
    return he(
      () => e.turns,
      (_, b) => {
        const g = _.length, k = b.length;
        if (g > k && !h.value && _[0]?.id != b[0]?.id) {
          const E = g - k, x = e.turns[E]?.id;
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
    }), rn(() => {
      r.value?.removeEventListener("scroll", C);
    }), (_, b) => (P(), Q("article", By, [
      te("div", Fy, [
        te("div", zy, [
          c.value ? (P(), Q("div", Ny, [...b[3] || (b[3] = [
            te("progress", null, null, -1)
          ])])) : ce("", !0),
          !d.value && t.turns.length > 0 ? (P(), Q("div", qy, fe(v(n)("transcription.historyStart")), 1)) : ce("", !0),
          t.turns.length === 0 && !c.value && !s.value ? (P(), j($y, {
            key: 2,
            class: "transcription-empty"
          })) : ce("", !0),
          (P(!0), Q(Se, null, mn(t.turns, (g, k, E, x) => {
            const M = [g, t.speakers.get(g.speakerId ?? ""), o.value && !s.value && k === t.turns.length - 1];
            if (x && x.key === g.id && Su(x, M)) return x;
            const T = (P(), j(Ua, {
              "data-turn-id": g.id,
              key: g.id,
              turn: g,
              speaker: g.speakerId ? t.speakers.get(g.speakerId) : void 0,
              live: o.value && !s.value && k === t.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return T.memo = M, T;
          }, b, 0), 128)),
          s.value ? (P(), j(Ua, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : ce("", !0)
        ]),
        H(ao, { name: "fade-slide" }, {
          default: N(() => [
            !v(h) && (a.value || o.value) ? (P(), j(ft, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": v(n)("transcription.resumeScroll"),
              onClick: b[2] || (b[2] = (g) => v(m)())
            }, {
              default: N(() => [
                De(fe(v(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : ce("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Vy = ".transcription-panel[data-v-49c5b0cc]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-49c5b0cc]{height:100%;overflow:auto;position:relative}.turns-container[data-v-49c5b0cc]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-49c5b0cc]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-49c5b0cc]{width:120px}.history-start[data-v-49c5b0cc]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-49c5b0cc]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-49c5b0cc],.fade-slide-leave-to[data-v-49c5b0cc]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-49c5b0cc],.fade-slide-leave-active[data-v-49c5b0cc]{transition:none}}@media(max-width:767px){.turns-container[data-v-49c5b0cc]{padding:var(--spacing-md)}}", Wy = /* @__PURE__ */ Pe(Hy, [["styles", [Vy]], ["__scopeId", "data-v-49c5b0cc"]]), jy = { class: "switch" }, Uy = ["id", "checked"], Ky = ["for"], Gy = /* @__PURE__ */ X({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = n.id ?? Yl();
    return (s, o) => (P(), Q("div", jy, [
      te("input", {
        type: "checkbox",
        id: v(r),
        checked: t.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Uy),
      te("label", { for: v(r) }, [...o[1] || (o[1] = [
        te("div", { class: "switch-slider" }, null, -1)
      ])], 8, Ky)
    ]));
  }
}), Xy = ".switch[data-v-2aa0332f]{display:inline-block;flex-shrink:0}.switch input[data-v-2aa0332f]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-2aa0332f]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-2aa0332f]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-2aa0332f]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-2aa0332f]{left:20px;border-color:var(--color-primary)}", gs = /* @__PURE__ */ Pe(Gy, [["styles", [Xy]], ["__scopeId", "data-v-2aa0332f"]]), Yy = "(max-width: 767px)";
function _c() {
  const t = /* @__PURE__ */ L(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return Re(() => {
    e = window.matchMedia(Yy), t.value = e.matches, e.addEventListener("change", n);
  }), rn(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Jy = { class: "sidebar-select-trigger-label" }, Zy = /* @__PURE__ */ X({
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
    ), s = /* @__PURE__ */ L(), o = /* @__PURE__ */ L([]);
    return Re(() => {
      const a = s.value?.closest(".speaker-sidebar");
      a && (o.value = [a]);
    }), (a, l) => (P(), Q("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: s
    }, [
      H(v(Tg), {
        "model-value": t.selectedValue,
        "onUpdate:modelValue": l[0] || (l[0] = (u) => i("update:selectedValue", u))
      }, {
        default: N(() => [
          H(v(ny), {
            class: "sidebar-select-trigger",
            "aria-label": t.ariaLabel
          }, {
            default: N(() => [
              te("span", Jy, [
                ie(a.$slots, "trigger", { item: r.value }, () => [
                  De(fe(r.value?.label ?? ""), 1)
                ])
              ]),
              H(v(jg), null, {
                default: N(() => [
                  H(v(Au), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 3
          }, 8, ["aria-label"]),
          H(v(ey), { disabled: "" }, {
            default: N(() => [
              H(v(Vg), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": o.value
              }, {
                default: N(() => [
                  H(v(ry), null, {
                    default: N(() => [
                      (P(!0), Q(Se, null, mn(t.items, (u) => (P(), j(v(Gg), {
                        key: u.value,
                        value: u.value,
                        class: "sidebar-select-item"
                      }, {
                        default: N(() => [
                          H(v(Yg), { class: "sidebar-select-item-indicator" }, {
                            default: N(() => [
                              H(v(Fr), { size: 14 })
                            ]),
                            _: 1
                          }),
                          H(v(Zg), null, {
                            default: N(() => [
                              ie(a.$slots, "item", { item: u }, () => [
                                De(fe(u.label), 1)
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
}), Qy = { class: "sidebar-select" }, eb = ["aria-label"], tb = { class: "sidebar-select-trigger-label" }, nb = /* @__PURE__ */ X({
  __name: "SidebarSelectSheet",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, r = /* @__PURE__ */ L(!1), s = R(
      () => n.items.find((a) => a.value === n.selectedValue)
    );
    function o(a) {
      i("update:selectedValue", a), r.value = !1;
    }
    return (a, l) => (P(), Q("div", Qy, [
      te("button", {
        class: "sidebar-select-trigger",
        "aria-label": t.ariaLabel,
        onClick: l[0] || (l[0] = (u) => r.value = !0)
      }, [
        te("span", tb, [
          ie(a.$slots, "trigger", { item: s.value }, () => [
            De(fe(s.value?.label ?? ""), 1)
          ])
        ])
      ], 8, eb),
      H(v(Hu), {
        open: r.value,
        "onUpdate:open": l[2] || (l[2] = (u) => r.value = u)
      }, {
        default: N(() => [
          H(v(Ju), { disabled: "" }, {
            default: N(() => [
              H(v(Xu), { class: "editor-overlay" }),
              H(v(Gu), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: N(() => [
                  H(v(Zu), { class: "sr-only" }, {
                    default: N(() => [
                      De(fe(t.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = te("div", { class: "sheet-handle" }, null, -1)),
                  H(v(dg), {
                    "model-value": t.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (u) => o(u))
                  }, {
                    default: N(() => [
                      H(v(pg), { class: "sheet-list" }, {
                        default: N(() => [
                          (P(!0), Q(Se, null, mn(t.items, (u) => (P(), j(v(yg), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: N(() => [
                              H(v(wg), { class: "sheet-item-indicator" }, {
                                default: N(() => [
                                  H(v(Fr), { size: 16 })
                                ]),
                                _: 1
                              }),
                              ie(a.$slots, "item", { item: u }, () => [
                                De(fe(u.label), 1)
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
}), xc = /* @__PURE__ */ X({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, { isMobile: i } = _c();
    return (r, s) => v(i) ? (P(), j(nb, xe({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => n("update:selectedValue", o))
    }), No({ _: 2 }, [
      r.$slots.item ? {
        name: "item",
        fn: N(({ item: o }) => [
          ie(r.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      r.$slots.trigger ? {
        name: "trigger",
        fn: N(({ item: o }) => [
          ie(r.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040)) : (P(), j(Zy, xe({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => n("update:selectedValue", o))
    }), No({ _: 2 }, [
      r.$slots.item ? {
        name: "item",
        fn: N(({ item: o }) => [
          ie(r.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      r.$slots.trigger ? {
        name: "trigger",
        fn: N(({ item: o }) => [
          ie(r.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040));
  }
}), Sc = /* @__PURE__ */ X({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r } = vt(), s = R(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (P(), j(xc, {
      items: s.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: v(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), ib = { class: "translation-row" }, rb = {
  key: 0,
  class: "translation-row-badge"
}, sb = {
  key: 0,
  class: "translation-trigger-badge"
}, ob = /* @__PURE__ */ X({
  __name: "TranslationSelector",
  props: {
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedTranslationId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: r, locale: s } = vt(), o = R(
      () => Kp(
        n.translations,
        s.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    return (a, l) => (P(), j(xc, {
      items: o.value,
      "selected-value": t.selectedTranslationId,
      ariaLabel: v(r)("sidebar.translationLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (u) => i("update:selectedTranslationId", u))
    }, {
      item: N(({ item: u }) => [
        te("span", ib, [
          u.originalLabel ? (P(), Q("strong", rb, fe(u.originalLabel), 1)) : ce("", !0),
          te("span", null, fe(u.label), 1)
        ])
      ]),
      trigger: N(({ item: u }) => [
        u?.originalLabel ? (P(), Q("span", sb, fe(u.originalLabel), 1)) : ce("", !0),
        te("span", null, fe(u?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), ab = ".translation-row[data-v-77b61b2c]{display:flex;flex-direction:column;gap:2px}.translation-row-badge[data-v-77b61b2c]{font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}.translation-trigger-badge[data-v-77b61b2c]{font-variant-caps:all-small-caps;color:var(--color-text-muted);margin-right:var(--spacing-xs);letter-spacing:.05em}", Cc = /* @__PURE__ */ Pe(ob, [["styles", [ab]], ["__scopeId", "data-v-77b61b2c"]]), lb = { class: "speaker-sidebar" }, ub = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, cb = { class: "sidebar-title" }, db = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, fb = { class: "sidebar-title" }, pb = {
  key: 2,
  class: "sidebar-section"
}, hb = { class: "sidebar-title" }, vb = { class: "subtitle-toggle" }, mb = { class: "subtitle-toggle-label" }, gb = { class: "subtitle-slider" }, yb = { class: "subtitle-slider-label" }, bb = { class: "subtitle-slider-value" }, wb = ["value", "disabled"], _b = {
  key: 0,
  class: "subtitle-toggle"
}, xb = { class: "subtitle-toggle-label" }, Sb = {
  key: 1,
  class: "subtitle-toggle"
}, Cb = { class: "subtitle-toggle-label" }, kb = {
  key: 3,
  class: "sidebar-section"
}, Eb = { class: "sidebar-title" }, Tb = { class: "speaker-list" }, Ab = { class: "speaker-name" }, Pb = /* @__PURE__ */ X({
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
    const e = yn(), { t: n } = vt();
    return (i, r) => (P(), Q("aside", lb, [
      t.channels.length > 1 ? (P(), Q("section", ub, [
        te("h2", cb, fe(v(n)("sidebar.channel")), 1),
        H(Sc, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": r[0] || (r[0] = (s) => i.$emit("update:selectedChannelId", s))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : ce("", !0),
      t.translations.length > 1 ? (P(), Q("section", db, [
        te("h2", fb, fe(v(n)("sidebar.translation")), 1),
        H(Cc, {
          translations: t.translations,
          "selected-translation-id": t.selectedTranslationId,
          "onUpdate:selectedTranslationId": r[1] || (r[1] = (s) => i.$emit("update:selectedTranslationId", s))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : ce("", !0),
      v(e).subtitle ? (P(), Q("section", pb, [
        te("h2", hb, fe(v(n)("sidebar.subtitle")), 1),
        te("div", vb, [
          te("span", mb, fe(v(n)("subtitle.show")), 1),
          H(gs, {
            modelValue: v(e).subtitle.isVisible.value,
            "onUpdate:modelValue": r[2] || (r[2] = (s) => v(e).subtitle.isVisible.value = s)
          }, null, 8, ["modelValue"])
        ]),
        te("label", gb, [
          te("span", yb, [
            De(fe(v(n)("subtitle.fontSize")) + " ", 1),
            te("span", bb, fe(v(e).subtitle.fontSize.value) + "px", 1)
          ]),
          te("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(e).subtitle.fontSize.value,
            disabled: !v(e).subtitle.isVisible.value,
            onInput: r[3] || (r[3] = (s) => v(e).subtitle.fontSize.value = Number(s.target.value))
          }, null, 40, wb)
        ]),
        v(e).subtitle.watermark && !v(e).subtitle.watermark.readonly ? (P(), Q("div", _b, [
          te("span", xb, fe(v(n)("subtitle.showWatermark")), 1),
          H(gs, {
            modelValue: v(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": r[4] || (r[4] = (s) => v(e).subtitle.watermark.display.value = s),
            disabled: !v(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : ce("", !0),
        v(e).subtitle.watermark && !v(e).subtitle.watermark.readonly && v(e).subtitle.watermark.display.value ? (P(), Q("div", Sb, [
          te("span", Cb, fe(v(n)("subtitle.pinWatermark")), 1),
          H(gs, {
            modelValue: v(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": r[5] || (r[5] = (s) => v(e).subtitle.watermark.pinned.value = s),
            disabled: !v(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : ce("", !0)
      ])) : ce("", !0),
      t.speakers.length ? (P(), Q("section", kb, [
        te("h2", Eb, fe(v(n)("sidebar.speakers")), 1),
        te("ul", Tb, [
          (P(!0), Q(Se, null, mn(t.speakers, (s) => (P(), Q("li", {
            key: s.id,
            class: "speaker-item"
          }, [
            H(Ru, {
              color: s.color
            }, null, 8, ["color"]),
            te("span", Ab, fe(s.name), 1)
          ]))), 128))
        ])
      ])) : ce("", !0)
    ]));
  }
}), Ob = ".speaker-sidebar[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-749c56f0]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-749c56f0]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-749c56f0]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-749c56f0]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-749c56f0]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-749c56f0]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-749c56f0]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider[data-v-749c56f0]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-749c56f0]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-749c56f0]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-749c56f0]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-749c56f0]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-749c56f0]{border-left:none}.sidebar-section--selector[data-v-749c56f0]{display:none}}", Ka = /* @__PURE__ */ Pe(Pb, [["styles", [Ob]], ["__scopeId", "data-v-749c56f0"]]), Ib = /* @__PURE__ */ X({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = nf(t, "open"), { t: n } = vt();
    return (i, r) => (P(), j(v(Hu), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (s) => e.value = s)
    }, {
      default: N(() => [
        H(v(Ju), { disabled: "" }, {
          default: N(() => [
            H(v(Xu), { class: "editor-overlay" }),
            H(v(Gu), { class: "sidebar-drawer" }, {
              default: N(() => [
                H(v(Zu), { class: "sr-only" }, {
                  default: N(() => [
                    De(fe(v(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                H(v(sv), {
                  class: "sidebar-close",
                  "aria-label": v(n)("header.closeSidebar")
                }, {
                  default: N(() => [
                    H(v(uo), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                ie(i.$slots, "default")
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
}), Mb = { class: "player-controls" }, Rb = { class: "controls-left" }, Lb = { class: "controls-time" }, Db = { class: "time-display" }, $b = { class: "time-display" }, Bb = { class: "controls-right" }, Fb = ["value", "aria-label", "disabled"], zb = /* @__PURE__ */ X({
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
    const n = e, { t: i } = vt(), r = /* @__PURE__ */ L(!1);
    function s(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (P(), Q("div", Mb, [
      te("div", Rb, [
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
      te("div", Lb, [
        te("time", Db, fe(t.currentTime), 1),
        a[7] || (a[7] = te("span", { class: "time-separator" }, "/", -1)),
        te("time", $b, fe(t.duration), 1)
      ]),
      te("div", Bb, [
        te("div", {
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
          Cd(te("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": v(i)("player.volume"),
            disabled: !t.isReady,
            onInput: s
          }, null, 40, Fb), [
            [Wf, r.value]
          ])
        ], 32),
        H(ft, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": v(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: N(() => [
            De(fe(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Nb = ".player-controls[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-2dcb93b1]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-2dcb93b1]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-2dcb93b1]:disabled{opacity:.5;cursor:default}.play-button[data-v-2dcb93b1]{--btn-height: 40px;--btn-icon-size: 20px}.speed-button[data-v-2dcb93b1]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-2dcb93b1],.volume-slider[data-v-2dcb93b1]{display:none}.player-controls[data-v-2dcb93b1]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", qb = /* @__PURE__ */ Pe(zb, [["styles", [Nb]], ["__scopeId", "data-v-2dcb93b1"]]);
function Xe(t, e, n, i) {
  return new (n || (n = Promise))((function(r, s) {
    function o(u) {
      try {
        l(i.next(u));
      } catch (c) {
        s(c);
      }
    }
    function a(u) {
      try {
        l(i.throw(u));
      } catch (c) {
        s(c);
      }
    }
    function l(u) {
      var c;
      u.done ? r(u.value) : (c = u.value, c instanceof n ? c : new n((function(d) {
        d(c);
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
const ji = { decode: function(t, e) {
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
function kc(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(kc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function Ga(t, e, n) {
  const i = kc(t, e || {});
  return n?.appendChild(i), i;
}
var Hb = Object.freeze({ __proto__: null, createElement: Ga, default: Ga });
const Vb = { fetchBlob: function(t, e, n) {
  return Xe(this, void 0, void 0, (function* () {
    const i = yield fetch(t, n);
    if (i.status >= 400) throw new Error(`Failed to fetch ${t}: ${i.status} (${i.statusText})`);
    return (function(r, s) {
      Xe(this, void 0, void 0, (function* () {
        if (!r.body || !r.headers) return;
        const o = r.body.getReader(), a = Number(r.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          s(d);
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
function En(t, e) {
  const n = Ie(t());
  return e.forEach(((i) => i.subscribe((() => {
    const r = t();
    Object.is(n.value, r) || n.set(r);
  })))), { get value() {
    return n.value;
  }, subscribe: (i) => n.subscribe(i) };
}
function dn(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, r = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), r.forEach(((s) => s()));
  };
}
class Wb extends $i {
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
function jb({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: r = 0, barAlign: s }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < r && (a = r, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function Ub({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: r }) {
  return t === "top" ? 0 : t === "bottom" ? r - i : e - n;
}
function Xa(t, e, n) {
  const i = e - t.left, r = n - t.top;
  return [i / t.width, r / t.height];
}
function Ec(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function Ya(t, e) {
  if (!Ec(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function Ja({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, r = Math.floor(i * n);
  return [r - 1, r, r + 1];
}
function Tc(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function Kb(t) {
  const e = Ie({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = En((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = o / a, c = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = En((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), r = () => {
    e.set({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth });
  };
  return t.addEventListener("scroll", r, { passive: !0 }), { scrollData: e, percentages: n, bounds: i, cleanup: () => {
    t.removeEventListener("scroll", r), Tc(e);
  } };
}
class Gb extends $i {
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
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Xa(i, n.clientX, n.clientY);
      this.emit("click", r, s);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [r, s] = Xa(i, n.clientX, n.clientY);
      this.emit("dblclick", r, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Kb(this.scrollContainer);
    const e = dn((() => {
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
      const { threshold: r = 3, mouseButton: s = 0, touchDelay: o = 100 } = i, a = Ie(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (p) => {
        if (p.button !== s || (l.set(p.pointerId, p), l.size > 1)) return;
        let f = p.clientX, h = p.clientY, m = !1;
        const y = Date.now(), C = n.getBoundingClientRect(), { left: _, top: b } = C, g = (T) => {
          if (T.defaultPrevented || l.size > 1 || u && Date.now() - y < o) return;
          const A = T.clientX, D = T.clientY, O = A - f, V = D - h;
          (m || Math.abs(O) > r || Math.abs(V) > r) && (T.preventDefault(), T.stopPropagation(), m || (a.set({ type: "start", x: f - _, y: h - b }), m = !0), a.set({ type: "move", x: A - _, y: D - b, deltaX: O, deltaY: V }), f = A, h = D);
        }, k = (T) => {
          if (l.delete(T.pointerId), m) {
            const A = T.clientX, D = T.clientY;
            a.set({ type: "end", x: A - _, y: D - b });
          }
          c();
        }, E = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || k(T);
        }, x = (T) => {
          m && (T.stopPropagation(), T.preventDefault());
        }, M = (T) => {
          T.defaultPrevented || l.size > 1 || m && T.preventDefault();
        };
        document.addEventListener("pointermove", g), document.addEventListener("pointerup", k), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", M, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", g), document.removeEventListener("pointerup", k), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", M), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), n.removeEventListener("pointerdown", d), l.clear(), Tc(a);
      } };
    })(this.wrapper);
    const e = dn((() => {
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
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (s == null) return u;
      const c = Number(s);
      if (!isNaN(c)) return c;
      if (s === "auto") {
        const d = a || u;
        return o?.every(((p) => !p.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: n, parentHeight: this.parent.clientHeight, numberOfChannels: r, defaultHeight: 128 });
  }
  convertColorValues(e, n) {
    return (function(i, r, s) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = s ?? o.height * r, u = a.createLinearGradient(0, 0, 0, l || r), c = 1 / (i.length - 1);
      return i.forEach(((d, p) => {
        u.addColorStop(p * c, d);
      })), u;
    })(e, this.getPixelRatio(), n?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: p } = (function({ width: h, height: m, length: y, options: C, pixelRatio: _ }) {
      const b = m / 2, g = C.barWidth ? C.barWidth * _ : 1, k = C.barGap ? C.barGap * _ : C.barWidth ? g / 2 : 0, E = g + k || 1;
      return { halfHeight: b, barWidth: g, barGap: k, barRadius: C.barRadius || 0, barMinHeight: C.barMinHeight ? C.barMinHeight * _ : 0, barIndexScale: y > 0 ? h / E / y : 0, barSpacing: E };
    })({ width: s, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: h, barIndexScale: m, barSpacing: y, barWidth: C, halfHeight: _, vScale: b, canvasHeight: g, barAlign: k, barMinHeight: E }) {
      const x = h[0] || [], M = h[1] || x, T = x.length, A = [];
      let D = 0, O = 0, V = 0;
      for (let $ = 0; $ <= T; $++) {
        const K = Math.round($ * m);
        if (K > D) {
          const { topHeight: ee, totalHeight: we } = jb({ maxTop: O, maxBottom: V, halfHeight: _, vScale: b, barMinHeight: E, barAlign: k }), $e = Ub({ barAlign: k, halfHeight: _, topHeight: ee, totalHeight: we, canvasHeight: g });
          A.push({ x: D * y, y: $e, width: C, height: we }), D = K, O = 0, V = 0;
        }
        const se = Math.abs(x[$] || 0), Z = Math.abs(M[$] || 0);
        se > O && (O = se), Z > V && (V = Z);
      }
      return A;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: r, canvasHeight: o, barAlign: n.barAlign, barMinHeight: p });
    i.beginPath();
    for (const h of f) u && "roundRect" in i ? i.roundRect(h.x, h.y, h.width, h.height, u) : i.rect(h.x, h.y, h.width, h.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, n, i, r) {
    const { width: s, height: o } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const p = c / 2, f = l[0] || [];
      return [f, l[1] || f].map(((h, m) => {
        const y = h.length, C = y ? u / y : 0, _ = p, b = m === 0 ? -1 : 1, g = [{ x: 0, y: _ }];
        let k = 0, E = 0;
        for (let x = 0; x <= y; x++) {
          const M = Math.round(x * C);
          if (M > k) {
            const A = _ + (Math.round(E * p * d) || 1) * b;
            g.push({ x: k, y: A }), k = M, E = 0;
          }
          const T = Math.abs(h[x] || 0);
          T > E && (E = T);
        }
        return g.push({ x: k, y: _ }), g;
      }));
    })({ channelData: e, width: s, height: o, vScale: r });
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
    const r = (function({ channelData: s, barHeight: o, normalize: a, maxPeak: l }) {
      var u;
      const c = o || 1;
      if (!a) return c;
      const d = s[0];
      if (!d || d.length === 0) return c;
      let p = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const h = (u = d[f]) !== null && u !== void 0 ? u : 0, m = Math.abs(h);
        m > p && (p = m);
      }
      return p ? c / p : c;
    })({ channelData: e, barHeight: n.barHeight, normalize: n.normalize, maxPeak: n.maxPeak });
    Ec(n) ? this.renderBarWaveform(e, n, i, r) : this.renderLineWaveform(e, n, i, r);
  }
  renderSingleCanvas(e, n, i, r, s, o, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(r * l), u.style.width = `${i}px`, u.style.height = `${r}px`, u.style.left = `${Math.round(s)}px`, o.appendChild(u);
    const c = u.getContext("2d");
    if (n.renderFunction ? (c.fillStyle = this.convertColorValues(n.waveColor, c), n.renderFunction(e, c)) : this.renderWaveform(e, n, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), p = d.getContext("2d");
      p.drawImage(u, 0, 0), p.globalCompositeOperation = "source-in", p.fillStyle = this.convertColorValues(n.progressColor, p), p.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, n, i, r, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: h, totalWidth: m, options: y }) {
      return Ya(Math.min(8e3, h, m), y);
    })({ clientWidth: l, totalWidth: u, options: n });
    let d = {};
    if (c === 0) return;
    const p = (h) => {
      if (h < 0 || h >= f || d[h]) return;
      d[h] = !0;
      const m = h * c;
      let y = Math.min(u - m, c);
      if (y = Ya(y, n), y <= 0) return;
      const C = (function({ channelData: _, offset: b, clampedWidth: g, totalWidth: k }) {
        return _.map(((E) => {
          const x = Math.floor(b / k * E.length), M = Math.floor((b + g) / k * E.length);
          return E.slice(x, M);
        }));
      })({ channelData: e, offset: m, clampedWidth: y, totalWidth: u });
      this.renderSingleCanvas(C, n, y, r, m, s, o);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let h = 0; h < f; h++) p(h);
      return;
    }
    if (Ja({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((h) => p(h))), f > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Ja({ scrollLeft: m, totalWidth: u, numCanvases: f }).forEach(((y) => p(y)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, n, i, r) {
    var { overlay: s } = n, o = (function(c, d) {
      var p = {};
      for (var f in c) Object.prototype.hasOwnProperty.call(c, f) && d.indexOf(f) < 0 && (p[f] = c[f]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var h = 0;
        for (f = Object.getOwnPropertySymbols(c); h < f.length; h++) d.indexOf(f[h]) < 0 && Object.prototype.propertyIsEnumerable.call(c, f[h]) && (p[f[h]] = c[f[h]]);
      }
      return p;
    })(n, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, s && r > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, o, i, l, a, u);
  }
  render(e) {
    return Xe(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), r = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: p, pixelRatio: f }) {
        const h = Math.ceil(u * c), m = h > d, y = !!(p && !m);
        return { scrollWidth: h, isScrollable: m, useParentWidth: y, width: (y ? d : h) * f };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: r, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
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
    const { scrollLeft: i, scrollWidth: r, clientWidth: s } = this.scrollContainer, o = e * r, a = i, l = i + s, u = s / 2;
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
class Xb extends $i {
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
class ys extends $i {
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
const Yb = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ai extends Wb {
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
    const n = e.media || (e.backend === "WebAudio" ? new ys() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Yb, e);
    const { state: i, actions: r } = (function(a) {
      var l, u, c, d, p, f;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : Ie(0), m = (u = a?.duration) !== null && u !== void 0 ? u : Ie(0), y = (c = a?.isPlaying) !== null && c !== void 0 ? c : Ie(!1), C = (d = a?.isSeeking) !== null && d !== void 0 ? d : Ie(!1), _ = (p = a?.volume) !== null && p !== void 0 ? p : Ie(1), b = (f = a?.playbackRate) !== null && f !== void 0 ? f : Ie(1), g = Ie(null), k = Ie(null), E = Ie(""), x = Ie(0), M = Ie(0), T = En((() => !y.value), [y]), A = En((() => g.value !== null), [g]), D = En((() => A.value && m.value > 0), [A, m]), O = En((() => h.value), [h]), V = En((() => m.value > 0 ? h.value / m.value : 0), [h, m]);
      return { state: { currentTime: h, duration: m, isPlaying: y, isPaused: T, isSeeking: C, volume: _, playbackRate: b, audioBuffer: g, peaks: k, url: E, zoom: x, scrollPosition: M, canPlay: A, isReady: D, progress: O, progressPercent: V }, actions: { setCurrentTime: ($) => {
        const K = Math.max(0, Math.min(m.value || 1 / 0, $));
        h.set(K);
      }, setDuration: ($) => {
        m.set(Math.max(0, $));
      }, setPlaying: ($) => {
        y.set($);
      }, setSeeking: ($) => {
        C.set($);
      }, setVolume: ($) => {
        const K = Math.max(0, Math.min(1, $));
        _.set(K);
      }, setPlaybackRate: ($) => {
        const K = Math.max(0.1, Math.min(16, $));
        b.set(K);
      }, setAudioBuffer: ($) => {
        g.set($), $ && m.set($.duration);
      }, setPeaks: ($) => {
        k.set($);
      }, setUrl: ($) => {
        E.set($);
      }, setZoom: ($) => {
        x.set(Math.max(0, $));
      }, setScrollPosition: ($) => {
        M.set(Math.max(0, $));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new Xb();
    const s = n ? void 0 : this.getMediaElement();
    this.renderer = new Gb(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      i.push(dn((() => {
        const o = e.isPlaying.value;
        n.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(dn((() => {
        const o = e.currentTime.value;
        n.emit("timeupdate", o), e.isPlaying.value && n.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(dn((() => {
        e.isSeeking.value && n.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(dn((() => {
        e.isReady.value && !r && (r = !0, n.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(dn((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        s && !o && u && n.emit("finish"), s = o && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(dn((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = ji.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = ji.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
        const l = (c) => this.emit("loading", c);
        n = yield Vb.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (n = new Blob([n], { type: u }));
      }
      this.setSrc(e, n);
      const o = yield new Promise(((a) => {
        const l = r || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !n) {
        const a = this.getMediaElement();
        a instanceof ys && (a.duration = o);
      }
      if (i) this.decodedData = ji.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield ji.decode(a, this.options.sampleRate);
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
      const a = this.decodedData.getChannelData(o), l = [], u = a.length / n;
      for (let c = 0; c < n; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
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
      return n != null && (this.media instanceof ys ? this.media.stopAt(n) : this.stopAtPosition = n), r;
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
}, Ai.dom = Hb;
class Ac {
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
class Jb extends Ac {
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
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [s, o] of Object.entries(r)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Pc(s, o));
  else i === "style" ? Object.assign(n.style, r) : i === "textContent" ? n.textContent = r : n.setAttribute(i, r.toString());
  return n;
}
function ai(t, e, n) {
  const i = Pc(t, e || {});
  return n?.appendChild(i), i;
}
function Oc(t) {
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
  const n = Oc(null), i = (r) => {
    n.set(r);
  };
  return t.addEventListener(e, i), n._cleanup = () => {
    t.removeEventListener(e, i);
  }, n;
}
function Cn(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function tr(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, s = Oc(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, p = c.clientY, f = !1;
    const h = Date.now(), m = t.getBoundingClientRect(), { left: y, top: C } = m, _ = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - h < r) return;
      const M = x.clientX, T = x.clientY, A = M - d, D = T - p;
      (f || Math.abs(A) > n || Math.abs(D) > n) && (x.preventDefault(), x.stopPropagation(), f || (s.set({ type: "start", x: d - y, y: p - C }), f = !0), s.set({ type: "move", x: M - y, y: T - C, deltaX: A, deltaY: D }), d = M, p = T);
    }, b = (x) => {
      if (o.delete(x.pointerId), f) {
        const M = x.clientX, T = x.clientY;
        s.set({ type: "end", x: M - y, y: T - C });
      }
      l();
    }, g = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || b(x);
    }, k = (x) => {
      f && (x.stopPropagation(), x.preventDefault());
    }, E = (x) => {
      x.defaultPrevented || o.size > 1 || f && x.preventDefault();
    };
    document.addEventListener("pointermove", _), document.addEventListener("pointerup", b), document.addEventListener("pointerout", g), document.addEventListener("pointercancel", g), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", b), document.removeEventListener("pointerout", g), document.removeEventListener("pointercancel", g), document.removeEventListener("touchmove", E), setTimeout((() => {
        document.removeEventListener("click", k, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", u), { signal: s, cleanup: () => {
    l(), t.removeEventListener("pointerdown", u), o.clear(), Cn(s);
  } };
}
class Za extends Ac {
  constructor(e, n, i = 0) {
    var r, s, o, a, l, u, c, d, p, f;
    super(), this.totalDuration = n, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (p = e.channelIdx) !== null && p !== void 0 ? p : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
      const u = s.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = er((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
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
    const n = $n(e, "click"), i = $n(e, "mouseenter"), r = $n(e, "mouseleave"), s = $n(e, "dblclick"), o = $n(e, "pointerdown"), a = $n(e, "pointerup"), l = n.subscribe(((y) => y && this.emit("click", y))), u = i.subscribe(((y) => y && this.emit("over", y))), c = r.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), p = o.subscribe(((y) => y && this.toggleCursor(!0))), f = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), p(), f(), Cn(n), Cn(i), Cn(r), Cn(s), Cn(o), Cn(a);
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
class Co extends Jb {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Co(e);
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
    const a = r.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? r.scrollLeft += u : c > s && (r.scrollLeft += c - s);
  }
  virtualAppend(e, n, i) {
    const r = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = n.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > o && u < o + s;
      c && !i.parentElement ? n.appendChild(i) : !c && i.parentElement && i.remove();
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
    const r = this.wavesurfer.getDuration(), s = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Za(e, r, s);
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
    const l = tr(r, { threshold: n }), u = er((() => {
      var c, d;
      const p = l.signal.value;
      if (p) if (p.type === "start") {
        if (o = p.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), h = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const y = p.x / m * f, C = (p.x + 5) / m * f;
        s = new Za(Object.assign(Object.assign({}, e), { start: y, end: C }), f, h), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else p.type === "move" && p.deltaX !== void 0 ? s && s._onUpdate(p.deltaX, p.x > o ? "end" : "start", a) : p.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
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
const bs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Zb(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: r } = t, s = /* @__PURE__ */ fn(null), o = /* @__PURE__ */ fn(null), a = /* @__PURE__ */ L(0), l = /* @__PURE__ */ L(0), u = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(!1), p = /* @__PURE__ */ L(1), f = /* @__PURE__ */ L(1), h = /* @__PURE__ */ L(!1), m = R(() => ki(a.value)), y = R(() => ki(l.value));
  function C($, K) {
    O(), d.value = !0, c.value = !1;
    const se = Co.create();
    o.value = se;
    const Z = Ai.create({
      container: $,
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
      renderFunction: Yp,
      url: K,
      plugins: [se]
    });
    Z.on("ready", () => {
      c.value = !0, d.value = !1, l.value = Z.getDuration(), _();
    }), Z.on("timeupdate", (ee) => {
      a.value = ee;
    }), Z.on("play", () => {
      u.value = !0;
    }), Z.on("pause", () => {
      u.value = !1;
    }), Z.on("finish", () => {
      u.value = !1;
    }), s.value = Z;
  }
  function _() {
    const $ = o.value;
    if ($) {
      $.clearRegions();
      for (const K of i.value) {
        const se = K.speakerId ? r.value.get(K.speakerId) : void 0;
        if (!se || K.startTime == null || K.endTime == null) continue;
        const Z = se.color;
        $.addRegion({
          start: K.startTime,
          end: K.endTime,
          color: Up(Z, 0.25),
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
  function k() {
    s.value?.playPause();
  }
  function E($) {
    const K = s.value;
    !K || l.value === 0 || K.setTime($);
  }
  function x($) {
    E(Math.max(0, Math.min(a.value + $, l.value)));
  }
  function M($) {
    const K = s.value;
    K && (p.value = $, K.setVolume($), $ > 0 && h.value && (h.value = !1, K.setMuted(!1)));
  }
  function T() {
    const $ = s.value;
    $ && (h.value = !h.value, $.setMuted(h.value));
  }
  function A($) {
    const K = s.value;
    K && (f.value = $, K.setPlaybackRate($));
  }
  function D() {
    const K = (bs.indexOf(
      f.value
    ) + 1) % bs.length;
    A(bs[K] ?? 1);
  }
  function O() {
    V !== null && (clearTimeout(V), V = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  he(
    [e, n],
    ([$, K]) => {
      $ && K && C($, K);
    },
    { immediate: !0 }
  );
  let V = null;
  return he([i, r], () => {
    c.value && (V !== null && clearTimeout(V), V = setTimeout(() => {
      V = null, _();
    }, 150));
  }), rn(() => {
    O();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: p,
    playbackRate: f,
    isMuted: h,
    formattedCurrentTime: m,
    formattedDuration: y,
    play: b,
    pause: g,
    togglePlay: k,
    seekTo: E,
    skip: x,
    setVolume: M,
    setPlaybackRate: A,
    cyclePlaybackRate: D,
    toggleMute: T
  };
}
const Qb = { class: "audio-player" }, e0 = /* @__PURE__ */ X({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, r = n, s = /* @__PURE__ */ L(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
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
      toggleMute: k
    } = Zb({
      containerRef: s,
      audioSrc: /* @__PURE__ */ Ki(() => i.audioSrc),
      turns: /* @__PURE__ */ Ki(() => i.turns),
      speakers: /* @__PURE__ */ Ki(() => i.speakers)
    });
    return he(p, (E) => r("timeupdate", E)), he(o, (E) => r("playStateChange", E)), e({ seekTo: y, pause: C }), (E, x) => (P(), Q("footer", Qb, [
      te("div", {
        ref_key: "waveformRef",
        ref: s,
        class: pt(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      H(qb, {
        "is-playing": v(o),
        "current-time": v(f),
        duration: v(h),
        volume: v(u),
        "playback-rate": v(c),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: x[0] || (x[0] = (M) => v(_)(-10)),
        onSkipForward: x[1] || (x[1] = (M) => v(_)(10)),
        "onUpdate:volume": v(b),
        onToggleMute: v(k),
        onCyclePlaybackRate: v(g)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), t0 = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", n0 = /* @__PURE__ */ Pe(e0, [["styles", [t0]], ["__scopeId", "data-v-9248e45e"]]);
class i0 {
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
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, p = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(f[0], n, e, 0, i);
    if (f[0].oldPos + 1 >= l && h + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, n, e));
    let m = -1 / 0, y = 1 / 0;
    const C = () => {
      for (let _ = Math.max(m, -u); _ <= Math.min(y, u); _ += 2) {
        let b;
        const g = f[_ - 1], k = f[_ + 1];
        g && (f[_ - 1] = void 0);
        let E = !1;
        if (k) {
          const M = k.oldPos - _;
          E = k && 0 <= M && M < a;
        }
        const x = g && g.oldPos + 1 < l;
        if (!E && !x) {
          f[_] = void 0;
          continue;
        }
        if (!x || E && g.oldPos < k.oldPos ? b = this.addToPath(k, !0, !1, 0, i) : b = this.addToPath(g, !1, !0, 1, i), h = this.extractCommon(b, n, e, _, i), b.oldPos + 1 >= l && h + 1 >= a)
          return o(this.buildValues(b.lastComponent, n, e)) || !0;
        f[_] = b, b.oldPos + 1 >= l && (y = Math.min(y, _ - 1)), h + 1 >= a && (m = Math.max(m, _ + 1));
      }
      u++;
    };
    if (r)
      (function _() {
        setTimeout(function() {
          if (u > c || Date.now() > p)
            return r(void 0);
          C() || _();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= p; ) {
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
    let l = e.oldPos, u = l - r, c = 0;
    for (; u + 1 < o && l + 1 < a && this.equals(i[l + 1], n[u + 1], s); )
      u++, l++, c++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !s.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, u;
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
    let a = 0, l = 0, u = 0;
    for (; a < o; a++) {
      const c = r[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = n.slice(l, l + c.count);
          d = d.map(function(p, f) {
            const h = i[u + f];
            return h.length > p.length ? h : p;
          }), c.value = this.join(d);
        } else
          c.value = this.join(n.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return r;
  }
}
class r0 extends i0 {
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
const s0 = new r0();
function o0(t, e, n) {
  return s0.diff(t, e, n);
}
function ws({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const r = t.split(" "), s = n.split(" "), o = o0(r, s, {
    comparator: l0
  }), a = a0(o), l = [...e];
  let u = [...e], c = 0;
  for (const f of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      u = nr(
        u,
        l[0],
        f.countAdded - f.countRemoved
      ), c += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const h = f;
      c += h.count, u = nr(
        u,
        l[0],
        -h.count
      );
    } else if ("added" in f && f.added) {
      const h = f;
      u = nr(
        u,
        l[0],
        h.count
      );
    } else
      c += f.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, p = s.slice(d).join(" ");
  if (i(p)) {
    const h = Ic(
      p,
      i
    ).map(
      (m) => m + d
    );
    u = u.concat(h);
  }
  return {
    previousIndexes: u,
    previousText: n
  };
}
function a0(t) {
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
function Ic(t, e) {
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
      Ic(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function l0(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(n.length, i.length);
  let s = 0;
  for (let a = 0; a < r; a++)
    n[a] === i[a] && s++;
  return s / n.length > 0.8;
}
class u0 {
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
class c0 extends u0 {
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
    this.resetAll(), this.currentState = ws(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = ws(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = ws(
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
function Mc(t) {
  const e = yn();
  let n = null;
  Re(() => {
    t.canvasRef.value && (n = new c0(t.canvasRef.value, {
      fontSize: t.fontSize.value,
      lineHeight: t.lineHeight.value
    }));
  }), he([t.fontSize, t.lineHeight], ([l, u]) => {
    n && n.setFontSize(l, u);
  }), he(
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
  function r() {
    n && (n.resetDrawing(), n.resetAll());
  }
  const s = e.on("translation:change", r), o = e.on("translation:sync", r), a = e.on("channel:sync", r);
  vn(() => {
    i(), s(), o(), a(), n?.dispose(), n = null;
  });
}
function Rc(t) {
  const e = /* @__PURE__ */ L(!1);
  let n = null, i = null;
  function r() {
    n && (clearTimeout(n), n = null), i && (clearTimeout(i), i = null);
  }
  function s() {
    !t || !t.display.value || (e.value = !0, t.pinned.value || (i = setTimeout(o, t.duration.value * 1e3)));
  }
  function o() {
    e.value = !1, !(!t || !t.display.value || t.pinned.value) && (n = setTimeout(s, t.frequency.value * 1e3));
  }
  function a() {
    if (r(), !t || !t.display.value) {
      e.value = !1;
      return;
    }
    if (t.pinned.value) {
      e.value = !0;
      return;
    }
    e.value = !1, n = setTimeout(s, t.frequency.value * 1e3);
  }
  return t && he(
    [t.display, t.pinned, t.frequency, t.duration],
    a
  ), Re(a), rn(r), { visible: e };
}
const Qa = /\$(\w+)/g;
function d0(t, e) {
  const n = [];
  let i = 0, r;
  for (Qa.lastIndex = 0; (r = Qa.exec(t)) !== null; ) {
    r.index > i && n.push({ type: "text", value: t.slice(i, r.index) });
    const s = r[1] ?? "", o = s ? e[s] : void 0;
    o ? n.push({ type: "token", src: o.src, alt: o.alt ?? s }) : n.push({ type: "text", value: r[0] }), i = r.index + r[0].length;
  }
  return i < t.length && n.push({ type: "text", value: t.slice(i) }), n;
}
const f0 = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, p0 = ["src", "alt"], h0 = { key: 1 }, v0 = /* @__PURE__ */ X({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(t) {
    const n = yn().subtitle?.watermark, i = R(() => n ? d0(n.content.value, n.tokens.value) : []);
    return (r, s) => (P(), j(ao, { name: "watermark" }, {
      default: N(() => [
        t.visible && v(n) ? (P(), Q("div", f0, [
          (P(!0), Q(Se, null, mn(i.value, (o, a) => (P(), Q(Se, { key: a }, [
            o.type === "token" ? (P(), Q("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, p0)) : (P(), Q("span", h0, fe(o.value), 1))
          ], 64))), 128))
        ])) : ce("", !0)
      ]),
      _: 1
    }));
  }
}), m0 = ".watermark[data-v-cde9acb9]{position:absolute;right:var(--spacing-md, 16px);bottom:var(--spacing-md, 16px);display:inline-flex;align-items:center;gap:.25em;font-size:1.2rem;color:var(--color-white, #fff);pointer-events:none;line-height:1}.watermark__img[data-v-cde9acb9]{height:1em;vertical-align:middle}.watermark-enter-active[data-v-cde9acb9],.watermark-leave-active[data-v-cde9acb9]{transition:opacity .4s ease,transform .4s ease}.watermark-enter-from[data-v-cde9acb9],.watermark-leave-to[data-v-cde9acb9]{opacity:0;transform:translate(6px,6px)}@media(prefers-reduced-motion:reduce){.watermark-enter-active[data-v-cde9acb9],.watermark-leave-active[data-v-cde9acb9]{transition:opacity .01s;transform:none}}", Lc = /* @__PURE__ */ Pe(v0, [["styles", [m0]], ["__scopeId", "data-v-cde9acb9"]]), g0 = ["height"], y0 = /* @__PURE__ */ X({
  __name: "SubtitleBanner",
  setup(t) {
    const e = yn(), n = _i("canvas"), i = R(() => e.subtitle?.fontSize.value ?? 40), r = R(() => 1.2 * i.value), s = R(() => 2.4 * i.value);
    Mc({
      canvasRef: n,
      fontSize: i,
      lineHeight: r
    });
    const { visible: o } = Rc(
      e.subtitle?.watermark
    );
    return (a, l) => (P(), Q("div", {
      class: "subtitle-banner",
      style: Ct({ height: s.value + "px" })
    }, [
      te("canvas", {
        ref: "canvas",
        class: pt(["subtitle-canvas", { "subtitle-canvas--shrunk": v(o) }]),
        height: s.value
      }, null, 10, g0),
      H(Lc, { visible: v(o) }, null, 8, ["visible"])
    ], 4));
  }
}), b0 = ".subtitle-banner[data-v-36f4501a]{position:relative;flex-shrink:0;background-color:var(--color-black);overflow:hidden}.subtitle-canvas[data-v-36f4501a]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:top center}.subtitle-canvas--shrunk[data-v-36f4501a]{transform:scale(.8) translateY(-8%)}@media(prefers-reduced-motion:reduce){.subtitle-canvas[data-v-36f4501a]{transition:none}}", w0 = /* @__PURE__ */ Pe(y0, [["styles", [b0]], ["__scopeId", "data-v-36f4501a"]]), _0 = {
  ref: "container",
  class: "subtitle-fullscreen"
}, x0 = ["aria-label"], S0 = /* @__PURE__ */ X({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = yn(), { t: n } = vt(), i = _i("container"), r = _i("canvas"), s = R(() => e.subtitle?.fontSize.value ?? 48), o = R(() => 1.2 * s.value);
    Mc({
      canvasRef: r,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = Rc(
      e.subtitle?.watermark
    );
    Re(async () => {
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
    Re(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function u() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return vn(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, d) => (P(), Q("div", _0, [
      te("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(n)("subtitle.exitFullscreen"),
        onClick: u
      }, [
        H(v(uo), { size: 24 })
      ], 8, x0),
      te("canvas", {
        ref: "canvas",
        class: pt(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": v(a) }])
      }, null, 2),
      H(Lc, { visible: v(a) }, null, 8, ["visible"])
    ], 512));
  }
}), C0 = ".subtitle-fullscreen[data-v-f31885e0]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-f31885e0]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-f31885e0]:hover,.subtitle-fullscreen__close[data-v-f31885e0]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-f31885e0]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:center}.subtitle-fullscreen__canvas--shrunk[data-v-f31885e0]{transform:scale(.85) translateY(-4%)}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-f31885e0],.subtitle-fullscreen__canvas[data-v-f31885e0]{transition:none}}", k0 = /* @__PURE__ */ Pe(S0, [["styles", [C0]], ["__scopeId", "data-v-f31885e0"]]), E0 = /* @__PURE__ */ X({
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
    const n = t, i = /* @__PURE__ */ L(!1);
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
    const o = R(() => i.value ? "check" : n.icon), a = R(() => Pu[n.size ?? "sm"]);
    return (l, u) => (P(), j(ft, {
      variant: t.variant,
      size: t.size,
      disabled: t.disabled,
      block: t.block,
      "aria-label": t.ariaLabel,
      class: pt({ "copy-btn--copied": i.value }),
      onClick: s
    }, {
      icon: N(() => [
        H(ao, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: N(() => [
            (P(), j(Zi, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: N(() => [
        ie(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), T0 = ".copy-btn--copied[data-v-eed7503d]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-eed7503d],.copy-icon-leave-to[data-v-eed7503d]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:none}}", el = /* @__PURE__ */ Pe(E0, [["styles", [T0]], ["__scopeId", "data-v-eed7503d"]]), A0 = ["aria-label"], P0 = { class: "selection-count" }, O0 = { class: "selection-actions" }, I0 = /* @__PURE__ */ X({
  __name: "SelectionActionBar",
  setup(t) {
    const e = wc(), { t: n } = vt();
    return (i, r) => v(e).hasSelection.value ? (P(), Q("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": v(n)("selection.count")
    }, [
      te("span", P0, fe(v(e).count.value) + " " + fe(v(n)("selection.count")), 1),
      te("div", O0, [
        H(el, {
          icon: "clipboard-type",
          "copy-fn": v(e).copyText,
          variant: "secondary"
        }, {
          default: N(() => [
            De(fe(v(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(el, {
          icon: "clipboard-list",
          "copy-fn": v(e).copyWithMetadata
        }, {
          default: N(() => [
            De(fe(v(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        H(ft, {
          variant: "transparent",
          icon: "x",
          onClick: r[0] || (r[0] = (s) => v(e).clear())
        }, {
          default: N(() => [
            De(fe(v(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, A0)) : ce("", !0);
  }
}), M0 = ".selection-bar[data-v-7569d6ad]{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-7569d6ad var(--transition-duration) ease}.selection-count[data-v-7569d6ad]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-7569d6ad]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-7569d6ad{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-7569d6ad]{animation:none}}@media(max-width:767px){.selection-bar[data-v-7569d6ad]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", R0 = /* @__PURE__ */ Pe(I0, [["styles", [M0]], ["__scopeId", "data-v-7569d6ad"]]), L0 = { class: "editor-layout" }, D0 = { class: "editor-body" }, $0 = {
  key: 4,
  class: "mobile-selectors"
}, B0 = /* @__PURE__ */ X({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = yn(), { isMobile: i } = _c(), r = /* @__PURE__ */ L(!1), s = R(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), o = n.speakers.all;
    xy(s, o, n);
    const a = R(() => [...n.channels.values()]), l = R(() => [
      ...n.activeChannel.value.translations.values()
    ]), u = R(
      () => n.activeChannel.value.activeTranslation.value.id
    ), c = R(() => Array.from(o.values())), d = _i("audioPlayer");
    function p(m) {
      n.audio && (n.audio.currentTime.value = m);
    }
    he(
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
    return (m, y) => (P(), Q("div", L0, [
      e.showHeader ? (P(), j(oh, {
        key: 0,
        title: v(n).title.value,
        duration: v(n).activeChannel.value.duration,
        language: u.value,
        "is-mobile": v(i),
        onToggleSidebar: y[0] || (y[0] = (C) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : ce("", !0),
      H(R0),
      te("main", D0, [
        H(Wy, {
          turns: s.value,
          speakers: v(o)
        }, null, 8, ["turns", "speakers"]),
        v(i) ? ce("", !0) : (P(), j(Ka, {
          key: 0,
          speakers: c.value,
          channels: a.value,
          "selected-channel-id": v(n).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": h
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(i) ? (P(), j(Ib, {
          key: 1,
          open: r.value,
          "onUpdate:open": y[1] || (y[1] = (C) => r.value = C)
        }, {
          default: N(() => [
            H(Ka, {
              speakers: c.value,
              channels: a.value,
              "selected-channel-id": v(n).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": u.value,
              "onUpdate:selectedChannelId": f,
              "onUpdate:selectedTranslationId": h
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : ce("", !0)
      ]),
      v(n).audio?.src.value ? (P(), j(n0, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(n).audio.src.value,
        turns: s.value,
        speakers: v(o),
        onTimeupdate: p,
        onPlayStateChange: y[2] || (y[2] = (C) => {
          v(n).audio && (v(n).audio.isPlaying.value = C);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : ce("", !0),
      v(n).subtitle?.isVisible.value && !v(i) && !v(n).subtitle.isFullscreen.value ? (P(), j(w0, { key: 2 })) : ce("", !0),
      v(n).subtitle?.isFullscreen.value ? (P(), j(k0, { key: 3 })) : ce("", !0),
      v(i) && (a.value.length > 1 || l.value.length > 1) ? (P(), Q("div", $0, [
        a.value.length > 1 ? (P(), j(Sc, {
          key: 0,
          channels: a.value,
          "selected-channel-id": v(n).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : ce("", !0),
        l.value.length > 1 ? (P(), j(Cc, {
          key: 1,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": h
        }, null, 8, ["translations", "selected-translation-id"])) : ce("", !0)
      ])) : ce("", !0)
    ]));
  }
}), F0 = ".editor-layout[data-v-a7c5f0fd]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-a7c5f0fd]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-a7c5f0fd]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.mobile-selectors[data-v-a7c5f0fd]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-a7c5f0fd]{grid-template-columns:1fr}}", z0 = /* @__PURE__ */ Pe(B0, [["styles", [F0]], ["__scopeId", "data-v-a7c5f0fd"]]), N0 = /* @__PURE__ */ X({
  __name: "WebComponent",
  props: {
    locale: { default: "fr", type: String },
    noHeader: { type: Boolean, default: !1 }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ L(n.locale);
    jp(i), he(
      () => n.locale,
      (s) => {
        i.value = s;
      }
    );
    const r = wy();
    return _y(r), e({ editor: r }), (s, o) => v(r)?.channels?.size ? (P(), j(z0, {
      key: 0,
      "show-header": !n.noHeader
    }, null, 8, ["show-header"])) : ce("", !0);
  }
}), q0 = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--color-danger: #e53935;--color-danger-hover: #c62828;--color-danger-soft: #fdecea;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}.sidebar-select{position:relative}.sidebar-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;width:100%;padding:var(--spacing-sm);font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary);background:none;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;gap:var(--spacing-xs);white-space:nowrap;font-family:inherit}.sidebar-select-trigger:hover{background-color:var(--color-surface-hover)}.sidebar-select-trigger-label{overflow:hidden;text-overflow:ellipsis}.sidebar-select-content{background-color:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);z-index:var(--z-dropdown);min-width:var(--reka-select-trigger-width);overflow-y:auto;max-height:var(--reka-select-content-available-height);padding:var(--spacing-xs) 0;position:absolute}.sidebar-select-item{display:flex;align-items:center;padding:var(--spacing-sm) var(--spacing-md);padding-left:calc(var(--spacing-md) + 20px);font-size:var(--font-size-sm);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none;transition:background-color var(--transition-duration)}.sidebar-select-item:hover,.sidebar-select-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sidebar-select-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}.sheet-content{position:fixed;bottom:0;left:0;right:0;max-height:50vh;z-index:var(--z-drawer);border-radius:var(--radius-lg) var(--radius-lg) 0 0;background-color:var(--color-surface);box-shadow:var(--shadow-md);overflow-y:auto;animation:sheet-slide-up .25s ease;display:flex;flex-direction:column}.sheet-handle{width:32px;height:4px;border-radius:2px;background-color:var(--color-border);margin:var(--spacing-sm) auto;flex-shrink:0}.sheet-filter{position:sticky;top:0;padding:var(--spacing-sm) var(--spacing-md);border:none;border-bottom:1px solid var(--color-border);background-color:var(--color-surface);font-size:var(--font-size-sm);font-family:inherit;color:var(--color-text-primary);outline:none;width:100%;z-index:1}.sheet-filter::placeholder{color:var(--color-text-muted)}.sheet-list{overflow-y:auto;padding:var(--spacing-xs) 0}.sheet-item{display:flex;align-items:center;min-height:48px;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 24px);font-size:var(--font-size-base);color:var(--color-text-primary);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.sheet-item:hover,.sheet-item[data-highlighted]{background-color:var(--color-surface-hover);outline:none}.sheet-item-indicator{position:absolute;left:var(--spacing-md);display:inline-flex;align-items:center;color:var(--color-primary)}@keyframes sheet-slide-up{0%{translate:0 100%}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.sheet-content{animation:none}}', H0 = /* @__PURE__ */ Pe(N0, [["styles", [q0]]]);
function tl(t) {
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
function _s(t, e) {
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
function K0() {
  return {
    name: "live",
    install(t) {
      const e = /* @__PURE__ */ fn(null), n = /* @__PURE__ */ L(!1);
      n.value = !0;
      function i() {
        e.value = null;
      }
      function r(b, g) {
        if (t.activeChannelId.value !== g) return;
        const k = t.activeChannel.value.activeTranslation.value;
        if (k.isSource) {
          if (b.text == null) return;
          e.value = b.text;
        } else if (b.translations) {
          const E = b.translations.find(
            (x) => x.translationId === k.id
          );
          e.value = E?.text ?? null;
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
      function u(b, g) {
        b.speakerId && t.speakers.ensure(b.speakerId);
        const k = t.channels.get(g);
        if (!k) {
          p();
          return;
        }
        if (b.text != null && l(
          k.sourceTranslation,
          tl(b)
        ), b.translations)
          for (const x of b.translations) {
            const M = k.translations.get(x.translationId);
            M && l(
              M,
              _s(b, x)
            );
          }
        t.activeChannel.value.activeTranslation.value.isSource && p();
      }
      function c(b, g) {
        d([b], g);
      }
      function d(b, g) {
        const k = t.channels.get(g);
        if (!k) return;
        const E = /* @__PURE__ */ new Set();
        for (const T of b)
          T.speakerId && !E.has(T.speakerId) && (E.add(T.speakerId), t.speakers.ensure(T.speakerId));
        const x = [];
        for (const T of b)
          T.text != null && x.push(tl(T));
        x.length > 0 && k.sourceTranslation.prependTurns(x);
        const M = /* @__PURE__ */ new Map();
        for (const T of b)
          if (T.translations)
            for (const A of T.translations) {
              let D = M.get(A.translationId);
              D || (D = [], M.set(A.translationId, D)), D.push(_s(T, A));
            }
        for (const [T, A] of M) {
          const D = k.translations.get(T);
          D && D.prependTurns(A);
        }
      }
      function p() {
        a(), i();
      }
      function f(b) {
        const g = t.activeChannel.value.activeTranslation.value, k = t.activeChannel.value;
        if (!b.final && g.languages.includes(b.language))
          e.value = b.text;
        else if (b.final) {
          const E = k.translations.get(b.language);
          if (E) {
            const x = _s(
              { ...b },
              b
            );
            E === g ? l(E, x) : E.updateOrCreateTurnSilent(x);
          }
          g.languages.includes(b.language) && p();
        }
      }
      const h = {
        partial: e,
        hasLiveUpdate: n,
        onPartial: r,
        onFinal: u,
        prependFinal: c,
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
function G0() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ L(0), n = /* @__PURE__ */ L(!1);
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
function X0(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ L(t.fontSize ?? 40), i = /* @__PURE__ */ L(!0), r = /* @__PURE__ */ L(!1);
      let s;
      const o = [];
      if (t.watermark) {
        const l = t.watermark;
        s = {
          display: /* @__PURE__ */ L(l.display ?? !1),
          pinned: /* @__PURE__ */ L(l.pinned ?? !1),
          content: /* @__PURE__ */ L(l.content ?? ""),
          frequency: /* @__PURE__ */ L(l.frequency ?? 30),
          duration: /* @__PURE__ */ L(l.duration ?? 5),
          tokens: /* @__PURE__ */ L(l.tokens ?? {}),
          readonly: l.readonly ?? !1
        }, o.push(
          he(
            s.display,
            (u) => e.emit("watermark:display", { display: u })
          ),
          he(
            s.pinned,
            (u) => e.emit("watermark:pin", { pinned: u })
          )
        );
      }
      const a = {
        fontSize: n,
        isVisible: i,
        isFullscreen: r,
        enterFullscreen() {
          r.value = !0;
        },
        exitFullscreen() {
          r.value = !1;
        },
        watermark: s
      };
      return e.subtitle = a, () => {
        i.value = !1, r.value = !1, o.forEach((l) => l()), e.subtitle = void 0;
      };
    }
  };
}
const V0 = /* @__PURE__ */ sp(H0);
function W0() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = hp, document.head.appendChild(e);
}
function Y0(t = "linto-editor") {
  W0(), customElements.define(t, V0);
}
export {
  V0 as LintoEditor,
  G0 as createAudioPlugin,
  K0 as createLivePlugin,
  X0 as createSubtitlePlugin,
  Y0 as register
};
