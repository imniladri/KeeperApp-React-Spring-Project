package com.niladrimondal.keeperapp.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "DIARYLOGS_ENTRYDETAILS")
public class EntryDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ENTRYDETAIL_ID_GEN")
	@SequenceGenerator(name = "ENTRYDETAIL_ID_GEN", sequenceName = "ENTRYDETAIL_ID_SEQ", allocationSize = 1, initialValue = 100)
	@Column(name = "ENTRYDETAILID")
	private Integer entryDetailId;

	@Lob
	@Column(name = "ENTRYCONTENT", nullable = false, columnDefinition = "MEDIUMTEXT")
	private String entryContent;

	@Column(name = "CREATE_TS", nullable = false)
	private LocalDateTime createTimestamp;

	@Column(name = "UPDATE_TS")
	private LocalDateTime updateTimestamp;

	public Integer getEntryDetailId() {
		return entryDetailId;
	}

	public void setEntryDetailId(Integer entryDetailId) {
		this.entryDetailId = entryDetailId;
	}

	public String getEntryContent() {
		return entryContent;
	}

	public void setEntryContent(String entryContent) {
		this.entryContent = entryContent;
	}

	public LocalDateTime getCreateTimestamp() {
		return createTimestamp;
	}

	public void setCreateTimestamp(LocalDateTime createTimestamp) {
		this.createTimestamp = createTimestamp;
	}

	public LocalDateTime getUpdateTimestamp() {
		return updateTimestamp;
	}

	public void setUpdateTimestamp(LocalDateTime updateTimestamp) {
		this.updateTimestamp = updateTimestamp;
	}

	@Override
	public String toString() {
		return "EntryDetails [entryDetailId=" + entryDetailId + ", entryContent=" + entryContent + ", createTimestamp="
				+ createTimestamp + ", updateTimestamp=" + updateTimestamp + ", entry=" + entry + "]";
	}

	// Mapping (EntryDetails-Entry)
	
	@ManyToOne
	@JoinColumn(name = "ENTRYID", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Entry entry;

	public Entry getEntry() {
		return entry;
	}

	public void setEntry(Entry entry) {
		this.entry = entry;
	}

}
