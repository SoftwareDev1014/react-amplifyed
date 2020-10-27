import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
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
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import EyeIcon from '@material-ui/icons/Visibility';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/Backup';
import Popover from '@material-ui/core/Popover';
import AddIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button";
import Amplify, {Auth, Storage} from 'aws-amplify';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";


function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
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
    {id: 'name', numeric: false, disablePadding: false, label: 'Category Name', width: '140px'},
    {id: 'description', numeric: false, disablePadding: false, label: 'Category Description'},
    {id: 'keywords', numeric: false, disablePadding: false, label: 'Edit Category', width: '50px'},
    {id: 'edit', numeric: false, disablePadding: false, label: 'upload/download keyword files', width: '50px'},
    {id: 'action', numeric: false, disablePadding: false, label: 'Delete', width: '50px'},
];

function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [selectable, setSelectable] = React.useState(false);
    return (
        <TableHead>
            <TableRow style={{backgroundColor: 'lightgrey'}}>
                {
                    selectable &&
                    <TableCell padding="none">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{'aria-label': 'select all desserts'}}
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

const KeyWordView = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [newCategory, setNewCategory] = React.useState(props.category);
    const [status, setStatus] = React.useState({state: 0, msg: ''});
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    React.useEffect(() => {
        setNewCategory(props.category);
        // setStatus(props.staus);
    }, [props])
    return (
        <div>
            <IconButton aria-describedby={props.category.id}
                        size="medium"
                        onClick={handleClick}>
                <EyeIcon fontSize="inherit"/>
            </IconButton>

            <Popover
                id={props.category.id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography style={{padding: "10px"}} component={'div'}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            setAnchorEl(null);
                            console.log(newCategory)
                            props.updateCategory(newCategory)
                        }}
                        style={{textAlign: "left"}}>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   value={newCategory.categoryName}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.categoryName = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   required
                                   label={"CategoryName"}/><br/><br/>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   value={newCategory.description}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.description = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   label={"CategoryDescription"}/><br/><br/>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   label={"KeyWords/Phrases"}
                                   value={newCategory.key_words}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.key_words = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   rows={8}
                                   multiline/>
                        <div>
                            {
                                status.state == 0 &&
                                <div style={{padding: "10px 0 0 0"}}>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                setStatus({
                                                    msg: "Confirm your Category Addition",
                                                    state: 1
                                                })
                                            }}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            }
                            <div style={{padding: "10px 0 0 0"}}>
                                {status.msg}
                            </div>
                            {
                                status.state == 1 &&
                                <div style={{padding: "10px 0 0 0"}}>
                                    <Button variant="outlined"
                                            type={"submit"}
                                            style={{marginRight: '50px'}}
                                    >
                                        Confirm
                                    </Button>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                setStatus({
                                                    msg: "",
                                                    state: 0
                                                })
                                                setAnchorEl(null);
                                                setNewCategory(category_model)
                                            }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            }
                        </div>
                    </form>

                </Typography>
            </Popover>
        </div>
    )
}
const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {numSelected, onAddItem, message} = props;

    return (
        <div>
            <Tooltip title="Add One Item" style={{width:'250px',textAlign:'center'}}>
                <Button aria-label="filter list" variant="outlined"
                        onClick={() => {
                            props.clickAddIcon(true)
                        }}>
                    {/*<AddIcon />*/}
                    New Category
                </Button>
            </Tooltip>
            <Toolbar
                className={clsx(classes.root, {})}
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

            </Toolbar>
        </div>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};
