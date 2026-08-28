package com.rentease.catalogservice.repository;

import com.rentease.catalogservice.entity.Vehicle;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> buildFilter(String category, String city, String district, 
                                                     Double minRate, Double maxRate, Boolean hasAC, 
                                                     String transmission, String fuel, Integer minSeats) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), "ACTIVE"));

            if (category != null && !category.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }
            if (city != null && !city.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("city"), city));
            }
            if (district != null && !district.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("district"), district));
            }
            if (minRate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dailyRateLKR"), minRate));
            }
            if (maxRate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dailyRateLKR"), maxRate));
            }
            if (hasAC != null) {
                predicates.add(criteriaBuilder.equal(root.get("hasAC"), hasAC));
            }
            if (transmission != null && !transmission.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("transmission"), transmission));
            }
            if (fuel != null && !fuel.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("fuel"), fuel));
            }
            if (minSeats != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("seats"), minSeats));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
