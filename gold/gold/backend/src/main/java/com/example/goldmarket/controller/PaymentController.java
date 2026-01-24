package com.example.goldmarket.controller;

import com.example.goldmarket.model.User;
import com.example.goldmarket.model.Wallet;
import com.example.goldmarket.repository.UserRepository;
import com.example.goldmarket.repository.WalletRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public PaymentController(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @PostMapping("/mock-deposit")
    public ResponseEntity<?> mockDeposit(@AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, Object> data) {
        try {
            String email = principal.getAttribute("email");
            BigDecimal amount = new BigDecimal(data.get("amount").toString());

            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Wallet wallet = walletRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));

            // Simulate payment processing delay
            Thread.sleep(1000);

            // Add money to wallet
            wallet.setBalance(wallet.getBalance().add(amount));
            walletRepository.save(wallet);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment successful! ₹" + amount + " added to wallet");
            response.put("newBalance", wallet.getBalance());
            response.put("transactionId", "MOCK_" + System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, Object> data) {
        // Legacy endpoint for compatibility
        return mockDeposit(principal, data);
    }
}
