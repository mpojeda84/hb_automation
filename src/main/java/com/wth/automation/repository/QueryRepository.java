package com.wth.automation.repository;

import com.wth.automation.domain.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Query entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QueryRepository extends MongoRepository<Query, String> {

}
