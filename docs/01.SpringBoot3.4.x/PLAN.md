# Spring Boot 3.4.x Documentation Mapping Plan

## Progress Tracking System
This document includes a built-in progress tracking system to allow you to pause and resume work after interruptions (like PC restarts).

### How to Track Your Progress
1. **Update the Status column** as you work on each section:
   - `[ ]` = Not Started (default)
   - `[/]` = In Progress (currently working on this)
   - `[x]` = Completed (finished this section)

2. **Save the file regularly** (Ctrl+S) to preserve your progress
3. **To resume work**: Simply reopen this file and look for items marked `[/]` or `[ ]`

### Progress Summary (Manual Update)
As you mark items as completed, you can manually update these counters:
- **Completed Sections**: Count of `[x]` items
- **Total Sections**: 20 sections across 20 levels
- **Progress Percentage**: (Completed Sections ÷ 20) × 100

### Quick Status Reference
- Look for `[/]` to see what you were last working on
- Look for `[ ]` to find remaining work
- Completed sections `[x]` are finished

---

## ⚡ Rate Limiting & API Error Prevention
**Prevent "ResourceExhausted: Worker local total request limit reached" errors:**

### When Accessing Documentation URLs
1 URLs
- **Add delays**: Wait 2-5 seconds between consecutive URL requests
- **Use sessions**: Reuse HTTP connections (keep-alive) instead of new connections
- **Set proper headers**: Include `User-Agent` with your project identifier
- **Cache results**: Save downloaded HTML/content locally to avoid re-fetching
- **Batch processing**: Process URLs in small batches (3-5 at a time) with pauses

### Example Python Rate Limiter
```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=2,
    status_forcelist=[429, 500, 502, 503, 504],
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)

def fetch_with_rate_limit(url, delay=3):
    time.sleep(delay)  # Respectful delay
    response = session.get(url, headers={"User-Agent": "CodeMaster-DocMapper/1.0"})
    response.raise_for_status()
    return response.text
```

### Best Practices
| Practice | Benefit |
|----------|---------|
| `time.sleep(3)` between requests | Avoids 429 Too Many Requests |
| Exponential backoff on 429 | Auto-recovers from rate limits |
| Local file cache (`docs/cache/`) | Zero network calls for repeats |
| Process 5 URLs, then 30s pause | Stays within typical rate limits |
| Use `requests.Session()` | Connection reuse, cookie persistence |

---

## Overview

This document maps each level of the Spring Boot learning pack to the corresponding sections in the official Spring Boot 3.4.x reference documentation.

## Mapping Table

| Level | Topic (Korean) | Official Documentation Section | URL | Status |
|-------|----------------|--------------------------------|-----|--------|
| 1 | Java Core | Java Language Basics (outside Spring Boot scope) | https://docs.oracle.com/javase/tutorial/ | [x] |
| 2 | Spring Core | Getting Started / Using Spring Boot | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using.spring-boot | [x] |
| 3 | Spring MVC | Spring MVC | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.spring-mvc | [x] |
| 4 | Database - JPA/MyBatis | SQL Data Access (JDBC, JPA, MyBatis) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data.sql | [x] |
| 5 | Concurrency | Async Execution | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.executors | [x] |
| 6 | Network | WebClient / RestTemplate | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.resttemplate | [x] |
| 7 | Gateway | Spring Cloud Gateway (outside Spring Boot core) | https://docs.spring.io/spring-cloud-gateway/reference/index.html | [x] |
| 8 | Messaging | Messaging (JMS, AMQP, RabbitMQ) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#messaging | [x] |
| 9 | Batch | Spring Batch | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#batch | [x] |
| 10 | Security | Spring Security (via Spring Boot) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#security | [x] |
| 11 | Cache | Caching | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#caching | [x] |
| 12 | Monitoring | Actuator Metrics & Monitoring | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator | [x] |
| 13 | Testing | Testing | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#testing.boot-application | [x] |
| 14 | Architecture | Microservices Architecture (Spring Cloud) | https://spring.io/projects/spring-cloud | [x] |
| 15 | Design Pattern | Design Patterns (Java-oriented, external reference) | https://refactoring.guru/design-patterns/java | [x] |
| 16 | Build & DevOps | Building Container Images & Buildpacks | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build.buildpacks | [x] |
| 17 | Observability | Logging, Tracing, Metrics | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#logging | [x] |
| 18 | Data | Data Access (SQL, NoSQL) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data | [x] |
| 19 | Resilience & Cloud-Native | Resilience4j Integration (Circuit Breaker, Rate Limiter, Retry) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#resilience4j.circuitbreaker | [x] |
| 20 | Reactive | WebFlux (Reactive Web) | https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#webflux | [x] |

## Notes

- Some topics (Java Core, Design Pattern) refer to external authoritative sources as they are not covered in Spring Boot docs.
- URLs point to the specific section anchors within the single-page HTML reference (or the closest available page).
- For Spring Cloud related items, the official Spring Cloud documentation is used.