export interface UpdateStudentDto {
    phoneNumber: string;
    name: string;
    surname: string;
    email?: string;
    country: string;
    bio: string;
    language: string;
}