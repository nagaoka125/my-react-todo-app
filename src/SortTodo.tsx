import React, { useState } from "react";
import type { Todo } from "./types";

type Props = {
    todos: Todo[];
    setFilteredTodos: (todos: Todo[]) => void;
};

// ソートコンポーネント
const SortTodo = ({ todos, setFilteredTodos }: Props) => {
    const [sortOption, setSortOption] = useState("default");

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedTodos = [...todos];

    switch (option) {
        // タスクの期限順にソート
        case "deadline":
        sortedTodos.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;

        // タスクの優先度順にソート
        case "priority":
        sortedTodos.sort((a, b) => b.priority - a.priority);
        break;

        // 未完了のタスクだけ表示
        case "incomplete":
        sortedTodos = todos.filter((todo) => !todo.isDone);
        break;

        // 完了済みのタスクだけ表示
        case "complete":
        sortedTodos = todos.filter((todo) => todo.isDone);
        break;
        
        // タスクの追加順にソート
        default:
        sortedTodos = [...todos];
        break;
    }

    setFilteredTodos(sortedTodos);
    };

    return (
    <div className="mb-4">
        <label htmlFor="sort" className="mr-2 font-bold">ソート:</label>
        <select
        id="sort"
        value={sortOption}
        onChange={handleSortChange}
        className="border rounded-md p-1"
        >
        <option value="default">追加順</option>
        <option value="deadline">期限順</option>
        <option value="priority">優先度順</option>
        <option value="incomplete">未完了</option>
        <option value="complete">完了済み</option>
        </select>
    </div>
    );
};

export default SortTodo;