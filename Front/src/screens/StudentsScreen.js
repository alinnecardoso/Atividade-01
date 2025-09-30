import React, { useEffect, useMemo, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Portal, useTheme, Searchbar, FAB, Snackbar } from 'react-native-paper';
import { ThemeToggleContext } from '../theme/context';
import StudentCard from '../components/StudentCard';
import CreateStudentDialog from '../components/dialogs/CreateStudentDialog';
import EditStudentDialog from '../components/dialogs/EditStudentDialog';
import ConfirmDeleteDialog from '../components/dialogs/ConfirmDeleteDialog';
import { listUsers, createUser, updateUser, deleteUser } from '../services/users';
import { fetchCep } from '../services/viacep';
import { validateCreate, isValid, validateEdit } from '../validation/student';

export default function StudentsScreen() {
  const theme = useTheme();
  const { toggle } = useContext(ThemeToggleContext) || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  // Criação
  const [createVisible, setCreateVisible] = useState(false);
  const [createValues, setCreateValues] = useState({
    nome: '',
    curso: 'mobile',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const createErrors = useMemo(() => validateCreate(createValues), [createValues]);
  const canCreate = useMemo(() => isValid(createErrors), [createErrors]);

  // Edição
  const [editing, setEditing] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const editErrors = useMemo(() => validateEdit(editing), [editing]);

  // Exclusão
  const [toDelete, setToDelete] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState('');
  const [snack, setSnack] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => String(u.nome || '').toLowerCase().includes(q) || String(u.curso || '').toLowerCase().includes(q));
  }, [users, query]);

  useEffect(() => {
    loadUsers();
  }, []);

  // Create handlers
  const onCreateChange = (field, value) => {
    setCreateValues((prev) => ({ ...prev, [field]: value }));
  };
  const onCreateCepBlur = async (value) => {
    const provided = typeof value === 'string' ? value : undefined;
    const digits = String((provided ?? createValues.cep) || '').replace(/\D/g, '');
    if (digits.length !== 8) return;
    if (cepLoading) return;
    setCepLoading(true);
    try {
      const data = await fetchCep(digits);
      setCreateValues((prev) => ({
        ...prev,
        cep: String(data.cep).replace(/\D/g, ''),
        logradouro: data.logradouro,
        complemento: data.complemento || '',
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
      }));
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha na consulta do CEP');
    } finally {
      setCepLoading(false);
    }
  };
  const submitCreate = async () => {
    if (!canCreate) return;
    setSaving(true);
    try {
      const payload = {
        nome: createValues.nome.trim(),
        curso: createValues.curso.trim(),
        endereco: {
          cep: String(createValues.cep).replace(/\D/g, ''),
          logradouro: createValues.logradouro.trim(),
          numero: createValues.numero?.trim() || undefined,
          complemento: createValues.complemento?.trim() || undefined,
          bairro: createValues.bairro?.trim() || undefined,
          cidade: createValues.cidade?.trim() || undefined,
          uf: createValues.uf?.trim()?.toUpperCase() || undefined,
        },
      };
      await createUser(payload);
      setCreateVisible(false);
      setCreateValues({ nome: '', curso: 'mobile', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' });
      await loadUsers();
      setSnack('Aluno criado com sucesso');
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  // Edit handlers
  const openEdit = (item) => {
    setEditing({ ...item });
    setEditVisible(true);
  };
  const onEditChange = (field, value) => {
    setEditing((prev) => ({
      ...prev,
      endereco: {
        ...(prev?.endereco || {}),
        [field]: ['nome', 'curso'].includes(field) ? prev?.endereco?.[field] : value,
      },
      ...(field === 'nome' || field === 'curso' ? { [field]: value } : {}),
    }));
  };
  const onEditCepBlur = async (value) => {
    const provided = typeof value === 'string' ? value : undefined;
    const digits = String((provided ?? editing?.endereco?.cep) || '').replace(/\D/g, '');
    if (digits.length !== 8) return;
    if (cepLoading) return;
    setCepLoading(true);
    try {
      const data = await fetchCep(digits);
      setEditing((prev) => ({
        ...prev,
        endereco: {
          ...(prev?.endereco || {}),
          cep: String(data.cep).replace(/\D/g, ''), // Salva CEP sem hífen
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
        },
      }));
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha na consulta do CEP');
    } finally {
      setCepLoading(false);
    }
  };
  const submitEdit = async () => {
    const errs = validateEdit(editing);
    if (!isValid(errs)) {
      Alert.alert('Validação', 'Preencha os campos obrigatórios corretamente.');
      return;
    }
    setSaving(true);
    try {
      const id = editing.id;
      const payload = {
        nome: editing.nome?.trim(),
        curso: editing.curso?.trim(),
        endereco: {
          cep: String(editing.endereco?.cep || '').replace(/\D/g, ''),
          logradouro: editing.endereco?.logradouro?.trim(),
          numero: editing.endereco?.numero?.trim?.() || editing.endereco?.numero,
          complemento: editing.endereco?.complemento?.trim?.() || editing.endereco?.complemento,
          bairro: editing.endereco?.bairro?.trim?.() || editing.endereco?.bairro,
          cidade: editing.endereco?.cidade?.trim?.() || editing.endereco?.cidade,
          uf: editing.endereco?.uf?.trim?.().toUpperCase() || editing.endereco?.uf,
        },
      };
      await updateUser(id, payload);
      setEditVisible(false);
      setEditing(null);
      await loadUsers();
      setSnack('Aluno atualizado');
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha ao atualizar');
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const openDelete = (item) => { setToDelete(item); setDeleteVisible(true); };
  const submitDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteUser(toDelete.id);
      setDeleteVisible(false);
      setToDelete(null);
      await loadUsers();
      setSnack('Aluno excluído');
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Falha ao excluir');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Alunos" />
        <Appbar.Action icon={theme.dark ? 'white-balance-sunny' : 'weather-night'} onPress={() => toggle?.()} />
      </Appbar.Header>
      <View style={[styles.content]}>
        <Searchbar
          placeholder="Pesquisar por nome ou curso"
          value={query}
          onChangeText={setQuery}
          style={{ borderRadius: 12, marginBottom: 8 }}
          inputStyle={{ paddingBottom: 2 }}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard item={item} onEdit={openEdit} onDelete={openDelete} />
        )}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <View style={[styles.content, { paddingTop: 0 }]}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Lista</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={[styles.content]}>
            {loading ? (
              <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : error ? (
              <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
            ) : (
              <View style={{ alignItems: 'center', marginTop: 32 }}>
                <Text style={{ opacity: 0.7, marginBottom: 12 }}>Nenhum aluno encontrado</Text>
                <Button icon="plus" mode="contained" onPress={() => setCreateVisible(true)}>Adicionar aluno</Button>
              </View>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshing={loading}
        onRefresh={loadUsers}
      />

      <FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 24 }} onPress={() => setCreateVisible(true)} />

      <Portal>
        <CreateStudentDialog
          visible={createVisible}
          onDismiss={() => setCreateVisible(false)}
          values={createValues}
          errors={createErrors}
          onChange={onCreateChange}
          onSubmit={submitCreate}
          saving={saving}
          cepLoading={cepLoading}
          canSubmit={canCreate}
          onCepBlur={onCreateCepBlur}
        />

        <EditStudentDialog
          visible={editVisible}
          onDismiss={() => setEditVisible(false)}
          editing={editing}
          errors={editErrors}
          onChange={onEditChange}
          onSubmit={submitEdit}
          saving={saving}
          cepLoading={cepLoading}
          onCepBlur={onEditCepBlur}
        />

        <ConfirmDeleteDialog
          visible={deleteVisible}
          onCancel={() => setDeleteVisible(false)}
          onConfirm={submitDelete}
          toDelete={toDelete}
          deleting={deleting}
        />

        <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={2500} action={{ label: 'OK', onPress: () => setSnack('') }}>
          {snack}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  error: { color: '#dc2626', marginTop: 12 },
});
