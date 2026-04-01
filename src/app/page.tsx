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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-16 px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wide text-slate-800">
            やること
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {activeCount > 0
              ? `${activeCount} 件の未完了タスク`
              : "すべて完了しています"}
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="タスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm transition"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            追加
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-300 text-sm">
              タスクがありません
            </div>
          )}
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border shadow-sm transition group ${
                task.done
                  ? "border-slate-100 opacity-60"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                  task.done
                    ? "bg-slate-800 border-slate-800"
                    : "border-slate-300 hover:border-slate-500"
                }`}
              >
                {task.done && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span
                className={`flex-1 text-sm leading-relaxed ${
                  task.done
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {task.text}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Clear done */}
        {tasks.some((t) => t.done) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
              className="text-xs text-slate-400 hover:text-red-400 transition"
            >
              完了済みを削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
