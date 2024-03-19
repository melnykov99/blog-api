type Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: AgeRange | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: AvailableResolutions[],
};
enum AvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160",
}
type AgeRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

type VideoFieldsForErrorMessages = 'title' | 'author' | 'availableResolutions' | 'canBeDownloaded' | 'minAgeRestriction' | 'publicationDate';

export {Video, AvailableResolutions, VideoFieldsForErrorMessages, AgeRange};