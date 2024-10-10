package com.scheduler.service.LeaderBoardService;

import com.scheduler.entity.LeaderBoardMember;
import com.scheduler.entity.LeagueMember;
import com.scheduler.entity.LeagueMemberLog;
import com.scheduler.repository.LeagueLogRepository;
import com.scheduler.repository.LeagueMemberLogRepository;
import com.scheduler.repository.LeagueMemberRepository;
import com.scheduler.repository.LeagueRepository;
import com.scheduler.util.DateIdenfier;
import com.scheduler.util.RedisKeyGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class LeaderBoardService {
    private static final Logger log = LoggerFactory.getLogger(LeaderBoardService.class);
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

    public LeaderBoardService(LeagueMemberRepository leagueMemberRepository, LeagueRepository leagueRepository, LeagueLogRepository leagueLogRepository, LeagueMemberLogRepository leagueMemberLogRepository, RedisTemplate<String, Object> redisTemplate1, RedisTemplate<String, Object> redisTemplate, RedisKeyGenerator redisKeyGenerator, DateIdenfier dateIdenfier) {
        this.leagueMemberRepository = leagueMemberRepository;
        this.leagueRepository = leagueRepository;
        this.leagueLogRepository = leagueLogRepository;
        this.leagueMemberLogRepository = leagueMemberLogRepository;
        this.redisTemplate = redisTemplate1;
        this.zSetOperations = redisTemplate.opsForZSet(); // ZSetOperations는 RedisTemplate을 통해 얻어옴
        this.hashOperations = redisTemplate.opsForHash(); // HashOperations는 RedisTemplate을 통해 얻어옴
        this.redisKeyGenerator = redisKeyGenerator;
    }

    public void updateCurrentLeaderBoard() {
        log.info("updateLeaderBoard called");

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

    public void updateLastLeaderBoard() {
        // 지난 주 랭킹 관련 정보 모두 삭제
        String previousLeaderBoardKey = redisKeyGenerator.getLeaderboardKey(1L);
        String previousLeaderBoardHashKey = redisKeyGenerator.getLeaderboardHashKey(1L);
        redisTemplate.delete(previousLeaderBoardKey);
        redisTemplate.delete(previousLeaderBoardHashKey);

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
    }
}
