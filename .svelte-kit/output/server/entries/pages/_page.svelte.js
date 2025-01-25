import { c as copy_payload, a as assign_payload, b as bind_props, p as pop, d as push, e as escape_html } from "../../chunks/index3.js";
import "clsx";
import { A as Alert, L as Label, I as Input, B as Button } from "../../chunks/Input.js";
import "../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let form = $$props["form"];
  let email = "";
  let password = "";
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="w-screen h-screen flex flex-col justify-center items-center bg-gray-50"><div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"><h1 class="text-2xl font-bold text-center text-gray-900">Welcome to Smart Palms</h1> `;
    if (form?.error) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mt-4",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(form.error)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <form method="POST" class="space-y-4"><div>`;
    Label($$payload2, {
      for: "email",
      class: "mb-2",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Email`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      type: "email",
      name: "email",
      id: "email",
      placeholder: "name@company.com",
      required: true,
      get value() {
        return email;
      },
      set value($$value) {
        email = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> <div>`;
    Label($$payload2, {
      for: "password",
      class: "mb-2",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Password`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      type: "password",
      name: "password",
      id: "password",
      placeholder: "••••••••",
      required: true,
      get value() {
        return password;
      },
      set value($$value) {
        password = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> `;
    Button($$payload2, {
      type: "submit",
      class: "w-full",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Sign in`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></form> <p class="text-sm text-center text-gray-600">Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Sign up</a></p></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { form });
  pop();
}
export {
  _page as default
};
