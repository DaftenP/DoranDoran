package com.rank.service;

import com.rank.common.exception.RestApiException;
import com.rank.common.exception.StatusCode;
import com.rank.dto.LeagueInfoDTO;
import com.rank.dto.LeagueMemberDTO;
import com.rank.dto.RankCode;
import com.rank.entity.League;
import com.rank.entity.LeagueLog;
import com.rank.entity.LeagueMember;
import com.rank.entity.LeagueMemberLog;
import com.rank.repository.LeagueLogRepository;
import com.rank.repository.LeagueMemberLogRepository;
import com.rank.repository.LeagueMemberRepository;
import com.rank.repository.LeagueRepository;
import com.rank.util.DateIdenfier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RankService {

    private final LeagueMemberRepository leagueMemberRepository;
    private final LeagueRepository leagueRepository;
    private final LeagueMemberLogRepository leagueMemberLogRepository;
    private final LeagueLogRepository leagueLogRepository;

    public Map<String, Object> getUserLeagueInfo(Long userId) {
        Map<String, Object> ret = new HashMap<>();

        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserId(userId);
        if (lm.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 정보 조회
        Optional<League> league = Optional.ofNullable(lm.get().getLeague());

        if (league.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        RankCode rankCode = null;
        if(league.get().getRank() == 1000) {
            rankCode = RankCode.BRONZE;
        } else if(league.get().getRank() == 2000) {
            rankCode = RankCode.SILVER;
        } else if(league.get().getRank() == 3000) {
            rankCode = RankCode.GOLD;
        } else if(league.get().getRank() == 4000) {
            rankCode = RankCode.PLATINUM;
        } else if(league.get().getRank() == 5000) {
            rankCode = RankCode.DIAMOND;
        }

        LeagueInfoDTO leagueInfoDTO = LeagueInfoDTO.builder()
                .leagueId(rankCode.getRankName() + "-" + league.get().getNum())
                .leagueRank(league.get().getRank())
                .leagueNum(league.get().getNum())
                .createdAt(league.get().getCreatedAt())
                .build();

        ret.put("leagueInfo", leagueInfoDTO);

        // 리그 멤버 리스트 조회
        List<LeagueMember> members = leagueMemberRepository.findByLeagueIdOrderByGainXPDesc(league.get().getId());

        List<LeagueMemberDTO> leagueMembersDTO = new ArrayList<>();
        for (int i = 0; i < members.size(); i++) {
            leagueMembersDTO.add(LeagueMemberDTO.builder()
                    .userId(members.get(i).getUserId())
                    .userXP(members.get(i).getGainXP())
                    .order((long) i + 1)
                    .build());
        }

        ret.put("leagueMembers", leagueMembersDTO);

        return ret;
    }

    public void updateXP(Long userId, Long xp) {
        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserId(userId);
        if (lm.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 멤버 XP 업데이트
        lm.get().updateGainXP(xp);
        leagueMemberRepository.save(lm.get());
    }

    public Map<String, Object> getUserRankInfo(Long userId) {
        Map<String, Object> ret = new HashMap<>();

        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserId(userId);
        if (lm.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 정보 조회
        Optional<League> league = Optional.ofNullable(lm.get().getLeague());

        if (league.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        ret.put("userId", userId);
        ret.put("rank", league.get().getRank());
        ret.put("leagueId", league.get().getId());

        return ret;
    }

    public void placement(Long userId) {
        leagueMemberRepository.findByUserId(userId).ifPresent(leagueMember -> {
            throw new RestApiException(StatusCode.ALREADY_EXIST_LEAGUEMEMBER);
        });

        // 현재 브론즈 리그 중 마지막 리그 가져오기
        List<League> leagues = leagueRepository.findByRank(1000);
        League league = leagues.stream().max(Comparator.comparing(League::getNum)).orElse(null);

        if (league == null) {
            league = League.builder()
                    .rank(1000)
                    .num(1)
                    .createdAt(LocalDateTime.now())
                    .build();

            LeagueLog leagueLog = LeagueLog.builder()
                    .rank(1000)
                    .num(1)
                    .createdAt(LocalDateTime.now())
                    .build();

            leagueRepository.save(league);
            leagueLogRepository.save(leagueLog);
        }

        // 해당 리그에 속한 인원이 10이라면 해당 리그에 userId 생성 및 배치
        if (leagueMemberRepository.countByLeagueId(league.getId()) < 10) {
            LeagueMember leagueMember = LeagueMember.builder()
                    .userId(userId)
                    .league(league)
                    .gainXP(0L)
                    .rank(1000)
                    .build();
            leagueMemberRepository.save(leagueMember);
        } else {
            // 리그 생성
            League newLeague = League.builder()
                    .rank(1000)
                    .num(league.getNum() + 1)
                    .createdAt(LocalDateTime.now())
                    .build();
            leagueRepository.save(newLeague);

            // 리그 로그 생성
            LeagueLog leagueLog = LeagueLog.builder()
                    .rank(1000)
                    .num(league.getNum() + 1)
                    .createdAt(LocalDateTime.now())
                    .build();
            leagueLogRepository.save(leagueLog);

            LeagueMember leagueMember = LeagueMember.builder()
                    .userId(userId)
                    .league(newLeague)
                    .gainXP(0L)
                    .rank(1000)
                    .build();
            leagueMemberRepository.save(leagueMember);
        }
    }

    /**
     * 리그 결산
     * @param userId
     * @return Map<String, Object>
     */
    public Map<String, Object> settlement(Long userId) {
        Map<String, Object> ret = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // 지난주 시작 (월요일)과 끝 (일요일) 구하기
        LocalDate startOfLastWeek = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfLastWeek = startOfLastWeek.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        // 시간까지 포함한 LocalDateTime 계산
        LocalDateTime startDateTime = startOfLastWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfLastWeek.atTime(23, 59, 59);

        // 지난주 리그 멤버 객체 조회
        List<LeagueMemberLog> lastWeekLeagueMembers = leagueMemberLogRepository.findLogsByUserIdAndLastWeek(userId, startDateTime, endDateTime);
        LeagueMemberLog lastWeekLeagueMember = lastWeekLeagueMembers.get(0);

        if(lastWeekLeagueMember == null) {
            ret.put("result", 0);
            ret.put("prevRank", null);
        } else{
            ret.put("prevRank", lastWeekLeagueMember.getRank());
        }

        // 이번주 리그 멤버 객체 조회
        Optional<LeagueMember> thisWeekLeagueMember = leagueMemberRepository.findByUserId(userId);
        if(thisWeekLeagueMember.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        } else{
            ret.put("currentRank", thisWeekLeagueMember.get().getLeague().getRank());
        }

        if(ret.get("prevRank") == null) {
            ret.put("result", 0);   // 이번주 최초 배치
        } else if((int)ret.get("prevRank") > (int)ret.get("currentRank")) {
            ret.put("result", 1);   // 승급
        } else if((int)ret.get("prevRank") < (int)ret.get("currentRank")) {
            ret.put("result", -1);  // 강등
        } else{
            ret.put("result", 2);   // 잔류
        }

        return ret;
    }
}
