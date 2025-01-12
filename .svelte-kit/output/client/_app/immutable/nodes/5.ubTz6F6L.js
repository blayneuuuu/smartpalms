import { a, t as p } from "../chunks/disclose-version.CkmQrO1S.js";
import "../chunks/legacy.4sU8tFht.js";
import { n as c, m as u, o as l } from "../chunks/index-client.CvPjOW-w.js";
import { s as v, c as f } from "../chunks/action.BQOkHxEW.js";
import { a as $ } from "../chunks/actions.ChP2t6HX.js";
import { r as g } from "../chunks/props.HYy-qROY.js";
import { C as h } from "../chunks/chunk-5JJNUDZC.BecKB5YT.js";
import "../chunks/entry.C-GEGAjY.js";
var U = p("<div></div>");
function _(r, o) {
  const t = g(o, ["$$slots", "$$events", "$$legacy"]);
  h(r, {
    children: (i, s = c) => {
      var e = U();
      $(
        e,
        (m, d) => {
          var n;
          return (n = f) == null ? void 0 : n(m, d);
        },
        () => ({
          mount: s().mountSignUp,
          unmount: s().unmountSignUp,
          updateProps: s().__unstable_updateProps,
          props: v(t),
        }),
      ),
        a(i, e);
    },
    $$slots: { default: !0 },
  });
}
var S = p(
  '<div class="w-screen h-screen flex justify-center items-center"><!></div>',
);
function k(r) {
  var o = S(),
    t = u(o);
  _(t, { redirectUrl: "/dashboard", signInUrl: "/" }), l(o), a(r, o);
}
export { k as component };
