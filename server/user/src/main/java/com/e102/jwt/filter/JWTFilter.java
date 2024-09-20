package com.e102.jwt.filter;

import com.e102.jwt.dto.CustomUserDetails;
import com.e102.jwt.dto.JWTUtil;
import com.e102.user.entity.User;
import com.e102.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;


    @Autowired
    public JWTFilter(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 헤더에서 access키에 담긴 토큰을 꺼냄

        //System.out.println("JWT Filter Accessed");
        String accessToken = request.getHeader("access");


// 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null) {
            //System.out.println("there is no accessToken");
            filterChain.doFilter(request, response);
            return;
        }

// 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            //response body
            //System.out.println("TOKEN EXPIRED");
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

// 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {
            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        String email = jwtUtil.getUserName(accessToken);

        User sUser = userRepository.findByEmail(email);

        if (sUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            PrintWriter writer = response.getWriter();
            writer.print("User not found");
            return;
        }

        CustomUserDetails customUserDetails = new CustomUserDetails(sUser);
        //실제 유저의 롤 설정

        Authentication authToken = new UsernamePasswordAuthenticationToken
                (customUserDetails, null, customUserDetails.getAuthorities());
        //인증 토큰 발급

        SecurityContextHolder.getContext().setAuthentication(authToken);
        //인증 토큰 설정
        
        filterChain.doFilter(request, response);
        //다음 필터로 넘김

    }
}

