import "clsx";
import { p as pop, a as push } from "../../../chunks/index3.js";
import { u as useClerkContext } from "../../../chunks/chunk-5JJNUDZC.js";
import "../../../chunks/client.js";
import "dequal";
import "../../../chunks/index4.js";
function _page($$payload, $$props) {
  push();
  const ctx = useClerkContext();
  const data = ctx;
  data?.user?.id;
  data?.user?.emailAddresses[0].emailAddress;
  data?.user?.fullName;
  data?.user?.imageUrl;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Loading...</p>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export { _page as default };
