// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { Dropdown } from '../common/dropdown';
import { ArgSignature } from '../message/arg-signature';
import { FormField, getValidation } from './form-field';
import { isNumber } from 'lib/util';
import { ArgComponentProps, OrFalsy, TypeDef } from 'types';
import { useApi } from 'ui/contexts';
import { getInitValue } from 'lib/init-value';

interface Props extends ArgComponentProps<Record<string, unknown>> {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
}

export function Enum(props: Props) {
  const { components, typeDef, nestingNumber, onChange: _onChange, registry, value } = props;
  const variants = typeDef.sub as TypeDef[];
  const { accounts } = useApi();
  const [variantIndex, _setVariantIndex] = useState<number>(0);

  const Component = components[variantIndex];

  const onChange = useCallback(
    (value: unknown): void => {
      _onChange({ [variants[variantIndex].name as string]: value });
    },
    [_onChange, variants, variantIndex],
  );

  const setVariantIndex = useCallback(
    (value: OrFalsy<number>) => {
      if (isNumber(value)) {
        _setVariantIndex(value);

        _onChange({
          [variants[value].name as string]: getInitValue(registry, accounts || [], variants[value]),
        });
      }
    },
    [registry, accounts, _onChange, variants],
  );

  return (
    <>
      <Dropdown
        onChange={setVariantIndex}
        options={variants.map(({ name }, index) => ({ label: name, value: index }))}
        value={variantIndex}
      />
      {variants[variantIndex].type !== 'Null' && (
        <FormField
          className={`ml-8 mt-2 enum-field-${nestingNumber}`}
          label={<ArgSignature arg={{ type: variants[variantIndex] }} registry={registry} />}
          {...getValidation(props)}
        >
          <Component
            nestingNumber={nestingNumber + 1}
            onChange={onChange}
            registry={registry}
            typeDef={variants[variantIndex]}
            value={!!value && typeof value === 'object' ? Object.values(value)[0] : {}}
          />
        </FormField>
      )}
    </>
  );
}
