import React from "react";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

// モーダルのルート要素を設定
Modal.setAppElement('#root');

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    newTodoName: string;
    newTodoPriority: number;
    newTodoDeadline: Date | null;
    newTodoNameError: string;
    updateNewTodoName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateNewTodoPriority: (e: React.ChangeEvent<HTMLInputElement>) => void; // 型を修正
    updateNewTodoDeadline: (date: Date | null) => void; // 型を修正
    addNewTodo: () => void;
}

const customStyles: Modal.Styles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto', 
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '450px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
};

const AddTodoModal = (props: Props) => {
    const isAddButtonDisabled = props.newTodoNameError !== "" || props.newTodoName.trim() === "";

    // 日付変換用のハンドラー
    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = value ? new Date(value) : null;
        props.updateNewTodoDeadline(date); // Date | null 型の関数を呼び出す
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            style={customStyles}
            contentLabel="新しいタスクの追加"
            >
            <div className="mb-4">
                <h2 className="text-2xl font-bold">新しいタスクを追加</h2>
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
                        <label className="font-bold whitespace-nowrap" htmlFor="newTodoName">
                            名前
                        </label>
                        <input
                            id="newTodoName"
                            type="text"
                            value={props.newTodoName}
                            onChange={props.updateNewTodoName} // Propの関数を使用
                            className={twMerge(
                                "grow rounded-md border p-2",
                                props.newTodoNameError && "border-red-500 outline-red-500"
                            )}
                            placeholder="2文字以上、32文字以内で入力してください"
                        />
                    </div>
                    {props.newTodoNameError && (
                        <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500">
                            <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                className="mr-0.5"
                            />
                            <div>{props.newTodoNameError}</div>
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
                                checked={props.newTodoPriority === value}
                                onChange={props.updateNewTodoPriority} // Propの関数を使用
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
                            props.newTodoDeadline
                                ? dayjs(props.newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                                : ""
                        }
                        onChange={handleDeadlineChange} // 修正したハンドラーを使用
                        className="rounded-md border border-gray-400 px-2 py-0.5"
                    />
                </div>

                {/* 追加ボタン */}
                <button
                    type="button"
                    onClick={props.addNewTodo} // Propの関数を使用
                    disabled={isAddButtonDisabled}
                    className={twMerge(
                        "w-full rounded-md bg-indigo-500 px-3 py-2 text-lg font-bold text-white hover:bg-indigo-600 transition duration-150",
                        isAddButtonDisabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    タスクを追加
                </button>
            </div>

            </Modal>
    )
}

export default AddTodoModal;
