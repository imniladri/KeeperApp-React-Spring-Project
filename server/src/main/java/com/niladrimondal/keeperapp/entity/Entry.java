package com.niladrimondal.keeperapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "DIARYLOGS_ENTRY")
public class Entry {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTRY_ID_GEN")
	@SequenceGenerator(name = "ENTRY_ID_GEN", sequenceName = "ENTRY_ID_SEQ", allocationSize = 1, initialValue = 100)
	@Column(name = "ENTRYID")
	private Integer entryId;

	@Column(name = "ENTRY", nullable = false)
	private String entry;

	@Column(name = "TIMESTAMP", nullable = false)
	private LocalDateTime timestamp;

	public Integer getEntryId() {
		return entryId;
	}

	public void setEntryId(Integer entryId) {
		this.entryId = entryId;
	}

	public String getEntry() {
		return entry;
	}

	public void setEntry(String entry) {
		this.entry = entry;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	
	@Override
	public String toString() {
		return "Entry [entryId=" + entryId + ", entry=" + entry + ", timestamp=" + timestamp + ", user=" + user + "]";
	}

	// Mapping (User-Booking)

	@ManyToOne
	@JoinColumn(name = "USERID")
	private User user;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}
