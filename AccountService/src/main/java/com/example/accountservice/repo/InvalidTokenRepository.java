package com.example.accountservice.repo;

import com.example.accountservice.model.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvalidTokenRepository extends JpaRepository<InvalidToken, String> {
    List<InvalidToken> findByExpireTimeBefore(LocalDateTime now);
}
