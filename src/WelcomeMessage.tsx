import React from "react";

// 引数の型を定義
type Props = {
  name: string;
  uncompletedCount: number; // 未完了タスクの数を追加
};

// WelcomeMessageコンポーネント
const WelcomeMessage = (props: Props) => {
  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12 ? "おはようございます" : "こんにちは";

  return (
    <div className="text-blue-700 font-bold mb-4 font-size {24px}">
      {greeting}、{props.name}さん。未完了タスクは {props.uncompletedCount} 件です。
    </div>
  );
};

// 他のファイルでWelcomeMessage を import できるようにする
export default WelcomeMessage;