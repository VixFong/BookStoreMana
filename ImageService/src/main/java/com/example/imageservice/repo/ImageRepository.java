package com.example.imageservice.repo;

import com.example.imageservice.model.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends MongoRepository<Image,String> {
    Optional<Image> findByName(String name);
}
