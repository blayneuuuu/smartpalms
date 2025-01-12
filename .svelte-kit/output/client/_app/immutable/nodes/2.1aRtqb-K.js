import { a, t as i } from "../chunks/disclose-version.CkmQrO1S.js";
import "../chunks/legacy.4sU8tFht.js";
import {
  n as l,
  l as c,
  m as u,
  o as f,
} from "../chunks/index-client.CvPjOW-w.js";
import { s as v, c as g } from "../chunks/action.BQOkHxEW.js";
import { a as $ } from "../chunks/actions.ChP2t6HX.js";
import { r as h } from "../chunks/props.HYy-qROY.js";
import { C as _ } from "../chunks/chunk-5JJNUDZC.BecKB5YT.js";
import "../chunks/entry.C-GEGAjY.js";
var I = i("<div></div>");
function S(r, o) {
  const s = h(o, ["$$slots", "$$events", "$$legacy"]);
  _(r, {
    children: (p, t = l) => {
      var e = I();
      $(
        e,
        (m, d) => {
          var n;
          return (n = g) == null ? void 0 : n(m, d);
        },
        () => ({
          mount: t().mountSignIn,
          unmount: t().unmountSignIn,
          updateProps: t().__unstable_updateProps,
          props: v(s),
        }),
      ),
        a(p, e);
    },
    $$slots: { default: !0 },
  });
}
var U = i(
  '<div class="w-screen h-screen flex flex-col justify-center items-center"><span>Welcome to Smart Palms</span> <!></div>',
);
function k(r) {
  var o = U(),
    s = c(u(o), 2);
  S(s, { redirectUrl: "/dashboard", signUpUrl: "/register" }), f(o), a(r, o);
}
export { k as component };
