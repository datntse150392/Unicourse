export interface Tracks {
    _id: string;
    position: number;
    chapterTitle: string
    track_steps: Track_Step[];
}

export interface Track_Step {
    title: string;
    position: number;
    duration: number;
    content_url: string;
    type: string;
}