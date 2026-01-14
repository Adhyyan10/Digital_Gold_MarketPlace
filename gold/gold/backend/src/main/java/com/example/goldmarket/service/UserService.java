package com.example.goldmarket.service;

import com.example.goldmarket.model.Transaction;
import com.example.goldmarket.model.User;
import com.example.goldmarket.model.Wallet;
import com.example.goldmarket.repository.TransactionRepository;
import com.example.goldmarket.repository.UserRepository;
import com.example.goldmarket.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final LivePriceService livePriceService;

    public UserService(UserRepository userRepository, WalletRepository walletRepository,
            TransactionRepository transactionRepository, LivePriceService livePriceService) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.livePriceService = livePriceService;
    }

    public Wallet getWallet(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return walletRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    public List<Transaction> getHistory(String email) {
        Wallet wallet = getWallet(email);
        return transactionRepository.findByWalletIdOrderByTimestampDesc(wallet.getId());
    }

    @Transactional
    public Transaction trade(String email, String type, String symbol, BigDecimal amount) {
        Wallet wallet = getWallet(email);
        BigDecimal currentPrice = livePriceService.getPrice(symbol);
        BigDecimal totalCost = currentPrice.multiply(amount);

        if ("BUY".equalsIgnoreCase(type)) {
            if (wallet.getBalance().compareTo(totalCost) < 0) {
                throw new RuntimeException("Insufficient funds");
            }
            wallet.setBalance(wallet.getBalance().subtract(totalCost));
        } else if ("SELL".equalsIgnoreCase(type)) {
            // Simplified: Not checking if user owns the asset for this mock, just adding
            // funds
            wallet.setBalance(wallet.getBalance().add(totalCost));
        } else {
            throw new IllegalArgumentException("Invalid trade type");
        }

        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setType(type.toUpperCase());
        transaction.setSymbol(symbol);
        transaction.setAmount(amount);
        transaction.setPrice(currentPrice);
        transaction.setTimestamp(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }
}
