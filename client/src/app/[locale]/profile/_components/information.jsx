"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateNickname, updateBirthday } from "@/store/user";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Email from "@/public/icon/email.webp";
import Pencil from "@/public/icon/pencil.webp";
import Profile from "@/public/icon/profile.webp";
import Birthday from "@/public/icon/birthday.webp";
import Language from "@/app/[locale]/(account)/_components/language";

export default function Information() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {}
    }
    loadMessages();

    dispatch(fetchUserData());
  }, [locale, dispatch]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedInformation />
    </NextIntlClientProvider>
  );
}

function TranslatedInformation() {
  const t = useTranslations("index");
  const locale = useLocale();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [nickname, setNickname] = useState(user.profile.nickname);
  const [birthday, setBirthday] = useState(user.profile.birthday);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);

  // 닉네임 수정 함수
  const handleNicknameChange = (e) => { setNickname(e.target.value) };

  // 생년월일 수정 함수
  const handleBirthdayChange = (e) => { setBirthday(e.target.value) };

  // 닉네임 수정 제출 함수
  const handleSubmitNickname = () => {
    dispatch(updateNickname(nickname))
      .unwrap()
      .then(() => {
        setIsEditingNickname(false);
        window.location.reload();
      })
      .catch((error) => {});
  };

  // 생년월일 수정 제출 함수
  const handleSubmitBirthday = () => {
    dispatch(updateBirthday(birthday))
      .unwrap()
      .then(() => {
        setIsEditingBirthday(false);
        window.location.reload();
      })
      .catch((error) => {});
  };

  // 닉네임 수정 모드 취소 함수
  const handleCancelEditNickname = () => {
    setNickname(user.profile.nickname);
    setIsEditingNickname(false);
  };

  // 생년월일 수정 모드 취소 함수
  const handleCancelEditBirthday = () => {
    setBirthday(user.profile.birthday);
    setIsEditingBirthday(false);
  };

  return (
    <>
      <div className="w-[90%] py-2">
        <Language />
      </div>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[50%] rounded-3xl flex flex-col justify-center items-center">
        {/* 닉네임 수정 */}
        <div className="w-[90%] h-1/4 flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Profile} alt="Profile" className="w-[16%] md:w-[30%] pointer-events-none" />
            <div className="ml-2 md:ml-5 flex flex-col">
              <p className="text-sm md:text-2xl">{t("nickname")}</p>
              {isEditingNickname ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  className="w-full text-xl md:text-4xl rounded-xl pl-2"
                />
              ) : ( <p className="text-xl md:text-4xl">{user.profile.nickname}</p> )}
            </div>
          </div>
          {isEditingNickname ? (
            <div className="w-[60%] flex flex-col md:flex-row justify-center items-center md:gap-10">
              <button onClick={handleSubmitNickname} className="text-xl md:text-5xl text-blue-500">저장</button>
              <button onClick={handleCancelEditNickname} className="text-xl md:text-5xl text-red-500">취소</button>
            </div>
          ) : (
            <Image src={Pencil} alt="Pencil" className="w-[10%] md:w-[7.5%] cursor-pointer" onClick={() => setIsEditingNickname(true)}/>
          )}
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 이메일 표시 */}
        <div className="w-[90%] h-1/4 flex items-center">
          <Image src={Email} alt="Email" className="w-[11%] md:w-[9%] ml-1 pointer-events-none"/>
          <div className="ml-2 flex flex-col md:ml-5">
            <p className="text-sm md:text-2xl">{t("e-mail")}</p>
            <p className="text-xl md:text-4xl">{user.profile.email}</p>
          </div>
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 생년월일 표시 및 수정 */}
        <div className="w-[90%] h-1/4 flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Birthday} alt="Birthday" className="w-[15%] md:w-[22%] pointer-events-none"/>
            <div className="ml-2 flex flex-col md:ml-4">
              <p className="text-sm md:text-2xl">{t("birth")}</p>
              {isEditingBirthday ? (
                <input
                  type="date"
                  value={birthday}
                  onChange={handleBirthdayChange}
                  className="w-full text-xl md:text-4xl rounded-xl pl-2"
                />
              ) : ( <p className="text-xl md:text-4xl">{user.profile.birthday}</p> )}
            </div>
          </div>
          {isEditingBirthday ? (
            <div className="w-[60%] flex flex-col md:flex-row justify-center items-center md:gap-10">
              <button onClick={handleSubmitBirthday} className="text-xl md:text-5xl text-blue-500">저장</button>
              <button onClick={handleCancelEditBirthday} className="text-xl md:text-5xl text-red-500">취소</button>
            </div>
          ) : (
            <Image src={Pencil} alt="pencil" className="w-[10%] md:w-[7.5%] cursor-pointer" onClick={() => setIsEditingBirthday(true)}/>
          )}
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 비밀번호 변경 링크 */}
        <div className="w-full h-1/4 flex justify-center items-center">
          <Link
            href={`/${locale}/profile/setting/change-password`}
            className="w-[75%] h-[50%] bg-[#FFE4B5] rounded-full flex justify-center items-center"
          >
            <p className="text-xl md:text-4xl">{t("change-password")}</p>
          </Link>
        </div>
      </div>
    </>
  );
}
