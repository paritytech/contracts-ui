// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo } from 'react';
import { ArgSignature } from '../message/arg-signature';
import { Form, FormField } from './form-field';
import { findComponent } from './find-component';
import { AbiParam, Registry, SetState } from 'types';
import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  args: AbiParam[];
  argValues: Record<string, unknown>;
  registry: Registry;
  setArgValues: SetState<Record<string, unknown>>;
}

export function ArgumentForm({ args, argValues, registry, setArgValues, className }: Props) {
  const components = useMemo(
    () => args.map(arg => ({ arg, Component: findComponent(registry, arg.type) })),
    [args, registry],
  );
  return (
    <Form className="argument-form">
      {components.map(({ arg, Component }) => {
        const onChange = (value: unknown) => {
          setArgValues(prev => ({
            ...prev,
            [arg.name]: value,
          }));
        };

        return (
          <FormField
            className={classes(className, arg.name, 'mb-4 ml-6 mt-2')}
            key={`${arg.name}`}
            label={
              <ArgSignature
                arg={arg}
                className="text-gray-600 dark:text-gray-300"
                registry={registry}
              />
            }
          >
            <Component
              className="w-full rounded border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              id={arg.name}
              nestingNumber={0}
              onChange={onChange}
              registry={registry}
              typeDef={arg.type}
              value={argValues[arg.name]}
            />
          </FormField>
        );
      })}
    </Form>
  );
}
