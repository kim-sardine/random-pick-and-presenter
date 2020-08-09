import React from 'react';
import { Typography, Box, Card, CardContent, Grow } from '@material-ui/core';

export class MyCard {
    cells: string[];

    constructor(cells: string[]) {
        this.cells = cells;
    }
}

type CardProps = {
    card: MyCard
}

function CardComponent({card}: CardProps) {
    return (
        <Grow in={true} timeout={3000}>
            <Card className="my-card" variant="elevation">
                <CardContent>
                    <Box m="1rem">
                        {card.cells.map(cell=> <Typography variant="h4">{cell}</Typography>)}
                    </Box>
                </CardContent>
            </Card>
        </Grow>
    );
}

export default CardComponent;
