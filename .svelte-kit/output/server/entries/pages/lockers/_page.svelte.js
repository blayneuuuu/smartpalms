import { e as escape_html, a as ensure_array_like, b as attr, s as stringify, p as pop, c as push } from "../../../chunks/index3.js";
import { B as Button, R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_description, L as Label, I as Input, d as Dialog_footer } from "../../../chunks/label.js";
function _page($$payload, $$props) {
  push();
  const { data } = $$props;
  let selectedLocker = null;
  let selectedSubscriptionType = "";
  let proofOfPaymentBase64 = null;
  let error = null;
  let showRentDialog = false;
  function getLockersBySize() {
    return {
      small: data.lockers.filter((l) => l.size.toLowerCase() === "small"),
      medium: data.lockers.filter((l) => l.size.toLowerCase() === "medium"),
      large: data.lockers.filter((l) => l.size.toLowerCase() === "large")
    };
  }
  function closeRentDialog() {
    showRentDialog = false;
    selectedLocker = null;
    selectedSubscriptionType = "";
    proofOfPaymentBase64 = null;
    error = null;
  }
  $$payload.out += `<div class="container mx-auto p-4"><div class="grid grid-cols-3 items-center mb-8"><div></div> <h1 class="text-2xl font-bold text-center">Available Lockers</h1> <a href="/dashboard" class="justify-self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold">Back to Dashboard</a></div> `;
  if (data.error) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-100 text-red-700 p-4 rounded mb-8">${escape_html(data.error)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (data.lockers) {
    $$payload.out += "<!--[-->";
    const lockersBySize = getLockersBySize();
    const each_array = ensure_array_like(lockersBySize.small);
    const each_array_1 = ensure_array_like(lockersBySize.medium);
    const each_array_2 = ensure_array_like(lockersBySize.large);
    $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div><h2 class="text-xl font-semibold mb-4">Small Lockers (${escape_html(lockersBySize.small.length)})</h2> <div class="space-y-4"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let locker = each_array[$$index];
      $$payload.out += `<div${attr("class", `border rounded-lg p-4 ${stringify(locker.hasPendingRequest ? "bg-yellow-50" : locker.isAvailable ? "bg-gray-100" : "bg-red-50")}`)}><div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between"><span${attr("class", locker.hasPendingRequest ? "text-yellow-600" : locker.isAvailable ? "text-green-600" : "text-red-600")}>`;
      if (locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Pending Request`;
      } else {
        $$payload.out += "<!--[!-->";
        if (locker.isAvailable) {
          $$payload.out += "<!--[-->";
          $$payload.out += `Available`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `Occupied`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></span> `;
      if (locker.isAvailable && !locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        Button($$payload, {
          variant: "outline",
          children: ($$payload2) => {
            $$payload2.out += `<!---->Rent`;
          },
          $$slots: { default: true }
        });
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div> <div><h2 class="text-xl font-semibold mb-4">Medium Lockers (${escape_html(lockersBySize.medium.length)})</h2> <div class="space-y-4"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let locker = each_array_1[$$index_1];
      $$payload.out += `<div${attr("class", `border rounded-lg p-4 ${stringify(locker.hasPendingRequest ? "bg-yellow-50" : locker.isAvailable ? "bg-gray-100" : "bg-red-50")}`)}><div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between"><span${attr("class", locker.hasPendingRequest ? "text-yellow-600" : locker.isAvailable ? "text-green-600" : "text-red-600")}>`;
      if (locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Pending Request`;
      } else {
        $$payload.out += "<!--[!-->";
        if (locker.isAvailable) {
          $$payload.out += "<!--[-->";
          $$payload.out += `Available`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `Occupied`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></span> `;
      if (locker.isAvailable && !locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        Button($$payload, {
          variant: "outline",
          children: ($$payload2) => {
            $$payload2.out += `<!---->Rent`;
          },
          $$slots: { default: true }
        });
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div> <div><h2 class="text-xl font-semibold mb-4">Large Lockers (${escape_html(lockersBySize.large.length)})</h2> <div class="space-y-4"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let locker = each_array_2[$$index_2];
      $$payload.out += `<div${attr("class", `border rounded-lg p-4 ${stringify(locker.hasPendingRequest ? "bg-yellow-50" : locker.isAvailable ? "bg-gray-100" : "bg-red-50")}`)}><div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600">Size: ${escape_html(locker.size)}</div> <div class="mt-2 flex items-center justify-between"><span${attr("class", locker.hasPendingRequest ? "text-yellow-600" : locker.isAvailable ? "text-green-600" : "text-red-600")}>`;
      if (locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Pending Request`;
      } else {
        $$payload.out += "<!--[!-->";
        if (locker.isAvailable) {
          $$payload.out += "<!--[-->";
          $$payload.out += `Available`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `Occupied`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></span> `;
      if (locker.isAvailable && !locker.hasPendingRequest) {
        $$payload.out += "<!--[-->";
        Button($$payload, {
          variant: "outline",
          children: ($$payload2) => {
            $$payload2.out += `<!---->Rent`;
          },
          $$slots: { default: true }
        });
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <!---->`;
  Root($$payload, {
    open: showRentDialog,
    onOpenChange: (open) => !open && closeRentDialog(),
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Dialog_content($$payload2, {
        class: "sm:max-w-[425px]",
        children: ($$payload3) => {
          const each_array_3 = ensure_array_like(data.subscriptionTypes);
          $$payload3.out += `<!---->`;
          Dialog_header($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<!---->`;
              Dialog_title($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Rent Locker #${escape_html(selectedLocker?.number)}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <!---->`;
              Dialog_description($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Select a subscription plan and upload your proof of payment.`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          if (error) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<div class="bg-red-100 text-red-700 p-3 rounded mb-4">${escape_html(error)}</div>`;
          } else {
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
          $$payload3.out += `<!----> <select id="plan" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="">Select a plan</option><!--[-->`;
          for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
            let type = each_array_3[$$index_3];
            $$payload3.out += `<option${attr("value", type.id)}>${escape_html(type.name)} - ₱${escape_html(type.amount)} (${escape_html(type.duration)})</option>`;
          }
          $$payload3.out += `<!--]--></select></div> <div class="grid gap-2">`;
          Label($$payload3, {
            for: "proof",
            children: ($$payload4) => {
              $$payload4.out += `<!---->Proof of Payment`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Input($$payload3, { id: "proof", type: "file", accept: "image/*" });
          $$payload3.out += `<!----> <p class="text-sm text-gray-500">Upload a screenshot or photo of your payment receipt (Max 5MB)</p></div></div> <!---->`;
          Dialog_footer($$payload3, {
            children: ($$payload4) => {
              Button($$payload4, {
                disabled: !selectedSubscriptionType || !proofOfPaymentBase64,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html("Submit Request")}`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
