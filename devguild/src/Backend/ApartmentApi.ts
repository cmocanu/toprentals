import { getRequest, postRequest, getRouteURL, deleteRequest, putRequest } from "./util";
import { Apartment, Filter } from "./Types";

export async function getApartments(
  pageNr: number,
  priceFilter: Filter,
  roomNrFilter: Filter,
  sizeFilter: Filter
): Promise<{ pageCount: number; apartments: Apartment[] } | Error> {
  const route = `/apartments?page=${pageNr}&price=${priceFilter.min},${priceFilter.max}&rooms=${roomNrFilter.min},${roomNrFilter.max}&size=${sizeFilter.min},${sizeFilter.max}`;
  return await getRequest(getRouteURL(route));
}

export async function createApartment(apartment: Partial<Apartment>): Promise<true | Error> {
  const route = `/apartments`;
  return await postRequest(getRouteURL(route), JSON.stringify(apartment));
}

export async function editApartment(apartment: Partial<Apartment>): Promise<true | Error> {
  if (apartment.id === undefined) {
    return Error("Apartment must have an id to be editable.");
  }
  const route = `/apartments/${apartment.id}`;
  return await putRequest(getRouteURL(route), JSON.stringify(apartment));
}

export async function removeApartment(apartment: Partial<Apartment>): Promise<true | Error> {
  const route = `/apartments/${apartment.id}`;
  return await deleteRequest(getRouteURL(route));
}
