package com.niladrimondal.keeperapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.niladrimondal.keeperapp.entity.Entry;
import com.niladrimondal.keeperapp.entity.EntryDetails;
import com.niladrimondal.keeperapp.repository.EntryDetailsRepository;
import com.niladrimondal.keeperapp.repository.EntryRepository;

@Service
public class EntryService {

	@Autowired
	private EntryRepository entryRepository;

	@Autowired
	private EntryDetailsRepository entryDetailsRepository;

	public Entry saveEntry(Entry entry) {
		if (entry != null) {
			return entryRepository.save(entry);
		} else {
			return new Entry();
		}
	}
	
	public Entry updateEntry(Integer id, Entry updatedDetails) {
		Entry existingDetails = entryRepository.findById(id).get();
		
		existingDetails.setEntry(updatedDetails.getEntry());
		existingDetails.setCreateTimestamp(updatedDetails.getCreateTimestamp());
		existingDetails.setUpdateTimestamp(updatedDetails.getUpdateTimestamp());
		
		return entryRepository.save(existingDetails);
	}

	public EntryDetails saveEntryDetails(EntryDetails entryDetails) {
		if (entryDetails != null) {
			return entryDetailsRepository.save(entryDetails);
		} else {
			return new EntryDetails();
		}
	}
	
	public EntryDetails updateEntryDetails(Integer id, EntryDetails updatedDetails) {
		EntryDetails existingDetails = entryDetailsRepository.findById(id).get();
		
		existingDetails.setEntryContent(updatedDetails.getEntryContent());
		existingDetails.setCreateTimestamp(updatedDetails.getCreateTimestamp());
		existingDetails.setUpdateTimestamp(updatedDetails.getUpdateTimestamp());
		
		return entryDetailsRepository.save(existingDetails);
	}
	
	@Transactional
	public boolean deleteEntryDetails(Integer id) {
		if (entryDetailsRepository.existsById(id)) {
			entryDetailsRepository.deleteById(id);
			return true;
		}
		return false;
	}
	
	@Transactional
	public boolean deleteEntry(Integer id) {
		if (entryRepository.existsById(id)) {
			entryRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public Entry getEntryById(Integer entryId) {
		Entry entry = entryRepository.findById(entryId).get();
		return entry;
	}
	
	public EntryDetails getEntryDetailsById(Integer entryDetailId) {
		EntryDetails entryDetails = entryDetailsRepository.findById(entryDetailId).get();
		return entryDetails;
	}

	public List<Entry> getAllEntryByUser(Integer userId) {
		List<Entry> entryList = entryRepository.findAllEntryByUserId(userId);

		if (!entryList.isEmpty()) {
			return entryList;
		} else {
			return null;
		}
	}

	public List<EntryDetails> getAllEntryDetailsByEntryId(Integer entryId) {
		List<EntryDetails> entryDetailsList = entryDetailsRepository.findAllEntryDetailsByEntryId(entryId);

		if (!entryDetailsList.isEmpty()) {
			return entryDetailsList;
		} else {
			return null;
		}
	}

}
