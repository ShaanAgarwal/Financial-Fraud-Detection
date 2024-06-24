package com.shaan.financialfrauddetection.controller;

import com.shaan.financialfrauddetection.model.FraudTransaction;
import com.shaan.financialfrauddetection.service.FraudTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fraud-transactions")
public class FraudTransactionController {
    @Autowired
    private FraudTransactionService fraudTransactionService;

    @GetMapping
    public List<FraudTransaction> getAllFraudTransactions() {
        return fraudTransactionService.getAllFraudTransactions();
    }

    @GetMapping("/{id}")
    public Optional<FraudTransaction> getFraudTransactionById(@PathVariable("id") String id) {
        return fraudTransactionService.getFraudTransactionById(id);
    }

    @GetMapping("/user/{userId}")
    public List<FraudTransaction> getFraudTransactionsByUserId(@PathVariable("userId") String userId) {
        return fraudTransactionService.getFraudTransactionsByUserId(userId);
    }

    @GetMapping("/recipient/{recipientId}")
    public List<FraudTransaction> getFraudTransactionsByRecipientId(@PathVariable String recipientId) {
        return fraudTransactionService.getFraudTransactionsByRecipientId(recipientId);
    }

    @GetMapping("/description/{description}")
    public List<FraudTransaction> getFraudTransactionsByDescription(@PathVariable String description) {
        return fraudTransactionService.getFraudTransactionsByDescription(description);
    }
}