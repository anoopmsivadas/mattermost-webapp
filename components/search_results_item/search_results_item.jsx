// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Posts} from 'mattermost-redux/constants/index';
import * as ReduxPostUtils from 'mattermost-redux/utils/post_utils';

import PostMessageContainer from 'components/post_view/post_message_view';
import FileAttachmentListContainer from 'components/file_attachment_list';
import CommentIcon from 'components/common/comment_icon';
import DotMenu from 'components/dot_menu';
import OverlayTrigger from 'components/overlay_trigger';
import Tooltip from 'components/tooltip';
import PostProfilePicture from 'components/post_profile_picture';
import UserProfile from 'components/user_profile';
import DateSeparator from 'components/post_view/date_separator';
import PostAriaLabelDiv from 'components/post_view/post_aria_label_div';
import PostBodyAdditionalContent from 'components/post_view/post_body_additional_content';
import PostFlagIcon from 'components/post_view/post_flag_icon';
import ArchiveIcon from 'components/widgets/icons/archive_icon';
import PostTime from 'components/post_view/post_time';
import {browserHistory} from 'utils/browser_history';
import BotBadge from 'components/widgets/badges/bot_badge';
import InfoSmallIcon from 'components/widgets/icons/info_small_icon';
import PostPreHeader from 'components/post_view/post_pre_header';
import ThreadFooter from 'components/threading/channel_threads/thread_footer';
import EditPost from 'components/edit_post';
import AutoHeightSwitcher from 'components/common/auto_height_switcher';

import Constants, {Locations} from 'utils/constants';
import * as PostUtils from 'utils/post_utils';
import * as Utils from 'utils/utils.jsx';

