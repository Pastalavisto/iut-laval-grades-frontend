export default interface User {
    token: string;
    professor: {
        id: number,
        email: string,
        firstName: string,
        department: string
    }
}