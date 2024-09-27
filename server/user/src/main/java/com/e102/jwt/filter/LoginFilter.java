package com.e102.jwt.filter;

import com.e102.common.ResponseDto;
import com.e102.common.exception.*;
import com.e102.jwt.dto.JWTUtil;
import com.e102.jwt.entity.RefreshToken;
import com.e102.user.dto.UserLoginDTO;
import com.e102.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;


public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;

    private final RedisTemplate<Integer, RefreshToken> redisTemplate;


    @Autowired
    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserRepository userRepository, RedisTemplate<Integer, RefreshToken> redisTemplate){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        setFilterProcessesUrl("/api/v1/user/login");

    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            System.out.println("NOT POST");
            throw new RuntimeException("Authentication method not supported: " + request.getMethod());
        }

        // Convert JSON body to UserLoginDTO
        ObjectMapper objectMapper = new ObjectMapper();
        UserLoginDTO userLoginDTO = null;
        try {
            userLoginDTO = objectMapper.readValue(request.getInputStream(), UserLoginDTO.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse authentication request", e);
        }

        // Extract email and password from UserLoginDTO
        String email = userLoginDTO.getEmail();
        String password = userLoginDTO.getPassword();

        // Check if email exists
        if (!userRepository.existsByEmail(email)) {
            throw new BadCredentialsException("Email not found");
        }

        //System.out.println("email : " + email);
        //System.out.println("password : " + password);

        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

        try {
            return authenticationManager.authenticate(authToken);
        } catch (BadCredentialsException e) {
            // Log the exception for debugging
            //System.err.println("Authentication failed for user: " + email);
            throw e; // rethrow to be handled by unsuccessfulAuthentication
        }
    }
    
    private Cookie createCookie(int userId, String refreshToken) {
        String value = userId +":"+refreshToken;
        Cookie cookie = new Cookie("refresh", value);
        cookie.setMaxAge(24*60*60);
        //24시간 활성화

        //cookie.setSecure(true); 
        //HTTPS 쓸 경우 활성화
        cookie.setPath("/");
        // 쿠키가 적용될 범위 설정
        cookie.setHttpOnly(true);
        //JS단에서 접근 못하게 막는다
        return cookie;
    }

    //현재 RefreshEntity 추가하는 함수
    private void addRefreshEntity(int userId, String refresh, Long expiredMs) {

        RefreshToken refreshToken = new RefreshToken(refresh);

        ValueOperations<Integer,RefreshToken> vop = redisTemplate.opsForValue();

        vop.set(userId,refreshToken);

        redisTemplate.expire(userId,expiredMs, TimeUnit.MILLISECONDS);

    }

    @Override
    //성공적으로 인증이 된다면
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, Authentication authentication) throws ServletException, IOException {
        //유저 정보
        //System.out.println("Succesfully accessed ");
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //System.out.println("name :" + username);
        //System.out.println("role : " + role);

        //토큰 생성
        String access = jwtUtil.createJwt("access", username, role, 600000L);
        String refresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        int userId = userRepository.findByEmail(username).getId();



        //Server에 Refresh 토큰 저장
        addRefreshEntity(userId, refresh, 86400000L);

        //응답 설정
        response.setHeader("access", access);
        //헤더에 엑세스 토큰 넣어줌
        response.addCookie(createCookie(userId, refresh));
        //쿠키에 리프레시 토큰 넣어줌

        // 응답에 JSON 형식으로 메시지를 반환하기 위해 ObjectMapper 사용
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        String jsonResponse = ResponseDto.toJsonString(StatusCode.SUCCESS);

        response.getWriter().write(jsonResponse);
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String jsonResponse;
        // Check the type of AuthenticationException
        if (failed.getMessage().contains("Email not found")) {
            jsonResponse = ResponseDto.toJsonString(StatusCode.NO_EMAIL);
        } else {
            jsonResponse = ResponseDto.toJsonString(StatusCode.WRONG_PW);
        }

        response.getWriter().write(jsonResponse);
    }


}
