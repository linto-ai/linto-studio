// @__NO_SIDE_EFFECTS__
function js(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const fe = {}, an = [], gt = () => {
}, Lo = () => !1, Oi = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Hs = (t) => t.startsWith("onUpdate:"), Se = Object.assign, Ws = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Dl = Object.prototype.hasOwnProperty, he = (t, e) => Dl.call(t, e), Z = Array.isArray, ln = (t) => Un(t) === "[object Map]", Ro = (t) => Un(t) === "[object Set]", gr = (t) => Un(t) === "[object Date]", ne = (t) => typeof t == "function", we = (t) => typeof t == "string", ot = (t) => typeof t == "symbol", pe = (t) => t !== null && typeof t == "object", Do = (t) => (pe(t) || ne(t)) && ne(t.then) && ne(t.catch), $o = Object.prototype.toString, Un = (t) => $o.call(t), $l = (t) => Un(t).slice(8, -1), Li = (t) => Un(t) === "[object Object]", Ri = (t) => we(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Pn = /* @__PURE__ */ js(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Di = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return ((n) => e[n] || (e[n] = t(n)));
}, Fl = /-\w/g, Pe = Di(
  (t) => t.replace(Fl, (e) => e.slice(1).toUpperCase())
), zl = /\B([A-Z])/g, Ue = Di(
  (t) => t.replace(zl, "-$1").toLowerCase()
), $i = Di((t) => t.charAt(0).toUpperCase() + t.slice(1)), ci = Di(
  (t) => t ? `on${$i(t)}` : ""
), Fe = (t, e) => !Object.is(t, e), Yi = (t, ...e) => {
  for (let n = 0; n < t.length; n++)
    t[n](...e);
}, Fo = (t, e, n, i = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, Bl = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, _s = (t) => {
  const e = we(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let br;
const Fi = () => br || (br = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ot(t) {
  if (Z(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const i = t[n], s = we(i) ? Wl(i) : Ot(i);
      if (s)
        for (const r in s)
          e[r] = s[r];
    }
    return e;
  } else if (we(t) || pe(t))
    return t;
}
const Nl = /;(?![^(]*\))/g, jl = /:([^]+)/, Hl = /\/\*[^]*?\*\//g;
function Wl(t) {
  const e = {};
  return t.replace(Hl, "").split(Nl).forEach((n) => {
    if (n) {
      const i = n.split(jl);
      i.length > 1 && (e[i[0].trim()] = i[1].trim());
    }
  }), e;
}
function Je(t) {
  let e = "";
  if (we(t))
    e = t;
  else if (Z(t))
    for (let n = 0; n < t.length; n++) {
      const i = Je(t[n]);
      i && (e += i + " ");
    }
  else if (pe(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
function Vl(t) {
  if (!t) return null;
  let { class: e, style: n } = t;
  return e && !we(e) && (t.class = Je(e)), n && (t.style = Ot(n)), t;
}
const ql = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ul = /* @__PURE__ */ js(ql);
function zo(t) {
  return !!t || t === "";
}
function Kl(t, e) {
  if (t.length !== e.length) return !1;
  let n = !0;
  for (let i = 0; n && i < t.length; i++)
    n = Vs(t[i], e[i]);
  return n;
}
function Vs(t, e) {
  if (t === e) return !0;
  let n = gr(t), i = gr(e);
  if (n || i)
    return n && i ? t.getTime() === e.getTime() : !1;
  if (n = ot(t), i = ot(e), n || i)
    return t === e;
  if (n = Z(t), i = Z(e), n || i)
    return n && i ? Kl(t, e) : !1;
  if (n = pe(t), i = pe(e), n || i) {
    if (!n || !i)
      return !1;
    const s = Object.keys(t).length, r = Object.keys(e).length;
    if (s !== r)
      return !1;
    for (const o in t) {
      const a = t.hasOwnProperty(o), l = e.hasOwnProperty(o);
      if (a && !l || !a && l || !Vs(t[o], e[o]))
        return !1;
    }
  }
  return String(t) === String(e);
}
const Bo = (t) => !!(t && t.__v_isRef === !0), re = (t) => we(t) ? t : t == null ? "" : Z(t) || pe(t) && (t.toString === $o || !ne(t.toString)) ? Bo(t) ? re(t.value) : JSON.stringify(t, No, 2) : String(t), No = (t, e) => Bo(e) ? No(t, e.value) : ln(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [i, s], r) => (n[Ji(i, r) + " =>"] = s, n),
    {}
  )
} : Ro(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Ji(n))
} : ot(e) ? Ji(e) : pe(e) && !Z(e) && !Li(e) ? String(e) : e, Ji = (t, e = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ot(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t
  );
};
let Le;
class jo {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = Le, !e && Le && (this.index = (Le.scopes || (Le.scopes = [])).push(
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
      const n = Le;
      try {
        return Le = this, e();
      } finally {
        Le = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Le, Le = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Le = this.prevScope, this.prevScope = void 0);
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
function Ho(t) {
  return new jo(t);
}
function Wo() {
  return Le;
}
function Gl(t, e = !1) {
  Le && Le.cleanups.push(t);
}
let be;
const Zi = /* @__PURE__ */ new WeakSet();
class Vo {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Le && Le.active && Le.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Zi.has(this) && (Zi.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Uo(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, yr(this), Ko(this);
    const e = be, n = st;
    be = this, st = !0;
    try {
      return this.fn();
    } finally {
      Go(this), be = e, st = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ks(e);
      this.deps = this.depsTail = void 0, yr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Zi.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ws(this) && this.run();
  }
  get dirty() {
    return ws(this);
  }
}
let qo = 0, Mn, In;
function Uo(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = In, In = t;
    return;
  }
  t.next = Mn, Mn = t;
}
function qs() {
  qo++;
}
function Us() {
  if (--qo > 0)
    return;
  if (In) {
    let e = In;
    for (In = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; Mn; ) {
    let e = Mn;
    for (Mn = void 0; e; ) {
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
function Ko(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function Go(t) {
  let e, n = t.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), Ks(i), Xl(i)) : e = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  t.deps = e, t.depsTail = n;
}
function ws(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (Xo(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function Xo(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === $n) || (t.globalVersion = $n, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !ws(t))))
    return;
  t.flags |= 2;
  const e = t.dep, n = be, i = st;
  be = t, st = !0;
  try {
    Ko(t);
    const s = t.fn(t._value);
    (e.version === 0 || Fe(s, t._value)) && (t.flags |= 128, t._value = s, e.version++);
  } catch (s) {
    throw e.version++, s;
  } finally {
    be = n, st = i, Go(t), t.flags &= -3;
  }
}
function Ks(t, e = !1) {
  const { dep: n, prevSub: i, nextSub: s } = t;
  if (i && (i.nextSub = s, t.prevSub = void 0), s && (s.prevSub = i, t.nextSub = void 0), n.subs === t && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Ks(r, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function Xl(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
let st = !0;
const Yo = [];
function At() {
  Yo.push(st), st = !1;
}
function Pt() {
  const t = Yo.pop();
  st = t === void 0 ? !0 : t;
}
function yr(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = be;
    be = void 0;
    try {
      e();
    } finally {
      be = n;
    }
  }
}
let $n = 0;
class Yl {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class zi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(e) {
    if (!be || !st || be === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== be)
      n = this.activeLink = new Yl(be, this), be.deps ? (n.prevDep = be.depsTail, be.depsTail.nextDep = n, be.depsTail = n) : be.deps = be.depsTail = n, Jo(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = be.depsTail, n.nextDep = void 0, be.depsTail.nextDep = n, be.depsTail = n, be.deps === n && (be.deps = i);
    }
    return n;
  }
  trigger(e) {
    this.version++, $n++, this.notify(e);
  }
  notify(e) {
    qs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Us();
    }
  }
}
function Jo(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let i = e.deps; i; i = i.nextDep)
        Jo(i);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), t.dep.subs = t;
  }
}
const yi = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ Symbol(
  ""
), xs = /* @__PURE__ */ Symbol(
  ""
), Fn = /* @__PURE__ */ Symbol(
  ""
);
function Re(t, e, n) {
  if (st && be) {
    let i = yi.get(t);
    i || yi.set(t, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new zi()), s.map = i, s.key = n), s.track();
  }
}
function Ct(t, e, n, i, s, r) {
  const o = yi.get(t);
  if (!o) {
    $n++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (qs(), e === "clear")
    o.forEach(a);
  else {
    const l = Z(t), u = l && Ri(n);
    if (l && n === "length") {
      const c = Number(i);
      o.forEach((d, h) => {
        (h === "length" || h === Fn || !ot(h) && h >= c) && a(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), u && a(o.get(Fn)), e) {
        case "add":
          l ? u && a(o.get("length")) : (a(o.get(Zt)), ln(t) && a(o.get(xs)));
          break;
        case "delete":
          l || (a(o.get(Zt)), ln(t) && a(o.get(xs)));
          break;
        case "set":
          ln(t) && a(o.get(Zt));
          break;
      }
  }
  Us();
}
function Jl(t, e) {
  const n = yi.get(t);
  return n && n.get(e);
}
function nn(t) {
  const e = /* @__PURE__ */ de(t);
  return e === t ? e : (Re(e, "iterate", Fn), /* @__PURE__ */ Xe(t) ? e : e.map(at));
}
function Bi(t) {
  return Re(t = /* @__PURE__ */ de(t), "iterate", Fn), t;
}
function Ft(t, e) {
  return /* @__PURE__ */ Mt(t) ? fn(/* @__PURE__ */ Qt(t) ? at(e) : e) : at(e);
}
const Zl = {
  __proto__: null,
  [Symbol.iterator]() {
    return Qi(this, Symbol.iterator, (t) => Ft(this, t));
  },
  concat(...t) {
    return nn(this).concat(
      ...t.map((e) => Z(e) ? nn(e) : e)
    );
  },
  entries() {
    return Qi(this, "entries", (t) => (t[1] = Ft(this, t[1]), t));
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
    return es(this, "includes", t);
  },
  indexOf(...t) {
    return es(this, "indexOf", t);
  },
  join(t) {
    return nn(this).join(t);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...t) {
    return es(this, "lastIndexOf", t);
  },
  map(t, e) {
    return wt(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return xn(this, "pop");
  },
  push(...t) {
    return xn(this, "push", t);
  },
  reduce(t, ...e) {
    return _r(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return _r(this, "reduceRight", t, e);
  },
  shift() {
    return xn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return wt(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return xn(this, "splice", t);
  },
  toReversed() {
    return nn(this).toReversed();
  },
  toSorted(t) {
    return nn(this).toSorted(t);
  },
  toSpliced(...t) {
    return nn(this).toSpliced(...t);
  },
  unshift(...t) {
    return xn(this, "unshift", t);
  },
  values() {
    return Qi(this, "values", (t) => Ft(this, t));
  }
};
function Qi(t, e, n) {
  const i = Bi(t), s = i[e]();
  return i !== t && !/* @__PURE__ */ Xe(t) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.done || (r.value = n(r.value)), r;
  }), s;
}
const Ql = Array.prototype;
function wt(t, e, n, i, s, r) {
  const o = Bi(t), a = o !== t && !/* @__PURE__ */ Xe(t), l = o[e];
  if (l !== Ql[e]) {
    const d = l.apply(t, r);
    return a ? at(d) : d;
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
function _r(t, e, n, i) {
  const s = Bi(t);
  let r = n;
  return s !== t && (/* @__PURE__ */ Xe(t) ? n.length > 3 && (r = function(o, a, l) {
    return n.call(this, o, a, l, t);
  }) : r = function(o, a, l) {
    return n.call(this, o, Ft(t, a), l, t);
  }), s[e](r, ...i);
}
function es(t, e, n) {
  const i = /* @__PURE__ */ de(t);
  Re(i, "iterate", Fn);
  const s = i[e](...n);
  return (s === -1 || s === !1) && /* @__PURE__ */ Ni(n[0]) ? (n[0] = /* @__PURE__ */ de(n[0]), i[e](...n)) : s;
}
function xn(t, e, n = []) {
  At(), qs();
  const i = (/* @__PURE__ */ de(t))[e].apply(t, n);
  return Us(), Pt(), i;
}
const ec = /* @__PURE__ */ js("__proto__,__v_isRef,__isVue"), Zo = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(ot)
);
function tc(t) {
  ot(t) || (t = String(t));
  const e = /* @__PURE__ */ de(this);
  return Re(e, "has", t), e.hasOwnProperty(t);
}
class Qo {
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
      return i === (s ? r ? dc : ia : r ? na : ta).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(i) ? e : void 0;
    const o = Z(e);
    if (!s) {
      let l;
      if (o && (l = Zl[n]))
        return l;
      if (n === "hasOwnProperty")
        return tc;
    }
    const a = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ce(e) ? e : i
    );
    if ((ot(n) ? Zo.has(n) : ec(n)) || (s || Re(e, "get", n), r))
      return a;
    if (/* @__PURE__ */ Ce(a)) {
      const l = o && Ri(n) ? a : a.value;
      return s && pe(l) ? /* @__PURE__ */ ks(l) : l;
    }
    return pe(a) ? s ? /* @__PURE__ */ ks(a) : /* @__PURE__ */ Kn(a) : a;
  }
}
class ea extends Qo {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, i, s) {
    let r = e[n];
    const o = Z(e) && Ri(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ Mt(r);
      if (!/* @__PURE__ */ Xe(i) && !/* @__PURE__ */ Mt(i) && (r = /* @__PURE__ */ de(r), i = /* @__PURE__ */ de(i)), !o && /* @__PURE__ */ Ce(r) && !/* @__PURE__ */ Ce(i))
        return u || (r.value = i), !0;
    }
    const a = o ? Number(n) < e.length : he(e, n), l = Reflect.set(
      e,
      n,
      i,
      /* @__PURE__ */ Ce(e) ? e : s
    );
    return e === /* @__PURE__ */ de(s) && (a ? Fe(i, r) && Ct(e, "set", n, i) : Ct(e, "add", n, i)), l;
  }
  deleteProperty(e, n) {
    const i = he(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && i && Ct(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const i = Reflect.has(e, n);
    return (!ot(n) || !Zo.has(n)) && Re(e, "has", n), i;
  }
  ownKeys(e) {
    return Re(
      e,
      "iterate",
      Z(e) ? "length" : Zt
    ), Reflect.ownKeys(e);
  }
}
class nc extends Qo {
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
const ic = /* @__PURE__ */ new ea(), sc = /* @__PURE__ */ new nc(), rc = /* @__PURE__ */ new ea(!0);
const Ss = (t) => t, ei = (t) => Reflect.getPrototypeOf(t);
function oc(t, e, n) {
  return function(...i) {
    const s = this.__v_raw, r = /* @__PURE__ */ de(s), o = ln(r), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, u = s[t](...i), c = n ? Ss : e ? fn : at;
    return !e && Re(
      r,
      "iterate",
      l ? xs : Zt
    ), Se(
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
function ti(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function ac(t, e) {
  const n = {
    get(s) {
      const r = this.__v_raw, o = /* @__PURE__ */ de(r), a = /* @__PURE__ */ de(s);
      t || (Fe(s, a) && Re(o, "get", s), Re(o, "get", a));
      const { has: l } = ei(o), u = e ? Ss : t ? fn : at;
      if (l.call(o, s))
        return u(r.get(s));
      if (l.call(o, a))
        return u(r.get(a));
      r !== o && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !t && Re(/* @__PURE__ */ de(s), "iterate", Zt), s.size;
    },
    has(s) {
      const r = this.__v_raw, o = /* @__PURE__ */ de(r), a = /* @__PURE__ */ de(s);
      return t || (Fe(s, a) && Re(o, "has", s), Re(o, "has", a)), s === a ? r.has(s) : r.has(s) || r.has(a);
    },
    forEach(s, r) {
      const o = this, a = o.__v_raw, l = /* @__PURE__ */ de(a), u = e ? Ss : t ? fn : at;
      return !t && Re(l, "iterate", Zt), a.forEach((c, d) => s.call(r, u(c), u(d), o));
    }
  };
  return Se(
    n,
    t ? {
      add: ti("add"),
      set: ti("set"),
      delete: ti("delete"),
      clear: ti("clear")
    } : {
      add(s) {
        !e && !/* @__PURE__ */ Xe(s) && !/* @__PURE__ */ Mt(s) && (s = /* @__PURE__ */ de(s));
        const r = /* @__PURE__ */ de(this);
        return ei(r).has.call(r, s) || (r.add(s), Ct(r, "add", s, s)), this;
      },
      set(s, r) {
        !e && !/* @__PURE__ */ Xe(r) && !/* @__PURE__ */ Mt(r) && (r = /* @__PURE__ */ de(r));
        const o = /* @__PURE__ */ de(this), { has: a, get: l } = ei(o);
        let u = a.call(o, s);
        u || (s = /* @__PURE__ */ de(s), u = a.call(o, s));
        const c = l.call(o, s);
        return o.set(s, r), u ? Fe(r, c) && Ct(o, "set", s, r) : Ct(o, "add", s, r), this;
      },
      delete(s) {
        const r = /* @__PURE__ */ de(this), { has: o, get: a } = ei(r);
        let l = o.call(r, s);
        l || (s = /* @__PURE__ */ de(s), l = o.call(r, s)), a && a.call(r, s);
        const u = r.delete(s);
        return l && Ct(r, "delete", s, void 0), u;
      },
      clear() {
        const s = /* @__PURE__ */ de(this), r = s.size !== 0, o = s.clear();
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
    n[s] = oc(s, t, e);
  }), n;
}
function Gs(t, e) {
  const n = ac(t, e);
  return (i, s, r) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? i : Reflect.get(
    he(n, s) && s in i ? n : i,
    s,
    r
  );
}
const lc = {
  get: /* @__PURE__ */ Gs(!1, !1)
}, cc = {
  get: /* @__PURE__ */ Gs(!1, !0)
}, uc = {
  get: /* @__PURE__ */ Gs(!0, !1)
};
const ta = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakMap(), dc = /* @__PURE__ */ new WeakMap();
function fc(t) {
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
function hc(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : fc($l(t));
}
// @__NO_SIDE_EFFECTS__
function Kn(t) {
  return /* @__PURE__ */ Mt(t) ? t : Xs(
    t,
    !1,
    ic,
    lc,
    ta
  );
}
// @__NO_SIDE_EFFECTS__
function Gn(t) {
  return Xs(
    t,
    !1,
    rc,
    cc,
    na
  );
}
// @__NO_SIDE_EFFECTS__
function ks(t) {
  return Xs(
    t,
    !0,
    sc,
    uc,
    ia
  );
}
function Xs(t, e, n, i, s) {
  if (!pe(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const r = hc(t);
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
function Xe(t) {
  return !!(t && t.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ni(t) {
  return t ? !!t.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function de(t) {
  const e = t && t.__v_raw;
  return e ? /* @__PURE__ */ de(e) : t;
}
function sa(t) {
  return !he(t, "__v_skip") && Object.isExtensible(t) && Fo(t, "__v_skip", !0), t;
}
const at = (t) => pe(t) ? /* @__PURE__ */ Kn(t) : t, fn = (t) => pe(t) ? /* @__PURE__ */ ks(t) : t;
// @__NO_SIDE_EFFECTS__
function Ce(t) {
  return t ? t.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function U(t) {
  return ra(t, !1);
}
// @__NO_SIDE_EFFECTS__
function hn(t) {
  return ra(t, !0);
}
function ra(t, e) {
  return /* @__PURE__ */ Ce(t) ? t : new pc(t, e);
}
class pc {
  constructor(e, n) {
    this.dep = new zi(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? e : /* @__PURE__ */ de(e), this._value = n ? e : at(e), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(e) {
    const n = this._rawValue, i = this.__v_isShallow || /* @__PURE__ */ Xe(e) || /* @__PURE__ */ Mt(e);
    e = i ? e : /* @__PURE__ */ de(e), Fe(e, n) && (this._rawValue = e, this._value = i ? e : at(e), this.dep.trigger());
  }
}
function g(t) {
  return /* @__PURE__ */ Ce(t) ? t.value : t;
}
function rt(t) {
  return ne(t) ? t() : g(t);
}
const vc = {
  get: (t, e, n) => e === "__v_raw" ? t : g(Reflect.get(t, e, n)),
  set: (t, e, n, i) => {
    const s = t[e];
    return /* @__PURE__ */ Ce(s) && !/* @__PURE__ */ Ce(n) ? (s.value = n, !0) : Reflect.set(t, e, n, i);
  }
};
function oa(t) {
  return /* @__PURE__ */ Qt(t) ? t : new Proxy(t, vc);
}
class mc {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new zi(), { get: i, set: s } = e(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = s;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function gc(t) {
  return new mc(t);
}
// @__NO_SIDE_EFFECTS__
function aa(t) {
  const e = Z(t) ? new Array(t.length) : {};
  for (const n in t)
    e[n] = la(t, n);
  return e;
}
class bc {
  constructor(e, n, i) {
    this._object = e, this._key = n, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._raw = /* @__PURE__ */ de(e);
    let s = !0, r = e;
    if (!Z(e) || !Ri(String(n)))
      do
        s = !/* @__PURE__ */ Ni(r) || /* @__PURE__ */ Xe(r);
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
    return Jl(this._raw, this._key);
  }
}
class yc {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function ts(t, e, n) {
  return /* @__PURE__ */ Ce(t) ? t : ne(t) ? new yc(t) : pe(t) && arguments.length > 1 ? la(t, e, n) : /* @__PURE__ */ U(t);
}
function la(t, e, n) {
  return new bc(t, e, n);
}
class _c {
  constructor(e, n, i) {
    this.fn = e, this.setter = n, this._value = void 0, this.dep = new zi(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = $n - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    be !== this)
      return Uo(this, !0), !0;
  }
  get value() {
    const e = this.dep.track();
    return Xo(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter && this.setter(e);
  }
}
// @__NO_SIDE_EFFECTS__
function wc(t, e, n = !1) {
  let i, s;
  return ne(t) ? i = t : (i = t.get, s = t.set), new _c(i, s, n);
}
const ni = {}, _i = /* @__PURE__ */ new WeakMap();
let Gt;
function xc(t, e = !1, n = Gt) {
  if (n) {
    let i = _i.get(n);
    i || _i.set(n, i = []), i.push(t);
  }
}
function Sc(t, e, n = fe) {
  const { immediate: i, deep: s, once: r, scheduler: o, augmentJob: a, call: l } = n, u = (_) => s ? _ : /* @__PURE__ */ Xe(_) || s === !1 || s === 0 ? Tt(_, 1) : Tt(_);
  let c, d, h, f, p = !1, m = !1;
  if (/* @__PURE__ */ Ce(t) ? (d = () => t.value, p = /* @__PURE__ */ Xe(t)) : /* @__PURE__ */ Qt(t) ? (d = () => u(t), p = !0) : Z(t) ? (m = !0, p = t.some((_) => /* @__PURE__ */ Qt(_) || /* @__PURE__ */ Xe(_)), d = () => t.map((_) => {
    if (/* @__PURE__ */ Ce(_))
      return _.value;
    if (/* @__PURE__ */ Qt(_))
      return u(_);
    if (ne(_))
      return l ? l(_, 2) : _();
  })) : ne(t) ? e ? d = l ? () => l(t, 2) : t : d = () => {
    if (h) {
      At();
      try {
        h();
      } finally {
        Pt();
      }
    }
    const _ = Gt;
    Gt = c;
    try {
      return l ? l(t, 3, [f]) : t(f);
    } finally {
      Gt = _;
    }
  } : d = gt, e && s) {
    const _ = d, M = s === !0 ? 1 / 0 : s;
    d = () => Tt(_(), M);
  }
  const b = Wo(), x = () => {
    c.stop(), b && b.active && Ws(b.effects, c);
  };
  if (r && e) {
    const _ = e;
    e = (...M) => {
      _(...M), x();
    };
  }
  let w = m ? new Array(t.length).fill(ni) : ni;
  const k = (_) => {
    if (!(!(c.flags & 1) || !c.dirty && !_))
      if (e) {
        const M = c.run();
        if (s || p || (m ? M.some((C, T) => Fe(C, w[T])) : Fe(M, w))) {
          h && h();
          const C = Gt;
          Gt = c;
          try {
            const T = [
              M,
              // pass undefined as the old value when it's changed for the first time
              w === ni ? void 0 : m && w[0] === ni ? [] : w,
              f
            ];
            w = M, l ? l(e, 3, T) : (
              // @ts-expect-error
              e(...T)
            );
          } finally {
            Gt = C;
          }
        }
      } else
        c.run();
  };
  return a && a(k), c = new Vo(d), c.scheduler = o ? () => o(k, !1) : k, f = (_) => xc(_, !1, c), h = c.onStop = () => {
    const _ = _i.get(c);
    if (_) {
      if (l)
        l(_, 4);
      else
        for (const M of _) M();
      _i.delete(c);
    }
  }, e ? i ? k(!0) : w = c.run() : o ? o(k.bind(null, !0), !0) : c.run(), x.pause = c.pause.bind(c), x.resume = c.resume.bind(c), x.stop = x, x;
}
function Tt(t, e = 1 / 0, n) {
  if (e <= 0 || !pe(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(t) || 0) >= e))
    return t;
  if (n.set(t, e), e--, /* @__PURE__ */ Ce(t))
    Tt(t.value, e, n);
  else if (Z(t))
    for (let i = 0; i < t.length; i++)
      Tt(t[i], e, n);
  else if (Ro(t) || ln(t))
    t.forEach((i) => {
      Tt(i, e, n);
    });
  else if (Li(t)) {
    for (const i in t)
      Tt(t[i], e, n);
    for (const i of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, i) && Tt(t[i], e, n);
  }
  return t;
}
function Xn(t, e, n, i) {
  try {
    return i ? t(...i) : t();
  } catch (s) {
    ji(s, e, n);
  }
}
function lt(t, e, n, i) {
  if (ne(t)) {
    const s = Xn(t, e, n, i);
    return s && Do(s) && s.catch((r) => {
      ji(r, e, n);
    }), s;
  }
  if (Z(t)) {
    const s = [];
    for (let r = 0; r < t.length; r++)
      s.push(lt(t[r], e, n, i));
    return s;
  }
}
function ji(t, e, n, i = !0) {
  const s = e ? e.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: o } = e && e.appContext.config || fe;
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
      At(), Xn(r, null, 10, [
        t,
        l,
        u
      ]), Pt();
      return;
    }
  }
  kc(t, n, s, i, o);
}
function kc(t, e, n, i = !0, s = !1) {
  if (s)
    throw t;
  console.error(t);
}
const ze = [];
let pt = -1;
const cn = [];
let zt = null, on = 0;
const ca = /* @__PURE__ */ Promise.resolve();
let wi = null;
function ct(t) {
  const e = wi || ca;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function Cc(t) {
  let e = pt + 1, n = ze.length;
  for (; e < n; ) {
    const i = e + n >>> 1, s = ze[i], r = zn(s);
    r < t || r === t && s.flags & 2 ? e = i + 1 : n = i;
  }
  return e;
}
function Ys(t) {
  if (!(t.flags & 1)) {
    const e = zn(t), n = ze[ze.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(t.flags & 2) && e >= zn(n) ? ze.push(t) : ze.splice(Cc(e), 0, t), t.flags |= 1, ua();
  }
}
function ua() {
  wi || (wi = ca.then(fa));
}
function Tc(t) {
  Z(t) ? cn.push(...t) : zt && t.id === -1 ? zt.splice(on + 1, 0, t) : t.flags & 1 || (cn.push(t), t.flags |= 1), ua();
}
function wr(t, e, n = pt + 1) {
  for (; n < ze.length; n++) {
    const i = ze[n];
    if (i && i.flags & 2) {
      if (t && i.id !== t.uid)
        continue;
      ze.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function da(t) {
  if (cn.length) {
    const e = [...new Set(cn)].sort(
      (n, i) => zn(n) - zn(i)
    );
    if (cn.length = 0, zt) {
      zt.push(...e);
      return;
    }
    for (zt = e, on = 0; on < zt.length; on++) {
      const n = zt[on];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    zt = null, on = 0;
  }
}
const zn = (t) => t.id == null ? t.flags & 2 ? -1 : 1 / 0 : t.id;
function fa(t) {
  try {
    for (pt = 0; pt < ze.length; pt++) {
      const e = ze[pt];
      e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Xn(
        e,
        e.i,
        e.i ? 15 : 14
      ), e.flags & 4 || (e.flags &= -2));
    }
  } finally {
    for (; pt < ze.length; pt++) {
      const e = ze[pt];
      e && (e.flags &= -2);
    }
    pt = -1, ze.length = 0, da(), wi = null, (ze.length || cn.length) && fa();
  }
}
let Ae = null, ha = null;
function xi(t) {
  const e = Ae;
  return Ae = t, ha = t && t.type.__scopeId || null, e;
}
function se(t, e = Ae, n) {
  if (!e || t._n)
    return t;
  const i = (...s) => {
    i._d && Ci(-1);
    const r = xi(e);
    let o;
    try {
      o = t(...s);
    } finally {
      xi(r), i._d && Ci(1);
    }
    return o;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function Ec(t, e) {
  if (Ae === null)
    return t;
  const n = Ki(Ae), i = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [r, o, a, l = fe] = e[s];
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
    l && (At(), lt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), Pt());
  }
}
function vn(t, e) {
  if (De) {
    let n = De.provides;
    const i = De.parent && De.parent.provides;
    i === n && (n = De.provides = Object.create(i)), n[t] = e;
  }
}
function Et(t, e, n = !1) {
  const i = tt();
  if (i || dn) {
    let s = dn ? dn._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (s && t in s)
      return s[t];
    if (arguments.length > 1)
      return n && ne(e) ? e.call(i && i.proxy) : e;
  }
}
const Ac = /* @__PURE__ */ Symbol.for("v-scx"), Pc = () => Et(Ac);
function Nt(t, e) {
  return Hi(t, null, e);
}
function Mc(t, e) {
  return Hi(
    t,
    null,
    { flush: "sync" }
  );
}
function me(t, e, n) {
  return Hi(t, e, n);
}
function Hi(t, e, n = fe) {
  const { immediate: i, deep: s, flush: r, once: o } = n, a = Se({}, n), l = e && i || !e && r !== "post";
  let u;
  if (Hn) {
    if (r === "sync") {
      const f = Pc();
      u = f.__watcherHandles || (f.__watcherHandles = []);
    } else if (!l) {
      const f = () => {
      };
      return f.stop = gt, f.resume = gt, f.pause = gt, f;
    }
  }
  const c = De;
  a.call = (f, p, m) => lt(f, c, p, m);
  let d = !1;
  r === "post" ? a.scheduler = (f) => {
    Oe(f, c && c.suspense);
  } : r !== "sync" && (d = !0, a.scheduler = (f, p) => {
    p ? f() : Ys(f);
  }), a.augmentJob = (f) => {
    e && (f.flags |= 4), d && (f.flags |= 2, c && (f.id = c.uid, f.i = c));
  };
  const h = Sc(t, e, a);
  return Hn && (u ? u.push(h) : l && h()), h;
}
function Ic(t, e, n) {
  const i = this.proxy, s = we(t) ? t.includes(".") ? pa(i, t) : () => i[t] : t.bind(i, i);
  let r;
  ne(e) ? r = e : (r = e.handler, n = e);
  const o = Yn(this), a = Hi(s, r.bind(i), n);
  return o(), a;
}
function pa(t, e) {
  const n = e.split(".");
  return () => {
    let i = t;
    for (let s = 0; s < n.length && i; s++)
      i = i[n[s]];
    return i;
  };
}
const va = /* @__PURE__ */ Symbol("_vte"), ma = (t) => t.__isTeleport, On = (t) => t && (t.disabled || t.disabled === ""), xr = (t) => t && (t.defer || t.defer === ""), Sr = (t) => typeof SVGElement < "u" && t instanceof SVGElement, kr = (t) => typeof MathMLElement == "function" && t instanceof MathMLElement, Cs = (t, e) => {
  const n = t && t.to;
  return we(n) ? e ? e(n) : null : n;
}, ga = {
  name: "Teleport",
  __isTeleport: !0,
  process(t, e, n, i, s, r, o, a, l, u) {
    const {
      mc: c,
      pc: d,
      pbc: h,
      o: { insert: f, querySelector: p, createText: m, createComment: b }
    } = u, x = On(e.props);
    let { shapeFlag: w, children: k, dynamicChildren: _ } = e;
    if (t == null) {
      const M = e.el = m(""), C = e.anchor = m("");
      f(M, n, i), f(C, n, i);
      const T = (F, L) => {
        w & 16 && c(
          k,
          F,
          L,
          s,
          r,
          o,
          a,
          l
        );
      }, V = () => {
        const F = e.target = Cs(e.props, p), L = Ts(F, e, m, f);
        F && (o !== "svg" && Sr(F) ? o = "svg" : o !== "mathml" && kr(F) && (o = "mathml"), s && s.isCE && (s.ce._teleportTargets || (s.ce._teleportTargets = /* @__PURE__ */ new Set())).add(F), x || (T(F, L), ui(e, !1)));
      };
      x && (T(n, C), ui(e, !0)), xr(e.props) ? (e.el.__isMounted = !1, Oe(() => {
        V(), delete e.el.__isMounted;
      }, r)) : V();
    } else {
      if (xr(e.props) && t.el.__isMounted === !1) {
        Oe(() => {
          ga.process(
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
      const M = e.anchor = t.anchor, C = e.target = t.target, T = e.targetAnchor = t.targetAnchor, V = On(t.props), F = V ? n : C, L = V ? M : T;
      if (o === "svg" || Sr(C) ? o = "svg" : (o === "mathml" || kr(C)) && (o = "mathml"), _ ? (h(
        t.dynamicChildren,
        _,
        F,
        s,
        r,
        o,
        a
      ), er(t, e, !0)) : l || d(
        t,
        e,
        F,
        L,
        s,
        r,
        o,
        a,
        !1
      ), x)
        V ? e.props && t.props && e.props.to !== t.props.to && (e.props.to = t.props.to) : ii(
          e,
          n,
          M,
          u,
          1
        );
      else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
        const N = e.target = Cs(
          e.props,
          p
        );
        N && ii(
          e,
          N,
          null,
          u,
          0
        );
      } else V && ii(
        e,
        C,
        T,
        u,
        1
      );
      ui(e, x);
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
      const f = r || !On(h);
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
  move: ii,
  hydrate: Oc
};
function ii(t, e, n, { o: { insert: i }, m: s }, r = 2) {
  r === 0 && i(t.targetAnchor, e, n);
  const { el: o, anchor: a, shapeFlag: l, children: u, props: c } = t, d = r === 2;
  if (d && i(o, e, n), (!d || On(c)) && l & 16)
    for (let h = 0; h < u.length; h++)
      s(
        u[h],
        e,
        n,
        2
      );
  d && i(a, e, n);
}
function Oc(t, e, n, i, s, r, {
  o: { nextSibling: o, parentNode: a, querySelector: l, insert: u, createText: c }
}, d) {
  function h(b, x) {
    let w = x;
    for (; w; ) {
      if (w && w.nodeType === 8) {
        if (w.data === "teleport start anchor")
          e.targetStart = w;
        else if (w.data === "teleport anchor") {
          e.targetAnchor = w, b._lpa = e.targetAnchor && o(e.targetAnchor);
          break;
        }
      }
      w = o(w);
    }
  }
  function f(b, x) {
    x.anchor = d(
      o(b),
      x,
      a(b),
      n,
      i,
      s,
      r
    );
  }
  const p = e.target = Cs(
    e.props,
    l
  ), m = On(e.props);
  if (p) {
    const b = p._lpa || p.firstChild;
    e.shapeFlag & 16 && (m ? (f(t, e), h(p, b), e.targetAnchor || Ts(
      p,
      e,
      c,
      u,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      a(t) === p ? t : null
    )) : (e.anchor = o(t), h(p, b), e.targetAnchor || Ts(p, e, c, u), d(
      b && o(b),
      e,
      p,
      n,
      i,
      s,
      r
    ))), ui(e, m);
  } else m && e.shapeFlag & 16 && (f(t, e), e.targetStart = t, e.targetAnchor = o(t));
  return e.anchor && o(e.anchor);
}
const Lc = ga;
function ui(t, e) {
  const n = t.ctx;
  if (n && n.ut) {
    let i, s;
    for (e ? (i = t.el, s = t.anchor) : (i = t.targetStart, s = t.targetAnchor); i && i !== s; )
      i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function Ts(t, e, n, i, s = null) {
  const r = e.targetStart = n(""), o = e.targetAnchor = n("");
  return r[va] = o, t && (i(r, t, s), i(o, t, s)), o;
}
const vt = /* @__PURE__ */ Symbol("_leaveCb"), Sn = /* @__PURE__ */ Symbol("_enterCb");
function Rc() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Ke(() => {
    t.isMounted = !0;
  }), _t(() => {
    t.isUnmounting = !0;
  }), t;
}
const Ze = [Function, Array], ba = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ze,
  onEnter: Ze,
  onAfterEnter: Ze,
  onEnterCancelled: Ze,
  // leave
  onBeforeLeave: Ze,
  onLeave: Ze,
  onAfterLeave: Ze,
  onLeaveCancelled: Ze,
  // appear
  onBeforeAppear: Ze,
  onAppear: Ze,
  onAfterAppear: Ze,
  onAppearCancelled: Ze
}, ya = (t) => {
  const e = t.subTree;
  return e.component ? ya(e.component) : e;
}, Dc = {
  name: "BaseTransition",
  props: ba,
  setup(t, { slots: e }) {
    const n = tt(), i = Rc();
    return () => {
      const s = e.default && xa(e.default(), !0);
      if (!s || !s.length)
        return;
      const r = _a(s), o = /* @__PURE__ */ de(t), { mode: a } = o;
      if (i.isLeaving)
        return ns(r);
      const l = Cr(r);
      if (!l)
        return ns(r);
      let u = Es(
        l,
        o,
        i,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => u = d
      );
      l.type !== Ee && Bn(l, u);
      let c = n.subTree && Cr(n.subTree);
      if (c && c.type !== Ee && !Yt(c, l) && ya(n).type !== Ee) {
        let d = Es(
          c,
          o,
          i,
          n
        );
        if (Bn(c, d), a === "out-in" && l.type !== Ee)
          return i.isLeaving = !0, d.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, ns(r);
        a === "in-out" && l.type !== Ee ? d.delayLeave = (h, f, p) => {
          const m = wa(
            i,
            c
          );
          m[String(c.key)] = c, h[vt] = () => {
            f(), h[vt] = void 0, delete u.delayedLeave, c = void 0;
          }, u.delayedLeave = () => {
            p(), delete u.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return r;
    };
  }
};
function _a(t) {
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
const $c = Dc;
function wa(t, e) {
  const { leavingVNodes: n } = t;
  let i = n.get(e.type);
  return i || (i = /* @__PURE__ */ Object.create(null), n.set(e.type, i)), i;
}
function Es(t, e, n, i, s) {
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
    onBeforeAppear: b,
    onAppear: x,
    onAfterAppear: w,
    onAppearCancelled: k
  } = e, _ = String(t.key), M = wa(n, t), C = (F, L) => {
    F && lt(
      F,
      i,
      9,
      L
    );
  }, T = (F, L) => {
    const N = L[1];
    C(F, L), Z(F) ? F.every((E) => E.length <= 1) && N() : F.length <= 1 && N();
  }, V = {
    mode: o,
    persisted: a,
    beforeEnter(F) {
      let L = l;
      if (!n.isMounted)
        if (r)
          L = b || l;
        else
          return;
      F[vt] && F[vt](
        !0
        /* cancelled */
      );
      const N = M[_];
      N && Yt(t, N) && N.el[vt] && N.el[vt](), C(L, [F]);
    },
    enter(F) {
      let L = u, N = c, E = d;
      if (!n.isMounted)
        if (r)
          L = x || u, N = w || c, E = k || d;
        else
          return;
      let P = !1;
      F[Sn] = (q) => {
        P || (P = !0, q ? C(E, [F]) : C(N, [F]), V.delayedLeave && V.delayedLeave(), F[Sn] = void 0);
      };
      const I = F[Sn].bind(null, !1);
      L ? T(L, [F, I]) : I();
    },
    leave(F, L) {
      const N = String(t.key);
      if (F[Sn] && F[Sn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return L();
      C(h, [F]);
      let E = !1;
      F[vt] = (I) => {
        E || (E = !0, L(), I ? C(m, [F]) : C(p, [F]), F[vt] = void 0, M[N] === t && delete M[N]);
      };
      const P = F[vt].bind(null, !1);
      M[N] = t, f ? T(f, [F, P]) : P();
    },
    clone(F) {
      const L = Es(
        F,
        e,
        n,
        i,
        s
      );
      return s && s(L), L;
    }
  };
  return V;
}
function ns(t) {
  if (Wi(t))
    return t = It(t), t.children = null, t;
}
function Cr(t) {
  if (!Wi(t))
    return ma(t.type) && t.children ? _a(t.children) : t;
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
function Bn(t, e) {
  t.shapeFlag & 6 && t.component ? (t.transition = e, Bn(t.component.subTree, e)) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function xa(t, e = !1, n) {
  let i = [], s = 0;
  for (let r = 0; r < t.length; r++) {
    let o = t[r];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : r);
    o.type === ye ? (o.patchFlag & 128 && s++, i = i.concat(
      xa(o.children, e, a)
    )) : (e || o.type !== Ee) && i.push(a != null ? It(o, { key: a }) : o);
  }
  if (s > 1)
    for (let r = 0; r < i.length; r++)
      i[r].patchFlag = -2;
  return i;
}
// @__NO_SIDE_EFFECTS__
function te(t, e) {
  return ne(t) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Se({ name: t.name }, e, { setup: t })
  ) : t;
}
function Js() {
  const t = tt();
  return t ? (t.appContext.config.idPrefix || "v") + "-" + t.ids[0] + t.ids[1]++ : "";
}
function Sa(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
function Nn(t) {
  const e = tt(), n = /* @__PURE__ */ hn(null);
  if (e) {
    const s = e.refs === fe ? e.refs = {} : e.refs;
    Object.defineProperty(s, t, {
      enumerable: !0,
      get: () => n.value,
      set: (r) => n.value = r
    });
  }
  return n;
}
function Tr(t, e) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(t, e)) && !n.configurable);
}
const Si = /* @__PURE__ */ new WeakMap();
function Ln(t, e, n, i, s = !1) {
  if (Z(t)) {
    t.forEach(
      (m, b) => Ln(
        m,
        e && (Z(e) ? e[b] : e),
        n,
        i,
        s
      )
    );
    return;
  }
  if (un(i) && !s) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Ln(t, e, n, i.component.subTree);
    return;
  }
  const r = i.shapeFlag & 4 ? Ki(i.component) : i.el, o = s ? null : r, { i: a, r: l } = t, u = e && e.r, c = a.refs === fe ? a.refs = {} : a.refs, d = a.setupState, h = /* @__PURE__ */ de(d), f = d === fe ? Lo : (m) => Tr(c, m) ? !1 : he(h, m), p = (m, b) => !(b && Tr(c, b));
  if (u != null && u !== l) {
    if (Er(e), we(u))
      c[u] = null, f(u) && (d[u] = null);
    else if (/* @__PURE__ */ Ce(u)) {
      const m = e;
      p(u, m.k) && (u.value = null), m.k && (c[m.k] = null);
    }
  }
  if (ne(l))
    Xn(l, a, 12, [o, c]);
  else {
    const m = we(l), b = /* @__PURE__ */ Ce(l);
    if (m || b) {
      const x = () => {
        if (t.f) {
          const w = m ? f(l) ? d[l] : c[l] : p() || !t.k ? l.value : c[t.k];
          if (s)
            Z(w) && Ws(w, r);
          else if (Z(w))
            w.includes(r) || w.push(r);
          else if (m)
            c[l] = [r], f(l) && (d[l] = c[l]);
          else {
            const k = [r];
            p(l, t.k) && (l.value = k), t.k && (c[t.k] = k);
          }
        } else m ? (c[l] = o, f(l) && (d[l] = o)) : b && (p(l, t.k) && (l.value = o), t.k && (c[t.k] = o));
      };
      if (o) {
        const w = () => {
          x(), Si.delete(t);
        };
        w.id = -1, Si.set(t, w), Oe(w, n);
      } else
        Er(t), x();
    }
  }
}
function Er(t) {
  const e = Si.get(t);
  e && (e.flags |= 8, Si.delete(t));
}
Fi().requestIdleCallback;
Fi().cancelIdleCallback;
const un = (t) => !!t.type.__asyncLoader, Wi = (t) => t.type.__isKeepAlive;
function Fc(t, e) {
  ka(t, "a", e);
}
function zc(t, e) {
  ka(t, "da", e);
}
function ka(t, e, n = De) {
  const i = t.__wdc || (t.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return t();
  });
  if (Vi(e, i, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      Wi(s.parent.vnode) && Bc(i, e, n, s), s = s.parent;
  }
}
function Bc(t, e, n, i) {
  const s = Vi(
    e,
    t,
    i,
    !0
    /* prepend */
  );
  tn(() => {
    Ws(i[e], s);
  }, n);
}
function Vi(t, e, n = De, i = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), r = e.__weh || (e.__weh = (...o) => {
      At();
      const a = Yn(n), l = lt(e, n, t, o);
      return a(), Pt(), l;
    });
    return i ? s.unshift(r) : s.push(r), r;
  }
}
const Lt = (t) => (e, n = De) => {
  (!Hn || t === "sp") && Vi(t, (...i) => e(...i), n);
}, Nc = Lt("bm"), Ke = Lt("m"), jc = Lt(
  "bu"
), Hc = Lt("u"), _t = Lt(
  "bum"
), tn = Lt("um"), Wc = Lt(
  "sp"
), Vc = Lt("rtg"), qc = Lt("rtc");
function Uc(t, e = De) {
  Vi("ec", t, e);
}
const Kc = "components", Ca = /* @__PURE__ */ Symbol.for("v-ndc");
function Ta(t) {
  return we(t) ? Gc(Kc, t, !1) || t : t || Ca;
}
function Gc(t, e, n = !0, i = !1) {
  const s = Ae || De;
  if (s) {
    const r = s.type;
    {
      const a = Ou(
        r,
        !1
      );
      if (a && (a === e || a === Pe(e) || a === $i(Pe(e))))
        return r;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Ar(s[t] || r[t], e) || // global registration
      Ar(s.appContext[t], e)
    );
    return !o && i ? r : o;
  }
}
function Ar(t, e) {
  return t && (t[e] || t[Pe(e)] || t[$i(Pe(e))]);
}
function mn(t, e, n, i) {
  let s;
  const r = n && n[i], o = Z(t);
  if (o || we(t)) {
    const a = o && /* @__PURE__ */ Qt(t);
    let l = !1, u = !1;
    a && (l = !/* @__PURE__ */ Xe(t), u = /* @__PURE__ */ Mt(t), t = Bi(t)), s = new Array(t.length);
    for (let c = 0, d = t.length; c < d; c++)
      s[c] = e(
        l ? u ? fn(at(t[c])) : at(t[c]) : t[c],
        c,
        void 0,
        r && r[c]
      );
  } else if (typeof t == "number") {
    s = new Array(t);
    for (let a = 0; a < t; a++)
      s[a] = e(a + 1, a, void 0, r && r[a]);
  } else if (pe(t))
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
function _e(t, e, n = {}, i, s) {
  if (Ae.ce || Ae.parent && un(Ae.parent) && Ae.parent.ce) {
    const u = Object.keys(n).length > 0;
    return e !== "default" && (n.name = e), A(), Y(
      ye,
      null,
      [G("slot", n, i && i())],
      u ? -2 : 64
    );
  }
  let r = t[e];
  r && r._c && (r._d = !1), A();
  const o = r && Ea(r(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  o && o.key, l = Y(
    ye,
    {
      key: (a && !ot(a) ? a : `_${e}`) + // #7256 force differentiate fallback content from actual content
      (!o && i ? "_fb" : "")
    },
    o || (i ? i() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !s && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), r && r._c && (r._d = !0), l;
}
function Ea(t) {
  return t.some((e) => jn(e) ? !(e.type === Ee || e.type === ye && !Ea(e.children)) : !0) ? t : null;
}
const As = (t) => t ? Ga(t) ? Ki(t) : As(t.parent) : null, Rn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Se(/* @__PURE__ */ Object.create(null), {
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
    $options: (t) => Pa(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      Ys(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = ct.bind(t.proxy)),
    $watch: (t) => Ic.bind(t)
  })
), is = (t, e) => t !== fe && !t.__isScriptSetup && he(t, e), Xc = {
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
        if (is(i, e))
          return o[e] = 1, i[e];
        if (s !== fe && he(s, e))
          return o[e] = 2, s[e];
        if (he(r, e))
          return o[e] = 3, r[e];
        if (n !== fe && he(n, e))
          return o[e] = 4, n[e];
        Ps && (o[e] = 0);
      }
    }
    const u = Rn[e];
    let c, d;
    if (u)
      return e === "$attrs" && Re(t.attrs, "get", ""), u(t);
    if (
      // css module (injected by vue-loader)
      (c = a.__cssModules) && (c = c[e])
    )
      return c;
    if (n !== fe && he(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      d = l.config.globalProperties, he(d, e)
    )
      return d[e];
  },
  set({ _: t }, e, n) {
    const { data: i, setupState: s, ctx: r } = t;
    return is(s, e) ? (s[e] = n, !0) : i !== fe && he(i, e) ? (i[e] = n, !0) : he(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (r[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: i, appContext: s, props: r, type: o }
  }, a) {
    let l;
    return !!(n[a] || t !== fe && a[0] !== "$" && he(t, a) || is(e, a) || he(r, a) || he(i, a) || he(Rn, a) || he(s.config.globalProperties, a) || (l = o.__cssModules) && l[a]);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : he(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function Yc() {
  return Jc().slots;
}
function Jc(t) {
  const e = tt();
  return e.setupContext || (e.setupContext = Ya(e));
}
function Pr(t) {
  return Z(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Ps = !0;
function Zc(t) {
  const e = Pa(t), n = t.proxy, i = t.ctx;
  Ps = !1, e.beforeCreate && Mr(e.beforeCreate, t, "bc");
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
    deactivated: b,
    beforeDestroy: x,
    beforeUnmount: w,
    destroyed: k,
    unmounted: _,
    render: M,
    renderTracked: C,
    renderTriggered: T,
    errorCaptured: V,
    serverPrefetch: F,
    // public API
    expose: L,
    inheritAttrs: N,
    // assets
    components: E,
    directives: P,
    filters: I
  } = e;
  if (u && Qc(u, i, null), o)
    for (const K in o) {
      const ae = o[K];
      ne(ae) && (i[K] = ae.bind(n));
    }
  if (s) {
    const K = s.call(n, n);
    pe(K) && (t.data = /* @__PURE__ */ Kn(K));
  }
  if (Ps = !0, r)
    for (const K in r) {
      const ae = r[K], ue = ne(ae) ? ae.bind(n, n) : ne(ae.get) ? ae.get.bind(n, n) : gt, Ie = !ne(ae) && ne(ae.set) ? ae.set.bind(n) : gt, Te = B({
        get: ue,
        set: Ie
      });
      Object.defineProperty(i, K, {
        enumerable: !0,
        configurable: !0,
        get: () => Te.value,
        set: (He) => Te.value = He
      });
    }
  if (a)
    for (const K in a)
      Aa(a[K], i, n, K);
  if (l) {
    const K = ne(l) ? l.call(n) : l;
    Reflect.ownKeys(K).forEach((ae) => {
      vn(ae, K[ae]);
    });
  }
  c && Mr(c, t, "c");
  function oe(K, ae) {
    Z(ae) ? ae.forEach((ue) => K(ue.bind(n))) : ae && K(ae.bind(n));
  }
  if (oe(Nc, d), oe(Ke, h), oe(jc, f), oe(Hc, p), oe(Fc, m), oe(zc, b), oe(Uc, V), oe(qc, C), oe(Vc, T), oe(_t, w), oe(tn, _), oe(Wc, F), Z(L))
    if (L.length) {
      const K = t.exposed || (t.exposed = {});
      L.forEach((ae) => {
        Object.defineProperty(K, ae, {
          get: () => n[ae],
          set: (ue) => n[ae] = ue,
          enumerable: !0
        });
      });
    } else t.exposed || (t.exposed = {});
  M && t.render === gt && (t.render = M), N != null && (t.inheritAttrs = N), E && (t.components = E), P && (t.directives = P), F && Sa(t);
}
function Qc(t, e, n = gt) {
  Z(t) && (t = Ms(t));
  for (const i in t) {
    const s = t[i];
    let r;
    pe(s) ? "default" in s ? r = Et(
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
function Mr(t, e, n) {
  lt(
    Z(t) ? t.map((i) => i.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Aa(t, e, n, i) {
  let s = i.includes(".") ? pa(n, i) : () => n[i];
  if (we(t)) {
    const r = e[t];
    ne(r) && me(s, r);
  } else if (ne(t))
    me(s, t.bind(n));
  else if (pe(t))
    if (Z(t))
      t.forEach((r) => Aa(r, e, n, i));
    else {
      const r = ne(t.handler) ? t.handler.bind(n) : e[t.handler];
      ne(r) && me(s, r, t);
    }
}
function Pa(t) {
  const e = t.type, { mixins: n, extends: i } = e, {
    mixins: s,
    optionsCache: r,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = r.get(e);
  let l;
  return a ? l = a : !s.length && !n && !i ? l = e : (l = {}, s.length && s.forEach(
    (u) => ki(l, u, o, !0)
  ), ki(l, e, o)), pe(e) && r.set(e, l), l;
}
function ki(t, e, n, i = !1) {
  const { mixins: s, extends: r } = e;
  r && ki(t, r, n, !0), s && s.forEach(
    (o) => ki(t, o, n, !0)
  );
  for (const o in e)
    if (!(i && o === "expose")) {
      const a = eu[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const eu = {
  data: Ir,
  props: Or,
  emits: Or,
  // objects
  methods: En,
  computed: En,
  // lifecycle
  beforeCreate: $e,
  created: $e,
  beforeMount: $e,
  mounted: $e,
  beforeUpdate: $e,
  updated: $e,
  beforeDestroy: $e,
  beforeUnmount: $e,
  destroyed: $e,
  unmounted: $e,
  activated: $e,
  deactivated: $e,
  errorCaptured: $e,
  serverPrefetch: $e,
  // assets
  components: En,
  directives: En,
  // watch
  watch: nu,
  // provide / inject
  provide: Ir,
  inject: tu
};
function Ir(t, e) {
  return e ? t ? function() {
    return Se(
      ne(t) ? t.call(this, this) : t,
      ne(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function tu(t, e) {
  return En(Ms(t), Ms(e));
}
function Ms(t) {
  if (Z(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function $e(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function En(t, e) {
  return t ? Se(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function Or(t, e) {
  return t ? Z(t) && Z(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Se(
    /* @__PURE__ */ Object.create(null),
    Pr(t),
    Pr(e ?? {})
  ) : e;
}
function nu(t, e) {
  if (!t) return e;
  if (!e) return t;
  const n = Se(/* @__PURE__ */ Object.create(null), t);
  for (const i in e)
    n[i] = $e(t[i], e[i]);
  return n;
}
function Ma() {
  return {
    app: null,
    config: {
      isNativeTag: Lo,
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
let iu = 0;
function su(t, e) {
  return function(i, s = null) {
    ne(i) || (i = Se({}, i)), s != null && !pe(s) && (s = null);
    const r = Ma(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const u = r.app = {
      _uid: iu++,
      _component: i,
      _props: s,
      _container: null,
      _context: r,
      _instance: null,
      version: Du,
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
          const f = u._ceVNode || G(i, s);
          return f.appContext = r, h === !0 ? h = "svg" : h === !1 && (h = void 0), t(f, c, h), l = !0, u._container = c, c.__vue_app__ = u, Ki(f.component);
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l && (lt(
          a,
          u._instance,
          16
        ), t(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, d) {
        return r.provides[c] = d, u;
      },
      runWithContext(c) {
        const d = dn;
        dn = u;
        try {
          return c();
        } finally {
          dn = d;
        }
      }
    };
    return u;
  };
}
let dn = null;
function ru(t, e, n = fe) {
  const i = tt(), s = Pe(e), r = Ue(e), o = Ia(t, s), a = gc((l, u) => {
    let c, d = fe, h;
    return Mc(() => {
      const f = t[s];
      Fe(c, f) && (c = f, u());
    }), {
      get() {
        return l(), n.get ? n.get(c) : c;
      },
      set(f) {
        const p = n.set ? n.set(f) : f;
        if (!Fe(p, c) && !(d !== fe && Fe(f, d)))
          return;
        const m = i.vnode.props;
        m && // check if parent has passed v-model
        (e in m || s in m || r in m) && (`onUpdate:${e}` in m || `onUpdate:${s}` in m || `onUpdate:${r}` in m) || (c = f, u()), i.emit(`update:${e}`, p), Fe(f, p) && Fe(f, d) && !Fe(p, h) && u(), d = f, h = p;
      }
    };
  });
  return a[Symbol.iterator] = () => {
    let l = 0;
    return {
      next() {
        return l < 2 ? { value: l++ ? o || fe : a, done: !1 } : { done: !0 };
      }
    };
  }, a;
}
const Ia = (t, e) => e === "modelValue" || e === "model-value" ? t.modelModifiers : t[`${e}Modifiers`] || t[`${Pe(e)}Modifiers`] || t[`${Ue(e)}Modifiers`];
function ou(t, e, ...n) {
  if (t.isUnmounted) return;
  const i = t.vnode.props || fe;
  let s = n;
  const r = e.startsWith("update:"), o = r && Ia(i, e.slice(7));
  o && (o.trim && (s = n.map((c) => we(c) ? c.trim() : c)), o.number && (s = n.map(Bl)));
  let a, l = i[a = ci(e)] || // also try camelCase event handler (#2249)
  i[a = ci(Pe(e))];
  !l && r && (l = i[a = ci(Ue(e))]), l && lt(
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
    t.emitted[a] = !0, lt(
      u,
      t,
      6,
      s
    );
  }
}
const au = /* @__PURE__ */ new WeakMap();
function Oa(t, e, n = !1) {
  const i = n ? au : e.emitsCache, s = i.get(t);
  if (s !== void 0)
    return s;
  const r = t.emits;
  let o = {}, a = !1;
  if (!ne(t)) {
    const l = (u) => {
      const c = Oa(u, e, !0);
      c && (a = !0, Se(o, c));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !r && !a ? (pe(t) && i.set(t, null), null) : (Z(r) ? r.forEach((l) => o[l] = null) : Se(o, r), pe(t) && i.set(t, o), o);
}
function qi(t, e) {
  return !t || !Oi(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), he(t, e[0].toLowerCase() + e.slice(1)) || he(t, Ue(e)) || he(t, e));
}
function Lr(t) {
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
  } = t, b = xi(t);
  let x, w;
  try {
    if (n.shapeFlag & 4) {
      const _ = s || i, M = _;
      x = mt(
        u.call(
          M,
          _,
          c,
          d,
          f,
          h,
          p
        )
      ), w = a;
    } else {
      const _ = e;
      x = mt(
        _.length > 1 ? _(
          d,
          { attrs: a, slots: o, emit: l }
        ) : _(
          d,
          null
        )
      ), w = e.props ? a : lu(a);
    }
  } catch (_) {
    Dn.length = 0, ji(_, t, 1), x = G(Ee);
  }
  let k = x;
  if (w && m !== !1) {
    const _ = Object.keys(w), { shapeFlag: M } = k;
    _.length && M & 7 && (r && _.some(Hs) && (w = cu(
      w,
      r
    )), k = It(k, w, !1, !0));
  }
  return n.dirs && (k = It(k, null, !1, !0), k.dirs = k.dirs ? k.dirs.concat(n.dirs) : n.dirs), n.transition && Bn(k, n.transition), x = k, xi(b), x;
}
const lu = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || Oi(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, cu = (t, e) => {
  const n = {};
  for (const i in t)
    (!Hs(i) || !(i.slice(9) in e)) && (n[i] = t[i]);
  return n;
};
function uu(t, e, n) {
  const { props: i, children: s, component: r } = t, { props: o, children: a, patchFlag: l } = e, u = r.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return i ? Rr(i, o, u) : !!o;
    if (l & 8) {
      const c = e.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const h = c[d];
        if (La(o, i, h) && !qi(u, h))
          return !0;
      }
    }
  } else
    return (s || a) && (!a || !a.$stable) ? !0 : i === o ? !1 : i ? o ? Rr(i, o, u) : !0 : !!o;
  return !1;
}
function Rr(t, e, n) {
  const i = Object.keys(e);
  if (i.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < i.length; s++) {
    const r = i[s];
    if (La(e, t, r) && !qi(n, r))
      return !0;
  }
  return !1;
}
function La(t, e, n) {
  const i = t[n], s = e[n];
  return n === "style" && pe(i) && pe(s) ? !Vs(i, s) : i !== s;
}
function du({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const i = e.subTree;
    if (i.suspense && i.suspense.activeBranch === t && (i.el = t.el), i === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Ra = {}, Da = () => Object.create(Ra), $a = (t) => Object.getPrototypeOf(t) === Ra;
function fu(t, e, n, i = !1) {
  const s = {}, r = Da();
  t.propsDefaults = /* @__PURE__ */ Object.create(null), Fa(t, e, s, r);
  for (const o in t.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? t.props = i ? s : /* @__PURE__ */ Gn(s) : t.type.props ? t.props = s : t.props = r, t.attrs = r;
}
function hu(t, e, n, i) {
  const {
    props: s,
    attrs: r,
    vnode: { patchFlag: o }
  } = t, a = /* @__PURE__ */ de(s), [l] = t.propsOptions;
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
        if (qi(t.emitsOptions, h))
          continue;
        const f = e[h];
        if (l)
          if (he(r, h))
            f !== r[h] && (r[h] = f, u = !0);
          else {
            const p = Pe(h);
            s[p] = Is(
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
    Fa(t, e, s, r) && (u = !0);
    let c;
    for (const d in a)
      (!e || // for camelCase
      !he(e, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Ue(d)) === d || !he(e, c))) && (l ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (s[d] = Is(
        l,
        a,
        d,
        void 0,
        t,
        !0
      )) : delete s[d]);
    if (r !== a)
      for (const d in r)
        (!e || !he(e, d)) && (delete r[d], u = !0);
  }
  u && Ct(t.attrs, "set", "");
}
function Fa(t, e, n, i) {
  const [s, r] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (Pn(l))
        continue;
      const u = e[l];
      let c;
      s && he(s, c = Pe(l)) ? !r || !r.includes(c) ? n[c] = u : (a || (a = {}))[c] = u : qi(t.emitsOptions, l) || (!(l in i) || u !== i[l]) && (i[l] = u, o = !0);
    }
  if (r) {
    const l = /* @__PURE__ */ de(n), u = a || fe;
    for (let c = 0; c < r.length; c++) {
      const d = r[c];
      n[d] = Is(
        s,
        l,
        d,
        u[d],
        t,
        !he(u, d)
      );
    }
  }
  return o;
}
function Is(t, e, n, i, s, r) {
  const o = t[n];
  if (o != null) {
    const a = he(o, "default");
    if (a && i === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && ne(l)) {
        const { propsDefaults: u } = s;
        if (n in u)
          i = u[n];
        else {
          const c = Yn(s);
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
    ] && (i === "" || i === Ue(n)) && (i = !0));
  }
  return i;
}
const pu = /* @__PURE__ */ new WeakMap();
function za(t, e, n = !1) {
  const i = n ? pu : e.propsCache, s = i.get(t);
  if (s)
    return s;
  const r = t.props, o = {}, a = [];
  let l = !1;
  if (!ne(t)) {
    const c = (d) => {
      l = !0;
      const [h, f] = za(d, e, !0);
      Se(o, h), f && a.push(...f);
    };
    !n && e.mixins.length && e.mixins.forEach(c), t.extends && c(t.extends), t.mixins && t.mixins.forEach(c);
  }
  if (!r && !l)
    return pe(t) && i.set(t, an), an;
  if (Z(r))
    for (let c = 0; c < r.length; c++) {
      const d = Pe(r[c]);
      Dr(d) && (o[d] = fe);
    }
  else if (r)
    for (const c in r) {
      const d = Pe(c);
      if (Dr(d)) {
        const h = r[c], f = o[d] = Z(h) || ne(h) ? { type: h } : Se({}, h), p = f.type;
        let m = !1, b = !0;
        if (Z(p))
          for (let x = 0; x < p.length; ++x) {
            const w = p[x], k = ne(w) && w.name;
            if (k === "Boolean") {
              m = !0;
              break;
            } else k === "String" && (b = !1);
          }
        else
          m = ne(p) && p.name === "Boolean";
        f[
          0
          /* shouldCast */
        ] = m, f[
          1
          /* shouldCastTrue */
        ] = b, (m || he(f, "default")) && a.push(d);
      }
    }
  const u = [o, a];
  return pe(t) && i.set(t, u), u;
}
function Dr(t) {
  return t[0] !== "$" && !Pn(t);
}
const Zs = (t) => t === "_" || t === "_ctx" || t === "$stable", Qs = (t) => Z(t) ? t.map(mt) : [mt(t)], vu = (t, e, n) => {
  if (e._n)
    return e;
  const i = se((...s) => Qs(e(...s)), n);
  return i._c = !1, i;
}, Ba = (t, e, n) => {
  const i = t._ctx;
  for (const s in t) {
    if (Zs(s)) continue;
    const r = t[s];
    if (ne(r))
      e[s] = vu(s, r, i);
    else if (r != null) {
      const o = Qs(r);
      e[s] = () => o;
    }
  }
}, Na = (t, e) => {
  const n = Qs(e);
  t.slots.default = () => n;
}, ja = (t, e, n) => {
  for (const i in e)
    (n || !Zs(i)) && (t[i] = e[i]);
}, mu = (t, e, n) => {
  const i = t.slots = Da();
  if (t.vnode.shapeFlag & 32) {
    const s = e._;
    s ? (ja(i, e, n), n && Fo(i, "_", s, !0)) : Ba(e, i);
  } else e && Na(t, e);
}, gu = (t, e, n) => {
  const { vnode: i, slots: s } = t;
  let r = !0, o = fe;
  if (i.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? r = !1 : ja(s, e, n) : (r = !e.$stable, Ba(e, s)), o = e;
  } else e && (Na(t, e), o = { default: 1 });
  if (r)
    for (const a in s)
      !Zs(a) && o[a] == null && delete s[a];
}, Oe = xu;
function bu(t) {
  return yu(t);
}
function yu(t, e) {
  const n = Fi();
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
    setScopeId: f = gt,
    insertStaticContent: p
  } = t, m = (v, y, S, $ = null, O = null, R = null, H = void 0, j = null, z = !!y.dynamicChildren) => {
    if (v === y)
      return;
    v && !Yt(v, y) && ($ = Qn(v), He(v, O, R, !0), v = null), y.patchFlag === -2 && (z = !1, y.dynamicChildren = null);
    const { type: D, ref: ee, shapeFlag: W } = y;
    switch (D) {
      case Ui:
        b(v, y, S, $);
        break;
      case Ee:
        x(v, y, S, $);
        break;
      case di:
        v == null && w(y, S, $, H);
        break;
      case ye:
        E(
          v,
          y,
          S,
          $,
          O,
          R,
          H,
          j,
          z
        );
        break;
      default:
        W & 1 ? M(
          v,
          y,
          S,
          $,
          O,
          R,
          H,
          j,
          z
        ) : W & 6 ? P(
          v,
          y,
          S,
          $,
          O,
          R,
          H,
          j,
          z
        ) : (W & 64 || W & 128) && D.process(
          v,
          y,
          S,
          $,
          O,
          R,
          H,
          j,
          z,
          _n
        );
    }
    ee != null && O ? Ln(ee, v && v.ref, R, y || v, !y) : ee == null && v && v.ref != null && Ln(v.ref, null, R, v, !0);
  }, b = (v, y, S, $) => {
    if (v == null)
      i(
        y.el = a(y.children),
        S,
        $
      );
    else {
      const O = y.el = v.el;
      y.children !== v.children && u(O, y.children);
    }
  }, x = (v, y, S, $) => {
    v == null ? i(
      y.el = l(y.children || ""),
      S,
      $
    ) : y.el = v.el;
  }, w = (v, y, S, $) => {
    [v.el, v.anchor] = p(
      v.children,
      y,
      S,
      $,
      v.el,
      v.anchor
    );
  }, k = ({ el: v, anchor: y }, S, $) => {
    let O;
    for (; v && v !== y; )
      O = h(v), i(v, S, $), v = O;
    i(y, S, $);
  }, _ = ({ el: v, anchor: y }) => {
    let S;
    for (; v && v !== y; )
      S = h(v), s(v), v = S;
    s(y);
  }, M = (v, y, S, $, O, R, H, j, z) => {
    if (y.type === "svg" ? H = "svg" : y.type === "math" && (H = "mathml"), v == null)
      C(
        y,
        S,
        $,
        O,
        R,
        H,
        j,
        z
      );
    else {
      const D = v.el && v.el._isVueCE ? v.el : null;
      try {
        D && D._beginPatch(), F(
          v,
          y,
          O,
          R,
          H,
          j,
          z
        );
      } finally {
        D && D._endPatch();
      }
    }
  }, C = (v, y, S, $, O, R, H, j) => {
    let z, D;
    const { props: ee, shapeFlag: W, transition: J, dirs: ie } = v;
    if (z = v.el = o(
      v.type,
      R,
      ee && ee.is,
      ee
    ), W & 8 ? c(z, v.children) : W & 16 && V(
      v.children,
      z,
      null,
      $,
      O,
      ss(v, R),
      H,
      j
    ), ie && Vt(v, null, $, "created"), T(z, v, v.scopeId, H, $), ee) {
      for (const ge in ee)
        ge !== "value" && !Pn(ge) && r(z, ge, null, ee[ge], R, $);
      "value" in ee && r(z, "value", null, ee.value, R), (D = ee.onVnodeBeforeMount) && ht(D, $, v);
    }
    ie && Vt(v, null, $, "beforeMount");
    const ce = _u(O, J);
    ce && J.beforeEnter(z), i(z, y, S), ((D = ee && ee.onVnodeMounted) || ce || ie) && Oe(() => {
      D && ht(D, $, v), ce && J.enter(z), ie && Vt(v, null, $, "mounted");
    }, O);
  }, T = (v, y, S, $, O) => {
    if (S && f(v, S), $)
      for (let R = 0; R < $.length; R++)
        f(v, $[R]);
    if (O) {
      let R = O.subTree;
      if (y === R || Va(R.type) && (R.ssContent === y || R.ssFallback === y)) {
        const H = O.vnode;
        T(
          v,
          H,
          H.scopeId,
          H.slotScopeIds,
          O.parent
        );
      }
    }
  }, V = (v, y, S, $, O, R, H, j, z = 0) => {
    for (let D = z; D < v.length; D++) {
      const ee = v[D] = j ? kt(v[D]) : mt(v[D]);
      m(
        null,
        ee,
        y,
        S,
        $,
        O,
        R,
        H,
        j
      );
    }
  }, F = (v, y, S, $, O, R, H) => {
    const j = y.el = v.el;
    let { patchFlag: z, dynamicChildren: D, dirs: ee } = y;
    z |= v.patchFlag & 16;
    const W = v.props || fe, J = y.props || fe;
    let ie;
    if (S && qt(S, !1), (ie = J.onVnodeBeforeUpdate) && ht(ie, S, y, v), ee && Vt(y, v, S, "beforeUpdate"), S && qt(S, !0), (W.innerHTML && J.innerHTML == null || W.textContent && J.textContent == null) && c(j, ""), D ? L(
      v.dynamicChildren,
      D,
      j,
      S,
      $,
      ss(y, O),
      R
    ) : H || ae(
      v,
      y,
      j,
      null,
      S,
      $,
      ss(y, O),
      R,
      !1
    ), z > 0) {
      if (z & 16)
        N(j, W, J, S, O);
      else if (z & 2 && W.class !== J.class && r(j, "class", null, J.class, O), z & 4 && r(j, "style", W.style, J.style, O), z & 8) {
        const ce = y.dynamicProps;
        for (let ge = 0; ge < ce.length; ge++) {
          const ve = ce[ge], We = W[ve], Ve = J[ve];
          (Ve !== We || ve === "value") && r(j, ve, We, Ve, O, S);
        }
      }
      z & 1 && v.children !== y.children && c(j, y.children);
    } else !H && D == null && N(j, W, J, S, O);
    ((ie = J.onVnodeUpdated) || ee) && Oe(() => {
      ie && ht(ie, S, y, v), ee && Vt(y, v, S, "updated");
    }, $);
  }, L = (v, y, S, $, O, R, H) => {
    for (let j = 0; j < y.length; j++) {
      const z = v[j], D = y[j], ee = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        z.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (z.type === ye || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Yt(z, D) || // - In the case of a component, it could contain anything.
        z.shapeFlag & 198) ? d(z.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          S
        )
      );
      m(
        z,
        D,
        ee,
        null,
        $,
        O,
        R,
        H,
        !0
      );
    }
  }, N = (v, y, S, $, O) => {
    if (y !== S) {
      if (y !== fe)
        for (const R in y)
          !Pn(R) && !(R in S) && r(
            v,
            R,
            y[R],
            null,
            O,
            $
          );
      for (const R in S) {
        if (Pn(R)) continue;
        const H = S[R], j = y[R];
        H !== j && R !== "value" && r(v, R, j, H, O, $);
      }
      "value" in S && r(v, "value", y.value, S.value, O);
    }
  }, E = (v, y, S, $, O, R, H, j, z) => {
    const D = y.el = v ? v.el : a(""), ee = y.anchor = v ? v.anchor : a("");
    let { patchFlag: W, dynamicChildren: J, slotScopeIds: ie } = y;
    ie && (j = j ? j.concat(ie) : ie), v == null ? (i(D, S, $), i(ee, S, $), V(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      y.children || [],
      S,
      ee,
      O,
      R,
      H,
      j,
      z
    )) : W > 0 && W & 64 && J && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    v.dynamicChildren && v.dynamicChildren.length === J.length ? (L(
      v.dynamicChildren,
      J,
      S,
      O,
      R,
      H,
      j
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (y.key != null || O && y === O.subTree) && er(
      v,
      y,
      !0
      /* shallow */
    )) : ae(
      v,
      y,
      S,
      ee,
      O,
      R,
      H,
      j,
      z
    );
  }, P = (v, y, S, $, O, R, H, j, z) => {
    y.slotScopeIds = j, v == null ? y.shapeFlag & 512 ? O.ctx.activate(
      y,
      S,
      $,
      H,
      z
    ) : I(
      y,
      S,
      $,
      O,
      R,
      H,
      z
    ) : q(v, y, z);
  }, I = (v, y, S, $, O, R, H) => {
    const j = v.component = Au(
      v,
      $,
      O
    );
    if (Wi(v) && (j.ctx.renderer = _n), Pu(j, !1, H), j.asyncDep) {
      if (O && O.registerDep(j, oe, H), !v.el) {
        const z = j.subTree = G(Ee);
        x(null, z, y, S), v.placeholder = z.el;
      }
    } else
      oe(
        j,
        v,
        y,
        S,
        O,
        R,
        H
      );
  }, q = (v, y, S) => {
    const $ = y.component = v.component;
    if (uu(v, y, S))
      if ($.asyncDep && !$.asyncResolved) {
        K($, y, S);
        return;
      } else
        $.next = y, $.update();
    else
      y.el = v.el, $.vnode = y;
  }, oe = (v, y, S, $, O, R, H) => {
    const j = () => {
      if (v.isMounted) {
        let { next: W, bu: J, u: ie, parent: ce, vnode: ge } = v;
        {
          const dt = Ha(v);
          if (dt) {
            W && (W.el = ge.el, K(v, W, H)), dt.asyncDep.then(() => {
              Oe(() => {
                v.isUnmounted || D();
              }, O);
            });
            return;
          }
        }
        let ve = W, We;
        qt(v, !1), W ? (W.el = ge.el, K(v, W, H)) : W = ge, J && Yi(J), (We = W.props && W.props.onVnodeBeforeUpdate) && ht(We, ce, W, ge), qt(v, !0);
        const Ve = Lr(v), ut = v.subTree;
        v.subTree = Ve, m(
          ut,
          Ve,
          // parent may have changed if it's in a teleport
          d(ut.el),
          // anchor may have changed if it's in a fragment
          Qn(ut),
          v,
          O,
          R
        ), W.el = Ve.el, ve === null && du(v, Ve.el), ie && Oe(ie, O), (We = W.props && W.props.onVnodeUpdated) && Oe(
          () => ht(We, ce, W, ge),
          O
        );
      } else {
        let W;
        const { el: J, props: ie } = y, { bm: ce, m: ge, parent: ve, root: We, type: Ve } = v, ut = un(y);
        qt(v, !1), ce && Yi(ce), !ut && (W = ie && ie.onVnodeBeforeMount) && ht(W, ve, y), qt(v, !0);
        {
          We.ce && We.ce._hasShadowRoot() && We.ce._injectChildStyle(Ve);
          const dt = v.subTree = Lr(v);
          m(
            null,
            dt,
            S,
            $,
            v,
            O,
            R
          ), y.el = dt.el;
        }
        if (ge && Oe(ge, O), !ut && (W = ie && ie.onVnodeMounted)) {
          const dt = y;
          Oe(
            () => ht(W, ve, dt),
            O
          );
        }
        (y.shapeFlag & 256 || ve && un(ve.vnode) && ve.vnode.shapeFlag & 256) && v.a && Oe(v.a, O), v.isMounted = !0, y = S = $ = null;
      }
    };
    v.scope.on();
    const z = v.effect = new Vo(j);
    v.scope.off();
    const D = v.update = z.run.bind(z), ee = v.job = z.runIfDirty.bind(z);
    ee.i = v, ee.id = v.uid, z.scheduler = () => Ys(ee), qt(v, !0), D();
  }, K = (v, y, S) => {
    y.component = v;
    const $ = v.vnode.props;
    v.vnode = y, v.next = null, hu(v, y.props, $, S), gu(v, y.children, S), At(), wr(v), Pt();
  }, ae = (v, y, S, $, O, R, H, j, z = !1) => {
    const D = v && v.children, ee = v ? v.shapeFlag : 0, W = y.children, { patchFlag: J, shapeFlag: ie } = y;
    if (J > 0) {
      if (J & 128) {
        Ie(
          D,
          W,
          S,
          $,
          O,
          R,
          H,
          j,
          z
        );
        return;
      } else if (J & 256) {
        ue(
          D,
          W,
          S,
          $,
          O,
          R,
          H,
          j,
          z
        );
        return;
      }
    }
    ie & 8 ? (ee & 16 && yn(D, O, R), W !== D && c(S, W)) : ee & 16 ? ie & 16 ? Ie(
      D,
      W,
      S,
      $,
      O,
      R,
      H,
      j,
      z
    ) : yn(D, O, R, !0) : (ee & 8 && c(S, ""), ie & 16 && V(
      W,
      S,
      $,
      O,
      R,
      H,
      j,
      z
    ));
  }, ue = (v, y, S, $, O, R, H, j, z) => {
    v = v || an, y = y || an;
    const D = v.length, ee = y.length, W = Math.min(D, ee);
    let J;
    for (J = 0; J < W; J++) {
      const ie = y[J] = z ? kt(y[J]) : mt(y[J]);
      m(
        v[J],
        ie,
        S,
        null,
        O,
        R,
        H,
        j,
        z
      );
    }
    D > ee ? yn(
      v,
      O,
      R,
      !0,
      !1,
      W
    ) : V(
      y,
      S,
      $,
      O,
      R,
      H,
      j,
      z,
      W
    );
  }, Ie = (v, y, S, $, O, R, H, j, z) => {
    let D = 0;
    const ee = y.length;
    let W = v.length - 1, J = ee - 1;
    for (; D <= W && D <= J; ) {
      const ie = v[D], ce = y[D] = z ? kt(y[D]) : mt(y[D]);
      if (Yt(ie, ce))
        m(
          ie,
          ce,
          S,
          null,
          O,
          R,
          H,
          j,
          z
        );
      else
        break;
      D++;
    }
    for (; D <= W && D <= J; ) {
      const ie = v[W], ce = y[J] = z ? kt(y[J]) : mt(y[J]);
      if (Yt(ie, ce))
        m(
          ie,
          ce,
          S,
          null,
          O,
          R,
          H,
          j,
          z
        );
      else
        break;
      W--, J--;
    }
    if (D > W) {
      if (D <= J) {
        const ie = J + 1, ce = ie < ee ? y[ie].el : $;
        for (; D <= J; )
          m(
            null,
            y[D] = z ? kt(y[D]) : mt(y[D]),
            S,
            ce,
            O,
            R,
            H,
            j,
            z
          ), D++;
      }
    } else if (D > J)
      for (; D <= W; )
        He(v[D], O, R, !0), D++;
    else {
      const ie = D, ce = D, ge = /* @__PURE__ */ new Map();
      for (D = ce; D <= J; D++) {
        const Ge = y[D] = z ? kt(y[D]) : mt(y[D]);
        Ge.key != null && ge.set(Ge.key, D);
      }
      let ve, We = 0;
      const Ve = J - ce + 1;
      let ut = !1, dt = 0;
      const wn = new Array(Ve);
      for (D = 0; D < Ve; D++) wn[D] = 0;
      for (D = ie; D <= W; D++) {
        const Ge = v[D];
        if (We >= Ve) {
          He(Ge, O, R, !0);
          continue;
        }
        let ft;
        if (Ge.key != null)
          ft = ge.get(Ge.key);
        else
          for (ve = ce; ve <= J; ve++)
            if (wn[ve - ce] === 0 && Yt(Ge, y[ve])) {
              ft = ve;
              break;
            }
        ft === void 0 ? He(Ge, O, R, !0) : (wn[ft - ce] = D + 1, ft >= dt ? dt = ft : ut = !0, m(
          Ge,
          y[ft],
          S,
          null,
          O,
          R,
          H,
          j,
          z
        ), We++);
      }
      const pr = ut ? wu(wn) : an;
      for (ve = pr.length - 1, D = Ve - 1; D >= 0; D--) {
        const Ge = ce + D, ft = y[Ge], vr = y[Ge + 1], mr = Ge + 1 < ee ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          vr.el || Wa(vr)
        ) : $;
        wn[D] === 0 ? m(
          null,
          ft,
          S,
          mr,
          O,
          R,
          H,
          j,
          z
        ) : ut && (ve < 0 || D !== pr[ve] ? Te(ft, S, mr, 2) : ve--);
      }
    }
  }, Te = (v, y, S, $, O = null) => {
    const { el: R, type: H, transition: j, children: z, shapeFlag: D } = v;
    if (D & 6) {
      Te(v.component.subTree, y, S, $);
      return;
    }
    if (D & 128) {
      v.suspense.move(y, S, $);
      return;
    }
    if (D & 64) {
      H.move(v, y, S, _n);
      return;
    }
    if (H === ye) {
      i(R, y, S);
      for (let W = 0; W < z.length; W++)
        Te(z[W], y, S, $);
      i(v.anchor, y, S);
      return;
    }
    if (H === di) {
      k(v, y, S);
      return;
    }
    if ($ !== 2 && D & 1 && j)
      if ($ === 0)
        j.beforeEnter(R), i(R, y, S), Oe(() => j.enter(R), O);
      else {
        const { leave: W, delayLeave: J, afterLeave: ie } = j, ce = () => {
          v.ctx.isUnmounted ? s(R) : i(R, y, S);
        }, ge = () => {
          R._isLeaving && R[vt](
            !0
            /* cancelled */
          ), W(R, () => {
            ce(), ie && ie();
          });
        };
        J ? J(R, ce, ge) : ge();
      }
    else
      i(R, y, S);
  }, He = (v, y, S, $ = !1, O = !1) => {
    const {
      type: R,
      props: H,
      ref: j,
      children: z,
      dynamicChildren: D,
      shapeFlag: ee,
      patchFlag: W,
      dirs: J,
      cacheIndex: ie
    } = v;
    if (W === -2 && (O = !1), j != null && (At(), Ln(j, null, S, v, !0), Pt()), ie != null && (y.renderCache[ie] = void 0), ee & 256) {
      y.ctx.deactivate(v);
      return;
    }
    const ce = ee & 1 && J, ge = !un(v);
    let ve;
    if (ge && (ve = H && H.onVnodeBeforeUnmount) && ht(ve, y, v), ee & 6)
      Rl(v.component, S, $);
    else {
      if (ee & 128) {
        v.suspense.unmount(S, $);
        return;
      }
      ce && Vt(v, null, y, "beforeUnmount"), ee & 64 ? v.type.remove(
        v,
        y,
        S,
        _n,
        $
      ) : D && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !D.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (R !== ye || W > 0 && W & 64) ? yn(
        D,
        y,
        S,
        !1,
        !0
      ) : (R === ye && W & 384 || !O && ee & 16) && yn(z, y, S), $ && bn(v);
    }
    (ge && (ve = H && H.onVnodeUnmounted) || ce) && Oe(() => {
      ve && ht(ve, y, v), ce && Vt(v, null, y, "unmounted");
    }, S);
  }, bn = (v) => {
    const { type: y, el: S, anchor: $, transition: O } = v;
    if (y === ye) {
      Ll(S, $);
      return;
    }
    if (y === di) {
      _(v);
      return;
    }
    const R = () => {
      s(S), O && !O.persisted && O.afterLeave && O.afterLeave();
    };
    if (v.shapeFlag & 1 && O && !O.persisted) {
      const { leave: H, delayLeave: j } = O, z = () => H(S, R);
      j ? j(v.el, R, z) : z();
    } else
      R();
  }, Ll = (v, y) => {
    let S;
    for (; v !== y; )
      S = h(v), s(v), v = S;
    s(y);
  }, Rl = (v, y, S) => {
    const { bum: $, scope: O, job: R, subTree: H, um: j, m: z, a: D } = v;
    $r(z), $r(D), $ && Yi($), O.stop(), R && (R.flags |= 8, He(H, v, y, S)), j && Oe(j, y), Oe(() => {
      v.isUnmounted = !0;
    }, y);
  }, yn = (v, y, S, $ = !1, O = !1, R = 0) => {
    for (let H = R; H < v.length; H++)
      He(v[H], y, S, $, O);
  }, Qn = (v) => {
    if (v.shapeFlag & 6)
      return Qn(v.component.subTree);
    if (v.shapeFlag & 128)
      return v.suspense.next();
    const y = h(v.anchor || v.el), S = y && y[va];
    return S ? h(S) : y;
  };
  let Xi = !1;
  const hr = (v, y, S) => {
    let $;
    v == null ? y._vnode && (He(y._vnode, null, null, !0), $ = y._vnode.component) : m(
      y._vnode || null,
      v,
      y,
      null,
      null,
      null,
      S
    ), y._vnode = v, Xi || (Xi = !0, wr($), da(), Xi = !1);
  }, _n = {
    p: m,
    um: He,
    m: Te,
    r: bn,
    mt: I,
    mc: V,
    pc: ae,
    pbc: L,
    n: Qn,
    o: t
  };
  return {
    render: hr,
    hydrate: void 0,
    createApp: su(hr)
  };
}
function ss({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function qt({ effect: t, job: e }, n) {
  n ? (t.flags |= 32, e.flags |= 4) : (t.flags &= -33, e.flags &= -5);
}
function _u(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function er(t, e, n = !1) {
  const i = t.children, s = e.children;
  if (Z(i) && Z(s))
    for (let r = 0; r < i.length; r++) {
      const o = i[r];
      let a = s[r];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = s[r] = kt(s[r]), a.el = o.el), !n && a.patchFlag !== -2 && er(o, a)), a.type === Ui && (a.patchFlag === -1 && (a = s[r] = kt(a)), a.el = o.el), a.type === Ee && !a.el && (a.el = o.el);
    }
}
function wu(t) {
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
function Ha(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : Ha(e);
}
function $r(t) {
  if (t)
    for (let e = 0; e < t.length; e++)
      t[e].flags |= 8;
}
function Wa(t) {
  if (t.placeholder)
    return t.placeholder;
  const e = t.component;
  return e ? Wa(e.subTree) : null;
}
const Va = (t) => t.__isSuspense;
function xu(t, e) {
  e && e.pendingBranch ? Z(t) ? e.effects.push(...t) : e.effects.push(t) : Tc(t);
}
const ye = /* @__PURE__ */ Symbol.for("v-fgt"), Ui = /* @__PURE__ */ Symbol.for("v-txt"), Ee = /* @__PURE__ */ Symbol.for("v-cmt"), di = /* @__PURE__ */ Symbol.for("v-stc"), Dn = [];
let Ne = null;
function A(t = !1) {
  Dn.push(Ne = t ? null : []);
}
function Su() {
  Dn.pop(), Ne = Dn[Dn.length - 1] || null;
}
let pn = 1;
function Ci(t, e = !1) {
  pn += t, t < 0 && Ne && e && (Ne.hasOnce = !0);
}
function qa(t) {
  return t.dynamicChildren = pn > 0 ? Ne || an : null, Su(), pn > 0 && Ne && Ne.push(t), t;
}
function Q(t, e, n, i, s, r) {
  return qa(
    X(
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
function Y(t, e, n, i, s) {
  return qa(
    G(
      t,
      e,
      n,
      i,
      s,
      !0
    )
  );
}
function jn(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Yt(t, e) {
  return t.type === e.type && t.key === e.key;
}
const Ua = ({ key: t }) => t ?? null, fi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? we(t) || /* @__PURE__ */ Ce(t) || ne(t) ? { i: Ae, r: t, k: e, f: !!n } : t : null);
function X(t, e = null, n = null, i = 0, s = null, r = t === ye ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Ua(e),
    ref: e && fi(e),
    scopeId: ha,
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
    ctx: Ae
  };
  return a ? (tr(l, n), r & 128 && t.normalize(l)) : n && (l.shapeFlag |= we(n) ? 8 : 16), pn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ne && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ne.push(l), l;
}
const G = ku;
function ku(t, e = null, n = null, i = 0, s = null, r = !1) {
  if ((!t || t === Ca) && (t = Ee), jn(t)) {
    const a = It(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && tr(a, n), pn > 0 && !r && Ne && (a.shapeFlag & 6 ? Ne[Ne.indexOf(t)] = a : Ne.push(a)), a.patchFlag = -2, a;
  }
  if (Lu(t) && (t = t.__vccOpts), e) {
    e = Ka(e);
    let { class: a, style: l } = e;
    a && !we(a) && (e.class = Je(a)), pe(l) && (/* @__PURE__ */ Ni(l) && !Z(l) && (l = Se({}, l)), e.style = Ot(l));
  }
  const o = we(t) ? 1 : Va(t) ? 128 : ma(t) ? 64 : pe(t) ? 4 : ne(t) ? 2 : 0;
  return X(
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
function Ka(t) {
  return t ? /* @__PURE__ */ Ni(t) || $a(t) ? Se({}, t) : t : null;
}
function It(t, e, n = !1, i = !1) {
  const { props: s, ref: r, patchFlag: o, children: a, transition: l } = t, u = e ? je(s || {}, e) : s, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: u,
    key: u && Ua(u),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? Z(r) ? r.concat(fi(e)) : [r, fi(e)] : fi(e)
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
    patchFlag: e && t.type !== ye ? o === -1 ? 16 : o | 16 : o,
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
  return l && i && Bn(
    c,
    l.clone(c)
  ), c;
}
function Ye(t = " ", e = 0) {
  return G(Ui, null, t, e);
}
function Cu(t, e) {
  const n = G(di, null, t);
  return n.staticCount = e, n;
}
function le(t = "", e = !1) {
  return e ? (A(), Y(Ee, null, t)) : G(Ee, null, t);
}
function mt(t) {
  return t == null || typeof t == "boolean" ? G(Ee) : Z(t) ? G(
    ye,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : jn(t) ? kt(t) : G(Ui, null, String(t));
}
function kt(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : It(t);
}
function tr(t, e) {
  let n = 0;
  const { shapeFlag: i } = t;
  if (e == null)
    e = null;
  else if (Z(e))
    n = 16;
  else if (typeof e == "object")
    if (i & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), tr(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !$a(e) ? e._ctx = Ae : s === 3 && Ae && (Ae.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else ne(e) ? (e = { default: e, _ctx: Ae }, n = 32) : (e = String(e), i & 64 ? (n = 16, e = [Ye(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function je(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    for (const s in i)
      if (s === "class")
        e.class !== i.class && (e.class = Je([e.class, i.class]));
      else if (s === "style")
        e.style = Ot([e.style, i.style]);
      else if (Oi(s)) {
        const r = e[s], o = i[s];
        o && r !== o && !(Z(r) && r.includes(o)) && (e[s] = r ? [].concat(r, o) : o);
      } else s !== "" && (e[s] = i[s]);
  }
  return e;
}
function ht(t, e, n, i = null) {
  lt(t, e, 7, [
    n,
    i
  ]);
}
const Tu = Ma();
let Eu = 0;
function Au(t, e, n) {
  const i = t.type, s = (e ? e.appContext : t.appContext) || Tu, r = {
    uid: Eu++,
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
    scope: new jo(
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
    propsOptions: za(i, s),
    emitsOptions: Oa(i, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: fe,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: fe,
    data: fe,
    props: fe,
    attrs: fe,
    slots: fe,
    refs: fe,
    setupState: fe,
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
  return r.ctx = { _: r }, r.root = e ? e.root : r, r.emit = ou.bind(null, r), t.ce && t.ce(r), r;
}
let De = null;
const tt = () => De || Ae;
let Ti, Os;
{
  const t = Fi(), e = (n, i) => {
    let s;
    return (s = t[n]) || (s = t[n] = []), s.push(i), (r) => {
      s.length > 1 ? s.forEach((o) => o(r)) : s[0](r);
    };
  };
  Ti = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => De = n
  ), Os = e(
    "__VUE_SSR_SETTERS__",
    (n) => Hn = n
  );
}
const Yn = (t) => {
  const e = De;
  return Ti(t), t.scope.on(), () => {
    t.scope.off(), Ti(e);
  };
}, Fr = () => {
  De && De.scope.off(), Ti(null);
};
function Ga(t) {
  return t.vnode.shapeFlag & 4;
}
let Hn = !1;
function Pu(t, e = !1, n = !1) {
  e && Os(e);
  const { props: i, children: s } = t.vnode, r = Ga(t);
  fu(t, i, r, e), mu(t, s, n || e);
  const o = r ? Mu(t, e) : void 0;
  return e && Os(!1), o;
}
function Mu(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = new Proxy(t.ctx, Xc);
  const { setup: i } = n;
  if (i) {
    At();
    const s = t.setupContext = i.length > 1 ? Ya(t) : null, r = Yn(t), o = Xn(
      i,
      t,
      0,
      [
        t.props,
        s
      ]
    ), a = Do(o);
    if (Pt(), r(), (a || t.sp) && !un(t) && Sa(t), a) {
      if (o.then(Fr, Fr), e)
        return o.then((l) => {
          zr(t, l);
        }).catch((l) => {
          ji(l, t, 0);
        });
      t.asyncDep = o;
    } else
      zr(t, o);
  } else
    Xa(t);
}
function zr(t, e, n) {
  ne(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : pe(e) && (t.setupState = oa(e)), Xa(t);
}
function Xa(t, e, n) {
  const i = t.type;
  t.render || (t.render = i.render || gt);
  {
    const s = Yn(t);
    At();
    try {
      Zc(t);
    } finally {
      Pt(), s();
    }
  }
}
const Iu = {
  get(t, e) {
    return Re(t, "get", ""), t[e];
  }
};
function Ya(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    attrs: new Proxy(t.attrs, Iu),
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Ki(t) {
  return t.exposed ? t.exposeProxy || (t.exposeProxy = new Proxy(oa(sa(t.exposed)), {
    get(e, n) {
      if (n in e)
        return e[n];
      if (n in Rn)
        return Rn[n](t);
    },
    has(e, n) {
      return n in e || n in Rn;
    }
  })) : t.proxy;
}
function Ou(t, e = !0) {
  return ne(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Lu(t) {
  return ne(t) && "__vccOpts" in t;
}
const B = (t, e) => /* @__PURE__ */ wc(t, e, Hn);
function bt(t, e, n) {
  try {
    Ci(-1);
    const i = arguments.length;
    return i === 2 ? pe(e) && !Z(e) ? jn(e) ? G(t, null, [e]) : G(t, e) : G(t, null, e) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && jn(n) && (n = [n]), G(t, e, n));
  } finally {
    Ci(1);
  }
}
function Ru(t, e) {
  const n = t.memo;
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (Fe(n[i], e[i]))
      return !1;
  return pn > 0 && Ne && Ne.push(t), !0;
}
const Du = "3.5.28";
let Ls;
const Br = typeof window < "u" && window.trustedTypes;
if (Br)
  try {
    Ls = /* @__PURE__ */ Br.createPolicy("vue", {
      createHTML: (t) => t
    });
  } catch {
  }
const Ja = Ls ? (t) => Ls.createHTML(t) : (t) => t, $u = "http://www.w3.org/2000/svg", Fu = "http://www.w3.org/1998/Math/MathML", St = typeof document < "u" ? document : null, Nr = St && /* @__PURE__ */ St.createElement("template"), zu = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, i) => {
    const s = e === "svg" ? St.createElementNS($u, t) : e === "mathml" ? St.createElementNS(Fu, t) : n ? St.createElement(t, { is: n }) : St.createElement(t);
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
      Nr.innerHTML = Ja(
        i === "svg" ? `<svg>${t}</svg>` : i === "mathml" ? `<math>${t}</math>` : t
      );
      const a = Nr.content;
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
}, Dt = "transition", kn = "animation", Wn = /* @__PURE__ */ Symbol("_vtc"), Za = {
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
}, Bu = /* @__PURE__ */ Se(
  {},
  ba,
  Za
), Nu = (t) => (t.displayName = "Transition", t.props = Bu, t), nr = /* @__PURE__ */ Nu(
  (t, { slots: e }) => bt($c, ju(t), e)
), Ut = (t, e = []) => {
  Z(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, jr = (t) => t ? Z(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function ju(t) {
  const e = {};
  for (const E in t)
    E in Za || (e[E] = t[E]);
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
  } = t, p = Hu(s), m = p && p[0], b = p && p[1], {
    onBeforeEnter: x,
    onEnter: w,
    onEnterCancelled: k,
    onLeave: _,
    onLeaveCancelled: M,
    onBeforeAppear: C = x,
    onAppear: T = w,
    onAppearCancelled: V = k
  } = e, F = (E, P, I, q) => {
    E._enterCancelled = q, Kt(E, P ? c : a), Kt(E, P ? u : o), I && I();
  }, L = (E, P) => {
    E._isLeaving = !1, Kt(E, d), Kt(E, f), Kt(E, h), P && P();
  }, N = (E) => (P, I) => {
    const q = E ? T : w, oe = () => F(P, E, I);
    Ut(q, [P, oe]), Hr(() => {
      Kt(P, E ? l : r), xt(P, E ? c : a), jr(q) || Wr(P, i, m, oe);
    });
  };
  return Se(e, {
    onBeforeEnter(E) {
      Ut(x, [E]), xt(E, r), xt(E, o);
    },
    onBeforeAppear(E) {
      Ut(C, [E]), xt(E, l), xt(E, u);
    },
    onEnter: N(!1),
    onAppear: N(!0),
    onLeave(E, P) {
      E._isLeaving = !0;
      const I = () => L(E, P);
      xt(E, d), E._enterCancelled ? (xt(E, h), Ur(E)) : (Ur(E), xt(E, h)), Hr(() => {
        E._isLeaving && (Kt(E, d), xt(E, f), jr(_) || Wr(E, i, b, I));
      }), Ut(_, [E, I]);
    },
    onEnterCancelled(E) {
      F(E, !1, void 0, !0), Ut(k, [E]);
    },
    onAppearCancelled(E) {
      F(E, !0, void 0, !0), Ut(V, [E]);
    },
    onLeaveCancelled(E) {
      L(E), Ut(M, [E]);
    }
  });
}
function Hu(t) {
  if (t == null)
    return null;
  if (pe(t))
    return [rs(t.enter), rs(t.leave)];
  {
    const e = rs(t);
    return [e, e];
  }
}
function rs(t) {
  return _s(t);
}
function xt(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[Wn] || (t[Wn] = /* @__PURE__ */ new Set())).add(e);
}
function Kt(t, e) {
  e.split(/\s+/).forEach((i) => i && t.classList.remove(i));
  const n = t[Wn];
  n && (n.delete(e), n.size || (t[Wn] = void 0));
}
function Hr(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Wu = 0;
function Wr(t, e, n, i) {
  const s = t._endId = ++Wu, r = () => {
    s === t._endId && i();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: o, timeout: a, propCount: l } = Vu(t, e);
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
function Vu(t, e) {
  const n = window.getComputedStyle(t), i = (p) => (n[p] || "").split(", "), s = i(`${Dt}Delay`), r = i(`${Dt}Duration`), o = Vr(s, r), a = i(`${kn}Delay`), l = i(`${kn}Duration`), u = Vr(a, l);
  let c = null, d = 0, h = 0;
  e === Dt ? o > 0 && (c = Dt, d = o, h = r.length) : e === kn ? u > 0 && (c = kn, d = u, h = l.length) : (d = Math.max(o, u), c = d > 0 ? o > u ? Dt : kn : null, h = c ? c === Dt ? r.length : l.length : 0);
  const f = c === Dt && /\b(?:transform|all)(?:,|$)/.test(
    i(`${Dt}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: h,
    hasTransform: f
  };
}
function Vr(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, i) => qr(n) + qr(t[i])));
}
function qr(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function Ur(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
function qu(t, e, n) {
  const i = t[Wn];
  i && (e = (e ? [e, ...i] : [...i]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const Ei = /* @__PURE__ */ Symbol("_vod"), Qa = /* @__PURE__ */ Symbol("_vsh"), Uu = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(t, { value: e }, { transition: n }) {
    t[Ei] = t.style.display === "none" ? "" : t.style.display, n && e ? n.beforeEnter(t) : Cn(t, e);
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
  t.style.display = e ? t[Ei] : "none", t[Qa] = !e;
}
const Ku = /* @__PURE__ */ Symbol(""), Gu = /(?:^|;)\s*display\s*:/;
function Xu(t, e, n) {
  const i = t.style, s = we(n);
  let r = !1;
  if (n && !s) {
    if (e)
      if (we(e))
        for (const o of e.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && hi(i, a, "");
        }
      else
        for (const o in e)
          n[o] == null && hi(i, o, "");
    for (const o in n)
      o === "display" && (r = !0), hi(i, o, n[o]);
  } else if (s) {
    if (e !== n) {
      const o = i[Ku];
      o && (n += ";" + o), i.cssText = n, r = Gu.test(n);
    }
  } else e && t.removeAttribute("style");
  Ei in t && (t[Ei] = r ? i.display : "", t[Qa] && (i.display = "none"));
}
const Kr = /\s*!important$/;
function hi(t, e, n) {
  if (Z(n))
    n.forEach((i) => hi(t, e, i));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const i = Yu(t, e);
    Kr.test(n) ? t.setProperty(
      Ue(i),
      n.replace(Kr, ""),
      "important"
    ) : t[i] = n;
  }
}
const Gr = ["Webkit", "Moz", "ms"], os = {};
function Yu(t, e) {
  const n = os[e];
  if (n)
    return n;
  let i = Pe(e);
  if (i !== "filter" && i in t)
    return os[e] = i;
  i = $i(i);
  for (let s = 0; s < Gr.length; s++) {
    const r = Gr[s] + i;
    if (r in t)
      return os[e] = r;
  }
  return e;
}
const Xr = "http://www.w3.org/1999/xlink";
function Yr(t, e, n, i, s, r = Ul(e)) {
  i && e.startsWith("xlink:") ? n == null ? t.removeAttributeNS(Xr, e.slice(6, e.length)) : t.setAttributeNS(Xr, e, n) : n == null || r && !zo(n) ? t.removeAttribute(e) : t.setAttribute(
    e,
    r ? "" : ot(n) ? String(n) : n
  );
}
function Jr(t, e, n, i, s) {
  if (e === "innerHTML" || e === "textContent") {
    n != null && (t[e] = e === "innerHTML" ? Ja(n) : n);
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
    a === "boolean" ? n = zo(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  o && t.removeAttribute(s || e);
}
function Ju(t, e, n, i) {
  t.addEventListener(e, n, i);
}
function Zu(t, e, n, i) {
  t.removeEventListener(e, n, i);
}
const Zr = /* @__PURE__ */ Symbol("_vei");
function Qu(t, e, n, i, s = null) {
  const r = t[Zr] || (t[Zr] = {}), o = r[e];
  if (i && o)
    o.value = i;
  else {
    const [a, l] = ed(e);
    if (i) {
      const u = r[e] = id(
        i,
        s
      );
      Ju(t, a, u, l);
    } else o && (Zu(t, a, o, l), r[e] = void 0);
  }
}
const Qr = /(?:Once|Passive|Capture)$/;
function ed(t) {
  let e;
  if (Qr.test(t)) {
    e = {};
    let i;
    for (; i = t.match(Qr); )
      t = t.slice(0, t.length - i[0].length), e[i[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Ue(t.slice(2)), e];
}
let as = 0;
const td = /* @__PURE__ */ Promise.resolve(), nd = () => as || (td.then(() => as = 0), as = Date.now());
function id(t, e) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    lt(
      sd(i, n.value),
      e,
      5,
      [i]
    );
  };
  return n.value = t, n.attached = nd(), n;
}
function sd(t, e) {
  if (Z(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map(
      (i) => (s) => !s._stopped && i && i(s)
    );
  } else
    return e;
}
const eo = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, rd = (t, e, n, i, s, r) => {
  const o = s === "svg";
  e === "class" ? qu(t, i, o) : e === "style" ? Xu(t, n, i) : Oi(e) ? Hs(e) || Qu(t, e, n, i, r) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : od(t, e, i, o)) ? (Jr(t, e, i), !t.tagName.includes("-") && (e === "value" || e === "checked" || e === "selected") && Yr(t, e, i, o, r, e !== "value")) : /* #11081 force set props for possible async custom element */ t._isVueCE && (/[A-Z]/.test(e) || !we(i)) ? Jr(t, Pe(e), i, r, e) : (e === "true-value" ? t._trueValue = i : e === "false-value" && (t._falseValue = i), Yr(t, e, i, o));
};
function od(t, e, n, i) {
  if (i)
    return !!(e === "innerHTML" || e === "textContent" || e in t && eo(e) && ne(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "autocorrect" || e === "sandbox" && t.tagName === "IFRAME" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return eo(e) && we(n) ? !1 : e in t;
}
const to = {};
// @__NO_SIDE_EFFECTS__
function ad(t, e, n) {
  let i = /* @__PURE__ */ te(t, e);
  Li(i) && (i = Se({}, i, e));
  class s extends ir {
    constructor(o) {
      super(i, o, n);
    }
  }
  return s.def = i, s;
}
const ld = typeof HTMLElement < "u" ? HTMLElement : class {
};
class ir extends ld {
  constructor(e, n = {}, i = io) {
    super(), this._def = e, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && i !== io ? this._root = this.shadowRoot : e.shadowRoot !== !1 ? (this.attachShadow(
      Se({}, e.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this;
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let e = this;
    for (; e = e && (e.parentNode || e.host); )
      if (e instanceof ir) {
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
    this._connected = !1, ct(() => {
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
      if (r && !Z(r))
        for (const l in r) {
          const u = r[l];
          (u === Number || u && u.type === Number) && (l in this._props && (this._props[l] = _s(this._props[l])), (a || (a = /* @__PURE__ */ Object.create(null)))[Pe(l)] = !0);
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
        he(this, i) || Object.defineProperty(this, i, {
          // unwrap ref to be consistent with public instance behavior
          get: () => g(n[i])
        });
  }
  _resolveProps(e) {
    const { props: n } = e, i = Z(n) ? n : Object.keys(n || {});
    for (const s of Object.keys(this))
      s[0] !== "_" && i.includes(s) && this._setProp(s, this[s]);
    for (const s of i.map(Pe))
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
    let i = n ? this.getAttribute(e) : to;
    const s = Pe(e);
    n && this._numberProps && this._numberProps[s] && (i = _s(i)), this._setProp(s, i, !1, !0);
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
    if (n !== this._props[e] && (this._dirty = !0, n === to ? delete this._props[e] : (this._props[e] = n, e === "key" && this._app && (this._app._ceVNode.key = n)), s && this._instance && this._update(), i)) {
      const r = this._ob;
      r && (this._processMutations(r.takeRecords()), r.disconnect()), n === !0 ? this.setAttribute(Ue(e), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(Ue(e), n + "") : n || this.removeAttribute(Ue(e)), r && r.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const e = this._createVNode();
    this._app && (e.appContext = this._app._context), pd(e, this._root);
  }
  _createVNode() {
    const e = {};
    this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
    const n = G(this._def, Se(e, this._props));
    return this._instance || (n.ce = (i) => {
      this._instance = i, i.ce = this, i.isCE = !0;
      const s = (r, o) => {
        this.dispatchEvent(
          new CustomEvent(
            r,
            Li(o[0]) ? Se({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      i.emit = (r, ...o) => {
        s(r, o), Ue(r) !== r && s(Ue(r), o);
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
const cd = ["ctrl", "shift", "alt", "meta"], ud = {
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
  exact: (t, e) => cd.some((n) => t[`${n}Key`] && !e.includes(n))
}, sr = (t, e) => {
  if (!t) return t;
  const n = t._withMods || (t._withMods = {}), i = e.join(".");
  return n[i] || (n[i] = ((s, ...r) => {
    for (let o = 0; o < e.length; o++) {
      const a = ud[e[o]];
      if (a && a(s, e)) return;
    }
    return t(s, ...r);
  }));
}, dd = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, fd = (t, e) => {
  const n = t._withKeys || (t._withKeys = {}), i = e.join(".");
  return n[i] || (n[i] = ((s) => {
    if (!("key" in s))
      return;
    const r = Ue(s.key);
    if (e.some(
      (o) => o === r || dd[o] === r
    ))
      return t(s);
  }));
}, hd = /* @__PURE__ */ Se({ patchProp: rd }, zu);
let no;
function el() {
  return no || (no = bu(hd));
}
const pd = ((...t) => {
  el().render(...t);
}), io = ((...t) => {
  const e = el().createApp(...t), { mount: n } = e;
  return e.mount = (i) => {
    const s = md(i);
    if (!s) return;
    const r = e._component;
    !ne(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const o = n(s, !1, vd(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, e;
});
function vd(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function md(t) {
  return we(t) ? document.querySelector(t) : t;
}
const gd = '@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Medium.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:600;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-SemiBold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Next;font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleNext-Bold.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Regular.woff2) format("woff2")}@font-face{font-family:Atkinson Hyperlegible Mono;font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/AtkinsonHyperlegibleMono-Medium.woff2) format("woff2")}', bd = ["aria-label"], yd = /* @__PURE__ */ te({
  __name: "EditorBadge",
  props: {
    ariaLabel: { type: String }
  },
  setup(t) {
    return (e, n) => (A(), Q("span", {
      class: "editor-badge",
      "aria-label": t.ariaLabel
    }, [
      _e(e.$slots, "default", {}, void 0, !0)
    ], 8, bd));
  }
}), _d = ".editor-badge[data-v-3d3f8eba]{display:inline-flex;align-items:center;padding:2px var(--spacing-sm);font-size:var(--font-size-xs);font-weight:500;color:var(--color-text-muted);background-color:var(--color-surface);border:1px solid var(--color-border-light);border-radius:var(--radius-sm);white-space:nowrap}", xe = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [i, s] of e)
    n[i] = s;
  return n;
}, so = /* @__PURE__ */ xe(yd, [["styles", [_d]], ["__scopeId", "data-v-3d3f8eba"]]);
const wd = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ro = (t) => t === "";
const xd = (...t) => t.filter((e, n, i) => !!e && e.trim() !== "" && i.indexOf(e) === n).join(" ").trim();
const oo = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Sd = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, i) => i ? i.toUpperCase() : n.toLowerCase()
);
const kd = (t) => {
  const e = Sd(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Tn = {
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
const Cd = ({
  name: t,
  iconNode: e,
  absoluteStrokeWidth: n,
  "absolute-stroke-width": i,
  strokeWidth: s,
  "stroke-width": r,
  size: o = Tn.width,
  color: a = Tn.stroke,
  ...l
}, { slots: u }) => bt(
  "svg",
  {
    ...Tn,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": ro(n) || ro(i) || n === !0 || i === !0 ? Number(s || r || Tn["stroke-width"]) * 24 / Number(o) : s || r || Tn["stroke-width"],
    class: xd(
      "lucide",
      l.class,
      ...t ? [`lucide-${oo(kd(t))}-icon`, `lucide-${oo(t)}`] : ["lucide-icon"]
    ),
    ...!u.default && !wd(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => bt(...c)), ...u.default ? [u.default()] : []]
);
const Me = (t, e) => (n, { slots: i, attrs: s }) => bt(
  Cd,
  {
    ...s,
    ...n,
    iconNode: e,
    name: t
  },
  i
);
const Td = Me("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const tl = Me("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Ed = Me("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Ad = Me("clipboard-list", [
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
const Pd = Me("clipboard-type", [
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
const Md = Me("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Id = Me("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const ao = Me("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Od = Me("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Ld = Me("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Rd = Me("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Dd = Me("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const $d = Me("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Fd = Me("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const zd = Me("volume-2", [
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
const Bd = Me("volume-x", [
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
const rr = Me("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Nd = {
  "arrow-down": Td,
  check: tl,
  "chevron-down": Ed,
  "clipboard-list": Ad,
  "clipboard-type": Pd,
  copy: Md,
  download: Id,
  pause: Od,
  play: Ld,
  settings: Rd,
  "skip-back": Dd,
  "skip-forward": $d,
  users: Fd,
  volume: zd,
  "volume-mute": Bd,
  x: rr,
  "circle-notch": ao,
  spinner: ao
};
function Rs(t) {
  if (t)
    return Nd[t];
}
const nl = {
  sm: 16,
  md: 20,
  lg: 24
}, jd = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Hd = /* @__PURE__ */ te({
  __name: "EditorIcon",
  props: {
    name: { type: String },
    size: { type: Number },
    spin: { type: Boolean }
  },
  setup(t) {
    const e = t, n = B(() => Rs(e.name)), i = B(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (s, r) => n.value ? (A(), Y(Ta(n.value), {
      key: 0,
      style: Ot(i.value),
      class: Je(["editor-icon", { "editor-icon--spin": t.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (A(), Q("span", jd, "?"));
  }
}), Wd = ".editor-icon[data-v-210c7f09]{flex-shrink:0}.editor-icon--missing[data-v-210c7f09]{display:inline-flex;align-items:center;justify-content:center;opacity:.5;font-size:1em;line-height:1}.editor-icon--spin[data-v-210c7f09]{animation:editor-icon-spin-210c7f09 1s linear infinite}@keyframes editor-icon-spin-210c7f09{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.editor-icon--spin[data-v-210c7f09]{animation:none}}", pi = /* @__PURE__ */ xe(Hd, [["styles", [Wd]], ["__scopeId", "data-v-210c7f09"]]), Vd = ["type", "disabled", "aria-disabled", "aria-label"], qd = {
  key: 3,
  class: "editor-btn__label"
}, Ud = /* @__PURE__ */ te({
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
    const e = t, n = Yc(), i = B(() => !!Rs(e.icon)), s = B(() => !!Rs(e.iconRight)), r = B(() => nl[e.size]), o = B(() => e.disabled || e.loading), a = B(() => !!e.label || !!n.default), l = B(
      () => e.loading || i.value || !!n.icon
    ), u = B(() => l.value && !a.value), c = B(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      u.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, h) => (A(), Q("button", {
      type: t.type,
      class: Je(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": t.ariaLabel
    }, [
      t.loading ? (A(), Y(pi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: r.value
      }, null, 8, ["size"])) : i.value ? (A(), Y(pi, {
        key: 1,
        name: t.icon,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? _e(d.$slots, "icon", { key: 2 }, void 0, !0) : le("", !0),
      a.value ? (A(), Q("span", qd, [
        _e(d.$slots, "default", {}, () => [
          Ye(re(t.label), 1)
        ], !0)
      ])) : le("", !0),
      s.value ? (A(), Y(pi, {
        key: 4,
        name: t.iconRight,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? _e(d.$slots, "icon-right", { key: 5 }, void 0, !0) : le("", !0)
    ], 10, Vd));
  }
}), Kd = ".editor-btn[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary);--btn-padding-y: 0;--btn-padding-x: var(--spacing-sm);--btn-font-size: var(--font-size-xs);--btn-height: 32px;--btn-gap: var(--spacing-xs);display:inline-flex;align-items:center;justify-content:center;gap:var(--btn-gap);box-sizing:border-box;height:var(--btn-height);padding:var(--btn-padding-y) var(--btn-padding-x);font-family:var(--font-family);font-size:var(--btn-font-size);font-weight:500;line-height:1;color:var(--btn-text);background-color:var(--btn-bg);border:1px solid var(--btn-border-color);border-radius:var(--radius-sm);cursor:pointer;white-space:nowrap;transition:background-color var(--transition-duration),color var(--transition-duration),border-color var(--transition-duration)}.editor-btn[data-v-88f77497]:hover:not(:disabled){background-color:var(--btn-hover-bg);color:var(--btn-hover-text)}.editor-btn[data-v-88f77497]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.editor-btn[data-v-88f77497]:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.editor-btn__label[data-v-88f77497]{text-overflow:ellipsis;text-box:cap alphabetic}.editor-btn--md[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-sm);--btn-height: 40px}.editor-btn--lg[data-v-88f77497]{--btn-padding-y: 0;--btn-padding-x: var(--spacing-md);--btn-font-size: var(--font-size-base);--btn-height: 44px}.editor-btn--icon-only[data-v-88f77497]{width:var(--btn-height);padding:0}.editor-btn--block[data-v-88f77497]{display:flex;width:100%}.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-primary);--btn-text: var(--color-white);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary-hover);--btn-hover-text: var(--color-white)}.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-primary);--btn-border-color: var(--color-primary);--btn-hover-bg: var(--color-primary);--btn-hover-text: var(--color-white)}.editor-btn--tertiary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-primary);--btn-border-color: var(--color-border);--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--transparent[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-text-secondary);--btn-border-color: transparent;--btn-hover-bg: var(--color-surface-hover);--btn-hover-text: var(--color-text-primary)}.editor-btn--destructive.editor-btn--primary[data-v-88f77497]{--btn-bg: var(--color-danger);--btn-text: var(--color-white);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger-hover);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--secondary[data-v-88f77497]{--btn-bg: transparent;--btn-text: var(--color-danger);--btn-border-color: var(--color-danger);--btn-hover-bg: var(--color-danger);--btn-hover-text: var(--color-white)}.editor-btn--destructive.editor-btn--tertiary[data-v-88f77497],.editor-btn--destructive.editor-btn--transparent[data-v-88f77497]{--btn-text: var(--color-danger);--btn-hover-bg: var(--color-danger-soft);--btn-hover-text: var(--color-danger)}", et = /* @__PURE__ */ xe(Ud, [["styles", [Kd]], ["__scopeId", "data-v-88f77497"]]), il = {
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
  "sidebar.voicePlayback": "Lecture vocale",
  "voicePlayback.enable": "Lire à voix haute",
  "voicePlayback.description": "Utilise la synthèse vocale par défaut du navigateur.",
  "voicePlayback.unavailable": "Aucune voix de synthèse n'est disponible dans ce navigateur.",
  "transcription.empty": "Aucune transcription pour le moment",
  "transcription.historyStart": "Début de la transcription",
  "transcription.loadingHistory": "Chargement…",
  "selection.count": "sélectionné(s)",
  "selection.copyText": "Copier le texte",
  "selection.copyWithMetadata": "Copier avec les timestamps",
  "selection.cancel": "Annuler",
  "selection.select": "Sélectionner {name}",
  "selection.deselect": "Désélectionner {name}"
}, Gd = {
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
  "sidebar.voicePlayback": "Voice playback",
  "voicePlayback.enable": "Read aloud",
  "voicePlayback.description": "Uses the browser's default speech synthesis.",
  "voicePlayback.unavailable": "No speech synthesis voice is available in this browser.",
  "transcription.empty": "No transcription yet",
  "transcription.historyStart": "Beginning of transcription",
  "transcription.loadingHistory": "Loading…",
  "selection.count": "selected",
  "selection.copyText": "Copy text",
  "selection.copyWithMetadata": "Copy with timestamps",
  "selection.cancel": "Cancel",
  "selection.select": "Select {name}",
  "selection.deselect": "Deselect {name}"
}, lo = { fr: il, en: Gd }, sl = /* @__PURE__ */ Symbol("i18n");
function Xd(t) {
  const e = B(() => {
    const i = lo[t.value] ?? lo.fr;
    return (s) => i[s] ?? s;
  }), n = {
    t: (i) => e.value(i),
    locale: t
  };
  return vn(sl, n), n;
}
function nt() {
  const t = Et(sl);
  if (t) return t;
  const e = B(() => "fr");
  return {
    t: (n) => il[n] ?? n,
    locale: e
  };
}
function Yd(t, e) {
  const n = t.replace("#", ""), i = parseInt(n.substring(0, 2), 16), s = parseInt(n.substring(2, 4), 16), r = parseInt(n.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${r}, ${e})`;
}
function Ai(t) {
  return t.split("-")[0];
}
function Pi(t, e) {
  return t == null || e == null ? !1 : Ai(t) === Ai(e);
}
function or(t, e, n = "*", i = !0) {
  if (t === "*") return n;
  const s = i ? t.split("-")[0] ?? t : t;
  try {
    const r = new Intl.DisplayNames([e], { type: "language" });
    return r.of(s) ?? r.of(t.split("-")[0] ?? t) ?? t;
  } catch {
    return t;
  }
}
function Jd(t, e, n, i = "*", s = "") {
  return [...t].sort(
    (o, a) => Number(a.isSource) - Number(o.isSource)
  ).map((o) => {
    const a = !o.isSource && o.languages.length > 1;
    return {
      value: o.id,
      label: o.isSource ? n : a && s ? s : o.languages.map((l) => or(l, e, i, !1)).join(", ")
    };
  });
}
function Zd(t, e = 250) {
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
function Vn(t) {
  const e = Math.floor(t), n = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), s = e % 60, r = String(i).padStart(2, "0"), o = String(s).padStart(2, "0");
  return n > 0 ? `${n}:${r}:${o}` : `${r}:${o}`;
}
function Qd(t, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t * 1e3));
}
class qe extends Error {
  path;
  constructor(e, n) {
    super(`${e}: ${n}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function ef(t) {
  if (t == null || typeof t != "object")
    throw new qe("document", "must be a non-null object");
  const e = t;
  if (typeof e.title != "string")
    throw new qe("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new qe("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new qe("document.channels", "must be an array");
  for (let n = 0; n < e.channels.length; n++) {
    const i = e.channels[n], s = `channels[${n}]`;
    if (i == null || typeof i != "object")
      throw new qe(s, "must be a non-null object");
    if (typeof i.id != "string")
      throw new qe(`${s}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new qe(`${s}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new qe(`${s}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new qe(`${s}.translations`, "must be an array");
    for (let r = 0; r < i.translations.length; r++) {
      const o = i.translations[r], a = `${s}.translations[${r}]`;
      if (o == null || typeof o != "object")
        throw new qe(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new qe(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new qe(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new qe(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new qe(`${a}.turns`, "must be an array");
    }
  }
}
function tf(t, e) {
  const { width: n, height: i } = e.canvas, s = t[0], r = s.length / n, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < n; a += o * 2) {
    const l = Math.floor(a * r), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0), c = c + o, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0);
  }
  e.stroke(), e.closePath();
}
function rl(t) {
  return t.length > 0 && t[0].startTime !== void 0;
}
function nf(t, e) {
  if (!rl(t)) return null;
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
const sf = { class: "editor-header" }, rf = { class: "header-left" }, of = { class: "document-title" }, af = { class: "badges" }, lf = ["datetime"], cf = { class: "header-right" }, uf = /* @__PURE__ */ te({
  __name: "EditorHeader",
  props: {
    title: { type: String },
    duration: { type: Number },
    language: { type: String },
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(t) {
    const e = t, { t: n, locale: i } = nt(), s = B(() => or(e.language, i.value, n("language.wildcard"))), r = B(() => Vn(e.duration)), o = B(() => e.title.replace(/-/g, " "));
    return (a, l) => (A(), Q("header", sf, [
      X("div", rf, [
        X("h1", of, re(o.value), 1),
        X("div", af, [
          G(so, null, {
            default: se(() => [
              Ye(re(s.value), 1)
            ]),
            _: 1
          }),
          G(so, null, {
            default: se(() => [
              X("time", {
                datetime: `PT${t.duration}S`
              }, re(r.value), 9, lf)
            ]),
            _: 1
          })
        ])
      ]),
      X("div", cf, [
        t.isMobile ? (A(), Y(et, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": g(n)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : le("", !0),
        t.isMobile ? (A(), Y(et, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": g(n)("header.export")
        }, null, 8, ["aria-label"])) : (A(), Y(et, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: se(() => [
            Ye(re(g(n)("header.export")), 1)
          ]),
          _: 1
        })),
        G(et, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": g(n)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), df = ".editor-header[data-v-c5fd975f]{display:flex;align-items:center;justify-content:space-between;padding:0 var(--spacing-lg);height:var(--header-height);border-bottom:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.header-left[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-md);min-width:0}.document-title[data-v-c5fd975f]{font-size:var(--font-size-lg);font-weight:600;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.badges[data-v-c5fd975f]{display:flex;gap:var(--spacing-xs);flex-shrink:0}.header-right[data-v-c5fd975f]{display:flex;align-items:center;gap:var(--spacing-sm);flex-shrink:0}@media(max-width:767px){.editor-header[data-v-c5fd975f]{padding:0 var(--spacing-md);height:48px}.badges[data-v-c5fd975f]{display:none}.document-title[data-v-c5fd975f]{font-size:var(--font-size-base)}}", ff = /* @__PURE__ */ xe(uf, [["styles", [df]], ["__scopeId", "data-v-c5fd975f"]]), ls = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, hf = 70, pf = 1e3 / 60, vf = 350;
let vi = !1, co = !1;
function mf() {
  co || typeof document > "u" || (document.addEventListener("mousedown", () => {
    vi = !0;
  }), document.addEventListener("mouseup", () => {
    vi = !1;
  }), document.addEventListener("click", () => {
    vi = !1;
  }), co = !0);
}
const cs = /* @__PURE__ */ new Map();
function us(...t) {
  const e = {
    damping: ls.damping,
    stiffness: ls.stiffness,
    mass: ls.mass
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
  return cs.has(i) || cs.set(i, Object.freeze({ ...e })), n ? "instant" : cs.get(i);
}
function gf(t = {}) {
  mf();
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
    const L = r();
    for (const N of n) N(L);
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
  function a(L) {
    i.scrollElement && (i.scrollElement.scrollTop = L, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const L = i.scrollElement, N = i.contentElement;
    return !L || !N ? 0 : L.scrollHeight - 1 - L.clientHeight;
  }
  let u;
  function c() {
    const L = i.scrollElement, N = i.contentElement;
    if (!L || !N)
      return 0;
    const E = l();
    if (!e.targetScrollTop)
      return E;
    if (u?.targetScrollTop === E)
      return u.calculatedScrollTop;
    const P = Math.max(
      Math.min(
        e.targetScrollTop(E, {
          scrollElement: L,
          contentElement: N
        }),
        E
      ),
      0
    );
    return u = { targetScrollTop: E, calculatedScrollTop: P }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), P;
  }
  function d() {
    return c() - o();
  }
  function h() {
    return d() <= hf;
  }
  function f(L) {
    i.isAtBottom = L, s();
  }
  function p(L) {
    i.escapedFromLock = L, s();
  }
  function m(L) {
    i.isNearBottom = L, s();
  }
  function b() {
    if (!vi || typeof window > "u")
      return !1;
    const L = window.getSelection?.();
    if (!L || !L.rangeCount)
      return !1;
    const N = L.getRangeAt(0), E = i.scrollElement;
    if (!E)
      return !1;
    const P = N.commonAncestorContainer;
    return !!(P && (E.contains(P) || P.contains(E)));
  }
  const x = (L) => {
    if (L.target !== i.scrollElement)
      return;
    const N = o(), E = i.ignoreScrollToTop;
    let P = i.lastScrollTop ?? N;
    i.lastScrollTop = N, i.ignoreScrollToTop = void 0, E && E > N && (P = E), m(h()), setTimeout(() => {
      if (i.resizeDifference || N === E)
        return;
      if (b()) {
        p(!0), f(!1);
        return;
      }
      const I = N > P, q = N < P;
      if (i.animation?.ignoreEscapes) {
        a(P);
        return;
      }
      q && (p(!0), f(!1)), I && p(!1), !i.escapedFromLock && h() && f(!0);
    }, 1);
  }, w = (L) => {
    const N = i.scrollElement;
    if (!N)
      return;
    let E = L.target;
    for (; E && !["scroll", "auto"].includes(getComputedStyle(E).overflow); ) {
      if (!E.parentElement)
        return;
      E = E.parentElement;
    }
    E === N && L.deltaY < 0 && N.scrollHeight > N.clientHeight && !i.animation?.ignoreEscapes && (p(!0), f(!1));
  };
  function k(L, N) {
    _(), i.scrollElement = L, i.contentElement = N, getComputedStyle(L).overflow === "visible" && (L.style.overflow = "auto"), L.addEventListener("scroll", x, { passive: !0 }), L.addEventListener("wheel", w, { passive: !0 });
    let E;
    i.resizeObserver = new ResizeObserver((P) => {
      const I = P[0];
      if (!I)
        return;
      const { height: q } = I.contentRect, oe = q - (E ?? q);
      if (i.resizeDifference = oe, o() > l() && a(l()), m(h()), oe >= 0) {
        const K = us(
          e,
          E ? e.resize : e.initial
        );
        T({
          animation: K,
          wait: !0,
          preserveScrollPosition: !0,
          duration: K === "instant" ? void 0 : vf
        });
      } else
        h() && (p(!1), f(!0));
      E = q, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === oe && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(N);
  }
  function _() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", x), i.scrollElement.removeEventListener("wheel", w)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function M() {
    _(), n.clear();
  }
  function C(L) {
    e = { ...e, ...L };
  }
  function T(L = {}) {
    const N = typeof L == "string" ? { animation: L } : L;
    N.preserveScrollPosition || f(!0);
    const E = Date.now() + (Number(N.wait) || 0), P = us(e, N.animation), { ignoreEscapes: I = !1 } = N;
    let q, oe = c();
    N.duration instanceof Promise ? N.duration.finally(() => {
      q = Date.now();
    }) : q = E + (N.duration ?? 0);
    const K = async () => {
      const ae = new Promise((ue) => {
        if (typeof requestAnimationFrame > "u") {
          ue(!1);
          return;
        }
        requestAnimationFrame(() => ue(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const ue = o(), Ie = typeof performance < "u" ? performance.now() : Date.now(), Te = (Ie - (i.lastTick ?? Ie)) / pf;
        if (i.animation ||= { behavior: P, promise: ae, ignoreEscapes: I }, i.animation.behavior === P && (i.lastTick = Ie), b() || E > Date.now())
          return K();
        if (ue < Math.min(oe, c())) {
          if (i.animation?.behavior === P) {
            if (P === "instant")
              return a(c()), K();
            const He = P;
            i.velocity = (He.damping * i.velocity + He.stiffness * d()) / He.mass, i.accumulated += i.velocity * Te;
            const bn = o();
            a(bn + i.accumulated), o() !== bn && (i.accumulated = 0);
          }
          return K();
        }
        return q > Date.now() ? (oe = c(), K()) : (i.animation = void 0, o() < c() ? T({
          animation: us(e, e.resize),
          ignoreEscapes: I,
          duration: Math.max(0, q - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return ae.then((ue) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ue));
    };
    return N.wait !== !0 && (i.animation = void 0), i.animation?.behavior === P ? i.animation.promise : K();
  }
  const V = () => {
    p(!0), f(!1);
  };
  function F(L) {
    return n.add(L), () => n.delete(L);
  }
  return {
    attach: k,
    detach: _,
    destroy: M,
    setOptions: C,
    getState: r,
    onChange: F,
    scrollToBottom: T,
    stopScroll: V
  };
}
function bf(t = {}) {
  const e = /* @__PURE__ */ U(null), n = /* @__PURE__ */ U(null), i = /* @__PURE__ */ U(t.initial !== !1), s = /* @__PURE__ */ U(!1), r = /* @__PURE__ */ U(!1), o = gf(t);
  let a = null;
  return Nt((l) => {
    !e.value || !n.value || (o.attach(e.value, n.value), a = o.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, r.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), _t(() => {
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
const yf = /* @__PURE__ */ te({
  __name: "SpeakerIndicator",
  props: {
    color: { type: String }
  },
  setup(t) {
    return (e, n) => (A(), Q("span", {
      class: "speaker-indicator",
      style: Ot({ backgroundColor: t.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), _f = ".speaker-indicator[data-v-9bffeda8]{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0}", ol = /* @__PURE__ */ xe(yf, [["styles", [_f]], ["__scopeId", "data-v-9bffeda8"]]), wf = { class: "speaker-label" }, xf = {
  key: 1,
  class: "speaker-name"
}, Sf = ["datetime"], kf = { class: "lang" }, Cf = /* @__PURE__ */ te({
  __name: "SpeakerLabel",
  props: {
    speaker: { type: Object },
    startTime: { type: Number },
    startDate: { type: Number },
    language: { type: String }
  },
  setup(t) {
    const e = t, { t: n, locale: i } = nt(), s = B(
      () => or(
        e.language,
        i.value,
        n("language.wildcard")
      )
    ), r = B(() => {
      if (e.startTime != null)
        return {
          text: Vn(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const a = new Date(e.startDate * 1e3);
        return {
          text: Qd(e.startDate, i.value),
          datetime: a.toISOString()
        };
      }
      return null;
    }), o = B(() => e.speaker?.color ?? "transparent");
    return (a, l) => (A(), Q("div", wf, [
      t.speaker ? (A(), Y(ol, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : le("", !0),
      t.speaker ? (A(), Q("span", xf, re(t.speaker.name), 1)) : le("", !0),
      r.value ? (A(), Q("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value.datetime
      }, re(r.value.text), 9, Sf)) : le("", !0),
      X("span", kf, re(s.value), 1)
    ]));
  }
}), Tf = ".speaker-label[data-v-79207560]{display:flex;align-items:center;gap:var(--spacing-sm)}.speaker-name[data-v-79207560]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-primary)}.timestamp[data-v-79207560]{font-size:var(--font-size-xs);font-family:var(--font-family-mono);color:var(--color-text-muted);text-box:trim-both cap alphabetic}.lang[data-v-79207560]{font-size:var(--font-size-xs);font-weight:400;text-box:trim-both cap alphabetic}", Ef = /* @__PURE__ */ xe(Cf, [["styles", [Tf]], ["__scopeId", "data-v-79207560"]]);
function uo(t) {
  return typeof t == "string" ? `'${t}'` : new Af().serialize(t);
}
const Af = /* @__PURE__ */ (function() {
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
function Ds(t, e) {
  return t === e || uo(t) === uo(e);
}
function Jn(t, e) {
  const n = typeof t == "string" && !e ? `${t}Context` : e, i = Symbol(n);
  return [(o) => {
    const a = Et(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(t) ? `one of the following components: ${t.join(", ")}` : `\`${t}\``}`);
  }, (o) => (vn(i, o), o)];
}
function yt() {
  let t = document.activeElement;
  if (t == null) return null;
  for (; t != null && t.shadowRoot != null && t.shadowRoot.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function al(t, e, n) {
  const i = n.originalEvent.target, s = new CustomEvent(t, {
    bubbles: !1,
    cancelable: !0,
    detail: n
  });
  e && i.addEventListener(t, e, { once: !0 }), i.dispatchEvent(s);
}
function Mi(t) {
  return t == null;
}
function fo(t, e) {
  return Mi(t) ? !1 : Array.isArray(t) ? t.some((n) => Ds(n, e)) : Ds(t, e);
}
function ar(t) {
  return t ? t.flatMap((e) => e.type === ye ? ar(e.children) : [e]) : [];
}
const [Pf] = Jn("ConfigProvider");
function Mf(t, e) {
  return Wo() ? (Gl(t, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function If(t) {
  let e = !1, n;
  const i = Ho(!0);
  return ((...s) => (e || (n = i.run(() => t(...s)), e = !0), n));
}
const jt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Of = (t) => typeof t < "u", Lf = Object.prototype.toString, Rf = (t) => Lf.call(t) === "[object Object]", ho = /* @__PURE__ */ Df();
function Df() {
  var t, e, n;
  return jt && !!(!((t = window) === null || t === void 0 || (t = t.navigator) === null || t === void 0) && t.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((n = window) === null || n === void 0 ? void 0 : n.navigator.userAgent));
}
function ds(t) {
  return Array.isArray(t) ? t : [t];
}
function $f(t) {
  return tt();
}
// @__NO_SIDE_EFFECTS__
function Ff(t) {
  if (!jt) return t;
  let e = 0, n, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), n = void 0, i = void 0);
  };
  return ((...r) => (e += 1, i || (i = Ho(!0), n = i.run(() => t(...r))), Mf(s), n));
}
function zf(t, e) {
  $f() && _t(t, e);
}
function Bf(t, e, n) {
  return me(t, e, {
    ...n,
    immediate: !0
  });
}
const lr = jt ? window : void 0;
function gn(t) {
  var e;
  const n = rt(t);
  return (e = n?.$el) !== null && e !== void 0 ? e : n;
}
function ll(...t) {
  const e = (i, s, r, o) => (i.addEventListener(s, r, o), () => i.removeEventListener(s, r, o)), n = B(() => {
    const i = ds(rt(t[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return Bf(() => {
    var i, s;
    return [
      (i = (s = n.value) === null || s === void 0 ? void 0 : s.map((r) => gn(r))) !== null && i !== void 0 ? i : [lr].filter((r) => r != null),
      ds(rt(n.value ? t[1] : t[0])),
      ds(g(n.value ? t[2] : t[1])),
      rt(n.value ? t[3] : t[2])
    ];
  }, ([i, s, r, o], a, l) => {
    if (!i?.length || !s?.length || !r?.length) return;
    const u = Rf(o) ? { ...o } : o, c = i.flatMap((d) => s.flatMap((h) => r.map((f) => e(d, h, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Nf() {
  const t = /* @__PURE__ */ hn(!1), e = tt();
  return e && Ke(() => {
    t.value = !0;
  }, e), t;
}
function jf(t) {
  return typeof t == "function" ? t : typeof t == "string" ? (e) => e.key === t : Array.isArray(t) ? (e) => t.includes(e.key) : () => !0;
}
function Hf(...t) {
  let e, n, i = {};
  t.length === 3 ? (e = t[0], n = t[1], i = t[2]) : t.length === 2 ? typeof t[1] == "object" ? (e = !0, n = t[0], i = t[1]) : (e = t[0], n = t[1]) : (e = !0, n = t[0]);
  const { target: s = lr, eventName: r = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = jf(e);
  return ll(s, r, (c) => {
    c.repeat && rt(a) || l(c) && n(c);
  }, o);
}
function Wf(t) {
  return JSON.parse(JSON.stringify(t));
}
// @__NO_SIDE_EFFECTS__
function cl(t, e, n, i = {}) {
  var s, r;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = tt(), f = n || h?.emit || (h == null || (s = h.$emit) === null || s === void 0 ? void 0 : s.bind(h)) || (h == null || (r = h.proxy) === null || r === void 0 || (r = r.$emit) === null || r === void 0 ? void 0 : r.bind(h?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : Wf(w) : w, b = () => Of(t[e]) ? m(t[e]) : c, x = (w) => {
    d ? d(w) && f(p, w) : f(p, w);
  };
  if (a) {
    const w = /* @__PURE__ */ U(b());
    let k = !1;
    return me(() => t[e], (_) => {
      k || (k = !0, w.value = m(_), ct(() => k = !1));
    }), me(w, (_) => {
      !k && (_ !== t[e] || u) && x(_);
    }, { deep: u }), w;
  } else return B({
    get() {
      return b();
    },
    set(w) {
      x(w);
    }
  });
}
function fs(t) {
  if (t === null || typeof t != "object")
    return !1;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? !1 : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : !0;
}
function $s(t, e, n = ".", i) {
  if (!fs(e))
    return $s(t, {}, n, i);
  const s = Object.assign({}, e);
  for (const r in t) {
    if (r === "__proto__" || r === "constructor")
      continue;
    const o = t[r];
    o != null && (i && i(s, r, o, n) || (Array.isArray(o) && Array.isArray(s[r]) ? s[r] = [...o, ...s[r]] : fs(o) && fs(s[r]) ? s[r] = $s(
      o,
      s[r],
      (n ? `${n}.` : "") + r.toString(),
      i
    ) : s[r] = o));
  }
  return s;
}
function Vf(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, i) => $s(n, i, "", t), {})
  );
}
const qf = Vf(), Uf = /* @__PURE__ */ Ff(() => {
  const t = /* @__PURE__ */ U(/* @__PURE__ */ new Map()), e = /* @__PURE__ */ U(), n = B(() => {
    for (const o of t.value.values()) if (o) return !0;
    return !1;
  }), i = Pf({ scrollBody: /* @__PURE__ */ U(!0) });
  let s = null;
  const r = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ho && s?.(), e.value = void 0;
  };
  return me(n, (o, a) => {
    if (!jt) return;
    if (!o) {
      a && r();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? qf({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ho && (s = ll(document, "touchmove", (d) => Gf(d), { passive: !1 })), ct(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), t;
});
function Kf(t) {
  const e = Math.random().toString(36).substring(2, 7), n = Uf();
  n.value.set(e, t);
  const i = B({
    get: () => n.value.get(e) ?? !1,
    set: (s) => n.value.set(e, s)
  });
  return zf(() => {
    n.value.delete(e);
  }), i;
}
function ul(t) {
  const e = window.getComputedStyle(t);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && t.clientWidth < t.scrollWidth || e.overflowY === "auto" && t.clientHeight < t.scrollHeight) return !0;
  {
    const n = t.parentNode;
    return !(n instanceof Element) || n.tagName === "BODY" ? !1 : ul(n);
  }
}
function Gf(t) {
  const e = t || window.event, n = e.target;
  return n instanceof Element && ul(n) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function cr(t) {
  const e = tt(), n = e?.type.emits, i = {};
  return n?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), n?.forEach((s) => {
    i[ci(Pe(s))] = (...r) => t(s, ...r);
  }), i;
}
function Xf(t) {
  return B(() => rt(t) ? !!gn(t)?.closest("form") : !0);
}
function it() {
  const t = tt(), e = /* @__PURE__ */ U(), n = B(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : gn(e)), i = Object.assign({}, t.exposed), s = {};
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
var Yf = function(t) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(t) ? t[0] : t;
  return e.ownerDocument.body;
}, sn = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ new WeakMap(), ri = {}, hs = 0, dl = function(t) {
  return t && (t.host || dl(t.parentNode));
}, Jf = function(t, e) {
  return e.map(function(n) {
    if (t.contains(n))
      return n;
    var i = dl(n);
    return i && t.contains(i) ? i : (console.error("aria-hidden", n, "in not contained inside", t, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Zf = function(t, e, n, i) {
  var s = Jf(e, Array.isArray(t) ? t : [t]);
  ri[n] || (ri[n] = /* @__PURE__ */ new WeakMap());
  var r = ri[n], o = [], a = /* @__PURE__ */ new Set(), l = new Set(s), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  s.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var f = h.getAttribute(i), p = f !== null && f !== "false", m = (sn.get(h) || 0) + 1, b = (r.get(h) || 0) + 1;
          sn.set(h, m), r.set(h, b), o.push(h), m === 1 && p && si.set(h, !0), b === 1 && h.setAttribute(n, "true"), p || h.setAttribute(i, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", h, x);
        }
    });
  };
  return c(e), a.clear(), hs++, function() {
    o.forEach(function(d) {
      var h = sn.get(d) - 1, f = r.get(d) - 1;
      sn.set(d, h), r.set(d, f), h || (si.has(d) || d.removeAttribute(i), si.delete(d)), f || d.removeAttribute(n);
    }), hs--, hs || (sn = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ new WeakMap(), ri = {});
  };
}, Qf = function(t, e, n) {
  n === void 0 && (n = "data-aria-hidden");
  var i = Array.from(Array.isArray(t) ? t : [t]), s = Yf(t);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), Zf(i, s, n, "aria-hidden")) : function() {
    return null;
  };
};
function eh(t) {
  let e;
  me(() => gn(t), (n) => {
    n ? e = Qf(n) : e && e();
  }), tn(() => {
    e && e();
  });
}
function Fs(t, e = "reka") {
  return `${e}-${Js?.()}`;
}
function th(t, e) {
  const n = /* @__PURE__ */ U(t);
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
function nh(t, e) {
  const n = /* @__PURE__ */ U({}), i = /* @__PURE__ */ U("none"), s = /* @__PURE__ */ U(t), r = t.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? lr, { state: l, dispatch: u } = th(r, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (b) => {
    if (jt) {
      const x = new CustomEvent(b, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(x);
    }
  };
  me(t, async (b, x) => {
    const w = x !== b;
    if (await ct(), w) {
      const k = i.value, _ = oi(e.value);
      b ? (u("MOUNT"), c("enter"), _ === "none" && c("after-enter")) : _ === "none" || _ === "undefined" || n.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : x && k !== _ ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (b) => {
    const x = oi(e.value), w = x.includes(CSS.escape(b.animationName)), k = l.value === "mounted" ? "enter" : "leave";
    if (b.target === e.value && w && (c(`after-${k}`), u("ANIMATION_END"), !s.value)) {
      const _ = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = _);
      });
    }
    b.target === e.value && x === "none" && u("ANIMATION_END");
  }, h = (b) => {
    b.target === e.value && (i.value = oi(e.value));
  }, f = me(e, (b, x) => {
    b ? (n.value = getComputedStyle(b), b.addEventListener("animationstart", h), b.addEventListener("animationcancel", d), b.addEventListener("animationend", d)) : (u("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), x?.removeEventListener("animationstart", h), x?.removeEventListener("animationcancel", d), x?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = me(l, () => {
    const b = oi(e.value);
    i.value = l.value === "mounted" ? b : "none";
  });
  return tn(() => {
    f(), p();
  }), { isPresent: B(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function oi(t) {
  return t && getComputedStyle(t).animationName || "none";
}
var ur = /* @__PURE__ */ te({
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
    const { present: i, forceMount: s } = /* @__PURE__ */ aa(t), r = /* @__PURE__ */ U(), { isPresent: o } = nh(i, r);
    n({ present: o });
    let a = e.default({ present: o.value });
    a = ar(a || []);
    const l = tt();
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
    return () => s.value || i.value || o.value ? bt(e.default({ present: o.value })[0], { ref: (u) => {
      const c = gn(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? r.value = c.firstElementChild : r.value = c), c;
    } }) : null;
  }
});
const zs = /* @__PURE__ */ te({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(t, { attrs: e, slots: n }) {
    return () => {
      if (!n.default) return null;
      const i = ar(n.default()), s = i.findIndex((l) => l.type !== Ee);
      if (s === -1) return i;
      const r = i[s];
      delete r.props?.ref;
      const o = r.props ? je(e, r.props) : e, a = It({
        ...r,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), ih = [
  "area",
  "img",
  "input"
], Rt = /* @__PURE__ */ te({
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
    return typeof i == "string" && ih.includes(i) ? () => bt(i, e) : i !== "template" ? () => bt(t.as, e, { default: n.default }) : () => bt(zs, e, { default: n.default });
  }
});
function Bs() {
  const t = /* @__PURE__ */ U(), e = B(() => ["#text", "#comment"].includes(t.value?.$el.nodeName) ? t.value?.$el.nextElementSibling : gn(t));
  return {
    primitiveElement: t,
    currentElement: e
  };
}
const [Ht, sh] = Jn("DialogRoot");
var rh = /* @__PURE__ */ te({
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
    const n = t, s = /* @__PURE__ */ cl(n, "open", e, {
      defaultValue: n.defaultOpen,
      passive: n.open === void 0
    }), r = /* @__PURE__ */ U(), o = /* @__PURE__ */ U(), { modal: a } = /* @__PURE__ */ aa(n);
    return sh({
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
    }), (l, u) => _e(l.$slots, "default", {
      open: g(s),
      close: () => s.value = !1
    });
  }
}), oh = rh, ah = /* @__PURE__ */ te({
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
    it();
    const n = Ht();
    return (i, s) => (A(), Y(g(Rt), je(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (r) => g(n).onOpenChange(!1))
    }), {
      default: se(() => [_e(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), lh = ah;
const ch = "dismissableLayer.pointerDownOutside", uh = "dismissableLayer.focusOutside";
function fl(t, e) {
  const n = e.closest("[data-dismissable-layer]"), i = t.dataset.dismissableLayer === "" ? t : t.querySelector("[data-dismissable-layer]"), s = Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(n && (i === n || s.indexOf(i) < s.indexOf(n)));
}
function dh(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ U(!1), r = /* @__PURE__ */ U(() => {
  });
  return Nt((o) => {
    if (!jt || !rt(n)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (fl(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let h = function() {
            al(ch, t, d);
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
    rt(n) && (s.value = !0);
  } };
}
function fh(t, e, n = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = /* @__PURE__ */ U(!1);
  return Nt((r) => {
    if (!jt || !rt(n)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await ct(), await ct();
      const l = a.target;
      !e.value || !l || fl(e.value, l) || a.target && !s.value && al(uh, t, { originalEvent: a });
    };
    i.addEventListener("focusin", o), r(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      rt(n) && (s.value = !0);
    },
    onBlurCapture: () => {
      rt(n) && (s.value = !1);
    }
  };
}
const Qe = /* @__PURE__ */ Kn({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var hh = /* @__PURE__ */ te({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = it(), o = B(() => r.value?.ownerDocument ?? globalThis.document), a = B(() => Qe.layersRoot), l = B(() => r.value ? Array.from(a.value).indexOf(r.value) : -1), u = B(() => Qe.layersWithOutsidePointerEventsDisabled.size > 0), c = B(() => {
      const f = Array.from(a.value), [p] = [...Qe.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(p);
      return l.value >= m;
    }), d = dh(async (f) => {
      const p = [...Qe.branches].some((m) => m?.contains(f.target));
      !c.value || p || (i("pointerDownOutside", f), i("interactOutside", f), await ct(), f.defaultPrevented || i("dismiss"));
    }, r), h = fh((f) => {
      [...Qe.branches].some((m) => m?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, r);
    return Hf("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), Nt((f) => {
      r.value && (n.disableOutsidePointerEvents && (Qe.layersWithOutsidePointerEventsDisabled.size === 0 && (Qe.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Qe.layersWithOutsidePointerEventsDisabled.add(r.value)), a.value.add(r.value), f(() => {
        n.disableOutsidePointerEvents && Qe.layersWithOutsidePointerEventsDisabled.size === 1 && !Mi(Qe.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Qe.originalBodyPointerEvents);
      }));
    }), Nt((f) => {
      f(() => {
        r.value && (a.value.delete(r.value), Qe.layersWithOutsidePointerEventsDisabled.delete(r.value));
      });
    }), (f, p) => (A(), Y(g(Rt), {
      ref: g(s),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: Ot({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: g(h).onFocusCapture,
      onBlurCapture: g(h).onBlurCapture,
      onPointerdownCapture: g(d).onPointerDownCapture
    }, {
      default: se(() => [_e(f.$slots, "default")]),
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
}), ph = hh;
const vh = /* @__PURE__ */ If(() => /* @__PURE__ */ U([]));
function mh() {
  const t = vh();
  return {
    add(e) {
      const n = t.value[0];
      e !== n && n?.pause(), t.value = po(t.value, e), t.value.unshift(e);
    },
    remove(e) {
      t.value = po(t.value, e), t.value[0]?.resume();
    }
  };
}
function po(t, e) {
  const n = [...t], i = n.indexOf(e);
  return i !== -1 && n.splice(i, 1), n;
}
const ps = "focusScope.autoFocusOnMount", vs = "focusScope.autoFocusOnUnmount", vo = {
  bubbles: !1,
  cancelable: !0
};
function gh(t, { select: e = !1 } = {}) {
  const n = yt();
  for (const i of t)
    if ($t(i, { select: e }), yt() !== n) return !0;
}
function bh(t) {
  const e = hl(t), n = mo(e, t), i = mo(e.reverse(), t);
  return [n, i];
}
function hl(t) {
  const e = [], n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; n.nextNode(); ) e.push(n.currentNode);
  return e;
}
function mo(t, e) {
  for (const n of t) if (!yh(n, { upTo: e })) return n;
}
function yh(t, { upTo: e }) {
  if (getComputedStyle(t).visibility === "hidden") return !0;
  for (; t; ) {
    if (e !== void 0 && t === e) return !1;
    if (getComputedStyle(t).display === "none") return !0;
    t = t.parentElement;
  }
  return !1;
}
function _h(t) {
  return t instanceof HTMLInputElement && "select" in t;
}
function $t(t, { select: e = !1 } = {}) {
  if (t && t.focus) {
    const n = yt();
    t.focus({ preventScroll: !0 }), t !== n && _h(t) && e && t.select();
  }
}
var wh = /* @__PURE__ */ te({
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
    const n = t, i = e, { currentRef: s, currentElement: r } = it(), o = /* @__PURE__ */ U(null), a = mh(), l = /* @__PURE__ */ Kn({
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
      function h(b) {
        if (l.paused || !d) return;
        const x = b.target;
        d.contains(x) ? o.value = x : $t(o.value, { select: !0 });
      }
      function f(b) {
        if (l.paused || !d) return;
        const x = b.relatedTarget;
        x !== null && (d.contains(x) || $t(o.value, { select: !0 }));
      }
      function p(b) {
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
      if (await ct(), !d) return;
      a.add(l);
      const h = yt();
      if (!d.contains(h)) {
        const p = new CustomEvent(ps, vo);
        d.addEventListener(ps, (m) => i("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (gh(hl(d), { select: !0 }), yt() === h && $t(d));
      }
      c(() => {
        d.removeEventListener(ps, (b) => i("mountAutoFocus", b));
        const p = new CustomEvent(vs, vo), m = (b) => {
          i("unmountAutoFocus", b);
        };
        d.addEventListener(vs, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || $t(h ?? document.body, { select: !0 }), d.removeEventListener(vs, m), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!n.loop && !n.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = yt();
      if (d && h) {
        const f = c.currentTarget, [p, m] = bh(f);
        p && m ? !c.shiftKey && h === m ? (c.preventDefault(), n.loop && $t(p, { select: !0 })) : c.shiftKey && h === p && (c.preventDefault(), n.loop && $t(m, { select: !0 })) : h === f && c.preventDefault();
      }
    }
    return (c, d) => (A(), Y(g(Rt), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: se(() => [_e(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), xh = wh;
function Sh(t) {
  return t ? "open" : "closed";
}
var kh = /* @__PURE__ */ te({
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
    const n = t, i = e, s = Ht(), { forwardRef: r, currentElement: o } = it();
    return s.titleId ||= Fs(void 0, "reka-dialog-title"), s.descriptionId ||= Fs(void 0, "reka-dialog-description"), Ke(() => {
      s.contentElement = o, yt() !== document.body && (s.triggerElement.value = yt());
    }), (a, l) => (A(), Y(g(xh), {
      "as-child": "",
      loop: "",
      trapped: n.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: se(() => [G(g(ph), je({
        id: g(s).contentId,
        ref: g(r),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": g(s).descriptionId,
        "aria-labelledby": g(s).titleId,
        "data-state": g(Sh)(g(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => g(s).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: se(() => [_e(a.$slots, "default")]),
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
}), pl = kh, Ch = /* @__PURE__ */ te({
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
    const n = t, i = e, s = Ht(), r = cr(i), { forwardRef: o, currentElement: a } = it();
    return eh(a), (l, u) => (A(), Y(pl, je({
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
      default: se(() => [_e(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Th = Ch, Eh = /* @__PURE__ */ te({
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
    const n = t, s = cr(e);
    it();
    const r = Ht(), o = /* @__PURE__ */ U(!1), a = /* @__PURE__ */ U(!1);
    return (l, u) => (A(), Y(pl, je({
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
      default: se(() => [_e(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ah = Eh, Ph = /* @__PURE__ */ te({
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
    const n = t, i = e, s = Ht(), r = cr(i), { forwardRef: o } = it();
    return (a, l) => (A(), Y(g(ur), { present: a.forceMount || g(s).open.value }, {
      default: se(() => [g(s).modal.value ? (A(), Y(Th, je({
        key: 0,
        ref: g(o)
      }, {
        ...n,
        ...g(r),
        ...a.$attrs
      }), {
        default: se(() => [_e(a.$slots, "default")]),
        _: 3
      }, 16)) : (A(), Y(Ah, je({
        key: 1,
        ref: g(o)
      }, {
        ...n,
        ...g(r),
        ...a.$attrs
      }), {
        default: se(() => [_e(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Mh = Ph, Ih = /* @__PURE__ */ te({
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
    return Kf(!0), it(), (n, i) => (A(), Y(g(Rt), {
      as: n.as,
      "as-child": n.asChild,
      "data-state": g(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: se(() => [_e(n.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Oh = Ih, Lh = /* @__PURE__ */ te({
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
    const e = Ht(), { forwardRef: n } = it();
    return (i, s) => g(e)?.modal.value ? (A(), Y(g(ur), {
      key: 0,
      present: i.forceMount || g(e).open.value
    }, {
      default: se(() => [G(Oh, je(i.$attrs, {
        ref: g(n),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: se(() => [_e(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : le("v-if", !0);
  }
}), Rh = Lh, Dh = /* @__PURE__ */ te({
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
    const e = /* @__PURE__ */ Nf();
    return (n, i) => g(e) || n.forceMount ? (A(), Y(Lc, {
      key: 0,
      to: n.to,
      disabled: n.disabled,
      defer: n.defer
    }, [_e(n.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : le("v-if", !0);
  }
}), $h = Dh, Fh = /* @__PURE__ */ te({
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
    return (n, i) => (A(), Y(g($h), Vl(Ka(e)), {
      default: se(() => [_e(n.$slots, "default")]),
      _: 3
    }, 16));
  }
}), zh = Fh, Bh = /* @__PURE__ */ te({
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
    return it(), (i, s) => (A(), Y(g(Rt), je(e, { id: g(n).titleId }), {
      default: se(() => [_e(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Nh = Bh;
const go = "data-reka-collection-item";
function jh(t = {}) {
  const { key: e = "", isProvider: n = !1 } = t, i = `${e}CollectionProvider`;
  let s;
  n ? (s = {
    collectionRef: /* @__PURE__ */ U(),
    itemMap: /* @__PURE__ */ U(/* @__PURE__ */ new Map())
  }, vn(i, s)) : s = Et(i);
  const r = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${go}]`)), p = Array.from(s.itemMap.value.values()).sort((m, b) => h.indexOf(m.ref) - h.indexOf(b.ref));
    return c ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = /* @__PURE__ */ te({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Bs();
      return me(p, () => {
        s.collectionRef.value = p.value;
      }), () => bt(zs, {
        ref: f,
        ...h
      }, d);
    }
  }), a = /* @__PURE__ */ te({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Bs();
      return Nt((m) => {
        if (p.value) {
          const b = sa(p.value);
          s.itemMap.value.set(b, {
            ref: p.value,
            value: c.value
          }), m(() => s.itemMap.value.delete(b));
        }
      }), () => bt(zs, {
        ...h,
        [go]: "",
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
const Hh = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Wh(t, e) {
  return e !== "rtl" ? t : t === "ArrowLeft" ? "ArrowRight" : t === "ArrowRight" ? "ArrowLeft" : t;
}
function Vh(t, e, n) {
  const i = Wh(t.key, n);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Hh[i];
}
function qh(t, e = !1) {
  const n = yt();
  for (const i of t)
    if (i === n || (i.focus({ preventScroll: e }), yt() !== n)) return;
}
function Uh(t, e) {
  return t.map((n, i) => t[(e + i) % t.length]);
}
const [Kh] = Jn("RovingFocusGroup");
var Gh = /* @__PURE__ */ te({
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
    const e = t, n = Kh(), i = Fs(), s = B(() => e.tabStopId || i), r = B(() => n.currentTabStopId.value === s.value), { getItems: o, CollectionItem: a } = jh();
    Ke(() => {
      e.focusable && n.onFocusableItemAdd();
    }), tn(() => {
      e.focusable && n.onFocusableItemRemove();
    });
    function l(u) {
      if (u.key === "Tab" && u.shiftKey) {
        n.onItemShiftTab();
        return;
      }
      if (u.target !== u.currentTarget) return;
      const c = Vh(u, n.orientation.value, n.dir.value);
      if (c !== void 0) {
        if (u.metaKey || u.ctrlKey || u.altKey || !e.allowShiftKey && u.shiftKey) return;
        u.preventDefault();
        let d = [...o().map((h) => h.ref).filter((h) => h.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const h = d.indexOf(u.currentTarget);
          d = n.loop.value ? Uh(d, h + 1) : d.slice(h + 1);
        }
        ct(() => qh(d));
      }
    }
    return (u, c) => (A(), Y(g(a), null, {
      default: se(() => [G(g(Rt), {
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
        default: se(() => [_e(u.$slots, "default")]),
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
}), Xh = Gh, Yh = /* @__PURE__ */ te({
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
    return (e, n) => (A(), Y(g(Rt), {
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
      default: se(() => [_e(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Jh = Yh, Zh = /* @__PURE__ */ te({
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
    const e = t, { primitiveElement: n, currentElement: i } = Bs(), s = B(() => e.checked ?? e.value);
    return me(s, (r, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && r !== o) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, r), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (r, o) => (A(), Y(Jh, je({
      ref_key: "primitiveElement",
      ref: n
    }, {
      ...e,
      ...r.$attrs
    }, { as: "input" }), null, 16));
  }
}), bo = Zh, Qh = /* @__PURE__ */ te({
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
    return (s, r) => (A(), Q(ye, null, [le(" We render single input if it's required "), n.value ? (A(), Y(bo, je({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (A(!0), Q(ye, { key: 1 }, mn(i.value, (o) => (A(), Y(bo, je({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), ep = Qh;
const [tp] = Jn("CheckboxGroupRoot");
function Ii(t) {
  return t === "indeterminate";
}
function vl(t) {
  return Ii(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
const [np, ip] = Jn("CheckboxRoot");
var sp = /* @__PURE__ */ te({
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
    const n = t, i = e, { forwardRef: s, currentElement: r } = it(), o = tp(null), a = /* @__PURE__ */ cl(n, "modelValue", i, {
      defaultValue: n.defaultValue,
      passive: n.modelValue === void 0
    }), l = B(() => o?.disabled.value || n.disabled), u = B(() => Mi(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : fo(o.modelValue.value, n.value));
    function c() {
      if (Mi(o?.modelValue.value))
        a.value = Ii(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (fo(f, n.value)) {
          const p = f.findIndex((m) => Ds(m, n.value));
          f.splice(p, 1);
        } else f.push(n.value);
        o.modelValue.value = f;
      }
    }
    const d = Xf(r), h = B(() => n.id && r.value ? document.querySelector(`[for="${n.id}"]`)?.innerText : void 0);
    return ip({
      disabled: l,
      state: u
    }), (f, p) => (A(), Y(Ta(g(o)?.rovingFocus.value ? g(Xh) : g(Rt)), je(f.$attrs, {
      id: f.id,
      ref: g(s),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": g(Ii)(u.value) ? "mixed" : u.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || h.value,
      "data-state": g(vl)(u.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: g(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: fd(sr(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: se(() => [_e(f.$slots, "default", {
        modelValue: g(a),
        state: u.value
      }), g(d) && f.name && !g(o) ? (A(), Y(g(ep), {
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
      ])) : le("v-if", !0)]),
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
}), rp = sp, op = /* @__PURE__ */ te({
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
    const { forwardRef: e } = it(), n = np();
    return (i, s) => (A(), Y(g(ur), { present: i.forceMount || g(Ii)(g(n).state.value) || g(n).state.value === !0 }, {
      default: se(() => [G(g(Rt), je({
        ref: g(e),
        "data-state": g(vl)(g(n).state.value),
        "data-disabled": g(n).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": i.asChild,
        as: i.as
      }, i.$attrs), {
        default: se(() => [_e(i.$slots, "default")]),
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
}), ap = op;
const lp = /* @__PURE__ */ te({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: { type: String }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (e, n) => (A(), Y(g(rp), {
      "model-value": t.modelValue,
      "aria-label": t.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": n[0] || (n[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: n[1] || (n[1] = sr(() => {
      }, ["stop"]))
    }, {
      default: se(() => [
        G(g(ap), { class: "checkbox-indicator" }, {
          default: se(() => [
            G(g(tl), {
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
}), cp = ".checkbox[data-v-024ee78b]{all:unset;width:16px;height:16px;flex-shrink:0;border:1.5px solid var(--color-border);border-radius:var(--radius-sm);background-color:var(--color-surface);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color var(--transition-duration),border-color var(--transition-duration)}.checkbox[data-v-024ee78b]:hover{border-color:var(--color-primary)}.checkbox[data-v-024ee78b]:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.checkbox[data-state=checked][data-v-024ee78b]{background-color:var(--color-primary);border-color:var(--color-primary)}.checkbox-indicator[data-v-024ee78b]{color:var(--color-white, #fff);display:inline-flex;align-items:center;justify-content:center}", up = /* @__PURE__ */ xe(lp, [["styles", [cp]], ["__scopeId", "data-v-024ee78b"]]);
function dp() {
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
const yo = [
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
function fp(t, e, n) {
  const i = yo[t.size % yo.length];
  return { id: e, name: n, color: i };
}
function hp(t, e, n) {
  return !e || t.has(e) ? null : fp(t, e, n ?? e);
}
function pp(t, e, n) {
  const i = t.get(e);
  return i ? { ...i, ...n } : null;
}
function vp(t) {
  const e = /* @__PURE__ */ Gn(/* @__PURE__ */ new Map());
  function n(r, o) {
    const a = hp(e, r, o);
    a && (e.set(a.id, a), t("speaker:add", { speaker: a }));
  }
  function i(r, o) {
    const a = pp(e, r, o);
    a && (e.set(r, a), t("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: n, update: i, clear: s };
}
function mp(t, e) {
  return [...t, e];
}
function gp(t, e) {
  return [...e, ...t];
}
function dr(t, e) {
  return t.findIndex((n) => n.id === e);
}
function bp(t, e, n) {
  const i = dr(t, e);
  if (i === -1) return null;
  const s = { ...t[i], ...n, id: e }, r = t.slice();
  return r[i] = s, { turns: r, updated: s };
}
function yp(t, e) {
  const n = dr(t, e);
  return n === -1 ? null : t.filter((i, s) => s !== n);
}
function _p(t, e, n) {
  const i = dr(t, e);
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
function Ns(t, e) {
  const n = /* @__PURE__ */ new Set();
  for (const i of t)
    i.speakerId && !n.has(i.speakerId) && (n.add(i.speakerId), e(i.speakerId));
}
function wp(t, e, n) {
  const { id: i, languages: s, isSource: r, audio: o } = t, a = /* @__PURE__ */ hn(t.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const _ = a.value;
    for (let M = 0; M < _.length; M++)
      l.set(_[M].id, M);
  }
  u();
  function c(_) {
    n(_.speakerId), l.set(_.id, a.value.length), a.value = mp(a.value, _), e("turn:add", { turn: _, translationId: i });
  }
  function d(_, M) {
    const C = bp(a.value, _, M);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function h(_) {
    const M = yp(a.value, _);
    M && (a.value = M, u(), e("turn:remove", { turnId: _, translationId: i }));
  }
  function f(_, M) {
    const C = _p(a.value, _, M);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function p(_) {
    Ns(_, n), a.value = gp(a.value, _), u();
  }
  function m(_) {
    Ns(_, n), a.value = _, u(), e("translation:sync", { translationId: i });
  }
  function b(_) {
    a.value = _, u();
  }
  function x(_) {
    const M = l.get(_.id);
    M !== void 0 ? a.value[M] = _ : (l.set(_.id, a.value.length), a.value.push(_));
  }
  function w(_) {
    return l.has(_);
  }
  function k(_) {
    const M = l.get(_);
    if (M !== void 0)
      return a.value[M];
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
    setTurns: m,
    replaceTurns: b,
    updateOrCreateTurnSilent: x,
    hasTurn: w,
    getTurn: k
  };
}
const en = "cross";
function xp(t, e, n, i) {
  const s = t.languages.map(Ai);
  if (s.length !== 2) return null;
  const r = /* @__PURE__ */ new Map();
  for (const m of e.values())
    if (m.id !== t.id) {
      if (m.languages.length !== 1 || !m.languages[0])
        return null;
      r.set(Ai(m.languages[0]), m);
    }
  for (const m of s)
    if (!r.has(m))
      return null;
  const [o, a] = s;
  if (!o || !a) return null;
  const l = /* @__PURE__ */ new Set([
    r.get(o).id,
    r.get(a).id
  ]), u = B(
    () => t.turns.value.map((m) => c(m.id) ?? m)
  );
  function c(m) {
    const b = t.getTurn(m);
    if (!b) return;
    const x = Pi(b.language, o) ? a : o;
    if (!x) return b;
    const w = r.get(x)?.getTurn(m);
    return w || b;
  }
  const d = [];
  function h(m, b) {
    return l.has(b) ? m.sourceLanguage == null ? !0 : !Pi(m.language, m.sourceLanguage) : !1;
  }
  function f(m) {
    d.push(
      i(m, ({ turn: b, translationId: x }) => {
        h(b, x) && n(m, { turn: b, translationId: en });
      })
    );
  }
  f("turn:add"), f("turn:update"), d.push(
    i("turn:remove", ({ turnId: m, translationId: b }) => {
      l.has(b) && n("turn:remove", { turnId: m, translationId: en });
    })
  );
  function p() {
    d.forEach((m) => m()), d.length = 0;
  }
  return {
    id: en,
    isSource: !1,
    languages: t.languages,
    turns: u,
    getTurn: c,
    dispose: p
  };
}
function _o(t, e, n, i) {
  const { id: s, name: r, description: o, duration: a } = t, l = /* @__PURE__ */ Gn(/* @__PURE__ */ new Map());
  let u;
  for (const k of t.translations) {
    const _ = wp(k, e, i);
    l.set(k.id, _), k.isSource && !u && (u = _);
  }
  u || (u = l.values().next().value);
  const c = xp(
    u,
    l,
    e,
    n
  ), d = [...l.values()];
  c && d.push(c);
  const h = /* @__PURE__ */ U(null), f = /* @__PURE__ */ U(!1), p = /* @__PURE__ */ U(!0), m = B(() => {
    const k = h.value;
    return k === en ? c ?? u : k ? l.get(k) ?? u : u;
  });
  function b(k) {
    const _ = k === u.id ? null : k;
    _ !== h.value && (h.value = _, e("translation:change", { translationId: m.value.id }));
  }
  function x() {
    for (const k of l.values())
      k.setTurns([]);
    f.value = !1, p.value = !0, e("channel:reset", { channelId: s });
  }
  function w() {
    c?.dispose();
  }
  return {
    id: s,
    name: r,
    description: o,
    duration: a,
    translations: l,
    sourceTranslation: u,
    crossTranslation: c,
    selectableTranslations: d,
    activeTranslation: m,
    isLoadingHistory: f,
    hasMoreHistory: p,
    setActiveTranslation: b,
    reset: x,
    dispose: w
  };
}
function Sp(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const [i, s] of t.speakers)
    e.add(i), n.push({ id: i, name: s.name });
  for (const i of t.channels)
    for (const s of i.translations)
      for (const r of s.turns)
        r.speakerId && !e.has(r.speakerId) && (e.add(r.speakerId), n.push({ id: r.speakerId, name: r.speakerId }));
  return n;
}
function kp(t = {}) {
  const e = /* @__PURE__ */ U(""), n = /* @__PURE__ */ U(t.activeChannelId ?? ""), i = /* @__PURE__ */ U(
    t.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: r, emit: o, clear: a } = dp(), l = vp(o), u = l, c = /* @__PURE__ */ Gn(/* @__PURE__ */ new Map()), d = B(
    () => c.get(n.value) ?? [...c.values()][0]
  );
  function h(C, T) {
    return s(C, (V) => {
      V.translationId === d.value.activeTranslation.value.id && T(V);
    });
  }
  function f(C) {
    e.value = C.title, l.clear();
    for (const T of c.values()) T.dispose();
    c.clear();
    for (const T of Sp(C))
      u.ensure(T.id, T.name);
    for (const T of C.channels)
      c.set(T.id, _o(T, o, s, u.ensure));
    c.size > 0 && !c.has(n.value) && (n.value = c.keys().next().value);
  }
  function p(C) {
    ef(C), f(C);
  }
  function m(C) {
    C !== n.value && (n.value = C, o("channel:change", { channelId: C }));
  }
  function b(C, T) {
    if (c.has(C)) {
      for (const V of T.translations)
        Ns(V.turns, u.ensure);
      c.get(C)?.dispose(), c.set(C, _o(T, o, s, u.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const x = [], w = [];
  function k(C) {
    C.tiptapExtensions && w.push(...C.tiptapExtensions);
    const T = C.install(M);
    T && x.push(T);
  }
  function _() {
    o("destroy", void 0), x.forEach((C) => C()), x.length = 0;
    for (const C of c.values()) C.dispose();
    a();
  }
  t.document && f(t.document);
  const M = {
    title: e,
    activeChannelId: n,
    capabilities: i,
    pluginExtensions: w,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: p,
    setActiveChannel: m,
    setChannel: b,
    on: s,
    off: r,
    emit: o,
    use: k,
    destroy: _
  };
  return M;
}
const ml = /* @__PURE__ */ Symbol("editorStore");
function Cp(t) {
  vn(ml, t);
}
function Wt() {
  const t = Et(ml);
  if (!t)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return t;
}
const gl = /* @__PURE__ */ Symbol("turnSelection");
function wo(t) {
  return t.words.length > 0 ? t.words.map((e) => e.text).join(" ") : t.text ?? "";
}
function Tp(t, e, n) {
  const i = /* @__PURE__ */ Gn(/* @__PURE__ */ new Map());
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
    const w = t.value.map((T) => T.id), k = w.indexOf(s), _ = w.indexOf(x);
    if (k === -1 || _ === -1) {
      l(x);
      return;
    }
    const M = Math.min(k, _), C = Math.max(k, _);
    for (let T = M; T <= C; T++) {
      const V = w[T];
      V != null && i.set(V, !0);
    }
  }
  function c() {
    i.clear(), s = null;
  }
  async function d() {
    const w = t.value.filter((k) => i.has(k.id)).map(wo).join(`

`);
    await navigator.clipboard.writeText(w);
  }
  async function h() {
    const w = t.value.filter((k) => i.has(k.id)).map((k) => {
      const M = (k.speakerId ? e.get(k.speakerId) : void 0)?.name ?? "", C = k.startTime != null ? Vn(k.startTime) : "", T = [M, C].filter(Boolean).join(" (") + (C ? ")" : ""), V = wo(k);
      return T ? `${T}
${V}` : V;
    });
    await navigator.clipboard.writeText(w.join(`

`));
  }
  me(
    () => t.value,
    (x) => {
      if (i.size === 0) return;
      const w = new Set(x.map((k) => k.id));
      for (const k of [...i.keys()])
        w.has(k) || i.delete(k);
    }
  );
  const f = n.on("channel:change", c), p = n.on("translation:change", c);
  function m(x) {
    x.key === "Escape" && i.size > 0 && c();
  }
  Ke(() => {
    document.addEventListener("keydown", m);
  }), _t(() => {
    document.removeEventListener("keydown", m), f(), p();
  });
  const b = {
    count: r,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: u,
    clear: c,
    copyText: d,
    copyWithMetadata: h
  };
  return vn(gl, b), b;
}
function bl() {
  const t = Et(gl);
  if (!t)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return t;
}
const Ep = ["data-turn-active", "aria-selected"], Ap = { class: "turn-text" }, Pp = ["data-word-active"], Mp = /* @__PURE__ */ te({
  __name: "TranscriptionTurn",
  props: {
    turn: { type: Object },
    speaker: { type: Object },
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(t) {
    const e = t, n = Wt(), i = bl(), { t: s } = nt(), r = B(() => e.turn.words.length > 0), o = B(() => {
      if (!n.audio?.src.value || !r.value) return null;
      const f = n.audio.currentTime.value, { startTime: p, endTime: m, words: b } = e.turn;
      return p == null || m == null || f < p || f > m ? null : nf(b, f);
    }), a = B(() => {
      if (!n.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || rl(e.turn.words)) return !1;
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
    return (f, p) => (A(), Q("section", {
      class: Je(["turn", {
        "turn--active": a.value,
        "turn--partial": t.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || t.partial || t.live || void 0,
      style: Ot({ "--speaker-color": l.value }),
      "aria-selected": g(i).hasSelection.value ? u.value : void 0
    }, [
      t.partial ? le("", !0) : (A(), Q("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        g(i).hasSelection.value ? (A(), Y(up, {
          key: 0,
          "model-value": u.value,
          "aria-label": c.value,
          onClick: sr(h, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : le("", !0),
        G(Ef, {
          speaker: t.speaker,
          "start-time": t.turn.startTime,
          "start-date": t.turn.startDate,
          language: t.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      X("p", Ap, [
        r.value ? (A(!0), Q(ye, { key: 0 }, mn(t.turn.words, (m, b) => (A(), Q(ye, {
          key: m.id
        }, [
          X("span", {
            class: Je({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, re(m.text), 11, Pp),
          Ye(re(b < t.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : t.turn.text ? (A(), Q(ye, { key: 1 }, [
          Ye(re(t.turn.text), 1)
        ], 64)) : le("", !0)
      ])
    ], 14, Ep));
  }
}), Ip = ".turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-lg)}.turn-header[data-v-218f5091]{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;-webkit-user-select:none;user-select:none;border-radius:var(--radius-sm);padding:var(--spacing-xxs) 0}.turn[data-v-218f5091]:has(.turn-header:hover){background-color:var(--color-surface-hover)}.turn-text[data-v-218f5091]{margin-top:var(--spacing-xs);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary)}.turn--selected[data-v-218f5091]{background-color:color-mix(in srgb,var(--color-primary) 8%,transparent);border-left:3px solid var(--color-primary);padding-left:calc(var(--spacing-lg) - 3px)}.turn--active[data-v-218f5091]:not(.turn--selected){border-left:3px solid var(--speaker-color);background-color:color-mix(in srgb,var(--speaker-color) 8%,transparent);padding-left:calc(var(--spacing-lg) - 3px)}.word--active[data-v-218f5091]{text-decoration:underline;text-decoration-color:var(--speaker-color);text-decoration-thickness:2px;text-underline-offset:3px;color:var(--speaker-color)}.turn--partial .turn-text[data-v-218f5091]{font-style:italic;color:var(--color-text-muted);animation:partial-fade-in-218f5091 .2s ease}@keyframes partial-fade-in-218f5091{0%{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.turn--partial .turn-text[data-v-218f5091]{animation:none}}@media(max-width:767px){.turn[data-v-218f5091]{padding:var(--spacing-sm) var(--spacing-md)}.turn--selected[data-v-218f5091],.turn--active[data-v-218f5091]:not(.turn--selected){padding-left:calc(var(--spacing-md) - 3px)}}", xo = /* @__PURE__ */ xe(Mp, [["styles", [Ip]], ["__scopeId", "data-v-218f5091"]]), Op = {}, Lp = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Rp(t, e) {
  return A(), Q("svg", Lp, [...e[0] || (e[0] = [
    Cu('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Dp = /* @__PURE__ */ xe(Op, [["render", Rp]]), $p = { class: "transcription-empty" }, Fp = { class: "message" }, zp = /* @__PURE__ */ te({
  __name: "TranscriptionEmpty",
  setup(t) {
    const { t: e } = nt();
    return (n, i) => (A(), Q("div", $p, [
      G(Dp, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      X("p", Fp, re(g(e)("transcription.empty")), 1)
    ]));
  }
}), Bp = ".transcription-empty[data-v-f82737e5]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-lg);padding:var(--spacing-xl)}.illustration[data-v-f82737e5]{width:180px;height:auto;color:var(--color-text-muted);opacity:.5}.message[data-v-f82737e5]{color:var(--color-text-muted);font-size:var(--font-size-sm);text-align:center;margin:0}", Np = /* @__PURE__ */ xe(zp, [["styles", [Bp]], ["__scopeId", "data-v-f82737e5"]]), jp = { class: "transcription-panel" }, Hp = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Wp = { class: "turns-container" }, Vp = {
  key: 0,
  class: "history-loading",
  role: "status"
}, qp = {
  key: 1,
  class: "history-start"
}, Up = /* @__PURE__ */ te({
  __name: "TranscriptionPanel",
  props: {
    turns: { type: Array },
    speakers: { type: Map }
  },
  setup(t) {
    const e = t, { t: n } = nt(), i = Wt(), s = Nn("scrollContainer"), r = B(() => {
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
    ), d = B(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: f, isAtBottom: p, scrollToBottom: m } = bf();
    Ke(() => {
      h.value = s.value, f.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const b = Zd(() => {
      const w = u.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function x() {
      const w = s.value;
      w && w.scrollTop < 100 && b();
    }
    return me(
      () => e.turns,
      (w, k) => {
        const _ = w.length, M = k.length;
        if (_ > M && !p.value && w[0]?.id != k[0]?.id) {
          const C = _ - M, T = e.turns[C]?.id;
          if (!T || !h.value) return;
          ct(() => {
            h.value?.querySelector(
              `[data-turn-id="${T}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), Ke(() => {
      s.value?.addEventListener("scroll", x, {
        passive: !0
      });
    }), _t(() => {
      s.value?.removeEventListener("scroll", x);
    }), (w, k) => (A(), Q("article", jp, [
      X("div", Hp, [
        X("div", Wp, [
          c.value ? (A(), Q("div", Vp, [...k[3] || (k[3] = [
            X("progress", null, null, -1)
          ])])) : le("", !0),
          !d.value && t.turns.length > 0 ? (A(), Q("div", qp, re(g(n)("transcription.historyStart")), 1)) : le("", !0),
          t.turns.length === 0 && !c.value && !r.value ? (A(), Y(Np, {
            key: 2,
            class: "transcription-empty"
          })) : le("", !0),
          (A(!0), Q(ye, null, mn(t.turns, (_, M, C, T) => {
            const V = [
              _,
              t.speakers.get(_.speakerId ?? ""),
              o.value && !r.value && M === t.turns.length - 1
            ];
            if (T && T.key === _.id && Ru(T, V)) return T;
            const F = (A(), Y(xo, {
              "data-turn-id": _.id,
              key: _.id,
              turn: _,
              speaker: _.speakerId ? t.speakers.get(_.speakerId) : void 0,
              live: o.value && !r.value && M === t.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return F.memo = V, F;
          }, k, 0), 128)),
          r.value ? (A(), Y(xo, {
            key: "__partial__",
            turn: r.value,
            partial: ""
          }, null, 8, ["turn"])) : le("", !0)
        ]),
        G(nr, { name: "fade-slide" }, {
          default: se(() => [
            !g(p) && (a.value || o.value) ? (A(), Y(et, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": g(n)("transcription.resumeScroll"),
              onClick: k[2] || (k[2] = (_) => g(m)())
            }, {
              default: se(() => [
                Ye(re(g(n)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : le("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Kp = ".transcription-panel[data-v-a27efea3]{min-height:0;overflow:hidden;background-color:var(--color-surface)}.scroll-container[data-v-a27efea3]{height:100%;overflow:auto;position:relative}.turns-container[data-v-a27efea3]{max-width:80ch;margin-inline:auto;padding:var(--spacing-lg)}.turns-container[data-v-a27efea3]:has(.transcription-empty){display:flex;flex-direction:column;min-height:100%}.history-loading[data-v-a27efea3]{text-align:center;padding:var(--spacing-md)}.history-loading progress[data-v-a27efea3]{width:120px}.history-start[data-v-a27efea3]{text-align:center;padding:var(--spacing-md);color:var(--color-text-muted);font-size:var(--font-size-sm)}.resume-scroll-btn[data-v-a27efea3]{position:sticky;bottom:var(--spacing-lg);left:50%;translate:-50% 0;z-index:var(--z-sticky);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--color-border);box-shadow:var(--shadow-sm)}.fade-slide-enter-active[data-v-a27efea3],.fade-slide-leave-active[data-v-a27efea3]{transition:opacity .2s ease,translate .2s ease}.fade-slide-enter-from[data-v-a27efea3],.fade-slide-leave-to[data-v-a27efea3]{opacity:0;translate:-50% 8px}@media(prefers-reduced-motion:reduce){.fade-slide-enter-active[data-v-a27efea3],.fade-slide-leave-active[data-v-a27efea3]{transition:none}}@media(max-width:767px){.turns-container[data-v-a27efea3]{padding:var(--spacing-md)}}", Gp = /* @__PURE__ */ xe(Up, [["styles", [Kp]], ["__scopeId", "data-v-a27efea3"]]), Xp = { class: "switch" }, Yp = ["id", "checked", "disabled"], Jp = ["for"], Zp = /* @__PURE__ */ te({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0, type: String },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const n = t, i = e, s = n.id ?? Js();
    return (r, o) => (A(), Q("div", Xp, [
      X("input", {
        type: "checkbox",
        id: g(s),
        checked: t.modelValue,
        disabled: t.disabled,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Yp),
      X("label", { for: g(s) }, [...o[1] || (o[1] = [
        X("div", { class: "switch-slider" }, null, -1)
      ])], 8, Jp)
    ]));
  }
}), Qp = ".switch[data-v-f1919d87]{display:inline-block;flex-shrink:0}.switch input[data-v-f1919d87]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.switch label[data-v-f1919d87]{height:20px;width:40px;display:block;border:1px solid var(--color-border);border-radius:20px;cursor:pointer;background-color:var(--color-border);transition:background-color var(--transition-duration)}.switch .switch-slider[data-v-f1919d87]{height:22px;width:22px;border:1px solid var(--color-border);border-radius:50%;position:relative;top:-2px;left:-2px;background-color:var(--color-white);transition:left var(--transition-duration)}.switch input:checked+label[data-v-f1919d87]{background-color:var(--color-primary);border-color:var(--color-primary)}.switch input:checked+label .switch-slider[data-v-f1919d87]{left:20px;border-color:var(--color-primary)}.switch input:disabled+label[data-v-f1919d87]{cursor:not-allowed;opacity:.5}", ai = /* @__PURE__ */ xe(Zp, [["styles", [Qp]], ["__scopeId", "data-v-f1919d87"]]), ev = { class: "sidebar-select-field" }, tv = ["for"], nv = ["id", "value", "aria-label"], iv = ["value"], sv = /* @__PURE__ */ te({
  __name: "SidebarSelect",
  props: {
    items: { type: Array },
    selectedValue: { type: String },
    ariaLabel: { type: String },
    label: { type: String }
  },
  emits: ["update:selectedValue"],
  setup(t, { emit: e }) {
    const n = e, i = Js();
    return (s, r) => (A(), Q("div", ev, [
      t.label ? (A(), Q("label", {
        key: 0,
        for: g(i),
        class: "sidebar-select-label"
      }, re(t.label), 9, tv)) : le("", !0),
      X("select", {
        id: g(i),
        class: "sidebar-select",
        value: t.selectedValue,
        "aria-label": t.label ? void 0 : t.ariaLabel,
        onChange: r[0] || (r[0] = (o) => n("update:selectedValue", o.target.value))
      }, [
        (A(!0), Q(ye, null, mn(t.items, (o) => (A(), Q("option", {
          key: o.value,
          value: o.value
        }, re(o.label), 9, iv))), 128))
      ], 40, nv)
    ]));
  }
}), rv = ".sidebar-select-field[data-v-fc926569]{display:flex;flex-direction:column;gap:var(--spacing-xs)}.sidebar-select-label[data-v-fc926569]{font-size:var(--font-size-xs);color:var(--color-text-primary)}", yl = /* @__PURE__ */ xe(sv, [["styles", [rv]], ["__scopeId", "data-v-fc926569"]]), _l = /* @__PURE__ */ te({
  __name: "ChannelSelector",
  props: {
    channels: { type: Array },
    selectedChannelId: { type: String }
  },
  emits: ["update:selectedChannelId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s } = nt(), r = B(
      () => n.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (A(), Y(yl, {
      items: r.value,
      "selected-value": t.selectedChannelId,
      ariaLabel: g(s)("header.channelLabel"),
      label: g(s)("sidebar.channelSelectLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), ov = { class: "translation-row" }, av = {
  key: 0,
  class: "translation-row-badge"
}, lv = {
  key: 0,
  class: "translation-trigger-badge"
}, cv = /* @__PURE__ */ te({
  __name: "TranslationSelector",
  props: {
    translations: { type: Array },
    selectedTranslationId: { type: String }
  },
  emits: ["update:selectedTranslationId"],
  setup(t, { emit: e }) {
    const n = t, i = e, { t: s, locale: r } = nt(), o = B(
      () => Jd(
        n.translations,
        r.value,
        s("sidebar.originalLanguage"),
        s("language.wildcard"),
        s("sidebar.bilingual")
      )
    );
    return (a, l) => (A(), Y(yl, {
      items: o.value,
      "selected-value": t.selectedTranslationId,
      ariaLabel: g(s)("sidebar.translationLabel"),
      label: g(s)("sidebar.translationSelectLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (u) => i("update:selectedTranslationId", u))
    }, {
      item: se(({ item: u }) => [
        X("span", ov, [
          u.originalLabel ? (A(), Q("strong", av, re(u.originalLabel), 1)) : le("", !0),
          X("span", null, re(u.label), 1)
        ])
      ]),
      trigger: se(({ item: u }) => [
        u?.originalLabel ? (A(), Q("span", lv, re(u.originalLabel), 1)) : le("", !0),
        X("span", null, re(u?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), uv = ".translation-row[data-v-988a9770]{display:flex;flex-direction:column;gap:2px}.translation-row-badge[data-v-988a9770]{font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}.translation-trigger-badge[data-v-988a9770]{font-variant-caps:all-small-caps;color:var(--color-text-muted);margin-right:var(--spacing-xs);letter-spacing:.05em}", wl = /* @__PURE__ */ xe(cv, [["styles", [uv]], ["__scopeId", "data-v-988a9770"]]), dv = { class: "speaker-sidebar" }, fv = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, hv = { class: "sidebar-title" }, pv = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, vv = { class: "sidebar-title" }, mv = {
  key: 2,
  class: "sidebar-section"
}, gv = { class: "sidebar-title" }, bv = { class: "subtitle-toggle" }, yv = { class: "subtitle-toggle-label" }, _v = { class: "subtitle-slider" }, wv = { class: "subtitle-slider-label" }, xv = { class: "subtitle-slider-value" }, Sv = ["value", "disabled"], kv = {
  key: 0,
  class: "subtitle-toggle"
}, Cv = { class: "subtitle-toggle-label" }, Tv = {
  key: 1,
  class: "subtitle-toggle"
}, Ev = { class: "subtitle-toggle-label" }, Av = {
  key: 3,
  class: "sidebar-section"
}, Pv = { class: "sidebar-title" }, Mv = { class: "subtitle-toggle" }, Iv = { class: "subtitle-toggle-label" }, Ov = {
  key: 4,
  class: "sidebar-section"
}, Lv = { class: "sidebar-title" }, Rv = { class: "speaker-list" }, Dv = { class: "speaker-name" }, $v = /* @__PURE__ */ te({
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
    const e = Wt(), { t: n } = nt(), i = B(() => e.live?.ttsReady.value ?? !1), s = B(
      () => i.value ? n("voicePlayback.description") : n("voicePlayback.unavailable")
    );
    function r(o) {
      !e.live || !i.value || (o ? e.live.enableTTS() : e.live.disableTTS());
    }
    return (o, a) => (A(), Q("aside", dv, [
      t.channels.length > 1 ? (A(), Q("section", fv, [
        X("h2", hv, re(g(n)("sidebar.channel")), 1),
        G(_l, {
          channels: t.channels,
          "selected-channel-id": t.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : le("", !0),
      t.translations.length > 1 ? (A(), Q("section", pv, [
        X("h2", vv, re(g(n)("sidebar.translation")), 1),
        G(wl, {
          translations: t.translations,
          "selected-translation-id": t.selectedTranslationId,
          "onUpdate:selectedTranslationId": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : le("", !0),
      g(e).subtitle ? (A(), Q("section", mv, [
        X("h2", gv, re(g(n)("sidebar.subtitle")), 1),
        X("div", bv, [
          X("span", yv, re(g(n)("subtitle.show")), 1),
          G(ai, {
            modelValue: g(e).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => g(e).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        X("label", _v, [
          X("span", wv, [
            Ye(re(g(n)("subtitle.fontSize")) + " ", 1),
            X("span", xv, re(g(e).subtitle.fontSize.value) + "px", 1)
          ]),
          X("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: g(e).subtitle.fontSize.value,
            disabled: !g(e).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => g(e).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Sv)
        ]),
        g(e).subtitle.watermark && !g(e).subtitle.watermark.readonly ? (A(), Q("div", kv, [
          X("span", Cv, re(g(n)("subtitle.showWatermark")), 1),
          G(ai, {
            modelValue: g(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": a[4] || (a[4] = (l) => g(e).subtitle.watermark.display.value = l),
            disabled: !g(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : le("", !0),
        g(e).subtitle.watermark && !g(e).subtitle.watermark.readonly && g(e).subtitle.watermark.display.value ? (A(), Q("div", Tv, [
          X("span", Ev, re(g(n)("subtitle.pinWatermark")), 1),
          G(ai, {
            modelValue: g(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": a[5] || (a[5] = (l) => g(e).subtitle.watermark.pinned.value = l),
            disabled: !g(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : le("", !0)
      ])) : le("", !0),
      g(e).live && g(e).live.ttsAvailable ? (A(), Q("section", Av, [
        X("h2", Pv, re(g(n)("sidebar.voicePlayback")), 1),
        X("div", Mv, [
          X("span", Iv, re(g(n)("voicePlayback.enable")), 1),
          G(ai, {
            "model-value": g(e).live.ttsEnabled.value,
            disabled: !i.value,
            "onUpdate:modelValue": r
          }, null, 8, ["model-value", "disabled"])
        ]),
        X("p", {
          class: Je(["voice-playback-hint", { "voice-playback-hint--warning": !i.value }])
        }, re(s.value), 3)
      ])) : le("", !0),
      t.speakers.length ? (A(), Q("section", Ov, [
        X("h2", Lv, re(g(n)("sidebar.speakers")), 1),
        X("ul", Rv, [
          (A(!0), Q(ye, null, mn(t.speakers, (l) => (A(), Q("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            G(ol, {
              color: l.color
            }, null, 8, ["color"]),
            X("span", Dv, re(l.name), 1)
          ]))), 128))
        ])
      ])) : le("", !0)
    ]));
  }
}), Fv = ".speaker-sidebar[data-v-2d6d36dc]{display:flex;flex-direction:column;gap:var(--spacing-lg);padding:var(--spacing-lg);border-left:1px solid var(--color-border);background-color:var(--color-surface);overflow-y:auto}.sidebar-section[data-v-2d6d36dc]{display:flex;flex-direction:column;gap:var(--spacing-sm)}.sidebar-title[data-v-2d6d36dc]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.05em}.speaker-list[data-v-2d6d36dc]{list-style:none;display:flex;flex-direction:column;gap:var(--spacing-xs)}.speaker-item[data-v-2d6d36dc]{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);border-radius:var(--radius-md);transition:background-color var(--transition-duration)}.speaker-item[data-v-2d6d36dc]:hover{background-color:var(--color-surface-hover)}.speaker-name[data-v-2d6d36dc]{flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-text-primary)}.subtitle-toggle[data-v-2d6d36dc]{display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-sm);border-radius:var(--radius-md)}.subtitle-toggle-label[data-v-2d6d36dc]{font-size:var(--font-size-sm);color:var(--color-text-primary)}.voice-playback-hint[data-v-2d6d36dc]{padding:0 var(--spacing-sm);font-size:var(--font-size-xs);color:var(--color-text-muted)}.voice-playback-hint--warning[data-v-2d6d36dc]{color:var(--color-danger)}.subtitle-slider[data-v-2d6d36dc]{display:flex;flex-direction:column;gap:var(--spacing-xs);padding:var(--spacing-sm)}.subtitle-slider-label[data-v-2d6d36dc]{display:flex;justify-content:space-between;font-size:var(--font-size-sm);color:var(--color-text-primary)}.subtitle-slider-value[data-v-2d6d36dc]{color:var(--color-text-muted);font-variant-numeric:tabular-nums}.subtitle-slider input[type=range][data-v-2d6d36dc]{width:100%;accent-color:var(--color-primary)}.subtitle-slider input[type=range][data-v-2d6d36dc]:disabled{opacity:.4;cursor:not-allowed}@media(max-width:767px){.speaker-sidebar[data-v-2d6d36dc]{border-left:none}.sidebar-section--selector[data-v-2d6d36dc]{display:none}}", So = /* @__PURE__ */ xe($v, [["styles", [Fv]], ["__scopeId", "data-v-2d6d36dc"]]), zv = /* @__PURE__ */ te({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(t) {
    const e = ru(t, "open"), { t: n } = nt();
    return (i, s) => (A(), Y(g(oh), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (r) => e.value = r)
    }, {
      default: se(() => [
        G(g(zh), { disabled: "" }, {
          default: se(() => [
            G(g(Rh), { class: "editor-overlay" }),
            G(g(Mh), { class: "sidebar-drawer" }, {
              default: se(() => [
                G(g(Nh), { class: "sr-only" }, {
                  default: se(() => [
                    Ye(re(g(n)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                G(g(lh), {
                  class: "sidebar-close",
                  "aria-label": g(n)("header.closeSidebar")
                }, {
                  default: se(() => [
                    G(g(rr), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                _e(i.$slots, "default")
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
}), Bv = { class: "player-controls" }, Nv = { class: "controls-left" }, jv = { class: "controls-time" }, Hv = { class: "time-display" }, Wv = { class: "time-display" }, Vv = { class: "controls-right" }, qv = ["value", "aria-label", "disabled"], Uv = /* @__PURE__ */ te({
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
    const n = e, { t: i } = nt(), s = /* @__PURE__ */ U(!1);
    function r(o) {
      const a = o.target;
      n("update:volume", parseFloat(a.value));
    }
    return (o, a) => (A(), Q("div", Bv, [
      X("div", Nv, [
        G(et, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": g(i)("player.skipBack"),
          disabled: !t.isReady,
          onClick: a[0] || (a[0] = (l) => n("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        G(et, {
          variant: "transparent",
          icon: t.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": t.isPlaying ? g(i)("player.pause") : g(i)("player.play"),
          disabled: !t.isReady,
          onClick: a[1] || (a[1] = (l) => n("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        G(et, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": g(i)("player.skipForward"),
          disabled: !t.isReady,
          onClick: a[2] || (a[2] = (l) => n("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      X("div", jv, [
        X("time", Hv, re(t.currentTime), 1),
        a[7] || (a[7] = X("span", { class: "time-separator" }, "/", -1)),
        X("time", Wv, re(t.duration), 1)
      ]),
      X("div", Vv, [
        X("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          G(et, {
            variant: "transparent",
            icon: t.isMuted ? "volume-mute" : "volume",
            "aria-label": t.isMuted ? g(i)("player.unmute") : g(i)("player.mute"),
            disabled: !t.isReady,
            onClick: a[3] || (a[3] = (l) => n("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          Ec(X("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: t.volume,
            "aria-label": g(i)("player.volume"),
            disabled: !t.isReady,
            onInput: r
          }, null, 40, qv), [
            [Uu, s.value]
          ])
        ], 32),
        G(et, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": g(i)("player.speed"),
          disabled: !t.isReady,
          onClick: a[6] || (a[6] = (l) => n("cyclePlaybackRate"))
        }, {
          default: se(() => [
            Ye(re(t.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Kv = ".player-controls[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-xs) var(--spacing-lg);height:44px}.controls-left[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.controls-time[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xxs);font-family:var(--font-family-mono);font-size:var(--font-size-sm);color:var(--color-text-muted);-webkit-user-select:none;user-select:none}.time-separator[data-v-2dcb93b1]{color:var(--color-text-muted);opacity:.5}.controls-right[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs);margin-left:auto}.volume-group[data-v-2dcb93b1]{display:flex;align-items:center;gap:var(--spacing-xs)}.volume-slider[data-v-2dcb93b1]{width:80px;height:4px;accent-color:var(--color-primary);cursor:pointer}.volume-slider[data-v-2dcb93b1]:disabled{opacity:.5;cursor:default}.play-button[data-v-2dcb93b1]{--btn-height: 40px;--btn-icon-size: 20px}.speed-button[data-v-2dcb93b1]{font-size:var(--font-size-sm);font-family:var(--font-family-mono)}@media(max-width:767px){.skip-button[data-v-2dcb93b1],.volume-slider[data-v-2dcb93b1]{display:none}.player-controls[data-v-2dcb93b1]{padding:var(--spacing-xs) var(--spacing-md);gap:var(--spacing-sm)}}", Gv = /* @__PURE__ */ xe(Uv, [["styles", [Kv]], ["__scopeId", "data-v-2dcb93b1"]]);
function Be(t, e, n, i) {
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
let Zn = class {
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
const li = { decode: function(t, e) {
  return Be(this, void 0, void 0, (function* () {
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
function xl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(xl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function ko(t, e, n) {
  const i = xl(t, e || {});
  return n?.appendChild(i), i;
}
var Xv = Object.freeze({ __proto__: null, createElement: ko, default: ko });
const Yv = { fetchBlob: function(t, e, n) {
  return Be(this, void 0, void 0, (function* () {
    const i = yield fetch(t, n);
    if (i.status >= 400) throw new Error(`Failed to fetch ${t}: ${i.status} (${i.statusText})`);
    return (function(s, r) {
      Be(this, void 0, void 0, (function* () {
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
function ke(t) {
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
  const n = ke(t());
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
class Jv extends Zn {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = ke(!1), this._currentTime = ke(0), this._duration = ke(0), this._volume = ke(this.media.volume), this._muted = ke(this.media.muted), this._playbackRate = ke(this.media.playbackRate || 1), this._seeking = ke(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    return Be(this, void 0, void 0, (function* () {
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
function Zv({ maxTop: t, maxBottom: e, halfHeight: n, vScale: i, barMinHeight: s = 0, barAlign: r }) {
  let o = Math.round(t * n * i), a = o + Math.round(e * n * i) || 1;
  return a < s && (a = s, r || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function Qv({ barAlign: t, halfHeight: e, topHeight: n, totalHeight: i, canvasHeight: s }) {
  return t === "top" ? 0 : t === "bottom" ? s - i : e - n;
}
function Co(t, e, n) {
  const i = e - t.left, s = n - t.top;
  return [i / t.width, s / t.height];
}
function Sl(t) {
  return !!(t.barWidth || t.barGap || t.barAlign);
}
function To(t, e) {
  if (!Sl(e)) return t;
  const n = e.barWidth || 0.5, i = n + (e.barGap || n / 2);
  return i === 0 ? t : Math.floor(t / i) * i;
}
function Eo({ scrollLeft: t, totalWidth: e, numCanvases: n }) {
  if (e === 0) return [0];
  const i = t / e, s = Math.floor(i * n);
  return [s - 1, s, s + 1];
}
function kl(t) {
  const e = t._cleanup;
  typeof e == "function" && e();
}
function em(t) {
  const e = ke({ scrollLeft: t.scrollLeft, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth }), n = Jt((() => (function(r) {
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
    t.removeEventListener("scroll", s), kl(e);
  } };
}
class tm extends Zn {
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
      const i = this.wrapper.getBoundingClientRect(), [s, r] = Co(i, n.clientX, n.clientY);
      this.emit("click", s, r);
    })), this.wrapper.addEventListener("dblclick", ((n) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = Co(i, n.clientX, n.clientY);
      this.emit("dblclick", s, r);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = em(this.scrollContainer);
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
      const { threshold: s = 3, mouseButton: r = 0, touchDelay: o = 100 } = i, a = ke(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== r || (l.set(h.pointerId, h), l.size > 1)) return;
        let f = h.clientX, p = h.clientY, m = !1;
        const b = Date.now(), x = n.getBoundingClientRect(), { left: w, top: k } = x, _ = (F) => {
          if (F.defaultPrevented || l.size > 1 || u && Date.now() - b < o) return;
          const L = F.clientX, N = F.clientY, E = L - f, P = N - p;
          (m || Math.abs(E) > s || Math.abs(P) > s) && (F.preventDefault(), F.stopPropagation(), m || (a.set({ type: "start", x: f - w, y: p - k }), m = !0), a.set({ type: "move", x: L - w, y: N - k, deltaX: E, deltaY: P }), f = L, p = N);
        }, M = (F) => {
          if (l.delete(F.pointerId), m) {
            const L = F.clientX, N = F.clientY;
            a.set({ type: "end", x: L - w, y: N - k });
          }
          c();
        }, C = (F) => {
          l.delete(F.pointerId), F.relatedTarget && F.relatedTarget !== document.documentElement || M(F);
        }, T = (F) => {
          m && (F.stopPropagation(), F.preventDefault());
        }, V = (F) => {
          F.defaultPrevented || l.size > 1 || m && F.preventDefault();
        };
        document.addEventListener("pointermove", _), document.addEventListener("pointerup", M), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", V, { passive: !1 }), document.addEventListener("click", T, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", _), document.removeEventListener("pointerup", M), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", V), setTimeout((() => {
            document.removeEventListener("click", T, { capture: !0 });
          }), 10);
        };
      };
      return n.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), n.removeEventListener("pointerdown", d), l.clear(), kl(a);
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
    const { width: r, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: p, height: m, length: b, options: x, pixelRatio: w }) {
      const k = m / 2, _ = x.barWidth ? x.barWidth * w : 1, M = x.barGap ? x.barGap * w : x.barWidth ? _ / 2 : 0, C = _ + M || 1;
      return { halfHeight: k, barWidth: _, barGap: M, barRadius: x.barRadius || 0, barMinHeight: x.barMinHeight ? x.barMinHeight * w : 0, barIndexScale: b > 0 ? p / C / b : 0, barSpacing: C };
    })({ width: r, height: o, length: (e[0] || []).length, options: n, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: p, barIndexScale: m, barSpacing: b, barWidth: x, halfHeight: w, vScale: k, canvasHeight: _, barAlign: M, barMinHeight: C }) {
      const T = p[0] || [], V = p[1] || T, F = T.length, L = [];
      let N = 0, E = 0, P = 0;
      for (let I = 0; I <= F; I++) {
        const q = Math.round(I * m);
        if (q > N) {
          const { topHeight: ae, totalHeight: ue } = Zv({ maxTop: E, maxBottom: P, halfHeight: w, vScale: k, barMinHeight: C, barAlign: M }), Ie = Qv({ barAlign: M, halfHeight: w, topHeight: ae, totalHeight: ue, canvasHeight: _ });
          L.push({ x: N * b, y: Ie, width: x, height: ue }), N = q, E = 0, P = 0;
        }
        const oe = Math.abs(T[I] || 0), K = Math.abs(V[I] || 0);
        oe > E && (E = oe), K > P && (P = K);
      }
      return L;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: o, barAlign: n.barAlign, barMinHeight: h });
    i.beginPath();
    for (const p of f) u && "roundRect" in i ? i.roundRect(p.x, p.y, p.width, p.height, u) : i.rect(p.x, p.y, p.width, p.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, n, i, s) {
    const { width: r, height: o } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, f = l[0] || [];
      return [f, l[1] || f].map(((p, m) => {
        const b = p.length, x = b ? u / b : 0, w = h, k = m === 0 ? -1 : 1, _ = [{ x: 0, y: w }];
        let M = 0, C = 0;
        for (let T = 0; T <= b; T++) {
          const V = Math.round(T * x);
          if (V > M) {
            const L = w + (Math.round(C * h * d) || 1) * k;
            _.push({ x: M, y: L }), M = V, C = 0;
          }
          const F = Math.abs(p[T] || 0);
          F > C && (C = F);
        }
        return _.push({ x: M, y: w }), _;
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
    Sl(n) ? this.renderBarWaveform(e, n, i, s) : this.renderLineWaveform(e, n, i, s);
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
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: p, totalWidth: m, options: b }) {
      return To(Math.min(8e3, p, m), b);
    })({ clientWidth: l, totalWidth: u, options: n });
    let d = {};
    if (c === 0) return;
    const h = (p) => {
      if (p < 0 || p >= f || d[p]) return;
      d[p] = !0;
      const m = p * c;
      let b = Math.min(u - m, c);
      if (b = To(b, n), b <= 0) return;
      const x = (function({ channelData: w, offset: k, clampedWidth: _, totalWidth: M }) {
        return w.map(((C) => {
          const T = Math.floor(k / M * C.length), V = Math.floor((k + _) / M * C.length);
          return C.slice(T, V);
        }));
      })({ channelData: e, offset: m, clampedWidth: b, totalWidth: u });
      this.renderSingleCanvas(x, n, b, s, m, r, o);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let p = 0; p < f; p++) h(p);
      return;
    }
    if (Eo({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((p) => h(p))), f > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (r.innerHTML = "", o.innerHTML = "", d = {}), Eo({ scrollLeft: m, totalWidth: u, numCanvases: f }).forEach(((b) => h(b)));
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
    return Be(this, void 0, void 0, (function* () {
      var n;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: r, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: f }) {
        const p = Math.ceil(u * c), m = p > d, b = !!(h && !m);
        return { scrollWidth: p, isScrollable: m, useParentWidth: b, width: (b ? d : p) * f };
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
    return Be(this, void 0, void 0, (function* () {
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
class nm extends Zn {
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
class ms extends Zn {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, void 0, void 0, (function* () {
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
const im = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class qn extends Jv {
  static create(e) {
    return new qn(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const n = e.media || (e.backend === "WebAudio" ? new ms() : void 0);
    super({ media: n, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, im, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, h, f;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : ke(0), m = (u = a?.duration) !== null && u !== void 0 ? u : ke(0), b = (c = a?.isPlaying) !== null && c !== void 0 ? c : ke(!1), x = (d = a?.isSeeking) !== null && d !== void 0 ? d : ke(!1), w = (h = a?.volume) !== null && h !== void 0 ? h : ke(1), k = (f = a?.playbackRate) !== null && f !== void 0 ? f : ke(1), _ = ke(null), M = ke(null), C = ke(""), T = ke(0), V = ke(0), F = Jt((() => !b.value), [b]), L = Jt((() => _.value !== null), [_]), N = Jt((() => L.value && m.value > 0), [L, m]), E = Jt((() => p.value), [p]), P = Jt((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: b, isPaused: F, isSeeking: x, volume: w, playbackRate: k, audioBuffer: _, peaks: M, url: C, zoom: T, scrollPosition: V, canPlay: L, isReady: N, progress: E, progressPercent: P }, actions: { setCurrentTime: (I) => {
        const q = Math.max(0, Math.min(m.value || 1 / 0, I));
        p.set(q);
      }, setDuration: (I) => {
        m.set(Math.max(0, I));
      }, setPlaying: (I) => {
        b.set(I);
      }, setSeeking: (I) => {
        x.set(I);
      }, setVolume: (I) => {
        const q = Math.max(0, Math.min(1, I));
        w.set(q);
      }, setPlaybackRate: (I) => {
        const q = Math.max(0.1, Math.min(16, I));
        k.set(q);
      }, setAudioBuffer: (I) => {
        _.set(I), I && m.set(I.duration);
      }, setPeaks: (I) => {
        M.set(I);
      }, setUrl: (I) => {
        C.set(I);
      }, setZoom: (I) => {
        T.set(Math.max(0, I));
      }, setScrollPosition: (I) => {
        V.set(Math.max(0, I));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new nm();
    const r = n ? void 0 : this.getMediaElement();
    this.renderer = new tm(this.options, r), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = li.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = li.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return Be(this, void 0, void 0, (function* () {
      var r;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (r = this.abortController) === null || r === void 0 || r.abort(), this.abortController = null, !n && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        n = yield Yv.fetchBlob(e, l, a);
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
        a instanceof ms && (a.duration = o);
      }
      if (i) this.decodedData = li.createBuffer(i, o || 0);
      else if (n) {
        const a = yield n.arrayBuffer();
        this.decodedData = yield li.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, n, i) {
    return Be(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, n, i);
      } catch (s) {
        throw this.emit("error", s), s;
      }
    }));
  }
  loadBlob(e, n, i) {
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const s = yield i.play.call(this);
      return n != null && (this.media instanceof ms ? this.media.stopAt(n) : this.stopAtPosition = n), s;
    }));
  }
  playPause() {
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, arguments, void 0, (function* (e = "image/png", n = 1, i = "dataURL") {
      return this.renderer.exportImage(e, n, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((n) => n.destroy())), this.subscriptions.forEach(((n) => n())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((n) => n())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
qn.BasePlugin = class extends Zn {
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
}, qn.dom = Xv;
class Cl {
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
class sm extends Cl {
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
function Tl(t, e) {
  const n = e.xmlns ? document.createElementNS(e.xmlns, t) : document.createElement(t);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? n.appendChild(o) : typeof o == "string" ? n.appendChild(document.createTextNode(o)) : n.appendChild(Tl(r, o));
  else i === "style" ? Object.assign(n.style, s) : i === "textContent" ? n.textContent = s : n.setAttribute(i, s.toString());
  return n;
}
function An(t, e, n) {
  const i = Tl(t, e || {});
  return n?.appendChild(i), i;
}
function El(t) {
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
function mi(t, e) {
  let n;
  const i = () => {
    n && (n(), n = void 0), n = t();
  }, s = e.map(((r) => r.subscribe(i)));
  return i(), () => {
    n && (n(), n = void 0), s.forEach(((r) => r()));
  };
}
function rn(t, e) {
  const n = El(null), i = (s) => {
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
function gi(t, e = {}) {
  const { threshold: n = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, r = El(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, h = c.clientY, f = !1;
    const p = Date.now(), m = t.getBoundingClientRect(), { left: b, top: x } = m, w = (T) => {
      if (T.defaultPrevented || o.size > 1 || a && Date.now() - p < s) return;
      const V = T.clientX, F = T.clientY, L = V - d, N = F - h;
      (f || Math.abs(L) > n || Math.abs(N) > n) && (T.preventDefault(), T.stopPropagation(), f || (r.set({ type: "start", x: d - b, y: h - x }), f = !0), r.set({ type: "move", x: V - b, y: F - x, deltaX: L, deltaY: N }), d = V, h = F);
    }, k = (T) => {
      if (o.delete(T.pointerId), f) {
        const V = T.clientX, F = T.clientY;
        r.set({ type: "end", x: V - b, y: F - x });
      }
      l();
    }, _ = (T) => {
      o.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || k(T);
    }, M = (T) => {
      f && (T.stopPropagation(), T.preventDefault());
    }, C = (T) => {
      T.defaultPrevented || o.size > 1 || f && T.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", k), document.addEventListener("pointerout", _), document.addEventListener("pointercancel", _), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", M, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", k), document.removeEventListener("pointerout", _), document.removeEventListener("pointercancel", _), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", M, { capture: !0 });
      }), 10);
    };
  };
  return t.addEventListener("pointerdown", u), { signal: r, cleanup: () => {
    l(), t.removeEventListener("pointerdown", u), o.clear(), Xt(r);
  } };
}
class Ao extends Cl {
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
    const n = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = An("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, n), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = An("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, n), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), r = gi(i, { threshold: 1 }), o = gi(s, { threshold: 1 }), a = mi((() => {
      const u = r.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [r.signal]), l = mi((() => {
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
    const s = An("div", { style: { position: "absolute", top: `${n}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const n = rn(e, "click"), i = rn(e, "mouseenter"), s = rn(e, "mouseleave"), r = rn(e, "dblclick"), o = rn(e, "pointerdown"), a = rn(e, "pointerup"), l = n.subscribe(((b) => b && this.emit("click", b))), u = i.subscribe(((b) => b && this.emit("over", b))), c = s.subscribe(((b) => b && this.emit("leave", b))), d = r.subscribe(((b) => b && this.emit("dblclick", b))), h = o.subscribe(((b) => b && this.toggleCursor(!0))), f = a.subscribe(((b) => b && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), f(), Xt(n), Xt(i), Xt(s), Xt(r), Xt(o), Xt(a);
    }));
    const p = gi(e), m = mi((() => {
      const b = p.signal.value;
      b && (b.type === "start" ? this.toggleCursor(!0) : b.type === "move" && b.deltaX !== void 0 ? this.onMove(b.deltaX) : b.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [p.signal]);
    this.subscriptions.push((() => {
      m(), p.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (b) => this.onContentClick(b), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
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
        this.content = An("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class fr extends sm {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new fr(e);
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
    return An("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const s = this.wavesurfer.getDuration(), r = (i = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Ao(e, s, r);
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
    const l = gi(s, { threshold: n }), u = mi((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (o = h.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), p = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const b = h.x / m * f, x = (h.x + 5) / m * f;
        r = new Ao(Object.assign(Object.assign({}, e), { start: b, end: x }), f, p), this.emit("region-initialized", r), r.element && this.regionsContainer.appendChild(r.element);
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
const gs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function rm(t) {
  const { containerRef: e, audioSrc: n, turns: i, speakers: s } = t, r = /* @__PURE__ */ hn(null), o = /* @__PURE__ */ hn(null), a = /* @__PURE__ */ U(0), l = /* @__PURE__ */ U(0), u = /* @__PURE__ */ U(!1), c = /* @__PURE__ */ U(!1), d = /* @__PURE__ */ U(!1), h = /* @__PURE__ */ U(1), f = /* @__PURE__ */ U(1), p = /* @__PURE__ */ U(!1), m = B(() => Vn(a.value)), b = B(() => Vn(l.value));
  function x(I, q) {
    E(), d.value = !0, c.value = !1;
    const oe = fr.create();
    o.value = oe;
    const K = qn.create({
      container: I,
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
      renderFunction: tf,
      url: q,
      plugins: [oe]
    });
    K.on("ready", () => {
      c.value = !0, d.value = !1, l.value = K.getDuration(), w();
    }), K.on("timeupdate", (ae) => {
      a.value = ae;
    }), K.on("play", () => {
      u.value = !0;
    }), K.on("pause", () => {
      u.value = !1;
    }), K.on("finish", () => {
      u.value = !1;
    }), r.value = K;
  }
  function w() {
    const I = o.value;
    if (I) {
      I.clearRegions();
      for (const q of i.value) {
        const oe = q.speakerId ? s.value.get(q.speakerId) : void 0;
        if (!oe || q.startTime == null || q.endTime == null) continue;
        const K = oe.color;
        I.addRegion({
          start: q.startTime,
          end: q.endTime,
          color: Yd(K, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", K);
      }
    }
  }
  function k() {
    r.value?.play();
  }
  function _() {
    r.value?.pause();
  }
  function M() {
    r.value?.playPause();
  }
  function C(I) {
    const q = r.value;
    !q || l.value === 0 || q.setTime(I);
  }
  function T(I) {
    C(Math.max(0, Math.min(a.value + I, l.value)));
  }
  function V(I) {
    const q = r.value;
    q && (h.value = I, q.setVolume(I), I > 0 && p.value && (p.value = !1, q.setMuted(!1)));
  }
  function F() {
    const I = r.value;
    I && (p.value = !p.value, I.setMuted(p.value));
  }
  function L(I) {
    const q = r.value;
    q && (f.value = I, q.setPlaybackRate(I));
  }
  function N() {
    const q = (gs.indexOf(
      f.value
    ) + 1) % gs.length;
    L(gs[q] ?? 1);
  }
  function E() {
    P !== null && (clearTimeout(P), P = null), r.value && (r.value.destroy(), r.value = null, o.value = null);
  }
  me(
    [e, n],
    ([I, q]) => {
      I && q && x(I, q);
    },
    { immediate: !0 }
  );
  let P = null;
  return me([i, s], () => {
    c.value && (P !== null && clearTimeout(P), P = setTimeout(() => {
      P = null, w();
    }, 150));
  }), _t(() => {
    E();
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
    formattedDuration: b,
    play: k,
    pause: _,
    togglePlay: M,
    seekTo: C,
    skip: T,
    setVolume: V,
    setPlaybackRate: L,
    cyclePlaybackRate: N,
    toggleMute: F
  };
}
const om = { class: "audio-player" }, am = /* @__PURE__ */ te({
  __name: "AudioPlayer",
  props: {
    audioSrc: { type: String },
    turns: { type: Array },
    speakers: { type: Map }
  },
  emits: ["timeupdate", "playStateChange"],
  setup(t, { expose: e, emit: n }) {
    const i = t, s = n, r = /* @__PURE__ */ U(null), {
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
      seekTo: b,
      pause: x,
      skip: w,
      setVolume: k,
      cyclePlaybackRate: _,
      toggleMute: M
    } = rm({
      containerRef: r,
      audioSrc: /* @__PURE__ */ ts(() => i.audioSrc),
      turns: /* @__PURE__ */ ts(() => i.turns),
      speakers: /* @__PURE__ */ ts(() => i.speakers)
    });
    return me(h, (C) => s("timeupdate", C)), me(o, (C) => s("playStateChange", C)), e({ seekTo: b, pause: x }), (C, T) => (A(), Q("footer", om, [
      X("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Je(["waveform-container", { "waveform-container--loading": g(l) }])
      }, null, 2),
      G(Gv, {
        "is-playing": g(o),
        "current-time": g(f),
        duration: g(p),
        volume: g(u),
        "playback-rate": g(c),
        "is-muted": g(d),
        "is-ready": g(a),
        onTogglePlay: g(m),
        onSkipBack: T[0] || (T[0] = (V) => g(w)(-10)),
        onSkipForward: T[1] || (T[1] = (V) => g(w)(10)),
        "onUpdate:volume": g(k),
        onToggleMute: g(M),
        onCyclePlaybackRate: g(_)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), lm = ".audio-player[data-v-9248e45e]{border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0}.waveform-container[data-v-9248e45e]{min-height:32px}.waveform-container--loading[data-v-9248e45e]{background:linear-gradient(90deg,var(--color-border-light, var(--color-border)) 25%,var(--color-border) 50%,var(--color-border-light, var(--color-border)) 75%);background-size:200% 100%;animation:shimmer-9248e45e 1.5s ease-in-out infinite;border-radius:var(--radius-sm)}@keyframes shimmer-9248e45e{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.waveform-container--loading[data-v-9248e45e]{animation:none}}", cm = /* @__PURE__ */ xe(am, [["styles", [lm]], ["__scopeId", "data-v-9248e45e"]]);
class um {
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
    let m = -1 / 0, b = 1 / 0;
    const x = () => {
      for (let w = Math.max(m, -u); w <= Math.min(b, u); w += 2) {
        let k;
        const _ = f[w - 1], M = f[w + 1];
        _ && (f[w - 1] = void 0);
        let C = !1;
        if (M) {
          const V = M.oldPos - w;
          C = M && 0 <= V && V < a;
        }
        const T = _ && _.oldPos + 1 < l;
        if (!C && !T) {
          f[w] = void 0;
          continue;
        }
        if (!T || C && _.oldPos < M.oldPos ? k = this.addToPath(M, !0, !1, 0, i) : k = this.addToPath(_, !1, !0, 1, i), p = this.extractCommon(k, n, e, w, i), k.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(k.lastComponent, n, e)) || !0;
        f[w] = k, k.oldPos + 1 >= l && (b = Math.min(b, w - 1)), p + 1 >= a && (m = Math.max(m, w + 1));
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
class dm extends um {
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
const fm = new dm();
function hm(t, e, n) {
  return fm.diff(t, e, n);
}
function bs({ previousText: t, previousIndexes: e }, n, i) {
  if (!n)
    return { previousText: t, previousIndexes: e };
  const s = t.split(" "), r = n.split(" "), o = hm(s, r, {
    comparator: vm
  }), a = pm(o), l = [...e];
  let u = [...e], c = 0;
  for (const f of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      u = bi(
        u,
        l[0],
        f.countAdded - f.countRemoved
      ), c += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const p = f;
      c += p.count, u = bi(
        u,
        l[0],
        -p.count
      );
    } else if ("added" in f && f.added) {
      const p = f;
      u = bi(
        u,
        l[0],
        p.count
      );
    } else
      c += f.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = r.slice(d).join(" ");
  if (i(h)) {
    const p = Al(
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
function pm(t) {
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
function bi(t, e, n) {
  return t.map((i) => i >= e ? i + n : i);
}
function Al(t, e) {
  const n = t.split(" ");
  if (!e(t) || n.length <= 1)
    return [];
  let i;
  for (i = 0; i < n.length; i++) {
    const s = n.slice(0, i).join(" ");
    if (e(s)) break;
  }
  return [i - 1].concat(
    bi(
      Al(
        n.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function vm(t, e) {
  const n = t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(n.length, i.length);
  let r = 0;
  for (let a = 0; a < s; a++)
    n[a] === i[a] && r++;
  return r / n.length > 0.8;
}
class mm {
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
class gm extends mm {
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
function Pl(t) {
  const e = Wt();
  let n = null;
  Ke(() => {
    t.canvasRef.value && (n = new gm(t.canvasRef.value, {
      fontSize: t.fontSize.value,
      lineHeight: t.lineHeight.value
    }));
  }), me([t.fontSize, t.lineHeight], ([l, u]) => {
    n && n.setFontSize(l, u);
  }), me(
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
  tn(() => {
    i(), r(), o(), a(), n?.dispose(), n = null;
  });
}
function Ml(t) {
  const e = /* @__PURE__ */ U(!1);
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
  return t && me(
    [t.display, t.pinned, t.frequency, t.duration],
    a
  ), Ke(a), _t(s), { visible: e };
}
const Po = /\$(\w+)/g;
function bm(t, e) {
  const n = [];
  let i = 0, s;
  for (Po.lastIndex = 0; (s = Po.exec(t)) !== null; ) {
    s.index > i && n.push({ type: "text", value: t.slice(i, s.index) });
    const r = s[1] ?? "", o = r ? e[r] : void 0;
    o ? n.push({ type: "token", src: o.src, alt: o.alt ?? r }) : n.push({ type: "text", value: s[0] }), i = s.index + s[0].length;
  }
  return i < t.length && n.push({ type: "text", value: t.slice(i) }), n;
}
const ym = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, _m = ["src", "alt"], wm = { key: 1 }, xm = /* @__PURE__ */ te({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(t) {
    const n = Wt().subtitle?.watermark, i = B(() => n ? bm(n.content.value, n.tokens.value) : []);
    return (s, r) => (A(), Y(nr, { name: "watermark" }, {
      default: se(() => [
        t.visible && g(n) ? (A(), Q("div", ym, [
          (A(!0), Q(ye, null, mn(i.value, (o, a) => (A(), Q(ye, { key: a }, [
            o.type === "token" ? (A(), Q("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, _m)) : (A(), Q("span", wm, re(o.value), 1))
          ], 64))), 128))
        ])) : le("", !0)
      ]),
      _: 1
    }));
  }
}), Sm = ".watermark[data-v-7d6bdc7d]{position:absolute;right:var(--spacing-md, 16px);bottom:4px;display:inline-flex;align-items:center;gap:.25em;font-size:1.2rem;color:var(--color-white, #fff);pointer-events:none;line-height:1}.watermark__img[data-v-7d6bdc7d]{height:1em;vertical-align:middle}.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .4s ease,transform .4s ease}.watermark-enter-from[data-v-7d6bdc7d],.watermark-leave-to[data-v-7d6bdc7d]{opacity:0;transform:translate(6px,6px)}@media(prefers-reduced-motion:reduce){.watermark-enter-active[data-v-7d6bdc7d],.watermark-leave-active[data-v-7d6bdc7d]{transition:opacity .01s;transform:none}}", Il = /* @__PURE__ */ xe(xm, [["styles", [Sm]], ["__scopeId", "data-v-7d6bdc7d"]]), km = ["height"], Cm = /* @__PURE__ */ te({
  __name: "SubtitleBanner",
  setup(t) {
    const e = Wt(), n = Nn("canvas"), i = B(() => e.subtitle?.fontSize.value ?? 40), s = B(() => 1.2 * i.value), r = B(() => 2.4 * i.value);
    Pl({
      canvasRef: n,
      fontSize: i,
      lineHeight: s
    });
    const { visible: o } = Ml(
      e.subtitle?.watermark
    );
    return Ke(() => {
      e.emit("subtitle:visible", { visible: !0, height: r.value });
    }), me(r, (a) => {
      e.emit("subtitle:visible", { visible: !0, height: a });
    }), _t(() => {
      e.emit("subtitle:visible", { visible: !1, height: 0 });
    }), (a, l) => (A(), Q("div", {
      class: "subtitle-banner",
      style: Ot({ height: r.value + "px" })
    }, [
      X("canvas", {
        ref: "canvas",
        class: Je(["subtitle-canvas", { "subtitle-canvas--shrunk": g(o) }]),
        height: r.value
      }, null, 10, km),
      G(Il, { visible: g(o) }, null, 8, ["visible"])
    ], 4));
  }
}), Tm = ".subtitle-banner[data-v-5b52c946]{position:fixed;bottom:0;left:0;right:0;flex-shrink:0;background-color:var(--color-black);overflow:hidden;z-index:1001}.subtitle-canvas[data-v-5b52c946]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:top center}.subtitle-canvas--shrunk[data-v-5b52c946]{transform:scale(.8) translateY(-8%)}@media(prefers-reduced-motion:reduce){.subtitle-canvas[data-v-5b52c946]{transition:none}}", Em = /* @__PURE__ */ xe(Cm, [["styles", [Tm]], ["__scopeId", "data-v-5b52c946"]]), Am = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Pm = ["aria-label"], Mm = /* @__PURE__ */ te({
  __name: "SubtitleFullscreen",
  setup(t) {
    const e = Wt(), { t: n } = nt(), i = Nn("container"), s = Nn("canvas"), r = B(() => e.subtitle?.fontSize.value ?? 48), o = B(() => 1.2 * r.value);
    Pl({
      canvasRef: s,
      fontSize: r,
      lineHeight: o
    });
    const { visible: a } = Ml(
      e.subtitle?.watermark
    );
    Ke(async () => {
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
    Ke(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function u() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return tn(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, d) => (A(), Q("div", Am, [
      X("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": g(n)("subtitle.exitFullscreen"),
        onClick: u
      }, [
        G(g(rr), { size: 24 })
      ], 8, Pm),
      X("canvas", {
        ref: "canvas",
        class: Je(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": g(a) }])
      }, null, 2),
      G(Il, { visible: g(a) }, null, 8, ["visible"])
    ], 512));
  }
}), Im = ".subtitle-fullscreen[data-v-f31885e0]{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-black)}.subtitle-fullscreen__close[data-v-f31885e0]{position:absolute;top:var(--spacing-md, 16px);right:var(--spacing-md, 16px);z-index:1;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#ffffff1a;color:var(--color-white);border-radius:var(--radius-md, 8px);cursor:pointer;transition:background-color var(--transition-duration) ease}.subtitle-fullscreen__close[data-v-f31885e0]:hover,.subtitle-fullscreen__close[data-v-f31885e0]:focus-visible{background:#ffffff40;outline:2px solid rgba(255,255,255,.5);outline-offset:2px}.subtitle-fullscreen__canvas[data-v-f31885e0]{display:block;width:100%;height:100%;transition:transform .4s ease;transform-origin:center}.subtitle-fullscreen__canvas--shrunk[data-v-f31885e0]{transform:scale(.85) translateY(-4%)}@media(prefers-reduced-motion:reduce){.subtitle-fullscreen__close[data-v-f31885e0],.subtitle-fullscreen__canvas[data-v-f31885e0]{transition:none}}", Om = /* @__PURE__ */ xe(Mm, [["styles", [Im]], ["__scopeId", "data-v-f31885e0"]]), Lm = /* @__PURE__ */ te({
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
    const n = t, i = /* @__PURE__ */ U(!1);
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
    const o = B(() => i.value ? "check" : n.icon), a = B(() => nl[n.size ?? "sm"]);
    return (l, u) => (A(), Y(et, {
      variant: t.variant,
      size: t.size,
      disabled: t.disabled,
      block: t.block,
      "aria-label": t.ariaLabel,
      class: Je({ "copy-btn--copied": i.value }),
      onClick: r
    }, {
      icon: se(() => [
        G(nr, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: se(() => [
            (A(), Y(pi, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: se(() => [
        _e(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Rm = ".copy-btn--copied[data-v-eed7503d]{color:var(--color-success, #2e7d32)}.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:opacity var(--transition-duration) ease,scale var(--transition-duration) ease}.copy-icon-enter-from[data-v-eed7503d],.copy-icon-leave-to[data-v-eed7503d]{opacity:0;scale:.6}@media(prefers-reduced-motion:reduce){.copy-icon-enter-active[data-v-eed7503d],.copy-icon-leave-active[data-v-eed7503d]{transition:none}}", Mo = /* @__PURE__ */ xe(Lm, [["styles", [Rm]], ["__scopeId", "data-v-eed7503d"]]), Dm = ["aria-label"], $m = { class: "selection-count" }, Fm = { class: "selection-actions" }, zm = /* @__PURE__ */ te({
  __name: "SelectionActionBar",
  setup(t) {
    const e = bl(), { t: n } = nt();
    return (i, s) => g(e).hasSelection.value ? (A(), Q("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": g(n)("selection.count")
    }, [
      X("span", $m, re(g(e).count.value) + " " + re(g(n)("selection.count")), 1),
      X("div", Fm, [
        G(Mo, {
          icon: "clipboard-type",
          "copy-fn": g(e).copyText,
          variant: "secondary"
        }, {
          default: se(() => [
            Ye(re(g(n)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        G(Mo, {
          icon: "clipboard-list",
          "copy-fn": g(e).copyWithMetadata
        }, {
          default: se(() => [
            Ye(re(g(n)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        G(et, {
          variant: "transparent",
          icon: "x",
          onClick: s[0] || (s[0] = (r) => g(e).clear())
        }, {
          default: se(() => [
            Ye(re(g(n)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Dm)) : le("", !0);
  }
}), Bm = ".selection-bar[data-v-7569d6ad]{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-xs) var(--spacing-lg);background:var(--glass-background);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border-bottom:1px solid var(--color-border);animation:bar-slide-down-7569d6ad var(--transition-duration) ease}.selection-count[data-v-7569d6ad]{font-size:var(--font-size-sm);font-weight:600;color:var(--color-primary)}.selection-actions[data-v-7569d6ad]{display:flex;gap:var(--spacing-xs)}@keyframes bar-slide-down-7569d6ad{0%{opacity:0;translate:0 -4px}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){.selection-bar[data-v-7569d6ad]{animation:none}}@media(max-width:767px){.selection-bar[data-v-7569d6ad]{padding:var(--spacing-xs) var(--spacing-md);flex-wrap:wrap;gap:var(--spacing-xs)}}", Nm = /* @__PURE__ */ xe(zm, [["styles", [Bm]], ["__scopeId", "data-v-7569d6ad"]]), jm = "(max-width: 767px)";
function Hm() {
  const t = /* @__PURE__ */ U(!1);
  let e = null;
  function n(i) {
    t.value = i.matches;
  }
  return Ke(() => {
    e = window.matchMedia(jm), t.value = e.matches, e.addEventListener("change", n);
  }), _t(() => {
    e?.removeEventListener("change", n);
  }), { isMobile: t };
}
const Wm = { class: "editor-layout" }, Vm = { class: "editor-body" }, qm = {
  key: 4,
  class: "mobile-selectors"
}, Um = /* @__PURE__ */ te({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = Wt(), { isMobile: i } = Hm(), s = /* @__PURE__ */ U(!1), r = B(
      () => n.activeChannel.value.activeTranslation.value.turns.value
    ), o = n.speakers.all;
    Tp(r, o, n);
    const a = B(() => [...n.channels.values()]), l = B(
      () => n.activeChannel.value.selectableTranslations
    ), u = B(
      () => n.activeChannel.value.activeTranslation.value.id
    ), c = B(() => Array.from(o.values())), d = Nn("audioPlayer");
    function h(m) {
      n.audio && (n.audio.currentTime.value = m);
    }
    me(
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
    return (m, b) => (A(), Q("div", Wm, [
      e.showHeader ? (A(), Y(ff, {
        key: 0,
        title: g(n).title.value,
        duration: g(n).activeChannel.value.duration,
        language: u.value,
        "is-mobile": g(i),
        onToggleSidebar: b[0] || (b[0] = (x) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : le("", !0),
      G(Nm),
      X("main", Vm, [
        G(Gp, {
          turns: r.value,
          speakers: g(o)
        }, null, 8, ["turns", "speakers"]),
        g(i) ? le("", !0) : (A(), Y(So, {
          key: 0,
          speakers: c.value,
          channels: a.value,
          "selected-channel-id": g(n).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        g(i) ? (A(), Y(zv, {
          key: 1,
          open: s.value,
          "onUpdate:open": b[1] || (b[1] = (x) => s.value = x)
        }, {
          default: se(() => [
            G(So, {
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
        }, 8, ["open"])) : le("", !0)
      ]),
      g(n).audio?.src.value ? (A(), Y(cm, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": g(n).audio.src.value,
        turns: r.value,
        speakers: g(o),
        onTimeupdate: h,
        onPlayStateChange: b[2] || (b[2] = (x) => {
          g(n).audio && (g(n).audio.isPlaying.value = x);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : le("", !0),
      g(n).subtitle?.isVisible.value && !g(i) && !g(n).subtitle.isFullscreen.value ? (A(), Y(Em, { key: 2 })) : le("", !0),
      g(n).subtitle?.isFullscreen.value ? (A(), Y(Om, { key: 3 })) : le("", !0),
      g(i) && (a.value.length > 1 || l.value.length > 1) ? (A(), Q("div", qm, [
        a.value.length > 1 ? (A(), Y(_l, {
          key: 0,
          channels: a.value,
          "selected-channel-id": g(n).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : le("", !0),
        l.value.length > 1 ? (A(), Y(wl, {
          key: 1,
          translations: l.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["translations", "selected-translation-id"])) : le("", !0)
      ])) : le("", !0)
    ]));
  }
}), Km = ".editor-layout[data-v-028b08c1]{display:flex;flex-direction:column;height:100%;overflow:hidden;background-color:var(--color-background)}.editor-body[data-v-028b08c1]{display:grid;grid-template-columns:1fr var(--sidebar-width);flex:1;min-height:0}.mobile-selectors[data-v-028b08c1]{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);border-top:1px solid var(--color-border);background-color:var(--color-surface);flex-shrink:0;box-shadow:var(--shadow-md);align-items:end}.mobile-selectors[data-v-028b08c1]>*{flex:1;min-width:0}@media(max-width:767px){.editor-body[data-v-028b08c1]{grid-template-columns:1fr}}", Gm = /* @__PURE__ */ xe(Um, [["styles", [Km]], ["__scopeId", "data-v-028b08c1"]]), Xm = /* @__PURE__ */ te({
  __name: "WebComponent",
  props: {
    locale: { default: "fr", type: String },
    noHeader: { type: Boolean, default: !1 }
  },
  setup(t, { expose: e }) {
    const n = t, i = /* @__PURE__ */ U(n.locale);
    Xd(i), me(
      () => n.locale,
      (r) => {
        i.value = r;
      }
    );
    const s = kp();
    return Cp(s), e({ editor: s }), (r, o) => g(s)?.channels?.size ? (A(), Y(Gm, {
      key: 0,
      "show-header": !n.noHeader
    }, null, 8, ["show-header"])) : le("", !0);
  }
}), Ym = ':root,:host{--color-background: #f8f9fa;--color-surface: #ffffff;--color-surface-hover: #f1f3f5;--color-text-primary: #1a1d21;--color-text-secondary: #495057;--color-text-muted: #6c757d;--color-primary: #4263eb;--color-primary-hover: #3b5bdb;--color-border: #dee2e6;--color-border-light: #e9ecef;--color-white: #ffffff;--color-black: #000000;--color-danger: #e53935;--color-danger-hover: #c62828;--color-danger-soft: #fdecea;--font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, sans-serif;--font-family-mono: "Atkinson Hyperlegible Mono", ui-monospace, monospace;--font-size-xs: .875rem;--font-size-sm: 1rem;--font-size-base: 1.125rem;--font-size-lg: 1.25rem;--font-size-xl: 1.75rem;--line-height: 1.6;--spacing-xxs: .125rem;--spacing-xs: .25rem;--spacing-sm: .5rem;--spacing-md: 1rem;--spacing-lg: 1.5rem;--spacing-xl: 2rem;--radius-sm: 4px;--radius-md: 8px;--radius-lg: 12px;--sidebar-width: 300px;--header-height: 56px;--shadow-sm: 0 4px 12px rgba(0, 0, 0, .1);--shadow-md: 0 4px 16px rgba(0, 0, 0, .15);--transition-duration: .15s;--z-sticky: 10;--z-overlay: 50;--z-drawer: 51;--z-dropdown: 100;--glass-background: rgba(255, 255, 255, .8);--glass-blur: blur(12px);--glass-border: rgba(255, 255, 255, .3)}:host,body{font-family:var(--font-family);font-size:var(--font-size-base);line-height:var(--line-height);color:var(--color-text-primary);background-color:var(--color-background);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}:host{display:block;height:100%;overflow:hidden}*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body,#app{height:100%;overflow:hidden}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.editor-overlay{position:fixed;inset:0;background-color:#0006;z-index:var(--z-overlay);animation:overlay-fade-in .2s ease}.sidebar-drawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,85vw);z-index:var(--z-drawer);background-color:var(--color-surface);box-shadow:var(--shadow-md);animation:drawer-slide-in .25s ease;overflow-y:auto;display:flex;flex-direction:column}.sidebar-close{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;color:var(--color-text-muted);border-radius:var(--radius-md);cursor:pointer;z-index:1}.sidebar-close:hover{background-color:var(--color-surface-hover);color:var(--color-text-primary)}@keyframes overlay-fade-in{0%{opacity:0}to{opacity:1}}@keyframes drawer-slide-in{0%{translate:100% 0}to{translate:0 0}}@media(prefers-reduced-motion:reduce){.editor-overlay,.sidebar-drawer{animation:none}}.waveform-container ::part(region){backdrop-filter:blur(.5px);-webkit-backdrop-filter:blur(.5px);border-top:2px solid var(--region-color, rgba(255, 255, 255, .4));border-bottom:1px solid var(--region-color, rgba(255, 255, 255, .4));box-shadow:inset 0 1px #fff3,0 1px 4px #0000001a}.sidebar-select{width:100%;font-size:var(--font-size-sm);font-family:inherit;border:1px solid var(--color-border);border-radius:var(--radius-md);background-color:var(--color-surface);color:var(--color-text-primary);padding:var(--spacing-sm)}', Jm = /* @__PURE__ */ xe(Xm, [["styles", [Ym]]]), Ol = typeof window < "u" && "speechSynthesis" in window;
function Gi() {
  return Ol;
}
function Zm() {
  return Ol && window.speechSynthesis.getVoices().length > 0;
}
function Qm(t, e) {
  if (!Gi()) return;
  const n = t.trim();
  if (!n) return;
  const i = new SpeechSynthesisUtterance(n);
  e && e !== "*" && (i.lang = e), window.speechSynthesis.speak(i);
}
function eg() {
  Gi() && window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
}
function Io() {
  Gi() && window.speechSynthesis.cancel();
}
function Oo(t) {
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
    language: t.language,
    sourceLanguage: t.language
  };
}
function ys(t, e) {
  return {
    id: t.turnId,
    speakerId: t.speakerId,
    text: e.text,
    words: [],
    startTime: t.startTime,
    endTime: t.endTime,
    startDate: t.startDate,
    endDate: t.endDate,
    language: e.language,
    sourceLanguage: e.sourceLanguage
  };
}
function rg(t = {}) {
  const e = t.tts ?? !1;
  return {
    name: "live",
    install(n) {
      const i = /* @__PURE__ */ hn(null), s = /* @__PURE__ */ U(!1), r = /* @__PURE__ */ U(!1), o = Gi(), a = /* @__PURE__ */ U(!1);
      function l() {
        a.value = Zm();
      }
      o && (l(), window.speechSynthesis.addEventListener("voiceschanged", l));
      let u = null;
      s.value = !0;
      function c() {
        i.value = null, u = null;
      }
      function d(P, I) {
        return P.isSource ? !1 : P.languages.some((q) => Pi(q, I));
      }
      function h(P, I) {
        if (n.activeChannelId.value !== I) return;
        u = P, n.activeChannel.value.activeTranslation.value.isSource && P.text != null && (i.value = P.text);
      }
      let f = null;
      function p() {
        f === null && (f = setTimeout(() => {
          f = null, c();
        }, 150));
      }
      function m() {
        f !== null && (clearTimeout(f), f = null);
      }
      function b(P, I) {
        P.hasTurn(I.id) ? P.updateTurn(I.id, I) : P.addTurn(I);
      }
      function x(P, I) {
        P.speakerId && n.speakers.ensure(P.speakerId);
        const q = n.channels.get(I);
        if (!q) {
          _();
          return;
        }
        if (P.text != null && b(
          q.sourceTranslation,
          Oo(P)
        ), P.translations)
          for (const K of P.translations) {
            const ae = q.translations.get(K.translationId);
            ae && b(
              ae,
              ys(P, {
                ...K,
                sourceLanguage: P.language
              })
            );
          }
        n.activeChannel.value.activeTranslation.value.isSource && _(), r.value && P.text != null && n.activeChannelId.value === I && Qm(P.text, P.language);
      }
      function w(P, I) {
        k([P], I);
      }
      function k(P, I) {
        const q = n.channels.get(I);
        if (!q) return;
        const oe = /* @__PURE__ */ new Set();
        for (const ue of P)
          ue.speakerId && !oe.has(ue.speakerId) && (oe.add(ue.speakerId), n.speakers.ensure(ue.speakerId));
        const K = [];
        for (const ue of P)
          ue.text != null && K.push(Oo(ue));
        K.length > 0 && q.sourceTranslation.prependTurns(K);
        const ae = /* @__PURE__ */ new Map();
        for (const ue of P)
          if (ue.translations)
            for (const Ie of ue.translations) {
              let Te = ae.get(Ie.translationId);
              Te || (Te = [], ae.set(Ie.translationId, Te)), Te.push(
                ys(ue, {
                  ...Ie,
                  sourceLanguage: ue.language
                })
              );
            }
        for (const [ue, Ie] of ae) {
          const Te = q.translations.get(ue);
          Te && Te.prependTurns(Ie);
        }
      }
      function _() {
        m(), c();
      }
      function M(P) {
        const I = n.activeChannel.value.activeTranslation.value, q = n.activeChannel.value;
        if (!P.final) {
          I.id === en ? P.turnId === u?.turnId && !Pi(P.language, u?.language) && (i.value = P.text) : d(I, P.language) && (i.value = P.text);
          return;
        }
        const oe = q.translations.get(P.language);
        if (oe) {
          const K = ys(
            { ...P },
            P
          );
          oe === I || I.id === en ? b(oe, K) : oe.updateOrCreateTurnSilent(K);
        }
        (d(I, P.language) || I.id === en) && _();
      }
      function C() {
        r.value = !0, eg();
      }
      function T() {
        r.value = !1, Io();
      }
      const V = {
        partial: i,
        hasLiveUpdate: s,
        ttsAvailable: e,
        ttsEnabled: r,
        ttsReady: a,
        enableTTS: C,
        disableTTS: T,
        onPartial: h,
        onFinal: x,
        prependFinal: w,
        prependFinalBatch: k,
        onTranslation: M
      }, F = n.on(
        "channel:change",
        _
      ), L = n.on(
        "translation:change",
        _
      ), N = n.on(
        "translation:sync",
        p
      ), E = n.on("channel:sync", p);
      return n.live = V, () => {
        _(), Io(), o && window.speechSynthesis.removeEventListener(
          "voiceschanged",
          l
        ), F(), L(), N(), E(), n.live = void 0;
      };
    }
  };
}
function og() {
  return {
    name: "audio",
    install(t) {
      const e = /* @__PURE__ */ U(0), n = /* @__PURE__ */ U(!1);
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
function ag(t = {}) {
  return {
    name: "subtitle",
    install(e) {
      const n = /* @__PURE__ */ U(t.fontSize ?? 40), i = /* @__PURE__ */ U(t.isVisible ?? !1), s = /* @__PURE__ */ U(!1);
      let r;
      const o = [];
      if (t.watermark) {
        const l = t.watermark;
        r = {
          display: /* @__PURE__ */ U(l.display ?? !1),
          pinned: /* @__PURE__ */ U(l.pinned ?? !1),
          content: /* @__PURE__ */ U(l.content ?? ""),
          frequency: /* @__PURE__ */ U(l.frequency ?? 30),
          duration: /* @__PURE__ */ U(l.duration ?? 5),
          tokens: /* @__PURE__ */ U(l.tokens ?? {}),
          readonly: l.readonly ?? !1
        }, o.push(
          me(
            r.display,
            (u) => e.emit("watermark:display", { display: u })
          ),
          me(
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
const tg = /* @__PURE__ */ ad(Jm);
function ng() {
  const t = "linto-editor-fonts";
  if (document.getElementById(t)) return;
  const e = document.createElement("style");
  e.id = t, e.textContent = gd, document.head.appendChild(e);
}
function lg(t = "linto-editor") {
  ng(), customElements.define(t, tg);
}
export {
  tg as LintoEditor,
  og as createAudioPlugin,
  rg as createLivePlugin,
  ag as createSubtitlePlugin,
  lg as register
};
