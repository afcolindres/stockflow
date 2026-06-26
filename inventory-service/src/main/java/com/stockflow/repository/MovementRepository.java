package com.stockflow.repository;

import com.stockflow.entity.Movement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {

    List<Movement> findByProductIdOrderByTimestampDesc(Long productId);

    List<Movement> findByProductId(Long productId);
}