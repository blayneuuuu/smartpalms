import { i as rest_props, v as setContext, j as fallback, w as element, b as bind_props, p as pop, o as sanitize_props, d as push, m as slot, k as spread_attributes, l as clsx, c as copy_payload, a as assign_payload, q as spread_props, h as getContext, e as escape_html, x as invalid_default_snippet, g as attr, t as sanitize_slots, u as stringify } from "./index3.js";
import { twMerge } from "tailwind-merge";
const linear = (x) => x;
function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
const bgColors = {
  gray: "bg-gray-50 dark:bg-gray-800",
  red: "bg-red-50 dark:bg-gray-800",
  yellow: "bg-yellow-50 dark:bg-gray-800 ",
  green: "bg-green-50 dark:bg-gray-800 ",
  indigo: "bg-indigo-50 dark:bg-gray-800 ",
  purple: "bg-purple-50 dark:bg-gray-800 ",
  pink: "bg-pink-50 dark:bg-gray-800 ",
  blue: "bg-blue-50 dark:bg-gray-800 ",
  light: "bg-gray-50 dark:bg-gray-700",
  dark: "bg-gray-50 dark:bg-gray-800",
  default: "bg-white dark:bg-gray-800",
  dropdown: "bg-white dark:bg-gray-700",
  navbar: "bg-white dark:bg-gray-900",
  navbarUl: "bg-gray-50 dark:bg-gray-800",
  form: "bg-gray-50 dark:bg-gray-700",
  primary: "bg-primary-50 dark:bg-gray-800 ",
  orange: "bg-orange-50 dark:bg-orange-800",
  none: ""
};
function Frame($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "tag",
    "color",
    "rounded",
    "border",
    "shadow",
    "node",
    "use",
    "options",
    "role",
    "transition",
    "params",
    "open"
  ]);
  push();
  const noop = () => {
  };
  setContext("background", true);
  let tag = fallback($$props["tag"], () => $$restProps.href ? "a" : "div", true);
  let color = fallback($$props["color"], "default");
  let rounded = fallback($$props["rounded"], false);
  let border = fallback($$props["border"], false);
  let shadow = fallback($$props["shadow"], false);
  let node = fallback($$props["node"], () => void 0, true);
  let use = fallback($$props["use"], noop);
  let options = fallback($$props["options"], () => ({}), true);
  let role = fallback($$props["role"], () => void 0, true);
  let transition = fallback($$props["transition"], () => void 0, true);
  let params = fallback($$props["params"], () => ({}), true);
  let open = fallback($$props["open"], true);
  const textColors = {
    gray: "text-gray-800 dark:text-gray-300",
    red: "text-red-800 dark:text-red-400",
    yellow: "text-yellow-800 dark:text-yellow-300",
    green: "text-green-800 dark:text-green-400",
    indigo: "text-indigo-800 dark:text-indigo-400",
    purple: "text-purple-800 dark:text-purple-400",
    pink: "text-pink-800 dark:text-pink-400",
    blue: "text-blue-800 dark:text-blue-400",
    light: "text-gray-700 dark:text-gray-300",
    dark: "text-gray-700 dark:text-gray-300",
    default: "text-gray-500 dark:text-gray-400",
    dropdown: "text-gray-700 dark:text-gray-200",
    navbar: "text-gray-700 dark:text-gray-200",
    navbarUl: "text-gray-700 dark:text-gray-400",
    form: "text-gray-900 dark:text-white",
    primary: "text-primary-800 dark:text-primary-400",
    orange: "text-orange-800 dark:text-orange-400",
    none: ""
  };
  const borderColors = {
    gray: "border-gray-300 dark:border-gray-800 divide-gray-300 dark:divide-gray-800",
    red: "border-red-300 dark:border-red-800 divide-red-300 dark:divide-red-800",
    yellow: "border-yellow-300 dark:border-yellow-800 divide-yellow-300 dark:divide-yellow-800",
    green: "border-green-300 dark:border-green-800 divide-green-300 dark:divide-green-800",
    indigo: "border-indigo-300 dark:border-indigo-800 divide-indigo-300 dark:divide-indigo-800",
    purple: "border-purple-300 dark:border-purple-800 divide-purple-300 dark:divide-purple-800",
    pink: "border-pink-300 dark:border-pink-800 divide-pink-300 dark:divide-pink-800",
    blue: "border-blue-300 dark:border-blue-800 divide-blue-300 dark:divide-blue-800",
    light: "border-gray-500 divide-gray-500",
    dark: "border-gray-500 divide-gray-500",
    default: "border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700",
    dropdown: "border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600",
    navbar: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
    navbarUl: "border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700",
    form: "border-gray-300 dark:border-gray-700 divide-gray-300 dark:divide-gray-700",
    primary: "border-primary-500 dark:border-primary-200  divide-primary-500 dark:divide-primary-200 ",
    orange: "border-orange-300 dark:border-orange-800 divide-orange-300 dark:divide-orange-800",
    none: ""
  };
  let divClass;
  color = color ?? "default";
  setContext("color", color);
  divClass = twMerge(bgColors[color], textColors[color], rounded && "rounded-lg", border && "border", borderColors[color], shadow && "shadow-md", $$sanitized_props.class);
  if (transition && open) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes({
          role,
          ...$$restProps,
          class: clsx(divClass)
        })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!---->`;
      }
    );
  } else {
    $$payload.out += "<!--[!-->";
    if (open) {
      $$payload.out += "<!--[-->";
      element(
        $$payload,
        tag,
        () => {
          $$payload.out += `${spread_attributes({
            role,
            ...$$restProps,
            class: clsx(divClass)
          })}`;
        },
        () => {
          $$payload.out += `<!---->`;
          slot($$payload, $$props, "default", {}, null);
          $$payload.out += `<!---->`;
        }
      );
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    tag,
    color,
    rounded,
    border,
    shadow,
    node,
    use,
    options,
    role,
    transition,
    params,
    open
  });
  pop();
}
function TransitionFrame($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["transition", "params", "open"]);
  let transition = fallback($$props["transition"], fade);
  let params = fallback($$props["params"], () => ({}), true);
  let open = fallback($$props["open"], true);
  function close(ev) {
    if (ev?.stopPropagation) ev.stopPropagation();
    open = false;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Frame($$payload2, spread_props([
      { transition, params },
      $$restProps,
      {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          slot($$payload3, $$props, "default", { close }, null);
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { transition, params, open });
}
function ToolbarButton($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "color",
    "name",
    "ariaLabel",
    "size",
    "href"
  ]);
  push();
  let color = fallback($$props["color"], "default");
  let name = fallback($$props["name"], () => void 0, true);
  let ariaLabel = fallback($$props["ariaLabel"], () => void 0, true);
  let size = fallback($$props["size"], "md");
  let href = fallback($$props["href"], () => void 0, true);
  const background = getContext("background");
  const colors = {
    dark: "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600",
    gray: "text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
    red: "text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-300",
    yellow: "text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
    green: "text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-green-800 dark:hover:text-green-300",
    indigo: "text-indigo-500 focus:ring-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
    purple: "text-purple-500 focus:ring-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 dark:hover:text-purple-300",
    pink: "text-pink-500 focus:ring-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800 dark:hover:text-pink-300",
    blue: "text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-300",
    primary: "text-primary-500 focus:ring-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 dark:hover:text-primary-300",
    default: "focus:ring-gray-400 hover:bg-gray-100"
  };
  const sizing = {
    xs: "m-0.5 rounded-sm focus:ring-1 p-0.5",
    sm: "m-0.5 rounded focus:ring-1 p-0.5",
    md: "m-0.5 rounded-lg focus:ring-2 p-1.5",
    lg: "m-0.5 rounded-lg focus:ring-2 p-2.5"
  };
  let buttonClass;
  const svgSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-5 h-5"
  };
  buttonClass = twMerge("focus:outline-none whitespace-normal", sizing[size], colors[color], color === "default" && (background ? "dark:hover:bg-gray-600" : "dark:hover:bg-gray-700"), $$sanitized_props.class);
  if (href) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${spread_attributes({
      href,
      ...$$restProps,
      class: clsx(buttonClass),
      "aria-label": ariaLabel ?? name
    })}>`;
    if (name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="sr-only">${escape_html(name)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!---->`;
    slot($$payload, $$props, "default", { svgSize: svgSizes[size] }, null);
    $$payload.out += `<!----></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({
      type: "button",
      ...$$restProps,
      class: clsx(buttonClass),
      "aria-label": ariaLabel ?? name
    })}>`;
    if (name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="sr-only">${escape_html(name)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <!---->`;
    slot($$payload, $$props, "default", { svgSize: svgSizes[size] }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { color, name, ariaLabel, size, href });
  pop();
}
function CloseButton($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["name"]);
  push();
  let name = fallback($$props["name"], "Close");
  ToolbarButton($$payload, spread_props([
    { name },
    $$restProps,
    {
      class: twMerge("ms-auto", $$sanitized_props.class),
      children: invalid_default_snippet,
      $$slots: {
        default: ($$payload2, { svgSize }) => {
          $$payload2.out += `<svg${attr("class", clsx(svgSize))} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
        }
      }
    }
  ]));
  bind_props($$props, { name });
  pop();
}
function Alert($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["dismissable", "defaultClass"]);
  push();
  let dismissable = fallback($$props["dismissable"], false);
  let defaultClass = fallback($$props["defaultClass"], "p-4 gap-3 text-sm");
  let divClass;
  divClass = twMerge(defaultClass, ($$slots.icon || dismissable) && "flex items-center", $$sanitized_props.class);
  TransitionFrame($$payload, spread_props([
    {
      dismissable,
      color: "primary",
      role: "alert",
      rounded: true
    },
    $$restProps,
    {
      class: divClass,
      children: invalid_default_snippet,
      $$slots: {
        default: ($$payload2, { close }) => {
          if ($$slots.icon) {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<!---->`;
            slot($$payload2, $$props, "icon", {}, null);
            $$payload2.out += `<!---->`;
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> `;
          if ($$slots.icon || dismissable) {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<div><!---->`;
            slot($$payload2, $$props, "default", {}, null);
            $$payload2.out += `<!----></div>`;
          } else {
            $$payload2.out += "<!--[!-->";
            $$payload2.out += `<!---->`;
            slot($$payload2, $$props, "default", {}, null);
            $$payload2.out += `<!---->`;
          }
          $$payload2.out += `<!--]--> `;
          if (dismissable) {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<!---->`;
            slot($$payload2, $$props, "close-button", { close }, () => {
              CloseButton($$payload2, {
                class: "ms-auto -me-1.5 -my-1.5 dark:hover:bg-gray-700",
                color: $$restProps.color
              });
            });
            $$payload2.out += `<!---->`;
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]-->`;
        }
      }
    }
  ]));
  bind_props($$props, { dismissable, defaultClass });
  pop();
}
function Button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "pill",
    "outline",
    "size",
    "href",
    "type",
    "color",
    "shadow",
    "tag",
    "checked",
    "disabled"
  ]);
  push();
  const group = getContext("group");
  let pill = fallback($$props["pill"], false);
  let outline = fallback($$props["outline"], false);
  let size = fallback($$props["size"], group ? "sm" : "md");
  let href = fallback($$props["href"], () => void 0, true);
  let type = fallback($$props["type"], "button");
  let color = fallback($$props["color"], group ? outline ? "dark" : "alternative" : "primary");
  let shadow = fallback($$props["shadow"], false);
  let tag = fallback($$props["tag"], "button");
  let checked = fallback($$props["checked"], () => void 0, true);
  let disabled = fallback($$props["disabled"], false);
  const colorClasses = {
    alternative: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:text-primary-700 focus-within:text-primary-700 dark:focus-within:text-white dark:hover:text-white dark:hover:bg-gray-700",
    blue: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
    dark: "text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
    green: "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
    light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600",
    primary: "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
    purple: "text-white bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
    red: "text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
    yellow: "text-white bg-yellow-400 hover:bg-yellow-500 ",
    none: ""
  };
  const colorCheckedClasses = {
    alternative: "text-primary-700 border dark:text-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 shadow-gray-300 dark:shadow-gray-800 shadow-inner",
    blue: "text-blue-900 bg-blue-400 dark:bg-blue-500 shadow-blue-700 dark:shadow-blue-800 shadow-inner",
    dark: "text-white bg-gray-500 dark:bg-gray-600 shadow-gray-800 dark:shadow-gray-900 shadow-inner",
    green: "text-green-900 bg-green-400 dark:bg-green-500 shadow-green-700 dark:shadow-green-800 shadow-inner",
    light: "text-gray-900 bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:text-gray-900 dark:border-gray-700 shadow-gray-300 dark:shadow-gray-700 shadow-inner",
    primary: "text-primary-900 bg-primary-400 dark:bg-primary-500 shadow-primary-700 dark:shadow-primary-800 shadow-inner",
    purple: "text-purple-900 bg-purple-400 dark:bg-purple-500 shadow-purple-700 dark:shadow-purple-800 shadow-inner",
    red: "text-red-900 bg-red-400 dark:bg-red-500 shadow-red-700 dark:shadow-red-800 shadow-inner",
    yellow: "text-yellow-900 bg-yellow-300 dark:bg-yellow-400 shadow-yellow-500 dark:shadow-yellow-700 shadow-inner",
    none: ""
  };
  const coloredFocusClasses = {
    alternative: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
    blue: "focus-within:ring-blue-300 dark:focus-within:ring-blue-800",
    dark: "focus-within:ring-gray-300 dark:focus-within:ring-gray-700",
    green: "focus-within:ring-green-300 dark:focus-within:ring-green-800",
    light: "focus-within:ring-gray-200 dark:focus-within:ring-gray-700",
    primary: "focus-within:ring-primary-300 dark:focus-within:ring-primary-800",
    purple: "focus-within:ring-purple-300 dark:focus-within:ring-purple-900",
    red: "focus-within:ring-red-300 dark:focus-within:ring-red-900",
    yellow: "focus-within:ring-yellow-300 dark:focus-within:ring-yellow-900",
    none: ""
  };
  const coloredShadowClasses = {
    alternative: "shadow-gray-500/50 dark:shadow-gray-800/80",
    blue: "shadow-blue-500/50 dark:shadow-blue-800/80",
    dark: "shadow-gray-500/50 dark:shadow-gray-800/80",
    green: "shadow-green-500/50 dark:shadow-green-800/80",
    light: "shadow-gray-500/50 dark:shadow-gray-800/80",
    primary: "shadow-primary-500/50 dark:shadow-primary-800/80",
    purple: "shadow-purple-500/50 dark:shadow-purple-800/80",
    red: "shadow-red-500/50 dark:shadow-red-800/80 ",
    yellow: "shadow-yellow-500/50 dark:shadow-yellow-800/80 ",
    none: ""
  };
  const outlineClasses = {
    alternative: "text-gray-900 dark:text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white focus-within:ring-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus-within:ring-gray-800",
    blue: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600",
    dark: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 focus-within:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600",
    green: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600",
    light: "text-gray-500 hover:text-gray-900 bg-white border border-gray-200 dark:border-gray-600 dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600",
    primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600",
    purple: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500",
    red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600",
    yellow: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400",
    none: ""
  };
  const sizeClasses = {
    xs: "px-3 py-2 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-6 py-3.5 text-base"
  };
  const hasBorder = () => outline || color === "alternative" || color === "light";
  let buttonClass;
  buttonClass = twMerge("text-center font-medium", group ? "focus-within:ring-2" : "focus-within:ring-4", group && "focus-within:z-10", group || "focus-within:outline-none", "inline-flex items-center justify-center " + sizeClasses[size], outline && checked && "border dark:border-gray-900", outline && checked && colorCheckedClasses[color], outline && !checked && outlineClasses[color], !outline && checked && colorCheckedClasses[color], !outline && !checked && colorClasses[color], color === "alternative" && (group && !checked ? "dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600" : "dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-600"), outline && color === "dark" && (group ? checked ? "bg-gray-900 border-gray-800 dark:border-white dark:bg-gray-600" : "dark:text-white border-gray-800 dark:border-white" : "dark:text-gray-400 dark:border-gray-700"), coloredFocusClasses[color], hasBorder() && group && "[&:not(:first-child)]:-ms-px", group ? pill && "first:rounded-s-full last:rounded-e-full" || "first:rounded-s-lg last:rounded-e-lg" : pill && "rounded-full" || "rounded-lg", shadow && "shadow-lg", shadow && coloredShadowClasses[color], disabled && "cursor-not-allowed opacity-50", $$sanitized_props.class);
  if (href && !disabled) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${spread_attributes({
      href,
      ...$$restProps,
      class: clsx(buttonClass),
      role: "button"
    })}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (tag === "label") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<label${spread_attributes({
        ...$$restProps,
        class: clsx(buttonClass)
      })}><!---->`;
      slot($$payload, $$props, "default", {}, null);
      $$payload.out += `<!----></label>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (tag === "button") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button${spread_attributes({
          type,
          ...$$restProps,
          disabled,
          class: clsx(buttonClass)
        })}><!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!----></button>`;
      } else {
        $$payload.out += "<!--[!-->";
        element(
          $$payload,
          tag,
          () => {
            $$payload.out += `${spread_attributes({
              ...$$restProps,
              class: clsx(buttonClass)
            })}`;
          },
          () => {
            $$payload.out += `<!---->`;
            slot($$payload, $$props, "default", {}, null);
            $$payload.out += `<!---->`;
          }
        );
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    pill,
    outline,
    size,
    href,
    type,
    color,
    shadow,
    tag,
    checked,
    disabled
  });
  pop();
}
function Wrapper($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["tag", "show", "use"]);
  let tag = fallback($$props["tag"], "div");
  let show = $$props["show"];
  let use = fallback($$props["use"], () => {
  });
  if (show) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes({ ...$$restProps })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {}, null);
        $$payload.out += `<!---->`;
      }
    );
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { tag, show, use });
}
function Label($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["color", "defaultClass", "show"]);
  push();
  let labelClass;
  let color = fallback($$props["color"], "gray");
  let defaultClass = fallback($$props["defaultClass"], "text-sm rtl:text-right font-medium block");
  let show = fallback($$props["show"], true);
  const colorClasses = {
    gray: "text-gray-900 dark:text-gray-300",
    green: "text-green-700 dark:text-green-500",
    red: "text-red-700 dark:text-red-500",
    disabled: "text-gray-400 dark:text-gray-500 grayscale contrast-50"
  };
  {
    color = color;
  }
  labelClass = twMerge(defaultClass, colorClasses[color], $$sanitized_props.class);
  if (show) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<label${spread_attributes({ ...$$restProps, class: clsx(labelClass) })}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></label>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { color, defaultClass, show });
  pop();
}
function clampSize(s) {
  return s && s === "xs" ? "sm" : s === "xl" ? "lg" : s;
}
function Input($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "type",
    "value",
    "size",
    "clearable",
    "defaultClass",
    "color",
    "floatClass",
    "classLeft",
    "classRight"
  ]);
  push();
  let _size;
  let type = fallback($$props["type"], "text");
  let value = fallback($$props["value"], () => void 0, true);
  let size = fallback($$props["size"], () => void 0, true);
  let clearable = fallback($$props["clearable"], false);
  let defaultClass = fallback($$props["defaultClass"], "block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right");
  let color = fallback($$props["color"], "base");
  let floatClass = fallback($$props["floatClass"], "flex absolute inset-y-0 items-center text-gray-500 dark:text-gray-400");
  let classLeft = fallback($$props["classLeft"], "");
  let classRight = fallback($$props["classRight"], "");
  const borderClasses = {
    base: "border border-gray-300 dark:border-gray-600",
    tinted: "border border-gray-300 dark:border-gray-500",
    green: "border border-green-500 dark:border-green-400",
    red: "border border-red-500 dark:border-red-400"
  };
  const ringClasses = {
    base: "focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500",
    green: "focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:focus:ring-green-500",
    red: "focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500"
  };
  const colorClasses = {
    base: "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
    tinted: "bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400",
    green: "bg-green-50 text-green-900 placeholder-green-700 dark:text-green-400 dark:placeholder-green-500 dark:bg-gray-700",
    red: "bg-red-50 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:bg-gray-700"
  };
  let background = getContext("background");
  let group = getContext("group");
  const textSizes = {
    sm: "sm:text-xs",
    md: "text-sm",
    lg: "sm:text-base"
  };
  const leftPadding = { sm: "ps-9", md: "ps-10", lg: "ps-11" };
  const rightPadding = { sm: "pe-9", md: "pe-10", lg: "pe-11" };
  const inputPadding = { sm: "p-2", md: "p-2.5", lg: "p-3" };
  let inputClass;
  _size = size || clampSize(group?.size) || "md";
  {
    const _color = color === "base" && background ? "tinted" : color;
    inputClass = twMerge([
      defaultClass,
      inputPadding[_size],
      $$slots.left && leftPadding[_size] || (clearable || $$slots.right) && rightPadding[_size],
      ringClasses[color],
      colorClasses[_color],
      borderClasses[_color],
      textSizes[_size],
      group || "rounded-lg",
      group && "first:rounded-s-lg last:rounded-e-lg",
      group && "[&:not(:first-child)]:-ms-px",
      $$sanitized_props.class
    ]);
  }
  Wrapper($$payload, {
    class: "relative w-full",
    show: $$slots.left || $$slots.right,
    children: ($$payload2) => {
      if ($$slots.left) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div${attr("class", `${stringify(twMerge(floatClass, classLeft))} start-0 ps-2.5 pointer-events-none`)}><!---->`;
        slot($$payload2, $$props, "left", {}, null);
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <!---->`;
      slot(
        $$payload2,
        $$props,
        "default",
        {
          props: { ...$$restProps, class: inputClass }
        },
        () => {
          $$payload2.out += `<input${spread_attributes({
            ...$$restProps,
            value,
            ...{ type },
            class: clsx(inputClass)
          })}>`;
        }
      );
      $$payload2.out += `<!----> `;
      if ($$slots.right) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div${attr("class", `${stringify(twMerge(floatClass, classRight))} end-0 pe-2.5`)}><!---->`;
        slot($$payload2, $$props, "right", {}, null);
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      if (clearable && value && `${value}`.length > 0) {
        $$payload2.out += "<!--[-->";
        CloseButton($$payload2, {
          size,
          color: "none",
          class: ` ${stringify(twMerge(floatClass, classRight))} focus:ring-0 end-6 focus:ring-gray-400 dark:text-white`
        });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, {
    type,
    value,
    size,
    clearable,
    defaultClass,
    color,
    floatClass,
    classLeft,
    classRight
  });
  pop();
}
export {
  Alert as A,
  Button as B,
  CloseButton as C,
  Frame as F,
  Input as I,
  Label as L,
  fade as f
};
