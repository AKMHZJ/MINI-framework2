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

  const left = remainingCount(state.todos);
  const anyDone = state.todos.some((t) => t.completed);
  const allDone = state.todos.length && state.todos.every((t) => t.completed);
  const list = visible(state.todos, state.filter);

  return makeElement("div", {}, [
    makeElement("section", { class: "todoapp", id: "root" }, [
      /* ---------- header ---------- */
      makeElement("header", { class: "header", "data-testid": "header" }, [
        makeElement("h1", {}, "todos"),

        /* div.input-container + label (exact like React demo) */
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
                if (v.length >= 2) { // Check for 2+ characters
                  setState({
                    ...state,
                    todos: [
                      ...state.todos,
                      { id: Date.now(), text: v, completed: false },
                    ],
                  });
                  setText("");
                  e.target.value = "";
                }
              }
            },
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
                  ...state,
                  todos: state.todos.map((t) => ({ ...t, completed: !allDone })),
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
                          ...state,
                          todos: state.todos.map((t) =>
                            t.id === todo.id
                              ? { ...t, completed: !t.completed }
                              : t
                          ),
                        }),
                    }),
                    
                    // This is the key change - single input that transforms
                    editing ? 
                      makeElement("input", {
                        class: "edit",
                        id: `edit-${todo.id}`,
                        value: todo.text,
                        autofocus: true,
                        onInput: (e) => {
                          // Update the todo text directly during editing
                          setState({
                            ...state,
                            todos: state.todos.map((t) =>
                              t.id === todo.id ? { ...t, text: e.target.value } : t
                            ),
                          });
                        },
                        onKeyDown: (e) => {
                          if (e.key === "Escape") {
                            // Cancel editing - restore original text
                            setState({
                              ...state,
                              editingId: null,
                            });
                          } else if (e.key === "Enter") {
                            const v = todo.text.trim();
                            if (v.length >= 2) { // Check for 2+ characters
                              setState({
                                ...state,
                                todos: state.todos.map((t) =>
                                  t.id === todo.id ? { ...t, text: v } : t
                                ),
                                editingId: null,
                              });
                            } else {
                              // Delete todo if less than 2 characters
                              setState({
                                ...state,
                                todos: state.todos.filter((t) => t.id !== todo.id),
                                editingId: null,
                              });
                            }
                          }
                        },
                        onBlur: () => {
                          const v = todo.text.trim();
                          if (v.length >= 2) {
                            setState({
                              ...state,
                              todos: state.todos.map((t) =>
                                t.id === todo.id ? { ...t, text: v } : t
                              ),
                              editingId: null,
                            });
                          } else {
                            // Delete todo if less than 2 characters
                            setState({
                              ...state,
                              todos: state.todos.filter((t) => t.id !== todo.id),
                              editingId: null,
                            });
                          }
                        },
                      })
                    :
                      makeElement(
                        "label",
                        {
                          "data-testid": "todo-item-label",
                          ondblclick: () => {
                            setState({
                              ...state,
                              editingId: todo.id,
                            });
                            /* wait for DOM update, then focus & select */
                            setTimeout(() => {
                              const inp = document.getElementById(`edit-${todo.id}`);
                              if (inp) {
                                inp.focus();
                                inp.setSelectionRange(
                                  inp.value.length,
                                  inp.value.length
                                );
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
                          ...state,
                          todos: state.todos.filter((t) => t.id !== todo.id),
                        }),
                    }),
                  ]),
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
            `${left} ${plural(left)} left!`
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

          makeElement(
            "button",
            {
              class: "clear-completed",
              onClick: () => {
                /* remove only completed items; if none, state stays the same */
                const remaining = state.todos.filter((t) => !t.completed);
                if (remaining.length !== state.todos.length) {
                  setState({ ...state, todos: remaining });
                }
              },
            },
            "Clear completed"
          ),
        ]
      ),
    ]),
    makeElement("footer", { class: "info" }, [
      makeElement("p", {}, "Double-click to edit a todo"),
      makeElement("p", {}, "Created by mini-framework team"),
      makeElement("p", {}, "Part of TodoMVC"),
    ]),
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
  { path: "/active", view: TodoApp },
  { path: "/completed", view: TodoApp },
]);
initRouter();











// Remplacez la section de l'input d'édition dans votre code par ceci :

editing
  ? makeElement("input", {
      class: "edit",
      id: `edit-${todo.id}`,
      value: state.editValue,
      autofocus: true,
      onInput: (e) =>
        setState({ ...state, editValue: e.target.value }),
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setState({
            ...state,
            editingId: null,
            editValue: "",
          });
        }
        // Correction : utiliser onKeyDown au lieu de onKeyPress
        if (e.key === "Enter") {
          const v = state.editValue.trim();
          if (v.length >= 2) {
            // Sauvegarder les modifications
            setState({
              ...state,
              todos: state.todos.map((t) =>
                t.id === todo.id ? { ...t, text: v } : t
              ),
              editingId: null,
              editValue: "",
            });
          } else {
            // Supprimer le todo si le texte est trop court
            setState({
              ...state,
              todos: state.todos.filter(
                (t) => t.id !== todo.id
              ),
              editingId: null,
              editValue: "",
            });
          }
        }
      },
      // Correction : onBlur sauvegarde maintenant au lieu de juste annuler
      onBlur: () => {
        const v = state.editValue.trim();
        if (v.length >= 2) {
          // Sauvegarder les modifications
          setState({
            ...state,
            todos: state.todos.map((t) =>
              t.id === todo.id ? { ...t, text: v } : t
            ),
            editingId: null,
            editValue: "",
          });
        } else {
          // Si le texte est vide ou trop court, supprimer le todo
          setState({
            ...state,
            todos: state.todos.filter((t) => t.id !== todo.id),
            editingId: null,
            editValue: "",
          });
        }
      },
    })
  : null,