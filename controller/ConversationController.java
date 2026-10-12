package com.example.inzynierka.controller;

import com.example.inzynierka.exception.NotFoundException;
import com.example.inzynierka.model.Car;
import com.example.inzynierka.model.Conversation;
import com.example.inzynierka.model.Message;
import com.example.inzynierka.model.User;
import com.example.inzynierka.repository.CarRepository;
import com.example.inzynierka.repository.ConversationRepository;
import com.example.inzynierka.repository.MessageRepository;
import com.example.inzynierka.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public ConversationController(ConversationRepository conversationRepository,
                                  MessageRepository messageRepository,
                                  UserRepository userRepository,
                                  CarRepository carRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    @PostMapping("/car/{carId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ConversationDto> createOrGetConversation(
            @PathVariable Long carId,
            Authentication auth
    ) {
        User current = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        User seller = car.getOwner();
        if (seller == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }


        User buyer = current;


        if (buyer.getId().equals(seller.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }


        Conversation conversation = conversationRepository
                .findByCarIdAndBuyerIdAndSellerId(car.getId(), buyer.getId(), seller.getId())
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setCar(car);
                    c.setBuyer(buyer);
                    c.setSeller(seller);
                    c.setCreatedAt(LocalDateTime.now());
                    return conversationRepository.save(c);
                });

        ConversationDto dto = mapConversation(conversation, current);

        return ResponseEntity.ok(dto);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<ConversationDto>> myConversations(Authentication auth) {

        User current = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<Conversation> conversations =
                conversationRepository.findByBuyerIdOrSellerId(current.getId(), current.getId());

        List<ConversationDto> result = conversations.stream()
                .map(c -> mapConversation(c, current))
                .toList();

        return ResponseEntity.ok(result);
    }


    @GetMapping("/{id}/messages")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long id,
            Authentication auth
    ) {
        User current = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));

        // sprawdź, czy user jest uczestnikiem (buyer albo seller)
        if (!conversation.getBuyer().getId().equals(current.getId())
                && !conversation.getSeller().getId().equals(current.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Message> messages = messageRepository
                .findByConversationIdOrderBySentAtAsc(conversation.getId());

        List<MessageDto> result = messages.stream()
                .map(this::mapMessage)
                .toList();

        return ResponseEntity.ok(result);
    }


    @PostMapping("/{id}/messages")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long id,
            @RequestBody CreateMessageRequest body,
            Authentication auth
    ) {
        User current = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));

        if (!conversation.getBuyer().getId().equals(current.getId())
                && !conversation.getSeller().getId().equals(current.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (body.content == null || body.content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Message msg = new Message();
        msg.setConversation(conversation);
        msg.setSender(current);
        msg.setContent(body.content.trim());
        msg.setSentAt(LocalDateTime.now());

        Message saved = messageRepository.save(msg);

        MessageDto dto = mapMessage(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Transactional
    public ResponseEntity<?> deleteConversation(
            @PathVariable Long id,
            Authentication auth
    ) {
        User current = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));


        if (!conversation.getBuyer().getId().equals(current.getId())
                && !conversation.getSeller().getId().equals(current.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        messageRepository.deleteByConversationId(conversation.getId());
        conversationRepository.delete(conversation);

        return ResponseEntity.noContent().build();
    }


    public record ConversationDto(
            Long id,
            Long carId,
            String carTitle,
            Long otherUserId,
            String otherUsername,
            String lastMessage,
            LocalDateTime lastMessageAt
    ) {}


    public record MessageDto(
            Long id,
            Long senderId,
            String senderUsername,
            String content,
            LocalDateTime sentAt
    ) {}

    public static class CreateMessageRequest {
        public String content;
    }

    private ConversationDto mapConversation(Conversation c, User currentUser) {

        User other = c.getBuyer().getId().equals(currentUser.getId())
                ? c.getSeller()
                : c.getBuyer();


        var lastOpt = messageRepository
                .findTop1ByConversationIdOrderBySentAtDesc(c.getId());

        String lastContent = lastOpt.map(Message::getContent).orElse(null);
        LocalDateTime lastAt = lastOpt.map(Message::getSentAt).orElse(null);

        String carTitle = c.getCar().getBrand() + " " + c.getCar().getModel();

        return new ConversationDto(
                c.getId(),
                c.getCar().getId(),
                carTitle,
                other.getId(),
                other.getUsername(),
                lastContent,
                lastAt
        );
    }

    private MessageDto mapMessage(Message m) {
        return new MessageDto(
                m.getId(),
                m.getSender().getId(),
                m.getSender().getUsername(),
                m.getContent(),
                m.getSentAt()
        );
    }
}
