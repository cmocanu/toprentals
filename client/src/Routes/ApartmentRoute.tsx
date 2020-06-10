import React, { useEffect, useState, useCallback } from "react";
import { getApartments } from "../Backend/ApartmentApi";
import { Apartment, Filter, User } from "../Backend/Types";
import { Grid, makeStyles, Container } from "@material-ui/core";
import { FilterComponent } from "../Components/FilterComponent";
import { CreateApartmentDialog } from "../Components/ApartmentDialog";
import { Map } from "../Components/Map";
import { useDebounce } from "../util";
import { getRealtors } from "../Backend/UserApi";
import { ApartmentCard } from "../Components/ApartmentComponent";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  routeContainer: {
    marginTop: 48,
    marginBottom: 48,
  },
  filterContainer: {
    // width: "30%",
  },
  resultsContainer: {
    // width: "70%",
  },
  filters: {
    // paddingTop: "20%",
    marginBottom: 24,
  },
  apartmentContainer: {
    marginBottom: 16,
    width: "100%",
  },
});

export function ApartmentRoute() {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [priceFilter, setPriceFilter] = useState<Filter>({ min: 0, max: 3000 });
  const [roomNrFilter, setRoomNrFilter] = useState<Filter>({ min: 0, max: 10 });
  const [sizeFilter, setsizeFilter] = useState<Filter>({ min: 0, max: 500 });
  const [realtors, setRealtors] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    async function findRealtors() {
      const res = await getRealtors();
      if (res instanceof Error) {
        console.error("Failed to get realtor list");
      } else {
        setRealtors(res);
      }
    }
    findRealtors();
  }, []);

  const debouncedPriceFilter = useDebounce(priceFilter, 500);
  const debouncedRoomNrFilter = useDebounce(roomNrFilter, 500);
  const debouncedSizeFilter = useDebounce(sizeFilter, 500);

  const refresh = useCallback(() => {
    setRefreshCounter((refreshCounter) => refreshCounter + 1);
  }, []);

  useEffect(() => {
    async function updateApartments() {
      const res = await getApartments(page, debouncedPriceFilter, debouncedRoomNrFilter, debouncedSizeFilter);
      if (res instanceof Error) {
        console.error(res.message);
      } else {
        setApartments(res.apartments);
        setPageCount(res.pageCount);
      }
    }
    updateApartments();
  }, [page, debouncedPriceFilter, debouncedRoomNrFilter, debouncedSizeFilter, refreshCounter]);

  const filters = (
    <Grid container={true} direction="row" justify="center" className={classes.filters}>
      <FilterComponent filter={priceFilter} setFilter={setPriceFilter} unit="€" name="Price filter" maxVal={3000} />
      <FilterComponent filter={roomNrFilter} setFilter={setRoomNrFilter} unit="rooms" name="Room filter" maxVal={10} />
      <FilterComponent filter={sizeFilter} setFilter={setsizeFilter} unit="sqm" name="Size filter" maxVal={500} />
    </Grid>
  );

  const createApartmentButton = realtors && <CreateApartmentDialog refresh={refresh} realtors={realtors} />;

  const handlePageChange = (_event: any, value: number) => setPage(value);

  const renderApartments = (apartments: Apartment[], refresh: () => void, realtors: User[] | undefined) => {
    return (
      <Grid container={true}>
        {apartments.map((apt) => {
          return (
            <Grid item={true} key={apt.id} className={classes.apartmentContainer}>
              <ApartmentCard apartment={apt} refresh={refresh} realtors={realtors} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Container maxWidth="md" className={classes.routeContainer}>
      <Grid container={true} direction="column">
        <Grid item={true} className={classes.filterContainer}>
          {filters}
        </Grid>
        <Grid item={true} className={classes.resultsContainer}>
          {renderApartments(apartments, refresh, realtors)}
          <Pagination count={pageCount} page={page} onChange={handlePageChange} />
          <br />
          {createApartmentButton}
          <br />
          <Map apartments={apartments} refresh={refresh} realtors={realtors} />
        </Grid>
      </Grid>
    </Container>
  );
}
