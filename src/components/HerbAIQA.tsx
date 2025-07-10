import axiosInstance from "@/api/config";
import React, { useState } from "react";

export default function HerbAIQA({ herbName }: { herbName: string }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      // const prompt = `作为一个中药专家，请围绕「${herbName}」回答：${query}`;
      const res =(await axiosInstance.post(`/herb-info-service/ai/generate?query=${query}&max_tokens=${600}`)).data;
      // const res = await fetch("/api/ai-qa", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ herbName, question }),
      // });
      // const data =  res.data();
      setAnswer(res.response || "未获取到答案");
    } catch (error) {
      setError("AI服务请求失败，请稍后重试。");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <input
          className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
          style={{ minWidth: 0 }}
          placeholder={`问点关于「${herbName}」的内容...`}
          value={query}
          maxLength={100}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAsk(); }}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all disabled:opacity-60"
          onClick={handleAsk}
          disabled={loading || !query.trim()}
        >
          {loading ? "提问中..." : "提问"}
        </button>
      </div>
      {error && <div className="text-red-500 text-xs mb-1">{error}</div>}
      {answer && (
        <div
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 mt-1 whitespace-pre-line overflow-y-auto"
          style={{ maxHeight: 180, wordBreak: 'break-all' }}
        >
          <b className="text-green-700">AI答：</b>{answer}
        </div>
      )}
    </div>
  );
} 