import React from 'react';
import { Dialog, Button, Text } from 'react-native-paper';
import StudentFormFields from '../StudentFormFields';

export default function EditStudentDialog({
  visible,
  onDismiss,
  editing,
  errors,
  onChange,
  onSubmit,
  saving,
  cepLoading,
  onCepBlur,
}) {
  if (!editing) return null;

  const values = {
    nome: editing.nome || '',
    curso: editing.curso || '',
    cep: editing.endereco?.cep || '',
    logradouro: editing.endereco?.logradouro || '',
    numero: editing.endereco?.numero || '',
    complemento: editing.endereco?.complemento || '',
    bairro: editing.endereco?.bairro || '',
    cidade: editing.endereco?.cidade || '',
    uf: editing.endereco?.uf || '',
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Editar aluno</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 6 }}>Matrícula: #{editing.matricula}</Text>
        <StudentFormFields values={values} errors={errors} onChange={onChange} onCepBlur={onCepBlur} cepLoading={cepLoading} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancelar</Button>
        <Button mode="contained" onPress={onSubmit} loading={saving} disabled={saving}>
          Salvar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

