import {
  a3 as rest_props,
  a as push,
  a4 as fallback,
  a5 as element,
  a6 as bind_props,
  p as pop,
  a7 as slot,
  a8 as spread_attributes,
  a9 as sanitize_props,
  f as setContext,
  g as getContext,
  d as store_get,
  u as unsubscribe_stores,
  aa as spread_props,
  ab as clsx$1,
  ac as ensure_array_like,
  e as escape_html,
  ad as attr,
  ae as stringify,
} from "../../../chunks/index3.js";
import {
  w as withGet,
  n as noop,
  i as isHTMLElement,
  a as isFunction,
  b as isElement,
  e as executeCallbacks,
  c as addEventListener,
  o as omit,
  m as makeElement,
  s as styleToString,
  d as effect,
  f as createElHelpers,
  g as addMeltEventListener,
  u as useEscapeKeydown,
  p as portalAttr,
  h as isBrowser,
  k as kbd,
  j as buttonVariants,
} from "../../../chunks/index4.js";
import { clsx } from "clsx";
import "dequal";
import {
  w as writable,
  a as readonly,
  d as derived,
} from "../../../chunks/index5.js";
import { t as tick } from "../../../chunks/index-server.js";
import { nanoid } from "nanoid/non-secure";
import { createFocusTrap as createFocusTrap$1 } from "focus-trap";
import { twMerge } from "tailwind-merge";
function last(array) {
  return array[array.length - 1];
}
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
    set,
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
  if (!el) return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty(el, property, value) {
  if (!el) return;
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
  if (locked) return noop;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () =>
    setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle = () =>
    assignStyle(body, {
      overflow: "hidden",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`,
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
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`,
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [
    setScrollbarWidthProperty(),
    isIos() ? setIOSStyle() : setStyle(),
  ];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
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
  if (portalProp !== void 0) return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body") return document.body;
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
    if (!isHTMLElement(el)) return;
    el.focus();
  } else if (isHTMLElement(returned)) {
    returned.focus();
  }
}
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
      },
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      },
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause,
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
    const {
      open,
      onClose,
      shouldCloseOnInteractOutside,
      closeOnInteractOutside,
    } = config2;
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
      if (!isElement(target)) return;
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
      enabled: open,
    }).destroy;
  }
  update(config);
  return {
    update,
    destroy() {
      removeNodeFromVisibleModals();
      unsubInteractOutside();
    },
  };
};
const usePortal = (el, target = "body") => {
  let targetEl;
  if (!isHTMLElement(target) && typeof target !== "string") {
    return {
      destroy: noop,
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
      throw new TypeError(
        `Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`,
      );
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
    destroy,
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
    if (!enabled) return;
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
            once: true,
          });
          return;
        }
        handler(e);
      };
      unsub = executeCallbacks(
        addEventListener(documentObj, "pointerdown", onPointerDown, true),
        addEventListener(documentObj, "pointerup", onPointerUp, true),
      );
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
      unsub = executeCallbacks(
        addEventListener(documentObj, "mousedown", onPointerDown, true),
        addEventListener(documentObj, "mouseup", onMouseUp, true),
        addEventListener(documentObj, "touchstart", onPointerDown, true),
        addEventListener(documentObj, "touchend", onTouchEnd, true),
      );
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
    },
  };
};
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0) return false;
  const target = e.target;
  if (!isElement(target)) return false;
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
  onOutsideClick: void 0,
};
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "ids"));
  const {
    preventScroll,
    closeOnEscape,
    closeOnOutsideClick,
    role,
    portal,
    forceVisible,
    openFocus,
    closeFocus,
    onOutsideClick,
  } = options;
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids,
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
    if (!isHTMLElement(el) || !isHTMLElement(triggerEl)) return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: closeFocus.get(),
      defaultEl: activeTrigger.get(),
    });
  }
  const trigger = makeElement(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button",
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(
        addMeltEventListener(node, "click", (e) => {
          handleOpen(e);
        }),
        addMeltEventListener(node, "keydown", (e) => {
          if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
          e.preventDefault();
          handleOpen(e);
        }),
      );
      return {
        destroy: unsub,
      };
    },
  });
  const overlay = makeElement(name("overlay"), {
    stores: [isVisible, open],
    returned: ([$isVisible, $open]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none",
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed",
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          },
        });
        {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        },
      };
    },
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
          display: $isVisible ? void 0 : "none",
        }),
      };
    },
    action: (node) => {
      let activate = noop;
      let deactivate = noop;
      const destroy = executeCallbacks(
        effect(
          [open, closeOnOutsideClick, closeOnEscape],
          ([$open, $closeOnOutsideClick, $closeOnEscape]) => {
            if (!$open) return;
            const focusTrap = createFocusTrap({
              immediate: false,
              escapeDeactivates: $closeOnEscape,
              clickOutsideDeactivates: $closeOnOutsideClick,
              allowOutsideClick: true,
              returnFocusOnDeactivate: false,
              fallbackFocus: node,
            });
            activate = focusTrap.activate;
            deactivate = focusTrap.deactivate;
            const ac = focusTrap.useFocusTrap(node);
            if (ac && ac.destroy) {
              return ac.destroy;
            } else {
              return focusTrap.deactivate;
            }
          },
        ),
        effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
          return useModal(node, {
            open: $open,
            closeOnInteractOutside: $closeOnOutsideClick,
            onClose() {
              handleClose();
            },
            shouldCloseOnInteractOutside(e) {
              onOutsideClick.get()?.(e);
              if (e.defaultPrevented) return false;
              return true;
            },
          }).destroy;
        }),
        effect([closeOnEscape], ([$closeOnEscape]) => {
          if (!$closeOnEscape) return noop;
          return useEscapeKeydown(node, { handler: handleClose }).destroy;
        }),
        effect([isVisible], ([$isVisible]) => {
          tick().then(() => {
            if (!$isVisible) {
              deactivate();
            } else {
              activate();
            }
          });
        }),
      );
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        },
      };
    },
  });
  const portalled = makeElement(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": portalAttr($portal),
    }),
    action: (node) => {
      const unsubPortal = effect([portal], ([$portal]) => {
        if ($portal === null) return noop;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null) return noop;
        return usePortal(node, portalDestination).destroy;
      });
      return {
        destroy() {
          unsubPortal();
        },
      };
    },
  });
  const title = makeElement(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId,
    }),
  });
  const description = makeElement(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId,
    }),
  });
  const close = makeElement(name("close"), {
    returned: () => ({
      type: "button",
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          handleClose();
        }),
        addMeltEventListener(node, "keydown", (e) => {
          if (e.key !== kbd.SPACE && e.key !== kbd.ENTER) return;
          e.preventDefault();
          handleClose();
        }),
      );
      return {
        destroy: unsub,
      };
    },
  });
  effect([open, preventScroll], ([$open, $preventScroll]) => {
    if (!isBrowser) return;
    if ($preventScroll && $open) unsubScroll = removeScroll();
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
      portalled,
    },
    states: {
      open,
    },
    options,
  };
}
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: "",
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
  return function (key, value) {
    if (value === void 0) return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
function getAttrs(builders) {
  const attrs = {};
  builders.forEach((builder) => {
    Object.keys(builder).forEach((key) => {
      if (key !== "action") {
        attrs[key] = builder[key];
      }
    });
  });
  return attrs;
}
function Button$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "type",
    "builders",
    "el",
  ]);
  push();
  let href = fallback($$props["href"], () => void 0, true);
  let type = fallback($$props["type"], () => void 0, true);
  let builders = fallback($$props["builders"], () => [], true);
  let el = fallback($$props["el"], () => void 0, true);
  const attrs = { "data-button-root": "" };
  if (builders && builders.length) {
    $$payload.out += "<!--[-->";
    element(
      $$payload,
      href ? "a" : "button",
      () => {
        $$payload.out += `${spread_attributes({
          type: href ? void 0 : type,
          href,
          tabindex: "0",
          ...getAttrs(builders),
          ...$$restProps,
          ...attrs,
        })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {});
        $$payload.out += `<!---->`;
      },
    );
  } else {
    $$payload.out += "<!--[!-->";
    element(
      $$payload,
      href ? "a" : "button",
      () => {
        $$payload.out += `${spread_attributes({
          type: href ? void 0 : type,
          href,
          tabindex: "0",
          ...$$restProps,
          ...attrs,
        })}`;
      },
      () => {
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "default", {});
        $$payload.out += `<!---->`;
      },
    );
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { href, type, builders, el });
  pop();
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
    "trigger",
  ];
  return {
    NAME,
    PARTS,
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({
      ...removeUndefined(props),
      role: "dialog",
      forceVisible: true,
    }),
    getAttrs: getAttrs2,
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater(dialog.options),
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
  let closeOnOutsideClick = fallback(
    $$props["closeOnOutsideClick"],
    () => void 0,
    true,
  );
  let portal = fallback($$props["portal"], () => void 0, true);
  let open = fallback($$props["open"], () => void 0, true);
  let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
  let openFocus = fallback($$props["openFocus"], () => void 0, true);
  let closeFocus = fallback($$props["closeFocus"], () => void 0, true);
  let onOutsideClick = fallback($$props["onOutsideClick"], () => void 0, true);
  const {
    states: { open: localOpen },
    updateOption,
    ids,
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
    },
  });
  const idValues = derived(
    [ids.content, ids.description, ids.title],
    ([$contentId, $descriptionId, $titleId]) => ({
      content: $contentId,
      description: $descriptionId,
      title: $titleId,
    }),
  );
  open !== void 0 && localOpen.set(open);
  updateOption("preventScroll", preventScroll);
  updateOption("closeOnEscape", closeOnEscape);
  updateOption("closeOnOutsideClick", closeOnOutsideClick);
  updateOption("portal", portal);
  updateOption("openFocus", openFocus);
  updateOption("closeFocus", closeFocus);
  updateOption("onOutsideClick", onOutsideClick);
  $$payload.out += `<!---->`;
  slot($$payload, $$props, "default", {
    ids: store_get(($$store_subs ??= {}), "$idValues", idValues),
  });
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
    onOutsideClick,
  });
  pop();
}
function Dialog_title$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "level",
    "asChild",
    "id",
    "el",
  ]);
  push();
  var $$store_subs;
  let builder;
  let level = fallback($$props["level"], "h2");
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { title },
    ids,
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("title");
  if (id) {
    ids.title.set(id);
  }
  builder = store_get(($$store_subs ??= {}), "$title", title);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
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
        slot($$payload, $$props, "default", { builder });
        $$payload.out += `<!---->`;
      },
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
  const {
    elements: { close },
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("close");
  builder = store_get(($$store_subs ??= {}), "$close", close);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_portal$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { portalled },
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("portal");
  builder = store_get(($$store_subs ??= {}), "$portalled", portalled);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_content$1($$payload, $$props) {
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
    "el",
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = fallback($$props["transition"], () => void 0, true);
  let transitionConfig = fallback(
    $$props["transitionConfig"],
    () => void 0,
    true,
  );
  let inTransition = fallback($$props["inTransition"], () => void 0, true);
  let inTransitionConfig = fallback(
    $$props["inTransitionConfig"],
    () => void 0,
    true,
  );
  let outTransition = fallback($$props["outTransition"], () => void 0, true);
  let outTransitionConfig = fallback(
    $$props["outTransitionConfig"],
    () => void 0,
    true,
  );
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { content },
    states: { open },
    ids,
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("content");
  if (id) {
    ids.content.set(id);
  }
  builder = store_get(($$store_subs ??= {}), "$content", content);
  Object.assign(builder, attrs);
  if (asChild && store_get(($$store_subs ??= {}), "$open", open)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if (transition && store_get(($$store_subs ??= {}), "$open", open)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
      slot($$payload, $$props, "default", { builder });
      $$payload.out += `<!----></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (
        inTransition &&
        outTransition &&
        store_get(($$store_subs ??= {}), "$open", open)
      ) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
        slot($$payload, $$props, "default", { builder });
        $$payload.out += `<!----></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (inTransition && store_get(($$store_subs ??= {}), "$open", open)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
          slot($$payload, $$props, "default", { builder });
          $$payload.out += `<!----></div>`;
        } else {
          $$payload.out += "<!--[!-->";
          if (
            outTransition &&
            store_get(($$store_subs ??= {}), "$open", open)
          ) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
            slot($$payload, $$props, "default", { builder });
            $$payload.out += `<!----></div>`;
          } else {
            $$payload.out += "<!--[!-->";
            if (store_get(($$store_subs ??= {}), "$open", open)) {
              $$payload.out += "<!--[-->";
              $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
              slot($$payload, $$props, "default", { builder });
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
    el,
  });
  pop();
}
function Dialog_overlay$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el",
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = fallback($$props["transition"], () => void 0, true);
  let transitionConfig = fallback(
    $$props["transitionConfig"],
    () => void 0,
    true,
  );
  let inTransition = fallback($$props["inTransition"], () => void 0, true);
  let inTransitionConfig = fallback(
    $$props["inTransitionConfig"],
    () => void 0,
    true,
  );
  let outTransition = fallback($$props["outTransition"], () => void 0, true);
  let outTransitionConfig = fallback(
    $$props["outTransitionConfig"],
    () => void 0,
    true,
  );
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { overlay },
    states: { open },
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("overlay");
  builder = store_get(($$store_subs ??= {}), "$overlay", overlay);
  Object.assign(builder, attrs);
  if (asChild && store_get(($$store_subs ??= {}), "$open", open)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if (transition && store_get(($$store_subs ??= {}), "$open", open)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      if (
        inTransition &&
        outTransition &&
        store_get(($$store_subs ??= {}), "$open", open)
      ) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        if (inTransition && store_get(($$store_subs ??= {}), "$open", open)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
        } else {
          $$payload.out += "<!--[!-->";
          if (
            outTransition &&
            store_get(($$store_subs ??= {}), "$open", open)
          ) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
          } else {
            $$payload.out += "<!--[!-->";
            if (store_get(($$store_subs ??= {}), "$open", open)) {
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
    el,
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
  const {
    elements: { trigger },
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("trigger");
  builder = store_get(($$store_subs ??= {}), "$trigger", trigger);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_description$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "id", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { description },
    ids,
    getAttrs: getAttrs2,
  } = getCtx();
  const attrs = getAttrs2("description");
  if (id) {
    ids.description.set(id);
  }
  builder = store_get(($$store_subs ??= {}), "$description", description);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder });
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, id, el });
  pop();
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const flyAndScale = (
  node,
  params = { y: -8, x: 0, start: 0.95, duration: 150 },
) => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;
  const scaleConversion = (valueA, scaleA, scaleB) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;
    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;
    return valueB;
  };
  const styleToString2 = (style2) => {
    return Object.keys(style2).reduce((str, key) => {
      if (style2[key] === void 0) return str;
      return str + `${key}:${style2[key]};`;
    }, "");
  };
  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);
      return styleToString2({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};
function Button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "variant",
    "size",
    "builders",
  ]);
  push();
  let className = fallback($$props["class"], void 0);
  let variant = fallback($$props["variant"], "default");
  let size = fallback($$props["size"], "default");
  let builders = fallback($$props["builders"], () => [], true);
  Button$1(
    $$payload,
    spread_props([
      {
        builders,
        class: cn(buttonVariants({ variant, size, className })),
        type: "button",
      },
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true },
      },
    ]),
  );
  bind_props($$props, { class: className, variant, size, builders });
  pop();
}
function Dialog_title($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = fallback($$props["class"], void 0);
  Dialog_title$1(
    $$payload,
    spread_props([
      {
        class: cn(
          "text-lg font-semibold leading-none tracking-tight",
          className,
        ),
      },
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true },
      },
    ]),
  );
  bind_props($$props, { class: className });
  pop();
}
function Dialog_portal($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  Dialog_portal$1(
    $$payload,
    spread_props([
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true },
      },
    ]),
  );
}
function Dialog_footer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = fallback($$props["class"], void 0);
  $$payload.out += `<div${spread_attributes({
    class: clsx$1(
      cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      ),
    ),
    ...$$restProps,
  })}><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div>`;
  bind_props($$props, { class: className });
  pop();
}
function Dialog_header($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = fallback($$props["class"], void 0);
  $$payload.out += `<div${spread_attributes({
    class: clsx$1(
      cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
    ),
    ...$$restProps,
  })}><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div>`;
  bind_props($$props, { class: className });
  pop();
}
const linear = (x) => x;
function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`,
  };
}
function Dialog_overlay($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "transition",
    "transitionConfig",
  ]);
  push();
  let className = fallback($$props["class"], void 0);
  let transition = fallback($$props["transition"], fade);
  let transitionConfig = fallback(
    $$props["transitionConfig"],
    () => ({ duration: 150 }),
    true,
  );
  Dialog_overlay$1(
    $$payload,
    spread_props([
      {
        transition,
        transitionConfig,
        class: cn(
          "bg-background/80 fixed inset-0 z-50 backdrop-blur-sm",
          className,
        ),
      },
      $$restProps,
    ]),
  );
  bind_props($$props, {
    class: className,
    transition,
    transitionConfig,
  });
  pop();
}
/**
 * @license lucide-svelte v0.471.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};
function Icon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode",
  ]);
  push();
  let name2 = fallback($$props["name"], void 0);
  let color = fallback($$props["color"], "currentColor");
  let size = fallback($$props["size"], 24);
  let strokeWidth = fallback($$props["strokeWidth"], 2);
  let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
  let iconNode = fallback($$props["iconNode"], () => [], true);
  const mergeClasses = (...classes) =>
    classes
      .filter((className, index, array) => {
        return Boolean(className) && array.indexOf(className) === index;
      })
      .join(" ");
  const each_array = ensure_array_like(iconNode);
  $$payload.out += `<svg${spread_attributes(
    {
      ...defaultAttributes,
      ...$$restProps,
      width: size,
      height: size,
      stroke: color,
      "stroke-width": absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : strokeWidth,
      class: clsx$1(
        mergeClasses(
          "lucide-icon",
          "lucide",
          name2 ? `lucide-${name2}` : "",
          $$sanitized_props.class,
        ),
      ),
    },
    void 0,
    void 0,
    3,
  )}><!--[-->`;
  for (
    let $$index = 0, $$length = each_array.length;
    $$index < $$length;
    $$index++
  ) {
    let [tag, attrs] = each_array[$$index];
    element($$payload, tag, () => {
      $$payload.out += `${spread_attributes({ ...attrs }, void 0, void 0, 3)}`;
    });
  }
  $$payload.out += `<!--]--><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></svg>`;
  bind_props($$props, {
    name: name2,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode,
  });
  pop();
}
function X($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }],
  ];
  Icon(
    $$payload,
    spread_props([
      { name: "x" },
      $$sanitized_props,
      {
        iconNode,
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true },
      },
    ]),
  );
}
function Dialog_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "transition",
    "transitionConfig",
  ]);
  push();
  let className = fallback($$props["class"], void 0);
  let transition = fallback($$props["transition"], flyAndScale);
  let transitionConfig = fallback(
    $$props["transitionConfig"],
    () => ({ duration: 200 }),
    true,
  );
  Dialog_portal($$payload, {
    children: ($$payload2) => {
      Dialog_overlay($$payload2, {});
      $$payload2.out += `<!----> `;
      Dialog_content$1(
        $$payload2,
        spread_props([
          {
            transition,
            transitionConfig,
            class: cn(
              "bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg md:w-full",
              className,
            ),
          },
          $$restProps,
          {
            children: ($$payload3) => {
              $$payload3.out += `<!---->`;
              slot($$payload3, $$props, "default", {});
              $$payload3.out += `<!----> `;
              Dialog_close($$payload3, {
                class:
                  "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none",
                children: ($$payload4) => {
                  X($$payload4, { class: "h-4 w-4" });
                  $$payload4.out += `<!----> <span class="sr-only">Close</span>`;
                },
                $$slots: { default: true },
              });
              $$payload3.out += `<!---->`;
            },
            $$slots: { default: true },
          },
        ]),
      );
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true },
  });
  bind_props($$props, {
    class: className,
    transition,
    transitionConfig,
  });
  pop();
}
function Dialog_description($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = fallback($$props["class"], void 0);
  Dialog_description$1(
    $$payload,
    spread_props([
      {
        class: cn("text-muted-foreground text-sm", className),
      },
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true },
      },
    ]),
  );
  bind_props($$props, { class: className });
  pop();
}
const Root = Dialog;
const Trigger = Dialog_trigger;
function _page($$payload, $$props) {
  push();
  let lockersBySize;
  let data = $$props["data"];
  lockersBySize = data.lockers.reduce((acc, locker) => {
    if (!acc[locker.size]) {
      acc[locker.size] = [];
    }
    acc[locker.size].push(locker);
    return acc;
  }, {});
  const each_array = ensure_array_like(Object.entries(lockersBySize));
  $$payload.out += `<div class="container mx-auto p-4"><div class="grid grid-cols-3 justify-between items-center"><h1></h1> <h1 class="text-2xl font-bold grid-col-start-2 text-center">Available Lockers</h1> <a href="/dashboard" class="grid col-start-3 text-right bg-blue-500 hover:bg-blue-600 text-white w-42 justify-self-end py-2 px-4 rounded text-sm font-semibold">Back to Dashboard</a></div> <div class="grid grid-layout gap-4 mt-20 svelte-10dyean">`;
  if (data.error) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-100 text-red-700 p-4 rounded area-error">${escape_html(data.error)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let [size, sizeLockers] = each_array[index];
    const each_array_1 = ensure_array_like(sizeLockers);
    $$payload.out += `<div class="locker-group svelte-10dyean"${attr("style", `grid-area: locker-${stringify(index + 1)};`)}><h2 class="text-xl font-semibold mb-4 capitalize">${escape_html(size)} Lockers</h2> <div class="grid grid-cols-1 gap-4 gap-y-4 w-full"><!--[-->`;
    for (
      let $$index = 0, $$length2 = each_array_1.length;
      $$index < $$length2;
      $$index++
    ) {
      let locker = each_array_1[$$index];
      $$payload.out += `<div${attr("class", `border rounded-lg p-4 ${stringify(locker.isAvailable ? "bg-gray-200" : "bg-red-50")}`)}><div class="text-lg font-medium">Locker #${escape_html(locker.number)}</div> <div class="text-sm text-gray-600 mt-1">Size: ${escape_html(locker.size)}</div> <div${attr(
        "class",
        `text-sm mt-2 flex items-center justify-between ${stringify(
          [
            locker.isAvailable ? "text-green-600" : "",
            !locker.isAvailable ? "text-red-600" : "",
          ]
            .filter(Boolean)
            .join(" "),
        )}`,
      )}>`;
      if (locker.isAvailable) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Available `;
        Root($$payload, {
          children: ($$payload2) => {
            Trigger($$payload2, {
              class: buttonVariants({ variant: "default" }),
              children: ($$payload3) => {
                $$payload3.out += `<span class="text-green-600 font-semibold">RENT</span>`;
              },
              $$slots: { default: true },
            });
            $$payload2.out += `<!----> `;
            Dialog_content($$payload2, {
              class: "sm:max-w-[425px]",
              children: ($$payload3) => {
                Dialog_header($$payload3, {
                  children: ($$payload4) => {
                    Dialog_title($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->Edit profile`;
                      },
                      $$slots: { default: true },
                    });
                    $$payload4.out += `<!----> `;
                    Dialog_description($$payload4, {
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->Make changes to your profile here. Click save when you're done.`;
                      },
                      $$slots: { default: true },
                    });
                    $$payload4.out += `<!---->`;
                  },
                  $$slots: { default: true },
                });
                $$payload3.out += `<!----> <div class="grid gap-4 py-4"><div class="grid grid-cols-4 items-center gap-4"></div> <div class="grid grid-cols-4 items-center gap-4"></div></div> `;
                Dialog_footer($$payload3, {
                  children: ($$payload4) => {
                    Button($$payload4, {
                      type: "submit",
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->Save changes`;
                      },
                      $$slots: { default: true },
                    });
                  },
                  $$slots: { default: true },
                });
                $$payload3.out += `<!---->`;
              },
              $$slots: { default: true },
            });
            $$payload2.out += `<!---->`;
          },
          $$slots: { default: true },
        });
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (!locker.isAvailable) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Occupied`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  bind_props($$props, { data });
  pop();
}
export { _page as default };
