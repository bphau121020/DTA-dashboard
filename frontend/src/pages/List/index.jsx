import { makeStyles } from '@material-ui/core';
import SendIcon from '@mui/icons-material/Send';
import { Box, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@material-ui/core/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import DataTable from "../../components/data-table";
import { ExpandableCell } from '../../components/expandable-cell';
import Navbar from '../../components/nav-bar';
import Section from '../../components/section';
import { spinnerStyle } from '../../constant';

const columns = [
    { field: 'id', headerName: 'ID', width: 50, headerAlign: 'center', align: 'center' },
    { field: 'Comment', headerName: 'Comment', minWidth: 300, headerAlign: 'center', renderCell: (params) => <ExpandableCell {...params} />, flex: 1 },
    { field: 'Entertainment', headerNidame: 'Entertainment', minWidth: 120, headerAlign: 'center', align: 'center' },
    { field: 'Accommodation', headerName: 'Accommodation', minWidth: 120, headerAlign: 'center', align: 'center' },
    { field: 'Restaurant_Serving', headerName: 'Restaurant_Serving', minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'Food', headerName: 'Food', minWidth: 110, headerAlign: 'center', align: 'center' },
    { field: 'Traveling', headerName: 'Traveling', minWidth: 110, headerAlign: 'center', align: 'center' },
    { field: 'Shopping', headerName: 'Shopping', minWidth: 110, headerAlign: 'center', align: 'center' },
    { field: 'Country', headerName: 'Country', minWidth: 110, headerAlign: 'center', align: 'center' },
];

const useStyles = makeStyles(() => ({
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
const List = () => {
    const classes = useStyles();
    const [reviews, setReviews] = useState([]);
    const [snackData, setSnackData] = useState({
        isOpen: false,
        message: '',
        type: 'success'
    });
    useEffect(() => {
        axios.get('/api').then(res => {
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
            setReviews(data)
        })
    }, []);

    const [loading, setLoading] = useState(false);
    const handleClick = () => {
        setLoading(!loading);
        axios.get('/cal').then(res => {
            setLoading(false);
            if (res.status === 200) {
                setSnackData({
                    type: res.data !== "Not enough data to calculate!" ? "success" : "warning",
                    isOpen: true,
                    message: res.data
                });
            }
            else {
                setSnackData({
                    type: "error",
                    isOpen: true,
                    message: "Oops! Something went wrong. Please try again."
                });
            }
        })
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackData({ ...snackData, isOpen: false });
    };

    return (
        reviews.length !== 0 ? <Stack sx={{ width: '100%' }}>
            <Snackbar open={snackData.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={snackData.type} sx={{ width: '100%', fontSize: '14px' }} variant="filled">
                    {snackData.message}
                </Alert>
            </Snackbar>
            <Navbar />
            <div className="listline__layout">
                <Section title="List Review Data">
                    <div className="listline__layout__content">
                        <DataTable rows={reviews} columns={columns}
                            style={{ height: "800px", width: "1250px", backgroundColor: '#3b4353', }} darkMode={true} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", margin: '20px 0' }}>
                        <Button variant="contained" onClick={handleClick}
                            size="large"
                            className={classes.button}
                            disabled={loading}
                            endIcon={!loading ? <SendIcon sx={{ fontSize: 25 }} /> : <CircularProgress sx={{ color: 'white' }} size={25} />}>
                            <span style={{ color: 'white', fontSize: '20px' }}>Calulate & Upload</span>
                        </Button>

                    </div>
                </Section>
            </div >
        </Stack > : <div style={spinnerStyle}>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>
    );
}

export default List;
