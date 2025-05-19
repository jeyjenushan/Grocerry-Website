package org.ai.server.configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Value("${frontend.user.url}")
    private String frontendUserUrl;

    @Value("${frontend.admin.url}")
    private String frontendAdminUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints (no auth required)
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/forgotpassword/reset-password",
                                "/api/auth/forgotpassword/verify-otp", "/api/auth/forgotpassword/send-otp",
                                "/api/product/productList", "/api/product/{productId}" ).permitAll()
                  //Authenticated user end points
                        .requestMatchers("/api/user/addAddress","/api/user/getAddress","/api/userDetails/","/api/notifications/reject"
                                ).hasAnyRole("SELLER","USER","DELIVERER")
                        .requestMatchers("/api/orders/placeOrder",
                                "/api/orders/user","/api/orders/pay","/api/orders/verify","/api/ratings"
                                ).hasAnyRole("SELLER","USER","DELIVERER")
                        //User only end points
                        .requestMatchers("/api/auth/updateRole").hasRole("USER")
                        // Seller-only endpoints (POST methods)
                        .requestMatchers(HttpMethod.POST,"/api/product/addProduct" ).hasRole("SELLER")
                        .requestMatchers(HttpMethod.GET, "/api/seller/dashboardData" ).hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT,"/api/product/update/*").hasRole("SELLER")
                        .requestMatchers("/api/notifications/{id}/read","/api/notifications/{notificationId}/action-taken").hasRole("SELLER")
                        .requestMatchers("/api/deliverers/**").hasRole("SELLER")
                        .requestMatchers("/api/orders/","/api/orders/totalAmount").hasRole("SELLER")
                        //Deliverer-boy end points
                        .requestMatchers("/api/deliverers").hasRole("DELIVERER")
                        .requestMatchers("/api/deliveries/accept/**","/api/deliveries/reject/**",
                                "/api/deliveries/verify/**","/api/orders/getAllOrders").hasRole("DELIVERER")
                        //deliverer-boy and seller
                        .requestMatchers("/api/deliveries/getEarning","/api/deliveries/deliveryOrderStats")
                        .hasAnyRole("SELLER","DELIVERER")
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList(
                    "http://localhost:8081", // React Native default
                    "http://10.0.2.2:8081", // Android emulator
                    "http://localhost:19006",
                    frontendUserUrl
                    // Expo dev server
            )); // For development only, specify your app's URL in production
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setExposedHeaders(List.of("Authorization"));
            config.setAllowCredentials(true);
            config.setMaxAge(3600L);
            return config;
        };
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
