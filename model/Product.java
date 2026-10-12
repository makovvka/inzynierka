package com.example.inzynierka.model;

import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.ElementCollection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double price;
    @ManyToOne
    private User owner;

    @ElementCollection
    private List<String> images = new ArrayList<>();
}