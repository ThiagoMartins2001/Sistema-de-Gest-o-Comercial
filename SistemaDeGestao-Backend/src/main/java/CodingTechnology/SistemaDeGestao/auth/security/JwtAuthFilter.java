package CodingTechnology.SistemaDeGestao.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import CodingTechnology.SistemaDeGestao.auth.service.JwtService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.stream.Collectors;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    // Processa requisição e valida token JWT
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userUsername;
        String requestPath = request.getRequestURI();
        log.info("Processing request: {} {}", request.getMethod(), requestPath);
        log.debug("Authorization header: {}",
                authHeader != null ? (authHeader.length() > 20 ? authHeader.substring(0, 20) + "..." : authHeader)
                        : "null");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in request");
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.debug("Extracted JWT (first 20 chars): {}", jwt.length() > 20 ? jwt.substring(0, 20) + "..." : jwt);

        try {
            userUsername = jwtService.extractUsername(jwt);
        } catch (Exception ex) {
            log.warn("Failed to extract username from JWT: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        log.debug("Username extracted from token: {}", userUsername);

        if (userUsername != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userUsername);

                boolean valid = false;
                try {
                    valid = jwtService.isTokenValid(jwt, userDetails);
                } catch (Exception ex) {
                    log.warn("Error while validating token: {}", ex.getMessage());
                    SecurityContextHolder.clearContext();
                }

                log.debug("Is token valid for user {}: {}", userUsername, valid);

                if (valid) {
                    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                    log.info("Setting authentication for user: {} with authorities: {}", userUsername,
                            authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication successfully set in SecurityContext for user: {}", userUsername);
                } else {
                    log.warn("Token invalid for user: {}", userUsername);
                    SecurityContextHolder.clearContext();
                }
            } catch (org.springframework.security.core.userdetails.UsernameNotFoundException ex) {
                log.warn("User not found: {}", userUsername);
                SecurityContextHolder.clearContext();
            } catch (Exception ex) {
                log.error("Unexpected error while processing authentication for user {}: {}", userUsername,
                        ex.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    // Define que o filtro não deve processar requisições de autenticação
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api/auth");
    }
}
