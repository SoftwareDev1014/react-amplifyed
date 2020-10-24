import React, {useEffect, useState} from 'react';

import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import {API, graphqlOperation} from "aws-amplify";
import {listCategorys} from "../graphql/queries";
import {makeStyles} from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {deleteCategory, updateCategory} from "../graphql/mutations";
import DeleteTable from "../Componetns/DeleteTable";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = { id:-1,name: ''}


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

export default function DeleteCategory() {
    const classes = useStyles();
    const [formState, setFormState] = useState(initialState)
    const [isDlg, setIsDlg] = useState(false)
    const [categories, setCategories] = useState([])
    const [status, setStatus] = React.useState({msg:"", state:0});
    useEffect(() => {
        readCategories()
    }, [])
    async function readCategories() {
        try {
            const result = await API.graphql(graphqlOperation(listCategorys))
            setCategories(result.data.listCategorys.items)
        } catch (err) { console.log('error fetching todos') }
    }
    const submitDeleteCategories= async (rows) => {
        setStatus({msg:"Deleting these categories to DB", state: 3})
        let s_count=0;
        for (const row of rows) {
            let input_data={id:row.id}
            try {
                await API.graphql(graphqlOperation(deleteCategory, {input: input_data}))
                Object.assign([], categories)
                s_count++;
            } catch (err) {
                console.log('error creating todo:', err)
            }
        }
        readCategories()
        setStatus({msg:`Deleted : ${s_count}`, state: 0})
    }
    const getOriginalName=()=>{
        let index=categories.findIndex(x=>x.id===formState.id)
        //console.log(categories,formState,index)
        let res=index>-1?categories[index].name:'Unknow'
        return res
    }
    const editCategory=(data)=>{
        setFormState({id:data.id,name:data.name})
        setIsDlg(true)
    }
    return (
        <div >
            <div>
                <div className={'headline'}>
                    Delete Category

                </div>
                <div style={{display:'flex',justifyContent:'space-around'}}>
                    <div>
                        <Button variant="outlined"
                                component={Link} to={'/'}
                        >
                            Create New Categories
                        </Button>
                    </div>
                    <div>
                        <Button variant="outlined"
                                component={Link} to={'/edit-category'}
                        >
                            Edit Existing Category
                        </Button>
                    </div>
                </div>
            </div>
            <DeleteTable rows={categories} staus={status} selectable handleDeleteRows={submitDeleteCategories}/>
            {/*<Paper elevation={3} className="mt_20 p20">
                {categories.map((data) => {
                    return (
                        <Chip
                            key={data.id}
                            label={data.name}
                            onClick={()=>{
                                editCategory(data)
                            }}
                            className={classes.chip}
                        />
                    );
                })}
            </Paper>*/}
        </div>
    );
};
