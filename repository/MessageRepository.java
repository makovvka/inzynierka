package com.example.inzynierka.repository;

import com.example.inzynierka.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {


    List<Message> findByConversationIdOrderBySentAtAsc(Long conversationId);


    Optional<Message> findTop1ByConversationIdOrderBySentAtDesc(Long conversationId);

    void deleteByConversationId(Long conversationId);
}
