package com.stockflow.repository;

import com.stockflow.entity.Movement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {

    @Query("SELECT m FROM Movement m WHERE m.product.id = :productId ORDER BY m.timestamp DESC")
    List<Movement> findByProductIdOrderByTimestampDesc(@Param("productId") Long productId);

    Page<Movement> findByProductIdOrderByTimestampDesc(Long productId, Pageable pageable);
}