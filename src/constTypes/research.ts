export type Topic = {
    topicId: number,
    topicName: string,
    teamId: number,
    teamName: string,
    topicStartTime: string,
    topicEndTime: string,
    topicDes: string,
    topicStatus: number,
    statusName: string,
}

/* /herb-research-service/teams/user */
export interface Team {
    teamId: number,
    teamName: string,
    teamTime: string,
    teamDes: string,
    teamIsvalid: boolean,
}

/**
/herb-research-service/files/topic/{topicId}/all
 */
export interface Document {
    documentId: number,
    topicId: number,
    topicName: string,
    userId: number,
    documentName: string,
    documentDes: string,
    documentType: string,
    documentUrl: string,
    documentTime: string,
}

/**
/herb-research-service/teams/{teamId}/member/all
 */

export interface TeamMember {
    teamMemberId: number,
    teamId: number,
    userId: number,
    teamMemberName: string,
    teamMemberDes: string,
    teamMemberIsCaptain: boolean
}

export interface ContentBlock {
    contentBlockId: number,
    contentId: number,
    contentBlockType: number,
    contentBlockOrder: number,
    contentBlockDes: string,
    contentBlockUrl: string | null,
    contentBlockIsValid: boolean,
}

/**
/herb-research-service/contents/team/{teamId}
 */
export interface Contents {
    contentId: number,
    contentName: string,
    contentDes: string,
    contentTime: string,
    topicId: number,
    topicName: string,
    contentTypeId: number,
    contentTypeName: string,
    contentIsValid: boolean,
    contentBlocks: ContentBlock[],
    userId: number,
}

export const TopicStatus = ["立项中", "进行中", "已结题"]

export const TopicStatusColor = ["green", "blue", "red"]