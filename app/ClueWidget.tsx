import React from 'react';
import { getClueData } from "./lib/api"

export const ClueWidget = async () => {
    const clueData = await getClueData();

    return (
        <span>{JSON.stringify(clueData)}</span>
    )
}
