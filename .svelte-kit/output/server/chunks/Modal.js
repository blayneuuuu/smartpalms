import { r as rest_props, i as fallback, s as spread_attributes, j as clsx, g as attr, k as slot, b as bind_props, p as pop, d as push, l as sanitize_props, m as spread_props, e as escape_html, f as ensure_array_like, o as sanitize_slots, q as stringify } from "./index3.js";
import { twMerge } from "tailwind-merge";
import { f as fade, C as CloseButton, F as Frame } from "./Input.js";
function Badge($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "color",
    "large",
    "dismissable",
    "border",
    "href",
    "rounded",
    "transition",
    "params"
  ]);
  push();
  let color = fallback($$props["color"], "primary");
  let large = fallback($$props["large"], false);
  let dismissable = fallback($$props["dismissable"], false);
  let border = fallback($$props["border"], false);
  let href = fallback($$props["href"], "");
  let rounded = fallback($$props["rounded"], false);
  let transition = fallback($$props["transition"], fade);
  let params = fallback($$props["params"], () => ({}), true);
  let badgeStatus = true;
  const colors = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300",
    dark: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    none: ""
  };
  const borderedColors = {
    primary: "bg-primary-100 text-primary-800 dark:bg-gray-700 dark:text-primary-400 border-primary-400 dark:border-primary-400",
    dark: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 border-gray-400 dark:border-gray-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-400 border-blue-400 dark:border-blue-400",
    red: "bg-red-100 text-red-800 dark:bg-gray-700 dark:text-red-400 border-red-400 dark:border-red-400",
    green: "bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border-green-400 dark:border-green-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-gray-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-300",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-indigo-400 border-indigo-400 dark:border-indigo-400",
    purple: "bg-purple-100 text-purple-800 dark:bg-gray-700 dark:text-purple-400 border-purple-400 dark:border-purple-400",
    pink: "bg-pink-100 text-pink-800 dark:bg-gray-700 dark:text-pink-400 border-pink-400 dark:border-pink-400",
    none: ""
  };
  const hoverColors = {
    primary: "hover:bg-primary-200",
    dark: "hover:bg-gray-200",
    blue: "hover:bg-blue-200",
    red: "hover:bg-red-200",
    green: "hover:bg-green-200",
    yellow: "hover:bg-yellow-200",
    indigo: "hover:bg-indigo-200",
    purple: "hover:bg-purple-200",
    pink: "hover:bg-pink-200",
    none: ""
  };
  const close = () => {
    badgeStatus = false;
  };
  const baseClass = "font-medium inline-flex items-center justify-center px-2.5 py-0.5";
  let badgeClass;
  badgeClass = twMerge(baseClass, large ? "text-sm" : "text-xs", border ? `border ${borderedColors[color]}` : colors[color], href && hoverColors[color], rounded ? "rounded-full" : "rounded", $$restProps.class);
  if (badgeStatus) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${spread_attributes({ ...$$restProps, class: clsx(badgeClass) })}>`;
    if (href) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<a${attr("href", href)}><!---->`;
      slot($$payload, $$props, "default", {}, null);
      $$payload.out += `<!----></a>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "default", {}, null);
      $$payload.out += `<!---->`;
    }
    $$payload.out += `<!--]--> `;
    if (dismissable) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "close-button", { close }, () => {
        CloseButton($$payload, {
          divclass: "ms-1.5 -me-1.5",
          color,
          size: large ? "sm" : "xs",
          ariaLabel: "Remove badge"
        });
      });
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    color,
    large,
    dismissable,
    border,
    href,
    rounded,
    transition,
    params
  });
  pop();
}
function Card($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "horizontal",
    "reverse",
    "img",
    "padding",
    "size",
    "imgClass"
  ]);
  push();
  let href = fallback($$props["href"], () => void 0, true);
  let horizontal = fallback($$props["horizontal"], false);
  let reverse = fallback($$props["reverse"], false);
  let img = fallback($$props["img"], () => void 0, true);
  let padding = fallback($$props["padding"], "lg");
  let size = fallback($$props["size"], "sm");
  let imgClass = fallback($$props["imgClass"], "");
  const paddings = {
    none: "",
    xs: "p-2",
    sm: "p-4",
    md: "p-4 sm:p-5",
    lg: "p-4 sm:p-6",
    xl: "p-4 sm:p-8"
  };
  const sizes = {
    none: "",
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-screen-xl"
  };
  let innerPadding;
  let cardClass;
  let imgCls;
  innerPadding = paddings[padding];
  cardClass = twMerge("flex w-full", sizes[size], reverse ? "flex-col-reverse" : "flex-col", horizontal && (reverse ? "md:flex-row-reverse" : "md:flex-row"), href && "hover:bg-gray-100 dark:hover:bg-gray-700", !img && innerPadding, $$sanitized_props.class);
  imgCls = twMerge(reverse ? "rounded-b-lg" : "rounded-t-lg", horizontal && "object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none", horizontal && (reverse ? "md:rounded-e-lg" : "md:rounded-s-lg"), imgClass);
  Frame($$payload, spread_props([
    {
      tag: href ? "a" : "div",
      rounded: true,
      shadow: true,
      border: true,
      href
    },
    $$restProps,
    {
      class: cardClass,
      children: ($$payload2) => {
        if (img) {
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<img${attr("class", clsx(imgCls))}${attr("src", img)} alt=""> <div${attr("class", clsx(innerPadding))}><!---->`;
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out += `<!----></div>`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out += `<!---->`;
        }
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  bind_props($$props, {
    href,
    horizontal,
    reverse,
    img,
    padding,
    size,
    imgClass
  });
  pop();
}
function Select($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "items",
    "value",
    "placeholder",
    "underline",
    "size",
    "defaultClass",
    "underlineClass"
  ]);
  push();
  let items = fallback($$props["items"], () => [], true);
  let value = fallback($$props["value"], "");
  let placeholder = fallback($$props["placeholder"], "Choose option ...");
  let underline = fallback($$props["underline"], false);
  let size = fallback($$props["size"], "md");
  let defaultClass = fallback($$props["defaultClass"], "text-gray-900 disabled:text-gray-400 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:text-gray-500 dark:focus:ring-primary-500 dark:focus:border-primary-500");
  let underlineClass = fallback($$props["underlineClass"], "text-gray-500 disabled:text-gray-400 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:disabled:text-gray-500 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer");
  const common = "block w-full";
  const sizes = {
    sm: "text-sm p-2",
    md: "text-sm p-2.5",
    lg: "text-base py-3 px-4"
  };
  let selectClass;
  selectClass = twMerge(common, underline ? underlineClass : defaultClass, sizes[size], underline && "!px-0", $$sanitized_props.class);
  $$payload.out += `<select${spread_attributes({
    ...$$restProps,
    class: clsx(selectClass)
  })}>`;
  if (placeholder) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<option disabled${attr("selected", value === void 0 ? true : void 0, true)} value="">${escape_html(placeholder)}</option>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if (items && items.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(items);
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let { value: itemValue, name, disabled } = each_array[$$index];
      $$payload.out += `<option${attr("disabled", disabled, true)}${attr("value", itemValue)}${attr("selected", itemValue === value ? true : void 0, true)}>${escape_html(name)}</option>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></select>`;
  bind_props($$props, {
    items,
    value,
    placeholder,
    underline,
    size,
    defaultClass,
    underlineClass
  });
  pop();
}
function Modal($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "open",
    "title",
    "size",
    "color",
    "placement",
    "autoclose",
    "outsideclose",
    "dismissable",
    "backdropClass",
    "classBackdrop",
    "dialogClass",
    "classDialog",
    "defaultClass",
    "headerClass",
    "classHeader",
    "bodyClass",
    "classBody",
    "footerClass",
    "classFooter"
  ]);
  push();
  let backdropCls, dialogCls, frameCls, headerCls, bodyCls, footerCls;
  let open = fallback($$props["open"], false);
  let title = fallback($$props["title"], "");
  let size = fallback($$props["size"], "md");
  let color = fallback($$props["color"], "default");
  let placement = fallback($$props["placement"], "center");
  let autoclose = fallback($$props["autoclose"], false);
  let outsideclose = fallback($$props["outsideclose"], false);
  let dismissable = fallback($$props["dismissable"], true);
  let backdropClass = fallback($$props["backdropClass"], "fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80");
  let classBackdrop = fallback($$props["classBackdrop"], () => void 0, true);
  let dialogClass = fallback($$props["dialogClass"], "fixed top-0 start-0 end-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex");
  let classDialog = fallback($$props["classDialog"], () => void 0, true);
  let defaultClass = fallback($$props["defaultClass"], "relative flex flex-col mx-auto");
  let headerClass = fallback($$props["headerClass"], "flex justify-between items-center p-4 md:p-5 rounded-t-lg");
  let classHeader = fallback($$props["classHeader"], () => void 0, true);
  let bodyClass = fallback($$props["bodyClass"], "p-4 md:p-5 space-y-4 flex-1 overflow-y-auto overscroll-contain");
  let classBody = fallback($$props["classBody"], () => void 0, true);
  let footerClass = fallback($$props["footerClass"], "flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse rounded-b-lg");
  let classFooter = fallback($$props["classFooter"], () => void 0, true);
  const getPlacementClasses = (placement2) => {
    switch (placement2) {
      case "top-left":
        return ["justify-start", "items-start"];
      case "top-center":
        return ["justify-center", "items-start"];
      case "top-right":
        return ["justify-end", "items-start"];
      case "center-left":
        return ["justify-start", "items-center"];
      case "center":
        return ["justify-center", "items-center"];
      case "center-right":
        return ["justify-end", "items-center"];
      case "bottom-left":
        return ["justify-start", "items-end"];
      case "bottom-center":
        return ["justify-center", "items-end"];
      case "bottom-right":
        return ["justify-end", "items-end"];
      default:
        return ["justify-center", "items-center"];
    }
  };
  const sizes = {
    xs: "max-w-md",
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-7xl"
  };
  backdropCls = twMerge(backdropClass, classBackdrop);
  dialogCls = twMerge(dialogClass, classDialog, getPlacementClasses(placement));
  frameCls = twMerge(defaultClass, "w-full divide-y", $$sanitized_props.class);
  headerCls = twMerge(headerClass, classHeader);
  bodyCls = twMerge(bodyClass, classBody);
  footerCls = twMerge(footerClass, classFooter);
  if (open) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", clsx(backdropCls))}></div>  <div${attr("class", clsx(dialogCls))} tabindex="-1" aria-modal="true" role="dialog"><div${attr("class", `flex relative ${stringify(sizes[size])} w-full max-h-full`)}>`;
    Frame($$payload, spread_props([
      { rounded: true, shadow: true },
      $$restProps,
      {
        class: frameCls,
        color,
        children: ($$payload2) => {
          if ($$slots.header || title) {
            $$payload2.out += "<!--[-->";
            Frame($$payload2, {
              class: headerCls,
              color,
              children: ($$payload3) => {
                $$payload3.out += `<!---->`;
                slot($$payload3, $$props, "header", {}, () => {
                  $$payload3.out += `<h3${attr("class", `text-xl font-semibold ${stringify(color === "default" ? "" : "text-gray-900 dark:text-white")} p-0`)}>${escape_html(title)}</h3>`;
                });
                $$payload3.out += `<!----> `;
                if (dismissable) {
                  $$payload3.out += "<!--[-->";
                  CloseButton($$payload3, { name: "Close modal", color });
                } else {
                  $$payload3.out += "<!--[!-->";
                }
                $$payload3.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> <div${attr("class", clsx(bodyCls))} role="document">`;
          if (dismissable && !$$slots.header && !title) {
            $$payload2.out += "<!--[-->";
            CloseButton($$payload2, {
              name: "Close modal",
              class: "absolute top-3 end-2.5",
              color
            });
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> <!---->`;
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out += `<!----></div> `;
          if ($$slots.footer) {
            $$payload2.out += "<!--[-->";
            Frame($$payload2, {
              class: footerCls,
              color,
              children: ($$payload3) => {
                $$payload3.out += `<!---->`;
                slot($$payload3, $$props, "footer", {}, null);
                $$payload3.out += `<!---->`;
              },
              $$slots: { default: true }
            });
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    open,
    title,
    size,
    color,
    placement,
    autoclose,
    outsideclose,
    dismissable,
    backdropClass,
    classBackdrop,
    dialogClass,
    classDialog,
    defaultClass,
    headerClass,
    classHeader,
    bodyClass,
    classBody,
    footerClass,
    classFooter
  });
  pop();
}
export {
  Badge as B,
  Card as C,
  Modal as M,
  Select as S
};
