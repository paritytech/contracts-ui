// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SimpleSpread, ValidFormField } from 'types';
import { Dropdown } from 'ui/components/common/dropdown';

type Props = SimpleSpread<React.HTMLAttributes<HTMLDivElement>, ValidFormField<boolean>>;

const options = [
  {
    value: false,
    label: 'false',
  },
  {
    value: true,
    label: 'true',
  },
];

export function Bool({ value, onChange, ...props }: Props) {
  return <Dropdown {...props} onChange={onChange} options={options} value={value} />;
}
