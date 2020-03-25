import nextCookies from 'next-cookies';
import clientCookies from 'js-cookie';

// isomorphic cookie methods

// set cookie only works on client
export function setCookie(key, value) {
  clientCookies.set(key, value);
}

// remove cookie only works on client
export function removeCookie(key) {
  clientCookies.remove(key);
}

export function getCookie(key, ctx) {
  if (ctx) {
    return nextCookies(ctx)[key];
  } else {
    return clientCookies.get(key);
  }
}

