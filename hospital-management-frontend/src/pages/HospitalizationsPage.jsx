import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import api from '../api/api';

export default function HospitalizationsPage() {
  const [hospitalizations, setHospitalizations] = useState([]);
  const [hospitalization, setHospitalization] = useState({
  admissionDate: '',
  dischargeDate: '',
  notes: '',
  patient: null,
  room: null
});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHospitalizations();
    fetchPatients();
    fetchRooms();
  }, []);

  const fetchHospitalizations = async () => {
    const res = await api.get('/hospitalizations');
    setHospitalizations(res.data);
  };
  const fetchPatients = async () => {
    const res = await api.get('/patients');
    setPatients(res.data);
  };
  const fetchRooms = async () => {
    const res = await api.get('/rooms');
    setRooms(res.data);
  };

  const openNew = () => {
    setHospitalization({ patient: null, room: null, admissionDate: '', dischargeDate: '', notes: '' });
    setIsEdit(false);
    setDialogVisible(true);
  };
  const openEdit = (rowData) => {
  setHospitalization({
    ...rowData,
    admissionDate: rowData.admissionDate ? new Date(rowData.admissionDate) : '',
    dischargeDate: rowData.dischargeDate ? new Date(rowData.dischargeDate) : '',
  });
  setIsEdit(true);
  setDialogVisible(true);
};
  const hideDialog = () => {
    setDialogVisible(false);
  };
  const saveHospitalization = async () => {
  setSaving(true);
  setError('');
  try {
    const payload = {
      patient: hospitalization.patient,
      room: hospitalization.room,
      admissionDate: hospitalization.admissionDate ? new Date(hospitalization.admissionDate).toISOString() : null,
      dischargeDate: hospitalization.dischargeDate ? new Date(hospitalization.dischargeDate).toISOString() : null,
      notes: hospitalization.notes || ''
    };
    if (isEdit) {
      await api.put(`/hospitalizations/${hospitalization.id}`, payload);
    } else {
      await api.post('/hospitalizations', payload);
    }
    fetchHospitalizations();
    setDialogVisible(false);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save. Please try again.');
  } finally {
    setSaving(false);
  }
};
  const deleteHospitalization = async (rowData) => {
    await api.delete(`/hospitalizations/${rowData.id}`);
    fetchHospitalizations();
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4" style={{ borderBottom: '1px solid #e3e9f1', paddingBottom: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, color: '#1a355e', margin: 0 }}>Hospitalizations</h2>
        <Button 
          label="Add Hospitalization" 
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
        value={hospitalizations} 
        paginator 
        rows={10} 
        dataKey="id" 
        responsiveLayout="scroll"
        emptyMessage={<div style={{ textAlign: 'center', padding: 40, color: '#8fa3bf' }}>
          <i className="pi pi-briefcase" style={{ fontSize: 48, marginBottom: 16, color: '#d0e2ff' }}></i>
          <div style={{ fontSize: 20, fontWeight: 500 }}>No hospitalizations yet</div>
          <div style={{ marginTop: 8 }}>Click <b>Add Hospitalization</b> to create one.</div>
        </div>}
      >
        <Column header="Patient" body={rowData => rowData.patient?.name || ''} />
        <Column header="Room" body={rowData => rowData.room?.name || ''} />
        <Column header="Admission Date" body={rowData => rowData.admissionDate?.split('T')[0] || ''} sortable />
        <Column header="Discharge Date" body={rowData => rowData.dischargeDate?.split('T')[0] || ''} sortable />
        <Column
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => openEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => deleteHospitalization(rowData)} />
            </>
          )}
          header="Actions"
        />
      </DataTable>

      <Dialog visible={dialogVisible} style={{ width: '450px' }} header={isEdit ? 'Edit Hospitalization' : 'New Hospitalization'} modal className="p-fluid" footer={
        <>
          <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
          <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveHospitalization} disabled={saving} />
        </>
      } onHide={hideDialog}>
        <div className="field">
          <label htmlFor="patient">Patient</label>
          <Dropdown id="patient" value={hospitalization.patient} options={patients} onChange={e => setHospitalization({ ...hospitalization, patient: e.value })} optionLabel="name" placeholder="Select Patient" />
        </div>
        <div className="field">
          <label htmlFor="room">Room</label>
          <Dropdown id="room" value={hospitalization.room} options={rooms} onChange={e => setHospitalization({ ...hospitalization, room: e.value })} optionLabel="name" placeholder="Select Room" />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
<div className="field">
  <label htmlFor="admissionDate">Admission Date</label>
  <Calendar id="admissionDate" value={hospitalization.admissionDate} onChange={e => setHospitalization({ ...hospitalization, admissionDate: e.value })} showTime showSeconds dateFormat="yy-mm-dd" />
</div>
        <div className="field">
          <label htmlFor="dischargeDate">Discharge Date</label>
          <Calendar id="dischargeDate" value={hospitalization.dischargeDate} onChange={e => setHospitalization({ ...hospitalization, dischargeDate: e.value })} showTime showSeconds dateFormat="yy-mm-dd" />
        </div>
      </Dialog>
    </div>
  );
}
