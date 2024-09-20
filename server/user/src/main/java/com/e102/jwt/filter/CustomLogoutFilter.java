package com.e102.jwt.filter;

import com.e102.common.ResponseDto;
import com.e102.common.exception.StatusCode;
import com.e102.jwt.entity.RefreshToken;
import com.e102.jwt.dto.JWTUtil;
import com.e102.user.entity.User;
import com.e102.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.filter.GenericFilterBean;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<Integer, RefreshToken> redisTemplate;
    private final UserRepository userRepository;

    @Autowired
    public CustomLogoutFilter(JWTUtil jwtUtil, RedisTemplate<Integer, RefreshToken> redisTemplate,  UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    //현재 RefreshEntity 추가하는 함수
    private void addRefreshEntity(int userId, String refresh, Long expiredMs) {

         RefreshToken refreshToken = new RefreshToken(refresh);

        ValueOperations<Integer,RefreshToken> vop = redisTemplate.opsForValue();

        vop.set(userId,refreshToken);

        redisTemplate.expire(userId,expiredMs, TimeUnit.MILLISECONDS);

    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        //path and method verify
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^\\/api\\/v1\\/user\\/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }
        String requestMethod = request.getMethod();
        if (requestMethod.equals("POST") || requestMethod.equals("DELETE")) {
            //get refresh token
            int userId = -1;
            String refresh = null;

            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    String[] ret = cookie.getValue().split(":");
                    userId = Integer.parseInt(ret[0]);
                    refresh = ret[1];

                    //System.out.println("UID : "+userId);
                    //System.out.println("Refresh Token : "+refresh);
                }
            }



            //refresh null check
            if (refresh == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            //expired check
            try {
                jwtUtil.isExpired(refresh);
            } catch (ExpiredJwtException e) {

                //response status code
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
            String category = jwtUtil.getCategory(refresh);
            if (!category.equals("refresh")) {
                //response status code
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            //DB에 저장되어 있는지 확인

            //REDIS에 저장되어 있는지 확인
            boolean isExist = redisTemplate.hasKey(userId);

            //Boolean isExist = refreshRepository.existsByRefresh(refresh);
            //DB에 저장되어 있지 않음 => 이미 로그 아웃
            if (!isExist) {
                //System.out.println("이미 로그 아웃");
                //response status code
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            //로그아웃 진행
            //Refresh 토큰 REDIS에서 제거
            redisTemplate.delete(userId);

            //Refresh 토큰 Cookie 값 0
            //바로 삭제되게 구현
            Cookie cookie = new Cookie("refresh", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");

            response.addCookie(cookie);

            StatusCode statusCode = StatusCode.SUCCESS;

            if(requestMethod.equals("DELETE")){
                //System.out.println("DELETE USER");

                User sUser = userRepository.findById(userId);
                if(sUser == null){
                    statusCode = StatusCode.NO_EMAIL;
                }
                else{
                    userRepository.deleteById(sUser.getId());
                    //해당하는 유저 지운다
                    statusCode = StatusCode.DROP_SUCCESS;
                }

            }

            // 응답에 JSON 형식으로 메시지를 반환하기 위해 ObjectMapper 사용
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_OK);

            String jsonResponse = ResponseDto.toJsonString(statusCode);

            response.getWriter().write(jsonResponse);

        }
        else{
            filterChain.doFilter(request, response);
            // 응답에 JSON 형식으로 메시지를 반환하기 위해 ObjectMapper 사용
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_OK);

            String jsonResponse = ResponseDto.toJsonString(StatusCode.METHOD_NOT_ALLOWED);

            response.getWriter().write(jsonResponse);
            return;
        }


    }

}
