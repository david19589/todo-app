import { useState } from "react";
import Header from "./components/header";
import TodoList from "./components/todo-list";
import clsx from "clsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={clsx(
        darkMode ? "bg-[#171823]" : "bg-[#FAFAFA]",
        "min-h-screen"
      )}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <TodoList darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
