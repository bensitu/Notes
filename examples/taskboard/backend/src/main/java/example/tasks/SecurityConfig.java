package example.tasks;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@Configuration
class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    UserDetailsService users(PasswordEncoder encoder, @Value("${app.password}") String password) {
        return new InMemoryUserDetailsManager(
                User.withUsername("admin").password(encoder.encode(password)).roles("ADMIN").build());
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/csrf", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/tasks/**").hasRole("ADMIN")
                .anyRequest().authenticated());
        http.exceptionHandling(errors -> errors
                .authenticationEntryPoint((req, res, error) -> res.sendError(401))
                .accessDeniedHandler((req, res, error) -> res.sendError(403)));
        http.formLogin(form -> form.loginProcessingUrl("/api/login")
                .successHandler((req, res, auth) -> res.setStatus(204))
                .failureHandler((req, res, error) -> res.sendError(401)).permitAll());
        http.logout(logout -> logout.logoutUrl("/api/logout")
                .logoutSuccessHandler((req, res, auth) -> res.setStatus(204)));
        return http.build();
    }
}

@RestController
class CsrfController {
    @GetMapping("/api/csrf")
    Map<String, String> token(CsrfToken token) {
        return Map.of("headerName", token.getHeaderName(), "token", token.getToken());
    }
}
