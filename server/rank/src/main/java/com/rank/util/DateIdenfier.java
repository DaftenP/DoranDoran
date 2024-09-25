package com.rank.util;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.Locale;

/**
 * 날짜를 이용하여 주차를 식별하는 클래스
 * 주차 식별자는 "년도-월-주차" 형식으로 구성
 * 리그 prefix로 사용
 */
@Component
public class DateIdenfier {
    public String getDateIdenfier(LocalDate date) {
        // 날짜 형식: "년도-월-주차"
        DateTimeFormatter yearFormatter = DateTimeFormatter.ofPattern("yy"); // 두 자리 연도 포맷
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM"); // 두 자리 월 포맷

        // 주차 계산: 해당 월에서 몇 번째 주인지 계산
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int weekOfMonth = date.get(weekFields.weekOfMonth());

        // 년도, 월, 주차를 조합하여 문자열 반환
        String year = date.format(yearFormatter);
        String month = date.format(monthFormatter);
        String week = String.format("%02d", weekOfMonth); // 주차도 두 자리 포맷

        return year + "-" + month + "-" + week;
    }

}
