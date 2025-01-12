import "clsx";
import { C as ClerkLoaded } from "../../chunks/chunk-5JJNUDZC.js";
import "../../chunks/client.js";
function SignIn($$payload, $$props) {
  {
    let children = function ($$payload2, clerk) {
      $$payload2.out += `<div></div>`;
    };
    ClerkLoaded($$payload, { children, $$slots: { default: true } });
  }
}
function _page($$payload) {
  $$payload.out += `<div class="w-screen h-screen flex flex-col justify-center items-center"><span>Welcome to Smart Palms</span> `;
  SignIn($$payload);
  $$payload.out += `<!----></div>`;
}
export { _page as default };
