import React from "react";
import type { Todo } from "./types";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoItem = (props: Props) => {
  const todo = props.todo;
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date(); // 期限切れの判定

  return (
    <div className="flex items-center justify-between border rounded-md p-2 mb-2 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
            className="mr-1.5 cursor-pointer"
          />
          <span className={isOverdue ? "text-red-500" : ""}>{todo.name}</span>
        </div>
        <div className="text-sm text-gray-600">
          優先度: {Array(todo.priority).fill("★").join("")}
        </div>
        {todo.deadline ? (
          <div className={`text-sm ${isOverdue ? "text-red-500" : "text-gray-600"}`}>
            期限: {new Date(todo.deadline).toLocaleString()}
          </div>
        ) : (
          <div className="text-sm text-gray-600">期限: 期限なし</div>
        )}
      </div>
      <div>
        <button
          onClick={() => props.remove(todo.id)}
          className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TodoItem;