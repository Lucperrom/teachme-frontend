export interface StudentDto {
    id: string;
    userId: string;
    contactInformation: ContactInformationDto;
    profileInformation: ProfileInformationDto;
    enrolledCourses: string[];
    completedCourses: string[];
    forumPosts: string[];
}

interface ContactInformationDto {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    country: string;
}

interface ProfileInformationDto {
    plan: SubscriptionPlan;
    language: string;
    bio: string;
    profilePictureUrl: string;
}

export enum SubscriptionPlan {
    BASIC = 'BASIC',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
}
