/* ========= framework/router.js – final, with hook-reset ========= */

import { render } from "./dom.js";
import { getState, setState, resetHookIndex } from "./state.js";

let routes = [];
const container = document.getElementById("app");


function matchRoute(hash) {
  const clean = hash.replace(/^#\/?/, "");           
  return (
    routes.find((r) => r.path.slice(1) === clean)  
  );
}

/* central render function */
function renderRoute() {
  const hash  = window.location.hash || "#/all";
  const route = matchRoute(hash) || routes.find(r => r.path === "*");
  if (!route) return;

  /* keep state.filter in sync with the URL */
    if (route.path !== "*") {
  const state      = getState();
  const newFilter  = route.path.slice(1) || "all";
  if (state.filter !== newFilter) {
    setState({ ...state, filter: newFilter });
  }
}

  resetHookIndex();               
  const vnode = route.view();
  render(vnode, container);
}


export function defineRoutes(rs) {
  routes = rs;
}

export function navigate(path /* "/all" | "/active" | "/completed" */) {
  window.location.hash = `#${path}`;
}

export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  renderRoute();                     
}
