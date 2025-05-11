package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Staff;
import com.example.hospitalmanagement.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff updatedStaff) {
        updatedStaff.setId(id);
        return staffRepository.save(updatedStaff);
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}
