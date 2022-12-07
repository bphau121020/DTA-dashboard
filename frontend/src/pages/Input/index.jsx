import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Alert, CircularProgress, FormGroup, IconButton, InputBase, Snackbar, Stack } from '@mui/material';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "../../components/data-table";
import { ExpandableCell } from "../../components/expandable-cell";
import Navbar from "../../components/nav-bar";
import Section from "../../components/section";
import { spinnerStyle } from '../../constant';
import { realtimeDB } from "../../firebase/config";

const createData = (entertainment, accommodation, restaurent_serving, food, traveling, shopping, placeId) => {
  return { entertainment, accommodation, restaurent_serving, food, traveling, shopping, placeId };
}

const columns = [
  { field: 'id', headerName: 'ID', width: 50, headerAlign: 'center', align: 'center' },
  { field: 'Comment', headerName: 'Comment', minWidth: 300, headerAlign: 'center', renderCell: (params) => <ExpandableCell {...params} />, flex: 1, align: 'left' },
  { field: 'Entertainment', headerName: 'Entertainment', minWidth: 120, headerAlign: 'center', align: 'center' },
  { field: 'Accommodation', headerName: 'Accommodation', minWidth: 120, headerAlign: 'center', align: 'center' },
  { field: 'Restaurant_Serving', headerName: 'Restaurant_Serving', minWidth: 150, headerAlign: 'center', align: 'center' },
  { field: 'Food', headerName: 'Food', minWidth: 110, headerAlign: 'center', align: 'center' },
  { field: 'Traveling', headerName: 'Traveling', minWidth: 110, headerAlign: 'center', align: 'center' },
  { field: 'Shopping', headerName: 'Shopping', minWidth: 110, headerAlign: 'center', align: 'center' },
  { field: 'Country', headerName: 'Country', minWidth: 110, headerAlign: 'center', align: 'center' }
];

const useStyles = makeStyles((theme) => ({
  input: {
    '& > *': {
      fontSize: '18px',
      marginBottom: theme.spacing(2),
      backgroundColor: '#3b4353',
      color: 'white',
      '&:hover': {
        backgroundColor: '#3b4353',
        color: 'white',
      },
      '&.Mui-focused': {
        backgroundColor: '#3b4353',
        color: 'white',
      },
      '&.MuiFilledInput-underline:before': {
        borderBottom: '2px solid #6f7b9b',
      },
      '&.MuiFilledInput-underline:after': {
        borderBottom: '2px solid #258b9e',
      },
    },
  },
  analyze: {
    '&': {
      backgroundColor: '#39b175',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: '#6de9ab',
        boxShadow: 'none',
      },
    },
    '& > *': {
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
    },
  },
  textfield: {
    color: switchColor,
    borderColor: switchColor,
    border: "1px solid #ccc",
    borderRadius: 5,
    fontSize: 16
  },
  button: {
    '&': {
      backgroundColor: '#39b175',
      boxShadow: 'none',
      fontSize: '1.5rem',
      '&:hover': {
        backgroundColor: '#6de9ab',
        boxShadow: 'none',
      },
    },
    '& > *': {
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
    }
  }
}))
const switchColor = '#ccc';

const selectStyle = {
  '& .MuiInputBase-sizeSmall': {
    color: switchColor,
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: switchColor,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: switchColor,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: switchColor,
  },
  '.MuiSvgIcon-root ': {
    fill: switchColor,
  }
}
const formStyle = {
  m: 1, minWidth: 180, width: 180,
  '& .MuiInputBase-sizeSmall': {
    color: switchColor,
    fontSize: '16px'
  },
  '& .MuiInputBase-input': {
    padding: '10px 0px 10px 15px',
    fontWeight: 'bold'
  },
  "& .MuiInputLabel-outlined": {
    color: switchColor
  },
  '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
    color: switchColor
  }
}

