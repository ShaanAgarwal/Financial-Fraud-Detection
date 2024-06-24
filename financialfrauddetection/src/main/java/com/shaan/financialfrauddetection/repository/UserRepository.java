package com.shaan.financialfrauddetection.repository;

import com.shaan.financialfrauddetection.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);
}
