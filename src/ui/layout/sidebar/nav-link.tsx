// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps {
  icon: (_: React.ComponentProps<'svg'>) => JSX.Element;
}

export function NavLink({ children, icon: Icon, ...props }: Props): React.ReactElement<Props> {
  return (
    <NavLinkBase className="nav-link group" {...props}>
      <>
        <Icon className="group-hover:text-gray-400 dark:group-hover:text-gray-300" />
        {children}
      </>
    </NavLinkBase>
  );
}
