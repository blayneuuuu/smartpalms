import { r as rest_props, d as push, i as fallback, s as spread_attributes, j as clsx, g as attr, b as bind_props, p as pop, l as sanitize_props, t as setContext, k as slot, h as getContext, aa as store_get, f as ensure_array_like, ab as unsubscribe_stores, e as escape_html, c as copy_payload, a as assign_payload } from "../../../chunks/index3.js";
import "clsx";
import { A as Alert, B as Button, L as Label, I as Input } from "../../../chunks/Input.js";
import { C as Card, B as Badge, M as Modal, S as Select } from "../../../chunks/Modal.js";
import { w as writable } from "../../../chunks/exports.js";
import { twMerge, twJoin } from "tailwind-merge";
import "../../../chunks/client.js";
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
function UsersTab($$payload, $$props) {
  push();
  var $$store_subs;
  let showUserDetailsDialog = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$errors", errors).users) {
      $$payload2.out += "<!--[-->";
      Alert($$payload2, {
        color: "red",
        class: "mb-4",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(store_get($$store_subs ??= {}, "$errors", errors).users)}`;
        },
        $$slots: { default: true }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (store_get($$store_subs ??= {}, "$loading", loading).users) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center py-8">`;
      Spinner($$payload2, { size: "8" });
      $$payload2.out += `<!----></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      if (store_get($$store_subs ??= {}, "$users", users).length === 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<p class="text-gray-600">No users found.</p>`;
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
                    $$payload5.out += `<!---->Email`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!----> `;
                TableHeadCell($$payload4, {
                  children: ($$payload5) => {
                    $$payload5.out += `<!---->Type`;
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
                const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$users", users));
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let user = each_array[$$index];
                  TableBodyRow($$payload4, {
                    children: ($$payload5) => {
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(user.name)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(user.email)}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Badge($$payload6, {
                            color: user.type === "admin" ? "red" : "blue",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->${escape_html(user.type)}`;
                            },
                            $$slots: { default: true }
                          });
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out += `<!---->${escape_html(formatDate(user.createdAt, true))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!----> `;
                      TableBodyCell($$payload5, {
                        children: ($$payload6) => {
                          Button($$payload6, {
                            size: "xs",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->View Details`;
                            },
                            $$slots: { default: true }
                          });
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
      get open() {
        return showUserDetailsDialog;
      },
      set open($$value) {
        showUserDetailsDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]-->`;
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
    $$payload2.out += `<!--]--> <div class="flex justify-end mb-4">`;
    Button($$payload2, {
      color: "blue",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Create Subscription Type`;
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
                const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$subscriptionTypes", subscriptionTypes));
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let type = each_array[$$index];
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
                          $$payload6.out += `<div class="flex space-x-2">`;
                          Button($$payload6, {
                            size: "xs",
                            children: ($$payload7) => {
                              $$payload7.out += `<!---->Edit`;
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
      },
      children: ($$payload3) => {
        $$payload3.out += `<div class="text-center"><h3 class="mb-5 text-lg font-normal text-gray-500">${escape_html("Create")} Subscription Type</h3></div> <div class="space-y-4"><div>`;
        Label($$payload3, {
          for: "name",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Name`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Input($$payload3, {
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
        $$payload3.out += `<!----></div> <div>`;
        Label($$payload3, {
          for: "duration",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Duration`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Select($$payload3, {
          id: "duration",
          get value() {
            return formData.duration;
          },
          set value($$value) {
            formData.duration = $$value;
            $$settled = false;
          },
          children: ($$payload4) => {
            const each_array_1 = ensure_array_like(durations);
            $$payload4.out += `<option value="">Select duration</option> <!--[-->`;
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let { value, label } = each_array_1[$$index_1];
              $$payload4.out += `<option${attr("value", value)}>${escape_html(label)}</option>`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----></div> <div>`;
        Label($$payload3, {
          for: "amount",
          children: ($$payload4) => {
            $$payload4.out += `<!---->Amount (₱)`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Input($$payload3, {
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
        $$payload3.out += `<!----></div></div> <div class="flex justify-end gap-4 mt-6">`;
        Button($$payload3, {
          color: "alternative",
          disabled: processing,
          children: ($$payload4) => {
            $$payload4.out += `<!---->Cancel`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        Button($$payload3, {
          color: "blue",
          disabled: !formData.name || !formData.duration || formData.amount <= 0 || processing,
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
                  {
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
              const each_array_2 = ensure_array_like(accessHistory);
              $$payload3.out += `<div class="space-y-4"><!--[-->`;
              for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                let access = each_array_2[$$index_2];
                Card($$payload3, {
                  children: ($$payload4) => {
                    $$payload4.out += `<div class="flex justify-between items-center"><div><h3 class="text-lg font-semibold">Locker #${escape_html(access.lockerNumber)}</h3> <p class="text-sm text-gray-600">Access Type: ${escape_html(access.accessType === "otp" ? "OTP" : "Subscription")}</p> `;
                    if (access.otp) {
                      $$payload4.out += "<!--[-->";
                      $$payload4.out += `<p class="text-sm text-gray-600">OTP: ${escape_html(access.otp)}</p>`;
                    } else {
                      $$payload4.out += "<!--[!-->";
                    }
                    $$payload4.out += `<!--]--> <p class="text-sm text-gray-600">Accessed on: ${escape_html(formatTimestamp(access.accessedAt))}</p></div> `;
                    Badge($$payload4, {
                      color: access.status === "success" ? "green" : "red",
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(access.status)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----></div>`;
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
