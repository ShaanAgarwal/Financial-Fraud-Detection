package com.shaan.financialfrauddetection.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "fraud_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FraudTransaction {
    @Id
    private String id;
    private String transactionId;
    private String userId;
    private String recipientId;
    private String description;
    private Date timestamp;
}
