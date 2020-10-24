import React, { useEffect, useState } from 'react';

import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';

import { API, graphqlOperation,Storage  } from 'aws-amplify'
import awsconfig from '../aws-exports';

import {createCategory, deleteCategory, updateCategory} from '../graphql/mutations'
import { listCategorys } from '../graphql/queries'
import { makeStyles } from '@material-ui/core/styles';
import AddTable from "../Componetns/AddTable";

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
    const [status, setStatus] = React.useState({msg:"", state:0});
    const [categories, setCategories] = useState([{categoryName:"",description:"",key_words:[]}])
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
    const addCategories= async (rows) => {
        console.log('rows',rows)
        setStatus({msg:"Creating these categories to DB", state: 3})
        let s_count=0;
        for (const input_data of rows) {
            try {
                let result=await API.graphql(graphqlOperation(createCategory, {input: input_data}))
                let file_key=result.data.createCategory.id
                Storage.put(file_key+'.txt', input_data.key_words)
                    .then (result => console.log(result)) // {key: "test.txt"}
                    .catch(err => console.log(err));
                console.log('result',result)
                s_count++;
            } catch (err) {
                console.log('error creating todo:', err)
            }
        }
        //setCategories([{categoryName:"",description:"",key_words:[]}])
        readCategories()
        setStatus({msg:`Created ${s_count} categories, Failed Count:${rows.length-s_count}`, state: 0})
    }
    const submitUpdateCategories=async (rows) => {
        setStatus({msg:"Updating these categories to DB", state: 3})
        let s_count=0;
        let o_categories=JSON.parse(localStorage.categories)
        let temp = Object.assign([], categories)
        for (const input_data of rows) {
            let index=o_categories.findIndex(x=>x.id==input_data.id)
            if (index==-1)continue
            if (JSON.stringify(o_categories[index])==JSON.stringify(input_data))continue
            try {
                delete input_data.createdAt
                delete input_data.updatedAt
                console.log('input_data',input_data)
                let result=await API.graphql(graphqlOperation(updateCategory, {input: input_data}))

                let index = temp.findIndex(x => x.id == input_data.id)
                temp[index]=result.data.updateCategory
                console.log(temp[index])
                let file_key=input_data.id
                Storage.put(file_key+'.txt', input_data.key_words)
                    .then (result => console.log(result)) // {key: "test.txt"}
                    .catch(err => console.log(err));
                s_count++;
            } catch (err) {
                console.log('error creating todo:', err)
            }
        }
        setCategories(temp)
        // readCategories()
        setStatus({msg:`Updated ${s_count} categories, Total Count:${rows.length-s_count}`, state: 0})
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
                <div className={'headline'}>
                    Create New Category
                </div>
                <div style={{display:'flex',justifyContent:'space-around'}}>
                    <div>
                        <Button variant="outlined"
                                component={Link} to={'/edit-category'}
                        >
                            Edit Existing Categories
                        </Button>
                    </div>
                    <div>
                        <Button variant="outlined"
                                component={Link} to={'/delete-category'}
                        >
                            Delete Category
                        </Button>
                    </div>
                </div>
            </div>
            <br/>

            <AddTable rows={categories} handleAddRows={addCategories} handleUpdateRows={submitUpdateCategories} staus={status}/>
            {/*<form onSubmit={addCategory}>
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
            </Paper>*/}

        </div>
    );
}

export default Home;
