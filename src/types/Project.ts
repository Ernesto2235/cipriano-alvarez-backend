export interface Project {
    id: number;
    projectName: string;
    projectDescription: string;
    projectImage: string;
    projectUrl: string| null;
}
export let projects: Project[] = []