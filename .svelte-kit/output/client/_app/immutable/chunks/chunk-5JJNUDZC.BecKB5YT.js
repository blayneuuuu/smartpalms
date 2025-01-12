import {
  c as v,
  a as p,
  t as R,
  m as y,
  u as k,
  d as w,
} from "./disclose-version.CkmQrO1S.js";
import {
  G as J,
  J as W,
  P as j,
  n as K,
  ax as H,
  H as V,
  R as Y,
  ay as g,
  az as E,
  w as b,
  y as h,
  v as m,
  a as z,
  aA as G,
  g as f,
  C,
  l as X,
  ab as U,
  ae as M,
} from "./index-client.CvPjOW-w.js";
import { i as q, p as Z, r as L, c as Q } from "./props.HYy-qROY.js";
function _(e, r, ...n) {
  var t = e,
    s = K,
    a;
  J(() => {
    s !== (s = r()) && (a && (H(a), (a = null)), (a = j(() => s(t, ...n))));
  }, W),
    V && (t = Y);
}
const O = "$$_clerk",
  B = () => {
    const e = g(O);
    if (!e)
      throw new Error(
        "No Clerk data was found in Svelte context. Did you forget to wrap your component with ClerkProvider?",
      );
    return e;
  },
  Le = (e) => {
    E(O, e);
  };
function ee(e, r) {
  m(r, !0);
  const n = B();
  var t = v(),
    s = b(t);
  {
    var a = (o) => {
      var c = v(),
        l = b(c);
      _(
        l,
        () => r.children,
        () => n.clerk,
      ),
        p(o, c);
    };
    q(s, (o) => {
      n.isLoaded && o(a);
    });
  }
  p(e, t), h();
}
var re = R("<div></div>"),
  te = R("<!> <!>", 1);
function ne(e, r) {
  m(r, !0);
  const n = L(r, ["$$slots", "$$events", "$$legacy", "children"]);
  let t = U(null),
    s = U(!1),
    a = Z(n);
  const o = B();
  E("$$_userButton", {
    addCustomMenuItem(i, d) {
      a.customMenuItems = [...(a.customMenuItems || []), d];
    },
    addCustomPage(i) {
      var d;
      a.userProfileProps = {
        ...a.userProfileProps,
        customPages: [
          ...(((d = a.userProfileProps) == null ? void 0 : d.customPages) ||
            []),
          i,
        ],
      };
    },
  }),
    z(() => {
      f(t) &&
        o.clerk &&
        (f(s)
          ? o.clerk.__unstable__updateProps({ node: f(t), props: a })
          : (o.clerk.mountUserButton(f(t), n), C(s, !0)));
    }),
    G(() => {
      var i;
      f(s) && ((i = o.clerk) == null || i.unmountUserButton(f(t)));
    });
  var c = te(),
    l = b(c);
  ee(l, {
    children: (d) => {
      var x = re();
      Q(
        x,
        (F) => C(t, F),
        () => f(t),
      ),
        p(d, x);
    },
    $$slots: { default: !0 },
  });
  var u = X(l, 2);
  _(u, () => r.children ?? K), p(e, c), h();
}
function P(e, r) {
  m(r, !0);
  var n = v(),
    t = b(n);
  _(t, () => r.children), p(e, n), h();
}
function ae(e, r) {
  m(r, !0);
  const { addCustomMenuItem: n } = g("$$_userButtonMenuItems"),
    t = L(r, ["$$slots", "$$events", "$$legacy"]);
  M(() => {
    if (r.label === "manageAccount" || r.label === "signOut") {
      n("action", { label: r.label });
      return;
    }
    const { label: s, onclick: a, open: o, labelIcon: c } = t;
    let l;
    n("action", {
      label: s,
      mountIcon(u) {
        l = y(P, { target: u, props: { children: c } });
      },
      unmountIcon() {
        l && k(l);
      },
      ...(a ? { onClick: a } : { open: o.startsWith("/") ? o : `/${o}` }),
    });
  }),
    h();
}
function se(e, r) {
  m(r, !0);
  const { addCustomMenuItem: n } = g("$$_userButtonMenuItems");
  M(() => {
    let t;
    n("link", {
      label: r.label,
      mountIcon(s) {
        t = y(P, { target: s, props: { children: r.labelIcon } });
      },
      unmountIcon() {
        t && k(t);
      },
      href: r.href,
    });
  }),
    h();
}
function oe(e, r) {
  m(r, !0);
  const n = g("$$_userButton");
  E("$$_userButtonMenuItems", n);
  var t = v(),
    s = b(t);
  _(s, () => r.children), p(e, t), h();
}
function ie(e, r) {
  m(r, !0);
  const { addCustomPage: n } = g("$$_userButton");
  M(() => {
    let t, s;
    n({
      label: r.label,
      url: r.url,
      mountIcon(a) {
        t = y(P, { target: a, props: { children: r.labelIcon } });
      },
      unmountIcon() {
        t && k(t);
      },
      mount(a) {
        s = y(P, { target: a, props: { children: r.children } });
      },
      unmount() {
        s && k(s);
      },
    });
  }),
    h();
}
const Oe = Object.assign(ne, {
  MenuItems: oe,
  Action: ae,
  Link: se,
  UserProfilePage: ie,
});
w(["click"]);
w(["click"]);
w(["click"]);
var le = (e, r = "5.43.6") => {
    if (e) return e;
    const n = ce(r);
    return n ? (n === "snapshot" ? "5.43.6" : n) : ue(r);
  },
  ce = (e) => {
    var r;
    return (r = e
      .trim()
      .replace(/^v/, "")
      .match(/-(.+?)(\.|$)/)) == null
      ? void 0
      : r[1];
  },
  ue = (e) => e.trim().replace(/^v/, "").split(".")[0];
