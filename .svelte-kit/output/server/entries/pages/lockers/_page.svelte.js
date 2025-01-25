import { c as copy_payload, a as assign_payload, p as pop, d as push, e as escape_html, f as ensure_array_like, g as attr } from "../../../chunks/index3.js";
import { B as Button, A as Alert, L as Label, I as Input } from "../../../chunks/Input.js";
import { C as Card, B as Badge, M as Modal, S as Select } from "../../../chunks/Modal.js";
function _page($$payload, $$props) {
  push();
  const { data } = $$props;
  let selectedLocker = null;
  let selectedSubscriptionType = "";
  let loading = false;
  let showRentDialog = false;
  function getLockersBySize() {
    return {
      small: data.lockers.filter((l) => l.size.toLowerCase() === "small"),
      medium: data.lockers.filter((l) => l.size.toLowerCase() === "medium"),
      large: data.lockers.filter((l) => l.size.toLowerCase() === "large")
    };
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="container mx-auto p-4"><div class="grid grid-cols-3 items-center mb-8"><div></div> <h1 class="text-2xl font-bold text-center">Available Lockers</h1> `;
    Button($$payload2, {
      href: "/dashboard",
      color: "blue",
      class: "justify-self-end",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Back to Dashboard`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> `;
    if (data.error) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mb-8",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(data.error)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (data.lockers) {
      $$payload2.out += "<!--[-->";
      const lockersBySize = getLockersBySize();
      const each_array = ensure_array_like(lockersBySize.small);
      const each_array_1 = ensure_array_like(lockersBySize.medium);
      const each_array_2 = ensure_array_like(lockersBySize.large);
      $$payload2.out += `<div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div><h2 class="text-xl font-semibold mb-4">Small Lockers (${escape_html(lockersBySize.small.length)})</h2> <div class="space-y-4"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let locker = each_array[$$index];
        Card($$payload2, {
          padding: "sm",
          children: ($$payload3) => {
            $$payload3.out += `<div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between">`;
            Badge($$payload3, {
              color: locker.hasPendingRequest ? "yellow" : locker.isAvailable ? "green" : "red",
              children: ($$payload4) => {
                if (locker.hasPendingRequest) {
                  $$payload4.out += "<!--[-->";
                  $$payload4.out += `Pending Request`;
                } else {
                  $$payload4.out += "<!--[!-->";
                  if (locker.isAvailable) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `Available`;
                  } else {
                    $$payload4.out += "<!--[!-->";
                    $$payload4.out += `Occupied`;
                  }
                  $$payload4.out += `<!--]-->`;
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            if (locker.isAvailable && !locker.hasPendingRequest) {
              $$payload3.out += "<!--[-->";
              Button($$payload3, {
                color: "light",
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Rent`;
                },
                $$slots: { default: true }
              });
            } else {
              $$payload3.out += "<!--[!-->";
            }
            $$payload3.out += `<!--]--></div>`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]--></div></div> <div><h2 class="text-xl font-semibold mb-4">Medium Lockers (${escape_html(lockersBySize.medium.length)})</h2> <div class="space-y-4"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let locker = each_array_1[$$index_1];
        Card($$payload2, {
          padding: "sm",
          children: ($$payload3) => {
            $$payload3.out += `<div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between">`;
            Badge($$payload3, {
              color: locker.hasPendingRequest ? "yellow" : locker.isAvailable ? "green" : "red",
              children: ($$payload4) => {
                if (locker.hasPendingRequest) {
                  $$payload4.out += "<!--[-->";
                  $$payload4.out += `Pending Request`;
                } else {
                  $$payload4.out += "<!--[!-->";
                  if (locker.isAvailable) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `Available`;
                  } else {
                    $$payload4.out += "<!--[!-->";
                    $$payload4.out += `Occupied`;
                  }
                  $$payload4.out += `<!--]-->`;
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            if (locker.isAvailable && !locker.hasPendingRequest) {
              $$payload3.out += "<!--[-->";
              Button($$payload3, {
                color: "light",
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Rent`;
                },
                $$slots: { default: true }
              });
            } else {
              $$payload3.out += "<!--[!-->";
            }
            $$payload3.out += `<!--]--></div>`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]--></div></div> <div><h2 class="text-xl font-semibold mb-4">Large Lockers (${escape_html(lockersBySize.large.length)})</h2> <div class="space-y-4"><!--[-->`;
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let locker = each_array_2[$$index_2];
        Card($$payload2, {
          padding: "sm",
          children: ($$payload3) => {
            $$payload3.out += `<div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between">`;
            Badge($$payload3, {
              color: locker.hasPendingRequest ? "yellow" : locker.isAvailable ? "green" : "red",
              children: ($$payload4) => {
                if (locker.hasPendingRequest) {
                  $$payload4.out += "<!--[-->";
                  $$payload4.out += `Pending Request`;
                } else {
                  $$payload4.out += "<!--[!-->";
                  if (locker.isAvailable) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `Available`;
                  } else {
                    $$payload4.out += "<!--[!-->";
                    $$payload4.out += `Occupied`;
                  }
                  $$payload4.out += `<!--]-->`;
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            if (locker.isAvailable && !locker.hasPendingRequest) {
              $$payload3.out += "<!--[-->";
              Button($$payload3, {
                color: "light",
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Rent`;
                },
                $$slots: { default: true }
              });
            } else {
              $$payload3.out += "<!--[!-->";
            }
            $$payload3.out += `<!--]--></div>`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]--></div></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> `;
    Modal($$payload2, {
      size: "md",
      autoclose: true,
      get open() {
        return showRentDialog;
      },
      set open($$value) {
        showRentDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Rent Locker #${escape_html(selectedLocker?.number)}</h3> <p class="mb-5 text-sm text-gray-500">Select a subscription plan and upload your proof of payment.</p></div> `;
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--> <div class="grid gap-4 py-4"><div class="grid gap-2">`;
        Label($$payload3, {
          for: "plan",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Subscription Plan`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Select($$payload3, {
          id: "plan",
          get value() {
            return selectedSubscriptionType;
          },
          set value($$value) {
            selectedSubscriptionType = $$value;
            $$settled = false;
          },
          children: ($$payload4) => {
            const each_array_3 = ensure_array_like(data.subscriptionTypes);
            $$payload4.out += `<option value="">Select a plan</option> <!--[-->`;
            for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
              let type = each_array_3[$$index_3];
              $$payload4.out += `<option${attr("value", type.id)}>${escape_html(type.name)} - ₱${escape_html(type.amount)} (${escape_html(type.duration)})</option>`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----></div> <div class="grid gap-2">`;
        Label($$payload3, {
          for: "proof",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Proof of Payment`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Input($$payload3, { id: "proof", type: "file", accept: "image/*" });
        $$payload3.out += `<!----> <p class="text-sm text-gray-500">Upload a screenshot or photo of your payment receipt (Max 5MB)</p></div></div> <div class="flex justify-end gap-4">`;
        Button($$payload3, {
          color: "alternative",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Cancel`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Button($$payload3, {
          color: "blue",
          disabled: !selectedSubscriptionType || true,
          loading,
          children: ($$payload4) => {
            $$payload4.out += `<!---->Submit Request`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----></div>`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
