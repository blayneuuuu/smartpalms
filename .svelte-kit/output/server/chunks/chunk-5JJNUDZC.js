import "clsx";
import {
  g as getContext,
  f as setContext,
  p as pop,
  a as push,
} from "./index3.js";
import { o as onDestroy } from "./index-server.js";
import { b as buildErrorThrower } from "./chunk-DL452J2I.js";
const _contextKey = "$$_clerk";
const useClerkContext = () => {
  const client = getContext(_contextKey);
  if (!client) {
    throw new Error(
      "No Clerk data was found in Svelte context. Did you forget to wrap your component with ClerkProvider?",
    );
  }
  return client;
};
const setClerkContext = (context) => {
  setContext(_contextKey, context);
};
function ClerkLoaded($$payload, $$props) {
  push();
  const { children } = $$props;
  const ctx = useClerkContext();
  if (ctx.isLoaded) {
    $$payload.out += "<!--[-->";
    children($$payload, ctx.clerk);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function UserButton($$payload, $$props) {
  push();
  const { children: customMenuItems, $$slots, $$events, ...props } = $$props;
  let updatedProps = props;
  useClerkContext();
  setContext("$$_userButton", {
    addCustomMenuItem(_, item) {
      updatedProps.customMenuItems = [
        ...(updatedProps.customMenuItems || []),
        item,
      ];
    },
    addCustomPage(page) {
      updatedProps.userProfileProps = {
        ...updatedProps.userProfileProps,
        customPages: [
          ...(updatedProps.userProfileProps?.customPages || []),
          page,
        ],
      };
    },
  });
  onDestroy(() => {});
  {
    let children = function ($$payload2) {
      $$payload2.out += `<div></div>`;
    };
    ClerkLoaded($$payload, { children, $$slots: { default: true } });
  }
  $$payload.out += `<!----> `;
  customMenuItems?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function UserButtonAction($$payload, $$props) {
  push();
  getContext("$$_userButtonMenuItems");
  pop();
}
function UserButtonLink($$payload, $$props) {
  push();
  getContext("$$_userButtonMenuItems");
  pop();
}
function UserButtonMenuItems($$payload, $$props) {
  push();
  const context = getContext("$$_userButton");
  const { children } = $$props;
  setContext("$$_userButtonMenuItems", context);
  children($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function UserButtonUserProfilePage($$payload, $$props) {
  push();
  getContext("$$_userButton");
  pop();
}
Object.assign(UserButton, {
  MenuItems: UserButtonMenuItems,
  Action: UserButtonAction,
  Link: UserButtonLink,
  UserProfilePage: UserButtonUserProfilePage,
});
var errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
function setClerkJsLoadingErrorPackageName(packageName) {
  errorThrower.setPackageName({ packageName });
}
export {
  ClerkLoaded as C,
  setClerkJsLoadingErrorPackageName as a,
  setClerkContext as s,
  useClerkContext as u,
};
