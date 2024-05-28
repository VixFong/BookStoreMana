package com.example.accountservice.repo;

import com.example.accountservice.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsUsersByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("{'$or': [{'fullName': {'$regex': ?0, '$options': 'i'}}, {'email': {'$regex': ?0, '$options': 'i'}}]}")
    List<User> findByFullNameOrEmail(String keyword);}
