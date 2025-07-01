import { makeElement } from "../../framework/dom.js";
import { getState, setState } from "../../framework/state.js";
import { navigate } from "../../framework/router.js";

export function TodoFooter() {
  const state = getState();

  const remaining = state.todos.filter(todo => !todo.completed).length;
  const hasCompleted = state.todos.some(todo => todo.completed);

  return makeElement("footer", { class: "footer" }, [
    makeElement("span", { class: "todo-count" }, [
      makeElement("strong", {}, remaining),
      `${remaining} item${remaining !== 1 ? "s" : ""} left`,
    ]),

    makeElement("ul", { class: "filters" }, [
      makeElement("li", {}, [
        makeElement(
          "a",
          {
            href: "#all",
            class: state.filter === "all" ? "selected" : "",
            onClick: () => navigate("/all"),
          },
          "All"
        ),
      ]),
      makeElement("li", {}, [
        makeElement(
          "a",
          {
            href: "#active",
            class: state.filter === "active" ? "selected" : "",
            onClick: () => navigate("/active"),
          },
          "Active"
        ),
      ]),
      makeElement("li", {}, [
        makeElement(
          "a",
          {
            href: "#completed",
            class: state.filter === "completed" ? "selected" : "",
            onClick: () => navigate("/completed"),
          },
          "Completed"
        ),
      ]),
    ]),

    hasCompleted
      ? makeElement(
          "button",
          {
            class: "clear-completed",
            onClick: () => {
              setState({
                ...state,
                todos: state.todos.filter((t) => !t.completed),
              });
            },
          },
          "Clear completed"
        )
      : null,
  ]);
}
