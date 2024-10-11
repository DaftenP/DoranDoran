"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BirdCharacter from "./birdcharacter";

export default function Color({ onSelectCharacter }) {
  const [items, setItems] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState({ itemType: 1, itemId: 1 }); // 기본값을 1로 설정
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const filteredItems = response.data.data.filter((item) => item.itemType === 1);
        // 1번 아이템이 없으면 추가
        if (!filteredItems.some(item => item.itemId === 1)) {
          filteredItems.unshift({ itemId: 1, itemType: 1 });
        }
        setItems(filteredItems);
      })
      .catch((error) => {
        // console.error("아이템 불러오기 실패:", error) 
       });
  }, [apiUrl]);

  useEffect(() => {
    // 컴포넌트 마운트 시 기본 캐릭터 선택 정보 전달
    onSelectCharacter(selectedCharacter);
  }, []);

  const handleCharacterSelect = (itemId) => {
    const newSelectedCharacter = { itemType: 1, itemId };
    setSelectedCharacter(newSelectedCharacter);
    onSelectCharacter(newSelectedCharacter);

    axios.patch(`${apiUrl}/inventory/equip`, newSelectedCharacter, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch();
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 p-3" style={{ gridAutoRows: "100px" }}>
          {items.map((item) => (
            <div
              key={item.itemId}
              className={`rounded-md transition-colors
                transition-transform transform
                ${selectedCharacter.itemId === item.itemId ? "bg-[#FFFFF0]/50 scale-105" : "bg-[#FFFFF0]/10"}`}
              onClick={() => handleCharacterSelect(item.itemId)}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full md:w-[50%]">
                  <BirdCharacter color={item.itemId} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}