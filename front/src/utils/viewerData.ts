import axios from "axios";

class DataViewerPreparer {
    private isDirty = false;

    constructor(
        private currentSerieName: string, 
        private currentSerieIndex: number,
    ) {}
}
