import React from 'react';
import { Dialog, Button } from 'react-native-paper';
import StudentFormFields from '../StudentFormFields';

export default function CreateStudentDialog({
  visible,
  onDismiss,
  values,
  errors,
  onChange,
  onSubmit,
  saving,
  cepLoading,
  canSubmit,
  onCepBlur,
}) {
  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Adicionar aluno</Dialog.Title>
      <Dialog.Content>
        <StudentFormFields values={values} errors={errors} onChange={onChange} onCepBlur={onCepBlur} cepLoading={cepLoading} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancelar</Button>
        <Button mode="contained" disabled={!canSubmit || saving} loading={saving} onPress={onSubmit}>
          Adicionar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

