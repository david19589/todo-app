import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import checkSvg from "/src/assets/icon-check.svg";

type TodoItem = {
  id: string;
  todo: string;
};

function TodoList(props: {
  darkMode: boolean;
  setDarkMode: (status: boolean) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [todo, setTodo] = useState<TodoItem[]>([]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [newTodo, setNewTodo] = useState("");

  const itemsLeft = todo.filter((item) => !checked[item.id]).length;

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/todo");
      setTodo(response.data);
    };

    fetchData();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/todo", {
        todo: newTodo,
      });
      setTodo([...todo, response.data]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleDeleteTodo = async () => {
    const completedTodo = todo.filter((item) => checked[item.id]);

    try {
      await Promise.all(
        completedTodo.map((item) =>
          axios.delete(`http://localhost:5000/todo/${item.id}`)
        )
      );
      setTodo(todo.filter((item) => !checked[item.id]));
      setChecked((prev) => {
        const newChecked = { ...prev };
        completedTodo.forEach((item) => {
          delete newChecked[item.id];
        });
        return newChecked;
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="flex flex-col items-center translate-y-[-6rem] mx-[1.5rem]">
      <div
        className={clsx(
          props.darkMode
            ? "bg-[#25273D] text-[#C8CBE7]"
            : "bg-[#FFF] text-[#494C6B]",
          "flex items-center max-w-[33.75rem] w-full px-[1.3rem] py-[1rem] rounded-lg mb-[1rem]"
        )}
      >
        <span
          className={clsx(
            props.darkMode ? "border-[#393A4B]" : "border-[#E3E4F1]",
            "flex max-w-[1.25rem] w-full h-[1.25rem] border-[0.0625rem] mr-[1rem] rounded-full"
          )}
        />
        <input
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
          type="text"
          id="input"
          placeholder="Create a new todo…"
          className={clsx(
            props.darkMode ? "bg-[#25273D]" : "bg-[#FFF]",
            "md:text-[1.15rem] md:leading-[1.15rem] md:tracking-[-0.0175rem] text-[0.75rem] leading-[0.75rem] tracking-[-0.01rem] w-full outline-none rounded-lg"
          )}
        />
      </div>
      <div
        className={clsx(
          props.darkMode ? "bg-[#25273D]" : "bg-[#FFF] shadow-custom-shadow",
          "flex flex-col items-center max-w-[33.75rem] w-full px-[1.3rem] py-[1rem] rounded-lg mb-[1rem]"
        )}
      >
        <div className="max-w-[33.75rem] w-full">
          {todo.map((item) => (
            <div
              key={item.id}
              className={clsx(
                checked[item.id] || filter !== "Completed" ? "flex" : "hidden",
                !checked[item.id] || filter !== "Active" ? "flex" : "hidden",
                "flex flex-col"
              )}
            >
              <div
                onClick={() => toggleCheck(item.id)}
                className={clsx(
                  props.darkMode ? "text-[#C8CBE7]" : "text-[#494C6B]",
                  "flex items-center mb-[1rem] cursor-pointer group"
                )}
              >
                <span
                  className={clsx(
                    props.darkMode ? "border-[#393A4B]" : "border-[#E3E4F1]",
                    checked[item.id]
                      ? "bg-gradient-to-t from-[#55DDFF] to-[#C058F3]"
                      : "group-hover:border-[#55DDFF]",
                    "flex items-center justify-center max-w-[1.25rem] w-full h-[1.25rem] border-[0.0625rem] mr-[1rem] rounded-full transition-all duration-150"
                  )}
                >
                  <img
                    className={clsx(
                      checked[item.id] ? "flex" : "hidden",
                      "w-[0.6rem] h-[0.6rem]"
                    )}
                    src={checkSvg}
                    alt="checkSvg"
                  />
                </span>
                <h2
                  className={clsx(
                    checked[item.id] && "text-[#D1D2DA] line-through",
                    checked[item.id] && props.darkMode && "text-[#4D5067]",
                    props.darkMode ? "text-[#C8CBE7]" : "text-[#494C6B]",
                    "md:text-[1.15rem] md:leading-[1.15rem] md:tracking-[-0.0175rem] text-[0.75rem] leading-[0.75rem] tracking-[-0.01rem]"
                  )}
                >
                  {item.todo}
                </h2>
              </div>
              <span
                className={clsx(
                  props.darkMode ? "bg-[#393A4B]" : "bg-[#E3E4F1]",
                  "flex w-full h-[0.0625rem] mb-[1rem]"
                )}
              ></span>
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full">
          <h3
            className={clsx(
              props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
              "md:text-[1.15rem] md:leading-[1.15rem] md:tracking-[-0.0175rem] text-[0.75rem] leading-[0.75rem] tracking-[-0.01rem]"
            )}
          >
            {itemsLeft} items left
          </h3>
          <div className="md:flex hidden gap-[1.3rem]">
            <h2
              onClick={() => {
                setFilter("All");
              }}
              className={clsx(
                filter === "All"
                  ? "text-[#3A7CFD] cursor-default"
                  : [
                      props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                      "cursor-pointer hover:text-[#494C6B]",
                    ],
                "text-[0.9rem] leading-[1.1rem] tracking-[-0.01rem] font-[700] transition-all duration-150"
              )}
            >
              All
            </h2>
            <h2
              onClick={() => {
                setFilter("Active");
              }}
              className={clsx(
                filter === "Active"
                  ? "text-[#3A7CFD] cursor-default"
                  : [
                      props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                      "cursor-pointer hover:text-[#494C6B]",
                    ],
                "text-[0.9rem] leading-[1.1rem] tracking-[-0.01rem] font-[700] transition-all duration-150"
              )}
            >
              Active
            </h2>
            <h2
              onClick={() => {
                setFilter("Completed");
              }}
              className={clsx(
                filter === "Completed"
                  ? "text-[#3A7CFD] cursor-default"
                  : [
                      props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                      "cursor-pointer hover:text-[#494C6B]",
                    ],
                "text-[0.9rem] leading-[1.1rem] tracking-[-0.01rem] font-[700] transition-all duration-150"
              )}
            >
              Completed
            </h2>
          </div>
          <button
            onClick={handleDeleteTodo}
            className={clsx(
              props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
              "md:text-[1.15rem] md:leading-[1.15rem] md:tracking-[-0.0175rem] text-[0.75rem] leading-[0.75rem] tracking-[-0.01rem] outline-none cursor-pointer hover:text-[#494C6B] transition-all duration-150"
            )}
          >
            Clear Completed
          </button>
        </div>
      </div>
      <div
        className={clsx(
          props.darkMode ? "bg-[#25273D]" : "bg-[#FFF] shadow-custom-shadow",
          "md:hidden flex items-center justify-evenly max-w-[33.75rem] w-full px-[1.3rem] py-[1rem] rounded-lg mb-[1rem]"
        )}
      >
        <h2
          className={clsx(
            filter === "All"
              ? "text-[#3A7CFD] cursor-default"
              : [
                  props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                  "cursor-pointer hover:text-[#494C6B]",
                ],
            "text-[0.9rem] leading-[0.9rem] tracking-[-0.01rem] font-[700] cursor-pointer hover:text-[#494C6B] transition-all duration-200"
          )}
        >
          All
        </h2>
        <h2
          className={clsx(
            filter === "Active"
              ? "text-[#3A7CFD] cursor-default"
              : [
                  props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                  "cursor-pointer hover:text-[#494C6B]",
                ],
            "text-[0.9rem] leading-[0.9rem] tracking-[-0.01rem] font-[700] cursor-pointer hover:text-[#494C6B] transition-all duration-200"
          )}
        >
          Active
        </h2>
        <h2
          className={clsx(
            filter === "Completed"
              ? "text-[#3A7CFD] cursor-default"
              : [
                  props.darkMode ? "text-[#5B5E7E]" : "text-[#9495A5]",
                  "cursor-pointer hover:text-[#494C6B]",
                ],
            "text-[0.9rem] leading-[0.9rem] tracking-[-0.01rem] font-[700] cursor-pointer hover:text-[#494C6B] transition-all duration-200"
          )}
        >
          Completed
        </h2>
      </div>
    </div>
  );
}

export default TodoList;
