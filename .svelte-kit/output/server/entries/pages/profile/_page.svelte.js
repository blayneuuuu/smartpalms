import { c as copy_payload, a as assign_payload, b as bind_props, p as pop, d as push, e as escape_html } from "../../../chunks/index3.js";
import "clsx";
import { A as Alert, L as Label, I as Input, B as Button } from "../../../chunks/Input.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let form = $$props["form"];
  let name = data.user.name;
  let email = data.user.email;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="min-h-screen bg-gray-50 py-12"><div class="max-w-2xl mx-auto px-4"><div class="bg-white rounded-lg shadow p-8"><h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1> `;
    if (form?.success) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "green",
        class: "mb-6",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(form.success)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
      if (form?.error) {
        $$payload2.out += "<!--[-->";
        Alert($$payload2, {
          color: "red",
          class: "mb-6",
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(form.error)}`;
          },
          $$slots: { default: true }
        });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--> <form method="POST" class="space-y-6"><div>`;
    Label($$payload2, {
      for: "name",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Full Name`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      type: "text",
      id: "name",
      name: "name",
      required: true,
      get value() {
        return name;
      },
      set value($$value) {
        name = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> <div>`;
    Label($$payload2, {
      for: "email",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Email Address`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      type: "email",
      id: "email",
      name: "email",
      required: true,
      get value() {
        return email;
      },
      set value($$value) {
        email = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> <div class="border-t pt-6">`;
    Button($$payload2, {
      type: "button",
      color: "light",
      class: "mb-4",
      children: ($$payload3) => {
        $$payload3.out += `<!---->${escape_html("Change Password")}`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="flex justify-end space-x-4">`;
    Button($$payload2, {
      href: "/dashboard",
      color: "light",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Cancel`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Button($$payload2, {
      type: "submit",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Save Changes`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div></form></div></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { data, form });
  pop();
}
export {
  _page as default
};
