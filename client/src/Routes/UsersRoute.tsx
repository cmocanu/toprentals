import React, { useEffect, useState, CSSProperties, useCallback } from "react";
import { User } from "../Backend/Types";
import { Grid, CardContent, Card, makeStyles, Container } from "@material-ui/core";
import { getUsers } from "../Backend/UserApi";
import { RemoveUserDialog } from "../Components/RemoveUserDialog";
import { CreateUserDialog, EditUserDialog } from "../Components/SignUpDialog";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  routeContainer: {
    marginTop: 48,
    marginBottom: 48,
  },
  resultsContainer: {
    marginBottom: 10,
    width: 500,
  },
  userCard: {
    marginBottom: 16,
  },
});

export function UserRoute() {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    async function findUsers() {
      const res = await getUsers(page);
      if (res instanceof Error) {
        console.error("Failed to get realtor list");
      } else {
        setUsers(res.users);
        setPageCount(res.pageCount);
      }
    }
    findUsers();
  }, [page, refreshCounter]);

  const refresh = useCallback(() => {
    setRefreshCounter((refreshCounter) => refreshCounter + 1);
  }, []);

  const renderUserType = (user: User) => {
    const color = user.type === "CLIENT" ? "green" : user.type === "REALTOR" ? "blue" : "red";
    const validityStyle: CSSProperties = {
      color,
    };
    return <span style={validityStyle}>{user.type}</span>;
  };

  // const handleChange = (event: any, value: number) => setPage(value);
  const renderUsers = () => {
    return users.map((user) => {
      return (
        <Card key={user.id} className={classes.userCard}>
          <CardContent>
            <Grid container={true} direction="column">
              <Grid item={true}>
                <Grid container={true} justify="space-between" alignItems="center">
                  <Grid item={true}>{user.name}</Grid>
                  <Grid item={true}>
                    <Grid container={true}>
                      <Grid item={true}>
                        <EditUserDialog user={user} onSuccess={refresh} />
                      </Grid>
                      <Grid item={true}>
                        {user.type !== "ADMIN" && <RemoveUserDialog user={user} onRemove={refresh} />}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Grid item={true}>
                <Grid container={true} justify="space-between">
                  <Grid item={true}>{user.id}</Grid>
                  <Grid item={true}>{user.email}</Grid>
                  <Grid item={true}>{renderUserType(user)}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    });
  };

  const handlePageChange = (_event: any, value: number) => setPage(value);

  return (
    <Container maxWidth="md" className={classes.routeContainer}>
      <Grid container={true}>
        <Grid item={true} className={classes.resultsContainer}>
          {renderUsers()}
          <Pagination count={pageCount} page={page} onChange={handlePageChange} />
          <br />
          {<CreateUserDialog onSuccess={refresh} />}
        </Grid>
      </Grid>
    </Container>
  );
}
