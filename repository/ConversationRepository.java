package com.example.inzynierka.repository;

import com.example.inzynierka.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {


    List<Conversation> findByBuyerIdOrSellerId(Long buyerId, Long sellerId);


    Optional<Conversation> findByCarIdAndBuyerIdAndSellerId(Long carId, Long buyerId, Long sellerId);
}
