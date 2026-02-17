// src/components/ImageManager.tsx
// 서브씬별 이미지 업로드/변경/미리보기

import React, { useRef, useState } from "react";
import type { ScriptSection } from "../types";

export const ImageManager: React.FC<{
  sections: ScriptSection[];
  onImageUpload: (sectionIdx: number, subIdx: number, file: File) => void;
}> = ({ sections, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<{
    sIdx: number;
    subIdx: number;
  } | null>(null);

  const handleClick = (sIdx: number, subIdx: number) => {
    setTarget({ sIdx, subIdx });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && target) {
      onImageUpload(target.sIdx, target.subIdx, file);
    }
    e.target.value = "";
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "#fff" }}>
        🖼️ 이미지 관리
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {sections.map((sec, sIdx) => (
          <div key={sec.id}>
            <div
              style={{
                fontSize: 13,
                color: "#9ca3af",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {sec.label}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {sec.subScenes
                .filter(
                  (sub) => sub.type === "image-kenburns" || sub.imageFile
                )
                .map((sub, subIdx) => (
                  <div
                    key={sub.id}
                    onClick={() => handleClick(sIdx, subIdx)}
                    style={{
                      width: 120,
                      height: 68,
                      borderRadius: 8,
                      backgroundColor: "#111827",
                      border: "1px dashed #374151",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 11,
                      color: "#6b7280",
                      overflow: "hidden",
                    }}
                  >
                    {sub.imageFile ? (
                      <img
                        src={`/images/${sub.imageFile}`}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>+ 이미지</span>
                    )}
                  </div>
                ))}

              {sec.subScenes.filter(
                (sub) => sub.type === "image-kenburns" || sub.imageFile
              ).length === 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#4b5563",
                    padding: "8px 0",
                  }}
                >
                  이미지 사용 씬 없음
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "#4b5563" }}>
        팁: 이미지는 1920×1080 비율 권장. JPG/PNG 지원.
      </div>
    </div>
  );
};
