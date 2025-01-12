import { c as P, a as w } from "../chunks/disclose-version.CkmQrO1S.js";
import {
  v as L,
  ab as z,
  a as k,
  w as V,
  y,
  g as s,
  f as m,
  b as R,
  C as h,
} from "../chunks/index-client.CvPjOW-w.js";
import {
  s as $,
  a as A,
  b as x,
  l as B,
} from "../chunks/chunk-5JJNUDZC.BecKB5YT.js";
import { s as N, p as C, r as G, a as J } from "../chunks/props.HYy-qROY.js";
import { s as K, g as I } from "../chunks/entry.C-GEGAjY.js";
var U = (e, r, i) => (!e && i ? Y(i) : F(r)),
  Y = (e) => {
    const r = e.userId,
      i = e.user,
      d = e.sessionId,
      c = e.session,
      o = e.organization,
      u = e.orgId,
      g = e.orgRole,
      n = e.orgPermissions,
      p = e.orgSlug,
      f = e.actor,
      a = e.factorVerificationAge;
    return {
      userId: r,
      user: i,
      sessionId: d,
      session: c,
      organization: o,
      orgId: u,
      orgRole: g,
      orgPermissions: n,
      orgSlug: p,
      actor: f,
      factorVerificationAge: a,
    };
  },
  F = (e) => {
    var r;
    const i = e.user ? e.user.id : e.user,
      d = e.user,
      c = e.session ? e.session.id : e.session,
      o = e.session,
      u = e.session ? e.session.factorVerificationAge : null,
      g = o == null ? void 0 : o.actor,
      n = e.organization,
      p = e.organization ? e.organization.id : e.organization,
      f = n == null ? void 0 : n.slug,
      a =
        n &&
        ((r = d == null ? void 0 : d.organizationMemberships) == null
          ? void 0
          : r.find((b) => b.organization.id === p)),
      _ = a && a.permissions,
      v = a && a.role;
    return {
      userId: i,
      user: d,
      sessionId: c,
      session: o,
      organization: n,
      orgId: p,
      orgRole: v,
      orgSlug: f,
      orgPermissions: _,
      actor: g,
      factorVerificationAge: u,
    };
  };
const H = () => {
    const e = K;
    return {
      page: { subscribe: e.page.subscribe },
      navigating: { subscribe: e.navigating.subscribe },
      updated: e.updated,
    };
  },
  M = {
    subscribe(e) {
      return H().page.subscribe(e);
    },
  };
function S(e, r) {
  L(r, !0);
  const i = N(),
    d = () => J(M, "$page", i),
    c = G(r, ["$$slots", "$$events", "$$legacy", "children"]);
  let o = z(null),
    u = z(!1),
    g = z(
      C({ client: {}, session: void 0, user: void 0, organization: void 0 }),
    ),
    n = m(() => {
      var t, l;
      return U(
        s(u),
        s(g),
        (l = (t = d()) == null ? void 0 : t.data) == null
          ? void 0
          : l.initialState,
      );
    }),
    p = m(() => s(g).client),
    f = m(() => s(n).session),
    a = m(() => s(n).user),
    _ = m(() => s(n).organization);
  x("svelte-clerk");
  async function v() {
    const t = {
      ...c,
      routerPush: (l) => I(l),
      routerReplace: (l) => I(l, { replaceState: !0 }),
    };
    if ((await B(t), !window.Clerk))
      throw new Error("Clerk script failed to load");
    h(o, C(window.Clerk)),
      await s(o).load(t),
      h(u, !0),
      s(o).addListener((l) => {
        h(g, C(l));
      });
  }
  k(() => {
    R(() => v());
  }),
    k(() => {
      var t;
      s(u) &&
        ((t = s(o)) == null ||
          t.__unstable__updateProps({ appearance: r.appearance }));
    }),
    k(() => {
      var t;
      s(u) &&
        ((t = s(o)) == null ||
          t.__unstable__updateProps({
            options: { ...c, localization: r.localization },
          }));
    }),
    $({
      get clerk() {
        return s(o);
      },
      get isLoaded() {
        return s(u);
      },
      get auth() {
        return s(n);
      },
      get client() {
        return s(p);
      },
      get session() {
        return s(f);
      },
      get user() {
        return s(a);
      },
      get organization() {
        return s(_);
      },
    });
  var b = P(),
    E = V(b);
  A(E, () => r.children), w(e, b), y();
}
const W = "pk_test_ZGVmaW5pdGUtc2NvcnBpb24tNzguY2xlcmsuYWNjb3VudHMuZGV2JA";
function Q(e, r) {
  L(r, !0),
    S(e, {
      publishableKey: W,
      children: (i, d) => {
        var c = P(),
          o = V(c);
        A(o, () => r.children), w(i, c);
      },
      $$slots: { default: !0 },
    }),
    y();
}
export { Q as component };