export default class SearchResultsItem extends React.PureComponent {
    static propTypes = {

        /**
        *  Data used for rendering post
        */
        post: PropTypes.object,

        /**
        * An array of strings in this post that were matched by the search
        */
        matches: PropTypes.array,

        channelName: PropTypes.string,
        channelType: PropTypes.string,
        channelIsArchived: PropTypes.bool,

        /**
        *  Flag for determining result display setting
        */
        compactDisplay: PropTypes.bool,

        /**
        *  Flag for highlighting mentions
        */
        isMentionSearch: PropTypes.bool,

        /**
        *  Flag for highlighting search term
        */
        term: PropTypes.string,

        /**
        *  Flag for determining result flag state
        */
        isFlagged: PropTypes.bool.isRequired,

        /**
         * Whether post username overrides are to be respected.
         */
        enablePostUsernameOverride: PropTypes.bool.isRequired,

        /**
         * Is the search results item from a bot.
         */
        isBot: PropTypes.bool.isRequired,

        a11yIndex: PropTypes.number,

        isMobileView: PropTypes.bool.isRequired,

        /**
        *  Function used for closing LHS
        */
        actions: PropTypes.shape({
            closeRightHandSide: PropTypes.func.isRequired,
            selectPost: PropTypes.func.isRequired,
            selectPostCard: PropTypes.func.isRequired,
            setRhsExpanded: PropTypes.func.isRequired,
        }).isRequired,

        displayName: PropTypes.string.isRequired,

        /**
         * The number of replies in the same thread as this post
         */
        replyCount: PropTypes.number,

        /**
         * Is the search results item from the flagged posts list.
         */
        isFlaggedPosts: PropTypes.bool,

        /**
         * Is the search results item from the pinned posts list.
         */
        isPinnedPosts: PropTypes.bool,

        /**
         * is the current post being edited in RHS?
         */
        isPostBeingEditedInRHS: PropTypes.bool,

        teamDisplayName: PropTypes.string,
        teamName: PropTypes.string,

        /**
         * Is this a post that we can directly reply to?
         */
        canReply: PropTypes.bool,

        isCollapsedThreadsEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isBot: false,
        channelIsArchived: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpened: false,
            fileDropdownOpened: false,
            showPreview: false,
        };
    }

    handleFocusRHSClick = (e) => {
        e.preventDefault();
        this.props.actions.selectPost(this.props.post);
    };

    handleJumpClick = (e) => {
        e.preventDefault();
        if (this.props.isMobileView) {
            this.props.actions.closeRightHandSide();
        }

        this.props.actions.setRhsExpanded(false);
        browserHistory.push(`/${this.props.teamName}/pl/${this.props.post.id}`);
    };

    handleCardClick = (post) => {
        if (!post) {
            return;
        }

        this.props.actions.selectPostCard(post);
    }

    handleDropdownOpened = (isOpened) => {
        this.setState({
            dropdownOpened: isOpened,
        });
    };

    handleFileDropdownOpened = (isOpened) => {
        this.setState({
            fileDropdownOpened: isOpened,
        });
    };

    renderPostTime = () => {
        const post = this.props.post;

        const isPermalink = !(Posts.POST_DELETED === post.state ||
            ReduxPostUtils.isPostPendingOrFailed(post));

        return (
            <PostTime
                isPermalink={isPermalink}
                eventTime={post.create_at}
                postId={post.id}
                location={Locations.SEARCH}
                teamName={this.props.teamName}
            />
        );
    };

    getClassName = () => {
        const {compactDisplay, isPostBeingEditedInRHS} = this.props;

        let className = 'post post--thread';

        if (compactDisplay) {
            className += ' post--compact';
        }

        if ((this.state.dropdownOpened || this.state.fileDropdownOpened) && !isPostBeingEditedInRHS) {
            className += ' post--hovered';
        }

        if (isPostBeingEditedInRHS) {
            className += ' post--editing';
        }

        return className;
    };

    getChannelName = () => {
        const {post, channelType, isCollapsedThreadsEnabled} = this.props;
        let {channelName} = this.props;

        const isDirectMessage = channelType === Constants.DM_CHANNEL;
        const isPartOfThread = isCollapsedThreadsEnabled && (post.reply_count > 0 || post.is_following);

        if (isDirectMessage && isPartOfThread) {
            channelName = (
                <FormattedMessage
                    id='search_item.thread_direct'
                    defaultMessage='Thread in Direct Message with {username}'
                    values={{
                        username: this.props.displayName,
                    }}
                />
            );
        } else if (isPartOfThread) {
            channelName = (
                <FormattedMessage
                    id='search_item.thread'
                    defaultMessage='Thread in {channel}'
                    values={{
                        channel: channelName,
                    }}
                />
            );
        } else if (isDirectMessage) {
            channelName = (
                <FormattedMessage
                    id='search_item.direct'
                    defaultMessage='Direct Message (with {username})'
                    values={{
                        username: this.props.displayName,
                    }}
                />
            );
        }

        return channelName;
    }

    render() {
        const {post, channelIsArchived, teamDisplayName, canReply, isPostBeingEditedInRHS} = this.props;
        const channelName = this.getChannelName();

        let overrideUsername;
        let disableProfilePopover = false;
        if (post.props &&
            post.props.from_webhook &&
            post.props.override_username &&
            this.props.enablePostUsernameOverride) {
            overrideUsername = post.props.override_username;
            disableProfilePopover = true;
        }

        const profilePic = (
            <PostProfilePicture
                compactDisplay={this.props.compactDisplay}
                post={post}
                userId={post.user_id}
            />
        );

        const profilePicContainer = (<div className='post__img'>{profilePic}</div>);

        let postClass = '';
        if (PostUtils.isEdited(this.props.post)) {
            postClass += ' post--edited';
        }

        let fileAttachment = null;
        if (post.file_ids && post.file_ids.length > 0) {
            fileAttachment = (
                <FileAttachmentListContainer
                    post={post}
                    compactDisplay={this.props.compactDisplay}
                    handleFileDropdownOpened={this.handleFileDropdownOpened}
                />
            );
        }

        const hasCRTFooter = this.props.isCollapsedThreadsEnabled && !post.root_id && (post.reply_count > 0 || post.is_following);

        let message;
        let flagContent;
        let postInfoIcon;
        let rhsControls;
        if (post.state === Constants.POST_DELETED || post.state === Posts.POST_DELETED) {
            message = (
                <p>
                    <FormattedMessage
                        id='post_body.deleted'
                        defaultMessage='(message deleted)'
                    />
                </p>
            );
        } else {
            if (!this.props.isMobileView) {
                flagContent = (
                    <PostFlagIcon
                        location={Locations.SEARCH}
                        postId={post.id}
                        isFlagged={this.props.isFlagged}
                    />
                );
            }

            if (post.props && post.props.card) {
                postInfoIcon = (
                    <OverlayTrigger
                        delayShow={Constants.OVERLAY_TIME_DELAY}
                        placement='top'
                        overlay={
                            <Tooltip>
                                <FormattedMessage
                                    id='post_info.info.view_additional_info'
                                    defaultMessage='View additional info'
                                />
                            </Tooltip>
                        }
                    >
                        <button
                            className='card-icon__container icon--show style--none'
                            onClick={(e) => {
                                e.preventDefault();
                                this.handleCardClick(this.props.post);
                            }}
                        >
                            <InfoSmallIcon
                                className='icon icon__info'
                                aria-hidden='true'
                            />
                        </button>
                    </OverlayTrigger>
                );
            }

            rhsControls = (
                <div className='col__controls post-menu'>
                    <DotMenu
                        post={post}
                        location={Locations.SEARCH}
                        isFlagged={this.props.isFlagged}
                        handleDropdownOpened={this.handleDropdownOpened}
                        isMenuOpen={this.state.dropdownOpened}
                        isReadOnly={channelIsArchived || null}
                    />
                    {flagContent}
                    {canReply && !hasCRTFooter &&
                        <CommentIcon
                            location={Locations.SEARCH}
                            handleCommentClick={this.handleFocusRHSClick}
                            commentCount={this.props.replyCount}
                            postId={post.id}
                            searchStyle={'search-item__comment'}
                            extraClass={this.props.replyCount ? 'icon--visible' : ''}
                        />
                    }
                    <a
                        href='#'
                        onClick={this.handleJumpClick}
                        className='search-item__jump'
                    >
                        <FormattedMessage
                            id='search_item.jump'
                            defaultMessage='Jump'
                        />
                    </a>
                </div>
            );

            message = (
                <PostBodyAdditionalContent
                    post={post}
                    options={{
                        searchTerm: this.props.term,
                        searchMatches: this.props.matches,
                    }}
                >
                    <PostMessageContainer
                        post={post}
                        options={{
                            searchTerm: this.props.term,
                            searchMatches: this.props.matches,
                            mentionHighlight: this.props.isMentionSearch,
                        }}
                        isRHS={true}
                    />
                </PostBodyAdditionalContent>
            );
        }

        const currentPostDay = Utils.getDateForUnixTicks(post.create_at);

        return (
            <div
                data-testid='search-item-container'
                className='search-item__container'
            >
                <DateSeparator date={currentPostDay}/>
                <PostAriaLabelDiv
                    className={`a11y__section ${this.getClassName()}`}
                    id={'searchResult_' + post.id}
                    post={post}
                    data-a11y-sort-order={this.props.a11yIndex}
                >
                    <div
                        className='search-channel__name__container'
                        aria-hidden='true'
                    >
                        <span className='search-channel__name'>
                            {channelName}
                        </span>
                        {channelIsArchived &&
                            <span className='search-channel__archived'>
                                <ArchiveIcon className='icon icon__archive channel-header-archived-icon svg-text-color'/>
                                <FormattedMessage
                                    id='search_item.channelArchived'
                                    defaultMessage='Archived'
                                />
                            </span>
                        }
                        {Boolean(teamDisplayName) &&
                            <span className='search-team__name'>
                                {teamDisplayName}
                            </span>
                        }
                    </div>
                    <PostPreHeader
                        isFlagged={this.props.isFlagged}
                        isPinned={post.is_pinned}
                        skipPinned={this.props.isPinnedPosts}
                        skipFlagged={this.props.isFlaggedPosts}
                        channelId={post.channel_id}
                    />
                    <div
                        role='application'
                        className='post__content'
                    >
                        {profilePicContainer}
                        <div>
                            <div className='post__header'>
                                <div className='col col__name'>
                                    <UserProfile
                                        userId={post.user_id}
                                        overwriteName={overrideUsername}
                                        disablePopover={disableProfilePopover}
                                        isRHS={true}
                                    />
                                    <BotBadge show={Boolean(post.props && post.props.from_webhook && !this.props.isBot)}/>
                                </div>
                                <div className='col'>
                                    {this.renderPostTime()}
                                    {postInfoIcon}
                                </div>
                                {!isPostBeingEditedInRHS && rhsControls}
                            </div>
                            <div className='search-item-snippet post__body'>
                                <div className={postClass}>
                                    <AutoHeightSwitcher
                                        showSlot={isPostBeingEditedInRHS ? 2 : 1}
                                        shouldScrollIntoView={isPostBeingEditedInRHS}
                                        slot1={message}
                                        slot2={<EditPost/>}
                                    />
                                </div>
                                {fileAttachment}
                            </div>
                            {hasCRTFooter ? (
                                <ThreadFooter
                                    threadId={post.id}
                                    replyClick={this.handleFocusRHSClick}
                                />
                            ) : null}
                        </div>
                    </div>
                </PostAriaLabelDiv>
            </div>
        );
    }
}
