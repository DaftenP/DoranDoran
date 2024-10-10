package com.rank.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rank.common.exception.RestApiException;
import com.rank.common.exception.StatusCode;
import com.rank.dto.LeaderBoardMemberDTO;
import com.rank.entity.LeaderBoardMember;
import com.rank.util.RedisKeyGenerator;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LeaderBoardService {

    // SortedSet을 사용 객체
    private final ZSetOperations<String, Object> zSetOperations;
    // Hash를 사용하는 객체
    private final HashOperations<String, String, LeaderBoardMember> hashOperations;
    // 키 값 생성 객체
    private final RedisKeyGenerator redisKeyGenerator;
    private final ObjectMapper objectMapper;

    /**
     * ZSetOperations, HashOperations, RedisKeyGenerator를 주입받는 생성자
     * redisTemplate을 통해 ZSetOperations, HashOperations를 얻어옴 (생성자를 통해 주입 가능)
     */
    public LeaderBoardService(RedisTemplate<String, Object> redisTemplate, RedisKeyGenerator redisKeyGenerator, ObjectMapper objectMapper) {
        this.zSetOperations = redisTemplate.opsForZSet(); // ZSetOperations는 RedisTemplate을 통해 얻어옴
        this.hashOperations = redisTemplate.opsForHash(); // HashOperations는 RedisTemplate을 통해 얻어옴
        this.redisKeyGenerator = redisKeyGenerator;
        this.objectMapper = objectMapper;
    }

    /**
     * 리더보드 멤버 저장 (테스트용 입니다.)
     *
     * @param membersDTO
     * @return void
     */
    public void saveLeaderBoardMember(List<LeaderBoardMemberDTO> membersDTO) {
        for (LeaderBoardMemberDTO memberDTO : membersDTO) {
            LeaderBoardMember member = LeaderBoardMember.builder()
                    .id(UUID.randomUUID().toString())
                    .leaderboardType(memberDTO.getLeaderboardType())
                    .userId(memberDTO.getUserId())
                    .gainXp(memberDTO.getGainXp())
                    .userRank(memberDTO.getUserRank())
                    .order(memberDTO.getOrder())
                    .build();

            // 1. Sorted Set에 사용자 랭킹 데이터 저장
            String key = redisKeyGenerator.getLeaderboardKey(member.getLeaderboardType());
            zSetOperations.add(key, member.getUserId(), member.getGainXp());

            // 2. Redis Hash에 전체 객체 저장 (userId와 leaderboardType을 조합한 키로 저장)
            String hashKey = redisKeyGenerator.getLeaderboardHashKey(member.getLeaderboardType());
            String memberKey = redisKeyGenerator.getMemberKey(member.getUserId(), member.getLeaderboardType());
            hashOperations.put(hashKey, memberKey, member); // userId와 leaderboardType을 조합한 키로 저장
        }
    }


    /**
     * 랭킹 정보 조회
     *
     * @param leaderboardType
     * @param userId
     * @return Map<String, Object>
     */
    public Map<String, Object> getRankingInfo(Long leaderboardType, Long userId) {
        String key = redisKeyGenerator.getLeaderboardKey(leaderboardType);
        String hashKey = redisKeyGenerator.getLeaderboardHashKey(leaderboardType);

        // 1. 상위 10명의 사용자 조회
        Set<ZSetOperations.TypedTuple<Object>> top10 = zSetOperations.rangeWithScores(key, 0, 9);

        if (top10 == null) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 2. 상위 10명의 사용자 정보를 JSON 구조에 맞게 매핑
        List<LeaderBoardMemberDTO> leaderboardMembersDTO = new ArrayList<>();
        for (ZSetOperations.TypedTuple<Object> entry : top10) {
            Object value = entry.getValue();
            Long id = Long.parseLong(value.toString());
            // Redis Hash에서 사용자 정보 조회
            String memberKey = redisKeyGenerator.getMemberKey(id, leaderboardType);
            Object redisMember = hashOperations.get(hashKey, memberKey);

            LeaderBoardMember member = objectMapper.convertValue(redisMember, LeaderBoardMember.class);

            if (member == null) {
                throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
            }

            LeaderBoardMemberDTO memberDTO = LeaderBoardMemberDTO.builder()
                    .userId(id)
                    .leaderboardType(member.getLeaderboardType())
                    .gainXp(member.getGainXp())
                    .userRank(member.getUserRank())
                    .order(member.getOrder())
                    .build();

            leaderboardMembersDTO.add(memberDTO);
        }

        // 3. 특정 사용자 정보 조회
        LeaderBoardMemberDTO userDTO = null;
        if (hashOperations.hasKey(hashKey, redisKeyGenerator.getMemberKey(userId, leaderboardType))) {
            Object userRedis = hashOperations.get(hashKey, redisKeyGenerator.getMemberKey(userId, leaderboardType));
            LeaderBoardMember user = objectMapper.convertValue(userRedis, LeaderBoardMember.class);
            userDTO = LeaderBoardMemberDTO.builder()
                    .leaderboardType(user.getLeaderboardType())
                    .userId(user.getUserId())
                    .gainXp(user.getGainXp())
                    .userRank(user.getUserRank())
                    .order(user.getOrder())
                    .build();
        }

        // 최종 결과를 JSON 구조로 반환
        Map<String, Object> ret = new HashMap<>();
        if (leaderboardType == 0) {
            ret.put("thisWeekLeaderBoard", leaderboardMembersDTO);
        } else {
            ret.put("lastWeekLeaderBoard", leaderboardMembersDTO);
        }
        ret.put("myLeaderBoard", userDTO);

        return ret;
    }


}
