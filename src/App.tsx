import { useState, useEffect } from "react";
import type { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import AddTodoModal from "./AddTodoModal";
import SortTodo from "./SortTodo";
import { v4 as uuid } from "uuid";
import Modal from "react-modal";
import EditTodoModal from "./EditTodoModal";

// モーダルのルート要素を設定
Modal.setAppElement('#root');

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";
  
  // App コンポーネントの初回実行時のみLocalStorageからTodoデータを復元
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      // LocalStorage にデータがない場合は initTodos をセットする
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  useEffect(() => {
    setFilteredTodos(todos); // 初期状態では全タスクを表示
  }, [todos]);

  const uncompletedCount = todos.filter(
    (todo: Todo) => !todo.isDone
  ).length;

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (date: Date | null) => {
    setNewTodoDeadline(date);
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = value ? new Date(value) : null;
    updateDeadline(date); // Date | null 型の関数を呼び出す
  };

  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoNameError("");
    setShowModal(false);
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowModal(true);
    setNewTodoName(todo.name);
    setNewTodoPriority(todo.priority);
    setNewTodoDeadline(todo.deadline);
  };

  const saveEditedTodo = () => {
    if (!editingTodo) return;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === editingTodo.id) {
        return {
          ...todo,
          name: newTodoName,
          priority: newTodoPriority,
          deadline: newTodoDeadline,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
    setEditingTodo(null);
    setShowModal(false);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Todoアプリ</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="user"
          uncompletedCount={uncompletedCount}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <SortTodo todos={todos} setFilteredTodos={setFilteredTodos} />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600 transition duration-150"
        >
          新しいタスクを追加
        </button>
      </div>
      <TodoList todos={filteredTodos} updateIsDone={updateIsDone} remove={remove} edit={editTodo} />

      <button
        type="button"
        onClick={removeCompletedTodos}
        // Tailwind CSSのクラスを調整し、削除ボタンの配置を修正
        className={"ml-3 mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"}
      >
        完了済みタスクを削除
      </button>

      <div className="sticky bottom-4 flex justify-center">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600 transition duration-150"
        >
          新しいタスクを追加
        </button>
      </div>
      
      {/* AddTodoModalコンポーネントを呼び出し、Propsを渡す */}
      <AddTodoModal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setEditingTodo(null);
          setNewTodoNameError("");
        }}
        
        // Stateの値 (Props)
        newTodoName={newTodoName}
        newTodoPriority={newTodoPriority}
        newTodoDeadline={newTodoDeadline}
        newTodoNameError={newTodoNameError}
        
        // Stateを更新する関数 (Props)
        updateNewTodoName={updateNewTodoName}
        updateNewTodoPriority={updateNewTodoPriority}
        updateNewTodoDeadline={updateDeadline} // 必須プロパティを追加
        addNewTodo={editingTodo ? saveEditedTodo : addNewTodo} // タスク追加ロジック
      />

      <EditTodoModal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setEditingTodo(null);
          setNewTodoNameError("");
        }}
        todoName={newTodoName}
        todoPriority={newTodoPriority}
        todoDeadline={newTodoDeadline}
        todoNameError={newTodoNameError}
        updateTodoName={updateNewTodoName}
        updateTodoPriority={updateNewTodoPriority}
        updateTodoDeadline={updateDeadline}
        saveTodo={editingTodo ? saveEditedTodo : addNewTodo}
      />
    </div>
  );
};

export default App;