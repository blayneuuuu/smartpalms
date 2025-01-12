import {
  ag as N,
  _ as L,
  ah as P,
  E as w,
  V as q,
  ad as x,
  p as U,
  T as Y,
  ai as S,
  aj as E,
  ak as F,
  al as G,
  H as p,
  R as c,
  I as C,
  M as k,
  am as M,
  an as z,
  ao as X,
  ap as R,
  N as b,
  aq as J,
  ar as K,
  as as Q,
  at as Z,
  au as ee,
  av as te,
  P as re,
  v as ae,
  y as ne,
  c as oe,
} from "./index-client.CvPjOW-w.js";
function he(e) {
  return (
    e.endsWith("capture") &&
    e !== "gotpointercapture" &&
    e !== "lostpointercapture"
  );
}
const ie = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart",
];
function me(e) {
  return ie.includes(e);
}
const se = {
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
};
function ye(e) {
  return (e = e.toLowerCase()), se[e] ?? e;
}
const ue = ["touchstart", "touchmove"];
function le(e) {
  return ue.includes(e);
}
const ce = ["textarea", "script", "style", "title"];
function ge(e) {
  return ce.includes(e);
}
function de(e) {
  var t = P,
    r = w;
  N(null), L(null);
  try {
    return e();
  } finally {
    N(t), L(r);
  }
}
const W = new Set(),
  I = new Set();
