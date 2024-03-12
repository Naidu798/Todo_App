import React, { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { v4 as uuidv4 } from "uuid";
import EditTodo from "./EditTodo";

const TodoApp = () => {
  const [todosList, setTodosList] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [showEdit, setShowEdit] = useState({ open: false, itemId: null });
  const [editInput, setEditInput] = useState("");

  const addTodoItem = () => {
    if (todoInput.trim() === "") {
      setTodoInput("");
      return;
    }

    const task = todoInput.split(" ");
    const lastItem = task.pop();
    if (isNaN(lastItem)) {
      const todoItem = {
        id: uuidv4(),
        task: todoInput,
        updatedCount: 0,
      };
      setTodosList((prev) => [...prev, todoItem]);
      localStorage.setItem(
        "todosList",
        JSON.stringify([...todosList, todoItem])
      );
    } else {
      const multipleTodos = [];
      for (let i = 0; i < parseInt(lastItem); i++) {
        const todoItem = {
          id: uuidv4(),
          task: task.join(" "),
          updatedCount: 0,
        };
        multipleTodos.push(todoItem);
      }
      setTodosList((prev) => [...prev, ...multipleTodos]);
      localStorage.setItem(
        "todosList",
        JSON.stringify([...todosList, ...multipleTodos])
      );
    }
    setTodoInput("");
  };

  const deleteTodo = (id) => {
    const filteredList = todosList.filter((todo) => todo.id !== id);
    setTodosList([...filteredList]);
    localStorage.setItem("todosList", JSON.stringify([...filteredList]));
  };

  const saveTodo = () => {
    const updatedList = todosList.map((todo) =>
      todo.id === showEdit.itemId
        ? { ...todo, updatedCount: todo.updatedCount + 1, task: editInput }
        : todo
    );
    setTodosList(updatedList);
    localStorage.setItem("todosList", JSON.stringify(updatedList));
    setShowEdit({ open: false, itemId: null });
  };

  useEffect(() => {
    const todosList = JSON.parse(localStorage.getItem("todosList"));
    if (todosList) {
      setTodosList(todosList);
    }
  }, []);

  return (
    <div
      className={`relative w-screen h-screen flex justify-center items-start pt-10 text-white bg-[#3c6374]`}
    >
      <div
        className={`bg-[#2d2962] px-3 md:px-6 py-4 rounded-lg w-[85%] h-[90vh] md:w-[50%] ${
          showEdit.open && "blur"
        }`}
      >
        <h1 className="text-4xl text-center mb-10 font-bold">Day Goals !</h1>
        <div>
          <input
            type="text"
            className="h-10 w-[90%] rounded-md outline-none text-gray-800 font-semibold px-3 text-md"
            placeholder="Enter Todo Here"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
          />
          <br />
          <button
            className="bg-blue-900 rounded-md py-1.5 px-6 text-md mt-3"
            onClick={addTodoItem}
          >
            Add Todo
          </button>
        </div>
        <h2 className="mt-7 mb-3 text-xl font-semibold">My Tasks</h2>
        <ul className="px-3 h-[50vh] overflow-auto custom-scrollbar">
          {todosList.length > 0 ? (
            todosList.map((todo) => {
              return (
                <li className="bg-[#2f4e87] rounded-md px-2 py-2 text-lg flex items-center justify-between my-3">
                  <p>
                    {todo.task}
                    <span className="ml-3 text-sm">{`( Updated ${
                      todo.updatedCount
                    } ${todo.updatedCount === 1 ? "time" : "times"} )`}</span>
                  </p>
                  <div className="flex items-center gap-4 pr-3">
                    <MdModeEditOutline
                      className="text-xl"
                      onClick={() => {
                        setEditInput(todo.task);
                        setShowEdit({ open: true, itemId: todo.id });
                      }}
                    />
                    <RxCross2
                      className="text-lg text-red-700"
                      onClick={() => deleteTodo(todo.id)}
                    />
                  </div>
                </li>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <span className="text-lg font-normal">No Tasks</span>
            </div>
          )}
        </ul>
      </div>
      {showEdit.open && (
        <EditTodo
          setEditInput={setEditInput}
          setShowEdit={setShowEdit}
          editInput={editInput}
          saveTodo={saveTodo}
        />
      )}
    </div>
  );
};

export default TodoApp;
