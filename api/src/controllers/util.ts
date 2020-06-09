import url from 'url';

export const PAGE_SIZE = 6;

export const getPageNumber = (req: any) => {
  const queryObject = url.parse(req.url, true).query;
  const page = queryObject.page;
  const pageNr: number = page ? parseInt(page.toString()) : 1;
  return pageNr;
};
