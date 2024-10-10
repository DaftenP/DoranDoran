'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Modal from '@/components/modal/modal'
import { buyItem } from '@/store/shop'
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Credit from "@/public/icon/credit.webp";
import { motion, AnimatePresence } from 'framer-motion'

export default function Itemlist({ setBuyComplete, itemType, itemName, itemIcon, itemCost }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedItemlist setBuyComplete={setBuyComplete} itemType={itemType} itemName={itemName} itemIcon={itemIcon} itemCost={itemCost} />
    </NextIntlClientProvider>
  );
}

function TranslatedItemlist({ setBuyComplete, itemType, itemName, itemIcon, itemCost }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const [isBuy, setIsBuy] = useState(false)
  // 현재 [itemType, itemId] 형식으로 저장 중
  const [currentItem, setCurrentItem] = useState([])
  const router = useRouter()
  const locale = useLocale()
  const effectVolume = useSelector((state) => state.sound.effectVolume)

  const handleBuyItem = ((itemType) => {
    dispatch(buyItem({ itemType }))
    .unwrap()
    .then((response) => {
      const audio = new Audio('/bgm/coin-drop.mp3')
      audio.volume = effectVolume
      audio.play();

      setBuyComplete(true)

      if (response.message === '이미 가지고 있는 상품입니다.') {
        const duplicationMessage = { ...modalMessages[5], imageUrl: [itemType, response.data] }
        setIsBuy(true)
        setModalMessage(duplicationMessage); // 구매 중복 메시지
        setIsOpenModal(true);  
      } else {
        const successMessage = { ...modalMessages[3], imageUrl: [itemType, response.data] }
        setIsBuy(true)
        setModalMessage(successMessage); // 구매 성공 메시지
        setIsOpenModal(true);
      }
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
      handleBuyItem(currentItem[0])
      setBuyComplete(false)
    } else {
      setIsOpenModal(false)
      router.push(`/${locale}/${buttonLink}`)
      setIsBuy(false)
      setBuyComplete(false)
    }
  }

  const handleOpenModal = (itemType) => {
    setCurrentItem([itemType, 0])
    setModalMessage(modalMessages[itemType-1])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    setIsBuy(false)
    setBuyComplete(false)
  }

  const modalMessages = [
    // 색 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-color?',
      'image': 'color',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 장비 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-equipment?',
      'image': 'equipment',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 배경 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-background?',
      'image': 'background',
      'background': 'bird',
      'buttonLink': 'store',
      'buttonType': 1
    },
    // 구매 성공 메세지
    {
      'message': 'your-purchase-was-successful-would-you-like-to-go-to-the-dressing-room?',
      'image': 'response',
      'imageUrl': '',
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
    // 중복 구매 메세지
    {
      'message': 'a-duplicate-item-has-appeared!-would-you-like-to-go-to-the-dressing-room?',
      'image': 'response',
      'imageUrl': '',
      'background': 'bird',
      'buttonLink': 'room',
      'buttonType': 1
    },
  ]

  const itemSet = {
    1: [0, 1],
    2: [2, 3],
    3: [4, 5],
  };
  
  const getItemDelay = (itemType) => {
    for (const [setKey, items] of Object.entries(itemSet)) {
      if (items.includes(itemType)) {
        return setKey * 0.2;
      }
    }
    return 0;
  };

  const delay = getItemDelay(itemType);
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
    hover: { scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <div>
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`${itemType === 1 || itemType === 2 || itemType === 3 ? '' : 'pointer-events-none'}`}
    >
      <div
        onClick={itemType === 1 || itemType === 2 || itemType === 3 ? () => handleOpenModal(itemType) : null}
        className={`w-[35vw] h-[19vh] relative border border-[#D1D6DE] p-4 rounded-[10px] bg-[#8E9094] bg-opacity-80 ${itemType === 1 || itemType === 2 || itemType === 3 ? '' : 'opacity-30 pointer-events-none'}`}
      >
        <div className="left-[50%] transform -translate-x-1/2 top-[5%] absolute text-white text-center text-lg md:text-2xl lg:text-4xl">
          {itemName}
        </div>
        <div className="w-[75%] h-[1px] left-[50%] transform -translate-x-1/2 top-[25%] absolute border border-white"></div>

        <Image src={itemIcon} alt={itemName} className="w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] top-[30%] absolute transform -translate-x-1/2" />

        <div className="w-[90%] h-[30%] left-[5%] bottom-[5%] absolute bg-[#b0b0b0] rounded-[10px] flex items-center justify-center">
          <div className="w-[90%] h-[40%] left-[5%] top-[10%] absolute bg-[#d1d6de] rounded-[10px] flex items-center justify-center" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)' }}>
            <Image src={Credit} alt="credit" className="w-auto h-[110%] left-[0%] absolute" />
            <div className="text-white">{itemCost}</div>
          </div>
          <div className="absolute bottom-[0%] text-black cursor-pointer">
            {t('purchase')}
          </div>
        </div>
      </div>
    </motion.div>
      {isOpenModal && (
        <div className="relative z-30">
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      )}
    </div>
  );
}