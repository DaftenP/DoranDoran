"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BirdCharacter from "./birdcharacter";

export default function Color({ onSelectCharacter }) {
  const [items, setItems] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState({ itemType: 1, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 컴포넌트 마운트 시 아이템 목록 가져오기
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
      .catch();
  }, [apiUrl]);

  const handleCharacterSelect = (itemId) => {
    // 새로운 캐릭터 선택 처리
    const newSelectedCharacter = { itemType: 1, itemId };
    setSelectedCharacter(newSelectedCharacter);
    onSelectCharacter(newSelectedCharacter);

    // 선택된 아이템 장착 요청
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedCharacter, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch();
  };

  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const slotNumber = index + 1;
        const item = items.find((item) => item.itemId === slotNumber);
        return (
          <div
            key={index}
            className={`rounded-md border border-[#5c3d21]/60 ${
              selectedCharacter.itemId === item?.itemId ? "border-2 border-white" : ""}`}
            onClick={() => item && handleCharacterSelect(item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <BirdCharacter color={item.itemId} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}