function de(e) {
  return e ? fe(e) || D(e) : !0;
}
function fe(e) {
  return /^http(s)?:\/\//.test(e || "");
}
function D(e) {
  return e.startsWith("/");
}
function he(e) {
  return e ? (D(e) ? new URL(e, window.location.origin).toString() : e) : "";
}
var me = [
  ".lcl.dev",
  ".stg.dev",
  ".lclstage.dev",
  ".stgstage.dev",
  ".dev.lclclerk.com",
  ".stg.lclclerk.com",
  ".accounts.lclclerk.com",
  "accountsstage.dev",
  "accounts.dev",
];
function pe(e) {
  if (!e) return "";
  let r;
  if (e.match(/^(clerk\.)+\w*$/)) r = /(clerk\.)*(?=clerk\.)/;
  else {
    if (e.match(/\.clerk.accounts/)) return e;
    r = /^(clerk\.)*/gi;
  }
  return `clerk.${e.replace(r, "")}`;
}
var be = {
    firstDelay: 125,
    maxDelay: 0,
    timeMultiple: 2,
    shouldRetry: () => !0,
  },
  ge = async (e) => new Promise((r) => setTimeout(r, e)),
  ve = (e) => {
    let r = 0;
    const n = () => {
      const t = e.firstDelay,
        s = e.timeMultiple,
        a = t * Math.pow(s, r);
      return Math.min(e.maxDelay || a, a);
    };
    return async () => {
      await ge(n()), r++;
    };
  },
  ye = async (e, r = {}) => {
    let n = 0;
    const {
        shouldRetry: t,
        firstDelay: s,
        maxDelay: a,
        timeMultiple: o,
      } = { ...be, ...r },
      c = ve({ firstDelay: s, maxDelay: a, timeMultiple: o });
    for (;;)
      try {
        return await e();
      } catch (l) {
        if ((n++, !t(l, n))) throw l;
        await c();
      }
  },
  ke = "loadScript cannot be called when document does not exist",
  Pe = "loadScript cannot be called without a src";
async function _e(e = "", r) {
  const { async: n, defer: t, beforeLoad: s, crossOrigin: a, nonce: o } = r;
  return ye(
    () =>
      new Promise((l, u) => {
        e || u(Pe), (!document || !document.body) && u(ke);
        const i = document.createElement("script");
        a && i.setAttribute("crossorigin", a),
          (i.async = n || !1),
          (i.defer = t || !1),
          i.addEventListener("load", () => {
            i.remove(), l(i);
          }),
          i.addEventListener("error", () => {
            i.remove(), u();
          }),
          (i.src = e),
          (i.nonce = o),
          s == null || s(i),
          document.body.appendChild(i);
      }),
    { shouldRetry: (l, u) => u < 5 },
  );
}
var we = Object.freeze({
  InvalidProxyUrlErrorMessage:
    "The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})",
  InvalidPublishableKeyErrorMessage:
    "The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})",
  MissingPublishableKeyErrorMessage:
    "Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
  MissingSecretKeyErrorMessage:
    "Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
  MissingClerkProvider:
    "{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider",
});
function Ee({ packageName: e, customMessages: r }) {
  let n = e;
  const t = { ...we, ...r };
  function s(a, o) {
    if (!o) return `${n}: ${a}`;
    let c = a;
    const l = a.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const u of l) {
      const i = (o[u[1]] || "").toString();
      c = c.replace(`{{${u[1]}}}`, i);
    }
    return `${n}: ${c}`;
  }
  return {
    setPackageName({ packageName: a }) {
      return typeof a == "string" && (n = a), this;
    },
    setMessages({ customMessages: a }) {
      return Object.assign(t, a || {}), this;
    },
    throwInvalidPublishableKeyError(a) {
      throw new Error(s(t.InvalidPublishableKeyErrorMessage, a));
    },
    throwInvalidProxyUrl(a) {
      throw new Error(s(t.InvalidProxyUrlErrorMessage, a));
    },
    throwMissingPublishableKeyError() {
      throw new Error(s(t.MissingPublishableKeyErrorMessage));
    },
    throwMissingSecretKeyError() {
      throw new Error(s(t.MissingSecretKeyErrorMessage));
    },
    throwMissingClerkProviderError(a) {
      throw new Error(s(t.MissingClerkProvider, a));
    },
    throw(a) {
      throw new Error(s(a));
    },
  };
}
var $ = (e) =>
    typeof atob < "u" && typeof atob == "function"
      ? atob(e)
      : typeof global < "u" && global.Buffer
        ? new global.Buffer(e, "base64").toString()
        : e,
  T = "pk_live_",
  Me = "pk_test_";
