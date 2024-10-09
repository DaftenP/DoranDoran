package com.e102.user.entity;

import com.e102.log.entity.CreditLog;
import com.e102.log.entity.ItemLog;
import com.e102.log.entity.PlayLog;
import com.e102.user.dto.ItemKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user", uniqueConstraints = {@UniqueConstraint(columnNames = "user_email")})
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_email")
    private String email;

    // 아이템 유형과 아이템 번호를 복합 키로 사용 (아이템 카운트 제외)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_item", joinColumns = @JoinColumn(name = "user_id"))
    private Set<ItemKey> items = new HashSet<>();


    @Column(name = "user_pw")
    private String password;

    @Column(name = "user_xp",columnDefinition = "int default 0")
    private int xp = 0;

    @Column(name = "user_nickname", nullable = false)
    private String nickname;

    @Column(name = "user_color",columnDefinition = "int default 1")
    private int color = 1;

    @Column(name = "user_equipment",columnDefinition = "int default 0")
    private int equipment = 0;

    @Column(name = "user_background",columnDefinition = "int default 1")
    private int background = 1;

    @Column(name = "user_gem",columnDefinition = "int default 0")
    private int gem = 0;

    // cron으로 일주일 마다 날릴 예정
    @Column(name = "user_weekly_quest",columnDefinition = "int default 0")
    private int weeklyStatus = 0;

    // cron으로 밤마다 날릴예정
    @Column(name = "user_daily_quest",columnDefinition = "int default 0")
    private int dailyStatus = 0;

    @CreatedDate
    @Column(name = "user_created_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "user_deleted_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime deletedAt;

    @Column(name = "user_stage",columnDefinition = "int default 1" )
    private int stage = 1;

    @Column(name = "user_birthday", columnDefinition = "DATE DEFAULT '2000-01-01'", nullable = false)
    private LocalDate birthDay = LocalDate.of(2000, 1, 1);

    @OneToMany(mappedBy = "cuser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CreditLog> creditLogList = new ArrayList<>();

    @OneToMany(mappedBy = "iuser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ItemLog> itemLogList = new ArrayList<>();

    @OneToMany(mappedBy = "puser", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PlayLog> playLogList = new ArrayList<>();

    public User(String nickname,String email,String password){
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    public void increaseStage() {
        this.stage++;
    }

    public void changeColor(int color) {
        this.color = color;
    }

    public void changeBackground(int background) {
        this.background = background;
    }

    public void changeEquipment(int equipment) {
        this.equipment = equipment;
    }

    public void resetDailyStatus(){
        log.debug("reset Daily");
        this.dailyStatus = 0;
    }

    public void resetWeeklyStatus(){
        log.debug("reset Weekly");  // 현재 날짜 로그 찍기
        this.weeklyStatus = 0;
    }

    public void modPassword(String password) {
        this.password = password;
    }

    public void modNickname(String nickname) {
        this.nickname = nickname;
    }

    public void modBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    public String statusToBit(){
        return String.format("%07d", Integer.parseInt(Integer.toBinaryString(weeklyStatus)));
    }

    public int getScoop(DayOfWeek dayOfWeek){
        int scoop = -1;
        switch (dayOfWeek) {
            case SUNDAY:
                scoop = 0;
                break;
            case SATURDAY:
                scoop = 1;
                break;
            case FRIDAY:
                scoop = 2;
                break;
            case THURSDAY:
                scoop = 3;
                break;
            case WEDNESDAY:
                scoop = 4;
                break;
            case TUESDAY:
                scoop = 5;
                break;
            case MONDAY:
                scoop = 6;
                break;
        }
        return scoop;
    }

    public void addGem(int addGem){
        this.gem += addGem;
    }
    public void addXp(int addXp){
        this.xp += addXp;
    }

    //오늘 미션 클리어로 만듬
    public void todayMissionCleared(){
        LocalDate date = LocalDate.now();   // 현재 날짜 가져오기
        DayOfWeek dayOfWeek = date.getDayOfWeek();  // 현재 요일 가져오기

        log.debug("Current date: {}", date);  // 현재 날짜 로그 찍기
        log.debug("Current day of week: {}", dayOfWeek);  // 현재 요일 로그 찍기

        int curBit = 1;
        int scoop = getScoop(dayOfWeek);

        weeklyStatus |= (curBit << scoop);
        // or 한다.

        log.debug("Calculated scoop: {}", scoop);  // scoop 로그 찍기
        log.debug("Current questStatus: {}", weeklyStatus);  // 현재 questStatus 로그 찍기

    }

    //오늘 미션 해결했는지 확인한다.
    public boolean isMissionCleared() {
        LocalDate date = LocalDate.now();   // 현재 날짜 가져오기
        DayOfWeek dayOfWeek = date.getDayOfWeek();  // 현재 요일 가져오기

        log.debug("Current date: {}", date);  // 현재 날짜 로그 찍기
        log.debug("Current day of week: {}", dayOfWeek);  // 현재 요일 로그 찍기


        int curBit = 1;
        int scoop = getScoop(dayOfWeek);

        log.debug("Calculated scoop: {}", scoop);  // scoop 로그 찍기
        log.debug("Current questStatus: {}", weeklyStatus);  // 현재 questStatus 로그 찍기

        boolean result = (weeklyStatus & (curBit << scoop)) != 0;
        log.debug("Mission cleared: {}", result);  // 미션 클리어 여부 로그 찍기

        return result;
    }

    public void increaseDaily(){
        this.dailyStatus = Math.min(++dailyStatus,10);
        //업데이트 한다.
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", items=" + items +
                ", password='" + password + '\'' +
                ", xp=" + xp +
                ", nickname='" + nickname + '\'' +
                ", color=" + color +
                ", equipment=" + equipment +
                ", background=" + background +
                ", gem=" + gem +
                ", weeklyStatus=" + weeklyStatus +
                ", dailyStatus=" + dailyStatus +
                ", createdAt=" + createdAt +
                ", deletedAt=" + deletedAt +
                ", stage=" + stage +
                ", birthDay=" + birthDay +
                ", creditLogList=" + creditLogList +
                ", itemLogList=" + itemLogList +
                ", playLogList=" + playLogList +
                '}';
    }
}
