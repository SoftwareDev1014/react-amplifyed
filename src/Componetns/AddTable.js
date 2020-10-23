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
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const init_rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

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
    const [selectable, setSelectable] = React.useState(false);
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
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {message}
                </Typography>
            )}

            {/*{numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}*/}
            <Tooltip title="Add One Item">
                <IconButton aria-label="filter list" onClick={onAddItem}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
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
AddTable.defaultProps={
    dense:false,
    selectable:false,
    rowsPerPage:5,
    isHeader:true,
    rows:[{categoryName:'',description:'',key_words:[]}],
    status:{msg:"", state:0},
    handleAddRows:null
}
function AddTable(props) {
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
            const newSelecteds = rows.map((n) => n.categoryName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, categoryName) => {
        const selectedIndex = selected.indexOf(categoryName);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, categoryName);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

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
        temp.push({categoryName:'',description:'',key_words:[]})
        setStatus({
            msg: "",
            state:0
        })
        setRows(temp)
    };

    const isSelected = (categoryName) => selected.indexOf(categoryName) !== -1;

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
            <Paper className={classes.paper}>

                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}

                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.categoryName);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            selected={isItemSelected}
                                        >
                                            {
                                                selectable&&
                                                <TableCell padding="checkbox"  padding="none">
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, row.categoryName)}
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                            }
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <TextField
                                                    id="outlined-secondary"
                                                    variant="outlined"
                                                    color="secondary"
                                                    required
                                                    size="small"
                                                    style={{width:'100%'}}
                                                    onChange={(event)=>{
                                                        let temp=Object.assign([],rows)
                                                        temp[index].categoryName=event.target.value
                                                        setRows(temp)
                                                        setStatus({msg: "", state:0})
                                                    }}
                                                    value={row.categoryName||''}
                                                />
                                            </TableCell>
                                            <TableCell align="left" padding="none" style={{padding:'0 3px'}}>
                                                <TextField
                                                    id="outlined-secondary"
                                                    variant="outlined"
                                                    color="secondary"
                                                    multiline
                                                    size="small"
                                                    style={{width:'100%'}}
                                                    onChange={(event)=>{
                                                        let temp=Object.assign([],rows)
                                                        temp[index].description=event.target.value
                                                        setRows(temp)
                                                        setStatus({msg: "", state:0})
                                                    }}
                                                    value={row.description||''}
                                                />

                                            </TableCell>
                                            <TableCell align="left" padding="none">
                                                <Paper component="ul" className={classes.paper}>
                                                    {
                                                        getKeyWords(row.key_words).map((key_word,key_index) => {
                                                        return (
                                                            <li key={key_index}>
                                                                <Chip
                                                                    label={key_word}
                                                                    onDelete={()=>{
                                                                        let temp=Object.assign([],rows)
                                                                        temp[index].key_words.splice(key_index,1)
                                                                        setRows(temp)
                                                                        setStatus({msg: "", state:0})
                                                                    }}
                                                                    className={classes.chip}
                                                                />
                                                            </li>
                                                        );
                                                    })}
                                                    <TextField
                                                        variant="outlined"
                                                        color="secondary"
                                                        size="small"
                                                        style={{width:'100px'}}
                                                        onKeyDown={(event)=>{
                                                            if (event.key=='Enter' && event.target.value!==''){
                                                                let temp=Object.assign([],rows)
                                                                if (!temp[index].key_words){
                                                                    temp[index].key_words=[]
                                                                }
                                                                temp[index].key_words.push(event.target.value)
                                                                setRows(temp)
                                                                event.target.value=''
                                                                setStatus({msg: "", state:0})
                                                            }

                                                        }}
                                                    />
                                                </Paper>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <div style={{marginTop:'20px'}}>
                {/*<FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />*/}
                {
                    status.state==0&&<Button variant="outlined"
                            onClick={()=>{
                                setStatus({
                                    msg: "Confirm your Category Addition",
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
                                    props.handleAddRows(rows)
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

export default AddTable
