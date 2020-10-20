import React from 'react';

import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Home() {

    const addCategory=(event)=>{
        event.preventDefault();
        console.log('test')
    }
    return (
        <div className="App">
            <div>
                <div className="right">
                    <Button variant="outlined" style={{borderRadius:"50px"}}
                            component={Link} to={'/edit-category'}
                    >
                        Edit Categories
                    </Button>
                </div>
                <div className="left mt-20">
                    <Button variant="outlined" color="primary">
                        Add Category
                    </Button>
                </div>
            </div>
            <form onSubmit={addCategory}>
                <div style={{textAlign: 'left'}}>
                    <div className="headline">Enter Category Name</div>
                    <TextField
                        id="outlined-secondary"
                        variant="outlined"
                        color="secondary"
                        required
                    />
                </div>
                <div className="right">
                    <Button variant="outlined" style={{borderRadius: "50px"}}
                            type={'submit'}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Home;
