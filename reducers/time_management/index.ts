// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import TimeManagementTypes from 'utils/time_management/action_types';
import {workDateToString, dateToWorkDateString} from 'utils/time_management/utils';
import {WorkDate, WorkItem} from 'types/time_management';

import {UserTypes} from 'mattermost-redux/action_types';
import {GenericAction} from 'mattermost-redux/types/actions';
import {Dictionary} from 'mattermost-redux/types/utilities';

const testWorkItemsByDay = {
    [dateToWorkDateString(new Date())]: [
        {
            title: 'Morning systems check',
            time: 30,
        },
        {
            title: 'Visit Mons Olympus',
            time: 120,
        },
        {
            title: 'Call home base at Houston',
            time: 30,
        },
        {
            title: 'Take a break',
            time: 30,
        },
        {
            title: 'Take some dirt samples',
            time: 60,
        },
        {
            title: 'Feel lonely',
            time: 15,
        },
    ],
};

export function workItemsByDay(state: Dictionary<WorkItem[]> = testWorkItemsByDay, action: GenericAction) {
    switch (action.type) {
    case TimeManagementTypes.RECEIVED_WORK_ITEM: {
        const date = action.date as WorkDate;
        const stringDate = workDateToString(date);
        const item = action.item as WorkItem;

        const day = state[stringDate] || [];
        day.push(item);

        return {...state, [stringDate]: day};
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

export default combineReducers({
    workItemsByDay,
});
