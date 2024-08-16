import React, { useState } from 'react';
import { Container, Grid, Paper, TextField, Button } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { evaluate } from 'mathjs';

const Calculator = () => {
    const [input, setInput] = useState("0");

    const clear = () => {
        setInput("0");
    };

    const numberClick = (value) => {
        setInput(prevInput => {
            // Prevent adding multiple decimal points in the same number
            const segments = prevInput.split(/[+\-*/]/); // Split input into number segments
            const lastSegment = segments[segments.length - 1];
            
            // If the value is a decimal point
            if (value === '.') {
                // Check if the last segment already contains a decimal point
                if (lastSegment.includes('.')) {
                    return prevInput; // Do not append decimal if already present in last segment
                }
                // Append a decimal point if the last segment is not empty
                if (lastSegment !== '' && lastSegment !== '-') {
                    return prevInput + value;
                }
                // If the last segment is empty or just a minus sign, replace it
                return prevInput + '0.';
            }
            
            // Handle normal number input
            if (prevInput === '0' && value !== '.') {
                return value;
            }
            return prevInput + value;
        });
    };

    const operatorClick = (operator) => {
        setInput(prevInput => {
            // Remove multiple consecutive operators, except for the minus sign
            let newInput = prevInput.replace(/[+*/]{2,}/g, operator); // Replace multiple "+" "*" "/" with the last operator
            newInput = newInput.replace(/(\d)-{2,}/g, '$1-'); // Replace multiple "-" with a single "-" when between numbers
            newInput = newInput.replace(/(\d)[+*/]{2,}/g, '$1' + operator); // Replace multiple operators if not at the start

            // Handle leading operator cases
            if (/^[+*/]/.test(newInput)) {
                newInput = newInput.slice(1); // Remove leading operator
            }

            // Handle trailing operator
            if (/[+*/]$/.test(newInput) && operator !== '-') {
                newInput = newInput.slice(0, -1); // Remove trailing operator
            }

            // Append the new operator
            return newInput + operator;
        });
    };

    const backspace = () => {
        setInput(prevInput => prevInput.slice(0, -1));
    }

    const calculate = () => {
        try {
            // Define a function to handle operator replacement
            const replaceOperators = (input) => {
                return input.replace(/[+-*/]{2,}/g, (match) => {
                    // Handle specific operator combinations
                    if (match.includes('*-+') || match.includes('/-+')) {
                        return '+';
                    }
                    if (match.includes('+-*')) {
                        return '*';
                    }
                    if (match.includes('+-/')) {
                        return '/';
                    }
                    return match;
                });
            };
    
            // Sanitize input by removing invalid characters
            let sanitizedInput = input.replace(/[^-()\d/*+.]/g, '');
    
            // Replace multiple consecutive operators
            sanitizedInput = replaceOperators(sanitizedInput);
    
            // Remove any trailing operator
            if (/[+*/-]$/.test(sanitizedInput)) {
                sanitizedInput = sanitizedInput.slice(0, -1);
            }
    
            // Evaluate the sanitized expression using mathjs for safety
            const result = evaluate(sanitizedInput);
    
            // Set the result to the input
            setInput(result.toString());
        } catch (error) {
            setInput('Error');
        }
    };

    return (
        <>
            <Container maxWidth="xs">
                <Paper elevation={4} style={{ padding: "20px", backgroundColor: '#2a2a2a', marginTop: "150px" }}>
                    <TextField 
                        id="display"
                        value={input}
                        variant="outlined"
                        fullWidth
                        disabled
                        style={{ backgroundColor: '#eff0f3', fontWeight: 'bold' }}
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                textAlign: 'right',
                            },
                        }}
                    >
                    </TextField>
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <Button 
                                id="clear" 
                                variant="contained" 
                                fullWidth 
                                style={{  color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={clear}
                            >
                                AC
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="backspace" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={backspace}
                            >
                            <BackspaceIcon />
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="add" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={() => operatorClick("+")}
                            >
                                +
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Button 
                                id="seven" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("7")}
                            >
                                7
                            </Button>
                        </Grid>
                        <Grid id="eight" item xs={3}>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("8")}
                            >
                                8
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="nine" 
                                variant="contained" 
                                fullWidth style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px",backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("9")}
                            >
                                9
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="subtract" 
                                variant="contained" 
                                fullWidth style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={() => operatorClick("-")}
                            >
                                -
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Button 
                                id="four" 
                                variant="contained" 
                                fullWidth style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("4")}
                            >
                                4
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="five" 
                                variant="contained" 
                                fullWidth style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("5")}
                            >
                                5
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="six" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("6")}
                            >
                                6
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="multiply" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={() => operatorClick("*")}
                            >
                                x
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Button 
                                id="one" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("1")}
                            >
                                1
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="two" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("2")}
                            >
                                2
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="three" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("3")}
                            >
                                3
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="divide" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={() => operatorClick("/")}
                            >
                                /
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Button 
                                id="zero" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick("0")}
                            >
                                0
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button 
                                id="decimal" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#ff8e3c' }}
                                onClick={() => numberClick(".")}
                            >
                                .
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button 
                                id="equals" 
                                variant="contained" 
                                fullWidth 
                                style={{ color: "#0d0d0d", fontSize: "1.5em", fontWeight: 'bold', height: "70px", backgroundColor: '#d9376e' }}
                                onClick={calculate}
                            >
                                =
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    )
}

export default Calculator;