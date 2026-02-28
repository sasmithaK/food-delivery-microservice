package com.fooddeliverysystem.ordermanagementservice.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class SimpleUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // For consumer microservices, we trust the valid JWT token claims.
        return new org.springframework.security.core.userdetails.User(
                username,
                "",
                Collections.emptyList()
        );
    }
}
