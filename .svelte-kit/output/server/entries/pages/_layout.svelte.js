import "clsx";
import { h as getContext, i as store_get, u as unsubscribe_stores, p as pop, c as push } from "../../chunks/index3.js";
import { s as setClerkContext, a as setClerkJsLoadingErrorPackageName } from "../../chunks/chunk-5JJNUDZC.js";
import "../../chunks/client.js";
import { P as PUBLIC_CLERK_PUBLISHABLE_KEY } from "../../chunks/public.js";
var deriveState = (clerkLoaded, state, initialState) => {
  if (initialState) {
    return deriveFromSsrInitialState(initialState);
  }
  return deriveFromClientSideState(state);
};
var deriveFromSsrInitialState = (initialState) => {
  const userId = initialState.userId;
  const user = initialState.user;
  const sessionId = initialState.sessionId;
  const session = initialState.session;
  const organization = initialState.organization;
  const orgId = initialState.orgId;
  const orgRole = initialState.orgRole;
  const orgPermissions = initialState.orgPermissions;
  const orgSlug = initialState.orgSlug;
  const actor = initialState.actor;
  const factorVerificationAge = initialState.factorVerificationAge;
  return {
    userId,
    user,
    sessionId,
    session,
    organization,
    orgId,
    orgRole,
    orgPermissions,
    orgSlug,
    actor,
    factorVerificationAge
  };
};
var deriveFromClientSideState = (state) => {
  var _a;
  const userId = state.user ? state.user.id : state.user;
  const user = state.user;
  const sessionId = state.session ? state.session.id : state.session;
  const session = state.session;
  const factorVerificationAge = state.session ? state.session.factorVerificationAge : null;
  const actor = session == null ? void 0 : session.actor;
  const organization = state.organization;
  const orgId = state.organization ? state.organization.id : state.organization;
  const orgSlug = organization == null ? void 0 : organization.slug;
  const membership = organization ? (_a = user == null ? void 0 : user.organizationMemberships) == null ? void 0 : _a.find((om) => om.organization.id === orgId) : organization;
  const orgPermissions = membership ? membership.permissions : membership;
  const orgRole = membership ? membership.role : membership;
  return {
    userId,
    user,
    sessionId,
    session,
    organization,
    orgId,
    orgRole,
    orgSlug,
    orgPermissions,
    actor,
    factorVerificationAge
  };
};
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function ClerkProvider($$payload, $$props) {
  push();
  var $$store_subs;
  const {
    children,
    $$slots,
    $$events,
    ...clerkInitOptions
  } = $$props;
  let clerk = null;
  let isLoaded = false;
  let resources = {
    client: {},
    session: void 0,
    user: void 0,
    organization: void 0
  };
  let auth = deriveState(isLoaded, resources, store_get($$store_subs ??= {}, "$page", page)?.data?.initialState);
  let client = resources.client;
  let session = auth.session;
  let user = auth.user;
  let organization = auth.organization;
  setClerkJsLoadingErrorPackageName("svelte-clerk");
  setClerkContext({
    get clerk() {
      return clerk;
    },
    get isLoaded() {
      return isLoaded;
    },
    get auth() {
      return auth;
    },
    get client() {
      return client;
    },
    get session() {
      return session;
    },
    get user() {
      return user;
    },
    get organization() {
      return organization;
    }
  });
  children($$payload);
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  ClerkProvider($$payload, {
    publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
    children: ($$payload2) => {
      children($$payload2);
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  pop();
}
export {
  _layout as default
};
