import { webcrypto } from "node:crypto";
import { b as buildErrorThrower, C as ClerkAPIResponseError, p as parseError } from "./chunk-DL452J2I.js";
import snakecaseKeys from "snakecase-keys";
import { parse as parse$1 } from "cookie";
import "./index.js";
import { e as envPublic } from "./public.js";
import { parse as parse$2 } from "set-cookie-parser";
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var isomorphicAtob = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") {
    return atob(data);
  } else if (typeof global !== "undefined" && global.Buffer) {
    return new global.Buffer(data, "base64").toString();
  }
  return data;
};
var isomorphicBtoa = (data) => {
  if (typeof btoa !== "undefined" && typeof btoa === "function") {
    return btoa(data);
  } else if (typeof global !== "undefined" && global.Buffer) {
    return new global.Buffer(data).toString("base64");
  }
  return data;
};
var PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
var PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
function parsePublishableKey(key, options = {}) {
  key = key || "";
  if (!key || !isPublishableKey(key)) {
    if (options.fatal && !key) {
      throw new Error(
        "Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys"
      );
    }
    if (options.fatal && !isPublishableKey(key)) {
      throw new Error("Publishable key not valid.");
    }
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
  let frontendApi = isomorphicAtob(key.split("_")[2]);
  frontendApi = frontendApi.slice(0, -1);
  if (options.proxyUrl) {
    frontendApi = options.proxyUrl;
  } else if (instanceType !== "development" && options.domain) {
    frontendApi = `clerk.${options.domain}`;
  }
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey(key) {
  key = key || "";
  const hasValidPrefix = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX);
  const hasValidFrontendApiPostfix = isomorphicAtob(key.split("_")[2] || "").endsWith("$");
  return hasValidPrefix && hasValidFrontendApiPostfix;
}
function isDevelopmentFromSecretKey(apiKey) {
  return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
async function getCookieSuffix(publishableKey, subtle = globalThis.crypto.subtle) {
  const data = new TextEncoder().encode(publishableKey);
  const digest = await subtle.digest("sha-1", data);
  const stringDigest = String.fromCharCode(...new Uint8Array(digest));
  return isomorphicBtoa(stringDigest).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
var getSuffixedCookieName = (cookieName, cookieSuffix) => {
  return `${cookieName}_${cookieSuffix}`;
};
var TokenVerificationErrorCode = {
  InvalidSecretKey: "clerk_key_invalid"
};
var TokenVerificationErrorReason = {
  TokenExpired: "token-expired",
  TokenInvalid: "token-invalid",
  TokenInvalidAlgorithm: "token-invalid-algorithm",
  TokenInvalidAuthorizedParties: "token-invalid-authorized-parties",
  TokenInvalidSignature: "token-invalid-signature",
  TokenNotActiveYet: "token-not-active-yet",
  TokenIatInTheFuture: "token-iat-in-the-future",
  TokenVerificationFailed: "token-verification-failed",
  InvalidSecretKey: "secret-key-invalid",
  LocalJWKMissing: "jwk-local-missing",
  RemoteJWKFailedToLoad: "jwk-remote-failed-to-load",
  RemoteJWKInvalid: "jwk-remote-invalid",
  RemoteJWKMissing: "jwk-remote-missing",
  JWKFailedToResolve: "jwk-failed-to-resolve",
  JWKKidMismatch: "jwk-kid-mismatch"
};
var TokenVerificationErrorAction = {
  ContactSupport: "Contact support@clerk.com",
  EnsureClerkJWT: "Make sure that this is a valid Clerk generate JWT.",
  SetClerkJWTKey: "Set the CLERK_JWT_KEY environment variable.",
  SetClerkSecretKey: "Set the CLERK_SECRET_KEY environment variable.",
  EnsureClockSync: "Make sure your system clock is in sync (e.g. turn off and on automatic time synchronization)."
};
var TokenVerificationError = class _TokenVerificationError extends Error {
  constructor({
    action,
    message,
    reason
  }) {
    super(message);
    Object.setPrototypeOf(this, _TokenVerificationError.prototype);
    this.reason = reason;
    this.message = message;
    this.action = action;
  }
  getFullMessage() {
    return `${[this.message, this.action].filter((m) => m).join(" ")} (reason=${this.reason}, token-carrier=${this.tokenCarrier})`;
  }
};
var globalFetch = fetch.bind(globalThis);
var runtime = {
  crypto: webcrypto,
  get fetch() {
    return process.env.NODE_ENV === "test" ? fetch : globalFetch;
  },
  AbortController: globalThis.AbortController,
  Blob: globalThis.Blob,
  FormData: globalThis.FormData,
  Headers: globalThis.Headers,
  Request: globalThis.Request,
  Response: globalThis.Response
};
var base64url = {
  parse(string, opts) {
    return parse(string, base64UrlEncoding, opts);
  },
  stringify(data, opts) {
    return stringify(data, base64UrlEncoding, opts);
  }
};
var base64UrlEncoding = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bits: 6
};
function parse(string, encoding, opts = {}) {
  if (!encoding.codes) {
    encoding.codes = {};
    for (let i = 0; i < encoding.chars.length; ++i) {
      encoding.codes[encoding.chars[i]] = i;
    }
  }
  if (!opts.loose && string.length * encoding.bits & 7) {
    throw new SyntaxError("Invalid padding");
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
    if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
      throw new SyntaxError("Invalid padding");
    }
  }
  const out = new (opts.out ?? Uint8Array)(end * encoding.bits / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = encoding.codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError("Invalid character " + string[i]);
    }
    buffer = buffer << encoding.bits | value;
    bits += encoding.bits;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= encoding.bits || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function stringify(data, encoding, opts = {}) {
  const { pad = true } = opts;
  const mask = (1 << encoding.bits) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | 255 & data[i];
    bits += 8;
    while (bits > encoding.bits) {
      bits -= encoding.bits;
      out += encoding.chars[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += encoding.chars[mask & buffer << encoding.bits - bits];
  }
  if (pad) {
    while (out.length * encoding.bits & 7) {
      out += "=";
    }
  }
  return out;
}
var algToHash = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512"
};
var RSA_ALGORITHM_NAME = "RSASSA-PKCS1-v1_5";
var jwksAlgToCryptoAlg = {
  RS256: RSA_ALGORITHM_NAME,
  RS384: RSA_ALGORITHM_NAME,
  RS512: RSA_ALGORITHM_NAME
};
var algs = Object.keys(algToHash);
function getCryptoAlgorithm(algorithmName) {
  const hash = algToHash[algorithmName];
  const name = jwksAlgToCryptoAlg[algorithmName];
  if (!hash || !name) {
    throw new Error(`Unsupported algorithm ${algorithmName}, expected one of ${algs.join(",")}.`);
  }
  return {
    hash: { name: algToHash[algorithmName] },
    name: jwksAlgToCryptoAlg[algorithmName]
  };
}
var isArrayString = (s2) => {
  return Array.isArray(s2) && s2.length > 0 && s2.every((a) => typeof a === "string");
};
var assertAudienceClaim = (aud, audience) => {
  const audienceList = [audience].flat().filter((a) => !!a);
  const audList = [aud].flat().filter((a) => !!a);
  const shouldVerifyAudience = audienceList.length > 0 && audList.length > 0;
  if (!shouldVerifyAudience) {
    return;
  }
  if (typeof aud === "string") {
    if (!audienceList.includes(aud)) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.EnsureClerkJWT,
        reason: TokenVerificationErrorReason.TokenVerificationFailed,
        message: `Invalid JWT audience claim (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  } else if (isArrayString(aud)) {
    if (!aud.some((a) => audienceList.includes(a))) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.EnsureClerkJWT,
        reason: TokenVerificationErrorReason.TokenVerificationFailed,
        message: `Invalid JWT audience claim array (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  }
};
var assertHeaderType = (typ) => {
  if (typeof typ === "undefined") {
    return;
  }
  if (typ !== "JWT") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalid,
      message: `Invalid JWT type ${JSON.stringify(typ)}. Expected "JWT".`
    });
  }
};
var assertHeaderAlgorithm = (alg) => {
  if (!algs.includes(alg)) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalidAlgorithm,
      message: `Invalid JWT algorithm ${JSON.stringify(alg)}. Supported: ${algs}.`
    });
  }
};
var assertSubClaim = (sub) => {
  if (typeof sub !== "string") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Subject claim (sub) is required and must be a string. Received ${JSON.stringify(sub)}.`
    });
  }
};
var assertAuthorizedPartiesClaim = (azp, authorizedParties) => {
  if (!azp || !authorizedParties || authorizedParties.length === 0) {
    return;
  }
  if (!authorizedParties.includes(azp)) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenInvalidAuthorizedParties,
      message: `Invalid JWT Authorized party claim (azp) ${JSON.stringify(azp)}. Expected "${authorizedParties}".`
    });
  }
};
var assertExpirationClaim = (exp, clockSkewInMs) => {
  if (typeof exp !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT expiry date claim (exp) ${JSON.stringify(exp)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const expiryDate = /* @__PURE__ */ new Date(0);
  expiryDate.setUTCSeconds(exp);
  const expired = expiryDate.getTime() <= currentDate.getTime() - clockSkewInMs;
  if (expired) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenExpired,
      message: `JWT is expired. Expiry date: ${expiryDate.toUTCString()}, Current date: ${currentDate.toUTCString()}.`
    });
  }
};
var assertActivationClaim = (nbf, clockSkewInMs) => {
  if (typeof nbf === "undefined") {
    return;
  }
  if (typeof nbf !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT not before date claim (nbf) ${JSON.stringify(nbf)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const notBeforeDate = /* @__PURE__ */ new Date(0);
  notBeforeDate.setUTCSeconds(nbf);
  const early = notBeforeDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (early) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenNotActiveYet,
      message: `JWT cannot be used prior to not before date claim (nbf). Not before date: ${notBeforeDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
var assertIssuedAtClaim = (iat, clockSkewInMs) => {
  if (typeof iat === "undefined") {
    return;
  }
  if (typeof iat !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT issued at date claim (iat) ${JSON.stringify(iat)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const issuedAtDate = /* @__PURE__ */ new Date(0);
  issuedAtDate.setUTCSeconds(iat);
  const postIssued = issuedAtDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (postIssued) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenIatInTheFuture,
      message: `JWT issued at date claim (iat) is in the future. Issued at date: ${issuedAtDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
function pemToBuffer(secret) {
  const trimmed = secret.replace(/-----BEGIN.*?-----/g, "").replace(/-----END.*?-----/g, "").replace(/\s/g, "");
  const decoded = isomorphicAtob(trimmed);
  const buffer = new ArrayBuffer(decoded.length);
  const bufView = new Uint8Array(buffer);
  for (let i = 0, strLen = decoded.length; i < strLen; i++) {
    bufView[i] = decoded.charCodeAt(i);
  }
  return bufView;
}
function importKey(key, algorithm, keyUsage) {
  if (typeof key === "object") {
    return runtime.crypto.subtle.importKey("jwk", key, algorithm, false, [keyUsage]);
  }
  const keyData = pemToBuffer(key);
  const format = "spki";
  return runtime.crypto.subtle.importKey(format, keyData, algorithm, false, [keyUsage]);
}
var DEFAULT_CLOCK_SKEW_IN_SECONDS = 5 * 1e3;
async function hasValidSignature(jwt, key) {
  const { header, signature, raw } = jwt;
  const encoder = new TextEncoder();
  const data = encoder.encode([raw.header, raw.payload].join("."));
  const algorithm = getCryptoAlgorithm(header.alg);
  try {
    const cryptoKey = await importKey(key, algorithm, "verify");
    const verified = await runtime.crypto.subtle.verify(algorithm.name, cryptoKey, signature, data);
    return { data: verified };
  } catch (error) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalidSignature,
          message: error?.message
        })
      ]
    };
  }
}
function decodeJwt(token) {
  const tokenParts = (token || "").toString().split(".");
  if (tokenParts.length !== 3) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalid,
          message: `Invalid JWT form. A JWT consists of three parts separated by dots.`
        })
      ]
    };
  }
  const [rawHeader, rawPayload, rawSignature] = tokenParts;
  const decoder = new TextDecoder();
  const header = JSON.parse(decoder.decode(base64url.parse(rawHeader, { loose: true })));
  const payload = JSON.parse(decoder.decode(base64url.parse(rawPayload, { loose: true })));
  const signature = base64url.parse(rawSignature, { loose: true });
  const data = {
    header,
    payload,
    signature,
    raw: {
      header: rawHeader,
      payload: rawPayload,
      signature: rawSignature,
      text: token
    }
  };
  return { data };
}
async function verifyJwt(token, options) {
  const { audience, authorizedParties, clockSkewInMs, key } = options;
  const clockSkew = clockSkewInMs || DEFAULT_CLOCK_SKEW_IN_SECONDS;
  const { data: decoded, errors } = decodeJwt(token);
  if (errors) {
    return { errors };
  }
  const { header, payload } = decoded;
  try {
    const { typ, alg } = header;
    assertHeaderType(typ);
    assertHeaderAlgorithm(alg);
    const { azp, sub, aud, iat, exp, nbf } = payload;
    assertSubClaim(sub);
    assertAudienceClaim([aud], [audience]);
    assertAuthorizedPartiesClaim(azp, authorizedParties);
    assertExpirationClaim(exp, clockSkew);
    assertActivationClaim(nbf, clockSkew);
    assertIssuedAtClaim(iat, clockSkew);
  } catch (err) {
    return { errors: [err] };
  }
  const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
  if (signatureErrors) {
    return {
      errors: [
        new TokenVerificationError({
          action: TokenVerificationErrorAction.EnsureClerkJWT,
          reason: TokenVerificationErrorReason.TokenVerificationFailed,
          message: `Error verifying JWT signature. ${signatureErrors[0]}`
        })
      ]
    };
  }
  if (!signatureValid) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalidSignature,
          message: "JWT signature is invalid."
        })
      ]
    };
  }
  return { data: payload };
}
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
var MAX_NUMBER_OF_RETRIES = 5;
async function callWithRetry(fn, attempt = 1, maxAttempts = MAX_NUMBER_OF_RETRIES) {
  try {
    return await fn();
  } catch (e) {
    if (attempt >= maxAttempts) {
      throw e;
    }
    await wait(2 ** attempt * 100);
    return callWithRetry(fn, attempt + 1, maxAttempts);
  }
}
var TYPES_TO_OBJECTS = {
  strict_mfa: {
    afterMinutes: 10,
    level: "multi_factor"
  },
  strict: {
    afterMinutes: 10,
    level: "second_factor"
  },
  moderate: {
    afterMinutes: 60,
    level: "second_factor"
  },
  lax: {
    afterMinutes: 1440,
    level: "second_factor"
  }
};
var ALLOWED_LEVELS = /* @__PURE__ */ new Set(["first_factor", "second_factor", "multi_factor"]);
var ALLOWED_TYPES = /* @__PURE__ */ new Set(["strict_mfa", "strict", "moderate", "lax"]);
var isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
var isValidLevel = (level) => ALLOWED_LEVELS.has(level);
var isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
var checkOrgAuthorization = (params, options) => {
  const { orgId, orgRole, orgPermissions } = options;
  if (!params.role && !params.permission) {
    return null;
  }
  if (!orgId || !orgRole || !orgPermissions) {
    return null;
  }
  if (params.permission) {
    return orgPermissions.includes(params.permission);
  }
  if (params.role) {
    return orgRole === params.role;
  }
  return null;
};
var validateReverificationConfig = (config) => {
  if (!config) {
    return false;
  }
  const convertConfigToObject = (config2) => {
    if (typeof config2 === "string") {
      return TYPES_TO_OBJECTS[config2];
    }
    return config2;
  };
  const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
  const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
  if (isValidStringValue || isValidObjectValue) {
    return convertConfigToObject.bind(null, config);
  }
  return false;
};
var checkStepUpAuthorization = (params, { factorVerificationAge }) => {
  if (!params.reverification || !factorVerificationAge) {
    return null;
  }
  const isValidReverification = validateReverificationConfig(params.reverification);
  if (!isValidReverification) {
    return null;
  }
  const { level, afterMinutes } = isValidReverification();
  const [factor1Age, factor2Age] = factorVerificationAge;
  const isValidFactor1 = factor1Age !== -1 ? afterMinutes > factor1Age : null;
  const isValidFactor2 = factor2Age !== -1 ? afterMinutes > factor2Age : null;
  switch (level) {
    case "first_factor":
      return isValidFactor1;
    case "second_factor":
      return factor2Age !== -1 ? isValidFactor2 : isValidFactor1;
    case "multi_factor":
      return factor2Age === -1 ? isValidFactor1 : isValidFactor1 && isValidFactor2;
  }
};
var createCheckAuthorization = (options) => {
  return (params) => {
    if (!options.userId) {
      return false;
    }
    const orgAuthorization = checkOrgAuthorization(params, options);
    const stepUpAuthorization = checkStepUpAuthorization(params, options);
    if ([orgAuthorization, stepUpAuthorization].some((a) => a === null)) {
      return [orgAuthorization, stepUpAuthorization].some((a) => a === true);
    }
    return [orgAuthorization, stepUpAuthorization].every((a) => a === true);
  };
};
function _$1(r) {
  for (var n = [], e = 0; e < r.length; ) {
    var a = r[e];
    if (a === "*" || a === "+" || a === "?") {
      n.push({
        type: "MODIFIER",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "\\") {
      n.push({
        type: "ESCAPED_CHAR",
        index: e++,
        value: r[e++]
      });
      continue;
    }
    if (a === "{") {
      n.push({
        type: "OPEN",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "}") {
      n.push({
        type: "CLOSE",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === ":") {
      for (var u = "", t = e + 1; t < r.length; ) {
        var c = r.charCodeAt(t);
        if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95) {
          u += r[t++];
          continue;
        }
        break;
      }
      if (!u) throw new TypeError("Missing parameter name at ".concat(e));
      n.push({
        type: "NAME",
        index: e,
        value: u
      }), e = t;
      continue;
    }
    if (a === "(") {
      var o = 1, m = "", t = e + 1;
      if (r[t] === "?") throw new TypeError('Pattern cannot start with "?" at '.concat(t));
      for (; t < r.length; ) {
        if (r[t] === "\\") {
          m += r[t++] + r[t++];
          continue;
        }
        if (r[t] === ")") {
          if (o--, o === 0) {
            t++;
            break;
          }
        } else if (r[t] === "(" && (o++, r[t + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(t));
        m += r[t++];
      }
      if (o) throw new TypeError("Unbalanced pattern at ".concat(e));
      if (!m) throw new TypeError("Missing pattern at ".concat(e));
      n.push({
        type: "PATTERN",
        index: e,
        value: m
      }), e = t;
      continue;
    }
    n.push({
      type: "CHAR",
      index: e,
      value: r[e++]
    });
  }
  return n.push({
    type: "END",
    index: e,
    value: ""
  }), n;
}
function F(r, n) {
  n === void 0 && (n = {});
  for (var e = _$1(r), a = n.prefixes, u = a === void 0 ? "./" : a, t = n.delimiter, c = t === void 0 ? "/#?" : t, o = [], m = 0, h = 0, p = "", f = function(l) {
    if (h < e.length && e[h].type === l) return e[h++].value;
  }, w = function(l) {
    var v = f(l);
    if (v !== void 0) return v;
    var E = e[h], N = E.type, S = E.index;
    throw new TypeError("Unexpected ".concat(N, " at ").concat(S, ", expected ").concat(l));
  }, d = function() {
    for (var l = "", v; v = f("CHAR") || f("ESCAPED_CHAR"); ) l += v;
    return l;
  }, M = function(l) {
    for (var v = 0, E = c; v < E.length; v++) {
      var N = E[v];
      if (l.indexOf(N) > -1) return true;
    }
    return false;
  }, A = function(l) {
    var v = o[o.length - 1], E = l || (v && typeof v == "string" ? v : "");
    if (v && !E)
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(v.name, '"'));
    return !E || M(E) ? "[^".concat(s(c), "]+?") : "(?:(?!".concat(s(E), ")[^").concat(s(c), "])+?");
  }; h < e.length; ) {
    var T = f("CHAR"), x = f("NAME"), C = f("PATTERN");
    if (x || C) {
      var g = T || "";
      u.indexOf(g) === -1 && (p += g, g = ""), p && (o.push(p), p = ""), o.push({
        name: x || m++,
        prefix: g,
        suffix: "",
        pattern: C || A(g),
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    var i = T || f("ESCAPED_CHAR");
    if (i) {
      p += i;
      continue;
    }
    p && (o.push(p), p = "");
    var R = f("OPEN");
    if (R) {
      var g = d(), y = f("NAME") || "", O = f("PATTERN") || "", b = d();
      w("CLOSE"), o.push({
        name: y || (O ? m++ : ""),
        pattern: y && !O ? A(g) : O,
        prefix: g,
        suffix: b,
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    w("END");
  }
  return o;
}
function H(r, n) {
  var e = [], a = P(r, e, n);
  return I(a, e, n);
}
function I(r, n, e) {
  e === void 0 && (e = {});
  var a = e.decode, u = a === void 0 ? function(t) {
    return t;
  } : a;
  return function(t) {
    var c = r.exec(t);
    if (!c) return false;
    for (var o = c[0], m = c.index, h = /* @__PURE__ */ Object.create(null), p = function(w) {
      if (c[w] === void 0) return "continue";
      var d = n[w - 1];
      d.modifier === "*" || d.modifier === "+" ? h[d.name] = c[w].split(d.prefix + d.suffix).map(function(M) {
        return u(M, d);
      }) : h[d.name] = u(c[w], d);
    }, f = 1; f < c.length; f++)
      p(f);
    return {
      path: o,
      index: m,
      params: h
    };
  };
}
function s(r) {
  return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function D(r) {
  return r && r.sensitive ? "" : "i";
}
function $(r, n) {
  if (!n) return r;
  for (var e = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, u = e.exec(r.source); u; )
    n.push({
      name: u[1] || a++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    }), u = e.exec(r.source);
  return r;
}
function W(r, n, e) {
  var a = r.map(function(u) {
    return P(u, n, e).source;
  });
  return new RegExp("(?:".concat(a.join("|"), ")"), D(e));
}
function L(r, n, e) {
  return U(F(r, e), n, e);
}
function U(r, n, e) {
  e === void 0 && (e = {});
  for (var a = e.strict, u = a === void 0 ? false : a, t = e.start, c = t === void 0 ? true : t, o = e.end, m = o === void 0 ? true : o, h = e.encode, p = h === void 0 ? function(v) {
    return v;
  } : h, f = e.delimiter, w = f === void 0 ? "/#?" : f, d = e.endsWith, M = d === void 0 ? "" : d, A = "[".concat(s(M), "]|$"), T = "[".concat(s(w), "]"), x = c ? "^" : "", C = 0, g = r; C < g.length; C++) {
    var i = g[C];
    if (typeof i == "string") x += s(p(i));
    else {
      var R = s(p(i.prefix)), y = s(p(i.suffix));
      if (i.pattern)
        if (n && n.push(i), R || y)
          if (i.modifier === "+" || i.modifier === "*") {
            var O = i.modifier === "*" ? "?" : "";
            x += "(?:".concat(R, "((?:").concat(i.pattern, ")(?:").concat(y).concat(R, "(?:").concat(i.pattern, "))*)").concat(y, ")").concat(O);
          } else x += "(?:".concat(R, "(").concat(i.pattern, ")").concat(y, ")").concat(i.modifier);
        else {
          if (i.modifier === "+" || i.modifier === "*")
            throw new TypeError('Can not repeat "'.concat(i.name, '" without a prefix and suffix'));
          x += "(".concat(i.pattern, ")").concat(i.modifier);
        }
      else x += "(?:".concat(R).concat(y, ")").concat(i.modifier);
    }
  }
  if (m) u || (x += "".concat(T, "?")), x += e.endsWith ? "(?=".concat(A, ")") : "$";
  else {
    var b = r[r.length - 1], l = typeof b == "string" ? T.indexOf(b[b.length - 1]) > -1 : b === void 0;
    u || (x += "(?:".concat(T, "(?=").concat(A, "))?")), l || (x += "(?=".concat(T, "|").concat(A, ")"));
  }
  return new RegExp(x, D(e));
}
function P(r, n, e) {
  return r instanceof RegExp ? $(r, n) : Array.isArray(r) ? W(r, n, e) : L(r, n, e);
}
function match(str, options) {
  try {
    return H(str, options);
  } catch (e) {
    throw new Error(
      `Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x
${e.message}`
    );
  }
}
var API_URL$1 = "https://api.clerk.com";
var API_VERSION$1 = "v1";
var USER_AGENT = `${"@clerk/backend"}@${"1.21.6"}`;
var MAX_CACHE_LAST_UPDATED_AT_SECONDS = 5 * 60;
var SUPPORTED_BAPI_VERSION = "2024-10-01";
var Attributes = {
  AuthToken: "__clerkAuthToken",
  AuthSignature: "__clerkAuthSignature",
  AuthStatus: "__clerkAuthStatus",
  AuthReason: "__clerkAuthReason",
  AuthMessage: "__clerkAuthMessage",
  ClerkUrl: "__clerkUrl"
};
var Cookies$1 = {
  Session: "__session",
  Refresh: "__refresh",
  ClientUat: "__client_uat",
  Handshake: "__clerk_handshake",
  DevBrowser: "__clerk_db_jwt",
  RedirectCount: "__clerk_redirect_count"
};
var QueryParameters = {
  ClerkSynced: "__clerk_synced",
  SuffixedCookies: "suffixed_cookies",
  ClerkRedirectUrl: "__clerk_redirect_url",
  // use the reference to Cookies to indicate that it's the same value
  DevBrowser: Cookies$1.DevBrowser,
  Handshake: Cookies$1.Handshake,
  HandshakeHelp: "__clerk_help",
  LegacyDevBrowser: "__dev_session",
  HandshakeReason: "__clerk_hs_reason"
};
var Headers2 = {
  AuthToken: "x-clerk-auth-token",
  AuthSignature: "x-clerk-auth-signature",
  AuthStatus: "x-clerk-auth-status",
  AuthReason: "x-clerk-auth-reason",
  AuthMessage: "x-clerk-auth-message",
  ClerkUrl: "x-clerk-clerk-url",
  EnableDebug: "x-clerk-debug",
  ClerkRequestData: "x-clerk-request-data",
  ClerkRedirectTo: "x-clerk-redirect-to",
  CloudFrontForwardedProto: "cloudfront-forwarded-proto",
  Authorization: "authorization",
  ForwardedPort: "x-forwarded-port",
  ForwardedProto: "x-forwarded-proto",
  ForwardedHost: "x-forwarded-host",
  Accept: "accept",
  Referrer: "referer",
  UserAgent: "user-agent",
  Origin: "origin",
  Host: "host",
  ContentType: "content-type",
  SecFetchDest: "sec-fetch-dest",
  Location: "location",
  CacheControl: "cache-control"
};
var ContentTypes = {
  Json: "application/json"
};
var constants = {
  Attributes,
  Cookies: Cookies$1,
  Headers: Headers2,
  ContentTypes,
  QueryParameters
};
var AbstractAPI = class {
  constructor(request) {
    this.request = request;
  }
  requireId(id) {
    if (!id) {
      throw new Error("A valid resource ID is required.");
    }
  }
};
var basePath = "/accountless_applications";
var AccountlessApplicationAPI = class extends AbstractAPI {
  async createAccountlessApplication() {
    return this.request({
      method: "POST",
      path: basePath
    });
  }
};
var SEPARATOR = "/";
var MULTIPLE_SEPARATOR_REGEX = new RegExp("(?<!:)" + SEPARATOR + "{1,}", "g");
function joinPaths(...args) {
  return args.filter((p) => p).join(SEPARATOR).replace(MULTIPLE_SEPARATOR_REGEX, SEPARATOR);
}
var basePath2 = "/allowlist_identifiers";
var AllowlistIdentifierAPI = class extends AbstractAPI {
  async getAllowlistIdentifierList() {
    return this.request({
      method: "GET",
      path: basePath2,
      queryParams: { paginated: true }
    });
  }
  async createAllowlistIdentifier(params) {
    return this.request({
      method: "POST",
      path: basePath2,
      bodyParams: params
    });
  }
  async deleteAllowlistIdentifier(allowlistIdentifierId) {
    this.requireId(allowlistIdentifierId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath2, allowlistIdentifierId)
    });
  }
};
var basePath3 = "/clients";
var ClientAPI = class extends AbstractAPI {
  async getClientList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath3,
      queryParams: { ...params, paginated: true }
    });
  }
  async getClient(clientId) {
    this.requireId(clientId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath3, clientId)
    });
  }
  verifyClient(token) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath3, "verify"),
      bodyParams: { token }
    });
  }
};
var basePath4 = "/domains";
var DomainAPI = class extends AbstractAPI {
  async deleteDomain(id) {
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath4, id)
    });
  }
};
var basePath5 = "/email_addresses";
var EmailAddressAPI = class extends AbstractAPI {
  async getEmailAddress(emailAddressId) {
    this.requireId(emailAddressId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath5, emailAddressId)
    });
  }
  async createEmailAddress(params) {
    return this.request({
      method: "POST",
      path: basePath5,
      bodyParams: params
    });
  }
  async updateEmailAddress(emailAddressId, params = {}) {
    this.requireId(emailAddressId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath5, emailAddressId),
      bodyParams: params
    });
  }
  async deleteEmailAddress(emailAddressId) {
    this.requireId(emailAddressId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath5, emailAddressId)
    });
  }
};
var basePath6 = "/invitations";
var InvitationAPI = class extends AbstractAPI {
  async getInvitationList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath6,
      queryParams: { ...params, paginated: true }
    });
  }
  async createInvitation(params) {
    return this.request({
      method: "POST",
      path: basePath6,
      bodyParams: params
    });
  }
  async revokeInvitation(invitationId) {
    this.requireId(invitationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath6, invitationId, "revoke")
    });
  }
};
var basePath7 = "/organizations";
var OrganizationAPI = class extends AbstractAPI {
  async getOrganizationList(params) {
    return this.request({
      method: "GET",
      path: basePath7,
      queryParams: params
    });
  }
  async createOrganization(params) {
    return this.request({
      method: "POST",
      path: basePath7,
      bodyParams: params
    });
  }
  async getOrganization(params) {
    const { includeMembersCount } = params;
    const organizationIdOrSlug = "organizationId" in params ? params.organizationId : params.slug;
    this.requireId(organizationIdOrSlug);
    return this.request({
      method: "GET",
      path: joinPaths(basePath7, organizationIdOrSlug),
      queryParams: {
        includeMembersCount
      }
    });
  }
  async updateOrganization(organizationId, params) {
    this.requireId(organizationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath7, organizationId),
      bodyParams: params
    });
  }
  async updateOrganizationLogo(organizationId, params) {
    this.requireId(organizationId);
    const formData = new runtime.FormData();
    formData.append("file", params?.file);
    if (params?.uploaderUserId) {
      formData.append("uploader_user_id", params?.uploaderUserId);
    }
    return this.request({
      method: "PUT",
      path: joinPaths(basePath7, organizationId, "logo"),
      formData
    });
  }
  async deleteOrganizationLogo(organizationId) {
    this.requireId(organizationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath7, organizationId, "logo")
    });
  }
  async updateOrganizationMetadata(organizationId, params) {
    this.requireId(organizationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath7, organizationId, "metadata"),
      bodyParams: params
    });
  }
  async deleteOrganization(organizationId) {
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath7, organizationId)
    });
  }
  async getOrganizationMembershipList(params) {
    const { organizationId, limit, offset } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath7, organizationId, "memberships"),
      queryParams: { limit, offset }
    });
  }
  async createOrganizationMembership(params) {
    const { organizationId, userId, role } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath7, organizationId, "memberships"),
      bodyParams: {
        userId,
        role
      }
    });
  }
  async updateOrganizationMembership(params) {
    const { organizationId, userId, role } = params;
    this.requireId(organizationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath7, organizationId, "memberships", userId),
      bodyParams: {
        role
      }
    });
  }
  async updateOrganizationMembershipMetadata(params) {
    const { organizationId, userId, publicMetadata, privateMetadata } = params;
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath7, organizationId, "memberships", userId, "metadata"),
      bodyParams: {
        publicMetadata,
        privateMetadata
      }
    });
  }
  async deleteOrganizationMembership(params) {
    const { organizationId, userId } = params;
    this.requireId(organizationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath7, organizationId, "memberships", userId)
    });
  }
  async getOrganizationInvitationList(params) {
    const { organizationId, status, limit, offset } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath7, organizationId, "invitations"),
      queryParams: { status, limit, offset }
    });
  }
  async createOrganizationInvitation(params) {
    const { organizationId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath7, organizationId, "invitations"),
      bodyParams: { ...bodyParams }
    });
  }
  async getOrganizationInvitation(params) {
    const { organizationId, invitationId } = params;
    this.requireId(organizationId);
    this.requireId(invitationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath7, organizationId, "invitations", invitationId)
    });
  }
  async revokeOrganizationInvitation(params) {
    const { organizationId, invitationId, requestingUserId } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath7, organizationId, "invitations", invitationId, "revoke"),
      bodyParams: {
        requestingUserId
      }
    });
  }
  async getOrganizationDomainList(params) {
    const { organizationId, limit, offset } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath7, organizationId, "domains"),
      queryParams: { limit, offset }
    });
  }
  async createOrganizationDomain(params) {
    const { organizationId, name, enrollmentMode, verified = true } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath7, organizationId, "domains"),
      bodyParams: {
        name,
        enrollmentMode,
        verified
      }
    });
  }
  async updateOrganizationDomain(params) {
    const { organizationId, domainId, ...bodyParams } = params;
    this.requireId(organizationId);
    this.requireId(domainId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath7, organizationId, "domains", domainId),
      bodyParams
    });
  }
  async deleteOrganizationDomain(params) {
    const { organizationId, domainId } = params;
    this.requireId(organizationId);
    this.requireId(domainId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath7, organizationId, "domains", domainId)
    });
  }
};
var basePath8 = "/phone_numbers";
var PhoneNumberAPI = class extends AbstractAPI {
  async getPhoneNumber(phoneNumberId) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath8, phoneNumberId)
    });
  }
  async createPhoneNumber(params) {
    return this.request({
      method: "POST",
      path: basePath8,
      bodyParams: params
    });
  }
  async updatePhoneNumber(phoneNumberId, params = {}) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath8, phoneNumberId),
      bodyParams: params
    });
  }
  async deletePhoneNumber(phoneNumberId) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath8, phoneNumberId)
    });
  }
};
var basePath9 = "/redirect_urls";
var RedirectUrlAPI = class extends AbstractAPI {
  async getRedirectUrlList() {
    return this.request({
      method: "GET",
      path: basePath9,
      queryParams: { paginated: true }
    });
  }
  async getRedirectUrl(redirectUrlId) {
    this.requireId(redirectUrlId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath9, redirectUrlId)
    });
  }
  async createRedirectUrl(params) {
    return this.request({
      method: "POST",
      path: basePath9,
      bodyParams: params
    });
  }
  async deleteRedirectUrl(redirectUrlId) {
    this.requireId(redirectUrlId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath9, redirectUrlId)
    });
  }
};
var basePath10 = "/sessions";
var SessionAPI = class extends AbstractAPI {
  async getSessionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath10,
      queryParams: { ...params, paginated: true }
    });
  }
  async getSession(sessionId) {
    this.requireId(sessionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath10, sessionId)
    });
  }
  async revokeSession(sessionId) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath10, sessionId, "revoke")
    });
  }
  async verifySession(sessionId, token) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath10, sessionId, "verify"),
      bodyParams: { token }
    });
  }
  async getToken(sessionId, template) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath10, sessionId, "tokens", template || "")
    });
  }
  async refreshSession(sessionId, params) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath10, sessionId, "refresh"),
      bodyParams: params
    });
  }
};
var basePath11 = "/sign_in_tokens";
var SignInTokenAPI = class extends AbstractAPI {
  async createSignInToken(params) {
    return this.request({
      method: "POST",
      path: basePath11,
      bodyParams: params
    });
  }
  async revokeSignInToken(signInTokenId) {
    this.requireId(signInTokenId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath11, signInTokenId, "revoke")
    });
  }
};
var basePath12 = "/users";
var UserAPI = class extends AbstractAPI {
  async getUserList(params = {}) {
    const { limit, offset, orderBy, ...userCountParams } = params;
    const [data, totalCount] = await Promise.all([
      this.request({
        method: "GET",
        path: basePath12,
        queryParams: params
      }),
      this.getCount(userCountParams)
    ]);
    return { data, totalCount };
  }
  async getUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath12, userId)
    });
  }
  async createUser(params) {
    return this.request({
      method: "POST",
      path: basePath12,
      bodyParams: params
    });
  }
  async updateUser(userId, params = {}) {
    this.requireId(userId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath12, userId),
      bodyParams: params
    });
  }
  async updateUserProfileImage(userId, params) {
    this.requireId(userId);
    const formData = new runtime.FormData();
    formData.append("file", params?.file);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "profile_image"),
      formData
    });
  }
  async updateUserMetadata(userId, params) {
    this.requireId(userId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath12, userId, "metadata"),
      bodyParams: params
    });
  }
  async deleteUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath12, userId)
    });
  }
  async getCount(params = {}) {
    return this.request({
      method: "GET",
      path: joinPaths(basePath12, "count"),
      queryParams: params
    });
  }
  async getUserOauthAccessToken(userId, provider) {
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath12, userId, "oauth_access_tokens", provider),
      queryParams: { paginated: true }
    });
  }
  async disableUserMFA(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath12, userId, "mfa")
    });
  }
  async getOrganizationMembershipList(params) {
    const { userId, limit, offset } = params;
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath12, userId, "organization_memberships"),
      queryParams: { limit, offset }
    });
  }
  async verifyPassword(params) {
    const { userId, password } = params;
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "verify_password"),
      bodyParams: { password }
    });
  }
  async verifyTOTP(params) {
    const { userId, code } = params;
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "verify_totp"),
      bodyParams: { code }
    });
  }
  async banUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "ban")
    });
  }
  async unbanUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "unban")
    });
  }
  async lockUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "lock")
    });
  }
  async unlockUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath12, userId, "unlock")
    });
  }
  async deleteUserProfileImage(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath12, userId, "profile_image")
    });
  }
};
var basePath13 = "/saml_connections";
var SamlConnectionAPI = class extends AbstractAPI {
  async getSamlConnectionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath13,
      queryParams: params
    });
  }
  async createSamlConnection(params) {
    return this.request({
      method: "POST",
      path: basePath13,
      bodyParams: params
    });
  }
  async getSamlConnection(samlConnectionId) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath13, samlConnectionId)
    });
  }
  async updateSamlConnection(samlConnectionId, params = {}) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath13, samlConnectionId),
      bodyParams: params
    });
  }
  async deleteSamlConnection(samlConnectionId) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath13, samlConnectionId)
    });
  }
};
var basePath14 = "/testing_tokens";
var TestingTokenAPI = class extends AbstractAPI {
  async createTestingToken() {
    return this.request({
      method: "POST",
      path: basePath14
    });
  }
};
buildErrorThrower({ packageName: "@clerk/backend" });
function assertValidSecretKey(val) {
  if (!val || typeof val !== "string") {
    throw Error("Missing Clerk Secret Key. Go to https://dashboard.clerk.com and get your key for your instance.");
  }
}
function assertValidPublishableKey(val) {
  parsePublishableKey(val, { fatal: true });
}
var AccountlessApplication = class _AccountlessApplication {
  constructor(publishableKey, secretKey, claimUrl, apiKeysUrl) {
    this.publishableKey = publishableKey;
    this.secretKey = secretKey;
    this.claimUrl = claimUrl;
    this.apiKeysUrl = apiKeysUrl;
  }
  static fromJSON(data) {
    return new _AccountlessApplication(data.publishable_key, data.secret_key, data.claim_url, data.api_keys_url);
  }
};
var AllowlistIdentifier = class _AllowlistIdentifier {
  constructor(id, identifier, createdAt, updatedAt, invitationId) {
    this.id = id;
    this.identifier = identifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.invitationId = invitationId;
  }
  static fromJSON(data) {
    return new _AllowlistIdentifier(data.id, data.identifier, data.created_at, data.updated_at, data.invitation_id);
  }
};
var Session = class _Session {
  constructor(id, clientId, userId, status, lastActiveAt, expireAt, abandonAt, createdAt, updatedAt) {
    this.id = id;
    this.clientId = clientId;
    this.userId = userId;
    this.status = status;
    this.lastActiveAt = lastActiveAt;
    this.expireAt = expireAt;
    this.abandonAt = abandonAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _Session(
      data.id,
      data.client_id,
      data.user_id,
      data.status,
      data.last_active_at,
      data.expire_at,
      data.abandon_at,
      data.created_at,
      data.updated_at
    );
  }
};
var Client = class _Client {
  constructor(id, sessionIds, sessions, signInId, signUpId, lastActiveSessionId, createdAt, updatedAt) {
    this.id = id;
    this.sessionIds = sessionIds;
    this.sessions = sessions;
    this.signInId = signInId;
    this.signUpId = signUpId;
    this.lastActiveSessionId = lastActiveSessionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _Client(
      data.id,
      data.session_ids,
      data.sessions.map((x) => Session.fromJSON(x)),
      data.sign_in_id,
      data.sign_up_id,
      data.last_active_session_id,
      data.created_at,
      data.updated_at
    );
  }
};
var DeletedObject = class _DeletedObject {
  constructor(object, id, slug, deleted) {
    this.object = object;
    this.id = id;
    this.slug = slug;
    this.deleted = deleted;
  }
  static fromJSON(data) {
    return new _DeletedObject(data.object, data.id || null, data.slug || null, data.deleted);
  }
};
var Email = class _Email {
  constructor(id, fromEmailName, emailAddressId, toEmailAddress, subject, body, bodyPlain, status, slug, data, deliveredByClerk) {
    this.id = id;
    this.fromEmailName = fromEmailName;
    this.emailAddressId = emailAddressId;
    this.toEmailAddress = toEmailAddress;
    this.subject = subject;
    this.body = body;
    this.bodyPlain = bodyPlain;
    this.status = status;
    this.slug = slug;
    this.data = data;
    this.deliveredByClerk = deliveredByClerk;
  }
  static fromJSON(data) {
    return new _Email(
      data.id,
      data.from_email_name,
      data.email_address_id,
      data.to_email_address,
      data.subject,
      data.body,
      data.body_plain,
      data.status,
      data.slug,
      data.data,
      data.delivered_by_clerk
    );
  }
};
var IdentificationLink = class _IdentificationLink {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
  static fromJSON(data) {
    return new _IdentificationLink(data.id, data.type);
  }
};
var Verification = class _Verification {
  constructor(status, strategy, externalVerificationRedirectURL = null, attempts = null, expireAt = null, nonce = null, message = null) {
    this.status = status;
    this.strategy = strategy;
    this.externalVerificationRedirectURL = externalVerificationRedirectURL;
    this.attempts = attempts;
    this.expireAt = expireAt;
    this.nonce = nonce;
    this.message = message;
  }
  static fromJSON(data) {
    return new _Verification(
      data.status,
      data.strategy,
      data.external_verification_redirect_url ? new URL(data.external_verification_redirect_url) : null,
      data.attempts,
      data.expire_at,
      data.nonce
    );
  }
};
var EmailAddress = class _EmailAddress {
  constructor(id, emailAddress, verification, linkedTo) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _EmailAddress(
      data.id,
      data.email_address,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};
var ExternalAccount = class _ExternalAccount {
  constructor(id, provider, identificationId, externalId, approvedScopes, emailAddress, firstName, lastName, imageUrl, username, publicMetadata = {}, label, verification) {
    this.id = id;
    this.provider = provider;
    this.identificationId = identificationId;
    this.externalId = externalId;
    this.approvedScopes = approvedScopes;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageUrl = imageUrl;
    this.username = username;
    this.publicMetadata = publicMetadata;
    this.label = label;
    this.verification = verification;
  }
  static fromJSON(data) {
    return new _ExternalAccount(
      data.id,
      data.provider,
      data.identification_id,
      data.provider_user_id,
      data.approved_scopes,
      data.email_address,
      data.first_name,
      data.last_name,
      data.image_url || "",
      data.username,
      data.public_metadata,
      data.label,
      data.verification && Verification.fromJSON(data.verification)
    );
  }
};
var Invitation = class _Invitation {
  constructor(id, emailAddress, publicMetadata, createdAt, updatedAt, status, url, revoked) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.publicMetadata = publicMetadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.url = url;
    this.revoked = revoked;
  }
  static fromJSON(data) {
    return new _Invitation(
      data.id,
      data.email_address,
      data.public_metadata,
      data.created_at,
      data.updated_at,
      data.status,
      data.url,
      data.revoked
    );
  }
};
var ObjectType = {
  AccountlessApplication: "accountless_application",
  AllowlistIdentifier: "allowlist_identifier",
  Client: "client",
  Email: "email",
  EmailAddress: "email_address",
  ExternalAccount: "external_account",
  FacebookAccount: "facebook_account",
  GoogleAccount: "google_account",
  Invitation: "invitation",
  OauthAccessToken: "oauth_access_token",
  Organization: "organization",
  OrganizationInvitation: "organization_invitation",
  OrganizationMembership: "organization_membership",
  PhoneNumber: "phone_number",
  RedirectUrl: "redirect_url",
  SamlAccount: "saml_account",
  Session: "session",
  SignInAttempt: "sign_in_attempt",
  SignInToken: "sign_in_token",
  SignUpAttempt: "sign_up_attempt",
  SmsMessage: "sms_message",
  User: "user",
  Web3Wallet: "web3_wallet",
  Token: "token",
  TotalCount: "total_count",
  TestingToken: "testing_token",
  Role: "role",
  Permission: "permission"
};
var OauthAccessToken = class _OauthAccessToken {
  constructor(externalAccountId, provider, token, publicMetadata = {}, label, scopes, tokenSecret) {
    this.externalAccountId = externalAccountId;
    this.provider = provider;
    this.token = token;
    this.publicMetadata = publicMetadata;
    this.label = label;
    this.scopes = scopes;
    this.tokenSecret = tokenSecret;
  }
  static fromJSON(data) {
    return new _OauthAccessToken(
      data.external_account_id,
      data.provider,
      data.token,
      data.public_metadata,
      data.label || "",
      data.scopes,
      data.token_secret
    );
  }
};
var Organization = class _Organization {
  constructor(id, name, slug, imageUrl, hasImage, createdAt, updatedAt, publicMetadata = {}, privateMetadata = {}, maxAllowedMemberships, adminDeleteEnabled, membersCount, createdBy) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.maxAllowedMemberships = maxAllowedMemberships;
    this.adminDeleteEnabled = adminDeleteEnabled;
    this.membersCount = membersCount;
    this.createdBy = createdBy;
  }
  static fromJSON(data) {
    return new _Organization(
      data.id,
      data.name,
      data.slug,
      data.image_url || "",
      data.has_image,
      data.created_at,
      data.updated_at,
      data.public_metadata,
      data.private_metadata,
      data.max_allowed_memberships,
      data.admin_delete_enabled,
      data.members_count,
      data.created_by
    );
  }
};
var OrganizationInvitation = class _OrganizationInvitation {
  constructor(id, emailAddress, role, organizationId, createdAt, updatedAt, status, publicMetadata = {}, privateMetadata = {}) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.role = role;
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
  }
  static fromJSON(data) {
    return new _OrganizationInvitation(
      data.id,
      data.email_address,
      data.role,
      data.organization_id,
      data.created_at,
      data.updated_at,
      data.status,
      data.public_metadata,
      data.private_metadata
    );
  }
};
var OrganizationMembership = class _OrganizationMembership {
  constructor(id, role, permissions, publicMetadata = {}, privateMetadata = {}, createdAt, updatedAt, organization, publicUserData) {
    this.id = id;
    this.role = role;
    this.permissions = permissions;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.organization = organization;
    this.publicUserData = publicUserData;
  }
  static fromJSON(data) {
    return new _OrganizationMembership(
      data.id,
      data.role,
      data.permissions,
      data.public_metadata,
      data.private_metadata,
      data.created_at,
      data.updated_at,
      Organization.fromJSON(data.organization),
      OrganizationMembershipPublicUserData.fromJSON(data.public_user_data)
    );
  }
};
var OrganizationMembershipPublicUserData = class _OrganizationMembershipPublicUserData {
  constructor(identifier, firstName, lastName, imageUrl, hasImage, userId) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.userId = userId;
  }
  static fromJSON(data) {
    return new _OrganizationMembershipPublicUserData(
      data.identifier,
      data.first_name,
      data.last_name,
      data.image_url,
      data.has_image,
      data.user_id
    );
  }
};
var PhoneNumber = class _PhoneNumber {
  constructor(id, phoneNumber, reservedForSecondFactor, defaultSecondFactor, verification, linkedTo) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.reservedForSecondFactor = reservedForSecondFactor;
    this.defaultSecondFactor = defaultSecondFactor;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _PhoneNumber(
      data.id,
      data.phone_number,
      data.reserved_for_second_factor,
      data.default_second_factor,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};
var RedirectUrl = class _RedirectUrl {
  constructor(id, url, createdAt, updatedAt) {
    this.id = id;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _RedirectUrl(data.id, data.url, data.created_at, data.updated_at);
  }
};
var SignInToken = class _SignInToken {
  constructor(id, userId, token, status, url, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.status = status;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _SignInToken(data.id, data.user_id, data.token, data.status, data.url, data.created_at, data.updated_at);
  }
};
var SMSMessage = class _SMSMessage {
  constructor(id, fromPhoneNumber, toPhoneNumber, message, status, phoneNumberId, data) {
    this.id = id;
    this.fromPhoneNumber = fromPhoneNumber;
    this.toPhoneNumber = toPhoneNumber;
    this.message = message;
    this.status = status;
    this.phoneNumberId = phoneNumberId;
    this.data = data;
  }
  static fromJSON(data) {
    return new _SMSMessage(
      data.id,
      data.from_phone_number,
      data.to_phone_number,
      data.message,
      data.status,
      data.phone_number_id,
      data.data
    );
  }
};
var Token = class _Token {
  constructor(jwt) {
    this.jwt = jwt;
  }
  static fromJSON(data) {
    return new _Token(data.jwt);
  }
};
var SamlAccountConnection = class _SamlAccountConnection {
  constructor(id, name, domain, active, provider, syncUserAttributes, allowSubdomains, allowIdpInitiated, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.domain = domain;
    this.active = active;
    this.provider = provider;
    this.syncUserAttributes = syncUserAttributes;
    this.allowSubdomains = allowSubdomains;
    this.allowIdpInitiated = allowIdpInitiated;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _SamlAccountConnection(
      data.id,
      data.name,
      data.domain,
      data.active,
      data.provider,
      data.sync_user_attributes,
      data.allow_subdomains,
      data.allow_idp_initiated,
      data.created_at,
      data.updated_at
    );
  }
};
var SamlAccount = class _SamlAccount {
  constructor(id, provider, providerUserId, active, emailAddress, firstName, lastName, verification, samlConnection) {
    this.id = id;
    this.provider = provider;
    this.providerUserId = providerUserId;
    this.active = active;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.verification = verification;
    this.samlConnection = samlConnection;
  }
  static fromJSON(data) {
    return new _SamlAccount(
      data.id,
      data.provider,
      data.provider_user_id,
      data.active,
      data.email_address,
      data.first_name,
      data.last_name,
      data.verification && Verification.fromJSON(data.verification),
      data.saml_connection && SamlAccountConnection.fromJSON(data.saml_connection)
    );
  }
};
var Web3Wallet = class _Web3Wallet {
  constructor(id, web3Wallet, verification) {
    this.id = id;
    this.web3Wallet = web3Wallet;
    this.verification = verification;
  }
  static fromJSON(data) {
    return new _Web3Wallet(data.id, data.web3_wallet, data.verification && Verification.fromJSON(data.verification));
  }
};
var User = class _User {
  constructor(id, passwordEnabled, totpEnabled, backupCodeEnabled, twoFactorEnabled, banned, locked, createdAt, updatedAt, imageUrl, hasImage, primaryEmailAddressId, primaryPhoneNumberId, primaryWeb3WalletId, lastSignInAt, externalId, username, firstName, lastName, publicMetadata = {}, privateMetadata = {}, unsafeMetadata = {}, emailAddresses = [], phoneNumbers = [], web3Wallets = [], externalAccounts = [], samlAccounts = [], lastActiveAt, createOrganizationEnabled, createOrganizationsLimit = null, deleteSelfEnabled, legalAcceptedAt) {
    this.id = id;
    this.passwordEnabled = passwordEnabled;
    this.totpEnabled = totpEnabled;
    this.backupCodeEnabled = backupCodeEnabled;
    this.twoFactorEnabled = twoFactorEnabled;
    this.banned = banned;
    this.locked = locked;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.primaryEmailAddressId = primaryEmailAddressId;
    this.primaryPhoneNumberId = primaryPhoneNumberId;
    this.primaryWeb3WalletId = primaryWeb3WalletId;
    this.lastSignInAt = lastSignInAt;
    this.externalId = externalId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.unsafeMetadata = unsafeMetadata;
    this.emailAddresses = emailAddresses;
    this.phoneNumbers = phoneNumbers;
    this.web3Wallets = web3Wallets;
    this.externalAccounts = externalAccounts;
    this.samlAccounts = samlAccounts;
    this.lastActiveAt = lastActiveAt;
    this.createOrganizationEnabled = createOrganizationEnabled;
    this.createOrganizationsLimit = createOrganizationsLimit;
    this.deleteSelfEnabled = deleteSelfEnabled;
    this.legalAcceptedAt = legalAcceptedAt;
  }
  static fromJSON(data) {
    return new _User(
      data.id,
      data.password_enabled,
      data.totp_enabled,
      data.backup_code_enabled,
      data.two_factor_enabled,
      data.banned,
      data.locked,
      data.created_at,
      data.updated_at,
      data.image_url,
      data.has_image,
      data.primary_email_address_id,
      data.primary_phone_number_id,
      data.primary_web3_wallet_id,
      data.last_sign_in_at,
      data.external_id,
      data.username,
      data.first_name,
      data.last_name,
      data.public_metadata,
      data.private_metadata,
      data.unsafe_metadata,
      (data.email_addresses || []).map((x) => EmailAddress.fromJSON(x)),
      (data.phone_numbers || []).map((x) => PhoneNumber.fromJSON(x)),
      (data.web3_wallets || []).map((x) => Web3Wallet.fromJSON(x)),
      (data.external_accounts || []).map((x) => ExternalAccount.fromJSON(x)),
      (data.saml_accounts || []).map((x) => SamlAccount.fromJSON(x)),
      data.last_active_at,
      data.create_organization_enabled,
      data.create_organizations_limit,
      data.delete_self_enabled,
      data.legal_accepted_at
    );
  }
  get primaryEmailAddress() {
    return this.emailAddresses.find(({ id }) => id === this.primaryEmailAddressId) ?? null;
  }
  get primaryPhoneNumber() {
    return this.phoneNumbers.find(({ id }) => id === this.primaryPhoneNumberId) ?? null;
  }
  get primaryWeb3Wallet() {
    return this.web3Wallets.find(({ id }) => id === this.primaryWeb3WalletId) ?? null;
  }
  get fullName() {
    return [this.firstName, this.lastName].join(" ").trim() || null;
  }
};
function deserialize(payload) {
  let data, totalCount;
  if (Array.isArray(payload)) {
    const data2 = payload.map((item) => jsonToObject(item));
    return { data: data2 };
  } else if (isPaginated(payload)) {
    data = payload.data.map((item) => jsonToObject(item));
    totalCount = payload.total_count;
    return { data, totalCount };
  } else {
    return { data: jsonToObject(payload) };
  }
}
function isPaginated(payload) {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    return false;
  }
  return Array.isArray(payload.data) && payload.data !== void 0;
}
function getCount(item) {
  return item.total_count;
}
function jsonToObject(item) {
  if (typeof item !== "string" && "object" in item && "deleted" in item) {
    return DeletedObject.fromJSON(item);
  }
  switch (item.object) {
    case ObjectType.AccountlessApplication:
      return AccountlessApplication.fromJSON(item);
    case ObjectType.AllowlistIdentifier:
      return AllowlistIdentifier.fromJSON(item);
    case ObjectType.Client:
      return Client.fromJSON(item);
    case ObjectType.EmailAddress:
      return EmailAddress.fromJSON(item);
    case ObjectType.Email:
      return Email.fromJSON(item);
    case ObjectType.Invitation:
      return Invitation.fromJSON(item);
    case ObjectType.OauthAccessToken:
      return OauthAccessToken.fromJSON(item);
    case ObjectType.Organization:
      return Organization.fromJSON(item);
    case ObjectType.OrganizationInvitation:
      return OrganizationInvitation.fromJSON(item);
    case ObjectType.OrganizationMembership:
      return OrganizationMembership.fromJSON(item);
    case ObjectType.PhoneNumber:
      return PhoneNumber.fromJSON(item);
    case ObjectType.RedirectUrl:
      return RedirectUrl.fromJSON(item);
    case ObjectType.SignInToken:
      return SignInToken.fromJSON(item);
    case ObjectType.Session:
      return Session.fromJSON(item);
    case ObjectType.SmsMessage:
      return SMSMessage.fromJSON(item);
    case ObjectType.Token:
      return Token.fromJSON(item);
    case ObjectType.TotalCount:
      return getCount(item);
    case ObjectType.User:
      return User.fromJSON(item);
    default:
      return item;
  }
}
function buildRequest(options) {
  const requestFn = async (requestOptions) => {
    const {
      secretKey,
      requireSecretKey = true,
      apiUrl = API_URL$1,
      apiVersion = API_VERSION$1,
      userAgent = USER_AGENT
    } = options;
    const { path, method, queryParams, headerParams, bodyParams, formData } = requestOptions;
    if (requireSecretKey) {
      assertValidSecretKey(secretKey);
    }
    const url = joinPaths(apiUrl, apiVersion, path);
    const finalUrl = new URL(url);
    if (queryParams) {
      const snakecasedQueryParams = snakecaseKeys({ ...queryParams });
      for (const [key, val] of Object.entries(snakecasedQueryParams)) {
        if (val) {
          [val].flat().forEach((v) => finalUrl.searchParams.append(key, v));
        }
      }
    }
    const headers = {
      Authorization: `Bearer ${secretKey}`,
      "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
      "User-Agent": userAgent,
      ...headerParams
    };
    let res;
    try {
      if (formData) {
        res = await runtime.fetch(finalUrl.href, {
          method,
          headers,
          body: formData
        });
      } else {
        headers["Content-Type"] = "application/json";
        const hasBody = method !== "GET" && bodyParams && Object.keys(bodyParams).length > 0;
        const body = hasBody ? { body: JSON.stringify(snakecaseKeys(bodyParams, { deep: false })) } : null;
        res = await runtime.fetch(finalUrl.href, {
          method,
          headers,
          ...body
        });
      }
      const isJSONResponse = res?.headers && res.headers?.get(constants.Headers.ContentType) === constants.ContentTypes.Json;
      const responseBody = await (isJSONResponse ? res.json() : res.text());
      if (!res.ok) {
        return {
          data: null,
          errors: parseErrors(responseBody),
          status: res?.status,
          statusText: res?.statusText,
          clerkTraceId: getTraceId(responseBody, res?.headers)
        };
      }
      return {
        ...deserialize(responseBody),
        errors: null
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          data: null,
          errors: [
            {
              code: "unexpected_error",
              message: err.message || "Unexpected error"
            }
          ],
          clerkTraceId: getTraceId(err, res?.headers)
        };
      }
      return {
        data: null,
        errors: parseErrors(err),
        status: res?.status,
        statusText: res?.statusText,
        clerkTraceId: getTraceId(err, res?.headers)
      };
    }
  };
  return withLegacyRequestReturn(requestFn);
}
function getTraceId(data, headers) {
  if (data && typeof data === "object" && "clerk_trace_id" in data && typeof data.clerk_trace_id === "string") {
    return data.clerk_trace_id;
  }
  const cfRay = headers?.get("cf-ray");
  return cfRay || "";
}
function parseErrors(data) {
  if (!!data && typeof data === "object" && "errors" in data) {
    const errors = data.errors;
    return errors.length > 0 ? errors.map(parseError) : [];
  }
  return [];
}
function withLegacyRequestReturn(cb) {
  return async (...args) => {
    const { data, errors, totalCount, status, statusText, clerkTraceId } = await cb(...args);
    if (errors) {
      const error = new ClerkAPIResponseError(statusText || "", {
        data: [],
        status,
        clerkTraceId
      });
      error.errors = errors;
      throw error;
    }
    if (typeof totalCount !== "undefined") {
      return { data, totalCount };
    }
    return data;
  };
}
function createBackendApiClient(options) {
  const request = buildRequest(options);
  return {
    __experimental_accountlessApplications: new AccountlessApplicationAPI(
      buildRequest({ ...options, requireSecretKey: false })
    ),
    allowlistIdentifiers: new AllowlistIdentifierAPI(request),
    clients: new ClientAPI(request),
    emailAddresses: new EmailAddressAPI(request),
    invitations: new InvitationAPI(request),
    organizations: new OrganizationAPI(request),
    phoneNumbers: new PhoneNumberAPI(request),
    redirectUrls: new RedirectUrlAPI(request),
    sessions: new SessionAPI(request),
    signInTokens: new SignInTokenAPI(request),
    users: new UserAPI(request),
    domains: new DomainAPI(request),
    samlConnections: new SamlConnectionAPI(request),
    testingTokens: new TestingTokenAPI(request)
  };
}
var createDebug = (data) => {
  return () => {
    const res = { ...data };
    res.secretKey = (res.secretKey || "").substring(0, 7);
    res.jwtKey = (res.jwtKey || "").substring(0, 7);
    return { ...res };
  };
};
function signedInAuthObject(authenticateContext, sessionToken, sessionClaims) {
  const {
    act: actor,
    sid: sessionId,
    org_id: orgId,
    org_role: orgRole,
    org_slug: orgSlug,
    org_permissions: orgPermissions,
    sub: userId,
    fva
  } = sessionClaims;
  const apiClient = createBackendApiClient(authenticateContext);
  const getToken = createGetToken({
    sessionId,
    sessionToken,
    fetcher: async (...args) => (await apiClient.sessions.getToken(...args)).jwt
  });
  const factorVerificationAge = fva ?? null;
  return {
    actor,
    sessionClaims,
    sessionId,
    userId,
    orgId,
    orgRole,
    orgSlug,
    orgPermissions,
    factorVerificationAge,
    getToken,
    has: createCheckAuthorization({ orgId, orgRole, orgPermissions, userId, factorVerificationAge }),
    debug: createDebug({ ...authenticateContext, sessionToken })
  };
}
function signedOutAuthObject(debugData) {
  return {
    sessionClaims: null,
    sessionId: null,
    userId: null,
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    orgPermissions: null,
    factorVerificationAge: null,
    getToken: () => Promise.resolve(null),
    has: () => false,
    debug: createDebug(debugData)
  };
}
var createGetToken = (params) => {
  const { fetcher, sessionToken, sessionId } = params;
  return async (options = {}) => {
    if (!sessionId) {
      return null;
    }
    if (options.template) {
      return fetcher(sessionId, options.template);
    }
    return sessionToken;
  };
};
var AuthStatus = {
  SignedIn: "signed-in",
  SignedOut: "signed-out",
  Handshake: "handshake"
};
var AuthErrorReason = {
  ClientUATWithoutSessionToken: "client-uat-but-no-session-token",
  DevBrowserMissing: "dev-browser-missing",
  DevBrowserSync: "dev-browser-sync",
  PrimaryRespondsToSyncing: "primary-responds-to-syncing",
  SatelliteCookieNeedsSyncing: "satellite-needs-syncing",
  SessionTokenAndUATMissing: "session-token-and-uat-missing",
  SessionTokenMissing: "session-token-missing",
  SessionTokenExpired: "session-token-expired",
  SessionTokenIATBeforeClientUAT: "session-token-iat-before-client-uat",
  SessionTokenNBF: "session-token-nbf",
  SessionTokenIatInTheFuture: "session-token-iat-in-the-future",
  SessionTokenWithoutClientUAT: "session-token-but-no-client-uat",
  ActiveOrganizationMismatch: "active-organization-mismatch",
  UnexpectedError: "unexpected-error"
};
function signedIn(authenticateContext, sessionClaims, headers = new Headers(), token) {
  const authObject = signedInAuthObject(authenticateContext, token, sessionClaims);
  return {
    status: AuthStatus.SignedIn,
    reason: null,
    message: null,
    proxyUrl: authenticateContext.proxyUrl || "",
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: true,
    toAuth: () => authObject,
    headers,
    token
  };
}
function signedOut(authenticateContext, reason, message = "", headers = new Headers()) {
  return withDebugHeaders({
    status: AuthStatus.SignedOut,
    reason,
    message,
    proxyUrl: authenticateContext.proxyUrl || "",
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: false,
    headers,
    toAuth: () => signedOutAuthObject({ ...authenticateContext, status: AuthStatus.SignedOut, reason, message }),
    token: null
  });
}
function handshake(authenticateContext, reason, message = "", headers) {
  return withDebugHeaders({
    status: AuthStatus.Handshake,
    reason,
    message,
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    proxyUrl: authenticateContext.proxyUrl || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: false,
    headers,
    toAuth: () => null,
    token: null
  });
}
var withDebugHeaders = (requestState) => {
  const headers = new Headers(requestState.headers || {});
  if (requestState.message) {
    try {
      headers.set(constants.Headers.AuthMessage, requestState.message);
    } catch (e) {
    }
  }
  if (requestState.reason) {
    try {
      headers.set(constants.Headers.AuthReason, requestState.reason);
    } catch (e) {
    }
  }
  if (requestState.status) {
    try {
      headers.set(constants.Headers.AuthStatus, requestState.status);
    } catch (e) {
    }
  }
  requestState.headers = headers;
  return requestState;
};
var ClerkUrl = class extends URL {
  isCrossOrigin(other) {
    return this.origin !== new URL(other.toString()).origin;
  }
};
var createClerkUrl = (...args) => {
  return new ClerkUrl(...args);
};
var ClerkRequest = class extends Request {
  constructor(input, init) {
    const url = typeof input !== "string" && "url" in input ? input.url : String(input);
    super(url, init || typeof input === "string" ? void 0 : input);
    this.clerkUrl = this.deriveUrlFromHeaders(this);
    this.cookies = this.parseCookies(this);
  }
  toJSON() {
    return {
      url: this.clerkUrl.href,
      method: this.method,
      headers: JSON.stringify(Object.fromEntries(this.headers)),
      clerkUrl: this.clerkUrl.toString(),
      cookies: JSON.stringify(Object.fromEntries(this.cookies))
    };
  }
  /**
   * Used to fix request.url using the x-forwarded-* headers
   * TODO add detailed description of the issues this solves
   */
  deriveUrlFromHeaders(req) {
    const initialUrl = new URL(req.url);
    const forwardedProto = req.headers.get(constants.Headers.ForwardedProto);
    const forwardedHost = req.headers.get(constants.Headers.ForwardedHost);
    const host = req.headers.get(constants.Headers.Host);
    const protocol = initialUrl.protocol;
    const resolvedHost = this.getFirstValueFromHeader(forwardedHost) ?? host;
    const resolvedProtocol = this.getFirstValueFromHeader(forwardedProto) ?? protocol?.replace(/[:/]/, "");
    const origin = resolvedHost && resolvedProtocol ? `${resolvedProtocol}://${resolvedHost}` : initialUrl.origin;
    if (origin === initialUrl.origin) {
      return createClerkUrl(initialUrl);
    }
    return createClerkUrl(initialUrl.pathname + initialUrl.search, origin);
  }
  getFirstValueFromHeader(value) {
    return value?.split(",")[0];
  }
  parseCookies(req) {
    const cookiesRecord = parse$1(this.decodeCookieValue(req.headers.get("cookie") || ""));
    return new Map(Object.entries(cookiesRecord));
  }
  decodeCookieValue(str) {
    return str ? str.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) : str;
  }
};
var createClerkRequest = (...args) => {
  return args[0] instanceof ClerkRequest ? args[0] : new ClerkRequest(...args);
};
var cache = {};
var lastUpdatedAt = 0;
function getFromCache(kid) {
  return cache[kid];
}
function getCacheValues() {
  return Object.values(cache);
}
function setInCache(jwk, shouldExpire = true) {
  cache[jwk.kid] = jwk;
  lastUpdatedAt = shouldExpire ? Date.now() : -1;
}
var LocalJwkKid = "local";
var PEM_HEADER = "-----BEGIN PUBLIC KEY-----";
var PEM_TRAILER = "-----END PUBLIC KEY-----";
var RSA_PREFIX = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
var RSA_SUFFIX = "IDAQAB";
function loadClerkJWKFromLocal(localKey) {
  if (!getFromCache(LocalJwkKid)) {
    if (!localKey) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.SetClerkJWTKey,
        message: "Missing local JWK.",
        reason: TokenVerificationErrorReason.LocalJWKMissing
      });
    }
    const modulus = localKey.replace(/(\r\n|\n|\r)/gm, "").replace(PEM_HEADER, "").replace(PEM_TRAILER, "").replace(RSA_PREFIX, "").replace(RSA_SUFFIX, "").replace(/\+/g, "-").replace(/\//g, "_");
    setInCache(
      {
        kid: "local",
        kty: "RSA",
        alg: "RS256",
        n: modulus,
        e: "AQAB"
      },
      false
      // local key never expires in cache
    );
  }
  return getFromCache(LocalJwkKid);
}
async function loadClerkJWKFromRemote({
  secretKey,
  apiUrl = API_URL$1,
  apiVersion = API_VERSION$1,
  kid,
  skipJwksCache
}) {
  if (skipJwksCache || cacheHasExpired() || !getFromCache(kid)) {
    if (!secretKey) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: "Failed to load JWKS from Clerk Backend or Frontend API.",
        reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
      });
    }
    const fetcher = () => fetchJWKSFromBAPI(apiUrl, secretKey, apiVersion);
    const { keys } = await callWithRetry(fetcher);
    if (!keys || !keys.length) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: "The JWKS endpoint did not contain any signing keys. Contact support@clerk.com.",
        reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
      });
    }
    keys.forEach((key) => setInCache(key));
  }
  const jwk = getFromCache(kid);
  if (!jwk) {
    const cacheValues = getCacheValues();
    const jwkKeys = cacheValues.map((jwk2) => jwk2.kid).sort().join(", ");
    throw new TokenVerificationError({
      action: `Go to your Dashboard and validate your secret and public keys are correct. ${TokenVerificationErrorAction.ContactSupport} if the issue persists.`,
      message: `Unable to find a signing key in JWKS that matches the kid='${kid}' of the provided session token. Please make sure that the __session cookie or the HTTP authorization header contain a Clerk-generated session JWT. The following kid is available: ${jwkKeys}`,
      reason: TokenVerificationErrorReason.JWKKidMismatch
    });
  }
  return jwk;
}
async function fetchJWKSFromBAPI(apiUrl, key, apiVersion) {
  if (!key) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.SetClerkSecretKey,
      message: "Missing Clerk Secret Key or API Key. Go to https://dashboard.clerk.com and get your key for your instance.",
      reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
    });
  }
  const url = new URL(apiUrl);
  url.pathname = joinPaths(url.pathname, apiVersion, "/jwks");
  const response = await runtime.fetch(url.href, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT
    }
  });
  if (!response.ok) {
    const json = await response.json();
    const invalidSecretKeyError = getErrorObjectByCode(json?.errors, TokenVerificationErrorCode.InvalidSecretKey);
    if (invalidSecretKeyError) {
      const reason = TokenVerificationErrorReason.InvalidSecretKey;
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: invalidSecretKeyError.message,
        reason
      });
    }
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.ContactSupport,
      message: `Error loading Clerk JWKS from ${url.href} with code=${response.status}`,
      reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
    });
  }
  return response.json();
}
function cacheHasExpired() {
  if (lastUpdatedAt === -1) {
    return false;
  }
  const isExpired = Date.now() - lastUpdatedAt >= MAX_CACHE_LAST_UPDATED_AT_SECONDS * 1e3;
  if (isExpired) {
    cache = {};
  }
  return isExpired;
}
var getErrorObjectByCode = (errors, code) => {
  if (!errors) {
    return null;
  }
  return errors.find((err) => err.code === code);
};
async function verifyToken(token, options) {
  const { data: decodedResult, errors } = decodeJwt(token);
  if (errors) {
    return { errors };
  }
  const { header } = decodedResult;
  const { kid } = header;
  try {
    let key;
    if (options.jwtKey) {
      key = loadClerkJWKFromLocal(options.jwtKey);
    } else if (options.secretKey) {
      key = await loadClerkJWKFromRemote({ ...options, kid });
    } else {
      return {
        errors: [
          new TokenVerificationError({
            action: TokenVerificationErrorAction.SetClerkJWTKey,
            message: "Failed to resolve JWK during verification.",
            reason: TokenVerificationErrorReason.JWKFailedToResolve
          })
        ]
      };
    }
    return await verifyJwt(token, { ...options, key });
  } catch (error) {
    return { errors: [error] };
  }
}
var AuthenticateContext = class {
  constructor(cookieSuffix, clerkRequest, options) {
    this.cookieSuffix = cookieSuffix;
    this.clerkRequest = clerkRequest;
    this.initPublishableKeyValues(options);
    this.initHeaderValues();
    this.initCookieValues();
    this.initHandshakeValues();
    Object.assign(this, options);
    this.clerkUrl = this.clerkRequest.clerkUrl;
  }
  get sessionToken() {
    return this.sessionTokenInCookie || this.sessionTokenInHeader;
  }
  usesSuffixedCookies() {
    const suffixedClientUat = this.getSuffixedCookie(constants.Cookies.ClientUat);
    const clientUat = this.getCookie(constants.Cookies.ClientUat);
    const suffixedSession = this.getSuffixedCookie(constants.Cookies.Session) || "";
    const session = this.getCookie(constants.Cookies.Session) || "";
    if (session && !this.tokenHasIssuer(session)) {
      return false;
    }
    if (session && !this.tokenBelongsToInstance(session)) {
      return true;
    }
    if (!suffixedClientUat && !suffixedSession) {
      return false;
    }
    const { data: sessionData } = decodeJwt(session);
    const sessionIat = sessionData?.payload.iat || 0;
    const { data: suffixedSessionData } = decodeJwt(suffixedSession);
    const suffixedSessionIat = suffixedSessionData?.payload.iat || 0;
    if (suffixedClientUat !== "0" && clientUat !== "0" && sessionIat > suffixedSessionIat) {
      return false;
    }
    if (suffixedClientUat === "0" && clientUat !== "0") {
      return false;
    }
    if (this.instanceType !== "production") {
      const isSuffixedSessionExpired = this.sessionExpired(suffixedSessionData);
      if (suffixedClientUat !== "0" && clientUat === "0" && isSuffixedSessionExpired) {
        return false;
      }
    }
    if (!suffixedClientUat && suffixedSession) {
      return false;
    }
    return true;
  }
  initPublishableKeyValues(options) {
    assertValidPublishableKey(options.publishableKey);
    this.publishableKey = options.publishableKey;
    const pk = parsePublishableKey(this.publishableKey, {
      fatal: true,
      proxyUrl: options.proxyUrl,
      domain: options.domain
    });
    this.instanceType = pk.instanceType;
    this.frontendApi = pk.frontendApi;
  }
  initHeaderValues() {
    this.sessionTokenInHeader = this.stripAuthorizationHeader(this.getHeader(constants.Headers.Authorization));
    this.origin = this.getHeader(constants.Headers.Origin);
    this.host = this.getHeader(constants.Headers.Host);
    this.forwardedHost = this.getHeader(constants.Headers.ForwardedHost);
    this.forwardedProto = this.getHeader(constants.Headers.CloudFrontForwardedProto) || this.getHeader(constants.Headers.ForwardedProto);
    this.referrer = this.getHeader(constants.Headers.Referrer);
    this.userAgent = this.getHeader(constants.Headers.UserAgent);
    this.secFetchDest = this.getHeader(constants.Headers.SecFetchDest);
    this.accept = this.getHeader(constants.Headers.Accept);
  }
  initCookieValues() {
    this.sessionTokenInCookie = this.getSuffixedOrUnSuffixedCookie(constants.Cookies.Session);
    this.refreshTokenInCookie = this.getSuffixedCookie(constants.Cookies.Refresh);
    this.clientUat = Number.parseInt(this.getSuffixedOrUnSuffixedCookie(constants.Cookies.ClientUat) || "") || 0;
  }
  initHandshakeValues() {
    this.devBrowserToken = this.getQueryParam(constants.QueryParameters.DevBrowser) || this.getSuffixedOrUnSuffixedCookie(constants.Cookies.DevBrowser);
    this.handshakeToken = this.getQueryParam(constants.QueryParameters.Handshake) || this.getCookie(constants.Cookies.Handshake);
    this.handshakeRedirectLoopCounter = Number(this.getCookie(constants.Cookies.RedirectCount)) || 0;
  }
  stripAuthorizationHeader(authValue) {
    return authValue?.replace("Bearer ", "");
  }
  getQueryParam(name) {
    return this.clerkRequest.clerkUrl.searchParams.get(name);
  }
  getHeader(name) {
    return this.clerkRequest.headers.get(name) || void 0;
  }
  getCookie(name) {
    return this.clerkRequest.cookies.get(name) || void 0;
  }
  getSuffixedCookie(name) {
    return this.getCookie(getSuffixedCookieName(name, this.cookieSuffix)) || void 0;
  }
  getSuffixedOrUnSuffixedCookie(cookieName) {
    if (this.usesSuffixedCookies()) {
      return this.getSuffixedCookie(cookieName);
    }
    return this.getCookie(cookieName);
  }
  tokenHasIssuer(token) {
    const { data, errors } = decodeJwt(token);
    if (errors) {
      return false;
    }
    return !!data.payload.iss;
  }
  tokenBelongsToInstance(token) {
    if (!token) {
      return false;
    }
    const { data, errors } = decodeJwt(token);
    if (errors) {
      return false;
    }
    const tokenIssuer = data.payload.iss.replace(/https?:\/\//gi, "");
    return this.frontendApi === tokenIssuer;
  }
  sessionExpired(jwt) {
    return !!jwt && jwt?.payload.exp <= Date.now() / 1e3 >> 0;
  }
};
var createAuthenticateContext = async (clerkRequest, options) => {
  const cookieSuffix = options.publishableKey ? await getCookieSuffix(options.publishableKey, runtime.crypto.subtle) : "";
  return new AuthenticateContext(cookieSuffix, clerkRequest, options);
};
var getCookieName = (cookieDirective) => {
  return cookieDirective.split(";")[0]?.split("=")[0];
};
var getCookieValue = (cookieDirective) => {
  return cookieDirective.split(";")[0]?.split("=")[1];
};
async function verifyHandshakeJwt(token, { key }) {
  const { data: decoded, errors } = decodeJwt(token);
  if (errors) {
    throw errors[0];
  }
  const { header, payload } = decoded;
  const { typ, alg } = header;
  assertHeaderType(typ);
  assertHeaderAlgorithm(alg);
  const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
  if (signatureErrors) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Error verifying handshake token. ${signatureErrors[0]}`
    });
  }
  if (!signatureValid) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenInvalidSignature,
      message: "Handshake signature is invalid."
    });
  }
  return payload;
}
async function verifyHandshakeToken(token, options) {
  const { secretKey, apiUrl, apiVersion, jwksCacheTtlInMs, jwtKey, skipJwksCache } = options;
  const { data, errors } = decodeJwt(token);
  if (errors) {
    throw errors[0];
  }
  const { kid } = data.header;
  let key;
  if (jwtKey) {
    key = loadClerkJWKFromLocal(jwtKey);
  } else if (secretKey) {
    key = await loadClerkJWKFromRemote({ secretKey, apiUrl, apiVersion, kid, jwksCacheTtlInMs, skipJwksCache });
  } else {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.SetClerkJWTKey,
      message: "Failed to resolve JWK during handshake verification.",
      reason: TokenVerificationErrorReason.JWKFailedToResolve
    });
  }
  return await verifyHandshakeJwt(token, {
    key
  });
}
var RefreshTokenErrorReason = {
  NonEligibleNoCookie: "non-eligible-no-refresh-cookie",
  NonEligibleNonGet: "non-eligible-non-get",
  InvalidSessionToken: "invalid-session-token",
  MissingApiClient: "missing-api-client",
  MissingSessionToken: "missing-session-token",
  MissingRefreshToken: "missing-refresh-token",
  ExpiredSessionTokenDecodeFailed: "expired-session-token-decode-failed",
  ExpiredSessionTokenMissingSidClaim: "expired-session-token-missing-sid-claim",
  FetchError: "fetch-error",
  UnexpectedSDKError: "unexpected-sdk-error",
  UnexpectedBAPIError: "unexpected-bapi-error"
};
function assertSignInUrlExists(signInUrl, key) {
  if (!signInUrl && isDevelopmentFromSecretKey(key)) {
    throw new Error(`Missing signInUrl. Pass a signInUrl for dev instances if an app is satellite`);
  }
}
function assertProxyUrlOrDomain(proxyUrlOrDomain) {
  if (!proxyUrlOrDomain) {
    throw new Error(`Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl`);
  }
}
function assertSignInUrlFormatAndOrigin(_signInUrl, origin) {
  let signInUrl;
  try {
    signInUrl = new URL(_signInUrl);
  } catch {
    throw new Error(`The signInUrl needs to have a absolute url format.`);
  }
  if (signInUrl.origin === origin) {
    throw new Error(`The signInUrl needs to be on a different origin than your satellite application.`);
  }
}
function isRequestEligibleForHandshake(authenticateContext) {
  const { accept, secFetchDest } = authenticateContext;
  if (secFetchDest === "document" || secFetchDest === "iframe") {
    return true;
  }
  if (!secFetchDest && accept?.startsWith("text/html")) {
    return true;
  }
  return false;
}
function isRequestEligibleForRefresh(err, authenticateContext, request) {
  return err.reason === TokenVerificationErrorReason.TokenExpired && !!authenticateContext.refreshTokenInCookie && request.method === "GET";
}
async function authenticateRequest(request, options) {
  const authenticateContext = await createAuthenticateContext(createClerkRequest(request), options);
  assertValidSecretKey(authenticateContext.secretKey);
  if (authenticateContext.isSatellite) {
    assertSignInUrlExists(authenticateContext.signInUrl, authenticateContext.secretKey);
    if (authenticateContext.signInUrl && authenticateContext.origin) {
      assertSignInUrlFormatAndOrigin(authenticateContext.signInUrl, authenticateContext.origin);
    }
    assertProxyUrlOrDomain(authenticateContext.proxyUrl || authenticateContext.domain);
  }
  const organizationSyncTargetMatchers = computeOrganizationSyncTargetMatchers(options.organizationSyncOptions);
  function removeDevBrowserFromURL(url) {
    const updatedURL = new URL(url);
    updatedURL.searchParams.delete(constants.QueryParameters.DevBrowser);
    updatedURL.searchParams.delete(constants.QueryParameters.LegacyDevBrowser);
    return updatedURL;
  }
  function buildRedirectToHandshake({ handshakeReason }) {
    const redirectUrl = removeDevBrowserFromURL(authenticateContext.clerkUrl);
    const frontendApiNoProtocol = authenticateContext.frontendApi.replace(/http(s)?:\/\//, "");
    const url = new URL(`https://${frontendApiNoProtocol}/v1/client/handshake`);
    url.searchParams.append("redirect_url", redirectUrl?.href || "");
    url.searchParams.append(
      constants.QueryParameters.SuffixedCookies,
      authenticateContext.usesSuffixedCookies().toString()
    );
    url.searchParams.append(constants.QueryParameters.HandshakeReason, handshakeReason);
    if (authenticateContext.instanceType === "development" && authenticateContext.devBrowserToken) {
      url.searchParams.append(constants.QueryParameters.DevBrowser, authenticateContext.devBrowserToken);
    }
    const toActivate = getOrganizationSyncTarget(
      authenticateContext.clerkUrl,
      options.organizationSyncOptions,
      organizationSyncTargetMatchers
    );
    if (toActivate) {
      const params = getOrganizationSyncQueryParams(toActivate);
      params.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }
    return new Headers({ [constants.Headers.Location]: url.href });
  }
  async function resolveHandshake() {
    const headers = new Headers({
      "Access-Control-Allow-Origin": "null",
      "Access-Control-Allow-Credentials": "true"
    });
    const handshakePayload = await verifyHandshakeToken(authenticateContext.handshakeToken, authenticateContext);
    const cookiesToSet = handshakePayload.handshake;
    let sessionToken = "";
    cookiesToSet.forEach((x) => {
      headers.append("Set-Cookie", x);
      if (getCookieName(x).startsWith(constants.Cookies.Session)) {
        sessionToken = getCookieValue(x);
      }
    });
    if (authenticateContext.instanceType === "development") {
      const newUrl = new URL(authenticateContext.clerkUrl);
      newUrl.searchParams.delete(constants.QueryParameters.Handshake);
      newUrl.searchParams.delete(constants.QueryParameters.HandshakeHelp);
      headers.append(constants.Headers.Location, newUrl.toString());
      headers.set(constants.Headers.CacheControl, "no-store");
    }
    if (sessionToken === "") {
      return signedOut(authenticateContext, AuthErrorReason.SessionTokenMissing, "", headers);
    }
    const { data, errors: [error] = [] } = await verifyToken(sessionToken, authenticateContext);
    if (data) {
      return signedIn(authenticateContext, data, headers, sessionToken);
    }
    if (authenticateContext.instanceType === "development" && (error?.reason === TokenVerificationErrorReason.TokenExpired || error?.reason === TokenVerificationErrorReason.TokenNotActiveYet || error?.reason === TokenVerificationErrorReason.TokenIatInTheFuture)) {
      error.tokenCarrier = "cookie";
      console.error(
        `Clerk: Clock skew detected. This usually means that your system clock is inaccurate. Clerk will attempt to account for the clock skew in development.

To resolve this issue, make sure your system's clock is set to the correct time (e.g. turn off and on automatic time synchronization).

---

${error.getFullMessage()}`
      );
      const { data: retryResult, errors: [retryError] = [] } = await verifyToken(sessionToken, {
        ...authenticateContext,
        clockSkewInMs: 864e5
      });
      if (retryResult) {
        return signedIn(authenticateContext, retryResult, headers, sessionToken);
      }
      throw retryError;
    }
    throw error;
  }
  async function refreshToken(authenticateContext2) {
    if (!options.apiClient) {
      return {
        data: null,
        error: {
          message: "An apiClient is needed to perform token refresh.",
          cause: { reason: RefreshTokenErrorReason.MissingApiClient }
        }
      };
    }
    const { sessionToken: expiredSessionToken, refreshTokenInCookie: refreshToken2 } = authenticateContext2;
    if (!expiredSessionToken) {
      return {
        data: null,
        error: {
          message: "Session token must be provided.",
          cause: { reason: RefreshTokenErrorReason.MissingSessionToken }
        }
      };
    }
    if (!refreshToken2) {
      return {
        data: null,
        error: {
          message: "Refresh token must be provided.",
          cause: { reason: RefreshTokenErrorReason.MissingRefreshToken }
        }
      };
    }
    const { data: decodeResult, errors: decodedErrors } = decodeJwt(expiredSessionToken);
    if (!decodeResult || decodedErrors) {
      return {
        data: null,
        error: {
          message: "Unable to decode the expired session token.",
          cause: { reason: RefreshTokenErrorReason.ExpiredSessionTokenDecodeFailed, errors: decodedErrors }
        }
      };
    }
    if (!decodeResult?.payload?.sid) {
      return {
        data: null,
        error: {
          message: "Expired session token is missing the `sid` claim.",
          cause: { reason: RefreshTokenErrorReason.ExpiredSessionTokenMissingSidClaim }
        }
      };
    }
    try {
      const tokenResponse = await options.apiClient.sessions.refreshSession(decodeResult.payload.sid, {
        expired_token: expiredSessionToken || "",
        refresh_token: refreshToken2 || "",
        request_origin: authenticateContext2.clerkUrl.origin,
        // The refresh endpoint expects headers as Record<string, string[]>, so we need to transform it.
        request_headers: Object.fromEntries(Array.from(request.headers.entries()).map(([k, v]) => [k, [v]]))
      });
      return { data: tokenResponse.jwt, error: null };
    } catch (err) {
      if (err?.errors?.length) {
        if (err.errors[0].code === "unexpected_error") {
          return {
            data: null,
            error: {
              message: `Fetch unexpected error`,
              cause: { reason: RefreshTokenErrorReason.FetchError, errors: err.errors }
            }
          };
        }
        return {
          data: null,
          error: {
            message: err.errors[0].code,
            cause: { reason: err.errors[0].code, errors: err.errors }
          }
        };
      } else {
        return {
          data: null,
          error: {
            message: `Unexpected Server/BAPI error`,
            cause: { reason: RefreshTokenErrorReason.UnexpectedBAPIError, errors: [err] }
          }
        };
      }
    }
  }
  async function attemptRefresh(authenticateContext2) {
    const { data: sessionToken, error } = await refreshToken(authenticateContext2);
    if (!sessionToken) {
      return { data: null, error };
    }
    const { data: jwtPayload, errors } = await verifyToken(sessionToken, authenticateContext2);
    if (errors) {
      return {
        data: null,
        error: {
          message: `Clerk: unable to verify refreshed session token.`,
          cause: { reason: RefreshTokenErrorReason.InvalidSessionToken, errors }
        }
      };
    }
    return { data: { jwtPayload, sessionToken }, error: null };
  }
  function handleMaybeHandshakeStatus(authenticateContext2, reason, message, headers) {
    if (isRequestEligibleForHandshake(authenticateContext2)) {
      const handshakeHeaders = headers ?? buildRedirectToHandshake({ handshakeReason: reason });
      if (handshakeHeaders.get(constants.Headers.Location)) {
        handshakeHeaders.set(constants.Headers.CacheControl, "no-store");
      }
      const isRedirectLoop = setHandshakeInfiniteRedirectionLoopHeaders(handshakeHeaders);
      if (isRedirectLoop) {
        const msg = `Clerk: Refreshing the session token resulted in an infinite redirect loop. This usually means that your Clerk instance keys do not match - make sure to copy the correct publishable and secret keys from the Clerk dashboard.`;
        console.log(msg);
        return signedOut(authenticateContext2, reason, message);
      }
      return handshake(authenticateContext2, reason, message, handshakeHeaders);
    }
    return signedOut(authenticateContext2, reason, message);
  }
  function handleMaybeOrganizationSyncHandshake(authenticateContext2, auth) {
    const organizationSyncTarget = getOrganizationSyncTarget(
      authenticateContext2.clerkUrl,
      options.organizationSyncOptions,
      organizationSyncTargetMatchers
    );
    if (!organizationSyncTarget) {
      return null;
    }
    let mustActivate = false;
    if (organizationSyncTarget.type === "organization") {
      if (organizationSyncTarget.organizationSlug && organizationSyncTarget.organizationSlug !== auth.orgSlug) {
        mustActivate = true;
      }
      if (organizationSyncTarget.organizationId && organizationSyncTarget.organizationId !== auth.orgId) {
        mustActivate = true;
      }
    }
    if (organizationSyncTarget.type === "personalAccount" && auth.orgId) {
      mustActivate = true;
    }
    if (!mustActivate) {
      return null;
    }
    if (authenticateContext2.handshakeRedirectLoopCounter > 0) {
      console.warn(
        "Clerk: Organization activation handshake loop detected. This is likely due to an invalid organization ID or slug. Skipping organization activation."
      );
      return null;
    }
    const handshakeState = handleMaybeHandshakeStatus(
      authenticateContext2,
      AuthErrorReason.ActiveOrganizationMismatch,
      ""
    );
    if (handshakeState.status !== "handshake") {
      return null;
    }
    return handshakeState;
  }
  async function authenticateRequestWithTokenInHeader() {
    const { sessionTokenInHeader } = authenticateContext;
    try {
      const { data, errors } = await verifyToken(sessionTokenInHeader, authenticateContext);
      if (errors) {
        throw errors[0];
      }
      return signedIn(authenticateContext, data, void 0, sessionTokenInHeader);
    } catch (err) {
      return handleError(err, "header");
    }
  }
  function setHandshakeInfiniteRedirectionLoopHeaders(headers) {
    if (authenticateContext.handshakeRedirectLoopCounter === 3) {
      return true;
    }
    const newCounterValue = authenticateContext.handshakeRedirectLoopCounter + 1;
    const cookieName = constants.Cookies.RedirectCount;
    headers.append("Set-Cookie", `${cookieName}=${newCounterValue}; SameSite=Lax; HttpOnly; Max-Age=3`);
    return false;
  }
  function handleHandshakeTokenVerificationErrorInDevelopment(error) {
    if (error.reason === TokenVerificationErrorReason.TokenInvalidSignature) {
      const msg = `Clerk: Handshake token verification failed due to an invalid signature. If you have switched Clerk keys locally, clear your cookies and try again.`;
      throw new Error(msg);
    }
    throw new Error(`Clerk: Handshake token verification failed: ${error.getFullMessage()}.`);
  }
  async function authenticateRequestWithTokenInCookie() {
    const hasActiveClient = authenticateContext.clientUat;
    const hasSessionToken = !!authenticateContext.sessionTokenInCookie;
    const hasDevBrowserToken = !!authenticateContext.devBrowserToken;
    if (authenticateContext.handshakeToken) {
      try {
        return await resolveHandshake();
      } catch (error) {
        if (error instanceof TokenVerificationError && authenticateContext.instanceType === "development") {
          handleHandshakeTokenVerificationErrorInDevelopment(error);
        } else {
          console.error("Clerk: unable to resolve handshake:", error);
        }
      }
    }
    if (authenticateContext.instanceType === "development" && authenticateContext.clerkUrl.searchParams.has(constants.QueryParameters.DevBrowser)) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserSync, "");
    }
    const isRequestEligibleForMultiDomainSync = authenticateContext.isSatellite && authenticateContext.secFetchDest === "document";
    if (authenticateContext.instanceType === "production" && isRequestEligibleForMultiDomainSync) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SatelliteCookieNeedsSyncing, "");
    }
    if (authenticateContext.instanceType === "development" && isRequestEligibleForMultiDomainSync) {
      const redirectURL = new URL(authenticateContext.signInUrl);
      redirectURL.searchParams.append(
        constants.QueryParameters.ClerkRedirectUrl,
        authenticateContext.clerkUrl.toString()
      );
      redirectURL.searchParams.append(
        constants.QueryParameters.HandshakeReason,
        AuthErrorReason.SatelliteCookieNeedsSyncing
      );
      const headers = new Headers({ [constants.Headers.Location]: redirectURL.toString() });
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SatelliteCookieNeedsSyncing, "", headers);
    }
    const redirectUrl = new URL(authenticateContext.clerkUrl).searchParams.get(
      constants.QueryParameters.ClerkRedirectUrl
    );
    if (authenticateContext.instanceType === "development" && !authenticateContext.isSatellite && redirectUrl) {
      const redirectBackToSatelliteUrl = new URL(redirectUrl);
      if (authenticateContext.devBrowserToken) {
        redirectBackToSatelliteUrl.searchParams.append(
          constants.QueryParameters.DevBrowser,
          authenticateContext.devBrowserToken
        );
      }
      redirectBackToSatelliteUrl.searchParams.append(constants.QueryParameters.ClerkSynced, "true");
      const authErrReason = AuthErrorReason.PrimaryRespondsToSyncing;
      redirectBackToSatelliteUrl.searchParams.append(constants.QueryParameters.HandshakeReason, authErrReason);
      const headers = new Headers({ [constants.Headers.Location]: redirectBackToSatelliteUrl.toString() });
      return handleMaybeHandshakeStatus(authenticateContext, authErrReason, "", headers);
    }
    if (authenticateContext.instanceType === "development" && !hasDevBrowserToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserMissing, "");
    }
    if (!hasActiveClient && !hasSessionToken) {
      return signedOut(authenticateContext, AuthErrorReason.SessionTokenAndUATMissing, "");
    }
    if (!hasActiveClient && hasSessionToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenWithoutClientUAT, "");
    }
    if (hasActiveClient && !hasSessionToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.ClientUATWithoutSessionToken, "");
    }
    const { data: decodeResult, errors: decodedErrors } = decodeJwt(authenticateContext.sessionTokenInCookie);
    if (decodedErrors) {
      return handleError(decodedErrors[0], "cookie");
    }
    if (decodeResult.payload.iat < authenticateContext.clientUat) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenIATBeforeClientUAT, "");
    }
    try {
      const { data, errors } = await verifyToken(authenticateContext.sessionTokenInCookie, authenticateContext);
      if (errors) {
        throw errors[0];
      }
      const signedInRequestState = signedIn(
        authenticateContext,
        data,
        void 0,
        authenticateContext.sessionTokenInCookie
      );
      const handshakeRequestState = handleMaybeOrganizationSyncHandshake(
        authenticateContext,
        signedInRequestState.toAuth()
      );
      if (handshakeRequestState) {
        return handshakeRequestState;
      }
      return signedInRequestState;
    } catch (err) {
      return handleError(err, "cookie");
    }
    return signedOut(authenticateContext, AuthErrorReason.UnexpectedError);
  }
  async function handleError(err, tokenCarrier) {
    if (!(err instanceof TokenVerificationError)) {
      return signedOut(authenticateContext, AuthErrorReason.UnexpectedError);
    }
    let refreshError;
    if (isRequestEligibleForRefresh(err, authenticateContext, request)) {
      const { data, error } = await attemptRefresh(authenticateContext);
      if (data) {
        return signedIn(authenticateContext, data.jwtPayload, void 0, data.sessionToken);
      }
      if (error?.cause?.reason) {
        refreshError = error.cause.reason;
      } else {
        refreshError = RefreshTokenErrorReason.UnexpectedSDKError;
      }
    } else {
      if (request.method !== "GET") {
        refreshError = RefreshTokenErrorReason.NonEligibleNonGet;
      } else if (!authenticateContext.refreshTokenInCookie) {
        refreshError = RefreshTokenErrorReason.NonEligibleNoCookie;
      } else {
        refreshError = null;
      }
    }
    err.tokenCarrier = tokenCarrier;
    const reasonToHandshake = [
      TokenVerificationErrorReason.TokenExpired,
      TokenVerificationErrorReason.TokenNotActiveYet,
      TokenVerificationErrorReason.TokenIatInTheFuture
    ].includes(err.reason);
    if (reasonToHandshake) {
      return handleMaybeHandshakeStatus(
        authenticateContext,
        convertTokenVerificationErrorReasonToAuthErrorReason({ tokenError: err.reason, refreshError }),
        err.getFullMessage()
      );
    }
    return signedOut(authenticateContext, err.reason, err.getFullMessage());
  }
  if (authenticateContext.sessionTokenInHeader) {
    return authenticateRequestWithTokenInHeader();
  }
  return authenticateRequestWithTokenInCookie();
}
var debugRequestState = (params) => {
  const { isSignedIn, proxyUrl, reason, message, publishableKey, isSatellite, domain } = params;
  return { isSignedIn, proxyUrl, reason, message, publishableKey, isSatellite, domain };
};
function computeOrganizationSyncTargetMatchers(options) {
  let personalAccountMatcher = null;
  if (options?.personalAccountPatterns) {
    try {
      personalAccountMatcher = match(options.personalAccountPatterns);
    } catch (e) {
      throw new Error(`Invalid personal account pattern "${options.personalAccountPatterns}": "${e}"`);
    }
  }
  let organizationMatcher = null;
  if (options?.organizationPatterns) {
    try {
      organizationMatcher = match(options.organizationPatterns);
    } catch (e) {
      throw new Error(`Clerk: Invalid organization pattern "${options.organizationPatterns}": "${e}"`);
    }
  }
  return {
    OrganizationMatcher: organizationMatcher,
    PersonalAccountMatcher: personalAccountMatcher
  };
}
function getOrganizationSyncTarget(url, options, matchers) {
  if (!options) {
    return null;
  }
  if (matchers.OrganizationMatcher) {
    let orgResult;
    try {
      orgResult = matchers.OrganizationMatcher(url.pathname);
    } catch (e) {
      console.error(`Clerk: Failed to apply organization pattern "${options.organizationPatterns}" to a path`, e);
      return null;
    }
    if (orgResult && "params" in orgResult) {
      const params = orgResult.params;
      if ("id" in params && typeof params.id === "string") {
        return { type: "organization", organizationId: params.id };
      }
      if ("slug" in params && typeof params.slug === "string") {
        return { type: "organization", organizationSlug: params.slug };
      }
      console.warn(
        "Clerk: Detected an organization pattern match, but no organization ID or slug was found in the URL. Does the pattern include `:id` or `:slug`?"
      );
    }
  }
  if (matchers.PersonalAccountMatcher) {
    let personalResult;
    try {
      personalResult = matchers.PersonalAccountMatcher(url.pathname);
    } catch (e) {
      console.error(`Failed to apply personal account pattern "${options.personalAccountPatterns}" to a path`, e);
      return null;
    }
    if (personalResult) {
      return { type: "personalAccount" };
    }
  }
  return null;
}
function getOrganizationSyncQueryParams(toActivate) {
  const ret = /* @__PURE__ */ new Map();
  if (toActivate.type === "personalAccount") {
    ret.set("organization_id", "");
  }
  if (toActivate.type === "organization") {
    if (toActivate.organizationId) {
      ret.set("organization_id", toActivate.organizationId);
    }
    if (toActivate.organizationSlug) {
      ret.set("organization_id", toActivate.organizationSlug);
    }
  }
  return ret;
}
var convertTokenVerificationErrorReasonToAuthErrorReason = ({
  tokenError,
  refreshError
}) => {
  switch (tokenError) {
    case TokenVerificationErrorReason.TokenExpired:
      return `${AuthErrorReason.SessionTokenExpired}-refresh-${refreshError}`;
    case TokenVerificationErrorReason.TokenNotActiveYet:
      return AuthErrorReason.SessionTokenNBF;
    case TokenVerificationErrorReason.TokenIatInTheFuture:
      return AuthErrorReason.SessionTokenIatInTheFuture;
    default:
      return AuthErrorReason.UnexpectedError;
  }
};
function mergePreDefinedOptions(preDefinedOptions, options) {
  return Object.keys(preDefinedOptions).reduce(
    (obj, key) => {
      return { ...obj, [key]: options[key] || obj[key] };
    },
    { ...preDefinedOptions }
  );
}
var defaultOptions = {
  secretKey: "",
  jwtKey: "",
  apiUrl: void 0,
  apiVersion: void 0,
  proxyUrl: "",
  publishableKey: "",
  isSatellite: false,
  domain: "",
  audience: ""
};
function createAuthenticateRequest(params) {
  const buildTimeOptions = mergePreDefinedOptions(defaultOptions, params.options);
  const apiClient = params.apiClient;
  const authenticateRequest2 = (request, options = {}) => {
    const { apiUrl, apiVersion } = buildTimeOptions;
    const runTimeOptions = mergePreDefinedOptions(buildTimeOptions, options);
    return authenticateRequest(request, {
      ...options,
      ...runTimeOptions,
      // We should add all the omitted props from options here (eg apiUrl / apiVersion)
      // to avoid runtime options override them.
      apiUrl,
      apiVersion,
      apiClient
    });
  };
  return {
    authenticateRequest: authenticateRequest2,
    debugRequestState
  };
}
function isTruthy(value) {
  if (typeof value === `boolean`) {
    return value;
  }
  if (value === void 0 || value === null) {
    return false;
  }
  if (typeof value === `string`) {
    if (value.toLowerCase() === `true`) {
      return true;
    }
    if (value.toLowerCase() === `false`) {
      return false;
    }
  }
  const number = parseInt(value, 10);
  if (isNaN(number)) {
    return false;
  }
  if (number > 0) {
    return true;
  }
  return false;
}
var DEFAULT_CACHE_TTL_MS = 864e5;
var _storageKey, _cacheTtl, _TelemetryEventThrottler_instances, generateKey_fn, cache_get, isValidBrowser_get;
var TelemetryEventThrottler = class {
  constructor() {
    __privateAdd(this, _TelemetryEventThrottler_instances);
    __privateAdd(this, _storageKey, "clerk_telemetry_throttler");
    __privateAdd(this, _cacheTtl, DEFAULT_CACHE_TTL_MS);
  }
  isEventThrottled(payload) {
    var _a;
    if (!__privateGet(this, _TelemetryEventThrottler_instances, isValidBrowser_get)) {
      return false;
    }
    const now = Date.now();
    const key = __privateMethod(this, _TelemetryEventThrottler_instances, generateKey_fn).call(this, payload);
    const entry = (_a = __privateGet(this, _TelemetryEventThrottler_instances, cache_get)) == null ? void 0 : _a[key];
    if (!entry) {
      const updatedCache = {
        ...__privateGet(this, _TelemetryEventThrottler_instances, cache_get),
        [key]: now
      };
      localStorage.setItem(__privateGet(this, _storageKey), JSON.stringify(updatedCache));
    }
    const shouldInvalidate = entry && now - entry > __privateGet(this, _cacheTtl);
    if (shouldInvalidate) {
      const updatedCache = __privateGet(this, _TelemetryEventThrottler_instances, cache_get);
      delete updatedCache[key];
      localStorage.setItem(__privateGet(this, _storageKey), JSON.stringify(updatedCache));
    }
    return !!entry;
  }
};
_storageKey = /* @__PURE__ */ new WeakMap();
_cacheTtl = /* @__PURE__ */ new WeakMap();
_TelemetryEventThrottler_instances = /* @__PURE__ */ new WeakSet();
generateKey_fn = function(event) {
  const { sk: _sk, pk: _pk, payload, ...rest } = event;
  const sanitizedEvent = {
    ...payload,
    ...rest
  };
  return JSON.stringify(
    Object.keys({
      ...payload,
      ...rest
    }).sort().map((key) => sanitizedEvent[key])
  );
};
cache_get = function() {
  const cacheString = localStorage.getItem(__privateGet(this, _storageKey));
  if (!cacheString) {
    return {};
  }
  return JSON.parse(cacheString);
};
isValidBrowser_get = function() {
  if (typeof window === "undefined") {
    return false;
  }
  const storage = window.localStorage;
  if (!storage) {
    return false;
  }
  try {
    const testKey = "test";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    const isQuotaExceededError = err instanceof DOMException && // Check error names for different browsers
    (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
    if (isQuotaExceededError && storage.length > 0) {
      storage.removeItem(__privateGet(this, _storageKey));
    }
    return false;
  }
};
var DEFAULT_CONFIG = {
  samplingRate: 1,
  maxBufferSize: 5,
  // Production endpoint: https://clerk-telemetry.com
  // Staging endpoint: https://staging.clerk-telemetry.com
  // Local: http://localhost:8787
  endpoint: "https://clerk-telemetry.com"
};
var _config, _eventThrottler, _metadata, _buffer, _pendingFlush, _TelemetryCollector_instances, shouldRecord_fn, shouldBeSampled_fn, scheduleFlush_fn, flush_fn, logEvent_fn, getSDKMetadata_fn, preparePayload_fn;
var TelemetryCollector = class {
  constructor(options) {
    __privateAdd(this, _TelemetryCollector_instances);
    __privateAdd(this, _config);
    __privateAdd(this, _eventThrottler);
    __privateAdd(this, _metadata, {});
    __privateAdd(this, _buffer, []);
    __privateAdd(this, _pendingFlush);
    var _a, _b, _c, _d, _e, _f;
    __privateSet(this, _config, {
      maxBufferSize: (_a = options.maxBufferSize) != null ? _a : DEFAULT_CONFIG.maxBufferSize,
      samplingRate: (_b = options.samplingRate) != null ? _b : DEFAULT_CONFIG.samplingRate,
      disabled: (_c = options.disabled) != null ? _c : false,
      debug: (_d = options.debug) != null ? _d : false,
      endpoint: DEFAULT_CONFIG.endpoint
    });
    if (!options.clerkVersion && typeof window === "undefined") {
      __privateGet(this, _metadata).clerkVersion = "";
    } else {
      __privateGet(this, _metadata).clerkVersion = (_e = options.clerkVersion) != null ? _e : "";
    }
    __privateGet(this, _metadata).sdk = options.sdk;
    __privateGet(this, _metadata).sdkVersion = options.sdkVersion;
    __privateGet(this, _metadata).publishableKey = (_f = options.publishableKey) != null ? _f : "";
    const parsedKey = parsePublishableKey(options.publishableKey);
    if (parsedKey) {
      __privateGet(this, _metadata).instanceType = parsedKey.instanceType;
    }
    if (options.secretKey) {
      __privateGet(this, _metadata).secretKey = options.secretKey.substring(0, 16);
    }
    __privateSet(this, _eventThrottler, new TelemetryEventThrottler());
  }
  get isEnabled() {
    var _a;
    if (__privateGet(this, _metadata).instanceType !== "development") {
      return false;
    }
    if (__privateGet(this, _config).disabled || typeof process !== "undefined" && isTruthy(process.env.CLERK_TELEMETRY_DISABLED)) {
      return false;
    }
    if (typeof window !== "undefined" && !!((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.webdriver)) {
      return false;
    }
    return true;
  }
  get isDebug() {
    return __privateGet(this, _config).debug || typeof process !== "undefined" && isTruthy(process.env.CLERK_TELEMETRY_DEBUG);
  }
  record(event) {
    const preparedPayload = __privateMethod(this, _TelemetryCollector_instances, preparePayload_fn).call(this, event.event, event.payload);
    __privateMethod(this, _TelemetryCollector_instances, logEvent_fn).call(this, preparedPayload.event, preparedPayload);
    if (!__privateMethod(this, _TelemetryCollector_instances, shouldRecord_fn).call(this, preparedPayload, event.eventSamplingRate)) {
      return;
    }
    __privateGet(this, _buffer).push(preparedPayload);
    __privateMethod(this, _TelemetryCollector_instances, scheduleFlush_fn).call(this);
  }
};
_config = /* @__PURE__ */ new WeakMap();
_eventThrottler = /* @__PURE__ */ new WeakMap();
_metadata = /* @__PURE__ */ new WeakMap();
_buffer = /* @__PURE__ */ new WeakMap();
_pendingFlush = /* @__PURE__ */ new WeakMap();
_TelemetryCollector_instances = /* @__PURE__ */ new WeakSet();
shouldRecord_fn = function(preparedPayload, eventSamplingRate) {
  return this.isEnabled && !this.isDebug && __privateMethod(this, _TelemetryCollector_instances, shouldBeSampled_fn).call(this, preparedPayload, eventSamplingRate);
};
shouldBeSampled_fn = function(preparedPayload, eventSamplingRate) {
  const randomSeed = Math.random();
  if (__privateGet(this, _eventThrottler).isEventThrottled(preparedPayload)) {
    return false;
  }
  return randomSeed <= __privateGet(this, _config).samplingRate && (typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate);
};
scheduleFlush_fn = function() {
  if (typeof window === "undefined") {
    __privateMethod(this, _TelemetryCollector_instances, flush_fn).call(this);
    return;
  }
  const isBufferFull = __privateGet(this, _buffer).length >= __privateGet(this, _config).maxBufferSize;
  if (isBufferFull) {
    if (__privateGet(this, _pendingFlush)) {
      const cancel = typeof cancelIdleCallback !== "undefined" ? cancelIdleCallback : clearTimeout;
      cancel(__privateGet(this, _pendingFlush));
    }
    __privateMethod(this, _TelemetryCollector_instances, flush_fn).call(this);
    return;
  }
  if (__privateGet(this, _pendingFlush)) {
    return;
  }
  if ("requestIdleCallback" in window) {
    __privateSet(this, _pendingFlush, requestIdleCallback(() => {
      __privateMethod(this, _TelemetryCollector_instances, flush_fn).call(this);
    }));
  } else {
    __privateSet(this, _pendingFlush, setTimeout(() => {
      __privateMethod(this, _TelemetryCollector_instances, flush_fn).call(this);
    }, 0));
  }
};
flush_fn = function() {
  fetch(new URL("/v1/event", __privateGet(this, _config).endpoint), {
    method: "POST",
    // TODO: We send an array here with that idea that we can eventually send multiple events.
    body: JSON.stringify({
      events: __privateGet(this, _buffer)
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).catch(() => void 0).then(() => {
    __privateSet(this, _buffer, []);
  }).catch(() => void 0);
};
logEvent_fn = function(event, payload) {
  if (!this.isDebug) {
    return;
  }
  if (typeof console.groupCollapsed !== "undefined") {
    console.groupCollapsed("[clerk/telemetry]", event);
    console.log(payload);
    console.groupEnd();
  } else {
    console.log("[clerk/telemetry]", event, payload);
  }
};
getSDKMetadata_fn = function() {
  let sdkMetadata = {
    name: __privateGet(this, _metadata).sdk,
    version: __privateGet(this, _metadata).sdkVersion
  };
  if (typeof window !== "undefined" && window.Clerk) {
    sdkMetadata = { ...sdkMetadata, ...window.Clerk.constructor.sdkMetadata };
  }
  return sdkMetadata;
};
preparePayload_fn = function(event, payload) {
  var _a, _b;
  const sdkMetadata = __privateMethod(this, _TelemetryCollector_instances, getSDKMetadata_fn).call(this);
  return {
    event,
    cv: (_a = __privateGet(this, _metadata).clerkVersion) != null ? _a : "",
    it: (_b = __privateGet(this, _metadata).instanceType) != null ? _b : "",
    sdk: sdkMetadata.name,
    sdkv: sdkMetadata.version,
    ...__privateGet(this, _metadata).publishableKey ? { pk: __privateGet(this, _metadata).publishableKey } : {},
    ...__privateGet(this, _metadata).secretKey ? { sk: __privateGet(this, _metadata).secretKey } : {},
    payload
  };
};
function createClerkClient(options) {
  const opts = { ...options };
  const apiClient = createBackendApiClient(opts);
  const requestState = createAuthenticateRequest({ options: opts, apiClient });
  const telemetry = new TelemetryCollector({
    ...options.telemetry,
    publishableKey: opts.publishableKey,
    secretKey: opts.secretKey,
    ...opts.sdkMetadata ? { sdk: opts.sdkMetadata.name, sdkVersion: opts.sdkMetadata.version } : {}
  });
  return {
    ...apiClient,
    ...requestState,
    telemetry
  };
}
const DATABASE_URL = "libsql://smartpalms-gregoryerrl.aws-us-west-2.turso.io";
const DATABASE_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzYzMzU2MTcsImlkIjoiNjkyYmVhZGYtZDk1My00OGRiLTlkYjktOTBlNmNlZmMyYTI4IiwicmlkIjoiNGQ0YzhhNDMtMmFmNi00ZWY2LTlhNTQtZTg3OGEzNDBjODY0In0.DNUMVLI06kc5YysH5IV_l__5gfdvjXJQonsrqpHzZYK1_AmbfIgJAbS6-2jFS7ntEa-TedmAtTDhDQBToTrkCQ";
const CLERK_SECRET_KEY = "sk_test_IGc1GH4KYRg8wvGNr7rlnRRWcfQhHLZcyH7pM5W3od";
const MAIL = "/var/mail/gregoryerrl";
const LANGUAGE = "en_PH:en";
const USER = "gregoryerrl";
const npm_config_user_agent = "npm/11.0.0 node/v22.12.0 linux x64 workspaces/false";
const XDG_SEAT = "seat0";
const XDG_SESSION_TYPE = "tty";
const npm_node_execpath = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/bin/node";
const SHLVL = "1";
const npm_config_noproxy = "";
const MOTD_SHOWN = "pam";
const HOME = "/home/gregoryerrl";
const OLDPWD = "/home/gregoryerrl/Projects/web";
const NVM_BIN = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/bin";
const npm_package_json = "/home/gregoryerrl/Projects/web/smartpalms/package.json";
const NVM_INC = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/include/node";
const HUSHLOGIN = "FALSE";
const npm_config_userconfig = "/home/gregoryerrl/.npmrc";
const npm_config_local_prefix = "/home/gregoryerrl/Projects/web/smartpalms";
const SYSTEMD_EXEC_PID = "653";
const COLOR = "1";
const NVM_DIR = "/home/gregoryerrl/.nvm";
const LOGNAME = "gregoryerrl";
const WINDOWID = "35651596";
const _ = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/bin/npm";
const npm_config_prefix = "/home/gregoryerrl/.nvm/versions/node/v22.12.0";
const npm_config_npm_version = "11.0.0";
const XTERM_SHELL = "/bin/bash";
const XDG_SESSION_CLASS = "user";
const TERM = "xterm";
const XDG_SESSION_ID = "1";
const npm_config_cache = "/home/gregoryerrl/.npm";
const WINDOWPATH = "1";
const npm_config_node_gyp = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js";
const PATH = "/home/gregoryerrl/Projects/web/smartpalms/node_modules/.bin:/home/gregoryerrl/Projects/web/node_modules/.bin:/home/gregoryerrl/Projects/node_modules/.bin:/home/gregoryerrl/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/home/gregoryerrl/.nvm/versions/node/v22.12.0/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/home/gregoryerrl/.nvm/versions/node/v22.12.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games";
const INVOCATION_ID = "d359dc526ed24166965d29f0171b024e";
const NODE = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/bin/node";
const npm_package_name = "smartpalms-svelte";
const XDG_RUNTIME_DIR = "/run/user/1000";
const DISPLAY = ":0";
const LANG = "en_PH.UTF-8";
const XAUTHORITY = "/home/gregoryerrl/.Xauthority";
const LS_COLORS = "rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=00:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.avif=01;35:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.webp=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:*~=00;90:*#=00;90:*.bak=00;90:*.old=00;90:*.orig=00;90:*.part=00;90:*.rej=00;90:*.swp=00;90:*.tmp=00;90:*.dpkg-dist=00;90:*.dpkg-old=00;90:*.ucf-dist=00;90:*.ucf-new=00;90:*.ucf-old=00;90:*.rpmnew=00;90:*.rpmorig=00;90:*.rpmsave=00;90:";
const npm_lifecycle_script = "npm install --legacy-peer-deps && vite build";
const SHELL = "/bin/bash";
const npm_package_version = "0.0.1";
const npm_lifecycle_event = "build";
const XDG_VTNR = "1";
const npm_config_globalconfig = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/etc/npmrc";
const npm_config_init_module = "/home/gregoryerrl/.npm-init.js";
const PWD = "/home/gregoryerrl/Projects/web/smartpalms";
const npm_execpath = "/home/gregoryerrl/.nvm/versions/node/v22.12.0/lib/node_modules/npm/bin/npm-cli.js";
const XTERM_LOCALE = "en_PH.UTF-8";
const NVM_CD_FLAGS = "";
const XDG_DATA_DIRS = "/home/gregoryerrl/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share/:/usr/share/";
const npm_config_global_prefix = "/home/gregoryerrl/.nvm/versions/node/v22.12.0";
const XTERM_VERSION = "XTerm(379)";
const npm_command = "run-script";
const I3SOCK = "/run/user/1000/i3/ipc-socket.1060";
const INIT_CWD = "/home/gregoryerrl/Projects/web/smartpalms";
const EDITOR = "vi";
const NODE_ENV = "production";
const envPrivate = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CLERK_SECRET_KEY,
  COLOR,
  DATABASE_AUTH_TOKEN,
  DATABASE_URL,
  DISPLAY,
  EDITOR,
  HOME,
  HUSHLOGIN,
  I3SOCK,
  INIT_CWD,
  INVOCATION_ID,
  LANG,
  LANGUAGE,
  LOGNAME,
  LS_COLORS,
  MAIL,
  MOTD_SHOWN,
  NODE,
  NODE_ENV,
  NVM_BIN,
  NVM_CD_FLAGS,
  NVM_DIR,
  NVM_INC,
  OLDPWD,
  PATH,
  PWD,
  SHELL,
  SHLVL,
  SYSTEMD_EXEC_PID,
  TERM,
  USER,
  WINDOWID,
  WINDOWPATH,
  XAUTHORITY,
  XDG_DATA_DIRS,
  XDG_RUNTIME_DIR,
  XDG_SEAT,
  XDG_SESSION_CLASS,
  XDG_SESSION_ID,
  XDG_SESSION_TYPE,
  XDG_VTNR,
  XTERM_LOCALE,
  XTERM_SHELL,
  XTERM_VERSION,
  _,
  npm_command,
  npm_config_cache,
  npm_config_global_prefix,
  npm_config_globalconfig,
  npm_config_init_module,
  npm_config_local_prefix,
  npm_config_node_gyp,
  npm_config_noproxy,
  npm_config_npm_version,
  npm_config_prefix,
  npm_config_user_agent,
  npm_config_userconfig,
  npm_execpath,
  npm_lifecycle_event,
  npm_lifecycle_script,
  npm_node_execpath,
  npm_package_json,
  npm_package_name,
  npm_package_version
}, Symbol.toStringTag, { value: "Module" }));
function getPublicEnv(name, defaultValue = "") {
  return name in envPublic ? envPublic[name] : defaultValue;
}
function getPrivateEnv(name, defaultValue = "") {
  return name in envPrivate ? envPrivate[name] : defaultValue;
}
const API_VERSION = getPublicEnv("PUBLIC_CLERK_API_VERSION", "v1");
const PUBLISHABLE_KEY = getPublicEnv("PUBLIC_CLERK_PUBLISHABLE_KEY");
const API_URL = getPublicEnv("PUBLIC_CLERK_API_URL", "https://api.clerk.com");
const TELEMETRY_DISABLED = isTruthy(getPublicEnv("PUBLIC_CLERK_TELEMETRY_DISABLED"));
const TELEMETRY_DEBUG = isTruthy(getPublicEnv("PUBLIC_CLERK_TELEMETRY_DEBUG"));
const SECRET_KEY = getPrivateEnv("CLERK_SECRET_KEY");
const JWT_KEY = getPrivateEnv("CLERK_JWT_KEY");
const { Cookies, Headers: Headers$1 } = constants;
const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
  apiUrl: API_URL,
  apiVersion: API_VERSION,
  jwtKey: JWT_KEY,
  telemetry: {
    disabled: TELEMETRY_DISABLED,
    debug: TELEMETRY_DEBUG
  }
});
function createCurrentUser(auth) {
  return async () => {
    if (!auth.userId) {
      return null;
    }
    const user = await clerkClient.users.getUser(auth.userId);
    return user;
  };
}
function withClerkHandler(middlewareOptions) {
  return async ({ event, resolve }) => {
    const { debug = false, ...options } = {};
    const clerkWebRequest = createClerkRequest(event.request);
    if (debug) {
      console.log("[svelte-clerk] " + JSON.stringify(clerkWebRequest.toJSON()));
    }
    const requestState = await clerkClient.authenticateRequest(clerkWebRequest, {
      ...options,
      secretKey: options?.secretKey ?? SECRET_KEY,
      publishableKey: options?.publishableKey ?? PUBLISHABLE_KEY
    });
    const locationHeader = requestState.headers.get(Headers$1.Location);
    if (locationHeader) {
      if (debug) {
        console.log("[svelte-clerk] Handshake redirect triggered");
      }
      return new Response(null, { status: 307, headers: requestState.headers });
    }
    if (requestState.status === AuthStatus.Handshake) {
      throw new Error("[svelte-clerk] Handshake status without redirect");
    }
    const authObject = requestState.toAuth();
    decorateLocals(event, authObject);
    if (debug) {
      console.log("[svelte-clerk] " + JSON.stringify(authObject));
    }
    decorateHeaders(event, requestState.headers);
    return resolve(event);
  };
}
function decorateHeaders(event, headers) {
  const setCookie = headers.get("set-cookie");
  if (setCookie) {
    const parsedCookies = parse$2(setCookie);
    parsedCookies.forEach((parsedCookie) => {
      const { name, value, ...options } = parsedCookie;
      event.cookies.set(name, value, options);
    });
    headers.delete("set-cookie");
  }
  event.setHeaders(Object.fromEntries(headers));
}
function decorateLocals(event, authObject) {
  event.locals.auth = authObject;
  event.locals.currentUser = createCurrentUser(authObject);
}
const handle = withClerkHandler();
export {
  handle
};
