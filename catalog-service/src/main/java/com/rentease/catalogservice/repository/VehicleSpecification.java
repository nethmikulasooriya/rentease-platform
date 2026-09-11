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

            if (category != null && !category.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.upper(root.get("category")), category.trim().toUpperCase()));
            }
            if (city != null && !city.trim().isEmpty()) {
                String pattern = "%" + city.trim().toLowerCase() + "%";
                Predicate cityMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), pattern);
                Predicate districtMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("district")), pattern);
                predicates.add(criteriaBuilder.or(cityMatch, districtMatch));
            }
            if (district != null && !district.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("district")), "%" + district.trim().toLowerCase() + "%"));
            }
            if (minRate != null && minRate > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dailyRateLKR"), minRate));
            }
            if (maxRate != null && maxRate > 0) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dailyRateLKR"), maxRate));
            }
            if (hasAC != null) {
                predicates.add(criteriaBuilder.equal(root.get("hasAC"), hasAC));
            }
            if (transmission != null && !transmission.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.upper(root.get("transmission")), transmission.trim().toUpperCase()));
            }
            if (fuel != null && !fuel.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.upper(root.get("fuel")), fuel.trim().toUpperCase()));
            }
            if (minSeats != null && minSeats > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("seats"), minSeats));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
