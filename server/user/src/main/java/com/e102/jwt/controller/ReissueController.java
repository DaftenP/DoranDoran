package com.e102.jwt.controller;

import com.e102.jwt.dto.JWTUtil;
import com.e102.jwt.entity.RefreshToken;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/user")
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<Integer, RefreshToken> redisTemplate;

    @Autowired
    public ReissueController(JWTUtil jwtUtil, RedisTemplate<Integer, RefreshToken> redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    private void createCookie(HttpServletResponse response, int userId, String refreshToken) {
        String value = userId + ":" + refreshToken;
        String cookieName = "refresh";
        int maxAge = 24 * 60 * 60; // 24시간

        // 쿠키 값 인코딩 (필요한 경우)
        String encodedValue = URLEncoder.encode(value, StandardCharsets.UTF_8);

        // 쿠키 문자열 생성
        String cookieString = String.format(
                "%s=%s; Max-Age=%d; Path=/; Domain=.ssafy.picel.net; HttpOnly; SameSite=None; Secure",
                cookieName, encodedValue, maxAge
        );

        // 응답 헤더에 쿠키 추가
        response.setHeader("Set-Cookie", cookieString);
    }

    //현재 RefreshEntity 추가하는 함수
    private void addRefreshEntity(int userId, String refresh, Long expiredMs) {

        RefreshToken refreshToken = new RefreshToken(refresh);

        ValueOperations<Integer,RefreshToken> vop = redisTemplate.opsForValue();

        vop.set(userId,refreshToken);

        redisTemplate.expire(userId,expiredMs, TimeUnit.MILLISECONDS);
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        //get refresh token
        int userId = -1;
        String refresh = null;
        //모든 쿠키 배열 가져온다
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            //리프레시 토큰 있는지 확인
            if (cookie.getName().equals("refresh")) {
                String[] ret = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8).split(":");
                userId = Integer.parseInt(ret[0]);
                refresh = ret[1];

                //System.out.println("UID : "+userId);
                //System.out.println("Refresh Token : "+refresh);
            }
        }

        if (refresh == null) {
            //response status code
            //refresh 토큰이 만료되었다고 알림
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }


        //REDIS에 저장되어 있는 지 확인

        //REDIS에 저장되어 있는지 확인
        boolean isExist = redisTemplate.hasKey(userId);

        String username = jwtUtil.getUserName(refresh);
        String role = jwtUtil.getRole(refresh);

        if (!isExist) {
            //response body
            //System.out.println("REDIS에 없다.");
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //System.out.println("REDIS에 있다.");
        //검증 완료 => 새로운 Access 토큰 생성해서 리턴

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L);


        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장

        addRefreshEntity(userId, newRefresh, 86400000L);

        //response
        response.setHeader("access", newAccess);
        createCookie(response, userId, refresh);
        //쿠키에 리프레시 토큰 넣어줌

        //새로운 Access Token 과 Refresh Token 넣어준다

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
