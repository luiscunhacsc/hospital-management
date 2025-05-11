package com.example.hospitalmanagement.config;

import com.example.hospitalmanagement.model.*;
import com.example.hospitalmanagement.repository.*;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Random;

@Component
@Profile("default") // Only runs in default profile (dev)
public class DataSeeder implements CommandLineRunner {
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private HospitalizationRepository hospitalizationRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private ExamRepository examRepository;

    private final Faker faker = new Faker(new Locale("en"));
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        int numPatients = 100;
        int numDoctors = 30;
        int numRooms = 10;
        int numStaff = 20;
        int numAppointments = 200;
        int numPrescriptions = 120;
        int numHospitalizations = 30;
        int numExams = 80;

        // Seed Patients
        if (patientRepository.count() == 0) {
            for (int i = 0; i < numPatients; i++) {
                Patient patient = Patient.builder()
                        .name(faker.name().fullName())
                        .dateOfBirth(LocalDate.now().minusYears(18 + random.nextInt(60)).minusDays(random.nextInt(365)))
                        .gender(Gender.values()[random.nextInt(Gender.values().length)])
                        .phone(faker.phoneNumber().cellPhone())
                        .email(faker.internet().emailAddress())
                        .ssn(faker.number().digits(9))
                        .address(faker.address().fullAddress())
                        .healthCardNumber(faker.number().digits(12))
                        .build();
                patientRepository.save(patient);
            }
        }
        // Seed Doctors
        if (doctorRepository.count() == 0) {
            for (int i = 0; i < numDoctors; i++) {
                Doctor doctor = Doctor.builder()
                        .name(faker.name().fullName())
                        .licenseNumber(faker.number().digits(6))
                        .specialty(SpecialtyType.values()[random.nextInt(SpecialtyType.values().length)])
                        .phone(faker.phoneNumber().cellPhone())
                        .email(faker.internet().emailAddress())
                        .build();
                doctorRepository.save(doctor);
            }
        }
        // Seed Rooms
        if (roomRepository.count() == 0) {
            for (int i = 0; i < numRooms; i++) {
                Room room = Room.builder()
                        .name("Sala " + (i+1))
                        .floor(1 + random.nextInt(3))
                        .capacity(2 + random.nextInt(8))
                        .equipment(faker.lorem().sentence(3))
                        .build();
                roomRepository.save(room);
            }
        }
        // Seed Staff
        if (staffRepository.count() == 0) {
            for (int i = 0; i < numStaff; i++) {
                Staff staff = Staff.builder()
                        .name(faker.name().fullName())
                        .role(faker.job().position())
                        .phone(faker.phoneNumber().cellPhone())
                        .email(faker.internet().emailAddress())
                        .build();
                staffRepository.save(staff);
            }
        }
        // Seed Appointments
        if (appointmentRepository.count() == 0) {
            var patients = patientRepository.findAll();
            var doctors = doctorRepository.findAll();
            var rooms = roomRepository.findAll();
            for (int i = 0; i < numAppointments; i++) {
                Appointment appointment = Appointment.builder()
                        .dateTime(java.time.ZonedDateTime.now().plusDays(random.nextInt(60) - 30))
                        .status(AppointmentStatus.values()[random.nextInt(AppointmentStatus.values().length)])
                        .notes(faker.lorem().paragraph())
                        .patient(patients.get(random.nextInt(patients.size())))
                        .doctor(doctors.get(random.nextInt(doctors.size())))
                        .room(rooms.get(random.nextInt(rooms.size())))
                        .build();
                appointmentRepository.save(appointment);
            }
        }
        // Seed Prescriptions
        if (prescriptionRepository.count() == 0) {
            var appointments = appointmentRepository.findAll();
            for (int i = 0; i < numPrescriptions; i++) {
                Appointment appointment = appointments.get(random.nextInt(appointments.size()));
                Prescription prescription = Prescription.builder()
                        .medications(faker.lorem().sentence(6))
                        .instructions(faker.lorem().sentence(8))
                        .appointment(appointment)
                        .build();
                prescriptionRepository.save(prescription);
            }
        }
        // Seed Hospitalizations
        if (hospitalizationRepository.count() == 0) {
            var patients = patientRepository.findAll();
            var rooms = roomRepository.findAll();
            for (int i = 0; i < numHospitalizations; i++) {
                java.time.ZonedDateTime entry = java.time.ZonedDateTime.now().minusDays(random.nextInt(90));
                java.time.ZonedDateTime exit = random.nextBoolean() ? entry.plusDays(random.nextInt(10)) : null;
                Hospitalization hospitalization = Hospitalization.builder()
                        .admissionDate(entry)
                        .dischargeDate(exit)
                        .notes(faker.lorem().paragraph())
                        .patient(patients.get(random.nextInt(patients.size())))
                        .room(rooms.get(random.nextInt(rooms.size())))
                        .build();
                hospitalizationRepository.save(hospitalization);
            }
        }
        // Seed Exams
        if (examRepository.count() == 0) {
            var appointments = appointmentRepository.findAll();
            var doctors = doctorRepository.findAll();
            for (int i = 0; i < numExams; i++) {
                Exam exam = Exam.builder()
                        .type(faker.medical().diseaseName())
                        .result(faker.lorem().sentence(10))
                        .examDate(java.time.ZonedDateTime.now().minusDays(random.nextInt(60)))
                        .appointment(appointments.get(random.nextInt(appointments.size())))
                        .doctor(doctors.get(random.nextInt(doctors.size())))
                        .build();
                examRepository.save(exam);
            }
        }
    }
}
