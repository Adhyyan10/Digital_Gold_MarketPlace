package com.example.goldmarket.controller;

import com.example.goldmarket.model.User;
import com.example.goldmarket.model.Wallet;
import com.example.goldmarket.repository.UserRepository;
import com.example.goldmarket.repository.WalletRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, allowCredentials = "true")
public class PublicController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public PublicController(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @GetMapping("/demo-login")
    public ResponseEntity<?> demoLogin() {
        System.out.println("DEBUG: demoLogin endpoint called");
        String email = "demo@example.com";
        String name = "Demo User";
        String password = "demo123";

        // Create or get demo user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(password);
            newUser.setProvider("local"); // Changed to local to allow password login
            newUser.setOauthProviderId("demo-123");
            User savedUser = userRepository.save(newUser);

            // Create initial wallet
            Wallet wallet = new Wallet();
            wallet.setUser(savedUser);
            wallet.setCurrency("INR");
            wallet.setBalance(new BigDecimal("50000.00"));
            walletRepository.save(wallet);

            return savedUser;
        });
        
        // Ensure password is set if user already existed
        if (user.getPassword() == null || !user.getPassword().equals(password)) {
            user.setPassword(password);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Demo user ready", "email", email, "password", password));
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok(Map.of("status", "ok", "userCount", count, "db", "connected"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
