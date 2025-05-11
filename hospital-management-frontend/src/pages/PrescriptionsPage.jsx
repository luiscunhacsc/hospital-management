import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import api from '../api/api';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState({
  medications: '',
  instructions: '',
  appointment: null
});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
    fetchAppointments();
  }, []);

  const fetchPrescriptions = async () => {
    const res = await api.get('/prescriptions');
    setPrescriptions(res.data);
  };
  const fetchAppointments = async () => {
    const res = await api.get('/appointments');
    setAppointments(res.data);
  };

  const openNew = () => {
    setPrescription({ medications: '', instructions: '', appointment: null });
    setIsEdit(false);
    setDialogVisible(true);
  };
  const openEdit = (rowData) => {
    setPrescription(rowData);
    setIsEdit(true);
    setDialogVisible(true);
  };
  const hideDialog = () => {
    setDialogVisible(false);
  };
  const savePrescription = async () => {
    // Prepare payload to match backend JDL
    const payload = {
      medications: prescription.medications,
      instructions: prescription.instructions,
      appointment: prescription.appointment
    };
    if (isEdit) {
      await api.put(`/prescriptions/${prescription.id}`, payload);
    } else {
      await api.post('/prescriptions', payload);
    }
    fetchPrescriptions();
    setDialogVisible(false);
  };
  const deletePrescription = async (rowData) => {
    await api.delete(`/prescriptions/${rowData.id}`);
    fetchPrescriptions();
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4" style={{ borderBottom: '1px solid #e3e9f1', paddingBottom: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, color: '#1a355e', margin: 0 }}>Prescriptions</h2>
        <Button 
          label="Add Prescription" 
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
        value={prescriptions} 
        paginator 
        rows={10} 
        dataKey="id" 
        responsiveLayout="scroll"
        emptyMessage={<div style={{ textAlign: 'center', padding: 40, color: '#8fa3bf' }}>
          <i className="pi pi-file" style={{ fontSize: 48, marginBottom: 16, color: '#d0e2ff' }}></i>
          <div style={{ fontSize: 20, fontWeight: 500 }}>No prescriptions yet</div>
          <div style={{ marginTop: 8 }}>Click <b>Add Prescription</b> to create one.</div>
        </div>}
      >
        <Column field="appointment" header="Appointment" body={rowData => rowData.appointment?.id || ''} />
        <Column field="medications" header="Medications" sortable />
        <Column field="instructions" header="Instructions" />
        <Column
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-text p-mr-2" onClick={() => openEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => deletePrescription(rowData)} />
            </>
          )}
          header="Actions"
        />
      </DataTable>

      <Dialog visible={dialogVisible} style={{ width: '450px' }} header={isEdit ? 'Edit Prescription' : 'New Prescription'} modal className="p-fluid" footer={
        <>
          <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
          <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePrescription} />
        </>
      } onHide={hideDialog}>
        <div className="field">
          <label htmlFor="appointment">Appointment</label>
          <Dropdown id="appointment" value={prescription.appointment} options={appointments} onChange={e => setPrescription({ ...prescription, appointment: e.value })} optionLabel="id" placeholder="Select Appointment" />
        </div>
        <div className="field">
          <label htmlFor="medications">Medications</label>
          <InputText id="medications" value={prescription.medications ?? ''} onChange={e => setPrescription({ ...prescription, medications: e.target.value })} required autoFocus />
        </div>
        <div className="field">
          <label htmlFor="instructions">Instructions</label>
          <InputText id="instructions" value={prescription.instructions ?? ''} onChange={e => setPrescription({ ...prescription, instructions: e.target.value })} />
        </div>
      </Dialog>
    </div>
  );
}
