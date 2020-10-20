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
function CategoryEdit() {
    const classes = useStyles();
    const [formState, setFormState] = useState(initialState)
    const [isDlg, setIsDlg] = useState(false)
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
    const handleSubmit= async (event) => {
        event.preventDefault()
        try {
            const input_data = {...formState}
            console.log(input_data)
            let result=await API.graphql(graphqlOperation(updateCategory, {input: input_data}))
            let temp = Object.assign([], categories)
            let index = temp.findIndex(x => x.id == formState.id)
            temp[index]=result.data.updateCategory
            setCategories(temp)

        } catch (err) {
            console.log('error creating todo:', err)
        }
        setIsDlg(false)
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
            <Dialog
                open={isDlg}
                TransitionComponent={Transition}
                keepMounted
                onClose={()=>{setIsDlg(false)}}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" >
                    <div style={{fontSize:'30px',color:'grey'}}>
                        MODIFY CATEGORY: {getOriginalName()}
                    </div>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <div style={{textAlign: 'left'}}>
                            <div style={{color:'grey',fontSize:'14px',marginBottom:'40px'}}>
                                TYPE NEW CATEGORY NAME
                            </div>
                            <TextField
                                id="outlined-secondary"
                                variant="outlined"
                                color="secondary"
                                required
                                onChange={(event)=>{
                                    let temp={
                                        id:formState.id,
                                        name:event.target.value
                                    }
                                    setFormState(temp)
                                }}
                                value={formState.name}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="right">
                            <Button variant="outlined" style={{borderRadius: "50px"}}
                                    type={'submit'}
                            >
                                Submit
                            </Button>
                        </div>
                    </DialogActions>


                </form>

            </Dialog>
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
            <Paper elevation={3} className="mt_20 p20">
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
            </Paper>
        </div>
    );
}

export default CategoryEdit;
