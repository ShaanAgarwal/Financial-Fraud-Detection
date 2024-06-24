package com.shaan.financialfrauddetection.repository;

import com.shaan.financialfrauddetection.model.FraudTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FraudTransactionRepository extends MongoRepository<FraudTransaction, String> {
    List<FraudTransaction> findByUserId(String userId);
    List<FraudTransaction> findByRecipientId(String recipientId);
    List<FraudTransaction> findByDescription(String description);
}
