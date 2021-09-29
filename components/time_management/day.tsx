// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import {useSelector} from 'react-redux';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import {dateToWorkDateString} from 'utils/time_management/utils';
import {TimeState, WorkItem} from 'types/time_management';

const localizer = momentLocalizer(moment);

const Container = styled.div`
`;

const Title = styled.div`
    font-family: Metropolis;
    font-size: 18px;
    line-height: 24px
    margin-bottom: 14px;
`;

const Body = styled.div`
`;

const dayStart = 9;

function scheduleWorkItemsForDay(tasks: WorkItem[]) {
    let cursor = new Date();
    cursor.setHours(dayStart, 0, 0, 0);

    return tasks.map((t) => {
        const end = moment(cursor).add(t.time, 'm').toDate();
        const event = {
            title: t.title,
            start: cursor,
            end,
        };
        cursor = end;
        return event;
    });
}

const Day = () => {
    const todayKey = dateToWorkDateString(new Date());
    const tasks = useSelector((state: TimeState) => state.time.workItemsByDay[todayKey]) || [];
    const events = scheduleWorkItemsForDay(tasks);

    return (
        <Container>
            <Title>
                {'Your Day'}
            </Title>
            <Body>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor='start'
                    endAccessor='end'
                    defaultView={Views.DAY}
                    views={[Views.DAY]}
                />
            </Body>
        </Container>
    );
};

export default Day;
