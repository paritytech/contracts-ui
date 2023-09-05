// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo, useState } from 'react';
import { GroupBase } from 'react-select';
import { Dropdown } from '../common/dropdown';
import { Account } from './account';
import { createAccountOptions } from 'ui/util/dropdown';
import type { DropdownOption, DropdownProps, ValidFormField } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { classes } from 'lib/util';
import { useDbQuery } from 'ui/hooks';

type Props = ValidFormField<string> & Omit<DropdownProps<string>, 'options'>;

export function Option({ label, value }: DropdownOption<string>) {
  return <Account className="p-1.5" name={label} value={value} />;
}

function Select({
  isDisabled,
  onChange,
  options,
  placeholder = 'Select account',
  className,
  value,
  onCreate,
}: DropdownProps<string>) {
  return (
    <Dropdown
      className={classes('account-select', className)}
      formatOptionLabel={Option}
      isDisabled={isDisabled}
      isSearchable
      onChange={onChange}
      onCreate={onCreate}
      options={options}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function AccountSelect({ placeholder = 'Select account', ...props }: Props) {
  const { accounts } = useApi();

  return (
    <Select options={createAccountOptions(accounts || [])} placeholder={placeholder} {...props} />
  );
}

export function AddressSelect({ placeholder = 'Select account', onChange, ...props }: Props) {
  const { accounts } = useApi();
  const { db } = useDatabase();
  const [contracts] = useDbQuery(() => db.contracts.toArray(), [db]);
  const [recent, setRecent] = useState<DropdownOption<string>[]>([]);

  const options = useMemo((): GroupBase<DropdownOption<string>>[] => {
    return [
      {
        label: 'Recent',
        options: recent,
      },
      {
        label: 'My Accounts',
        options: createAccountOptions(accounts || []),
      },
      {
        label: 'Uploaded Contracts',
        options: (contracts || []).map(({ name, address }) => ({
          label: name,
          value: address,
        })),
      },
    ];
  }, [accounts, contracts, recent]);

  const handleCreate = (inputValue: string) => {
    setRecent([...recent, { label: inputValue, value: inputValue }]);
    onChange(inputValue);
  };

  return (
    <Select
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      {...props}
      onCreate={handleCreate}
    />
  );
}
