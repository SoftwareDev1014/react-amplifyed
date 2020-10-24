import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/Backup';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TextField from "@material-ui/core/TextField";
import TableCell from "@material-ui/core/TableCell";
import {Storage} from "aws-amplify";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected,onAddItem, message } = props;

    return (
        <Toolbar
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {message}
            </Typography>

            {/*<Tooltip title="Add One Item">
                <IconButton aria-label="filter list" onClick={onAddItem}>
                    <AddIcon />
                </IconButton>
            </Tooltip>*/}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    /*paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },*/
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    paper: {
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0
    }
}));

const FileInput=(props)=>{
    const [fileName,setFileName]=React.useState("")
    let fileInput=null
    const handleChangeInputFile= async (event) => {
        //console.log(event.target.files)
        let file_key=props.id+'.txt'
        let file = event.target.files[0]
        setFileName(file.name)
        let files = event.target.files
        let reader = new FileReader();
        await reader.readAsText(file, "UTF-8")
        reader.onload = function (evt) {
            console.log(evt.target.result)
            let content=evt.target.result
            props.updateData(content,files)
            Storage.put(file_key, content)
                .then (result => console.log(result)) // {key: "test.txt"}
                .catch(err => console.log(err));
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
        console.log(reader)

    }
    return(
        <div>
            <input type="file"
                   ref={input => fileInput = input}
                   style={{display:"none"}}
                   onChange={handleChangeInputFile}

                   accept="text/plain"/>
            <IconButton onClick={()=>{
                fileInput.click()
            }}>
                <UploadIcon fontSize="inherit" />
            </IconButton>
            {fileName}
        </div>
    )
}
FileInput.defaultProps={
    id:"",
    updateData:null
}
EditTable.defaultProps={
    dense:false,
    selectable:false,
    rowsPerPage:5,
    isHeader:true,
    rows:[{name:'',description:'',key_words:[]}],
    status:{msg:"Please Edit Categories", state:0},
    handleUpdateRows:null,

}
function EditTable(props) {
    let fileInput=null
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [status, setStatus] = React.useState(props.status);
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [selectable, setSelectable] = React.useState(props.selectable);
    const [fileName, setFileName] = React.useState("");

    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(props.dense);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);
    const [rows, setRows] = React.useState(props.rows);
    React.useEffect(() => {
        // setRows(props.rows);
        setStatus(props.status)
    }, [props])
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        const selectedIndex = selected.findIndex(x=>x.id==row.id);
        let newSelected = [];
        newSelected = [Object.assign({},row)];
        /*if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }*/

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const handleAddItem = (event) => {
        let temp=Object.assign([],rows);
        temp.push({name:'',description:'',key_words:[]})
        setRows(temp)
    };

    const isSelected = (id) => {
        return selected.findIndex(x=>x.id==id)!==-1
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const getKeyWords=(key_words)=>{
        if (key_words){
            return key_words
        }
        else{
            return []
        }
    }
    const handleDownload= async (key) => {
        const signedURL = await Storage.get(key)
        window.location.href=signedURL
        console.log(signedURL)
    }
    return (
        <div className={classes.root}>
            {
                props.isHeader&&
                <EnhancedTableToolbar numSelected={selected.length}
                                      message={status.msg}
                                      onAddItem={handleAddItem} />
            }
            <Paper className={classes.paper}>
                <List aria-label="main mailbox folders" style={{width:"100%",height:"300px",overflowY:"scroll"}}>
                    {
                        rows.map((row,r_index)=>{
                           return(
                               <ListItem
                                   key={row.id}
                                   button
                                   selected={isSelected(row.id)}
                                   onClick={(event) => handleClick(event,row)}
                               >
                                   <ListItemText primary={row.categoryName} />
                                   <Divider />
                               </ListItem>
                           )
                        })
                    }

                </List>
            </Paper>
            <br/>
            {
                selected.length>0&&
                <form
                    onSubmit={(event)=>{
                        event.preventDefault()
                        props.handleUpdateRows(selected)
                    }}
                    style={{textAlign:"left"}}>
                    <div>CategoryName:
                        <span style={{fontSize:"24px",marginLeft:"5px"}}>
                        {rows[rows.findIndex(x=>x.id==selected[0].id)].categoryName}</span>
                    </div><br/>
                    {
                        status.state==1&&
                        <div>NewCategoryName:
                            <span style={{fontSize:"24px",marginLeft:"5px"}}>
                        {rows[rows.findIndex(x=>x.id==selected[0].id)].categoryName}</span>
                            <div>
                                FileName : {fileName}
                            </div>
                        </div>
                    }
                    {
                        status.state==0&&
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   value={selected[0].categoryName}
                                   onChange={(e)=>{
                                       let temp=Object.assign([],selected)
                                       temp[0].categoryName=e.target.value
                                       setSelected(temp)
                                   }}
                                   required
                                   label={"NewCategoryName"}/>
                    }
                    <br/><br/>
                    {
                        status.state==0&&
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   onChange={(e)=>{
                                       let temp=Object.assign([],selected)
                                       temp[0].description=e.target.value
                                       setSelected(temp)
                                   }}
                                   label={"CategoryDescription"}/>
                    }
                    <br/>
                    {
                        status.state==0&&
                            <div style={{display:'flex'}}>
                                <div>
                                    <IconButton onClick={()=>{
                                        handleDownload(selected[0].id+'.txt')
                                    }}>
                                        <DownloadIcon fontSize="inherit" />
                                    </IconButton>
                                </div>
                                <FileInput id={selected[0].id} updateData={(value,files)=>{
                                    let temp=Object.assign([],selected)
                                    console.log(files[0])
                                    setFileName(files[0].name)
                                    temp[0].key_words=value
                                    setSelected(temp)
                                }}/>
                            </div>
                    }


                    <div >
                        {
                            status.state==0&&
                            <Button variant="outlined"
                                    onClick={()=>{
                                        setStatus({
                                            msg: "Confirm your Category Change",
                                            state:1
                                        })
                                    }}
                            >
                                Submit
                            </Button>
                        }
                        {
                            status.state==1&&
                            <div>
                                <Button variant="outlined"
                                        type={"submit"}
                                        style={{marginRight:'50px'}}
                                >
                                    Confirm
                                </Button>
                                <Button variant="outlined"
                                        onClick={()=>{
                                            setStatus({
                                                msg: "",
                                                state:0
                                            })

                                        }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        }
                    </div>
                </form>
            }

        </div>
    );
}

export default EditTable
