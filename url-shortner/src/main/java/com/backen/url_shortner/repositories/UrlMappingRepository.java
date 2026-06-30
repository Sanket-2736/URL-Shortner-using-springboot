package com.backen.url_shortner.repositories;

import com.backen.url_shortner.models.UrlMapping;
import com.backen.url_shortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    List<UrlMapping> findByUser(User user);
    Optional<UrlMapping> findByShortUrl(String shortUrl);
    boolean existsByShortUrl(String shortUrl);
}
