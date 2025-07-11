/* TodoMVC via mini-framework — DOM-perfect output */

import { initEventSystem } from "../framework/event.js";
import { defineRoutes, navigate, initRouter } from "../framework/router.js";
import { makeElement, render } from "../framework/dom.js";
import {
  getState,
  setState,
  subscribe,
  initState,
  resetHookIndex,
  useState,
} from "../framework/state.js";

/* bootstrap ---------------------------------------------------------- */
const root = document.getElementById("app");
initEventSystem(root);

initState({
  todos: [],
  filter: "all",
  editingId: null,
  editValue: "",
  hooks: [],
});

/* helpers ------------------------------------------------------------ */
function remainingCount(todos) {
  return todos.filter((t) => !t.completed).length;
}
function plural(n) {
  return n === 1 ? "item" : "items";
}
function visible(todos, filter) {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

/* main component ----------------------------------------------------- */
function TodoApp() {
  const state = getState();
  const [text, setText] = useState("");

  const handleEditSave = (todoId) => {
    const currentState = getState(); // Always get the latest state
    const v = currentState.editValue.trim();
    if (v && v.length >= 2) {
      setState({
        ...currentState,
        todos: currentState.todos.map((t) =>
          t.id === todoId ? { ...t, text: v } : t
        ),
        editingId: null,
        editValue: "",
      });
    } else {
      setState({
        ...currentState,
        editingId: null,
        editValue: "",
      });
    }
  };

  const left = remainingCount(state.todos);
  const anyDone = state.todos.some((t) => t.completed);
  const allDone = state.todos.length > 0 && state.todos.every((t) => t.completed);
  const list = visible(state.todos, state.filter);

  return makeElement("div", {}, [
    makeElement("section", { class: "todoapp", id: "root" }, [
      /* ---------- header ---------- */
      makeElement("header", { class: "header", "data-testid": "header" }, [
        makeElement("h1", {}, "todos"),

        makeElement("div", { class: "input-container" }, [
          makeElement("input", {
            class: "new-todo",
            id: "todo-input",
            type: "text",
            placeholder: "What needs to be done?",
            "data-testid": "text-input",
            value: text,
            onInput: (e) => setText(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                const v = text.trim();
                if (v.length < 2) return;
                setState({
                  ...getState(),
                  todos: [
                    ...getState().todos,
                    { id: Date.now(), text: v, completed: false },
                  ],
                });
                setText("");
                e.target.value = "";
              }
            },
            autoFocus: true,
          }),
          makeElement(
            "label",
            {
              class: "visually-hidden",
              for: "todo-input",
            },
            "New Todo Input"
          ),
        ]),
      ]),

      /* ---------- main ---------- */
      makeElement(
        "main",
        {
          class: "main",
          "data-testid": "main",
          style: state.todos.length ? "display:block" : "display:none",
        },
        [
          makeElement("div", { class: "toggle-all-container" }, [
            makeElement("input", {
              class: "toggle-all",
              id: "toggle-all",
              type: "checkbox",
              "data-testid": "toggle-all",
              checked: allDone,
              onChange: () =>
                setState({
                  ...getState(),
                  todos: getState().todos.map((t) => ({
                    ...t,
                    completed: !allDone,
                  })),
                }),
            }),
            makeElement(
              "label",
              {
                class: "toggle-all-label",
                for: "toggle-all",
              },
              "Toggle All Input"
            ),
          ]),

          makeElement(
            "ul",
            {
              class: "todo-list",
              "data-testid": "todo-list",
            },
            list.map((todo) => {
              const editing = state.editingId === todo.id;
              const liClass = [
                todo.completed ? "completed" : "",
                editing ? "editing" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return makeElement(
                "li",
                {
                  class: liClass,
                  "data-testid": "todo-item",
                  key: todo.id,
                  "data-id": todo.id,
                },
                [
                  makeElement("div", { class: "view" }, [
                    makeElement("input", {
                      class: "toggle",
                      type: "checkbox",
                      "data-testid": "todo-item-toggle",
                      checked: todo.completed,
                      onChange: () =>
                        setState({
                          ...getState(),
                          todos: getState().todos.map((t) =>
                            t.id === todo.id
                              ? { ...t, completed: !t.completed }
                              : t
                          ),
                        }),
                    }),
                    makeElement(
                      "label",
                      {
                        "data-testid": "todo-item-label",
                        ondblclick: () => {
                          setState({
                            ...getState(),
                            editingId: todo.id,
                            editValue: todo.text,
                          });
                          setTimeout(() => {
                            const inp = document.getElementById(
                              `edit-${todo.id}`
                            );
                            if (inp) {
                              inp.focus();
                              inp.select();
                            }
                          }, 0);
                        },
                      },
                      todo.text
                    ),
                    makeElement("button", {
                      class: "destroy",
                      "data-testid": "todo-item-button",
                      onClick: () =>
                        setState({
                          ...getState(),
                          todos: getState().todos.filter(
                            (t) => t.id !== todo.id
                          ),
                        }),
                    }),
                  ]),

                  editing
                    ? makeElement("input", {
                        class: "edit",
                        id: `edit-${todo.id}`,
                        value: state.editValue,
                        autofocus: true,
                        onInput: (e) =>
                          setState({ ...getState(), editValue: e.target.value }),
                        onBlur: () => {
                          if (getState().editingId === todo.id) {
                            handleEditSave(todo.id);
                          }
                        },
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleEditSave(todo.id);
                          }
                          if (e.key === "Escape") {
                            setState({
                              ...getState(),
                              editingId: null,
                              editValue: "",
                            });
                          }
                        },
                      })
                    : null,
                ]
              );
            })
          ),
        ]
      ),

      /* ---------- footer ---------- */
      makeElement(
        "footer",
        {
          class: "footer",
          "data-testid": "footer",
          style: state.todos.length ? "display:block" : "display:none",
        },
        [
          makeElement(
            "span",
            { class: "todo-count" },
            `${left} ${plural(left)} left`
          ),

          makeElement(
            "ul",
            {
              class: "filters",
              "data-testid": "footer-navigation",
            },
            [
              makeElement("li", {}, [
                makeElement(
                  "a",
                  {
                    class: state.filter === "all" ? "selected" : "",
                    href: "#/",
                    onClick: () => navigate("/all"),
                  },
                  "All"
                ),
              ]),
              makeElement("li", {}, [
                makeElement(
                  "a",
                  {
                    class: state.filter === "active" ? "selected" : "",
                    href: "#/active",
                    onClick: () => navigate("/active"),
                  },
                  "Active"
                ),
              ]),
              makeElement("li", {}, [
                makeElement(
                  "a",
                  {
                    class: state.filter === "completed" ? "selected" : "",
                    href: "#/completed",
                    onClick: () => navigate("/completed"),
                  },
                  "Completed"
                ),
              ]),
            ]
          ),

          anyDone
            ? makeElement(
                "button",
                {
                  class: "clear-completed",
                  onClick: () => {
                    setState({
                      ...getState(),
                      todos: getState().todos.filter((t) => !t.completed),
                    });
                  },
                },
                "Clear completed"
              )
            : null,
        ]
      ),
    ]),
    makeElement("footer", { class: "info" }, [
      makeElement("p", {}, "Double-click to edit a todo"),
      makeElement("p", {}, "Created by the mini-framework team"),
      makeElement("p", {}, "Part of TodoMVC"),
    ]),
  ]);
}


function notFound() {
  return makeElement("div", { class: "not-found" }, [
    makeElement("h1", {}, "404 - Page Not Found"),
    makeElement("p", {}, "The page you are looking for does not exist."),
    makeElement("a", { href: "#/", onClick: () => navigate("/") }, "Go to Home"),
  ]);
}

/* reactive render --------------------------------------------------- */
subscribe(() => {
  resetHookIndex();
  render(TodoApp(), root);
});

/* routes ------------------------------------------------------------ */
defineRoutes([
  { path: "/all", view: TodoApp },
  { path: "/", view: TodoApp },  
  { path: "/active", view: TodoApp },
  { path: "/completed", view: TodoApp },
  { path: "*", view: notFound }, 
]);
initRouter();