import { ad as current_component, i as rest_props, j as fallback, k as spread_attributes, l as clsx, g as attr, b as bind_props, p as pop, o as sanitize_props, d as push, v as setContext, m as slot, h as getContext, ae as store_get, f as ensure_array_like, af as unsubscribe_stores, e as escape_html, c as copy_payload, a as assign_payload, w as element } from "../../../chunks/index3.js";
import "clsx";
import { A as Alert, B as Button, L as Label, I as Input } from "../../../chunks/Input.js";
import { C as Card, B as Badge, M as Modal, S as Select } from "../../../chunks/Modal.js";
import { w as writable, k as derived, l as get, r as readable, o as readonly } from "../../../chunks/exports.js";
import { twMerge, twJoin } from "tailwind-merge";
import "dequal";
import { nanoid } from "nanoid/non-secure";
import { createFocusTrap as createFocusTrap$1 } from "focus-trap";
import "../../../chunks/client.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
async function tick() {
}
function Spinner($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "color",
    "bg",
    "customColor",
    "size",
    "currentFill",
    "currentColor"
  ]);
  push();
  let color = fallback($$props["color"], "primary");
  let bg = fallback($$props["bg"], "text-gray-300");
  let customColor = fallback($$props["customColor"], "");
  let size = fallback($$props["size"], "8");
  let currentFill = fallback($$props["currentFill"], "currentFill");
  let currentColor = fallback($$props["currentColor"], "currentColor");
  let iconsize = `w-${size} h-${size}`;
  if (currentFill !== "currentFill") {
    color = void 0;
  }
  const fillColorClasses = {
    primary: "fill-primary-600",
    blue: "fill-blue-600",
    gray: "fill-gray-600 dark:fill-gray-300",
    green: "fill-green-500",
    red: "fill-red-600",
    yellow: "fill-yellow-400",
    pink: "fill-pink-600",
    purple: "fill-purple-600",
    white: "fill-white",
    custom: customColor
  };
  let fillColorClass = color === void 0 ? "" : fillColorClasses[color] ?? fillColorClasses.blue;
  $$payload.out += `<svg${spread_attributes(
    {
      ...$$restProps,
      role: "status",
      class: clsx(twMerge("inline -mt-px animate-spin dark:text-gray-600", iconsize, bg, fillColorClass, $$sanitized_props.class)),
      viewBox: "0 0 100 101",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    void 0,
    void 0,
    3
  )}><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"${attr("fill", currentColor)}></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"${attr("fill", currentFill)}></path></svg>`;
  bind_props($$props, {
    color,
    bg,
    customColor,
    size,
    currentFill,
    currentColor
  });
  pop();
}
function Table($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "divClass",
    "striped",
    "hoverable",
    "noborder",
    "shadow",
    "color",
    "customeColor",
    "items",
    "filter",
    "placeholder",
    "innerDivClass",
    "searchClass",
    "svgDivClass",
    "svgClass",
    "inputClass",
    "classInput",
    "classSvgDiv"
  ]);
  push();
  let divClass = fallback($$props["divClass"], "relative overflow-x-auto");
  let striped = fallback($$props["striped"], false);
  let hoverable = fallback($$props["hoverable"], false);
  let noborder = fallback($$props["noborder"], false);
  let shadow = fallback($$props["shadow"], false);
  let color = fallback($$props["color"], "default");
  let customeColor = fallback($$props["customeColor"], "");
  let items = fallback($$props["items"], () => [], true);
  let filter = fallback($$props["filter"], null);
  let placeholder = fallback($$props["placeholder"], "Search");
  let innerDivClass = fallback($$props["innerDivClass"], "p-4");
  let searchClass = fallback($$props["searchClass"], "relative mt-1");
  let svgDivClass = fallback($$props["svgDivClass"], "absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none");
  let svgClass = fallback($$props["svgClass"], "w-5 h-5 text-gray-500 dark:text-gray-400");
  let inputClass = fallback($$props["inputClass"], "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 ps-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500");
  let classInput = fallback($$props["classInput"], "");
  let classSvgDiv = fallback($$props["classSvgDiv"], "");
  let searchTerm = "";
  let inputCls = twMerge(inputClass, classInput);
  let svgDivCls = twMerge(svgDivClass, classSvgDiv);
  const colors = {
    default: "text-gray-500 dark:text-gray-400",
    blue: "text-blue-100 dark:text-blue-100",
    green: "text-green-100 dark:text-green-100",
    red: "text-red-100 dark:text-red-100",
    yellow: "text-yellow-100 dark:text-yellow-100",
    purple: "text-purple-100 dark:text-purple-100",
    indigo: "text-indigo-100 dark:text-indigo-100",
    pink: "text-pink-100 dark:text-pink-100",
    custom: customeColor
  };
  const searchTermStore = writable(searchTerm);
  const filterStore = writable(filter);
  setContext("searchTerm", searchTermStore);
  setContext("filter", filterStore);
  setContext("sorter", writable(null));
  setContext("striped", striped);
  setContext("hoverable", hoverable);
  setContext("noborder", noborder);
  setContext("color", color);
  setContext("items", items);
  searchTermStore.set(searchTerm);
  {
    if (filter) filterStore.set(filter);
  }
  $$payload.out += `<div${attr("class", clsx(twJoin(divClass, shadow && "shadow-md sm:rounded-lg")))}>`;
  if (filter) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "search", {}, () => {
      $$payload.out += `<div${attr("class", clsx(innerDivClass))}><label for="table-search" class="sr-only">Search</label> <div${attr("class", clsx(searchClass))}><div${attr("class", clsx(svgDivCls))}><!---->`;
      slot($$payload, $$props, "svgSearch", {}, () => {
        $$payload.out += `<svg${attr("class", clsx(svgClass))} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>`;
      });
      $$payload.out += `<!----></div> <input${attr("value", searchTerm)} type="text" id="table-search"${attr("class", clsx(inputCls))}${attr("placeholder", placeholder)}></div> <!---->`;
      slot($$payload, $$props, "header", {}, null);
      $$payload.out += `<!----></div>`;
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <table${spread_attributes({
    ...$$restProps,
    class: clsx(twMerge("w-full text-left text-sm", colors[color], $$sanitized_props.class))
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></table></div>`;
  bind_props($$props, {
    divClass,
    striped,
    hoverable,
    noborder,
    shadow,
    color,
    customeColor,
    items,
    filter,
    placeholder,
    innerDivClass,
    searchClass,
    svgDivClass,
    svgClass,
    inputClass,
    classInput,
    classSvgDiv
  });
  pop();
}
function TableBody($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["tableBodyClass"]);
  push();
  var $$store_subs;
  let items, filtered, sorted;
  let tableBodyClass = fallback($$props["tableBodyClass"], () => void 0, true);
  let filter = getContext("filter");
  let searchTerm = getContext("searchTerm");
  let sorter = getContext("sorter");
  items = getContext("items") || [];
  filtered = store_get($$store_subs ??= {}, "$filter", filter) ? items.filter((item) => store_get($$store_subs ??= {}, "$filter", filter)(item, store_get($$store_subs ??= {}, "$searchTerm", searchTerm))) : items;
  sorted = store_get($$store_subs ??= {}, "$sorter", sorter) ? filtered.toSorted((a, b) => store_get($$store_subs ??= {}, "$sorter", sorter).sortDirection * store_get($$store_subs ??= {}, "$sorter", sorter).sort(a, b)) : filtered;
  const each_array = ensure_array_like(sorted);
  $$payload.out += `<tbody${spread_attributes({
    ...$$restProps,
    class: clsx(tableBodyClass)
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "row", { item }, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></tbody>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { tableBodyClass });
  pop();
}
function TableBodyCell($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["tdClass"]);
  push();
  let tdClass = fallback($$props["tdClass"], "px-6 py-4 whitespace-nowrap font-medium ");
  let color = "default";
  color = getContext("color");
  let tdClassfinal;
  tdClassfinal = twMerge(tdClass, color === "default" ? "text-gray-900 dark:text-white" : "text-blue-50 whitespace-nowrap dark:text-blue-100", $$sanitized_props.class);
  $$payload.out += `<td${spread_attributes({
    ...$$restProps,
    class: clsx(tdClassfinal)
  })}>`;
  if ($$sanitized_props.onclick) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></td>`;
  bind_props($$props, { tdClass });
  pop();
}
function TableBodyRow($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["color"]);
  push();
  let color = fallback($$props["color"], () => getContext("color"), true);
  const colors = {
    default: "bg-white dark:bg-gray-800 dark:border-gray-700",
    blue: "bg-blue-500 border-blue-400",
    green: "bg-green-500 border-green-400",
    red: "bg-red-500 border-red-400",
    yellow: "bg-yellow-500 border-yellow-400",
    purple: "bg-purple-500 border-purple-400",
    custom: ""
  };
  const hoverColors = {
    default: "hover:bg-gray-50 dark:hover:bg-gray-600",
    blue: "hover:bg-blue-400",
    green: "hover:bg-green-400",
    red: "hover:bg-red-400",
    yellow: "hover:bg-yellow-400",
    purple: "hover:bg-purple-400",
    custom: ""
  };
  const stripColors = {
    default: "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
    blue: "odd:bg-blue-800 even:bg-blue-700 odd:dark:bg-blue-800 even:dark:bg-blue-700",
    green: "odd:bg-green-800 even:bg-green-700 odd:dark:bg-green-800 even:dark:bg-green-700",
    red: "odd:bg-red-800 even:bg-red-700 odd:dark:bg-red-800 even:dark:bg-red-700",
    yellow: "odd:bg-yellow-800 even:bg-yellow-700 odd:dark:bg-yellow-800 even:dark:bg-yellow-700",
    purple: "odd:bg-purple-800 even:bg-purple-700 odd:dark:bg-purple-800 even:dark:bg-purple-700",
    custom: ""
  };
  let trClass;
  trClass = twMerge([
    !getContext("noborder") && "border-b last:border-b-0",
    colors[color],
    getContext("hoverable") && hoverColors[color],
    getContext("striped") && stripColors[color],
    $$sanitized_props.class
  ]);
  $$payload.out += `<tr${spread_attributes({ ...$$restProps, class: clsx(trClass) })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></tr>`;
  bind_props($$props, { color });
  pop();
}
function TableHead($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["theadClass", "defaultRow"]);
  push();
  let theadClassfinal;
  let theadClass = fallback($$props["theadClass"], "text-xs uppercase");
  let defaultRow = fallback($$props["defaultRow"], true);
  let color;
  color = getContext("color");
  let noborder = getContext("noborder");
  let striped = getContext("striped");
  let defaultBgColor = noborder || striped ? "" : "bg-gray-50 dark:bg-gray-700";
  const bgColors = {
    default: defaultBgColor,
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    custom: ""
  };
  let textColor = color === "default" ? "text-gray-700 dark:text-gray-400" : color === "custom" ? "" : "text-white  dark:text-white";
  let borderColors = striped ? "" : color === "default" ? "border-gray-700" : color === "custom" ? "" : `border-${color}-400`;
  theadClassfinal = twMerge(theadClass, textColor, striped && borderColors, bgColors[color], $$sanitized_props.class);
  $$payload.out += `<thead${spread_attributes({
    ...$$restProps,
    class: clsx(theadClassfinal)
  })}>`;
  if (defaultRow) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<tr><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></tr>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></thead>`;
  bind_props($$props, { theadClass, defaultRow });
  pop();
}
function TableHeadCell($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "padding",
    "sort",
    "defaultDirection",
    "defaultSort",
    "direction"
  ]);
  push();
  var $$store_subs;
  let padding = fallback($$props["padding"], "px-6 py-3");
  let sort = fallback($$props["sort"], null);
  let defaultDirection = fallback($$props["defaultDirection"], "asc");
  let defaultSort = fallback($$props["defaultSort"], false);
  let direction = fallback($$props["direction"], defaultSort ? defaultDirection : null);
  let sorter = getContext("sorter");
  let sortId = Math.random().toString(36).substring(2);
  if (defaultSort) {
    sortItems();
  }
  function sortItems() {
    if (!sort || !sorter) return;
    sorter.update((sorter2) => {
      return {
        id: sortId,
        sort,
        sortDirection: sorter2?.id === sortId ? -sorter2.sortDirection : defaultDirection === "asc" ? 1 : -1
      };
    });
  }
  direction = store_get($$store_subs ??= {}, "$sorter", sorter)?.id === sortId ? store_get($$store_subs ??= {}, "$sorter", sorter).sortDirection === 1 ? "asc" : "desc" : null;
  if (sort && sorter) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<th${spread_attributes({
      ...$$restProps,
      class: clsx($$sanitized_props.class),
      "aria-sort": direction ? `${direction}ending` : void 0
    })}><button${attr("class", clsx(twMerge("w-full text-left", "after:absolute after:pl-3", direction === "asc" && 'after:content-["▲"]', direction === "desc" && 'after:content-["▼"]', padding)))}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></button></th>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<th${spread_attributes({
      ...$$restProps,
      class: clsx(twMerge(padding, $$sanitized_props.class))
    })}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></th>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    padding,
    sort,
    defaultDirection,
    defaultSort,
    direction
  });
  pop();
}
function TabItem($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "open",
    "title",
    "activeClasses",
    "inactiveClasses",
    "defaultClass",
    "divClass"
  ]);
  push();
  let open = fallback($$props["open"], false);
  let title = fallback($$props["title"], "Tab title");
  let activeClasses = fallback($$props["activeClasses"], () => void 0, true);
  let inactiveClasses = fallback($$props["inactiveClasses"], () => void 0, true);
  let defaultClass = fallback($$props["defaultClass"], "inline-block text-sm font-medium text-center disabled:cursor-not-allowed");
  let divClass = fallback($$props["divClass"], "");
  const ctx = getContext("ctx") ?? {};
  ctx.selected ?? writable();
  let buttonClass;
  buttonClass = twMerge(defaultClass, open ? activeClasses ?? ctx.activeClasses : inactiveClasses ?? ctx.inactiveClasses, open && "active");
  $$payload.out += `<li${attr("class", clsx(twMerge("group", $$sanitized_props.class)))} role="presentation"><button${spread_attributes({
    type: "button",
    role: "tab",
    ...$$restProps,
    class: clsx(buttonClass)
  })}><!---->`;
  slot($$payload, $$props, "title", {}, () => {
    $$payload.out += `${escape_html(title)}`;
  });
  $$payload.out += `<!----></button> `;
  if (open) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="hidden tab_content_placeholder"><div${attr("class", clsx(divClass))}><!---->`;
    slot($$payload, $$props, "default", {}, null);
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></li>`;
  bind_props($$props, {
    open,
    title,
    activeClasses,
    inactiveClasses,
    defaultClass,
    divClass
  });
  pop();
}
function Tabs($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "tabStyle",
    "defaultClass",
    "contentClass",
    "divider",
    "activeClasses",
    "inactiveClasses"
  ]);
  push();
  let ulClass;
  let tabStyle = fallback($$props["tabStyle"], "none");
  let defaultClass = fallback($$props["defaultClass"], "flex flex-wrap space-x-2 rtl:space-x-reverse");
  let contentClass = fallback($$props["contentClass"], "p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4");
  let divider = fallback($$props["divider"], true);
  let activeClasses = fallback($$props["activeClasses"], "p-4 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500");
  let inactiveClasses = fallback($$props["inactiveClasses"], "p-4 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300");
  const styledActiveClasses = {
    full: "p-4 w-full group-first:rounded-s-lg group-last:rounded-e-lg text-gray-900 bg-gray-100 focus:ring-4 focus:ring-primary-300 focus:outline-none dark:bg-gray-700 dark:text-white",
    pill: "py-3 px-4 text-white bg-primary-600 rounded-lg",
    underline: "p-4 text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500",
    none: ""
  };
  const styledInactiveClasses = {
    full: "p-4 w-full group-first:rounded-s-lg group-last:rounded-e-lg text-gray-500 dark:text-gray-400 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-primary-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700",
    pill: "py-3 px-4 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
    underline: "p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400",
    none: ""
  };
  const ctx = {
    activeClasses: styledActiveClasses[tabStyle] || activeClasses,
    inactiveClasses: styledInactiveClasses[tabStyle] || inactiveClasses,
    selected: writable()
  };
  setContext("ctx", ctx);
  divider = ["full", "pill"].includes(tabStyle) ? false : divider;
  ulClass = twMerge(defaultClass, tabStyle === "underline" && "-mb-px", $$sanitized_props.class);
  $$payload.out += `<ul${spread_attributes({ ...$$restProps, class: clsx(ulClass) })}><!---->`;
  slot($$payload, $$props, "default", { tabStyle }, null);
  $$payload.out += `<!----></ul> `;
  if (divider) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "divider", {}, () => {
      $$payload.out += `<div class="h-px bg-gray-200 dark:bg-gray-700"></div>`;
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", clsx(contentClass))} role="tabpanel" aria-labelledby="id-tab"></div>`;
  bind_props($$props, {
    tabStyle,
    defaultClass,
    contentClass,
    divider,
    activeClasses,
    inactiveClasses
  });
  pop();
}
function StatsCard($$payload, $$props) {
  let { title, value, loading: loading2 } = $$props;
  Card($$payload, {
    padding: "sm",
    children: ($$payload2) => {
      $$payload2.out += `<div class="flex flex-col items-center"><h3 class="text-lg font-semibold text-gray-900">${escape_html(title)}</h3> `;
      if (loading2) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<p class="text-3xl font-bold text-gray-700">${escape_html(value)}</p>`;
      }
      $$payload2.out += `<!--]--></div>`;
    },
    $$slots: { default: true }
  });
}
function formatDate(date, includeTime = false) {
  const d = new Date(date);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  if (includeTime) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
    dateOptions.hour12 = true;
  }
  return d.toLocaleString("en-US", dateOptions);
}
function formatTimestamp(timestamp) {
  if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
    timestamp = Number(timestamp);
  }
  if (typeof timestamp === "number" && timestamp < 1e12) {
    timestamp = timestamp * 1e3;
  }
  return formatDate(new Date(timestamp), true);
}
const stats = writable({
  totalLockers: 0,
  occupiedLockers: 0,
  totalUsers: 0,
  pendingRequests: 0
});
const requests = writable([]);
const lockers = writable([]);
const users = writable([]);
const subscriptionTypes = writable([]);
const loading = writable({
  stats: false,
  requests: false,
  lockers: false,
  users: false,
  subscriptionTypes: false,
  transactions: false
});
const errors = writable({
  stats: null,
  requests: null,
  lockers: null,
  users: null,
  subscriptionTypes: null,
  transactions: null
});
function RequestsTab($$payload, $$props) {
  push();
  var $$store_subs;
  let showRejectDialog = false;
  let rejectionReason = "";
  let processingRequest = false;
  let showDetailsDialog = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$errors", errors).requests) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mb-4",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).requests)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (store_get($$store_subs ??= {}, "$loading", loading).requests) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center py-8">`;
      Spinner($$payload2, { size: "8" });
      $$payload2.out += `<!----></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      if (store_get($$store_subs ??= {}, "$requests", requests).length === 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<p class="text-gray-600">No pending requests found.</p>`;
      } else {
        $$payload2.out += "<!--[!-->";
        Table($$payload2, {
          children: ($$payload3) => {
            TableHead($$payload3, {
              children: ($$payload4) => {
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->User`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Locker`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Subscription`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Requested At`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Status`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Actions`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            TableBody($$payload3, {
              children: ($$payload4) => {
                const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$requests", requests));
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let request = each_array[$$index];
                  TableBodyRow($$payload4, {
                    children: ($$payload5) => {
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(request.userName)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->#${escape_html(request.lockerNumber)} (${escape_html(request.lockerSize)})`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(request.subscriptionName)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(formatDate(request.requestedAt, true))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Badge($$payload6, {
                            color: request.status === "pending" ? "yellow" : request.status === "approved" ? "green" : "red",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->${escape_html(request.status)}`;
                            },
                            $$slots: { default: true }
                          });
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          if (request.status === "pending") {
                            $$payload6.out += "<!--[-->";
                            $$payload6.out += `<div class="flex space-x-2">`;
                            Button($$payload6, {
                              size: "xs",
                              color: "green",
                              disabled: processingRequest,
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->Approve`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> `;
                            Button($$payload6, {
                              size: "xs",
                              color: "red",
                              disabled: processingRequest,
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->Reject`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----></div>`;
                          } else {
                            $$payload6.out += "<!--[!-->";
                          }
                          $$payload6.out += `<!--]--> `;
                          Button($$payload6, {
                            size: "xs",
                            color: "blue",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->See Details`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload6.out += `<!---->`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  });
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--> `;
    Modal($$payload2, {
      size: "md",
      autoclose: true,
      get open() {
        return showRejectDialog;
      },
      set open($$value) {
        showRejectDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500">Reject Request</h3></div> <div class="space-y-4"><div>`;
        Label($$payload3, {
          for: "rejectionReason",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Reason for Rejection`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Input($$payload3, {
          id: "rejectionReason",
          placeholder: "Enter reason for rejection",
          get value() {
            return rejectionReason;
          },
          set value($$value) {
            rejectionReason = $$value;
            $$settled = false;
          }
        });
        $$payload3.out += `<!----></div></div> <div class="flex justify-end gap-4 mt-6">`;
        Button($$payload3, {
          color: "alternative",
          disabled: processingRequest,
          children: ($$payload4) => {
            $$payload4.out += `<!---->Cancel`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Button($$payload3, {
          color: "red",
          disabled: !rejectionReason || processingRequest,
          loading: processingRequest,
          children: ($$payload4) => {
            $$payload4.out += `<!---->Reject`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----></div>`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Modal($$payload2, {
      size: "lg",
      autoclose: true,
      get open() {
        return showDetailsDialog;
      },
      set open($$value) {
        showDetailsDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--> <div class="flex justify-end mt-6">`;
        Button($$payload3, {
          color: "alternative",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Close`;
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
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function LockersTab($$payload, $$props) {
  push();
  var $$store_subs;
  let showCreateDialog = false;
  let newLocker = { number: "", size: "" };
  let creatingLocker = false;
  const lockerSizes = ["small", "medium", "large"];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$errors", errors).lockers) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mb-4",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).lockers)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <div class="flex justify-end mb-4">`;
    Button($$payload2, {
      color: "blue",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Create Locker`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> `;
    if (store_get($$store_subs ??= {}, "$loading", loading).lockers) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center py-8">`;
      Spinner($$payload2, { size: "8" });
      $$payload2.out += `<!----></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      if (store_get($$store_subs ??= {}, "$lockers", lockers).length === 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<p class="text-gray-600">No lockers found.</p>`;
      } else {
        $$payload2.out += "<!--[!-->";
        Table($$payload2, {
          children: ($$payload3) => {
            TableHead($$payload3, {
              children: ($$payload4) => {
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Number`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Size`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Status`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->User`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            TableBody($$payload3, {
              children: ($$payload4) => {
                const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$lockers", lockers));
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let locker = each_array[$$index];
                  TableBodyRow($$payload4, {
                    children: ($$payload5) => {
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->#${escape_html(locker.number)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Badge($$payload6, {
                            color: locker.size === "small" ? "blue" : locker.size === "medium" ? "yellow" : "red",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->${escape_html(locker.size)}`;
                            },
                            $$slots: { default: true }
                          });
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Badge($$payload6, {
                            color: locker.userId ? "red" : "green",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->${escape_html(locker.userId ? "Occupied" : "Available")}`;
                            },
                            $$slots: { default: true }
                          });
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          if (locker.userId) {
                            $$payload6.out += "<!--[-->";
                            $$payload6.out += `<div class="flex flex-col"><span>${escape_html(locker.userName)}</span> <span class="text-sm text-gray-500">${escape_html(locker.userEmail)}</span></div>`;
                          } else {
                            $$payload6.out += "<!--[!-->";
                            $$payload6.out += `<span class="text-gray-500">-</span>`;
                          }
                          $$payload6.out += `<!--]-->`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  });
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--> `;
    Modal($$payload2, {
      size: "md",
      autoclose: true,
      get open() {
        return showCreateDialog;
      },
      set open($$value) {
        showCreateDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500">Create New Locker</h3></div> <div class="space-y-4"><div>`;
        Label($$payload3, {
          for: "lockerNumber",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Locker Number`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Input($$payload3, {
          id: "lockerNumber",
          placeholder: "Enter locker number",
          get value() {
            return newLocker.number;
          },
          set value($$value) {
            newLocker.number = $$value;
            $$settled = false;
          }
        });
        $$payload3.out += `<!----></div> <div>`;
        Label($$payload3, {
          for: "lockerSize",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Size`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Select($$payload3, {
          id: "lockerSize",
          get value() {
            return newLocker.size;
          },
          set value($$value) {
            newLocker.size = $$value;
            $$settled = false;
          },
          children: ($$payload4) => {
            const each_array_1 = ensure_array_like(lockerSizes);
            $$payload4.out += `<option value="">Select size</option> <!--[-->`;
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let size = each_array_1[$$index_1];
              $$payload4.out += `<option${attr("value", size)}>${escape_html(size)}</option>`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----></div></div> <div class="flex justify-end gap-4 mt-6">`;
        Button($$payload3, {
          color: "alternative",
          disabled: creatingLocker,
          children: ($$payload4) => {
            $$payload4.out += `<!---->Cancel`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Button($$payload3, {
          color: "blue",
          disabled: !newLocker.number || !newLocker.size || creatingLocker,
          children: ($$payload4) => {
            $$payload4.out += `<!---->${escape_html("Create")}`;
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
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function last(array) {
  return array[array.length - 1];
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
({
  type: "hidden",
  "aria-hidden": true,
  hidden: true,
  tabIndex: -1,
  style: styleToString({
    position: "absolute",
    opacity: 0,
    "pointer-events": "none",
    margin: 0,
    transform: "translateX(-100%)"
  })
});
function portalAttr(portal) {
  if (portal !== null) {
    return "";
  }
  return void 0;
}
function lightable(value) {
  function subscribe(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe };
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
makeElement("empty");
function makeElement(name2, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction({
              ...result(...args2),
              [`data-melt-${name2}`]: "",
              action: action ?? noop
            });
          };
          fn.action = action ?? noop;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name2}`]: "",
          action: action ?? noop
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction({
            ...result(...args2),
            [`data-melt-${name2}`]: "",
            action: action ?? noop
          });
        };
        resultFn.action = action ?? noop;
        return lightable(resultFn);
      }
      return lightable(hiddenAction({
        ...result,
        [`data-melt-${name2}`]: "",
        action: action ?? noop
      }));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix) {
  const name2 = (part) => part ? `${prefix}-${part}` : prefix;
  const attribute = (part) => `data-melt-${prefix}${part ? `-${part}` : ""}`;
  const selector = (part) => `[data-melt-${prefix}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector(part));
  return {
    name: name2,
    attribute,
    selector,
    getEl
  };
}
const isBrowser = typeof document !== "undefined";
const isFunction = (v) => typeof v === "function";
function isElement(element2) {
  return element2 instanceof Element;
}
function isHTMLElement(element2) {
  return element2 instanceof HTMLElement;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isReadable(value) {
  return isObject(value) && "subscribe" in value;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function addMeltEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  if (typeof handler === "function") {
    const handlerWithMelt = withMelt((_event) => handler(_event));
    events.forEach((_event) => target.addEventListener(_event, handlerWithMelt, options));
    return () => {
      events.forEach((_event) => target.removeEventListener(_event, handlerWithMelt, options));
    };
  }
  return () => noop();
}
function dispatchMeltEvent(originalEvent) {
  const node = originalEvent.currentTarget;
  if (!isHTMLElement(node))
    return null;
  const customMeltEvent = new CustomEvent(`m-${originalEvent.type}`, {
    detail: {
      originalEvent
    },
    cancelable: true
  });
  node.dispatchEvent(customMeltEvent);
  return customMeltEvent;
}
function withMelt(handler) {
  return (event) => {
    const customEvent = dispatchMeltEvent(event);
    if (customEvent?.defaultPrevented)
      return;
    return handler(event);
  };
}
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn;
  }
};
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function withGet(store) {
  return {
    ...store,
    get: () => get(store)
  };
}
withGet.writable = function(initial) {
  const internal = writable(initial);
  let value = initial;
  return {
    subscribe: internal.subscribe,
    set(newValue) {
      internal.set(newValue);
      value = newValue;
    },
    update(updater) {
      const newValue = updater(value);
      internal.set(newValue);
      value = newValue;
    },
    get() {
      return value;
    }
  };
};
withGet.derived = function(stores, fn) {
  const subscribers = /* @__PURE__ */ new Map();
  const get2 = () => {
    const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();
    return fn(values);
  };
  const subscribe = (subscriber) => {
    const unsubscribers = [];
    const storesArr = Array.isArray(stores) ? stores : [stores];
    storesArr.forEach((store) => {
      unsubscribers.push(store.subscribe(() => {
        subscriber(get2());
      }));
    });
    subscriber(get2());
    subscribers.set(subscriber, unsubscribers);
    return () => {
      const unsubscribers2 = subscribers.get(subscriber);
      if (unsubscribers2) {
        for (const unsubscribe of unsubscribers2) {
          unsubscribe();
        }
      }
      subscribers.delete(subscriber);
    };
  };
  return {
    get: get2,
    subscribe
  };
};
const overridable = (_store, onChange) => {
  const store = withGet(_store);
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set
  };
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
  return nanoid(10);
}
function generateIds(args) {
  return args.reduce((acc, curr) => {
    acc[curr] = generateId();
    return acc;
  }, {});
}
const kbd = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*",
  A: "a",
  P: "p"
};
const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac = () => pt(/^mac/) && !isTouchDevice();
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac();
const LOCK_CLASSNAME = "data-melt-scroll-lock";
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = document;
  const win = doc.defaultView ?? window;
  const { documentElement, body } = doc;
  const locked = body.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle = () => assignStyle(body, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport } = win;
    const offsetLeft = visualViewport?.offsetLeft ?? 0;
    const offsetTop = visualViewport?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
}
function effect(stores, fn) {
  let cb = void 0;
  const destroy = derived(stores, (stores2) => {
    cb?.();
    cb = fn(stores2);
  }).subscribe(noop);
  const unsub = () => {
    destroy();
    cb?.();
  };
  safeOnDestroy(unsub);
  return unsub;
}
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = withGet(writable(value));
  });
  return result;
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  if (portalProp !== void 0)
    return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body")
    return document.body;
  return null;
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement(el))
      return;
    el.focus();
  } else if (isHTMLElement(returned)) {
    returned.focus();
  }
}
readable(void 0, (set) => {
  function clicked(event) {
    set(event);
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "pointerup", clicked, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
const documentEscapeKeyStore = readable(void 0, (set) => {
  function keydown(event) {
    if (event && event.key === kbd.ESCAPE) {
      set(event);
    }
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
const useEscapeKeydown = (node, config = {}) => {
  let unsub = noop;
  function update(config2 = {}) {
    unsub();
    const options = { enabled: true, ...config2 };
    const enabled = isReadable(options.enabled) ? options.enabled : readable(options.enabled);
    unsub = executeCallbacks(
      // Handle escape keydowns
      documentEscapeKeyStore.subscribe((e) => {
        if (!e || !get(enabled))
          return;
        const target = e.target;
        if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        if (options.ignore) {
          if (isFunction(options.ignore)) {
            if (options.ignore(e))
              return;
          } else if (Array.isArray(options.ignore)) {
            if (options.ignore.length > 0 && options.ignore.some((ignoreEl) => {
              return ignoreEl && target === ignoreEl;
            }))
              return;
          }
        }
        options.handler?.(e);
      }),
      effect(enabled, ($enabled) => {
        if ($enabled) {
          node.dataset.escapee = "";
        } else {
          delete node.dataset.escapee;
        }
      })
    );
  }
  update(config);
  return {
    update,
    destroy() {
      node.removeAttribute("data-escapee");
      unsub();
    }
  };
};
function createFocusTrap(config = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = config;
  const hasFocus = writable(false);
  const isPaused = writable(false);
  const activate = (opts) => trap?.activate(opts);
  const deactivate = (opts) => {
    trap?.deactivate(opts);
  };
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.set(true);
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.set(false);
    }
  };
  const useFocusTrap = (node) => {
    trap = createFocusTrap$1(node, {
      ...focusTrapOptions,
      onActivate() {
        hasFocus.set(true);
        config.onActivate?.();
      },
      onDeactivate() {
        hasFocus.set(false);
        config.onDeactivate?.();
      }
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      }
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause
  };
}
const visibleModals = [];
const useModal = (node, config) => {
  let unsubInteractOutside = noop;
  function removeNodeFromVisibleModals() {
    const index = visibleModals.indexOf(node);
    if (index >= 0) {
      visibleModals.splice(index, 1);
    }
  }
  function update(config2) {
    unsubInteractOutside();
    const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config2;
    sleep(100).then(() => {
      if (open) {
        visibleModals.push(node);
      } else {
        removeNodeFromVisibleModals();
      }
    });
    function isLastModal() {
      return last(visibleModals) === node;
    }
    function closeModal() {
      if (isLastModal() && onClose) {
        onClose();
        removeNodeFromVisibleModals();
      }
    }
    function onInteractOutsideStart(e) {
      const target = e.target;
      if (!isElement(target))
        return;
      if (target && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
    function onInteractOutside(e) {
      if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
      }
    }
    unsubInteractOutside = useInteractOutside(node, {
      onInteractOutsideStart,
      onInteractOutside: closeOnInteractOutside ? onInteractOutside : void 0,
      enabled: open
    }).destroy;
  }
  update(config);
  return {
    update,
    destroy() {
      removeNodeFromVisibleModals();
      unsubInteractOutside();
    }
  };
};
const usePortal = (el, target = "body") => {
  let targetEl;
  if (!isHTMLElement(target) && typeof target !== "string") {
    return {
      destroy: noop
    };
  }
  async function update(newTarget) {
    target = newTarget;
    if (typeof target === "string") {
      targetEl = document.querySelector(target);
      if (targetEl === null) {
        await tick();
        targetEl = document.querySelector(target);
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target;
    } else {
      throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
    }
    el.dataset.portal = "";
    targetEl.appendChild(el);
    el.hidden = false;
  }
  function destroy() {
    el.remove();
  }
  update(target);
  return {
    update,
    destroy
  };
};
const useInteractOutside = (node, config) => {
  let unsub = noop;
  let unsubClick = noop;
  let isPointerDown = false;
  let isPointerDownInside = false;
  let ignoreEmulatedMouseEvents = false;
  function update(config2) {
    unsub();
    unsubClick();
    const { onInteractOutside, onInteractOutsideStart, enabled } = config2;
    if (!enabled)
      return;
    function onPointerDown(e) {
      if (onInteractOutside && isValidEvent(e, node)) {
        onInteractOutsideStart?.(e);
      }
      const target = e.target;
      if (isElement(target) && isOrContainsTarget(node, target)) {
        isPointerDownInside = true;
      }
      isPointerDown = true;
    }
    function triggerInteractOutside(e) {
      onInteractOutside?.(e);
    }
    const documentObj = getOwnerDocument(node);
    if (typeof PointerEvent !== "undefined") {
      const onPointerUp = (e) => {
        unsubClick();
        const handler = (e2) => {
          if (shouldTriggerInteractOutside(e2)) {
            triggerInteractOutside(e2);
          }
          resetPointerState();
        };
        if (e.pointerType === "touch") {
          unsubClick = addEventListener(documentObj, "click", handler, {
            capture: true,
            once: true
          });
          return;
        }
        handler(e);
      };
      unsub = executeCallbacks(addEventListener(documentObj, "pointerdown", onPointerDown, true), addEventListener(documentObj, "pointerup", onPointerUp, true));
    } else {
      const onMouseUp = (e) => {
        if (ignoreEmulatedMouseEvents) {
          ignoreEmulatedMouseEvents = false;
        } else if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      const onTouchEnd = (e) => {
        ignoreEmulatedMouseEvents = true;
        if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      unsub = executeCallbacks(addEventListener(documentObj, "mousedown", onPointerDown, true), addEventListener(documentObj, "mouseup", onMouseUp, true), addEventListener(documentObj, "touchstart", onPointerDown, true), addEventListener(documentObj, "touchend", onTouchEnd, true));
    }
  }
  function shouldTriggerInteractOutside(e) {
    if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
      return true;
    }
    return false;
  }
  function resetPointerState() {
    isPointerDown = false;
    isPointerDownInside = false;
  }
  update(config);
  return {
    update,
    destroy() {
      unsub();
      unsubClick();
    }
  };
};
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0)
    return false;
  const target = e.target;
  if (!isElement(target))
    return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
    return false;
  }
  return node && !isOrContainsTarget(node, target);
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
({
  prefix: "",
  disabled: readable(false),
  required: readable(false),
  name: readable(void 0)
});
const defaults$1 = {
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  preventDeselect: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  weekStartsOn: 0,
  fixedWeeks: false,
  calendarLabel: "Event Date",
  locale: "en",
  minValue: void 0,
  maxValue: void 0,
  disabled: false,
  readonly: false,
  weekdayFormat: "narrow"
};
({
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  positioning: {
    placement: "bottom"
  },
  closeOnEscape: true,
  closeOnOutsideClick: true,
  onOutsideClick: void 0,
  preventScroll: false,
  forceVisible: false,
  locale: "en",
  granularity: void 0,
  disabled: false,
  readonly: false,
  minValue: void 0,
  maxValue: void 0,
  weekdayFormat: "narrow",
  ...omit(defaults$1, "isDateDisabled", "isDateUnavailable", "value", "locale", "disabled", "readonly", "minValue", "maxValue", "weekdayFormat")
});
const { name } = createElHelpers("dialog");
const defaults = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "ids"));
  const { preventScroll, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement(el) || !isHTMLElement(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: closeFocus.get(),
      defaultEl: activeTrigger.get()
    });
  }
  const trigger = makeElement(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name("overlay"), {
    stores: [isVisible, open],
    returned: ([$isVisible, $open]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title, open],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
      return {
        id: $contentId,
        role: role.get(),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $open ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop;
      let deactivate = noop;
      const destroy = executeCallbacks(effect([open, closeOnOutsideClick, closeOnEscape], ([$open, $closeOnOutsideClick, $closeOnEscape]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: $closeOnEscape,
          clickOutsideDeactivates: $closeOnOutsideClick,
          allowOutsideClick: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useModal(node, {
          open: $open,
          closeOnInteractOutside: $closeOnOutsideClick,
          onClose() {
            handleClose();
          },
          shouldCloseOnInteractOutside(e) {
            onOutsideClick.get()?.(e);
            if (e.defaultPrevented)
              return false;
            return true;
          }
        }).destroy;
      }), effect([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop;
        return useEscapeKeydown(node, { handler: handleClose }).destroy;
      }), effect([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = makeElement(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": portalAttr($portal)
    }),
    action: (node) => {
      const unsubPortal = effect([portal], ([$portal]) => {
        if ($portal === null)
          return noop;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop;
        return usePortal(node, portalDestination).destroy;
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = makeElement(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = makeElement(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = makeElement(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, preventScroll], ([$open, $preventScroll]) => {
    if (!isBrowser)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(ids.content.get());
      handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
    }
    return () => {
      if (!forceVisible.get()) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined(props), role: "dialog", forceVisible: true }),
    getAttrs
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater(dialog.options)
  };
}
function getCtx() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
function Dialog($$payload, $$props) {
  push();
  var $$store_subs;
  let preventScroll = fallback($$props["preventScroll"], () => void 0, true);
  let closeOnEscape = fallback($$props["closeOnEscape"], () => void 0, true);
  let closeOnOutsideClick = fallback($$props["closeOnOutsideClick"], () => void 0, true);
  let portal = fallback($$props["portal"], () => void 0, true);
  let open = fallback($$props["open"], () => void 0, true);
  let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
  let openFocus = fallback($$props["openFocus"], () => void 0, true);
  let closeFocus = fallback($$props["closeFocus"], () => void 0, true);
  let onOutsideClick = fallback($$props["onOutsideClick"], () => void 0, true);
  const {
    states: { open: localOpen },
    updateOption,
    ids
  } = setCtx({
    closeOnEscape,
    preventScroll,
    closeOnOutsideClick,
    portal,
    forceVisible: true,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  }));
  open !== void 0 && localOpen.set(open);
  updateOption("preventScroll", preventScroll);
  updateOption("closeOnEscape", closeOnEscape);
  updateOption("closeOnOutsideClick", closeOnOutsideClick);
  updateOption("portal", portal);
  updateOption("openFocus", openFocus);
  updateOption("closeFocus", closeFocus);
  updateOption("onOutsideClick", onOutsideClick);
  $$payload.out += `<!---->`;
  slot(
    $$payload,
    $$props,
    "default",
    {
      ids: store_get($$store_subs ??= {}, "$idValues", idValues)
    },
    null
  );
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    preventScroll,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    open,
    onOpenChange,
    openFocus,
    closeFocus,
    onOutsideClick
  });
  pop();
}
function Dialog_title($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["level", "asChild", "id", "el"]);
  push();
  var $$store_subs;
  let builder;
  let level = fallback($$props["level"], "h2");
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { title }, ids, getAttrs } = getCtx();
  const attrs = getAttrs("title");
  if (id) {
    ids.title.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$title", title);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    element(
      $$payload,
      level,
      () => {
        $$payload.out += `${spread_attributes({ ...builder, ...$$restProps })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", { builder }, null);
        $$payload.out += `<!---->`;
      }
    );
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { level, asChild, id, el });
  pop();
}
function Dialog_close($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { close }, getAttrs } = getCtx();
  const attrs = getAttrs("close");
  builder = store_get($$store_subs ??= {}, "$close", close);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_portal($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { portalled }, getAttrs } = getCtx();
  const attrs = getAttrs("portal");
  builder = store_get($$store_subs ??= {}, "$portalled", portalled);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = fallback($$props["transition"], () => void 0, true);
  let transitionConfig = fallback($$props["transitionConfig"], () => void 0, true);
  let inTransition = fallback($$props["inTransition"], () => void 0, true);
  let inTransitionConfig = fallback($$props["inTransitionConfig"], () => void 0, true);
  let outTransition = fallback($$props["outTransition"], () => void 0, true);
  let outTransitionConfig = fallback($$props["outTransitionConfig"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { content },
    states: { open },
    ids,
    getAttrs
  } = getCtx();
  const attrs = getAttrs("content");
  if (id) {
    ids.content.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$content", content);
  Object.assign(builder, attrs);
  if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
      slot($$payload, $$props, "default", { builder }, null);
      $$payload.out += `<!----></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
        slot($$payload, $$props, "default", { builder }, null);
        $$payload.out += `<!----></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
          slot($$payload, $$props, "default", { builder }, null);
          $$payload.out += `<!----></div>`;
        } else {
          $$payload.out += "<!--[!-->";
          if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
            slot($$payload, $$props, "default", { builder }, null);
            $$payload.out += `<!----></div>`;
          } else {
            $$payload.out += "<!--[!-->";
            if (store_get($$store_subs ??= {}, "$open", open)) {
              $$payload.out += "<!--[-->";
              $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
              slot($$payload, $$props, "default", { builder }, null);
              $$payload.out += `<!----></div>`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]-->`;
          }
          $$payload.out += `<!--]-->`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    id,
    el
  });
  pop();
}
function Dialog_overlay($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = fallback($$props["transition"], () => void 0, true);
  let transitionConfig = fallback($$props["transitionConfig"], () => void 0, true);
  let inTransition = fallback($$props["inTransition"], () => void 0, true);
  let inTransitionConfig = fallback($$props["inTransitionConfig"], () => void 0, true);
  let outTransition = fallback($$props["outTransition"], () => void 0, true);
  let outTransitionConfig = fallback($$props["outTransitionConfig"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { overlay },
    states: { open },
    getAttrs
  } = getCtx();
  const attrs = getAttrs("overlay");
  builder = store_get($$store_subs ??= {}, "$overlay", overlay);
  Object.assign(builder, attrs);
  if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
        } else {
          $$payload.out += "<!--[!-->";
          if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
          } else {
            $$payload.out += "<!--[!-->";
            if (store_get($$store_subs ??= {}, "$open", open)) {
              $$payload.out += "<!--[-->";
              $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]-->`;
          }
          $$payload.out += `<!--]-->`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    el
  });
  pop();
}
function Dialog_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { trigger }, getAttrs } = getCtx();
  const attrs = getAttrs("trigger");
  builder = store_get($$store_subs ??= {}, "$trigger", trigger);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_description($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "id", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { description }, ids, getAttrs } = getCtx();
  const attrs = getAttrs("description");
  if (id) {
    ids.description.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$description", description);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, id, el });
  pop();
}
function UsersTab($$payload, $$props) {
  push();
  var $$store_subs;
  if (store_get($$store_subs ??= {}, "$errors", errors).users) {
    $$payload.out += "<!--[-->";
    Alert($$payload, {
      color: "red",
      class: "mb-4",
      children: ($$payload2) => {
        $$payload2.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).users)}`;
      },
      $$slots: { default: true }
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$loading", loading).users) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center py-8">`;
    Spinner($$payload, { size: "8" });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (store_get($$store_subs ??= {}, "$users", users).length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-gray-600">No users found.</p>`;
    } else {
      $$payload.out += "<!--[!-->";
      Table($$payload, {
        children: ($$payload2) => {
          TableHead($$payload2, {
            children: ($$payload3) => {
              TableHeadCell($$payload3, {
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Name`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              TableHeadCell($$payload3, {
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Email`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              TableHeadCell($$payload3, {
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Type`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              TableHeadCell($$payload3, {
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Created At`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----> `;
              TableHeadCell($$payload3, {
                children: ($$payload4) => {
                  $$payload4.out += `<!---->Actions`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload2.out += `<!----> `;
          TableBody($$payload2, {
            children: ($$payload3) => {
              const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$users", users));
              $$payload3.out += `<!--[-->`;
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let user = each_array[$$index];
                TableBodyRow($$payload3, {
                  children: ($$payload4) => {
                    TableBodyCell($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(user.name)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----> `;
                    TableBodyCell($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(user.email)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----> `;
                    TableBodyCell($$payload4, {
                      children: ($$payload5) => {
                        Badge($$payload5, {
                          color: user.type === "admin" ? "red" : "blue",
                          children: ($$payload6) => {
                            $$payload6.out += `<!---->${escape_html(user.type)}`;
                          },
                          $$slots: { default: true }
                        });
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----> `;
                    TableBodyCell($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(formatDate(user.createdAt, true))}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----> `;
                    TableBodyCell($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->`;
                        Dialog($$payload5, {
                          children: ($$payload6) => {
                            $$payload6.out += `<!---->`;
                            Dialog_trigger($$payload6, {
                              class: "btn",
                              children: ($$payload7) => {
                                Button($$payload7, {
                                  children: ($$payload8) => {
                                    $$payload8.out += `<!---->View Details`;
                                  },
                                  $$slots: { default: true }
                                });
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> <!---->`;
                            Dialog_portal($$payload6, {
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->`;
                                Dialog_overlay($$payload7, {
                                  transitionConfig: { duration: 150 },
                                  class: "fixed inset-0 z-50 bg-black/80"
                                });
                                $$payload7.out += `<!----> <!---->`;
                                Dialog_content($$payload7, {
                                  class: "fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full",
                                  children: ($$payload8) => {
                                    $$payload8.out += `<!---->`;
                                    Dialog_title($$payload8, {
                                      children: ($$payload9) => {
                                        $$payload9.out += `<h3 class="text-xl font-semibold mb-5">User Details</h3>`;
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$payload8.out += `<!----> <!---->`;
                                    Dialog_description($$payload8, {
                                      class: "text-sm text-foreground-alt",
                                      children: ($$payload9) => {
                                        {
                                          $$payload9.out += "<!--[!-->";
                                        }
                                        $$payload9.out += `<!--]-->`;
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$payload8.out += `<!----> <div class="flex w-full justify-between mt-10"><!---->`;
                                    Dialog_close($$payload8, {
                                      children: ($$payload9) => {
                                        Button($$payload9, {
                                          children: ($$payload10) => {
                                            $$payload10.out += `<!---->Close`;
                                          },
                                          $$slots: { default: true }
                                        });
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$payload8.out += `<!----></div>`;
                                  },
                                  $$slots: { default: true }
                                });
                                $$payload7.out += `<!---->`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!---->`;
                          },
                          $$slots: { default: true }
                        });
                        $$payload5.out += `<!---->`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!---->`;
                  },
                  $$slots: { default: true }
                });
              }
              $$payload3.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function SubscriptionTypesTab($$payload, $$props) {
  push();
  var $$store_subs;
  let showDialog = false;
  let formData = { name: "", duration: "", amount: 0 };
  let processing = false;
  const durations = [
    { value: "1_day", label: "1 Day" },
    { value: "7_days", label: "7 Days" },
    { value: "30_days", label: "30 Days" }
  ];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$errors", errors).subscriptionTypes) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mb-4",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).subscriptionTypes)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <div class="flex justify-end mb-4"><!---->`;
    Dialog($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Dialog_trigger($$payload3, {
          children: ($$payload4) => {
            Button($$payload4, {
              color: "blue",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Create Subscription Type`;
              },
              $$slots: { default: true }
            });
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Dialog_portal($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Dialog_overlay($$payload4, {
              transitionConfig: { duration: 150 },
              class: "fixed inset-0 z-50 bg-black/80"
            });
            $$payload4.out += `<!----> <!---->`;
            Dialog_content($$payload4, {
              class: "fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full",
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Dialog_description($$payload5, {
                  class: "text-sm text-foreground-alt",
                  children: ($$payload6) => {
                    $$payload6.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500">${escape_html("Create")} Subscription Type</h3></div> <div class="space-y-4"><div>`;
                    Label($$payload6, {
                      for: "name",
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->Name`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> `;
                    Input($$payload6, {
                      id: "name",
                      placeholder: "Enter subscription name",
                      get value() {
                        return formData.name;
                      },
                      set value($$value) {
                        formData.name = $$value;
                        $$settled = false;
                      }
                    });
                    $$payload6.out += `<!----></div> <div>`;
                    Label($$payload6, {
                      for: "duration",
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->Duration`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> `;
                    Select($$payload6, {
                      id: "duration",
                      get value() {
                        return formData.duration;
                      },
                      set value($$value) {
                        formData.duration = $$value;
                        $$settled = false;
                      },
                      children: ($$payload7) => {
                        const each_array = ensure_array_like(durations);
                        $$payload7.out += `<option value="">Select duration</option> <!--[-->`;
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let { value, label } = each_array[$$index];
                          $$payload7.out += `<option${attr("value", value)}>${escape_html(label)}</option>`;
                        }
                        $$payload7.out += `<!--]-->`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----></div> <div>`;
                    Label($$payload6, {
                      for: "amount",
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->Amount (₱)`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> `;
                    Input($$payload6, {
                      id: "amount",
                      type: "number",
                      min: "0",
                      step: "1",
                      placeholder: "Enter amount",
                      get value() {
                        return formData.amount;
                      },
                      set value($$value) {
                        formData.amount = $$value;
                        $$settled = false;
                      }
                    });
                    $$payload6.out += `<!----></div></div> <div class="flex justify-end gap-4 mt-6"><!---->`;
                    Dialog_close($$payload6, {
                      children: ($$payload7) => {
                        Button($$payload7, {
                          color: "alternative",
                          disabled: processing,
                          children: ($$payload8) => {
                            $$payload8.out += `<!---->Cancel`;
                          },
                          $$slots: { default: true }
                        });
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> <!---->`;
                    Dialog_close($$payload6, {
                      children: ($$payload7) => {
                        Button($$payload7, {
                          color: "blue",
                          disabled: !formData.name || !formData.duration || formData.amount <= 0 || processing,
                          children: ($$payload8) => {
                            $$payload8.out += `<!---->${escape_html("Create")}`;
                          },
                          $$slots: { default: true }
                        });
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----></div>`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> `;
    if (store_get($$store_subs ??= {}, "$loading", loading).subscriptionTypes) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center py-8">`;
      Spinner($$payload2, { size: "8" });
      $$payload2.out += `<!----></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      if (store_get($$store_subs ??= {}, "$subscriptionTypes", subscriptionTypes).length === 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<p class="text-gray-600">No subscription types found.</p>`;
      } else {
        $$payload2.out += "<!--[!-->";
        Table($$payload2, {
          children: ($$payload3) => {
            TableHead($$payload3, {
              children: ($$payload4) => {
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Name`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Duration`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Amount`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Created At`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Actions`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> `;
            TableBody($$payload3, {
              children: ($$payload4) => {
                const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$subscriptionTypes", subscriptionTypes));
                $$payload4.out += `<!--[-->`;
                for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
                  let type = each_array_1[$$index_2];
                  TableBodyRow($$payload4, {
                    children: ($$payload5) => {
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(type.name)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Badge($$payload6, {
                            color: type.duration === "1_day" ? "blue" : type.duration === "7_days" ? "yellow" : "red",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->${escape_html(type.duration.replace("_", " "))}`;
                            },
                            $$slots: { default: true }
                          });
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->₱${escape_html(type.amount)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(formatDate(type.createdAt, true))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<div class="flex space-x-2"><!---->`;
                          Dialog($$payload6, {
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->`;
                              Dialog_trigger($$payload7, {
                                children: ($$payload8) => {
                                  Button($$payload8, {
                                    size: "xs",
                                    children: ($$payload9) => {
                                      $$payload9.out += `<!---->Edit`;
                                    },
                                    $$slots: { default: true }
                                  });
                                },
                                $$slots: { default: true }
                              });
                              $$payload7.out += `<!----> <!---->`;
                              Dialog_portal($$payload7, {
                                children: ($$payload8) => {
                                  $$payload8.out += `<!---->`;
                                  Dialog_overlay($$payload8, {
                                    transitionConfig: { duration: 150 },
                                    class: "fixed inset-0 z-50 bg-black/80"
                                  });
                                  $$payload8.out += `<!----> <!---->`;
                                  Dialog_content($$payload8, {
                                    class: "fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full",
                                    children: ($$payload9) => {
                                      $$payload9.out += `<!---->`;
                                      Dialog_description($$payload9, {
                                        class: "text-sm text-foreground-alt",
                                        children: ($$payload10) => {
                                          $$payload10.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500">${escape_html("Create")} Subscription Type</h3></div> <div class="space-y-4"><div>`;
                                          Label($$payload10, {
                                            for: "name",
                                            children: ($$payload11) => {
                                              $$payload11.out += `<!---->Name`;
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----> `;
                                          Input($$payload10, {
                                            id: "name",
                                            placeholder: "Enter subscription name",
                                            get value() {
                                              return formData.name;
                                            },
                                            set value($$value) {
                                              formData.name = $$value;
                                              $$settled = false;
                                            }
                                          });
                                          $$payload10.out += `<!----></div> <div>`;
                                          Label($$payload10, {
                                            for: "duration",
                                            children: ($$payload11) => {
                                              $$payload11.out += `<!---->Duration`;
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----> `;
                                          Select($$payload10, {
                                            id: "duration",
                                            get value() {
                                              return formData.duration;
                                            },
                                            set value($$value) {
                                              formData.duration = $$value;
                                              $$settled = false;
                                            },
                                            children: ($$payload11) => {
                                              const each_array_2 = ensure_array_like(durations);
                                              $$payload11.out += `<option value="">Select duration</option> <!--[-->`;
                                              for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                                                let { value, label } = each_array_2[$$index_1];
                                                $$payload11.out += `<option${attr("value", value)}>${escape_html(label)}</option>`;
                                              }
                                              $$payload11.out += `<!--]-->`;
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----></div> <div>`;
                                          Label($$payload10, {
                                            for: "amount",
                                            children: ($$payload11) => {
                                              $$payload11.out += `<!---->Amount (₱)`;
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----> `;
                                          Input($$payload10, {
                                            id: "amount",
                                            type: "number",
                                            min: "0",
                                            step: "1",
                                            placeholder: "Enter amount",
                                            get value() {
                                              return formData.amount;
                                            },
                                            set value($$value) {
                                              formData.amount = $$value;
                                              $$settled = false;
                                            }
                                          });
                                          $$payload10.out += `<!----></div></div> <div class="flex justify-end gap-4 mt-6"><!---->`;
                                          Dialog_close($$payload10, {
                                            children: ($$payload11) => {
                                              Button($$payload11, {
                                                color: "alternative",
                                                disabled: processing,
                                                children: ($$payload12) => {
                                                  $$payload12.out += `<!---->Cancel`;
                                                },
                                                $$slots: { default: true }
                                              });
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----> <!---->`;
                                          Dialog_close($$payload10, {
                                            children: ($$payload11) => {
                                              Button($$payload11, {
                                                color: "blue",
                                                disabled: !formData.name || !formData.duration || formData.amount <= 0 || processing,
                                                children: ($$payload12) => {
                                                  $$payload12.out += `<!---->${escape_html("Create")}`;
                                                },
                                                $$slots: { default: true }
                                              });
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$payload10.out += `<!----></div>`;
                                        },
                                        $$slots: { default: true }
                                      });
                                      $$payload9.out += `<!---->`;
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$payload8.out += `<!---->`;
                                },
                                $$slots: { default: true }
                              });
                              $$payload7.out += `<!---->`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload6.out += `<!----> `;
                          Button($$payload6, {
                            size: "xs",
                            color: "red",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->Delete`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload6.out += `<!----></div>`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  });
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--> `;
    Modal($$payload2, {
      size: "md",
      autoclose: true,
      get open() {
        return showDialog;
      },
      set open($$value) {
        showDialog = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function AdminDashboard($$payload, $$props) {
  push();
  var $$store_subs;
  let { userData } = $$props;
  $$payload.out += `<div class="min-h-screen bg-gray-50"><header class="bg-white shadow-sm"><div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center"><h1 class="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1> <div class="flex flex-row items-center space-x-4"><div class="flex items-center space-x-3"><span class="text-lg font-semibold text-gray-700">${escape_html(userData.name)}</span> `;
  Badge($$payload, {
    color: "red",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Admin`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div> `;
  Button($$payload, {
    href: "/profile",
    color: "light",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Profile`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    href: "/logout",
    color: "light",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Sign out`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></div></header> <main class="container mx-auto px-4 py-8"><div class="space-y-6">`;
  if (store_get($$store_subs ??= {}, "$errors", errors).stats) {
    $$payload.out += "<!--[-->";
    Alert($$payload, {
      color: "red",
      children: ($$payload2) => {
        $$payload2.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).stats)} `;
        Button($$payload2, {
          color: "red",
          class: "ml-4",
          children: ($$payload3) => {
            $$payload3.out += `<!---->Retry`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="grid grid-cols-1 md:grid-cols-4 gap-4">`;
  StatsCard($$payload, {
    title: "Total Lockers",
    value: store_get($$store_subs ??= {}, "$stats", stats).totalLockers,
    loading: store_get($$store_subs ??= {}, "$loading", loading).stats
  });
  $$payload.out += `<!----> `;
  StatsCard($$payload, {
    title: "Occupied Lockers",
    value: store_get($$store_subs ??= {}, "$stats", stats).occupiedLockers,
    loading: store_get($$store_subs ??= {}, "$loading", loading).stats
  });
  $$payload.out += `<!----> `;
  StatsCard($$payload, {
    title: "Total Users",
    value: store_get($$store_subs ??= {}, "$stats", stats).totalUsers,
    loading: store_get($$store_subs ??= {}, "$loading", loading).stats
  });
  $$payload.out += `<!----> `;
  StatsCard($$payload, {
    title: "Pending Requests",
    value: store_get($$store_subs ??= {}, "$stats", stats).pendingRequests,
    loading: store_get($$store_subs ??= {}, "$loading", loading).stats
  });
  $$payload.out += `<!----></div> `;
  Tabs($$payload, {
    style: "underline",
    children: ($$payload2) => {
      TabItem($$payload2, {
        open: true,
        title: "Requests",
        activeClasses: "text-blue-600 border-blue-600",
        children: ($$payload3) => {
          RequestsTab($$payload3);
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      TabItem($$payload2, {
        title: "Lockers",
        activeClasses: "",
        children: ($$payload3) => {
          LockersTab($$payload3);
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      TabItem($$payload2, {
        title: "Users",
        activeClasses: "",
        children: ($$payload3) => {
          UsersTab($$payload3);
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      TabItem($$payload2, {
        title: "Subscription Types",
        activeClasses: "",
        children: ($$payload3) => {
          SubscriptionTypesTab($$payload3);
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function UserDashboard($$payload, $$props) {
  push();
  let { userData } = $$props;
  let otpMap = {};
  let lockerData = {
    subscriptionsCount: 0,
    requestsCount: 0,
    subscriptions: [],
    requests: []
  };
  let accessHistory = [];
  $$payload.out += `<div class="min-h-screen bg-gray-50"><header class="bg-white shadow-sm"><div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center"><h1 class="text-2xl font-extrabold text-gray-900">Dashboard</h1> <div class="flex flex-row items-center space-x-4"><div class="flex items-center space-x-3"><span class="text-lg font-semibold text-gray-700">${escape_html(userData.name)}</span></div> `;
  Button($$payload, {
    href: "/profile",
    color: "light",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Profile`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    color: "light",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Sign out`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></div></header> <main class="container mx-auto px-4 py-8"><div class="space-y-6">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  Tabs($$payload, {
    style: "underline",
    children: ($$payload2) => {
      TabItem($$payload2, {
        open: true,
        title: "My Lockers",
        children: ($$payload3) => {
          $$payload3.out += `<div class="w-full flex flex-col"><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold text-gray-900">Active Lockers</h2> `;
          Button($$payload3, {
            href: "/lockers",
            color: "blue",
            children: ($$payload4) => {
              $$payload4.out += `<!---->Rent a Locker`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----></div> `;
          {
            $$payload3.out += "<!--[!-->";
            if (!lockerData.subscriptions || lockerData.subscriptions.length === 0) {
              $$payload3.out += "<!--[-->";
              $$payload3.out += `<p class="text-gray-600">You don't have any active locker subscriptions.</p>`;
            } else {
              $$payload3.out += "<!--[!-->";
              const each_array = ensure_array_like(lockerData.subscriptions);
              $$payload3.out += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`;
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let subscription = each_array[$$index];
                $$payload3.out += `<div class="bg-white shadow-md rounded-lg p-4"><div class="flex flex-col space-y-4"><div class="flex justify-between items-start"><div><h3 class="text-lg font-semibold">Locker #${escape_html(subscription.lockerNumber)}</h3> <p class="text-sm text-gray-600">Size: ${escape_html(subscription.lockerSize)}</p> <p class="text-sm text-gray-600">Valid until: ${escape_html(formatDate(subscription.expiresAt, true))}</p></div> `;
                Badge($$payload3, {
                  color: subscription.status === "active" ? "green" : "red",
                  children: ($$payload4) => {
                    $$payload4.out += `<!---->${escape_html(subscription.status)}`;
                  },
                  $$slots: { default: true }
                });
                $$payload3.out += `<!----></div> `;
                if (subscription.status === "active") {
                  $$payload3.out += "<!--[-->";
                  $$payload3.out += `<div class="flex flex-col space-y-2">`;
                  if (otpMap[subscription.lockerId] && true) {
                    $$payload3.out += "<!--[-->";
                    Alert($$payload3, {
                      color: "green",
                      children: ($$payload4) => {
                        $$payload4.out += `<span class="text-lg">OTP: <span class="font-bold tracking-widest">${escape_html(otpMap[subscription.lockerId].otp)}</span></span> <p class="text-sm">Expires at: ${escape_html(formatDate(otpMap[subscription.lockerId].expiryDate, true))}</p>`;
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$payload3.out += "<!--[!-->";
                  }
                  $$payload3.out += `<!--]--> `;
                  Button($$payload3, {
                    size: "sm",
                    children: ($$payload4) => {
                      {
                        $$payload4.out += "<!--[!-->";
                        $$payload4.out += `Generate OTP`;
                      }
                      $$payload4.out += `<!--]-->`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload3.out += `<!----></div>`;
                } else {
                  $$payload3.out += "<!--[!-->";
                }
                $$payload3.out += `<!--]--></div></div>`;
              }
              $$payload3.out += `<!--]--></div>`;
            }
            $$payload3.out += `<!--]-->`;
          }
          $$payload3.out += `<!--]--></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      TabItem($$payload2, {
        title: "Requests",
        children: ($$payload3) => {
          $$payload3.out += `<div class="flex items-center gap-2 mb-4"><h2 class="text-xl font-bold text-gray-900">Requests</h2> `;
          {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--></div> `;
          {
            $$payload3.out += "<!--[!-->";
            if (!lockerData.requests || lockerData.requests.length === 0) {
              $$payload3.out += "<!--[-->";
              $$payload3.out += `<p class="text-gray-600">You don't have any pending requests.</p>`;
            } else {
              $$payload3.out += "<!--[!-->";
              const each_array_1 = ensure_array_like(lockerData.requests);
              $$payload3.out += `<div class="space-y-4"><!--[-->`;
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let request = each_array_1[$$index_1];
                Card($$payload3, {
                  children: ($$payload4) => {
                    $$payload4.out += `<div class="flex justify-between items-center"><div><h3 class="text-lg font-semibold">Locker #${escape_html(request.lockerNumber)}</h3> <p class="text-sm text-gray-600">Size: ${escape_html(request.lockerSize)}</p> <p class="text-sm text-gray-600">Subscription: ${escape_html(request.subscriptionName)}</p> <p class="text-sm text-gray-600">Requested on: ${escape_html(formatDate(request.requestedAt, true))}</p> `;
                    if (request.status === "rejected" && request.rejectionReason) {
                      $$payload4.out += "<!--[-->";
                      $$payload4.out += `<p class="text-sm text-red-600">Reason: ${escape_html(request.rejectionReason)}</p>`;
                    } else {
                      $$payload4.out += "<!--[!-->";
                    }
                    $$payload4.out += `<!--]--></div> <div class="flex items-center space-x-4">`;
                    Badge($$payload4, {
                      color: request.status === "pending" ? "yellow" : request.status === "approved" ? "green" : "red",
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(request.status)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----> `;
                    if (request.status === "rejected") {
                      $$payload4.out += "<!--[-->";
                      Button($$payload4, {
                        size: "sm",
                        children: ($$payload5) => {
                          $$payload5.out += `<!---->Resubmit`;
                        },
                        $$slots: { default: true }
                      });
                    } else {
                      $$payload4.out += "<!--[!-->";
                    }
                    $$payload4.out += `<!--]--></div></div>`;
                  },
                  $$slots: { default: true }
                });
              }
              $$payload3.out += `<!--]--></div>`;
            }
            $$payload3.out += `<!--]-->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      TabItem($$payload2, {
        title: "Access History",
        children: ($$payload3) => {
          {
            $$payload3.out += "<!--[!-->";
            if (!accessHistory || accessHistory.length === 0) {
              $$payload3.out += "<!--[-->";
              $$payload3.out += `<p class="text-gray-600">No access history available.</p>`;
            } else {
              $$payload3.out += "<!--[!-->";
              $$payload3.out += `<div class="space-y-4">`;
              Table($$payload3, {
                children: ($$payload4) => {
                  TableHead($$payload4, {
                    children: ($$payload5) => {
                      TableHeadCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->Locker #`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableHeadCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->Access Type`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableHeadCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->OTP`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableHeadCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->Access Date-Time`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableHeadCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->Status`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!----> `;
                  TableBody($$payload4, {
                    tableBodyClass: "divide-y",
                    children: ($$payload5) => {
                      const each_array_2 = ensure_array_like(accessHistory);
                      $$payload5.out += `<!--[-->`;
                      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                        let access = each_array_2[$$index_2];
                        TableBodyRow($$payload5, {
                          children: ($$payload6) => {
                            TableBodyCell($$payload6, {
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->${escape_html(access.lockerNumber)}`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> `;
                            TableBodyCell($$payload6, {
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->${escape_html(access.accessType === "otp" ? "OTP" : "Subscription")}`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> `;
                            TableBodyCell($$payload6, {
                              children: ($$payload7) => {
                                if (access.otp) {
                                  $$payload7.out += "<!--[-->";
                                  $$payload7.out += `${escape_html(access.otp)}`;
                                } else {
                                  $$payload7.out += "<!--[!-->";
                                }
                                $$payload7.out += `<!--]-->`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> `;
                            TableBodyCell($$payload6, {
                              children: ($$payload7) => {
                                $$payload7.out += `<!---->${escape_html(formatTimestamp(access.accessedAt))}`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!----> `;
                            TableBodyCell($$payload6, {
                              children: ($$payload7) => {
                                Badge($$payload7, {
                                  color: access.status === "success" ? "green" : "red",
                                  children: ($$payload8) => {
                                    $$payload8.out += `<!---->${escape_html(access.status)}`;
                                  },
                                  $$slots: { default: true }
                                });
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!---->`;
                          },
                          $$slots: { default: true }
                        });
                      }
                      $$payload5.out += `<!--]-->`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!---->`;
                },
                $$slots: { default: true }
              });
              $$payload3.out += `<!----></div>`;
            }
            $$payload3.out += `<!--]-->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></main></div>`;
  pop();
}
function _page($$payload, $$props) {
  let data = $$props["data"];
  const { userData } = data;
  if (userData.type === "admin") {
    $$payload.out += "<!--[-->";
    AdminDashboard($$payload, { userData });
  } else {
    $$payload.out += "<!--[!-->";
    UserDashboard($$payload, { userData });
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
}
export {
  _page as default
};
