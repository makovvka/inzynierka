package com.example.inzynierka.spec;

import com.example.inzynierka.model.Car;
import org.springframework.data.jpa.domain.Specification;

public class CarSpecifications {

    public static Specification<Car> hasBrand(String brand) {
        return (root, q, cb) -> (brand == null || brand.isBlank())
                ? null
                : cb.equal(cb.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Car> hasModel(String model) {
        return (root, q, cb) -> (model == null || model.isBlank())
                ? null
                : cb.equal(cb.lower(root.get("model")), model.toLowerCase());
    }

    public static Specification<Car> yearFrom(Integer minYear) {
        return (root, q, cb) -> (minYear == null) ? null : cb.greaterThanOrEqualTo(root.get("year"), minYear);
    }

    public static Specification<Car> yearTo(Integer maxYear) {
        return (root, q, cb) -> (maxYear == null) ? null : cb.lessThanOrEqualTo(root.get("year"), maxYear);
    }

    public static Specification<Car> priceFrom(Double minPrice) {
        return (root, q, cb) -> (minPrice == null) ? null : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Car> priceTo(Double maxPrice) {
        return (root, q, cb) -> (maxPrice == null) ? null : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Car> mileageFrom(Integer minMileage) {
        return (root, q, cb) -> (minMileage == null) ? null : cb.greaterThanOrEqualTo(root.get("mileage"), minMileage);
    }

    public static Specification<Car> mileageTo(Integer maxMileage) {
        return (root, q, cb) -> (maxMileage == null) ? null : cb.lessThanOrEqualTo(root.get("mileage"), maxMileage);
    }

    public static Specification<Car> descriptionContains(String text) {
        return (root, q, cb) -> (text == null || text.isBlank())
                ? null
                : cb.like(cb.lower(root.get("description")), "%" + text.toLowerCase() + "%");
    }
    public static Specification<Car> hasCity(String city) {
        return (root, query, cb) -> {
            if (city == null || city.isEmpty()) return null;
            return cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%");
        };
    }
}
