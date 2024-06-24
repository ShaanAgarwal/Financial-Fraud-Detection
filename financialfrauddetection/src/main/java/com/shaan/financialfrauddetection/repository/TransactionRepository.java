package com.shaan.financialfrauddetection.repository;

import com.shaan.financialfrauddetection.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);

    List<Transaction> findByUserIdAndTimestampBetween(String userId, Date oneHourAgo, Date now);
}
