// src/components/KeyboardShortcuts.tsx
// 키보드 단축키 표시

import React, { useState } from "react";

const SHORTCUTS = [
  { keys: "Space", action: "재생/일시정지" },
  { keys: "←/→", action: "1프레임 이동" },
  { keys: "Shift+←/→", action: "1초 이동" },
  { keys: "Home", action: "처음으로" },
  { keys: "End", action: "끝으로" },
  { keys: "Ctrl+S", action: "프로젝트 저장" },
  { keys: "Ctrl+E", action: "내보내기 열기" },
  { keys: "Ctrl+Z", action: "되돌리기" },
  { keys: "F11", action: "전체화면" },
  { keys: "?", action: "단축키 도움말" },
];

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #374151",
          backgroundColor: "#111827",
          color: "#9ca3af",
          fontSize: 18,
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        title="단축키 도움말"
      >
        ⌨
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 64,
            right: 16,
            width: 280,
            backgroundColor: "#1f2937",
            borderRadius: 12,
            border: "1px solid #374151",
            padding: 16,
            zIndex: 1000,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            fontFamily: "sans-serif",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              color: "#fff",
            }}
          >
            ⌨ 키보드 단축키
          </h4>
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "1px solid #111827",
              }}
            >
              <code
                style={{
                  fontSize: 12,
                  color: "#fbbf24",
                  backgroundColor: "#111827",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {s.keys}
              </code>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {s.action}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
