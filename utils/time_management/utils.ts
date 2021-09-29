// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {WorkDate} from 'types/time_management';

export function workDateToString(date: WorkDate): string {
    return `${date.year}-${date.month}-${date.year}`;
}

export function dateToWorkDateString(date: Date): string {
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
}
