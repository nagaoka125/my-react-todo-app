import React from "react";
import Modal from "react-modal";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    todoName: string;
    todoPriority: number;
    todoDeadline: Date | null;
    todoNameError: string;
    updateTodoName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateTodoPriority: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateTodoDeadline: (date: Date | null) => void;
    saveTodo: () => void;
}

const customStyles: Modal.Styles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "450px",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
};

const EditTodoModal = (props: Props) => {
    return (
        <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        style={customStyles}
        contentLabel="タスクの編集"
        >
        <div className="mb-4">
            <h2 className="text-2xl font-bold">タスクを編集</h2>
            <button
            onClick={props.onRequestClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-semibold"
            >
            &times;
            </button>
        </div>

        <div className="space-y-3">
            {/* 名前入力欄 */}
            <div>
            <div className="flex items-center space-x-2">
                <label className="font-bold whitespace-nowrap" htmlFor="todoName">
                名前
                </label>
                <input
                id="todoName"
                type="text"
                value={props.todoName}
                onChange={props.updateTodoName}
                className={twMerge(
                    "grow rounded-md border p-2",
                    props.todoNameError && "border-red-500 outline-red-500"
                )}
                placeholder="2文字以上、32文字以内で入力してください"
                />
            </div>
            {props.todoNameError && (
                <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500">
                <div>{props.todoNameError}</div>
                </div>
            )}
        </div>

        {/* 優先度選択 */}
        <div className="flex gap-5 items-center">
            <div className="font-bold">優先度</div>
            {[1, 2, 3].map((value) => (
                <label key={value} className="flex items-center space-x-1">
                    <input
                        id={`priority-${value}`}
                        name="priorityGroup"
                        type="radio"
                        value={value}
                        checked={props.todoPriority === value}
                        onChange={(e) => props.updateTodoPriority(e)} 
                    />
                    <span>{value}</span>
                </label>
            ))}
        </div>

        {/* 期限設定 */}
        <div className="flex items-center gap-x-2">
            <label htmlFor="deadline" className="font-bold whitespace-nowrap">
                期限
            </label>
            <input
                type="datetime-local"
                id="deadline"
                value={
                props.todoDeadline
                    ? dayjs(props.todoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                    : ""
                }
                onChange={(e) => {
                const value = e.target.value;
                const date = value ? new Date(value) : null;
                props.updateTodoDeadline(date);
                }}
                className="rounded-md border border-gray-400 px-2 py-0.5"
            />
        </div>

        {/* 保存ボタン */}
        <button
            type="button"
            onClick={props.saveTodo}
            className="w-full rounded-md bg-indigo-500 px-3 py-2 text-lg font-bold text-white hover:bg-indigo-600 transition duration-150"
            >
            保存
            </button>
        </div>
        </Modal>
    );
};

export default EditTodoModal;