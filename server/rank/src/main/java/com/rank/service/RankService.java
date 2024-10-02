package com.rank.service;

import com.rank.common.exception.RestApiException;
import com.rank.common.exception.StatusCode;
import com.rank.dto.LeagueInfoDTO;
import com.rank.dto.LeagueMemberDTO;
import com.rank.entity.League;
import com.rank.entity.LeagueMember;
import com.rank.repository.LeagueMemberRepository;
import com.rank.repository.LeagueRepository;
import com.rank.util.DateIdenfier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankService {

    private final DateIdenfier dateIdenfier;
    private final LeagueMemberRepository leagueMemberRepository;
    private final LeagueRepository leagueRepository;

    public Map<String, Object> getUserLeagueInfo(Long userId) {
        Map<String, Object> ret = new HashMap<>();

        // 리그 아이디 prefix
        String leagueIdPrefix = dateIdenfier.getDateIdenfier(LocalDate.now());

        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserIdAndLeagueIdPrefix(userId, leagueIdPrefix);
        if (lm.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 정보 조회
        Optional<League> league = Optional.ofNullable(lm.get().getLeague());

        if (league.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        LeagueInfoDTO leagueInfoDTO = LeagueInfoDTO.builder()
                .leagueId(league.get().getId())
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
        // 리그 아이디 prefix
        String leagueIdPrefix = dateIdenfier.getDateIdenfier(LocalDate.now());

        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserIdAndLeagueIdPrefix(userId, leagueIdPrefix);
        if (lm.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 정보 조회
        Optional<League> league = Optional.ofNullable(lm.get().getLeague());

        if (league.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 리그 멤버 XP 업데이트
        lm.get().updateGainXP(xp);
        leagueMemberRepository.save(lm.get());
    }

    public Map<String, Object> getUserRankInfo(Long userId) {
        Map<String, Object> ret = new HashMap<>();

        // 리그 아이디 prefix
        String leagueIdPrefix = dateIdenfier.getDateIdenfier(LocalDate.now());

        // 리그 멤버 객체 조회
        Optional<LeagueMember> lm = leagueMemberRepository.findByUserIdAndLeagueIdPrefix(userId, leagueIdPrefix);
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
        // 리그 아이디 prefix
        String leagueIdPrefix = dateIdenfier.getDateIdenfier(LocalDate.now());

        // 현재 브론즈 리그 중 마지막 리그 가져오기
        List<League> leagues = leagueRepository.findLeaguesByPrefixAndRank(leagueIdPrefix, 100);
        League league = leagues.stream().max(Comparator.comparing(League::getNum)).orElse(null);

        if (league == null) {
            league = League.builder()
                    .id(leagueIdPrefix + "-100-1")
                    .rank(100)
                    .num(1)
                    .createdAt(LocalDateTime.now())
                    .build();

            leagueRepository.save(league);
        }

        // 해당 리그에 속한 인원이 10이라면 해당 리그에 userId 생성 및 배치
        if (leagueMemberRepository.countByLeagueId(league.getId()) < 10) {
            LeagueMember leagueMember = LeagueMember.builder()
                    .userId(userId)
                    .league(league)
                    .gainXP(0L)
                    .build();
            leagueMemberRepository.save(leagueMember);
        } else {
            // 리그 생성
            League newLeague = League.builder()
                    .id(leagueIdPrefix + "-100-" + (league.getNum() + 1))
                    .rank(100)
                    .num(league.getNum() + 1)
                    .createdAt(LocalDateTime.now())
                    .build();
            leagueRepository.save(newLeague);

            LeagueMember leagueMember = LeagueMember.builder()
                    .userId(userId)
                    .league(newLeague)
                    .gainXP(0L)
                    .build();
            leagueMemberRepository.save(leagueMember);
        }
    }
}
