import { faCloudUploadAlt, faFileAlt } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import axios from "axios";
import React, { useState } from "react";
import Navbar from '../../components/nav-bar';

export const Upload = () => {
    const [name, setName] = useState("");
    const [loaded, setLoaded] = useState(0);
    const [size, setSize] = useState("");
    const [snackData, setSnackData] = useState({
        isOpen: false,
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const uploadFile = (file) => {
        let data = new FormData();
        data.append('file', file);
        setLoading(true);
        const option = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total)
                setLoaded(percent)
                if (percent === 100) {
                    file.size < 1024 * 1024
                        ? setSize(file.size + " KB")
                        : setSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
                }
                else {
                    setSize("")
                }

            }
        }
        axios.post("/confirm", data, option).then(res => {
            const result = res.data;
            if (result !== "http://localhost:3000/list") {
                setLoading(false)
                setSnackData({
                    isOpen: true,
                    message: result
                });
            }
            else
                window.location = result;
        }).catch(e => {
            setLoading(false);
            setSnackData({
                isOpen: true,
                message: "Oops! File is invalid. Please try again."
            });
        })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackData({ ...snackData, isOpen: false });
    };

    const onChangeFile = (event) => {
        let file = event.target.files[0];
        if (file) {
            let fileName = file.name;
            if (fileName.length >= 12) {
                let splitName = fileName.split(".");
                fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
            }
            uploadFile(file);
            setName(fileName);
        }

    }
    return (
        <Stack sx={{ width: '100%' }}>
            <Snackbar open={snackData.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: '14px' }} variant="filled">
                    {snackData.message}
                </Alert>
            </Snackbar>
            <Navbar />
            <div className='upload-main'>
                <div className="wrapper">
                    <form>
                        <div className="form" onClick={() => document.querySelector(".file-input").click()}>
                            <input
                                className="file-input"
                                id="formFileLg"
                                type="file"
                                name="file"
                                accept=".csv"
                                hidden
                                onClick={(event) => event.target.value = null}
                                onChange={(event) => {
                                    onChangeFile(event)
                                }}
                            />
                            {loading ? <CircularProgress /> : <FontAwesomeIcon icon={faCloudUploadAlt} size="4x" color="#6990f2" />}

                            <p>Browse File to Upload</p>
                            {name && <li className="row">
                                <FontAwesomeIcon icon={faFileAlt} size="2x" color="#6990f2" />
                                <div className="content">
                                    <div className="details">
                                        <span className="name">{name} {">"} success {">"}</span>
                                        <span className="percent">{loaded}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: `${loaded}%` }}></div>
                                    </div>
                                </div>
                            </li>}
                            {size &&
                                < span className="size">{size}</span>
                            }
                        </div>
                    </form>
                </div>
            </div ></Stack>);
}
export default Upload;