function fe(e, t, r, i) {
  function n(a) {
    if ((i.capture || g.call(t, a), !a.cancelBubble))
      return de(() => r.call(this, a));
  }
  return (
    e.startsWith("pointer") || e.startsWith("touch") || e === "wheel"
      ? Y(() => {
          t.addEventListener(e, n, i);
        })
      : t.addEventListener(e, n, i),
    n
  );
}
function Ee(e, t, r, i, n) {
  var a = { capture: i, passive: n },
    o = fe(e, t, r, a);
  (t === document.body || t === window || t === document) &&
    q(() => {
      t.removeEventListener(e, o, a);
    });
}
function we(e) {
  for (var t = 0; t < e.length; t++) W.add(e[t]);
  for (var r of I) r(e);
}
function g(e) {
  var V;
  var t = this,
    r = t.ownerDocument,
    i = e.type,
    n = ((V = e.composedPath) == null ? void 0 : V.call(e)) || [],
    a = n[0] || e.target,
    o = 0,
    d = e.__root;
  if (d) {
    var l = n.indexOf(d);
    if (l !== -1 && (t === document || t === window)) {
      e.__root = t;
      return;
    }
    var m = n.indexOf(t);
    if (m === -1) return;
    l <= m && (o = l);
  }
  if (((a = n[o] || e.target), a !== t)) {
    x(e, "currentTarget", {
      configurable: !0,
      get() {
        return a || r;
      },
    });
    var A = P,
      f = w;
    N(null), L(null);
    try {
      for (var s, u = []; a !== null; ) {
        var v = a.assignedSlot || a.parentNode || a.host || null;
        try {
          var h = a["__" + i];
          if (h !== void 0 && !a.disabled)
            if (U(h)) {
              var [$, ...B] = h;
              $.apply(a, [e, ...B]);
            } else h.call(a, e);
        } catch (T) {
          s ? u.push(T) : (s = T);
        }
        if (e.cancelBubble || v === t || v === null) break;
        a = v;
      }
      if (s) {
        for (let T of u)
          queueMicrotask(() => {
            throw T;
          });
        throw s;
      }
    } finally {
      (e.__root = t), delete e.currentTarget, N(A), L(f);
    }
  }
}
function j(e) {
  var t = document.createElement("template");
  return (t.innerHTML = e), t.content;
}
function _(e, t) {
  var r = w;
  r.nodes_start === null && ((r.nodes_start = e), (r.nodes_end = t));
}
function Te(e, t) {
  var r = (t & F) !== 0,
    i = (t & G) !== 0,
    n,
    a = !e.startsWith("<!>");
  return () => {
    if (p) return _(c, null), c;
    n === void 0 && ((n = j(a ? e : "<!>" + e)), r || (n = E(n)));
    var o = i ? document.importNode(n, !0) : n.cloneNode(!0);
    if (r) {
      var d = E(o),
        l = o.lastChild;
      _(d, l);
    } else _(o, o);
    return o;
  };
}
function be(e, t, r = "svg") {
  var i = !e.startsWith("<!>"),
    n = `<${r}>${i ? e : "<!>" + e}</${r}>`,
    a;
  return () => {
    if (p) return _(c, null), c;
    if (!a) {
      var o = j(n),
        d = E(o);
      a = E(d);
    }
    var l = a.cloneNode(!0);
    return _(l, l), l;
  };
}
function Ne(e = "") {
  if (!p) {
    var t = S(e + "");
    return _(t, t), t;
  }
  var r = c;
  return r.nodeType !== 3 && (r.before((r = S())), k(r)), _(r, r), r;
}
function Le() {
  if (p) return _(c, null), c;
  var e = document.createDocumentFragment(),
    t = document.createComment(""),
    r = S();
  return e.append(t, r), _(t, r), e;
}
function Se(e, t) {
  if (p) {
    (w.nodes_end = c), C();
    return;
  }
  e !== null && e.before(t);
}
let O = !0;
function Ae(e) {
  O = e;
}
function Re(e, t) {
  var r = t == null ? "" : typeof t == "object" ? t + "" : t;
  r !== (e.__t ?? (e.__t = e.nodeValue)) &&
    ((e.__t = r), (e.nodeValue = r == null ? "" : r + ""));
}
function _e(e, t) {
  return H(e, t);
}
function ke(e, t) {
  M(), (t.intro = t.intro ?? !1);
  const r = t.target,
    i = p,
    n = c;
  try {
    for (var a = E(r); a && (a.nodeType !== 8 || a.data !== z); ) a = X(a);
    if (!a) throw R;
    b(!0), k(a), C();
    const o = H(e, { ...t, anchor: a });
    if (c === null || c.nodeType !== 8 || c.data !== J) throw (K(), R);
    return b(!1), o;
  } catch (o) {
    if (o === R) return t.recover === !1 && Q(), M(), Z(r), b(!1), _e(e, t);
    throw o;
  } finally {
    b(i), k(n);
  }
}
const y = new Map();
function H(
  e,
  { target: t, anchor: r, props: i = {}, events: n, context: a, intro: o = !0 },
) {
  M();
  var d = new Set(),
    l = (f) => {
      for (var s = 0; s < f.length; s++) {
        var u = f[s];
        if (!d.has(u)) {
          d.add(u);
          var v = le(u);
          t.addEventListener(u, g, { passive: v });
          var h = y.get(u);
          h === void 0
            ? (document.addEventListener(u, g, { passive: v }), y.set(u, 1))
            : y.set(u, h + 1);
        }
      }
    };
  l(ee(W)), I.add(l);
  var m = void 0,
    A = te(() => {
      var f = r ?? t.appendChild(S());
      return (
        re(() => {
          if (a) {
            ae({});
            var s = oe;
            s.c = a;
          }
          n && (i.$$events = n),
            p && _(f, null),
            (O = o),
            (m = e(f, i) || {}),
            (O = !0),
            p && (w.nodes_end = c),
            a && ne();
        }),
        () => {
          var v;
          for (var s of d) {
            t.removeEventListener(s, g);
            var u = y.get(s);
            --u === 0
              ? (document.removeEventListener(s, g), y.delete(s))
              : y.set(s, u);
          }
          I.delete(l),
            f !== r && ((v = f.parentNode) == null || v.removeChild(f));
        }
      );
    });
  return D.set(m, A), m;
}
let D = new WeakMap();
function Me(e, t) {
  const r = D.get(e);
  return r ? (D.delete(e), r(t)) : Promise.resolve();
}
const ve = "5";
typeof window < "u" &&
  (window.__svelte || (window.__svelte = { v: new Set() })).v.add(ve);
export {
  Se as a,
  Ne as b,
  Le as c,
  we as d,
  Ee as e,
  _ as f,
  Ae as g,
  ke as h,
  ge as i,
  he as j,
  fe as k,
  me as l,
  _e as m,
  ye as n,
  O as o,
  be as p,
  Re as s,
  Te as t,
  Me as u,
};
