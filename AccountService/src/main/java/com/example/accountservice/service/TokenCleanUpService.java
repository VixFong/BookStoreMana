package com.example.accountservice.service;

import com.example.accountservice.model.InvalidToken;
import com.example.accountservice.repo.InvalidTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenCleanUpService {

    @Autowired
    private InvalidTokenRepository invalidTokenRepository;

    @Scheduled(cron = "0 0 * * * ?") // Chạy mỗi giờ
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        List<InvalidToken> expiredTokens = invalidTokenRepository.findByExpireTimeBefore(now);
        invalidTokenRepository.deleteAll(expiredTokens);
    }
}

