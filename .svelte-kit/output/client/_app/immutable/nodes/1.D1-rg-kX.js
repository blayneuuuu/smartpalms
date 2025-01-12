import { a as f, t as d, s as o } from "../chunks/disclose-version.CkmQrO1S.js";
import "../chunks/legacy.4sU8tFht.js";
import {
  v as l,
  w as h,
  x as v,
  y as x,
  m as p,
  o as u,
  l as _,
} from "../chunks/index-client.CvPjOW-w.js";
import { i as $ } from "../chunks/lifecycle.DnaYePt7.js";
import { u as k, s as b, p as t } from "../chunks/entry.C-GEGAjY.js";
const w = {
  get data() {
    return t.data;
  },
  get error() {
    return t.error;
  },
  get form() {
    return t.form;
  },
  get params() {
    return t.params;
  },
  get route() {
    return t.route;
  },
  get state() {
    return t.state;
  },
  get status() {
    return t.status;
  },
  get url() {
    return t.url;
  },
};
b.updated.check;
const n = w;
var y = d("<h1> </h1> <p> </p>", 1);
function B(m, g) {
  l(g, !1), $();
  var e = y(),
    r = h(e),
    i = p(r, !0);
  u(r);
  var a = _(r, 2),
    c = p(a, !0);
  u(a),
    v(() => {
      var s;
      o(i, n.status), o(c, (s = n.error) == null ? void 0 : s.message);
    }),
    f(m, e),
    x();
}
export { B as component };
