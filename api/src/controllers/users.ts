import { catchErrors, PermissionDeniedError, InvalidTokenError, BadUserInputError } from 'errors';
import { createEntity, deleteEntity, updateEntity, findEntityOrThrow } from 'utils/typeorm';
import { User, Apartment } from 'entities';
import { signToken } from 'utils/authToken';
import * as bcrypt from 'bcrypt';
import { getAuthTokenFromRequest } from 'middleware/authentication';
import { addTokenToBlacklist } from 'state/token_blacklist';
import url from 'url';
import { getPageNumber, PAGE_SIZE } from './util';

export const registerUser = catchErrors(async (req, res) => {
  const email = req.body.email;
  const emailExists = await User.createQueryBuilder('user')
    .select()
    .where('email = :email', { email })
    .getCount();
  if (emailExists) {
    throw new BadUserInputError(
      'A user with this email already exists. Please login or register with a new email.',
    );
  }
  const hash = await bcrypt.hash(req.body.password, 12);
  const user = await createEntity(User, { ...req.body, password: hash });
  res.respond({ user });
});

export const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOneOrFail({ email });

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw new BadUserInputError('Wrong password');
  } else {
    const { name, type, id } = user;
    // TODO DO NOT RETURN PASSWORD IN BODY
    const userInfo = { id, email, name, type };

    res.respond({
      authToken: signToken(userInfo),
    });
  }
});

export const logout = catchErrors(async (req, res) => {
  const token = getAuthTokenFromRequest(req);
  if (token) {
    addTokenToBlacklist(token);
    res.respond(true);
  } else {
    throw new InvalidTokenError();
  }
});

export const remove = catchErrors(async (req, res) => {
  const userToBeRemovedId = parseInt(req.params.id);
  const userToBeRemoved = await findEntityOrThrow(User, userToBeRemovedId);

  // if user is also ADMIN, cannot remove
  if (userToBeRemoved.type !== 'ADMIN') {
    await deleteEntity(User, userToBeRemovedId);

    // change owner to current user
    const currentUserId = req.currentUser.id;
    await Apartment.createQueryBuilder('apartment')
      .update(Apartment)
      .set({ owner_id: currentUserId })
      .where('owner_id = :id', { id: userToBeRemovedId })
      .execute();

    res.respond(true);
  } else {
    throw new PermissionDeniedError();
  }
});

export const update = catchErrors(async (req, res) => {
  const userToUpdate = await findEntityOrThrow(User, req.params.id);
  const currentRole = userToUpdate.type;
  if (currentRole === 'ADMIN') {
    throw new PermissionDeniedError();
  }
  const newRole = req.params.type;
  // check if role is changed from REALTOR to CLIENT
  if (newRole && newRole === 'USER' && currentRole === 'REALTOR') {
    // change owner to current user
    const currentUserId = req.currentUser.id;
    await Apartment.createQueryBuilder('apartment')
      .update(Apartment)
      .set({ owner_id: currentUserId })
      .where('owner_id = :id', { id: userToUpdate.id })
      .execute();
  }
  if (req.body.password) {
    const newHash = await bcrypt.hash(req.body.password, 12);
    req.body.password = newHash;
  }
  await updateEntity(User, req.params.id, req.body);
  res.respond(true);
});

export const getRealtors = catchErrors(async (_req, res) => {
  const realtors = await User.createQueryBuilder('user')
    .select()
    .where("type = 'REALTOR' or type = 'ADMIN'")
    .getMany();
  res.respond(realtors);
});

export const getUsers = catchErrors(async (req, res, next) => {
  const queryObject = url.parse(req.url, true).query;
  const userType = req.currentUser.type;
  const userTypeFilter = queryObject.type;

  if (userTypeFilter === 'REALTOR') {
    if (userType === 'CLIENT') {
      throw new PermissionDeniedError();
    }
    return getRealtors(req, res, next);
  }

  if (userType !== 'ADMIN') {
    throw new PermissionDeniedError();
  }

  const pageNr = getPageNumber(req);
  const [users, count] = await User.createQueryBuilder('user')
    .select()
    .offset((pageNr - 1) * PAGE_SIZE)
    .take(PAGE_SIZE)
    .getManyAndCount();
  const pageCount = Math.ceil(count / PAGE_SIZE);
  res.respond({ pageCount, users });
});
