import { Role } from './dto.models';

export function getRole(s: string): Role {
  let r: Role = Role.none;
  switch (s) {
    case Role.admin.toString():
      r = Role.admin;
      break;
    case Role.owner.toString():
      r = Role.owner;
      break;
    case Role.staff.toString():
      r = Role.staff;
      break;
    case Role.tenant.toString():
      r = Role.tenant;
      break;
  }
  return r;
}
