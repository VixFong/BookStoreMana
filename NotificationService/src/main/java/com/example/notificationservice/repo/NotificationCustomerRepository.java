package com.example.notificationservice.repo;

import com.example.notificationservice.model.Notification;
import com.example.notificationservice.model.NotificationCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationCustomerRepository extends JpaRepository<NotificationCustomer, String> {
//    List<Notification> findTop10ByOrderByTimestampDesc();

    @Query("SELECT n FROM NotificationCustomer n ORDER BY n.timestamp DESC")
    List<NotificationCustomer> findAllByTimestampDesc();

//    @Query("SELECT n FROM NotificationCustomer n WHERE n.email = :email AND n.status = :status ORDER BY n.timestamp DESC")
//    List<NotificationCustomer> findAllByEmailAndStatusOrderByTimestampDesc(String email, String status);


    @Query("SELECT n FROM NotificationCustomer n WHERE n.status = :status ORDER BY n.timestamp DESC")
    List<NotificationCustomer> findAllByStatusOrderByTimestampDesc(String status);

    Optional<NotificationCustomer> findByEmail(String email);
}
