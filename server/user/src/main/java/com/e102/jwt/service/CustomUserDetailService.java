package com.e102.jwt.service;

import com.e102.jwt.dto.CustomUserDetails;
import com.e102.user.repository.UserRepository;
import com.e102.user.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        //해당하는 유저 찾는다.
        if(user != null){
            return new CustomUserDetails(user);
        }
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