function I(e, r = {}) {
  if (((e = e || ""), !e || !S(e))) {
    if (r.fatal && !e)
      throw new Error(
        "Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys",
      );
    if (r.fatal && !S(e)) throw new Error("Publishable key not valid.");
    return null;
  }
  const n = e.startsWith(T) ? "production" : "development";
  let t = $(e.split("_")[2]);
  return (
    (t = t.slice(0, -1)),
    r.proxyUrl
      ? (t = r.proxyUrl)
      : n !== "development" && r.domain && (t = `clerk.${r.domain}`),
    { instanceType: n, frontendApi: t }
  );
}
function S(e) {
  e = e || "";
  const r = e.startsWith(T) || e.startsWith(Me),
    n = $(e.split("_")[2] || "").endsWith("$");
  return r && n;
}
function xe() {
  const e = new Map();
  return {
    isDevOrStagingUrl: (r) => {
      if (!r) return !1;
      const n = typeof r == "string" ? r : r.hostname;
      let t = e.get(n);
      return (
        t === void 0 && ((t = me.some((s) => n.endsWith(s))), e.set(n, t)), t
      );
    },
  };
}
var A = "Clerk: Failed to load Clerk",
  { isDevOrStagingUrl: Ce } = xe(),
  N = Ee({ packageName: "@clerk/shared" });
function Be(e) {
  N.setPackageName({ packageName: e });
}
var De = async (e) => {
    const r = document.querySelector("script[data-clerk-js-script]");
    if (r)
      return new Promise((n, t) => {
        r.addEventListener("load", () => {
          n(r);
        }),
          r.addEventListener("error", () => {
            t(A);
          });
      });
    if (!(e != null && e.publishableKey)) {
      N.throwMissingPublishableKeyError();
      return;
    }
    return _e(Ue(e), {
      async: !0,
      crossOrigin: "anonymous",
      nonce: e.nonce,
      beforeLoad: Se(e),
    }).catch(() => {
      throw new Error(A);
    });
  },
  Ue = (e) => {
    var r, n;
    const {
      clerkJSUrl: t,
      clerkJSVariant: s,
      clerkJSVersion: a,
      proxyUrl: o,
      domain: c,
      publishableKey: l,
    } = e;
    if (t) return t;
    let u = "";
    o && de(o)
      ? (u = he(o).replace(/http(s)?:\/\//, ""))
      : c && !Ce(((r = I(l)) == null ? void 0 : r.frontendApi) || "")
        ? (u = pe(c))
        : (u = ((n = I(l)) == null ? void 0 : n.frontendApi) || "");
    const i = s ? `${s.replace(/\.+$/, "")}.` : "",
      d = le(a);
    return `https://${u}/npm/@clerk/clerk-js@${d}/dist/clerk.${i}browser.js`;
  },
  Ie = (e) => {
    const r = {};
    return (
      e.publishableKey && (r["data-clerk-publishable-key"] = e.publishableKey),
      e.proxyUrl && (r["data-clerk-proxy-url"] = e.proxyUrl),
      e.domain && (r["data-clerk-domain"] = e.domain),
      e.nonce && (r.nonce = e.nonce),
      r
    );
  },
  Se = (e) => (r) => {
    const n = Ie(e);
    for (const t in n) r.setAttribute(t, n[t]);
  };
export { ee as C, Oe as U, _ as a, Be as b, De as l, Le as s, B as u };
