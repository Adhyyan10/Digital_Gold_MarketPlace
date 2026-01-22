package com.example.goldmarket.security;

import com.example.goldmarket.model.User;
import com.example.goldmarket.model.Wallet;
import com.example.goldmarket.repository.UserRepository;
import com.example.goldmarket.repository.WalletRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public CustomOAuth2UserService(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isEmpty()) {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider("google");
            user.setOauthProviderId(email); // Using email as ID for simplicity
            user = userRepository.save(user);

            // Create wallet for new user
            Wallet wallet = new Wallet();
            wallet.setUser(user);
            wallet.setCurrency("INR");
            wallet.setBalance(new BigDecimal("10000.00")); // Initial balance
            walletRepository.save(wallet);
        } else {
            user = userOptional.get();
        }

        return oauth2User;
    }
}
