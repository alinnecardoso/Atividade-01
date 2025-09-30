import React from 'react';
import { Text } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';

export default function StudentCard({ item, onEdit, onDelete }) {
  const theme = useTheme();
  return (
    <Card style={{ marginTop: 10 }} mode="elevated">
      <Card.Title title={item.nome} subtitle={`#${item.matricula} • Curso: ${item.curso}`} />
      {!!item.endereco && (
        <Card.Content>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 6 }}>
            {item.endereco.logradouro}
            {item.endereco.numero ? `, ${item.endereco.numero}` : ''}
            {item.endereco.bairro ? ` - ${item.endereco.bairro}` : ''}
            {item.endereco.cidade ? `, ${item.endereco.cidade}` : ''}
            {item.endereco.uf ? `/${item.endereco.uf}` : ''}
          </Text>
        </Card.Content>
      )}
      <Card.Actions>
        <Button mode="contained-tonal" onPress={() => onEdit(item)} style={{ marginRight: 8 }}>
          Editar
        </Button>
        <Button mode="contained" buttonColor={theme.colors.error} textColor="#FFFFFF" onPress={() => onDelete(item)}>
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );
}
