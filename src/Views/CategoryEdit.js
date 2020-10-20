import React from 'react';

import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';

function CategoryEdit() {
    return (
        <div >
            <div>
                <div className="right">
                    <Button variant="outlined" style={{borderRadius: "50px"}}
                            component={Link} to={'/'}
                    >
                        Add Category
                    </Button>
                </div>
                <div className="left mt-20">
                    <Button variant="outlined" color="primary">
                        Edit Categories
                    </Button>
                </div>
            </div>

        </div>
    );
}

export default CategoryEdit;
