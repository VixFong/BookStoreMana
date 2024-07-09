package com.example.notificationservice.repo;

import com.example.notificationservice.model.Notification;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
//    List<Notification> findTop10ByOrderByTimestampDesc();

    @Query("SELECT n FROM Notification n ORDER BY n.timestamp DESC")
    List<Notification> findAllByTimestampDesc();

    @Query("SELECT n FROM Notification n WHERE n.status = :status ORDER BY n.timestamp DESC")
    List<Notification> findAllByStatusOrderByTimestampDesc(String status);

//    @Query("SELECT n FROM Notification n WHERE n.timestamp BETWEEN :startDate AND :endDate")
//    Page<Notification> findByFilter(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
