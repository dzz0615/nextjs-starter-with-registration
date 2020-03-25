import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import absoluteUrl from 'next-absolute-url';
import { setCookie, getCookie, removeCookie } from './cookie';

function isomorphicRedirect(url, ctx) {
  if (ctx) {
    ctx.res.writeHead(302, { Location: url });
    ctx.res.end();
    return;
  } else {
    return Router.push(url);
  }
}

export function generateHeaders(ctx) {
  const token = getCookie('token', ctx);
  if (!token) {
    return {};
  }

  return {
    'Content-Type': 'application/json',
    Authorization: JSON.stringify({ token }),
  };
}

async function fetchWithAuth(url, method, body, ctx) {
  const token = getCookie('token', ctx);
  if (!token) {
    return isomorphicRedirect('/login', ctx);
  }

  const origin = ctx ? absoluteUrl(ctx.req).origin : '';
  const response = await fetch(`${origin}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: JSON.stringify({ token }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // if not authorized response, redirect and logout
  if (response.status === 401) {
    isomorphicRedirect('/login', ctx);
    removeCookie('token');
    throw new Error('Not authorized');
  }
  // for all other responses, throw the error
  else if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

async function fetchIsomorphic(url, method, body, ctx) {
  const origin = ctx ? absoluteUrl(ctx.req).origin : '';
  const response = await fetch(`${origin}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // if not authorized response, redirect and logout
  if (response.status === 401) {
    throw new Error('Not authorized');
  }
  // for all other responses, throw the error
  else if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// set auth token used for requests
// NOTE: this function can only be called on client side
export function setToken(token) {
  if (!token) {
    removeCookie('token');
  } else {
    setCookie('token', token);
  }
}

export function getWithAuth(url, ctx) {
  return fetchWithAuth(url, 'GET', null, ctx);
}

export function get(url, ctx) {
  return fetchIsomorphic(url, 'GET', null, ctx);
}

export function postWithAuth(url, body, ctx) {
  return fetchWithAuth(url, 'POST', body, ctx);
}

export function post(url, body, ctx) {
  return fetchIsomorphic(url, 'POST', body, ctx);
}

export function putWithAuth(url, body, ctx) {
  return fetchWithAuth(url, 'PUT', body, ctx);
}

export function put(url, body, ctx) {
  return fetchIsomorphic(url, 'PUT', body, ctx);
}
