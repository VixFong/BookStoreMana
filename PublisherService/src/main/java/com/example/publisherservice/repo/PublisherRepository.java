package com.example.publisherservice.repo;

import com.example.publisherservice.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, String> {
    boolean existsPublisherByName(String name);
}
