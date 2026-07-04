package com.niladrimondal.keeperapp.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class RootController {

	@GetMapping("/")
	public String server() {
		return "Keeper Application - Server Is Up";
	}

	@GetMapping("/health")
	public Map<String, Object> health() {
		return Map.of("status", "UP", "timestamp", Instant.now(), "service", "DiaryLogs API");
	}

	@GetMapping("/version")
	public Map<String, String> version() {
		return Map.of("app", "DiaryLogs API", "version", "1.0.0", "environment", "development");
	}

	@GetMapping("/check")
	public ResponseEntity<String> check() {
		return ResponseEntity.ok("OK");
	}
}
