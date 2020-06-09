import { catchErrors } from 'errors';
import { createEntity, deleteEntity, updateEntity } from 'utils/typeorm';
import { Apartment } from 'entities';
import url from 'url';
import { getPageNumber, PAGE_SIZE } from './util';

export const getAvailableApartments = catchErrors(async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const userType = req.currentUser.type;

  const parseParams = (params: string | string[]): number[] => {
    if (!params) {
      return [];
    }
    return params
      .toString()
      .split(',')
      .map(x => parseInt(x));
  };
  // TODO Security protect from SQL injection
  // use toNumber

  const roomFilter = parseParams(queryObject.rooms);
  const priceFilter = parseParams(queryObject.price);
  const sizeFilter = parseParams(queryObject.size);

  const emptySQL = '1=1';
  const roomSQL = roomFilter.length
    ? `room_nr >= ${roomFilter[0]} AND room_nr <= ${roomFilter[1]}`
    : emptySQL;
  const priceSQL =
    priceFilter.length == 2
      ? `price >= ${priceFilter[0]} AND price <= ${priceFilter[1]}`
      : emptySQL;
  const sizeSQL =
    sizeFilter.length == 2 ? `size >= ${sizeFilter[0]} AND size <= ${sizeFilter[1]}` : emptySQL;
  const rentalStatusSQL = userType == 'CLIENT' ? "rental_status = 'AVAILABLE'" : emptySQL;

  const pageNr = getPageNumber(req);
  const [apartments, count] = await Apartment.createQueryBuilder('apartment')
    .select()
    .offset((pageNr - 1) * PAGE_SIZE)
    .take(PAGE_SIZE)
    .where(rentalStatusSQL)
    .andWhere(roomSQL)
    .andWhere(priceSQL)
    .andWhere(sizeSQL)
    .getManyAndCount();
  const pageCount = Math.ceil(count / PAGE_SIZE);
  res.respond({ pageCount, apartments });
});

export const create = catchErrors(async (req, res) => {
  const apartment = await createEntity(Apartment, req.body);
  res.respond({ apartment });
});

export const remove = catchErrors(async (req, res) => {
  const apartment = await deleteEntity(Apartment, req.params.id);
  res.respond({ apartment });
});

export const update = catchErrors(async (req, res) => {
  const apartment = await updateEntity(Apartment, req.params.id, req.body);
  res.respond({ apartment });
});
