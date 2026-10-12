package com.example.inzynierka.repository;

import com.example.inzynierka.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Long> {
}