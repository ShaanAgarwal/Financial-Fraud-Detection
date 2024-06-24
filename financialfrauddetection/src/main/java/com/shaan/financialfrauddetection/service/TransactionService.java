package com.shaan.financialfrauddetection.service;

import com.shaan.financialfrauddetection.model.Transaction;
import com.shaan.financialfrauddetection.model.User;
import com.shaan.financialfrauddetection.repository.TransactionRepository;
import com.shaan.financialfrauddetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FraudTransactionService fraudTransactionService;

    public Transaction createTransaction(Transaction transaction) {
        User sender = userRepository.findById(transaction.getUserId()).orElse(null);
        User recipient = userRepository.findById(transaction.getRecipientId()).orElse(null);
        if (sender == null || recipient == null) {
            throw new RuntimeException("Sender or recipient not found");
        }
        if (sender.getAccountBalance() < transaction.getAmount()) {
            throw new RuntimeException("Insufficient funds for the transaction");
        }
        sender.setAccountBalance(sender.getAccountBalance() - transaction.getAmount());
        recipient.setAccountBalance(recipient.getAccountBalance() + transaction.getAmount());
        userRepository.save(sender);
        userRepository.save(recipient);
        Transaction savedTransaction = transactionRepository.save(transaction);
        fraudTransactionService.detectHighAmountFraud(transaction);
        fraudTransactionService.detectVelocityFraud(transaction);
        fraudTransactionService.detectUnusualPatternFraud(transaction);
        fraudTransactionService.detectSuddenIncreaseInFrequencyFraud(savedTransaction);
        return savedTransaction;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }
}
