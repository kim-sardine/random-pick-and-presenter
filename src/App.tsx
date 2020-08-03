import React, { useState } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import CardComponent, { MyCard } from './Card';
import './App.css';
import { Typography, Box } from '@material-ui/core';

enum PickerStatus {
    INIT,
    READY,
    RUNNING,
    FINISHED
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        marginBottom: theme.spacing(3),
    },
    toolBar: {
        justifyContent: "space-between",
    },
    noTransform: {
        textTransform: 'none',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    centerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const dumpUserInputData = `This	is	sample data
Hugo Lloris	Goalkeeper	 France
Jan Vertonghen	Defender	 Belgium
Ben Davies	Defender	 Wales
Eric Dier	Midfielder	 England
Moussa Sissoko	Midfielder	 France
Dele Alli	Midfielder	 England
Lucas Moura	Midfielder	 Brazil
Son Heung-Min	Forward	 South Korea`;


function App() {
    const [userInputData, setUserInputData] = useState(dumpUserInputData);
    const [cardData, setCardData] = useState([new MyCard([])]);
    const [pickerStatus, setPickerStatus] = useState(PickerStatus.INIT);
    const [currentCardIdx, setCurrentCardIdx] = useState(0);
    const handle = useFullScreenHandle();
    
    const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInputData(e.target.value);
    };
    
    const onSubmitData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let t_cardData: MyCard[] = [];
        let rows = userInputData.split("\n");
        for(let row of rows) {
            if (row !== "") {
                let cells = row.split("\t");
                t_cardData.push(new MyCard(cells));
            }
        }
        
        if (t_cardData.length === 0) {
            setCardData([new MyCard([])])
        }
        else {
            shuffleCards(t_cardData);
            setCardData(t_cardData);
            setPickerStatus(PickerStatus.READY);
            setCurrentCardIdx(0);
        }
    };
    
    const InitialPage = () => (
        <Typography variant="h5">
            Click button on the left to start RPAP!
        </Typography>
    )

    const PickerPage = () => {
        if (pickerStatus === PickerStatus.READY) {
            return (
                <Button 
                    variant="outlined"
                    color="primary"
                    onClick={() => setPickerStatus(PickerStatus.RUNNING)}
                >
                    Let's Start
                </Button>
            )
        }
        else if (pickerStatus === PickerStatus.FINISHED) {
            return (
                <Typography variant="h5">
                    Finished
                </Typography>
            )
        }
        else {
            return (
                <div>
                    <CardComponent card={cardData[currentCardIdx]} />
                    <Box mt="2rem">
                        <Button 
                            variant="contained"
                            onClick={getNextCard}
                            endIcon={<NavigateNextIcon />}
                        >
                            Next
                        </Button>
                    </Box>
                    <Box mt="1rem">
                        <Typography variant="h6">
                            {currentCardIdx + 1} / {cardData.length}
                        </Typography>
                    </Box>
                </div>
            )
        }
    }
    
    
    function shuffleCards(cards: MyCard[]) {
        for(let i = cards.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = cards[i]
            cards[i] = cards[j]
            cards[j] = temp
        }
    }
    
    function getNextCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (currentCardIdx === cardData.length - 1) {
            setPickerStatus(PickerStatus.FINISHED)
        }
        else {
            setCurrentCardIdx(currentCardIdx + 1);
        }
    }

    const classes = useStyles();

    // TODO: Add modal to 'How to use' (with gif?)
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                    <Button color="inherit" className={classes.noTransform}>How to use</Button>
                    <Typography variant="h6">
                        RPAP - Random Pick and Presenter
                    </Typography>
                    <Button color="inherit" className={classes.noTransform} target="_blank" href="https://side-punch.com">Side-Punch</Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} direction="row" justify="center">
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper} style={{minHeight: 480}}>
                        <TextField
                            id="user_input"
                            label="Copy from Excel and Paste it here"
                            value={userInputData} 
                            onChange={onChangeInput}
                            fullWidth
                            multiline
                            margin="normal"
                            autoFocus
                            rows={20}
                            variant="outlined"
                        />
                        <Button onClick={onSubmitData} variant="contained" color="primary">
                            Shuffle & Run
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={`${classes.paper} ${classes.centerContent}`} style={{minHeight: 480, position: 'relative'}}>
                        <Fab className={classes.fab} color="primary" aria-label="full screen" size="small">
                            <FullscreenIcon onClick={handle.enter} />
                        </Fab>
                        <FullScreen handle={handle}>
                            {pickerStatus === PickerStatus.INIT ? <InitialPage /> : <PickerPage />}
                        </FullScreen>
                    </Paper>
                </Grid>
            </Grid>
        </div>
        );
    }
    
    export default App;
                    