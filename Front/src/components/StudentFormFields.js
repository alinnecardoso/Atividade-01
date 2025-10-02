import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';

export default function StudentFormFields({
  values,
  errors,
  onChange,
  onCepBlur,
  cepLoading,
}) {
  const { nome, curso, cep, logradouro, numero, complemento, bairro, cidade, uf } = values;
  const cepValue = String(cep || '').replace(/\D/g, '').slice(0, 8);

  const cepLookupTimeout = useRef(null);
  const lastLookupCep = useRef('');

  const triggerCepLookup = useCallback(
    (rawCep) => {
      if (!onCepBlur) return;
      const source = typeof rawCep === 'undefined' ? cepValue : rawCep;
      const digits = String(source || '')
        .replace(/\D/g, '')
        .slice(0, 8);

      if (cepLookupTimeout.current) {
        clearTimeout(cepLookupTimeout.current);
        cepLookupTimeout.current = null;
      }

      if (digits.length !== 8) {
        lastLookupCep.current = '';
        return;
      }

      cepLookupTimeout.current = setTimeout(() => {
        if (lastLookupCep.current === digits) return;
        lastLookupCep.current = digits;
        try {
          onCepBlur(digits);
        } catch {
          // Evita quebrar o fluxo se o handler lancar
        }
      }, 250);
    },
    [onCepBlur, cepValue],
  );

  useEffect(
    () => () => {
      if (cepLookupTimeout.current) {
        clearTimeout(cepLookupTimeout.current);
      }
    },
    [],
  );
  return (
    <>
      <PaperTextInput
        mode="outlined"
        label="Nome"
        value={nome}
        left={<PaperTextInput.Icon icon="account" />}
        onChangeText={(t) => onChange('nome', t)}
        error={!!errors.nome}
        autoCapitalize="words"
      />
      <HelperText type="error" visible={!!errors.nome}>{errors.nome}</HelperText>

      <PaperTextInput
        mode="outlined"
        label="Curso (ex: mobile)"
        value={curso}
        left={<PaperTextInput.Icon icon="book-open-variant" />}
        onChangeText={(t) => onChange('curso', t)}
        error={!!errors.curso}
      />
      <HelperText type="error" visible={!!errors.curso}>{errors.curso}</HelperText>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <PaperTextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="CEP"
          value={cepValue}
          onChangeText={(t) => {
            onChange('cep', t);
            triggerCepLookup(t);
          }}
          onBlur={() => triggerCepLookup()}
          onEndEditing={() => triggerCepLookup()}
          onSubmitEditing={() => triggerCepLookup()}
          keyboardType="numeric"
          error={!!errors.cep}
          left={<PaperTextInput.Icon icon="map-search-outline" />}
          right={<PaperTextInput.Icon icon={cepLoading ? 'progress-clock' : 'magnify'} disabled />}
        />
        <PaperTextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="UF"
          value={uf}
          maxLength={2}
          autoCapitalize="characters"
          onChangeText={(t) => onChange('uf', String(t || '').toUpperCase())}
          error={!!errors.uf}
          left={<PaperTextInput.Icon icon="flag-variant" />}
        />
      </View>
      <HelperText type="error" visible={!!errors.cep}>{errors.cep}</HelperText>
      <HelperText type="error" visible={!!errors.uf}>{errors.uf}</HelperText>

      <PaperTextInput
        mode="outlined"
        label="Logradouro"
        value={logradouro}
        left={<PaperTextInput.Icon icon="home" />}
        onChangeText={(t) => onChange('logradouro', t)}
        error={!!errors.logradouro}
      />
      <HelperText type="error" visible={!!errors.logradouro}>{errors.logradouro}</HelperText>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <PaperTextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="Número"
          value={numero}
          keyboardType="numeric"
          left={<PaperTextInput.Icon icon="pound" />}
          onChangeText={(t) => onChange('numero', t.replace(/[^0-9]/g, ''))}
        />
        <PaperTextInput
          style={{ flex: 1 }}
          mode="outlined"
          label="Complemento"
          value={complemento}
          left={<PaperTextInput.Icon icon="home-city-outline" />}
          onChangeText={(t) => onChange('complemento', t)}
        />
      </View>

      <PaperTextInput
        mode="outlined"
        label="Bairro"
        value={bairro}
        left={<PaperTextInput.Icon icon="map-marker-outline" />}
        onChangeText={(t) => onChange('bairro', t)}
      />
      <PaperTextInput
        mode="outlined"
        label="Cidade"
        value={cidade}
        left={<PaperTextInput.Icon icon="city-variant-outline" />}
        onChangeText={(t) => onChange('cidade', t)}
      />
    </>
  );
}
