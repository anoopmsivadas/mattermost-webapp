// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export enum Mana {
    large = 8,
    medium = 4,
    small = 2,
    mini = 1,
}

export type WorkItem = {
    title: string;
    description: string;
    mana: Mana;
}

export type WorkDate = {
    day: number;
    month: number;
    year: number;
}

export type WorkDay = {
    date: WorkDate;
    queue: WorkItem[];
    allowedMana: number;
}
