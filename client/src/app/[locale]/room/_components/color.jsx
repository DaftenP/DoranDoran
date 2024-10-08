"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BirdCharacter from "./birdcharacter";

// 캐릭터 색상 선택 컴포넌트
export default function Color({ onSelectCharacter }) {
  // 상태 관리
  const [items, setItems] = useState([]); // 사용 가능한 색상 아이템 목록
  const [selectedCharacter, setSelectedCharacter] = useState({ itemType: 1, itemId: null }); // 현재 선택된 캐릭터 색상
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // API 엔드포인트 URL

  // 컴포넌트 마운트 시 색상 아이템 목록 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 1인 아이템만 필터링 (색상 아이템)
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 1
        );
        setItems(filteredItems);
      })
      .catch(error => console.error("아이템 불러오기 실패:", error));
  }, [apiUrl]);

  // 캐릭터 색상 선택 처리 함수
  const handleCharacterSelect = (itemId) => {
    const newSelectedCharacter = { itemType: 1, itemId };
    setSelectedCharacter(newSelectedCharacter);
    onSelectCharacter(newSelectedCharacter); // 부모 컴포넌트에 선택 정보 전달

    // 선택된 아이템 장착 요청
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedCharacter, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch();
  };

  // UI 렌더링
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        {/* 3열 그리드 레이아웃, 각 행의 높이는 100px */}
        <div className="grid grid-cols-3 gap-2 p-2" style={{ gridAutoRows: "100px" }}>
          {/* 각 색상 아이템을 그리드 아이템으로 렌더링 */}
          {items.map((item) => (
            <div
              key={item.itemId}
              className={`rounded-md border border-[#5c3d21]/60 ${
                selectedCharacter.itemId === item.itemId ? "border-2 border-white" : ""
              }`}
              onClick={() => handleCharacterSelect(item.itemId)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {/* BirdCharacter 컴포넌트를 사용하여 색상 표시 */}
                <BirdCharacter color={item.itemId} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}