const FileInput = (props) => {
    let fileInput = null
    const handleChangeInputFile = async (event) => {
        //console.log(event.target.files)
        let file_key = props.id + '.txt'
        let file = event.target.files[0]
        let reader = new FileReader();
        await reader.readAsText(file, "UTF-8")
        reader.onload = function (evt) {
            console.log(evt.target.result)
            let content = evt.target.result
            props.updateData(content)
            Storage.put(file_key, content)
                .then(result => console.log(result)) // {key: "test.txt"}
                .catch(err => console.log(err));
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
        console.log(reader)

    }
    return (
        <div>
            <input type="file"
                   ref={input => fileInput = input}
                   style={{display: "none"}}
                   onChange={handleChangeInputFile}

                   accept="text/plain"/>
            <IconButton onClick={() => {
                fileInput.click()
            }}>
                <UploadIcon fontSize="inherit"/>
            </IconButton>
        </div>
    )
}
FileInput.defaultProps = {
    id: "",
    updateData: null
}
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
AddTable.defaultProps = {
    dense: false,
    selectable: false,
    rowsPerPage: 10,
    isHeader: true,
    rows: [{categoryName: '', description: '', key_words: []}],
    status: {msg: "", state: 0},
    handleAddRows: null,
    handleDownload: null,
    handleUpdateRows: null
}
let category_model = {
    categoryName: "",
    description: "",
    key_words: "",
    key_word_file: ""
}
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddTable(props) {
    let popupState = null
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [isDlg, setIsDlg] = React.useState(false);
    const [isConfirmDlg, setIsConfirmDlg] = React.useState(false);
    const [newCategory, setNewCategory] = React.useState(category_model);
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
        setRowsPerPage(props.rows.length);
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
        let temp = Object.assign([], rows);
        temp.push({categoryName: '', description: '', key_words: []})
        setStatus({
            msg: "",
            state: 0
        })
        setRows(temp)
    };
    const handleDownload = async (key) => {
        const signedURL = await Storage.get(key)
        window.location.href = signedURL
        console.log(signedURL)
    }
    const isSelected = (categoryName) => selected.indexOf(categoryName) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            {
                props.isHeader &&
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    message={status.msg}
                    clickAddIcon={(val) => {
                        setIsDlg(val)
                    }}
                    onAddItem={handleAddItem}/>
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
                                                selectable &&
                                                <TableCell padding="checkbox" padding="none">
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, row.categoryName)}
                                                        checked={isItemSelected}
                                                        inputProps={{'aria-labelledby': labelId}}
                                                    />
                                                </TableCell>
                                            }
                                            <TableCell component="th" id={labelId} scope="row">
                                                {row.categoryName}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.description}

                                            </TableCell>
                                            <TableCell align="left" padding="none">
                                                <KeyWordView category={row} updateCategory={(value) => {
                                                    //console.log(value)
                                                    props.handleUpdateRows([value])
                                                }} status={status}/>
                                            </TableCell>
                                            <TableCell align="left" padding="none">
                                                <div style={{display: "flex"}}>
                                                    <div>
                                                        <IconButton onClick={() => {
                                                            handleDownload(row.id + '.txt')
                                                        }}>
                                                            <DownloadIcon fontSize="inherit"/>
                                                        </IconButton>
                                                    </div>
                                                    <FileInput id={row.id} updateData={(val) => {
                                                        console.log(val)
                                                        let temp = Object.assign([], rows)
                                                        temp[index].key_words = val
                                                        setRows(temp)
                                                    }}/>
                                                </div>
                                            </TableCell>
                                            <TableCell align="left" padding="none">
                                                <div style={{display: "flex"}}>
                                                    <div>
                                                        <IconButton onClick={() => {
                                                            setSelected([row])
                                                            setIsConfirmDlg(true)
                                                        }}>
                                                            <DeleteIcon style={{color: 'red'}} fontSize="inherit"/>
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                    <TableCell colSpan={6}/>
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
            <br/>

            <Dialog
                open={isDlg}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setIsDlg(false)
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <div style={{fontSize: '30px', color: 'grey'}}>
                        Create New Category
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            setIsDlg(false)
                            props.handleAddRows([newCategory])
                        }}
                        style={{textAlign: "left"}}>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   value={newCategory.categoryName}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.categoryName = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   required
                                   label={"CategoryName"}/><br/><br/>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.description = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   label={"CategoryDescription"}/><br/><br/>
                        <TextField variant={"outlined"}
                                   size={"small"}
                                   label={"KeyWords/Phrases"}
                                   onChange={(e) => {
                                       let temp = Object.assign({}, newCategory)
                                       temp.key_words = e.target.value
                                       setNewCategory(temp)
                                   }}
                                   rows={8}
                                   multiline/>
                        <div>
                            {
                                status.state == 0 &&
                                <div style={{padding: "10px 0 0 0"}}>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                setStatus({
                                                    msg: "Confirm your Category Addition",
                                                    state: 1
                                                })
                                            }}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            }
                            <div style={{padding: "10px 0 0 0"}}>
                                {status.msg}
                            </div>
                            {
                                status.state == 1 &&
                                <div style={{padding: "10px 0 0 0"}}>
                                    <Button variant="outlined"
                                            type={"submit"}
                                            style={{marginRight: '50px'}}
                                    >
                                        Confirm
                                    </Button>
                                    <Button variant="outlined"
                                            onClick={() => {
                                                setStatus({
                                                    msg: "",
                                                    state: 0
                                                })
                                                setIsDlg(false)
                                                setNewCategory(category_model)
                                            }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            }
                        </div>
                    </form>
                </DialogContent>


            </Dialog>
            <Dialog
                open={isConfirmDlg}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setIsConfirmDlg(false)
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <div style={{fontSize: '30px', color: 'grey'}}>
                        Confirm Delete
                    </div>
                </DialogTitle>
                {selected.length > 0 && (
                    <DialogContent>
                        <div style={{marginBottom: '50px'}}>Are you sure delete category "{selected[0].categoryName}"
                        </div>
                        <div style={{padding: "10px 0 0 0"}}>
                            <Button variant="outlined"
                                    type={"submit"}
                                    style={{marginRight: '50px'}}
                                    onClick={() => {
                                        props.handleDelete(selected[0])
                                        setIsConfirmDlg(false)
                                    }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outlined"
                                    onClick={() => {
                                        setIsConfirmDlg(false)
                                    }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                )}


            </Dialog>
        </div>
    );
}

export default AddTable
