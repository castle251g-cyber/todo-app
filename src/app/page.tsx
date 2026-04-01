"use client";

import { useState, useEffect, useRef } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.done).length;

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">やること</h1>
          <p className="subtitle">
            {activeCount > 0
              ? `${activeCount} 件の未完了タスク`
              : "すべて完了しています"}
          </p>
        </div>

        {/* Input */}
        <div className="input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="タスクを入力..."
            className="input"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="add-btn"
          >
            追加
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tab${filter === f ? " active" : ""}`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="task-list">
          {filtered.length === 0 && (
            <div className="empty">タスクがありません</div>
          )}
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`task-item${task.done ? " done" : ""}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`check-btn${task.done ? " checked" : ""}`}
              >
                {task.done && (
                  <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span className={`task-text${task.done ? " done" : ""}`}>
                {task.text}
              </span>

              {/* Delete */}
              <button onClick={() => deleteTask(task.id)} className="delete-btn">
                <svg className="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Clear done */}
        {tasks.some((t) => t.done) && (
          <div className="clear-row">
            <button
              onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
              className="clear-btn"
            >
              完了済みを削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
