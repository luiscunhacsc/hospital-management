import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import api from '../api/api';

const statusOptions = [
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Canceled', value: 'CANCELED' }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState({
  dateTime: '',
  status: '',
  notes: '',
  patient: null,
  doctor: null,
  room: null
});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    fetchRooms();
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get('/appointments');
    setAppointments(res.data);
  };
  const fetchPatients = async () => {
    const res = await api.get('/patients');
    setPatients(res.data);
  };
  const fetchDoctors = async () => {
    const res = await api.get('/doctors');
    setDoctors(res.data);
  };
  const fetchRooms = async () => {
    const res = await api.get('/rooms');
    setRooms(res.data);
  };

  const openNew = () => {
    setAppointment({ patient: null, doctor: null, room: null, dateTime: '', status: '' });
    setIsEdit(false);
    setDialogVisible(true);
  };
  const openEdit = (rowData) => {
    setAppointment(rowData);
    setIsEdit(true);
    setDialogVisible(true);
  };
  const hideDialog = () => {
    setDialogVisible(false);
  };
  const saveAppointment = async () => {
    if (isEdit) {
      await api.put(`/appointments/${appointment.id}`, {
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        roomId: appointment.room.id,
        dateTime: appointment.dateTime,
        status: appointment.status
      });
    } else {
      await api.post('/appointments', {
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        roomId: appointment.room.id,
        dateTime: appointment.dateTime,
        status: appointment.status
      });
    }
    fetchAppointments();
    setDialogVisible(false);
  };
  const deleteAppointment = async (rowData) => {
    await api.delete(`/appointments/${rowData.id}`);
    fetchAppointments();
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4" style={{ borderBottom: '1px solid #e3e9f1', paddingBottom: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, color: '#1a355e', margin: 0 }}>Appointments</h2>
        <Button 
          label="Add Appointment" 
          icon="pi pi-plus" 
          onClick={openNew}
          className="p-button-raised p-button-primary shadow-4" 
          style={{ 
            fontWeight: 700, fontSize: 18, padding: '14px 32px', 
            background: '#1976d2', border: 'none', color: '#fff', borderRadius: 10, boxShadow: '0 4px 16px #1976d266'
          }}
        />
      </div>
      <DataTable 
        value={appointments} 
        paginator 
        rows={10} 
        dataKey="id" 
        responsiveLayout="scroll"
        emptyMessage={<div style={{ textAlign: 'center', padding: 40, color: '#8fa3bf' }}>
          <i className="pi pi-calendar" style={{ fontSize: 48, marginBottom: 16, color: '#d0e2ff' }}></i>
          <div style={{ fontSize: 20, fontWeight: 500 }}>No appointments yet</div>
          <div style={{ marginTop: 8 }}>Click <b>Add Appointment</b> to create one.</div>
        </div>}
      >
        <Column header="Patient" body={rowData => rowData.patient?.name || ''} />
        <Column header="Doctor" body={rowData => rowData.doctor?.name || ''} />
        <Column header="Room" body={rowData => rowData.room?.name || ''} />
        <Column header="Date" body={rowData => rowData.dateTime?.split('T')[0] || ''} sortable />
        <Column field="status" header="Status" sortable />
        <Column
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => openEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => deleteAppointment(rowData)} />
            </>
          )}
          header="Actions"
        />
      </DataTable>

      <Dialog visible={dialogVisible} style={{ width: '450px' }} header={isEdit ? 'Edit Appointment' : 'New Appointment'} modal className="p-fluid" footer={
        <>
          <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
          <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAppointment} />
        </>
      } onHide={hideDialog}>
        <div className="field">
          <label htmlFor="patient">Patient</label>
          <Dropdown id="patient" value={appointment.patient} options={patients} onChange={e => setAppointment({ ...appointment, patient: e.value })} optionLabel="name" placeholder="Select Patient" />
        </div>
        <div className="field">
          <label htmlFor="doctor">Doctor</label>
          <Dropdown id="doctor" value={appointment.doctor} options={doctors} onChange={e => setAppointment({ ...appointment, doctor: e.value })} optionLabel="name" placeholder="Select Doctor" />
        </div>
        <div className="field">
          <label htmlFor="room">Room</label>
          <Dropdown id="room" value={appointment.room} options={rooms} onChange={e => setAppointment({ ...appointment, room: e.value })} optionLabel="name" placeholder="Select Room" />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <Calendar id="date" value={appointment.dateTime} onChange={e => setAppointment({ ...appointment, dateTime: e.value })} showTime showSeconds dateFormat="yy-mm-dd" />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <Dropdown id="status" value={appointment.status} options={statusOptions} onChange={e => setAppointment({ ...appointment, status: e.value })} placeholder="Select Status" />
        </div>
      </Dialog>
    </div>
  );
}
