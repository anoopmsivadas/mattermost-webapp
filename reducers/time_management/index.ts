// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import TimeManagementTypes from 'utils/time_management/action_types';
import {WorkDate, WorkItem} from 'types/time_management';

import {UserTypes} from 'mattermost-redux/action_types';
import {GenericAction} from 'mattermost-redux/types/actions';
import {Dictionary} from 'mattermost-redux/types/utilities';

function workDateToString(date: WorkDate): string {
    return `${date.year}-${date.month}-${date.year}`;
}

export function workItemsByDay(state: Dictionary<WorkItem[]> = {}, action: GenericAction) {
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
