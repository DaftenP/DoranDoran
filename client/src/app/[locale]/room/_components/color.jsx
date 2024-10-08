"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BirdCharacter from "./birdcharacter";

export default function Color({ onSelectCharacter }) {
  const [items, setItems] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState({ itemType: 1, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 1
        );
        setItems(filteredItems);
      })
      .catch();
  }, [apiUrl]);

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
