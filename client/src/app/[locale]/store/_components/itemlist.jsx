'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Modal from '@/components/modal/modal'
import { buyItem } from '@/store/shop'
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Credit from "@/public/icon/credit.webp";

export default function Itemlist({ itemType, itemName, itemIcon, itemCost }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedItemlist itemType={itemType} itemName={itemName} itemIcon={itemIcon} itemCost={itemCost} />
    </NextIntlClientProvider>
  );
}

function TranslatedItemlist({ itemType, itemName, itemIcon, itemCost }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const [isBuy, setIsBuy] = useState(false)
  // 현재 [itemType, itemId] 형식으로 저장 중
  const [itemInfo, setItemInfo] = useState([])
  const router = useRouter()
  const locale = useLocale()

  const handleBuyItem = ((itemType, itemId) => {
    dispatch(buyItem({ itemType, itemId }))
    .unwrap()
    .then(() => {
      setIsBuy(true)
      setModalMessage(modalMessages[3]); // 구매 성공 메시지
      setIsOpenModal(true);
    })
    .catch(() => {
      setIsBuy(false)
      setModalMessage(modalMessages[4]); // 구매 실패 메시지
      setIsOpenModal(true);
    });
  })

  const handleYesClick = (buttonLink) => {
    if (isBuy === false) {
      setIsOpenModal(false)
      handleBuyItem(itemInfo[0], itemInfo[1])
    } else {
      setIsOpenModal(false)
      router.push(`/${locale}/${buttonLink}`)
      setIsBuy(false)
    }
  }

  const handleOpenModal = (itemType, itemId) => {
    setModalMessage(modalMessages[itemType-1])
    setItemInfo([itemType, itemId])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    setIsBuy(false)
  }

  const modalMessages = [
    // 색 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-color?',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 장비 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-equipment?',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 배경 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-background?',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 구매 성공 메세지
    {
      'message': 'your-purchase-was-successful-would-you-like-to-go-to-the-store?',
      'background': 'bird',
      'buttonLink': 'room',
      'buttonType': 1
    },
    // 구매 실패 메세지
    {
      'message': "you-don't-have-enough-credits",
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 2
    },
  ]

  let itemId
  if (itemType === 1) {
    itemId = Math.floor(Math.random() * 11) + 1;
  } else if (itemType === 2) {
    itemId = Math.floor(Math.random() * 15) + 1;
  } else if (itemType === 3) {
    itemId = Math.floor(Math.random() * 5) + 1;
  }

  return (
    <div className={`${itemType === 1 || itemType === 2 || itemType === 3 ? '' : 'opacity-30 pointer-events-none'}`}>
      <div className="w-[35vw] h-[19vh] relative border border-[#D1D6DE] p-4 rounded-[10px] bg-[#8E9094] bg-opacity-80" >
        <div className="left-[50%] transform -translate-x-1/2 top-[5%] absolute text-white text-center text-lg md:text-2xl lg:text-4xl">
          {itemName}
        </div>
        <div className="w-[75%] h-[1px] left-[50%] transform -translate-x-1/2 top-[25%] absolute border border-white"></div>
        
        <Image src={itemIcon} alt={itemName} className="w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] top-[30%] absolute transform -translate-x-1/2" />

        <div className="w-[90%] h-[30%] left-[5%] bottom-[5%] absolute bg-[#b0b0b0] rounded-[10px] flex items-center justify-center">
          <div className="w-[90%] h-[40%] left-[5%] top-[10%] absolute bg-[#d1d6de] rounded-[10px] flex items-center justify-center" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
            <Image src={Credit} alt="credit" className="w-auto h-[110%] left-[0%] absolute" />
            <div className="text-white" >{itemCost}</div>
          </div>
          <div onClick={itemType === 1 || itemType === 2 || itemType === 3 ? () => handleOpenModal(itemType, itemId) : null} 
             className="absolute bottom-[0%] text-black cursor-pointer">
          {t('purchase')}
          </div>
        </div>
      </div>
      {isOpenModal && 
        <div className="relative z-30">
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      }
    </div>
  );
}