import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Category Name',width:'140px' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Category Description',width:'180px' },
    { id: 'keywords', numeric: false, disablePadding: false, label: 'KeyWords/Phrases' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [selectable, setSelectable] = React.useState(props.selectable);
    return (
        <TableHead >
            <TableRow style={{backgroundColor:'lightgrey'}}>
                {
                    selectable&&
                    <TableCell padding="none">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </TableCell>
                }
                {/*<TableCell padding="none">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>*/}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        width={headCell.width}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

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
            className={clsx(classes.root, {

            })}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div"
                        dangerouslySetInnerHTML={{__html: message}}
            >

            </Typography>
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
        margin: 0,
        width:'100%'
    }
}));
DeleteTable.defaultProps={
    dense:false,
    selectable:false,
    rowsPerPage:5,
    isHeader:true,
    rows:[{name:'',description:'',key_words:[]}],
    status:{msg:"", state:0},
    handleDeleteRows:null
}
function DeleteTable(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [status, setStatus] = React.useState(props.status);
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [selectable, setSelectable] = React.useState(props.selectable);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(props.dense);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);
    const [rows, setRows] = React.useState(props.rows);
    React.useEffect(() => {
        setRows(props.rows);
        setStatus(props.staus);
    }, [props])
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        let newSelected = [];
        newSelected = [Object.assign({},row)];
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
        setStatus({
            msg: "",
            state:0
        })
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
    return (
        <div className={classes.root}>
            {
                props.isHeader&&
                <EnhancedTableToolbar numSelected={selected.length}

                                      message={status.msg}
                                      onAddItem={handleAddItem} />
            }
            {
                status.state==0&&
                <Paper className={classes.paper}>
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
                </Paper>
            }
            <div style={{marginTop:'20px'}}>
                {/*<FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />*/}
                {
                    status.state==0&&<Button variant="outlined"
                                             onClick={()=>{
                                                 setStatus({
                                                     msg: "Please confirm that you want to delete the following" +
                                                         ` Category and all its Keywords and Phrases:<span style='color:blue'> ${selected[0].categoryName}</span>`,
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
                                onClick={()=>{
                                    /*setStatus({
                                        msg: "Added successfully",
                                        state:3
                                    })*/
                                    console.log(selected)
                                    props.handleDeleteRows(selected)
                                }}
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
        </div>
    );
}

export default DeleteTable
