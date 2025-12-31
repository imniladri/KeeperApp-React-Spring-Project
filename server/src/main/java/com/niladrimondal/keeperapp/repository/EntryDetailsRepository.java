package com.niladrimondal.keeperapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.niladrimondal.keeperapp.entity.EntryDetails;

@Repository
public interface EntryDetailsRepository extends JpaRepository<EntryDetails, Integer> {

	@Query("SELECT entrydetails FROM EntryDetails entrydetails WHERE entrydetails.entry.entryId = :entryId")
	List<EntryDetails> findAllEntryDetailsByEntryId(@Param("entryId") Integer entryId);
	
}
