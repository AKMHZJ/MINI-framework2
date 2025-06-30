import { makeElement } from "../../framework/dom.js";
import { getState, setState, useState } from "../../framework/state.js";

export function TodoItem(todo) {
  const state = getState();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const liClass = [
    todo.completed ? "completed" : "",
    isEditing ? "editing" : "",
  ].filter(Boolean).join(" ");

  return makeElement("li", { class: liClass, key: todo.id }, [
    makeElement("div", { class: "view" }, [
      makeElement("input", {
        class: "toggle",
        type: "checkbox",
        checked: todo.completed,
        onChange: () => {
          setState({
            ...state,
            todos: state.todos.map((t) =>
              t.id === todo.id ? { ...t, completed: !t.completed } : t
            ),
          });
        },
      }),
      makeElement("label", {
        ondblclick: () => {
          setIsEditing(true);
          setEditValue(todo.text);
        },
      }, todo.text),
      makeElement("button", {
        class: "destroy",
        onClick: () => {
          setState({
            ...state,
            todos: state.todos.filter((t) => t.id !== todo.id),
          });
        },
      }),
    ]),
    isEditing
      ? makeElement("input", {
          class: "edit",
          id: `edit-${todo.id}`, // ← NEW
          value: editValue,
          onInput: (e) => setEditValue(e.target.value),
          onKeyPress: (e) => {
            if (e.key === "Enter") {
              setState({
                ...state,
                todos: state.todos.map((t) =>
                  t.id === todo.id ? { ...t, text: editValue } : t
                ),
              });
              setIsEditing(false);
            }
          },
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setIsEditing(false);
            }
          },
          onBlur: () => {
            setIsEditing(false);
          },
        })
      : null,
  ]);
}
