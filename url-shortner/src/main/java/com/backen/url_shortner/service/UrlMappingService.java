package com.backen.url_shortner.service;

import com.backen.url_shortner.dtos.ClickEventDTO;
import com.backen.url_shortner.dtos.UrlMappingDto;
import com.backen.url_shortner.models.ClickEvent;
import com.backen.url_shortner.models.UrlMapping;
import com.backen.url_shortner.models.User;
import com.backen.url_shortner.repositories.ClickEventRepository;
import com.backen.url_shortner.repositories.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.net.http.HttpHeaders;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UrlMappingService {

    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;

    private static final String BASE62 =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    @CachePut(value = "urls", key = "#result.shortUrl")
    public UrlMappingDto createShortUrl(String originalUrl, User user) {

        String shortUrl;

        do {
            shortUrl = generateShortUrl();
        } while (urlMappingRepository.existsByShortUrl(shortUrl));

        UrlMapping mapping = UrlMapping.builder()
                .originalUrl(originalUrl)
                .shortUrl(shortUrl)
                .user(user)
                .clickedEvents(new ArrayList<>())
                .clickCount(0)
                .build();

        mapping = urlMappingRepository.save(mapping);

        log.info("Short URL {} generated for {}",
                shortUrl,
                originalUrl);

        return map(mapping);
    }

    private String generateShortUrl() {

        List<Character> chars = BASE62.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());

        Collections.shuffle(chars);

        StringBuilder sb = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            sb.append(chars.get(i));
        }

        return sb.toString();
    }

    private UrlMappingDto map(UrlMapping mapping) {
        return UrlMappingDto.builder()
                .shortUrl(mapping.getShortUrl())
                .originalUrl(mapping.getOriginalUrl())
                .username(mapping.getUser().getUsername())
                .id(mapping.getId())
                .clickCount(mapping.getClickCount())
                .createdDate(mapping.getCreatedDate())
                .build();
    }

    public List<UrlMappingDto> findUserUrls(User user) {
        return urlMappingRepository.findByUser(user)
                .stream()
                .map(this::map)
                .toList();
    }

//    private ClickEventDTO maptToClickEventDTO(ClickEvent event){
//        return ClickEventDTO.builder()
//                .clickDate(LocalDate.from(event.getClickDate()))
//                .count((Long) Collectors.counting())
//                .build();
//    }

    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl).orElse(null);
        if(urlMapping != null){
            return clickEventRepository.findByUrlMappingAndClickDateBetween(
                    urlMapping, start, end
            ).stream().collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream().map(entry -> {
                        return ClickEventDTO.builder()
                                .count(entry.getValue())
                                .clickDate(entry.getKey())
                                .build();
                    })
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(LocalDate start, LocalDate end, User user){
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings, start.atStartOfDay(), end.plusDays(1).atStartOfDay());

        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    @Cacheable(value = "urls", key="#shortUrl")
    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping mapping = urlMappingRepository.findByShortUrl(shortUrl).orElse(null);
        if(mapping != null){
            mapping.setClickCount(mapping.getClickCount() + 1);
            mapping = urlMappingRepository.save(mapping);

//            record click events
            ClickEvent clickEvent = ClickEvent.builder()
                    .clickDate(LocalDateTime.now())
                    .urlMapping(mapping)
                    .build();

            clickEventRepository.save(clickEvent);
            return mapping;
        }
        return null;
    }
}