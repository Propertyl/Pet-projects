import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";

export const App = () => {

    return (
        <div>
            <Outlet/>
        </div>
    );
};