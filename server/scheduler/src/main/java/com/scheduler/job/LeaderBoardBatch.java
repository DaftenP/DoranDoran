package com.scheduler.job;

import com.scheduler.entity.*;
import com.scheduler.repository.LeagueLogRepository;
import com.scheduler.repository.LeagueMemberLogRepository;
import com.scheduler.repository.LeagueMemberRepository;
import com.scheduler.repository.LeagueRepository;
import com.scheduler.util.DateIdenfier;
import com.scheduler.util.RedisKeyGenerator;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class LeaderBoardBatch {
    private final LeagueMemberRepository leagueMemberRepository;
    private final LeagueRepository leagueRepository;
    private final LeagueLogRepository leagueLogRepository;
    private final LeagueMemberLogRepository leagueMemberLogRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    // SortedSet을 사용 객체
    private final ZSetOperations<String, Object> zSetOperations;
    // Hash를 사용하는 객체
    private final HashOperations<String, String, LeaderBoardMember> hashOperations;
    // 키 값 생성 객체
    private final RedisKeyGenerator redisKeyGenerator;

    public LeaderBoardBatch(LeagueMemberRepository leagueMemberRepository, LeagueRepository leagueRepository, LeagueLogRepository leagueLogRepository, LeagueMemberLogRepository leagueMemberLogRepository, RedisTemplate<String, Object> redisTemplate1, RedisTemplate<String, Object> redisTemplate, RedisKeyGenerator redisKeyGenerator, DateIdenfier dateIdenfier) {
        this.leagueMemberRepository = leagueMemberRepository;
        this.leagueRepository = leagueRepository;
        this.leagueLogRepository = leagueLogRepository;
        this.leagueMemberLogRepository = leagueMemberLogRepository;
        this.redisTemplate = redisTemplate1;
        this.zSetOperations = redisTemplate.opsForZSet(); // ZSetOperations는 RedisTemplate을 통해 얻어옴
        this.hashOperations = redisTemplate.opsForHash(); // HashOperations는 RedisTemplate을 통해 얻어옴
        this.redisKeyGenerator = redisKeyGenerator;
    }

    /**
     * 3시간 마다 전체 랭킹 갱신
     */
    @Transactional
    @Scheduled(fixedRateString = "${batch.schedule.fixed-rate}")
    public void updateLeaderBoard() {
        log.info("updateLeaderBoard start");

        // xp 기준 내림차순 정렬
        List<LeagueMember> leagueMembers = leagueMemberRepository.findAllByOrderByGainXPDesc();

        // 랭킹 관련 정보 모두 삭제
        String currentLeaderBoardKey = redisKeyGenerator.getLeaderboardKey(0L);
        String currentLeaderBoardHashKey = redisKeyGenerator.getLeaderboardHashKey(0L);
        redisTemplate.delete(currentLeaderBoardKey);
        redisTemplate.delete(currentLeaderBoardHashKey);

        // 재삽입
        int size = leagueMembers.size();
        for (int i = 0; i < size; i++) {
            Integer userRank = leagueMembers.get(i).getLeague().getRank();
            LeaderBoardMember member = LeaderBoardMember.builder()
                    .id(leagueMembers.get(i).getId().toString())
                    .leaderboardType(0L)
                    .userId(leagueMembers.get(i).getUserId())
                    .gainXp(leagueMembers.get(i).getGainXP())
                    .userRank(Long.valueOf(userRank))
                    .order(Long.valueOf(i + 1))
                    .build();

            // 1. Sorted Set에 사용자 랭킹 데이터 저장
            zSetOperations.add(currentLeaderBoardKey, member.getUserId(), member.getOrder());
            // 2. Redis Hash에 전체 객체 저장 (userId와 leaderboardType을 조합한 키로 저장)
            String memberKey = redisKeyGenerator.getMemberKey(member.getUserId(), member.getLeaderboardType());
            hashOperations.put(currentLeaderBoardHashKey, memberKey, member); // userId와 leaderboardType을 조합한 키로 저장
        }
    }

    /**
     *
     * 일주일 단위로 리그 정보 갱신
     */
    @Transactional
    // 일요일 24:00에 실행
    @Scheduled(cron = "0 0 0 * * SUN")
    public void updateLeagueSettlement() {
        log.info("updateLeagueSettlement start");

        // 지난 주 랭킹 관련 정보 모두 삭제
        String previousLeaderBoardKey = redisKeyGenerator.getLeaderboardKey(1L);
        String previousLeaderBoardHashKey = redisKeyGenerator.getLeaderboardHashKey(1L);
        redisTemplate.delete(previousLeaderBoardKey);
        redisTemplate.delete(previousLeaderBoardHashKey);

        // 현재를 지난 주로 변경
        String currentLeaderBoardKey = redisKeyGenerator.getLeaderboardKey(0L);
        String currentLeaderBoardHashKey = redisKeyGenerator.getLeaderboardHashKey(0L);
        redisTemplate.delete(currentLeaderBoardKey);
        redisTemplate.delete(currentLeaderBoardHashKey);

        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // 지난주 시작 (월요일)과 끝 (일요일) 구하기
        LocalDate startOfLastWeek = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfLastWeek = startOfLastWeek.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        // 시간까지 포함한 LocalDateTime 계산
        LocalDateTime startDateTime = startOfLastWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfLastWeek.atTime(23, 59, 59);

        // 지난주 리그 멤버 객체 조회
        List<LeagueMemberLog> lastWeekLeagueMembers = leagueMemberLogRepository.findLogsByCreatedAtBetweenOrderByGainXPDesc(startDateTime, endDateTime);

        for (int i = 0; i < lastWeekLeagueMembers.size(); i++) {
            Integer userRank = lastWeekLeagueMembers.get(i).getLeagueLog().getRank();
            LeaderBoardMember member = LeaderBoardMember.builder()
                    .id(lastWeekLeagueMembers.get(i).getId().toString())
                    .leaderboardType(1L)
                    .userId(lastWeekLeagueMembers.get(i).getUserId())
                    .gainXp(lastWeekLeagueMembers.get(i).getGainXP())
                    .userRank(Long.valueOf(userRank))
                    .order(Long.valueOf(i + 1))
                    .build();

            // 1. Sorted Set에 사용자 랭킹 데이터 저장
            zSetOperations.add(previousLeaderBoardKey, member.getUserId(), member.getOrder());
            // 2. Redis Hash에 전체 객체 저장 (userId와 leaderboardType을 조합한 키로 저장)
            String memberKey = redisKeyGenerator.getMemberKey(member.getUserId(), member.getLeaderboardType());
            hashOperations.put(previousLeaderBoardHashKey, memberKey, member); // userId와 leaderboardType을 조합한 키로 저장
        }

        // 리그 멤버 갱신
        List<LeagueMember> leagueMembers = leagueMemberRepository.findAll();
        for (LeagueMember leagueMember : leagueMembers) {
            Long leagueId = leagueMember.getLeague().getId();
            Optional<LeagueLog> leagueLog = leagueLogRepository.findById(leagueId);

            if (leagueLog.isEmpty()) {
                continue;
            }

            LeagueMemberLog leagueMemberLog = LeagueMemberLog.builder()
                    .userId(leagueMember.getUserId())
                    .gainXP(leagueMember.getGainXP())
                    .leagueLog(leagueLog.get())
                    .createdAt(LocalDateTime.now())
                    .build();

            leagueMemberLogRepository.save(leagueMemberLog);
        }

        // 금주 리그 조회
        List<League> leagues = leagueRepository.findAll();

        // 리그에 속한 상위 3명 멤버 승급, 하위 멤버 강등
        for (League league : leagues) {
            List<LeagueMember> leagueMembersByLeague = leagueMemberRepository.findAllByLeagueIdOrderByGainXP(league.getId());
            for (int i = 0; i < leagueMembersByLeague.size(); i++) {
                LeagueMember leagueMember = leagueMembersByLeague.get(i);
                leagueMember.updateGainXP0();
                if (i < 3 && leagueMember.getLeague().getRank() < 5000) {
                    leagueMember.getLeague().updateRank(leagueMember.getLeague().getRank() + 1000);
                } else if (i >= 7 && leagueMember.getLeague().getRank() > 1000) {
                    leagueMember.getLeague().updateRank(leagueMember.getLeague().getRank() - 1000);
                }

                leagueMemberRepository.save(leagueMember);
            }
        }

        // 리그 재배치
        // 리그 생성
        generateNewLeague();
    }

    private void generateNewLeague() {
        log.info("generateNewLeague start");

        List<League> curLeagues = leagueRepository.findAll();

        // 브론즈, 골드, 플래, 다이아 리그 생성
        for (int i = 1000; i <= 5000; i += 1000) {
            // 해당 티어인 멤버 조회
            List<LeagueMember> leagueMembers = leagueMemberRepository.findByRank((long) i);
            // 리그를 하나씩 생성하고 리그멤버 10명씩 배치
            // 리그 멤버가 더 이상 없으면 리그 생성 종료
            for (int j = 0; ; j++) {
                if (leagueMembers.isEmpty()) {
                    break;
                }
                League league = League.builder()
                        .rank(i)
                        .num(j)
                        .createdAt(LocalDateTime.now())
                        .build();

                LeagueLog leagueLog = LeagueLog.builder()
                        .rank(i)
                        .num(j)
                        .createdAt(LocalDateTime.now())
                        .build();

                leagueRepository.save(league);
                leagueLogRepository.save(leagueLog);

                for (int k = 0; k < 10; k++) {
                    if (leagueMembers.isEmpty()) {
                        break;
                    }
                    LeagueMember leagueMember = leagueMembers.remove(0);
                    leagueMember.updateLeague(league);
                    leagueMemberRepository.save(leagueMember);
                }
            }
        }

        // 현재 리그 삭제
        leagueRepository.deleteAll(curLeagues);
    }
}
