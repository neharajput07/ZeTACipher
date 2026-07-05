package com.zetacipher.backend.repository;

import com.zetacipher.backend.model.HandshakeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandshakeLogRepository extends JpaRepository<HandshakeLog, Long> {

    // Spring Data JPA auto-generates the query from the method name
    List<HandshakeLog> findAllByOrderByTimestampDesc();
}