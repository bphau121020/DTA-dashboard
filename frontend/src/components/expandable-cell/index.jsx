import { Box } from "@mui/material";
import React from "react";
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
export const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <Box>
            {expanded ? value : value.slice(0, 200)}&nbsp;
            {value.length > 200 && (
                <Link
                    type="button"
                    component="button"
                    sx={{ fontSize: 'inherit' }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'view less' : 'view more'}
                </Link>
            )}
        </Box>
    );
};

ExpandableCell.propTypes = {
    value: PropTypes.any,
};
