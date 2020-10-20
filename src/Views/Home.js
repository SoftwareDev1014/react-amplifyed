import React, { useEffect, useState } from 'react';

import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import { API, graphqlOperation } from 'aws-amplify'

import {createCategory, deleteCategory} from '../graphql/mutations'
import { listCategorys } from '../graphql/queries'
import { makeStyles } from '@material-ui/core/styles';

const initialState = { name: ''}


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
        textTransform: 'uppercase',
        fontSize: '25px',
        color: 'grey',
        padding:'5px'
    },
}));
function Home() {
    const classes = useStyles();
    const [formState, setFormState] = useState(initialState)
    const [categories, setCategories] = useState([])
    useEffect(() => {
        readCategories()
    }, [])
    async function readCategories() {
        try {
            const result = await API.graphql(graphqlOperation(listCategorys))
            setCategories(result.data.listCategorys.items)
        } catch (err) { console.log('error fetching todos') }
    }
    const addCategory= async (event) => {
        event.preventDefault();
        try {
            const input_data = {...formState}
            setFormState(initialState)
            let result=await API.graphql(graphqlOperation(createCategory, {input: input_data}))
            setCategories([...categories, result.data.createCategory])

        } catch (err) {
            console.log('error creating todo:', err)
        }
    }
    const handleDelete= async (data) => {
        try {
            const input_data = {id:data.id}
            console.log(input_data)
            await API.graphql(graphqlOperation(deleteCategory, {input: input_data}))
            let temp=Object.assign([],categories)
            let index=temp.findIndex(x=>x.id==data.id)
            temp.splice(index,1)
            console.log(temp)
            setCategories(temp)

        } catch (err) {
            console.log('error creating todo:', err)
        }
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
                        onChange={(event)=>{
                            let temp={
                                name:event.target.value
                            }
                            setFormState(temp)
                        }}
                        value={formState.name}
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
            <Paper elevation={3} className="mt_20 p20">
                {categories.map((data) => {
                    let icon;


                    return (
                        <Chip
                            key={data.id}
                            label={data.name}
                            onDelete={()=>{handleDelete(data)}}
                            className={classes.chip}
                        />
                    );
                })}
            </Paper>

        </div>
    );
}

export default Home;
