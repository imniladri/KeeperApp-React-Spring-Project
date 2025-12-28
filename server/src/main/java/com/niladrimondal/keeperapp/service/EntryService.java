package com.niladrimondal.keeperapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.niladrimondal.keeperapp.entity.Entry;
import com.niladrimondal.keeperapp.repository.EntryRepository;

@Service
public class EntryService {
	
	@Autowired
	private EntryRepository entryRepository;
	
	public Entry saveEntry(Entry entry) {
		if (entry != null) {
			return entryRepository.save(entry);
		} else {
			return new Entry();
		}
	}
	
	public List<Entry> getAllEntryByUser(Integer userId) {
		List<Entry> entryList = entryRepository.findAllEntryByUserId(userId);

		if (!entryList.isEmpty()) {
			return entryList;
		} else {
			return null;
		}
	}

}
