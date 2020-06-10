import { catchErrors, PermissionDeniedError } from 'errors';

import { defineAbility } from '@casl/ability';

const ability = (userType: string) => {
  // client can view all AVAILABLE apartments

  // realtor can view and CRUD all apartments

  // admin can view and CRUD all apartments
  // admin can view and CRUD all users

  return defineAbility(can => {
    can('GET', 'apartments');
    can('POST', 'logout');

    if (userType === 'REALTOR' || userType === 'ADMIN') {
      can('GET', 'users');

      can('POST', 'apartments');
      can('DELETE', 'apartments');
      can('PUT', 'apartments');
    }
    if (userType == 'ADMIN') {
      can('POST', 'users');
      can('DELETE', 'users');
      can('PUT', 'users');
    }
  });
};

export const checkPermissions = catchErrors(async (req, _res, next) => {
  if (ability(req.currentUser.type).cannot(req.method, req.path.split('/')[1])) {
    throw new PermissionDeniedError();
  }

  next();
});
