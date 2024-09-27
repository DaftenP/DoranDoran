package com.e102.config;

import com.e102.jwt.dto.JWTUtil;
import com.e102.jwt.entity.RefreshToken;
import com.e102.jwt.filter.CustomLogoutFilter;
import com.e102.jwt.filter.JWTFilter;
import com.e102.jwt.filter.LoginFilter;
import com.e102.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입

    private final AuthenticationConfiguration authenticationConfiguration;

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;

    private final RedisTemplate<Integer, RefreshToken> redisTemplate;

    @Autowired
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, UserRepository userRepository, RedisTemplate<Integer, RefreshToken> redisTemplate) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    //Bcrypt 형식으로 암호화 해주는 Encoder 빈으로 등록
    @Bean
    public BCryptPasswordEncoder bCryptPassWordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    //Security Filter Chain 구현
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        http
                .csrf((auth) -> auth.disable());

        http
                .formLogin((auth) -> auth.disable());

        http
                .httpBasic((auth) -> auth.disable());

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/healthz").permitAll()
                        .requestMatchers("api/v1/user/**").permitAll()
                        .requestMatchers("/api/v1/mail/**").permitAll() // 변경된 부분
                        .anyRequest().authenticated());
        //JWTFilter 등록
        http
                .addFilterBefore(new JWTFilter(jwtUtil,userRepository), LoginFilter.class);

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil,userRepository,redisTemplate), UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, redisTemplate,userRepository), LogoutFilter.class);
        
        // 로그인 필터 이전에 JWT Filter와 CustomLogout Filter 등록
        
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        http
                .cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","https://ssafy.picel.net"));

                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);

                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                        return configuration;
                    }
                })));
        
        //CORS설정

        return http.build();
    }
}
