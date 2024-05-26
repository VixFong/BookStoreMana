package com.example.accountservice.repo;

import com.example.accountservice.model.InvalidToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidTokenRepository extends MongoRepository<InvalidToken, String> {
}
