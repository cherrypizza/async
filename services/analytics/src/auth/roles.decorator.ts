import { SetMetadata } from '@nestjs/common';

import { ROLE, ROLES_KEY } from '../constants';

export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
