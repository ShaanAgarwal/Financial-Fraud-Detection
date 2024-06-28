package com.shaan.financialfrauddetection.service;

import com.shaan.financialfrauddetection.model.FraudTransaction;
import com.shaan.financialfrauddetection.model.Transaction;
import com.shaan.financialfrauddetection.repository.FraudTransactionRepository;
import com.shaan.financialfrauddetection.repository.TransactionRepository;
import com.shaan.financialfrauddetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FraudTransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FraudTransactionRepository fraudTransactionRepository;
    @Autowired
    private TransactionService transactionService;

    public List<FraudTransaction> getAllFraudTransactions() {
        return fraudTransactionRepository.findAll();
    }

    public Optional<FraudTransaction> getFraudTransactionById(String id) {
        return fraudTransactionRepository.findById(id);
    }

    public List<FraudTransaction> getFraudTransactionsByUserId(String userId) {
        return fraudTransactionRepository.findByUserId(userId);
    }

    public List<FraudTransaction> getFraudTransactionsByRecipientId(String recipientId) {
        return fraudTransactionRepository.findByRecipientId(recipientId);
    }

    public List<FraudTransaction> getFraudTransactionsByDescription(String description) {
        return fraudTransactionRepository.findByDescription(description);
    }

    public void detectHighAmountFraud(Transaction transaction) {
        List<Transaction> userTransactions = transactionService.getTransactionsByUserId(transaction.getUserId());
        double averageAmount = userTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(0.0);
        if (transaction.getAmount() > 3 * averageAmount) {
            FraudTransaction fraudTransaction = new FraudTransaction();
            fraudTransaction.setTransactionId(transaction.getId());
            fraudTransaction.setUserId(transaction.getUserId());
            fraudTransaction.setRecipientId(transaction.getRecipientId());
            fraudTransaction.setDescription("Transaction amount is three times the average");
            fraudTransaction.setTimestamp(new Date());
            fraudTransactionRepository.save(fraudTransaction);
        }
    }

    public void detectVelocityFraud(Transaction transaction) {
        Date now = new Date();
        long oneHourMillis = 60 * 60 * 1000;
        Date oneHourAgo = new Date(now.getTime() - oneHourMillis);
        List<Transaction> recentTransactions = transactionRepository.findByUserIdAndTimestampBetween(
                transaction.getUserId(), oneHourAgo, now);
        int transactionCount = recentTransactions.size();
        double totalAmount = recentTransactions.stream().mapToDouble(Transaction::getAmount).sum();
        int transactionCountThreshold = 10;
        double totalAmountThreshold = 10000;
        if (transactionCount > transactionCountThreshold && totalAmount > totalAmountThreshold) {
            FraudTransaction fraudTransaction = new FraudTransaction();
            fraudTransaction.setTransactionId(transaction.getId());
            fraudTransaction.setUserId(transaction.getUserId());
            fraudTransaction.setRecipientId(transaction.getRecipientId());
            fraudTransaction.setDescription("Velocity fraud detected");
            fraudTransaction.setTimestamp(now);
            fraudTransactionRepository.save(fraudTransaction);
        }
    }

    public void detectUnusualPatternFraud(Transaction transaction) {
        List<Transaction> userTransactions = transactionService.getTransactionsByUserId(transaction.getUserId());
        userTransactions = userTransactions.stream()
                .filter(t -> !t.getId().equals(transaction.getId()))
                .collect(Collectors.toList());
        if (userTransactions.isEmpty()) {
            return;
        }
        List<Integer> hours = userTransactions.stream()
                .map(t -> t.getTimestamp().toInstant().atZone(ZoneId.systemDefault()).getHour())
                .collect(Collectors.toList());
        int currentHour = transaction.getTimestamp().toInstant().atZone(ZoneId.systemDefault()).getHour();
        long usualHoursCount = hours.stream().filter(hour -> hour == currentHour).count();
        List<String> recipients = userTransactions.stream()
                .map(Transaction::getRecipientId)
                .collect(Collectors.toList());
        boolean isUnusualRecipient = !recipients.contains(transaction.getRecipientId());
        double unusualTimeThreshold = 0.1;
        if ((usualHoursCount / (double) userTransactions.size()) < unusualTimeThreshold && isUnusualRecipient) {
            FraudTransaction fraudTransaction = new FraudTransaction();
            fraudTransaction.setTransactionId(transaction.getId());
            fraudTransaction.setUserId(transaction.getUserId());
            fraudTransaction.setRecipientId(transaction.getRecipientId());
            fraudTransaction.setDescription("Unusual transaction pattern detected");
            fraudTransaction.setTimestamp(new Date());
            fraudTransactionRepository.save(fraudTransaction);
        }
    }

    public void detectSuddenIncreaseInFrequencyFraud(Transaction transaction) {
        Date now = new Date();
        long oneHourMillis = 60 * 60 * 1000;
        Date oneHourAgo = new Date(now.getTime() - oneHourMillis);
        long oneWeekMillis = 7 * 24 * 60 * 60 * 1000;
        Date oneWeekAgo = new Date(now.getTime() - oneWeekMillis);

        List<Transaction> recentTransactions = transactionRepository.findByUserIdAndTimestampBetween(
                transaction.getUserId(), oneHourAgo, now);
        List<Transaction> weeklyTransactions = transactionRepository.findByUserIdAndTimestampBetween(
                transaction.getUserId(), oneWeekAgo, now);

        if (weeklyTransactions.size() < 10) {
            return;
        }

        double averageTransactionsPerHour = (double) weeklyTransactions.size() / (7 * 24);
        if (recentTransactions.size() > 3 * averageTransactionsPerHour) {
            FraudTransaction fraudTransaction = new FraudTransaction();
            fraudTransaction.setTransactionId(transaction.getId());
            fraudTransaction.setUserId(transaction.getUserId());
            fraudTransaction.setRecipientId(transaction.getRecipientId());
            fraudTransaction.setDescription("Sudden increase in transaction frequency detected");
            fraudTransaction.setTimestamp(now);
            fraudTransactionRepository.save(fraudTransaction);
        }
    }
}