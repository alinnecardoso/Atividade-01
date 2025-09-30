import React from 'react';
import { Dialog, Button, Text } from 'react-native-paper';

export default function ConfirmDeleteDialog({ visible, onCancel, onConfirm, toDelete, deleting }) {
  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title>Confirmar exclusão</Dialog.Title>
      <Dialog.Content>
        <Text>Tem certeza que deseja excluir:</Text>
        {toDelete && <Text style={{ fontWeight: '700', marginTop: 8 }}>{toDelete.nome} #{toDelete.matricula}</Text>}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onCancel}>Cancelar</Button>
        <Button mode="contained" buttonColor="#dc2626" onPress={onConfirm} loading={deleting} disabled={deleting}>
          Excluir
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

