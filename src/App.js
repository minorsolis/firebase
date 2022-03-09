import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

function App() {
  const [values, setValues] = useState({});
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUsers(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  const createUser = async () => {
    await addDoc(userCollectionRef, values);
    getUsers();
    setValues({});
  };

  const updateUser = async (row) => {
    const userDoc = doc(db, "users", row.id);
    const newRow = Object.assign({ ...row });
    newRow.last_name = `${newRow.last_name} ${Math.floor(Math.random() * 100)}`;
    await updateDoc(userDoc, newRow);
    getUsers();
  };

  const deleteUser = async (row) => {
    const userDoc = doc(db, "users", row.id);
    await deleteDoc(userDoc);
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ minWidth: 275 }}>
          <CardContent>
            <FormControl>
              <TextField
                id="first_name"
                label="First Name"
                variant="outlined"
                name="first_name"
                onChange={(e) => {
                  console.log(e.target);
                  setValues({ ...values, first_name: e.target.value });
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                id="last_name"
                label="Last Name"
                variant="outlined"
                name="last_name"
                onChange={(e) => {
                  setValues({ ...values, last_name: e.target.value });
                }}
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={(e) => {
                createUser();
              }}
            >
              New User
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* <div className="App">
        <div>
          <input
            name="first_name"
            placeholder="First Name"
            onChange={(e) => {
              console.log(e.target);
              setValues({ ...values, first_name: e.target.value });
            }}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={(e) => {
              setValues({ ...values, last_name: e.target.value });
            }}
          />
          <button
            onClick={(e) => {
              createUser();
            }}
          >
            Create User
          </button>
          <hr />
        </div>
      </div> */}

      {Array.isArray(users) &&
        users.map((row, index) => {
          return (
            <Grid key={index} item xs={4}>
              <Card variant="outlined" sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {row.first_name} {row.last_name}
                  </Typography>
                  <Typography variant="body2">ID: {row.id}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      updateUser(row);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      deleteUser(row);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default App;