export const Input = () => {
  const classes = useStyles();
  const comment = useRef("");
  const newPlace = useRef("");
  const [rows, setRows] = useState([]);
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState("1");
  const [placeList, setPlaceList] = useState([]);
  const [snackData, setSnackData] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const handleClick = () => {
    let data = new FormData();
    data.append('review', comment.current.value);
    data.append('country', placeId);
    setLoading(true);
    setValue(comment.current.value)
    axios.post("/index", data).then(res => {
      const predict_results = res.data;
      console.log(predict_results)
      const result = [];
      result.push(createData(predict_results.Entertainment, predict_results.Accommodation, predict_results.Restaurant_Serving,
        predict_results.Food, predict_results.Traveling, predict_results.Shopping, predict_results.Country))
      setRows(result)
      setList([...list, {
        id: list.length, Comment: comment.current.value, Entertainment: predict_results.Entertainment,
        Accommodation: predict_results.Accommodation, Restaurant_Serving: predict_results.Restaurant_Serving,
        Food: predict_results.Food, Traveling: predict_results.Traveling,
        Shopping: predict_results.Shopping, Country: predict_results.Country
      }])
      comment.current.value = ""
      setLoading(false);
    }).catch(err => {
      console.log(err)
    })
  };

  useEffect(() => {
    axios.get("/get-list").then(res => {
      const data = []
      res.data.forEach((p, index) => {
        data.push({
          id: index,
          Comment: p.Comment,
          Entertainment: p.Entertainment,
          Accommodation: p.Accommodation,
          Restaurant_Serving: p.Restaurant_Serving,
          Food: p.Food,
          Traveling: p.Traveling,
          Shopping: p.Shopping,
          Country: p.Country
        })
      })
      setList(data)
    }).catch(err => {
      console.log(err)
    })

    const placeRef = ref(realtimeDB, 'place');
    onValue(placeRef, (snapshot) => {
      let record = [];
      snapshot.forEach(childSnapShot => {
        let keyName = childSnapShot.key;
        let data = childSnapShot.val();
        record.push({ "key": keyName, "data": data });
      });
      setPlaceList(record)
    })
  }, [])

  const handleAdd = () => {
    setAdd(false);
    set(ref(realtimeDB, "place/" + (placeList.length + 1)), newPlace.current.value).then(() => {
      setSnackData({ isOpen: true, message: 'Add place successfully!', type: 'success' })
    }).catch(() => {
      setSnackData({ isOpen: true, message: 'Add place failed, please try again!', type: 'error' })
    })
  }

  const [add, setAdd] = useState(false);
  const addNew = () => {
    setAdd(!add);
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackData({ ...snackData, isOpen: false });
  };
  return <Stack sx={{ width: '100%' }}>
    <Snackbar open={snackData.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={snackData.type} sx={{ width: '100%', fontSize: '14px' }} variant="filled">
        {snackData.message}
      </Alert>
    </Snackbar>
    {placeList.length !== 0 ? <div className="app">
      <div className="home-wrapper">
        <div className="home">
          <Navbar />
          <Section title="Wellcome to DTA">
            <div style={{ textAlign: 'center' }}><p>(Please input or paste here)</p></div>
            <div className="input_main__content">
              <form action="/index" method="POST" className="contact-form">
                <div style={{ display: 'flex', alignItems: 'center', width: 220, justifyContent: 'space-between' }}>
                  <Box sx={{
                    width: 180
                  }}>
                    <FormControl sx={formStyle} size="small">
                      <Select
                        labelId="place-label"
                        id="demo-simple-select"
                        value={placeId}
                        onChange={(event) => setPlaceId(event.target.value)}
                        sx={selectStyle}
                      >
                        {placeList.map((place) =>
                          <MenuItem value={place.key} key={place.key} sx={{
                            fontSize: '16px'
                          }}> {place.data} </MenuItem>)
                        }
                      </Select>
                    </FormControl>
                  </Box>

                  <IconButton color="primary" title="Add new place" onClick={addNew}>
                    <AddIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </div>
                {add &&
                  <FormGroup sx={{ ...formStyle, display: 'flex', flexDirection: 'row', width: 400, marginBottom: '20px', justifyContent: 'space-between' }} size="small">
                    <InputBase
                      className={classes.textfield}
                      value={placeList.length + 1}
                      style={{ width: 40 }}
                    />
                    <InputBase
                      className={classes.textfield}
                      inputRef={newPlace}
                    />
                    <Button variant="contained" onClick={handleAdd}
                      size="small"
                      className={classes.button}
                    >
                      Add
                    </Button>
                    <Button variant="contained" onClick={addNew}
                      size="small"
                      style={{ backgroundColor: '#d2302f' }}
                      className={classes.button}
                    >
                      Cancel
                    </Button>
                  </FormGroup>
                }
                <TextField
                  className={classes.input}
                  inputRef={comment}
                  type="text"
                  name="input"
                  label="Comment"
                  multiline
                  minRows="5"
                  variant="filled"
                />
                <Button className={classes.analyze} variant="contained" onClick={handleClick}>
                  Analyze
                </Button>
              </form>
              <div className="input_main__content__output">
                <div style={{ textAlign: 'center', marginTop: '20px' }}><h2>The rating for this comment:</h2></div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '20px 0',
                  fontSize: 18,
                  textAlign: value.length > 56 ? 'left' : 'center'
                }}><p style={{
                  width: " 600px"
                }}>{value && `"${value}"`}</p></div>
              </div>
            </div>
            {loading ?
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
              : value && <div className="data-table">
                <Table sx={{
                  width: 1100, height: 100,
                  "& .MuiTableCell-sizeMedium": {
                    fontSize: 16,
                    color: '#fff',
                    backgroundColor: '#3b4353',
                    width: 40,
                    maxWidth: 40,
                  }
                }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" >Entertainment</TableCell>
                      <TableCell align="center" >Accommodation</TableCell>
                      <TableCell align="center">Restaurent Serving&nbsp;</TableCell>
                      <TableCell align="center">Food&nbsp;</TableCell>
                      <TableCell align="center">Traveling&nbsp;</TableCell>
                      <TableCell align="center">Shopping&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length !== 0 && rows.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0.5 },
                          '& .MuiTableCell-sizeMedium': {
                            fontSize: 16
                          }
                        }}
                      >
                        <TableCell align="center">
                          {row.entertainment}
                        </TableCell>
                        <TableCell align="center">{row.accommodation}</TableCell>
                        <TableCell align="center">{row.restaurent_serving}</TableCell>
                        <TableCell align="center">{row.food}</TableCell>
                        <TableCell align="center">{row.traveling}</TableCell>
                        <TableCell align="center">{row.shopping}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>}
          </Section>
          {list.length !== 0 && <Section title="List Review Data">
            <div className="listinput">
              <DataTable rows={list} columns={columns} style={{
                width: "1250px", height: "400px",
                backgroundColor: '#3b4353',
                marginBottom: '50px'
              }} darkMode={true} />
            </div>
          </Section>}
        </div>
      </div >
    </div > : <div style={spinnerStyle}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>}
  </Stack>
}