// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

const Container = styled.div`
    height: 100%;
    background-color: #f4f6f8;
    overflow: scroll;
`;

const Root = () => {
    const match = useRouteMatch();

    return (
        <Container>
            <Switch>
                <Route path={`${match.url}/`}>
                    {'test'}
                </Route>
            </Switch>
        </Container>
    );
};

export default Root;
