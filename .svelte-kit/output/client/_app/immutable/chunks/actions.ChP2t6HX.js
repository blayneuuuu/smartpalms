import {
  h as c,
  b as i,
  i as o,
  e as d,
  s as m,
} from "./index-client.CvPjOW-w.js";
function b(e, n, s) {
  c(() => {
    var r = i(() => n(e, s == null ? void 0 : s()) || {});
    if (s && r != null && r.update) {
      var a = !1,
        t = {};
      o(() => {
        var f = s();
        d(f), a && m(t, f) && ((t = f), r.update(f));
      }),
        (a = !0);
    }
    if (r != null && r.destroy) return () => r.destroy();
  });
}
export { b as a };
