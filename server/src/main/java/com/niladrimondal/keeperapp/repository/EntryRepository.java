package com.niladrimondal.keeperapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.niladrimondal.keeperapp.entity.Entry;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Integer> {

	@Query("SELECT entry FROM Entry entry WHERE entry.user.userid = :userid")
	List<Entry> findAllEntryByUserId(@Param("userid") Integer userid);
	
}
